"use client";

/* eslint-disable @next/next/no-img-element -- cover thumbnails come from R2 */
import { ExternalLink, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteTaxonomy, saveCategory, saveCollection, saveDevice } from "@/app/admin/actions/taxonomy";
import type { CategoryRow, CollectionRow, DeviceRow } from "@/lib/types";
import { cn, imageUrl, slugify } from "@/lib/utils";
import { CoverPicker } from "./cover-picker";
import { Modal, PendingButton, Switch, useConfirm } from "./client";
import { AdminEmpty, Badge, Field, buttonClass, inputClass } from "./ui";

type Kind = "categories" | "collections" | "devices";
type Row = (CategoryRow | CollectionRow | DeviceRow) & { wallpaper_count: number };

const LABELS: Record<Kind, { singular: string; path: string }> = {
  categories: { singular: "category", path: "/categories" },
  collections: { singular: "collection", path: "/collections" },
  devices: { singular: "device", path: "/devices" },
};

interface FormState {
  id: string | null;
  name: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  sortOrder: string;
  isActive: boolean;
  isFeatured: boolean;
  coverKey: string | null;
  family: string;
  screenLabel: string;
  width: string;
  height: string;
  diagonalIn: string;
  ppi: string;
}

function toForm(row: Row | null): FormState {
  const device = row as DeviceRow | null;
  const collection = row as CollectionRow | null;
  return {
    id: row?.id ?? null,
    name: row?.name ?? "",
    slug: row?.slug ?? "",
    description: row?.description ?? "",
    seoTitle: row?.seo_title ?? "",
    seoDescription: row?.seo_description ?? "",
    sortOrder: String(row?.sort_order ?? 0),
    isActive: row?.is_active ?? true,
    isFeatured: collection?.is_featured ?? false,
    coverKey: (row as CategoryRow | null)?.cover_key ?? null,
    family: device?.family ?? "iPhone",
    screenLabel: device?.screen_label ?? "",
    width: device?.width ? String(device.width) : "",
    height: device?.height ? String(device.height) : "",
    diagonalIn: device?.diagonal_in ? String(device.diagonal_in) : "",
    ppi: device?.ppi ? String(device.ppi) : "",
  };
}

