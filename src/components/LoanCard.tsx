import { CheckCircle2, Scale } from "lucide-react";
import { formatCurrency } from "../utils/format";
import { usePartners } from "../hooks/usePartners";

interface LoanCardProps {
  loan: {
    amount: number;
    owedBy: string | null;
  };
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan }) => {
  const { getPartner } = usePartners();
  const isBalanced = !loan.owedBy || loan.amount <= 0;
  const owedByPartner = loan.owedBy ? getPartner(loan.owedBy) : null;

  return (
    <div
      className={`relative flex h-full w-72 flex-shrink-0 transform flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg dark:shadow-slate-900/50 lg:w-full ${
        isBalanced
          ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-500/10"
          : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-500/10"
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
        {isBalanced ? "All Settled" : "Expense Deficit"}
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {isBalanced
          ? "All partners have sufficient funds to cover their expenses."
          : `${
              owedByPartner?.displayName || "Unknown Partner"
            } has overspent by ${formatCurrency(
              loan.amount
            )} and needs to settle up.`}
      </p>
    </div>
  );
};
