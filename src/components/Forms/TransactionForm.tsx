import React, { useState, useEffect, useCallback, useRef } from "react";
import { PlusCircle, Save, AlertCircle, RefreshCw, Zap } from "lucide-react";
import type { NewTransactionEntry, Transaction } from "../../types";
import { getTodayString, formatCurrency } from "../../utils";
import { useEnabledIncomeSources } from "../../hooks/useIncomeSources";
import { useConversionRateAutoFill } from "../../hooks/useConversionRateAutoFill";
import { SuccessToast } from "../common/SuccessToast";

interface FormProps {
  mode?: "add" | "edit";
  initialData?: Transaction;
  onAddTransaction?: (entry: NewTransactionEntry) => Promise<void>;
  onSave?: (entry: Transaction) => Promise<void>;
}

const INPUT_STYLES =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition-colors duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-green-400 dark:focus:ring-green-400/20";

const LABEL_STYLES =
  "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

export const TransactionForm: React.FC<FormProps> = ({
  mode = "add",
  initialData,
  onAddTransaction,
  onSave,
}) => {
  const { sources: enabledSources } = useEnabledIncomeSources();
  const {
    currentRate,
    fillLatestRate,
    manualRefresh,
    isFetching,
    hasRate,
    lastUpdated,
    isCacheStale,
  } = useConversionRateAutoFill();

  const [sourceId, setSourceId] = useState<string>("");
  const [amountUSD, setAmountUSD] = useState("");
  const [conversionRate, setConversionRate] = useState("");
  const [bank, setBank] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successAmount, setSuccessAmount] = useState("");

  // New fields for currency and tax configuration
  const [currency, setCurrency] = useState<"PKR" | "USD">("USD");
  const [amount, setAmount] = useState(""); // Amount in selected currency
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxType, setTaxType] = useState<"percentage" | "fixed">("percentage");
  const [taxValue, setTaxValue] = useState("");

  // Track the last source ID that was auto-populated to prevent re-population
  const lastAutoPopulatedSourceRef = useRef<string | null>(null);

  // Auto-fill rate handler
  const handleAutoFillRate = useCallback(async () => {
    try {
      const rate = await fillLatestRate();
      if (rate) {
        setConversionRate(rate.toFixed(2));
      }
    } catch (error) {
      console.error("Failed to auto-fill conversion rate:", error);
    }
  }, [fillLatestRate]);

  // Manual refresh handler
  const handleManualRefresh = useCallback(async () => {
    try {
      const rate = await manualRefresh();
      if (rate) {
        setConversionRate(rate.toFixed(2));
      }
    } catch (error) {
      console.error("Failed to refresh conversion rate:", error);
      setError("Failed to fetch latest exchange rate");
    }
  }, [manualRefresh]);

  // Set default source when sources are loaded
  useEffect(() => {
    if (enabledSources.length > 0 && !sourceId && mode === "add") {
      setSourceId(enabledSources[0].id);
    }
  }, [enabledSources, sourceId, mode]);

  // Auto-populate form fields based on selected source defaults
  useEffect(() => {
    if (sourceId && mode === "add") {
      // Only auto-populate if the source has actually changed
      if (lastAutoPopulatedSourceRef.current === sourceId) {
        return;
      }

      const selectedSource = enabledSources.find((s) => s.id === sourceId);
      if (selectedSource?.metadata?.settings) {
        const settings = selectedSource.metadata.settings;

        // Set default currency
        if (settings.defaultCurrency) {
          setCurrency(settings.defaultCurrency);
        }

        // Set default tax configuration
        if (settings.tax) {
          setTaxEnabled(settings.tax.enabled || false);
          setTaxType(settings.tax.type || "percentage");
          setTaxValue(settings.tax.value > 0 ? String(settings.tax.value) : "");
        } else {
          // Reset tax settings if source has no tax configuration
          setTaxEnabled(false);
          setTaxType("percentage");
          setTaxValue("");
        }

        // Mark this source as auto-populated
        lastAutoPopulatedSourceRef.current = sourceId;
      }
    }
  }, [sourceId, enabledSources, mode]);

  // Auto-fill conversion rate on mount for new transactions
  useEffect(() => {
    if (mode === "add" && !conversionRate && hasRate) {
      handleAutoFillRate();
    }
  }, [mode, conversionRate, hasRate, handleAutoFillRate]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setSourceId(initialData.sourceId);
      setAmountUSD(String(initialData.amountUSD));
      setConversionRate(String(initialData.conversionRate));
      setBank(initialData.bank);
      setDate(initialData.date);

      // Load new fields if available
      if (initialData.currency) {
        setCurrency(initialData.currency);
      }
      if (initialData.amount) {
        setAmount(String(initialData.amount));
      }
      if (initialData.taxConfig) {
        setTaxEnabled(initialData.taxConfig.enabled);
        setTaxType(initialData.taxConfig.type);
        setTaxValue(String(initialData.taxConfig.value));
      } else if (initialData.taxRate && initialData.taxRate > 0) {
        // Backward compatibility: convert old taxRate to new taxConfig
        setTaxEnabled(true);
        setTaxType("percentage");
        setTaxValue(String(initialData.taxRate));
      }
    }
  }, [mode, initialData]);

  const resetForm = useCallback(() => {
    setAmountUSD("");
    setConversionRate("");
    setBank("");
    setDate(getTodayString());
    if (enabledSources.length > 0) {
      setSourceId(enabledSources[0].id);
    }

    // Reset new fields
    setCurrency("USD");
    setAmount("");
    setTaxEnabled(false);
    setTaxType("percentage");
    setTaxValue("");

    // Reset auto-population tracking
    lastAutoPopulatedSourceRef.current = null;
  }, [enabledSources]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required fields based on currency
      if (currency === "USD") {
        if (!amountUSD || !conversionRate || !bank || !date || !sourceId) {
          throw new Error("Please fill out all required fields.");
        }
      } else {
        // PKR currency
        if (!amount || !bank || !date || !sourceId) {
          throw new Error("Please fill out all required fields.");
        }
      }

      // Validate tax fields if enabled
      if (taxEnabled && !taxValue) {
        throw new Error("Please enter tax value.");
      }

      // Calculate values based on currency
      let finalAmountUSD: number;
      let finalConversionRate: number;
      let finalAmount: number | undefined;

      if (currency === "USD") {
        finalAmountUSD = parseFloat(amountUSD);
        finalConversionRate = parseFloat(conversionRate);
        finalAmount = undefined;
      } else {
        // PKR - calculate USD equivalent
        finalAmount = parseFloat(amount);
        // For PKR, we store the PKR amount and set a marker conversion rate
        finalAmountUSD = finalAmount; // Store PKR amount in amountUSD field for PKR transactions
        finalConversionRate = 1; // Marker that this is a PKR transaction
      }

      const commonData = {
        sourceId,
        date,
        bank,
        amountUSD: finalAmountUSD,
        conversionRate: finalConversionRate,
        taxRate: taxEnabled ? parseFloat(taxValue) || 0 : 0, // For backward compatibility
        currency,
        amount: finalAmount,
        taxConfig: taxEnabled
          ? {
              enabled: taxEnabled,
              type: taxType,
              value: parseFloat(taxValue) || 0,
            }
          : undefined,
      };

      if (mode === "edit" && onSave && initialData) {
        await onSave({ ...initialData, ...commonData });
      } else if (mode === "add" && onAddTransaction) {
        await onAddTransaction(commonData);

        // Show success toast
        let totalAmount: number;
        if (currency === "USD") {
          totalAmount = parseFloat(amountUSD) * parseFloat(conversionRate);
        } else {
          totalAmount = parseFloat(amount);
        }
        setSuccessAmount(formatCurrency(totalAmount));
        setShowSuccessToast(true);

        resetForm();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = mode === "edit";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        {isEditMode ? "Edit Payout" : "Add New Payout"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="transaction-date" className={LABEL_STYLES}>
            Payout Date *
          </label>
          <input
            type="date"
            id="transaction-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={INPUT_STYLES}
            required
          />
        </div>

        <div>
          <label htmlFor="transaction-source" className={LABEL_STYLES}>
            Source *
          </label>
          <select
            id="transaction-source"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className={INPUT_STYLES}
            disabled={enabledSources.length === 0}
            required
          >
            {enabledSources.length === 0 ? (
              <option value="">No income sources available</option>
            ) : (
              enabledSources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))
            )}
          </select>
          {enabledSources.length === 0 && (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              ⚠️ Please enable income sources in Settings before adding
              transactions.
            </p>
          )}
        </div>

        {/* Currency Selection */}
        <div>
          <label htmlFor="transaction-currency" className={LABEL_STYLES}>
            Currency *
          </label>
          <select
            id="transaction-currency"
            value={currency}
            onChange={(e) => {
              const newCurrency = e.target.value as "PKR" | "USD";
              setCurrency(newCurrency);
              // Reset amounts when currency changes
              if (newCurrency === "USD") {
                setAmount("");
              } else {
                setAmountUSD("");
              }
            }}
            className={INPUT_STYLES}
            required
          >
            <option value="USD">USD (US Dollar)</option>
            <option value="PKR">PKR (Pakistani Rupee)</option>
          </select>
        </div>

        {/* Amount Input - changes based on currency */}
        {currency === "USD" ? (
          <div>
            <label htmlFor="transaction-amount" className={LABEL_STYLES}>
              Amount (USD) *
            </label>
            <input
              type="number"
              step="0.01"
              id="transaction-amount"
              placeholder="e.g., 1500"
              value={amountUSD}
              onChange={(e) => setAmountUSD(e.target.value)}
              className={INPUT_STYLES}
              required
            />
          </div>
        ) : (
          <div>
            <label htmlFor="transaction-amount-pkr" className={LABEL_STYLES}>
              Amount (PKR) *
            </label>
            <input
              type="number"
              step="0.01"
              id="transaction-amount-pkr"
              placeholder="e.g., 418000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={INPUT_STYLES}
              required
            />
          </div>
        )}

        {/* Conversion Rate - Only for USD */}
        {currency === "USD" && (
          <div>
            <label htmlFor="transaction-rate" className={LABEL_STYLES}>
              Conversion Rate (PKR/USD) *
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  id="transaction-rate"
                  placeholder="e.g., 278.50"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(e.target.value)}
                  className={INPUT_STYLES}
                  required
                />
                <button
                  type="button"
                  onClick={handleAutoFillRate}
                  disabled={isFetching}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed dark:text-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/30 transition-colors whitespace-nowrap"
                  title="Auto-fill with cached rate"
                >
                  <Zap size={14} />
                  <p className="hidden md:block">Auto</p>
                </button>
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  disabled={isFetching}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed dark:text-blue-300 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors whitespace-nowrap"
                  title="Fetch latest rate from API"
                >
                  {isFetching ? (
                    <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  <p className="hidden md:block">Refresh</p>
                </button>
              </div>
              <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
                {currentRate && (
                  <span>Current rate: {currentRate.toFixed(2)} PKR/USD</span>
                )}
                {lastUpdated && (
                  <span>
                    Updated: {lastUpdated.toLocaleTimeString()}
                    {isCacheStale && (
                      <span className="ml-1 text-amber-600 dark:text-amber-400">
                        (Stale)
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tax Configuration */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="transaction-tax-enabled"
              checked={taxEnabled}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setTaxEnabled(isChecked);
                // Reset tax value when unchecking
                if (!isChecked) {
                  setTaxValue("");
                }
              }}
              className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-700"
            />
            <label
              htmlFor="transaction-tax-enabled"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Enable Tax Deduction
            </label>
          </div>

          {taxEnabled && (
            <div className="space-y-3 pl-6 border-l-2 border-green-200 dark:border-green-800">
              <div>
                <label htmlFor="transaction-tax-type" className={LABEL_STYLES}>
                  Tax Type *
                </label>
                <select
                  id="transaction-tax-type"
                  value={taxType}
                  onChange={(e) =>
                    setTaxType(e.target.value as "percentage" | "fixed")
                  }
                  className={INPUT_STYLES}
                  required
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (PKR)</option>
                </select>
              </div>

              <div>
                <label htmlFor="transaction-tax-value" className={LABEL_STYLES}>
                  {taxType === "percentage"
                    ? "Tax Percentage *"
                    : "Tax Amount (PKR) *"}
                </label>
                <input
                  type="number"
                  disabled={!amount}
                  step="0.01"
                  id="transaction-tax-value"
                  placeholder={
                    taxType === "percentage" ? "e.g., 2.5" : "e.g., 5000"
                  }
                  value={taxValue}
                  min={0}
                  max={taxType === "percentage" ? 100 : undefined}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    const numericValue = Number(value);

                    // Prevent negative values for fixed tax
                    if (taxType === "fixed" && numericValue < 0) {
                      return;
                    }

                    // Prevent fixed tax greater than amount for PKR transactions
                    if (
                      currency === "PKR" &&
                      taxType === "fixed" &&
                      amount &&
                      numericValue > Number(amount)
                    ) {
                      return;
                    }

                    // Prevent fixed tax greater than total amount in PKR for USD transactions
                    if (
                      currency === "USD" &&
                      taxType === "fixed" &&
                      amountUSD &&
                      conversionRate
                    ) {
                      const totalInPKR =
                        Number(amountUSD) * Number(conversionRate);
                      if (numericValue > totalInPKR) {
                        return;
                      }
                    }

                    // Prevent values over 100 for percentage
                    if (taxType === "percentage" && numericValue > 100) {
                      return;
                    }

                    // Allow setting value only if it's empty or a valid number
                    if (value === "" || !isNaN(numericValue)) {
                      setTaxValue(value);
                    }
                  }}
                  className={INPUT_STYLES}
                  required
                />
                {taxType === "percentage" && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Enter percentage value (0-100)
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="transaction-bank" className={LABEL_STYLES}>
            Receiving Bank *
          </label>
          <input
            type="text"
            id="transaction-bank"
            placeholder="e.g., HBL"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className={INPUT_STYLES}
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle size={16} className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || enabledSources.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-offset-slate-800"
        >
          {isSubmitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : isEditMode ? (
            <>
              <Save size={16} /> Save Changes
            </>
          ) : (
            <>
              <PlusCircle size={16} /> Add Transaction
            </>
          )}
        </button>
      </form>

      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        type="income"
        message="Income added successfully!"
        amount={successAmount}
      />
    </div>
  );
};
