import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DownloadCloud, UploadCloud, AlertTriangle } from "lucide-react";
import type { Transaction, Expense, DonationPayout } from "../types";

interface ImportExportProps {
  transactions: Transaction[];
  expenses: Expense[];
  donationPayouts: DonationPayout[];
  onImport: (data: {
    transactions: Transaction[];
    expenses: Expense[];
    donationPayouts: DonationPayout[];
  }) => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800 animate-scale-in">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
            <AlertTriangle
              className="h-6 w-6 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50">
              Overwrite Data?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Importing a new file will replace all existing transactions,
              expenses, and donation records. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
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
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleExport = () => {
    const exportData = { transactions, expenses, donationPayouts };
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
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setShowConfirmModal(true);
  };

  const handleConfirmImport = () => {
    if (!pendingFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string")
          throw new Error("File format is incorrect.");

        const parsedData = JSON.parse(text);
        if (
          !Array.isArray(parsedData.transactions) ||
          !Array.isArray(parsedData.expenses) ||
          !Array.isArray(parsedData.donationPayouts)
        ) {
          throw new Error("Invalid data structure in the imported file.");
        }
        onImport(parsedData);
      } catch (error) {
        console.error("Failed to import data:", error);
      }
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

  const buttonStyles =
    "w-full flex items-center justify-center gap-2 rounded-lg p-3 font-bold transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800";
  const exportButtonStyles =
    "bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900";
  const importButtonStyles =
    "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900";

  return (
    <>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmImport}
        onCancel={resetImport}
      />
      {/* **DARK MODE & ANIMATION:** Themed container with a fade-in animation */}
      <div
        className={`border-t border-slate-200 pt-6 transition-opacity duration-500 dark:border-slate-700 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Data Management
        </h2>
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className={`${buttonStyles} ${exportButtonStyles}`}
          >
            <DownloadCloud size={20} />
            Export Data
          </button>
          <button
            onClick={handleImportClick}
            className={`${buttonStyles} ${importButtonStyles}`}
          >
            <UploadCloud size={20} />
            Import Data
          </button>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </>
  );
};
