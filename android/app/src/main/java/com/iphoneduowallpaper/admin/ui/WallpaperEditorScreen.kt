package com.iphoneduowallpaper.admin.ui

import android.content.Intent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.net.toUri
import com.iphoneduowallpaper.admin.AdminViewModel
import com.iphoneduowallpaper.admin.data.UploadEngine
import com.iphoneduowallpaper.admin.data.WallpaperDetail
import kotlinx.coroutines.launch

@Composable
fun WallpaperEditorScreen(vm: AdminViewModel, nav: Navigator, id: String) {
    val loader = rememberLoad(vm, id) { vm.repo.wallpaper(id) }

    Column(Modifier.fillMaxSize()) {
        LoadBox(loader.state, loader.refresh) { detail ->
            EditorContent(vm, nav, detail, loader.refresh)
        }
    }
}

@Composable
private fun EditorContent(
    vm: AdminViewModel,
    nav: Navigator,
    detail: WallpaperDetail,
    onReload: () -> Unit,
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val runner = rememberActionRunner(vm)
    val form = remember(detail.id, detail.updated_at) { WallpaperFormState(detail) }

    var confirmDelete by remember { mutableStateOf(false) }
    var replacing by remember { mutableStateOf(false) }
    var replaceStage by remember { mutableStateOf("") }
    var replaceProgress by remember { mutableFloatStateOf(0f) }

    val picker = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri == null) return@rememberLauncherForActivityResult
        replacing = true
        replaceProgress = 0f
        scope.launch {
            val result = UploadEngine.uploadImage(
                context = context,
                repo = vm.repo,
                uri = uri,
                onStage = { replaceStage = it },
                onProgress = { replaceProgress = it },
            )
            result.fold(
                onSuccess = { payload ->
                    runner.run(onSuccess = { replacing = false; onReload() }) {
                        vm.repo.replaceWallpaperImage(detail.id, payload)
                    }
                },
                onFailure = {
                    replacing = false
                    vm.notify(UploadEngine.describe(it))
                },
            )
        }
    }

    Column(Modifier.fillMaxSize()) {
        ScreenTopBar(
            title = "Edit wallpaper",
            subtitle = detail.title,
            onBack = { nav.back() },
            actions = {
                if (runner.busy) {
                    CircularProgressIndicator(Modifier.size(20.dp).padding(end = 4.dp), strokeWidth = 2.dp)
                } else {
                    TextButton(onClick = {
                        runner.run(onSuccess = { onReload() }) {
                            vm.repo.updateWallpaper(detail.id, form.toForm())
                        }
                    }) { Text("Save") }
                }
            },
        )

        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(PaddingValues(start = 16.dp, end = 16.dp, bottom = 28.dp)),
        ) {
            SectionCard(title = "Image") {
                Column {
                    Row {
                        RemoteImage(
                            url = vm.repo.imageUrl(detail.preview_key.ifBlank { detail.thumb_key }),
                            placeholder = parseHexColor(detail.dominant_color),
                            targetWidth = 360,
                            modifier = Modifier
                                .width(110.dp)
                                .aspectRatio(9f / 16f)
                                .clip(RoundedCornerShape(12.dp)),
                        )
                        Spacer(Modifier.width(14.dp))
                        Column(Modifier.weight(1f)) {
                            KeyValueRow("Size", "${detail.width} × ${detail.height}")
                            KeyValueRow("File", formatBytes(detail.file_size))
                            KeyValueRow("Type", detail.mime_type.removePrefix("image/").uppercase())
                            KeyValueRow("Downloads", formatNumber(detail.downloads))
                            KeyValueRow("Views", formatNumber(detail.views))
                            KeyValueRow("Added", formatDate(detail.created_at))
                        }
                    }
                    Spacer(Modifier.height(12.dp))
                    if (replacing) {
                        Text(
                            "$replaceStage…",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Spacer(Modifier.height(6.dp))
                        LinearProgressIndicator(
                            progress = { replaceProgress },
                            modifier = Modifier.fillMaxWidth(),
                        )
                    } else {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedButton(onClick = {
                                picker.launch(
                                    PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly),
                                )
                            }) { Text("Replace image") }

                            val siteUrl = vm.repo.siteUrl("/wallpapers/${detail.slug}")
                            if (vm.repo.store.config.siteUrl.isNotBlank()) {
                                OutlinedButton(onClick = {
                                    runCatching {
                                        context.startActivity(Intent(Intent.ACTION_VIEW, siteUrl.toUri()))
                                    }
                                }) { Text("View on site") }
                            }
                        }
                    }
                }
            }

            Spacer(Modifier.height(12.dp))
            WallpaperFormFields(form, vm.pickers, vm.repo.store.config.siteUrl)

            Spacer(Modifier.height(16.dp))
            Button(
                onClick = {
                    runner.run(onSuccess = { onReload() }) {
                        vm.repo.updateWallpaper(detail.id, form.toForm())
                    }
                },
                enabled = !runner.busy && !replacing,
                modifier = Modifier.fillMaxWidth().height(50.dp),
            ) { Text("Save changes") }

            Spacer(Modifier.height(10.dp))
            TextButton(
                onClick = { confirmDelete = true },
                enabled = !runner.busy && !replacing,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Delete wallpaper", color = MaterialTheme.colorScheme.error)
            }
        }
    }

    if (confirmDelete) {
        ConfirmDialog(
            title = "Delete “${detail.title}”?",
            message = "The image files are removed from storage too. This cannot be undone.",
            onConfirm = {
                runner.run(onSuccess = { nav.back() }) { vm.repo.deleteWallpapers(listOf(detail.id)) }
            },
            onDismiss = { confirmDelete = false },
        )
    }
}

@Composable
fun UploadProgressBox(stage: String, progress: Float) {
    Box(Modifier.fillMaxWidth().padding(vertical = 8.dp), Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(stage, style = MaterialTheme.typography.labelMedium)
            Spacer(Modifier.height(6.dp))
            LinearProgressIndicator(progress = { progress }, modifier = Modifier.fillMaxWidth())
        }
    }
}
