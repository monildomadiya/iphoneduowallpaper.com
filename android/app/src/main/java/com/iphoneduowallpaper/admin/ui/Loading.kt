package com.iphoneduowallpaper.admin.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import com.iphoneduowallpaper.admin.AdminViewModel
import com.iphoneduowallpaper.admin.data.ApiResult
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

@Stable
class LoadHandle<T>(val state: Load<T>, val refresh: () -> Unit)

/** Loads a screen's data, re-running whenever `keys` change or `refresh()` is called. */
@Composable
fun <T> rememberLoad(
    vm: AdminViewModel,
    vararg keys: Any?,
    load: suspend () -> ApiResult<T>,
): LoadHandle<T> {
    var tick by remember { mutableIntStateOf(0) }
    var state by remember { mutableStateOf<Load<T>>(Load.Loading) }
    val currentLoad by rememberUpdatedState(load)

    LaunchedEffect(tick, *keys) {
        state = Load.Loading
        state = when (val result = currentLoad()) {
            is ApiResult.Ok -> Load.Ready(result.data)
            is ApiResult.Err -> {
                if (result.signedOut) vm.forceSignOut()
                Load.Failed(result.message)
            }
        }
    }

    return LoadHandle(state) { tick++ }
}

/** Runs a mutation, keeping a busy flag and surfacing the server's message. */
@Stable
class ActionRunner(private val scope: CoroutineScope, private val vm: AdminViewModel) {
    var busy by mutableStateOf(false)
        private set

    fun run(onSuccess: (String?) -> Unit = {}, block: suspend () -> ApiResult<*>) {
        if (busy) return
        busy = true
        scope.launch {
            when (val result = block()) {
                is ApiResult.Ok -> {
                    busy = false
                    result.message?.let { vm.notify(it) }
                    onSuccess(result.message)
                }
                is ApiResult.Err -> {
                    busy = false
                    vm.report(result)
                }
            }
        }
    }
}

@Composable
fun rememberActionRunner(vm: AdminViewModel): ActionRunner {
    val scope = rememberCoroutineScope()
    return remember(scope, vm) { ActionRunner(scope, vm) }
}
