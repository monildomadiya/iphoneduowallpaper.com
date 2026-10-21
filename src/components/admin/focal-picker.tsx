"use client";

/* eslint-disable @next/next/no-img-element -- admin previews come from R2 */
import { useRef } from "react";
import { DEVICE_VARIANTS, focalCrop } from "@/lib/variants/geometry";

const FRAMES = [
  { name: "outer", label: "Outer", color: "#0a84ff" },
  { name: "inner", label: "Inner", color: "#30d158" },
  { name: "pro-max", label: "18 Pro Max", color: "#ff9f0a" },
] as const;

/**
 * Click or drag on the image to set where the subject is. The coloured frames show what each screen's
 * file will keep; every crop is centred on the point as far as the image edges allow.
 */
export function FocalPicker({
  src,
  width,
  height,
  x,
  y,
  onChange,
}: {
  src: string;
  width: number;
  height: number;
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function pick(event: React.PointerEvent<HTMLDivElement>) {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const clamp = (value: number) => Math.round(Math.min(Math.max(value, 0), 1) * 1000) / 1000;
    onChange(clamp((event.clientX - box.left) / box.width), clamp((event.clientY - box.top) / box.height));
  }

  return (
    <div>
      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label="Focal point"
        aria-valuenow={Math.round(x * 100)}
        aria-valuetext={`${Math.round(x * 100)}% from the left, ${Math.round(y * 100)}% from the top`}
        onPointerDown={pick}
        onPointerMove={pick}
        onKeyDown={(event) => {
          const step = event.shiftKey ? 0.1 : 0.02;
          const moves: Record<string, [number, number]> = {
            ArrowLeft: [-step, 0],
            ArrowRight: [step, 0],
            ArrowUp: [0, -step],
            ArrowDown: [0, step],
          };
          const move = moves[event.key];
          if (!move) return;
          event.preventDefault();
          onChange(Math.min(Math.max(x + move[0], 0), 1), Math.min(Math.max(y + move[1], 0), 1));
        }}
        className="relative cursor-crosshair touch-none select-none overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <img src={src} alt="" draggable={false} className="absolute inset-0 size-full object-cover" />
        {FRAMES.map((frame) => {
          const size = DEVICE_VARIANTS[frame.name];
          const crop = focalCrop(width, height, size.width, size.height, x, y);
          return (
            <div
              key={frame.name}
              className="pointer-events-none absolute border-2"
              style={{
                borderColor: frame.color,
                left: `${(crop.left / width) * 100}%`,
                top: `${(crop.top / height) * 100}%`,
                width: `${(crop.width / width) * 100}%`,
                height: `${(crop.height / height) * 100}%`,
              }}
            />
          );
        })}
        <div
          className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black/40 shadow"
          style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
        />
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-fg-3">
        {FRAMES.map((frame) => (
          <li key={frame.name} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ backgroundColor: frame.color }} />
            {frame.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
