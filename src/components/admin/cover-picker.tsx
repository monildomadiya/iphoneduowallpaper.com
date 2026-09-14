"use client";

/* eslint-disable @next/next/no-img-element -- cover previews come from R2 or local blobs */
import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { createCoverUploadTicket } from "@/app/admin/actions/taxonomy";
import { ACCEPTED_TYPES, detectMimeType, processImage, uploadToStorage } from "@/lib/admin/image-client";
import { imageUrl } from "@/lib/utils";

/** Uploads an optional cover image to R2 and reports the new key (null = removed). */
export function CoverPicker({
  value,
  onChange,
  onBusyChange,
}: {
  value: string | null;
  onChange: (key: string | null) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    if (!ACCEPTED_TYPES.includes(detectMimeType(file))) {
      toast.error("Use a JPG, PNG, WebP or AVIF image.");
      return;
    }
    setBusy(true);
    onBusyChange?.(true);
    try {
      const processed = await processImage(file);
      const ticket = await createCoverUploadTicket({ contentType: processed.preview.type as "image/webp" | "image/jpeg" });
      if (!ticket.ok) throw new Error(ticket.error);
      await uploadToStorage(ticket.data, processed.preview);
      onChange(ticket.data.key);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative grid h-24 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface">
        {value ? <img src={imageUrl(value)} alt="" className="size-full object-cover" /> : <ImagePlus className="size-6 text-fg-3" />}
        {busy ? (
          <div className="absolute inset-0 grid place-items-center bg-black/50 text-white">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : null}
      </div>
      <div className="space-y-2 text-[13px]">
        <p className="text-fg-3">Optional. Without a cover, the newest wallpaper is used.</p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-surface px-3 py-1.5 font-medium hover:bg-surface-hover"
          >
            {value ? "Replace" : "Upload cover"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium text-danger hover:bg-danger/10"
            >
              <X className="size-3.5" />
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
