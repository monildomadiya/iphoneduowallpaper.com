"use client";

import { createContext, useContext } from "react";
import type { AdPlacement } from "@/lib/types";

export interface AdsConfig {
  enabled: boolean;
  clientId: string | null;
  slots: Partial<Record<AdPlacement, string>>;
  testMode: boolean;
}

const AdsContext = createContext<AdsConfig>({ enabled: false, clientId: null, slots: {}, testMode: false });

export function AdsProvider({ config, children }: { config: AdsConfig; children: React.ReactNode }) {
  return <AdsContext value={config}>{children}</AdsContext>;
}

export function useAdsConfig() {
  return useContext(AdsContext);
}
