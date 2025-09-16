import { useState, useEffect } from "react";
import { DollarSign, Loader2, WifiOff } from "lucide-react";

// UPDATED: The type definition now matches the currencyfreaks.com API response.
// Note that rates.PKR is a string in this API response.
interface ApiResponse {
  date: string;
  base: string;
  rates: {
    PKR: string;
    USD: string;
  };
}

export const LiveRate: React.FC = () => {
  const [rate, setRate] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      setStatus("loading");
      try {
        // UPDATED: Switched to the new currencyfreaks.com API endpoint
        const apiKey = "28e666fcf05242399efff95d7fa528cc";
        const url = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${apiKey}&symbols=PKR`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data: ApiResponse = await response.json();

        // UPDATED: Parse the rate from a string to a number and handle potential errors
        const pkrRate = parseFloat(data.rates.PKR);
        if (isNaN(pkrRate)) {
          throw new Error("Invalid rate format received from API.");
        }

        setRate(pkrRate);
        setLastUpdated(new Date(data.date)); // Use the more accurate date from the API
        setStatus("success");
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        setStatus("error");
      }
    };

    fetchRate(); // Fetch immediately on mount
    const intervalId = setInterval(fetchRate, 300000); // Refresh every 5 minutes
    return () => clearInterval(intervalId); // Cleanup interval
  }, []);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex items-center gap-2 text-slate-500 animate-pulse">
            <Loader2 size={16} className="animate-spin" />
            <span>Fetching rate...</span>
          </div>
        );
      case "success":
        return (
          <div>
            <p className="font-bold text-xl text-wise-blue">
              1 USD ={" "}
              <span className="text-wise-green">{rate?.toFixed(2)}</span> PKR
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Last updated:{" "}
              {lastUpdated?.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <WifiOff size={16} />
            <span>Could not fetch rate</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-wise-blue-light p-4 rounded-xl border border-slate-200 mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-full">
          <DollarSign size={20} className="text-wise-green" />
        </div>
        {renderContent()}
      </div>
    </div>
  );
};
