package com.iphoneduowallpaper.admin.data

import java.io.IOException
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put

val adminJson = Json {
    ignoreUnknownKeys = true
    explicitNulls = false
    encodeDefaults = true
    coerceInputValues = true
}

/** A finished HTTP exchange. `status` is 0 when the request never reached the server. */
data class Http(val status: Int, val body: String)

sealed interface ApiResult<out T> {
    data class Ok<T>(val data: T, val message: String? = null) : ApiResult<T>
    data class Err(val message: String, val signedOut: Boolean = false) : ApiResult<Nothing>
}

fun <T> ApiResult<T>.dataOrNull(): T? = (this as? ApiResult.Ok)?.data
fun <T> ApiResult<T>.errorOrNull(): String? = (this as? ApiResult.Err)?.message

/**
 * Talks to the admin API under `/api/admin/v1` with the admin's Supabase access
 * token, refreshing it once when the server reports the token has expired.
 */
class ApiClient(private val store: SessionStore) {

    private val refreshLock = Mutex()

    suspend fun send(
        method: String,
        path: String,
        body: String? = null,
        authenticated: Boolean = true,
    ): Http {
        val first = raw(method, path, body, if (authenticated) store.tokens?.accessToken else null)
        if (first.status != 401 || !authenticated || store.tokens == null) return first
        return if (refreshSession()) raw(method, path, body, store.tokens?.accessToken) else first
    }

    /** Exchanges the refresh token for a fresh pair. One caller refreshes; the rest wait. */
    private suspend fun refreshSession(): Boolean = refreshLock.withLock {
        val current = store.tokens ?: return false
        val payload = adminJson.encodeToString(
            JsonObject.serializer(),
            buildJsonObject { put("refreshToken", current.refreshToken) },
        )
        val http = raw("POST", "/api/admin/v1/auth/refresh", payload, null)
        if (http.status != 200) {
            if (http.status == 401) store.clear()
            return false
        }
        val session = runCatching {
            adminJson.decodeFromString(Envelope.serializer(SessionData.serializer()), http.body)
        }.getOrNull()?.data?.session ?: return false

        store.tokens = session
        return true
    }

    private suspend fun raw(method: String, path: String, body: String?, token: String?): Http =
        withContext(Dispatchers.IO) {
            var connection: HttpURLConnection? = null
            try {
                val url = URL(store.baseUrl + path)
                connection = (url.openConnection() as HttpURLConnection).apply {
                    requestMethod = method
                    connectTimeout = 20_000
                    readTimeout = 60_000
                    instanceFollowRedirects = false
                    setRequestProperty("Accept", "application/json")
                    token?.let { setRequestProperty("Authorization", "Bearer $it") }
                    if (body != null) {
                        doOutput = true
                        setRequestProperty("Content-Type", "application/json")
                    }
                }
                if (body != null) {
                    val bytes = body.toByteArray()
                    connection.setFixedLengthStreamingMode(bytes.size)
                    connection.outputStream.use { it.write(bytes) }
                }
                val status = connection.responseCode
                val stream: InputStream? =
                    if (status in 200..299) connection.inputStream else connection.errorStream
                Http(status, stream?.bufferedReader()?.use { it.readText() } ?: "")
            } catch (error: IOException) {
                Http(0, error.message ?: "Network error")
            } finally {
                connection?.disconnect()
            }
        }

