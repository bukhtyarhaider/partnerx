import React, { type ReactElement, type ReactNode, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize, Minimize } from "lucide-react";

interface ActionBarConfig {
  content: ReactNode;
  position?: "left" | "right" | "center";
}

interface ExpandableCardProps {
  icon?: ReactElement;
  title: string;
  children: ReactNode;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  actionBar?: ActionBarConfig;
  className?: string;
}

const contentVariants = {
  collapsed: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2 },
  },
  expanded: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, delay: 0.1 },
  },
};

const iconVariants = {
  hidden: { rotate: -90, opacity: 0, scale: 0.8 },
  visible: { rotate: 0, opacity: 1, scale: 1 },
  exit: { rotate: 90, opacity: 0, scale: 0.8 },
};

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  icon,
  title,
  children,
  isExpanded = false,
  actionBar,
  onToggleExpand,
  className = "",
}) => {
  const actionBarPosition = actionBar?.position ?? "right";

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (onToggleExpand && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onToggleExpand();
      }
    },
    [onToggleExpand]
  );

  const getActionBarClasses = useCallback(() => {
    const baseClasses = "flex flex-1 items-center";
    switch (actionBarPosition) {
      case "left":
        return `${baseClasses} justify-start`;
      case "center":
        return `${baseClasses} justify-center`;
      case "right":
      default:
        return `${baseClasses} justify-end`;
    }
  }, [actionBarPosition]);

  const cardClasses = isExpanded
    ? "fixed inset-4 z-50 flex flex-col bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-2xl shadow-2xl"
    : `relative bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-xl ${className}`;

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className={`${cardClasses} p-2 md:p-2`}
      role="region"
      aria-expanded={isExpanded}
      aria-label={`${title} card`}
    >
      <motion.div
        layout
        className="flex items-center justify-between gap-3 mb-1 md:mb-1"
      >
        <h2 className="flex items-center text-lg font-semibold text-slate-800 dark:text-slate-50 min-w-0 px-3 md:px-3 ">
          {icon && (
            <span className="md:mr-2 flex-shrink-0" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="truncate">{title}</span>
        </h2>

        <div className={getActionBarClasses()}>{actionBar?.content}</div>

        {onToggleExpand && (
          <button
            onClick={onToggleExpand}
            onKeyDown={handleKeyDown}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-800"
            aria-label={isExpanded ? "Minimize card" : "Maximize card"}
            aria-expanded={isExpanded}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={isExpanded ? "minimize" : "maximize"}
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {isExpanded ? (
                  <Minimize className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Maximize className="h-4 w-4" aria-hidden="true" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>
        )}
      </motion.div>

      <motion.div
        layout
        className={`flex-1 ${
          isExpanded ? "overflow-y-auto max-h-[calc(100vh-10rem)]" : ""
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isExpanded ? "expanded-content" : "collapsed-content"}
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
