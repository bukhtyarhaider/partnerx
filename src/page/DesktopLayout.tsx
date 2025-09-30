import {
  HandCoins,
  HeartHandshake,
  LayoutDashboard,
  TrendingDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DonationForm,
  ExpenseForm,
  TransactionForm,
} from "../components/Forms";
import { PartnerSummary } from "../components/PartnerSummary";
import { ImportExport } from "../components/ImportExport";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import { Stats } from "../components/Stats";
import { IncomeChart } from "../components/IncomeChart";
import { TransactionHistory } from "../components/TransactionHistory";
import { ExpenseHistory } from "../components/ExpenseHistory";
import { DonationHistory } from "../components/DonationHistory";
import { LiveRate } from "../components/LiveRate";
import type { AppHandlers } from "../hooks/useAppHandlers";
import type { Financials } from "../hooks/useFinancials";
import type { DonationPayout, Expense, Transaction } from "../types";
import { FinancialSummary } from "../components/FinancialSummary";
import { AppInfoModal } from "../components/AppInfoModal";

export interface DesktopLayoutProps {
  appState: AppHandlers;
  financials: Financials;
  sortedTransactions: Transaction[];
  sortedExpenses: Expense[];
  sortedDonations: DonationPayout[];
}

export const DesktopLayout = ({
  appState,
  financials,
  sortedTransactions,
  sortedExpenses,
  sortedDonations,
}: DesktopLayoutProps) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const baseTabStyle =
    "flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ease-in-out transform hover:-translate-y-0.5";
  const activeTabStyle =
    "border-green-500 text-green-500 dark:border-green-400 dark:text-green-400";
  const inactiveTabStyle =
    "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200";

  return (
    <div className="hidden min-h-screen flex-col font-sans lg:flex lg:flex-row bg-slate-50 dark:bg-slate-900">
      <aside
        className={`flex w-full shrink-0 transform flex-col border-b border-slate-200 bg-white p-4 transition-all duration-500 sm:p-6 lg:w-96 lg:border-b-0 lg:border-r dark:border-slate-700 dark:bg-slate-800 ${
          isMounted
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        }`}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-green-500 p-2">
            <LayoutDashboard className="size-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50">
            PartnerX
          </h1>
        </div>
        <div className="mb-1">
          <LiveRate />
        </div>
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-4 sm:space-x-6" aria-label="Tabs">
            <button
              onClick={() => appState.setActiveTab("income")}
              className={`${baseTabStyle} ${
                appState.activeTab === "income"
                  ? activeTabStyle
                  : inactiveTabStyle
              }`}
            >
              <HandCoins size={16} /> Income
            </button>
            <button
              onClick={() => appState.setActiveTab("expense")}
              className={`${baseTabStyle} ${
                appState.activeTab === "expense"
                  ? activeTabStyle
                  : inactiveTabStyle
              }`}
            >
              <TrendingDown size={16} /> Expense
            </button>
            <button
              onClick={() => appState.setActiveTab("donation")}
              className={`${baseTabStyle} ${
                appState.activeTab === "donation"
                  ? activeTabStyle
                  : inactiveTabStyle
              }`}
            >
              <HeartHandshake size={16} /> Donation
            </button>
          </nav>
        </div>
        <div className="py-6 lg:flex-grow lg:overflow-y-auto">
          {appState.activeTab === "income" && (
            <TransactionForm onAddTransaction={appState.handleAddTransaction} />
          )}
          {appState.activeTab === "expense" && (
            <ExpenseForm onAddExpense={appState.handleAddExpense} />
          )}
          {appState.activeTab === "donation" && (
            <DonationForm
              onAddDonationPayout={appState.handleAddDonationPayout}
              availableFunds={financials.availableDonationsFund}
            />
          )}
        </div>
        <div className="mt-auto space-y-6">
          <PartnerSummary
            partnerEarnings={financials.partnerEarnings}
            partnerExpenses={financials.partnerExpenses}
          />
          <ImportExport
            transactions={appState.transactions}
            expenses={appState.expenses}
            donationPayouts={appState.donationPayouts}
            onImport={appState.handleImportData}
          />
          <AppInfoModal />
        </div>
      </aside>
      <main
        className={`flex-1 overflow-y-auto p-4 transition-opacity duration-700 delay-200 sm:p-8 ${
          isMounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mb-6 flex flex-row items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-50">
            Overview
          </h2>
          <ThemeToggleButton />
        </div>
        <Stats financials={financials} />
        <FinancialSummary
          financials={financials}
          transactions={sortedTransactions}
          expenses={sortedExpenses}
        />
        <div className="mt-8">
          <IncomeChart transactions={sortedTransactions} />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
          <div>
            <TransactionHistory
              transactions={sortedTransactions}
              onEdit={(tx) => appState.openEditModal(tx, "transaction")}
              onDelete={appState.handleDeleteTransaction}
            />
          </div>
          <div>
            <ExpenseHistory
              expenses={sortedExpenses}
              onEdit={(ex) => appState.openEditModal(ex, "expense")}
              onDelete={appState.handleDeleteExpense}
            />
          </div>
        </div>
        <div className="mt-8">
          <h3 className="mb-4 text-2xl font-bold text-slate-800 dark:text-slate-50">
            Donation Payout History
          </h3>
          <DonationHistory
            donations={sortedDonations}
            onEdit={(dp) => appState.openEditModal(dp, "donation")}
            onDelete={appState.handleDeleteDonationPayout}
          />
        </div>
      </main>
    </div>
  );
};
