/**
 * Domain logic for Expenses
 */
// import type { PartnerName } from "../types"; // Removed unused import

// Redefining PartnerName here to avoid circular dependency if we import from types
// Ideally this should come from partner.ts but partner.ts has dynamic partners now.
// The legacy PartnerName was "Bukhtyar" | "Asjad".
// We should probably use string for byWhom to support dynamic partners.

export type ExpenseType = "personal" | "company";

export interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: string;
  byWhom: string; // Changed from PartnerName to string to support dynamic partners
  type: ExpenseType;
  metadata?: {
    notes?: string;
    companyCategory?: string; // e.g., salary, dinner, rent, etc.
  };
}

export type NewExpenseEntry = Omit<Expense, "id">;
