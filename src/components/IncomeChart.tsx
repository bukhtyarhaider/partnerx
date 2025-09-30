import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { Info } from "lucide-react";
import { useState } from "react";
import type { Transaction } from "../types";
import { ExpandableCard } from "./common/ExpandableCard";
import { formatCurrency, formatCurrencyForAxis } from "../utils/format";

const CustomTooltip: React.FC<
  TooltipProps<number, string> & {
    payload?: Array<Record<string, never>>;
    label?: string | number;
  }
> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const netProfit =
      payload.find((p) => p.dataKey === "netProfit")?.value || 0;
    const deductions =
      payload.find((p) => p.dataKey === "deductions")?.value || 0;
    const grossProfit = netProfit + deductions;

    return (
      <div className="animate-fade-in-up rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 font-bold text-slate-800 dark:text-slate-50">
          {label}
        </p>
        <div className="space-y-1 text-sm">
          {/* Net Profit Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green-500"></span>
              <p className="text-slate-500 dark:text-slate-400">Net Profit:</p>
            </div>
            <p className="ml-4 font-semibold text-slate-800 dark:text-slate-200">
              {formatCurrency(netProfit as number)}
            </p>
          </div>
          {/* Deductions Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-slate-400"></span>
              <p className="text-slate-500 dark:text-slate-400">Deductions:</p>
            </div>
            <p className="ml-4 font-semibold text-slate-800 dark:text-slate-200">
              {formatCurrency(deductions as number)}
            </p>
          </div>
          {/* Gross Profit Row */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-1 dark:border-slate-600">
            <p className="font-medium text-slate-500 dark:text-slate-400">
              Gross Profit:
            </p>
            <p className="ml-4 font-bold text-slate-800 dark:text-slate-50">
              {formatCurrency(grossProfit as number)}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const IncomeChart: React.FC<{ transactions: Transaction[] }> = ({
  transactions,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Process transaction data for the chart
  const chartData = Object.values(
    transactions.reduce((acc, tx) => {
      const month = new Date(tx.date).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (!acc[month]) {
        acc[month] = { month, grossProfit: 0, netProfit: 0 };
      }
      acc[month].grossProfit += tx.calculations.grossPKR;
      acc[month].netProfit += tx.calculations.netProfit;
      return acc;
    }, {} as Record<string, { month: string; grossProfit: number; netProfit: number }>)
  )
    .map((d) => ({ ...d, deductions: d.grossProfit - d.netProfit }))
    .sort(
      (a, b) =>
        new Date(`1 ${a.month}`).getTime() - new Date(`1 ${b.month}`).getTime()
    );

  if (chartData.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800">
        <Info size={40} className="mb-4 text-slate-400 dark:text-slate-500" />
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          No Income Data Available
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          Add an income entry to see the chart.
        </p>
      </div>
    );
  }

  return (
    <ExpandableCard
      title="Income Analytics"
      isExpanded={isExpanded}
      onToggleExpand={() => setIsExpanded(!isExpanded)}
    >
      {/* Container with smooth height transition */}
      <div
        className={`bg-white rounded-xl dark:bg-slate-900 transition-all duration-500 ease-in-out ${
          isExpanded ? "h-[80vh]" : "h-[50vh]"
        }`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
          >
            <defs>
              {/* Gradients work in both light and dark mode */}
              <linearGradient id="colorNetProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDeductions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid and Axis lines now use CSS variables for dynamic theme switching */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--chart-grid)"
            />
            <XAxis
              dataKey="month"
              stroke="var(--chart-axis)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--chart-axis)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrencyForAxis}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--chart-cursor)",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />

            <Area
              type="monotone"
              dataKey="deductions"
              stackId="1"
              stroke="#94a3b8"
              strokeWidth={2}
              fill="url(#colorDeductions)"
            />
            <Area
              type="monotone"
              dataKey="netProfit"
              stackId="1"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorNetProfit)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ExpandableCard>
  );
};
