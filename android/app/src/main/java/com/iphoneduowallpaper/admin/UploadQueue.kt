package com.iphoneduowallpaper.admin

import android.net.Uri
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

/** One picked image, from the moment it is chosen until its row exists on the site. */
@Stable
class UploadItem(val uri: Uri) {
    var title by mutableStateOf("")

    // Per-file, because these have to differ from wallpaper to wallpaper.
    var description by mutableStateOf("")
    var slug by mutableStateOf("")
    var seoTitle by mutableStateOf("")
    var seoDescription by mutableStateOf("")

    var expanded by mutableStateOf(false)
    var stage by mutableStateOf("Waiting")
    var progress by mutableFloatStateOf(0f)
    var saved by mutableStateOf(false)
    var error by mutableStateOf<String?>(null)

    /** Filled in once the file has been inspected; 0 until then. */
    var width by mutableIntStateOf(0)
    var height by mutableIntStateOf(0)
    var bytes by mutableStateOf(0L)

    val measured: Boolean get() = width > 0 && height > 0
}

/**
 * Everything the upload screen holds on to. It lives on the view model rather than in the
 * composable so that checking the library mid-upload — or taking a call — no longer cancels the
 * transfer and throws away every title and description that had been typed.
 */
@Stable
class UploadQueue {
    val items = mutableStateListOf<UploadItem>()

    // Settings shared by every image in the batch.
    var status by mutableStateOf("draft")
    var categoryId by mutableStateOf<String?>(null)
    val deviceIds = mutableStateListOf<String>()
    val collectionIds = mutableStateListOf<String>()
    var sourceType by mutableStateOf("original")
    var creditName by mutableStateOf("")

    var running by mutableStateOf(false)
        internal set
    var savedCount by mutableIntStateOf(0)
        internal set

    val pending: Int get() = items.count { !it.saved }
    val missingDescriptions: Int get() = items.count { !it.saved && it.description.isBlank() }

    fun add(uris: List<Uri>) {
        savedCount = 0
        uris.forEach { uri -> if (items.none { it.uri == uri }) items.add(UploadItem(uri)) }
    }

    fun remove(item: UploadItem) {
        if (!running) items.remove(item)
    }

    fun clear() {
        if (running) return
        items.clear()
        savedCount = 0
    }

    /** Drops the ones that made it, so a retry only covers what actually failed. */
    fun clearSaved() {
        if (running) return
        items.removeAll { it.saved }
        savedCount = 0
    }
}
