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
import type { Transaction } from "../types";
import { Info } from "lucide-react";
import { ExpandableCard } from "./common/ExpandableCard";
import { useState } from "react";

interface ChartProps {
  transactions: Transaction[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatCurrencyForAxis = (value: number) =>
  `₨${Math.round(value / 1000)}k`;

// 1. Custom Tooltip Component for a much nicer hover effect
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
      <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200">
        <p className="font-bold text-wise-blue mb-2">{label}</p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-wise-green mr-2"></span>
              <p className="text-slate-500">Net Profit:</p>
            </div>
            <p className="font-semibold text-slate-800 ml-4">
              {formatCurrency(netProfit)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 mr-2"></span>
              <p className="text-slate-500">Deductions:</p>
            </div>
            <p className="font-semibold text-slate-800 ml-4">
              {formatCurrency(deductions)}
            </p>
          </div>
          <div className="border-t my-1 pt-1 border-slate-200 flex items-center justify-between">
            <p className="text-slate-500 font-medium">Gross Profit:</p>
            <p className="font-bold text-wise-blue ml-4">
              {formatCurrency(grossProfit)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const IncomeChart: React.FC<ChartProps> = ({ transactions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  const data = transactions.reduce((acc, tx) => {
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
  }, {} as Record<string, { month: string; grossProfit: number; netProfit: number }>);

  const chartData = Object.values(data)
    .map((d) => ({
      ...d,
      deductions: d.grossProfit - d.netProfit,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()); // Sort chronologically

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 h-96 flex flex-col items-center justify-center text-center">
        <Info size={40} className="text-slate-400 mb-4" />
        <h3 className="text-lg font-semibold text-wise-blue">
          No Income Data Available
        </h3>
        <p className="text-slate-500">Add an income entry to see the chart.</p>
      </div>
    );
  }

  return (
    <ExpandableCard
      title="Income Analytics"
      isExpanded={isExpanded}
      onToggleExpand={handleToggleExpand}
    >
      <div
        className={`hide-scrollbar bg-white ${
          isExpanded ? "h-full overflow-y-auto" : "h-[50vh] overflow-y-auto"
        }`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
          >
            {/* 2. Define the gradients for our areas */}
            <defs>
              <linearGradient id="colorNetProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B98D" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00B98D" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDeductions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A0AEC0" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#A0AEC0" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrencyForAxis}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="deductions"
              stackId="1"
              stroke="#A0AEC0"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDeductions)"
              name="Deductions"
            />
            <Area
              type="monotone"
              dataKey="netProfit"
              stackId="1"
              stroke="#00B98D"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorNetProfit)"
              name="Net Profit"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ExpandableCard>
  );
};
