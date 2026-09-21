package com.iphoneduowallpaper.admin.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.iphoneduowallpaper.admin.data.BootstrapData
import com.iphoneduowallpaper.admin.data.WallpaperDetail
import com.iphoneduowallpaper.admin.data.WallpaperForm

val SOURCE_TYPES = listOf(
    "original" to "Original artwork",
    "ai" to "AI-assisted artwork",
    "licensed" to "Licensed",
    "public_domain" to "Public domain / CC0",
)

/** The editable wallpaper fields, shared by the editor and the upload flow. */
class WallpaperFormState(detail: WallpaperDetail? = null, defaultTitle: String = "") {
    var title by mutableStateOf(detail?.title ?: defaultTitle)
    var slug by mutableStateOf(detail?.slug ?: "")
    var description by mutableStateOf(detail?.description ?: "")
    var categoryId by mutableStateOf(detail?.category_id)
    var status by mutableStateOf(detail?.status ?: "draft")
    var isFeatured by mutableStateOf(detail?.is_featured ?: false)
    var sourceType by mutableStateOf(detail?.source_type ?: "original")
    var creditName by mutableStateOf(detail?.credit_name ?: "")
    var creditUrl by mutableStateOf(detail?.credit_url ?: "")
    var seoTitle by mutableStateOf(detail?.seo_title ?: "")
    var seoDescription by mutableStateOf(detail?.seo_description ?: "")

    val deviceIds = mutableStateListOf<String>().apply { addAll(detail?.devices?.map { it.id }.orEmpty()) }
    val collectionIds = mutableStateListOf<String>().apply {
        addAll(detail?.collections?.mapNotNull { it.id }.orEmpty())
    }
    val tags = mutableStateListOf<String>().apply { addAll(detail?.tags.orEmpty()) }

    fun toForm() = WallpaperForm(
        title = title.trim(),
        slug = slug.trim().ifBlank { null },
        description = description.trim(),
        categoryId = categoryId,
        deviceIds = deviceIds.toList(),
        collectionIds = collectionIds.toList(),
        tags = tags.toList(),
        status = status,
        isFeatured = isFeatured,
        sourceType = sourceType,
        creditName = creditName.trim(),
        creditUrl = creditUrl.trim(),
        seoTitle = seoTitle.trim(),
        seoDescription = seoDescription.trim(),
    )
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun WallpaperFormFields(state: WallpaperFormState, pickers: BootstrapData, siteUrl: String = "") {
    var tagDraft by remember { mutableStateOf("") }

    SectionCard(title = "Details") {
        Column {
            Field("Title", state.title, { state.title = it })
            FormSpacer()
            Field(
                "Slug",
                state.slug,
                { state.slug = it },
                helper = "Leave empty to build it from the title.",
            )
            FormSpacer()
            Field(
                "Description",
                state.description,
                { state.description = it },
                singleLine = false,
                minLines = 3,
                helper = "Two or three sentences help both readers and AdSense review.",
            )
            FormSpacer()
            Text("Status", style = MaterialTheme.typography.labelLarge)
            Spacer(Modifier.height(6.dp))
            ChoiceRow(
                options = listOf("draft" to "Draft", "published" to "Published"),
                selected = state.status,
                onSelect = { state.status = it },
            )
            FormSpacer()
            SwitchRow(
                label = "Featured",
                description = "Featured wallpapers lead the home page.",
                checked = state.isFeatured,
                onCheckedChange = { state.isFeatured = it },
            )
        }
    }

    Spacer(Modifier.height(12.dp))

    SectionCard(title = "Category") {
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilterChip(
                selected = state.categoryId == null,
                onClick = { state.categoryId = null },
                label = { Text("None") },
            )
            pickers.categories.forEach { option ->
                FilterChip(
                    selected = state.categoryId == option.id,
                    onClick = { state.categoryId = option.id },
                    label = { Text(option.name) },
                )
            }
        }
    }

