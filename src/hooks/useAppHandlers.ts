import { useState } from "react";
import type {
  Transaction,
  Expense,
  DonationPayout,
  FinancialSummaryRecord,
  NewTransactionEntry,
  NewExpenseEntry,
  NewDonationPayoutEntry,
  TransactionCalculations,
  AppHandlers,
} from "../types";
import { incomeSourceService } from "../services/incomeSourceService";
import { loadTransactionsWithMigration } from "../utils/migration";

type EditableEntry = Transaction | Expense | DonationPayout;
type ModalType = "transaction" | "expense" | "donation" | null;

export function useAppHandlers(): AppHandlers {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadTransactionsWithMigration()
  );
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    JSON.parse(localStorage.getItem("expenses") || "[]")
  );
  const [donationPayouts, setDonationPayouts] = useState<DonationPayout[]>(() =>
    JSON.parse(localStorage.getItem("donationPayouts") || "[]")
  );
  const [summaries, setSummaries] = useState<FinancialSummaryRecord[]>(() =>
    JSON.parse(localStorage.getItem("summaries") || "[]")
  );
  const [activeTab, setActiveTab] = useState<"income" | "expense" | "donation">(
    "income"
  );
  const [editingEntry, setEditingEntry] = useState<EditableEntry | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);

  const handleImport = (data: {
    transactions: Transaction[];
    expenses: Expense[];
    donationPayouts: DonationPayout[];
    summaries: FinancialSummaryRecord[];
  }) => {
    setTransactions(data.transactions || []);
    setExpenses(data.expenses || []);
    setDonationPayouts(data.donationPayouts || []);
    setSummaries(data.summaries || []);
  };

  const recalculateTransaction = async (
    entry: NewTransactionEntry | Transaction
  ): Promise<TransactionCalculations> => {
    const { amountUSD, conversionRate, sourceId, taxRate } = entry;

    // Get the income source to determine fees
    let feeUSD = 0;
    try {
      const source = await incomeSourceService.getSource(sourceId);
      if (source?.metadata?.fees) {
        const fees = source.metadata.fees;
        if (fees.method === "fixed") {
          feeUSD = fees.fixedFeeUSD || 0;
        } else if (fees.method === "percentage") {
          feeUSD = amountUSD * ((fees.percentageFee || 0) / 100);
        } else if (fees.method === "hybrid") {
          feeUSD =
            (fees.fixedFeeUSD || 0) +
            amountUSD * ((fees.percentageFee || 0) / 100);
        }
      }
    } catch (error) {
      console.warn(
        `Failed to get fee information for source ${sourceId}:`,
        error
      );
      // Fall back to legacy behavior for backward compatibility
      feeUSD = sourceId === "tiktok" ? 5.0 : 0;
    }

    const feePKR = feeUSD * conversionRate;
    const amountAfterFeesUSD = amountUSD - feeUSD;
    const grossPKR = amountAfterFeesUSD * conversionRate;
    const charityAmount = grossPKR * 0.1;
    const taxableAmount = grossPKR - charityAmount;
    const taxAmount = taxableAmount * (taxRate / 100);
    const netProfit = taxableAmount - taxAmount;
    const partnerShare = netProfit;
    return {
      feePKR,
      grossPKR,
      charityAmount,
      taxAmount,
      netProfit,
      partnerShare,
    };
  };

  const handleAddTransaction = async (entry: NewTransactionEntry) => {
    const calculations = await recalculateTransaction(entry);
    const newTransaction: Transaction = {
      id: Date.now(),
      ...entry,
      calculations,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };
  const handleAddExpense = (entry: NewExpenseEntry) =>
    setExpenses((prev) => [{ id: Date.now(), ...entry }, ...prev]);
  const handleAddDonationPayout = (entry: NewDonationPayoutEntry) =>
    setDonationPayouts((prev) => [{ id: Date.now(), ...entry }, ...prev]);
  const handleAddSummary = (text: string) => {
    const newSummary: FinancialSummaryRecord = {
      id: Date.now(),
      text,
      createdAt: new Date().toISOString(),
    };
    setSummaries((prev) => [newSummary, ...prev]);
  };

  const handleUpdateTransaction = async (updatedTx: Transaction) => {
    updatedTx.calculations = await recalculateTransaction(updatedTx);
    setTransactions(
      transactions.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx))
    );
    setEditingEntry(null);
  };
  const handleUpdateExpense = (updatedEx: Expense) => {
    setExpenses(
      expenses.map((ex) => (ex.id === updatedEx.id ? updatedEx : ex))
    );
    setEditingEntry(null);
  };
  const handleUpdateDonationPayout = (updatedDp: DonationPayout) => {
    setDonationPayouts(
      donationPayouts.map((dp) => (dp.id === updatedDp.id ? updatedDp : dp))
    );
    setEditingEntry(null);
  };
  const handleDeleteTransaction = (id: number) => {
    if (window.confirm("Are you sure you want to delete this income entry?"))
      setTransactions(transactions.filter((tx) => tx.id !== id));
  };
  const handleDeleteExpense = (id: number) => {
    if (window.confirm("Are you sure you want to delete this expense?"))
      setExpenses(expenses.filter((ex) => ex.id !== id));
  };
  const handleDeleteDonationPayout = (id: number) => {
    if (window.confirm("Are you sure you want to delete this donation payout?"))
      setDonationPayouts(donationPayouts.filter((dp) => dp.id !== id));
  };
  const handleDeleteSummary = (id: number) => {
    if (window.confirm("Are you sure you want to delete this AI summary?")) {
      setSummaries((prev) => prev.filter((summary) => summary.id !== id));
    }
  };
  const openEditModal = (
    entry: EditableEntry,
    type: "transaction" | "expense" | "donation"
  ) => {
    setEditingEntry(entry);
    setModalType(type);
  };

  return {
    transactions,
    setTransactions,
    expenses,
    setExpenses,
    donationPayouts,
    setDonationPayouts,
    summaries,
    setSummaries,
    activeTab,
    setActiveTab,
    editingEntry,
    setEditingEntry,
    modalType,
    setModalType,
    handleImport,
    handleAddTransaction,
    handleAddExpense,
    handleAddDonationPayout,
    handleAddSummary,
    handleUpdateTransaction,
    handleUpdateExpense,
    handleUpdateDonationPayout,
    handleDeleteTransaction,
    handleDeleteExpense,
    handleDeleteDonationPayout,
    handleDeleteSummary,
    openEditModal,
  };
}
