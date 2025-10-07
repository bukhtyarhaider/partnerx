import {
  Wallet,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
  TrendingDown,
} from "lucide-react";
import { LiveRate } from "../LiveRate";
import { DateFilter } from "../DateFilter";
import { useDateFilter } from "../../hooks/useDateFilter";
import { formatCurrency } from "../../utils";
import type { Financials } from "../../hooks/useFinancials";
import type { Transaction, Expense } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/CustomTabs";

interface MobilePersonalWalletProps {
  financials: Financials;
  transactions: Transaction[];
  expenses: Expense[];
  donationEnabled: boolean;
}

export const MobilePersonalWallet = ({
  financials,
  transactions,
  expenses,
  donationEnabled,
}: MobilePersonalWalletProps) => {
  const { dateFilter, setDateFilter } = useDateFilter();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Personal Wallet Header */}
      <div className="rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-white/20 backdrop-blur-sm p-3">
            <Wallet className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">My Wallet</h2>
            <p className="text-blue-50 text-sm">Personal finances</p>
          </div>
        </div>

        {/* Personal Balance Card */}
        <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-50 text-sm font-medium">
              Available Balance
            </span>
            <CreditCard className="size-4 text-blue-50" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {formatCurrency(
              financials.totalNetProfit - financials.totalExpenses
            )}
          </div>
          <div className="flex items-center gap-2 text-blue-50 text-sm">
            <TrendingUp className="size-4" />
            <span>After all expenses</span>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <DateFilter value={dateFilter} onChange={setDateFilter} />

      {/* Quick Personal Stats - 3 Cards Layout */}
      <div className="grid grid-cols-2 gap-3">
        {/* Income Card - Spans 2 columns on mobile for emphasis */}
        <div className="col-span-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                <ArrowUpRight className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Total Income
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {transactions.length} transactions
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {formatCurrency(financials.totalGrossProfit)}
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-2">
              <ArrowDownRight className="size-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Expenses
            </span>
          </div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {formatCurrency(financials.totalExpenses)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {expenses.length} items
          </p>
        </div>

        {/* Donations Card - Only show if donations are enabled */}
        {donationEnabled && (
          <div className="rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-2">
                <TrendingDown className="size-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Donations
              </span>
            </div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {formatCurrency(financials.availableDonationsFund)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Available fund
            </p>
          </div>
        )}
      </div>

      {/* Live Exchange Rate */}
      <LiveRate />

      {/* Recent Activity */}
      <div className="rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="size-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Recent Transactions
          </h3>
        </div>

        <Tabs defaultValue="recent">
          <TabsList className="w-full">
            <TabsTrigger value="recent" className="flex-1">
              Latest
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex-1">
              Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-2 mt-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
                      <ArrowUpRight className="size-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        ${tx.amountUSD.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(tx.calculations.grossPKR)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                No transactions yet
              </p>
            )}
          </TabsContent>

          <TabsContent value="summary" className="space-y-3 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
                  <DollarSign className="size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    Average Transaction
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Per transaction
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {formatCurrency(
                  transactions.length > 0
                    ? financials.totalGrossProfit / transactions.length
                    : 0
                )}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-2">
                  <TrendingUp className="size-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    Total Transactions
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    All time
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {transactions.length}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2">
                  <TrendingDown className="size-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    Total Expenses
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    All time
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {expenses.length}
              </span>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
