package com.iphoneduowallpaper.admin.data

/**
 * The phone-side twin of `screenFit()` in `src/lib/utils.ts`. The site shows visitors how well an
 * image suits each screen; showing the same verdict while the image is still being picked is what
 * stops a wallpaper that never fitted from being published in the first place.
 */
enum class FitLevel { SHARP, GOOD, LOW, CROP }

fun screenFit(width: Int, height: Int, screenWidth: Int, screenHeight: Int): FitLevel {
    if (width <= 0 || height <= 0 || screenWidth <= 0 || screenHeight <= 0) return FitLevel.GOOD
    val scale = maxOf(screenWidth.toFloat() / width, screenHeight.toFloat() / height)
    // Cover fills the screen and throws away the overhang.
    val cropped = 1f - (screenWidth.toFloat() * screenHeight) / (width * scale * height * scale)
    return when {
        cropped > 0.35f -> FitLevel.CROP
        scale <= 1f -> FitLevel.SHARP
        scale <= 1.3f -> FitLevel.GOOD
        else -> FitLevel.LOW
    }
}

/** The devices an image of this size would disappoint, and how. */
data class FitReport(val soft: List<DeviceOption>, val cropped: List<DeviceOption>) {
    val hasProblem: Boolean get() = soft.isNotEmpty() || cropped.isNotEmpty()

    /** One line, short enough for a card: "Soft on Duo Inner · Crops on 18 Pro, 18 Pro Max". */
    fun summary(): String = buildList {
        if (soft.isNotEmpty()) add("Soft on ${soft.joinToString(", ") { it.shortName }}")
        if (cropped.isNotEmpty()) add("Crops on ${cropped.joinToString(", ") { it.shortName }}")
    }.joinToString(" · ")
}

fun fitReport(width: Int, height: Int, devices: List<DeviceOption>): FitReport {
    val soft = mutableListOf<DeviceOption>()
    val cropped = mutableListOf<DeviceOption>()
    devices.filter { it.is_active && it.width > 0 && it.height > 0 }.forEach { device ->
        when (screenFit(width, height, device.width, device.height)) {
            FitLevel.LOW -> soft.add(device)
            FitLevel.CROP -> cropped.add(device)
            else -> Unit
        }
    }
    return FitReport(soft, cropped)
}

/** "iPhone Duo Inner Display" is too long for a chip; "Duo Inner Display" reads the same. */
val DeviceOption.shortName: String
    get() = screen_label?.takeIf { it.isNotBlank() }
        ?: name.removePrefix("iPhone ").ifBlank { name }
