"use client";
import { useEffect, useState } from "react";
import type { PublicCatalogItem } from "@/lib/public-catalog";
export function usePublicCatalog(enabled = true) {
  const [items, setItems] = useState<PublicCatalogItem[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    fetch("/public-catalog.json", { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error("Catalogue unavailable"); return r.json(); })
      .then((data: PublicCatalogItem[]) => setItems(data))
      .catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [enabled]);
  return { items, error };
}
