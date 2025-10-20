/**
 * Centralized wallet calculation utilities
 * Ensures consistency across dashboard and mobile wallet screens
 */

import type { Financials } from "../hooks/useFinancials";

/**
 * Calculate the available balance for personal mode
 * This represents the actual spendable amount after all deductions
 *
 * Formula: Net Profit (already gross - expenses) - Donation Payouts
 * Note: totalNetProfit already accounts for expenses, so we don't subtract them again
 *
 * @param financials - The financial data from useFinancials hook
 * @param donationPayouts - Total amount of donations already paid out
 * @returns The available personal balance
 */
export const calculatePersonalBalance = (
  financials: Financials,
  donationPayouts: number = 0
): number => {
  // totalNetProfit = totalGrossProfit - totalExpenses (calculated in useFinancials)
  // Available balance = Net Profit - donations paid out
  return financials.totalNetProfit - donationPayouts;
};

/**
 * Calculate the company capital (same as what's shown in Stats component)
 * This is already calculated in useFinancials as companyCapital
 *
 * @param financials - The financial data from useFinancials hook
 * @returns The company capital
 */
export const calculateCompanyCapital = (financials: Financials): number => {
  return financials.companyCapital;
};

/**
 * Calculate net balance for a specific partner
 *
 * @param earnings - Partner's total earnings
 * @param expenses - Partner's total expenses
 * @returns Net balance for the partner
 */
export const calculatePartnerBalance = (
  earnings: number,
  expenses: number
): number => {
  return earnings - expenses;
};

/**
 * Get wallet stats that match the dashboard Stats component
 * This ensures consistency between mobile wallet and dashboard
 *
 * @param financials - The financial data from useFinancials hook
 * @param currentCapital - Optional override for current capital (unfiltered)
 * @param currentDonationsFund - Optional override for current donations fund (unfiltered)
 * @returns An object containing all wallet stats
 */
export const getWalletStats = (
  financials: Financials,
  currentCapital?: number,
  currentDonationsFund?: number
) => {
  return {
    // Income/Revenue
    totalIncome: financials.totalGrossProfit,

    // Expenses
    totalExpenses: financials.totalExpenses,

    // Net (already calculated: grossProfit - expenses)
    netAmount: financials.totalNetProfit,

    // Available balance/capital
    // Use override if provided (for unfiltered current state), otherwise use filtered
    // For personal mode: use companyCapital (which already accounts for donation payouts)
    // For company mode: use companyCapital
    availableBalance: currentCapital ?? financials.companyCapital,

    // Donations fund
    // Use override if provided (for unfiltered current state), otherwise use filtered
    donationsFund: currentDonationsFund ?? financials.availableDonationsFund,
  };
};

/**
 * Format wallet summary for display
 * Returns formatted strings for each metric
 */
export const getWalletSummary = (
  financials: Financials,
  isPersonalMode: boolean
) => {
  const stats = getWalletStats(financials);

  return {
    income: {
      label: isPersonalMode ? "Total Income" : "Gross Profit",
      value: stats.totalIncome,
      subtitle: isPersonalMode ? "All earnings" : "Total revenue",
    },
    expenses: {
      label: isPersonalMode ? "Total Spending" : "Total Expenses",
      value: stats.totalExpenses,
      subtitle: isPersonalMode ? "All expenses" : "Operational costs",
    },
    net: {
      label: isPersonalMode ? "Net Savings" : "Net Earnings",
      value: stats.netAmount,
      subtitle: isPersonalMode ? "Income - Spending" : "After expenses",
    },
    balance: {
      label: isPersonalMode ? "My Balance" : "Current Capital",
      value: stats.availableBalance,
      subtitle: isPersonalMode ? "Available to me" : "Available funds",
    },
    donations: {
      label: isPersonalMode ? "Charity Fund" : "Donations Fund",
      value: stats.donationsFund,
      subtitle: isPersonalMode ? "For charity" : "For donations",
    },
  };
};
