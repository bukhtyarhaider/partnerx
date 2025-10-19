import React, { useState, useEffect, useCallback } from "react";
import { PlusCircle, Save, AlertCircle } from "lucide-react";
import type { NewExpenseEntry, Expense } from "../../types";
import { getTodayString } from "../../utils";
import { formatCurrency } from "../../utils/format";
import { SuccessToast } from "../common/SuccessToast";

interface FormProps {
  mode?: "add" | "edit";
  initialData?: Expense;
  onAddExpense?: (entry: NewExpenseEntry) => void;
  onSave?: (entry: Expense) => void;
}

const INPUT_STYLES =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition-colors duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-green-400 dark:focus:ring-green-400/20";

const LABEL_STYLES =
  "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

export const PersonalExpenseForm: React.FC<FormProps> = ({
  mode = "add",
  initialData,
  onAddExpense,
  onSave,
}) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successAmount, setSuccessAmount] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setAmount(String(initialData.amount));
      setDescription(initialData.description);
      setDate(initialData.date);
      setCategory(initialData.category);
    }
  }, [mode, initialData]);

  const resetForm = useCallback(() => {
    setAmount("");
    setDescription("");
    setCategory("");
    setDate(getTodayString());
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!amount || !description || !date || !category) {
        throw new Error("Please fill out all required fields.");
      }

      const expenseAmount = parseFloat(amount);

      // For personal accounts, we use a fixed structure
      // The byWhom field will be set to a default value since it's not relevant in personal mode
      const commonData: NewExpenseEntry = {
        amount: expenseAmount,
        description,
        date,
        category,
        type: "personal", // Personal account expenses are always "personal" type
        byWhom: "Bukhtyar", // Default value for compatibility; not displayed in personal mode
      };

      if (mode === "edit" && onSave && initialData) {
        onSave({ ...initialData, ...commonData });
        // Show success toast for edit
        setSuccessAmount(formatCurrency(expenseAmount));
        setShowSuccessToast(true);
      } else if (mode === "add" && onAddExpense) {
        onAddExpense(commonData);
        // Show success toast
        setSuccessAmount(formatCurrency(expenseAmount));
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
        {isEditMode ? "Edit Expense" : "Add New Expense"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="personal-expense-date" className={LABEL_STYLES}>
              Date *
            </label>
            <input
              type="date"
              id="personal-expense-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={INPUT_STYLES}
              required
            />
          </div>
          <div>
            <label htmlFor="personal-expense-amount" className={LABEL_STYLES}>
              Amount (PKR) *
            </label>
            <input
              type="number"
              id="personal-expense-amount"
              placeholder="e.g., 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={INPUT_STYLES}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="personal-expense-description"
            className={LABEL_STYLES}
          >
            Description *
          </label>
          <input
            type="text"
            id="personal-expense-description"
            placeholder="e.g., Groceries, Rent, Utilities"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={INPUT_STYLES}
            required
          />
        </div>

        <div>
          <label htmlFor="personal-expense-category" className={LABEL_STYLES}>
            Category *
          </label>
          <input
            type="text"
            id="personal-expense-category"
            placeholder="e.g., Food, Housing, Transportation"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
          disabled={isSubmitting}
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
              <PlusCircle size={16} /> Add Expense
            </>
          )}
        </button>
      </form>

      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        type="expense"
        message={
          isEditMode
            ? "Expense updated successfully!"
            : "Expense added successfully!"
        }
        amount={successAmount}
      />
    </div>
  );
};
