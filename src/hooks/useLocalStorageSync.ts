import { useEffect } from "react";
import type {
  Transaction,
  Expense,
  DonationPayout,
  FinancialSummaryRecord,
} from "../types";

export function useLocalStorageSync(
  transactions: Transaction[],
  expenses: Expense[],
  donationPayouts: DonationPayout[],
  summaries: FinancialSummaryRecord[]
) {
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("donationPayouts", JSON.stringify(donationPayouts));
    localStorage.setItem("summaries", JSON.stringify(summaries));
  }, [transactions, expenses, donationPayouts, summaries]);
}
