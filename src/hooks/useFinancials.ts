import { useMemo } from "react";
import type {
  Transaction,
  Expense,
  DonationPayout,
  PartnerName,
} from "../types";

export interface Financials {
  totalGrossProfit: number;
  totalNetProfit: number;
  totalExpenses: number;
  companyCapital: number;
  availableDonationsFund: number;
  loan: { amount: number; owedBy: PartnerName | null };
  partnerEarnings: Record<PartnerName, number>;
  partnerExpenses: Record<PartnerName, number>;
}

export function useFinancials(
  transactions: Transaction[],
  expenses: Expense[],
  donationPayouts: DonationPayout[]
): Financials {
  return useMemo(() => {
    let totalDonationsAccrued = 0;
    let totalGrossProfit = 0;
    let totalNetProfit = 0;
    const partnerEarnings: { [key in PartnerName]: number } = {
      Bukhtyar: 0,
      Asjad: 0,
    };
    for (const tx of transactions) {
      totalGrossProfit += tx.calculations.grossPKR;
      totalNetProfit += tx.calculations.netProfit;
      partnerEarnings.Bukhtyar += tx.calculations.partnerShare;
      partnerEarnings.Asjad += tx.calculations.partnerShare;
      totalDonationsAccrued += tx.calculations.charityAmount;
    }
    const totalDonationsPaidOut = donationPayouts.reduce(
      (sum, payout) => sum + payout.amount,
      0
    );
    const availableDonationsFund =
      totalDonationsAccrued - totalDonationsPaidOut;
    let totalExpenses = 0;
    const partnerExpenses: { [key in PartnerName]: number } = {
      Bukhtyar: 0,
      Asjad: 0,
    };
    for (const ex of expenses) {
      totalExpenses += ex.amount;
      partnerExpenses[ex.byWhom] += ex.amount;
    }
    const companyCapital = totalNetProfit - totalExpenses;
    const expenseDifference = partnerExpenses.Bukhtyar - partnerExpenses.Asjad;
    const loan = {
      amount: Math.abs(expenseDifference) / 2,
      owedBy:
        expenseDifference > 0
          ? ("Bukhtyar" as PartnerName)
          : expenseDifference < 0
          ? ("Asjad" as PartnerName)
          : null,
    };
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
  }, [transactions, expenses, donationPayouts]);
}
