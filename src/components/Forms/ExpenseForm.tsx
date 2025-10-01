import React, { useState, useEffect } from "react";
import { PlusCircle, Save, AlertCircle } from "lucide-react";
import type { NewExpenseEntry, Expense, PartnerName } from "../../types";
import { getTodayString } from "../../utils";
import { usePartners } from "../../hooks/usePartners";

interface FormProps {
  mode?: "add" | "edit";
  initialData?: Expense;
  onAddExpense?: (entry: NewExpenseEntry) => void;
  onSave?: (entry: Expense) => void;
}

export const ExpenseForm: React.FC<FormProps> = ({
  mode = "add",
  initialData,
  onAddExpense,
  onSave,
}) => {
  const { activePartners } = usePartners();

  // State for form fields
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [category, setCategory] = useState("");
  const [byWhom, setByWhom] = useState<PartnerName>(
    activePartners.length > 0
      ? (activePartners[0].name as PartnerName)
      : "Bukhtyar"
  );
  const [error, setError] = useState<string | null>(null);

  // **ANIMATION:** State to trigger the entrance animation
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setAmount(String(initialData.amount));
      setDescription(initialData.description);
      setDate(initialData.date);
      setCategory(initialData.category);
      setByWhom(initialData.byWhom);
    }
  }, [mode, initialData]);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!amount || !description || !date || !category) {
      setError("Please fill out all required fields.");
      return;
    }

    const commonData = {
      amount: parseFloat(amount),
      description,
      date,
      category,
      byWhom,
    };

    if (mode === "edit" && onSave && initialData) {
      onSave({ ...initialData, ...commonData });
    } else if (mode === "add" && onAddExpense) {
      onAddExpense(commonData);
      // Reset form after successful submission
      setAmount("");
      setDescription("");
      setCategory("");
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
      <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        {isEditMode ? "Edit Expense" : "Add New Expense"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="exp-date" className={labelStyles}>
              Date
            </label>
            <input
              type="date"
              id="exp-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="exp-amount" className={labelStyles}>
              Amount (PKR)
            </label>
            <input
              type="number"
              id="exp-amount"
              placeholder="e.g., 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>
        <div>
          <label htmlFor="exp-desc" className={labelStyles}>
            Description
          </label>
          <input
            type="text"
            id="exp-desc"
            placeholder="e.g., Domain Renewal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputStyles}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="exp-cat" className={labelStyles}>
              Category
            </label>
            <input
              type="text"
              id="exp-cat"
              placeholder="e.g., Software"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="exp-by" className={labelStyles}>
              By Whom
            </label>
            <select
              id="exp-by"
              value={byWhom}
              onChange={(e) => setByWhom(e.target.value as PartnerName)}
              className={inputStyles}
            >
              {activePartners.map((partner) => (
                <option key={partner.id} value={partner.name}>
                  {partner.displayName}
                </option>
              ))}
            </select>
          </div>
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
              <PlusCircle size={20} /> Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
};
