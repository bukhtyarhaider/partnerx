import {
  Wallet,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Briefcase,
  TrendingDown,
  Users as UsersIcon,
} from "lucide-react";
import { LiveRate } from "../LiveRate";
import { DateFilter } from "../DateFilter";
import { useDateFilter } from "../../hooks/useDateFilter";
import { usePartners } from "../../hooks/usePartners";
import { formatCurrency } from "../../utils";
import { getWalletStats } from "../../utils/walletCalculations";
import type { Financials } from "../../hooks/useFinancials";
import type { Transaction, Expense, Partner } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/CustomTabs";

interface MobileCompanyWalletProps {
  financials: Financials;
  currentCapital: number;
  currentDonationsFund: number;
  transactions: Transaction[];
  expenses: Expense[];
  donationEnabled: boolean;
}

export const MobileCompanyWallet = ({
  financials,
  currentCapital,
  currentDonationsFund,
  transactions,
  expenses,
  donationEnabled,
}: MobileCompanyWalletProps) => {
  const { dateFilter, setDateFilter } = useDateFilter();
  const { activePartners } = usePartners();

  // Use centralized wallet stats calculation to ensure consistency with dashboard
  // Pass currentCapital and currentDonationsFund to ensure unfiltered current state
  const walletStats = getWalletStats(
    financials,
    currentCapital,
    currentDonationsFund
  );

  return (
    <div className="space-y-4">
      {/* Company Wallet Header */}
      <div className="rounded-xl bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-white/20 backdrop-blur-sm p-3">
            <Briefcase className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Company Wallet</h2>
            <p className="text-emerald-50 text-sm">
              Business finances & partners
            </p>
          </div>
        </div>

        {/* Company Balance Overview */}
        <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-50 text-sm font-medium">
              Company Capital
            </span>
            <Briefcase className="size-4 text-emerald-50" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {formatCurrency(walletStats.availableBalance)}
          </div>
          <div className="flex items-center gap-2 text-emerald-50 text-sm">
            <UsersIcon className="size-4" />
            <span>{activePartners.length} active partners</span>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <DateFilter value={dateFilter} onChange={setDateFilter} />

      {/* Company Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
              <ArrowUpRight className="size-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total Revenue
            </span>
          </div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {formatCurrency(walletStats.totalIncome)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {transactions.length} transactions
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-2">
              <ArrowDownRight className="size-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total Expenses
            </span>
          </div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {formatCurrency(walletStats.totalExpenses)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {expenses.length} expenses
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-2">
              <DollarSign className="size-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Net Profit
            </span>
          </div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {formatCurrency(walletStats.netAmount)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Before distribution
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
              {formatCurrency(walletStats.donationsFund)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Available fund
            </p>
          </div>
        )}
      </div>

      {/* Live Exchange Rate */}
      <LiveRate />

      {/* Partner Wallets Section */}
      <div className="rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <UsersIcon className="size-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Partner Wallets
          </h3>
        </div>

        {activePartners.length > 0 ? (
          <div className="space-y-3">
            {activePartners.map((partner) => (
              <PartnerWalletCard
                key={partner.id}
                partner={partner}
                earnings={financials.partnerEarnings[partner.id] || 0}
                expenses={financials.partnerExpenses[partner.id] || 0}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            No active partners found
          </p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="size-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Company Activity
          </h3>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex-1">
              Distribution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
                  <DollarSign className="size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    Average Revenue
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Per transaction
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {formatCurrency(
                  transactions.length > 0
                    ? walletStats.totalIncome / transactions.length
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
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-2">
                  <Briefcase className="size-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    Company Capital
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Current balance
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {formatCurrency(walletStats.availableBalance)}
              </span>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-3 mt-4">
            {activePartners.length > 0 ? (
              activePartners.map((partner) => {
                const earnings = financials.partnerEarnings[partner.id] || 0;
                const expenses = financials.partnerExpenses[partner.id] || 0;
                const net = earnings - expenses;

                return (
                  <div
                    key={partner.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-2">
                        <Wallet className="size-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {partner.displayName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {partner.equity}% equity
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-sm font-semibold ${
                          net >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {formatCurrency(net)}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        net balance
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                No partners to display
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Partner Wallet Card Component
interface PartnerWalletCardProps {
  partner: Partner;
  earnings: number;
  expenses: number;
}

const PartnerWalletCard = ({
  partner,
  earnings,
  expenses,
}: PartnerWalletCardProps) => {
  const net = earnings - expenses;
  const isNegative = net < 0;
  const progressPercentage =
    earnings > 0 ? Math.min((net / earnings) * 100, 100) : 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50 p-4 transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-2">
            <Wallet className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">
              {partner.displayName}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {partner.equity * 100}% equity
            </p>
          </div>
        </div>
        <div
          className={`text-lg font-bold ${
            isNegative
              ? "text-red-600 dark:text-red-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {formatCurrency(net)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            isNegative ? "bg-red-500" : "bg-emerald-500"
          }`}
          style={{
            width: isNegative ? "100%" : `${Math.max(progressPercentage, 2)}%`,
          }}
        />
      </div>

      {/* Earnings & Expenses */}
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-1">
          <ArrowUpRight className="size-3 text-green-600 dark:text-green-400" />
          <span className="text-slate-600 dark:text-slate-400">
            Earned:{" "}
            <span className="font-medium text-slate-800 dark:text-slate-100">
              {formatCurrency(earnings)}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowDownRight className="size-3 text-red-600 dark:text-red-400" />
          <span className="text-slate-600 dark:text-slate-400">
            Spent:{" "}
            <span className="font-medium text-slate-800 dark:text-slate-100">
              {formatCurrency(expenses)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
