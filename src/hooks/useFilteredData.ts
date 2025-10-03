import { useMemo } from "react";
import type { Transaction, Expense, DonationPayout } from "../types";
import { isDateInRange } from "../utils/dateFilter";
import { useDateFilter } from "./useDateFilter";

export const useFilteredData = (
  transactions: Transaction[],
  expenses: Expense[],
  donationPayouts: DonationPayout[]
) => {
  const { dateFilter } = useDateFilter();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      isDateInRange(transaction.date, dateFilter.range)
    );
  }, [transactions, dateFilter.range]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) =>
      isDateInRange(expense.date, dateFilter.range)
    );
  }, [expenses, dateFilter.range]);

  const filteredDonationPayouts = useMemo(() => {
    return donationPayouts.filter((donation) =>
      isDateInRange(donation.date, dateFilter.range)
    );
  }, [donationPayouts, dateFilter.range]);

  return {
    filteredTransactions,
    filteredExpenses,
    filteredDonationPayouts,
  };
};
