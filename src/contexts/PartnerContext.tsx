import React, { useMemo } from "react";
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
  const partnerConfig =
    config ||
    (useAlternativeConfig ? exampleAlternativeConfig : defaultPartnerConfig);

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
