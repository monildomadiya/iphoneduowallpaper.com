import type { Metadata } from "next";
import { MessageList } from "@/components/admin/inbox-lists";
import { StatusTabs } from "@/components/admin/status-tabs";
import { AdminEmpty, AdminHeader, AdminPagination } from "@/components/admin/ui";
import { listMessages } from "@/lib/admin/queries";
import { MANAGER_ROLES, requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { clampPage } from "@/lib/utils";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Messages" };

const OPTIONS = [
  { value: "inbox", label: "Inbox" },
  { value: "new", label: "Unread" },
  { value: "archived", label: "Archived" },
  { value: "all", label: "All" },
];

export default async function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  await requireAdmin(MANAGER_ROLES);
  const params = await searchParams;
  const status = OPTIONS.find((option) => option.value === params.status)?.value ?? "inbox";
  const page = clampPage(params.page);
  const supabase = await createSupabaseServerClient();

  const result = await listMessages(supabase, status as "inbox" | "new" | "archived" | "all", page);

  return (
    <>
      <AdminHeader title="Messages" description="Messages sent through the contact form." />
      <StatusTabs basePath="/admin/messages" current={status} options={OPTIONS} />
      {result.items.length ? (
        <>
          <MessageList messages={result.items} />
          <AdminPagination
            page={result.page}
            totalPages={result.totalPages}
            href={(target) => `/admin/messages?status=${status}&page=${target}`}
          />
        </>
      ) : (
        <AdminEmpty title="No messages here" description="When visitors use the contact form, their messages appear here." />
      )}
    </>
  );
}
