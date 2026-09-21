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

    BackHandler(enabled = nav.canGoBack) { nav.back() }
    LaunchedEffect(Unit) { vm.refreshShell() }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        snackbarHost = { SnackbarHost(vm.snackbar) },
        bottomBar = {
            if (isRoot) {
                BottomBar(
                    current = current,
                    inboxBadge = vm.inbox.messages + vm.inbox.reports,
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
private fun BottomBar(current: Screen, inboxBadge: Int, onSelect: (Screen) -> Unit) {
    NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
        ROOT_SCREENS.forEach { screen ->
            NavigationBarItem(
                selected = current == screen,
                onClick = { onSelect(screen) },
                icon = {
                    val icon = iconFor(screen)
                    if (screen == Screen.Inbox && inboxBadge > 0) {
                        BadgedBox(badge = { Badge { Text(if (inboxBadge > 99) "99+" else "$inboxBadge") } }) {
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
