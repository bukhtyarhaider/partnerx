import { useAppHandlers } from "./hooks/useAppHandlers";
import { useFinancials } from "./hooks/useFinancials";
import { useLocalStorageSync } from "./hooks/useLocalStorageSync";
import {
  useSortedTransactions,
  useSortedExpenses,
  useSortedDonations,
} from "./hooks/useSortedData";

import { TransactionForm } from "./components/TransactionForm";
import { ExpenseForm } from "./components/ExpenseForm";
import { DonationForm } from "./components/DonationForm";
import { Dashboard } from "./components/Dashboard";
import { TransactionHistory } from "./components/TransactionHistory";
import { ExpenseHistory } from "./components/ExpenseHistory";
import { DonationHistory } from "./components/DonationHistory";
import { ImportExport } from "./components/ImportExport";
import { IncomeChart } from "./components/IncomeChart";
import { PartnerSummary } from "./components/PartnerSummary";
import { EditModal } from "./components/EditModal";
import { LiveRate } from "./components/LiveRate";

import {
  HandCoins,
  TrendingDown,
  HeartHandshake,
  LayoutDashboard,
} from "lucide-react";

export default function App() {
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

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-wise-blue-light font-sans">
        {/* Sidebar */}
        <aside className="w-full lg:w-96 bg-white p-4 sm:p-6 flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-wise-green rounded-full p-2">
              <LayoutDashboard className="text-white size-6" />
            </div>
            <h1 className="text-2xl font-bold text-wise-blue">PartnerX</h1>
          </div>

          <div className="mb-1">
            <LiveRate />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav
              className="-mb-px flex space-x-4 sm:space-x-6"
              aria-label="Tabs"
            >
              <button
                onClick={() => setActiveTab("income")}
                className={`${
                  activeTab === "income"
                    ? "border-wise-green text-wise-green"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <HandCoins size={16} /> Income
              </button>
              <button
                onClick={() => setActiveTab("expense")}
                className={`${
                  activeTab === "expense"
                    ? "border-wise-green text-wise-green"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <TrendingDown size={16} /> Expense
              </button>
              <button
                onClick={() => setActiveTab("donation")}
                className={`${
                  activeTab === "donation"
                    ? "border-wise-green text-wise-green"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
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

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold text-wise-blue mb-6">Overview</h2>
          <Dashboard financials={financials} />
          <div className="mt-8">
            <IncomeChart transactions={sortedTransactions} />
          </div>

          <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
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
            <h3 className="text-2xl font-bold text-wise-blue mb-4">
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

      {/* Edit Modal */}
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
