import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type TooltipProps,
  AreaChart,
  Area,
} from "recharts";
import { Info, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import type { Expense } from "../types";
import { ExpandableCard } from "./common/ExpandableCard";
import { formatCurrency } from "../utils/format";
import { useBusinessInfo } from "../hooks/useBusinessInfo";

type ExpenseView = "category" | "type" | "trend" | "partner";
type PartnerChartType = "pie" | "area";

const EXPENSE_COLORS = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#f59e0b", // amber-500
  "#84cc16", // lime-500
  "#22c55e", // green-500
  "#14b8a6", // teal-500
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
];

const CustomTooltip: React.FC<
  TooltipProps<number, string> & {
    payload?: Array<Record<string, never>>;
    label?: string | number;
  }
> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="animate-fade-in-up rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 font-bold text-slate-800 dark:text-slate-50 text-sm">
          {label}
        </p>
        <div className="space-y-1 text-xs">
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center">
                <span
                  className="mr-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <p className="text-slate-500 dark:text-slate-400">
                  {entry.name}:
                </p>
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {formatCurrency(Number(entry.value))}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const ExpenseAnalytics: React.FC<{ expenses: Expense[] }> = ({
  expenses,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState<ExpenseView>("category");
  const [partnerChartType, setPartnerChartType] =
    useState<PartnerChartType>("pie");
  const { isBusinessMode } = useBusinessInfo();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getChartData = () => {
    if (view === "category") {
      // Group by category
      const categoryData = expenses.reduce((acc, expense) => {
        const category = expense.category || "Uncategorized";
        if (!acc[category]) {
          acc[category] = { name: category, value: 0, count: 0 };
        }
        acc[category].value += expense.amount;
        acc[category].count += 1;
        return acc;
      }, {} as Record<string, { name: string; value: number; count: number }>);

      return Object.values(categoryData).sort((a, b) => b.value - a.value);
    } else if (view === "type") {
      // Group by personal vs company
      const typeData = expenses.reduce((acc, expense) => {
        const type =
          (expense.type || "personal") === "personal" ? "Personal" : "Company";
        if (!acc[type]) {
          acc[type] = { name: type, value: 0, count: 0 };
        }
        acc[type].value += expense.amount;
        acc[type].count += 1;
        return acc;
      }, {} as Record<string, { name: string; value: number; count: number }>);

      return Object.values(typeData);
    } else if (view === "partner") {
      // Group by partner and type (personal/company)
      const partnerData = expenses.reduce((acc, expense) => {
        const partner = expense.byWhom || "Unknown";
        const expenseType =
          (expense.type || "personal") === "personal" ? "Personal" : "Company";
        const key = `${partner} (${expenseType})`;

        if (!acc[key]) {
          acc[key] = {
            name: key,
            value: 0,
            count: 0,
            partner,
            type: expenseType,
          };
        }
        acc[key].value += expense.amount;
        acc[key].count += 1;
        return acc;
      }, {} as Record<string, { name: string; value: number; count: number; partner: string; type: string }>);

      return Object.values(partnerData).sort((a, b) => b.value - a.value);
    } else {
      // Trend over time (monthly)
      const trendData = expenses.reduce((acc, expense) => {
        const date = new Date(expense.date);
        const month = date.toLocaleString("default", {
          month: "short",
          year: "2-digit",
        });

        if (!acc[month]) {
          acc[month] = {
            month,
            Personal: 0,
            Company: 0,
            dateValue: date.getTime(),
          };
        }

        const type =
          (expense.type || "personal") === "personal" ? "Personal" : "Company";
        acc[month][type] += expense.amount;

        return acc;
      }, {} as Record<string, { month: string; Personal: number; Company: number; dateValue: number }>);

      return Object.values(trendData).sort((a, b) => a.dateValue - b.dateValue);
    }
  };

  const getPartnerTrendData = () => {
    // Get unique partners
    const partners = Array.from(
      new Set(expenses.map((exp) => exp.byWhom || "Unknown"))
    );

    // Create data keys for each partner (personal and company)
    const dataKeys: string[] = [];
    partners.forEach((partner) => {
      dataKeys.push(`${partner} (Personal)`, `${partner} (Company)`);
    });

    // Group expenses by month, partner, and type
    const trendData = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const month = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      const partner = expense.byWhom || "Unknown";
      const expenseType =
        (expense.type || "personal") === "personal" ? "Personal" : "Company";
      const key = `${partner} (${expenseType})`;

      if (!acc[month]) {
        acc[month] = {
          month,
          dateValue: date.getTime(),
        } as Record<string, string | number>;

        // Initialize all partner expense types to 0
        dataKeys.forEach((k) => {
          acc[month][k] = 0;
        });
      }

      acc[month][key] = (acc[month][key] as number) + expense.amount;

      return acc;
    }, {} as Record<string, Record<string, string | number>>);

    return {
      data: Object.values(trendData).sort(
        (a, b) => (a.dateValue as number) - (b.dateValue as number)
      ),
      dataKeys,
      partners,
    };
  };

  const chartData = getChartData();
  const partnerTrendData =
    view === "partner" && partnerChartType === "area"
      ? getPartnerTrendData()
      : { data: [], partners: [], dataKeys: [] };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const personalExpenses = expenses
    .filter((exp) => (exp.type || "personal") === "personal")
    .reduce((sum, exp) => sum + exp.amount, 0);
  const companyExpenses = expenses
    .filter((exp) => exp.type === "company")
    .reduce((sum, exp) => sum + exp.amount, 0);

  if (expenses.length === 0) {
    return (
      <div className="flex h-64 md:h-96 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 md:p-6 text-center dark:border-slate-700 dark:bg-slate-800">
        <Info
          size={isMobile ? 32 : 40}
          className="mb-3 md:mb-4 text-slate-400 dark:text-slate-500"
        />
        <h3 className="text-base md:text-lg font-semibold text-slate-700 dark:text-slate-200">
          No Expense Data Available
        </h3>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          Add an expense to see analytics.
        </p>
      </div>
    );
  }

  return (
    <ExpandableCard
      title="Expense Analytics"
      isExpanded={isExpanded}
      onToggleExpand={() => setIsExpanded(!isExpanded)}
      actionBar={{
        position: "left",
        content: (
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 -mb-2 md:flex-wrap md:overflow-x-visible">
            {/* View Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 flex-shrink-0">
              {[
                {
                  type: "category" as const,
                  label: "By Category",
                  showAlways: true,
                },
                { type: "type" as const, label: "By Type", showAlways: true },
                {
                  type: "partner" as const,
                  label: "By Partner",
                  showAlways: false,
                },
                { type: "trend" as const, label: "Trend", showAlways: true },
              ]
                .filter(({ showAlways }) => showAlways || isBusinessMode)
                .map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => setView(type)}
                    className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-md transition-all whitespace-nowrap ${
                      view === type
                        ? "bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 font-semibold shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
            </div>

            {/* Partner Chart Type Toggle */}
            {view === "partner" && isBusinessMode && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 flex-shrink-0">
                <button
                  onClick={() => setPartnerChartType("pie")}
                  className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-md transition-all whitespace-nowrap ${
                    partnerChartType === "pie"
                      ? "bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Pie
                </button>
                <button
                  onClick={() => setPartnerChartType("area")}
                  className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-md transition-all whitespace-nowrap ${
                    partnerChartType === "area"
                      ? "bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Trend
                </button>
              </div>
            )}

            {/* Summary Stats */}
            {isExpanded && (
              <div className="flex items-center gap-2 text-xs md:text-sm flex-shrink-0">
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 whitespace-nowrap">
                  <TrendingDown size={14} />
                  <span className="font-semibold">
                    {formatCurrency(totalExpenses)}
                  </span>
                </div>
                {companyExpenses > 0 && (
                  <>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      Personal: {formatCurrency(personalExpenses)}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      Company: {formatCurrency(companyExpenses)}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        ),
      }}
    >
      <div
        className={`relative w-full ${
          isExpanded ? "h-[60vh] md:h-[70vh]" : "h-[35vh] md:h-[45vh]"
        } transition-all duration-500 ease-in-out rounded-xl bg-white dark:bg-slate-900 overflow-hidden`}
      >
        <ResponsiveContainer width="100%" height="100%">
          {view === "trend" ? (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
            >
              <XAxis
                dataKey="month"
                stroke="var(--chart-axis)"
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                axisLine={false}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 60 : 30}
              />
              <YAxis
                stroke="var(--chart-axis)"
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                width={isMobile ? 40 : 60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: isMobile ? "10px" : "12px" }}
              />
              <Bar dataKey="Personal" fill="#ef4444" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Company" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : view === "partner" && partnerChartType === "pie" ? (
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 80 : 120}
                label={isMobile ? false : undefined}
                labelLine={!isMobile}
              >
                {chartData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as {
                      name: string;
                      value: number;
                      count: number;
                    };
                    return (
                      <div className="animate-fade-in-up rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                        <p className="font-bold text-slate-800 dark:text-slate-50 text-sm mb-2">
                          {data.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Amount: {formatCurrency(data.value)}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Count: {data.count} expense
                          {data.count !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {((data.value / totalExpenses) * 100).toFixed(1)}% of
                          total
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
          ) : view === "partner" && partnerChartType === "area" ? (
            <AreaChart
              data={partnerTrendData.data}
              margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
            >
              <XAxis
                dataKey="month"
                stroke="var(--chart-axis)"
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                axisLine={false}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 60 : 30}
              />
              <YAxis
                stroke="var(--chart-axis)"
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                width={isMobile ? 40 : 60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: isMobile ? "10px" : "12px" }}
              />
              {partnerTrendData.dataKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                  fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          ) : (
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 80 : 120}
                label={isMobile ? false : undefined}
                labelLine={!isMobile}
              >
                {chartData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as {
                      name: string;
                      value: number;
                      count: number;
                    };
                    return (
                      <div className="animate-fade-in-up rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                        <p className="font-bold text-slate-800 dark:text-slate-50 text-sm mb-2">
                          {data.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Amount: {formatCurrency(data.value)}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Count: {data.count} expense
                          {data.count !== 1 ? "s" : ""}
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
          )}
        </ResponsiveContainer>
      </div>
    </ExpandableCard>
  );
};
