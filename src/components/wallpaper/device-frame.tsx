/* eslint-disable @next/next/no-img-element -- images are pre-optimized WebP files served from Cloudflare R2 */
import { Camera, Flashlight } from "lucide-react";
import { MOCKUP_DATE, MOCKUP_TIME } from "@/lib/site";
import { cn } from "@/lib/utils";

export type DeviceVariant = "duo-outer" | "duo-inner" | "pro";
export type ScreenMode = "lock" | "home" | "clean";

export const DEVICE_SPECS: Record<
  DeviceVariant,
  { label: string; short: string; width: number; height: number; radius: number; bezel: number }
> = {
  "duo-outer": { label: "iPhone Duo · Outer display", short: "Duo Outer", width: 1398, height: 2034, radius: 11.5, bezel: 2.3 },
  "duo-inner": { label: "iPhone Duo · Inner display", short: "Duo Inner", width: 2670, height: 1878, radius: 4.4, bezel: 1.2 },
  pro: { label: "iPhone 18 Pro Max", short: "18 Pro Max", width: 1320, height: 2868, radius: 14, bezel: 2.8 },
};

/** Suggests the device whose screen shape best matches an image. */
export function bestVariantFor(width: number, height: number): DeviceVariant {
  const ratio = width / height;
  if (ratio > 1.05) return "duo-inner";
  if (ratio < 0.56) return "pro";
  return "duo-outer";
}

const ARTWORK = [
  "radial-gradient(90% 70% at 15% 10%, #0a84ff 0%, transparent 60%), radial-gradient(80% 70% at 90% 35%, #bf5af2 0%, transparent 60%), radial-gradient(100% 80% at 40% 100%, #ff375f 0%, transparent 65%), #0b0b1f",
  "radial-gradient(90% 80% at 80% 0%, #ffd60a 0%, transparent 55%), radial-gradient(90% 80% at 0% 60%, #ff9f0a 0%, transparent 60%), radial-gradient(120% 90% at 100% 100%, #ff2d55 0%, transparent 65%), #2a0a12",
  "radial-gradient(100% 70% at 50% 0%, #64d2ff 0%, transparent 60%), radial-gradient(90% 90% at 0% 100%, #30d158 0%, transparent 60%), radial-gradient(90% 90% at 100% 80%, #5e5ce6 0%, transparent 60%), #04121a",
  "radial-gradient(80% 60% at 30% 20%, #f5f5f7 0%, transparent 60%), radial-gradient(100% 90% at 90% 90%, #c7c7cc 0%, transparent 60%), radial-gradient(90% 80% at 0% 100%, #aeaeb2 0%, transparent 60%), #e5e5ea",
];

export function Artwork({ index = 0 }: { index?: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{ background: ARTWORK[Math.abs(index) % ARTWORK.length] }}
    />
  );
}

function LockScreen({ variant }: { variant: DeviceVariant }) {
  const inner = variant === "duo-inner";
  const button = inner ? "4.2cqw" : "11cqw";
  const icon = inner ? "1.8cqw" : "4.6cqw";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex flex-col items-center text-white"
      style={{
        paddingTop: inner ? "5%" : variant === "pro" ? "13%" : "10%",
        textShadow: "0 1px 14px rgba(0,0,0,0.28)",
      }}
    >
      <p className="font-semibold tracking-tight" style={{ fontSize: inner ? "1.9cqw" : "4.7cqw" }}>
        {MOCKUP_DATE}
      </p>
      <p
        className="font-bold leading-none tracking-[-0.02em]"
        style={{ fontSize: inner ? "9.5cqw" : "23cqw", marginTop: inner ? "0.2cqw" : "0.5cqw" }}
      >
        {MOCKUP_TIME}
      </p>
      <div
        className="mt-auto flex w-full items-center justify-between"
        style={{ padding: inner ? "0 3.5cqw 3.2cqw" : "0 9cqw 8cqw" }}
      >
        {[Flashlight, Camera].map((Icon, index) => (
          <span
            key={index}
            className="grid place-items-center rounded-full bg-black/30"
            style={{ width: button, height: button }}
          >
            <Icon style={{ width: icon, height: icon }} strokeWidth={2} />
          </span>
        ))}
      </div>
      <span
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/90"
        style={{ bottom: inner ? "1.6%" : "1.3%", height: inner ? "0.45cqw" : "1.2cqw", width: inner ? "14cqw" : "36cqw" }}
      />
    </div>
  );
}

