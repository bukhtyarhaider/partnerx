import { useAppHandlers } from "../hooks/useAppHandlers";
import { useFinancials } from "../hooks/useFinancials";
import { useLocalStorageSync } from "../hooks/useLocalStorageSync";
import {
  useSortedTransactions,
  useSortedExpenses,
  useSortedDonations,
} from "../hooks/useSortedData";

import { EditModal } from "../components/EditModal";
import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";

export default function DashboardPage() {
  const appState = useAppHandlers();
  const financials = useFinancials(
    appState.transactions,
    appState.expenses,
    appState.donationPayouts
  );
  const sortedTransactions = useSortedTransactions(appState.transactions);
  const sortedExpenses = useSortedExpenses(appState.expenses);
  const sortedDonations = useSortedDonations(appState.donationPayouts);

  useLocalStorageSync(
    appState.transactions,
    appState.expenses,
    appState.donationPayouts,
    appState.summaries
  );

  return (
    <>
      <DesktopLayout
        appState={appState}
        financials={financials}
        sortedTransactions={sortedTransactions}
        sortedExpenses={sortedExpenses}
        sortedDonations={sortedDonations}
      />

      <MobileLayout
        appState={appState}
        financials={financials}
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
