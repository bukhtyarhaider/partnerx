import React, { useState, useEffect, useCallback } from "react";
import { PlusCircle, Save, AlertCircle, TrendingUp } from "lucide-react";
import type { DonationPayout, NewDonationPayoutEntry } from "../../types";
import { formatCurrency, getTodayString } from "../../utils";
import { SuccessToast } from "../common/SuccessToast";

interface FormProps {
  mode?: "add" | "edit";
  initialData?: DonationPayout;
  onAddDonationPayout?: (entry: NewDonationPayoutEntry) => void;
  onSave?: (entry: DonationPayout) => void;
  availableFunds: number;
}

const INPUT_STYLES =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition-colors duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-green-400 dark:focus:ring-green-400/20";

const LABEL_STYLES =
  "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successAmount, setSuccessAmount] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setAmount(String(initialData.amount));
      setDate(initialData.date);
      setPaidTo(initialData.paidTo);
      setDescription(initialData.description);
    }
  }, [mode, initialData]);

  const resetForm = useCallback(() => {
    setAmount("");
    setPaidTo("");
    setDescription("");
    setDate(getTodayString());
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payoutAmount = parseFloat(amount);

      if (!payoutAmount || !date || !paidTo) {
        throw new Error("Please fill out Date, Amount, and Paid To fields.");
      }

      // Add epsilon tolerance for floating-point comparison
      const EPSILON = 0.01;
      if (payoutAmount > availableFunds + EPSILON) {
        throw new Error(
          `Amount exceeds available fund of ${formatCurrency(availableFunds)}.`
        );
      }

      const commonData = { amount: payoutAmount, date, paidTo, description };

      if (mode === "edit" && onSave && initialData) {
        onSave({ ...initialData, ...commonData });
      } else if (mode === "add" && onAddDonationPayout) {
        onAddDonationPayout(commonData);

        // Show success toast
        setSuccessAmount(formatCurrency(payoutAmount));
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
      {!isEditMode && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp
              size={16}
              className="text-emerald-600 dark:text-emerald-400"
            />
            <h3 className="font-medium text-emerald-800 dark:text-emerald-300">
              Available Fund
            </h3>
          </div>
          <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            {formatCurrency(availableFunds)}
          </p>
        </div>
      )}

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        {isEditMode ? "Edit Payout" : "Record Donation Payout"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="donation-date" className={LABEL_STYLES}>
              Date *
            </label>
            <input
              type="date"
              id="donation-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={INPUT_STYLES}
              required
            />
          </div>
          <div>
            <label htmlFor="donation-amount" className={LABEL_STYLES}>
              Amount (PKR) *
            </label>
            <input
              type="number"
              id="donation-amount"
              placeholder="e.g., 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={INPUT_STYLES}
              max={availableFunds}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="donation-paid-to" className={LABEL_STYLES}>
            Paid To (Organization/Cause) *
          </label>
          <input
            type="text"
            id="donation-paid-to"
            placeholder="e.g., Edhi Foundation"
            value={paidTo}
            onChange={(e) => setPaidTo(e.target.value)}
            className={INPUT_STYLES}
            required
          />
        </div>

        <div>
          <label htmlFor="donation-description" className={LABEL_STYLES}>
            Description
          </label>
          <input
            type="text"
            id="donation-description"
            placeholder="e.g., Monthly contribution"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={INPUT_STYLES}
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
          disabled={isSubmitting || availableFunds <= 0}
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
              <PlusCircle size={16} /> Record Payout
            </>
          )}
        </button>
      </form>

      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        type="donation"
        message="Donation recorded successfully!"
        amount={successAmount}
      />
    </div>
  );
};
