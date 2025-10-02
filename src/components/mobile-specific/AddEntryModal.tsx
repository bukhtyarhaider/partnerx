import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { DonationForm, ExpenseForm, TransactionForm } from "../Forms";

import type { Financials } from "../../hooks/useFinancials";
import type { AppHandlers } from "../../types";

export interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppHandlers;
  financials: Financials;
}

export const AddEntryModal = ({
  isOpen,
  onClose,
  appState,
  financials,
}: AddEntryModalProps) => {
  const tabs = [
    { key: "income", label: "Income" },
    { key: "expense", label: "Expense" },
    { key: "donation", label: "Donation" },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: "100%", scale: 0.95 }}
            animate={{ y: "0%", scale: 1 }}
            exit={{ y: "100%", scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 h-[85vh] mb-4 mx-4 rounded-3xl bg-white/90 shadow-2xl backdrop-blur-2xl dark:bg-slate-800/90"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-white/40 backdrop-blur-sm p-6 rounded-t-3xl dark:bg-slate-800/40">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50">
                Add New Entry
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 transition-all duration-200 hover:bg-white/40 hover:text-slate-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-slate-300 dark:hover:bg-slate-700/40"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-3 px-6 pb-4">
              {tabs.map((tab) => {
                const isActive = appState.activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => appState.setActiveTab(tab.key)}
                    className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-white/50 text-slate-600 hover:bg-white/70 hover:text-emerald-600 active:scale-95 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700/70 dark:hover:text-emerald-400"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Form Content */}
            <div className="h-[calc(85vh-160px)] overflow-y-auto px-6 pb-6">
              <div className="rounded-3xl bg-white/30 p-5 backdrop-blur-md dark:bg-slate-800/30">
                {appState.activeTab === "income" && (
                  <TransactionForm
                    onAddTransaction={appState.handleAddTransaction}
                  />
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