function HomeScreen({ variant }: { variant: DeviceVariant }) {
  const inner = variant === "duo-inner";
  const columns = inner ? 8 : 4;
  const rows = inner ? 3 : variant === "pro" ? 6 : 4;
  const icons = Array.from({ length: columns * rows });

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: inner ? "2.6cqw 3.4cqw" : "6cqw 5.6cqw",
          padding: inner ? "5% 8% 0" : variant === "pro" ? "17% 7.5% 0" : "13% 7.5% 0",
        }}
      >
        {icons.map((_, index) => (
          <span key={index} className="aspect-square rounded-[23%] bg-white/30 ring-1 ring-white/25" />
        ))}
      </div>
      <div
        className="absolute left-1/2 grid -translate-x-1/2 grid-cols-4 bg-white/25 ring-1 ring-white/20"
        style={{
          bottom: inner ? "4%" : "2.4%",
          width: inner ? "40%" : "90%",
          gap: inner ? "2.4cqw" : "5.5cqw",
          padding: inner ? "1.4cqw 2cqw" : "3.6cqw 4.4cqw",
          borderRadius: inner ? "3cqw" : "9cqw",
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} className="aspect-square rounded-[23%] bg-white/45" />
        ))}
      </div>
    </div>
  );
}

interface DeviceFrameProps {
  variant: DeviceVariant;
  src?: string | null;
  alt?: string;
  color?: string;
  mode?: ScreenMode;
  priority?: boolean;
  artwork?: number;
  className?: string;
}

/** Pure-CSS device mockup with accurate screen proportions. */
export function DeviceFrame({
  variant,
  src,
  alt = "",
  color = "#1d1d1f",
  mode = "lock",
  priority = false,
  artwork = 0,
  className,
}: DeviceFrameProps) {
  const spec = DEVICE_SPECS[variant];
  const edge = variant === "duo-inner" ? 0.45 : 1;
  const outerRadius = `${spec.radius}cqw`;
  const screenRadius = `calc(${spec.radius}cqw - ${edge + spec.bezel}cqw)`;

  return (
    <div className={cn("@container relative", className)} style={{ aspectRatio: `${spec.width} / ${spec.height}` }}>
      <div
        className="absolute inset-0 bg-linear-to-br from-[#e3e3e8] via-[#9a9aa0] to-[#56565b] shadow-float dark:from-[#6b6b70] dark:via-[#36363a] dark:to-[#161618]"
        style={{ borderRadius: outerRadius, padding: `${edge}cqw` }}
      >
        <div
          className="size-full bg-black"
          style={{ borderRadius: `calc(${spec.radius}cqw - ${edge}cqw)`, padding: `${spec.bezel}cqw` }}
        >
          <div
            className="relative size-full overflow-hidden"
            style={{ borderRadius: screenRadius, backgroundColor: color }}
          >
            {src ? (
              <img
                src={src}
                alt={alt}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                decoding="async"
                draggable={false}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <Artwork index={artwork} />
            )}

            {variant === "duo-inner" ? (
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-1/2 w-[1.4cqw] -translate-x-1/2 bg-linear-to-r from-transparent via-white/15 to-transparent"
              />
            ) : null}

            {mode === "lock" ? <LockScreen variant={variant} /> : null}
            {mode === "home" ? <HomeScreen variant={variant} /> : null}

            {variant === "pro" ? (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[1.5%] h-[3.6%] w-[30%] -translate-x-1/2 rounded-full bg-black"
              />
            ) : null}
            {variant === "duo-outer" ? (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[2.4%] size-[4cqw] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
