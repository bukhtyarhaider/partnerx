import { useContext } from "react";
import {
  PartnerContext,
  type PartnerContextValue,
} from "../contexts/PartnerContextBase";
import type { Partner } from "../types/partner";

export function usePartners(): PartnerContextValue {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error("usePartners must be used within a PartnerProvider");
  }
  return context;
}

// Utility hook for finding a partner by name (backward compatibility)
export function usePartnerByName(name: string): Partner | undefined {
  const { activePartners } = usePartners();
  return activePartners.find((p) => p.name === name || p.displayName === name);
}

// Utility hook for finding a partner by ID
export function usePartnerById(partnerId: string): Partner | undefined {
  const { getPartner } = usePartners();
  return getPartner(partnerId);
}
