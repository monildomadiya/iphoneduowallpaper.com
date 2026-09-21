package com.iphoneduowallpaper.admin.data

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement

/**
 * Every admin endpoint answers with this envelope.
 *
 * Responses mirror the database rows (snake_case); request bodies mirror the
 * Server Action schemas (camelCase).
 */
@Serializable
data class Envelope<T>(
    val ok: Boolean = false,
    val data: T? = null,
    val error: String? = null,
    val message: String? = null,
)

@Serializable
data class Tokens(
    val accessToken: String,
    val refreshToken: String,
    val expiresAt: Long = 0,
)

@Serializable
data class AdminUser(
    val id: String,
    val email: String,
    val displayName: String? = null,
    val role: String,
)

@Serializable
data class ServerConfig(
    val imageBaseUrl: String = "",
    val siteUrl: String = "",
)

@Serializable
data class LoginData(
    val session: Tokens,
    val admin: AdminUser,
    val config: ServerConfig = ServerConfig(),
)

@Serializable
data class SessionData(val session: Tokens? = null)

@Serializable
data class InboxCounts(val messages: Int = 0, val reports: Int = 0)

@Serializable
data class TeamMember(
    val id: String,
    val email: String,
    val displayName: String? = null,
    val role: String,
    val createdAt: String? = null,
)

@Serializable
data class MeData(
    val admin: AdminUser,
    val inbox: InboxCounts = InboxCounts(),
    val team: List<TeamMember> = emptyList(),
    val config: ServerConfig = ServerConfig(),
)

// ---------------------------------------------------------------- dashboard

@Serializable
data class SeriesPoint(val day: String, val downloads: Int = 0, val views: Int = 0)

@Serializable
data class DashboardStats(
    val wallpapers_total: Int = 0,
    val wallpapers_published: Int = 0,
    val wallpapers_draft: Int = 0,
    val downloads_total: Long = 0,
    val views_total: Long = 0,
    val categories_total: Int = 0,
    val collections_total: Int = 0,
    val posts_published: Int = 0,
    val messages_new: Int = 0,
    val reports_open: Int = 0,
    val series: List<SeriesPoint> = emptyList(),
)

@Serializable
data class TopWallpaper(
    val id: String,
    val title: String,
    val slug: String,
    val thumb_key: String,
    val downloads: Long = 0,
    val views: Long = 0,
    val dominant_color: String = "#1d1d1f",
)

@Serializable
data class RecentWallpaper(
    val id: String,
    val title: String,
    val slug: String,
    val thumb_key: String,
    val status: String,
    val created_at: String,
    val dominant_color: String = "#1d1d1f",
)

@Serializable
data class ChecklistItem(val label: String, val done: Boolean, val href: String? = null)

@Serializable
data class DashboardData(
    val stats: DashboardStats = DashboardStats(),
    val top: List<TopWallpaper> = emptyList(),
    val recent: List<RecentWallpaper> = emptyList(),
    val checklist: List<ChecklistItem> = emptyList(),
)

// ---------------------------------------------------------------- pickers

@Serializable
data class PickerOption(val id: String, val name: String, val is_active: Boolean = true)

@Serializable
data class DeviceOption(
    val id: String,
    val name: String,
    val family: String = "",
    val screen_label: String? = null,
    val width: Int = 0,
    val height: Int = 0,
    val is_active: Boolean = true,
)

@Serializable
data class BootstrapData(
    val categories: List<PickerOption> = emptyList(),
    val collections: List<PickerOption> = emptyList(),
    val devices: List<DeviceOption> = emptyList(),
)

// ---------------------------------------------------------------- wallpapers

@Serializable
data class NamedRef(val id: String? = null, val name: String = "", val slug: String? = null)

@Serializable
data class WallpaperListItem(
    val id: String,
    val title: String,
    val slug: String,
    val thumb_key: String,
    val width: Int = 0,
    val height: Int = 0,
    val status: String = "draft",
    val is_featured: Boolean = false,
    val downloads: Long = 0,
    val views: Long = 0,
    val created_at: String = "",
    val published_at: String? = null,
    val dominant_color: String = "#1d1d1f",
    val category: NamedRef? = null,
)

@Serializable
data class Page<T>(
    val items: List<T> = emptyList(),
    val total: Int = 0,
    val page: Int = 1,
    val perPage: Int = 24,
    val totalPages: Int = 1,
)

@Serializable
data class DeviceSummary(
    val id: String,
    val name: String,
    val slug: String = "",
    val family: String = "",
    val screen_label: String? = null,
    val width: Int = 0,
    val height: Int = 0,
)