    /** Uploads bytes straight to Cloudflare R2 with a presigned URL. */
    suspend fun putObject(
        target: PresignedUpload,
        bytes: ByteArray,
        onProgress: (Float) -> Unit = {},
    ): String? = withContext(Dispatchers.IO) {
        var connection: HttpURLConnection? = null
        try {
            connection = (URL(target.url).openConnection() as HttpURLConnection).apply {
                requestMethod = "PUT"
                connectTimeout = 20_000
                readTimeout = 120_000
                doOutput = true
                for ((key, value) in target.headers) setRequestProperty(key, value)
                setFixedLengthStreamingMode(bytes.size)
            }
            connection.outputStream.use { output ->
                var sent = 0
                while (sent < bytes.size) {
                    val chunk = minOf(CHUNK, bytes.size - sent)
                    output.write(bytes, sent, chunk)
                    sent += chunk
                    onProgress(sent.toFloat() / bytes.size)
                }
                output.flush()
            }
            val status = connection.responseCode
            if (status in 200..299) {
                onProgress(1f)
                null
            } else {
                "Cloudflare R2 rejected the upload (HTTP $status)."
            }
        } catch (error: IOException) {
            "Upload failed: ${error.message ?: "check your connection"}."
        } finally {
            connection?.disconnect()
        }
    }

    /**
     * Streams an object to R2 without holding it in memory — used for the
     * original file, which can be tens of megabytes.
     */
    suspend fun putStream(
        target: PresignedUpload,
        length: Long,
        onProgress: (Float) -> Unit = {},
        openStream: () -> InputStream?,
    ): String? = withContext(Dispatchers.IO) {
        var connection: HttpURLConnection? = null
        try {
            val input = openStream() ?: return@withContext "Could not read the picked file."
            connection = (URL(target.url).openConnection() as HttpURLConnection).apply {
                requestMethod = "PUT"
                connectTimeout = 20_000
                readTimeout = 180_000
                doOutput = true
                for ((key, value) in target.headers) setRequestProperty(key, value)
                setFixedLengthStreamingMode(length)
            }
            input.use { source ->
                connection.outputStream.use { output ->
                    val buffer = ByteArray(CHUNK)
                    var sent = 0L
                    while (true) {
                        val read = source.read(buffer)
                        if (read <= 0) break
                        output.write(buffer, 0, read)
                        sent += read
                        if (length > 0) onProgress(sent.toFloat() / length)
                    }
                    output.flush()
                }
            }
            val status = connection.responseCode
            if (status in 200..299) {
                onProgress(1f)
                null
            } else {
                "Cloudflare R2 rejected the upload (HTTP $status)."
            }
        } catch (error: IOException) {
            "Upload failed: ${error.message ?: "check your connection"}."
        } finally {
            connection?.disconnect()
        }
    }

    private companion object {
        const val CHUNK = 64 * 1024
    }
}

/** Turns an HTTP exchange into a typed result, mapping the API's error envelope. */
inline fun <reified T> parse(http: Http): ApiResult<T> {
    if (http.status == 0) {
        return ApiResult.Err("Could not reach the server. Check your connection and the site address.")
    }
    val envelope = runCatching { adminJson.decodeFromString<Envelope<T>>(http.body) }.getOrNull()

    if (envelope == null) {
        return ApiResult.Err(
            if (http.status >= 500) "The server had a problem (HTTP ${http.status}). Please try again."
            else "Unexpected reply from the server (HTTP ${http.status}).",
            signedOut = http.status == 401,
        )
    }
    val data = envelope.data
    if (envelope.ok && data != null) return ApiResult.Ok(data, envelope.message)
    return ApiResult.Err(
        envelope.error ?: "Something went wrong. Please try again.",
        signedOut = http.status == 401,
    )
}

/** For calls whose payload we do not need — only success or the error message. */
fun parseUnit(http: Http): ApiResult<Unit> {
    if (http.status == 0) {
        return ApiResult.Err("Could not reach the server. Check your connection and the site address.")
    }
    if (http.status == 204) return ApiResult.Ok(Unit)
    val envelope = runCatching {
        adminJson.decodeFromString(Envelope.serializer(JsonObject.serializer()), http.body)
    }.getOrNull()
    if (envelope != null && envelope.ok) return ApiResult.Ok(Unit, envelope.message)
    return ApiResult.Err(
        envelope?.error ?: "Something went wrong (HTTP ${http.status}).",
        signedOut = http.status == 401,
    )
}
