import type { AppHandlers } from "../types";
import type { useFinancials } from "../hooks/useFinancials";
import type {
  useSortedTransactions,
  useSortedExpenses,
  useSortedDonations,
} from "../hooks/useSortedData";

import { EditModal } from "../components/EditModal";
import { DesktopLayout } from "./DesktopLayout";
import { MobileLayout } from "./MobileLayout";

interface DashboardPageProps {
  appState: AppHandlers;
  financials: ReturnType<typeof useFinancials>;
  currentCapital: number;
  currentDonationsFund: number;
  sortedTransactions: ReturnType<typeof useSortedTransactions>;
  sortedExpenses: ReturnType<typeof useSortedExpenses>;
  sortedDonations: ReturnType<typeof useSortedDonations>;
}

export default function DashboardPage({
  appState,
  financials,
  currentCapital,
  currentDonationsFund,
  sortedTransactions,
  sortedExpenses,
  sortedDonations,
}: DashboardPageProps) {
  return (
    <>
      <DesktopLayout
        appState={appState}
        financials={financials}
        currentCapital={currentCapital}
        currentDonationsFund={currentDonationsFund}
        sortedTransactions={sortedTransactions}
        sortedExpenses={sortedExpenses}
        sortedDonations={sortedDonations}
      />

      <MobileLayout
        appState={appState}
        financials={financials}
        currentCapital={currentCapital}
        currentDonationsFund={currentDonationsFund}
        sortedTransactions={sortedTransactions}
        sortedExpenses={sortedExpenses}
        sortedDonations={sortedDonations}
      />

      <EditModal
        isOpen={!!appState.editingEntry}
        onClose={() => appState.setEditingEntry(null)}
        entry={appState.editingEntry}
        type={appState.modalType}
        onUpdateTransaction={appState.handleUpdateTransaction}
        onUpdateExpense={appState.handleUpdateExpense}
        onUpdateDonationPayout={appState.handleUpdateDonationPayout}
        availableDonationFunds={financials.availableDonationsFund}
      />
    </>
  );
}
