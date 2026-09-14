"use client";

/* eslint-disable @next/next/no-img-element -- local object URL previews */
import { AlertTriangle, CheckCircle2, ImagePlus, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createUploadTicket, createWallpaper } from "@/app/admin/actions/wallpapers";
import {
  ACCEPTED_TYPES,
  detectMimeType,
  processImage,
  readDimensions,
  uploadToStorage,
} from "@/lib/admin/image-client";
import { cn, formatBytes, screenFit, titleFromFilename } from "@/lib/utils";
import { Switch, TagInput } from "./client";
import { Card, Field, buttonClass, inputClass } from "./ui";
import {
  CategorySelect,
  ChipMultiSelect,
  SourceSelect,
  StatusToggle,
  type TaxonomyOption,
} from "./wallpaper-fields";

type ItemStatus = "queued" | "processing" | "uploading" | "saving" | "done" | "error";

interface QueueItem {
  key: string;
  file: File;
  objectUrl: string;
  title: string;
  status: ItemStatus;
  progress: number;
  width?: number;
  height?: number;
  error?: string;
  resultId?: string;
}

interface DeviceOption extends TaxonomyOption {
  width: number;
  height: number;
}

const MAX_FILE_BYTES = 40 * 1024 * 1024;
const CONCURRENCY = 2;

