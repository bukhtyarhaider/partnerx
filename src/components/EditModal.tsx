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
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
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
