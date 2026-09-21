package com.iphoneduowallpaper.admin.ui

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.clickable
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
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.iphoneduowallpaper.admin.AdminViewModel
import com.iphoneduowallpaper.admin.data.ApiResult
import com.iphoneduowallpaper.admin.data.PostDetail
import com.iphoneduowallpaper.admin.data.PostForm
import com.iphoneduowallpaper.admin.data.UploadEngine
import kotlinx.coroutines.launch

@Composable
fun PostsScreen(vm: AdminViewModel, nav: Navigator) {
    val loader = rememberLoad(vm) { vm.repo.posts() }

    Column(Modifier.fillMaxSize()) {
        ScreenTopBar(title = "Blog", onBack = { nav.back() })
        Box(Modifier.fillMaxSize()) {
            LoadBox(loader.state, loader.refresh) { data ->
                if (data.items.isEmpty()) {
                    EmptyState(
                        "No articles yet",
                        "AdSense looks for helpful written content. Five short guides is a good start.",
                    )
                } else {
                    LazyColumn(
                        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 96.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        items(data.items.size) { index ->
                            val post = data.items[index]
                            SectionCard(bodyPadding = PaddingValues(12.dp)) {
                                Row(
                                    Modifier.fillMaxWidth().clickable { nav.push(Screen.PostEditor(post.id)) },
                                    verticalAlignment = Alignment.CenterVertically,
                                ) {
                                    RemoteImage(
                                        url = vm.repo.imageUrl(post.cover_key),
                                        targetWidth = 120,
                                        modifier = Modifier
                                            .width(44.dp)
                                            .aspectRatio(1f)
                                            .clip(RoundedCornerShape(8.dp)),
                                    )
                                    Spacer(Modifier.width(12.dp))
                                    Column(Modifier.weight(1f)) {
                                        Text(
                                            post.title,
                                            style = MaterialTheme.typography.bodyLarge,
                                            maxLines = 2,
                                            overflow = TextOverflow.Ellipsis,
                                        )
                                        Text(
                                            "${post.author_name} · ${formatDate(post.updated_at)}",
                                            style = MaterialTheme.typography.labelMedium,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        )
                                    }
                                    Spacer(Modifier.width(8.dp))
                                    StatusPill(post.status)
                                }
                            }
                        }
                    }
                }
            }
            FloatingActionButton(
                onClick = { nav.push(Screen.PostEditor(null)) },
                modifier = Modifier.align(Alignment.BottomEnd).padding(20.dp),
            ) { Icon(Icons.Default.Add, contentDescription = "New article") }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun PostEditorScreen(vm: AdminViewModel, nav: Navigator, id: String?) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val runner = rememberActionRunner(vm)

    // A new article starts from a blank detail rather than a network call.
    val loader = rememberLoad(vm, id) {
        if (id == null) ApiResult.Ok(PostDetail(id = "", title = "", slug = "")) else vm.repo.post(id)
    }

    LoadBox(loader.state, loader.refresh) { detail ->
        var title by remember(detail.id) { mutableStateOf(detail.title) }
        var slug by remember(detail.id) { mutableStateOf(detail.slug) }
        var excerpt by remember(detail.id) { mutableStateOf(detail.excerpt ?: "") }
        var content by remember(detail.id) { mutableStateOf(detail.content) }
        var authorName by remember(detail.id) { mutableStateOf(detail.author_name) }
        var status by remember(detail.id) { mutableStateOf(detail.status) }
        var seoTitle by remember(detail.id) { mutableStateOf(detail.seo_title ?: "") }
        var seoDescription by remember(detail.id) { mutableStateOf(detail.seo_description ?: "") }
        var coverKey by remember(detail.id) { mutableStateOf(detail.cover_key) }
        val tags = remember(detail.id) { mutableStateListOf<String>().apply { addAll(detail.tags) } }
        var tagDraft by remember(detail.id) { mutableStateOf("") }
        var contentTab by remember(detail.id) { mutableStateOf("write") }
        var uploadingCover by remember { mutableStateOf(false) }
        var confirmDelete by remember { mutableStateOf(false) }

        val picker = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
            if (uri == null) return@rememberLauncherForActivityResult
            uploadingCover = true
            scope.launch {
                UploadEngine.uploadCover(context, vm.repo, uri).fold(
                    onSuccess = { coverKey = it },
                    onFailure = { vm.notify(UploadEngine.describe(it)) },
                )
                uploadingCover = false
            }
        }

        fun save() {
            val form = PostForm(
                id = detail.id.ifBlank { null },
                title = title.trim(),
                slug = slug.trim().ifBlank { null },
                excerpt = excerpt.trim(),
                content = content,
                coverKey = coverKey,
                tags = tags.toList(),
                authorName = authorName.trim().ifBlank { "Editorial Team" },
                status = status,
                seoTitle = seoTitle.trim(),
                seoDescription = seoDescription.trim(),
            )
            runner.run(onSuccess = { nav.back() }) { vm.repo.savePost(form) }
        }

        Column(Modifier.fillMaxSize()) {
            ScreenTopBar(
                title = if (id == null) "New article" else "Edit article",
                subtitle = if (id == null) null else detail.title,
                onBack = { nav.back() },
                actions = {
                    if (runner.busy) {
                        CircularProgressIndicator(Modifier.size(20.dp).padding(end = 8.dp), strokeWidth = 2.dp)
                    } else {
                        TextButton(onClick = { save() }, enabled = title.isNotBlank()) { Text("Save") }
                    }
                },
            )

            Column(
                Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(start = 16.dp, end = 16.dp, bottom = 28.dp),
            ) {
                SectionCard(title = "Article") {
                    Column {
                        Field("Title", title, { title = it })
                        FormSpacer()
                        Field("Slug", slug, { slug = it }, helper = "Leave empty to build it from the title.")
                        FormSpacer()
                        Field("Excerpt", excerpt, { excerpt = it }, singleLine = false, minLines = 2)
                        FormSpacer()
                        Field("Author", authorName, { authorName = it })
                        FormSpacer()
                        Text("Status", style = MaterialTheme.typography.labelLarge)
                        Spacer(Modifier.height(6.dp))
                        ChoiceRow(
                            options = listOf("draft" to "Draft", "published" to "Published"),
                            selected = status,
                            onSelect = { status = it },
                        )
                        if (status == "published" && content.trim().length < 300) {
                            Spacer(Modifier.height(8.dp))
                            Text(
                                "Published articles need at least 300 characters (${content.trim().length} so far).",
                                style = MaterialTheme.typography.labelMedium,
                                color = LocalAccents.current.warning,
                            )
                        }
                    }
                }

                Spacer(Modifier.height(12.dp))
                SectionCard(title = "Content", description = "Markdown — the site renders headings, lists and links.") {
                    Column {
                        ChoiceRow(
                            options = listOf("write" to "Write", "preview" to "Preview"),
                            selected = contentTab,
                            onSelect = { contentTab = it },
                        )
                        Spacer(Modifier.height(12.dp))
                        if (contentTab == "write") {
                            Field(
                                label = "Markdown",
                                value = content,
                                onValueChange = { content = it },
                                singleLine = false,
                                minLines = 12,
                                helper = "${content.length} characters",
                            )
                        } else {
                            MarkdownPreview(content)
                        }
                    }
                }

                Spacer(Modifier.height(12.dp))
                SectionCard(title = "Cover image") {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        RemoteImage(
                            url = vm.repo.imageUrl(coverKey),
                            targetWidth = 200,
                            modifier = Modifier.width(66.dp).aspectRatio(1f).clip(RoundedCornerShape(10.dp)),
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
                                    TextButton(onClick = { coverKey = null }) {
                                        Text("Remove cover", color = MaterialTheme.colorScheme.error)
                                    }
                                }
                            }
                        }
                    }
                }

                Spacer(Modifier.height(12.dp))
                SectionCard(title = "Tags") {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Field("Add a tag", tagDraft, { tagDraft = it }, modifier = Modifier.weight(1f))
                            Spacer(Modifier.width(8.dp))
                            Button(
                                onClick = {
                                    val tag = tagDraft.trim().lowercase()
                                    if (tag.isNotEmpty() && !tags.contains(tag) && tags.size < 20) tags.add(tag)
                                    tagDraft = ""
                                },
                                enabled = tagDraft.isNotBlank(),
                            ) { Text("Add") }
                        }
                        if (tags.isNotEmpty()) {
                            Spacer(Modifier.height(10.dp))
                            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                tags.toList().forEach { tag -> TagChip(tag) { tags.remove(tag) } }
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
                        Spacer(Modifier.height(16.dp))
                        Text(
                            "Google preview",
                            style = MaterialTheme.typography.labelLarge,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Spacer(Modifier.height(8.dp))
                        SearchResultPreview(
                            title = seoTitle,
                            description = seoDescription,
                            url = "${vm.repo.store.config.siteUrl.removePrefix("https://")}/blog/${
                                slug.ifBlank { slugFrom(title) }
                            }",
                            fallbackTitle = title,
                            fallbackDescription = excerpt,
                        )
                    }
                }

                Spacer(Modifier.height(16.dp))
                Button(
                    onClick = { save() },
                    enabled = !runner.busy && title.isNotBlank(),
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                ) { Text(if (status == "published") "Publish article" else "Save draft") }

                if (detail.id.isNotBlank()) {
                    Spacer(Modifier.height(10.dp))
                    TextButton(
                        onClick = { confirmDelete = true },
                        enabled = !runner.busy,
                        modifier = Modifier.fillMaxWidth(),
                    ) { Text("Delete article", color = MaterialTheme.colorScheme.error) }
                }
            }
        }

        if (confirmDelete) {
            ConfirmDialog(
                title = "Delete “${detail.title}”?",
                message = "This cannot be undone.",
                onConfirm = {
                    runner.run(onSuccess = { nav.back() }) { vm.repo.deletePosts(listOf(detail.id)) }
                },
                onDismiss = { confirmDelete = false },
            )
        }
    }
}
