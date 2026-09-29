package com.iphoneduowallpaper.admin.data

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.ImageDecoder
import android.graphics.Paint
import android.graphics.Rect
import android.media.ExifInterface
import android.net.Uri
import android.os.Build
import android.provider.OpenableColumns
import java.io.ByteArrayOutputStream
import java.io.InputStream
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

/**
 * The phone-side twin of the panel's browser pipeline: decode a picked image,
 * derive a preview and a 9:16 thumbnail, and read its dominant colour. The
 * original file is never re-encoded — it streams to R2 as picked.
 */
object ImagePipeline {

    private const val PREVIEW_WIDTH = 1080
    private const val PREVIEW_HEIGHT = 2340
    private const val THUMB_WIDTH = 540
    private const val THUMB_HEIGHT = 960
    private const val MAX_MEGAPIXELS = 64
    const val MAX_ORIGINAL_BYTES = 40L * 1024 * 1024

    val ACCEPTED_TYPES = setOf("image/jpeg", "image/png", "image/webp", "image/avif")

    data class Source(
        val uri: Uri,
        val displayName: String,
        val mimeType: String,
        val size: Long,
    )

    data class Processed(
        val width: Int,
        val height: Int,
        val preview: ByteArray,
        val thumb: ByteArray,
        val dominantColor: String,
    )

