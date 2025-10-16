import { useState } from "react";
import { Stats } from "../components/Stats";
import { IncomeChart } from "../components/IncomeChart";
import { ExpenseAnalytics } from "../components/ExpenseAnalytics";
import { TransactionHistory } from "../components/TransactionHistory";
import { ExpenseHistory } from "../components/ExpenseHistory";
import { DonationHistory } from "../components/DonationHistory";
import { DonationConfigModal } from "../components/DonationConfigModal";
import { DonationSettingsButton } from "../components/DonationSettingsButton";
import { IncomeSourceSettingsButton } from "../components/IncomeSourceSettingsButton";
import { IncomeSourceSettingsModal } from "../components/IncomeSourceSettingsModal";
import { LayoutDashboard, Lock } from "lucide-react";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import { BottomNavBar } from "../components/mobile-specific/BottomNavBar";
import { AddEntryModal } from "../components/mobile-specific/AddEntryModal";
import { MobileSettingsScreen } from "../components/mobile-specific/MobileSettingsScreen";
import { MobileWalletScreen } from "../components/mobile-specific/MobileWalletScreen";

import type { Financials } from "../hooks/useFinancials";
import type {
  AppHandlers,
  DonationPayout,
  Expense,
  Transaction,
} from "../types";
import { MobileAIFinancialAssistant } from "../components/MobileAIFinancialAssistant";
import { LiveRate } from "../components/LiveRate";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/CustomTabs";
import { DateFilter } from "../components/DateFilter";
import { useDateFilter } from "../hooks/useDateFilter";
import { useAuth } from "../hooks/useAuth";

type MobileTab = "overview" | "history" | "wallet" | "settings";

export interface MobileLayoutProps {
  appState: AppHandlers;
  financials: Financials;
  currentCapital: number;
  currentDonationsFund: number;
  sortedTransactions: Transaction[];
  sortedExpenses: Expense[];
  sortedDonations: DonationPayout[];
}

export const MobileLayout = ({
  appState,
  financials,
  currentCapital,
  currentDonationsFund,
  sortedTransactions,
  sortedExpenses,
  sortedDonations,
}: MobileLayoutProps) => {
  const { lockApp } = useAuth();
  const { dateFilter, setDateFilter } = useDateFilter();
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>("overview");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDonationConfigOpen, setIsDonationConfigOpen] = useState(false);
  const [isIncomeSettingsOpen, setIsIncomeSettingsOpen] = useState(false);

  const renderContent = () => {
    switch (activeMobileTab) {
      case "overview":
        return (
          <div className="space-y-4">
            <DateFilter value={dateFilter} onChange={setDateFilter} />

            <Stats
              financials={financials}
              currentCapital={currentCapital}
              currentDonationsFund={currentDonationsFund}
              donationEnabled={appState.donationConfig.enabled}
            />

            <LiveRate />

            <IncomeChart transactions={sortedTransactions} />

            <ExpenseAnalytics expenses={sortedExpenses} />

            {/* AI Financial Assistant - Mobile-optimized inline card */}
            <MobileAIFinancialAssistant
              transactions={sortedTransactions}
              expenses={sortedExpenses}
              financials={financials}
              dateFilter={dateFilter}
              summaries={appState.summaries}
              onAddSummary={appState.handleAddSummary}
              onDeleteSummary={appState.handleDeleteSummary}
            />
          </div>
        );
      case "history":
        return (
          <Tabs defaultValue="transactions">
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              {appState.donationConfig.enabled && (
                <TabsTrigger value="donations">Donations</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="transactions">
              <div className="space-y-4">
                <TransactionHistory
                  actionBtn={
                    <IncomeSourceSettingsButton
                      onClick={() => setIsIncomeSettingsOpen(true)}
                    />
                  }
                  transactions={sortedTransactions}
                  onEdit={(tx) => appState.openEditModal(tx, "transaction")}
                  onDelete={appState.handleDeleteTransaction}
                />
              </div>
            </TabsContent>

            <TabsContent value="expenses">
              <ExpenseHistory
                expenses={sortedExpenses}
                onEdit={(ex) => appState.openEditModal(ex, "expense")}
                onDelete={appState.handleDeleteExpense}
              />
            </TabsContent>

            {appState.donationConfig.enabled && (
              <TabsContent value="donations">
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <DonationSettingsButton
                      onClick={() => setIsDonationConfigOpen(true)}
                    />
                  </div>
                  <DonationHistory
                    donations={sortedDonations}
                    onEdit={(dp) => appState.openEditModal(dp, "donation")}
                    onDelete={appState.handleDeleteDonationPayout}
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        );
      case "wallet":
        return (
          <MobileWalletScreen
            financials={financials}
            transactions={sortedTransactions}
            expenses={sortedExpenses}
            donationEnabled={appState.donationConfig.enabled}
          />
        );
      case "settings":
        return <MobileSettingsScreen appState={appState} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans dark:bg-slate-900 lg:hidden">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80 mobile-app-header">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-green-500 p-2">
            <LayoutDashboard className="size-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-50">
            PartnerWise
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={lockApp}
            className="rounded-2xl p-2 text-slate-600 transition-all duration-200 hover:bg-white/40 hover:text-slate-800 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-700/40 dark:hover:text-slate-200"
            title="Lock App"
            aria-label="Lock application"
          >
            <Lock size={18} />
          </button>
          <ThemeToggleButton />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-28 mobile-safe-area">
        <div className="space-y-4">{renderContent()}</div>
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
        donationEnabled={appState.donationConfig.enabled}
      />
      {/* Donation Configuration Modal */}
      <DonationConfigModal
        isOpen={isDonationConfigOpen}
        onClose={() => setIsDonationConfigOpen(false)}
        config={appState.donationConfig}
        onUpdate={appState.handleUpdateDonationConfig}
      />
      {/* Income Source Settings Modal */}
      <IncomeSourceSettingsModal
        isOpen={isIncomeSettingsOpen}
        onClose={() => setIsIncomeSettingsOpen(false)}
      />
    </div>
  );
};
