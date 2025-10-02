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
        // Handle different expense types
        const expenseType = ex.type || "personal"; // Default to personal for backward compatibility

        if (expenseType === "personal") {
          // Personal expenses: deduct from the partner who spent it
          partnerExpenses[partner.id] =
            (partnerExpenses[partner.id] || 0) + ex.amount;
        } else if (expenseType === "company") {
          // Company expenses: split according to equity, but track who paid
          const shares = calculateShares(ex.amount);

          // Each partner should be charged their equity share
          Object.entries(shares).forEach(([partnerId, share]) => {
            partnerExpenses[partnerId] =
              (partnerExpenses[partnerId] || 0) + share;
          });

          // But since one partner actually paid, give them credit for the difference
          const paidByShare = shares[partner.id] || 0;
          const actualPaid = ex.amount;
          const overpayment = actualPaid - paidByShare;

          // The person who paid gets credited for what others should have paid
          if (overpayment > 0) {
            partnerExpenses[partner.id] -= overpayment;
          }
        }
      }
    }

    const companyCapital = totalNetProfit - totalExpenses;

    // Calculate loan based on actual deficit (when a partner spends more than they earned)
    // This is the correct logic: only show imbalance if someone has negative wallet balance
    let loan = { amount: 0, owedBy: null as string | null };
    let maxDeficit = 0;
    let deficitPartnerId: string | null = null;

    // Find the partner with the largest deficit (negative balance)
    Object.keys(partnerEarnings).forEach((partnerId) => {
      const earnings = partnerEarnings[partnerId] || 0;
      const expenses = partnerExpenses[partnerId] || 0;
      const balance = earnings - expenses;

      if (balance < 0 && Math.abs(balance) > maxDeficit) {
        maxDeficit = Math.abs(balance);
        deficitPartnerId = partnerId;
      }
    });

    if (deficitPartnerId && maxDeficit > 0) {
      loan = {
        amount: maxDeficit,
        owedBy: deficitPartnerId,
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
