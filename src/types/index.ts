import type { Dispatch, SetStateAction } from "react";

// Legacy type - to be phased out
export type PartnerName = "Bukhtyar" | "Asjad";

// New dynamic partner types
export type {
  Partner,
  PartnerConfig,
  PartnerRecord,
  PartnerEarnings,
  PartnerExpenses,
} from "./partner";

// Income source types
export type {
  IncomeSource,
  IncomeSourceConfig,
  IncomeSourceMetadata,
  IncomeSourceService,
  IncomeSourceValidation,
  UseIncomeSourcesResult,
} from "./incomeSource";

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
  sourceId: string; // Changed from hardcoded union to dynamic string
  amountUSD: number;
  conversionRate: number;
  date: string;
  taxRate: number;
  bank: string;
  calculations: TransactionCalculations;
  donationConfigSnapshot?: DonationConfig; // Store the donation config used for this transaction
  currency?: "PKR" | "USD"; // Currency of the transaction (default: USD for backward compatibility)
  amount?: number; // Amount in the specified currency (for PKR transactions)
  taxConfig?: {
    enabled: boolean;
    type: "percentage" | "fixed";
    value: number;
  };
}

export type NewTransactionEntry = Omit<Transaction, "id" | "calculations">;

export type ExpenseType = "personal" | "company";

export interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: string;
  byWhom: PartnerName;
  type: ExpenseType;
  metadata?: {
    notes?: string;
    companyCategory?: string; // e.g., salary, dinner, rent, etc.
  };
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

export interface DonationConfig {
  percentage: number;
  taxPreference: "before-tax" | "after-tax";
  enabled: boolean;
  minimumAmount?: number;
  maximumAmount?: number;
}

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
  donationConfig: DonationConfig;
  setDonationConfig: Dispatch<SetStateAction<DonationConfig>>;
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
    donationConfig?: DonationConfig;
  }) => void;
  handleAddTransaction: (entry: NewTransactionEntry) => Promise<void>;
  handleAddExpense: (entry: NewExpenseEntry) => void;
  handleAddDonationPayout: (entry: NewDonationPayoutEntry) => void;
  handleAddSummary: (text: string) => void;
  handleUpdateTransaction: (updatedTx: Transaction) => Promise<void>;
  handleUpdateExpense: (updatedEx: Expense) => void;
  handleUpdateDonationPayout: (updatedDp: DonationPayout) => void;
  handleDeleteTransaction: (id: number) => void;
  handleDeleteExpense: (id: number) => void;
  handleDeleteDonationPayout: (id: number) => void;
  handleDeleteSummary: (id: number) => void;
  handleUpdateDonationConfig: (config: Partial<DonationConfig>) => void;
  openEditModal: (
    entry: Transaction | Expense | DonationPayout,
    type: "transaction" | "expense" | "donation"
  ) => void;
}
