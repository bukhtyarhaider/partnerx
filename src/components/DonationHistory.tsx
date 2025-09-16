import type { DonationPayout } from "../types";
import { Building, Pencil, Trash2 } from "lucide-react";

interface DonationHistoryProps {
  donations: DonationPayout[];
  onEdit: (dp: DonationPayout) => void;
  onDelete: (id: number) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(amount);

export const DonationHistory: React.FC<DonationHistoryProps> = ({
  donations,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white p-2 sm:p-4 rounded-xl border border-slate-200">
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {donations.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                No donation payouts recorded yet.
              </p>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-wise-blue sm:pl-0"
                    >
                      Paid To & Date
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-wise-blue lg:table-cell"
                    >
                      Description
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
                  {donations.map((payout) => (
                    <tr key={payout.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full mr-4 bg-pink-100">
                            <Building className="text-pink-600" size={20} />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {payout.paidTo}
                            </div>
                            <div className="text-slate-500">
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
                      <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-slate-500 lg:table-cell">
                        {payout.description || "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-semibold text-wise-blue">
                        {formatCurrency(payout.amount)}
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => onEdit(payout)}
                            className="text-slate-500 hover:text-wise-green"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(payout.id)}
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
  );
};
