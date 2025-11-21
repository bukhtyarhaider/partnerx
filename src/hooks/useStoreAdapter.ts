import { useStore } from "../store";
import { migrateLegacyData } from "../store/migration";
import { useEffect, useState } from "react";
import type { AppHandlers, Transaction, Expense, DonationPayout } from "../types";

export function useStoreAdapter(): AppHandlers {
  const store = useStore();
  const [activeTab, setActiveTab] = useState<"income" | "expense" | "donation">("income");
  const [editingEntry, setEditingEntry] = useState<Transaction | Expense | DonationPayout | null>(null);
  const [modalType, setModalType] = useState<"transaction" | "expense" | "donation" | null>(null);

  // Trigger migration on mount
  useEffect(() => {
    migrateLegacyData();
  }, []);

  const openEditModal = (
    entry: Transaction | Expense | DonationPayout,
    type: "transaction" | "expense" | "donation"
  ) => {
    setEditingEntry(entry);
    setModalType(type);
  };

  // Adapter to match AppHandlers interface
  return {
    transactions: store.transactions.map(tx => ({
        ...tx,
        source: tx.sourceSnapshot || (tx as any).source // Fallback for legacy or missing snapshot
    })) as unknown as Transaction[],
    setTransactions: () => { console.warn("setTransactions is deprecated in favor of store actions"); },
    expenses: store.expenses as unknown as Expense[],
    setExpenses: () => { console.warn("setExpenses is deprecated"); },
    donationPayouts: store.donationPayouts as unknown as DonationPayout[],
    setDonationPayouts: () => { console.warn("setDonationPayouts is deprecated"); },
    summaries: store.summaries,
    setSummaries: () => { console.warn("setSummaries is deprecated"); },
    donationConfig: store.donationConfig,
    setDonationConfig: (action) => {
        if (typeof action === 'function') {
            store.setDonationConfig(action(store.donationConfig));
        } else {
            store.setDonationConfig(action);
        }
    },
    
    activeTab,
    setActiveTab,
    editingEntry,
    setEditingEntry,
    modalType,
    setModalType,
    
    handleImport: store.importData as any,
    handleAddTransaction: store.addTransaction as any,
    handleAddExpense: store.addExpense as any,
    handleAddDonationPayout: store.addDonationPayout as any,
    handleAddSummary: store.addSummary,
    
    handleUpdateTransaction: async (tx) => {
        await store.updateTransaction(tx as any);
        setEditingEntry(null);
    },
    handleUpdateExpense: (ex) => {
        store.updateExpense(ex as any);
        setEditingEntry(null);
    },
    handleUpdateDonationPayout: (dp) => {
        store.updateDonationPayout(dp as any);
        setEditingEntry(null);
    },
    
    handleDeleteTransaction: store.deleteTransaction,
    handleDeleteExpense: store.deleteExpense,
    handleDeleteDonationPayout: store.deleteDonationPayout,
    handleDeleteSummary: store.deleteSummary,
    
    handleUpdateDonationConfig: store.updateDonationConfig,
    
    openEditModal,
  };
}
