import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";
// import { ToastType } from "../components/common/SuccessToast"; // Unused

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const { showToast, hideToast } = context;

  return {
    showToast,
    hideToast,
    success: (message: string, amount?: string) => showToast(message, "income", amount), // Default to income style for generic success or allow override? 
    // Actually, let's keep it flexible.
    // Helper methods for common types:
    showIncome: (message: string, amount?: string) => showToast(message, "income", amount),
    showExpense: (message: string, amount?: string) => showToast(message, "expense", amount),
    showDonation: (message: string, amount?: string) => showToast(message, "donation", amount),
  };
};
