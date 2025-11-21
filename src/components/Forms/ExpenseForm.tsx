import React, { useState, useEffect, useCallback } from "react";
import { PlusCircle, Save, AlertCircle } from "lucide-react";
import type {
  NewExpenseEntry,
  Expense,
  PartnerName,
  ExpenseType,
} from "../../types";
import type { Financials } from "../../hooks/useFinancials";
import { getTodayString, formatCurrency } from "../../utils";
import { usePartners } from "../../hooks/usePartners";
import { useConfirmation } from "../../hooks/useConfirmation";
import { ConfirmationModal } from "../common/ConfirmationModal";

interface FormProps {
  mode?: "add" | "edit";
  initialData?: Expense;
  onAddExpense?: (entry: NewExpenseEntry) => void;
  onSave?: (entry: Expense) => void;
  financials?: Financials; // Add financials for spending validation
}

const INPUT_STYLES =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition-colors duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-green-400 dark:focus:ring-green-400/20";

const LABEL_STYLES =
  "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

export const ExpenseForm: React.FC<FormProps> = ({
  mode = "add",
  initialData,
  onAddExpense,
  onSave,
  financials,
}) => {
  const { activePartners } = usePartners();
  const { confirmation, showConfirmation, hideConfirmation } =
    useConfirmation();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [category, setCategory] = useState("");
  const [type, setType] = useState<ExpenseType>("personal");
  const [byWhom, setByWhom] = useState<PartnerName>(
    activePartners.length > 0
      ? (activePartners[0].name as PartnerName)
      : "Bukhtyar"
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingExpenseData, setPendingExpenseData] =
    useState<NewExpenseEntry | null>(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setAmount(String(initialData.amount));
      setDescription(initialData.description);
      setDate(initialData.date);
      setCategory(initialData.category);
      setType(initialData.type || "personal"); // Default to personal for backward compatibility
      setByWhom(initialData.byWhom);
    }
  }, [mode, initialData]);

  const resetForm = useCallback(() => {
    setAmount("");
    setDescription("");
    setCategory("");
    setType("personal");
    setDate(getTodayString());
    if (activePartners.length > 0) {
      setByWhom(activePartners[0].name as PartnerName);
    }
  }, [activePartners]);

  const addExpenseDirectly = useCallback(
    (data: NewExpenseEntry) => {
      if (onAddExpense) {
        onAddExpense(data);
        resetForm();
        setPendingExpenseData(null);
      }
    },
    [onAddExpense, resetForm]
  );

  const handleConfirmExpense = useCallback(() => {
    if (pendingExpenseData) {
      addExpenseDirectly(pendingExpenseData);
    }
  }, [pendingExpenseData, addExpenseDirectly]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!amount || !description || !date || !category) {
        throw new Error("Please fill out all required fields.");
      }

      const expenseAmount = parseFloat(amount);
      const expenseType = type;
      const spendingPartner = byWhom;

      const commonData = {
        amount: expenseAmount,
        description,
        date,
        category,
        type,
        byWhom,
      };

      // Validate spending limits for new expenses
      if (mode === "add" && financials) {
        const partner = activePartners.find((p) => p.name === spendingPartner);
        if (partner) {
          const currentEarnings = financials.partnerEarnings[partner.id] || 0;
          const currentExpenses = financials.partnerExpenses[partner.id] || 0;
          const currentBalance = currentEarnings - currentExpenses;

          if (expenseType === "personal") {
            // For personal expenses, show confirmation if insufficient funds
            if (expenseAmount > currentBalance) {
              const deficit = expenseAmount - currentBalance;
              setPendingExpenseData(commonData);

              showConfirmation({
                title: "⚠️ Insufficient Funds Warning",
                message: `${partner.displayName} has ${formatCurrency(
                  currentBalance
                )} available but is trying to spend ${formatCurrency(
                  expenseAmount
                )}.\n\n💰 Deficit: ${formatCurrency(deficit)}\n\n${
                  partner.displayName
                } will owe ${formatCurrency(
                  deficit
                )} to the company.\n\nDo you want to proceed with this expense?`,
                confirmText: "Yes, Add Expense",
                variant: "warning",
                onConfirm: handleConfirmExpense,
              });

              setIsSubmitting(false);
              return;
            }
          } else if (expenseType === "company") {
            // For company expenses, check each partner's ability to cover their share
            const insufficientPartners: Array<{
              name: string;
              needed: number;
              has: number;
              deficit: number;
            }> = [];

            activePartners.forEach((p) => {
              const partnerEarnings = financials.partnerEarnings[p.id] || 0;
              const partnerExpenses = financials.partnerExpenses[p.id] || 0;
              const partnerBalance = partnerEarnings - partnerExpenses;
              const partnerShare = expenseAmount * p.equity;

              if (partnerShare > partnerBalance) {
                insufficientPartners.push({
                  name: p.displayName,
                  needed: partnerShare,
                  has: partnerBalance,
                  deficit: partnerShare - partnerBalance,
                });
              }
            });

            // Show confirmation if any partner has insufficient funds
            if (insufficientPartners.length > 0) {
              setPendingExpenseData(commonData);

              const partnerDetails = insufficientPartners
                .map(
                  (p) =>
                    `• ${p.name}:\n  Has: ${formatCurrency(
                      p.has
                    )}\n  Needs: ${formatCurrency(
                      p.needed
                    )}\n  Will owe: ${formatCurrency(p.deficit)}`
                )
                .join("\n\n");

              const totalDeficit = insufficientPartners.reduce(
                (sum, p) => sum + p.deficit,
                0
              );

              showConfirmation({
                title: "⚠️ Insufficient Funds Warning",
                message: `This company expense will cause ${
                  insufficientPartners.length
                } partner(s) to have insufficient funds:\n\n${partnerDetails}\n\n💰 Total debt: ${formatCurrency(
                  totalDeficit
                )}\n\nThe partner(s) will owe this amount to the company.\n\nDo you want to proceed?`,
                confirmText: "Yes, Add Expense",
                variant: "warning",
                onConfirm: handleConfirmExpense,
              });

              setIsSubmitting(false);
              return;
            }

            // Also check if company capital would go negative
            if (expenseAmount > financials.companyCapital) {
              setPendingExpenseData(commonData);
              const deficit = expenseAmount - financials.companyCapital;

              showConfirmation({
                title: "⚠️ Company Capital Warning",
                message: `Company capital is ${formatCurrency(
                  financials.companyCapital
                )} but this expense is ${formatCurrency(
                  expenseAmount
                )}.\n\n💰 Capital deficit: ${formatCurrency(
                  deficit
                )}\n\nCompany capital will become negative: ${formatCurrency(
                  financials.companyCapital - expenseAmount
                )}\n\nDo you want to proceed?`,
                confirmText: "Yes, Add Expense",
                variant: "warning",
                onConfirm: handleConfirmExpense,
              });

              setIsSubmitting(false);
              return;
            }
          }
        }
      }

      if (mode === "edit" && onSave && initialData) {
        onSave({ ...initialData, ...commonData });
      } else if (mode === "add" && onAddExpense) {
        addExpenseDirectly(commonData);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = mode === "edit";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        {isEditMode ? "Edit Expense" : "Add New Expense"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="expense-date" className={LABEL_STYLES}>
              Date *
            </label>
            <input
              type="date"
              id="expense-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={INPUT_STYLES}
              required
            />
          </div>
          <div>
            <label htmlFor="expense-amount" className={LABEL_STYLES}>
              Amount (PKR) *
            </label>
            <input
              type="number"
              id="expense-amount"
              placeholder="e.g., 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={INPUT_STYLES}
              required
            />
            {/* Show available balance for spending validation */}
            {financials && mode === "add" && (
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {type === "personal" ? (
                  (() => {
                    const partner = activePartners.find(
                      (p) => p.name === byWhom
                    );
                    if (partner) {
                      const currentEarnings =
                        financials.partnerEarnings[partner.id] || 0;
                      const currentExpenses =
                        financials.partnerExpenses[partner.id] || 0;
                      const availableBalance =
                        currentEarnings - currentExpenses;
                      return (
                        <span
                          className={
                            availableBalance < 0
                              ? "text-red-500 dark:text-red-400"
                              : ""
                          }
                        >
                          Available balance: {formatCurrency(availableBalance)}
                        </span>
                      );
                    }
                    return null;
                  })()
                ) : (
                  <span>
                    Company capital available:{" "}
                    {formatCurrency(financials.companyCapital)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="expense-description" className={LABEL_STYLES}>
            Description *
          </label>
          <input
            type="text"
            id="expense-description"
            placeholder="e.g., Domain Renewal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={INPUT_STYLES}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="expense-category" className={LABEL_STYLES}>
              Category *
            </label>
            <input
              type="text"
              id="expense-category"
              placeholder="e.g., Software"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={INPUT_STYLES}
              required
            />
          </div>
          <div>
            <label htmlFor="expense-type" className={LABEL_STYLES}>
              Expense Type *
            </label>
            <select
              id="expense-type"
              value={type}
              onChange={(e) => setType(e.target.value as ExpenseType)}
              className={INPUT_STYLES}
              required
            >
              <option value="personal">Personal</option>
              <option value="company">Company/Shared</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          <div>
            <label htmlFor="expense-by-whom" className={LABEL_STYLES}>
              {type === "company" ? "Paid By *" : "By Whom *"}
            </label>
            <select
              id="expense-by-whom"
              value={byWhom}
              onChange={(e) => setByWhom(e.target.value as PartnerName)}
              className={INPUT_STYLES}
              required
            >
              {activePartners.map((partner) => (
                <option key={partner.id} value={partner.name}>
                  {partner.displayName}
                </option>
              ))}
            </select>
            {type === "company" && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Company expenses will be split according to partner equity
                percentages. Each partner's share will be deducted from their
                wallet balance.
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle size={16} className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || activePartners.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-offset-slate-800"
        >
          {isSubmitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : isEditMode ? (
            <>
              <Save size={16} /> Save Changes
            </>
          ) : (
            <>
              <PlusCircle size={16} /> Add Expense
            </>
          )}
        </button>
      </form>


      {/* Confirmation Modal for Insufficient Funds */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={hideConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        variant={confirmation.variant}
        confirmText={confirmation.confirmText}
        cancelText="Cancel"
      />
    </div>
  );
};
