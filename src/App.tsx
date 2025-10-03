import { AnimatePresence } from "framer-motion";

import { useAppHandlers } from "./hooks/useAppHandlers";
import { useFinancials } from "./hooks/useFinancials";
import { useLocalStorageSync } from "./hooks/useLocalStorageSync";
import { useA11yEnhancements } from "./hooks/useA11yEnhancements";
import { useFilteredData } from "./hooks/useFilteredData";
import {
  useSortedTransactions,
  useSortedExpenses,
  useSortedDonations,
} from "./hooks/useSortedData";

import DashboardPage from "./page/dashboard";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PartnerProvider } from "./contexts/PartnerContext";
import { DateFilterProvider } from "./contexts/DateFilterContext";
import { ExchangeRateProvider } from "./contexts/ExchangeRateContext";
import { PinLock } from "./components/PinLock";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./ErrorBoundary";
import { useAuth } from "./hooks/useAuth";
import InstallPrompt from "./components/InstallPrompt";
import PerformanceMonitor from "./components/PerformanceMonitor";
import type {
  AppHandlers,
  DonationPayout,
  Expense,
  Transaction,
} from "./types";

export default function App() {
  const appState = useAppHandlers();
  const sortedTransactions = useSortedTransactions(appState.transactions);
  const sortedExpenses = useSortedExpenses(appState.expenses);
  const sortedDonations = useSortedDonations(appState.donationPayouts);

  // Enable accessibility enhancements
  useA11yEnhancements();

  useLocalStorageSync(
    appState.transactions,
    appState.expenses,
    appState.donationPayouts,
    appState.summaries
  );

  return (
    <AuthProvider>
      <ThemeProvider>
        <PartnerProvider>
          <DateFilterProvider>
            <ExchangeRateProvider>
              <ErrorBoundary>
                <PerformanceMonitor />
                <InnerApp
                  appState={appState}
                  sortedTransactions={sortedTransactions}
                  sortedExpenses={sortedExpenses}
                  sortedDonations={sortedDonations}
                />
              </ErrorBoundary>
            </ExchangeRateProvider>
          </DateFilterProvider>
        </PartnerProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

interface InnerAppProps {
  appState: AppHandlers;
  sortedTransactions: Transaction[];
  sortedExpenses: Expense[];
  sortedDonations: DonationPayout[];
}

function InnerApp(props: InnerAppProps) {
  const { isUnlocked } = useAuth();

  // Get filtered data based on the selected date range
  const { filteredTransactions, filteredExpenses, filteredDonationPayouts } =
    useFilteredData(
      props.sortedTransactions,
      props.sortedExpenses,
      props.sortedDonations
    );

  // Calculate financials based on filtered data
  const financials = useFinancials(
    filteredTransactions,
    filteredExpenses,
    filteredDonationPayouts
  );

  return (
    <AnimatePresence mode="wait">
      {isUnlocked ? (
        <>
          <DashboardPage
            key="dashboard"
            appState={props.appState}
            financials={financials}
            sortedTransactions={filteredTransactions}
            sortedExpenses={filteredExpenses}
            sortedDonations={filteredDonationPayouts}
          />
          <InstallPrompt />
        </>
      ) : (
        <PinLock key="pin-lock" />
      )}
    </AnimatePresence>
  );
}
