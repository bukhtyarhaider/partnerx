import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";

const PIN_STORAGE_KEY = "app_pin_code";

interface PinResetUtilityProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  showAsModal?: boolean;
}

export const PinResetUtility: React.FC<PinResetUtilityProps> = ({
  onConfirm,
  onCancel,
  showAsModal = true,
}) => {
  const handleResetApp = () => {
    // Clear PIN and all transaction-related data for security
    const keysToRemove = [
      PIN_STORAGE_KEY,
      "transactions",
      "expenses",
      "donationPayouts",
      "summaries",
      "donationConfig",
      "partnerConfig",
      "incomeSourceConfig",
      "onboarding_partners",
      "onboarding_income_sources",
      "onboarding_donation_config",
      "business_info",
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Call onConfirm callback if provided
    if (onConfirm) {
      onConfirm();
    } else {
      // Default behavior: reload the page to restart the app
      window.location.reload();
    }
  };

  const content = (
    <div className={`${showAsModal ? "p-6" : "p-4"} space-y-4`}>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Reset PIN & Clear Data
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          This action will permanently delete your PIN and all transaction data
          for security purposes.
        </p>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
          The following data will be permanently deleted:
        </h4>
        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
          <li>• Your current PIN</li>
          <li>• All income transactions</li>
          <li>• All expense records</li>
          <li>• All donation records</li>
          <li>• Partner configurations</li>
          <li>• Income source settings</li>
          <li>• Donation configurations</li>
          <li>• Financial summaries</li>
        </ul>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Note:</strong> Your business information will be preserved,
          but you'll need to set up a new PIN and re-configure your financial
          settings.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleResetApp}
          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset PIN & Clear Data
        </button>
      </div>
    </div>
  );

  if (showAsModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700"
        >
          {content}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      {content}
    </div>
  );
};
