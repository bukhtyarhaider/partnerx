export interface Partner {
  id: string;
  name: string;
  displayName: string;
  equity: number; // Percentage (0-1, e.g., 0.5 = 50%)
  joinDate: string;
  isActive: boolean;
  metadata?: {
    email?: string;
    role?: string;
    avatar?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface PartnerConfig {
  partners: Partner[];
  companyName: string;
  totalEquity: number;
  lastUpdated: string;
}

export type PartnerRecord<T> = Record<string, T>;
export type PartnerEarnings = PartnerRecord<number>;
export type PartnerExpenses = PartnerRecord<number>;

// Helper function to validate partner configuration
export function validatePartnerConfig(config: PartnerConfig): boolean {
  const totalEquity = config.partners
    .filter((p) => p.isActive)
    .reduce((sum, partner) => sum + partner.equity, 0);

  return Math.abs(totalEquity - 1) < 0.0001; // Allow for floating point precision
}

// Helper function to get active partners
export function getActivePartners(config: PartnerConfig): Partner[] {
  return config.partners.filter((p) => p.isActive);
}

// Helper function to get partner by ID
export function getPartnerById(
  config: PartnerConfig,
  partnerId: string
): Partner | undefined {
  return config.partners.find((p) => p.id === partnerId);
}

// Helper function to calculate partner shares based on equity
export function calculatePartnerShares(
  amount: number,
  config: PartnerConfig
): PartnerRecord<number> {
  const activePartners = getActivePartners(config);
  const shares: PartnerRecord<number> = {};

  activePartners.forEach((partner) => {
    shares[partner.id] = amount * partner.equity;
  });

  return shares;
}
