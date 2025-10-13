import type { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

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
  infoText?: string;
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
  infoText,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  // Handle zero or empty values
  const isZeroValue =
    typeof value === "number" ? value === 0 : value === "0" || value === "₨0";
  const shouldShowEmpty = isEmpty || isZeroValue;

  // Long press handlers for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!infoText) return;

    const timer = setTimeout(() => {
      e.preventDefault();
      setShowInfo(true);
    }, 500); // 500ms long press

    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
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

      {/* Long press hint for mobile/tablet - subtle indicator */}
      {infoText && (
        <div className="absolute top-2 right-2 lg:hidden">
          <div
            className="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500 opacity-50 animate-pulse"
            title="Long press for more info"
          />
        </div>
      )}

      {/* Info Button - Hidden on mobile/tablet, visible on desktop */}
      {infoText && (
        <>
          <div className="hidden lg:block absolute bottom-14 left-4 lg:bottom-3 lg:left-3 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(!showInfo);
              }}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200 shadow-sm"
              aria-label="Information"
              title="More information"
            >
              <Info className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Info Tooltip - Using React Portal to render outside component tree */}
          {showInfo &&
            createPortal(
              <>
                {/* Backdrop to close tooltip when clicking outside */}
                <div
                  className="fixed inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-sm"
                  style={{ zIndex: 9998 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(false);
                  }}
                />

                {/* Tooltip centered on screen */}
                <div
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ zIndex: 9999 }}
                >
                  <div className="w-[90vw] max-w-md p-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-600 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                        About {title}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowInfo(false);
                        }}
                        className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        aria-label="Close"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {infoText}
                    </p>
                  </div>
                </div>
              </>,
              document.body
            )}
        </>
      )}

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
