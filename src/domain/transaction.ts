/**
 * Domain logic for Transactions
 */
import { type IncomeSource, calculateIncomeSourceFees } from "./incomeSource";
import type { DonationConfig } from "./donation";

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
  // Normalized: store ID instead of full object, but for now keeping full object to match refactor plan step-by-step
  // The plan said "Update Transaction to store incomeSourceId".
  // But to avoid breaking everything immediately, I might need to keep both or transition.
  // Let's follow the plan: "Update Transaction to store incomeSourceId".
  // However, the UI currently expects the full object.
  // I will add incomeSourceId and keep source (optional) for migration, or just go for the break and fix.
  // The user said "help me spreate the frontend and the logic completely... and i guess the current data structure also need a revamp".
  // I will define the NEW structure here.
  incomeSourceId: string;
  // We might need the full source snapshot for historical accuracy if settings change?
  // Or we just reference the ID. Usually historical financial data should snapshot the rules.
  // The current app snapshots `donationConfig`.
  // I'll add `sourceSnapshot` which is optional, but `incomeSourceId` is required.
  sourceSnapshot?: IncomeSource;

  amountUSD: number;
  conversionRate: number;
  date: string;
  taxRate: number;
  bank: string;
  calculations: TransactionCalculations;
  donationConfigSnapshot?: DonationConfig;
  currency?: "PKR" | "USD";
  amount?: number; // For PKR
  taxConfig?: {
    enabled: boolean;
    type: "percentage" | "fixed";
    value: number;
  };
}

export type NewTransactionEntry = Omit<
  Transaction,
  "id" | "calculations" | "sourceSnapshot"
> & {
  source: IncomeSource; // Passed during creation to generate snapshot/ID
};

export function calculateTransactionValues(
  entry: {
    amountUSD: number;
    conversionRate: number;
    currency?: "PKR" | "USD";
    amount?: number;
    taxRate: number;
    taxConfig?: {
      enabled: boolean;
      type: "percentage" | "fixed";
      value: number;
    };
    source: IncomeSource;
  },
  donationConfig: DonationConfig
): TransactionCalculations {
  const {
    amountUSD,
    conversionRate,
    source,
    taxRate,
    currency,
    amount,
    taxConfig,
  } = entry;

  // Determine the actual amounts based on currency
  let actualAmountUSD: number;
  let actualConversionRate: number;
  let actualGrossPKR: number;

  if (currency === "PKR" && amount) {
    // PKR transaction - amount is already in PKR
    actualGrossPKR = amount;
    actualAmountUSD = 0; // Not applicable
    actualConversionRate = 1; // Marker
  } else {
    // USD transaction (default)
    actualAmountUSD = amountUSD;
    actualConversionRate = conversionRate;

    const feeUSD = calculateIncomeSourceFees(actualAmountUSD, source);
    const amountAfterFeesUSD = actualAmountUSD - feeUSD;
    actualGrossPKR = amountAfterFeesUSD * actualConversionRate;
  }

  const feePKR =
    currency === "PKR"
      ? 0
      : (actualAmountUSD - actualGrossPKR / actualConversionRate) *
        actualConversionRate;
  const grossPKR = actualGrossPKR;

  let charityAmount = 0;
  let taxableAmount = grossPKR;

  if (donationConfig.enabled) {
    if (donationConfig.taxPreference === "before-tax") {
      // Calculate donation from gross amount before tax
      charityAmount = grossPKR * (donationConfig.percentage / 100);
      taxableAmount = grossPKR - charityAmount;
    } else {
      // Calculate donation from net amount after tax
      const tempTaxAmount = grossPKR * (taxRate / 100);
      const tempNetAmount = grossPKR - tempTaxAmount;
      charityAmount = tempNetAmount * (donationConfig.percentage / 100);
      taxableAmount = grossPKR; // Tax is calculated on full gross amount
    }

    // Apply min/max limits if configured
    if (
      donationConfig.minimumAmount &&
      charityAmount < donationConfig.minimumAmount
    ) {
      charityAmount = donationConfig.minimumAmount;
    }
    if (
      donationConfig.maximumAmount &&
      charityAmount > donationConfig.maximumAmount
    ) {
      charityAmount = donationConfig.maximumAmount;
    }
  }

  // Calculate tax amount based on taxConfig if available, otherwise use legacy taxRate
  let taxAmount = 0;
  if (taxConfig?.enabled) {
    if (taxConfig.type === "percentage") {
      taxAmount =
        donationConfig.taxPreference === "before-tax"
          ? taxableAmount * (taxConfig.value / 100)
          : grossPKR * (taxConfig.value / 100);
    } else {
      // Fixed amount in PKR
      taxAmount = taxConfig.value;
    }
  } else if (taxRate > 0) {
    // Legacy behavior - use taxRate as percentage
    taxAmount =
      donationConfig.taxPreference === "before-tax"
        ? taxableAmount * (taxRate / 100)
        : grossPKR * (taxRate / 100);
  }

  const netProfit =
    donationConfig.taxPreference === "before-tax"
      ? taxableAmount - taxAmount
      : grossPKR - taxAmount - charityAmount;

  const partnerShare = netProfit;

  return {
    feePKR,
    grossPKR,
    charityAmount,
    taxAmount,
    netProfit,
    partnerShare,
  };
}
