import type { PartnerConfig } from "../types/partner";

// Default partner configuration - this will be replaced by backend/database later
export const defaultPartnerConfig: PartnerConfig = {
  companyName: "PartnerWise",
  totalEquity: 1.0,
  lastUpdated: "2025-01-01T00:00:00.000Z",
  partners: [
    {
      id: "partner_bukhtyar",
      name: "Bukhtyar",
      displayName: "Bukhtyar Haider",
      equity: 0.5, // 50%
      joinDate: "2024-01-01T00:00:00.000Z",
      isActive: true,
      metadata: {
        email: "bukhtyar@partnerx.com",
        role: "Co-Founder & Technical Lead",
        avatar: "https://github.com/bukhtyarhaider.png",
      },
    },
    {
      id: "partner_asjad",
      name: "Asjad",
      displayName: "Asjad Malik",
      equity: 0.5, // 50%
      joinDate: "2024-01-01T00:00:00.000Z",
      isActive: true,
      metadata: {
        email: "asjad@partnerx.com",
        role: "Co-Founder & Business Lead",
      },
    },
  ],
};

// Example of how this could be extended for different scenarios
export const exampleAlternativeConfig: PartnerConfig = {
  companyName: "PartnerWise",
  totalEquity: 1.0,
  lastUpdated: "2025-01-01T00:00:00.000Z",
  partners: [
    {
      id: "partner_founder",
      name: "Founder",
      displayName: "Lead Founder",
      equity: 0.6, // 60%
      joinDate: "2024-01-01T00:00:00.000Z",
      isActive: true,
      metadata: {
        role: "Founder & CEO",
      },
    },
    {
      id: "partner_cofounder",
      name: "CoFounder",
      displayName: "Co-Founder",
      equity: 0.25, // 25%
      joinDate: "2024-03-01T00:00:00.000Z",
      isActive: true,
      metadata: {
        role: "Co-Founder & CTO",
      },
    },
    {
      id: "partner_investor",
      name: "Investor",
      displayName: "Early Investor",
      equity: 0.15, // 15%
      joinDate: "2024-06-01T00:00:00.000Z",
      isActive: true,
      metadata: {
        role: "Investor & Advisor",
      },
    },
  ],
};

// Future: This will be loaded from an API endpoint
// export async function loadPartnerConfig(): Promise<PartnerConfig> {
//   const response = await fetch('/api/partners/config');
//   return response.json();
// }

// Future: This will save to an API endpoint
// export async function savePartnerConfig(config: PartnerConfig): Promise<void> {
//   await fetch('/api/partners/config', {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(config)
//   });
// }
