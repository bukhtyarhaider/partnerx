import { CheckCircle2, Scale } from "lucide-react";
import type { PartnerName } from "../types";
import { formatCurrency } from "../utils/format";

interface LoanCardProps {
  loan: {
    amount: number;
    owedBy: PartnerName | null;
  };
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan }) => {
  const isBalanced = !loan.owedBy || loan.amount <= 0;

  return (
    <div
      className={`relative flex h-full transform flex-col items-center justify-center rounded-2xl border border-slate-100 p-6 text-center shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg dark:border-slate-700 dark:shadow-slate-900/50 ${
        isBalanced
          ? "bg-green-50 dark:bg-green-500/10"
          : "bg-amber-50 dark:bg-amber-500/10"
      }`}
    >
      <div className="mb-2">
        {isBalanced ? (
          <CheckCircle2
            size={32}
            className="text-green-600 dark:text-green-400"
          />
        ) : (
          <Scale size={32} className="text-amber-500 dark:text-amber-400" />
        )}
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50">
        {isBalanced ? "Expenses Balanced" : "Expense Imbalance"}
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {isBalanced
          ? "All partner expenses are settled."
          : `${loan.owedBy} owes ${formatCurrency(loan.amount)}`}
      </p>
    </div>
  );
};
