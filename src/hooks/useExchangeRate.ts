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
  const [rate, setRate] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isJustUpdated, setIsJustUpdated] = useState(false);

  const fetchRate = useCallback(async () => {
    // Don't show loading spinner on background refreshes
    if (!rate) {
      setStatus("loading");
    }

    try {
      const url = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${apiKey}&symbols=PKR`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");

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
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error);
      setStatus("error");
    }
  }, [apiKey, rate]);

  useEffect(() => {
    fetchRate(); // Fetch immediately on mount
    const intervalId = setInterval(fetchRate, 300000); // Refresh every 5 minutes
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchRate]);

  return { rate, status, lastUpdated, isJustUpdated };
};
