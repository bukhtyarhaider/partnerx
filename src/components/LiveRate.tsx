import { DollarSign, Loader2, WifiOff } from "lucide-react";
import { useSharedExchangeRate } from "../hooks/useSharedExchangeRate";

export const LiveRate: React.FC = () => {
  const { rate, status, lastUpdated, isJustUpdated } = useSharedExchangeRate();

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex animate-pulse items-center gap-2 text-slate-500 dark:text-slate-400">
            <Loader2 size={16} className="animate-spin" />
            <span>Fetching rate...</span>
          </div>
        );
      case "success":
        return (
          <div>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-50">
              1 USD ={" "}
              <span
                className={`rounded-md px-1 py-0.5 text-green-600 dark:text-green-400 ${
                  isJustUpdated ? "animate-flash" : ""
                }`}
              >
                {rate?.toFixed(2)}
              </span>{" "}
              PKR
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
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
          <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
            <WifiOff size={16} />
            <span>Could not fetch rate</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-6 transform rounded-xl border border-slate-200 bg-slate-100 p-4 transition-transform duration-300 hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white p-2 dark:bg-slate-700">
          <DollarSign
            size={20}
            className="text-green-600 dark:text-green-400"
          />
        </div>
        {renderContent()}
      </div>
    </div>
  );
};
