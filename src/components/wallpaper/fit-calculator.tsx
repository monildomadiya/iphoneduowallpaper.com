"use client";

import { useState } from "react";
import { estimateWallpaperFit } from "@/lib/wallpaper-fit";
import { DEVICE_VARIANTS } from "@/lib/variants/geometry";

const TARGETS = [
  { label: "Duo outer display", ...DEVICE_VARIANTS.outer },
  { label: "Duo inner display", ...DEVICE_VARIANTS.inner },
  { label: "iPhone 18 Pro", ...DEVICE_VARIANTS.pro },
  { label: "iPhone 18 Pro Max", ...DEVICE_VARIANTS["pro-max"] },
];

export function FitCalculator() {
  const [width, setWidth] = useState("1495");
  const [height, setHeight] = useState("1052");
  const [targetIndex, setTargetIndex] = useState(0);
  const target = TARGETS[targetIndex];
  const fit = estimateWallpaperFit(Number(width), Number(height), target.width, target.height);
  const fieldClass = "mt-2 block w-full rounded-xl border border-line bg-elevated px-4 py-3 text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <section aria-labelledby="fit-calculator" className="rounded-[28px] border border-line bg-surface p-5 sm:p-8">
      <h2 id="fit-calculator" className="text-2xl font-semibold tracking-tight">Will my wallpaper fit?</h2>
      <p className="mt-3 max-w-2xl text-fg-2">Enter the downloaded image’s width and height in pixels. No photo upload is needed; these calculations run in your browser.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium" htmlFor="source-width">Image width (px)
          <input id="source-width" type="number" inputMode="numeric" min="1" max="100000" step="1" value={width} onChange={(event) => setWidth(event.target.value)} className={fieldClass} />
        </label>
        <label className="text-sm font-medium" htmlFor="source-height">Image height (px)
          <input id="source-height" type="number" inputMode="numeric" min="1" max="100000" step="1" value={height} onChange={(event) => setHeight(event.target.value)} className={fieldClass} />
        </label>
        <label className="text-sm font-medium sm:col-span-2" htmlFor="target-screen">Target file size
          <select id="target-screen" value={targetIndex} onChange={(event) => setTargetIndex(Number(event.target.value))} className={fieldClass}>
            {TARGETS.map((item, index) => <option key={item.label} value={index}>{item.label} · {item.width} × {item.height}</option>)}
          </select>
        </label>
      </div>
      <div role="status" aria-live="polite" aria-atomic="true" className="mt-6 rounded-2xl bg-elevated p-5">
        {fit ? <>
          <p className="text-lg font-semibold">{fit.removedPercent < 0.000001 ? "No crop needed at this ratio." : fit.removedPercent < 0.1 ? "Less than 0.1% of the image area is cropped." : `About ${fit.removedPercent.toFixed(1)}% of the image area is cropped.`}</p>
          <p className="mt-2 text-fg-2">{fit.removedPercent >= 0.05 ? `A centred crop removes content from the ${fit.edges}. ` : ""}The visible region is approximately {fit.visibleWidth} × {fit.visibleHeight} source pixels.</p>
          <p className="mt-2 text-fg-2">{fit.scale > 1.005 ? `The image must be enlarged ${fit.scale.toFixed(2)}× to fill this size. Fine detail may look soft; a larger original or a different composition may work better.` : "This source has enough pixels to fill the selected size without enlargement. Compression and the original image quality still affect sharpness."}</p>
        </> : <p>Enter whole-number dimensions between 1 and 100,000 pixels to see an estimate.</p>}
      </div>
      <p className="mt-4 text-sm leading-6 text-fg-2">This estimates a centred, edge-to-edge crop using this site’s export sizes. It does not simulate iOS zoom, perspective, widgets or spatial effects. Moving the crop changes which content is lost, rather than how much area is removed.</p>
    </section>
  );
}
