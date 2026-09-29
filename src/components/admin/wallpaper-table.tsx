"use client";

/* eslint-disable @next/next/no-img-element -- admin thumbnails come from R2 */
import { ChevronRight, Download, ExternalLink, Eye, EyeOff, Globe, Pencil, Star, StarOff, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { bulkUpdateWallpapers, deleteWallpapers } from "@/app/admin/actions/wallpapers";
import type { AdminWallpaperListItem } from "@/lib/admin/queries";
import { cn, formatCompact, formatDate, imageUrl } from "@/lib/utils";
import { useConfirm } from "./client";
import { BulkBar, SelectBox, useSelection } from "./selection";
import { StatusBadge, buttonClass, iconButtonClass } from "./ui";

export function WallpaperTable({ items }: { items: AdminWallpaperListItem[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const selection = useSelection(items.map((item) => item.id));
  const { selected } = selection;
  const [pending, startTransition] = useTransition();

  function run(label: string, action: () => Promise<{ ok: boolean; error?: string; message?: string }>) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(result.message ?? label);
        selection.clear();
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  }

  async function onDelete() {
    const ids = selected;
    const ok = await confirm({
      title: `Delete ${ids.length} wallpaper${ids.length === 1 ? "" : "s"}?`,
      message: "The images will be permanently removed from storage. This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (ok) run("Deleted", () => deleteWallpapers(ids));
  }

  return (
    <>
      {/* Phones: one tappable card per wallpaper. */}
      <div className={cn("overflow-hidden rounded-[22px] border border-line bg-elevated shadow-card md:hidden", pending && "opacity-60")}>
        <label className="flex cursor-pointer items-center gap-3 border-b border-line px-4 py-3 text-[13px] font-medium text-fg-2">
          <SelectBox
            checked={selection.allSelected}
            indeterminate={selection.someSelected}
            label="Select all on this page"
            onToggle={selection.toggleAll}
          />
          Select all on this page
        </label>
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className={cn("flex items-center transition-colors", selection.isSelected(item.id) && "bg-accent/5")}>
              <label className="grid cursor-pointer place-items-center self-stretch pl-4 pr-1">
                <SelectBox
                  checked={selection.isSelected(item.id)}
                  label={`Select ${item.title}`}
                  onToggle={(range) => selection.toggle(item.id, range)}
                />
              </label>
              <Link
                href={`/admin/wallpapers/${item.id}`}
                className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-2 pr-3 active:bg-surface/70"
              >
                <img
                  src={imageUrl(item.thumb_key)}
                  alt=""
                  loading="lazy"
                  className="h-16 w-11 shrink-0 rounded-lg object-cover"
                  style={{ backgroundColor: item.dominant_color }}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[15px] font-medium">
                    <span className="truncate">{item.title}</span>
                    {item.is_featured ? <Star className="size-3.5 shrink-0 fill-warning text-warning" aria-label="Featured" /> : null}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-fg-3">
                    {item.category?.name ?? "No category"} · {formatDate(item.created_at, { month: "short", day: "numeric" })}
                  </span>
                  <span className="mt-1.5 flex items-center gap-2.5 text-[12px] text-fg-2">
                    <StatusBadge status={item.status} />
                    <span className="inline-flex items-center gap-1 tabular-nums" title="Downloads">
                      <Download className="size-3" />
                      {formatCompact(item.downloads)}
                    </span>
                    <span className="inline-flex items-center gap-1 tabular-nums" title="Views">
                      <Eye className="size-3" />
                      {formatCompact(item.views)}
                    </span>
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-fg-3" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden overflow-hidden rounded-[22px] border border-line bg-elevated shadow-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-line text-[12px] font-medium text-fg-3">
              <tr>
                <th className="w-10 px-4 py-3">
                  <SelectBox
                    checked={selection.allSelected}
                    indeterminate={selection.someSelected}
                    label="Select all on this page"
                    onToggle={selection.toggleAll}
                  />
                </th>
                <th className="px-2 py-3 font-medium">Wallpaper</th>
                <th className="px-3 py-3 font-medium">Category</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 text-right font-medium">Downloads</th>
                <th className="px-3 py-3 text-right font-medium">Views</th>
                <th className="hidden px-3 py-3 font-medium lg:table-cell">Added</th>
                <th className="w-24 px-4 py-3" />
              </tr>
            </thead>
            <tbody className={cn("divide-y divide-line", pending && "opacity-60")}>
              {items.map((item) => (
                <tr key={item.id} className={cn("transition hover:bg-surface/60", selection.isSelected(item.id) && "bg-accent/5")}>
                  <td className="px-4 py-2.5">
                    <SelectBox
                      checked={selection.isSelected(item.id)}
                      label={`Select ${item.title}`}
                      onToggle={(range) => selection.toggle(item.id, range)}
                    />
                  </td>
                  <td className="max-w-[280px] px-2 py-2.5">
                    <Link href={`/admin/wallpapers/${item.id}`} className="flex items-center gap-3">
                      <img
                        src={imageUrl(item.thumb_key)}
                        alt=""
                        loading="lazy"
                        className="h-14 w-9 shrink-0 rounded-md object-cover"
                        style={{ backgroundColor: item.dominant_color }}
                      />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="truncate">{item.title}</span>
                          {item.is_featured ? <Star className="size-3.5 shrink-0 fill-warning text-warning" aria-label="Featured" /> : null}
                        </span>
                        <span className="block text-[12px] text-fg-3">
                          {item.width} × {item.height}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-fg-2">{item.category?.name ?? "—"}</td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-fg-2">{formatCompact(item.downloads)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-fg-2">{formatCompact(item.views)}</td>
                  <td className="hidden whitespace-nowrap px-3 py-2.5 text-fg-2 lg:table-cell">
                    {formatDate(item.created_at, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/wallpapers/${item.id}`} aria-label="Edit" title="Edit" className={iconButtonClass}>
                        <Pencil className="size-4" />
                      </Link>
                      {item.status === "published" ? (
                        <a
                          href={`/wallpapers/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="View on site"
                          title="View on site"
                          className={iconButtonClass}
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BulkBar count={selected.length} onClear={selection.clear}>
        <button type="button" disabled={pending} className={buttonClass.secondary} onClick={() => run("Published", () => bulkUpdateWallpapers(selected, { status: "published" }))}>
          <Globe className="size-4" />
          Publish
        </button>
        <button type="button" disabled={pending} className={buttonClass.secondary} onClick={() => run("Moved to drafts", () => bulkUpdateWallpapers(selected, { status: "draft" }))}>
          <EyeOff className="size-4" />
          Unpublish
        </button>
        <button type="button" disabled={pending} className={buttonClass.secondary} onClick={() => run("Featured", () => bulkUpdateWallpapers(selected, { isFeatured: true }))}>
          <Star className="size-4" />
          Feature
        </button>
        <button type="button" disabled={pending} className={buttonClass.secondary} onClick={() => run("Unfeatured", () => bulkUpdateWallpapers(selected, { isFeatured: false }))}>
          <StarOff className="size-4" />
          Unfeature
        </button>
        <button type="button" disabled={pending} className={buttonClass.danger} onClick={onDelete}>
          <Trash2 className="size-4" />
          Delete
        </button>
      </BulkBar>
    </>
  );
}
