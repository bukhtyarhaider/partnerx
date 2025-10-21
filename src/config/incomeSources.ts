import type { IncomeSource, IncomeSourceConfig } from "../types/incomeSource";

/**
 * Personal income sources - generic categories for personal finance tracking
 */
export const personalIncomeSources: IncomeSource[] = [
  {
    id: "salary",
    name: "Salary",
    enabled: false, // Changed to false - users select during onboarding
    metadata: {
      icon: {
        type: "lucide",
        value: "Briefcase",
        color: "#3b82f6", // blue-500
        backgroundColor: "#eff6ff", // blue-50
        darkMode: {
          color: "#60a5fa", // blue-400
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        },
      },
      fees: {
        fixedFeeUSD: 0,
        method: "fixed",
      },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: {
          enabled: false,
          type: "percentage",
          value: 0,
        },
        defaultCurrency: "USD",
      },
      display: {
        description: "Regular employment income and wages",
        category: "Employment",
        sortOrder: 1,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "freelance",
    name: "Freelance",
    enabled: false, // Changed to false - users select during onboarding
    metadata: {
      icon: {
        type: "lucide",
        value: "Laptop",
        color: "#8b5cf6", // violet-500
        backgroundColor: "#f5f3ff", // violet-50
        darkMode: {
          color: "#a78bfa", // violet-400
          backgroundColor: "rgba(139, 92, 246, 0.1)",
        },
      },
      fees: {
        fixedFeeUSD: 0,
        method: "fixed",
      },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: {
          enabled: false,
          type: "percentage",
          value: 0,
        },
        defaultCurrency: "USD",
      },
      display: {
        description: "Income from freelance work and consulting",
        category: "Self-Employment",
        sortOrder: 2,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "investments",
    name: "Investments",
    enabled: false, // Changed to false - users select during onboarding
    metadata: {
      icon: {
        type: "lucide",
        value: "TrendingUp",
        color: "#10b981", // emerald-500
        backgroundColor: "#ecfdf5", // emerald-50
        darkMode: {
          color: "#34d399", // emerald-400
          backgroundColor: "rgba(16, 185, 129, 0.1)",
        },
      },
      fees: {
        fixedFeeUSD: 0,
        method: "fixed",
      },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: {
          enabled: false,
          type: "percentage",
          value: 0,
        },
        defaultCurrency: "USD",
      },
      display: {
        description: "Dividends, interest, and capital gains",
        category: "Investment",
        sortOrder: 3,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "side-business",
    name: "Side Business",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Store",
        color: "#f59e0b", // amber-500
        backgroundColor: "#fffbeb", // amber-50
        darkMode: {
          color: "#fbbf24", // amber-400
          backgroundColor: "rgba(245, 158, 11, 0.1)",
        },
      },
      fees: {
        fixedFeeUSD: 0,
        method: "fixed",
      },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: {
          enabled: false,
          type: "percentage",
          value: 0,
        },
        defaultCurrency: "USD",
      },
      display: {
        description: "Income from side businesses and ventures",
        category: "Business",
        sortOrder: 4,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "rental",
    name: "Rental Income",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Home",
        color: "#06b6d4", // cyan-500
        backgroundColor: "#ecfeff", // cyan-50
        darkMode: {
          color: "#22d3ee", // cyan-400
          backgroundColor: "rgba(6, 182, 212, 0.1)",
        },
      },
      fees: {
        fixedFeeUSD: 0,
        method: "fixed",
      },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: {
          enabled: false,
          type: "percentage",
          value: 0,
        },
        defaultCurrency: "USD",
      },
      display: {
        description: "Income from property rentals",
        category: "Real Estate",
        sortOrder: 5,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "other-income",
    name: "Other Income",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "DollarSign",
        color: "#64748b", // slate-500
        backgroundColor: "#f8fafc", // slate-50
        darkMode: {
          color: "#94a3b8", // slate-400
          backgroundColor: "rgba(100, 116, 139, 0.1)",
        },
      },
      fees: {
        fixedFeeUSD: 0,
        method: "fixed",
      },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: {
          enabled: false,
          type: "percentage",
          value: 0,
        },
        defaultCurrency: "USD",
      },
      display: {
        description: "Miscellaneous income sources",
        category: "Other",
        sortOrder: 6,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
];

/**
 * Business income sources - content creator and business platforms
 */
export const businessIncomeSources: IncomeSource[] = [
  {
    id: "youtube",
    name: "YouTube",
    enabled: false, // Changed to false - users select during onboarding
    metadata: {
      icon: {
        type: "lucide",
        value: "Youtube",
        color: "#ef4444", // red-500
        backgroundColor: "#fef2f2", // red-50
        darkMode: {
          color: "#f87171", // red-400
          backgroundColor: "rgba(239, 68, 68, 0.1)", // red-500 with opacity
        },
      },
      fees: {
        fixedFeeUSD: 0,
        method: "fixed",
      },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: {
          enabled: false,
          type: "percentage",
          value: 0,
        },
        defaultCurrency: "USD",
        analyticsUrl:
          "https://studio.youtube.com/channel/{channelId}/analytics",
        apiConfig: {
          baseUrl: "https://www.googleapis.com/youtube/v3",
          authType: "oauth",
          requiredScopes: ["https://www.googleapis.com/auth/youtube.readonly"],
        },
      },
      display: {
        description: "Revenue from YouTube monetization and partnerships",
        category: "Video Platform",
        sortOrder: 1,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "tiktok",
    name: "TikTok",
    enabled: false, // Changed to false - users select during onboarding
    metadata: {
      icon: {
        type: "image",
        value: "/tiktok.png",
        backgroundColor: "#f1f5f9", // slate-100
        darkMode: {
          backgroundColor: "#334155", // slate-700
        },
      },
      fees: {
        fixedFeeUSD: 0,
        method: "fixed",
      },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: {
          enabled: false,
          type: "percentage",
          value: 0,
        },
        defaultCurrency: "USD",
        analyticsUrl: "https://business.tiktok.com/analytics",
        apiConfig: {
          baseUrl: "https://business-api.tiktok.com",
          authType: "oauth",
          requiredScopes: ["business.analytics.read"],
        },
      },
      display: {
        description: "Revenue from TikTok Creator Fund and brand partnerships",
        category: "Social Media",
        sortOrder: 2,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "facebook",
    name: "Facebook",
    enabled: false, // Changed to false - users select during onboarding
    metadata: {
      icon: {
        type: "lucide",
        value: "Facebook",
        color: "#3b5998", // blue-600
        backgroundColor: "#e9f0fb", // light blue
        darkMode: {
          color: "#8b9dc3", // blue-400
          backgroundColor: "rgba(59, 89, 152, 0.1)", // facebook blue with opacity
        },
      },
      fees: {
        fixedFeeUSD: 0,
        method: "fixed",
      },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: {
          enabled: false,
          type: "percentage",
          value: 0,
        },
        defaultCurrency: "USD",
        analyticsUrl: "https://business.facebook.com/insights",
        apiConfig: {
          baseUrl: "https://graph.facebook.com",
          authType: "oauth",
          requiredScopes: ["ads_management", "business_management"],
        },
      },
      display: {
        description: "Revenue from Facebook ads, marketplace, and partnerships",
        category: "Social Media",
        sortOrder: 3,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
];

/**
 * Combined income sources (for backward compatibility)
 * @deprecated Use getIncomeSourcesForAccountType instead
 */
export const defaultIncomeSources: IncomeSource[] = businessIncomeSources;

/**
 * Get income sources based on account type
 */
export const getIncomeSourcesForAccountType = (
  isPersonalMode: boolean
): IncomeSource[] => {
  return isPersonalMode ? personalIncomeSources : businessIncomeSources;
};

/**
 * Get default source ID based on account type
 */
export const getDefaultSourceId = (isPersonalMode: boolean): string => {
  return isPersonalMode ? "salary" : "youtube";
};

/**
 * Default income source configuration (business mode)
 * NOTE: All sources are disabled by default - users select during onboarding
 */
export const defaultIncomeSourceConfig: IncomeSourceConfig = {
  sources: businessIncomeSources,
  defaultSourceId: undefined, // No default - user must select
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
};

/**
 * Get income source configuration based on account type
 * NOTE: All sources are disabled by default - users select during onboarding
 */
export const getIncomeSourceConfig = (
  isPersonalMode: boolean
): IncomeSourceConfig => {
  return {
    sources: getIncomeSourcesForAccountType(isPersonalMode),
    defaultSourceId: undefined, // No default - user must select
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Helper function to get enabled sources only
 */
export const getEnabledSources = (
  config: IncomeSourceConfig = defaultIncomeSourceConfig
): IncomeSource[] => {
  return config.sources.filter((source) => source.enabled);
};

/**
 * Helper function to get source by ID
 */
export const getSourceById = (
  id: string,
  config: IncomeSourceConfig = defaultIncomeSourceConfig
): IncomeSource | undefined => {
  return config.sources.find((source) => source.id === id);
};

/**
 * Helper function to get sources by category
 */
export const getSourcesByCategory = (
  category: string,
  config: IncomeSourceConfig = defaultIncomeSourceConfig
): IncomeSource[] => {
  return config.sources.filter(
    (source) => source.metadata?.display?.category === category
  );
};

/**
 * Helper function to get sorted sources
 */
export const getSortedSources = (
  config: IncomeSourceConfig = defaultIncomeSourceConfig
): IncomeSource[] => {
  return [...config.sources].sort((a, b) => {
    const orderA = a.metadata?.display?.sortOrder ?? 999;
    const orderB = b.metadata?.display?.sortOrder ?? 999;
    return orderA - orderB;
  });
};
