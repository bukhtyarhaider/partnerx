import { useState } from "react";
import type { Expense } from "../types";
import { Pencil, Trash2 } from "lucide-react";
import { ExpandableCard } from "./common/ExpandableCard";

interface ExpenseHistoryProps {
  expenses: Expense[];
  onEdit: (ex: Expense) => void;
  onDelete: (id: number) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(amount);

export const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({
  expenses,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <ExpandableCard
      title="Expense History"
      isExpanded={isExpanded}
      onToggleExpand={handleToggleExpand}
    >
      <div
        className={`hide-scrollbar bg-white ${
          isExpanded ? "h-full overflow-y-auto" : "h-[50vh] overflow-y-auto"
        }`}
      >
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {expenses.length === 0 ? (
                <p className="text-center text-slate-500 py-8">
                  No expenses found.
                </p>
              ) : (
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-wise-blue sm:pl-0"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-wise-blue"
                      >
                        Spent By
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-right text-sm font-semibold text-wise-blue"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expenses.map((ex) => (
                      <tr key={ex.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="font-medium text-slate-900">
                            {ex.description}
                          </div>
                          <div className="text-slate-500">
                            {new Date(ex.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                              ex.byWhom === "Bukhtyar"
                                ? "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20"
                                : "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-600/20"
                            }`}
                          >
                            {ex.byWhom}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-semibold text-red-600">
                          {formatCurrency(ex.amount)}
                        </td>
                        <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => onEdit(ex)}
                              className="text-slate-500 hover:text-wise-green"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => onDelete(ex.id)}
                              className="text-slate-500 hover:text-red-500"
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
        </div>
      </div>
    </ExpandableCard>
  );
};
