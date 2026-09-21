package com.iphoneduowallpaper.admin.data

import android.content.Context
import kotlinx.serialization.SerializationStrategy
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonArray

private const val BASE = "/api/admin/v1"

/** Every admin panel operation, one method each. */
class AdminRepository(context: Context) {

    val store = SessionStore(context.applicationContext)
    private val api = ApiClient(store)

    val isSignedIn: Boolean get() = store.tokens != null && store.admin != null

    /** Public URL of an object in Cloudflare R2, for thumbnails and previews. */
    fun imageUrl(key: String?): String? {
        if (key.isNullOrBlank()) return null
        if (key.startsWith("http://") || key.startsWith("https://")) return key
        val base = store.config.imageBaseUrl.trimEnd('/')
        return if (base.isEmpty()) null else "$base/${key.trimStart('/')}"
    }

    fun siteUrl(path: String): String = store.config.siteUrl.trimEnd('/') + path

    // ------------------------------------------------------------- session

    suspend fun signIn(baseUrl: String, email: String, password: String): ApiResult<LoginData> {
        store.baseUrl = baseUrl
        val body = json { put("email", email); put("password", password) }
        val result = parse<LoginData>(api.send("POST", "$BASE/auth/login", body, authenticated = false))
        if (result is ApiResult.Ok) {
            store.tokens = result.data.session
            store.admin = result.data.admin
            store.config = result.data.config
        }
        return result
    }

    suspend fun requestPasswordReset(baseUrl: String, email: String): ApiResult<Unit> {
        store.baseUrl = baseUrl
        val body = json { put("email", email) }
        return parseUnit(api.send("POST", "$BASE/auth/forgot", body, authenticated = false))
    }

    suspend fun signOut() {
        val refreshToken = store.tokens?.refreshToken
        if (refreshToken != null) {
            api.send("POST", "$BASE/auth/logout", json { put("refreshToken", refreshToken) })
        }
        store.clear()
    }

    suspend fun me(): ApiResult<MeData> {
        val result = parse<MeData>(api.send("GET", "$BASE/me"))
        if (result is ApiResult.Ok) {
            store.admin = result.data.admin
            store.config = result.data.config
        }
        return result
    }

    suspend fun updateDisplayName(name: String): ApiResult<Unit> =
        parseUnit(api.send("PATCH", "$BASE/me", json { put("displayName", name) }))

    suspend fun changePassword(password: String, confirm: String): ApiResult<Unit> {
        val refreshToken = store.tokens?.refreshToken
            ?: return ApiResult.Err("Your session has expired. Please sign in again.", signedOut = true)
        val body = json {
            put("password", password)
            put("confirm", confirm)
            put("refreshToken", refreshToken)
        }
        return when (val result = parse<SessionData>(api.send("POST", "$BASE/me/password", body))) {
            // Supabase issues a fresh token pair with the change; keep using it.
            is ApiResult.Ok -> {
                result.data.session?.let { store.tokens = it }
                ApiResult.Ok(Unit, result.message)
            }
            is ApiResult.Err -> result
        }
    }

    // ------------------------------------------------------------- overview

    suspend fun dashboard(): ApiResult<DashboardData> = parse(api.send("GET", "$BASE/dashboard"))

    suspend fun bootstrap(): ApiResult<BootstrapData> = parse(api.send("GET", "$BASE/bootstrap"))

    // ----------------------------------------------------------- wallpapers

    suspend fun wallpapers(
        query: String = "",
        status: String = "all",
        categoryId: String? = null,
        featuredOnly: Boolean = false,
        sort: String = "newest",
        page: Int = 1,
    ): ApiResult<Page<WallpaperListItem>> {
        val params = buildList {
            if (query.isNotBlank()) add("q=" + urlEncode(query))
            add("status=$status")
            categoryId?.let { add("categoryId=$it") }
            if (featuredOnly) add("featured=1")
            add("sort=$sort")
            add("page=$page")
            add("perPage=24")
        }.joinToString("&")
        return parse(api.send("GET", "$BASE/wallpapers?$params"))
    }

    suspend fun wallpaper(id: String): ApiResult<WallpaperDetail> =
        parse(api.send("GET", "$BASE/wallpapers/$id"))

    suspend fun createWallpaper(form: WallpaperForm, image: ImagePayload): ApiResult<SavedRef> =
        parse(api.send("POST", "$BASE/wallpapers", encode(JsonObject.serializer(), createWallpaperBody(form, image))))

    suspend fun updateWallpaper(id: String, form: WallpaperForm): ApiResult<SavedRef> =
        parse(api.send("PATCH", "$BASE/wallpapers/$id", encode(WallpaperForm.serializer(), form)))

    suspend fun replaceWallpaperImage(id: String, image: ImagePayload): ApiResult<Unit> =
        parseUnit(api.send("POST", "$BASE/wallpapers/$id/image", encode(ImagePayload.serializer(), image)))

    suspend fun deleteWallpapers(ids: List<String>): ApiResult<CountResult> =
        parse(api.send("POST", "$BASE/wallpapers/bulk", json {
            put("action", "delete")
            putJsonArray("ids") { ids.forEach { add(JsonPrimitive(it)) } }
        }))

    suspend fun bulkUpdateWallpapers(
        ids: List<String>,
        status: String? = null,
        featured: Boolean? = null,
    ): ApiResult<CountResult> = parse(api.send("POST", "$BASE/wallpapers/bulk", json {
        put("action", "update")
        putJsonArray("ids") { ids.forEach { add(JsonPrimitive(it)) } }
        put("patch", buildJsonObject {
            status?.let { put("status", it) }
            featured?.let { put("isFeatured", it) }
        })
    }))

