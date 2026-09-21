package com.iphoneduowallpaper.admin.ui

import android.content.Intent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.net.toUri
import com.iphoneduowallpaper.admin.AdminViewModel

private data class MoreEntry(
    val icon: ImageVector,
    val label: String,
    val description: String,
    val managerOnly: Boolean = false,
    val onOpen: (Navigator) -> Unit,
)

@Composable
fun MoreScreen(vm: AdminViewModel, nav: Navigator) {
    val context = LocalContext.current
    var confirmSignOut by remember { mutableStateOf(false) }

    val entries = listOf(
        MoreEntry(Icons.AutoMirrored.Filled.List, "Categories", "Group wallpapers by style") {
            it.push(Screen.Taxonomy("categories"))
        },
        MoreEntry(Icons.Default.Favorite, "Collections", "Curated sets for the home page") {
            it.push(Screen.Taxonomy("collections"))
        },
        MoreEntry(Icons.Default.Build, "Devices", "Screen sizes and device pages") {
            it.push(Screen.Taxonomy("devices"))
        },
        MoreEntry(Icons.Default.DateRange, "Blog", "Guides and articles") {
            it.push(Screen.Posts)
        },
        MoreEntry(Icons.Default.ShoppingCart, "Ads & AdSense", "Publisher ID, placements, ads.txt", managerOnly = true) {
            it.push(Screen.AdsSettings)
        },
        MoreEntry(Icons.Default.Settings, "Site settings", "Brand, analytics, legal, socials", managerOnly = true) {
            it.push(Screen.SiteSettings)
        },
        MoreEntry(Icons.Default.AccountCircle, "Account", "Your profile and password") {
            it.push(Screen.Account)
        },
    )

    Column(Modifier.fillMaxSize()) {
        ScreenTopBar(title = "More", subtitle = vm.admin?.email)

        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            val visible = entries.filter { !it.managerOnly || vm.canManage }
            items(visible.size) { index ->
                val entry = visible[index]
                SectionCard(bodyPadding = PaddingValues(14.dp)) {
                    Row(
                        Modifier.fillMaxWidth().clickable { entry.onOpen(nav) },
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Icon(
                            entry.icon,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(22.dp),
                        )
                        Spacer(Modifier.width(14.dp))
                        Column(Modifier.weight(1f)) {
                            Text(entry.label, style = MaterialTheme.typography.bodyLarge)
                            Text(
                                entry.description,
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                        Icon(
                            Icons.AutoMirrored.Filled.KeyboardArrowRight,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }

            item {
                val siteUrl = vm.repo.store.config.siteUrl
                if (siteUrl.isNotBlank()) {
                    SectionCard(bodyPadding = PaddingValues(14.dp)) {
                        Row(
                            Modifier.fillMaxWidth().clickable {
                                runCatching { context.startActivity(Intent(Intent.ACTION_VIEW, siteUrl.toUri())) }
                            },
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Icon(
                                Icons.Default.Share,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(22.dp),
                            )
                            Spacer(Modifier.width(14.dp))
                            Column(Modifier.weight(1f)) {
                                Text("Open the website", style = MaterialTheme.typography.bodyLarge)
                                Text(
                                    siteUrl.removePrefix("https://"),
                                    style = MaterialTheme.typography.labelMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                    }
                }
            }

            item {
                SectionCard(bodyPadding = PaddingValues(14.dp)) {
                    Row(
                        Modifier.fillMaxWidth().clickable { confirmSignOut = true },
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Icon(
                            Icons.AutoMirrored.Filled.ExitToApp,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.error,
                            modifier = Modifier.size(22.dp),
                        )
                        Spacer(Modifier.width(14.dp))
                        Text(
                            "Sign out",
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.error,
                        )
                    }
                }
            }

            item {
                Row(
                    Modifier.fillMaxWidth().padding(top = 8.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Icon(
                        Icons.Default.Info,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(14.dp),
                    )
                    Spacer(Modifier.width(6.dp))
                    Text(
                        "Connected to ${vm.repo.store.baseUrl.removePrefix("https://")}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }

    if (confirmSignOut) {
        ConfirmDialog(
            title = "Sign out?",
            message = "You will need your email and password to sign back in.",
            confirmLabel = "Sign out",
            onConfirm = { vm.signOut() },
            onDismiss = { confirmSignOut = false },
        )
    }
}
