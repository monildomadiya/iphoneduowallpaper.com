/* eslint-disable @next/next/no-img-element -- admin thumbnails come from R2 */
import { CheckCircle2, Circle, Download, Eye, Flag, Images, Mail, Upload } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ActivityChart } from "@/components/admin/activity-chart";
import { AdminHeader, Badge, buttonClass, Card, StatCard } from "@/components/admin/ui";
import { getAdminSettings, getDashboardStats, getRecentWallpapers, getTopWallpapers } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth";
import { r2PublicUrl, siteUrl } from "@/lib/env";
import { isR2Configured, supabaseSecretKey } from "@/lib/server-env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCompact, formatDate, formatNumber, imageUrl } from "@/lib/utils";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage({ searchParams }: PageProps<"/admin">) {
  const admin = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const [stats, top, recent, settings, params] = await Promise.all([
    getDashboardStats(supabase, 30),
    getTopWallpapers(supabase, 6),
    getRecentWallpapers(supabase, 6),
    getAdminSettings(supabase),
    searchParams,
  ]);

  const checklist = [
    { label: "Database connected", done: true, href: undefined },
    { label: "Server secret key configured (forms & counters)", done: Boolean(supabaseSecretKey), href: undefined },
    { label: "Cloudflare R2 storage configured", done: isR2Configured && Boolean(r2PublicUrl), href: undefined },
    { label: "Custom domain set in NEXT_PUBLIC_SITE_URL", done: !/localhost|onrender\.com/.test(siteUrl), href: undefined },
    { label: "Privacy, Terms, Cookie, DMCA & Contact pages live", done: true, href: undefined },
    { label: `At least 30 published wallpapers (${stats.wallpapers_published})`, done: stats.wallpapers_published >= 30, href: "/admin/wallpapers/new" },
    { label: `At least 5 helpful blog posts (${stats.posts_published})`, done: stats.posts_published >= 5, href: "/admin/posts/new" },
    { label: `Categories created (${stats.categories_total})`, done: stats.categories_total > 0, href: "/admin/categories" },
    { label: "AdSense publisher ID added", done: Boolean(settings.adsense_client_id), href: "/admin/ads" },
    { label: "Ads switched on after approval", done: settings.adsense_enabled, href: "/admin/ads" },
  ];
  const completed = checklist.filter((item) => item.done).length;

  return (
    <>
      {params.denied ? (
        <p className="mb-6 rounded-xl bg-warning/10 px-4 py-3 text-[14px] text-warning">
          Your role doesn’t have access to that page.
        </p>
      ) : null}
      <AdminHeader
        title={`Welcome back${admin.displayName ? `, ${admin.displayName.split(" ")[0]}` : ""}`}
        description="Here’s how your wallpaper library is doing."
        actions={
          <Link href="/admin/wallpapers/new" className={buttonClass.primary}>
            <Upload className="size-4" />
            Upload wallpapers
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Published"
          value={formatNumber(stats.wallpapers_published)}
          hint={`${formatNumber(stats.wallpapers_draft)} drafts`}
          icon={<Images className="size-4" />}
          href="/admin/wallpapers"
        />
        <StatCard label="Downloads" value={formatCompact(stats.downloads_total)} hint="All time" icon={<Download className="size-4" />} />
        <StatCard label="Views" value={formatCompact(stats.views_total)} hint="All time" icon={<Eye className="size-4" />} />
        <StatCard
          label="Inbox"
          value={formatNumber(stats.messages_new + stats.reports_open)}
          hint={`${stats.messages_new} messages · ${stats.reports_open} reports`}
          icon={stats.reports_open ? <Flag className="size-4 text-danger" /> : <Mail className="size-4" />}
          href={stats.reports_open ? "/admin/reports" : "/admin/messages"}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card title="Last 30 days" description="Daily downloads and wallpaper views">
          <ActivityChart series={stats.series} />
        </Card>

        <Card title="AdSense readiness" description={`${completed} of ${checklist.length} complete`}>
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-success transition-all" style={{ width: `${(completed / checklist.length) * 100}%` }} />
          </div>
          <ul className="space-y-2.5">
            {checklist.map((item) => (
              <li key={item.label} className="flex items-start gap-2.5 text-[13px]">
                {item.done ? (
                  <CheckCircle2 className="mt-px size-4 shrink-0 text-success" />
                ) : (
                  <Circle className="mt-px size-4 shrink-0 text-fg-3" />
                )}
                {item.href && !item.done ? (
                  <Link href={item.href} className="text-fg hover:text-link">
                    {item.label}
                  </Link>
                ) : (
                  <span className={item.done ? "text-fg-2" : "text-fg"}>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Top wallpapers" description="Most downloaded" bodyClassName="p-2">
          {top.length ? (
            <ul className="divide-y divide-line">
              {top.map((item, index) => (
                <li key={item.id}>
                  <Link href={`/admin/wallpapers/${item.id}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-surface">
                    <span className="w-4 text-[13px] font-semibold text-fg-3">{index + 1}</span>
                    <img
                      src={imageUrl(item.thumb_key)}
                      alt=""
                      className="h-12 w-8 rounded-md object-cover"
                      style={{ backgroundColor: item.dominant_color }}
                    />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{item.title}</span>
                    <span className="text-[13px] text-fg-2">{formatCompact(Number(item.downloads))}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-10 text-center text-[14px] text-fg-3">No downloads yet.</p>
          )}
        </Card>

        <Card
          title="Recent uploads"
          actions={
            <Link href="/admin/wallpapers" className="text-[13px] text-link hover:underline">
              View all
            </Link>
          }
          bodyClassName="p-2"
        >
          {recent.length ? (
            <ul className="divide-y divide-line">
              {recent.map((item) => (
                <li key={item.id}>
                  <Link href={`/admin/wallpapers/${item.id}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-surface">
                    <img
                      src={imageUrl(item.thumb_key)}
                      alt=""
                      className="h-12 w-8 rounded-md object-cover"
                      style={{ backgroundColor: item.dominant_color }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium">{item.title}</span>
                      <span className="text-[12px] text-fg-3">{formatDate(item.created_at, { month: "short", day: "numeric", year: "numeric" })}</span>
                    </span>
                    <Badge tone={item.status === "published" ? "green" : "gray"}>{item.status}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-10 text-center">
              <p className="text-[14px] text-fg-3">Nothing uploaded yet.</p>
              <Link href="/admin/wallpapers/new" className={`${buttonClass.primary} mt-4`}>
                Upload your first wallpaper
              </Link>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
