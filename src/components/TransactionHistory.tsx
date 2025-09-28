import React, { useState } from "react";
import { Youtube, Landmark, Pencil, Trash2, ReceiptText } from "lucide-react";
import type { Transaction } from "../types";
import TikTok from "/tiktok.png";
import { ExpandableCard } from "./common/ExpandableCard";

interface TransactionHistoryProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
}

// Create formatters outside the component for better performance
const pkrFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  minimumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <ExpandableCard
      title="Transaction History"
      isExpanded={isExpanded}
      onToggleExpand={handleToggleExpand}
    >
      <div
        className={`hide-scrollbar ${
          isExpanded ? "h-full overflow-y-auto" : "h-[50vh] overflow-y-auto"
        }`}
      >
        <div className="relative">
          {transactions.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No income found.</p>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-slate-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-wise-blue backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                  >
                    Source & Date
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 hidden border-b border-slate-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-wise-blue backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Details
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-slate-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-wise-blue backdrop-blur backdrop-filter"
                  >
                    Tax Amount
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-slate-300 bg-white bg-opacity-75 px-3 py-3.5 text-right text-sm font-semibold text-wise-blue backdrop-blur backdrop-filter"
                  >
                    Net Profit
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-slate-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 lg:pl-8">
                      <div className="flex items-center">
                        <div
                          className={`p-1 h-8 w-8 rounded-full mr-4 flex justify-center items-center ${
                            tx.source === "youtube"
                              ? "bg-red-100"
                              : "bg-slate-200"
                          }`}
                        >
                          {tx.source === "youtube" ? (
                            <Youtube className="text-red-500" />
                          ) : (
                            <img
                              src={TikTok}
                              alt="TikTok"
                              className="text-slate-500"
                            />
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
                    <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-slate-500 sm:table-cell">
                      <div className="font-medium text-slate-700">
                        {usdFormatter.format(tx.amountUSD)} @{" "}
                        {tx.conversionRate}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Landmark size={14} /> {tx.bank}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <ReceiptText size={16} className="text-red-600" />
                        <div>
                          <div className="font-medium text-slate-700">
                            {pkrFormatter.format(tx.calculations.taxAmount)}
                          </div>
                          <div className="text-xs text-slate-400">
                            {usdFormatter.format(
                              tx.calculations.taxAmount / tx.conversionRate
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm">
                      <div className="font-bold text-green-600">
                        {pkrFormatter.format(tx.calculations.netProfit)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {usdFormatter.format(
                          tx.calculations.netProfit / tx.conversionRate
                        )}
                      </div>
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
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
    </ExpandableCard>
  );
};
