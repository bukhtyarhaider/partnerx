import { useState, useEffect } from "react";
import type { BusinessInfo } from "../types/onboarding";

const BUSINESS_INFO_STORAGE_KEY = "business_info";

export interface UseBusinessInfoReturn {
  businessInfo: BusinessInfo | null;
  isPersonalMode: boolean;
  isBusinessMode: boolean;
  isLoading: boolean;
  refreshBusinessInfo: () => void;
}

/**
 * Hook to access business information from onboarding
 * Returns business info and utility flags for personal vs business mode
 */
export function useBusinessInfo(): UseBusinessInfoReturn {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadBusinessInfo = () => {
    try {
      const stored = localStorage.getItem(BUSINESS_INFO_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BusinessInfo;
        setBusinessInfo(parsed);
      } else {
        setBusinessInfo(null);
      }
    } catch (error) {
      console.error("Failed to load business info:", error);
      setBusinessInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBusinessInfo();

    // Listen for storage changes (updates from other tabs or components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === BUSINESS_INFO_STORAGE_KEY) {
        loadBusinessInfo();
      }
    };

    // Listen for custom storage events (same-tab updates)
    const handleCustomStorageChange = () => {
      loadBusinessInfo();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("business-info-updated", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "business-info-updated",
        handleCustomStorageChange
      );
    };
  }, []);

  const isPersonalMode = businessInfo?.type === "personal";
  const isBusinessMode =
    businessInfo !== null && businessInfo.type !== "personal";

  return {
    businessInfo,
    isPersonalMode,
    isBusinessMode,
    isLoading,
    refreshBusinessInfo: loadBusinessInfo,
  };
}
