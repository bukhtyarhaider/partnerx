import type { IncomeSource, IncomeSourceConfig } from "../types/incomeSource";

/**
 * Personal income sources - generic categories for personal finance tracking
 */
export const personalIncomeSources: IncomeSource[] = [
  {
    id: "salary",
    name: "Salary",
    enabled: true,
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
    enabled: true,
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
    enabled: true,
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
    enabled: true,
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
    enabled: true,
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
  // Additional dummy sources for demonstration
  {
    id: "instagram",
    name: "Instagram",
    enabled: false, // Disabled by default - can be enabled during onboarding
    metadata: {
      icon: {
        type: "lucide",
        value: "Instagram",
        color: "#e11d48", // rose-600
        backgroundColor: "#fff1f2", // rose-50
        darkMode: {
          color: "#fb7185", // rose-400
          backgroundColor: "rgba(225, 29, 72, 0.1)",
        },
      },
      fees: {
        fixedFeeUSD: 0,
        method: "fixed",
      },
      settings: {
        defaultTaxRate: 15,
        commissionRate: 0,
        analyticsUrl: "https://business.instagram.com/insights",
        apiConfig: {
          baseUrl: "https://graph.instagram.com",
          authType: "oauth",
          requiredScopes: ["instagram_basic", "instagram_content_publish"],
        },
      },
      display: {
        description:
          "Revenue from Instagram Reels, IGTV, and sponsored content",
        category: "Social Media",
        sortOrder: 3,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "twitch",
    name: "Twitch",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Twitch",
        color: "#7c3aed", // violet-600
        backgroundColor: "#f5f3ff", // violet-50
        darkMode: {
          color: "#a78bfa", // violet-400
          backgroundColor: "rgba(124, 58, 237, 0.1)",
        },
      },
      fees: {
        fixedFeeUSD: 0,
        percentageFee: 2.5, // Example: Twitch takes 2.5% for some transactions
        method: "percentage",
      },
      settings: {
        defaultTaxRate: 15,
        commissionRate: 50, // Revenue split with Twitch
        analyticsUrl: "https://dashboard.twitch.tv/analytics/revenue",
        apiConfig: {
          baseUrl: "https://api.twitch.tv/helix",
          authType: "oauth",
          requiredScopes: ["analytics:read:extensions", "user:read:email"],
        },
      },
      display: {
        description:
          "Revenue from Twitch streaming, subscriptions, and donations",
        category: "Live Streaming",
        sortOrder: 4,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "patreon",
    name: "Patreon",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Heart",
        color: "#f97316", // orange-500
        backgroundColor: "#fff7ed", // orange-50
        darkMode: {
          color: "#fb923c", // orange-400
          backgroundColor: "rgba(249, 115, 22, 0.1)",
        },
      },
      fees: {
        percentageFee: 8, // Patreon's fee structure
        method: "percentage",
      },
      settings: {
        defaultTaxRate: 15,
        commissionRate: 0,
        analyticsUrl: "https://www.patreon.com/portal/analytics",
        apiConfig: {
          baseUrl: "https://www.patreon.com/api/oauth2/v2",
          authType: "oauth",
          requiredScopes: ["identity", "campaigns"],
        },
      },
      display: {
        description: "Monthly recurring revenue from Patreon subscribers",
        category: "Subscription",
        sortOrder: 5,
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
 */
export const defaultIncomeSourceConfig: IncomeSourceConfig = {
  sources: businessIncomeSources,
  defaultSourceId: "youtube",
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
};

/**
 * Get income source configuration based on account type
 */
export const getIncomeSourceConfig = (
  isPersonalMode: boolean
): IncomeSourceConfig => {
  return {
    sources: getIncomeSourcesForAccountType(isPersonalMode),
    defaultSourceId: getDefaultSourceId(isPersonalMode),
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
