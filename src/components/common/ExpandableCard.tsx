import React, { type ReactElement, type ReactNode } from "react";
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
}

const contentVariants = {
  collapsed: { opacity: 0, y: 10, transition: { duration: 0.25 } },
  expanded: { opacity: 1, y: 0, transition: { duration: 0.25, delay: 0.15 } },
};

const iconVariants = {
  hidden: { rotate: -90, opacity: 0, scale: 0.5 },
  visible: { rotate: 0, opacity: 1, scale: 1 },
  exit: { rotate: 90, opacity: 0, scale: 0.5 },
};

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  icon,
  title,
  children,
  isExpanded = false,
  actionBar,
  onToggleExpand,
}) => {
  const actionBarPosition = actionBar?.position || "right";

  const getJustifyClass = () => {
    switch (actionBarPosition) {
      case "left":
        return "justify-start ml-4";
      case "center":
        return "justify-center";
      case "right":
        return "justify-end mr-4";
      default:
        return "justify-end";
    }
  };

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      animate={{ borderRadius: isExpanded ? "1.5rem" : "0.75rem" }}
      className={`bg-white shadow-lg ${
        isExpanded
          ? "fixed inset-2 z-50 p-2 md:inset-6 md:p-4 flex flex-col"
          : "relative p-4 rounded-xl"
      }`}
    >
      <motion.div layout className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          {icon && <span className="mr-3">{icon}</span>}
          {title}
        </h2>
        <div className={`flex flex-1 items-center ${getJustifyClass()}`}>
          {actionBar && actionBar.content}
        </div>
        {onToggleExpand && (
          <button
            onClick={onToggleExpand}
            className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wise-green hover:bg-gray-100 transition relative flex items-center justify-center w-9 h-9" // Set a fixed size for stability
            title={isExpanded ? "Minimize" : "Maximize"}
            aria-label={isExpanded ? "Minimize card" : "Maximize card"}
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
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>
        )}
      </motion.div>

      <motion.div layout className="flex-1 overflow-hidden">
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
