package com.iphoneduowallpaper.admin.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.iphoneduowallpaper.admin.AdminViewModel
import com.iphoneduowallpaper.admin.data.AdsSettingsForm
import com.iphoneduowallpaper.admin.data.GeneralSettingsForm
import com.iphoneduowallpaper.admin.data.SocialForm

@Composable
fun AdsSettingsScreen(vm: AdminViewModel, nav: Navigator) {
    val loader = rememberLoad(vm) { vm.repo.settings() }
    val runner = rememberActionRunner(vm)

    Column(Modifier.fillMaxSize()) {
        ScreenTopBar(title = "Ads & AdSense", onBack = { nav.back() })
        LoadBox(loader.state, loader.refresh) { data ->
            val settings = data.settings
            var enabled by remember(settings) { mutableStateOf(settings.adsense_enabled) }
            var clientId by remember(settings) { mutableStateOf(settings.adsense_client_id ?: "") }
            var autoAds by remember(settings) { mutableStateOf(settings.adsense_auto_ads) }
            var adsTxt by remember(settings) { mutableStateOf(settings.ads_txt ?: "") }
            val slots = remember(settings) {
                mutableStateMapOf<String, String>().apply { putAll(settings.ad_slots) }
            }

            Column(
                Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 28.dp),
            ) {
                SectionCard(
                    title = "AdSense",
                    description = "Paste your publisher ID, then switch ads on once Google approves the site.",
                ) {
                    Column {
                        Field(
                            "Publisher ID",
                            clientId,
                            { clientId = it },
                            placeholder = "ca-pub-1234567890123456",
                            helper = "The site-verification tag and /ads.txt follow this automatically.",
                        )
                        FormSpacer()
                        SwitchRow(
                            "Serve ads",
                            enabled,
                            { enabled = it },
                            description = "Loads the official AdSense script on public pages only.",
                        )
                        SwitchRow(
                            "Auto ads",
                            autoAds,
                            { autoAds = it },
                            description = "Let Google place ads automatically.",
                        )
                    }
                }

                Spacer(Modifier.height(12.dp))
                SectionCard(
                    title = "Placements",
                    description = "Ad unit slot IDs. Leave a placement empty to hide it.",
                ) {
                    Column {
                        data.placements.forEachIndexed { index, placement ->
                            if (index > 0) FormSpacer()
                            Field(
                                label = placement.label,
                                value = slots[placement.key] ?: "",
                                onValueChange = { slots[placement.key] = it.filter(Char::isDigit) },
                                keyboardType = KeyboardType.Number,
                            )
                        }
                    }
                }

                Spacer(Modifier.height(12.dp))
                SectionCard(title = "ads.txt", description = "Served at /ads.txt. Leave empty for the default line.") {
                    Field(
                        label = "Contents",
                        value = adsTxt,
                        onValueChange = { adsTxt = it },
                        singleLine = false,
                        minLines = 4,
                    )
                }

                Spacer(Modifier.height(16.dp))
                Button(
                    onClick = {
                        runner.run(onSuccess = { loader.refresh() }) {
                            vm.repo.saveAdsSettings(
                                AdsSettingsForm(
                                    enabled = enabled,
                                    clientId = clientId.trim(),
                                    autoAds = autoAds,
                                    slots = slots.filterValues { it.isNotBlank() }.toMap(),
                                    adsTxt = adsTxt.trim(),
                                ),
                            )
                        }
                    },
                    enabled = !runner.busy,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                ) {
                    if (runner.busy) {
                        CircularProgressIndicator(
                            Modifier.size(18.dp),
                            strokeWidth = 2.dp,
                            color = MaterialTheme.colorScheme.onPrimary,
                        )
                    } else {
                        Text("Save ad settings")
                    }
                }
            }
        }
    }
}

