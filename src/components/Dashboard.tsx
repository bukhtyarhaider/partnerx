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

// UPDATED: Added totalGrossProfit to the type
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
      <StatCard
        title="Gross Profit"
        value={formatCurrency(totalGrossProfit)}
        icon={<DollarSign className="text-white" />}
        color={{
          bg: "bg-indigo-500",
          shadow: "shadow-indigo-200",
        }}
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        icon={<ArrowDownRight className="text-white" />}
        color={{
          bg: "bg-red-500",
          shadow: "shadow-red-200",
        }}
      />
      <StatCard
        title="Net Earnings"
        value={formatCurrency(totalNetProfit)}
        icon={<ArrowUpRight className="text-white" />}
        color={{
          bg: "bg-wise-green",
          shadow: "shadow-green-200",
        }}
      />
      <StatCard
        title="Current Capital"
        value={formatCurrency(companyCapital)}
        icon={<Banknote className="text-white" />}
        color={{
          bg: "bg-blue-500",
          shadow: "shadow-blue-200",
        }}
      />
      {/* The Loan/Status card has a different design and takes the last spot */}
      <LoanCard loan={loan} />

      {/* Donation fund is important, placing it prominently */}
      <div className="sm:col-span-2 lg:col-span-3 xl:col-span-5">
        <StatCard
          title="Available Donations Fund"
          value={formatCurrency(availableDonationsFund)}
          icon={<HeartHandshake className="text-white" />}
          color={{
            bg: "bg-pink-500",
            shadow: "shadow-pink-200",
          }}
        />
      </div>
    </div>
  );
};

// NEW: "Crazy Cool" Stat Card component with elevated icon
const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: { bg: string; shadow: string };
}> = ({ title, value, icon, color }) => (
  <div className="relative bg-white pt-8 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
    {/* The Elevated Icon */}
    <div
      className={`absolute -top-5 left-5 p-4 rounded-xl shadow-lg hover:shadow-2xl ${color.bg} ${color.shadow} transition-shadow duration-300`}
    >
      {icon}
    </div>

    <div className="text-right">
      <p className="text-slate-500 font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-wise-blue mt-1">{value}</h3>
    </div>
  </div>
);

// NEW: Redesigned Loan Card to be a clear status indicator
const LoanCard: React.FC<{ loan: Financials["loan"] }> = ({ loan }) => {
  const isBalanced = !loan.owedBy || loan.amount <= 0;

  return (
    <div
      className={`relative p-6 rounded-2xl shadow-sm text-center flex flex-col justify-center items-center h-full ${
        isBalanced ? "bg-wise-green-light" : "bg-amber-50"
      }`}
    >
      {isBalanced ? (
        <CheckCircle2 size={32} className="text-wise-green mb-2" />
      ) : (
        <Scale size={32} className="text-amber-500 mb-2" />
      )}
      <h3 className="font-bold text-wise-blue">
        {isBalanced ? "Expenses Balanced" : "Expense Imbalance"}
      </h3>
      <p className="text-sm text-slate-600">
        {isBalanced
          ? "Partners are settled."
          : `${loan.owedBy} owes ${formatCurrency(loan.amount)}`}
      </p>
    </div>
  );
};
