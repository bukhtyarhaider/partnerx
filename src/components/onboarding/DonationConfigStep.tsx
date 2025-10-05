import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useOnboarding } from "../../hooks/useOnboarding";
import type { DonationConfig } from "../../types";

const INPUT_STYLES =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition-colors duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20";

const LABEL_STYLES =
  "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

const SELECT_STYLES =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition-colors duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20";

const DONATION_CONFIG_STORAGE_KEY = "onboarding_donation_config";

interface DonationConfigStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export const DonationConfigStep: React.FC<DonationConfigStepProps> = ({
  onNext,
  onSkip,
}) => {
  const { markStepCompleted } = useOnboarding();

  const [config, setConfig] = useState<DonationConfig>(() => {
    const stored = localStorage.getItem(DONATION_CONFIG_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fall back to defaults if parsing fails
      }
    }

    return {
      percentage: 2.5,
      taxPreference: "before-tax",
      enabled: false,
      minimumAmount: 10,
      maximumAmount: undefined,
    };
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  // Save to localStorage whenever config changes
  useEffect(() => {
    localStorage.setItem(DONATION_CONFIG_STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  // Validate configuration
  useEffect(() => {
    const newErrors: Partial<Record<string, string>> = {};

    if (config.enabled) {
      if (config.percentage <= 0 || config.percentage > 100) {
        newErrors.percentage = "Percentage must be between 0.01 and 100";
      }

      if (config.minimumAmount && config.minimumAmount < 0) {
        newErrors.minimumAmount = "Minimum amount cannot be negative";
      }

      if (config.maximumAmount && config.maximumAmount < 0) {
        newErrors.maximumAmount = "Maximum amount cannot be negative";
      }

      if (
        config.minimumAmount &&
        config.maximumAmount &&
        config.minimumAmount >= config.maximumAmount
      ) {
        newErrors.maximumAmount =
          "Maximum amount must be greater than minimum amount";
      }
    }

    setErrors(newErrors);
  }, [config]);

  const handleInputChange = (
    field: keyof DonationConfig,
    value: string | number | boolean | undefined
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    markStepCompleted("donation-config");
    onNext();
  };

  const handleSkip = () => {
    // When skipping, disable donations
    setConfig((prev) => ({ ...prev, enabled: false }));
    markStepCompleted("donation-config");
    onSkip();
  };

  const isValid = Object.keys(errors).length === 0;

  // Suggested donation percentages
  const suggestedPercentages = [1.0, 2.5, 5.0, 10.0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-4">
          <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Charitable Giving
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Optional: Set up automatic donations from your income
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <span className="text-sm text-blue-800 dark:text-blue-200">
            💡 This is completely optional - skip if you prefer
          </span>
        </div>
      </div>

      {/* Quick Skip Option */}
      {!config.enabled && (
        <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Not interested in automatic donations? No problem!
            </p>
            <button
              onClick={handleSkip}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-all duration-200"
            >
              Skip Donations
            </button>
          </div>
        </div>
      )}

      {/* Or Configure Donations */}
      {!config.enabled && (
        <div className="text-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-500 dark:text-slate-400">
                Or set up automatic donations
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Enable/Disable Toggle */}
      <div className="mb-8">
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              Enable Automatic Donations
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Automatically allocate a percentage of your income to charity
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => handleInputChange("enabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>

      {/* Configuration Options - Only shown when enabled */}
      {config.enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6 overflow-hidden"
        >
          {/* Donation Percentage */}
          <div>
            <label htmlFor="percentage" className={LABEL_STYLES}>
              Donation Percentage *
            </label>
            <div className="relative">
              <input
                id="percentage"
                type="number"
                min="0.01"
                max="100"
                step="0.1"
                value={config.percentage}
                onChange={(e) =>
                  handleInputChange(
                    "percentage",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="2.5"
                className={INPUT_STYLES}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400">
                %
              </span>
            </div>
            {errors.percentage && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.percentage}
              </p>
            )}

            {/* Suggested Percentages */}
            <div className="mt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Suggested amounts:
              </p>
              <div className="flex gap-2">
                {suggestedPercentages.map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => handleInputChange("percentage", percentage)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors duration-200 ${
                      config.percentage === percentage
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    }`}
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tax Preference */}
          <div>
            <label htmlFor="taxPreference" className={LABEL_STYLES}>
              Tax Calculation Preference *
            </label>
            <select
              id="taxPreference"
              value={config.taxPreference}
              onChange={(e) =>
                handleInputChange(
                  "taxPreference",
                  e.target.value as "before-tax" | "after-tax"
                )
              }
              className={SELECT_STYLES}
            >
              <option value="before-tax">
                Calculate from income before taxes
              </option>
              <option value="after-tax">
                Calculate from income after taxes
              </option>
            </select>
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-xs text-blue-800 dark:text-blue-200 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {config.taxPreference === "before-tax"
                    ? "Donations will be calculated from your gross income before any taxes are deducted."
                    : "Donations will be calculated from your net income after taxes have been deducted."}
                </span>
              </p>
            </div>
          </div>

          {/* Amount Limits */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Amount Limits (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="minimumAmount" className={LABEL_STYLES}>
                  Minimum Amount ($)
                </label>
                <input
                  id="minimumAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={config.minimumAmount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "minimumAmount",
                      parseFloat(e.target.value) || undefined
                    )
                  }
                  placeholder="10.00"
                  className={INPUT_STYLES}
                />
                {errors.minimumAmount && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.minimumAmount}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="maximumAmount" className={LABEL_STYLES}>
                  Maximum Amount ($)
                </label>
                <input
                  id="maximumAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={config.maximumAmount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "maximumAmount",
                      parseFloat(e.target.value) || undefined
                    )
                  }
                  placeholder="1000.00"
                  className={INPUT_STYLES}
                />
                {errors.maximumAmount && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.maximumAmount}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Set limits to control the minimum and maximum donation amounts per
              transaction
            </p>
          </div>

          {/* Preview */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Preview
            </h4>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p>For a $1,000 income transaction:</p>
              <p>
                • {config.taxPreference === "before-tax" ? "Gross" : "Net"}{" "}
                amount: $1,000
              </p>
              <p>
                • Donation ({config.percentage}%): $
                {(1000 * (config.percentage / 100)).toFixed(2)}
              </p>
              {config.minimumAmount && (
                <p>• Minimum: ${config.minimumAmount}</p>
              )}
              {config.maximumAmount && (
                <p>• Maximum: ${config.maximumAmount}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Info Box for Disabled State */}
      {!config.enabled && (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Automatic donations are currently disabled. You can enable them
            later from the settings.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          onClick={handleSkip}
          className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
        >
          Skip This Step
        </button>
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isValid
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl"
              : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          Continue
        </button>
      </div>

      {/* Info Note */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You can modify donation settings anytime from the app settings
        </p>
      </div>
    </motion.div>
  );
};
