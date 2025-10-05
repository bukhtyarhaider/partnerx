import React, { useMemo, useState, useEffect } from "react";
import type { PartnerConfig, Partner } from "../types/partner";
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

// Helper function to create PartnerConfig from onboarding partners
function createPartnerConfigFromOnboarding(
  partners: Partner[],
  businessName?: string
): PartnerConfig {
  return {
    partners,
    companyName: businessName || "Your Business",
    totalEquity: 1,
    lastUpdated: new Date().toISOString(),
  };
}

export function PartnerProvider({
  children,
  config,
  useAlternativeConfig = false,
}: PartnerProviderProps) {
  const [partnerConfig, setPartnerConfig] = useState<PartnerConfig>(() => {
    // Priority: 1. Passed config, 2. Onboarding data, 3. Default config
    if (config) return config;

    // Check for onboarding partners data
    const onboardingPartners = localStorage.getItem("onboarding_partners");
    const businessInfo = localStorage.getItem("business_info");

    if (onboardingPartners) {
      try {
        const partners: Partner[] = JSON.parse(onboardingPartners);
        const business = businessInfo ? JSON.parse(businessInfo) : null;

        if (partners.length > 0) {
          return createPartnerConfigFromOnboarding(partners, business?.name);
        }
      } catch (error) {
        console.warn("Failed to parse onboarding partners data:", error);
      }
    }

    return useAlternativeConfig
      ? exampleAlternativeConfig
      : defaultPartnerConfig;
  });

  // Listen for changes to onboarding data
  useEffect(() => {
    const handleStorageChange = () => {
      const onboardingPartners = localStorage.getItem("onboarding_partners");
      const businessInfo = localStorage.getItem("business_info");

      if (onboardingPartners) {
        try {
          const partners: Partner[] = JSON.parse(onboardingPartners);
          const business = businessInfo ? JSON.parse(businessInfo) : null;

          if (partners.length > 0) {
            setPartnerConfig(
              createPartnerConfigFromOnboarding(partners, business?.name)
            );
          }
        } catch (error) {
          console.warn("Failed to parse onboarding partners data:", error);
        }
      }
    };

    const handleOnboardingMigration = () => {
      // Force a refresh when onboarding data is migrated
      handleStorageChange();
    };

    // Listen for storage events (changes in other tabs)
    window.addEventListener("storage", handleStorageChange);
    // Listen for onboarding data migration events
    window.addEventListener(
      "onboarding-data-migrated",
      handleOnboardingMigration
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
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
