import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, DollarSign, TrendingUp, Heart } from "lucide-react";

export type ToastType = "income" | "expense" | "donation";

interface SuccessToastProps {
  isVisible: boolean;
  onClose: () => void;
  type: ToastType;
  message: string;
  amount?: string;
  duration?: number;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  isVisible,
  onClose,
  type,
  message,
  amount,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "income":
        return <TrendingUp className="w-6 h-6" />;
      case "expense":
        return <DollarSign className="w-6 h-6" />;
      case "donation":
        return <Heart className="w-6 h-6" />;
      default:
        return <CheckCircle2 className="w-6 h-6" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "income":
        return {
          bg: "from-emerald-500 to-green-600",
          ring: "ring-emerald-400/50",
          iconBg: "bg-emerald-400/20",
          text: "text-white",
        };
      case "expense":
        return {
          bg: "from-blue-500 to-blue-600",
          ring: "ring-blue-400/50",
          iconBg: "bg-blue-400/20",
          text: "text-white",
        };
      case "donation":
        return {
          bg: "from-pink-500 to-rose-600",
          ring: "ring-pink-400/50",
          iconBg: "bg-pink-400/20",
          text: "text-white",
        };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 40,
          }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-4 md:translate-y-0 z-50 w-full max-w-md px-4"
        >
          <motion.div
            className={`relative bg-gradient-to-r ${colors.bg} rounded-2xl shadow-2xl ring-4 ${colors.ring} overflow-hidden`}
            initial={{ boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
            animate={{
              boxShadow: [
                "0 10px 40px rgba(0,0,0,0.1)",
                "0 20px 60px rgba(0,0,0,0.2)",
                "0 10px 40px rgba(0,0,0,0.1)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <div className="relative flex items-center gap-4 p-4">
              {/* Animated Icon */}
              <motion.div
                className={`flex-shrink-0 ${colors.iconBg} rounded-xl p-3`}
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {getIcon()}
                </motion.div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <h3 className="font-bold text-white text-lg">Success!</h3>
                </motion.div>
                <motion.p
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/90 text-sm font-medium"
                >
                  {message}
                </motion.p>
                {amount && (
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white font-bold text-xl mt-1"
                  >
                    {amount}
                  </motion.p>
                )}
              </div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="flex-shrink-0 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <motion.div
              className="h-1 bg-white/30"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              style={{ transformOrigin: "left" }}
            />
          </motion.div>

          {/* Confetti Effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `hsl(${i * 30}, 70%, 60%)`,
                  left: `${50 + (Math.random() - 0.5) * 100}%`,
                  top: "50%",
                }}
                initial={{ scale: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0.5],
                  y: [0, -100 - Math.random() * 100],
                  x: [(Math.random() - 0.5) * 200],
                  opacity: [1, 1, 0],
                  rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  ease: "easeOut",
                  delay: Math.random() * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
