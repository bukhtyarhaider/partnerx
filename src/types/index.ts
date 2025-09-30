import type { Dispatch, SetStateAction } from "react";

export type PartnerName = "Bukhtyar" | "Asjad";

export interface TransactionCalculations {
  feePKR: number;
  grossPKR: number;
  charityAmount: number;
  taxAmount: number;
  netProfit: number;
  partnerShare: number;
}

export interface Transaction {
  id: number;
  source: "youtube" | "tiktok";
  amountUSD: number;
  conversionRate: number;
  date: string;
  taxRate: number;
  bank: string;
  calculations: TransactionCalculations;
}

export type NewTransactionEntry = Omit<Transaction, "id" | "calculations">;

export interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: string;
  byWhom: PartnerName;
}

export type NewExpenseEntry = Omit<Expense, "id">;

export interface DonationPayout {
  id: number;
  amount: number;
  date: string;
  paidTo: string;
  description: string;
}

export type NewDonationPayoutEntry = Omit<DonationPayout, "id">;

export interface FinancialSummaryRecord {
  id: number;
  text: string;
  createdAt: string;
}

export interface AppHandlers {
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  expenses: Expense[];
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
  donationPayouts: DonationPayout[];
  setDonationPayouts: Dispatch<SetStateAction<DonationPayout[]>>;
  summaries: FinancialSummaryRecord[];
  setSummaries: Dispatch<SetStateAction<FinancialSummaryRecord[]>>;
  activeTab: "income" | "expense" | "donation";
  setActiveTab: Dispatch<SetStateAction<"income" | "expense" | "donation">>;
  editingEntry: Transaction | Expense | DonationPayout | null;
  setEditingEntry: Dispatch<
    SetStateAction<Transaction | Expense | DonationPayout | null>
  >;
  modalType: "transaction" | "expense" | "donation" | null;
  setModalType: Dispatch<
    SetStateAction<"transaction" | "expense" | "donation" | null>
  >;
  handleImport: (data: {
    transactions: Transaction[];
    expenses: Expense[];
    donationPayouts: DonationPayout[];
    summaries: FinancialSummaryRecord[];
  }) => void;
  handleAddTransaction: (entry: NewTransactionEntry) => void;
  handleAddExpense: (entry: NewExpenseEntry) => void;
  handleAddDonationPayout: (entry: NewDonationPayoutEntry) => void;
  handleAddSummary: (text: string) => void;
  handleUpdateTransaction: (updatedTx: Transaction) => void;
  handleUpdateExpense: (updatedEx: Expense) => void;
  handleUpdateDonationPayout: (updatedDp: DonationPayout) => void;
  handleDeleteTransaction: (id: number) => void;
  handleDeleteExpense: (id: number) => void;
  handleDeleteDonationPayout: (id: number) => void;
  handleDeleteSummary: (id: number) => void;
  openEditModal: (
    entry: Transaction | Expense | DonationPayout,
    type: "transaction" | "expense" | "donation"
  ) => void;
}
