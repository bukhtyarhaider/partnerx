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
