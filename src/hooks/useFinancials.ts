import { useMemo } from "react";
import type {
  Transaction,
  Expense,
  DonationPayout,
} from "../types";
import { usePartners } from "./usePartners";
import { calculateFinancials, type Financials } from "../domain/financials";
// We need to cast types because domain types might be slightly different from legacy types
// or we assume they are compatible.
// The domain types are imported from "../domain/financials" which imports from "../domain/..."
// The legacy types are from "../types".
// Ideally we should switch everything to use domain types.
// For now, we will cast.

export type { Financials };

export function useFinancials(
  transactions: Transaction[],
  expenses: Expense[],
  donationPayouts: DonationPayout[]
): Financials {
  const { activePartners, config } = usePartners();

  return useMemo(() => {
    // Convert legacy types to domain types if needed, or just cast if they are compatible.
    // They should be compatible as we designed them to be.
    // However, domain Partner has 'isActive' while legacy might differ?
    // Let's check types/partner.ts vs domain/partner.ts.
    // They seem identical.
    
    return calculateFinancials(
      transactions as any, 
      expenses as any, 
      donationPayouts as any, 
      activePartners as any, 
      config as any
    );
  }, [
    transactions,
    expenses,
    donationPayouts,
    activePartners,
    config,
  ]);
}

