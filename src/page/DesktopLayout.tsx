import {
  HandCoins,
  HeartHandshake,
  LayoutDashboard,
  TrendingDown,
  Lock,
  Settings,
} from "lucide-react";
import {
  DonationForm,
  ExpenseForm,
  TransactionForm,
} from "../components/Forms";
import { PartnerSummary } from "../components/PartnerSummary";
import { ImportExport } from "../components/ImportExport";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import { DateFilter } from "../components/DateFilter";
import { useDateFilter } from "../hooks/useDateFilter";
import { Stats } from "../components/Stats";
import { DesktopSettingsModal } from "../components/DesktopSettingsModal";
import { DesktopFinancialAnalytics } from "../components/DesktopFinancialAnalytics";
import { TransactionHistory } from "../components/TransactionHistory";
import { ExpenseHistory } from "../components/ExpenseHistory";
import { DonationHistory } from "../components/DonationHistory";
import { DonationConfigModal } from "../components/DonationConfigModal";
import { DonationSettingsButton } from "../components/DonationSettingsButton";
import { IncomeSourceSettingsButton } from "../components/IncomeSourceSettingsButton";
import { IncomeSourceSettingsModal } from "../components/IncomeSourceSettingsModal";
import { PartnerSettingsModal } from "../components/PartnerSettingsModal";
import { PartnerSettingsButton } from "../components/PartnerSettingsButton";
import { LiveRate } from "../components/LiveRate";

import type { Financials } from "../hooks/useFinancials";
import type {
  AppHandlers,
  DonationPayout,
  Expense,
  Transaction,
} from "../types";
import { AIFinancialAssistant } from "../components/AIFinancialAssistant";
import { AppInfoModal } from "../components/AppInfoModal";
import { useAuth } from "../hooks/useAuth";
import { useBusinessInfo } from "../hooks/useBusinessInfo";
import { useState } from "react";

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
  const { lockApp } = useAuth();
  const { dateFilter, setDateFilter } = useDateFilter();
  const { isPersonalMode } = useBusinessInfo();
  const [isDonationConfigOpen, setIsDonationConfigOpen] = useState(false);
  const [isIncomeSettingsOpen, setIsIncomeSettingsOpen] = useState(false);
  const [isPartnerSettingsOpen, setIsPartnerSettingsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const tabs = [
    {
      id: "income" as const,
      label: "Income",
      icon: HandCoins,
      component: (
        <TransactionForm onAddTransaction={appState.handleAddTransaction} />
      ),
    },
    {
      id: "expense" as const,
      label: "Expense",
      icon: TrendingDown,
      component: (
        <ExpenseForm
          onAddExpense={appState.handleAddExpense}
          financials={financials}
        />
      ),
    },
    ...(appState.donationConfig.enabled
      ? [
          {
            id: "donation" as const,
            label: "Donation",
            icon: HeartHandshake,
            component: (
              <DonationForm
                onAddDonationPayout={appState.handleAddDonationPayout}
                availableFunds={financials.availableDonationsFund}
              />
            ),
          },
        ]
      : []),
  ];

  const activeTab = tabs.find((tab) => tab.id === appState.activeTab);

  return (
    <div className="hidden min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 lg:flex">
      {/* Sidebar */}
      <aside className="flex w-80 flex-col border-r border-white/20 bg-white/70 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/70">
        {/* Header */}
        <div className="flex items-center gap-3 bg-white/30 px-4 py-5 backdrop-blur-sm dark:bg-slate-800/30">
          <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-2 shadow-lg shadow-green-500/25">
            <LayoutDashboard className="size-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            PartnerWise
          </h1>
        </div>

        {/* Live Rate */}
        <div className="px-4 py-2">
          <LiveRate />
        </div>

        {/* Navigation Tabs */}
        <nav
          className="bg-white/20 backdrop-blur-sm dark:bg-slate-800/20"
          aria-label="Navigation tabs"
        >
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = appState.activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => appState.setActiveTab(tab.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 px-2 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-b-2 border-green-500 bg-green-50/50 text-green-600 backdrop-blur-sm dark:bg-green-900/30 dark:text-green-400"
                      : "text-slate-600 hover:bg-white/30 hover:text-slate-900 hover:backdrop-blur-sm dark:text-slate-400 dark:hover:bg-slate-700/30 dark:hover:text-slate-200"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-3">{activeTab?.component}</div>

        {/* Footer Content */}
        <div className="space-y-3 bg-white/20 p-3 backdrop-blur-sm dark:bg-slate-800/20">
          {!isPersonalMode && (
            <>
              <PartnerSummary
                partnerEarnings={financials.partnerEarnings}
                partnerExpenses={financials.partnerExpenses}
              />
              <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                <PartnerSettingsButton
                  onClick={() => setIsPartnerSettingsOpen(true)}
                  showTitle={true}
                  className="w-full justify-center"
                />
              </div>
            </>
          )}
          <ImportExport
            transactions={appState.transactions}
            expenses={appState.expenses}
            donationPayouts={appState.donationPayouts}
            onImport={appState.handleImport}
            summaries={appState.summaries}
            donationConfig={appState.donationConfig}
          />
          <AppInfoModal />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <header className="mb-4 flex items-center justify-between rounded-xl bg-white/30 p-4 backdrop-blur-sm dark:bg-slate-800/30">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Overview
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="rounded-lg p-1.5 text-slate-500 transition-all duration-200 hover:bg-white/50 hover:text-slate-700 hover:backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-300 dark:focus:ring-offset-slate-800"
                title="Settings"
                aria-label="Open settings"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={lockApp}
                className="rounded-lg p-1.5 text-slate-500 transition-all duration-200 hover:bg-white/50 hover:text-slate-700 hover:backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-300 dark:focus:ring-offset-slate-800"
                title="Lock App"
                aria-label="Lock application"
              >
                <Lock size={16} />
              </button>
              <ThemeToggleButton />
            </div>
          </header>

          {/* Date Filter */}
          <div className="mb-6">
            <DateFilter value={dateFilter} onChange={setDateFilter} />
          </div>

          <Stats
            financials={financials}
            donationEnabled={appState.donationConfig.enabled}
          />

          <DesktopFinancialAnalytics
            transactions={sortedTransactions}
            expenses={sortedExpenses}
          />

          {/* AI Financial Assistant - Floating */}
          <AIFinancialAssistant
            financials={financials}
            transactions={sortedTransactions}
            expenses={sortedExpenses}
            dateFilter={dateFilter}
            summaries={appState.summaries}
            onAddSummary={appState.handleAddSummary}
            onDeleteSummary={appState.handleDeleteSummary}
          />

          {/* Transaction and Expense History */}
          <div className="mt-4 mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
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

            <ExpenseHistory
              expenses={sortedExpenses}
              onEdit={(ex) => appState.openEditModal(ex, "expense")}
              onDelete={appState.handleDeleteExpense}
            />
          </div>

          {/* Donation History - Only show if donations are enabled */}
          {appState.donationConfig.enabled && (
            <div className="rounded-xl bg-white/20 p-4 backdrop-blur-sm dark:bg-slate-800/20">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Donation Payout History
                </h3>
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
          )}
        </div>
      </main>

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

      {/* Partner Settings Modal */}
      {!isPersonalMode && (
        <PartnerSettingsModal
          isOpen={isPartnerSettingsOpen}
          onClose={() => setIsPartnerSettingsOpen(false)}
        />
      )}

      {/* Settings Modal */}
      <DesktopSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        appState={appState}
      />
    </div>
  );
};
