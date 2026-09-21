package com.iphoneduowallpaper.admin.data

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonObject

/** An explicit `null` in a request body, which the server reads as "clear this". */
val JsonNullValue: JsonElement = JsonNull

fun jsonText(value: String): JsonElement = JsonPrimitive(value)

/**
 * Request bodies mirror the Server Action schemas (camelCase).
 *
 * `adminJson` omits nulls, so a null field means "leave this alone" wherever the
 * server distinguishes an absent key from an explicit `null`. Use [JsonNullValue]
 * when a field really has to be cleared.
 */

@Serializable
data class WallpaperForm(
    val title: String,
    val slug: String? = null,
    val description: String? = null,
    val categoryId: String? = null,
    val deviceIds: List<String> = emptyList(),
    val collectionIds: List<String> = emptyList(),
    val tags: List<String> = emptyList(),
    val status: String = "draft",
    val isFeatured: Boolean = false,
    val sourceType: String = "original",
    val creditName: String? = null,
    val creditUrl: String? = null,
    val seoTitle: String? = null,
    val seoDescription: String? = null,
)

@Serializable
data class ImagePayload(
    val uploadId: String,
    val originalKey: String,
    val previewKey: String,
    val thumbKey: String,
    val width: Int,
    val height: Int,
    val mimeType: String,
    val dominantColor: String,
)

@Serializable
data class TaxonomyForm(
    val id: String? = null,
    val name: String,
    val slug: String? = null,
    val description: String? = null,
    val seoTitle: String? = null,
    val seoDescription: String? = null,
    val sortOrder: Int = 0,
    val isActive: Boolean = true,
    val isFeatured: Boolean? = null,
    val coverKey: JsonElement? = null,
    val family: String? = null,
    val screenLabel: String? = null,
    val width: Int? = null,
    val height: Int? = null,
    val diagonalIn: Double? = null,
    val ppi: Int? = null,
)

@Serializable
data class PostForm(
    val id: String? = null,
    val title: String,
    val slug: String? = null,
    val excerpt: String? = null,
    val content: String = "",
    val coverKey: String? = null,
    val tags: List<String> = emptyList(),
    val authorName: String = "Editorial Team",
    val status: String = "draft",
    val seoTitle: String? = null,
    val seoDescription: String? = null,
)

@Serializable
data class SocialForm(
    val instagram: String = "",
    val pinterest: String = "",
    val x: String = "",
    val youtube: String = "",
    val threads: String = "",
    val facebook: String = "",
)

@Serializable
data class GeneralSettingsForm(
    val siteName: String,
    val tagline: String,
    val contactEmail: String,
    val announcement: String = "",
    val gaMeasurementId: String = "",
    val cookieBannerEnabled: Boolean = true,
    val legalEntity: String = "",
    val legalJurisdiction: String,
    val social: SocialForm = SocialForm(),
)

@Serializable
data class AdsSettingsForm(
    val enabled: Boolean = false,
    val clientId: String = "",
    val autoAds: Boolean = false,
    val slots: Map<String, String> = emptyMap(),
    val adsTxt: String = "",
)

/** Combines the wallpaper fields and the uploaded image into one create body. */
fun createWallpaperBody(form: WallpaperForm, image: ImagePayload): JsonObject {
    val fields = adminJson.encodeToJsonElement(WallpaperForm.serializer(), form) as JsonObject
    val media = adminJson.encodeToJsonElement(ImagePayload.serializer(), image) as JsonObject
    return buildJsonObject {
        for ((key, value) in fields) put(key, value)
        for ((key, value) in media) put(key, value)
    }
}
