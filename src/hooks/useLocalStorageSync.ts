import { useEffect } from "react";
import type { Transaction, Expense, DonationPayout } from "../types";

export function useLocalStorageSync(
  transactions: Transaction[],
  expenses: Expense[],
  donationPayouts: DonationPayout[]
) {
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("donationPayouts", JSON.stringify(donationPayouts));
  }, [transactions, expenses, donationPayouts]);
}
