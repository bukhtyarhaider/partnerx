import React, { useState, useEffect } from "react";
import type { Transaction, Expense, DonationPayout } from "../types";

import { X } from "lucide-react";
import { DonationForm, ExpenseForm, TransactionForm } from "./Forms";

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

  if (!isOpen && !isAnimating) return null;

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
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
        isAnimating && isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-in-out dark:bg-slate-800 dark:shadow-black/50 ${
          isAnimating && isOpen
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-4 opacity-0 scale-95"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50">
            {title}
          </h2>
          <button
            onClick={onClose}
            title="Close modal"
            className="rounded-full p-2 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 dark:focus:ring-offset-slate-800"
          >
            <X
              size={20}
              className="transition-transform duration-200 hover:rotate-90"
            />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">{renderForm()}</div>
      </div>
    </div>
  );
};
