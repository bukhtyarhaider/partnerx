import { useState, useEffect, useCallback } from "react";

const HAPTICS_ENABLED_KEY = "haptics_enabled";

// Haptic feedback patterns
export type HapticFeedbackType =
  | "light" // Light tap (button press)
  | "medium" // Medium impact (toggle, select)
  | "heavy" // Heavy impact (important action)
  | "success" // Success notification
  | "warning" // Warning notification
  | "error" // Error notification
  | "selection"; // Selection change

interface HapticsHook {
  isEnabled: boolean;
  toggleHaptics: () => void;
  triggerHaptic: (type: HapticFeedbackType) => void;
}

export const useHaptics = (): HapticsHook => {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem(HAPTICS_ENABLED_KEY);
    return stored !== null ? stored === "true" : true; // Enabled by default
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(HAPTICS_ENABLED_KEY, String(isEnabled));
  }, [isEnabled]);

  const toggleHaptics = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  const triggerHaptic = useCallback(
    (type: HapticFeedbackType) => {
      if (!isEnabled) return;

      // Check if the Vibration API is supported
      if (!navigator.vibrate) {
        return;
      }

      // Define vibration patterns for different feedback types
      const patterns: Record<HapticFeedbackType, number | number[]> = {
        light: 10, // Quick tap
        medium: 20, // Standard tap
        heavy: 30, // Strong tap
        success: [10, 50, 10], // Double tap
        warning: [15, 100, 15], // Double tap with pause
        error: [20, 100, 20, 100, 20], // Triple tap
        selection: 5, // Very light tap
      };

      const pattern = patterns[type];

      try {
        if (Array.isArray(pattern)) {
          navigator.vibrate(pattern);
        } else {
          navigator.vibrate(pattern);
        }
      } catch (error) {
        console.warn("Haptic feedback failed:", error);
      }
    },
    [isEnabled]
  );

  return {
    isEnabled,
    toggleHaptics,
    triggerHaptic,
  };
};
