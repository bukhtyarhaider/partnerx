import { useState } from "react";
import {
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Clock,
  BarChart3,
  TrendingUp,
  CalendarDays,
  Infinity as InfinityIcon,
  Target,
} from "lucide-react";
import { getCurrentDateRange } from "../utils/dateFilter";

export type DateFilterType =
  | "current-month"
  | "3-months"
  | "6-months"
  | "1-year"
  | "all-time"
  | "custom";

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DateFilterValue {
  type: DateFilterType;
  range: DateRange;
}

interface DateFilterProps {
  value: DateFilterValue;
  onChange: (filter: DateFilterValue) => void;
  className?: string;
}

const filterOptions = [
  { value: "current-month", label: "Current", icon: Clock },
  { value: "3-months", label: "3M", icon: BarChart3 },
  { value: "6-months", label: "6M", icon: TrendingUp },
  { value: "1-year", label: "1Y", icon: CalendarDays },
  { value: "all-time", label: "All", icon: InfinityIcon },
  { value: "custom", label: "Custom", icon: Target },
] as const;

export const DateFilter = ({
  value,
  onChange,
  className = "",
}: DateFilterProps) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFilterChange = (type: DateFilterType) => {
    if (type === "custom") {
      setShowCustomModal(true);
      return;
    }

    const range = getCurrentDateRange(type);
    onChange({ type, range });
  };

  const handleCustomRangeApply = () => {
    if (customStartDate && customEndDate) {
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      endDate.setHours(23, 59, 59); // Include the entire end date

      onChange({
        type: "custom",
        range: { startDate, endDate },
      });
    }
    setShowCustomModal(false);
    setCustomStartDate("");
    setCustomEndDate("");
  };

  const getCustomLabel = () => {
    if (
      value.type === "custom" &&
      value.range.startDate &&
      value.range.endDate
    ) {
      return `${value.range.startDate.toLocaleDateString()} - ${value.range.endDate.toLocaleDateString()}`;
    }
    return "Custom";
  };

  const getActiveFilterInfo = () => {
    const activeOption = filterOptions.find((opt) => opt.value === value.type);
    if (value.type === "custom") {
      return {
        label: getCustomLabel(),
        icon: activeOption?.icon || Target,
        description: "Custom range",
      };
    }
    return {
      label: activeOption?.label || "Current",
      icon: activeOption?.icon || Clock,
      description: getFilterDescription(value.type),
    };
  };

  const getFilterDescription = (type: DateFilterType) => {
    switch (type) {
      case "current-month":
        return "This month";
      case "3-months":
        return "Last 3 months";
      case "6-months":
        return "Last 6 months";
      case "1-year":
        return "Last 12 months";
      case "all-time":
        return "All data";
      default:
        return "";
    }
  };

  const activeFilter = getActiveFilterInfo();

  return (
    <div className={`${className}`}>
      {/* Compact Header with Toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Time Period
          </span>
          {!isExpanded && (
            <div className="flex items-center gap-1.5 ml-2 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-md">
              <activeFilter.icon className="h-3 w-3 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                {activeFilter.label}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Filter Options */}
      {isExpanded && (
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const isActive = value.type === option.value;
            const displayLabel =
              option.value === "custom" ? "Custom" : option.label;
            const IconComponent = option.icon;

            return (
              <button
                key={option.value}
                onClick={() => handleFilterChange(option.value)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                <IconComponent className="h-3.5 w-3.5" />
                {displayLabel}
              </button>
            );
          })}
        </div>
      )}

      {/* Custom Date Range Modal */}
      {showCustomModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowCustomModal(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-sm w-full border border-slate-200 dark:border-slate-700">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Custom Range
                  </h3>
                </div>
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowCustomModal(false)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomRangeApply}
                    disabled={!customStartDate || !customEndDate}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed dark:disabled:bg-slate-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
