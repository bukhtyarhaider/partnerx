import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  HeartHandshake,
  DollarSign,
} from "lucide-react";

import { LoanCard } from "./LoanCard";
import { formatCurrency } from "../utils/format";
import type { PartnerName } from "../types";
import { StatCard } from "./StatCard";

// The main data structure for financial stats
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
      <LoanCard loan={loan} />
    </div>
  );
};
