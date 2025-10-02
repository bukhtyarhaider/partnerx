import React, { useState } from "react";
import type { DonationConfig } from "../types";
import { Settings, Save, RotateCcw } from "lucide-react";

interface DonationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DonationConfig;
  onUpdate: (config: Partial<DonationConfig>) => void;
}

export const DonationConfigModal: React.FC<DonationConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<DonationConfig>(config);
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    setFormData(config);
    setErrors({});
  }, [config, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.percentage < 0 || formData.percentage > 100) {
      newErrors.percentage = "Percentage must be between 0 and 100";
    }

    if (formData.minimumAmount && formData.minimumAmount < 0) {
      newErrors.minimumAmount = "Minimum amount must be positive";
    }

    if (formData.maximumAmount && formData.maximumAmount < 0) {
      newErrors.maximumAmount = "Maximum amount must be positive";
    }

    if (
      formData.minimumAmount &&
      formData.maximumAmount &&
      formData.minimumAmount > formData.maximumAmount
    ) {
      newErrors.minimumAmount = "Minimum cannot be greater than maximum";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onUpdate(formData);
      onClose();
    }
  };

  const handleReset = () => {
    setFormData({
      percentage: 10,
      taxPreference: "before-tax",
      enabled: true,
    });
    setErrors({});
  };

  const handleInputChange = (
    field: keyof DonationConfig,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Donation Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Enable Automatic Donations
            </label>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => handleInputChange("enabled", e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-700 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>

          {/* Percentage Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Donation Percentage
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.percentage}
                onChange={(e) =>
                  handleInputChange(
                    "percentage",
                    parseFloat(e.target.value) || 0
                  )
                }
                disabled={!formData.enabled}
                className={`w-full rounded-lg border px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 ${
                  errors.percentage
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-300 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                }`}
                placeholder="10"
              />
              <span className="absolute right-3 top-2 text-sm text-slate-500 dark:text-slate-400">
                %
              </span>
            </div>
            {errors.percentage && (
              <p className="mt-1 text-xs text-red-600">{errors.percentage}</p>
            )}
          </div>

          {/* Tax Preference */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Calculate Donation
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="taxPreference"
                  value="before-tax"
                  checked={formData.taxPreference === "before-tax"}
                  onChange={(e) =>
                    handleInputChange("taxPreference", e.target.value)
                  }
                  disabled={!formData.enabled}
                  className="mr-2 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Before Tax (from gross income)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="taxPreference"
                  value="after-tax"
                  checked={formData.taxPreference === "after-tax"}
                  onChange={(e) =>
                    handleInputChange("taxPreference", e.target.value)
                  }
                  disabled={!formData.enabled}
                  className="mr-2 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  After Tax (from net income)
                </span>
              </label>
            </div>
          </div>

          {/* Minimum Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Minimum Amount (PKR) - Optional
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.minimumAmount || ""}
              onChange={(e) =>
                handleInputChange(
                  "minimumAmount",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              disabled={!formData.enabled}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 ${
                errors.minimumAmount
                  ? "border-red-300 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              }`}
              placeholder="Leave empty for no minimum"
            />
            {errors.minimumAmount && (
              <p className="mt-1 text-xs text-red-600">
                {errors.minimumAmount}
              </p>
            )}
          </div>

          {/* Maximum Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Maximum Amount (PKR) - Optional
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.maximumAmount || ""}
              onChange={(e) =>
                handleInputChange(
                  "maximumAmount",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              disabled={!formData.enabled}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 ${
                errors.maximumAmount
                  ? "border-red-300 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              }`}
              placeholder="Leave empty for no maximum"
            />
            {errors.maximumAmount && (
              <p className="mt-1 text-xs text-red-600">
                {errors.maximumAmount}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between border-t border-slate-200 p-6 dark:border-slate-700">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            <RotateCcw size={16} />
            Reset to Default
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
