/**
 * Domain logic for Income Sources
 */

export interface IncomeSourceMetadata {
  icon?: {
    type: "lucide" | "image";
    value: string;
    color?: string;
    backgroundColor?: string;
    darkMode?: {
      color?: string;
      backgroundColor?: string;
    };
  };
  fees?: {
    fixedFeeUSD?: number;
    percentageFee?: number;
    method?: "fixed" | "percentage" | "hybrid";
  };
  settings?: {
    defaultTaxRate?: number;
    commissionRate?: number;
    analyticsUrl?: string;
    apiConfig?: {
      baseUrl?: string;
      authType?: "oauth" | "apikey" | "none";
      requiredScopes?: string[];
    };
    tax?: {
      enabled: boolean;
      type: "percentage" | "fixed";
      value: number;
    };
    defaultCurrency?: "PKR" | "USD";
  };
  display?: {
    displayName?: string;
    description?: string;
    category?: string;
    sortOrder?: number;
  };
}

export interface IncomeSource {
  id: string;
  name: string;
  enabled: boolean;
  metadata?: IncomeSourceMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * Calculate fees for a given amount and income source
 */
export function calculateIncomeSourceFees(
  amountUSD: number,
  source: IncomeSource
): number {
  let feeUSD = 0;
  try {
    if (source?.metadata?.fees) {
      const fees = source.metadata.fees;
      if (fees.method === "fixed") {
        feeUSD = fees.fixedFeeUSD || 0;
      } else if (fees.method === "percentage") {
        feeUSD = amountUSD * ((fees.percentageFee || 0) / 100);
      } else if (fees.method === "hybrid") {
        feeUSD =
          (fees.fixedFeeUSD || 0) +
          amountUSD * ((fees.percentageFee || 0) / 100);
      }
    }
  } catch (error) {
    console.warn(
      `Failed to get fee information for source ${source.id}:`,
      error
    );
    // Fall back to legacy behavior for backward compatibility if needed
    // But in domain layer we should try to be strict or return 0
    feeUSD = 0;
  }
  return feeUSD;
}
