"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { DEVICE_SPECS, DeviceFrame, bestVariantFor, type DeviceVariant, type ScreenMode } from "./device-frame";

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
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full rounded-full bg-surface p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium transition sm:px-4 sm:text-[14px]",
              active ? "bg-elevated text-fg shadow-card" : "text-fg-2 hover:text-fg",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

const VARIANTS: DeviceVariant[] = ["duo-outer", "duo-inner", "pro"];
const MODES: { value: ScreenMode; label: string }[] = [
  { value: "lock", label: "Lock Screen" },
  { value: "home", label: "Home Screen" },
  { value: "clean", label: "Wallpaper" },
];

export function WallpaperPreview({
  src,
  alt,
  color,
  width,
  height,
}: {
  src: string;
  alt: string;
  color: string;
  width: number;
  height: number;
}) {
  const [variant, setVariant] = useState<DeviceVariant>(() => bestVariantFor(width, height));
  const [mode, setMode] = useState<ScreenMode>("lock");

  return (
    <div>
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[32px] bg-surface p-6 sm:aspect-square md:p-10">
        <div
          aria-hidden="true"
          className="absolute inset-[12%] rounded-full opacity-60 blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${color}, transparent)` }}
        />
        <DeviceFrame
          key={variant}
          variant={variant}
          src={src}
          alt={alt}
          color={color}
          mode={mode}
          priority
          className={cn(
            "relative animate-fade-in",
            variant === "duo-inner" ? "w-full max-w-[540px]" : variant === "pro" ? "h-[90%]" : "h-[78%]",
          )}
        />
      </div>
      <div className="mt-5 flex flex-col items-center gap-3">
        <Segmented
          label="Preview device"
          value={variant}
          onChange={setVariant}
          options={VARIANTS.map((item) => ({ value: item, label: DEVICE_SPECS[item].short }))}
        />
        <Segmented label="Preview screen" value={mode} onChange={setMode} options={MODES} />
      </div>
    </div>
  );
}