@Composable
fun SiteSettingsScreen(vm: AdminViewModel, nav: Navigator) {
    val loader = rememberLoad(vm) { vm.repo.settings() }
    val runner = rememberActionRunner(vm)

    Column(Modifier.fillMaxSize()) {
        ScreenTopBar(title = "Site settings", onBack = { nav.back() })
        LoadBox(loader.state, loader.refresh) { data ->
            val settings = data.settings
            var siteName by remember(settings) { mutableStateOf(settings.site_name) }
            var tagline by remember(settings) { mutableStateOf(settings.tagline) }
            var contactEmail by remember(settings) { mutableStateOf(settings.contact_email) }
            var announcement by remember(settings) { mutableStateOf(settings.announcement ?: "") }
            var gaId by remember(settings) { mutableStateOf(settings.ga_measurement_id ?: "") }
            var cookieBanner by remember(settings) { mutableStateOf(settings.cookie_banner_enabled) }
            var legalEntity by remember(settings) { mutableStateOf(settings.legal_entity ?: "") }
            var jurisdiction by remember(settings) { mutableStateOf(settings.legal_jurisdiction) }
            val social = remember(settings) {
                mutableStateMapOf<String, String>().apply { putAll(settings.social_links) }
            }

            Column(
                Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 28.dp),
            ) {
                SectionCard(title = "Brand") {
                    Column {
                        Field("Site name", siteName, { siteName = it })
                        FormSpacer()
                        Field("Tagline", tagline, { tagline = it })
                        FormSpacer()
                        Field(
                            "Contact email",
                            contactEmail,
                            { contactEmail = it },
                            keyboardType = KeyboardType.Email,
                            helper = "Shown on the contact page — use an inbox you check.",
                        )
                        FormSpacer()
                        Field(
                            "Announcement",
                            announcement,
                            { announcement = it },
                            helper = "A short banner above the header. Leave empty to hide it.",
                        )
                    }
                }

                Spacer(Modifier.height(12.dp))
                SectionCard(title = "Analytics & privacy") {
                    Column {
                        Field(
                            "GA4 measurement ID",
                            gaId,
                            { gaId = it },
                            placeholder = "G-XXXXXXXXXX",
                        )
                        FormSpacer()
                        SwitchRow(
                            "Cookie notice",
                            cookieBanner,
                            { cookieBanner = it },
                            description = "Required in the EEA, UK and Switzerland.",
                        )
                    }
                }

                Spacer(Modifier.height(12.dp))
                SectionCard(
                    title = "Legal details",
                    description = "These appear in the Terms and Privacy Policy.",
                ) {
                    Column {
                        Field("Owner / entity", legalEntity, { legalEntity = it })
                        FormSpacer()
                        Field("Jurisdiction", jurisdiction, { jurisdiction = it })
                    }
                }

                Spacer(Modifier.height(12.dp))
                SectionCard(title = "Social links", description = "Full URLs. Leave empty to hide the icon.") {
                    Column {
                        listOf(
                            "instagram" to "Instagram",
                            "pinterest" to "Pinterest",
                            "x" to "X",
                            "youtube" to "YouTube",
                            "threads" to "Threads",
                            "facebook" to "Facebook",
                        ).forEachIndexed { index, (key, label) ->
                            if (index > 0) FormSpacer()
                            Field(
                                label = label,
                                value = social[key] ?: "",
                                onValueChange = { social[key] = it },
                                keyboardType = KeyboardType.Uri,
                                placeholder = "https://",
                            )
                        }
                    }
                }

                Spacer(Modifier.height(16.dp))
                Button(
                    onClick = {
                        runner.run(onSuccess = { loader.refresh() }) {
                            vm.repo.saveGeneralSettings(
                                GeneralSettingsForm(
                                    siteName = siteName.trim(),
                                    tagline = tagline.trim(),
                                    contactEmail = contactEmail.trim(),
                                    announcement = announcement.trim(),
                                    gaMeasurementId = gaId.trim(),
                                    cookieBannerEnabled = cookieBanner,
                                    legalEntity = legalEntity.trim(),
                                    legalJurisdiction = jurisdiction.trim(),
                                    social = SocialForm(
                                        instagram = social["instagram"].orEmpty().trim(),
                                        pinterest = social["pinterest"].orEmpty().trim(),
                                        x = social["x"].orEmpty().trim(),
                                        youtube = social["youtube"].orEmpty().trim(),
                                        threads = social["threads"].orEmpty().trim(),
                                        facebook = social["facebook"].orEmpty().trim(),
                                    ),
                                ),
                            )
                        }
                    },
                    enabled = !runner.busy,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                ) {
                    if (runner.busy) {
                        CircularProgressIndicator(
                            Modifier.size(18.dp),
                            strokeWidth = 2.dp,
                            color = MaterialTheme.colorScheme.onPrimary,
                        )
                    } else {
                        Text("Save settings")
                    }
                }
            }
        }
    }
}

