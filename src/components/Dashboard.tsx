import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  HeartHandshake,
  Scale,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import type { PartnerName } from "../types";

type Financials = {
  totalGrossProfit: number;
  totalNetProfit: number;
  totalExpenses: number;
  companyCapital: number;
  availableDonationsFund: number;
  loan: {
    amount: number;
    owedBy: PartnerName | null;
  };
};

interface DashboardProps {
  financials: Financials;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export const Dashboard: React.FC<DashboardProps> = ({ financials }) => {
  const {
    totalGrossProfit,
    totalNetProfit,
    totalExpenses,
    companyCapital,
    loan,
    availableDonationsFund,
  } = financials;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Gross Profit"
        value={formatCurrency(totalGrossProfit)}
        icon={<DollarSign className="text-white" />}
        variant="indigo"
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        icon={<ArrowDownRight className="text-white" />}
        variant="red"
      />
      <StatCard
        title="Net Earnings"
        value={formatCurrency(totalNetProfit)}
        icon={<ArrowUpRight className="text-white" />}
        variant="green"
      />
      <StatCard
        title="Current Capital"
        value={formatCurrency(companyCapital)}
        icon={<Banknote className="text-white" />}
        variant="blue"
      />
      <StatCard
        title="Donations Fund"
        value={formatCurrency(availableDonationsFund)}
        icon={<HeartHandshake className="text-white" />}
        variant="pink"
      />
      {/* The Loan/Status card fits perfectly as the last item in the grid */}
      <LoanCard loan={loan} />
    </div>
  );
};

type StatCardVariant = "green" | "red" | "blue" | "indigo" | "pink";

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  variant?: StatCardVariant;
}> = ({ title, value, icon, variant = "indigo" }) => {
  const variants: Record<StatCardVariant, { bg: string; shadow: string }> = {
    indigo: { bg: "bg-indigo-500", shadow: "shadow-indigo-200" },
    red: { bg: "bg-red-500", shadow: "shadow-red-200" },
    green: { bg: "bg-wise-green", shadow: "shadow-green-200" },
    blue: { bg: "bg-blue-500", shadow: "shadow-blue-200" },
    pink: { bg: "bg-pink-500", shadow: "shadow-pink-200" },
  };

  const selectedVariant = variants[variant];

  return (
    <div className="relative bg-white pt-8 p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300">
      {/* The Elevated Icon */}
      <div
        className={`absolute -top-5 left-5 p-4 rounded-xl shadow-lg ${selectedVariant.bg} ${selectedVariant.shadow} transition-shadow duration-300`}
      >
        {icon}
      </div>

      <div className="flex flex-col items-end">
        <p className="text-slate-500 font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-wise-blue mt-1">{value}</h3>
      </div>
    </div>
  );
};

/**
 * Loan Status Card (Unchanged Logic)
 * Displays the balance status between partners.
 */
const LoanCard: React.FC<{ loan: Financials["loan"] }> = ({ loan }) => {
  const isBalanced = !loan.owedBy || loan.amount <= 0;

  return (
    <div
      className={`relative p-6 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col justify-center items-center h-full ${
        isBalanced ? "bg-green-50" : "bg-amber-50"
      }`}
    >
      <div className="mb-2">
        {isBalanced ? (
          <CheckCircle2 size={32} className="text-wise-green" />
        ) : (
          <Scale size={32} className="text-amber-500" />
        )}
      </div>
      <h3 className="text-lg font-bold text-wise-blue">
        {isBalanced ? "Expenses Balanced" : "Expense Imbalance"}
      </h3>
      <p className="text-sm text-slate-600 mt-1">
        {isBalanced
          ? "All partner expenses are settled."
          : `${loan.owedBy} owes ${formatCurrency(loan.amount)}`}
      </p>
    </div>
  );
};
