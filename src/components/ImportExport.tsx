import React, { useRef } from "react";
import { DownloadCloud, UploadCloud } from "lucide-react";
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

export const ImportExport: React.FC<ImportExportProps> = ({
  transactions,
  expenses,
  donationPayouts,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const exportData = {
      transactions,
      expenses,
      donationPayouts,
    };

    const dataStr = JSON.stringify(exportData, null, 2); // Pretty-print JSON
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

    if (
      !window.confirm(
        "Are you sure you want to import data? This will overwrite all current entries."
      )
    ) {
      // Reset the file input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string") {
          throw new Error("File format is incorrect.");
        }
        const parsedData = JSON.parse(text);

        // Basic validation to ensure the file has the correct structure
        if (
          !Array.isArray(parsedData.transactions) ||
          !Array.isArray(parsedData.expenses) ||
          !Array.isArray(parsedData.donationPayouts)
        ) {
          throw new Error("Invalid data structure in the imported file.");
        }

        onImport(parsedData);
        alert("Data imported successfully!");
      } catch (error) {
        console.error("Failed to import data:", error);
        alert(
          `Error importing file: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        // Reset the file input value
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mt-auto pt-6 border-t border-slate-200">
      <h2 className="text-lg font-semibold text-wise-blue mb-4">
        Data Management
      </h2>
      <div className="space-y-3">
        <button
          onClick={handleExport}
          className="w-full p-3 flex items-center justify-center gap-2 bg-wise-blue-light text-wise-blue font-bold rounded-lg hover:bg-slate-200 transition-colors"
        >
          <DownloadCloud size={20} />
          Export Data
        </button>
        <button
          onClick={handleImportClick}
          className="w-full p-3 flex items-center justify-center gap-2 bg-wise-blue-light text-wise-blue font-bold rounded-lg hover:bg-slate-200 transition-colors"
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
  );
};
