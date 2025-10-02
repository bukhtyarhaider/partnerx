import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LockKeyhole, UnlockKeyhole, Delete, ShieldAlert } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const PIN_STORAGE_KEY = "app_pin_code";

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

export const PinLock = () => {
  const { unlockApp } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isPinSet, setIsPinSet] = useState(false);
  const [prompt, setPrompt] = useState("Enter Your PIN");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const storedPin = localStorage.getItem(PIN_STORAGE_KEY);
    if (storedPin) {
      setIsPinSet(true);
      setPrompt("Enter Your 4-Digit PIN");
    } else {
      setIsPinSet(false);
      setPrompt("Create a 4-Digit PIN");
    }
  }, []);

  const handleKeyClick = useCallback(
    (key: string) => {
      if (isUnlocking || (pin.length >= 4 && key !== "del")) return;
      setError("");
      setPin((prev) => (key === "del" ? prev.slice(0, -1) : prev + key));
    },
    [isUnlocking, pin.length]
  );

  const handleSubmit = useCallback(() => {
    if (pin.length !== 4 || isUnlocking) return;

    if (!isPinSet) {
      localStorage.setItem(PIN_STORAGE_KEY, btoa(pin));
      setIsPinSet(true);
      setPrompt("Enter Your 4-Digit PIN");
      setPin("");
      setError("PIN set! Now enter it to unlock.");
      return;
    }

    const storedPin = atob(localStorage.getItem(PIN_STORAGE_KEY)!);
    if (pin === storedPin) {
      setError("");
      setIsUnlocking(true);
      setTimeout(() => unlockApp(), 500);
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  }, [isPinSet, isUnlocking, pin, unlockApp]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showResetConfirm) return;
      if (event.key >= "0" && event.key <= "9") handleKeyClick(event.key);
      else if (event.key === "Backspace") handleKeyClick("del");
      else if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyClick, handleSubmit, showResetConfirm]);

  const handleResetApp = () => {
    // Clears all relevant local storage keys
    Object.keys(localStorage).forEach((key) => {
      if (
        key === PIN_STORAGE_KEY ||
        ["transactions", "expenses", "donationPayouts", "summaries"].includes(
          key
        )
      ) {
        localStorage.removeItem(key);
      }
    });
    window.location.reload();
  };

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
  const pinDigits = Array(4)
    .fill(null)
    .map((_, i) => pin[i] || null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-lg"
      role="dialog"
      aria-labelledby="pin-lock-title"
    >
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-slate-800/50 border border-white/10 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-center items-center text-center bg-gradient-to-br from-emerald-950/30 to-transparent">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 border border-emerald-400/30">
              <AnimatePresence mode="wait">
                {isUnlocking ? (
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
              id="pin-lock-title"
              className="mt-6 text-2xl font-bold text-slate-100"
            >
              {prompt}
            </h2>
            <p className="mt-2 text-base text-slate-400">
              {isPinSet
                ? "Enter your PIN to continue"
                : "Create a PIN to secure your data"}
            </p>
          </div>

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
                  disabled={isUnlocking}
                />
              ))}
            </div>

            <motion.button
              onClick={handleSubmit}
              whileTap={{ scale: 0.98 }}
              className="w-full max-w-xs mt-8 flex h-14 items-center justify-center rounded-xl text-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ring-offset-2 ring-offset-slate-900"
              disabled={pin.length !== 4 || isUnlocking}
              animate={{
                backgroundColor:
                  pin.length === 4 && !isUnlocking ? "#10b981" : "#475569",
                color: pin.length === 4 && !isUnlocking ? "#ffffff" : "#94a3b8",
              }}
            >
              <AnimatePresence mode="wait">
                {isUnlocking ? (
                  <motion.div
                    key="unlocking"
                    className="flex items-center gap-3"
                  >
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                    Unlocking...
                  </motion.div>
                ) : (
                  <motion.span key="text">
                    {isPinSet ? "Unlock" : "Set PIN"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {isPinSet && !isUnlocking && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="mt-6 text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Forgot PIN? Reset App
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-slate-800 border border-red-500/30 p-8 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-400/30">
                <ShieldAlert className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-white">
                Reset Application?
              </h3>
              <p className="mt-3 text-base text-slate-300">
                This will permanently delete your PIN and{" "}
                <strong>all saved data</strong>. This action cannot be undone.
              </p>
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-xl bg-slate-700 py-3 text-white font-semibold hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetApp}
                  className="flex-1 rounded-xl bg-red-600 py-3 text-white font-semibold hover:bg-red-700 transition-colors"
                >
                  Reset Data
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
