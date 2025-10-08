import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type TooltipProps,
} from "recharts";
import {
  Info,
  RotateCcw,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
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
    const grossProfit =
      payload.find((p) => p.dataKey === "grossProfit")?.value ||
      netProfit + deductions;
    const transactions = (payload[0]?.payload as { transactions?: number })
      ?.transactions;

    return (
      <div className="animate-fade-in-up rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800 md:p-4 max-w-[280px] md:max-w-none">
        <p className="mb-2 font-bold text-slate-800 dark:text-slate-50 text-sm md:text-base">
          {label}
        </p>
        <div className="space-y-1 text-xs md:text-sm">
          {typeof grossProfit === "number" && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center min-w-0 flex-1">
                <span className="mr-2 h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                <p className="text-slate-500 dark:text-slate-400 truncate">
                  Gross Profit:
                </p>
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                {formatCurrency(grossProfit)}
              </p>
            </div>
          )}
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
          {typeof deductions === "number" && deductions > 0 && (
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
          )}
          {transactions && (
            <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-1 dark:border-slate-600">
              <p className="font-medium text-slate-500 dark:text-slate-400 min-w-0 flex-1 truncate">
                Transactions:
              </p>
              <p className="font-bold text-slate-800 dark:text-slate-50 text-right">
                {transactions}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

type TimePeriod = "daily" | "monthly" | "yearly";
type ChartType = "area" | "bar" | "line" | "source-breakdown";

const CHART_COLORS = [
  "#22c55e", // green-500
  "#3b82f6", // blue-500
  "#f59e0b", // amber-500
  "#ec4899", // pink-500
  "#8b5cf6", // violet-500
  "#14b8a6", // teal-500
  "#f97316", // orange-500
  "#06b6d4", // cyan-500
];

export const IncomeChart: React.FC<{ transactions: Transaction[] }> = ({
  transactions,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("monthly");
  const [chartType, setChartType] = useState<ChartType>("area");

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Process data based on selected time period
  const getChartData = () => {
    if (chartType === "source-breakdown") {
      // Group by income source
      const sourceData = transactions.reduce((acc, tx) => {
        if (!acc[tx.sourceId]) {
          acc[tx.sourceId] = { source: tx.sourceId, value: 0, netProfit: 0 };
        }
        acc[tx.sourceId].value += tx.calculations.grossPKR;
        acc[tx.sourceId].netProfit += tx.calculations.netProfit;
        return acc;
      }, {} as Record<string, { source: string; value: number; netProfit: number }>);

      return Object.values(sourceData).sort((a, b) => b.value - a.value);
    }

    // Time-based grouping
    const grouped = transactions.reduce((acc, tx) => {
      const date = new Date(tx.date);
      let key: string;

      switch (timePeriod) {
        case "daily":
          key = date.toLocaleDateString("default", {
            month: "short",
            day: "numeric",
            year: "2-digit",
          });
          break;
        case "yearly":
          key = date.getFullYear().toString();
          break;
        case "monthly":
        default:
          key = date.toLocaleString("default", {
            month: "short",
            year: "2-digit",
          });
          break;
      }

      if (!acc[key]) {
        acc[key] = {
          period: key,
          grossProfit: 0,
          netProfit: 0,
          transactions: 0,
          dateValue: date.getTime(),
        };
      }
      acc[key].grossProfit += tx.calculations.grossPKR;
      acc[key].netProfit += tx.calculations.netProfit;
      acc[key].transactions += 1;
      return acc;
    }, {} as Record<string, { period: string; grossProfit: number; netProfit: number; transactions: number; dateValue: number }>);

    return Object.values(grouped)
      .map((d) => ({
        ...d,
        deductions: d.grossProfit - d.netProfit,
        avgPerTransaction: d.grossProfit / d.transactions,
      }))
      .sort((a, b) => a.dateValue - b.dateValue);
  };

  const chartData = getChartData();

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

  // Calculate growth metrics
  const calculateGrowth = () => {
    if (chartData.length < 2 || chartType === "source-breakdown") return null;
    const current = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];
    const growth =
      ((current.netProfit - previous.netProfit) / previous.netProfit) * 100;
    return { growth, isPositive: growth > 0 };
  };

  const growthData = calculateGrowth();

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
        content: (
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 -mb-2 md:flex-wrap md:overflow-x-visible">
            {/* Time Period Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 flex-shrink-0">
              {(["daily", "monthly", "yearly"] as TimePeriod[]).map(
                (period) => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period)}
                    className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-md transition-all whitespace-nowrap ${
                      timePeriod === period
                        ? "bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 font-semibold shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                )
              )}
            </div>

            {/* Chart Type Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 flex-shrink-0">
              {(
                [
                  { type: "area", icon: TrendingUp, label: "Area" },
                  { type: "bar", icon: BarChart3, label: "Bar" },
                  { type: "line", icon: TrendingUp, label: "Line" },
                  {
                    type: "source-breakdown",
                    icon: PieChartIcon,
                    label: "Sources",
                  },
                ] as const
              ).map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-md transition-all flex items-center gap-1 whitespace-nowrap ${
                    chartType === type
                      ? "bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                  title={label}
                >
                  <Icon size={14} />
                  {!isMobile && <span>{label}</span>}
                </button>
              ))}
            </div>

            {/* Horizontal/Vertical Toggle */}
            {isExpanded && !isMobile && chartType !== "source-breakdown" && (
              <button
                onClick={() => setIsHorizontal(!isHorizontal)}
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-green-600 hover:underline px-2 py-1 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex-shrink-0"
              >
                <RotateCcw size={isMobile ? 14 : 16} />
                <span className="hidden sm:inline">
                  {isHorizontal ? "Vertical" : "Horizontal"}
                </span>
              </button>
            )}

            {/* Growth Indicator */}
            {growthData && isExpanded && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs md:text-sm font-semibold flex-shrink-0 ${
                  growthData.isPositive
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                <TrendingUp
                  size={14}
                  className={growthData.isPositive ? "" : "rotate-180"}
                />
                <span>
                  {growthData.isPositive ? "+" : ""}
                  {growthData.growth.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
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
          {chartType === "source-breakdown" ? (
            <PieChart margin={getChartMargins()}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 80 : 120}
                label={isMobile ? false : undefined}
                labelLine={!isMobile}
              >
                {chartData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="animate-fade-in-up rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                        <p className="font-bold text-slate-800 dark:text-slate-50 text-sm mb-2">
                          {payload[0].payload.source}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Gross: {formatCurrency(payload[0].value)}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Net: {formatCurrency(payload[0].payload.netProfit)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: isMobile ? "10px" : "12px" }}
              />
            </PieChart>
          ) : chartType === "bar" ? (
            <BarChart
              data={chartData}
              layout={isHorizontal && !isMobile ? "vertical" : "horizontal"}
              margin={getChartMargins()}
            >
              {isHorizontal && !isMobile ? (
                <>
                  <YAxis
                    type="category"
                    dataKey="period"
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
                    dataKey="period"
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
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="netProfit" fill="#22c55e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="deductions" fill="#94a3b8" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart
              data={chartData}
              layout={isHorizontal && !isMobile ? "vertical" : "horizontal"}
              margin={getChartMargins()}
            >
              {isHorizontal && !isMobile ? (
                <>
                  <YAxis
                    type="category"
                    dataKey="period"
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
                    dataKey="period"
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
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="grossProfit"
                stroke="#3b82f6"
                strokeWidth={isMobile ? 2 : 3}
                dot={{ fill: "#3b82f6", r: isMobile ? 3 : 5 }}
              />
              <Line
                type="monotone"
                dataKey="netProfit"
                stroke="#22c55e"
                strokeWidth={isMobile ? 2 : 3}
                dot={{ fill: "#22c55e", r: isMobile ? 3 : 5 }}
              />
            </LineChart>
          ) : (
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
                <linearGradient
                  id="colorDeductions"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>

              {isHorizontal && !isMobile ? (
                <>
                  <YAxis
                    type="category"
                    dataKey="period"
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
                    dataKey="period"
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
          )}
        </ResponsiveContainer>
      </div>
    </ExpandableCard>
  );
};
