import { AnimatePresence } from "framer-motion";

import { useAppHandlers } from "./hooks/useAppHandlers";
import { useFinancials, type Financials } from "./hooks/useFinancials";
import { useLocalStorageSync } from "./hooks/useLocalStorageSync";
import {
  useSortedTransactions,
  useSortedExpenses,
  useSortedDonations,
} from "./hooks/useSortedData";

import DashboardPage from "./page/dashboard";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PinLock } from "./components/PinLock";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./ErrorBoundary";

export default function App() {
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
    <AuthProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <InnerApp
            appState={appState}
            financials={financials}
            sortedTransactions={sortedTransactions}
            sortedExpenses={sortedExpenses}
            sortedDonations={sortedDonations}
          />
        </ErrorBoundary>
      </ThemeProvider>
    </AuthProvider>
  );
}

import { useAuth } from "./hooks/useAuth";
import type {
  AppHandlers,
  DonationPayout,
  Expense,
  Transaction,
} from "./types";

interface InnerAppProps {
  appState: AppHandlers;
  financials: Financials;
  sortedTransactions: Transaction[];
  sortedExpenses: Expense[];
  sortedDonations: DonationPayout[];
}

function InnerApp(props: InnerAppProps) {
  const { isUnlocked } = useAuth();
  return (
    <AnimatePresence mode="wait">
      {isUnlocked ? (
        <DashboardPage key="dashboard" {...props} />
      ) : (
        <PinLock key="pin-lock" />
      )}
    </AnimatePresence>
  );
}
