import { useCallback } from "react";
import { useSharedExchangeRate } from "./useSharedExchangeRate";

export const useConversionRateAutoFill = () => {
  const { rate, status, lastUpdated, refreshRate, isFetching, isCacheStale } =
    useSharedExchangeRate();

  // Auto-fill function that returns the latest rate
  const fillLatestRate = useCallback(async (): Promise<number | null> => {
    try {
      // If we have fresh cached data, return it immediately
      if (rate && !isCacheStale) {
        return rate;
      }

      // Otherwise fetch the latest rate
      await refreshRate();
      return rate;
    } catch (error) {
      console.error("Failed to fetch latest rate for auto-fill:", error);
      return rate; // Return cached rate as fallback
    }
  }, [rate, isCacheStale, refreshRate]);

  // Manual refresh for explicit user action
  const manualRefresh = useCallback(async (): Promise<number | null> => {
    await refreshRate();
    return rate;
  }, [refreshRate, rate]);

  return {
    // Current rate data
    currentRate: rate,
    status,
    lastUpdated,
    isCacheStale,
    isFetching,

    // Auto-fill functions
    fillLatestRate,
    manualRefresh,

    // Helper to format the rate for display
    formatRate: (rate: number | null) => (rate ? rate.toFixed(2) : null),

    // Helper to check if rate is available
    hasRate: rate !== null,
  };
};
