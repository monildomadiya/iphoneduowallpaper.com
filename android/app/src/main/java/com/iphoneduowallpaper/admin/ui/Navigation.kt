package com.iphoneduowallpaper.admin.ui

import androidx.compose.foundation.layout.RowScope
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.snapshots.SnapshotStateList
import androidx.compose.ui.text.style.TextOverflow

/** Every destination in the app. */
sealed interface Screen {
    val title: String

    data object Dashboard : Screen {
        override val title = "Dashboard"
    }

    data object Wallpapers : Screen {
        override val title = "Wallpapers"
    }

    data object Upload : Screen {
        override val title = "Upload"
    }

    data object Inbox : Screen {
        override val title = "Inbox"
    }

    data object More : Screen {
        override val title = "More"
    }

    data class WallpaperEditor(val id: String) : Screen {
        override val title = "Edit wallpaper"
    }

    data class Taxonomy(val kind: String) : Screen {
        override val title = when (kind) {
            "categories" -> "Categories"
            "collections" -> "Collections"
            else -> "Devices"
        }
    }

    data object Posts : Screen {
        override val title = "Blog"
    }

    data class PostEditor(val id: String?) : Screen {
        override val title = if (id == null) "New article" else "Edit article"
    }

    data object AdsSettings : Screen {
        override val title = "Ads & AdSense"
    }

    data object SiteSettings : Screen {
        override val title = "Site settings"
    }

    data object Account : Screen {
        override val title = "Account"
    }
}

val ROOT_SCREENS = listOf(Screen.Dashboard, Screen.Wallpapers, Screen.Upload, Screen.Inbox, Screen.More)

/** A plain back stack — the app has no deep links, so this is all the routing it needs. */
class Navigator(private val stack: SnapshotStateList<Screen>) {
    val current: Screen get() = stack.last()
    val canGoBack: Boolean get() = stack.size > 1

    fun push(screen: Screen) {
        stack.add(screen)
    }

    fun back() {
        if (canGoBack) stack.removeAt(stack.lastIndex)
    }

    fun selectRoot(screen: Screen) {
        stack.clear()
        stack.add(screen)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScreenTopBar(
    title: String,
    subtitle: String? = null,
    onBack: (() -> Unit)? = null,
    actions: @Composable RowScope.() -> Unit = {},
) {
    TopAppBar(
        title = {
            if (subtitle == null) {
                Text(title, maxLines = 1, overflow = TextOverflow.Ellipsis)
            } else {
                androidx.compose.foundation.layout.Column {
                    Text(title, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    Text(
                        subtitle,
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            }
        },
        navigationIcon = {
            if (onBack != null) {
                IconButton(onClick = onBack) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                }
            }
        },
        actions = actions,
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.background,
            titleContentColor = MaterialTheme.colorScheme.onBackground,
        ),
    )
}
