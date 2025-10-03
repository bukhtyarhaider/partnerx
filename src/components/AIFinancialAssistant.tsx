import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  Loader2,
  AlertTriangle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Expense, Transaction, FinancialSummaryRecord } from "../types";
import type { Financials } from "../hooks/useFinancials";
import type { DateFilterValue } from "./DateFilter";
import { generateFinancialSummary } from "../utils/generateFinancialSummary";
import { useConfirmation } from "../hooks/useConfirmation";
import { ConfirmationModal } from "./common/ConfirmationModal";

interface AIFinancialAssistantProps {
  transactions: Transaction[];
  expenses: Expense[];
  financials: Financials;
  summaries: FinancialSummaryRecord[];
  dateFilter: DateFilterValue;
  onAddSummary: (text: string) => void;
  onDeleteSummary: (id: number) => void;
}

type AssistantState = "minimized" | "chat" | "fullscreen";

export const AIFinancialAssistant: React.FC<AIFinancialAssistantProps> = ({
  transactions,
  expenses,
  financials,
  summaries = [],
  dateFilter,
  onAddSummary,
  onDeleteSummary,
}) => {
  const [state, setState] = useState<AssistantState>("minimized");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSummaryId, setExpandedSummaryId] = useState<number | null>(
    null
  );
  const [showWelcome, setShowWelcome] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  const { confirmation, showConfirmation, hideConfirmation } =
    useConfirmation();

  // Check if there's any data to analyze
  const hasDataToAnalyze = transactions.length > 0 || expenses.length > 0;

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [summaries, isLoading]);

  const handleGenerateSummary = async () => {
    if (state === "minimized") {
      setState("chat");
    }

    setShowWelcome(false);
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

  const truncateHtml = (html: string, maxLength = 120) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const formatHtml = (text: string) => {
    // Enhanced formatting for better visual hierarchy and structure
    const formatted = text
      // Bold text formatting
      .replace(
        /\*\*(.*?)\*\*/g,
        "<strong class='text-slate-900 dark:text-slate-100 font-semibold'>$1</strong>"
      )

      // Section headers (lines starting with ##)
      .replace(
        /^## (.*$)/gm,
        "<h3 class='text-lg font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3 flex items-center'><span class='w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-3'></span>$1</h3>"
      )

      // Subsection headers (lines starting with ###)
      .replace(
        /^### (.*$)/gm,
        "<h4 class='text-base font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2 flex items-center'><span class='w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2'></span>$1</h4>"
      )

      // Key metrics or numbers (detect patterns like $X, ₨X, X%, etc.)
      .replace(
        /(\$[\d,]+(?:\.\d{2})?)/g,
        "<span class='inline-flex items-center px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-mono font-medium text-sm'>$1</span>"
      )
      .replace(
        /(₨[\d,]+(?:\.\d{2})?)/g,
        "<span class='inline-flex items-center px-2 py-1 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 font-mono font-medium text-sm'>$1</span>"
      )
      .replace(
        /(\d+(?:\.\d+)?%)/g,
        "<span class='inline-flex items-center px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-mono font-medium text-sm'>$1</span>"
      )

      // List items (lines starting with - or •)
      .replace(
        /^[-•] (.*$)/gm,
        "<div class='flex items-start mt-2 mb-1'><span class='w-1.5 h-1.5 rounded-full bg-indigo-400 mr-3 mt-2 flex-shrink-0'></span><span class='text-slate-700 dark:text-slate-300'>$1</span></div>"
      )

      // Recommendations or insights (lines starting with 💡 or ✅ or ⚠️)
      .replace(
        /^💡 (.*$)/gm,
        "<div class='flex items-start mt-3 mb-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400'><span class='text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5'>💡</span><span class='text-yellow-800 dark:text-yellow-200 font-medium'>$1</span></div>"
      )
      .replace(
        /^✅ (.*$)/gm,
        "<div class='flex items-start mt-3 mb-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400'><span class='text-green-600 dark:text-green-400 mr-2 mt-0.5'>✅</span><span class='text-green-800 dark:text-green-200 font-medium'>$1</span></div>"
      )
      .replace(
        /^⚠️ (.*$)/gm,
        "<div class='flex items-start mt-3 mb-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400'><span class='text-red-600 dark:text-red-400 mr-2 mt-0.5'>⚠️</span><span class='text-red-800 dark:text-red-200 font-medium'>$1</span></div>"
      )

      // Line breaks
      .replace(/\n\n/g, "<div class='h-4'></div>") // Double line breaks become spacing
      .replace(/\n/g, "<br />");

    // Wrap the content in a structured container
    return `<div class="space-y-2">${formatted}</div>`;
  };

  const renderMinimized = () => (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={() => setState("chat")}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg transition-all duration-300 hover:shadow-xl"
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-slate-900">
          <div className="relative">
            <Bot className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <motion.div
              className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 group-hover:animate-ping" />

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
          AI Financial Assistant
          <div className="absolute top-full right-4 border-4 border-transparent border-t-slate-900 dark:border-t-slate-100" />
        </div>
      </button>
    </motion.div>
  );

  const renderChat = () => (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <div className="w-96 max-w-[calc(100vw-3rem)] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-slate-700 dark:bg-slate-900/95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-slate-900"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                AI Financial Assistant
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Always ready to analyze your finances
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setState("fullscreen")}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setState("minimized")}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Chat Content */}
        <div ref={chatRef} className="max-h-96 overflow-y-auto p-4">
          {/* Welcome Message */}
          {showWelcome && summaries.length === 0 && (
            <div className="mb-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 dark:from-indigo-950/50 dark:to-purple-950/50">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Hello! I'm your AI financial assistant.{" "}
                    {hasDataToAnalyze
                      ? "I can analyze your transactions, expenses, and provide insights about your financial health."
                      : "Add some transactions or expenses first, then I can analyze your financial data and provide insights."}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {hasDataToAnalyze
                      ? "Click the button below to get started with your first analysis."
                      : "Once you have financial data, click the analysis button to get AI-powered insights."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Summaries */}
          {summaries.length > 0 && (
            <div className="space-y-3">
              {[...summaries].reverse().map((summary) => {
                const isExpanded = expandedSummaryId === summary.id;
                const formattedHtml = formatHtml(summary.text);
                const displayedHtml = isExpanded
                  ? formattedHtml
                  : truncateHtml(formattedHtml);

                return (
                  <div key={summary.id} className="group">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="h-3 w-3" />
                        {new Date(summary.createdAt).toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleDeleteSummary(summary)}
                        className="rounded-full p-1 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                      <div
                        className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: displayedHtml }}
                      />

                      {formattedHtml.length > 120 && (
                        <button
                          onClick={() => toggleExpand(summary.id)}
                          className="mt-2 flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
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
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mb-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </div>
                <div className="flex-1">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Analyzing your financial data...
                    </p>
                    <div className="mt-2 space-y-2">
                      <div className="h-2 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-2 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-2 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="rounded-xl bg-red-50 p-3 dark:bg-red-950/50">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-700">
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
              ? "Analyzing..."
              : !hasDataToAnalyze
              ? "No Data to Analyze"
              : "Generate Financial Analysis"}
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderFullscreen = () => (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                AI Financial Assistant
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Comprehensive financial analysis and insights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setState("chat")}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setState("minimized")}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Welcome Message */}
              {summaries.length === 0 && !isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50">
                      <Sparkles className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {hasDataToAnalyze
                        ? "Ready to analyze your finances"
                        : "No Financial Data Available"}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      {hasDataToAnalyze
                        ? "Get AI-powered insights about your financial health, spending patterns, and recommendations for improvement."
                        : "Add some transactions or expenses to get started with AI-powered financial analysis and insights."}
                    </p>
                  </div>
                </div>
              )}

              {/* Summaries - Enhanced Fullscreen Layout */}
              {summaries.length > 0 && (
                <div className="space-y-6">
                  {[...summaries].reverse().map((summary) => {
                    const isExpanded = expandedSummaryId === summary.id;
                    const formattedHtml = formatHtml(summary.text);
                    const displayedHtml = isExpanded
                      ? formattedHtml
                      : truncateHtml(formattedHtml);

                    return (
                      <div key={summary.id} className="group">
                        {/* Enhanced Header for Fullscreen */}
                        <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                Financial Analysis
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Clock className="h-3 w-3" />
                                {new Date(summary.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteSummary(summary)}
                            className="rounded-lg p-2 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Enhanced Content Area */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                          <div
                            className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300 dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-strong:text-slate-900 dark:prose-strong:text-slate-100"
                            dangerouslySetInnerHTML={{ __html: displayedHtml }}
                          />

                          {formattedHtml.length > 120 && (
                            <button
                              onClick={() => toggleExpand(summary.id)}
                              className="mt-4 flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              {isExpanded ? (
                                <>
                                  Show Less{" "}
                                  <ChevronUp className="ml-1 h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  Show More{" "}
                                  <ChevronDown className="ml-1 h-4 w-4" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Loading State - Enhanced for Fullscreen */}
              {isLoading && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        Analyzing Your Financial Data
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Processing transactions and generating insights...
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="space-y-4">
                      <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-4 w-4/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-4 w-3/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error State - Enhanced for Fullscreen */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/50">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900 dark:text-red-100 mb-1">
                        Analysis Error
                      </h4>
                      <p className="text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="border-t border-slate-200 p-6 dark:border-slate-700">
              <button
                onClick={handleGenerateSummary}
                disabled={isLoading || !hasDataToAnalyze}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 text-base font-medium text-white transition-all hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
                {isLoading
                  ? "Analyzing Your Financial Data..."
                  : !hasDataToAnalyze
                  ? "No Data Available for Analysis"
                  : "Generate Comprehensive Financial Analysis"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {state === "minimized" && renderMinimized()}
        {state === "chat" && renderChat()}
        {state === "fullscreen" && renderFullscreen()}
      </AnimatePresence>

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
