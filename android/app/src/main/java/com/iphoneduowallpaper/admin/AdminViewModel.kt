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
import com.iphoneduowallpaper.admin.data.InboxCounts
import com.iphoneduowallpaper.admin.data.ThumbLoader
import kotlinx.coroutines.launch

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
        ThumbLoader.clear(getApplication())
    }
}
