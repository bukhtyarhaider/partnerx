import React, { useState } from "react";
import type { Expense } from "../types";
import { Pencil, Trash2 } from "lucide-react";
import { ExpandableCard } from "./common/ExpandableCard";
import { ConfirmationModal } from "./common/ConfirmationModal";
import { formatCurrency } from "../utils";
import { usePartners } from "../hooks/usePartners";
import { useConfirmation } from "../hooks/useConfirmation";

interface ExpenseHistoryProps {
  expenses: Expense[];
  onEdit: (ex: Expense) => void;
  onDelete: (id: number) => void;
}

export const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({
  expenses,
  onEdit,
  onDelete,
}) => {
  const { activePartners } = usePartners();
  const [isExpanded, setIsExpanded] = useState(false);
  const { confirmation, showConfirmation, hideConfirmation } =
    useConfirmation();

  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  const handleDeleteClick = (expense: Expense) => {
    showConfirmation({
      title: "Delete Expense",
      message: `Are you sure you want to delete "${
        expense.description
      }" (${formatCurrency(expense.amount)})? This action cannot be undone.`,
      confirmText: "Delete Expense",
      variant: "danger",
      onConfirm: () => onDelete(expense.id),
    });
  };

  // Helper function to get partner color based on index
  const getPartnerColor = (partnerName: string) => {
    const partnerIndex = activePartners.findIndex(
      (p) => p.name === partnerName
    );
    const colors = [
      "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-900/50 dark:text-sky-300 dark:ring-sky-400/20",
      "bg-teal-50 text-teal-700 ring-teal-600/20 dark:bg-teal-900/50 dark:text-teal-300 dark:ring-teal-400/20",
      "bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-900/50 dark:text-purple-300 dark:ring-purple-400/20",
      "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-900/50 dark:text-orange-300 dark:ring-orange-400/20",
      "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/50 dark:text-rose-300 dark:ring-rose-400/20",
    ];
    return colors[partnerIndex % colors.length] || colors[0];
  };

  const thClasses =
    "sticky top-0 z-10 border-b border-slate-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-slate-800 backdrop-blur backdrop-filter dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-200";

  return (
    <ExpandableCard
      title="Expense History"
      isExpanded={isExpanded}
      onToggleExpand={handleToggleExpand}
    >
      <div
        className={`hide-scrollbar dark:bg-slate-900/50 rounded-xl ${
          isExpanded
            ? "h-full overflow-y-auto"
            : " h-full lg:h-[50vh] overflow-y-auto"
        }`}
      >
        <div className="relative">
          {expenses.length === 0 ? (
            <p className="py-8 text-center text-slate-500 dark:text-slate-400">
              No expenses found.
            </p>
          ) : (
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className={`${thClasses} pl-4 sm:pl-6 lg:pl-8`}
                  >
                    Description
                  </th>
                  <th scope="col" className={thClasses}>
                    Type
                  </th>
                  <th scope="col" className={thClasses}>
                    Spent By
                  </th>
                  <th scope="col" className={`${thClasses} text-right`}>
                    Amount
                  </th>
                  <th
                    scope="col"
                    className={`${thClasses} py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8`}
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expenses.map((ex, index) => (
                  <tr
                    key={ex.id}
                    className="animate-row-in transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 lg:pl-8">
                      <div className="font-medium text-slate-900 dark:text-slate-50">
                        {ex.description}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">
                        {new Date(ex.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          (ex.type || "personal") === "company"
                            ? "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/50 dark:text-blue-300 dark:ring-blue-400/20"
                            : "bg-slate-50 text-slate-700 ring-slate-600/20 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-slate-400/20"
                        }`}
                      >
                        {(ex.type || "personal") === "company"
                          ? "Company"
                          : "Personal"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getPartnerColor(
                          ex.byWhom
                        )}`}
                      >
                        {ex.byWhom}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(ex.amount)}
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => onEdit(ex)}
                          className="text-slate-400 transition-all hover:scale-110 hover:text-green-500 dark:text-slate-500 dark:hover:text-green-400"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(ex)}
                          className="text-slate-400 transition-all hover:scale-110 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={hideConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        variant={confirmation.variant}
      />
    </ExpandableCard>
  );
};
