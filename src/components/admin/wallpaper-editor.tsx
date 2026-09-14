"use client";

/* eslint-disable @next/next/no-img-element -- admin previews come from R2 */
import { Download, ExternalLink, Eye, ImageUp, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createUploadTicket,
  deleteWallpapers,
  replaceWallpaperImage,
  updateWallpaper,
} from "@/app/admin/actions/wallpapers";
import { detectMimeType, processImage, uploadToStorage, ACCEPTED_TYPES } from "@/lib/admin/image-client";
import { siteUrl } from "@/lib/env";
import type { WallpaperAdminRow } from "@/lib/types";
import { cn, formatBytes, formatCompact, formatDate, imageUrl, slugify } from "@/lib/utils";
import { Switch, TagInput, useConfirm } from "./client";
import { Badge, Card, Field, buttonClass, inputClass } from "./ui";
import {
  CategorySelect,
  CharCount,
  ChipMultiSelect,
  SourceSelect,
  StatusToggle,
  type TaxonomyOption,
} from "./wallpaper-fields";

export function WallpaperEditor({
  wallpaper,
  categories,
  collections,
  devices,
}: {
  wallpaper: WallpaperAdminRow;
  categories: TaxonomyOption[];
  collections: TaxonomyOption[];
  devices: TaxonomyOption[];
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, startSaving] = useTransition();
  const [replacing, setReplacing] = useState<number | null>(null);

  const [title, setTitle] = useState(wallpaper.title);
  const [slug, setSlug] = useState(wallpaper.slug);
  const [description, setDescription] = useState(wallpaper.description ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(wallpaper.category_id);
  const [deviceIds, setDeviceIds] = useState(wallpaper.devices.map((device) => device.id));
  const [collectionIds, setCollectionIds] = useState(wallpaper.collections.map((collection) => collection.id));
  const [tags, setTags] = useState(wallpaper.tags);
  const [status, setStatus] = useState(wallpaper.status);
  const [isFeatured, setIsFeatured] = useState(wallpaper.is_featured);
  const [sourceType, setSourceType] = useState(wallpaper.source_type);
  const [creditName, setCreditName] = useState(wallpaper.credit_name ?? "");
  const [creditUrl, setCreditUrl] = useState(wallpaper.credit_url ?? "");
  const [seoTitle, setSeoTitle] = useState(wallpaper.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(wallpaper.seo_description ?? "");
  const [previewKey, setPreviewKey] = useState(wallpaper.preview_key);

  const googleTitle = seoTitle || `${title} Wallpaper — ${wallpaper.width} × ${wallpaper.height}`;
  const googleDescription =
    seoDescription ||
    description ||
    `Download the ${title} wallpaper free in full ${wallpaper.width} × ${wallpaper.height} resolution for iPhone Duo, iPhone 18 Pro and more.`;

  function save() {
    startSaving(async () => {
      const result = await updateWallpaper(wallpaper.id, {
        title,
        slug,
        description,
        categoryId,
        deviceIds,
        collectionIds,
        tags,
        status,
        isFeatured,
        sourceType,
        creditName,
        creditUrl,
        seoTitle,
        seoDescription,
      });
      if (result.ok) {
        setSlug(result.data.slug);
        toast.success(result.message ?? "Saved");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  async function remove() {
    const ok = await confirm({
      title: "Delete this wallpaper?",
      message: "The wallpaper and its image files will be permanently deleted.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    const result = await deleteWallpapers([wallpaper.id]);
    if (result.ok) {
      toast.success("Wallpaper deleted");
      router.push("/admin/wallpapers");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function replaceImage(file: File) {
    const mimeType = detectMimeType(file);
    if (!ACCEPTED_TYPES.includes(mimeType)) {
      toast.error("Use a JPG, PNG, WebP or AVIF image.");
      return;
    }
    try {
      setReplacing(0.05);
      const processed = await processImage(file);
      const ticket = await createUploadTicket({
        contentType: mimeType,
        size: file.size,
        previewType: processed.preview.type as "image/webp" | "image/jpeg",
        thumbType: processed.thumb.type as "image/webp" | "image/jpeg",
      });
      if (!ticket.ok) throw new Error(ticket.error);
      const parts: [Blob, typeof ticket.data.original][] = [
        [file, ticket.data.original],
        [processed.preview, ticket.data.preview],
        [processed.thumb, ticket.data.thumb],
      ];
      const total = parts.reduce((sum, [blob]) => sum + blob.size, 0);
      const loaded = parts.map(() => 0);
      await Promise.all(
        parts.map(([blob, target], index) =>
          uploadToStorage(target, blob, (fraction) => {
            loaded[index] = fraction * blob.size;
            setReplacing(0.1 + 0.85 * (loaded.reduce((a, b) => a + b, 0) / total));
          }),
        ),
      );
      const result = await replaceWallpaperImage(wallpaper.id, {
        uploadId: ticket.data.id,
        originalKey: ticket.data.original.key,
        previewKey: ticket.data.preview.key,
        thumbKey: ticket.data.thumb.key,
        width: processed.width,
        height: processed.height,
        mimeType,
        dominantColor: processed.dominantColor,
      });
      if (!result.ok) throw new Error(result.error);
      setPreviewKey(result.data.previewKey);
      toast.success("Image replaced");
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setReplacing(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="overflow-hidden rounded-[22px] border border-line bg-elevated shadow-card">
          <div className="relative flex aspect-[3/4] items-center justify-center p-4" style={{ backgroundColor: wallpaper.dominant_color }}>
            <img src={imageUrl(previewKey)} alt={wallpaper.title} className="max-h-full max-w-full rounded-xl object-contain shadow-float" />
            {replacing !== null ? (
              <div className="absolute inset-0 grid place-items-center bg-black/55 text-white">
                <div className="text-center">
                  <Loader2 className="mx-auto size-6 animate-spin" />
                  <p className="mt-2 text-[13px]">Replacing… {Math.round(replacing * 100)}%</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="space-y-3 p-4 text-[13px]">
            <div className="flex items-center justify-between">
              <Badge tone={wallpaper.status === "published" ? "green" : "gray"}>{wallpaper.status}</Badge>
              <span className="text-fg-3">
                {wallpaper.width} × {wallpaper.height} · {formatBytes(wallpaper.file_size)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-surface p-3">
                <p className="flex items-center gap-1 text-fg-3">
                  <Download className="size-3.5" />
                  Downloads
                </p>
                <p className="mt-1 text-[17px] font-semibold">{formatCompact(wallpaper.downloads)}</p>
              </div>
              <div className="rounded-xl bg-surface p-3">
                <p className="flex items-center gap-1 text-fg-3">
                  <Eye className="size-3.5" />
                  Views
                </p>
                <p className="mt-1 text-[17px] font-semibold">{formatCompact(wallpaper.views)}</p>
              </div>
            </div>
            <p className="text-fg-3">Added {formatDate(wallpaper.created_at)}</p>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void replaceImage(file);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={replacing !== null}
              onClick={() => fileRef.current?.click()}
              className={cn(buttonClass.secondary, "w-full")}
            >
              <ImageUp className="size-4" />
              Replace image
            </button>
            {wallpaper.status === "published" ? (
              <a href={`/wallpapers/${wallpaper.slug}`} target="_blank" rel="noreferrer" className={cn(buttonClass.ghost, "w-full")}>
                <ExternalLink className="size-4" />
                View on website
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-5 pb-24">
        <Card title="Details">
          <div className="space-y-5">
            <Field label="Title" htmlFor="title">
              <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} maxLength={120} />
            </Field>
            <Field label="URL slug" htmlFor="slug" hint={`${siteUrl}/wallpapers/${slug || slugify(title)}`}>
              <div className="flex gap-2">
                <input
                  id="slug"
                  value={slug}
                  onChange={(event) => setSlug(slugify(event.target.value))}
                  className={inputClass}
                />
                <button type="button" className={buttonClass.secondary} onClick={() => setSlug(slugify(title))}>
                  From title
                </button>
              </div>
            </Field>
            <Field
              label="Description"
              htmlFor="description"
              hint="Describe colors, mood and subject in 2–3 unique sentences. Great for SEO and AdSense."
            >
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className={cn(inputClass, "resize-y")}
              />
              <div className="mt-1 text-right">
                <CharCount value={description} max={2000} />
              </div>
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category" htmlFor="category">
                <CategorySelect id="category" options={categories} value={categoryId} onChange={setCategoryId} />
              </Field>
              <Field label="Status">
                <StatusToggle value={status} onChange={setStatus} />
              </Field>
            </div>
            <Field label="Tags">
              <TagInput name="tags" defaultValue={wallpaper.tags} onChange={setTags} />
            </Field>
            <Switch label="Featured" description="Highlight on the home page" checked={isFeatured} onChange={setIsFeatured} />
          </div>
        </Card>

        <Card title="Devices & collections">
          <div className="space-y-5">
            <Field label="Fits devices">
              <ChipMultiSelect options={devices} value={deviceIds} onChange={setDeviceIds} />
            </Field>
            <Field label="Collections">
              <ChipMultiSelect options={collections} value={collectionIds} onChange={setCollectionIds} emptyLabel="No collections yet" />
            </Field>
          </div>
        </Card>

        <Card title="Source & credit" description="Only publish work you own or have permission to share.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Source" htmlFor="source">
              <SourceSelect id="source" value={sourceType} onChange={setSourceType} />
            </Field>
            <Field label="Credit name" htmlFor="credit-name">
              <input id="credit-name" value={creditName} onChange={(event) => setCreditName(event.target.value)} className={inputClass} />
            </Field>
            <Field label="Credit link" htmlFor="credit-url" className="sm:col-span-2">
              <input
                id="credit-url"
                type="url"
                value={creditUrl}
                onChange={(event) => setCreditUrl(event.target.value)}
                className={inputClass}
                placeholder="https://"
              />
            </Field>
          </div>
        </Card>

        <Card title="Search engine listing" description="Leave empty to use smart defaults.">
          <div className="mb-5 rounded-xl border border-line p-4">
            <p className="truncate text-[12px] text-fg-3">{siteUrl.replace(/^https?:\/\//, "")} › wallpapers › {slug}</p>
            <p className="mt-1 line-clamp-1 text-[18px] text-[#1a0dab] dark:text-[#8ab4f8]">{googleTitle}</p>
            <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-fg-2">{googleDescription}</p>
          </div>
          <div className="space-y-5">
            <Field label="SEO title" htmlFor="seo-title">
              <input id="seo-title" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} className={inputClass} />
              <div className="mt-1 text-right">
                <CharCount value={seoTitle} max={60} />
              </div>
            </Field>
            <Field label="Meta description" htmlFor="seo-description">
              <textarea
                id="seo-description"
                rows={3}
                value={seoDescription}
                onChange={(event) => setSeoDescription(event.target.value)}
                className={cn(inputClass, "resize-y")}
              />
              <div className="mt-1 text-right">
                <CharCount value={seoDescription} max={160} />
              </div>
            </Field>
          </div>
        </Card>
      </div>

      <div className="glass fixed inset-x-0 bottom-0 z-30 border-t border-line lg:left-64">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <button type="button" onClick={remove} className={buttonClass.danger}>
            <Trash2 className="size-4" />
            Delete
          </button>
          <div className="flex gap-2">
            <Link href="/admin/wallpapers" className={buttonClass.secondary}>
              Back
            </Link>
            <button type="button" onClick={save} disabled={saving} className={buttonClass.primary}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
