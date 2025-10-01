import { useState } from "react";
import { Stats } from "../components/Stats";
import { IncomeChart } from "../components/IncomeChart";
import { TransactionHistory } from "../components/TransactionHistory";
import { ExpenseHistory } from "../components/ExpenseHistory";
import { DonationHistory } from "../components/DonationHistory";
import { PartnerSummary } from "../components/PartnerSummary";
import { ImportExport } from "../components/ImportExport";
import { LayoutDashboard, Lock } from "lucide-react";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import { BottomNavBar } from "../components/mobile-specific/BottomNavBar";
import { AddEntryModal } from "../components/mobile-specific/AddEntryModal";

import type { Financials } from "../hooks/useFinancials";
import type {
  AppHandlers,
  DonationPayout,
  Expense,
  Transaction,
} from "../types";
import { FinancialSummary } from "../components/FinancialSummary";
import { LiveRate } from "../components/LiveRate";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/CustomTabs";
import { AppInfoModal } from "../components/AppInfoModal";
import { useAuth } from "../hooks/useAuth";

type MobileTab = "overview" | "history" | "settings";

export interface MobileLayoutProps {
  appState: AppHandlers;
  financials: Financials;
  sortedTransactions: Transaction[];
  sortedExpenses: Expense[];
  sortedDonations: DonationPayout[];
}

export const MobileLayout = ({
  appState,
  financials,
  sortedTransactions,
  sortedExpenses,
  sortedDonations,
}: MobileLayoutProps) => {
  const { lockApp } = useAuth();
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>("overview");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const renderContent = () => {
    switch (activeMobileTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <Stats financials={financials} />
            <FinancialSummary
              transactions={sortedTransactions}
              expenses={sortedExpenses}
              financials={financials}
              summaries={appState.summaries}
              onAddSummary={appState.handleAddSummary}
              onDeleteSummary={appState.handleDeleteSummary}
            />
            <LiveRate />
            <IncomeChart transactions={sortedTransactions} />
          </div>
        );
      case "history":
        return (
          <Tabs defaultValue="transactions">
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <TransactionHistory
                transactions={sortedTransactions}
                onEdit={(tx) => appState.openEditModal(tx, "transaction")}
                onDelete={appState.handleDeleteTransaction}
              />
            </TabsContent>

            <TabsContent value="expenses">
              <ExpenseHistory
                expenses={sortedExpenses}
                onEdit={(ex) => appState.openEditModal(ex, "expense")}
                onDelete={appState.handleDeleteExpense}
              />
            </TabsContent>

            {/* The content panel for "Donations" */}
            <TabsContent value="donations">
              <DonationHistory
                donations={sortedDonations}
                onEdit={(dp) => appState.openEditModal(dp, "donation")}
                onDelete={appState.handleDeleteDonationPayout}
              />
            </TabsContent>
          </Tabs>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <PartnerSummary
              partnerEarnings={financials.partnerEarnings}
              partnerExpenses={financials.partnerExpenses}
            />
            <ImportExport
              transactions={appState.transactions}
              expenses={appState.expenses}
              donationPayouts={appState.donationPayouts}
              onImport={appState.handleImport}
              summaries={appState.summaries}
            />
            <AppInfoModal />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans dark:bg-slate-900 lg:hidden">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-green-500 p-2">
            <LayoutDashboard className="size-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-50">
            PartnerX
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={lockApp}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            title="Lock App"
          >
            <Lock size={18} />
          </button>
          <ThemeToggleButton />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {renderContent()}
      </main>

      <BottomNavBar
        activeTab={activeMobileTab}
        onTabChange={setActiveMobileTab}
        onAddClick={() => {
          setIsAddOpen(true);
          setAddModalOpen(true);
        }}
        isAddOpen={isAddOpen}
      />

      <AddEntryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setIsAddOpen(false);
        }}
        appState={appState}
        financials={financials}
      />
    </div>
  );
};
