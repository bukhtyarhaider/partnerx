import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LockKeyhole, UnlockKeyhole, Delete, ShieldAlert } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const PIN_STORAGE_KEY = "app_pin_code";

const PinDigit = ({ digit }: { digit: string | null }) => {
  return (
    <div className="relative h-12 w-8 overflow-hidden rounded-md bg-white/10">
      <AnimatePresence>
        {digit && (
          <motion.span
            key={digit}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-emerald-300"
          >
            {digit}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
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
      if (isUnlocking) return;
      setError("");
      if (key === "del") {
        setPin((prev) => prev.slice(0, -1));
      } else if (pin.length < 4) {
        setPin((prev) => prev + key);
      }
    },
    [isUnlocking, pin.length]
  );

  const handleSubmit = useCallback(() => {
    if (pin.length !== 4 || isUnlocking) return;

    let isCorrect = false;
    if (isPinSet) {
      const storedPin = atob(localStorage.getItem(PIN_STORAGE_KEY)!);
      isCorrect = pin === storedPin;
    } else {
      localStorage.setItem(PIN_STORAGE_KEY, btoa(pin));
      isCorrect = true;
    }

    if (isCorrect) {
      setError("");
      setIsUnlocking(true);
      unlockApp();
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  }, [isPinSet, isUnlocking, pin, unlockApp]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showResetConfirm) return;

      if (event.key >= "0" && event.key <= "9") {
        handleKeyClick(event.key);
      } else if (event.key === "Backspace") {
        handleKeyClick("del");
      } else if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyClick, handleSubmit, showResetConfirm]);

  const handleResetApp = () => {
    localStorage.removeItem(PIN_STORAGE_KEY);
    localStorage.removeItem("transactions");
    localStorage.removeItem("expenses");
    localStorage.removeItem("donationPayouts");
    localStorage.removeItem("summaries");
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
      key="pin-lock-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/50 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 animate-gradient-xy p-4 backdrop-blur-xl"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative w-full max-w-xs rounded-2xl border border-white/10 bg-black/20 p-6 pt-8 text-center shadow-2xl"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <AnimatePresence mode="wait">
            {isUnlocking ? (
              <motion.div
                key="unlock"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1, rotate: [0, 15] }}
                transition={{ type: "spring" }}
              >
                <UnlockKeyhole className="h-8 w-8 text-emerald-300" />
              </motion.div>
            ) : (
              <motion.div key="lock">
                <LockKeyhole className="h-8 w-8 text-emerald-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-100">{prompt}</h2>

        <div className="mt-6 flex justify-center gap-3">
          {pinDigits.map((digit, i) => (
            <PinDigit key={i} digit={digit} />
          ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 text-sm font-semibold text-red-400 animate-shake overflow-hidden"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {keypadKeys.map((key) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.9, backgroundColor: "#34d39920" }}
              onClick={() => handleKeyClick(key)}
              className="flex h-16 items-center justify-center rounded-xl bg-white/5 text-2xl font-semibold text-slate-200 transition-colors hover:bg-white/10"
            >
              {key === "del" ? <Delete className="h-6 w-6" /> : key}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={handleSubmit}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-5 flex h-14 items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold text-white transition-colors hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-slate-600 disabled:text-slate-400"
          disabled={pin.length !== 4 || isUnlocking}
        >
          {isUnlocking ? "Opening..." : isPinSet ? "Unlock" : "Set & Open"}
        </motion.button>

        {isPinSet && !isUnlocking && (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="mt-4 text-xs text-slate-500 hover:text-slate-400 transition-colors"
          >
            Forgot PIN?
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/70"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-full max-w-xs rounded-xl bg-slate-800 p-6 text-center border border-red-500/30"
            >
              <ShieldAlert className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-4 text-lg font-bold text-white">Reset App?</h3>
              <p className="mt-2 text-sm text-slate-400">
                If you forgot your PIN, you must reset the app. **This will
                permanently delete all saved data.**
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full rounded-md bg-slate-700 py-2 text-white hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetApp}
                  className="w-full rounded-md bg-red-600 py-2 text-white hover:bg-red-700 transition-colors"
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
