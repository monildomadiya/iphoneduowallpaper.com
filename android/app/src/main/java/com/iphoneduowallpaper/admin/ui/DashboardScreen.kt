package com.iphoneduowallpaper.admin.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.iphoneduowallpaper.admin.AdminViewModel
import com.iphoneduowallpaper.admin.data.DashboardData
import com.iphoneduowallpaper.admin.data.SeriesPoint

@Composable
fun DashboardScreen(vm: AdminViewModel, nav: Navigator) {
    val loader = rememberLoad(vm) { vm.repo.dashboard() }
    val firstName = vm.admin?.displayName?.trim()?.split(" ")?.firstOrNull()

    Column(Modifier.fillMaxSize()) {
        ScreenTopBar(
            title = if (firstName.isNullOrBlank()) "Welcome back" else "Welcome back, $firstName",
            subtitle = vm.admin?.email,
            actions = {
                IconButton(onClick = { loader.refresh(); vm.refreshShell() }) {
                    Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                }
            },
        )
        LoadBox(loader.state, loader.refresh) { data ->
            DashboardContent(vm, nav, data)
        }
    }
}

@Composable
private fun DashboardContent(vm: AdminViewModel, nav: Navigator, data: DashboardData) {
    val stats = data.stats
    val done = data.checklist.count { it.done }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                StatTile(
                    label = "Published",
                    value = formatNumber(stats.wallpapers_published.toLong()),
                    hint = "${formatNumber(stats.wallpapers_draft.toLong())} drafts",
                    modifier = Modifier.weight(1f),
                    onClick = { nav.selectRoot(Screen.Wallpapers) },
                )
                StatTile(
                    label = "Downloads",
                    value = formatCompact(stats.downloads_total),
                    hint = "All time",
                    modifier = Modifier.weight(1f),
                )
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                StatTile(
                    label = "Views",
                    value = formatCompact(stats.views_total),
                    hint = "All time",
                    modifier = Modifier.weight(1f),
                )
                StatTile(
                    label = "Inbox",
                    value = formatNumber((stats.messages_new + stats.reports_open).toLong()),
                    hint = "${stats.messages_new} messages · ${stats.reports_open} reports",
                    modifier = Modifier.weight(1f),
                    onClick = { nav.selectRoot(Screen.Inbox) },
                )
            }
        }

        item {
            SectionCard(title = "Last 30 days", description = "Daily downloads and views") {
                ActivityChart(stats.series)
            }
        }

        item {
            SectionCard(
                title = "AdSense readiness",
                description = "$done of ${data.checklist.size} complete",
            ) {
                Column {
                    LinearProgressIndicator(
                        progress = { if (data.checklist.isEmpty()) 0f else done.toFloat() / data.checklist.size },
                        modifier = Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(999.dp)),
                        color = LocalAccents.current.success,
                    )
                    Spacer(Modifier.height(14.dp))
                    data.checklist.forEach { item ->
                        Row(Modifier.fillMaxWidth().padding(vertical = 5.dp)) {
                            Icon(
                                Icons.Default.CheckCircle,
                                contentDescription = null,
                                tint = if (item.done) LocalAccents.current.success
                                else MaterialTheme.colorScheme.outline,
                                modifier = Modifier.size(18.dp),
                            )
                            Spacer(Modifier.width(10.dp))
                            Text(
                                item.label,
                                style = MaterialTheme.typography.bodySmall,
                                color = if (item.done) MaterialTheme.colorScheme.onSurfaceVariant
                                else MaterialTheme.colorScheme.onSurface,
                            )
                        }
                    }
                }
            }
        }

        item {
            SectionCard(title = "Top wallpapers", description = "Most downloaded", bodyPadding = androidx.compose.foundation.layout.PaddingValues(8.dp)) {
                Column {
                    if (data.top.isEmpty()) {
                        Text(
                            "No published wallpapers yet.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(8.dp),
                        )
                    }
                    data.top.forEachIndexed { index, item ->
                        MiniRow(
                            rank = "${index + 1}",
                            title = item.title,
                            subtitle = "${formatCompact(item.downloads)} downloads · ${formatCompact(item.views)} views",
                            imageUrl = vm.repo.imageUrl(item.thumb_key),
                            tint = parseHexColor(item.dominant_color),
                            onClick = { nav.push(Screen.WallpaperEditor(item.id)) },
                        )
                    }
                }
            }
        }

        item {
            SectionCard(title = "Recent uploads", bodyPadding = androidx.compose.foundation.layout.PaddingValues(8.dp)) {
                Column {
                    if (data.recent.isEmpty()) {
                        Text(
                            "Nothing uploaded yet.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(8.dp),
                        )
                    }
                    data.recent.forEach { item ->
                        MiniRow(
                            title = item.title,
                            subtitle = formatDate(item.created_at),
                            trailing = { StatusPill(item.status) },
                            imageUrl = vm.repo.imageUrl(item.thumb_key),
                            tint = parseHexColor(item.dominant_color),
                            onClick = { nav.push(Screen.WallpaperEditor(item.id)) },
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun MiniRow(
    title: String,
    subtitle: String,
    imageUrl: String?,
    tint: Color,
    rank: String? = null,
    trailing: (@Composable () -> Unit)? = null,
    onClick: () -> Unit,
) {
    Row(
        Modifier.fillMaxWidth().clickable(onClick = onClick).padding(horizontal = 6.dp, vertical = 7.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (rank != null) {
            Text(
                rank,
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.width(18.dp),
            )
        }
        RemoteImage(
            url = imageUrl,
            placeholder = tint,
            targetWidth = 120,
            modifier = Modifier.size(width = 34.dp, height = 46.dp).clip(RoundedCornerShape(7.dp)),
        )
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.bodyMedium, maxLines = 1, overflow = TextOverflow.Ellipsis)
            Text(
                subtitle,
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        trailing?.let {
            Spacer(Modifier.width(8.dp))
            it()
        }
    }
}

/** Downloads and views over the last 30 days. */
@Composable
private fun ActivityChart(series: List<SeriesPoint>) {
    if (series.isEmpty()) {
        Text(
            "No activity recorded yet.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        return
    }

    val downloadColor = MaterialTheme.colorScheme.primary
    val viewColor = LocalAccents.current.success
    val gridColor = MaterialTheme.colorScheme.outlineVariant
    val peak = series.maxOf { maxOf(it.downloads, it.views) }.coerceAtLeast(1)

    Column {
        Canvas(Modifier.fillMaxWidth().height(150.dp)) {
            val stepX = if (series.size > 1) size.width / (series.size - 1) else size.width
            fun pointAt(index: Int, value: Int) = Offset(
                x = index * stepX,
                y = size.height - (value.toFloat() / peak) * size.height,
            )

            for (fraction in listOf(0f, 0.5f, 1f)) {
                val y = size.height * fraction
                drawLine(gridColor, Offset(0f, y), Offset(size.width, y), strokeWidth = 1f)
            }

            listOf(downloadColor to series.map { it.downloads }, viewColor to series.map { it.views })
                .forEach { (color, values) ->
                    val path = Path()
                    values.forEachIndexed { index, value ->
                        val point = pointAt(index, value)
                        if (index == 0) path.moveTo(point.x, point.y) else path.lineTo(point.x, point.y)
                    }
                    drawPath(path, color, style = Stroke(width = 2.5f))
                }
        }
        Spacer(Modifier.height(10.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            LegendDot("Downloads", downloadColor)
            LegendDot("Views", viewColor)
        }
    }
}

@Composable
private fun LegendDot(label: String, color: Color) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.size(8.dp).clip(RoundedCornerShape(4.dp)).background(color))
        Spacer(Modifier.width(6.dp))
        Text(label, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

/** "#1d1d1f" -> Color, falling back to a neutral placeholder. */
fun parseHexColor(hex: String?): Color {
    val value = hex?.removePrefix("#")?.takeIf { it.length == 6 } ?: return Color(0xFF1D1D1F)
    return runCatching { Color(value.toLong(16) or 0xFF000000L) }.getOrElse { Color(0xFF1D1D1F) }
}
