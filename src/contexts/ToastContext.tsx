import React, { createContext, useState, useCallback, type ReactNode } from "react";
import { SuccessToast, type ToastType } from "../components/common/SuccessToast";

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
  amount?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, amount?: string, duration?: number) => void;
  hideToast: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
    type: "income",
  });

  const showToast = useCallback(
    (message: string, type: ToastType, amount?: string, duration = 3000) => {
      setToast({
        isVisible: true,
        message,
        type,
        amount,
        duration,
      });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <SuccessToast
        isVisible={toast.isVisible}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
        amount={toast.amount}
        duration={toast.duration}
      />
    </ToastContext.Provider>
  );
};
