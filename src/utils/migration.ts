import type {
  Transaction,
  DonationConfig,
  Expense,
  PartnerName,
} from "../types";

/**
 * Migration utilities for data format handling
 * Note: No legacy migrations needed - project is in development phase
 */

// Default donation config for transactions that don't have one
const DEFAULT_DONATION_CONFIG: DonationConfig = {
  percentage: 10,
  taxPreference: "before-tax",
  enabled: true,
};

/**
 * Check if transaction needs donation config snapshot
 */
export const needsDonationConfigMigration = (
  transaction: Transaction
): boolean => {
  return transaction.donationConfigSnapshot === undefined;
};

/**
 * Add donation config snapshot to transactions that don't have it
 */
export const migrateDonationConfig = (
  transaction: Transaction
): Transaction => {
  if (needsDonationConfigMigration(transaction)) {
    return {
      ...transaction,
      donationConfigSnapshot: DEFAULT_DONATION_CONFIG,
    };
  }
  return transaction;
};

/**
 * Migrate an array of transactions
 */
export const migrateTransactions = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: any[]
): Transaction[] => {
  return transactions.map((tx) => {
    let migrated = tx as Transaction;

    // Add donation config snapshot if missing
    if (needsDonationConfigMigration(migrated)) {
      migrated = migrateDonationConfig(migrated);
      if (import.meta.env.DEV) {
        console.log(
          `Added donation config snapshot to transaction ${migrated.id}`
        );
      }
    }

    return migrated;
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

    // Save back if donation config migration was needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasDonationMigration = parsed.some((tx: any) =>
      needsDonationConfigMigration(tx)
    );

    if (hasDonationMigration) {
      localStorage.setItem("transactions", JSON.stringify(migrated));
      if (import.meta.env.DEV) {
        console.log("Added donation config snapshots to transactions");
      }
    }

    return migrated;
  } catch (error) {
    console.error("Error loading/migrating transactions:", error);
    return [];
  }
};

/**
 * Clear all data (for development/testing)
 */
export const clearMigrationData = (): void => {
  localStorage.removeItem("transactions");
  localStorage.removeItem("incomeSourceConfig");
  if (import.meta.env.DEV) {
    console.log("Data cleared");
  }
};

// Legacy expense interface for backward compatibility
interface LegacyExpense {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: string;
  byWhom: PartnerName;
}

/**
 * Check if expense data needs migration for type field
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const expenseNeedsMigration = (expense: any): boolean => {
  return expense.type === undefined;
};

/**
 * Migrate legacy expense format to include type field
 */
export const migrateLegacyExpense = (legacyExpense: LegacyExpense): Expense => {
  return {
    ...legacyExpense,
    type: "personal" as const, // Default to personal for backward compatibility
    metadata: {},
  };
};

/**
 * Migrate an array of expenses
 */
export const migrateExpenses = (expenses: unknown[]): Expense[] => {
  return expenses.map((ex) => {
    let migrated = ex as Expense;

    if (expenseNeedsMigration(ex)) {
      migrated = migrateLegacyExpense(ex as LegacyExpense);
      console.log(
        `Migrated expense ${(ex as LegacyExpense).id} to include type field`
      );
    }

    return migrated;
  });
};

/**
 * Load and migrate expenses from localStorage
 */
export const loadExpensesWithMigration = (): Expense[] => {
  try {
    const stored = localStorage.getItem("expenses");
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    const migrated = migrateExpenses(parsed);

    // Save back the migrated data if any migration was needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasExpenseMigration = parsed.some((ex: any) =>
      expenseNeedsMigration(ex)
    );

    if (hasExpenseMigration) {
      localStorage.setItem("expenses", JSON.stringify(migrated));
      console.log("Migrated expense data saved to localStorage");
    }

    return migrated;
  } catch (error) {
    console.error("Error loading/migrating expenses:", error);
    return [];
  }
};
