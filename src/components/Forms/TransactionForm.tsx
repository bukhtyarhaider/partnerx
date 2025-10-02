import React, { useState, useEffect, useCallback } from "react";
import { PlusCircle, Save, AlertCircle } from "lucide-react";
import type { NewTransactionEntry, Transaction } from "../../types";
import { getTodayString } from "../../utils";
import { useEnabledIncomeSources } from "../../hooks/useIncomeSources";

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
  const [sourceId, setSourceId] = useState<string>("");
  const [amountUSD, setAmountUSD] = useState("");
  const [conversionRate, setConversionRate] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [bank, setBank] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default source when sources are loaded
  useEffect(() => {
    if (enabledSources.length > 0 && !sourceId && mode === "add") {
      setSourceId(enabledSources[0].id);
    }
  }, [enabledSources, sourceId, mode]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setSourceId(initialData.sourceId);
      setAmountUSD(String(initialData.amountUSD));
      setConversionRate(String(initialData.conversionRate));
      setTaxRate(String(initialData.taxRate));
      setBank(initialData.bank);
      setDate(initialData.date);
    }
  }, [mode, initialData]);

  const resetForm = useCallback(() => {
    setAmountUSD("");
    setConversionRate("");
    setTaxRate("");
    setBank("");
    setDate(getTodayString());
    if (enabledSources.length > 0) {
      setSourceId(enabledSources[0].id);
    }
  }, [enabledSources]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (
        !amountUSD ||
        !conversionRate ||
        !taxRate ||
        !bank ||
        !date ||
        !sourceId
      ) {
        throw new Error("Please fill out all required fields.");
      }

      const commonData = {
        sourceId,
        date,
        bank,
        amountUSD: parseFloat(amountUSD),
        conversionRate: parseFloat(conversionRate),
        taxRate: parseFloat(taxRate),
      };

      if (mode === "edit" && onSave && initialData) {
        await onSave({ ...initialData, ...commonData });
      } else if (mode === "add" && onAddTransaction) {
        await onAddTransaction(commonData);
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
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <div>
            <label htmlFor="transaction-rate" className={LABEL_STYLES}>
              Conversion Rate *
            </label>
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
          </div>
        </div>

        <div>
          <label htmlFor="transaction-tax" className={LABEL_STYLES}>
            Tax Rate (%) *
          </label>
          <input
            type="number"
            step="0.1"
            id="transaction-tax"
            placeholder="e.g., 2.5"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className={INPUT_STYLES}
            required
          />
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
    </div>
  );
};
