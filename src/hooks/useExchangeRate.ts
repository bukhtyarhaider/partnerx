import { useState, useEffect, useCallback } from "react";

interface ApiResponse {
  date: string;
  base: string;
  rates: {
    PKR: string;
  };
}

type Status = "loading" | "success" | "error";

interface UseExchangeRateProps {
  apiKey: string;
  autoFetch?: boolean; // Control whether to auto-fetch on mount
}

export const useExchangeRate = ({
  apiKey,
  autoFetch = true,
}: UseExchangeRateProps) => {
  const fallbackRate = 283.15;
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  const [rate, setRate] = useState<number | null>(() => {
    const cached = localStorage.getItem("exchangeRate");
    const cachedTime = localStorage.getItem("exchangeRateTime");

    if (cached && cachedTime) {
      const timeDiff = Date.now() - parseInt(cachedTime);
      // Changed from 1 hour to 24 hours
      if (timeDiff < CACHE_DURATION) {
        return parseFloat(cached);
      }
    }
    return null;
  });

  const [status, setStatus] = useState<Status>(() => {
    // If we have cached data, start with success status
    const cached = localStorage.getItem("exchangeRate");
    const cachedTime = localStorage.getItem("exchangeRateTime");

    if (cached && cachedTime) {
      const timeDiff = Date.now() - parseInt(cachedTime);
      if (timeDiff < CACHE_DURATION) {
        return "success";
      }
    }
    return autoFetch ? "loading" : "success";
  });

  const [lastUpdated, setLastUpdated] = useState<Date | null>(() => {
    const cachedTime = localStorage.getItem("exchangeRateTime");
    return cachedTime ? new Date(parseInt(cachedTime)) : null;
  });

  const [isJustUpdated, setIsJustUpdated] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Check if cached data is stale (older than 24 hours)
  const isCacheStale = useCallback(() => {
    const cachedTime = localStorage.getItem("exchangeRateTime");
    if (!cachedTime) return true;

    const timeDiff = Date.now() - parseInt(cachedTime);
    return timeDiff >= CACHE_DURATION;
  }, [CACHE_DURATION]);

  const fetchRate = useCallback(
    async (forceRefresh = false) => {
      // Don't fetch if we have fresh cached data and not forcing refresh
      if (!forceRefresh && !isCacheStale() && rate !== null) {
        return;
      }

      setIsFetching(true);
      if (!rate || forceRefresh) {
        setStatus("loading");
      }

      try {
        const url = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${apiKey}&symbols=PKR`;
        const response = await fetch(url);

        // Handle rate limiting specifically
        if (response.status === 429) {
          console.warn(
            "Exchange rate API rate limit exceeded. Using fallback rate."
          );
          // Use a fallback rate (approximate USD to PKR)

          if (rate !== fallbackRate) {
            setIsJustUpdated(true);
            setTimeout(() => setIsJustUpdated(false), 1200);
          }

          setRate(fallbackRate);
          setLastUpdated(new Date());
          setStatus("success");

          localStorage.setItem("exchangeRate", fallbackRate.toString());
          localStorage.setItem("exchangeRateTime", Date.now().toString());
          setIsFetching(false);
          return;
        }

        if (!response.ok)
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );

        const data: ApiResponse = await response.json();
        const pkrRate = parseFloat(data.rates.PKR);

        if (isNaN(pkrRate)) throw new Error("Invalid rate format from API.");

        if (rate !== pkrRate) {
          setIsJustUpdated(true);
          setTimeout(() => setIsJustUpdated(false), 1200);
        }

        setRate(pkrRate);
        setLastUpdated(new Date(data.date));
        setStatus("success");

        localStorage.setItem("exchangeRate", pkrRate.toString());
        localStorage.setItem("exchangeRateTime", Date.now().toString());
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);

        if (!rate) {
          setRate(fallbackRate);
          setLastUpdated(new Date());
          console.info("Using fallback exchange rate:", fallbackRate);
        }

        setStatus("error");
      } finally {
        setIsFetching(false);
      }
    },
    [apiKey, rate, isCacheStale]
  );

  // Manual refresh function
  const refreshRate = useCallback(async () => {
    await fetchRate(true);
  }, [fetchRate]);

  useEffect(() => {
    if (!autoFetch) return;

    // Only fetch if cache is stale or we don't have a rate
    if (isCacheStale() || rate === null) {
      fetchRate();
    }

    // Set up interval to check every 30 minutes if we need to fetch
    const intervalId = setInterval(() => {
      if (isCacheStale()) {
        fetchRate();
      }
    }, 30 * 60 * 1000); // Check every 30 minutes

    return () => clearInterval(intervalId);
  }, [fetchRate, autoFetch, isCacheStale, rate]);

  return {
    rate,
    status,
    lastUpdated,
    isJustUpdated,
    isFetching,
    refreshRate,
    isCacheStale: isCacheStale(),
  };
};
