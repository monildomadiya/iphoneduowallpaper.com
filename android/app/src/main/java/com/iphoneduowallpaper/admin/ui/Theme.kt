package com.iphoneduowallpaper.admin.ui

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ProvidableCompositionLocal
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/** The panel's palette, ported from the site's CSS tokens. */
private val LightColors = lightColorScheme(
    primary = Color(0xFF0071E3),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFDCEBFF),
    onPrimaryContainer = Color(0xFF00305F),
    secondary = Color(0xFF6E6E73),
    onSecondary = Color.White,
    background = Color(0xFFFBFBFD),
    onBackground = Color(0xFF1D1D1F),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF1D1D1F),
    surfaceVariant = Color(0xFFF5F5F7),
    onSurfaceVariant = Color(0xFF6E6E73),
    outline = Color(0xFFD2D2D7),
    outlineVariant = Color(0xFFE8E8ED),
    error = Color(0xFFD70015),
    onError = Color.White,
    errorContainer = Color(0xFFFFE3E3),
    onErrorContainer = Color(0xFF6B0009),
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFF0A84FF),
    onPrimary = Color.White,
    primaryContainer = Color(0xFF00305F),
    onPrimaryContainer = Color(0xFFDCEBFF),
    secondary = Color(0xFFA1A1A6),
    onSecondary = Color(0xFF1D1D1F),
    background = Color(0xFF000000),
    onBackground = Color(0xFFF5F5F7),
    surface = Color(0xFF161617),
    onSurface = Color(0xFFF5F5F7),
    surfaceVariant = Color(0xFF1D1D1F),
    onSurfaceVariant = Color(0xFFA1A1A6),
    outline = Color(0xFF424245),
    outlineVariant = Color(0xFF2A2A2D),
    error = Color(0xFFFF453A),
    onError = Color(0xFF1D1D1F),
    errorContainer = Color(0xFF4A0A06),
    onErrorContainer = Color(0xFFFFD9D6),
)

/** Status colours that Material 3 has no slot for. */
data class AccentColors(val success: Color, val warning: Color)

val LocalAccents: ProvidableCompositionLocal<AccentColors> =
    staticCompositionLocalOf { AccentColors(Color(0xFF1A8B3A), Color(0xFFB35C00)) }

private val AdminTypography = Typography(
    headlineSmall = TextStyle(fontSize = 24.sp, lineHeight = 30.sp, fontWeight = FontWeight.SemiBold),
    titleLarge = TextStyle(fontSize = 20.sp, lineHeight = 26.sp, fontWeight = FontWeight.SemiBold),
    titleMedium = TextStyle(fontSize = 16.sp, lineHeight = 22.sp, fontWeight = FontWeight.SemiBold),
    titleSmall = TextStyle(fontSize = 14.sp, lineHeight = 20.sp, fontWeight = FontWeight.Medium),
    bodyLarge = TextStyle(fontSize = 16.sp, lineHeight = 24.sp),
    bodyMedium = TextStyle(fontSize = 14.sp, lineHeight = 20.sp),
    bodySmall = TextStyle(fontSize = 13.sp, lineHeight = 18.sp),
    labelLarge = TextStyle(fontSize = 14.sp, lineHeight = 18.sp, fontWeight = FontWeight.Medium),
    labelMedium = TextStyle(fontSize = 12.sp, lineHeight = 16.sp, fontWeight = FontWeight.Medium),
    labelSmall = TextStyle(fontSize = 11.sp, lineHeight = 14.sp, fontWeight = FontWeight.Medium),
)

@Composable
fun DuoAdminTheme(dark: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    val accents = if (dark) {
        AccentColors(Color(0xFF30D158), Color(0xFFFFB340))
    } else {
        AccentColors(Color(0xFF1A8B3A), Color(0xFFB35C00))
    }
    CompositionLocalProvider(LocalAccents provides accents) {
        MaterialTheme(
            colorScheme = if (dark) DarkColors else LightColors,
            typography = AdminTypography,
            content = content,
        )
    }
}
