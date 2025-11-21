import { useStore } from "./useStore";
import {
  loadTransactionsWithMigration,
  loadExpensesWithMigration,
} from "../utils/migration";
import { type DonationPayout, type FinancialSummaryRecord, type DonationConfig } from "../domain";

export const migrateLegacyData = () => {
  const store = useStore.getState();
  
  // Check if store is empty (indicating fresh install or pre-migration)
  if (store.transactions.length === 0 && store.expenses.length === 0) {
    console.log("Checking for legacy data...");
    
    const legacyTransactions = loadTransactionsWithMigration();
    const legacyExpenses = loadExpensesWithMigration();
    const legacyDonationPayouts = JSON.parse(
      localStorage.getItem("donationPayouts") || "[]"
    ) as DonationPayout[];
    const legacySummaries = JSON.parse(
      localStorage.getItem("summaries") || "[]"
    ) as FinancialSummaryRecord[];
    
    const legacyDonationConfigStr = localStorage.getItem("donationConfig");
    let legacyDonationConfig: DonationConfig | undefined;
    if (legacyDonationConfigStr) {
        try {
            legacyDonationConfig = JSON.parse(legacyDonationConfigStr);
        } catch (e) {
            console.warn("Failed to parse legacy donation config", e);
        }
    }

    if (
      legacyTransactions.length > 0 ||
      legacyExpenses.length > 0 ||
      legacyDonationPayouts.length > 0
    ) {
      console.log("Found legacy data, migrating to new store...");
      store.importData({
        transactions: legacyTransactions.map((tx: any) => ({
            ...tx,
            incomeSourceId: tx.source?.id || "unknown",
            sourceSnapshot: tx.source,
            donationConfigSnapshot: tx.donationConfigSnapshot || { ...store.donationConfig }
        })) as any[],
        expenses: legacyExpenses,
        donationPayouts: legacyDonationPayouts,
        summaries: legacySummaries,
        donationConfig: legacyDonationConfig,
      });
      console.log("Migration complete.");
      
      // Optional: Clear legacy keys?
      // localStorage.removeItem("transactions");
      // localStorage.removeItem("expenses");
      // ...
      // Better to keep them for safety for now.
    }
  }
};
