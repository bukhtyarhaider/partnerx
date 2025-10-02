import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingDown,
} from "lucide-react";
import type { PartnerRecord, Partner } from "../types";
import { formatCurrency } from "../utils";
import { usePartners } from "../hooks/usePartners";

interface PartnerSummaryProps {
  partnerEarnings: PartnerRecord<number>;
  partnerExpenses: PartnerRecord<number>;
}

export const PartnerSummary: React.FC<PartnerSummaryProps> = ({
  partnerEarnings,
  partnerExpenses,
}) => {
  const { activePartners } = usePartners();

  if (activePartners.length === 0) {
    return (
      <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
        <h2 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Partner Wallets
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No active partners found.
        </p>
      </div>
    );
  }

  return (
    <section
      className="border-t border-slate-200 pt-4 dark:border-slate-700"
      aria-labelledby="partner-wallets-heading"
    >
      <h2
        id="partner-wallets-heading"
        className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100"
      >
        Partner Wallets
      </h2>
      <div className="space-y-3" role="list">
        {activePartners.map((partner) => (
          <PartnerWalletCard
            key={partner.id}
            partner={partner}
            earnings={partnerEarnings[partner.id] || 0}
            expenses={partnerExpenses[partner.id] || 0}
          />
        ))}
      </div>
    </section>
  );
};

interface PartnerWalletCardProps {
  partner: Partner;
  earnings: number;
  expenses: number;
}

const PartnerWalletCard: React.FC<PartnerWalletCardProps> = ({
  partner,
  earnings,
  expenses,
}) => {
  const net = earnings - expenses;
  const isNegative = net < 0;
  const progressPercentage =
    earnings > 0 ? Math.min((net / earnings) * 100, 100) : 0;
  const netStatus = isNegative ? "deficit" : "surplus";

  return (
    <article
      className="rounded-lg border border-slate-200 bg-white p-3 transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      role="listitem"
      aria-labelledby={`partner-${partner.id}-name`}
    >
      <div className="mb-2 flex items-start justify-between">
        <h3
          id={`partner-${partner.id}-name`}
          className="font-semibold text-slate-800 dark:text-slate-50"
        >
          {partner.displayName}
        </h3>

        <div
          className={`flex items-center gap-1.5 text-lg font-bold ${
            isNegative
              ? "text-red-500 dark:text-red-400"
              : "text-slate-700 dark:text-slate-200"
          }`}
          aria-label={`Net balance: ${formatCurrency(net)} ${netStatus}`}
        >
          {isNegative && <TrendingDown size={18} aria-hidden="true" />}
          <Wallet
            size={18}
            className={
              isNegative ? "text-red-400" : "text-slate-400 dark:text-slate-500"
            }
            aria-hidden="true"
          />
          {formatCurrency(net)}
        </div>
      </div>

      <div
        className="mb-2 h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700"
        role="progressbar"
        aria-valuenow={isNegative ? 100 : progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Financial health: ${
          isNegative
            ? "100% spent"
            : `${progressPercentage.toFixed(1)}% remaining`
        }`}
      >
        <div
          className={`h-1 rounded-full transition-all duration-500 ease-out ${
            isNegative ? "bg-red-500" : "bg-emerald-500"
          }`}
          style={{
            width: isNegative ? "100%" : `${Math.max(progressPercentage, 2)}%`,
          }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
          <ArrowUpRight size={14} aria-hidden="true" />
          <span>Earned: {formatCurrency(earnings)}</span>
        </div>
        <div className="flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
          <ArrowDownRight size={14} aria-hidden="true" />
          <span>Spent: {formatCurrency(expenses)}</span>
        </div>
      </div>
    </article>
  );
};
