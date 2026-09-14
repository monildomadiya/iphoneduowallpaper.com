"use client";

import { useEffect, useRef } from "react";
import type { AdPlacement } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAdsConfig } from "./ads-provider";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

function AdUnit({ clientId, slot, testMode }: { clientId: string; slot: string; testMode: boolean }) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || element.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers or a not-yet-approved account — fail silently.
    }
  }, []);

  return (
    <ins
      ref={ref}
      className="adsbygoogle block"
      style={{ display: "block" }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
      {...(testMode ? { "data-adtest": "on" } : {})}
    />
  );
}

/**
 * A clearly labeled, responsive AdSense unit.
 * Renders nothing until ads are enabled and a slot ID is configured in Admin → Ads.
 */
export function AdSlot({ placement, className }: { placement: AdPlacement; className?: string }) {
  const { enabled, clientId, slots, testMode } = useAdsConfig();
  const slot = slots[placement];

  if (!enabled || !clientId || !slot) return null;

  return (
    <aside aria-label="Advertisement" className={cn("ad-slot mx-auto w-full", className)}>
      <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-[0.12em] text-fg-3">
        Advertisement
      </p>
      <div className="min-h-[100px] overflow-hidden">
        {/* Pages re-mount on navigation, so every page view requests a fresh ad. */}
        <AdUnit clientId={clientId} slot={slot} testMode={testMode} />
      </div>
    </aside>
  );
}
