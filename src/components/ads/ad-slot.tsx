"use client";

import { useEffect, useRef, useState } from "react";
import { adPlacement, type ResolvedPlacement } from "@/lib/ads";
import { AD_FORMATS, type AdFormat, type AdPlacement } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAdsConfig } from "./ads-provider";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * What each AdSense unit type needs on its `<ins>`, and how much room to keep for it.
 *
 * The reserved height is what stops the rest of the page jumping when the ad lands (CLS). Units
 * that come back empty collapse again through the `[data-ad-status="unfilled"]` rule in globals.css.
 */
const FORMATS: Record<AdFormat, { minHeight: number; attrs: Record<string, string>; centered?: boolean }> = {
  display: {
    minHeight: 280,
    attrs: { "data-ad-format": "auto", "data-full-width-responsive": "true" },
  },
  in_article: {
    minHeight: 250,
    attrs: { "data-ad-format": "fluid", "data-ad-layout": "in-article" },
    centered: true,
  },
  in_feed: {
    minHeight: 230,
    attrs: { "data-ad-format": "fluid" },
  },
  multiplex: {
    minHeight: 340,
    attrs: { "data-ad-format": "autorelaxed" },
  },
};

/** Ask for the ad once it is within this much of the viewport, not only once it is on screen. */
const LAZY_MARGIN = "400px 0px";

function AdUnit({
  clientId,
  resolved,
  lazy,
  testMode,
}: {
  clientId: string;
  resolved: ResolvedPlacement;
  lazy: boolean;
  testMode: boolean;
}) {
  const spec = FORMATS[resolved.format];
  const holder = useRef<HTMLDivElement>(null);
  const unit = useRef<HTMLModElement>(null);
  const [armed, setArmed] = useState(!lazy);

  // The `<ins>` is mounted only once armed. adsbygoogle fills the un-filled units it finds in DOM
  // order on each push, so handing it exactly one new element keeps every ad in its own slot.
  useEffect(() => {
    if (armed) return;
    const element = holder.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setArmed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { rootMargin: LAZY_MARGIN },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [armed]);

  useEffect(() => {
    if (!armed) return;
    const element = unit.current;
    if (!element || element.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers, a blocked script or a paused account — leave the slot empty.
    }
  }, [armed]);

  return (
    <div ref={holder} className="overflow-hidden" style={{ minHeight: spec.minHeight }}>
      {armed ? (
        <ins
          ref={unit}
          className="adsbygoogle block"
          style={{ display: "block", ...(spec.centered ? { textAlign: "center" as const } : {}) }}
          data-ad-client={clientId}
          data-ad-slot={resolved.slot}
          {...spec.attrs}
          {...(resolved.layoutKey ? { "data-ad-layout-key": resolved.layoutKey } : {})}
          {...(testMode ? { "data-adtest": "on" } : {})}
        />
      ) : null}
    </div>
  );
}

/** The outlined box Admin → Ads shows instead of a real unit, for checking where ads land. */
function PreviewBox({ placement, resolved }: { placement: AdPlacement; resolved?: ResolvedPlacement }) {
  const definition = adPlacement(placement);
  const format = resolved?.format ?? definition?.format ?? "display";
  const formatLabel = AD_FORMATS.find((item) => item.key === format)?.label ?? format;

  return (
    <div
      className="grid place-items-center rounded-2xl border-2 border-dashed border-accent/40 bg-accent/5 p-6 text-center"
      style={{ minHeight: FORMATS[format].minHeight }}
    >
      <div>
        <p className="text-[13px] font-semibold text-link">{definition?.label ?? placement}</p>
        <p className="mt-1 text-[12px] text-fg-2">
          {formatLabel} · {resolved ? `slot ${resolved.slot}` : "no ad unit set"}
        </p>
        <p className="mt-2 font-mono text-[11px] text-fg-3">{placement}</p>
      </div>
    </div>
  );
}

/**
 * A clearly labelled AdSense unit.
 *
 * Draws nothing unless Admin → Ads has the master switch on, a publisher ID saved and this
 * placement switched on with an ad unit ID. Everything else about it — which unit type, whether it
 * waits for the scroll — comes from that screen too, so adding or moving ads never needs a deploy.
 */
export function AdSlot({ placement, className }: { placement: AdPlacement; className?: string }) {
  const { enabled, clientId, placements, lazy, preview, testMode } = useAdsConfig();
  const [urlPreview, setUrlPreview] = useState(false);

  // `?ads=preview` on any page, so placement can be checked without showing boxes to visitors.
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the server cannot read the query string, so this has to settle after hydration
      if (new URLSearchParams(window.location.search).get("ads") === "preview") setUrlPreview(true);
    } catch {
      // Malformed query string — nothing to do.
    }
  }, []);

  const resolved = placements[placement];

  if (preview || urlPreview) {
    return (
      <aside aria-hidden="true" className={cn("mx-auto w-full", className)}>
        <PreviewBox placement={placement} resolved={resolved} />
      </aside>
    );
  }

  if (!enabled || !clientId || !resolved) return null;

  return (
    <aside aria-label="Advertisement" className={cn("ad-slot mx-auto w-full", className)}>
      <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-[0.12em] text-fg-3">
        Advertisement
      </p>
      {/* Keyed by placement and slot so a saved change in the admin panel remounts the unit. */}
      <AdUnit key={`${placement}:${resolved.slot}`} clientId={clientId} resolved={resolved} lazy={lazy} testMode={testMode} />
    </aside>
  );
}
