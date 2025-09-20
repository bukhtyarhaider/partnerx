import { useState, useEffect } from "react";
import type { Transaction, Expense, DonationPayout } from "../types";
import { TransactionForm } from "./TransactionForm";
import { ExpenseForm } from "./ExpenseForm";
import { DonationForm } from "./DonationForm";
import { X } from "lucide-react";

type EditableEntry = Transaction | Expense | DonationPayout;

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: EditableEntry | null;
  type: "transaction" | "expense" | "donation" | null;
  onUpdateTransaction: (tx: Transaction) => void;
  onUpdateExpense: (ex: Expense) => void;
  onUpdateDonationPayout: (dp: DonationPayout) => void;
  availableDonationFunds: number;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  entry,
  type,
  ...props
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen || !entry) return null;

  const renderForm = () => {
    switch (type) {
      case "transaction":
        return (
          <TransactionForm
            mode="edit"
            initialData={entry as Transaction}
            onSave={props.onUpdateTransaction}
          />
        );
      case "expense":
        return (
          <ExpenseForm
            mode="edit"
            initialData={entry as Expense}
            onSave={props.onUpdateExpense}
          />
        );
      case "donation": {
        const currentAmount = (entry as DonationPayout).amount;
        return (
          <DonationForm
            mode="edit"
            initialData={entry as DonationPayout}
            onSave={props.onUpdateDonationPayout}
            availableFunds={props.availableDonationFunds + currentAmount}
          />
        );
      }
      default:
        return null;
    }
  };

  const title = `Edit ${type?.charAt(0).toUpperCase() + type!.slice(1)}`;

  return (
    <div
      className={`fixed inset-0 backdrop-blur-xs z-50 flex justify-center items-center p-4 bg-black/50 transition-opacity duration-300 ease-in-out ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg transition-all duration-300 ease-in-out ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-wise-blue">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{renderForm()}</div>
      </div>
    </div>
  );
};
