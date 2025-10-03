import { createContext } from "react";

export interface ExchangeRateContextValue {
  rate: number | null;
  status: "loading" | "success" | "error";
  lastUpdated: Date | null;
  isJustUpdated: boolean;
  isFetching: boolean;
  isCacheStale: boolean;
  refreshRate: () => Promise<void>;
}

export const ExchangeRateContext =
  createContext<ExchangeRateContextValue | null>(null);
