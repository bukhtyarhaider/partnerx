import React, { useState } from "react";
import type { Expense } from "../types";
import { Pencil, Trash2 } from "lucide-react";
import { ExpandableCard } from "./common/ExpandableCard";
import { formatCurrency } from "../utils";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggleExpand = () => setIsExpanded(!isExpanded);

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
          isExpanded ? "h-full overflow-y-auto" : "h-[50vh] overflow-y-auto"
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
                          ex.byWhom === "Bukhtyar"
                            ? "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-900/50 dark:text-sky-300 dark:ring-sky-400/20"
                            : "bg-teal-50 text-teal-700 ring-teal-600/20 dark:bg-teal-900/50 dark:text-teal-300 dark:ring-teal-400/20"
                        }`}
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
                          onClick={() => onDelete(ex.id)}
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
    </ExpandableCard>
  );
};
