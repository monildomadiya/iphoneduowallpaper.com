"use client";

/** Browser-side image pipeline: decode → preview + thumbnail → dominant color. */

export interface ProcessedImage {
  width: number;
  height: number;
  preview: Blob;
  thumb: Blob;
  dominantColor: string;
}

const PREVIEW_BOX = { width: 1080, height: 2340 };
const THUMB_SIZE = { width: 540, height: 960 }; // 9:16 cards
const MAX_MEGAPIXELS = 64;

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export function detectMimeType(file: File): string {
  if (file.type) return file.type;
  const extension = file.name.split(".").pop()?.toLowerCase();
  return (
    { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" }[extension ?? ""] ??
    ""
  );
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not supported in this browser.");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  return { canvas, context };
}

function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (webp) => {
        if (webp && webp.type === "image/webp") return resolve(webp);
        // Some browsers cannot encode WebP — fall back to JPEG.
        canvas.toBlob(
          (jpeg) => (jpeg ? resolve(jpeg) : reject(new Error("Could not encode the image."))),
          "image/jpeg",
          quality,
        );
      },
      "image/webp",
      quality,
    );
  });
}

/** Downscales in halving steps for noticeably sharper results than a single resize. */
function resample(
  source: CanvasImageSource,
  crop: { x: number; y: number; width: number; height: number },
  target: { width: number; height: number },
) {
  let current: CanvasImageSource = source;
  let region = { ...crop };

  while (region.width / 2 >= target.width && region.height / 2 >= target.height) {
    const step = createCanvas(region.width / 2, region.height / 2);
    step.context.drawImage(current, region.x, region.y, region.width, region.height, 0, 0, step.canvas.width, step.canvas.height);
    current = step.canvas;
    region = { x: 0, y: 0, width: step.canvas.width, height: step.canvas.height };
  }

  const output = createCanvas(target.width, target.height);
  output.context.drawImage(current, region.x, region.y, region.width, region.height, 0, 0, output.canvas.width, output.canvas.height);
  return output.canvas;
}

function averageColor(bitmap: ImageBitmap): string {
  const { canvas, context } = createCanvas(16, 16);
  context.drawImage(bitmap, 0, 0, 16, 16);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] < 16) continue;
    r += pixels[index];
    g += pixels[index + 1];
    b += pixels[index + 2];
    count += 1;
  }
  if (!count) return "#1d1d1f";
  const hex = (value: number) => Math.round(value / count).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

export async function readDimensions(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const result = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return result;
}

export async function processImage(file: File): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => {
    throw new Error("This image could not be read. Try exporting it as JPG or PNG.");
  });

  try {
    const { width, height } = bitmap;
    if ((width * height) / 1_000_000 > MAX_MEGAPIXELS) {
      throw new Error(`Image is larger than ${MAX_MEGAPIXELS} megapixels. Please resize it first.`);
    }

    const previewScale = Math.min(1, PREVIEW_BOX.width / width, PREVIEW_BOX.height / height);
    const previewCanvas = resample(
      bitmap,
      { x: 0, y: 0, width, height },
      { width: Math.round(width * previewScale), height: Math.round(height * previewScale) },
    );

    const ratio = THUMB_SIZE.width / THUMB_SIZE.height;
    let cropWidth = width;
    let cropHeight = height;
    if (width / height > ratio) cropWidth = Math.round(height * ratio);
    else cropHeight = Math.round(width / ratio);
    const thumbScale = Math.min(1, THUMB_SIZE.width / cropWidth);
    const thumbCanvas = resample(
      bitmap,
      { x: Math.round((width - cropWidth) / 2), y: Math.round((height - cropHeight) / 2), width: cropWidth, height: cropHeight },
      { width: Math.round(cropWidth * thumbScale), height: Math.round(cropHeight * thumbScale) },
    );

    const [preview, thumb] = await Promise.all([encode(previewCanvas, 0.86), encode(thumbCanvas, 0.8)]);
    return { width, height, preview, thumb, dominantColor: averageColor(bitmap) };
  } finally {
    bitmap.close();
  }
}

export function uploadToStorage(
  target: { url: string; headers: Record<string, string> },
  body: Blob,
  onProgress?: (fraction: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", target.url);
    for (const [key, value] of Object.entries(target.headers)) request.setRequestHeader(key, value);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total);
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress?.(1);
        resolve();
      } else {
        reject(new Error(`Cloudflare R2 rejected the upload (HTTP ${request.status}).`));
      }
    };
    request.onerror = () =>
      reject(new Error("Upload blocked. Check your internet connection and the R2 bucket CORS policy."));
    request.send(body);
  });
}
