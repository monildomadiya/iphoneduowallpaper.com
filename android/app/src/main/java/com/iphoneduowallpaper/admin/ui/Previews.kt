package com.iphoneduowallpaper.admin.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** How the page is likely to look in Google's results. */
@Composable
fun SearchResultPreview(
    title: String,
    description: String,
    url: String,
    fallbackTitle: String,
    fallbackDescription: String,
) {
    val shownTitle = title.ifBlank { fallbackTitle }.ifBlank { "Untitled" }
    val shownDescription = description.ifBlank { fallbackDescription }
        .ifBlank { "Add a description so Google has something to show." }

    Column {
        Text(
            url,
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        Spacer(Modifier.height(2.dp))
        Text(
            truncate(shownTitle, 60),
            style = MaterialTheme.typography.titleSmall.copy(fontSize = 17.sp),
            color = MaterialTheme.colorScheme.primary,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
        )
        Spacer(Modifier.height(3.dp))
        Text(
            truncate(shownDescription, 160),
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            maxLines = 3,
            overflow = TextOverflow.Ellipsis,
        )
    }
}

private fun truncate(text: String, max: Int): String =
    if (text.length <= max) text else text.take(max - 1).substringBeforeLast(' ') + "…"

/**
 * A structural preview of the article's Markdown — headings, lists, quotes and
 * inline emphasis, which is enough to catch a broken heading level on a phone.
 */
@Composable
fun MarkdownPreview(markdown: String, modifier: Modifier = Modifier) {
    val blocks = remember(markdown) { splitBlocks(markdown) }

    if (blocks.isEmpty()) {
        Text(
            "Nothing to preview yet.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        return
    }

    Column(modifier.fillMaxWidth()) {
        blocks.forEach { block ->
            when (block) {
                is MdBlock.Heading -> {
                    Spacer(Modifier.height(if (block.level <= 2) 12.dp else 8.dp))
                    Text(
                        block.text,
                        style = when (block.level) {
                            1 -> MaterialTheme.typography.titleLarge
                            2 -> MaterialTheme.typography.titleMedium
                            else -> MaterialTheme.typography.titleSmall
                        },
                    )
                    Spacer(Modifier.height(4.dp))
                }

                is MdBlock.Bullet -> Row(Modifier.padding(vertical = 2.dp)) {
                    Text("•", style = MaterialTheme.typography.bodyMedium)
                    Spacer(Modifier.width(8.dp))
                    Text(inline(block.text), style = MaterialTheme.typography.bodyMedium)
                }

                is MdBlock.Numbered -> Row(Modifier.padding(vertical = 2.dp)) {
                    Text("${block.index}.", style = MaterialTheme.typography.bodyMedium)
                    Spacer(Modifier.width(8.dp))
                    Text(inline(block.text), style = MaterialTheme.typography.bodyMedium)
                }

                is MdBlock.Quote -> Row(Modifier.padding(vertical = 4.dp)) {
                    Text("│", color = MaterialTheme.colorScheme.primary)
                    Spacer(Modifier.width(8.dp))
                    Text(
                        inline(block.text),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }

                is MdBlock.Code -> Text(
                    block.text,
                    style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace),
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(vertical = 6.dp),
                )

                is MdBlock.Paragraph -> Text(
                    inline(block.text),
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.padding(vertical = 4.dp),
                )
            }
        }
    }
}

private sealed interface MdBlock {
    data class Heading(val level: Int, val text: String) : MdBlock
    data class Paragraph(val text: String) : MdBlock
    data class Bullet(val text: String) : MdBlock
    data class Numbered(val index: Int, val text: String) : MdBlock
    data class Quote(val text: String) : MdBlock
    data class Code(val text: String) : MdBlock
}

private fun splitBlocks(markdown: String): List<MdBlock> {
    val blocks = mutableListOf<MdBlock>()
    val paragraph = StringBuilder()
    var inCode = false
    val code = StringBuilder()
    var listIndex = 0

    fun flushParagraph() {
        if (paragraph.isNotBlank()) blocks.add(MdBlock.Paragraph(paragraph.toString().trim()))
        paragraph.setLength(0)
    }

    for (raw in markdown.lines()) {
        val line = raw.trimEnd()

        if (line.trimStart().startsWith("```")) {
            if (inCode) {
                blocks.add(MdBlock.Code(code.toString().trimEnd()))
                code.setLength(0)
            } else {
                flushParagraph()
            }
            inCode = !inCode
            continue
        }
        if (inCode) {
            code.appendLine(line)
            continue
        }

        val trimmed = line.trimStart()
        when {
            trimmed.isEmpty() -> {
                flushParagraph()
                listIndex = 0
            }

            trimmed.startsWith("#") -> {
                flushParagraph()
                val level = trimmed.takeWhile { it == '#' }.length.coerceIn(1, 6)
                blocks.add(MdBlock.Heading(level, trimmed.drop(level).trim()))
            }

            trimmed.startsWith("> ") -> {
                flushParagraph()
                blocks.add(MdBlock.Quote(trimmed.removePrefix("> ").trim()))
            }

            trimmed.startsWith("- ") || trimmed.startsWith("* ") -> {
                flushParagraph()
                blocks.add(MdBlock.Bullet(trimmed.drop(2).trim()))
            }

            trimmed.firstOrNull()?.isDigit() == true && trimmed.contains(". ") -> {
                flushParagraph()
                listIndex++
                blocks.add(MdBlock.Numbered(listIndex, trimmed.substringAfter(". ").trim()))
            }

            else -> {
                if (paragraph.isNotEmpty()) paragraph.append(' ')
                paragraph.append(trimmed)
            }
        }
    }
    flushParagraph()
    if (inCode && code.isNotBlank()) blocks.add(MdBlock.Code(code.toString().trimEnd()))
    return blocks
}

/** Bold, italic, inline code and link text. Unmatched markers are left alone. */
private fun inline(text: String) = buildAnnotatedString {
    var index = 0
    while (index < text.length) {
        val rest = text.substring(index)
        val bold = markerSpan(rest, "**")
        val code = markerSpan(rest, "`")
        val italic = markerSpan(rest, "*")
        val link = linkSpan(rest)

        when {
            bold != null -> {
                withSpan(SpanStyle(fontWeight = FontWeight.SemiBold)) { append(bold.first) }
                index += bold.second
            }
            code != null -> {
                withSpan(SpanStyle(fontFamily = FontFamily.Monospace)) { append(code.first) }
                index += code.second
            }
            link != null -> {
                withSpan(SpanStyle(textDecoration = TextDecoration.Underline)) { append(link.first) }
                index += link.second
            }
            italic != null -> {
                withSpan(SpanStyle(fontStyle = FontStyle.Italic)) { append(italic.first) }
                index += italic.second
            }
            else -> {
                append(text[index])
                index++
            }
        }
    }
}

private inline fun androidx.compose.ui.text.AnnotatedString.Builder.withSpan(
    style: SpanStyle,
    block: () -> Unit,
) {
    val start = length
    block()
    addStyle(style, start, length)
}

/** Returns the content between a pair of markers and how many characters it consumed. */
private fun markerSpan(text: String, marker: String): Pair<String, Int>? {
    if (!text.startsWith(marker)) return null
    val end = text.indexOf(marker, marker.length)
    if (end <= marker.length) return null
    return text.substring(marker.length, end) to (end + marker.length)
}

private fun linkSpan(text: String): Pair<String, Int>? {
    if (!text.startsWith("[")) return null
    val close = text.indexOf(']')
    if (close <= 1 || close + 1 >= text.length || text[close + 1] != '(') return null
    val paren = text.indexOf(')', close)
    if (paren < 0) return null
    return text.substring(1, close) to (paren + 1)
}
