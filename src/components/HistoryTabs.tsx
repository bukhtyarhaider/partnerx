import { useState } from "react";
import { DollarSign, TrendingDown, Heart } from "lucide-react";
import type { Transaction, Expense, DonationPayout } from "../types";
import { TransactionHistory } from "./TransactionHistory";
import { ExpenseHistory } from "./ExpenseHistory";
import { DonationHistory } from "./DonationHistory";

type HistoryTab = "transactions" | "expenses" | "donations";

interface HistoryTabsProps {
  transactions: Transaction[];
  expenses: Expense[];
  donationPayouts: DonationPayout[];
  donationEnabled?: boolean;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: number) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: number) => void;
  onEditDonationPayout: (payout: DonationPayout) => void;
  onDeleteDonationPayout: (id: number) => void;
  transactionActionBtn?: React.ReactNode;
}

export const HistoryTabs: React.FC<HistoryTabsProps> = ({
  transactions,
  expenses,
  donationPayouts,
  donationEnabled = true,
  onEditTransaction,
  onDeleteTransaction,
  onEditExpense,
  onDeleteExpense,
  onEditDonationPayout,
  onDeleteDonationPayout,
  transactionActionBtn,
}) => {
  const [activeTab, setActiveTab] = useState<HistoryTab>("transactions");

  const tabs = [
    {
      id: "transactions" as const,
      label: "Income History",
      icon: DollarSign,
      count: transactions.length,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      borderColor: "border-green-500",
      hoverColor: "hover:bg-green-50/50 dark:hover:bg-green-900/20",
    },
    {
      id: "expenses" as const,
      label: "Expense History",
      icon: TrendingDown,
      count: expenses.length,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      borderColor: "border-red-500",
      hoverColor: "hover:bg-red-50/50 dark:hover:bg-red-900/20",
    },
    ...(donationEnabled
      ? [
          {
            id: "donations" as const,
            label: "Donation History",
            icon: Heart,
            count: donationPayouts.length,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            borderColor: "border-purple-500",
            hoverColor: "hover:bg-purple-50/50 dark:hover:bg-purple-900/20",
          },
        ]
      : []),
  ];

  return (
    <div className="rounded-xl border border-white/20 bg-white/30 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/30 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-white/20 dark:border-slate-700/50 bg-white/20 dark:bg-slate-800/20">
        <div className="flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-base font-medium transition-all whitespace-nowrap relative ${
                  isActive
                    ? `${tab.color} border-b-2 ${tab.borderColor} bg-white/50 dark:bg-slate-800/50`
                    : `text-slate-600 dark:text-slate-400 ${tab.hoverColor}`
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isActive
                        ? `${tab.bgColor} ${tab.color}`
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 min-h-[60vh]">
        {activeTab === "transactions" && (
          <div className="animate-fade-in h-full">
            <TransactionHistory
              actionBtn={transactionActionBtn}
              transactions={transactions}
              onEdit={onEditTransaction}
              onDelete={onDeleteTransaction}
              disableExpansion={true}
            />
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="animate-fade-in h-full">
            <ExpenseHistory
              expenses={expenses}
              onEdit={onEditExpense}
              onDelete={onDeleteExpense}
              disableExpansion={true}
            />
          </div>
        )}

        {activeTab === "donations" && donationEnabled && (
          <div className="animate-fade-in h-full">
            <DonationHistory
              donations={donationPayouts}
              onEdit={onEditDonationPayout}
              onDelete={onDeleteDonationPayout}
            />
          </div>
        )}
      </div>
    </div>
  );
};
