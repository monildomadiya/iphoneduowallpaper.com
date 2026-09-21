package com.iphoneduowallpaper.admin.ui

import android.graphics.Bitmap
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.Image
import androidx.compose.foundation.text.KeyboardOptions
import com.iphoneduowallpaper.admin.data.ThumbLoader
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone

/** What a screen is doing right now. */
sealed interface Load<out T> {
    data object Loading : Load<Nothing>
    data class Ready<T>(val value: T) : Load<T>
    data class Failed(val message: String) : Load<Nothing>
}

@Composable
fun <T> LoadBox(
    state: Load<T>,
    onRetry: () -> Unit,
    content: @Composable (T) -> Unit,
) {
    when (state) {
        is Load.Loading -> Box(Modifier.fillMaxSize(), Alignment.Center) { CircularProgressIndicator() }
        is Load.Failed -> ErrorState(state.message, onRetry)
        is Load.Ready -> content(state.value)
    }
}

@Composable
fun ErrorState(message: String, onRetry: (() -> Unit)? = null) {
    Column(
        modifier = Modifier.fillMaxSize().padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Icon(
            imageVector = Icons.Default.Warning,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.error,
            modifier = Modifier.size(32.dp),
        )
        Spacer(Modifier.height(12.dp))
        Text(message, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        if (onRetry != null) {
            Spacer(Modifier.height(16.dp))
            Button(onClick = onRetry) { Text("Try again") }
        }
    }
}

@Composable
fun EmptyState(title: String, description: String, action: (@Composable () -> Unit)? = null) {
    Column(
        modifier = Modifier.fillMaxWidth().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(title, style = MaterialTheme.typography.titleMedium)
        Spacer(Modifier.height(6.dp))
        Text(
            description,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        if (action != null) {
            Spacer(Modifier.height(16.dp))
            action()
        }
    }
}

@Composable
fun SectionCard(
    title: String? = null,
    description: String? = null,
    modifier: Modifier = Modifier,
    bodyPadding: PaddingValues = PaddingValues(16.dp),
    content: @Composable () -> Unit,
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
        shape = RoundedCornerShape(16.dp),
    ) {
        if (title != null) {
            Column(Modifier.padding(start = 16.dp, end = 16.dp, top = 14.dp, bottom = 10.dp)) {
                Text(title, style = MaterialTheme.typography.titleMedium)
                if (description != null) {
                    Text(
                        description,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
        }
        Box(Modifier.padding(bodyPadding)) { content() }
    }
}

@Composable
fun StatTile(
    label: String,
    value: String,
    hint: String? = null,
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
) {
    Card(
        modifier = modifier.then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
        shape = RoundedCornerShape(16.dp),
    ) {
        Column(Modifier.padding(14.dp)) {
            Text(
                label.uppercase(Locale.US),
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.height(6.dp))
            Text(value, style = MaterialTheme.typography.headlineSmall)
            if (hint != null) {
                Spacer(Modifier.height(2.dp))
                Text(
                    hint,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
}

@Composable
fun Field(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String? = null,
    helper: String? = null,
    singleLine: Boolean = true,
    minLines: Int = 1,
    keyboardType: KeyboardType = KeyboardType.Text,
    isPassword: Boolean = false,
    enabled: Boolean = true,
) {
    Column(modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            label = { Text(label) },
            placeholder = placeholder?.let { { Text(it) } },
            singleLine = singleLine,
            minLines = minLines,
            enabled = enabled,
            shape = RoundedCornerShape(12.dp),
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
            visualTransformation = if (isPassword) PasswordVisualTransformation() else androidx.compose.ui.text.input.VisualTransformation.None,
            modifier = Modifier.fillMaxWidth(),
        )
        if (helper != null) {
            Text(
                helper,
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(start = 14.dp, top = 4.dp),
            )
        }
    }
}

@Composable
fun SwitchRow(
    label: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    description: String? = null,
) {
    Row(
        modifier = Modifier.fillMaxWidth().clickable { onCheckedChange(!checked) }.padding(vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(label, style = MaterialTheme.typography.bodyLarge)
            if (description != null) {
                Text(
                    description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        Spacer(Modifier.width(12.dp))
        Switch(checked = checked, onCheckedChange = onCheckedChange)
    }
}

@Composable
fun Pill(text: String, tone: Color, modifier: Modifier = Modifier) {
    Box(
        modifier
            .background(tone.copy(alpha = 0.14f), RoundedCornerShape(999.dp))
            .padding(horizontal = 8.dp, vertical = 3.dp),
    ) {
        Text(text, style = MaterialTheme.typography.labelSmall, color = tone, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
fun StatusPill(status: String, modifier: Modifier = Modifier) {
    val accents = LocalAccents.current
    when (status) {
        "published" -> Pill("Published", accents.success, modifier)
        "draft" -> Pill("Draft", MaterialTheme.colorScheme.onSurfaceVariant, modifier)
        "open", "new" -> Pill(status.replaceFirstChar { it.uppercase() }, MaterialTheme.colorScheme.primary, modifier)
        "resolved" -> Pill("Resolved", accents.success, modifier)
        else -> Pill(status.replaceFirstChar { it.uppercase() }, MaterialTheme.colorScheme.onSurfaceVariant, modifier)
    }
}

@Composable
fun ChoiceRow(
    options: List<Pair<String, String>>,
    selected: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(modifier, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        options.forEach { (value, label) ->
            FilterChip(
                selected = selected == value,
                onClick = { onSelect(value) },
                label = { Text(label) },
            )
        }
    }
}

@Composable
fun TagChip(label: String, onRemove: (() -> Unit)? = null) {
    AssistChip(
        onClick = { onRemove?.invoke() },
        label = { Text(label) },
        trailingIcon = if (onRemove != null) {
            {
                Icon(
                    Icons.Default.Close,
                    contentDescription = "Remove $label",
                    modifier = Modifier.size(16.dp),
                )
            }
        } else null,
        colors = AssistChipDefaults.assistChipColors(),
    )
}

@Composable
fun ConfirmDialog(
    title: String,
    message: String,
    confirmLabel: String = "Delete",
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = { Text(message) },
        confirmButton = {
            TextButton(onClick = { onDismiss(); onConfirm() }) {
                Text(confirmLabel, color = MaterialTheme.colorScheme.error)
            }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
    )
}

@Composable
fun RowIcon(icon: ImageVector, tint: Color = MaterialTheme.colorScheme.onSurfaceVariant) {
    Icon(icon, contentDescription = null, tint = tint, modifier = Modifier.size(18.dp))
}

/** An image from Cloudflare R2, with the wallpaper's dominant colour as the placeholder. */
@Composable
fun RemoteImage(
    url: String?,
    modifier: Modifier = Modifier,
    placeholder: Color = MaterialTheme.colorScheme.surfaceVariant,
    contentScale: ContentScale = ContentScale.Crop,
    targetWidth: Int = 360,
    contentDescription: String? = null,
) {
    val context = LocalContext.current
    var bitmap by remember(url, targetWidth) { mutableStateOf<Bitmap?>(null) }

    LaunchedEffect(url, targetWidth) {
        bitmap = null
        if (!url.isNullOrBlank()) bitmap = ThumbLoader.load(context, url, targetWidth)
    }

    Box(modifier.background(placeholder)) {
        bitmap?.let {
            Image(
                bitmap = it.asImageBitmap(),
                contentDescription = contentDescription,
                contentScale = contentScale,
                modifier = Modifier.fillMaxSize(),
            )
        }
    }
}

@Composable
fun BusyOverlay(visible: Boolean) {
    if (!visible) return
    Box(
        Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background.copy(alpha = 0.6f)),
        contentAlignment = Alignment.Center,
    ) { CircularProgressIndicator() }
}

@Composable
fun FormSpacer(height: Int = 14) = Spacer(Modifier.height(height.dp))

@Composable
fun ListDivider() = HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)

@Composable
fun KeyValueRow(label: String, value: String) {
    Row(Modifier.fillMaxWidth().heightIn(min = 32.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(
            label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.weight(1f),
        )
        Text(value, style = MaterialTheme.typography.bodyMedium)
    }
}

// ------------------------------------------------------------------ formatting

fun formatNumber(value: Long): String = String.format(Locale.US, "%,d", value)

fun formatCompact(value: Long): String = when {
    value >= 1_000_000 -> oneDecimal(value / 1_000_000.0) + "M"
    value >= 1_000 -> oneDecimal(value / 1_000.0) + "K"
    else -> value.toString()
}

private fun oneDecimal(value: Double): String =
    String.format(Locale.US, "%.1f", value).removeSuffix(".0")

fun formatBytes(bytes: Long): String {
    if (bytes <= 0) return "0 B"
    val units = listOf("B", "KB", "MB", "GB")
    var value = bytes.toDouble()
    var unit = 0
    while (value >= 1024 && unit < units.lastIndex) {
        value /= 1024
        unit++
    }
    return if (value >= 10 || unit == 0) "${value.toInt()} ${units[unit]}" else String.format(Locale.US, "%.1f %s", value, units[unit])
}

private val isoParsers = listOf(
    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
    "yyyy-MM-dd'T'HH:mm:ssXXX",
    "yyyy-MM-dd'T'HH:mm:ss.SSSSSS",
    "yyyy-MM-dd'T'HH:mm:ss",
    "yyyy-MM-dd",
)

fun formatDate(iso: String?, pattern: String = "d MMM yyyy"): String {
    if (iso.isNullOrBlank()) return ""
    for (parser in isoParsers) {
        val date = runCatching {
            SimpleDateFormat(parser, Locale.US).apply { timeZone = TimeZone.getTimeZone("UTC") }.parse(iso)
        }.getOrNull()
        if (date != null) {
            return SimpleDateFormat(pattern, Locale.US).apply { timeZone = TimeZone.getTimeZone("UTC") }.format(date)
        }
    }
    return iso.take(10)
}
