import { useMemo } from "react";

export interface StatCardData {
  title: string;
  value: string | number;
  rawValue?: number;
  variant?: "green" | "red" | "blue" | "indigo" | "pink" | "gray";
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export interface UseStatCardOptions {
  formatValue?: (value: number) => string;
  calculateTrend?: (
    current: number,
    previous?: number
  ) => {
    trend: "up" | "down" | "neutral";
    trendValue: string;
  };
  emptyThreshold?: number;
}

export const useStatCard = (
  data: Partial<StatCardData> & { title: string },
  options: UseStatCardOptions = {}
) => {
  const {
    formatValue = (val) => val.toLocaleString(),
    calculateTrend,
    emptyThreshold = 0,
  } = options;

  return useMemo(() => {
    const rawValue =
      typeof data.value === "number" ? data.value : data.rawValue ?? 0;

    const isEmpty = data.isEmpty ?? rawValue <= emptyThreshold;

    let trend = data.trend;
    let trendValue = data.trendValue;

    // Auto-calculate trend if function provided and previous value available
    if (calculateTrend && !trend && data.rawValue !== undefined) {
      const trendData = calculateTrend(rawValue);
      trend = trendData.trend;
      trendValue = trendData.trendValue;
    }

    // Format value if it's a number and no custom value provided
    const formattedValue =
      typeof data.value === "number"
        ? formatValue(data.value)
        : data.value ?? formatValue(rawValue);

    return {
      title: data.title,
      value: formattedValue,
      variant: data.variant ?? (isEmpty ? "gray" : "indigo"),
      subtitle: data.subtitle,
      trend,
      trendValue,
      isLoading: data.isLoading ?? false,
      isEmpty,
      emptyMessage: data.emptyMessage ?? "No data available",
    };
  }, [data, formatValue, calculateTrend, emptyThreshold]);
};

// Utility function to determine variant based on value
export const getVariantByValue = (
  value: number,
  thresholds: { good: number; warning: number } = { good: 1000, warning: 500 }
): "green" | "red" | "blue" | "gray" => {
  if (value <= 0) return "gray";
  if (value >= thresholds.good) return "green";
  if (value >= thresholds.warning) return "blue";
  return "red";
};

// Utility function to calculate trend
export const calculateTrendFromPrevious = (
  current: number,
  previous: number = 0
): { trend: "up" | "down" | "neutral"; trendValue: string } => {
  if (previous === 0) {
    return {
      trend: current > 0 ? "up" : "neutral",
      trendValue: current > 0 ? "New data" : "No change",
    };
  }

  const change = current - previous;
  const changePercent = (change / previous) * 100;

  if (Math.abs(changePercent) < 1) {
    return {
      trend: "neutral",
      trendValue: "No significant change",
    };
  }

  return {
    trend: change > 0 ? "up" : "down",
    trendValue: `${change > 0 ? "+" : ""}${changePercent.toFixed(
      1
    )}% from previous`,
  };
};
