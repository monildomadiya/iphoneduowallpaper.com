"use client";

/* eslint-disable @next/next/no-img-element -- admin thumbnails come from R2 */
import { ExternalLink, Pencil, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { bulkUpdateWallpapers, deleteWallpapers } from "@/app/admin/actions/wallpapers";
import type { AdminWallpaperListItem } from "@/lib/admin/queries";
import { cn, formatCompact, formatDate, imageUrl } from "@/lib/utils";
import { useConfirm } from "./client";
import { Badge, buttonClass } from "./ui";

export function WallpaperTable({ items }: { items: AdminWallpaperListItem[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  const allSelected = items.length > 0 && selected.length === items.length;

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function run(label: string, action: () => Promise<{ ok: boolean; error?: string; message?: string }>) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(result.message ?? label);
        setSelected([]);
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  }

  async function onDelete() {
    const ok = await confirm({
      title: `Delete ${selected.length} wallpaper${selected.length === 1 ? "" : "s"}?`,
      message: "The images will be permanently removed from storage. This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (ok) run("Deleted", () => deleteWallpapers(selected));
  }

  return (
    <div className="overflow-hidden rounded-[22px] border border-line bg-elevated shadow-card">
      {selected.length ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-accent/5 px-4 py-3">
          <span className="mr-2 text-[13px] font-medium">{selected.length} selected</span>
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
          <button type="button" disabled={pending} className={cn(buttonClass.danger, "ml-auto")} onClick={onDelete}>
            Delete
          </button>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[14px]">
          <thead className="border-b border-line text-[12px] font-medium text-fg-3">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allSelected}
                  onChange={() => setSelected(allSelected ? [] : items.map((item) => item.id))}
                  className="size-4 accent-[var(--accent)]"
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
              <tr key={item.id} className={cn("transition hover:bg-surface/60", selected.includes(item.id) && "bg-accent/5")}>
                <td className="px-4 py-2.5">
                  <input
                    type="checkbox"
                    aria-label={`Select ${item.title}`}
                    checked={selected.includes(item.id)}
                    onChange={() => toggle(item.id)}
                    className="size-4 accent-[var(--accent)]"
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
  );
}
