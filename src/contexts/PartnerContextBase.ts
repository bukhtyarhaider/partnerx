import { createContext } from "react";
import type { PartnerConfig, Partner, PartnerRecord } from "../types/partner";

export interface PartnerContextValue {
  config: PartnerConfig;
  activePartners: Partner[];
  getPartner: (partnerId: string) => Partner | undefined;
  calculateShares: (amount: number) => PartnerRecord<number>;
  getPartnerNames: () => string[];
  getPartnerDisplayNames: () => string[];
  isValidConfig: boolean;
}

export const PartnerContext = createContext<PartnerContextValue | undefined>(
  undefined
);
