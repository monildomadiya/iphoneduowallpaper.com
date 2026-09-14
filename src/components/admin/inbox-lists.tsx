"use client";

import { Archive, ExternalLink, Mail, MailOpen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteMessage, deleteReport, setMessageStatus, setReportStatus } from "@/app/admin/actions/inbox";
import type { ContactMessage, ContentReport } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { useConfirm } from "./client";
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
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className={cn("divide-y divide-line overflow-hidden rounded-[22px] border border-line bg-elevated shadow-card", pending && "opacity-70")}>
      {messages.map((message) => {
        const open = openId === message.id;
        return (
          <li key={message.id}>
            <button
              type="button"
              onClick={() => {
                setOpenId(open ? null : message.id);
                if (!open && message.status === "new") run(() => setMessageStatus(message.id, "read"), true);
              }}
              className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-surface/60"
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
                        run(() => deleteMessage(message.id));
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

  return (
    <ul className={cn("space-y-4", pending && "opacity-70")}>
      {reports.map((report) => (
        <li key={report.id} className="rounded-[22px] border border-line bg-elevated p-5 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
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
              className={cn(buttonClass.danger, "ml-auto")}
              onClick={async () => {
                if (await confirm({ title: "Delete report?", message: "Keep records of copyright notices when possible.", confirmLabel: "Delete", destructive: true })) {
                  run(() => deleteReport(report.id));
                }
              }}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
