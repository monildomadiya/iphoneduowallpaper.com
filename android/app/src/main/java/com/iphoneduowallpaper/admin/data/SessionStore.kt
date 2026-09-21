package com.iphoneduowallpaper.admin.data

import android.content.Context
import com.iphoneduowallpaper.admin.BuildConfig

/** Remembers which admin panel the app talks to, and the tokens it talks with. */
class SessionStore(context: Context) {

    private val prefs = context.getSharedPreferences("duo-admin-session", Context.MODE_PRIVATE)

    var baseUrl: String
        get() = prefs.getString(KEY_BASE_URL, null) ?: BuildConfig.DEFAULT_BASE_URL
        set(value) = prefs.edit().putString(KEY_BASE_URL, normalizeBaseUrl(value)).apply()

    var tokens: Tokens?
        get() {
            val access = prefs.getString(KEY_ACCESS, null) ?: return null
            val refresh = prefs.getString(KEY_REFRESH, null) ?: return null
            return Tokens(access, refresh, prefs.getLong(KEY_EXPIRES, 0))
        }
        set(value) {
            prefs.edit().apply {
                if (value == null) {
                    remove(KEY_ACCESS).remove(KEY_REFRESH).remove(KEY_EXPIRES)
                } else {
                    putString(KEY_ACCESS, value.accessToken)
                    putString(KEY_REFRESH, value.refreshToken)
                    putLong(KEY_EXPIRES, value.expiresAt)
                }
            }.apply()
        }

    var admin: AdminUser?
        get() {
            val id = prefs.getString(KEY_ADMIN_ID, null) ?: return null
            return AdminUser(
                id = id,
                email = prefs.getString(KEY_ADMIN_EMAIL, "") ?: "",
                displayName = prefs.getString(KEY_ADMIN_NAME, null),
                role = prefs.getString(KEY_ADMIN_ROLE, "editor") ?: "editor",
            )
        }
        set(value) {
            prefs.edit().apply {
                if (value == null) {
                    remove(KEY_ADMIN_ID).remove(KEY_ADMIN_EMAIL).remove(KEY_ADMIN_NAME).remove(KEY_ADMIN_ROLE)
                } else {
                    putString(KEY_ADMIN_ID, value.id)
                    putString(KEY_ADMIN_EMAIL, value.email)
                    putString(KEY_ADMIN_NAME, value.displayName)
                    putString(KEY_ADMIN_ROLE, value.role)
                }
            }.apply()
        }

    var config: ServerConfig
        get() = ServerConfig(
            imageBaseUrl = prefs.getString(KEY_IMAGE_URL, "") ?: "",
            siteUrl = prefs.getString(KEY_SITE_URL, "") ?: "",
        )
        set(value) {
            prefs.edit()
                .putString(KEY_IMAGE_URL, value.imageBaseUrl)
                .putString(KEY_SITE_URL, value.siteUrl)
                .apply()
        }

    /** Signs out locally. The saved base URL stays, so the next sign-in is one tap. */
    fun clear() {
        tokens = null
        admin = null
    }

    companion object {
        private const val KEY_BASE_URL = "base_url"
        private const val KEY_ACCESS = "access_token"
        private const val KEY_REFRESH = "refresh_token"
        private const val KEY_EXPIRES = "expires_at"
        private const val KEY_ADMIN_ID = "admin_id"
        private const val KEY_ADMIN_EMAIL = "admin_email"
        private const val KEY_ADMIN_NAME = "admin_name"
        private const val KEY_ADMIN_ROLE = "admin_role"
        private const val KEY_IMAGE_URL = "image_base_url"
        private const val KEY_SITE_URL = "site_url"

        fun normalizeBaseUrl(input: String): String {
            val trimmed = input.trim().trimEnd('/')
            if (trimmed.isEmpty()) return BuildConfig.DEFAULT_BASE_URL
            return if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) trimmed else "https://$trimmed"
        }
    }
}
