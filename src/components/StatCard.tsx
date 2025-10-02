import type { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type StatCardVariant = "green" | "red" | "blue" | "indigo" | "pink" | "gray";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: StatCardVariant;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  onClick?: () => void;
}

const variants: Record<
  StatCardVariant,
  { bg: string; shadow: string; gradient: string }
> = {
  indigo: {
    bg: "bg-indigo-500",
    shadow: "shadow-indigo-500/30",
    gradient: "from-indigo-500 to-indigo-600",
  },
  red: {
    bg: "bg-red-500",
    shadow: "shadow-red-500/30",
    gradient: "from-red-500 to-red-600",
  },
  green: {
    bg: "bg-green-500",
    shadow: "shadow-green-500/30",
    gradient: "from-green-500 to-green-600",
  },
  blue: {
    bg: "bg-blue-500",
    shadow: "shadow-blue-500/30",
    gradient: "from-blue-500 to-blue-600",
  },
  pink: {
    bg: "bg-pink-500",
    shadow: "shadow-pink-500/30",
    gradient: "from-pink-500 to-pink-600",
  },
  gray: {
    bg: "bg-gray-400",
    shadow: "shadow-gray-400/30",
    gradient: "from-gray-400 to-gray-500",
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  variant = "indigo",
  subtitle,
  trend,
  trendValue,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available",
  onClick,
}) => {
  // Handle zero or empty values
  const isZeroValue =
    typeof value === "number" ? value === 0 : value === "0" || value === "₨0";
  const shouldShowEmpty = isEmpty || isZeroValue;

  // Format display value
  const displayValue = shouldShowEmpty
    ? emptyMessage
    : typeof value === "number"
    ? value.toLocaleString()
    : value;

  // Determine variant for empty state
  const effectiveVariant = shouldShowEmpty ? "gray" : variant;
  const effectiveVariantStyles = variants[effectiveVariant];

  const getTrendIcon = () => {
    if (!trend || shouldShowEmpty) return null;
    const iconProps = { size: 14, className: "ml-1 sm:ml-2 flex-shrink-0" };
    switch (trend) {
      case "up":
        return (
          <TrendingUp
            {...iconProps}
            className="ml-1 sm:ml-2 text-green-500 flex-shrink-0"
          />
        );
      case "down":
        return (
          <TrendingDown
            {...iconProps}
            className="ml-1 sm:ml-2 text-red-500 flex-shrink-0"
          />
        );
      case "neutral":
        return (
          <Minus
            {...iconProps}
            className="ml-1 sm:ml-2 text-gray-500 flex-shrink-0"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        group relative transform rounded-2xl border border-slate-100 bg-white 
        p-4 pt-6 sm:p-6 sm:pt-8 
        shadow-sm transition-all duration-300 ease-in-out 
        hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60
        dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/50 
        dark:hover:shadow-slate-900/80 
        min-w-[280px] sm:min-w-0 w-full
        ${
          onClick
            ? "cursor-pointer hover:border-slate-200 dark:hover:border-slate-600"
            : ""
        }
        ${shouldShowEmpty ? "opacity-75" : ""}
      `}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${title}: ${displayValue}` : undefined}
    >
      {/* Icon container with improved gradient */}
      <div
        className={`
          absolute -top-3 left-4 sm:-top-5 sm:left-5 rounded-xl 
          p-3 sm:p-4 shadow-lg transition-all duration-300
          bg-gradient-to-r ${effectiveVariantStyles.gradient} ${effectiveVariantStyles.shadow}
          group-hover:shadow-xl group-hover:scale-105
        `}
      >
        <div
          className={`${
            shouldShowEmpty ? "opacity-60" : ""
          } transition-opacity duration-300`}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6">{icon}</div>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="flex flex-col items-end animate-pulse">
          <div className="h-3 w-16 sm:h-4 sm:w-20 bg-slate-200 rounded dark:bg-slate-700 mb-2"></div>
          <div className="h-6 w-20 sm:h-8 sm:w-24 bg-slate-200 rounded dark:bg-slate-700"></div>
        </div>
      ) : (
        <div className="flex flex-col items-end">
          {/* Title with better spacing */}
          <p className="font-medium text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-tight text-right">
            {title}
          </p>

          {/* Value with improved typography */}
          <div className="flex items-center mt-1 flex-wrap justify-end">
            <h3
              className={`
                text-xl sm:text-3xl font-bold transition-colors duration-300 text-right
                ${
                  shouldShowEmpty
                    ? "text-slate-400 dark:text-slate-500 text-lg sm:text-xl"
                    : "text-slate-800 dark:text-slate-50"
                }
              `}
            >
              {displayValue}
            </h3>
            {getTrendIcon()}
          </div>

          {/* Trend value */}
          {trendValue && !shouldShowEmpty && (
            <p
              className={`
              text-xs mt-1 font-medium text-right max-w-full truncate
              ${
                trend === "up"
                  ? "text-green-500"
                  : trend === "down"
                  ? "text-red-500"
                  : "text-gray-500"
              }
            `}
            >
              {trendValue}
            </p>
          )}

          {/* Subtitle */}
          {subtitle && !shouldShowEmpty && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right max-w-full truncate">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};
