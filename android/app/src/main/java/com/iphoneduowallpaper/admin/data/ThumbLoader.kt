package com.iphoneduowallpaper.admin.data

import android.content.Context
import android.graphics.Bitmap
import android.graphics.ImageDecoder
import android.util.LruCache
import java.io.File
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext

/** Loads R2 thumbnails and previews, with a memory cache over a small disk cache. */
object ThumbLoader {

    private val memory = object : LruCache<String, Bitmap>(
        (Runtime.getRuntime().maxMemory() / 8).coerceAtMost(48L * 1024 * 1024).toInt(),
    ) {
        override fun sizeOf(key: String, value: Bitmap) = value.byteCount
    }

    private val locks = HashMap<String, Mutex>()
    private val locksGuard = Mutex()

    suspend fun load(context: Context, url: String, targetWidth: Int): Bitmap? {
        val key = "$url@$targetWidth"
        memory.get(key)?.let { return it }

        val lock = locksGuard.withLock { locks.getOrPut(key) { Mutex() } }
        return lock.withLock {
            memory.get(key) ?: withContext(Dispatchers.IO) {
                val file = cacheFile(context, url)
                if (!file.exists() && !download(url, file)) return@withContext null
                val bitmap = decode(file, targetWidth) ?: run {
                    file.delete()
                    return@withContext null
                }
                memory.put(key, bitmap)
                bitmap
            }
        }
    }

    fun clear(context: Context) {
        memory.evictAll()
        runCatching { cacheDir(context).deleteRecursively() }
    }

    private fun download(url: String, target: File): Boolean {
        var connection: HttpURLConnection? = null
        return try {
            connection = (URL(url).openConnection() as HttpURLConnection).apply {
                connectTimeout = 15_000
                readTimeout = 30_000
            }
            if (connection.responseCode !in 200..299) return false
            target.parentFile?.mkdirs()
            val partial = File(target.absolutePath + ".part")
            connection.inputStream.use { input -> partial.outputStream().use { input.copyTo(it) } }
            partial.renameTo(target)
        } catch (_: IOException) {
            false
        } finally {
            connection?.disconnect()
        }
    }

    private fun decode(file: File, targetWidth: Int): Bitmap? = runCatching {
        ImageDecoder.decodeBitmap(ImageDecoder.createSource(file)) { decoder, info, _ ->
            decoder.allocator = ImageDecoder.ALLOCATOR_SOFTWARE
            var sample = 1
            while (targetWidth > 0 && info.size.width / (sample * 2) >= targetWidth) sample *= 2
            decoder.setTargetSampleSize(sample)
        }
    }.getOrNull()

    private fun cacheDir(context: Context) = File(context.cacheDir, "remote-images")

    private fun cacheFile(context: Context, url: String): File {
        val digest = MessageDigest.getInstance("SHA-256").digest(url.toByteArray())
        val name = digest.joinToString("") { "%02x".format(it) }.take(40)
        return File(cacheDir(context), name)
    }
}
