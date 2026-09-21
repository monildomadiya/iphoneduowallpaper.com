package com.iphoneduowallpaper.admin.ui

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.iphoneduowallpaper.admin.AdminViewModel
import com.iphoneduowallpaper.admin.data.JsonNullValue
import com.iphoneduowallpaper.admin.data.TaxonomyForm
import com.iphoneduowallpaper.admin.data.TaxonomyRow
import com.iphoneduowallpaper.admin.data.UploadEngine
import com.iphoneduowallpaper.admin.data.jsonText
import kotlinx.coroutines.launch

@Composable
fun TaxonomyScreen(vm: AdminViewModel, nav: Navigator, kind: String) {
    val loader = rememberLoad(vm, kind) { vm.repo.taxonomy(kind) }
    var editing by remember(kind) { mutableStateOf<TaxonomyRow?>(null) }
    var creating by remember(kind) { mutableStateOf(false) }

    val title = when (kind) {
        "categories" -> "Categories"
        "collections" -> "Collections"
        else -> "Devices"
    }

    if (creating || editing != null) {
        TaxonomyEditor(
            vm = vm,
            kind = kind,
            row = editing,
            onDone = {
                creating = false
                editing = null
                loader.refresh()
                vm.refreshShell()
            },
            onCancel = { creating = false; editing = null },
        )
        return
    }

    Column(Modifier.fillMaxSize()) {
        ScreenTopBar(title = title, onBack = { nav.back() })
        Box(Modifier.fillMaxSize()) {
            LoadBox(loader.state, loader.refresh) { data ->
                if (data.items.isEmpty()) {
                    EmptyState("Nothing here yet", "Tap + to add the first one.")
                } else {
                    LazyColumn(
                        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 96.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        items(data.items.size) { index ->
                            val row = data.items[index]
                            SectionCard(bodyPadding = PaddingValues(12.dp)) {
                                Row(
                                    Modifier.fillMaxWidth().clickable { editing = row },
                                    verticalAlignment = Alignment.CenterVertically,
                                ) {
                                    if (kind != "devices") {
                                        RemoteImage(
                                            url = vm.repo.imageUrl(row.cover_key),
                                            targetWidth = 120,
                                            modifier = Modifier
                                                .width(36.dp)
                                                .aspectRatio(9f / 16f)
                                                .clip(RoundedCornerShape(7.dp)),
                                        )
                                        Spacer(Modifier.width(12.dp))
                                    }
                                    Column(Modifier.weight(1f)) {
                                        Text(row.name, style = MaterialTheme.typography.bodyLarge)
                                        Text(
                                            buildString {
                                                append("${row.wallpaper_count} wallpapers")
                                                if (kind == "devices" && row.width != null) {
                                                    append(" · ${row.width} × ${row.height}")
                                                }
                                                append(" · /${row.slug}")
                                            },
                                            style = MaterialTheme.typography.labelMedium,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        )
                                    }
                                    if (!row.is_active) {
                                        Pill("Hidden", MaterialTheme.colorScheme.onSurfaceVariant)
                                    } else if (row.is_featured) {
                                        Pill("Featured", MaterialTheme.colorScheme.primary)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            FloatingActionButton(
                onClick = { creating = true },
                modifier = Modifier.align(Alignment.BottomEnd).padding(20.dp),
            ) { Icon(Icons.Default.Add, contentDescription = "Add") }
        }
    }
}

@Composable
private fun TaxonomyEditor(
    vm: AdminViewModel,
    kind: String,
    row: TaxonomyRow?,
    onDone: () -> Unit,
    onCancel: () -> Unit,
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val runner = rememberActionRunner(vm)

    var name by remember { mutableStateOf(row?.name ?: "") }
    var slug by remember { mutableStateOf(row?.slug ?: "") }
    var description by remember { mutableStateOf(row?.description ?: "") }
    var seoTitle by remember { mutableStateOf(row?.seo_title ?: "") }
    var seoDescription by remember { mutableStateOf(row?.seo_description ?: "") }
    var sortOrder by remember { mutableStateOf((row?.sort_order ?: 0).toString()) }
    var isActive by remember { mutableStateOf(row?.is_active ?: true) }
    var isFeatured by remember { mutableStateOf(row?.is_featured ?: false) }
    var coverKey by remember { mutableStateOf(row?.cover_key) }
    var coverChanged by remember { mutableStateOf(false) }
    var uploadingCover by remember { mutableStateOf(false) }

    var family by remember { mutableStateOf(row?.family ?: "iPhone") }
    var screenLabel by remember { mutableStateOf(row?.screen_label ?: "") }
    var width by remember { mutableStateOf((row?.width ?: 0).takeIf { it > 0 }?.toString() ?: "") }
    var height by remember { mutableStateOf((row?.height ?: 0).takeIf { it > 0 }?.toString() ?: "") }
    var diagonal by remember { mutableStateOf(row?.diagonal_in?.toString() ?: "") }
    var ppi by remember { mutableStateOf(row?.ppi?.toString() ?: "") }
    var confirmDelete by remember { mutableStateOf(false) }

    val picker = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri == null) return@rememberLauncherForActivityResult
        uploadingCover = true
        scope.launch {
            UploadEngine.uploadCover(context, vm.repo, uri).fold(
                onSuccess = { coverKey = it; coverChanged = true },
                onFailure = { vm.notify(UploadEngine.describe(it)) },
            )
            uploadingCover = false
        }
    }

    fun save() {
        val form = TaxonomyForm(
            id = row?.id,
            name = name.trim(),
            slug = slug.trim().ifBlank { null },
            description = description.trim(),
            seoTitle = seoTitle.trim(),
            seoDescription = seoDescription.trim(),
            sortOrder = sortOrder.toIntOrNull() ?: 0,
            isActive = isActive,
            isFeatured = if (kind == "collections") isFeatured else null,
            // Omitted means "leave the cover alone"; an explicit null clears it.
            coverKey = when {
                kind == "devices" || !coverChanged -> null
                coverKey == null -> JsonNullValue
                else -> jsonText(coverKey!!)
            },
            family = if (kind == "devices") family.trim() else null,
            screenLabel = if (kind == "devices") screenLabel.trim() else null,
            width = if (kind == "devices") width.toIntOrNull() else null,
            height = if (kind == "devices") height.toIntOrNull() else null,
            diagonalIn = if (kind == "devices") diagonal.toDoubleOrNull() else null,
            ppi = if (kind == "devices") ppi.toIntOrNull() else null,
        )
        runner.run(onSuccess = { onDone() }) { vm.repo.saveTaxonomy(kind, form) }
    }

    val label = when (kind) {
        "categories" -> "category"
        "collections" -> "collection"
        else -> "device"
    }

    Column(Modifier.fillMaxSize()) {
        ScreenTopBar(
            title = if (row == null) "New $label" else "Edit $label",
            onBack = onCancel,
            actions = {
                if (runner.busy) {
                    CircularProgressIndicator(Modifier.size(20.dp).padding(end = 8.dp), strokeWidth = 2.dp)
                } else {
                    TextButton(onClick = { save() }, enabled = name.isNotBlank()) { Text("Save") }
                }
            },
        )

        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(start = 16.dp, end = 16.dp, bottom = 28.dp),
        ) {
            SectionCard(title = "Basics") {
                Column {
                    Field("Name", name, { name = it })
                    FormSpacer()
                    Field("Slug", slug, { slug = it }, helper = "Leave empty to build it from the name.")
                    FormSpacer()
                    Field("Description", description, { description = it }, singleLine = false, minLines = 3)
                    FormSpacer()
                    Field(
                        "Sort order",
                        sortOrder,
                        { sortOrder = it.filter { char -> char.isDigit() || char == '-' } },
                        keyboardType = KeyboardType.Number,
                        helper = "Lower numbers come first.",
                    )
                    FormSpacer()
                    SwitchRow("Visible on the site", isActive, { isActive = it })
                    if (kind == "collections") {
                        SwitchRow(
                            "Featured collection",
                            isFeatured,
                            { isFeatured = it },
                            description = "Featured collections appear on the home page.",
                        )
                    }
                }
            }

            if (kind == "devices") {
                Spacer(Modifier.height(12.dp))
                SectionCard(title = "Screen", description = "Powers the screen-fit checks and device pages.") {
                    Column {
                        Field("Family", family, { family = it })
                        FormSpacer()
                        Field("Screen label", screenLabel, { screenLabel = it }, placeholder = "Outer display")
                        FormSpacer()
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            Field(
                                "Width",
                                width,
                                { width = it.filter(Char::isDigit) },
                                modifier = Modifier.weight(1f),
                                keyboardType = KeyboardType.Number,
                            )
                            Field(
                                "Height",
                                height,
                                { height = it.filter(Char::isDigit) },
                                modifier = Modifier.weight(1f),
                                keyboardType = KeyboardType.Number,
                            )
                        }
                        FormSpacer()
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            Field(
                                "Diagonal (in)",
                                diagonal,
                                { diagonal = it },
                                modifier = Modifier.weight(1f),
                                keyboardType = KeyboardType.Decimal,
                            )
                            Field(
                                "PPI",
                                ppi,
                                { ppi = it.filter(Char::isDigit) },
                                modifier = Modifier.weight(1f),
                                keyboardType = KeyboardType.Number,
                            )
                        }
                    }
                }
            } else {
                Spacer(Modifier.height(12.dp))
                SectionCard(title = "Cover image") {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        RemoteImage(
                            url = vm.repo.imageUrl(coverKey),
                            targetWidth = 200,
                            modifier = Modifier.width(66.dp).aspectRatio(9f / 16f).clip(RoundedCornerShape(10.dp)),
                        )
                        Spacer(Modifier.width(14.dp))
                        Column(Modifier.weight(1f)) {
                            if (uploadingCover) {
                                CircularProgressIndicator(Modifier.size(20.dp), strokeWidth = 2.dp)
                            } else {
                                OutlinedButton(onClick = {
                                    picker.launch(
                                        PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly),
                                    )
                                }) { Text(if (coverKey == null) "Choose cover" else "Replace cover") }
                                if (coverKey != null) {
                                    TextButton(onClick = { coverKey = null; coverChanged = true }) {
                                        Text("Remove cover", color = MaterialTheme.colorScheme.error)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Spacer(Modifier.height(12.dp))
            SectionCard(title = "SEO") {
                Column {
                    Field("SEO title", seoTitle, { seoTitle = it })
                    FormSpacer()
                    Field("SEO description", seoDescription, { seoDescription = it }, singleLine = false, minLines = 2)
                }
            }

            Spacer(Modifier.height(16.dp))
            Button(
                onClick = { save() },
                enabled = !runner.busy && name.isNotBlank(),
                modifier = Modifier.fillMaxWidth().height(50.dp),
            ) { Text("Save") }

            if (row != null) {
                Spacer(Modifier.height(10.dp))
                TextButton(
                    onClick = { confirmDelete = true },
                    enabled = !runner.busy,
                    modifier = Modifier.fillMaxWidth(),
                ) { Text("Delete", color = MaterialTheme.colorScheme.error) }
            }
        }
    }

    if (confirmDelete && row != null) {
        ConfirmDialog(
            title = "Delete “${row.name}”?",
            message = "Wallpapers keep their images, but they lose this $label.",
            onConfirm = {
                runner.run(onSuccess = { onDone() }) { vm.repo.deleteTaxonomy(kind, listOf(row.id)) }
            },
            onDismiss = { confirmDelete = false },
        )
    }
}
