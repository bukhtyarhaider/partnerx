import { Loader2, Sparkles } from "lucide-react";
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
    <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50">
          AI Financial Summary
        </h3>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="mt-3 sm:mt-0 flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Sparkles size={18} />
          )}
          {isLoading ? "Analyzing..." : "Get AI Summary"}
        </button>
      </div>
      <div className="mt-4">
        {isLoading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {summary && (
          <div
            className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300"
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
