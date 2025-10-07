import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LockKeyhole, UnlockKeyhole, Delete } from "lucide-react";
import { useOnboarding } from "../../hooks/useOnboarding";
import { SuccessToast } from "../common/SuccessToast";

const PIN_STORAGE_KEY = "app_pin_code";

interface PinSetupStepProps {
  onNext: () => void;
  onSkip?: () => void;
  onPrevious?: () => void;
  canGoBack?: boolean;
  isLastStep?: boolean;
}

const PinDigit = ({ digit }: { digit: string | null }) => (
  <div className="relative h-14 w-12 overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
    <AnimatePresence>
      {digit && (
        <motion.span
          key={digit}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-emerald-300"
        >
          •
        </motion.span>
      )}
    </AnimatePresence>
    {!digit && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-white/20" />
      </div>
    )}
  </div>
);

const KeypadButton = ({
  value,
  onClick,
  disabled,
}: {
  value: string;
  onClick: (key: string) => void;
  disabled?: boolean;
}) => {
  const isDelete = value === "del";
  const isEmpty = value === "";

  if (isEmpty) {
    return <div className="invisible" />; // Use invisible div to maintain grid layout
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      onClick={() => onClick(value)}
      disabled={disabled}
      className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold transition-colors duration-200 bg-white/5 border border-white/10 text-slate-200 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
      aria-label={isDelete ? "Delete last digit" : `Number ${value}`}
    >
      {isDelete ? <Delete className="h-6 w-6" /> : value}
    </motion.button>
  );
};