@Composable
fun AccountScreen(vm: AdminViewModel, nav: Navigator) {
    val loader = rememberLoad(vm) { vm.repo.me() }
    val runner = rememberActionRunner(vm)
    var confirmSignOut by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxSize()) {
        ScreenTopBar(title = "Account", onBack = { nav.back() })
        LoadBox(loader.state, loader.refresh) { me ->
            var displayName by remember(me.admin) { mutableStateOf(me.admin.displayName ?: "") }
            var password by remember { mutableStateOf("") }
            var confirm by remember { mutableStateOf("") }

            Column(
                Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 28.dp),
            ) {
                SectionCard(title = "Profile") {
                    Column {
                        KeyValueRow("Email", me.admin.email)
                        KeyValueRow("Role", me.admin.role.replaceFirstChar { it.uppercase() })
                        FormSpacer()
                        Field("Display name", displayName, { displayName = it })
                        Spacer(Modifier.height(10.dp))
                        Button(
                            onClick = {
                                runner.run(onSuccess = { loader.refresh(); vm.refreshShell() }) {
                                    vm.repo.updateDisplayName(displayName.trim())
                                }
                            },
                            enabled = !runner.busy,
                        ) { Text("Save profile") }
                    }
                }

                Spacer(Modifier.height(12.dp))
                SectionCard(title = "Password", description = "At least 10 characters.") {
                    Column {
                        Field("New password", password, { password = it }, isPassword = true)
                        FormSpacer()
                        Field("Confirm password", confirm, { confirm = it }, isPassword = true)
                        Spacer(Modifier.height(10.dp))
                        Button(
                            onClick = {
                                runner.run(onSuccess = { password = ""; confirm = "" }) {
                                    vm.repo.changePassword(password, confirm)
                                }
                            },
                            enabled = !runner.busy && password.length >= 10 && password == confirm,
                        ) { Text("Change password") }
                    }
                }

                if (me.team.isNotEmpty()) {
                    Spacer(Modifier.height(12.dp))
                    SectionCard(title = "Team", description = "Accounts are added with the create-admin script.") {
                        Column {
                            me.team.forEach { member ->
                                KeyValueRow(
                                    member.displayName?.takeIf { it.isNotBlank() } ?: member.email,
                                    member.role.replaceFirstChar { it.uppercase() },
                                )
                            }
                        }
                    }
                }

                Spacer(Modifier.height(12.dp))
                SectionCard(title = "Connection") {
                    Column {
                        KeyValueRow("Site", vm.repo.store.baseUrl)
                        KeyValueRow("Images", vm.repo.store.config.imageBaseUrl.ifBlank { "Not configured" })
                    }
                }

                Spacer(Modifier.height(16.dp))
                TextButton(
                    onClick = { confirmSignOut = true },
                    modifier = Modifier.fillMaxWidth(),
                ) { Text("Sign out", color = MaterialTheme.colorScheme.error) }
            }
        }
    }

    if (confirmSignOut) {
        ConfirmDialog(
            title = "Sign out?",
            message = "You will need your email and password to sign back in.",
            confirmLabel = "Sign out",
            onConfirm = { vm.signOut() },
            onDismiss = { confirmSignOut = false },
        )
    }
}
