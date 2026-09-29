package com.iphoneduowallpaper.admin.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.rememberLazyGridState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.iphoneduowallpaper.admin.AdminViewModel
import com.iphoneduowallpaper.admin.data.ApiResult
import com.iphoneduowallpaper.admin.data.WallpaperListItem
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.collectLatest

private val SORTS = listOf(
    "newest" to "Newest",
    "oldest" to "Oldest",
    "downloads" to "Downloads",
    "views" to "Views",
    "title" to "Title",
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WallpapersScreen(vm: AdminViewModel, nav: Navigator) {
    var query by remember { mutableStateOf("") }
    var debouncedQuery by remember { mutableStateOf("") }
    var status by remember { mutableStateOf("all") }
    var sort by remember { mutableStateOf("newest") }
    var featuredOnly by remember { mutableStateOf(false) }
    var categoryId by remember { mutableStateOf<String?>(null) }

    val items = remember { mutableStateListOf<WallpaperListItem>() }
    val selected = remember { mutableStateListOf<String>() }
    var page by remember { mutableIntStateOf(1) }
    var totalPages by remember { mutableIntStateOf(1) }
    var total by remember { mutableIntStateOf(0) }
    var loading by remember { mutableStateOf(true) }
    var refreshing by remember { mutableStateOf(false) }
    var loadingMore by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var reloadTick by remember { mutableIntStateOf(0) }
    var confirmDelete by remember { mutableStateOf(false) }
    var sortMenuOpen by remember { mutableStateOf(false) }
    var filterMenuOpen by remember { mutableStateOf(false) }

    val runner = rememberActionRunner(vm)
    val gridState = rememberLazyGridState()

    LaunchedEffect(query) {
        delay(350)
        debouncedQuery = query.trim()
    }

    // Filters changed: start again from the first page.
    LaunchedEffect(debouncedQuery, status, sort, featuredOnly, categoryId, reloadTick) {
        // A pull-to-refresh leaves the grid in place; a filter change starts from the spinner.
        if (!refreshing) loading = true
        error = null
        selected.clear()
        when (val result = vm.repo.wallpapers(debouncedQuery, status, categoryId, featuredOnly, sort, 1)) {
            is ApiResult.Ok -> {
                items.clear()
                items.addAll(result.data.items)
                page = result.data.page
                totalPages = result.data.totalPages
                total = result.data.total
            }
            is ApiResult.Err -> {
                if (result.signedOut) vm.forceSignOut()
                error = result.message
            }
        }
        loading = false
        refreshing = false
    }

    // Endless scrolling: fetch the next page as the last row comes into view.
    val atEnd by remember {
        derivedStateOf {
            val last = gridState.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
            items.isNotEmpty() && last >= items.size - 4
        }
    }
    LaunchedEffect(gridState) {
        snapshotFlow { atEnd }.collectLatest { reached ->
            if (!reached || loading || loadingMore || page >= totalPages) return@collectLatest
            loadingMore = true
            when (val result = vm.repo.wallpapers(debouncedQuery, status, categoryId, featuredOnly, sort, page + 1)) {
                is ApiResult.Ok -> {
                    items.addAll(result.data.items)
                    page = result.data.page
                    totalPages = result.data.totalPages
                }
                is ApiResult.Err -> if (result.signedOut) vm.forceSignOut() else vm.notify(result.message)
            }
            loadingMore = false
        }
    }

    fun refresh() {
        reloadTick++
    }

    fun pullRefresh() {
        if (items.isNotEmpty()) refreshing = true
        reloadTick++
    }

    fun bulk(status: String? = null, featured: Boolean? = null) {
        val ids = selected.toList()
        runner.run(onSuccess = { refresh() }) { vm.repo.bulkUpdateWallpapers(ids, status, featured) }
    }

    Column(Modifier.fillMaxSize()) {
        if (selected.isEmpty()) {
            ScreenTopBar(
                title = "Wallpapers",
                subtitle = if (loading) null else "${formatNumber(total.toLong())} total",
                actions = {
                    Box {
                        TextButton(onClick = { sortMenuOpen = true }) {
                            Text(SORTS.first { it.first == sort }.second)
                        }
                        DropdownMenu(expanded = sortMenuOpen, onDismissRequest = { sortMenuOpen = false }) {
                            SORTS.forEach { (value, label) ->
                                DropdownMenuItem(
                                    text = { Text(label) },
                                    onClick = { sort = value; sortMenuOpen = false },
                                )
                            }
                        }
                    }
                    Box {
                        IconButton(onClick = { filterMenuOpen = true }) {
                            Icon(
                                Icons.Default.Star,
                                contentDescription = "Filters",
                                tint = if (featuredOnly || categoryId != null) MaterialTheme.colorScheme.primary
                                else MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                        DropdownMenu(expanded = filterMenuOpen, onDismissRequest = { filterMenuOpen = false }) {
                            DropdownMenuItem(
                                text = { Text(if (featuredOnly) "Featured only ✓" else "Featured only") },
                                onClick = { featuredOnly = !featuredOnly; filterMenuOpen = false },
                            )
                            DropdownMenuItem(
                                text = { Text(if (categoryId == null) "All categories ✓" else "All categories") },
                                onClick = { categoryId = null; filterMenuOpen = false },
                            )
                            vm.pickers.categories.forEach { option ->
                                DropdownMenuItem(
                                    text = { Text(if (categoryId == option.id) "${option.name} ✓" else option.name) },
                                    onClick = { categoryId = option.id; filterMenuOpen = false },
                                )
                            }
                        }
                    }
                },
            )
        } else {
            SelectionBar(
                count = selected.size,
                busy = runner.busy,
                onClear = { selected.clear() },
                onPublish = { bulk(status = "published") },
                onUnpublish = { bulk(status = "draft") },
                onFeature = { bulk(featured = true) },
                onUnfeature = { bulk(featured = false) },
                onDelete = { confirmDelete = true },
            )
        }

        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            placeholder = { Text("Search title or slug") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            trailingIcon = {
                if (query.isNotEmpty()) {
                    IconButton(onClick = { query = "" }) {
                        Icon(Icons.Default.Close, contentDescription = "Clear search")
                    }
                }
            },
            singleLine = true,
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
        )

        Row(
            Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            listOf("all" to "All", "published" to "Published", "draft" to "Drafts").forEach { (value, label) ->
                FilterChip(
                    selected = status == value,
                    onClick = { status = value },
                    label = { Text(label) },
                )
            }
        }

        Box(Modifier.fillMaxSize()) {
            RefreshBox(refreshing = refreshing, onRefresh = { pullRefresh() }) {
                when {
                    loading -> Box(Modifier.fillMaxSize(), Alignment.Center) { CircularProgressIndicator() }
                    error != null -> ErrorState(error!!) { refresh() }
                    items.isEmpty() -> EmptyState(
                        title = "No wallpapers found",
                        description = if (debouncedQuery.isBlank()) "Upload your first wallpaper to get started."
                        else "Nothing matches “$debouncedQuery”.",
                    )
                    else -> LazyVerticalGrid(
                        state = gridState,
                        columns = GridCells.Adaptive(minSize = 118.dp),
                        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 96.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        items(items.size, key = { items[it].id }) { index ->
                            val item = items[index]
                            WallpaperTile(
                                item = item,
                                imageUrl = vm.repo.imageUrl(item.thumb_key),
                                selected = selected.contains(item.id),
                                selectionMode = selected.isNotEmpty(),
                                onClick = {
                                    if (selected.isNotEmpty()) toggle(selected, item.id)
                                    else nav.push(Screen.WallpaperEditor(item.id))
                                },
                                onLongClick = { toggle(selected, item.id) },
                            )
                        }
                        if (loadingMore) {
                            item {
                                Box(Modifier.fillMaxWidth().height(80.dp), Alignment.Center) {
                                    CircularProgressIndicator(Modifier.size(22.dp), strokeWidth = 2.dp)
                                }
                            }
                        }
                    }
                }
            }

            if (selected.isEmpty()) {
                FloatingActionButton(
                    onClick = { nav.selectRoot(Screen.Upload) },
                    modifier = Modifier.align(Alignment.BottomEnd).padding(20.dp),
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Upload wallpapers")
                }
            }
        }
    }

    if (confirmDelete) {
        val ids = selected.toList()
        ConfirmDialog(
            title = "Delete ${ids.size} ${plural(ids.size, "wallpaper")}?",
            message = "Their image files are removed from storage too. This cannot be undone.",
            onConfirm = { runner.run(onSuccess = { refresh() }) { vm.repo.deleteWallpapers(ids) } },
            onDismiss = { confirmDelete = false },
        )
    }
}

private fun toggle(selection: MutableList<String>, id: String) {
    if (!selection.remove(id)) selection.add(id)
}

@Composable
private fun SelectionBar(
    count: Int,
    busy: Boolean,
    onClear: () -> Unit,
    onPublish: () -> Unit,
    onUnpublish: () -> Unit,
    onFeature: () -> Unit,
    onUnfeature: () -> Unit,
    onDelete: () -> Unit,
) {
    Column(Modifier.fillMaxWidth().background(MaterialTheme.colorScheme.surfaceVariant)) {
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            IconButton(onClick = onClear) { Icon(Icons.Default.Close, contentDescription = "Clear selection") }
            Text("$count selected", style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
            if (busy) CircularProgressIndicator(Modifier.size(20.dp), strokeWidth = 2.dp)
            IconButton(onClick = onDelete, enabled = !busy) {
                Icon(Icons.Default.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error)
            }
        }
        Row(
            Modifier.fillMaxWidth().padding(start = 8.dp, end = 8.dp, bottom = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            TextButton(onClick = onPublish, enabled = !busy) { Text("Publish") }
            TextButton(onClick = onUnpublish, enabled = !busy) { Text("Unpublish") }
            TextButton(onClick = onFeature, enabled = !busy) { Text("Feature") }
            TextButton(onClick = onUnfeature, enabled = !busy) { Text("Unfeature") }
        }
    }
}

@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
@Composable
private fun WallpaperTile(
    item: WallpaperListItem,
    imageUrl: String?,
    selected: Boolean,
    selectionMode: Boolean,
    onClick: () -> Unit,
    onLongClick: () -> Unit,
) {
    Column(
        Modifier
            .clip(RoundedCornerShape(14.dp))
            .combinedClickable(onClick = onClick, onLongClick = onLongClick),
    ) {
        Box {
            RemoteImage(
                url = imageUrl,
                placeholder = parseHexColor(item.dominant_color),
                targetWidth = 320,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(9f / 16f)
                    .clip(RoundedCornerShape(14.dp))
                    .then(
                        if (selected) Modifier.border(
                            3.dp,
                            MaterialTheme.colorScheme.primary,
                            RoundedCornerShape(14.dp),
                        ) else Modifier,
                    ),
            )
            Row(Modifier.align(Alignment.TopStart).padding(6.dp)) {
                if (item.status == "draft") Pill("Draft", MaterialTheme.colorScheme.onSurface)
                if (item.is_featured) {
                    if (item.status == "draft") Spacer(Modifier.width(4.dp))
                    Icon(
                        Icons.Default.Star,
                        contentDescription = "Featured",
                        tint = LocalAccents.current.warning,
                        modifier = Modifier.size(16.dp),
                    )
                }
            }
            if (selectionMode) {
                Box(
                    Modifier
                        .align(Alignment.TopEnd)
                        .padding(6.dp)
                        .size(22.dp)
                        .clip(RoundedCornerShape(11.dp))
                        .background(
                            if (selected) MaterialTheme.colorScheme.primary
                            else MaterialTheme.colorScheme.surface.copy(alpha = 0.85f),
                        ),
                    contentAlignment = Alignment.Center,
                ) {
                    if (selected) {
                        Icon(
                            Icons.Default.Check,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.size(15.dp),
                        )
                    }
                }
            }
        }
        Spacer(Modifier.height(5.dp))
        Text(
            item.title,
            style = MaterialTheme.typography.labelLarge,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        Text(
            "${formatCompact(item.downloads)} ↓ · ${formatCompact(item.views)} views",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            maxLines = 1,
        )
    }
}
