/**
 * Domain logic for Donations
 */

export interface DonationConfig {
  percentage: number;
  taxPreference: "before-tax" | "after-tax";
  enabled: boolean;
  minimumAmount?: number;
  maximumAmount?: number;
}

export interface DonationPayout {
  id: number;
  amount: number;
  date: string;
  paidTo: string;
  description: string;
}

export type NewDonationPayoutEntry = Omit<DonationPayout, "id">;

export const DEFAULT_DONATION_CONFIG: DonationConfig = {
  percentage: 10,
  taxPreference: "before-tax",
  enabled: true,
};
