"use client";

/* eslint-disable @next/next/no-img-element -- the crop is drawn from a local photo or the original file on R2 */
import { Check, CircleAlert, Download, ImagePlus, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DEVICE_SPECS, DeviceFrame, type ScreenMode } from "@/components/wallpaper/device-frame";
import { EN_MAKER, fill } from "@/lib/i18n/en";
import type { MakerStrings } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

type ScreenKey = "duo-outer" | "duo-inner";
type Format = "jpeg" | "png";

/** Crop centre as a fraction of the image, plus how far it is zoomed past the largest crop that fits. */
interface Framing {
  zoom: number;
  x: number;
  y: number;
}

interface Source {
  url: string;
  name: string;
  width: number;
  height: number;
  image: HTMLImageElement;
  local: boolean;
}

export interface MakerWallpaper {
  url: string;
  slug: string;
  title: string;
}

const CENTERED: Framing = { zoom: 1, x: 0.5, y: 0.5 };
const MAX_ZOOM = 4;
const MAX_FILE_BYTES = 40 * 1024 * 1024;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** The part of the source that lands on a screen: the largest crop of the screen's shape, zoomed and moved. */
function cropRect(source: Pick<Source, "width" | "height">, framing: Framing, key: ScreenKey) {
  const { width: screenW, height: screenH } = DEVICE_SPECS[key];
  let w = source.width;
  let h = source.height;
  if (w / h > screenW / screenH) w = (h * screenW) / screenH;
  else h = (w * screenH) / screenW;
  w /= framing.zoom;
  h /= framing.zoom;
  const x = clamp(framing.x * source.width - w / 2, 0, source.width - w);
  const y = clamp(framing.y * source.height - h / 2, 0, source.height - h);
  return { x, y, w, h, scale: screenW / w };
}

/** Same thresholds as the screen-fit check on wallpaper pages. */
function sharpness(scale: number, zoom: number, t: MakerStrings) {
  if (scale <= 1) return { label: t.pixelPerfect, note: t.pixelPerfectNote, ok: true };
  const enlarged = fill(t.enlarged, { n: Math.round((scale - 1) * 100) });
  if (scale <= 1.3) return { label: t.greatFit, note: enlarged, ok: true };
  const fix = zoom > 1 ? t.fixZoomOut : t.fixLarger;
  return { label: scale <= 1.8 ? t.slightlySoft : t.soft, note: `${enlarged} ${fix}`, ok: false };
}

interface Screen {
  key: ScreenKey;
  name: string;
  hint: string;
  download: string;
}

function fileBase(name: string) {
  const base = name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "wallpaper";
}

async function loadImage(url: string, crossOrigin: boolean) {
  const image = new Image();
  if (crossOrigin) image.crossOrigin = "anonymous";
  image.decoding = "async";
  image.src = url;
  await image.decode();
  return image;
}

