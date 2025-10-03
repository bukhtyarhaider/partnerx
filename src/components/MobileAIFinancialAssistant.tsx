import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  Loader2,
  AlertTriangle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Brain,
} from "lucide-react";
import type { Expense, Transaction, FinancialSummaryRecord } from "../types";
import type { Financials } from "../hooks/useFinancials";
import type { DateFilterValue } from "./DateFilter";
import { generateFinancialSummary } from "../utils/generateFinancialSummary";
import { useConfirmation } from "../hooks/useConfirmation";
import { ConfirmationModal } from "./common/ConfirmationModal";

interface MobileAIFinancialAssistantProps {
  transactions: Transaction[];
  expenses: Expense[];
  financials: Financials;
  summaries: FinancialSummaryRecord[];
  dateFilter: DateFilterValue;
  onAddSummary: (text: string) => void;
  onDeleteSummary: (id: number) => void;
}

export const MobileAIFinancialAssistant: React.FC<
  MobileAIFinancialAssistantProps
> = ({
  transactions,
  expenses,
  financials,
  summaries = [],
  dateFilter,
  onAddSummary,
  onDeleteSummary,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSummaryId, setExpandedSummaryId] = useState<number | null>(
    null
  );

  const { confirmation, showConfirmation, hideConfirmation } =
    useConfirmation();

  const hasDataToAnalyze = transactions.length > 0 || expenses.length > 0;

  const handleGenerateSummary = async () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }

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
      setError(
        "I apologize, but I cannot generate a financial summary at this time. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSummary = (summary: FinancialSummaryRecord) => {
    showConfirmation({
      title: "Delete AI Analysis",
      message:
        "Are you sure you want to delete this financial analysis? This action cannot be undone.",
      confirmText: "Delete Analysis",
      variant: "danger",
      onConfirm: () => onDeleteSummary(summary.id),
    });
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

  const formatHtml = (text: string) => {
    // Enhanced formatting for better visual hierarchy and structure (same as desktop)
    const formatted = text
      // Bold text formatting
      .replace(
        /\*\*(.*?)\*\*/g,
        "<strong class='text-slate-900 dark:text-slate-100 font-semibold'>$1</strong>"
      )

      // Section headers (lines starting with ##)
      .replace(
        /^## (.*$)/gm,
        "<h3 class='text-base font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2 flex items-center'><span class='w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-2'></span>$1</h3>"
      )

      // Subsection headers (lines starting with ###)
      .replace(
        /^### (.*$)/gm,
        "<h4 class='text-sm font-semibold text-slate-800 dark:text-slate-200 mt-3 mb-1 flex items-center'><span class='w-1 h-1 rounded-full bg-indigo-400 mr-2'></span>$1</h4>"
      )

      // Key metrics or numbers (detect patterns like $X, ₨X, X%, etc.)
      .replace(
        /(\$[\d,]+(?:\.\d{2})?)/g,
        "<span class='inline-flex items-center px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-mono font-medium text-xs'>$1</span>"
      )
      .replace(
        /(₨[\d,]+(?:\.\d{2})?)/g,
        "<span class='inline-flex items-center px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 font-mono font-medium text-xs'>$1</span>"
      )
      .replace(
        /(\d+(?:\.\d+)?%)/g,
        "<span class='inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-mono font-medium text-xs'>$1</span>"
      )

      // List items (lines starting with - or •)
      .replace(
        /^[-•] (.*$)/gm,
        "<div class='flex items-start mt-1.5 mb-1'><span class='w-1 h-1 rounded-full bg-indigo-400 mr-2 mt-1.5 flex-shrink-0'></span><span class='text-slate-700 dark:text-slate-300 text-sm'>$1</span></div>"
      )

      // Recommendations or insights (lines starting with 💡 or ✅ or ⚠️)
      .replace(
        /^💡 (.*$)/gm,
        "<div class='flex items-start mt-2 mb-1.5 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-l-2 border-yellow-400'><span class='text-yellow-600 dark:text-yellow-400 mr-1.5 mt-0.5 text-sm'>💡</span><span class='text-yellow-800 dark:text-yellow-200 font-medium text-sm'>$1</span></div>"
      )
      .replace(
        /^✅ (.*$)/gm,
        "<div class='flex items-start mt-2 mb-1.5 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-2 border-green-400'><span class='text-green-600 dark:text-green-400 mr-1.5 mt-0.5 text-sm'>✅</span><span class='text-green-800 dark:text-green-200 font-medium text-sm'>$1</span></div>"
      )
      .replace(
        /^⚠️ (.*$)/gm,
        "<div class='flex items-start mt-2 mb-1.5 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-2 border-red-400'><span class='text-red-600 dark:text-red-400 mr-1.5 mt-0.5 text-sm'>⚠️</span><span class='text-red-800 dark:text-red-200 font-medium text-sm'>$1</span></div>"
      )

      // Line breaks
      .replace(/\n\n/g, "<div class='h-2'></div>") // Double line breaks become spacing
      .replace(/\n/g, "<br />");

    // Wrap the content in a structured container
    return `<div class="space-y-1">${formatted}</div>`;
  };

  const renderCompactView = () => (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:border-slate-700 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left transition-all duration-200 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              {summaries.length > 0 && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-slate-900" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                AI Financial Insights
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {summaries.length > 0
                  ? `${summaries.length} analysis available`
                  : hasDataToAnalyze
                  ? "Get AI-powered financial insights"
                  : "Add financial data to get started"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {summaries.length > 0 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 shadow-sm">
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {summaries.length}
                </span>
              </div>
            )}
            <ChevronDown
              className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {/* Quick Action Bar - Enhanced styling */}
      {!isExpanded && (
        <div className="border-t border-slate-200 dark:border-slate-700/50 px-4 py-3">
          <button
            onClick={handleGenerateSummary}
            disabled={isLoading || !hasDataToAnalyze}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
            {isLoading
              ? "Analyzing..."
              : !hasDataToAnalyze
              ? "No Data"
              : "Generate Analysis"}
          </button>
        </div>
      )}
    </div>
  );

  const renderExpandedView = () => (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 shadow-lg">
      {/* Enhanced Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 p-4">
        <button
          onClick={() => setIsExpanded(false)}
          className="w-full text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-slate-900" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  AI Financial Assistant
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Comprehensive financial analysis and insights
                </p>
              </div>
            </div>
            <ChevronUp className="h-5 w-5 text-slate-400" />
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Generate Button */}
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading || !hasDataToAnalyze}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-sm font-medium text-white transition-all hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isLoading
            ? "Analyzing Your Financial Data..."
            : !hasDataToAnalyze
            ? "No Data Available for Analysis"
            : "Generate New Analysis"}
        </button>

        {/* Loading State - Enhanced */}
        {isLoading && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                <Loader2 className="h-3 w-3 animate-spin text-white" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                  Analyzing Your Financial Data
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Processing transactions and generating insights...
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="space-y-3">
                <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-3/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-2/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        )}

        {/* Error State - Enhanced */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100 mb-1 text-sm">
                  Analysis Error
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summaries */}
        {summaries.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                AI Analyses ({summaries.length})
              </h4>
            </div>

            <div className="max-h-80 space-y-4 overflow-y-auto">
              {[...summaries].reverse().map((summary) => {
                const isExpanded = expandedSummaryId === summary.id;
                const formattedHtml = formatHtml(summary.text);
                const displayedHtml = isExpanded
                  ? formattedHtml
                  : truncateHtml(formattedHtml, 120);

                return (
                  <div key={summary.id} className="group">
                    {/* Enhanced Header */}
                    <div className="mb-3 flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <h5 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                            Financial Analysis
                          </h5>
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="h-2.5 w-2.5" />
                            {new Date(summary.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSummary(summary)}
                        className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Enhanced Content Area */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                      <div
                        className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-strong:text-slate-900 dark:prose-strong:text-slate-100"
                        dangerouslySetInnerHTML={{ __html: displayedHtml }}
                      />

                      {formattedHtml.length > 120 && (
                        <button
                          onClick={() => toggleExpand(summary.id)}
                          className="mt-3 flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          {isExpanded ? (
                            <>
                              Show Less <ChevronUp className="ml-1 h-3 w-3" />
                            </>
                          ) : (
                            <>
                              Show More <ChevronDown className="ml-1 h-3 w-3" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State - Enhanced */}
        {summaries.length === 0 && !isLoading && !error && (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50">
              <Sparkles className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
              {hasDataToAnalyze
                ? "Ready for AI Analysis"
                : "No Financial Data Available"}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 px-4">
              {hasDataToAnalyze
                ? "Get AI-powered insights about your financial health, spending patterns, and personalized recommendations."
                : "Add some transactions or expenses to get started with AI-powered financial analysis and personalized insights."}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {isExpanded ? renderExpandedView() : renderCompactView()}

      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={hideConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        variant={confirmation.variant}
      />
    </>
  );
};