export function Uploader({
  categories,
  collections,
  devices,
}: {
  categories: TaxonomyOption[];
  collections: TaxonomyOption[];
  devices: DeviceOption[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<QueueItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [running, setRunning] = useState(false);

  const [status, setStatus] = useState<"draft" | "published">("published");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [deviceIds, setDeviceIds] = useState<string[]>(devices.map((device) => device.id));
  const [collectionIds, setCollectionIds] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [sourceType, setSourceType] = useState<"original" | "ai" | "licensed" | "public_domain">("original");
  const [creditName, setCreditName] = useState("");
  const [creditUrl, setCreditUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Release object URLs when the page unmounts.
  useEffect(() => () => itemsRef.current.forEach((item) => URL.revokeObjectURL(item.objectUrl)), []);

  useEffect(() => {
    if (!running) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [running]);

  function patch(key: string, update: Partial<QueueItem>) {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...update } : item)));
  }

  function addFiles(fileList: FileList | File[]) {
    const accepted: QueueItem[] = [];
    for (const file of Array.from(fileList)) {
      const type = detectMimeType(file);
      if (!ACCEPTED_TYPES.includes(type)) {
        toast.error(`${file.name}: unsupported format. Use JPG, PNG, WebP or AVIF.`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`${file.name}: larger than 40 MB.`);
        continue;
      }
      accepted.push({
        key: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        objectUrl: URL.createObjectURL(file),
        title: titleFromFilename(file.name),
        status: "queued",
        progress: 0,
      });
    }
    if (!accepted.length) return;
    setItems((current) => [...current, ...accepted]);
    for (const item of accepted) {
      readDimensions(item.file)
        .then((size) => patch(item.key, size))
        .catch(() => patch(item.key, { status: "error", error: "This image could not be read." }));
    }
  }

  function removeItem(key: string) {
    setItems((current) => {
      const item = current.find((entry) => entry.key === key);
      if (item) URL.revokeObjectURL(item.objectUrl);
      return current.filter((entry) => entry.key !== key);
    });
  }

  async function uploadItem(item: QueueItem) {
    const mimeType = detectMimeType(item.file);
    try {
      patch(item.key, { status: "processing", progress: 0.03, error: undefined });
      const processed = await processImage(item.file);
      patch(item.key, { width: processed.width, height: processed.height, progress: 0.1 });

      const ticket = await createUploadTicket({
        contentType: mimeType,
        size: item.file.size,
        previewType: processed.preview.type as "image/webp" | "image/jpeg",
        thumbType: processed.thumb.type as "image/webp" | "image/jpeg",
      });
      if (!ticket.ok) throw new Error(ticket.error);

      patch(item.key, { status: "uploading" });
      const parts: [Blob, typeof ticket.data.original][] = [
        [item.file, ticket.data.original],
        [processed.preview, ticket.data.preview],
        [processed.thumb, ticket.data.thumb],
      ];
      const total = parts.reduce((sum, [blob]) => sum + blob.size, 0);
      const loaded = parts.map(() => 0);
      await Promise.all(
        parts.map(([blob, target], index) =>
          uploadToStorage(target, blob, (fraction) => {
            loaded[index] = fraction * blob.size;
            patch(item.key, { progress: 0.1 + 0.82 * (loaded.reduce((a, b) => a + b, 0) / total) });
          }),
        ),
      );

      patch(item.key, { status: "saving", progress: 0.95 });
      const result = await createWallpaper({
        uploadId: ticket.data.id,
        originalKey: ticket.data.original.key,
        previewKey: ticket.data.preview.key,
        thumbKey: ticket.data.thumb.key,
        width: processed.width,
        height: processed.height,
        mimeType,
        dominantColor: processed.dominantColor,
        title: item.title.trim() || titleFromFilename(item.file.name),
        categoryId,
        deviceIds,
        collectionIds,
        tags,
        status,
        isFeatured,
        sourceType,
        creditName,
        creditUrl,
      });
      if (!result.ok) throw new Error(result.error);
      patch(item.key, { status: "done", progress: 1, resultId: result.data.id });
      return true;
    } catch (error) {
      patch(item.key, { status: "error", error: (error as Error).message || "Upload failed." });
      return false;
    }
  }

  async function startUpload() {
    const pending = items.filter((item) => item.status === "queued" || item.status === "error");
    if (!pending.length) return;
    setRunning(true);
    let succeeded = 0;
    const queue = [...pending];
    await Promise.all(
      Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
        while (queue.length) {
          const next = queue.shift();
          if (next && (await uploadItem(next))) succeeded += 1;
        }
      }),
    );
    setRunning(false);
    if (succeeded) {
      toast.success(`${succeeded} wallpaper${succeeded === 1 ? "" : "s"} uploaded.`);
      router.refresh();
    }
    if (succeeded < pending.length) toast.error(`${pending.length - succeeded} upload(s) failed. Check the errors below.`);
  }

  const pendingCount = items.filter((item) => item.status === "queued" || item.status === "error").length;
  const doneCount = items.filter((item) => item.status === "done").length;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            addFiles(event.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed px-6 py-14 text-center transition",
            dragging ? "border-accent bg-accent/5" : "border-line-strong bg-elevated hover:border-accent/60",
          )}
        >
          <UploadCloud className="size-10 text-accent" strokeWidth={1.5} />
          <p className="mt-4 text-[17px] font-semibold">Drop wallpapers here or click to browse</p>
          <p className="mt-1 text-[13px] text-fg-2">
            JPG, PNG, WebP or AVIF · up to 40 MB each · previews and thumbnails are generated automatically
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            multiple
            hidden
            onChange={(event) => {
              if (event.target.files) addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        {items.length ? (
          <Card
            title={`Upload queue (${items.length})`}
            description={doneCount ? `${doneCount} uploaded` : "Edit titles before uploading"}
            actions={
              !running && doneCount ? (
                <button
                  type="button"
                  className={buttonClass.ghost}
                  onClick={() => setItems((current) => current.filter((item) => item.status !== "done"))}
                >
                  Clear finished
                </button>
              ) : null
            }
            bodyClassName="p-0"
          >
            <ul className="divide-y divide-line">
              {items.map((item) => {
                const warnings = item.width && item.height
                  ? devices.filter((device) => screenFit(item.width!, item.height!, device.width, device.height).level === "low")
                  : [];
                const locked = item.status !== "queued" && item.status !== "error";
                return (
                  <li key={item.key} className="flex gap-4 p-4">
                    <img src={item.objectUrl} alt="" className="h-24 w-14 shrink-0 rounded-lg bg-surface object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <input
                          value={item.title}
                          onChange={(event) => patch(item.key, { title: event.target.value })}
                          disabled={locked}
                          aria-label="Title"
                          className={cn(inputClass, "py-1.5")}
                        />
                        {!locked ? (
                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            aria-label="Remove"
                            className="grid size-9 shrink-0 place-items-center rounded-full text-fg-3 hover:bg-surface hover:text-danger"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        ) : null}
                      </div>
                      <p className="mt-1.5 text-[12px] text-fg-3">
                        {item.width ? `${item.width} × ${item.height} · ` : ""}
                        {formatBytes(item.file.size)} · {item.file.name}
                      </p>
                      {warnings.length && item.status !== "done" ? (
                        <p className="mt-1 flex items-center gap-1 text-[12px] text-warning">
                          <AlertTriangle className="size-3.5" />
                          Low resolution for {warnings.map((device) => device.name).join(", ")}
                        </p>
                      ) : null}

                      {item.status !== "queued" ? (
                        <div className="mt-2.5">
                          {item.status === "error" ? (
                            <p className="flex items-start gap-1.5 text-[12px] text-danger">
                              <X className="mt-px size-3.5 shrink-0" />
                              {item.error}
                            </p>
                          ) : item.status === "done" ? (
                            <p className="flex items-center gap-1.5 text-[12px] text-success">
                              <CheckCircle2 className="size-3.5" />
                              Uploaded ·{" "}
                              <Link href={`/admin/wallpapers/${item.resultId}`} className="text-link hover:underline">
                                Edit details
                              </Link>
                            </p>
                          ) : (
                            <>
                              <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                                <div
                                  className="h-full rounded-full bg-accent transition-[width] duration-300"
                                  style={{ width: `${Math.round(item.progress * 100)}%` }}
                                />
                              </div>
                              <p className="mt-1 flex items-center gap-1.5 text-[12px] capitalize text-fg-2">
                                <Loader2 className="size-3 animate-spin" />
                                {item.status}… {Math.round(item.progress * 100)}%
                              </p>
                            </>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        ) : (
          <div className="rounded-[22px] bg-elevated p-6 text-[14px] leading-6 text-fg-2 shadow-card">
            <p className="flex items-center gap-2 font-semibold text-fg">
              <ImagePlus className="size-4 text-accent" />
              Tips for AdSense-friendly uploads
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Only upload artwork you created, AI art you generated, or images you are licensed to share.</li>
              <li>Use at least 2670 × 1878 for Duo inner, 1398 × 2034 for Duo outer, 1320 × 2868 for Pro Max.</li>
              <li>After uploading, add a unique description to each wallpaper — it helps SEO and approval.</li>
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <Card title="Apply to this batch" description="These settings are applied to every file in the queue.">
          <div className="space-y-5">
            <Field label="Status">
              <StatusToggle value={status} onChange={setStatus} />
            </Field>
            <Field label="Category" htmlFor="batch-category">
              <CategorySelect id="batch-category" options={categories} value={categoryId} onChange={setCategoryId} />
            </Field>
            <Field label="Fits devices">
              <ChipMultiSelect options={devices} value={deviceIds} onChange={setDeviceIds} emptyLabel="Add devices first" />
            </Field>
            <Field label="Collections">
              <ChipMultiSelect options={collections} value={collectionIds} onChange={setCollectionIds} emptyLabel="No collections yet" />
            </Field>
            <Field label="Tags" hint="Colors, moods, subjects — used for search.">
              <TagInput name="tags" onChange={setTags} />
            </Field>
            <Field label="Source" htmlFor="batch-source">
              <SourceSelect id="batch-source" value={sourceType} onChange={setSourceType} />
            </Field>
            {sourceType === "licensed" || sourceType === "public_domain" ? (
              <>
                <Field label="Credit name" htmlFor="batch-credit">
                  <input id="batch-credit" value={creditName} onChange={(event) => setCreditName(event.target.value)} className={inputClass} />
                </Field>
                <Field label="Credit link" htmlFor="batch-credit-url">
                  <input
                    id="batch-credit-url"
                    type="url"
                    value={creditUrl}
                    onChange={(event) => setCreditUrl(event.target.value)}
                    className={inputClass}
                    placeholder="https://"
                  />
                </Field>
              </>
            ) : null}
            <Switch label="Featured" description="Show on the home page" checked={isFeatured} onChange={setIsFeatured} />
          </div>
        </Card>
        <button
          type="button"
          onClick={startUpload}
          disabled={running || !pendingCount}
          className={cn(buttonClass.primary, "h-12 w-full text-[15px]")}
        >
          {running ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
          {running ? "Uploading…" : pendingCount ? `Upload ${pendingCount} wallpaper${pendingCount === 1 ? "" : "s"}` : "Add files to upload"}
        </button>
      </div>
    </div>
  );
}
