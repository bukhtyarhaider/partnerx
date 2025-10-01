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
}

export const useExchangeRate = ({ apiKey }: UseExchangeRateProps) => {
  const [rate, setRate] = useState<number | null>(() => {
    // Try to load cached rate from localStorage
    const cached = localStorage.getItem("exchangeRate");
    const cachedTime = localStorage.getItem("exchangeRateTime");

    if (cached && cachedTime) {
      const timeDiff = Date.now() - parseInt(cachedTime);
      // Use cached rate if it's less than 1 hour old
      if (timeDiff < 3600000) {
        return parseFloat(cached);
      }
    }
    return null;
  });
  const [status, setStatus] = useState<Status>("loading");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(() => {
    const cachedTime = localStorage.getItem("exchangeRateTime");
    return cachedTime ? new Date(parseInt(cachedTime)) : null;
  });
  const [isJustUpdated, setIsJustUpdated] = useState(false);

  const fetchRate = useCallback(async () => {
    // Don't show loading spinner on background refreshes
    if (!rate) {
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
        const fallbackRate = 278.5; // Approximate current rate

        if (rate !== fallbackRate) {
          setIsJustUpdated(true);
          setTimeout(() => setIsJustUpdated(false), 1200);
        }

        setRate(fallbackRate);
        setLastUpdated(new Date()); // Use current date for fallback
        setStatus("success");

        // Cache the fallback rate
        localStorage.setItem("exchangeRate", fallbackRate.toString());
        localStorage.setItem("exchangeRateTime", Date.now().toString());
        return;
      }

      if (!response.ok)
        throw new Error(`API Error: ${response.status} ${response.statusText}`);

      const data: ApiResponse = await response.json();
      const pkrRate = parseFloat(data.rates.PKR);

      if (isNaN(pkrRate)) throw new Error("Invalid rate format from API.");

      // Trigger flash animation only if the rate has actually changed
      if (rate !== pkrRate) {
        setIsJustUpdated(true);
        setTimeout(() => setIsJustUpdated(false), 1200); // Animation duration
      }

      setRate(pkrRate);
      setLastUpdated(new Date(data.date));
      setStatus("success");

      // Cache the successful result
      localStorage.setItem("exchangeRate", pkrRate.toString());
      localStorage.setItem("exchangeRateTime", Date.now().toString());
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error);

      // If we don't have a rate yet, use a fallback
      if (!rate) {
        const fallbackRate = 278.5; // Approximate current rate
        setRate(fallbackRate);
        setLastUpdated(new Date());
        console.info("Using fallback exchange rate:", fallbackRate);
      }

      setStatus("error");
    }
  }, [apiKey, rate]);

  useEffect(() => {
    fetchRate(); // Fetch immediately on mount
    const intervalId = setInterval(fetchRate, 1800000); // Refresh every 30 minutes instead of 5
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchRate]);

  return { rate, status, lastUpdated, isJustUpdated };
};
