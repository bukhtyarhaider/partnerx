import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LockKeyhole, X, Delete, CheckCircle, Fingerprint } from "lucide-react";
import { useBiometric } from "../hooks/useBiometric";

const PIN_STORAGE_KEY = "app_pin_code";

interface PinSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
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
    return <div className="invisible" />;
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

export const PinSettingsModal: React.FC<PinSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    isAvailable: isBiometricAvailable,
    isEnabled: isBiometricEnabled,
    enableBiometric,
    disableBiometric,
  } = useBiometric();

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<"current" | "new" | "confirm">("current");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [biometricMessage, setBiometricMessage] = useState("");

  const storedPin = localStorage.getItem(PIN_STORAGE_KEY);
  const hasExistingPin = !!storedPin;

  const resetForm = useCallback(() => {
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setStep(hasExistingPin ? "current" : "new");
    setError("");
    setSuccess(false);
  }, [hasExistingPin]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleToggleBiometric = useCallback(async () => {
    setBiometricMessage("");
    if (isBiometricEnabled) {
      // Disable biometric
      disableBiometric();
      setBiometricMessage("Biometric authentication disabled");
    } else {
      // Enable biometric
      const result = await enableBiometric();
      if (result.success) {
        setBiometricMessage("Biometric authentication enabled!");
      } else {
        setBiometricMessage(result.error || "Failed to enable biometric");
      }
    }
  }, [isBiometricEnabled, enableBiometric, disableBiometric]);

  const handleKeyClick = useCallback(
    (key: string) => {
      setError("");

      if (step === "current") {
        setCurrentPin((prev) =>
          key === "del"
            ? prev.slice(0, -1)
            : prev.length < 4
            ? prev + key
            : prev
        );
      } else if (step === "new") {
        setNewPin((prev) =>
          key === "del"
            ? prev.slice(0, -1)
            : prev.length < 4
            ? prev + key
            : prev
        );
      } else if (step === "confirm") {
        setConfirmPin((prev) =>
          key === "del"
            ? prev.slice(0, -1)
            : prev.length < 4
            ? prev + key
            : prev
        );
      }
    },
    [step]
  );

  React.useEffect(() => {
    if (currentPin.length === 4 && step === "current") {
      const decodedPin = storedPin ? atob(storedPin) : "";
      if (currentPin === decodedPin) {
        setStep("new");
        setCurrentPin("");
      } else {
        setError("Incorrect PIN");
        setTimeout(() => {
          setCurrentPin("");
          setError("");
        }, 1000);
      }
    }
  }, [currentPin, storedPin, step]);

  React.useEffect(() => {
    if (newPin.length === 4 && step === "new") {
      setStep("confirm");
    }
  }, [newPin, step]);

  React.useEffect(() => {
    if (confirmPin.length === 4 && step === "confirm") {
      if (confirmPin === newPin) {
        localStorage.setItem(PIN_STORAGE_KEY, btoa(newPin));
        setSuccess(true);
        setTimeout(() => {
          resetForm();
          onClose();
        }, 1500);
      } else {
        setError("PINs do not match");
        setTimeout(() => {
          setConfirmPin("");
          setNewPin("");
          setStep("new");
          setError("");
        }, 1000);
      }
    }
  }, [confirmPin, newPin, step, onClose, resetForm]);

  React.useEffect(() => {
    if (isOpen) {
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      setStep(hasExistingPin ? "current" : "new");
      setError("");
      setSuccess(false);
    }
  }, [isOpen, hasExistingPin]);

  if (!isOpen) return null;

  const getCurrentPin = () => {
    if (step === "current") return currentPin;
    if (step === "new") return newPin;
    return confirmPin;
  };

  const getPrompt = () => {
    if (success) return "PIN Updated Successfully!";
    if (step === "current") return "Enter Current PIN";
    if (step === "new")
      return hasExistingPin ? "Enter New PIN" : "Create a 4-Digit PIN";
    return "Confirm New PIN";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-lg"
      role="dialog"
      aria-labelledby="pin-settings-title"
    >
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-slate-800/50 border border-white/10 shadow-2xl"
      >
        {/* Close Button - Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
        >
          <X className="size-6" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left Column - Info */}
          <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-center items-center text-center bg-gradient-to-br from-emerald-950/30 to-transparent">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 border border-emerald-400/30">
              <LockKeyhole className="h-10 w-10 text-emerald-400" />
            </div>
            <h2
              id="pin-settings-title"
              className="mt-6 text-2xl font-bold text-slate-100"
            >
              {getPrompt()}
            </h2>
            <p className="mt-2 text-base text-slate-400">
              {step === "current" && "Enter your current PIN to continue"}
              {step === "new" &&
                (hasExistingPin
                  ? "Choose a new 4-digit PIN"
                  : "Create a PIN to secure your data")}
              {step === "confirm" && "Re-enter your new PIN to confirm"}
            </p>
          </div>

          {/* Right Column - PIN Input */}
          <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-center items-center bg-slate-900/30">
            {/* PIN Display */}
            <div
              className="flex justify-center gap-4"
              aria-label="PIN input display"
            >
              {[0, 1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  animate={{
                    scale: getCurrentPin()[index] ? 1.05 : 1,
                  }}
                >
                  <PinDigit digit={getCurrentPin()[index] || null} />
                </motion.div>
              ))}
            </div>

            {/* Error Message */}
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

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: "1rem" }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  className="overflow-hidden w-full max-w-xs"
                  role="alert"
                >
                  <div className="rounded-xl bg-emerald-500/10 p-3 text-center flex items-center justify-center gap-2">
                    <CheckCircle className="size-5 text-emerald-400" />
                    <p className="text-sm font-medium text-emerald-400">
                      PIN updated successfully!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keypad */}
            <div
              className="mt-8 grid grid-cols-3 gap-4"
              aria-label="PIN keypad"
            >
              {[
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
              ].map((key) => (
                <KeypadButton
                  key={key}
                  value={key}
                  onClick={handleKeyClick}
                  disabled={success}
                />
              ))}
            </div>

            {/* Biometric Settings Section */}
            {isBiometricAvailable && hasExistingPin && (
              <div className="mt-8 w-full max-w-xs">
                <div className="rounded-xl bg-slate-700/50 p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-400/30">
                        <Fingerprint className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          Biometric Auth
                        </h4>
                        <p className="text-xs text-slate-400">
                          {isBiometricEnabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleToggleBiometric}
                      disabled={success}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                        isBiometricEnabled ? "bg-emerald-500" : "bg-slate-600"
                      } ${success ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          isBiometricEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {biometricMessage && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          marginTop: "0.75rem",
                        }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <p
                          className={`text-xs ${
                            biometricMessage.includes("enabled") ||
                            biometricMessage.includes("disabled")
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {biometricMessage}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <p className="mt-2 text-xs text-slate-500 text-center">
                  Use Face ID or fingerprint for quick unlock
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
