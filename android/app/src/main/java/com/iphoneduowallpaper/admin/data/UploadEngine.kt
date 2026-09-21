package com.iphoneduowallpaper.admin.data

import android.content.Context
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Picks up where the browser uploader leaves off: derive the preview, thumbnail
 * and colour, then put all three objects plus the untouched original into R2.
 */
object UploadEngine {

    class UploadFailed(message: String) : Exception(message)

    /** Progress is weighted by size: the original file dominates the transfer. */
    suspend fun uploadImage(
        context: Context,
        repo: AdminRepository,
        uri: Uri,
        onStage: (String) -> Unit = {},
        onProgress: (Float) -> Unit = {},
    ): Result<ImagePayload> = runCatching {
        onStage("Reading")
        val source = ImagePipeline.readSource(context, uri).getOrThrow()

        onStage("Processing")
        val processed = withContext(Dispatchers.Default) {
            ImagePipeline.process(context, source).getOrThrow()
        }

        onStage("Preparing upload")
        val ticket = when (val result = repo.wallpaperTicket(source.mimeType, source.size)) {
            is ApiResult.Ok -> result.data
            is ApiResult.Err -> throw UploadFailed(result.message)
        }

        val originalWeight = source.size.toFloat()
        val derivedWeight = (processed.preview.size + processed.thumb.size).toFloat()
        val totalWeight = originalWeight + derivedWeight
        var completed = 0f

        onStage("Uploading")
        repo.uploadStream(
            target = ticket.original,
            length = source.size,
            onProgress = { fraction -> onProgress((completed + fraction * originalWeight) / totalWeight) },
        ) { ImagePipeline.openOriginal(context, source) }?.let { throw UploadFailed(it) }
        completed += originalWeight

        repo.upload(ticket.preview, processed.preview) { fraction ->
            onProgress((completed + fraction * processed.preview.size) / totalWeight)
        }?.let { throw UploadFailed(it) }
        completed += processed.preview.size

        repo.upload(ticket.thumb, processed.thumb) { fraction ->
            onProgress((completed + fraction * processed.thumb.size) / totalWeight)
        }?.let { throw UploadFailed(it) }

        onProgress(1f)
        ImagePayload(
            uploadId = ticket.id,
            originalKey = ticket.original.key,
            previewKey = ticket.preview.key,
            thumbKey = ticket.thumb.key,
            width = processed.width,
            height = processed.height,
            mimeType = source.mimeType,
            dominantColor = processed.dominantColor,
        )
    }

    /** A cover image for a category, collection or blog post: one 9:16 WebP. */
    suspend fun uploadCover(context: Context, repo: AdminRepository, uri: Uri): Result<String> = runCatching {
        val source = ImagePipeline.readSource(context, uri).getOrThrow()
        val processed = withContext(Dispatchers.Default) {
            ImagePipeline.process(context, source).getOrThrow()
        }
        val target = when (val result = repo.coverTicket()) {
            is ApiResult.Ok -> result.data
            is ApiResult.Err -> throw UploadFailed(result.message)
        }
        repo.upload(target, processed.thumb)?.let { throw UploadFailed(it) }
        target.key
    }

    fun describe(error: Throwable): String =
        error.message?.takeIf { it.isNotBlank() } ?: "That image could not be uploaded."
}