export function TaxonomyManager({ kind, rows }: { kind: Kind; rows: Row[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [form, setForm] = useState<FormState | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [coverBusy, setCoverBusy] = useState(false);
  const [saving, startSaving] = useTransition();
  const label = LABELS[kind];

  function open(row: Row | null) {
    setForm(toForm(row));
    setSlugTouched(Boolean(row));
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  function save() {
    if (!form) return;
    startSaving(async () => {
      const common = {
        id: form.id,
        name: form.name,
        slug: form.slug,
        description: form.description,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        sortOrder: Number(form.sortOrder || 0),
        isActive: form.isActive,
      };
      const result =
        kind === "devices"
          ? await saveDevice({
              ...common,
              family: form.family,
              screenLabel: form.screenLabel,
              width: Number(form.width),
              height: Number(form.height),
              diagonalIn: form.diagonalIn ? Number(form.diagonalIn) : null,
              ppi: form.ppi ? Number(form.ppi) : null,
            })
          : kind === "collections"
            ? await saveCollection({ ...common, isFeatured: form.isFeatured, coverKey: form.coverKey })
            : await saveCategory({ ...common, coverKey: form.coverKey });

      if (result.ok) {
        toast.success(result.message ?? "Saved");
        setForm(null);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  async function remove(row: Row) {
    const ok = await confirm({
      title: `Delete “${row.name}”?`,
      message:
        kind === "categories"
          ? `${row.wallpaper_count} wallpaper(s) will become uncategorized. Wallpapers are not deleted.`
          : `Wallpapers will be unlinked from this ${label.singular}, not deleted.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    const result = await deleteTaxonomy(kind, row.id);
    if (result.ok) {
      toast.success("Deleted");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      <div className="mb-5 flex justify-end">
        <button type="button" className={buttonClass.primary} onClick={() => open(null)}>
          <Plus className="size-4" />
          New {label.singular}
        </button>
      </div>

      {rows.length ? (
        <div className="overflow-hidden rounded-[22px] border border-line bg-elevated shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead className="border-b border-line text-[12px] text-fg-3">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  {kind === "devices" ? <th className="px-3 py-3 font-medium">Resolution</th> : null}
                  <th className="px-3 py-3 text-right font-medium">Wallpapers</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 text-right font-medium">Order</th>
                  <th className="w-32 px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => {
                  const cover = (row as CategoryRow).cover_key;
                  return (
                    <tr key={row.id} className="hover:bg-surface/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {kind !== "devices" ? (
                            <div className="h-11 w-9 shrink-0 overflow-hidden rounded-md bg-surface">
                              {cover ? <img src={imageUrl(cover)} alt="" className="size-full object-cover" /> : null}
                            </div>
                          ) : null}
                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 font-medium">
                              {row.name}
                              {(row as CollectionRow).is_featured ? <Star className="size-3.5 fill-warning text-warning" /> : null}
                            </p>
                            <p className="text-[12px] text-fg-3">/{row.slug}</p>
                          </div>
                        </div>
                      </td>
                      {kind === "devices" ? (
                        <td className="px-3 py-3 text-fg-2">
                          {(row as DeviceRow).width} × {(row as DeviceRow).height}
                        </td>
                      ) : null}
                      <td className="px-3 py-3 text-right tabular-nums text-fg-2">{row.wallpaper_count}</td>
                      <td className="px-3 py-3">
                        <Badge tone={row.is_active ? "green" : "gray"}>{row.is_active ? "Active" : "Hidden"}</Badge>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-fg-2">{row.sort_order}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <button type="button" aria-label="Edit" onClick={() => open(row)} className="grid size-8 place-items-center rounded-full text-fg-2 hover:bg-surface hover:text-fg">
                            <Pencil className="size-4" />
                          </button>
                          {row.is_active ? (
                            <a
                              href={`${label.path}/${row.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              aria-label="View on site"
                              className="grid size-8 place-items-center rounded-full text-fg-2 hover:bg-surface hover:text-fg"
                            >
                              <ExternalLink className="size-4" />
                            </a>
                          ) : null}
                          <button type="button" aria-label="Delete" onClick={() => remove(row)} className="grid size-8 place-items-center rounded-full text-fg-2 hover:bg-danger/10 hover:text-danger">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <AdminEmpty title={`No ${kind} yet`} description={`Create your first ${label.singular} to organize wallpapers.`} />
      )}

      <Modal
        open={Boolean(form)}
        onClose={() => setForm(null)}
        title={form?.id ? `Edit ${label.singular}` : `New ${label.singular}`}
        size="lg"
        footer={
          <>
            <button type="button" className={buttonClass.secondary} onClick={() => setForm(null)}>
              Cancel
            </button>
            <PendingButton type="button" pending={saving} disabled={coverBusy} onClick={save}>
              Save
            </PendingButton>
          </>
        }
      >
        {form ? (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" htmlFor="tx-name">
                <input
                  id="tx-name"
                  value={form.name}
                  autoFocus
                  onChange={(event) => {
                    update("name", event.target.value);
                    if (!slugTouched) update("slug", slugify(event.target.value));
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="Slug" htmlFor="tx-slug" hint={`${label.path}/${form.slug || "…"}`}>
                <input
                  id="tx-slug"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    update("slug", slugify(event.target.value));
                  }}
                  className={inputClass}
                />
              </Field>
            </div>

            {kind === "devices" ? (
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Family" htmlFor="tx-family" hint="e.g. iPhone Duo">
                  <input id="tx-family" value={form.family} onChange={(event) => update("family", event.target.value)} className={inputClass} />
                </Field>
                <Field label="Screen label" htmlFor="tx-screen" hint="Optional">
                  <input id="tx-screen" value={form.screenLabel} onChange={(event) => update("screenLabel", event.target.value)} className={inputClass} />
                </Field>
                <Field label="Diagonal (inches)" htmlFor="tx-diagonal">
                  <input id="tx-diagonal" inputMode="decimal" value={form.diagonalIn} onChange={(event) => update("diagonalIn", event.target.value)} className={inputClass} />
                </Field>
                <Field label="Width (px)" htmlFor="tx-width">
                  <input id="tx-width" inputMode="numeric" value={form.width} onChange={(event) => update("width", event.target.value)} className={inputClass} />
                </Field>
                <Field label="Height (px)" htmlFor="tx-height">
                  <input id="tx-height" inputMode="numeric" value={form.height} onChange={(event) => update("height", event.target.value)} className={inputClass} />
                </Field>
                <Field label="Pixel density (ppi)" htmlFor="tx-ppi">
                  <input id="tx-ppi" inputMode="numeric" value={form.ppi} onChange={(event) => update("ppi", event.target.value)} className={inputClass} />
                </Field>
              </div>
            ) : (
              <Field label="Cover image">
                <CoverPicker value={form.coverKey} onChange={(key) => update("coverKey", key)} onBusyChange={setCoverBusy} />
              </Field>
            )}

            <Field label="Description" htmlFor="tx-description" hint="Shown on the public page. Write 1–3 helpful sentences.">
              <textarea
                id="tx-description"
                rows={3}
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                className={cn(inputClass, "resize-y")}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="SEO title" htmlFor="tx-seo-title" hint="Optional">
                <input id="tx-seo-title" value={form.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} className={inputClass} />
              </Field>
              <Field label="Sort order" htmlFor="tx-order" hint="Lower numbers appear first">
                <input id="tx-order" inputMode="numeric" value={form.sortOrder} onChange={(event) => update("sortOrder", event.target.value)} className={inputClass} />
              </Field>
            </div>
            <Field label="Meta description" htmlFor="tx-seo-description" hint="Optional, up to 160 characters">
              <textarea
                id="tx-seo-description"
                rows={2}
                value={form.seoDescription}
                onChange={(event) => update("seoDescription", event.target.value)}
                className={cn(inputClass, "resize-y")}
              />
            </Field>

            <div className="space-y-4 rounded-xl bg-surface p-4">
              <Switch label="Visible on website" checked={form.isActive} onChange={(value) => update("isActive", value)} />
              {kind === "collections" ? (
                <Switch
                  label="Featured collection"
                  description="Shown in the Collections section on the home page"
                  checked={form.isFeatured}
                  onChange={(value) => update("isFeatured", value)}
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
