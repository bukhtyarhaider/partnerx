import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { DonationForm, ExpenseForm, TransactionForm } from "../Forms";
import type { AppHandlers } from "../../hooks/useAppHandlers";
import type { Financials } from "../../hooks/useFinancials";

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
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 h-[90vh] mb-5 rounded-t-3xl bg-white/90 shadow-2xl backdrop-blur-xl dark:bg-slate-800/90"
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-50">
                Add New Entry
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:hover:bg-slate-700"
                aria-label="Close modal"
              >
                <X size={20} className="text-slate-500 dark:text-slate-300" />
              </button>
            </div>

            <div className="flex justify-around gap-1 border-b border-slate-200 px-2 pt-2 dark:border-slate-700 ">
              {tabs.map((tab) => {
                const isActive = appState.activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => appState.setActiveTab(tab.key)}
                    className={`flex-1 rounded-t-lg px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-green-500 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Form Body */}
            <div className="h-[calc(90vh-120px)] overflow-y-auto p-4">
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
