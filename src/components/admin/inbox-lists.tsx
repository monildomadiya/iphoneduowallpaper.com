"use client";

import { Archive, ExternalLink, Mail, MailOpen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteMessages, deleteReports, setMessageStatus, setReportStatus } from "@/app/admin/actions/inbox";
import type { ContactMessage, ContentReport } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { useConfirm } from "./client";
import { BulkBar, SelectBox, useSelection } from "./selection";
import { Badge, buttonClass } from "./ui";

type Result = { ok: boolean; error?: string; message?: string };

function useRun() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function run(action: () => Promise<Result>, silent = false) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) toast.error(result.error ?? "Something went wrong.");
      else if (!silent && result.message) toast.success(result.message);
      router.refresh();
    });
  }
  return { pending, run };
}

const dateOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" };

export function MessageList({ messages }: { messages: ContactMessage[] }) {
  const confirm = useConfirm();
  const { pending, run } = useRun();
  const selection = useSelection(messages.map((message) => message.id));
  const [openId, setOpenId] = useState<string | null>(null);

  async function removeSelected() {
    const ids = selection.selected;
    const title = `Delete ${ids.length} message${ids.length === 1 ? "" : "s"}?`;
    if (await confirm({ title, message: "This cannot be undone.", confirmLabel: "Delete", destructive: true })) {
      run(() => deleteMessages(ids));
    }
  }

  return (
    <>
      <div className={cn("overflow-hidden rounded-[22px] border border-line bg-elevated shadow-card", pending && "opacity-70")}>
        <label className="flex cursor-pointer items-center gap-3 border-b border-line px-5 py-2.5 text-[12px] font-medium text-fg-3">
          <SelectBox
            checked={selection.allSelected}
            indeterminate={selection.someSelected}
            label="Select all messages"
            onToggle={selection.toggleAll}
          />
          Select all
        </label>
        <ul className="divide-y divide-line">
          {messages.map((message) => {
            const open = openId === message.id;
            return (
              <li key={message.id} className={cn(selection.isSelected(message.id) && "bg-accent/5")}>
                <div className="flex items-start">
                  <div className="pl-5 pt-[18px]">
                    <SelectBox
                      checked={selection.isSelected(message.id)}
                      label={`Select message from ${message.name}`}
                      onToggle={(range) => selection.toggle(message.id, range)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenId(open ? null : message.id);
                      if (!open && message.status === "new") run(() => setMessageStatus(message.id, "read"), true);
                    }}
                    className="flex min-w-0 flex-1 items-start gap-3 px-4 py-4 text-left transition hover:bg-surface/60"
                  >
                    {message.status === "new" ? (
                      <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                    ) : (
                      <MailOpen className="mt-0.5 size-4 shrink-0 text-fg-3" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className={cn("truncate text-[14px]", message.status === "new" ? "font-semibold" : "font-medium")}>
                          {message.name} <span className="font-normal text-fg-3">· {message.email}</span>
                        </p>
                        <span className="shrink-0 text-[12px] text-fg-3">{formatDate(message.created_at, dateOptions)}</span>
                      </div>
                      <p className="mt-0.5 truncate text-[13px] text-fg-2">
                        {message.subject ? <strong className="font-medium text-fg">{message.subject} — </strong> : null}
                        {message.message}
                      </p>
                    </div>
                  </button>
                </div>
                {open ? (
                  <div className="border-t border-line bg-surface/40 px-5 py-4">
                    <p className="whitespace-pre-wrap text-[14px] leading-6">{message.message}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || "Your message"}`)}`}
                        className={buttonClass.primary}
                      >
                        Reply by email
                      </a>
                      {message.status !== "archived" ? (
                        <button type="button" className={buttonClass.secondary} onClick={() => run(() => setMessageStatus(message.id, "archived"))}>
                          <Archive className="size-4" />
                          Archive
                        </button>
                      ) : (
                        <button type="button" className={buttonClass.secondary} onClick={() => run(() => setMessageStatus(message.id, "read"))}>
                          Move to inbox
                        </button>
                      )}
                      <button
                        type="button"
                        className={buttonClass.danger}
                        onClick={async () => {
                          if (await confirm({ title: "Delete message?", message: "This cannot be undone.", confirmLabel: "Delete", destructive: true })) {
                            run(() => deleteMessages([message.id]));
                          }
                        }}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      <BulkBar count={selection.selected.length} onClear={selection.clear}>
        <button type="button" disabled={pending} className={buttonClass.danger} onClick={removeSelected}>
          <Trash2 className="size-4" />
          Delete
        </button>
      </BulkBar>
    </>
  );
}

type ReportWithWallpaper = ContentReport & { wallpaper: { id: string; title: string; slug: string } | null };

const KIND_LABELS: Record<ContentReport["kind"], string> = {
  copyright: "Copyright",
  inappropriate: "Inappropriate",
  broken: "Broken",
  other: "Other",
};

export function ReportList({ reports }: { reports: ReportWithWallpaper[] }) {
  const confirm = useConfirm();
  const { pending, run } = useRun();
  const selection = useSelection(reports.map((report) => report.id));

  async function removeSelected() {
    const ids = selection.selected;
    const title = `Delete ${ids.length} report${ids.length === 1 ? "" : "s"}?`;
    if (await confirm({ title, message: "Keep records of copyright notices when possible.", confirmLabel: "Delete", destructive: true })) {
      run(() => deleteReports(ids));
    }
  }

  return (
    <>
      <label className="mb-3 flex w-fit cursor-pointer items-center gap-3 px-5 text-[12px] font-medium text-fg-3">
        <SelectBox
          checked={selection.allSelected}
          indeterminate={selection.someSelected}
          label="Select all reports"
          onToggle={selection.toggleAll}
        />
        Select all
      </label>
      <ul className={cn("space-y-4", pending && "opacity-70")}>
        {reports.map((report) => (
          <li
            key={report.id}
            className={cn(
              "rounded-[22px] border border-line bg-elevated p-5 shadow-card",
              selection.isSelected(report.id) && "border-accent/40 bg-accent/5",
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <SelectBox
                checked={selection.isSelected(report.id)}
                label={`Select report from ${report.name}`}
                onToggle={(range) => selection.toggle(report.id, range)}
              />
              <Badge tone={report.kind === "copyright" ? "red" : "orange"}>{KIND_LABELS[report.kind]}</Badge>
              <Badge tone={report.status === "open" ? "blue" : report.status === "resolved" ? "green" : "gray"}>{report.status}</Badge>
              <span className="ml-auto text-[12px] text-fg-3">{formatDate(report.created_at, dateOptions)}</span>
            </div>
            <p className="mt-3 text-[14px] font-medium">
              {report.name} <span className="font-normal text-fg-3">· {report.email}</span>
            </p>
            <p className="mt-2 whitespace-pre-wrap text-[14px] leading-6 text-fg-2">{report.details}</p>
            <dl className="mt-3 space-y-1 text-[13px]">
              {report.wallpaper ? (
                <div className="flex gap-2">
                  <dt className="text-fg-3">Wallpaper:</dt>
                  <dd className="flex flex-wrap gap-3">
                    <Link href={`/admin/wallpapers/${report.wallpaper.id}`} className="text-link hover:underline">
                      {report.wallpaper.title}
                    </Link>
                    <a href={`/wallpapers/${report.wallpaper.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-fg-2 hover:text-fg">
                      <ExternalLink className="size-3" /> public page
                    </a>
                  </dd>
                </div>
              ) : report.page_url ? (
                <div className="flex gap-2">
                  <dt className="text-fg-3">Page:</dt>
                  <dd className="break-all">{report.page_url}</dd>
                </div>
              ) : null}
              {report.original_url && /^https?:\/\//i.test(report.original_url) ? (
                <div className="flex gap-2">
                  <dt className="text-fg-3">Original work:</dt>
                  <dd className="break-all">
                    <a href={report.original_url} target="_blank" rel="noreferrer nofollow" className="text-link hover:underline">
                      {report.original_url}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
              <a href={`mailto:${report.email}?subject=${encodeURIComponent("Regarding your report")}`} className={buttonClass.secondary}>
                Email reporter
              </a>
              {report.status === "open" ? (
                <>
                  {report.wallpaper ? (
                    <button
                      type="button"
                      className={buttonClass.primary}
                      onClick={() => run(() => setReportStatus(report.id, "resolved", { unpublishWallpaperId: report.wallpaper?.id }))}
                    >
                      Unpublish wallpaper & resolve
                    </button>
                  ) : null}
                  <button type="button" className={buttonClass.secondary} onClick={() => run(() => setReportStatus(report.id, "resolved"))}>
                    Mark resolved
                  </button>
                  <button type="button" className={buttonClass.ghost} onClick={() => run(() => setReportStatus(report.id, "dismissed"))}>
                    Dismiss
                  </button>
                </>
              ) : (
                <button type="button" className={buttonClass.ghost} onClick={() => run(() => setReportStatus(report.id, "open"))}>
                  Reopen
                </button>
              )}
              <button
                type="button"
                aria-label="Delete report"
                className={cn(buttonClass.danger, "ml-auto")}
                onClick={async () => {
                  if (await confirm({ title: "Delete report?", message: "Keep records of copyright notices when possible.", confirmLabel: "Delete", destructive: true })) {
                    run(() => deleteReports([report.id]));
                  }
                }}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <BulkBar count={selection.selected.length} onClear={selection.clear}>
        <button type="button" disabled={pending} className={buttonClass.danger} onClick={removeSelected}>
          <Trash2 className="size-4" />
          Delete
        </button>
      </BulkBar>
    </>
  );
}
