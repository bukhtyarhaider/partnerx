/**
 * Domain logic for Financial Summaries
 */
import type { Transaction } from "./transaction";
import type { Expense } from "./expense";
import type { DonationPayout } from "./donation";
import { type Partner, type PartnerRecord, type PartnerConfig, calculatePartnerShares } from "./partner";

export interface FinancialSummaryRecord {
  id: number;
  text: string;
  createdAt: string;
}

export interface Financials {
  totalGrossProfit: number;
  totalNetProfit: number;
  totalExpenses: number;
  companyCapital: number;
  availableDonationsFund: number;
  loan: { amount: number; owedBy: string | null };
  deficitPartners: Array<{ partnerId: string; amount: number }>;
  partnerEarnings: PartnerRecord<number>;
  partnerExpenses: PartnerRecord<number>;
}

export function calculateFinancials(
  transactions: Transaction[],
  expenses: Expense[],
  donationPayouts: DonationPayout[],
  activePartners: Partner[],
  partnerConfig: PartnerConfig
): Financials {
  let totalDonationsAccrued = 0;
  let totalGrossProfit = 0;
  let totalNetProfit = 0;

  // Initialize partner earnings for all active partners
  const partnerEarnings: PartnerRecord<number> = {};
  activePartners.forEach((partner) => {
    partnerEarnings[partner.id] = 0;
  });

  for (const tx of transactions) {
    totalGrossProfit += tx.calculations.grossPKR;
    totalNetProfit += tx.calculations.netProfit;
    totalDonationsAccrued += tx.calculations.charityAmount;

    // Distribute partner share based on equity percentages
    const shares = calculatePartnerShares(tx.calculations.partnerShare, partnerConfig);
    Object.entries(shares).forEach(([partnerId, share]) => {
      partnerEarnings[partnerId] = (partnerEarnings[partnerId] || 0) + share;
    });
  }

  const totalDonationsPaidOut = donationPayouts.reduce(
    (sum, payout) => sum + payout.amount,
    0
  );
  const availableDonationsFund =
    totalDonationsAccrued - totalDonationsPaidOut;

  let totalPersonalExpenses = 0;
  let totalCompanyExpenses = 0;

  // Initialize partner expenses for all active partners
  const partnerExpenses: PartnerRecord<number> = {};
  activePartners.forEach((partner) => {
    partnerExpenses[partner.id] = 0;
  });

  for (const ex of expenses) {
    // Find partner by name for backward compatibility
    // In domain layer we should ideally use IDs, but data might still have names
    const partner = activePartners.find((p) => p.name === ex.byWhom || p.displayName === ex.byWhom);
    
    if (partner) {
      // Handle different expense types
      const expenseType = ex.type || "personal"; // Default to personal for backward compatibility

      if (expenseType === "personal") {
        // Personal expenses: deduct from the partner who spent it
        totalPersonalExpenses += ex.amount;
        partnerExpenses[partner.id] =
          (partnerExpenses[partner.id] || 0) + ex.amount;
      } else if (expenseType === "company") {
        // Company expenses: split according to equity among ALL partners
        totalCompanyExpenses += ex.amount;
        const shares = calculatePartnerShares(ex.amount, partnerConfig);

        // Charge each partner their equity share
        Object.entries(shares).forEach(([partnerId, share]) => {
          partnerExpenses[partnerId] =
            (partnerExpenses[partnerId] || 0) + share;
        });
      }
    }
  }

  const totalExpenses = totalPersonalExpenses + totalCompanyExpenses;

  // Calculate loan based on actual deficit (when a partner spends more than they earned)
  // Track all partners with deficits (negative balance)
  let loan = { amount: 0, owedBy: null as string | null };
  const deficitPartners: Array<{ partnerId: string; amount: number }> = [];
  let companyCapital = 0; // Sum of all partner wallets

  // Calculate total capital as sum of all partner wallets
  Object.keys(partnerEarnings).forEach((partnerId) => {
    const earnings = partnerEarnings[partnerId] || 0;
    const expenses = partnerExpenses[partnerId] || 0;
    const balance = earnings - expenses;

    // Add each partner's balance to company capital (sum of all wallets)
    companyCapital += balance;

    if (balance < 0) {
      deficitPartners.push({
        partnerId,
        amount: Math.abs(balance),
      });
    }
  });

  // Subtract actual donation payouts from total capital
  companyCapital -= totalDonationsPaidOut;

  // For backward compatibility, set the largest deficit in the loan object
  if (deficitPartners.length > 0) {
    const maxDeficitPartner = deficitPartners.reduce((max, current) =>
      current.amount > max.amount ? current : max
    );
    loan = {
      amount: maxDeficitPartner.amount,
      owedBy: maxDeficitPartner.partnerId,
    };
  }

  return {
    totalGrossProfit,
    totalNetProfit,
    totalExpenses,
    companyCapital,
    partnerEarnings,
    partnerExpenses,
    loan,
    deficitPartners,
    availableDonationsFund,
  };
}
