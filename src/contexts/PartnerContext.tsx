import React, { useMemo, useState, useEffect } from "react";
import type { PartnerConfig } from "../types/partner";
import {
  defaultPartnerConfig,
  exampleAlternativeConfig,
} from "../config/partners";
import {
  validatePartnerConfig,
  getActivePartners,
  getPartnerById,
  calculatePartnerShares,
} from "../types/partner";
import { PartnerContext, type PartnerContextValue } from "./PartnerContextBase";

interface PartnerProviderProps {
  children: React.ReactNode;
  config?: PartnerConfig;
  useAlternativeConfig?: boolean; // For testing/demo purposes
}

export function PartnerProvider({
  children,
  config,
  useAlternativeConfig = false,
}: PartnerProviderProps) {
  const [partnerConfig, setPartnerConfig] = useState<PartnerConfig>(() => {
    // Priority: 1. Passed config, 2. partnerConfig from localStorage, 3. Default config
    if (config) return config;

    // Check for partnerConfig in localStorage
    const storedConfig = localStorage.getItem("partnerConfig");
    if (storedConfig) {
      try {
        const parsed: PartnerConfig = JSON.parse(storedConfig);
        if (parsed.partners && parsed.partners.length > 0) {
          return parsed;
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("Failed to parse partnerConfig:", error);
        }
      }
    }

    return useAlternativeConfig
      ? exampleAlternativeConfig
      : defaultPartnerConfig;
  });

  // Listen for changes to partner config
  useEffect(() => {
    const handleStorageChange = () => {
      const storedConfig = localStorage.getItem("partnerConfig");

      if (storedConfig) {
        try {
          const parsed: PartnerConfig = JSON.parse(storedConfig);
          if (parsed.partners && parsed.partners.length > 0) {
            setPartnerConfig(parsed);
            if (import.meta.env.DEV) {
              console.log("✓ PartnerContext updated from partnerConfig");
            }
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn("Failed to parse partnerConfig:", error);
          }
        }
      }
    };

    const handlePartnerConfigUpdate = (event: Event) => {
      // Handle custom partner-config-updated event
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.partnerConfig) {
        setPartnerConfig(customEvent.detail.partnerConfig);
        if (import.meta.env.DEV) {
          console.log("✓ PartnerContext updated from custom event");
        }
      } else {
        handleStorageChange();
      }
    };

    const handleOnboardingMigration = () => {
      // Force a refresh when onboarding data is migrated
      handleStorageChange();
    };

    // Listen for storage events (changes in other tabs)
    window.addEventListener("storage", handleStorageChange);
    // Listen for partner config update events (same tab)
    window.addEventListener(
      "partner-config-updated",
      handlePartnerConfigUpdate
    );
    // Listen for onboarding data migration events
    window.addEventListener(
      "onboarding-data-migrated",
      handleOnboardingMigration
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "partner-config-updated",
        handlePartnerConfigUpdate
      );
      window.removeEventListener(
        "onboarding-data-migrated",
        handleOnboardingMigration
      );
    };
  }, []);

  const contextValue = useMemo((): PartnerContextValue => {
    const activePartners = getActivePartners(partnerConfig);
    const isValidConfig = validatePartnerConfig(partnerConfig);

    return {
      config: partnerConfig,
      activePartners,
      getPartner: (partnerId: string) =>
        getPartnerById(partnerConfig, partnerId),
      calculateShares: (amount: number) =>
        calculatePartnerShares(amount, partnerConfig),
      getPartnerNames: () => activePartners.map((p) => p.name),
      getPartnerDisplayNames: () => activePartners.map((p) => p.displayName),
      isValidConfig,
    };
  }, [partnerConfig]);

  return (
    <PartnerContext.Provider value={contextValue}>
      {children}
    </PartnerContext.Provider>
  );
}
