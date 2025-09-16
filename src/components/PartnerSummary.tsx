import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingDown,
} from "lucide-react";
import type { PartnerName } from "../types";

interface PartnerSummaryProps {
  partnerEarnings: { [key in PartnerName]: number };
  partnerExpenses: { [key in PartnerName]: number };
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export const PartnerSummary: React.FC<PartnerSummaryProps> = ({
  partnerEarnings,
  partnerExpenses,
}) => {
  return (
    <div className="mt-auto pt-6 border-t border-slate-200">
      <h2 className="text-lg font-semibold text-wise-blue mb-4">
        Partner Wallets
      </h2>
      <div className="space-y-4">
        <PartnerWalletCard
          name="Bukhtyar"
          earnings={partnerEarnings.Bukhtyar}
          expenses={partnerExpenses.Bukhtyar}
        />
        <PartnerWalletCard
          name="Asjad"
          earnings={partnerEarnings.Asjad}
          expenses={partnerExpenses.Asjad}
        />
      </div>
    </div>
  );
};

interface PartnerWalletCardProps {
  name: PartnerName;
  earnings: number;
  expenses: number;
}

const PartnerWalletCard: React.FC<PartnerWalletCardProps> = ({
  name,
  earnings,
  expenses,
}) => {
  const net = earnings - expenses;
  const isNegative = net < 0;

  // Only calculate a positive progress percentage. If net is negative, it's irrelevant.
  const progressPercentage =
    !isNegative && earnings > 0 ? (net / earnings) * 100 : 0;

  return (
    <div className="bg-wise-blue-light p-4 rounded-xl border border-slate-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-wise-blue">{name}</h3>

        {/* UPDATED: Balance display with conditional styling for negative values */}
        <div
          className={`flex items-center gap-2 font-bold text-xl ${
            isNegative ? "text-red-600" : "text-wise-blue"
          }`}
        >
          {isNegative && <TrendingDown size={20} />}
          <Wallet
            size={20}
            className={isNegative ? "text-red-400" : "text-slate-500"}
          />
          {formatCurrency(net)}
        </div>
      </div>

      {/* UPDATED: Progress bar with conditional styling for negative state */}
      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${
            isNegative ? "bg-red-500" : "bg-wise-green"
          }`}
          style={{ width: isNegative ? "100%" : `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Earnings vs. Expenses details (no changes here) */}
      <div className="flex text-sm justify-between">
        <div className="flex items-center gap-1.5 text-green-600 font-medium">
          <ArrowUpRight size={16} />
          <span>Earned: {formatCurrency(earnings)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-red-600 font-medium">
          <ArrowDownRight size={16} />
          <span>Spent: {formatCurrency(expenses)}</span>
        </div>
      </div>
    </div>
  );
};
