import { useState, useEffect } from "react";
import { useAppHandlers } from "../hooks/useAppHandlers";
import { useFinancials } from "../hooks/useFinancials";
import { useLocalStorageSync } from "../hooks/useLocalStorageSync";
import {
  useSortedTransactions,
  useSortedExpenses,
  useSortedDonations,
} from "../hooks/useSortedData";

import {
  DonationForm,
  ExpenseForm,
  TransactionForm,
} from "../components/Forms";
import { TransactionHistory } from "../components/TransactionHistory";
import { ExpenseHistory } from "../components/ExpenseHistory";
import { DonationHistory } from "../components/DonationHistory";
import { ImportExport } from "../components/ImportExport";
import { IncomeChart } from "../components/IncomeChart";
import { PartnerSummary } from "../components/PartnerSummary";
import { EditModal } from "../components/EditModal";
import { LiveRate } from "../components/LiveRate";

import {
  HandCoins,
  TrendingDown,
  HeartHandshake,
  LayoutDashboard,
} from "lucide-react";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import { Stats } from "../components/Stats";

export default function DashboardPage() {
  const {
    transactions,
    expenses,
    donationPayouts,
    activeTab,
    setActiveTab,
    editingEntry,
    setEditingEntry,
    modalType,
    handleImportData,
    handleAddTransaction,
    handleAddExpense,
    handleAddDonationPayout,
    handleUpdateTransaction,
    handleUpdateExpense,
    handleUpdateDonationPayout,
    handleDeleteTransaction,
    handleDeleteExpense,
    handleDeleteDonationPayout,
    openEditModal,
  } = useAppHandlers();

  useLocalStorageSync(transactions, expenses, donationPayouts);

  const financials = useFinancials(transactions, expenses, donationPayouts);
  const sortedTransactions = useSortedTransactions(transactions);
  const sortedExpenses = useSortedExpenses(expenses);
  const sortedDonations = useSortedDonations(donationPayouts);

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
    <>
      <div className="flex min-h-screen flex-col font-sans lg:flex-row bg-slate-50 dark:bg-slate-900">
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

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-slate-700">
            <nav
              className="-mb-px flex space-x-4 sm:space-x-6"
              aria-label="Tabs"
            >
              <button
                onClick={() => setActiveTab("income")}
                className={`${baseTabStyle} ${
                  activeTab === "income" ? activeTabStyle : inactiveTabStyle
                }`}
              >
                <HandCoins size={16} /> Income
              </button>
              <button
                onClick={() => setActiveTab("expense")}
                className={`${baseTabStyle} ${
                  activeTab === "expense" ? activeTabStyle : inactiveTabStyle
                }`}
              >
                <TrendingDown size={16} /> Expense
              </button>
              <button
                onClick={() => setActiveTab("donation")}
                className={`${baseTabStyle} ${
                  activeTab === "donation" ? activeTabStyle : inactiveTabStyle
                }`}
              >
                <HeartHandshake size={16} /> Donation
              </button>
            </nav>
          </div>

          {/* Forms */}
          <div className="py-6 lg:flex-grow lg:overflow-y-auto">
            {activeTab === "income" && (
              <TransactionForm onAddTransaction={handleAddTransaction} />
            )}
            {activeTab === "expense" && (
              <ExpenseForm onAddExpense={handleAddExpense} />
            )}
            {activeTab === "donation" && (
              <DonationForm
                onAddDonationPayout={handleAddDonationPayout}
                availableFunds={financials.availableDonationsFund}
              />
            )}
          </div>

          {/* Bottom Sidebar Content */}
          <div className="mt-auto space-y-6">
            <PartnerSummary
              partnerEarnings={financials.partnerEarnings}
              partnerExpenses={financials.partnerExpenses}
            />
            <ImportExport
              transactions={transactions}
              expenses={expenses}
              donationPayouts={donationPayouts}
              onImport={handleImportData}
            />
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
          <div className="mt-8">
            <IncomeChart transactions={sortedTransactions} />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
            <div>
              <TransactionHistory
                transactions={sortedTransactions}
                onEdit={(tx) => openEditModal(tx, "transaction")}
                onDelete={handleDeleteTransaction}
              />
            </div>
            <div>
              <ExpenseHistory
                expenses={sortedExpenses}
                onEdit={(ex) => openEditModal(ex, "expense")}
                onDelete={handleDeleteExpense}
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-2xl font-bold text-slate-800 dark:text-slate-50">
              Donation Payout History
            </h3>
            <DonationHistory
              donations={sortedDonations}
              onEdit={(dp) => openEditModal(dp, "donation")}
              onDelete={handleDeleteDonationPayout}
            />
          </div>
        </main>
      </div>

      <EditModal
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        entry={editingEntry}
        type={modalType}
        onUpdateTransaction={handleUpdateTransaction}
        onUpdateExpense={handleUpdateExpense}
        onUpdateDonationPayout={handleUpdateDonationPayout}
        availableDonationFunds={financials.availableDonationsFund}
      />
    </>
  );
}
