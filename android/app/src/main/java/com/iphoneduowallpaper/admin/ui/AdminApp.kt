package com.iphoneduowallpaper.admin.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import com.iphoneduowallpaper.admin.AdminViewModel

@Composable
fun AdminApp(vm: AdminViewModel) {
    if (!vm.signedIn) {
        LoginScreen(vm)
        return
    }

    val stack = remember { mutableStateListOf<Screen>(Screen.Dashboard) }
    val nav = remember { Navigator(stack) }
    val current = nav.current
    val isRoot = ROOT_SCREENS.contains(current)

    // Back walks the stack, then returns to the Dashboard. Only from there does it leave the app,
    // which is what Android users expect — closing the app from the Wallpapers tab was a surprise.
    BackHandler(enabled = nav.canGoBack || current != Screen.Dashboard) {
        if (nav.canGoBack) nav.back() else nav.selectRoot(Screen.Dashboard)
    }
    LaunchedEffect(Unit) { vm.refreshShell() }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        snackbarHost = { SnackbarHost(vm.snackbar) },
        bottomBar = {
            if (isRoot) {
                BottomBar(
                    current = current,
                    inboxBadge = vm.inbox.messages + vm.inbox.reports,
                    uploadBadge = if (vm.upload.running) vm.upload.pending else 0,
                    onSelect = { nav.selectRoot(it) },
                )
            }
        },
    ) { padding ->
        Box(Modifier.fillMaxSize().padding(padding)) {
            when (current) {
                Screen.Dashboard -> DashboardScreen(vm, nav)
                Screen.Wallpapers -> WallpapersScreen(vm, nav)
                Screen.Upload -> UploadScreen(vm, nav)
                Screen.Inbox -> InboxScreen(vm, nav)
                Screen.More -> MoreScreen(vm, nav)
                is Screen.WallpaperEditor -> WallpaperEditorScreen(vm, nav, current.id)
                is Screen.Taxonomy -> TaxonomyScreen(vm, nav, current.kind)
                Screen.Posts -> PostsScreen(vm, nav)
                is Screen.PostEditor -> PostEditorScreen(vm, nav, current.id)
                Screen.AdsSettings -> AdsSettingsScreen(vm, nav)
                Screen.SiteSettings -> SiteSettingsScreen(vm, nav)
                Screen.Account -> AccountScreen(vm, nav)
            }
        }
    }
}

@Composable
private fun BottomBar(current: Screen, inboxBadge: Int, uploadBadge: Int, onSelect: (Screen) -> Unit) {
    NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
        ROOT_SCREENS.forEach { screen ->
            // An upload now keeps going after you leave the tab, so the tab has to say so.
            val badge = when (screen) {
                Screen.Inbox -> inboxBadge
                Screen.Upload -> uploadBadge
                else -> 0
            }
            NavigationBarItem(
                selected = current == screen,
                onClick = { onSelect(screen) },
                icon = {
                    val icon = iconFor(screen)
                    if (badge > 0) {
                        BadgedBox(badge = { Badge { Text(if (badge > 99) "99+" else "$badge") } }) {
                            Icon(icon, contentDescription = screen.title)
                        }
                    } else {
                        Icon(icon, contentDescription = screen.title)
                    }
                },
                label = { Text(screen.title) },
            )
        }
    }
}

private fun iconFor(screen: Screen): ImageVector = when (screen) {
    Screen.Dashboard -> Icons.Default.Home
    Screen.Wallpapers -> Icons.AutoMirrored.Filled.List
    Screen.Upload -> Icons.Default.AddCircle
    Screen.Inbox -> Icons.Default.Email
    else -> Icons.Default.Menu
}
