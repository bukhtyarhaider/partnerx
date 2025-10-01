import type { Transaction } from "../types";

/**
 * Migration utilities for handling legacy data formats
 */

// Legacy transaction interface for backward compatibility
interface LegacyTransaction {
  id: number;
  source: "youtube" | "tiktok";
  amountUSD: number;
  conversionRate: number;
  date: string;
  taxRate: number;
  bank: string;
  calculations: {
    feePKR: number;
    grossPKR: number;
    charityAmount: number;
    taxAmount: number;
    netProfit: number;
    partnerShare: number;
  };
}

/**
 * Check if transaction data needs migration
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const needsMigration = (transaction: any): boolean => {
  return transaction.source !== undefined && transaction.sourceId === undefined;
};

/**
 * Migrate legacy transaction format to new format
 */
export const migrateLegacyTransaction = (
  legacyTx: LegacyTransaction
): Transaction => {
  // Map legacy source to new sourceId
  const sourceMapping: Record<string, string> = {
    youtube: "youtube",
    tiktok: "tiktok",
  };

  // Create new transaction without the source property
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { source, ...txWithoutSource } = legacyTx as any;

  return {
    ...txWithoutSource,
    sourceId: sourceMapping[source] || source,
  } as Transaction;
};

/**
 * Migrate an array of transactions
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const migrateTransactions = (transactions: any[]): Transaction[] => {
  return transactions.map((tx) => {
    if (needsMigration(tx)) {
      const migrated = migrateLegacyTransaction(tx as LegacyTransaction);
      console.log(`Migrated transaction ${tx.id} from legacy format`);
      return migrated;
    }
    return tx as Transaction;
  });
};

/**
 * Load and migrate transactions from localStorage
 */
export const loadTransactionsWithMigration = (): Transaction[] => {
  try {
    const stored = localStorage.getItem("transactions");
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    const migrated = migrateTransactions(parsed);

    // Save back the migrated data if any migration was needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasMigration = parsed.some((tx: any) => needsMigration(tx));
    if (hasMigration) {
      localStorage.setItem("transactions", JSON.stringify(migrated));
      console.log("Migrated transaction data saved to localStorage");
    }

    return migrated;
  } catch (error) {
    console.error("Error loading/migrating transactions:", error);
    return [];
  }
};

/**
 * Clear all data migration flags (for development/testing)
 */
export const clearMigrationData = (): void => {
  localStorage.removeItem("transactions");
  localStorage.removeItem("incomeSourceConfig");
  console.log("Migration data cleared");
};