function renderScreen(source: Source, framing: Framing, key: ScreenKey, format: Format): Promise<Blob> {
  const { width, height } = DEVICE_SPECS[key];
  const rect = cropRect(source, framing, key);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return Promise.reject(new Error("Canvas is not available"));
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  // JPEG has no transparency; without a fill, see-through parts of a PNG would turn out black anyway.
  if (format === "jpeg") {
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(source.image, rect.x, rect.y, rect.w, rect.h, 0, 0, width, height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))),
      `image/${format}`,
      0.92,
    ),
  );
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full bg-surface p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition",
            value === option.value ? "bg-white text-fg shadow-sm" : "text-fg-2 hover:text-fg",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ScreenEditor({
  screen,
  source,
  framing,
  mode,
  busy,
  onFrame,
  onDownload,
  t,
  date,
}: {
  screen: Screen;
  source: Source | null;
  framing: Framing;
  mode: ScreenMode;
  busy: boolean;
  onFrame: (framing: Framing) => void;
  onDownload: () => void;
  t: MakerStrings;
  date?: string;
}) {
  const spec = DEVICE_SPECS[screen.key];
  const drag = useRef<{ id: number; x: number; y: number; start: Framing } | null>(null);
  const rect = source ? cropRect(source, framing, screen.key) : null;
  const quality = rect ? sharpness(rect.scale, framing.zoom, t) : null;

  // Stores the centre the crop actually ended up at, so a drag past the edge doesn't build up slack.
  function moveTo(next: Framing) {
    if (!source) return;
    const r = cropRect(source, next, screen.key);
    onFrame({ zoom: next.zoom, x: (r.x + r.w / 2) / source.width, y: (r.y + r.h / 2) / source.height });
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!source) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Capture only keeps the drag alive outside the preview; dragging inside it works without.
    }
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, start: framing };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!source || !state || state.id !== event.pointerId) return;
    const box = event.currentTarget.getBoundingClientRect();
    const start = cropRect(source, state.start, screen.key);
    // Dragging the picture right shows more of its left side, so the crop moves the other way.
    const dx = ((event.clientX - state.x) / box.width) * start.w;
    const dy = ((event.clientY - state.y) / box.height) * start.h;
    moveTo({
      zoom: state.start.zoom,
      x: (start.x + start.w / 2 - dx) / source.width,
      y: (start.y + start.h / 2 - dy) / source.height,
    });
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!source || !rect) return;
    const step = event.shiftKey ? 0.1 : 0.02;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    moveTo({
      zoom: framing.zoom,
      x: (rect.x + rect.w / 2) / source.width + move[0] * step * (rect.w / source.width),
      y: (rect.y + rect.h / 2) / source.height + move[1] * step * (rect.h / source.height),
    });
  }

  const zoomId = `zoom-${screen.key}`;

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[17px] font-semibold tracking-tight">{screen.name}</h3>
        <p className="text-[13px] text-fg-3">
          {screen.hint} · {spec.width} × {spec.height}
        </p>
      </div>

      <div
        className={cn(
          "mx-auto mt-4 w-full touch-none select-none outline-none focus-visible:ring-4 focus-visible:ring-accent/40",
          screen.key === "duo-outer" ? "max-w-[260px]" : "max-w-[560px]",
          source ? "cursor-grab active:cursor-grabbing" : "",
          "rounded-[8%]",
        )}
        tabIndex={source ? 0 : -1}
        role={source ? "group" : undefined}
        aria-label={source ? fill(t.dragHint, { screen: screen.name }) : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={onKeyDown}
      >
        <DeviceFrame
          variant={screen.key}
          mode={mode}
          date={date}
          artwork={screen.key === "duo-outer" ? 0 : 2}
          screen={
            source && rect ? (
              <img
                src={source.url}
                alt=""
                draggable={false}
                className="absolute max-w-none"
                style={{
                  width: `${(source.width / rect.w) * 100}%`,
                  height: `${(source.height / rect.h) * 100}%`,
                  left: `${(-rect.x / rect.w) * 100}%`,
                  top: `${(-rect.y / rect.h) * 100}%`,
                }}
              />
            ) : undefined
          }
        />
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-center gap-3">
          <label htmlFor={zoomId} className="w-12 shrink-0 text-[13px] font-medium text-fg-2">
            {t.zoom}
          </label>
          <input
            id={zoomId}
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={framing.zoom}
            disabled={!source}
            onChange={(event) => moveTo({ ...framing, zoom: Number(event.target.value) })}
            className="h-1.5 flex-1 accent-[var(--accent)] disabled:opacity-40"
          />
          <button
            type="button"
            onClick={() => onFrame(CENTERED)}
            disabled={!source}
            className="grid size-8 shrink-0 place-items-center rounded-full text-fg-2 transition hover:bg-surface hover:text-fg disabled:opacity-40"
            aria-label={fill(t.reset, { screen: screen.name })}
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        <p
          className={cn(
            "flex min-h-10 items-start gap-1.5 text-[13px] leading-5",
            quality ? (quality.ok ? "text-success" : "text-warning") : "text-fg-3",
          )}
          aria-live="polite"
        >
          {quality ? (
            <>
              {quality.ok ? <Check className="mt-0.5 size-3.5 shrink-0" /> : <CircleAlert className="mt-0.5 size-3.5 shrink-0" />}
              <span>
                <span className="font-semibold">{quality.label}.</span> <span className="text-fg-2">{quality.note}</span>
              </span>
            </>
          ) : (
            t.emptyHint
          )}
        </p>

        <button type="button" onClick={onDownload} disabled={!source || busy} className="btn-secondary h-11 w-full disabled:opacity-50">
          <Download className="size-[18px]" />
          {screen.download}
        </button>
      </div>
    </div>
  );
}

