package com.iphoneduowallpaper.admin.ui

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.iphoneduowallpaper.admin.AdminViewModel
import com.iphoneduowallpaper.admin.data.ApiResult
import com.iphoneduowallpaper.admin.data.ImagePipeline
import com.iphoneduowallpaper.admin.data.UploadEngine
import com.iphoneduowallpaper.admin.data.WallpaperForm
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

private class UploadItem(val uri: Uri) {
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
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun UploadScreen(vm: AdminViewModel, nav: Navigator) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val items = remember { mutableStateListOf<UploadItem>() }

    var status by remember { mutableStateOf("draft") }
    var categoryId by remember { mutableStateOf<String?>(null) }
    val deviceIds = remember { mutableStateListOf<String>() }
    val collectionIds = remember { mutableStateListOf<String>() }
    var sourceType by remember { mutableStateOf("original") }
    var creditName by remember { mutableStateOf("") }
    var running by remember { mutableStateOf(false) }
    var savedCount by remember { mutableIntStateOf(0) }

    val picker = rememberLauncherForActivityResult(
        ActivityResultContracts.PickMultipleVisualMedia(30),
    ) { uris ->
        savedCount = 0
        uris.forEach { uri -> if (items.none { it.uri == uri }) items.add(UploadItem(uri)) }
    }

    // Titles come from the file names, read off the main thread.
    LaunchedEffect(items.size) {
        items.filter { it.title.isBlank() }.forEach { item ->
            val name = withContext(Dispatchers.IO) {
                ImagePipeline.readSource(context, item.uri).getOrNull()?.displayName
            }
            if (name != null) {
                item.title = ImagePipeline.titleFromFilename(name)
            } else {
                item.error = "This file could not be read."
                item.title = "Wallpaper"
            }
        }
    }

    fun startUpload() {
        if (running || items.isEmpty()) return
        running = true
        savedCount = 0
        scope.launch {
            for (item in items.toList()) {
                if (item.saved) continue
                item.error = null
                item.progress = 0f

                val uploaded = UploadEngine.uploadImage(
                    context = context,
                    repo = vm.repo,
                    uri = item.uri,
                    onStage = { item.stage = it },
                    onProgress = { item.progress = it },
                )
                val payload = uploaded.getOrElse {
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
                    categoryId = categoryId,
                    deviceIds = deviceIds.toList(),
                    collectionIds = collectionIds.toList(),
                    status = status,
                    sourceType = sourceType,
                    creditName = creditName.trim(),
                )
                when (val result = vm.repo.createWallpaper(form, payload)) {
                    is ApiResult.Ok -> {
                        item.saved = true
                        item.stage = "Saved"
                        savedCount++
                    }
                    is ApiResult.Err -> {
                        item.stage = "Failed"
                        item.error = result.message
                        if (result.signedOut) {
                            vm.forceSignOut()
                            running = false
                            return@launch
                        }
                    }
                }
            }
            running = false
            vm.refreshShell()
            if (savedCount > 0) vm.notify("$savedCount wallpaper(s) uploaded.")
        }
    }

