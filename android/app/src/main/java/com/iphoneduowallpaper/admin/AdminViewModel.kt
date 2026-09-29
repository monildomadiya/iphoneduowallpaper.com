package com.iphoneduowallpaper.admin

import android.app.Application
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.iphoneduowallpaper.admin.data.AdminRepository
import com.iphoneduowallpaper.admin.data.AdminUser
import com.iphoneduowallpaper.admin.data.ApiResult
import com.iphoneduowallpaper.admin.data.BootstrapData
import com.iphoneduowallpaper.admin.data.ImagePipeline
import com.iphoneduowallpaper.admin.data.InboxCounts
import com.iphoneduowallpaper.admin.data.ThumbLoader
import com.iphoneduowallpaper.admin.data.UploadEngine
import com.iphoneduowallpaper.admin.data.WallpaperForm
import com.iphoneduowallpaper.admin.ui.plural
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/** Session and the handful of things every screen needs. */
class AdminViewModel(application: Application) : AndroidViewModel(application) {

    val repo = AdminRepository(application)
    val snackbar = SnackbarHostState()

    var signedIn by mutableStateOf(repo.isSignedIn)
        private set
    var admin by mutableStateOf<AdminUser?>(repo.store.admin)
        private set
    var inbox by mutableStateOf(InboxCounts())
        private set
    var pickers by mutableStateOf(BootstrapData())
        private set

    /** Survives leaving the Upload tab, so a batch keeps going while you look at something else. */
    val upload = UploadQueue()
    private var uploadJob: Job? = null

    val canManage: Boolean get() = admin?.role == "owner" || admin?.role == "admin"

    fun onSignedIn() {
        signedIn = true
        admin = repo.store.admin
        refreshShell()
    }

    /** Refreshes the profile, inbox badges and the editor pickers. */
    fun refreshShell() {
        viewModelScope.launch {
            when (val result = repo.me()) {
                is ApiResult.Ok -> {
                    admin = result.data.admin
                    inbox = result.data.inbox
                }
                is ApiResult.Err -> if (result.signedOut) forceSignOut()
            }
            repo.bootstrap().let { if (it is ApiResult.Ok) pickers = it.data }
        }
    }

    // ------------------------------------------------------------------ upload

    /**
     * Reads the name and pixel size of anything newly picked. Both feed the card: the name becomes
     * the starting title, the size drives the "too small for this phone" warning.
     */
    fun inspectPicked() {
        viewModelScope.launch {
            upload.items.filter { it.title.isBlank() }.forEach { item ->
                val source = withContext(Dispatchers.IO) {
                    ImagePipeline.readSource(getApplication(), item.uri)
                }
                source.onSuccess {
                    item.title = ImagePipeline.titleFromFilename(it.displayName)
                    item.bytes = it.size
                }.onFailure {
                    item.error = it.message ?: "This file could not be read."
                    item.title = "Wallpaper"
                }
            }
            upload.items.filter { !it.measured }.forEach { item ->
                val size = withContext(Dispatchers.IO) {
                    ImagePipeline.readDimensions(getApplication(), item.uri)
                }
                if (size != null) {
                    item.width = size.first
                    item.height = size.second
                }
            }
        }
    }

    /** Uploads everything still pending. Safe to call again after a failure: saved rows are skipped. */
    fun startUpload() {
        if (upload.running || upload.pending == 0) return
        upload.running = true
        upload.savedCount = 0
        uploadJob = viewModelScope.launch {
            for (item in upload.items.toList()) {
                // Signing out clears the flag; stop rather than keep pushing files with a dead token.
                if (!upload.running) break
                if (item.saved) continue
                item.error = null
                item.progress = 0f

                val payload = UploadEngine.uploadImage(
                    context = getApplication(),
                    repo = repo,
                    uri = item.uri,
                    onStage = { item.stage = it },
                    onProgress = { item.progress = it },
                ).getOrElse {
                    item.stage = "Failed"
                    item.error = UploadEngine.describe(it)
                    continue
                }

                item.stage = "Saving"
                val form = WallpaperForm(
                    title = item.title.trim().ifBlank { "Wallpaper" },
                    slug = item.slug.trim().ifBlank { null },
                    description = item.description.trim(),
                    seoTitle = item.seoTitle.trim(),
                    seoDescription = item.seoDescription.trim(),
                    categoryId = upload.categoryId,
                    deviceIds = upload.deviceIds.toList(),
                    collectionIds = upload.collectionIds.toList(),
                    status = upload.status,
                    sourceType = upload.sourceType,
                    creditName = upload.creditName.trim(),
                )
                when (val result = repo.createWallpaper(form, payload)) {
                    is ApiResult.Ok -> {
                        item.saved = true
                        item.stage = "Saved"
                        upload.savedCount++
                    }
                    is ApiResult.Err -> {
                        item.stage = "Failed"
                        item.error = result.message
                        if (result.signedOut) {
                            upload.running = false
                            forceSignOut()
                            return@launch
                        }
                    }
                }
            }
            upload.running = false
            refreshShell()
            if (upload.savedCount > 0) {
                notify("${upload.savedCount} ${plural(upload.savedCount, "wallpaper")} uploaded.")
            }
        }
    }

    /** Stops after the file in flight. Thirty photos on mobile data needed a way out. */
    fun cancelUpload() {
        if (!upload.running) return
        uploadJob?.cancel()
        uploadJob = null
        upload.running = false
        upload.items.filter { !it.saved }.forEach { item ->
            item.stage = "Waiting"
            item.progress = 0f
        }
        notify(
            if (upload.savedCount > 0) {
                "Stopped. ${upload.savedCount} ${plural(upload.savedCount, "wallpaper")} uploaded."
            } else {
                "Upload stopped."
            },
        )
    }

    fun signOut() {
        viewModelScope.launch {
            repo.signOut()
            clearLocalState()
        }
    }

    /** Called when the server says the token is no longer good. */
    fun forceSignOut() {
        repo.store.clear()
        clearLocalState()
        notify("Your session has expired. Please sign in again.")
    }

    /** Surfaces an error, signing out first when that is what went wrong. */
    fun report(error: ApiResult.Err) {
        if (error.signedOut) forceSignOut() else notify(error.message)
    }

    fun notify(message: String) {
        viewModelScope.launch {
            snackbar.showSnackbar(message, duration = SnackbarDuration.Short)
        }
    }

    private fun clearLocalState() {
        signedIn = false
        admin = null
        inbox = InboxCounts()
        pickers = BootstrapData()
        upload.running = false
        upload.clear()
        ThumbLoader.clear(getApplication())
    }
}
