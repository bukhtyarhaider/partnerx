import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingDown,
} from "lucide-react";
import type { PartnerName } from "../types";
import { formatCurrency } from "../utils";

interface PartnerSummaryProps {
  partnerEarnings: { [key in PartnerName]: number };
  partnerExpenses: { [key in PartnerName]: number };
}

export const PartnerSummary: React.FC<PartnerSummaryProps> = ({
  partnerEarnings,
  partnerExpenses,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`border-t border-slate-200 pt-6 transition-opacity duration-500 dark:border-slate-700 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
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
  const progressPercentage =
    !isNegative && earnings > 0 ? (net / earnings) * 100 : 0;

  return (
    <div className="transform rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-black/30">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-bold text-slate-800 dark:text-slate-50">{name}</h3>

        <div
          className={`flex items-center gap-2 text-xl font-bold ${
            isNegative
              ? "text-red-500 dark:text-red-400"
              : "text-slate-700 dark:text-slate-200"
          }`}
        >
          {isNegative && <TrendingDown size={20} />}
          <Wallet
            size={20}
            className={
              isNegative ? "text-red-400" : "text-slate-400 dark:text-slate-500"
            }
          />
          {formatCurrency(net)}
        </div>
      </div>

      <div className="mb-3 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ease-out ${
            isNegative ? "bg-red-500" : "bg-green-500"
          }`}
          style={{ width: isNegative ? "100%" : `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-1.5 font-medium text-green-600 dark:text-green-400">
          <ArrowUpRight size={16} />
          <span>Earned: {formatCurrency(earnings)}</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-red-600 dark:text-red-400">
          <ArrowDownRight size={16} />
          <span>Spent: {formatCurrency(expenses)}</span>
        </div>
      </div>
    </div>
  );
};
