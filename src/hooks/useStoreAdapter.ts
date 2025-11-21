import { useStore } from "../store";
import { migrateLegacyData } from "../store/migration";
import { useEffect, useState } from "react";
import { useToast } from "./useToast";
import type { AppHandlers, Transaction, Expense, DonationPayout } from "../types";

export function useStoreAdapter(): AppHandlers {
  const store = useStore();
  const { showToast } = useToast();
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
        showToast("Donation settings updated", "donation");
    },
    
    activeTab,
    setActiveTab,
    editingEntry,
    setEditingEntry,
    modalType,
    setModalType,
    
    handleImport: (data) => {
        store.importData(data as any);
        showToast("Data imported successfully", "income");
    },
    handleAddTransaction: async (entry) => {
        await store.addTransaction(entry as any);
        showToast("Transaction added", "income");
    },
    handleAddExpense: (entry) => {
        store.addExpense(entry as any);
        showToast("Expense added", "expense");
    },
    handleAddDonationPayout: (entry) => {
        store.addDonationPayout(entry as any);
        showToast("Donation payout recorded", "donation");
    },
    handleAddSummary: (text) => {
        store.addSummary(text);
        showToast("Summary note added", "income");
    },
    
    handleUpdateTransaction: async (tx) => {
        await store.updateTransaction(tx as any);
        setEditingEntry(null);
        showToast("Transaction updated", "income");
    },
    handleUpdateExpense: (ex) => {
        store.updateExpense(ex as any);
        setEditingEntry(null);
        showToast("Expense updated", "expense");
    },
    handleUpdateDonationPayout: (dp) => {
        store.updateDonationPayout(dp as any);
        setEditingEntry(null);
        showToast("Donation payout updated", "donation");
    },
    
    handleDeleteTransaction: (id) => {
        store.deleteTransaction(id);
        showToast("Transaction deleted", "income");
    },
    handleDeleteExpense: (id) => {
        store.deleteExpense(id);
        showToast("Expense deleted", "expense");
    },
    handleDeleteDonationPayout: (id) => {
        store.deleteDonationPayout(id);
        showToast("Donation payout deleted", "donation");
    },
    handleDeleteSummary: (id) => {
        store.deleteSummary(id);
        showToast("Summary note deleted", "income");
    },
    
    handleUpdateDonationConfig: (config) => {
        store.updateDonationConfig(config);
        showToast("Donation settings updated", "donation");
    },
    
    openEditModal,
  };
}
