import { useState, useCallback } from "react";

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  variant?: "danger" | "warning" | "info";
}

export function useConfirmation() {
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "Confirm",
    variant: "danger",
  });

  const showConfirmation = useCallback(
    (config: Omit<ConfirmationState, "isOpen">) => {
      setConfirmation({
        ...config,
        isOpen: true,
      });
    },
    []
  );

  const hideConfirmation = useCallback(() => {
    setConfirmation((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const confirmAndHide = useCallback(() => {
    confirmation.onConfirm();
    hideConfirmation();
  }, [confirmation, hideConfirmation]);

  return {
    confirmation,
    showConfirmation,
    hideConfirmation,
    confirmAndHide,
  };
}
