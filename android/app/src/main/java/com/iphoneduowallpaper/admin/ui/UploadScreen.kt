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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.iphoneduowallpaper.admin.AdminViewModel
import com.iphoneduowallpaper.admin.UploadItem
import com.iphoneduowallpaper.admin.data.DeviceOption
import com.iphoneduowallpaper.admin.data.fitReport
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun UploadScreen(vm: AdminViewModel, nav: Navigator) {
    val queue = vm.upload
    val running = queue.running

    val picker = rememberLauncherForActivityResult(
        ActivityResultContracts.PickMultipleVisualMedia(30),
    ) { uris -> queue.add(uris) }

    // Names and pixel sizes are read on the view model, so they outlive this screen.
    LaunchedEffect(queue.items.size) { vm.inspectPicked() }

    // A wallpaper is judged against the screens it is tagged for; against all of them until then.
    val targets: List<DeviceOption> = if (queue.deviceIds.isEmpty()) {
        vm.pickers.devices
    } else {
        vm.pickers.devices.filter { queue.deviceIds.contains(it.id) }
    }

    Column(Modifier.fillMaxSize()) {
        ScreenTopBar(
            title = "Upload",
            subtitle = when {
                running -> "Uploading ${queue.pending} of ${queue.items.size}"
                queue.items.isEmpty() -> "Pick images from your phone"
                else -> "${queue.items.size} selected"
            },
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
                ) { Text(if (queue.items.isEmpty()) "Choose images" else "Add more images") }
            }

            if (queue.items.isEmpty()) {
                item {
                    EmptyState(
                        title = "Nothing picked yet",
                        description = "Choose up to 30 images. Write each title and description right here, so " +
                            "nothing is left to fill in afterwards. Previews, 9:16 thumbnails and dominant " +
                            "colours are made on the phone before uploading.",
                    )
                }
            }

            // Settings first: they are chosen once and apply to everything below, so burying them
            // under thirty image cards meant scrolling to the end and back before you could start.
            if (queue.items.isNotEmpty()) {
                item { BatchSettings(vm, running) }
            }

            items(queue.items.size, key = { queue.items[it].uri.toString() }) { index ->
                val item = queue.items.getOrNull(index) ?: return@items
                UploadCard(item = item, targets = targets, running = running, onRemove = { queue.remove(item) })
            }
        }

        if (queue.items.isNotEmpty()) {
            UploadBar(vm, nav)
        }
    }
}

@Composable
private fun UploadCard(
    item: UploadItem,
    targets: List<DeviceOption>,
    running: Boolean,
    onRemove: () -> Unit,
) {
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
                    IconButton(onClick = onRemove) {
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

            // The same verdict the site will show visitors, while there is still time to swap the file.
            if (item.measured) {
                val report = fitReport(item.width, item.height, targets)
                Spacer(Modifier.height(6.dp))
                Text(
                    buildString {
                        append("${item.width} × ${item.height}")
                        if (item.bytes > 0) append(" · ${formatBytes(item.bytes)}")
                    },
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                if (report.hasProblem) {
                    Text(
                        report.summary(),
                        style = MaterialTheme.typography.labelMedium,
                        color = LocalAccents.current.warning,
                    )
                } else if (targets.isNotEmpty()) {
                    Text(
                        "Fits every screen it is tagged for.",
                        style = MaterialTheme.typography.labelMedium,
                        color = LocalAccents.current.success,
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

                TextButton(onClick = { item.expanded = !item.expanded }, enabled = !running) {
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
                LinearProgressIndicator(progress = { item.progress }, modifier = Modifier.fillMaxWidth())
            }
            item.error?.let {
                Spacer(Modifier.height(6.dp))
                Text(it, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.error)
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun BatchSettings(vm: AdminViewModel, running: Boolean) {
    val queue = vm.upload
    SectionCard(
        title = "Applies to every image",
        description = "Set these once; each image keeps its own title and description.",
    ) {
        Column {
            Text("Status", style = MaterialTheme.typography.labelLarge)
            Spacer(Modifier.height(6.dp))
            ChoiceRow(
                options = listOf("draft" to "Draft", "published" to "Published"),
                selected = queue.status,
                onSelect = { if (!running) queue.status = it },
            )

            FormSpacer()
            Text("Category", style = MaterialTheme.typography.labelLarge)
            Spacer(Modifier.height(6.dp))
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(
                    selected = queue.categoryId == null,
                    onClick = { if (!running) queue.categoryId = null },
                    label = { Text("None") },
                )
                vm.pickers.categories.forEach { option ->
                    FilterChip(
                        selected = queue.categoryId == option.id,
                        onClick = { if (!running) queue.categoryId = option.id },
                        label = { Text(option.name) },
                    )
                }
            }

            FormSpacer()
            Text("Devices", style = MaterialTheme.typography.labelLarge)
            Spacer(Modifier.height(6.dp))
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                vm.pickers.devices.forEach { device ->
                    val on = queue.deviceIds.contains(device.id)
                    FilterChip(
                        selected = on,
                        onClick = {
                            if (running) return@FilterChip
                            if (on) queue.deviceIds.remove(device.id) else queue.deviceIds.add(device.id)
                        },
                        label = { Text(device.screen_label?.takeIf { it.isNotBlank() } ?: device.name) },
                    )
                }
            }

            if (vm.pickers.collections.isNotEmpty()) {
                FormSpacer()
                Text("Collections", style = MaterialTheme.typography.labelLarge)
                Spacer(Modifier.height(6.dp))
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    vm.pickers.collections.forEach { option ->
                        val on = queue.collectionIds.contains(option.id)
                        FilterChip(
                            selected = on,
                            onClick = {
                                if (running) return@FilterChip
                                if (on) queue.collectionIds.remove(option.id)
                                else queue.collectionIds.add(option.id)
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
                        selected = queue.sourceType == value,
                        onClick = { if (!running) queue.sourceType = value },
                        label = { Text(label) },
                    )
                }
            }

            FormSpacer()
            Field("Credit name", queue.creditName, { queue.creditName = it }, enabled = !running)
        }
    }
}

@Composable
private fun UploadBar(vm: AdminViewModel, nav: Navigator) {
    val queue = vm.upload
    val pending = queue.pending
    val missing = queue.missingDescriptions

    Column(Modifier.padding(16.dp)) {
        if (missing > 0 && !queue.running) {
            Text(
                "$missing of $pending still ${if (missing == 1) "has" else "have"} no description. You can " +
                    "upload anyway and add them later, but unique descriptions are what AdSense looks for.",
                style = MaterialTheme.typography.labelMedium,
                color = LocalAccents.current.warning,
            )
            Spacer(Modifier.height(8.dp))
        }
        if (queue.running) {
            OutlinedButton(
                onClick = { vm.cancelUpload() },
                modifier = Modifier.fillMaxWidth().height(50.dp),
            ) { Text("Stop after this one") }
        } else {
            Button(
                onClick = { vm.startUpload() },
                enabled = pending > 0,
                modifier = Modifier.fillMaxWidth().height(50.dp),
            ) { Text("Upload $pending ${plural(pending, "wallpaper")}") }
        }
        if (!queue.running && queue.savedCount > 0) {
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(
                    onClick = { if (pending > 0) queue.clearSaved() else queue.clear() },
                    modifier = Modifier.weight(1f),
                ) { Text(if (pending > 0) "Clear uploaded" else "Clear list") }
                OutlinedButton(
                    onClick = { nav.selectRoot(Screen.Wallpapers) },
                    modifier = Modifier.weight(1f),
                ) { Text("Open library") }
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
