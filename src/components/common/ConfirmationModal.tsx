import React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: {
      iconColor: "text-red-600 dark:text-red-400",
      confirmButtonColor:
        "bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",
      titleColor: "text-red-900 dark:text-red-100",
    },
    warning: {
      iconColor: "text-amber-600 dark:text-amber-400",
      confirmButtonColor:
        "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 dark:bg-amber-500 dark:hover:bg-amber-600",
      titleColor: "text-amber-900 dark:text-amber-100",
    },
    info: {
      iconColor: "text-blue-600 dark:text-blue-400",
      confirmButtonColor:
        "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600",
      titleColor: "text-blue-900 dark:text-blue-100",
    },
  };

  const currentVariant = variantStyles[variant];

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 rounded-full bg-red-100 p-3 dark:bg-red-900/20 ${currentVariant.iconColor}`}
              >
                <AlertTriangle size={24} />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`text-lg font-semibold ${currentVariant.titleColor}`}
                >
                  {title}
                </h3>
                <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line break-words">
                  {message}
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex-shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="rounded-lg border-2 border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus:ring-offset-slate-800"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${currentVariant.confirmButtonColor}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render modal to document.body to escape any parent stacking contexts
  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};
