import { useBusinessInfo } from "../../hooks/useBusinessInfo";
import type { Financials } from "../../hooks/useFinancials";
import type { Transaction, Expense } from "../../types";
import { MobilePersonalWallet } from "./MobilePersonalWallet";
import { MobileCompanyWallet } from "./MobileCompanyWallet";

interface MobileWalletScreenProps {
  financials: Financials;
  transactions: Transaction[];
  expenses: Expense[];
  donationEnabled: boolean;
}

export const MobileWalletScreen = ({
  financials,
  transactions,
  expenses,
  donationEnabled,
}: MobileWalletScreenProps) => {
  const { isPersonalMode } = useBusinessInfo();

  // Route to appropriate wallet based on business mode
  if (isPersonalMode) {
    return (
      <MobilePersonalWallet
        financials={financials}
        transactions={transactions}
        expenses={expenses}
        donationEnabled={donationEnabled}
      />
    );
  }

  return (
    <MobileCompanyWallet
      financials={financials}
      transactions={transactions}
      expenses={expenses}
      donationEnabled={donationEnabled}
    />
  );
};
