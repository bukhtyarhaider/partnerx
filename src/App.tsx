import { useState, useEffect, useMemo } from "react";
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
import type {
  Transaction,
  PartnerName,
  Expense,
  DonationPayout,
  NewTransactionEntry,
  NewExpenseEntry,
  NewDonationPayoutEntry,
  TransactionCalculations,
} from "./types";
import {
  HandCoins,
  TrendingDown,
  HeartHandshake,
  LayoutDashboard,
} from "lucide-react";
import { LiveRate } from "./components/LiveRate";

type EditableEntry = Transaction | Expense | DonationPayout;

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    JSON.parse(localStorage.getItem("transactions") || "[]")
  );
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    JSON.parse(localStorage.getItem("expenses") || "[]")
  );
  const [donationPayouts, setDonationPayouts] = useState<DonationPayout[]>(() =>
    JSON.parse(localStorage.getItem("donationPayouts") || "[]")
  );
  const [activeTab, setActiveTab] = useState<"income" | "expense" | "donation">(
    "income"
  );

  const [editingEntry, setEditingEntry] = useState<EditableEntry | null>(null);
  const [modalType, setModalType] = useState<
    "transaction" | "expense" | "donation" | null
  >(null);

  // Financial calculations useMemo hook (no changes)
  const financials = useMemo(() => {
    let totalDonationsAccrued = 0;
    let totalGrossProfit = 0;
    let totalNetProfit = 0;
    const partnerEarnings: { [key in PartnerName]: number } = {
      Bukhtyar: 0,
      Asjad: 0,
    };
    for (const tx of transactions) {
      totalGrossProfit += tx.calculations.grossPKR;
      totalNetProfit += tx.calculations.netProfit;
      partnerEarnings.Bukhtyar += tx.calculations.partnerShare;
      partnerEarnings.Asjad += tx.calculations.partnerShare;
      totalDonationsAccrued += tx.calculations.charityAmount;
    }
    const totalDonationsPaidOut = donationPayouts.reduce(
      (sum, payout) => sum + payout.amount,
      0
    );
    const availableDonationsFund =
      totalDonationsAccrued - totalDonationsPaidOut;
    let totalExpenses = 0;
    const partnerExpenses: { [key in PartnerName]: number } = {
      Bukhtyar: 0,
      Asjad: 0,
    };
    for (const ex of expenses) {
      totalExpenses += ex.amount;
      partnerExpenses[ex.byWhom] += ex.amount;
    }
    const companyCapital = totalNetProfit - totalExpenses;
    const expenseDifference = partnerExpenses.Bukhtyar - partnerExpenses.Asjad;
    const loan = {
      amount: Math.abs(expenseDifference) / 2,
      owedBy:
        expenseDifference > 0
          ? ("Bukhtyar" as PartnerName)
          : expenseDifference < 0
          ? ("Asjad" as PartnerName)
          : null,
    };
    return {
      totalGrossProfit,
      totalNetProfit,
      totalExpenses,
      companyCapital,
      partnerEarnings,
      partnerExpenses,
      loan,
      availableDonationsFund,
    };
  }, [transactions, expenses, donationPayouts]);

  // useEffect for localStorage (no changes)
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("donationPayouts", JSON.stringify(donationPayouts));
  }, [transactions, expenses, donationPayouts]);

  // Sorted data memos (no changes)
  const sortedTransactions = useMemo(
    () =>
      [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [transactions]
  );
  const sortedExpenses = useMemo(
    () =>
      [...expenses].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [expenses]
  );
  const sortedDonations = useMemo(
    () =>
      [...donationPayouts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [donationPayouts]
  );

  // Import/Export and CRUD handlers (no changes)
  const handleImportData = (data: {
    transactions: Transaction[];
    expenses: Expense[];
    donationPayouts: DonationPayout[];
  }) => {
    setTransactions(data.transactions);
    setExpenses(data.expenses);
    setDonationPayouts(data.donationPayouts);
  };
  const recalculateTransaction = (
    entry: NewTransactionEntry | Transaction
  ): TransactionCalculations => {
    const { amountUSD, conversionRate, source, taxRate } = entry;
    const feeUSD = source === "tiktok" ? 5.0 : 0;
    const feePKR = feeUSD * conversionRate;
    const amountAfterFeesUSD = amountUSD - feeUSD;
    const grossPKR = amountAfterFeesUSD * conversionRate;
    const charityAmount = grossPKR * 0.1;
    const taxableAmount = grossPKR - charityAmount;
    const taxAmount = taxableAmount * (taxRate / 100);
    const netProfit = taxableAmount - taxAmount;
    const partnerShare = netProfit / 2;
    return {
      feePKR,
      grossPKR,
      charityAmount,
      taxAmount,
      netProfit,
      partnerShare,
    };
  };
  const handleAddTransaction = (entry: NewTransactionEntry) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      ...entry,
      calculations: recalculateTransaction(entry),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };
  const handleAddExpense = (entry: NewExpenseEntry) =>
    setExpenses((prev) => [{ id: Date.now(), ...entry }, ...prev]);
  const handleAddDonationPayout = (entry: NewDonationPayoutEntry) =>
    setDonationPayouts((prev) => [{ id: Date.now(), ...entry }, ...prev]);
  const handleUpdateTransaction = (updatedTx: Transaction) => {
    updatedTx.calculations = recalculateTransaction(updatedTx);
    setTransactions(
      transactions.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx))
    );
    setEditingEntry(null);
  };
  const handleUpdateExpense = (updatedEx: Expense) => {
    setExpenses(
      expenses.map((ex) => (ex.id === updatedEx.id ? updatedEx : ex))
    );
    setEditingEntry(null);
  };
  const handleUpdateDonationPayout = (updatedDp: DonationPayout) => {
    setDonationPayouts(
      donationPayouts.map((dp) => (dp.id === updatedDp.id ? updatedDp : dp))
    );
    setEditingEntry(null);
  };
  const handleDeleteTransaction = (id: number) => {
    if (window.confirm("Are you sure you want to delete this income entry?"))
      setTransactions(transactions.filter((tx) => tx.id !== id));
  };
  const handleDeleteExpense = (id: number) => {
    if (window.confirm("Are you sure you want to delete this expense?"))
      setExpenses(expenses.filter((ex) => ex.id !== id));
  };
  const handleDeleteDonationPayout = (id: number) => {
    if (window.confirm("Are you sure you want to delete this donation payout?"))
      setDonationPayouts(donationPayouts.filter((dp) => dp.id !== id));
  };
  const openEditModal = (
    entry: EditableEntry,
    type: "transaction" | "expense" | "donation"
  ) => {
    setEditingEntry(entry);
    setModalType(type);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-wise-blue-light font-sans">
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

          {/* PartnerSummary and ImportExport now live inside a wrapper div for better layout control */}
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

        {/* UPDATED: Main content padding adjusted for mobile */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold text-wise-blue mb-6">Overview</h2>
          <Dashboard financials={financials} />
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-wise-blue mb-4">
              Income Analysis
            </h3>
            <IncomeChart transactions={sortedTransactions} />
          </div>
          <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-wise-blue mb-4">
                Income History
              </h3>
              <TransactionHistory
                transactions={sortedTransactions}
                onEdit={(tx) => openEditModal(tx, "transaction")}
                onDelete={handleDeleteTransaction}
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-wise-blue mb-4">
                Expense History
              </h3>
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