    Column(Modifier.fillMaxSize()) {
        ScreenTopBar(
            title = "Upload",
            subtitle = if (items.isEmpty()) "Pick images from your phone" else "${items.size} selected",
        )

        LazyColumn(
            modifier = Modifier.weight(1f),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item {
                OutlinedButton(
                    onClick = {
                        picker.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                    },
                    enabled = !running,
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                ) { Text(if (items.isEmpty()) "Choose images" else "Add more images") }
            }

            if (items.isEmpty()) {
                item {
                    EmptyState(
                        title = "Nothing picked yet",
                        description = "Choose up to 30 images. Write each title and description right here, so " +
                            "nothing is left to fill in afterwards. Previews, 9:16 thumbnails and dominant " +
                            "colours are made on the phone before uploading.",
                    )
                }
            }

            items(items.size) { index ->
                val item = items[index]
                SectionCard(bodyPadding = PaddingValues(12.dp)) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                Modifier
                                    .width(44.dp)
                                    .aspectRatio(9f / 16f)
                                    .clip(RoundedCornerShape(8.dp)),
                            ) {
                                LocalImage(item.uri)
                            }
                            Spacer(Modifier.width(12.dp))
                            Field(
                                label = "Title",
                                value = item.title,
                                onValueChange = { item.title = it },
                                modifier = Modifier.weight(1f),
                                enabled = !running && !item.saved,
                            )
                            if (!running && !item.saved) {
                                IconButton(onClick = { items.remove(item) }) {
                                    Icon(Icons.Default.Close, contentDescription = "Remove")
                                }
                            }
                            if (item.saved) {
                                Icon(
                                    Icons.Default.CheckCircle,
                                    contentDescription = "Saved",
                                    tint = LocalAccents.current.success,
                                    modifier = Modifier.size(22.dp).padding(start = 4.dp),
                                )
                            }
                        }

                        if (!item.saved) {
                            Spacer(Modifier.height(10.dp))
                            Field(
                                label = "Description",
                                value = item.description,
                                onValueChange = { item.description = it },
                                singleLine = false,
                                minLines = 3,
                                enabled = !running,
                                placeholder = "Colours, mood and subject in 2–3 sentences.",
                                helper = if (item.description.isBlank()) {
                                    "No description yet — unique text per wallpaper is what SEO and AdSense reward."
                                } else {
                                    "${item.description.length}/2000"
                                },
                            )

                            TextButton(
                                onClick = { item.expanded = !item.expanded },
                                enabled = !running,
                            ) {
                                Text(
                                    if (item.expanded) "Hide link & search listing" else "Link & search listing",
                                    style = MaterialTheme.typography.labelMedium,
                                )
                            }

                            if (item.expanded) {
                                Field(
                                    label = "URL slug",
                                    value = item.slug,
                                    onValueChange = { item.slug = it },
                                    enabled = !running,
                                    placeholder = slugFrom(item.title),
                                    helper = "Leave empty to build it from the title.",
                                )
                                FormSpacer()
                                Field(
                                    label = "SEO title",
                                    value = item.seoTitle,
                                    onValueChange = { item.seoTitle = it },
                                    enabled = !running,
                                    placeholder = item.title,
                                    helper = "${item.seoTitle.length}/60",
                                )
                                FormSpacer()
                                Field(
                                    label = "Meta description",
                                    value = item.seoDescription,
                                    onValueChange = { item.seoDescription = it },
                                    singleLine = false,
                                    minLines = 2,
                                    enabled = !running,
                                    placeholder = "Leave empty to reuse the description above.",
                                    helper = "${item.seoDescription.length}/160",
                                )
                            }
                        }

                        if (running && !item.saved && item.error == null) {
                            Spacer(Modifier.height(8.dp))
                            Text(
                                "${item.stage}…",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                            Spacer(Modifier.height(4.dp))
                            LinearProgressIndicator(
                                progress = { item.progress },
                                modifier = Modifier.fillMaxWidth(),
                            )
                        }
                        item.error?.let {
                            Spacer(Modifier.height(6.dp))
                            Text(it, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.error)
                        }
                    }
                }
            }

            if (items.isNotEmpty()) {
                item {
                    SectionCard(title = "Applies to every image") {
                        Column {
                            Text("Status", style = MaterialTheme.typography.labelLarge)
                            Spacer(Modifier.height(6.dp))
                            ChoiceRow(
                                options = listOf("draft" to "Draft", "published" to "Published"),
                                selected = status,
                                onSelect = { status = it },
                            )

                            FormSpacer()
                            Text("Category", style = MaterialTheme.typography.labelLarge)
                            Spacer(Modifier.height(6.dp))
                            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                FilterChip(
                                    selected = categoryId == null,
                                    onClick = { categoryId = null },
                                    label = { Text("None") },
                                )
                                vm.pickers.categories.forEach { option ->
                                    FilterChip(
                                        selected = categoryId == option.id,
                                        onClick = { categoryId = option.id },
                                        label = { Text(option.name) },
                                    )
                                }
                            }

                            FormSpacer()
                            Text("Devices", style = MaterialTheme.typography.labelLarge)
                            Spacer(Modifier.height(6.dp))
                            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                vm.pickers.devices.forEach { device ->
                                    val on = deviceIds.contains(device.id)
                                    FilterChip(
                                        selected = on,
                                        onClick = { if (on) deviceIds.remove(device.id) else deviceIds.add(device.id) },
                                        label = {
                                            Text(device.screen_label?.takeIf { it.isNotBlank() } ?: device.name)
                                        },
                                    )
                                }
                            }

                            if (vm.pickers.collections.isNotEmpty()) {
                                FormSpacer()
                                Text("Collections", style = MaterialTheme.typography.labelLarge)
                                Spacer(Modifier.height(6.dp))
                                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    vm.pickers.collections.forEach { option ->
                                        val on = collectionIds.contains(option.id)
                                        FilterChip(
                                            selected = on,
                                            onClick = {
                                                if (on) collectionIds.remove(option.id)
                                                else collectionIds.add(option.id)
                                            },
                                            label = { Text(option.name) },
                                        )
                                    }
                                }
                            }

                            FormSpacer()
                            Text("Source", style = MaterialTheme.typography.labelLarge)
                            Spacer(Modifier.height(6.dp))
                            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                SOURCE_TYPES.forEach { (value, label) ->
                                    FilterChip(
                                        selected = sourceType == value,
                                        onClick = { sourceType = value },
                                        label = { Text(label) },
                                    )
                                }
                            }

                            FormSpacer()
                            Field("Credit name", creditName, { creditName = it })
                        }
                    }
                }
            }
        }

        if (items.isNotEmpty()) {
            Column(Modifier.padding(16.dp)) {
                val pending = items.count { !it.saved }
                val missing = items.count { !it.saved && it.description.isBlank() }
                if (missing > 0 && !running) {
                    Text(
                        "$missing of $pending still have no description. You can upload anyway and add them " +
                            "later, but unique descriptions are what AdSense looks for.",
                        style = MaterialTheme.typography.labelMedium,
                        color = LocalAccents.current.warning,
                    )
                    Spacer(Modifier.height(8.dp))
                }
                Button(
                    onClick = { startUpload() },
                    enabled = !running && items.any { !it.saved },
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                ) {
                    Text(if (running) "Uploading…" else "Upload ${items.count { !it.saved }} wallpaper(s)")
                }
                if (!running && savedCount > 0) {
                    Spacer(Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedButton(
                            onClick = { items.clear(); savedCount = 0 },
                            modifier = Modifier.weight(1f),
                        ) { Text("Clear list") }
                        OutlinedButton(
                            onClick = { nav.selectRoot(Screen.Wallpapers) },
                            modifier = Modifier.weight(1f),
                        ) { Text("Open library") }
                    }
                }
            }
        }
    }
}

/** A thumbnail of a picked file, before it has been uploaded anywhere. */
@Composable
private fun LocalImage(uri: Uri) {
    val context = LocalContext.current
    var bitmap by remember(uri) { mutableStateOf<android.graphics.Bitmap?>(null) }

    LaunchedEffect(uri) {
        bitmap = withContext(Dispatchers.IO) {
            runCatching {
                android.graphics.ImageDecoder.decodeBitmap(
                    android.graphics.ImageDecoder.createSource(context.contentResolver, uri),
                ) { decoder, info, _ ->
                    decoder.allocator = android.graphics.ImageDecoder.ALLOCATOR_SOFTWARE
                    var sample = 1
                    while (info.size.width / (sample * 2) >= 200) sample *= 2
                    decoder.setTargetSampleSize(sample)
                }
            }.getOrNull()
        }
    }

    Box(Modifier.fillMaxSize().clip(RoundedCornerShape(8.dp))) {
        bitmap?.let {
            androidx.compose.foundation.Image(
                bitmap = it.asImageBitmap(),
                contentDescription = null,
                contentScale = androidx.compose.ui.layout.ContentScale.Crop,
                modifier = Modifier.fillMaxSize(),
            )
        }
    }
}
