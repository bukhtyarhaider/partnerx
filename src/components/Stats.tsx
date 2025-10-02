import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  HeartHandshake,
  DollarSign,
} from "lucide-react";
import { StatCard } from "./StatCard";
import { LoanCard } from "./LoanCard";
import { formatCurrency } from "../utils/format";

// The main data structure for financial stats
type Financials = {
  totalGrossProfit: number;
  totalNetProfit: number;
  totalExpenses: number;
  companyCapital: number;
  availableDonationsFund: number;
  loan: {
    amount: number;
    owedBy: string | null;
  };
};

interface StatsProps {
  financials: Financials;
}

export const Stats: React.FC<StatsProps> = ({ financials }) => {
  const {
    totalGrossProfit,
    totalNetProfit,
    totalExpenses,
    companyCapital,
    loan,
    availableDonationsFund,
  } = financials;

  // Helper function to determine trend based on value
  const getTrend = (value: number): "up" | "down" | "neutral" => {
    if (value > 0) return "up";
    if (value < 0) return "down";
    return "neutral";
  };

  // Helper function to get trend message
  const getTrendMessage = (value: number, type: string): string => {
    if (value === 0) return `No ${type.toLowerCase()} recorded`;
    if (value > 0) return `Positive ${type.toLowerCase()}`;
    return `Negative ${type.toLowerCase()}`;
  };

  return (
    <div className="hide-scrollbar -mx-4 flex space-x-3 overflow-x-auto px-4 pt-6 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-x-0 lg:px-5 lg:py-6">
      <StatCard
        title="Gross Profit"
        value={formatCurrency(totalGrossProfit)}
        icon={<DollarSign className="text-white w-full h-full" />}
        variant="indigo"
        subtitle="Total revenue"
        trend={getTrend(totalGrossProfit)}
        trendValue={getTrendMessage(totalGrossProfit, "Profit")}
        emptyMessage="No profit recorded yet"
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        icon={<ArrowDownRight className="text-white w-full h-full" />}
        variant="red"
        subtitle="Operational costs"
        trend={totalExpenses > 0 ? "down" : "neutral"}
        trendValue={
          totalExpenses > 0 ? "Expenses incurred" : "No expenses recorded"
        }
        emptyMessage="No expenses recorded"
      />
      <StatCard
        title="Net Earnings"
        value={formatCurrency(totalNetProfit)}
        icon={<ArrowUpRight className="text-white w-full h-full" />}
        variant={
          totalNetProfit > 0 ? "green" : totalNetProfit < 0 ? "red" : "gray"
        }
        subtitle="After expenses"
        trend={getTrend(totalNetProfit)}
        trendValue={getTrendMessage(totalNetProfit, "Earnings")}
        emptyMessage="No net earnings yet"
      />
      <StatCard
        title="Current Capital"
        value={formatCurrency(companyCapital)}
        icon={<Banknote className="text-white w-full h-full" />}
        variant={companyCapital > 0 ? "blue" : "gray"}
        subtitle="Available funds"
        trend={getTrend(companyCapital)}
        trendValue={
          companyCapital > 0 ? "Capital available" : "No capital available"
        }
        emptyMessage="No capital available"
      />
      <StatCard
        title="Donations Fund"
        value={formatCurrency(availableDonationsFund)}
        icon={<HeartHandshake className="text-white w-full h-full" />}
        variant={availableDonationsFund > 0 ? "pink" : "gray"}
        subtitle="For donations"
        trend={getTrend(availableDonationsFund)}
        trendValue={
          availableDonationsFund > 0 ? "Funds available" : "No donation funds"
        }
        emptyMessage="No donation funds available"
      />
      <LoanCard loan={loan} />
    </div>
  );
};