export const PinSetupStep: React.FC<PinSetupStepProps> = ({
  onNext,
  onPrevious,
  canGoBack = false,
}) => {
  const { markStepCompleted } = useOnboarding();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [prompt, setPrompt] = useState("Create a 4-Digit PIN");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleKeyClick = useCallback(
    (key: string) => {
      if (
        isSettingPin ||
        ((isConfirming ? confirmPin : pin).length >= 4 && key !== "del")
      )
        return;
      setError("");

      if (isConfirming) {
        setConfirmPin((prev) =>
          key === "del" ? prev.slice(0, -1) : prev + key
        );
      } else {
        setPin((prev) => (key === "del" ? prev.slice(0, -1) : prev + key));
      }
    },
    [isSettingPin, isConfirming, pin, confirmPin]
  );

  const handleSubmit = useCallback(() => {
    const currentPin = isConfirming ? confirmPin : pin;
    if (currentPin.length !== 4 || isSettingPin) return;

    if (!isConfirming) {
      // Validate PIN strength before confirming
      const isWeak =
        pin === "0000" ||
        pin === "1111" ||
        pin === "2222" ||
        pin === "3333" ||
        pin === "4444" ||
        pin === "5555" ||
        pin === "6666" ||
        pin === "7777" ||
        pin === "8888" ||
        pin === "9999" ||
        pin === "1234" ||
        pin === "4321";

      if (isWeak) {
        setError(
          "Please choose a more secure PIN. Avoid sequential or repeated digits."
        );
        setPin("");
        return;
      }

      // First PIN entry - move to confirmation
      setIsConfirming(true);
      setPrompt("Confirm Your PIN");
      setConfirmPin("");
      return;
    }

    // Confirming PIN
    if (pin === confirmPin) {
      setError("");
      setIsSettingPin(true);

      // Save PIN to localStorage (encoded)
      try {
        localStorage.setItem(PIN_STORAGE_KEY, btoa(pin));
      } catch (error) {
        console.error("Failed to save PIN:", error);
        setError("Failed to save PIN. Please try again.");
        setPin("");
        setConfirmPin("");
        setIsConfirming(false);
        setIsSettingPin(false);
        return;
      }

      // Complete the onboarding step
      markStepCompleted("pin-setup");

      // Show success toast
      setToastMessage("PIN created successfully!");
      setShowSuccessToast(true);

      // Delay for toast visibility then proceed
      setTimeout(() => {
        onNext();
      }, 1000);
    } else {
      setError("PINs don't match. Please try again.");
      setPin("");
      setConfirmPin("");
      setIsConfirming(false);
      setPrompt("Create a 4-Digit PIN");
    }
  }, [isConfirming, isSettingPin, pin, confirmPin, markStepCompleted, onNext]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key >= "0" && event.key <= "9") handleKeyClick(event.key);
      else if (event.key === "Backspace") handleKeyClick("del");
      else if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyClick, handleSubmit]);

  const keypadKeys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "",
    "0",
    "del",
  ];

  const currentPinValue = isConfirming ? confirmPin : pin;
  const pinDigits = Array(4)
    .fill(null)
    .map((_, i) => currentPinValue[i] || null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen bg-slate-900/80 p-4"
      role="dialog"
      aria-labelledby="pin-setup-title"
    >
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-slate-800/50 border border-white/10 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side - Icon and description */}
          <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-center items-center text-center bg-gradient-to-br from-emerald-950/30 to-transparent">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 border border-emerald-400/30">
              <AnimatePresence mode="wait">
                {isSettingPin ? (
                  <motion.div
                    key="unlock"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                  >
                    <UnlockKeyhole className="h-10 w-10 text-emerald-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="lock"
                    animate={{ rotate: error ? [-3, 3, -3, 0] : 0 }}
                  >
                    <LockKeyhole className="h-10 w-10 text-emerald-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <h2
              id="pin-setup-title"
              className="mt-6 text-2xl font-bold text-slate-100"
            >
              {prompt}
            </h2>
            <p className="mt-2 text-base text-slate-400">
              {isConfirming
                ? "Re-enter your PIN to confirm"
                : "Create a PIN to secure your data"}
            </p>
          </div>

          {/* Right side - PIN input and keypad */}
          <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-center items-center bg-slate-900/30">
            <div
              className="flex justify-center gap-4"
              aria-label="PIN input display"
            >
              {pinDigits.map((digit, i) => (
                <motion.div key={i} animate={{ scale: digit ? 1.05 : 1 }}>
                  <PinDigit digit={digit} />
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: "1rem" }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  className="overflow-hidden w-full max-w-xs"
                  role="alert"
                >
                  <div className="rounded-xl bg-red-500/10 p-3 text-center">
                    <p className="text-sm font-medium text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="mt-8 grid grid-cols-3 gap-4"
              aria-label="PIN keypad"
            >
              {keypadKeys.map((key) => (
                <KeypadButton
                  key={key}
                  value={key}
                  onClick={handleKeyClick}
                  disabled={isSettingPin}
                />
              ))}
            </div>

            <motion.button
              onClick={handleSubmit}
              whileTap={{ scale: 0.98 }}
              className="w-full max-w-xs mt-8 flex h-14 items-center justify-center rounded-xl text-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ring-offset-2 ring-offset-slate-900"
              disabled={currentPinValue.length !== 4 || isSettingPin}
              animate={{
                backgroundColor:
                  currentPinValue.length === 4 && !isSettingPin
                    ? "#10b981"
                    : "#475569",
                color:
                  currentPinValue.length === 4 && !isSettingPin
                    ? "#ffffff"
                    : "#94a3b8",
              }}
            >
              <AnimatePresence mode="wait">
                {isSettingPin ? (
                  <motion.div key="setting" className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                    Setting PIN...
                  </motion.div>
                ) : (
                  <motion.span key="text">
                    {isConfirming ? "Confirm PIN" : "Set PIN"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Previous Button */}
            {canGoBack && onPrevious && (
              <motion.button
                onClick={onPrevious}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full max-w-xs mt-4 px-6 py-3 border-2 border-slate-600 text-slate-400 rounded-xl hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-200 font-medium"
              >
                Previous
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        type="income"
        message={toastMessage}
        duration={2000}
      />
    </motion.div>
  );
};
