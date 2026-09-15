"use client";

/* eslint-disable @next/next/no-img-element -- admin thumbnails come from R2 */
import { ExternalLink, Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { bulkUpdateWallpapers, deleteWallpapers } from "@/app/admin/actions/wallpapers";
import type { AdminWallpaperListItem } from "@/lib/admin/queries";
import { cn, formatCompact, formatDate, imageUrl } from "@/lib/utils";
import { useConfirm } from "./client";
import { BulkBar, SelectBox, useSelection } from "./selection";
import { Badge, buttonClass } from "./ui";

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
      <div className="overflow-hidden rounded-[22px] border border-line bg-elevated shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[14px]">
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
                <th className="px-3 py-3 font-medium">Added</th>
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
                  <td className="px-2 py-2.5">
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
                          {item.is_featured ? <Star className="size-3.5 shrink-0 fill-warning text-warning" /> : null}
                        </span>
                        <span className="block text-[12px] text-fg-3">
                          {item.width} × {item.height}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-fg-2">{item.category?.name ?? "—"}</td>
                  <td className="px-3 py-2.5">
                    <Badge tone={item.status === "published" ? "green" : "gray"}>{item.status}</Badge>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-fg-2">{formatCompact(item.downloads)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-fg-2">{formatCompact(item.views)}</td>
                  <td className="px-3 py-2.5 text-fg-2">{formatDate(item.created_at, { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/wallpapers/${item.id}`} aria-label="Edit" className="grid size-8 place-items-center rounded-full text-fg-2 hover:bg-surface hover:text-fg">
                        <Pencil className="size-4" />
                      </Link>
                      {item.status === "published" ? (
                        <a
                          href={`/wallpapers/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="View on site"
                          className="grid size-8 place-items-center rounded-full text-fg-2 hover:bg-surface hover:text-fg"
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
          Publish
        </button>
        <button type="button" disabled={pending} className={buttonClass.secondary} onClick={() => run("Moved to drafts", () => bulkUpdateWallpapers(selected, { status: "draft" }))}>
          Unpublish
        </button>
        <button type="button" disabled={pending} className={buttonClass.secondary} onClick={() => run("Featured", () => bulkUpdateWallpapers(selected, { isFeatured: true }))}>
          Feature
        </button>
        <button type="button" disabled={pending} className={buttonClass.secondary} onClick={() => run("Unfeatured", () => bulkUpdateWallpapers(selected, { isFeatured: false }))}>
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
