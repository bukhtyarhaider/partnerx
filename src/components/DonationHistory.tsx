import React from "react";
import type { DonationPayout } from "../types";
import { Building, Pencil, Trash2 } from "lucide-react";
import { ConfirmationModal } from "./common/ConfirmationModal";
import { formatCurrency } from "../utils";
import { useConfirmation } from "../hooks/useConfirmation";

interface DonationHistoryProps {
  donations: DonationPayout[];
  onEdit: (dp: DonationPayout) => void;
  onDelete: (id: number) => void;
}

export const DonationHistory: React.FC<DonationHistoryProps> = ({
  donations,
  onEdit,
  onDelete,
}) => {
  const { confirmation, showConfirmation, hideConfirmation } =
    useConfirmation();

  const handleDeleteClick = (donation: DonationPayout) => {
    showConfirmation({
      title: "Delete Donation",
      message: `Are you sure you want to delete donation to "${
        donation.paidTo
      }" (${formatCurrency(donation.amount)})? This action cannot be undone.`,
      confirmText: "Delete Donation",
      variant: "danger",
      onConfirm: () => onDelete(donation.id),
    });
  };
  const thClasses =
    "sticky top-0 z-10 border-b border-slate-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-slate-800 backdrop-blur backdrop-filter dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-200";

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="h-full overflow-y-auto rounded-xl">
          <div className="relative">
            {donations.length === 0 ? (
              <p className="py-8 text-center text-slate-500 dark:text-slate-400">
                No donation payouts recorded yet.
              </p>
            ) : (
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className={`${thClasses} pl-4 sm:pl-6 lg:pl-8`}
                    >
                      Paid To & Date
                    </th>
                    <th
                      scope="col"
                      className={`${thClasses} hidden lg:table-cell`}
                    >
                      Description
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
                  {donations.map((payout, index) => (
                    <tr
                      key={payout.id}
                      className="animate-row-in transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 lg:pl-8">
                        <div className="flex items-center">
                          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/50">
                            <Building
                              className="text-pink-600 dark:text-pink-400"
                              size={20}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-slate-50">
                              {payout.paidTo}
                            </div>
                            <div className="text-slate-500 dark:text-slate-400">
                              {new Date(payout.date).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 lg:table-cell">
                        {payout.description || "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {formatCurrency(payout.amount)}
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => onEdit(payout)}
                            className="text-slate-400 transition-all hover:scale-110 hover:text-green-500 dark:text-slate-500 dark:hover:text-green-400"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(payout)}
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
    </>
  );
};
