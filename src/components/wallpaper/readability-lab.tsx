"use client";

import { useEffect, useRef, useState } from "react";
import { assessReadability, DARK_TEXT, LIGHT_TEXT } from "@/lib/wallpaper-readability";
import { DEVICE_VARIANTS } from "@/lib/variants/geometry";

const PRESETS = [
  { name: "Duo outer export", ...DEVICE_VARIANTS.outer },
  { name: "Duo inner export", ...DEVICE_VARIANTS.inner },
  { name: "Pro Max export", ...DEVICE_VARIANTS["pro-max"] },
];
type Assessment = ReturnType<typeof assessReadability>;
const field = "mt-2 block w-full rounded-xl border border-line bg-elevated px-3 py-3 text-fg";

function paintBackground(context: CanvasRenderingContext2D, width: number, height: number, image: HTMLImageElement | null, dim: number) {
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);
  if (image) {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const cropWidth = width / scale;
    const cropHeight = height / scale;
    context.drawImage(image, (image.naturalWidth - cropWidth) / 2, (image.naturalHeight - cropHeight) / 2, cropWidth, cropHeight, 0, 0, width, height);
  } else {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#e6e9ff");
    gradient.addColorStop(0.4, "#9986bf");
    gradient.addColorStop(0.55, "#faf0db");
    gradient.addColorStop(1, "#162443");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }
  context.fillStyle = `rgba(0,0,0,${dim / 100})`;
  context.fillRect(0, 0, width, height);
}

