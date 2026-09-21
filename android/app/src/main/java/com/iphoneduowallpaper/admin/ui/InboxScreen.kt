package com.iphoneduowallpaper.admin.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Tab
import androidx.compose.material3.SecondaryTabRow
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.iphoneduowallpaper.admin.AdminViewModel
import com.iphoneduowallpaper.admin.data.ContactMessage
import com.iphoneduowallpaper.admin.data.ContentReport

private val REPORT_KINDS = mapOf(
    "copyright" to "Copyright",
    "broken" to "Broken file",
    "inappropriate" to "Inappropriate",
    "other" to "Other",
)

@Composable
fun InboxScreen(vm: AdminViewModel, nav: Navigator) {
    var tab by remember { mutableIntStateOf(0) }

    if (!vm.canManage) {
        Column(Modifier.fillMaxSize()) {
            ScreenTopBar(title = "Inbox")
            EmptyState(
                "No access",
                "Messages and reports are available to owners and admins.",
            )
        }
        return
    }

    Column(Modifier.fillMaxSize()) {
        ScreenTopBar(title = "Inbox")
        SecondaryTabRow(selectedTabIndex = tab, containerColor = MaterialTheme.colorScheme.background) {
            Tab(selected = tab == 0, onClick = { tab = 0 }, text = {
                Text(if (vm.inbox.messages > 0) "Messages (${vm.inbox.messages})" else "Messages")
            })
            Tab(selected = tab == 1, onClick = { tab = 1 }, text = {
                Text(if (vm.inbox.reports > 0) "Reports (${vm.inbox.reports})" else "Reports")
            })
        }
        if (tab == 0) MessagesTab(vm) else ReportsTab(vm, nav)
    }
}

@Composable
private fun MessagesTab(vm: AdminViewModel) {
    var filter by remember { mutableStateOf("inbox") }
    var page by remember { mutableIntStateOf(1) }
    val runner = rememberActionRunner(vm)
    val loader = rememberLoad(vm, filter, page) { vm.repo.messages(filter, page) }

    Column(Modifier.fillMaxSize()) {
        ChoiceRow(
            options = listOf("inbox" to "Inbox", "archived" to "Archived", "all" to "All"),
            selected = filter,
            onSelect = { filter = it; page = 1 },
            modifier = Modifier.padding(16.dp),
        )
        LoadBox(loader.state, loader.refresh) { result ->
            if (result.items.isEmpty()) {
                EmptyState("Nothing here", "Messages from the contact form land here.")
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 24.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    items(result.items.size) { index ->
                        MessageCard(
                            message = result.items[index],
                            busy = runner.busy,
                            onStatus = { status ->
                                runner.run(onSuccess = { loader.refresh(); vm.refreshShell() }) {
                                    vm.repo.setMessageStatus(result.items[index].id, status)
                                }
                            },
                            onDelete = {
                                runner.run(onSuccess = { loader.refresh(); vm.refreshShell() }) {
                                    vm.repo.deleteMessages(listOf(result.items[index].id))
                                }
                            },
                        )
                    }
                    item {
                        Pager(page, result.totalPages) { page = it }
                    }
                }
            }
        }
    }
}

