import type { Metadata } from "next";
import { ReportList } from "@/components/admin/inbox-lists";
import { StatusTabs } from "@/components/admin/status-tabs";
import { AdminEmpty, AdminHeader, AdminPagination } from "@/components/admin/ui";
import { listReports } from "@/lib/admin/queries";
import { MANAGER_ROLES, requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { clampPage } from "@/lib/utils";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Reports" };

const OPTIONS = [
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
  { value: "all", label: "All" },
];

export default async function ReportsPage({ searchParams }: PageProps<"/admin/reports">) {
  await requireAdmin(MANAGER_ROLES);
  const params = await searchParams;
  const status = (OPTIONS.find((option) => option.value === params.status)?.value ?? "open") as
    | "open"
    | "resolved"
    | "dismissed"
    | "all";
  const page = clampPage(params.page);
  const supabase = await createSupabaseServerClient();
  const result = await listReports(supabase, status, page);

  return (
    <>
      <AdminHeader
        title="Reports"
        description="Copyright (DMCA) notices and content reports. Act on copyright notices quickly — it protects your AdSense account."
      />
      <StatusTabs basePath="/admin/reports" current={status} options={OPTIONS} />
      {result.items.length ? (
        <>
          <ReportList reports={result.items} />
          <AdminPagination
            page={result.page}
            totalPages={result.totalPages}
            href={(target) => `/admin/reports?status=${status}&page=${target}`}
          />
        </>
      ) : (
        <AdminEmpty title="No reports" description="Nothing needs your attention right now." />
      )}
    </>
  );
}
