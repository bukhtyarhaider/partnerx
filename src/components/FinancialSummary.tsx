import {
  Loader2,
  Sparkles,
  AlertTriangle,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import type { Expense, Transaction, FinancialSummaryRecord } from "../types";
import type { Financials } from "../hooks/useFinancials";
import type { DateFilterValue } from "./DateFilter";
import { ConfirmationModal } from "./common/ConfirmationModal";
import { generateFinancialSummary } from "../utils/generateFinancialSummary";
import { useConfirmation } from "../hooks/useConfirmation";

export interface FinancialSummaryProps {
  transactions: Transaction[];
  expenses: Expense[];
  financials: Financials;
  summaries: FinancialSummaryRecord[];
  dateFilter: DateFilterValue;
  onAddSummary: (text: string) => void;
  onDeleteSummary: (id: number) => void;
}

export const FinancialSummary = ({
  transactions,
  expenses,
  financials,
  summaries = [],
  dateFilter,
  onAddSummary = () => {},
  onDeleteSummary = () => {},
}: FinancialSummaryProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [expandedSummaryId, setExpandedSummaryId] = useState<number | null>(
    null
  );
  const { confirmation, showConfirmation, hideConfirmation } =
    useConfirmation();

  const handleDeleteClick = (summary: FinancialSummaryRecord) => {
    showConfirmation({
      title: "Delete Summary",
      message: `Are you sure you want to delete this AI-generated summary? This action cannot be undone.`,
      confirmText: "Delete Summary",
      variant: "danger",
      onConfirm: () => onDeleteSummary(summary.id),
    });
  };

  const handleGenerateSummary = async () => {
    setIsMaximized(true);
    setIsLoading(true);
    setError(null);

    try {
      const text = await generateFinancialSummary({
        transactions,
        expenses,
        financials,
        dateFilter,
      });
      onAddSummary(text);
    } catch (err) {
      console.error("Error generating financial summary:", err);
      setError("Sorry, the AI summary could not be generated at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedSummaryId((prev) => (prev === id ? null : id));
  };

  const truncateHtml = (html: string, maxLength = 100) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-5 md:mx-5 shadow-md transition-shadow hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/80 ">
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        onClick={() => setIsMaximized((prev) => !prev)}
      >
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
          {isLoading ? "Analyzing..." : "Generate New Summary"}
        </button>
      </div>

      {isMaximized && (
        <>
          {isLoading && (
            <div className="mt-4">
              <div className="space-y-2 animate-pulse">
                <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-slate-700 dark:text-slate-200">
              Saved Summaries
            </h4>
            {summaries.length > 0 ? (
              <div className="max-h-86 space-y-4 overflow-y-auto pr-2">
                {[...summaries].reverse().map((summary) => {
                  const isExpanded = expandedSummaryId === summary.id;
                  const formattedHtml = summary.text
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br />");

                  const displayedHtml = isExpanded
                    ? formattedHtml
                    : truncateHtml(formattedHtml);

                  return (
                    <div
                      key={summary.id}
                      className="group relative rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800 animate-fade-in cursor-pointer"
                      onClick={() => toggleExpand(summary.id)}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {new Date(summary.createdAt).toLocaleString()}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(summary);
                          }}
                          className="rounded-full p-1.5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                          aria-label="Delete summary"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div
                        className="prose prose-sm max-w-none dark:prose-invert mt-2 text-slate-700 dark:text-slate-300"
                        dangerouslySetInnerHTML={{ __html: displayedHtml }}
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(summary.id);
                        }}
                        className="mt-2 flex items-center text-xs font-medium text-green-600 hover:underline dark:text-green-400"
                      >
                        {isExpanded ? (
                          <>
                            Show Less <ChevronUp className="ml-1" size={14} />
                          </>
                        ) : (
                          <>
                            Show More <ChevronDown className="ml-1" size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">
                No summaries generated yet. Click the button above to create
                one.
              </p>
            )}
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={hideConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        variant={confirmation.variant}
      />
    </div>
  );
};
