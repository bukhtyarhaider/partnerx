import React, { useState, useEffect } from "react";
import { PlusCircle, Save, AlertCircle } from "lucide-react";
import type { DonationPayout, NewDonationPayoutEntry } from "../../types";
import { formatCurrency, getTodayString } from "../../utils";

interface FormProps {
  mode?: "add" | "edit";
  initialData?: DonationPayout;
  onAddDonationPayout?: (entry: NewDonationPayoutEntry) => void;
  onSave?: (entry: DonationPayout) => void;
  availableFunds: number;
}

export const DonationForm: React.FC<FormProps> = ({
  mode = "add",
  initialData,
  onAddDonationPayout,
  onSave,
  availableFunds,
}) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [paidTo, setPaidTo] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  // **ANIMATION:** State to trigger the entrance animation
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setAmount(String(initialData.amount));
      setDate(initialData.date);
      setPaidTo(initialData.paidTo);
      setDescription(initialData.description);
    }
  }, [mode, initialData]);

  // **ANIMATION:** Trigger animation on component mount
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const payoutAmount = parseFloat(amount);
    if (!payoutAmount || !date || !paidTo) {
      setError("Please fill out Date, Amount, and Paid To fields.");
      return;
    }
    if (payoutAmount > availableFunds) {
      setError(
        `Amount exceeds available fund of ${formatCurrency(availableFunds)}.`
      );
      return;
    }

    const commonData = { amount: payoutAmount, date, paidTo, description };

    if (mode === "edit" && onSave && initialData) {
      onSave({ ...initialData, ...commonData });
    } else if (mode === "add" && onAddDonationPayout) {
      onAddDonationPayout(commonData);
      // Reset form after successful submission in 'add' mode
      setAmount("");
      setPaidTo("");
      setDescription("");
      setDate(getTodayString());
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
      {!isEditMode && (
        <div className="mb-4 rounded-lg border-l-4 border-green-500 bg-green-50 p-4 transition-transform hover:scale-[1.02] dark:border-green-400 dark:bg-green-900/50">
          <h3 className="font-bold text-green-800 dark:text-green-300">
            Available Fund
          </h3>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-50">
            {formatCurrency(availableFunds)}
          </p>
        </div>
      )}
      <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        {isEditMode ? "Edit Payout" : "Record Donation Payout"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="don-date" className={labelStyles}>
              Date
            </label>
            <input
              type="date"
              id="don-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="don-amount" className={labelStyles}>
              Amount (PKR)
            </label>
            <input
              type="number"
              id="don-amount"
              placeholder="e.g., 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>
        <div>
          <label htmlFor="don-paidTo" className={labelStyles}>
            Paid To (Organization/Cause)
          </label>
          <input
            type="text"
            id="don-paidTo"
            placeholder="e.g., Edhi Foundation"
            value={paidTo}
            onChange={(e) => setPaidTo(e.target.value)}
            className={inputStyles}
          />
        </div>
        <div>
          <label htmlFor="don-desc" className={labelStyles}>
            Description (Optional)
          </label>
          <input
            type="text"
            id="don-desc"
            placeholder="e.g., Monthly contribution"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
              <PlusCircle size={20} /> Record Payout
            </>
          )}
        </button>
      </form>
    </div>
  );
};
