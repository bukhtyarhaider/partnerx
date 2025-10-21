import React, { useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  DownloadCloud,
  UploadCloud,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type {
  Transaction,
  Expense,
  DonationPayout,
  FinancialSummaryRecord,
  DonationConfig,
  IncomeSource,
} from "../types";

interface ImportExportProps {
  transactions: Transaction[];
  expenses: Expense[];
  donationPayouts: DonationPayout[];
  summaries: FinancialSummaryRecord[];
  donationConfig: DonationConfig;
  onImport: (data: {
    transactions: Transaction[];
    expenses: Expense[];
    donationPayouts: DonationPayout[];
    summaries: FinancialSummaryRecord[];
    donationConfig?: DonationConfig;
  }) => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

interface NotificationProps {
  type: "success" | "error";
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div
        className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg max-w-sm ${
          type === "success"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
            : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle size={20} className="flex-shrink-0" />
        ) : (
          <XCircle size={20} className="flex-shrink-0" />
        )}
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          <XCircle size={16} />
        </button>
      </div>
    </div>,
    document.body
  );
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle
              className="h-5 w-5 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Overwrite Data?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Importing a new file will replace all existing transactions,
              expenses, donation records, and AI summaries. This action cannot
              be undone.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus:ring-offset-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          >
            Yes, Overwrite
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const ImportExport: React.FC<ImportExportProps> = ({
  transactions,
  expenses,
  donationPayouts,
  summaries,
  donationConfig,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
    isVisible: boolean;
  }>({ type: "success", message: "", isVisible: false });
  const [isExporting, setIsExporting] = useState(false);

  const showNotification = useCallback(
    (type: "success" | "error", message: string) => {
      setNotification({ type, message, isVisible: true });
      setTimeout(
        () => setNotification((prev) => ({ ...prev, isVisible: false })),
        5000
      );
    },
    []
  );

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      // Load income source config from localStorage
      const incomeSourceConfigStr = localStorage.getItem("incomeSourceConfig");
      let incomeSourceConfig: IncomeSource[] = [];

      if (incomeSourceConfigStr) {
        const parsedConfig = JSON.parse(incomeSourceConfigStr);
        // Handle both array format and object format
        if (Array.isArray(parsedConfig)) {
          incomeSourceConfig = parsedConfig;
        } else if (
          parsedConfig.sources &&
          Array.isArray(parsedConfig.sources)
        ) {
          incomeSourceConfig = parsedConfig.sources;
        }
      }

      const exportData = {
        incomeSourceConfig, // Export income source configuration
        transactions,
        expenses,
        donationPayouts,
        summaries,
        donationConfig,
      };
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date().toISOString().split("T")[0];
      link.download = `partnership-data-${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification("success", "Data exported successfully!");
    } catch (error) {
      showNotification("error", "Failed to export data. Please try again.");
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  }, [
    transactions,
    expenses,
    donationPayouts,
    summaries,
    donationConfig,
    showNotification,
  ]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".json")) {
      showNotification("error", "Please select a valid JSON file.");
      return;
    }

    setPendingFile(file);
    setShowConfirmModal(true);
  };

  const handleConfirmImport = () => {
    if (!pendingFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string") {
          throw new Error("File format is incorrect.");
        }

        const parsedData = JSON.parse(text);

        // Validate data structure
        if (
          !parsedData ||
          typeof parsedData !== "object" ||
          !Array.isArray(parsedData.transactions) ||
          !Array.isArray(parsedData.expenses) ||
          !Array.isArray(parsedData.donationPayouts) ||
          !Array.isArray(parsedData.summaries)
        ) {
          throw new Error("Invalid data structure in the imported file.");
        }

        // Handle income source config import (if present)
        if (
          parsedData.incomeSourceConfig &&
          Array.isArray(parsedData.incomeSourceConfig)
        ) {
          const currentConfigStr = localStorage.getItem("incomeSourceConfig");
          let currentSources: IncomeSource[] = [];

          if (currentConfigStr) {
            const parsed = JSON.parse(currentConfigStr);
            if (Array.isArray(parsed)) {
              currentSources = parsed;
            } else if (parsed.sources && Array.isArray(parsed.sources)) {
              currentSources = parsed.sources;
            }
          }

          // Merge income sources: prioritize imported ones, keep custom ones not in import
          const importedSources =
            parsedData.incomeSourceConfig as IncomeSource[];
          const importedIds = new Set(
            importedSources.map((s: IncomeSource) => s.id)
          );

          // Keep custom sources that aren't in the import
          const customSources = currentSources.filter(
            (s) => !importedIds.has(s.id)
          );

          // Combine imported + custom sources
          const mergedSources = [...importedSources, ...customSources];

          // Save merged config
          localStorage.setItem(
            "incomeSourceConfig",
            JSON.stringify(mergedSources)
          );

          if (import.meta.env.DEV) {
            console.log(
              "✓ Imported income source config:",
              importedSources.length,
              "sources"
            );
            if (customSources.length > 0) {
              console.log("✓ Preserved custom sources:", customSources.length);
            }
          }
        }

        // Check if user has PIN set and has transactions - if so, mark onboarding as complete
        const hasPinSet = localStorage.getItem("app_pin_code");
        const hasTransactions = parsedData.transactions.length > 0;
        const hasExpenses = parsedData.expenses.length > 0;
        const hasDonationPayouts = parsedData.donationPayouts.length > 0;
        const hasSummaries = parsedData.summaries.length > 0;

        if (
          hasPinSet ||
          hasTransactions ||
          hasExpenses ||
          hasDonationPayouts ||
          hasSummaries
        ) {
          // User has already been using the app, ensure onboarding is marked complete
          const onboardingProgress = localStorage.getItem(
            "onboarding_progress"
          );
          if (onboardingProgress) {
            try {
              const progress = JSON.parse(onboardingProgress);
              if (!progress.completedAt) {
                // Mark onboarding as complete
                progress.completedAt = new Date().toISOString();
                // Mark all non-skippable steps as completed
                progress.steps = progress.steps.map(
                  (step: { skippable?: boolean }) => ({
                    ...step,
                    completed: true,
                  })
                );
                localStorage.setItem(
                  "onboarding_progress",
                  JSON.stringify(progress)
                );
                if (import.meta.env.DEV) {
                  console.log("✓ Marked onboarding as complete after import");
                }
              }
            } catch (error) {
              if (import.meta.env.DEV) {
                console.warn("Failed to update onboarding progress:", error);
              }
            }
          }
        }

        onImport(parsedData);
        showNotification("success", "Data imported successfully!");
      } catch (error) {
        console.error("Failed to import data:", error);
        showNotification(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to import data. Please check the file format."
        );
      }
    };

    reader.onerror = () => {
      showNotification("error", "Failed to read the file. Please try again.");
    };

    reader.readAsText(pendingFile);
    resetImport();
  };

  const resetImport = () => {
    setShowConfirmModal(false);
    setPendingFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const totalRecords =
    transactions.length +
    expenses.length +
    donationPayouts.length +
    summaries.length;

  return (
    <>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmImport}
        onCancel={resetImport}
      />
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() =>
          setNotification((prev) => ({ ...prev, isVisible: false }))
        }
      />

      <section className="border-t border-slate-200 pt-4 dark:border-slate-700">
        <h2 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Data Management
        </h2>

        {totalRecords > 0 && (
          <div className="mb-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {totalRecords} records available for export
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleExport}
            disabled={isExporting || totalRecords === 0}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-3 font-medium text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30 dark:focus:ring-offset-slate-800"
          >
            {isExporting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-700 border-t-transparent dark:border-blue-300" />
            ) : (
              <DownloadCloud size={18} />
            )}
            {isExporting ? "Exporting..." : "Export Data"}
          </button>

          <button
            onClick={handleImportClick}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 font-medium text-emerald-700 transition-colors hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30 dark:focus:ring-offset-slate-800"
          >
            <UploadCloud size={18} />
            Import Data
          </button>

          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            aria-label="Import data file"
          />
        </div>
      </section>
    </>
  );
};
