import { useMemo } from "react";
import type {
  Transaction,
  Expense,
  DonationPayout,
  PartnerRecord,
} from "../types";
import { usePartners } from "./usePartners";

export interface Financials {
  totalGrossProfit: number;
  totalNetProfit: number;
  totalExpenses: number;
  companyCapital: number;
  availableDonationsFund: number;
  loan: { amount: number; owedBy: string | null };
  partnerEarnings: PartnerRecord<number>;
  partnerExpenses: PartnerRecord<number>;
}

export function useFinancials(
  transactions: Transaction[],
  expenses: Expense[],
  donationPayouts: DonationPayout[]
): Financials {
  const { activePartners, calculateShares } = usePartners();

  return useMemo(() => {
    let totalDonationsAccrued = 0;
    let totalGrossProfit = 0;
    let totalNetProfit = 0;

    // Initialize partner earnings for all active partners
    const partnerEarnings: PartnerRecord<number> = {};
    activePartners.forEach((partner) => {
      partnerEarnings[partner.id] = 0;
    });

    for (const tx of transactions) {
      totalGrossProfit += tx.calculations.grossPKR;
      totalNetProfit += tx.calculations.netProfit;
      totalDonationsAccrued += tx.calculations.charityAmount;

      // Distribute partner share based on equity percentages
      const shares = calculateShares(tx.calculations.partnerShare);
      Object.entries(shares).forEach(([partnerId, share]) => {
        partnerEarnings[partnerId] = (partnerEarnings[partnerId] || 0) + share;
      });
    }

    const totalDonationsPaidOut = donationPayouts.reduce(
      (sum, payout) => sum + payout.amount,
      0
    );
    const availableDonationsFund =
      totalDonationsAccrued - totalDonationsPaidOut;

    let totalExpenses = 0;

    // Initialize partner expenses for all active partners
    const partnerExpenses: PartnerRecord<number> = {};
    activePartners.forEach((partner) => {
      partnerExpenses[partner.id] = 0;
    });

    for (const ex of expenses) {
      totalExpenses += ex.amount;

      // Find partner by name for backward compatibility
      const partner = activePartners.find((p) => p.name === ex.byWhom);
      if (partner) {
        partnerExpenses[partner.id] =
          (partnerExpenses[partner.id] || 0) + ex.amount;
      }
    }

    const companyCapital = totalNetProfit - totalExpenses;

    // Calculate loan based on expense differences
    // For now, we'll use the first two partners for backward compatibility
    const partnerIds = Object.keys(partnerExpenses);
    let loan = { amount: 0, owedBy: null as string | null };

    if (partnerIds.length >= 2) {
      const partner1Expenses = partnerExpenses[partnerIds[0]] || 0;
      const partner2Expenses = partnerExpenses[partnerIds[1]] || 0;
      const expenseDifference = partner1Expenses - partner2Expenses;

      loan = {
        amount: Math.abs(expenseDifference) / 2,
        owedBy:
          expenseDifference > 0
            ? partnerIds[0]
            : expenseDifference < 0
            ? partnerIds[1]
            : null,
      };
    }

    return {
      totalGrossProfit,
      totalNetProfit,
      totalExpenses,
      companyCapital,
      partnerEarnings,
      partnerExpenses,
      loan,
      availableDonationsFund,
    };
  }, [
    transactions,
    expenses,
    donationPayouts,
    activePartners,
    calculateShares,
  ]);
}
