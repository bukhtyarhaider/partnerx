import { useState, useEffect } from "react";
import { PlusCircle, Save } from "lucide-react";
import type { NewExpenseEntry, Expense, PartnerName } from "../types";

interface FormProps {
  mode?: "add" | "edit";
  initialData?: Expense;
  onAddExpense?: (entry: NewExpenseEntry) => void;
  onSave?: (entry: Expense) => void;
}

const getTodayString = () =>
  new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000)
    .toISOString()
    .split("T")[0];

export const ExpenseForm: React.FC<FormProps> = ({
  mode = "add",
  initialData,
  onAddExpense,
  onSave,
}) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [category, setCategory] = useState("");
  const [byWhom, setByWhom] = useState<PartnerName>("Bukhtyar");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setAmount(String(initialData.amount));
      setDescription(initialData.description);
      setDate(initialData.date);
      setCategory(initialData.category);
      setByWhom(initialData.byWhom);
    }
  }, [mode, initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount || !description || !date || !category) {
      alert("Please fill out all fields.");
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
      setAmount("");
      setDescription("");
      setCategory("");
    }
  };

  const isEditMode = mode === "edit";

  return (
    <div>
      {!isEditMode && (
        <h2 className="text-lg font-semibold text-wise-blue mb-4">
          Add New Expense
        </h2>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="exp-date"
              className="block mb-1.5 text-sm font-semibold text-slate-600"
            >
              Date
            </label>
            <input
              type="date"
              id="exp-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="exp-amount"
              className="block mb-1.5 text-sm font-semibold text-slate-600"
            >
              Amount (PKR)
            </label>
            <input
              type="number"
              id="exp-amount"
              placeholder="e.g., 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="exp-desc"
            className="block mb-1.5 text-sm font-semibold text-slate-600"
          >
            Description
          </label>
          <input
            type="text"
            id="exp-desc"
            placeholder="e.g., Domain Renewal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="exp-cat"
              className="block mb-1.5 text-sm font-semibold text-slate-600"
            >
              Category
            </label>
            <input
              type="text"
              id="exp-cat"
              placeholder="e.g., Software"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="exp-by"
              className="block mb-1.5 text-sm font-semibold text-slate-600"
            >
              By Whom
            </label>
            <select
              id="exp-by"
              value={byWhom}
              onChange={(e) => setByWhom(e.target.value as PartnerName)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-wise-green outline-none"
            >
              <option>Bukhtyar</option>
              <option>Asjad</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full p-3 flex items-center justify-center gap-2 bg-wise-green text-white font-bold rounded-lg hover:bg-wise-green-dark"
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
