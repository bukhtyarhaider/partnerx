import { Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { useState } from "react";
import type { Expense, Transaction } from "../types";
import type { Financials } from "../hooks/useFinancials";
import { generateFinancialSummary } from "../utils/generateFinancialSummary";

export interface FinancialSummaryProps {
  transactions: Transaction[];
  expenses: Expense[];
  financials: Financials;
}

export const FinancialSummary = ({
  transactions,
  expenses,
  financials,
}: FinancialSummaryProps) => {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    setSummary("");

    try {
      const text = await generateFinancialSummary({
        transactions,
        expenses,
        financials,
      });
      setSummary(text);
    } catch {
      setError("Sorry, the AI summary could not be generated at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-5 shadow-md transition-shadow hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <Sparkles size={18} className="text-green-500" />
          AI Financial Summary
        </h3>

        <button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="mt-3 sm:mt-0 flex items-center gap-2 rounded-md bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Sparkles size={16} className="animate-bounce" />
          )}
          {isLoading ? "Analyzing..." : "Generate Summary"}
        </button>
      </div>

      <div className="mt-4">
        {isLoading && (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        )}

        {error && (
          <div className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        {summary && (
          <div
            className="prose prose-sm max-w-none dark:prose-invert mt-2 text-slate-700 dark:text-slate-300 animate-fade-in"
            dangerouslySetInnerHTML={{
              __html: summary
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\n/g, "<br />"),
            }}
          />
        )}
      </div>
    </div>
  );
};