@Serializable
data class WallpaperDetail(
    val id: String,
    val title: String,
    val slug: String,
    val thumb_key: String = "",
    val preview_key: String = "",
    val original_key: String = "",
    val width: Int = 0,
    val height: Int = 0,
    val dominant_color: String = "#1d1d1f",
    val downloads: Long = 0,
    val views: Long = 0,
    val is_featured: Boolean = false,
    val published_at: String? = null,
    val description: String? = null,
    val tags: List<String> = emptyList(),
    val file_size: Long = 0,
    val mime_type: String = "",
    val source_type: String = "original",
    val credit_name: String? = null,
    val credit_url: String? = null,
    val seo_title: String? = null,
    val seo_description: String? = null,
    val category_id: String? = null,
    val created_at: String = "",
    val updated_at: String = "",
    val status: String = "draft",
    val devices: List<DeviceSummary> = emptyList(),
    val collections: List<NamedRef> = emptyList(),
)

@Serializable
data class SavedRef(val id: String = "", val slug: String = "")

@Serializable
data class CountResult(val count: Int = 0)

// ---------------------------------------------------------------- uploads

@Serializable
data class PresignedUpload(
    val key: String,
    val url: String,
    val headers: Map<String, String> = emptyMap(),
)

@Serializable
data class UploadTicket(
    val id: String,
    val original: PresignedUpload,
    val preview: PresignedUpload,
    val thumb: PresignedUpload,
)

// ---------------------------------------------------------------- taxonomy

/** One permissive row for categories, collections and devices. */
@Serializable
data class TaxonomyRow(
    val id: String,
    val name: String,
    val slug: String = "",
    val description: String? = null,
    val cover_key: String? = null,
    val seo_title: String? = null,
    val seo_description: String? = null,
    val sort_order: Int = 0,
    val is_active: Boolean = true,
    val is_featured: Boolean = false,
    val family: String? = null,
    val screen_label: String? = null,
    val width: Int? = null,
    val height: Int? = null,
    val diagonal_in: Double? = null,
    val ppi: Int? = null,
    val wallpaper_count: Int = 0,
)

@Serializable
data class TaxonomyList(val items: List<TaxonomyRow> = emptyList())

// ---------------------------------------------------------------- blog

@Serializable
data class PostListItem(
    val id: String,
    val title: String,
    val slug: String,
    val status: String = "draft",
    val published_at: String? = null,
    val updated_at: String = "",
    val author_name: String = "",
    val tags: List<String> = emptyList(),
    val cover_key: String? = null,
)

@Serializable
data class PostList(val items: List<PostListItem> = emptyList())

@Serializable
data class PostDetail(
    val id: String,
    val title: String,
    val slug: String,
    val excerpt: String? = null,
    val content: String = "",
    val cover_key: String? = null,
    val tags: List<String> = emptyList(),
    val author_name: String = "Editorial Team",
    val status: String = "draft",
    val seo_title: String? = null,
    val seo_description: String? = null,
    val published_at: String? = null,
    val updated_at: String = "",
    val created_at: String = "",
)

// ---------------------------------------------------------------- inbox

@Serializable
data class ContactMessage(
    val id: String,
    val name: String = "",
    val email: String = "",
    val subject: String? = null,
    val message: String = "",
    val status: String = "new",
    val created_at: String = "",
)

@Serializable
data class ContentReport(
    val id: String,
    val kind: String = "other",
    val wallpaper_id: String? = null,
    val page_url: String? = null,
    val name: String = "",
    val email: String = "",
    val original_url: String? = null,
    val details: String = "",
    val status: String = "open",
    val created_at: String = "",
    val wallpaper: NamedRef? = null,
)

@Serializable
data class MessagePage(
    val items: List<ContactMessage> = emptyList(),
    val total: Int = 0,
    val page: Int = 1,
    val totalPages: Int = 1,
    val counts: InboxCounts = InboxCounts(),
)

@Serializable
data class ReportPage(
    val items: List<ContentReport> = emptyList(),
    val total: Int = 0,
    val page: Int = 1,
    val totalPages: Int = 1,
    val counts: InboxCounts = InboxCounts(),
)

// ---------------------------------------------------------------- settings

@Serializable
data class SiteSettings(
    val site_name: String = "",
    val tagline: String = "",
    val contact_email: String = "",
    val announcement: String? = null,
    val adsense_enabled: Boolean = false,
    val adsense_client_id: String? = null,
    val adsense_auto_ads: Boolean = false,
    val ad_slots: Map<String, String> = emptyMap(),
    val ads_txt: String? = null,
    val ga_measurement_id: String? = null,
    val cookie_banner_enabled: Boolean = true,
    val social_links: Map<String, String> = emptyMap(),
    val legal_entity: String? = null,
    val legal_jurisdiction: String = "",
    val updated_at: String? = null,
)

@Serializable
data class AdPlacement(val key: String, val label: String)

@Serializable
data class SettingsData(
    val settings: SiteSettings = SiteSettings(),
    val placements: List<AdPlacement> = emptyList(),
)

/** Mutations that only report success use this. */
@Serializable
data class Empty(val ignored: JsonElement? = null)
