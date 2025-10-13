import React, { useState } from "react";
import { Landmark, Pencil, Trash2, ReceiptText } from "lucide-react";
import type { Transaction } from "../types";
import { ExpandableCard } from "./common/ExpandableCard";
import { ConfirmationModal } from "./common/ConfirmationModal";
import { pkrFormatter, usdFormatter } from "../utils";
import { useIncomeSources } from "../hooks/useIncomeSources";
import { IncomeSourceDisplay } from "./common/IncomeSourceDisplay";
import { useConfirmation } from "../hooks/useConfirmation";

interface TransactionHistoryProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
  actionBtn: React.ReactNode;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  actionBtn,
  transactions,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getSourceById } = useIncomeSources();
  const { confirmation, showConfirmation, hideConfirmation } =
    useConfirmation();

  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  const handleDeleteClick = (transaction: Transaction) => {
    showConfirmation({
      title: "Delete Transaction",
      message: `Are you sure you want to delete this transaction (${usdFormatter.format(
        transaction.amountUSD
      )})? This action cannot be undone.`,
      confirmText: "Delete Transaction",
      variant: "danger",
      onConfirm: () => onDelete(transaction.id),
    });
  };

  const thClasses =
    "sticky top-0 z-10 border-b border-slate-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-slate-800 backdrop-blur backdrop-filter dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-200";

  return (
    <ExpandableCard
      title="Transaction History"
      isExpanded={isExpanded}
      onToggleExpand={handleToggleExpand}
      actionBar={{
        position: "right",
        content: actionBtn,
      }}
    >
      <div
        className={`dark:bg-slate-900/50 ${
          isExpanded ? "h-full" : "h-full lg:h-[50vh]"
        }  overflow-y-auto rounded-xl hide-scrollbar`}
      >
        <div className="relative">
          {transactions.length === 0 ? (
            <p className="py-8 text-center text-slate-500 dark:text-slate-400">
              No income transactions found.
            </p>
          ) : (
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className={`${thClasses} pl-4 sm:pl-6 lg:pl-8`}
                  >
                    Source & Date
                  </th>
                  <th
                    scope="col"
                    className={`${thClasses} hidden sm:table-cell`}
                  >
                    Details
                  </th>
                  <th scope="col" className={thClasses}>
                    Tax Amount
                  </th>
                  <th scope="col" className={`${thClasses} text-right`}>
                    Net Profit
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
                {transactions.map((tx, index) => (
                  <tr
                    key={tx.id}
                    className="animate-row-in transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 lg:pl-8">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const source = getSourceById(tx.sourceId);
                          return (
                            <>
                              {source ? (
                                <IncomeSourceDisplay
                                  source={source}
                                  className=""
                                  date={new Date(tx.date).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                />
                              ) : (
                                <div className="flex items-center">
                                  <div className="mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">
                                      ?
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-slate-900 dark:text-slate-50">
                                      Unknown Source
                                    </div>
                                    <div className="text-sm text-red-500 dark:text-red-400">
                                      Source ID: {tx.sourceId}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {/* Currency Badge */}
                              {tx.currency === "PKR" && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                  PKR
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-slate-500 sm:table-cell">
                      <div className="font-medium text-slate-700 dark:text-slate-300">
                        {tx.currency === "PKR" && tx.amount ? (
                          // PKR transaction
                          <span>
                            {pkrFormatter.format(tx.amount)}{" "}
                            <span className="text-xs text-slate-400">PKR</span>
                          </span>
                        ) : (
                          // USD transaction
                          <span>
                            {usdFormatter.format(tx.amountUSD)} @{" "}
                            {tx.conversionRate}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Landmark size={14} /> {tx.bank}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <ReceiptText size={16} className="text-red-500" />
                        <div>
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {pkrFormatter.format(tx.calculations.taxAmount)}
                          </div>
                          {tx.currency !== "PKR" && tx.conversionRate > 1 && (
                            <div className="text-xs text-slate-400 dark:text-slate-500">
                              {usdFormatter.format(
                                tx.calculations.taxAmount / tx.conversionRate
                              )}
                            </div>
                          )}
                          {tx.taxConfig && (
                            <div className="text-xs text-blue-500 dark:text-blue-400">
                              {tx.taxConfig.type === "percentage"
                                ? `${tx.taxConfig.value}%`
                                : `₨${tx.taxConfig.value} fixed`}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {pkrFormatter.format(tx.calculations.netProfit)}
                      </div>
                      {tx.currency !== "PKR" && tx.conversionRate > 1 && (
                        <div className="text-xs text-slate-400 dark:text-slate-500">
                          {usdFormatter.format(
                            tx.calculations.netProfit / tx.conversionRate
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => onEdit(tx)}
                          className="text-slate-400 transition-all hover:scale-110 hover:text-green-500 dark:text-slate-500 dark:hover:text-green-400"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(tx)}
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