    Spacer(Modifier.height(12.dp))

    SectionCard(title = "Devices", description = "Drives the device pages and screen-fit checks.") {
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            pickers.devices.forEach { device ->
                val on = state.deviceIds.contains(device.id)
                FilterChip(
                    selected = on,
                    onClick = { if (on) state.deviceIds.remove(device.id) else state.deviceIds.add(device.id) },
                    label = { Text(device.screen_label?.takeIf { it.isNotBlank() } ?: device.name) },
                )
            }
        }
    }

    Spacer(Modifier.height(12.dp))

    SectionCard(title = "Collections") {
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            if (pickers.collections.isEmpty()) {
                Text(
                    "No collections yet.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            pickers.collections.forEach { option ->
                val on = state.collectionIds.contains(option.id)
                FilterChip(
                    selected = on,
                    onClick = {
                        if (on) state.collectionIds.remove(option.id) else state.collectionIds.add(option.id)
                    },
                    label = { Text(option.name) },
                )
            }
        }
    }

    Spacer(Modifier.height(12.dp))

    SectionCard(title = "Tags", description = "Up to 20 short keywords.") {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Field(
                    label = "Add a tag",
                    value = tagDraft,
                    onValueChange = { tagDraft = it },
                    modifier = Modifier.weight(1f),
                )
                Spacer(Modifier.width(8.dp))
                Button(
                    onClick = {
                        val tag = tagDraft.trim().lowercase()
                        if (tag.isNotEmpty() && !state.tags.contains(tag) && state.tags.size < 20) {
                            state.tags.add(tag)
                        }
                        tagDraft = ""
                    },
                    enabled = tagDraft.isNotBlank(),
                ) { Text("Add") }
            }
            if (state.tags.isNotEmpty()) {
                Spacer(Modifier.height(10.dp))
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    state.tags.toList().forEach { tag ->
                        TagChip(tag) { state.tags.remove(tag) }
                    }
                }
            }
        }
    }

    Spacer(Modifier.height(12.dp))

    SectionCard(title = "Source & credit", description = "Only publish work you created or may share.") {
        Column {
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                SOURCE_TYPES.forEach { (value, label) ->
                    FilterChip(
                        selected = state.sourceType == value,
                        onClick = { state.sourceType = value },
                        label = { Text(label) },
                    )
                }
            }
            FormSpacer()
            Field("Credit name", state.creditName, { state.creditName = it })
            FormSpacer()
            Field(
                "Credit link",
                state.creditUrl,
                { state.creditUrl = it },
                placeholder = "https://",
            )
        }
    }

    Spacer(Modifier.height(12.dp))

    SectionCard(title = "SEO", description = "Leave empty to use the title and description.") {
        Column {
            Field("SEO title", state.seoTitle, { state.seoTitle = it }, helper = "${state.seoTitle.length}/120")
            FormSpacer()
            Field(
                "SEO description",
                state.seoDescription,
                { state.seoDescription = it },
                singleLine = false,
                minLines = 2,
                helper = "${state.seoDescription.length}/320",
            )
            Spacer(Modifier.height(16.dp))
            Text(
                "Google preview",
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.height(8.dp))
            SearchResultPreview(
                title = state.seoTitle,
                description = state.seoDescription,
                url = "${siteUrl.removePrefix("https://")}/wallpapers/${
                    state.slug.ifBlank { slugFrom(state.title) }
                }",
                fallbackTitle = state.title,
                fallbackDescription = state.description,
            )
        }
    }
}

/** A rough client-side version of the server's slugify, for the preview URL only. */
fun slugFrom(input: String): String = input
    .lowercase()
    .replace("&", " and ")
    .map { if (it.isLetterOrDigit() && it.code < 128) it else '-' }
    .joinToString("")
    .split("-")
    .filter { it.isNotEmpty() }
    .joinToString("-")
    .take(80)
