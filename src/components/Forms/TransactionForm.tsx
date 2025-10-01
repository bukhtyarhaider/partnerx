import React, { useState, useEffect } from "react";
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

  const [isAnimating, setIsAnimating] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (
      !amountUSD ||
      !conversionRate ||
      !taxRate ||
      !bank ||
      !date ||
      !sourceId
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    const commonData = {
      sourceId,
      date,
      bank,
      amountUSD: parseFloat(amountUSD),
      conversionRate: parseFloat(conversionRate),
      taxRate: parseFloat(taxRate),
    };

    try {
      if (mode === "edit" && onSave && initialData) {
        await onSave({ ...initialData, ...commonData });
      } else if (mode === "add" && onAddTransaction) {
        await onAddTransaction(commonData);
        // Reset form after successful submission
        setAmountUSD("");
        setConversionRate("");
        setTaxRate("");
        setBank("");
        setDate(getTodayString());
        // Reset to first enabled source
        if (enabledSources.length > 0) {
          setSourceId(enabledSources[0].id);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    }
  };

  const isEditMode = mode === "edit";

  const inputStyles =
    "w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 outline-none transition-all duration-200 focus:ring-2 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-green-400 dark:[color-scheme:dark]";
  const labelStyles =
    "mb-1.5 block text-sm font-semibold text-slate-600 dark:text-slate-300";

  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        isAnimating ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        {isEditMode ? "Edit Payout" : "Add New Payout"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className={labelStyles}>
            Payout Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputStyles}
          />
        </div>
        <div>
          <label htmlFor="source" className={labelStyles}>
            Source
          </label>
          <select
            id="source"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className={inputStyles}
            disabled={enabledSources.length === 0}
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="amountUSD" className={labelStyles}>
              Amount (USD)
            </label>
            <input
              type="number"
              step="0.01"
              id="amountUSD"
              placeholder="e.g., 1500"
              value={amountUSD}
              onChange={(e) => setAmountUSD(e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="conversionRate" className={labelStyles}>
              Rate
            </label>
            <input
              type="number"
              step="0.01"
              id="conversionRate"
              placeholder="e.g., 278.50"
              value={conversionRate}
              onChange={(e) => setConversionRate(e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>
        <div>
          <label htmlFor="taxRate" className={labelStyles}>
            Tax Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            id="taxRate"
            placeholder="e.g., 2.5"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className={inputStyles}
          />
        </div>
        <div>
          <label htmlFor="bank" className={labelStyles}>
            Receiving Bank
          </label>
          <input
            type="text"
            id="bank"
            placeholder="e.g., HBL"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className={inputStyles}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-900/50 dark:text-red-300">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 p-3 font-bold text-white transition-all duration-200 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:scale-95 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-offset-slate-800"
        >
          {isEditMode ? (
            <>
              <Save size={20} /> Save Changes
            </>
          ) : (
            <>
              <PlusCircle size={20} /> Add Transaction
            </>
          )}
        </button>
      </form>
    </div>
  );
};
