package com.iphoneduowallpaper.admin.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.iphoneduowallpaper.admin.AdminViewModel
import com.iphoneduowallpaper.admin.data.ApiResult
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(vm: AdminViewModel) {
    val scope = rememberCoroutineScope()
    var baseUrl by remember { mutableStateOf(vm.repo.store.baseUrl) }
    var email by remember { mutableStateOf(vm.repo.store.admin?.email ?: "") }
    var password by remember { mutableStateOf("") }
    var busy by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var notice by remember { mutableStateOf<String?>(null) }
    var showAddress by remember { mutableStateOf(false) }

    fun signIn() {
        if (busy) return
        error = null
        notice = null
        busy = true
        scope.launch {
            when (val result = vm.repo.signIn(baseUrl, email.trim().lowercase(), password)) {
                is ApiResult.Ok -> {
                    password = ""
                    busy = false
                    vm.onSignedIn()
                }
                is ApiResult.Err -> {
                    error = result.message
                    busy = false
                }
            }
        }
    }

    fun forgotPassword() {
        if (busy || email.isBlank()) {
            error = "Enter your email address first."
            return
        }
        error = null
        busy = true
        scope.launch {
            val result = vm.repo.requestPasswordReset(baseUrl, email.trim().lowercase())
            busy = false
            when (result) {
                is ApiResult.Ok -> notice = result.message
                    ?: "If that email belongs to an admin, a reset link is on its way."
                is ApiResult.Err -> error = result.message
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .imePadding()
            .padding(horizontal = 24.dp, vertical = 40.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Spacer(Modifier.height(24.dp))
        Text("iPhoneDuoWallpaper", style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(4.dp))
        Text(
            "Admin panel",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(32.dp))

        Field(
            label = "Email",
            value = email,
            onValueChange = { email = it },
            keyboardType = KeyboardType.Email,
            enabled = !busy,
        )
        FormSpacer()
        Field(
            label = "Password",
            value = password,
            onValueChange = { password = it },
            keyboardType = KeyboardType.Password,
            isPassword = true,
            enabled = !busy,
        )

        if (showAddress) {
            FormSpacer()
            Field(
                label = "Site address",
                value = baseUrl,
                onValueChange = { baseUrl = it },
                keyboardType = KeyboardType.Uri,
                helper = "The admin panel this app talks to.",
                enabled = !busy,
            )
        }

        if (error != null) {
            Spacer(Modifier.height(14.dp))
            Text(error!!, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.error)
        }
        if (notice != null) {
            Spacer(Modifier.height(14.dp))
            Text(
                notice!!,
                style = MaterialTheme.typography.bodySmall,
                color = LocalAccents.current.success,
            )
        }

        Spacer(Modifier.height(22.dp))
        Button(
            onClick = { signIn() },
            enabled = !busy && email.isNotBlank() && password.isNotBlank(),
            modifier = Modifier.fillMaxWidth().height(50.dp),
        ) {
            if (busy) {
                CircularProgressIndicator(
                    modifier = Modifier.size(18.dp),
                    strokeWidth = 2.dp,
                    color = MaterialTheme.colorScheme.onPrimary,
                )
            } else {
                Text("Sign in")
            }
        }

        Spacer(Modifier.height(6.dp))
        TextButton(onClick = { forgotPassword() }, enabled = !busy) { Text("Forgot password?") }
        TextButton(onClick = { showAddress = !showAddress }, enabled = !busy) {
            Text(
                if (showAddress) "Hide site address" else "Change site address",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}
