"use client";

import { Share } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export function ShareButton({ title, path }: { title: string; path: string }) {
  async function share() {
    const url = new URL(path, window.location.origin).toString();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy the link");
    }
  }

  return (
    <button type="button" onClick={share} className="btn-secondary h-12 px-4" aria-label="Share this wallpaper">
      <Share className="size-[18px]" />
      <span className="sm:hidden">Share</span>
    </button>
  );
}

/** Counts one view per wallpaper per browser session. */
export function ViewTracker({ id }: { id: string }) {
  useEffect(() => {
    const key = `viewed:${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable — still count once for this mount.
    }
    const body = JSON.stringify({ id, event: "view" });
    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", {
        method: "POST",
        body,
        keepalive: true,
        headers: { "Content-Type": "application/json" },
      }).catch(() => undefined);
    }
  }, [id]);

  return null;
}