/** Previous / next across a paged list. */
@Composable
private fun Pager(page: Int, totalPages: Int, onPage: (Int) -> Unit) {
    if (totalPages <= 1) return
    Row(
        Modifier.fillMaxWidth().padding(vertical = 12.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
    ) {
        TextButton(onClick = { onPage(page - 1) }, enabled = page > 1) { Text("Previous") }
        Text(
            "Page $page of $totalPages",
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        TextButton(onClick = { onPage(page + 1) }, enabled = page < totalPages) { Text("Next") }
    }
}

@Composable
private fun MessageCard(
    message: ContactMessage,
    busy: Boolean,
    onStatus: (String) -> Unit,
    onDelete: () -> Unit,
) {
    var confirmDelete by remember { mutableStateOf(false) }

    SectionCard(bodyPadding = PaddingValues(14.dp)) {
        Column {
            Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(message.name.ifBlank { "Anonymous" }, style = MaterialTheme.typography.titleSmall)
                    Text(
                        message.email,
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                StatusPill(message.status)
            }
            if (!message.subject.isNullOrBlank()) {
                Spacer(Modifier.height(8.dp))
                Text(message.subject, style = MaterialTheme.typography.bodyMedium)
            }
            Spacer(Modifier.height(6.dp))
            Text(
                message.message,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.height(6.dp))
            Text(
                formatDate(message.created_at, "d MMM yyyy, HH:mm"),
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.height(6.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                if (message.status != "read") {
                    TextButton(onClick = { onStatus("read") }, enabled = !busy) { Text("Mark read") }
                }
                if (message.status != "archived") {
                    TextButton(onClick = { onStatus("archived") }, enabled = !busy) { Text("Archive") }
                } else {
                    TextButton(onClick = { onStatus("read") }, enabled = !busy) { Text("Unarchive") }
                }
                TextButton(onClick = { confirmDelete = true }, enabled = !busy) {
                    Text("Delete", color = MaterialTheme.colorScheme.error)
                }
            }
        }
    }

    if (confirmDelete) {
        ConfirmDialog(
            title = "Delete this message?",
            message = "It is removed for everyone.",
            onConfirm = onDelete,
            onDismiss = { confirmDelete = false },
        )
    }
}

@Composable
private fun ReportsTab(vm: AdminViewModel, nav: Navigator) {
    var filter by remember { mutableStateOf("open") }
    var page by remember { mutableIntStateOf(1) }
    val runner = rememberActionRunner(vm)
    val loader = rememberLoad(vm, filter, page) { vm.repo.reports(filter, page) }

    Column(Modifier.fillMaxSize()) {
        ChoiceRow(
            options = listOf("open" to "Open", "resolved" to "Resolved", "dismissed" to "Dismissed", "all" to "All"),
            selected = filter,
            onSelect = { filter = it; page = 1 },
            modifier = Modifier.padding(16.dp),
        )
        LoadBox(loader.state, loader.refresh) { result ->
            if (result.items.isEmpty()) {
                EmptyState("Nothing here", "Copyright and content reports land here. Handle them quickly.")
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 24.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    items(result.items.size) { index ->
                        ReportCard(
                            vm = vm,
                            nav = nav,
                            report = result.items[index],
                            busy = runner.busy,
                            onStatus = { status, unpublishId ->
                                runner.run(onSuccess = { loader.refresh(); vm.refreshShell() }) {
                                    vm.repo.setReportStatus(result.items[index].id, status, unpublishId)
                                }
                            },
                            onDelete = {
                                runner.run(onSuccess = { loader.refresh(); vm.refreshShell() }) {
                                    vm.repo.deleteReports(listOf(result.items[index].id))
                                }
                            },
                        )
                    }
                    item {
                        Pager(page, result.totalPages) { page = it }
                    }
                }
            }
        }
    }
}

@Composable
private fun ReportCard(
    vm: AdminViewModel,
    nav: Navigator,
    report: ContentReport,
    busy: Boolean,
    onStatus: (String, String?) -> Unit,
    onDelete: () -> Unit,
) {
    var confirmDelete by remember { mutableStateOf(false) }

    SectionCard(bodyPadding = PaddingValues(14.dp)) {
        Column {
            Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(
                        REPORT_KINDS[report.kind] ?: "Report",
                        style = MaterialTheme.typography.titleSmall,
                        color = if (report.kind == "copyright") MaterialTheme.colorScheme.error
                        else MaterialTheme.colorScheme.onSurface,
                    )
                    Text(
                        "${report.name.ifBlank { "Anonymous" }} · ${report.email}",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                StatusPill(report.status)
            }

            Spacer(Modifier.height(8.dp))
            Text(report.details, style = MaterialTheme.typography.bodySmall)

            if (!report.original_url.isNullOrBlank()) {
                Spacer(Modifier.height(6.dp))
                Text(
                    "Original: ${report.original_url}",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }

            report.wallpaper?.let { wallpaper ->
                Spacer(Modifier.height(8.dp))
                TextButton(onClick = {
                    wallpaper.id?.let { nav.push(Screen.WallpaperEditor(it)) }
                }) { Text("Open “${wallpaper.name}”") }
            }

            Spacer(Modifier.height(4.dp))
            Text(
                formatDate(report.created_at, "d MMM yyyy, HH:mm"),
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )

            Spacer(Modifier.height(6.dp))
            Column {
                if (report.status != "resolved") {
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        TextButton(onClick = { onStatus("resolved", null) }, enabled = !busy) { Text("Resolve") }
                        TextButton(onClick = { onStatus("dismissed", null) }, enabled = !busy) { Text("Dismiss") }
                        TextButton(onClick = { confirmDelete = true }, enabled = !busy) {
                            Text("Delete", color = MaterialTheme.colorScheme.error)
                        }
                    }
                    if (report.wallpaper_id != null) {
                        TextButton(
                            onClick = { onStatus("resolved", report.wallpaper_id) },
                            enabled = !busy,
                        ) {
                            Text("Resolve & unpublish wallpaper", color = MaterialTheme.colorScheme.error)
                        }
                    }
                } else {
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        TextButton(onClick = { onStatus("open", null) }, enabled = !busy) { Text("Reopen") }
                        TextButton(onClick = { confirmDelete = true }, enabled = !busy) {
                            Text("Delete", color = MaterialTheme.colorScheme.error)
                        }
                    }
                }
            }
        }
    }

    if (confirmDelete) {
        ConfirmDialog(
            title = "Delete this report?",
            message = "Keep copyright notices until they are settled.",
            onConfirm = onDelete,
            onDismiss = { confirmDelete = false },
        )
    }
}