export function ReadabilityLab() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadVersion = useRef(0);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState("Built-in gradient example");
  const [error, setError] = useState("");
  const [presetIndex, setPresetIndex] = useState(0);
  const [dim, setDim] = useState(0);
  const [lightText, setLightText] = useState(true);
  const [region, setRegion] = useState("clock");
  const [result, setResult] = useState<{ light: Assessment; dark: Assessment } | null>(null);
  const preset = PRESETS[presetIndex];
  const threshold = region === "clock" ? 3 : 4.5;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const element = canvas.current;
      const context = element?.getContext("2d", { willReadFrequently: true });
      if (!element || !context) return;
      const width = 320;
      const height = Math.round((width * preset.height) / preset.width);
      element.width = width;
      element.height = height;
      paintBackground(context, width, height, image, dim);
      const box = { x: Math.round(width * 0.1), y: Math.round(height * (region === "clock" ? 0.12 : 0.5)), w: Math.round(width * 0.8), h: Math.max(16, Math.round(height * 0.18)) };
      const pixels = context.getImageData(box.x, box.y, box.w, box.h).data;
      setResult({ light: assessReadability(pixels, LIGHT_TEXT, threshold), dark: assessReadability(pixels, DARK_TEXT, threshold) });
      context.strokeStyle = "#2563eb";
      context.lineWidth = 2;
      context.setLineDash([5, 4]);
      context.strokeRect(box.x, box.y, box.w, box.h);
      context.setLineDash([]);
      context.fillStyle = lightText ? "#ffffff" : "#111827";
      context.textAlign = "center";
      context.textBaseline = "middle";
      if (region === "clock") {
        context.font = `600 ${Math.round(box.h * 0.65)}px system-ui`;
        context.fillText("9:41", width / 2, box.y + box.h / 2);
      } else {
        context.font = "600 14px system-ui";
        for (let index = 0; index < 3; index++) context.fillText(["Photos", "Messages", "Calendar"][index], width * (0.23 + index * 0.27), box.y + box.h / 2);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [image, dim, lightText, region, threshold, preset]);

  async function loadPhoto(file: File | undefined) {
    if (!file) return;
    const version = ++uploadVersion.current;
    setError("");
    if (!/^(image\/jpeg|image\/png|image\/webp|image\/avif)$/.test(file.type) || file.size > 15 * 1024 * 1024) {
      setError("Choose a JPG, PNG, WebP or AVIF image under 15 MB. Export HEIC photos as JPEG first.");
      return;
    }
    const url = URL.createObjectURL(file);
    try {
      const photo = new Image();
      photo.src = url;
      await photo.decode();
      if (photo.naturalWidth * photo.naturalHeight > 40_000_000) throw new Error("Image too large");
      if (version !== uploadVersion.current) return;
      setImage(photo);
      setFileName(file.name);
    } catch {
      if (version === uploadVersion.current) setError("This image could not be opened. Try a JPG or PNG below 40 megapixels.");
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function download() {
    const output = document.createElement("canvas");
    output.width = preset.width;
    output.height = preset.height;
    const context = output.getContext("2d");
    if (!context) return;
    paintBackground(context, output.width, output.height, image, dim);
    output.toBlob((blob) => {
      if (!blob) { setError("The export failed. Try another image or preset."); return; }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `readable-wallpaper-${preset.width}x${preset.height}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    }, "image/png");
  }

  const selected = result && (lightText ? result.light : result.dark);
  const recommended = result && (result.light.coverage > result.dark.coverage || (result.light.coverage === result.dark.coverage && result.light.lowerDecile >= result.dark.lowerDecile) ? "Light" : "Dark");

  return <section id="readability-lab" aria-labelledby="lab-heading" className="rounded-[28px] border border-line bg-surface p-5 sm:p-8">
    <h2 id="lab-heading" className="text-2xl font-semibold tracking-tight">Try your background. Compare the text.</h2>
    <p className="mt-3 max-w-2xl text-fg-2">Start with our gradient or choose a photo. The photo stays in your browser; this tool does not upload it to a server.</p>
    <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-5">
        <label className="block text-sm font-medium">Choose a photo
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className={field} onChange={(event) => { void loadPhoto(event.target.files?.[0]); }} />
        </label>
        <p className="break-all text-sm text-fg-2">{fileName}</p>
        {error && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <label className="block text-sm font-medium">Export shape
          <select value={presetIndex} onChange={(event) => setPresetIndex(Number(event.target.value))} className={field}>
            {PRESETS.map((item, index) => <option key={item.name} value={index}>{item.name} · {item.width} × {item.height}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium">Compare readability for
          <select value={region} onChange={(event) => setRegion(event.target.value)} className={field}>
            <option value="clock">Large clock · 3:1 reference</option><option value="labels">Small app labels · 4.5:1 reference</option>
          </select>
        </label>
        <fieldset><legend className="text-sm font-medium">Preview text colour</legend>
          <div className="mt-2 flex flex-wrap gap-4">
            <label className="flex items-center gap-2"><input type="radio" name="preview-text" checked={lightText} onChange={() => setLightText(true)} />Light</label>
            <label className="flex items-center gap-2"><input type="radio" name="preview-text" checked={!lightText} onChange={() => setLightText(false)} />Dark</label>
          </div>
        </fieldset>
        <label className="block text-sm font-medium" htmlFor="wallpaper-dim">Darken background: {dim}%
          <input id="wallpaper-dim" type="range" min="0" max="70" step="5" value={dim} onChange={(event) => setDim(Number(event.target.value))} className="mt-3 block w-full accent-blue-600" />
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={download}>Download background PNG</button>
          <button type="button" className="btn-secondary" onClick={() => { uploadVersion.current++; if (fileInput.current) fileInput.current.value = ""; setImage(null); setFileName("Built-in gradient example"); setDim(0); setError(""); }}>Use demo again</button>
        </div>
        <p className="text-sm leading-6 text-fg-2">The PNG contains the centred crop and dimming only. Preview text and the blue sample box are not exported. A small source may be enlarged; use the fit calculator to check sharpness.</p>
      </div>
      <div>
        <canvas ref={canvas} width={320} height={Math.round(320 * preset.height / preset.width)} role="img" aria-label="Wallpaper preview with sample text and a blue outline around the analysed area" className="mx-auto h-auto max-h-[520px] max-w-full rounded-2xl border border-line" />
        <p className="mt-3 text-center text-xs text-fg-2">Blue box = sampled area. This is a layout illustration, not an iOS simulator.</p>
        <div role="status" aria-live="polite" aria-atomic="true" className="mt-5 rounded-2xl bg-elevated p-5">
          {selected && result ? <>
            <p className="text-lg font-semibold">Try {recommended?.toLowerCase()} text in this area.</p>
            <p className="mt-2 text-sm leading-6 text-fg-2">With {lightText ? "light" : "dark"} text, {selected.coverage.toFixed(1)}% of sampled pixels meet the {threshold}:1 reference. The weakest sampled contrast is {selected.minimum.toFixed(2)}:1.</p>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-fg-2">Light text coverage</dt><dd className="mt-1 font-semibold">{result.light.coverage.toFixed(1)}%</dd></div><div><dt className="text-fg-2">Dark text coverage</dt><dd className="mt-1 font-semibold">{result.dark.coverage.toFixed(1)}%</dd></div></dl>
            <p className="mt-3 text-xs leading-5 text-fg-2">A high percentage is a useful comparison, not an accessibility pass. A bright or dark patch beneath a letter can still hide it. Check the actual phone too.</p>
          </> : <p>Preparing the local preview…</p>}
        </div>
      </div>
    </div>
  </section>;
}
