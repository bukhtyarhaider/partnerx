import { useMemo } from "react";
import type { Transaction, Expense, DonationPayout } from "../types";

export function useSortedTransactions(transactions: Transaction[]) {
  return useMemo(
    () =>
      [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [transactions]
  );
}

export function useSortedExpenses(expenses: Expense[]) {
  return useMemo(
    () =>
      [...expenses].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [expenses]
  );
}

export function useSortedDonations(donationPayouts: DonationPayout[]) {
  return useMemo(
    () =>
      [...donationPayouts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [donationPayouts]
  );
}
