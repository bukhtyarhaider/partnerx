import { CheckCircle2, Scale, Info } from "lucide-react";
import { formatCurrency } from "../utils/format";
import { usePartners } from "../hooks/usePartners";
import { useState } from "react";
import { createPortal } from "react-dom";

interface LoanCardProps {
  loan: {
    amount: number;
    owedBy: string | null;
  };
  deficitPartners?: Array<{ partnerId: string; amount: number }>;
  isPersonalMode?: boolean;
}

export const LoanCard: React.FC<LoanCardProps> = ({
  loan,
  deficitPartners = [],
  isPersonalMode = false,
}) => {
  const { getPartner } = usePartners();
  const [showInfo, setShowInfo] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
  const isBalanced = !loan.owedBy || loan.amount <= 0;
  const owedByPartner = loan.owedBy ? getPartner(loan.owedBy) : null;
  const hasMultipleDeficits = deficitPartners.length > 1;

  // Long press handlers for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    const timer = window.setTimeout(() => {
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

  // Personal mode messaging
  const balancedTitle = isPersonalMode ? "Balanced Ledger" : "All Settled";
  const balancedMessage = isPersonalMode
    ? "Your income and expenses are tracked and balanced."
    : "All partners have sufficient funds to cover their expenses.";

  const deficitTitle = isPersonalMode ? "Overspending" : "Expense Deficit";

  // Generate deficit message based on number of partners
  let deficitMessage = "";
  if (isPersonalMode) {
    deficitMessage = `You have overspent by ${formatCurrency(
      loan.amount
    )}. Consider reducing expenses or increasing income.`;
  } else if (hasMultipleDeficits) {
    // Multiple partners owe money - show as text
    const totalDeficit = deficitPartners.reduce((sum, p) => sum + p.amount, 0);
    const partnersList = deficitPartners
      .map((dp) => {
        const partner = getPartner(dp.partnerId);
        return `${partner?.displayName || "Unknown"} owes ${formatCurrency(
          dp.amount
        )}`;
      })
      .join(", ");
    deficitMessage = `${partnersList}. Total debt: ${formatCurrency(
      totalDeficit
    )}`;
  } else {
    // Single partner owes money
    deficitMessage = `${
      owedByPartner?.displayName || "Unknown Partner"
    } has overspent by ${formatCurrency(loan.amount)} and needs to settle up.`;
  }

  const infoText = isPersonalMode
    ? "This shows whether your spending is within your income. A balanced ledger means you're living within your means. Overspending indicates you need to either increase income or reduce expenses."
    : "This tracks the balance status of all partners. 'All Settled' means every partner has enough funds to cover their share of expenses. A deficit occurs when a partner has spent more than their available capital.";

  return (
    <div
      className={`relative flex h-full w-72 flex-shrink-0 transform flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg dark:shadow-slate-900/50 md:w-full ${
        isBalanced
          ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-500/10"
          : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-500/10"
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {/* Long press hint for mobile/tablet */}
      <div className="absolute top-2 right-2 lg:hidden">
        <div
          className="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500 opacity-50 animate-pulse"
          title="Long press for more info"
        />
      </div>
      {/* Info Button - Hidden on mobile/tablet, visible on desktop */}
      <>
        <div className="hidden lg:block absolute bottom-3 left-3 lg:bottom-3 lg:left-3 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(!showInfo);
            }}
            className="p-1.5 rounded-full bg-white/70 hover:bg-white dark:bg-slate-700/70 dark:hover:bg-slate-700 transition-colors duration-200 shadow-sm"
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
                      About Balance Status
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
      </>{" "}
      <div className="mb-2">
        {isBalanced ? (
          <CheckCircle2
            size={32}
            className="text-green-600 dark:text-green-400"
          />
        ) : (
          <Scale size={32} className="text-amber-500 dark:text-amber-400" />
        )}
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50">
        {isBalanced ? balancedTitle : deficitTitle}
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {isBalanced ? balancedMessage : deficitMessage}
      </p>
    </div>
  );
};
