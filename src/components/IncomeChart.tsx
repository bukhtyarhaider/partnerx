import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { Info, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
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
      <div className="animate-fade-in-up rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800 md:p-4 max-w-[280px] md:max-w-none">
        <p className="mb-2 font-bold text-slate-800 dark:text-slate-50 text-sm md:text-base">
          {label}
        </p>
        <div className="space-y-1 text-xs md:text-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center min-w-0 flex-1">
              <span className="mr-2 h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-green-500 flex-shrink-0" />
              <p className="text-slate-500 dark:text-slate-400 truncate">
                Net Profit:
              </p>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-right">
              {formatCurrency(netProfit)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center min-w-0 flex-1">
              <span className="mr-2 h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-slate-400 flex-shrink-0" />
              <p className="text-slate-500 dark:text-slate-400 truncate">
                Deductions:
              </p>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-right">
              {formatCurrency(deductions)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-1 dark:border-slate-600">
            <p className="font-medium text-slate-500 dark:text-slate-400 min-w-0 flex-1 truncate">
              Gross Profit:
            </p>
            <p className="font-bold text-slate-800 dark:text-slate-50 text-right">
              {formatCurrency(grossProfit)}
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
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // Mobile optimizations
  const getMobileChartHeight = () => {
    if (isMobile) {
      return isExpanded ? "h-[60vh]" : "h-[35vh]";
    }
    return isExpanded
      ? isHorizontal
        ? "h-full md:h-[70vh]"
        : "h-[70vh]"
      : "h-[45vh]";
  };

  const getChartMargins = () => {
    if (isMobile) {
      return { top: 10, right: 15, left: 10, bottom: 10 };
    }
    return { top: 20, right: 30, left: 20, bottom: 0 };
  };

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 md:h-96 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 md:p-6 text-center dark:border-slate-700 dark:bg-slate-800">
        <Info
          size={isMobile ? 32 : 40}
          className="mb-3 md:mb-4 text-slate-400 dark:text-slate-500"
        />
        <h3 className="text-base md:text-lg font-semibold text-slate-700 dark:text-slate-200">
          No Income Data Available
        </h3>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          Add an income entry to see the chart.
        </p>
      </div>
    );
  }

  return (
    <ExpandableCard
      title="Income Analytics"
      isExpanded={isExpanded}
      onToggleExpand={() => {
        setIsExpanded(!isExpanded);
        if (isExpanded) {
          setIsHorizontal(false);
        } else if (!isMobile) {
          setIsHorizontal(true);
        }
      }}
      actionBar={{
        position: "left",
        content: isExpanded && !isMobile && (
          <button
            onClick={() => setIsHorizontal(!isHorizontal)}
            className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-green-600 hover:underline px-2 py-1 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          >
            <RotateCcw size={isMobile ? 14 : 16} />
            <span className="hidden sm:inline">
              {isHorizontal ? "Vertical View" : "Horizontal View"}
            </span>
            <span className="sm:hidden">
              {isHorizontal ? "Vertical" : "Horizontal"}
            </span>
          </button>
        ),
      }}
    >
      <div
        className={`
    relative w-full 
    ${getMobileChartHeight()}
    transition-all duration-500 ease-in-out
    rounded-xl bg-white dark:bg-slate-900
    overflow-hidden
  `}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            layout={isHorizontal && !isMobile ? "vertical" : "horizontal"}
            margin={getChartMargins()}
          >
            <defs>
              <linearGradient id="colorNetProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDeductions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Axis layout changes depending on orientation */}
            {isHorizontal && !isMobile ? (
              <>
                <YAxis
                  type="category"
                  dataKey="month"
                  stroke="var(--chart-axis)"
                  fontSize={isMobile ? 10 : 12}
                  tickLine={false}
                  axisLine={false}
                  width={isMobile ? 40 : 60}
                />
                <XAxis
                  type="number"
                  stroke="var(--chart-axis)"
                  fontSize={isMobile ? 10 : 12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatCurrencyForAxis}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="month"
                  stroke="var(--chart-axis)"
                  fontSize={isMobile ? 10 : 12}
                  tickLine={false}
                  axisLine={false}
                  interval={isMobile && chartData.length > 6 ? 1 : 0}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={isMobile ? 60 : 30}
                />
                <YAxis
                  stroke="var(--chart-axis)"
                  fontSize={isMobile ? 10 : 12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatCurrencyForAxis}
                  width={isMobile ? 40 : 60}
                />
              </>
            )}

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--chart-cursor)",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
              position={isMobile ? { x: 10, y: 10 } : undefined}
              allowEscapeViewBox={{ x: false, y: true }}
            />
            <Area
              type="monotone"
              dataKey="deductions"
              stackId="1"
              stroke="#94a3b8"
              strokeWidth={isMobile ? 1.5 : 2}
              fill="url(#colorDeductions)"
            />
            <Area
              type="monotone"
              dataKey="netProfit"
              stackId="1"
              stroke="#22c55e"
              strokeWidth={isMobile ? 1.5 : 2}
              fill="url(#colorNetProfit)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ExpandableCard>
  );
};