    // -------------------------------------------------------------- uploads

    suspend fun wallpaperTicket(contentType: String, size: Long): ApiResult<UploadTicket> =
        parse(api.send("POST", "$BASE/uploads", json {
            put("kind", "wallpaper")
            put("contentType", contentType)
            put("size", size)
            put("previewType", "image/webp")
            put("thumbType", "image/webp")
        }))

    suspend fun coverTicket(): ApiResult<PresignedUpload> =
        parse(api.send("POST", "$BASE/uploads", json {
            put("kind", "cover")
            put("contentType", "image/webp")
        }))

    suspend fun upload(target: PresignedUpload, bytes: ByteArray, onProgress: (Float) -> Unit = {}): String? =
        api.putObject(target, bytes, onProgress)

    suspend fun uploadStream(
        target: PresignedUpload,
        length: Long,
        onProgress: (Float) -> Unit = {},
        openStream: () -> java.io.InputStream?,
    ): String? = api.putStream(target, length, onProgress, openStream)

    // ------------------------------------------------------------- taxonomy

    suspend fun taxonomy(kind: String): ApiResult<TaxonomyList> =
        parse(api.send("GET", "$BASE/taxonomy/$kind"))

    suspend fun saveTaxonomy(kind: String, form: TaxonomyForm): ApiResult<SavedRef> =
        parse(api.send("POST", "$BASE/taxonomy/$kind", encode(TaxonomyForm.serializer(), form)))

    suspend fun deleteTaxonomy(kind: String, ids: List<String>): ApiResult<CountResult> =
        parse(api.send("POST", "$BASE/taxonomy/$kind/delete", json {
            putJsonArray("ids") { ids.forEach { add(JsonPrimitive(it)) } }
        }))

    // ----------------------------------------------------------------- blog

    suspend fun posts(): ApiResult<PostList> = parse(api.send("GET", "$BASE/posts"))

    suspend fun post(id: String): ApiResult<PostDetail> = parse(api.send("GET", "$BASE/posts/$id"))

    suspend fun savePost(form: PostForm): ApiResult<SavedRef> =
        parse(api.send("POST", "$BASE/posts", encode(PostForm.serializer(), form)))

    suspend fun deletePosts(ids: List<String>): ApiResult<CountResult> =
        parse(api.send("POST", "$BASE/posts/delete", json {
            putJsonArray("ids") { ids.forEach { add(JsonPrimitive(it)) } }
        }))

    // ---------------------------------------------------------------- inbox

    suspend fun messages(status: String = "inbox", page: Int = 1): ApiResult<MessagePage> =
        parse(api.send("GET", "$BASE/inbox?type=messages&status=$status&page=$page"))

    suspend fun reports(status: String = "open", page: Int = 1): ApiResult<ReportPage> =
        parse(api.send("GET", "$BASE/inbox?type=reports&status=$status&page=$page"))

    suspend fun setMessageStatus(id: String, status: String): ApiResult<Unit> =
        parseUnit(api.send("POST", "$BASE/inbox/messages", json {
            put("action", "status"); put("id", id); put("status", status)
        }))

    suspend fun deleteMessages(ids: List<String>): ApiResult<Unit> =
        parseUnit(api.send("POST", "$BASE/inbox/messages", json {
            put("action", "delete")
            putJsonArray("ids") { ids.forEach { add(JsonPrimitive(it)) } }
        }))

    suspend fun setReportStatus(
        id: String,
        status: String,
        unpublishWallpaperId: String? = null,
    ): ApiResult<Unit> = parseUnit(api.send("POST", "$BASE/inbox/reports", json {
        put("action", "status")
        put("id", id)
        put("status", status)
        unpublishWallpaperId?.let { put("unpublishWallpaperId", it) }
    }))

    suspend fun deleteReports(ids: List<String>): ApiResult<Unit> =
        parseUnit(api.send("POST", "$BASE/inbox/reports", json {
            put("action", "delete")
            putJsonArray("ids") { ids.forEach { add(JsonPrimitive(it)) } }
        }))

    // ------------------------------------------------------------- settings

    suspend fun settings(): ApiResult<SettingsData> = parse(api.send("GET", "$BASE/settings"))

    suspend fun saveGeneralSettings(form: GeneralSettingsForm): ApiResult<Unit> =
        parseUnit(api.send("PUT", "$BASE/settings", json {
            put("section", "general")
            put("payload", adminJson.encodeToJsonElement(GeneralSettingsForm.serializer(), form))
        }))

    suspend fun saveAdsSettings(form: AdsSettingsForm): ApiResult<Unit> =
        parseUnit(api.send("PUT", "$BASE/settings", json {
            put("section", "ads")
            put("payload", adminJson.encodeToJsonElement(AdsSettingsForm.serializer(), form))
        }))

    // --------------------------------------------------------------- helpers

    private fun json(build: kotlinx.serialization.json.JsonObjectBuilder.() -> Unit): String =
        adminJson.encodeToString(JsonObject.serializer(), buildJsonObject(build))

    private fun <T> encode(serializer: SerializationStrategy<T>, value: T): String =
        adminJson.encodeToString(serializer, value)

    private fun urlEncode(value: String): String = java.net.URLEncoder.encode(value, "UTF-8")
}
