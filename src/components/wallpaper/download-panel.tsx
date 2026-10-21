import { Check, Download, Expand, FolderArchive } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "@/components/wallpaper/client-actions";
import { fill } from "@/lib/i18n/en";
import type { FileStrings } from "@/lib/i18n/types";
import type { WallpaperDetail } from "@/lib/types";
import { formatBytes } from "@/lib/utils";
import type { VariantFile, VariantName, WallpaperVariants } from "@/lib/variants/types";

export const EN_FILE_STRINGS: FileStrings = {
  pair: "Download for iPhone Duo",
  pairNote: "Outer + Inner, ZIP",
  single: "Or just one screen",
  master: "4K master",
  native: "Native {w} × {h} — fits perfectly",
  fitPerfect: "Perfect fit",
  upscaled: "{q}, AI-upscaled from {w} × {h}",
};

/** Device pages each per-device file belongs to, in the order the buttons show them. */
export const VARIANT_DEVICES: { name: Exclude<VariantName, "4k">; device: string; label: string }[] = [
  { name: "outer", device: "iphone-duo-outer-display", label: "iPhone Duo Outer Display" },
  { name: "inner", device: "iphone-duo-inner-display", label: "iPhone Duo Inner Display" },
  { name: "pro-max", device: "iphone-18-pro-max", label: "iPhone 18 Pro Max" },
  { name: "pro", device: "iphone-18-pro", label: "iPhone 18 Pro" },
];

interface Labels {
  download: string;
  viewFull: string;
  share?: { share: string; copied: string; copyFailed: string; aria: string };
  files: FileStrings;
  /** Device name for a device page slug, in the page's language. */
  deviceName: (slug: string, fallback: string) => string;
}

const href = (id: string, variant: VariantName | "zip") => `/api/download/${id}?variant=${variant}`;

function SizeButton({ id, name, file, label }: { id: string; name: VariantName; file: VariantFile; label: string }) {
  return (
    <a
      href={href(id, name)}
      rel="nofollow"
      className="flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3 transition hover:border-line-strong hover:bg-surface"
    >
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-medium">{label}</span>
        <span className="block text-[13px] text-fg-3">
          {file.width} × {file.height} px · {formatBytes(file.bytes)}
        </span>
      </span>
      <Download className="size-4 shrink-0 text-fg-2" />
    </a>
  );
}

/**
 * The download area. Once the per-device files are built it leads with the iPhone Duo pair as one
 * ZIP, then one button per screen with its exact size; before that, the single original file.
 */
export function DownloadPanel({
  wallpaper,
  title,
  path,
  labels,
}: {
  wallpaper: WallpaperDetail;
  title: string;
  path: string;
  labels: Labels;
}) {
  const files = wallpaper.variants?.files;
  const share = <ShareButton title={title} path={path} labels={labels.share} />;
  const viewFull = (
    <a href={`/api/download/${wallpaper.id}?mode=view`} rel="nofollow noopener" target="_blank" className="btn-secondary h-12">
      <Expand className="size-[18px]" />
      {labels.viewFull}
    </a>
  );

  if (!files?.zip) {
    return (
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={`/api/download/${wallpaper.id}`} rel="nofollow" className="btn-primary h-12 min-w-[220px] flex-1">
          <Download className="size-[18px]" />
          {labels.download}
          <span className="font-normal opacity-80">· {formatBytes(wallpaper.file_size)}</span>
        </a>
        {viewFull}
        {share}
      </div>
    );
  }

  const t = labels.files;
  return (
    <div className="mt-8">
      <a href={href(wallpaper.id, "zip")} rel="nofollow" className="btn-primary h-auto min-h-12 w-full flex-wrap py-3">
        <FolderArchive className="size-[18px]" />
        {t.pair}
        <span className="font-normal opacity-80">
          ({t.pairNote}) · {formatBytes(files.zip.bytes)}
        </span>
      </a>
      <p className="mt-6 text-[13px] font-semibold uppercase tracking-wide text-fg-3">{t.single}</p>
      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {VARIANT_DEVICES.map(({ name, device, label }) => {
          const file = files[name];
          return file ? (
            <SizeButton key={name} id={wallpaper.id} name={name} file={file} label={labels.deviceName(device, label)} />
          ) : null;
        })}
        {files["4k"] ? <SizeButton id={wallpaper.id} name="4k" file={files["4k"]} label={t.master} /> : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {viewFull}
        {share}
      </div>
    </div>
  );
}

/** Screen fit once every screen has a file cut to its exact size: nothing is cropped or enlarged. */
export function NativeFitList({
  variants,
  files: t,
  deviceName,
  deviceHref,
}: {
  variants: WallpaperVariants;
  files: FileStrings;
  deviceName: (slug: string, fallback: string) => string;
  deviceHref: (slug: string) => string;
}) {
  return (
    <ul className="mt-3 divide-y divide-line">
      {VARIANT_DEVICES.map(({ name, device, label }) => {
        const file = variants.files[name];
        if (!file) return null;
        return (
          <li key={name} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <Link href={deviceHref(device)} className="block truncate text-[15px] font-medium hover:text-link">
                {deviceName(device, label)}
              </Link>
              <p className="text-[13px] text-fg-3">{fill(t.native, { w: file.width, h: file.height })}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-success">
              <Check className="size-4" />
              {t.fitPerfect}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
