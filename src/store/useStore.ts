import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type Transaction,
  type Expense,
  type DonationPayout,
  type FinancialSummaryRecord,
  type DonationConfig,
  type NewTransactionEntry,
  type NewExpenseEntry,
  type NewDonationPayoutEntry,
  calculateTransactionValues,
  DEFAULT_DONATION_CONFIG,
} from "../domain";

interface AppState {
  transactions: Transaction[];
  expenses: Expense[];
  donationPayouts: DonationPayout[];
  summaries: FinancialSummaryRecord[];
  donationConfig: DonationConfig;

  // Actions
  addTransaction: (entry: NewTransactionEntry) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: number) => void;

  addExpense: (entry: NewExpenseEntry) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: number) => void;

  addDonationPayout: (entry: NewDonationPayoutEntry) => void;
  updateDonationPayout: (payout: DonationPayout) => void;
  deleteDonationPayout: (id: number) => void;

  addSummary: (text: string) => void;
  deleteSummary: (id: number) => void;

  setDonationConfig: (config: DonationConfig) => void;
  updateDonationConfig: (config: Partial<DonationConfig>) => void;

  importData: (data: {
    transactions: Transaction[];
    expenses: Expense[];
    donationPayouts: DonationPayout[];
    summaries: FinancialSummaryRecord[];
    donationConfig?: DonationConfig;
  }) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      transactions: [],
      expenses: [],
      donationPayouts: [],
      summaries: [],
      donationConfig: DEFAULT_DONATION_CONFIG,

      addTransaction: async (entry) => {
        const { donationConfig } = get();
        // Use the domain logic to calculate values
        const calculations = calculateTransactionValues(entry, donationConfig);
        
        // Create the new transaction
        // Note: We are still using the full IncomeSource object in the Transaction for now
        // as per the decision to support the current UI requirements while refactoring.
        // In a future step, we might want to only store the ID and look up the source.
        const newTransaction: Transaction = {
          id: Date.now(),
          ...entry,
          incomeSourceId: entry.source.id,
          sourceSnapshot: entry.source, // Snapshot for history
          calculations,
          donationConfigSnapshot: { ...donationConfig },
        };

        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },

      updateTransaction: async (updatedTx) => {
        const { donationConfig } = get();
        // Use original config if available, else current
        const configToUse = updatedTx.donationConfigSnapshot || donationConfig;
        
        // Recalculate values
        // We need to reconstruct the entry object expected by calculateTransactionValues
        // This assumes updatedTx has all the necessary fields (which it should)
        // If sourceSnapshot is missing, we might have an issue, but it should be there for new txs.
        // For old txs, we might need to rely on the 'source' field if it exists (legacy).
        // The domain Transaction type has 'sourceSnapshot'.
        // The legacy type had 'source'.
        // We need to handle this carefully.
        
        // Helper to get source
        const source = updatedTx.sourceSnapshot || (updatedTx as any).source;
        
        if (!source) {
            console.error("Transaction missing source", updatedTx);
            return;
        }

        const calculations = calculateTransactionValues(
            {
                amountUSD: updatedTx.amountUSD,
                conversionRate: updatedTx.conversionRate,
                currency: updatedTx.currency,
                amount: updatedTx.amount,
                taxRate: updatedTx.taxRate,
                taxConfig: updatedTx.taxConfig,
                source: source,
            },
            configToUse
        );

        const finalTx = {
            ...updatedTx,
            calculations,
            // Ensure snapshot exists
            donationConfigSnapshot: updatedTx.donationConfigSnapshot || { ...donationConfig }
        };

        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === updatedTx.id ? finalTx : tx
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        }));
      },

      addExpense: (entry) => {
        set((state) => ({
          expenses: [{ id: Date.now(), ...entry }, ...state.expenses],
        }));
      },

      updateExpense: (expense) => {
        set((state) => ({
          expenses: state.expenses.map((ex) =>
            ex.id === expense.id ? expense : ex
          ),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((ex) => ex.id !== id),
        }));
      },

      addDonationPayout: (entry) => {
        set((state) => ({
          donationPayouts: [{ id: Date.now(), ...entry }, ...state.donationPayouts],
        }));
      },

      updateDonationPayout: (payout) => {
        set((state) => ({
          donationPayouts: state.donationPayouts.map((dp) =>
            dp.id === payout.id ? payout : dp
          ),
        }));
      },

      deleteDonationPayout: (id) => {
        set((state) => ({
          donationPayouts: state.donationPayouts.filter((dp) => dp.id !== id),
        }));
      },

      addSummary: (text) => {
        set((state) => ({
          summaries: [
            { id: Date.now(), text, createdAt: new Date().toISOString() },
            ...state.summaries,
          ],
        }));
      },

      deleteSummary: (id) => {
        set((state) => ({
          summaries: state.summaries.filter((s) => s.id !== id),
        }));
      },

      setDonationConfig: (config) => {
        set({ donationConfig: config });
      },

      updateDonationConfig: (configUpdate) => {
        set((state) => ({
          donationConfig: { ...state.donationConfig, ...configUpdate },
        }));
      },

      importData: (data) => {
        set((state) => ({
          transactions: data.transactions || [],
          expenses: data.expenses || [],
          donationPayouts: data.donationPayouts || [],
          summaries: data.summaries || [],
          donationConfig: data.donationConfig
            ? { ...DEFAULT_DONATION_CONFIG, ...data.donationConfig }
            : state.donationConfig,
        }));
      },
    }),
    {
      name: "partnerx-storage", // unique name
      storage: createJSONStorage(() => localStorage),
      // Migration logic
      version: 1,
      migrate: (persistedState: any, version) => {
        if (version === 0) {
            // Handle migration from version 0 (implicit) to 1
            // This is where we can put the logic from src/utils/migration.ts
            // But since we are switching storage keys (from individual keys to 'partnerx-storage'),
            // the persist middleware won't find the old data automatically!
            // We need to manually load the old data if 'partnerx-storage' is empty.
            // However, 'migrate' is only called if 'partnerx-storage' exists.
            
            // So we need a separate initialization step to check for legacy data.
            // I will handle this in a separate 'initializeStore' function or just let the user import data.
            // But for a seamless transition, we should try to load legacy data.
            return persistedState;
        }
        return persistedState;
      },
    }
  )
);
