import {
  Youtube,
  Clapperboard,
  Landmark,
  Users,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Transaction } from "../types";

interface TransactionHistoryProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(amount);

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white p-2 sm:p-4 rounded-xl h-[50vh] border border-slate-200 overflow-y-auto hide-scrollbar">
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {transactions.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                No income found.
              </p>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-wise-blue sm:pl-0"
                    >
                      Source & Date
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-wise-blue sm:table-cell"
                    >
                      Details
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-wise-blue"
                    >
                      Partner Share
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right text-sm font-semibold text-wise-blue"
                    >
                      Net Profit
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
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full mr-4 ${
                              tx.source === "youtube"
                                ? "bg-red-100"
                                : "bg-slate-200"
                            }`}
                          >
                            {tx.source === "youtube" ? (
                              <Youtube className="text-red-500" />
                            ) : (
                              <Clapperboard />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {tx.source === "youtube" ? "YouTube" : "TikTok"}
                            </div>
                            <div className="text-slate-500">
                              {new Date(tx.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                        <div className="font-medium text-slate-700">
                          ${tx.amountUSD.toFixed(2)} @ {tx.conversionRate}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Landmark size={14} /> {tx.bank}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                          <Users size={16} className="text-sky-600" />
                          {formatCurrency(tx.calculations.partnerShare)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-bold text-green-600">
                        {formatCurrency(tx.calculations.netProfit)}
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => onEdit(tx)}
                            className="text-slate-500 hover:text-wise-green"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(tx.id)}
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
