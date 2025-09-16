import { useState, useEffect } from "react";
import { PlusCircle, Save } from "lucide-react";
import type { NewTransactionEntry, Transaction } from "../types";

interface FormProps {
  mode?: "add" | "edit";
  initialData?: Transaction;
  onAddTransaction?: (entry: NewTransactionEntry) => void;
  onSave?: (entry: Transaction) => void;
}

const getTodayString = () =>
  new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000)
    .toISOString()
    .split("T")[0];

export const TransactionForm: React.FC<FormProps> = ({
  mode = "add",
  initialData,
  onAddTransaction,
  onSave,
}) => {
  const [source, setSource] = useState<"youtube" | "tiktok">("youtube");
  const [amountUSD, setAmountUSD] = useState("");
  const [conversionRate, setConversionRate] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [bank, setBank] = useState("");
  const [date, setDate] = useState(getTodayString());

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setSource(initialData.source);
      setAmountUSD(String(initialData.amountUSD));
      setConversionRate(String(initialData.conversionRate));
      setTaxRate(String(initialData.taxRate));
      setBank(initialData.bank);
      setDate(initialData.date);
    }
  }, [mode, initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amountUSD || !conversionRate || !taxRate || !bank || !date) {
      alert("Please fill out all fields.");
      return;
    }

    const commonData = {
      source,
      date,
      bank,
      amountUSD: parseFloat(amountUSD),
      conversionRate: parseFloat(conversionRate),
      taxRate: parseFloat(taxRate),
    };

    if (mode === "edit" && onSave && initialData) {
      onSave({ ...initialData, ...commonData });
    } else if (mode === "add" && onAddTransaction) {
      onAddTransaction(commonData);
      setAmountUSD("");
      setConversionRate("");
      setTaxRate("");
      setBank("");
    }
  };

  const isEditMode = mode === "edit";

  return (
    <div>
      {!isEditMode && (
        <h2 className="text-lg font-semibold text-wise-blue mb-4">
          Add New Payout
        </h2>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="date"
            className="block mb-1.5 text-sm font-semibold text-slate-600"
          >
            Payout Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="source"
            className="block mb-1.5 text-sm font-semibold text-slate-600"
          >
            Source
          </label>
          <select
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value as "youtube" | "tiktok")}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
          >
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="amountUSD"
              className="block mb-1.5 text-sm font-semibold text-slate-600"
            >
              Amount (USD)
            </label>
            <input
              type="number"
              step="0.01"
              id="amountUSD"
              placeholder="e.g., 1500"
              value={amountUSD}
              onChange={(e) => setAmountUSD(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="conversionRate"
              className="block mb-1.5 text-sm font-semibold text-slate-600"
            >
              Rate
            </label>
            <input
              type="number"
              step="0.01"
              id="conversionRate"
              placeholder="e.g., 278.50"
              value={conversionRate}
              onChange={(e) => setConversionRate(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="taxRate"
            className="block mb-1.5 text-sm font-semibold text-slate-600"
          >
            Tax Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            id="taxRate"
            placeholder="e.g., 2.5"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="bank"
            className="block mb-1.5 text-sm font-semibold text-slate-600"
          >
            Receiving Bank
          </label>
          <input
            type="text"
            id="bank"
            placeholder="e.g., HBL"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 flex items-center justify-center gap-2 bg-wise-green text-white font-bold rounded-lg hover:bg-wise-green-dark transition-colors duration-200"
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
