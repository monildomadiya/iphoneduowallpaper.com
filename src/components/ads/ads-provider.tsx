"use client";

import { createContext, useContext } from "react";
import type { AdsConfig } from "@/lib/ads";

const EMPTY: AdsConfig = {
  enabled: false,
  clientId: null,
  placements: {},
  lazy: true,
  preview: false,
  testMode: false,
};

const AdsContext = createContext<AdsConfig>(EMPTY);

export function AdsProvider({ config, children }: { config: AdsConfig; children: React.ReactNode }) {
  return <AdsContext value={config}>{children}</AdsContext>;
}

export function useAdsConfig() {
  return useContext(AdsContext);
}