export function DuoMaker({
  wallpaper,
  strings: t = EN_MAKER,
  date,
}: {
  wallpaper: MakerWallpaper | null;
  strings?: MakerStrings;
  /** Lock Screen date in the page's language. */
  date?: string;
}) {
  const screens: Screen[] = [
    { key: "duo-outer", name: t.outerName, hint: t.outerHint, download: t.downloadOuter },
    { key: "duo-inner", name: t.innerName, hint: t.innerHint, download: t.downloadInner },
  ];
  const modes: { value: ScreenMode; label: string }[] = [
    { value: "lock", label: t.modeLock },
    { value: "home", label: t.modeHome },
    { value: "clean", label: t.modeClean },
  ];
  const [source, setSource] = useState<Source | null>(null);
  const [framings, setFramings] = useState<Record<ScreenKey, Framing>>({ "duo-outer": CENTERED, "duo-inner": CENTERED });
  const [mode, setMode] = useState<ScreenMode>("lock");
  const [format, setFormat] = useState<Format>("jpeg");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(Boolean(wallpaper));
  const [dragOver, setDragOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const localUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!wallpaper) return;
    let cancelled = false;
    loadImage(wallpaper.url, true)
      .then((image) => {
        if (cancelled) return;
        setSource({
          url: wallpaper.url,
          name: wallpaper.slug,
          width: image.naturalWidth,
          height: image.naturalHeight,
          image,
          local: false,
        });
      })
      .catch(() => {
        if (!cancelled) toast.error(t.loadFailed);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [wallpaper, t.loadFailed]);

  useEffect(
    () => () => {
      if (localUrl.current) URL.revokeObjectURL(localUrl.current);
    },
    [],
  );

  async function openFile(file: File | undefined) {
    if (!file) return;
    if (file.type && !file.type.startsWith("image/")) {
      toast.error(t.notImage);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error(t.tooLarge);
      return;
    }
    const url = URL.createObjectURL(file);
    try {
      const image = await loadImage(url, false);
      if (localUrl.current) URL.revokeObjectURL(localUrl.current);
      localUrl.current = url;
      setSource({ url, name: file.name, width: image.naturalWidth, height: image.naturalHeight, image, local: true });
      setFramings({ "duo-outer": CENTERED, "duo-inner": CENTERED });
    } catch {
      URL.revokeObjectURL(url);
      toast.error(t.cantOpen);
    }
  }

  async function download(keys: ScreenKey[]) {
    if (!source) return;
    setBusy(true);
    try {
      for (const [index, key] of keys.entries()) {
        const { width, height } = DEVICE_SPECS[key];
        const blob = await renderScreen(source, framings[key], key, format);
        const side = key === "duo-outer" ? "outer" : "inner";
        saveBlob(blob, `${fileBase(source.name)}-iphone-duo-${side}-${width}x${height}.${format === "jpeg" ? "jpg" : "png"}`);
        // Browsers drop a second download fired in the same instant.
        if (index < keys.length - 1) await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch {
      toast.error(t.exportFailed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-[32px] bg-elevated p-5 ring-1 ring-line transition md:p-8",
        dragOver && "ring-2 ring-accent",
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragOver(false);
        void openFile(event.dataTransfer.files[0]);
      }}
    >
      <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <button type="button" onClick={() => input.current?.click()} className="btn-primary h-11 shrink-0">
            <ImagePlus className="size-[18px]" />
            {source ? t.change : t.choose}
          </button>
          <p className="min-w-0 text-[13px] leading-5 text-fg-2">
            {loading ? (
              t.loading
            ) : source ? (
              <>
                <span className="block truncate font-medium text-fg">{source.local ? source.name : wallpaper?.title}</span>
                {fill(t.pixels, { w: source.width, h: source.height })}
              </>
            ) : (
              t.dropHint
            )}
          </p>
          <input
            ref={input}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              void openFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Segmented label={t.previewLabel} value={mode} options={modes} onChange={setMode} />
          <Segmented
            label={t.formatLabel}
            value={format}
            options={[
              { value: "jpeg", label: "JPG" },
              { value: "png", label: "PNG" },
            ]}
            onChange={setFormat}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start md:gap-8">
        {screens.map((screen) => (
          <ScreenEditor
            key={screen.key}
            screen={screen}
            source={source}
            framing={framings[screen.key]}
            mode={mode}
            busy={busy}
            onFrame={(framing) => setFramings((current) => ({ ...current, [screen.key]: framing }))}
            onDownload={() => void download([screen.key])}
            t={t}
            date={date}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 border-t border-line pt-6">
        <button
          type="button"
          onClick={() => void download(["duo-outer", "duo-inner"])}
          disabled={!source || busy}
          className="btn-primary h-12 w-full max-w-sm disabled:opacity-50"
        >
          <Download className="size-[18px]" />
          {busy ? t.preparing : t.downloadBoth}
        </button>
        <p className="text-center text-[13px] text-fg-3">
          {fill(t.exportNote, {
            outer: `${DEVICE_SPECS["duo-outer"].width} × ${DEVICE_SPECS["duo-outer"].height}`,
            inner: `${DEVICE_SPECS["duo-inner"].width} × ${DEVICE_SPECS["duo-inner"].height}`,
          })}
        </p>
      </div>
    </div>
  );
}
