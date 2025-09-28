import type {
  Transaction,
  Expense,
  DonationPayout,
  NewTransactionEntry,
  NewExpenseEntry,
  NewDonationPayoutEntry,
  TransactionCalculations,
} from "../types";
import { useState } from "react";

type EditableEntry = Transaction | Expense | DonationPayout;

type ModalType = "transaction" | "expense" | "donation" | null;

export function useAppHandlers() {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    JSON.parse(localStorage.getItem("transactions") || "[]")
  );
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    JSON.parse(localStorage.getItem("expenses") || "[]")
  );
  const [donationPayouts, setDonationPayouts] = useState<DonationPayout[]>(() =>
    JSON.parse(localStorage.getItem("donationPayouts") || "[]")
  );
  const [activeTab, setActiveTab] = useState<"income" | "expense" | "donation">(
    "income"
  );
  const [editingEntry, setEditingEntry] = useState<EditableEntry | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);

  const handleImportData = (data: {
    transactions: Transaction[];
    expenses: Expense[];
    donationPayouts: DonationPayout[];
  }) => {
    setTransactions(data.transactions);
    setExpenses(data.expenses);
    setDonationPayouts(data.donationPayouts);
  };

  const recalculateTransaction = (
    entry: NewTransactionEntry | Transaction
  ): TransactionCalculations => {
    const { amountUSD, conversionRate, source, taxRate } = entry;
    const feeUSD = source === "tiktok" ? 5.0 : 0;
    const feePKR = feeUSD * conversionRate;
    const amountAfterFeesUSD = amountUSD - feeUSD;
    const grossPKR = amountAfterFeesUSD * conversionRate;
    const charityAmount = grossPKR * 0.1;
    const taxableAmount = grossPKR - charityAmount;
    const taxAmount = taxableAmount * (taxRate / 100);
    const netProfit = taxableAmount - taxAmount;
    const partnerShare = netProfit / 2;
    return {
      feePKR,
      grossPKR,
      charityAmount,
      taxAmount,
      netProfit,
      partnerShare,
    };
  };

  const handleAddTransaction = (entry: NewTransactionEntry) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      ...entry,
      calculations: recalculateTransaction(entry),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };
  const handleAddExpense = (entry: NewExpenseEntry) =>
    setExpenses((prev) => [{ id: Date.now(), ...entry }, ...prev]);
  const handleAddDonationPayout = (entry: NewDonationPayoutEntry) =>
    setDonationPayouts((prev) => [{ id: Date.now(), ...entry }, ...prev]);

  const handleUpdateTransaction = (updatedTx: Transaction) => {
    updatedTx.calculations = recalculateTransaction(updatedTx);
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
    activeTab,
    setActiveTab,
    editingEntry,
    setEditingEntry,
    modalType,
    setModalType,
    handleImportData,
    handleAddTransaction,
    handleAddExpense,
    handleAddDonationPayout,
    handleUpdateTransaction,
    handleUpdateExpense,
    handleUpdateDonationPayout,
    handleDeleteTransaction,
    handleDeleteExpense,
    handleDeleteDonationPayout,
    openEditModal,
  };
}