    /** Reads name, type and size for a picked image, or an explanation of why it cannot be used. */
    fun readSource(context: Context, uri: Uri): Result<Source> {
        val resolver = context.contentResolver
        var name = "wallpaper"
        var size = 0L
        runCatching {
            resolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE), null, null, null)
                ?.use { cursor ->
                    if (cursor.moveToFirst()) {
                        val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                        val sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE)
                        if (nameIndex >= 0 && !cursor.isNull(nameIndex)) name = cursor.getString(nameIndex)
                        if (sizeIndex >= 0 && !cursor.isNull(sizeIndex)) size = cursor.getLong(sizeIndex)
                    }
                }
        }

        if (size <= 0L) {
            size = runCatching {
                resolver.openInputStream(uri)?.use { countBytes(it) } ?: 0L
            }.getOrDefault(0L)
        }

        val mimeType = resolver.getType(uri) ?: mimeFromName(name)
        if (mimeType !in ACCEPTED_TYPES) {
            return Result.failure(IllegalArgumentException("$name is not a JPG, PNG, WebP or AVIF image."))
        }
        if (size <= 0L) {
            return Result.failure(IllegalArgumentException("$name could not be read."))
        }
        if (size > MAX_ORIGINAL_BYTES) {
            return Result.failure(IllegalArgumentException("$name is larger than 40 MB."))
        }
        return Result.success(Source(uri, name, mimeType, size))
    }

    /** Decodes the image and derives the preview, thumbnail and dominant colour. */
    fun process(context: Context, source: Source): Result<Processed> = runCatching {
        var originalWidth = 0
        var originalHeight = 0

        val decoded = ImageDecoder.decodeBitmap(
            ImageDecoder.createSource(context.contentResolver, source.uri),
        ) { decoder, info, _ ->
            originalWidth = info.size.width
            originalHeight = info.size.height
            require(originalWidth.toLong() * originalHeight / 1_000_000 <= MAX_MEGAPIXELS) {
                "${source.displayName} is larger than $MAX_MEGAPIXELS megapixels. Please resize it first."
            }
            decoder.allocator = ImageDecoder.ALLOCATOR_SOFTWARE
            decoder.isMutableRequired = false
            // Decoding at roughly preview size keeps even 50 MP photos inside the heap.
            decoder.setTargetSampleSize(sampleSizeFor(originalWidth, originalHeight))
        }

        try {
            // ImageDecoder applies EXIF rotation; keep the recorded size in the same orientation.
            if (decoded.width != decoded.height &&
                (originalWidth > originalHeight) != (decoded.width > decoded.height)
            ) {
                val swap = originalWidth
                originalWidth = originalHeight
                originalHeight = swap
            }

            val previewScale = minOf(
                1f,
                PREVIEW_WIDTH.toFloat() / originalWidth,
                PREVIEW_HEIGHT.toFloat() / originalHeight,
            )
            val previewBitmap = resample(
                decoded,
                Rect(0, 0, decoded.width, decoded.height),
                max(1, (originalWidth * previewScale).roundToInt()),
                max(1, (originalHeight * previewScale).roundToInt()),
            )

            val ratio = THUMB_WIDTH.toFloat() / THUMB_HEIGHT
            var cropWidth = decoded.width
            var cropHeight = decoded.height
            if (decoded.width.toFloat() / decoded.height > ratio) {
                cropWidth = (decoded.height * ratio).roundToInt()
            } else {
                cropHeight = (decoded.width / ratio).roundToInt()
            }
            val left = (decoded.width - cropWidth) / 2
            val top = (decoded.height - cropHeight) / 2
            val thumbScale = min(1f, THUMB_WIDTH.toFloat() / cropWidth)
            val thumbBitmap = resample(
                decoded,
                Rect(left, top, left + cropWidth, top + cropHeight),
                max(1, (cropWidth * thumbScale).roundToInt()),
                max(1, (cropHeight * thumbScale).roundToInt()),
            )

            val result = Processed(
                width = originalWidth,
                height = originalHeight,
                preview = encodeWebp(previewBitmap, 86),
                thumb = encodeWebp(thumbBitmap, 80),
                dominantColor = averageColor(decoded),
            )
            if (previewBitmap !== decoded) previewBitmap.recycle()
            if (thumbBitmap !== decoded) thumbBitmap.recycle()
            result
        } finally {
            decoded.recycle()
        }
    }

    fun openOriginal(context: Context, source: Source): InputStream? =
        context.contentResolver.openInputStream(source.uri)

    /**
     * Pixel size without decoding the pixels, so the upload screen can warn about a wallpaper that
     * is too small for the phone it is meant for while it is still just a row in a list. Reported in
     * the orientation the image is displayed in, which is what `process` records.
     */
    fun readDimensions(context: Context, uri: Uri): Pair<Int, Int>? {
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        runCatching {
            context.contentResolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it, null, bounds) }
        }
        if (bounds.outWidth <= 0 || bounds.outHeight <= 0) return null

        val quarterTurn = runCatching {
            context.contentResolver.openInputStream(uri)?.use { stream ->
                when (
                    ExifInterface(stream).getAttributeInt(
                        ExifInterface.TAG_ORIENTATION,
                        ExifInterface.ORIENTATION_NORMAL,
                    )
                ) {
                    ExifInterface.ORIENTATION_ROTATE_90,
                    ExifInterface.ORIENTATION_ROTATE_270,
                    ExifInterface.ORIENTATION_TRANSPOSE,
                    ExifInterface.ORIENTATION_TRANSVERSE,
                    -> true
                    else -> false
                }
            }
        }.getOrNull() ?: false

        return if (quarterTurn) bounds.outHeight to bounds.outWidth else bounds.outWidth to bounds.outHeight
    }

    /** "sunset_glow-1320x2868.jpg" -> "Sunset Glow" */
    fun titleFromFilename(name: String): String {
        val base = name
            .replace(Regex("\\.[^.]+$"), "")
            .replace(Regex("\\b\\d{3,5}\\s*[x×]\\s*\\d{3,5}\\b", RegexOption.IGNORE_CASE), " ")
            .replace(Regex("[_\\-.]+"), " ")
            .replace(Regex("\\s+"), " ")
            .trim()
        val title = (base.ifEmpty { "Wallpaper" })
            .split(" ")
            .joinToString(" ") { word -> word.replaceFirstChar { it.uppercaseChar() } }
        return if (title.length < 2) "Wallpaper" else title.take(120)
    }

    // -------------------------------------------------------------- internals

    private fun sampleSizeFor(width: Int, height: Int): Int {
        var sample = 1
        while (width / (sample * 2) >= PREVIEW_WIDTH && height / (sample * 2) >= PREVIEW_HEIGHT) {
            sample *= 2
        }
        return sample
    }

    /** Halving steps first, like the panel does, for a noticeably sharper result. */
    private fun resample(source: Bitmap, crop: Rect, targetWidth: Int, targetHeight: Int): Bitmap {
        val paint = Paint(Paint.FILTER_BITMAP_FLAG or Paint.ANTI_ALIAS_FLAG)
        var current = source
        var region = Rect(crop)
        var ownsCurrent = false

        while (region.width() / 2 >= targetWidth && region.height() / 2 >= targetHeight) {
            val step = Bitmap.createBitmap(region.width() / 2, region.height() / 2, Bitmap.Config.ARGB_8888)
            Canvas(step).drawBitmap(current, region, Rect(0, 0, step.width, step.height), paint)
            if (ownsCurrent) current.recycle()
            current = step
            ownsCurrent = true
            region = Rect(0, 0, step.width, step.height)
        }

        val output = Bitmap.createBitmap(targetWidth, targetHeight, Bitmap.Config.ARGB_8888)
        Canvas(output).drawBitmap(current, region, Rect(0, 0, targetWidth, targetHeight), paint)
        if (ownsCurrent) current.recycle()
        return output
    }

    private fun averageColor(bitmap: Bitmap): String {
        val small = Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888)
        Canvas(small).drawBitmap(
            bitmap,
            Rect(0, 0, bitmap.width, bitmap.height),
            Rect(0, 0, 16, 16),
            Paint(Paint.FILTER_BITMAP_FLAG),
        )
        val pixels = IntArray(16 * 16)
        small.getPixels(pixels, 0, 16, 0, 0, 16, 16)
        small.recycle()

        var red = 0L
        var green = 0L
        var blue = 0L
        var count = 0
        for (pixel in pixels) {
            if ((pixel ushr 24 and 0xFF) < 16) continue
            red += (pixel shr 16) and 0xFF
            green += (pixel shr 8) and 0xFF
            blue += pixel and 0xFF
            count++
        }
        if (count == 0) return "#1d1d1f"
        return "#%02x%02x%02x".format(red / count, green / count, blue / count)
    }

    private fun encodeWebp(bitmap: Bitmap, quality: Int): ByteArray {
        val output = ByteArrayOutputStream()
        val format = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            Bitmap.CompressFormat.WEBP_LOSSY
        } else {
            @Suppress("DEPRECATION")
            Bitmap.CompressFormat.WEBP
        }
        bitmap.compress(format, quality, output)
        return output.toByteArray()
    }

    private fun mimeFromName(name: String): String = when (name.substringAfterLast('.', "").lowercase()) {
        "jpg", "jpeg" -> "image/jpeg"
        "png" -> "image/png"
        "webp" -> "image/webp"
        "avif" -> "image/avif"
        else -> ""
    }

    private fun countBytes(stream: InputStream): Long {
        val buffer = ByteArray(64 * 1024)
        var total = 0L
        while (true) {
            val read = stream.read(buffer)
            if (read <= 0) break
            total += read
        }
        return total
    }
}
