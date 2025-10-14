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
 * Additional income sources for various business types
 */
const additionalIncomeSources: IncomeSource[] = [
  // Content Creator sources
  {
    id: "sponsorships",
    name: "Sponsorships",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Handshake",
        color: "#0ea5e9",
        backgroundColor: "#f0f9ff",
        darkMode: {
          color: "#38bdf8",
          backgroundColor: "rgba(14, 165, 233, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Brand sponsorships and partnerships",
        category: "Content Creator",
        sortOrder: 10,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "affiliate-marketing",
    name: "Affiliate Marketing",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Link",
        color: "#8b5cf6",
        backgroundColor: "#f5f3ff",
        darkMode: {
          color: "#a78bfa",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Commissions from affiliate links and referrals",
        category: "Content Creator",
        sortOrder: 11,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "merchandise",
    name: "Merchandise Sales",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "ShoppingBag",
        color: "#ec4899",
        backgroundColor: "#fdf2f8",
        darkMode: {
          color: "#f472b6",
          backgroundColor: "rgba(236, 72, 153, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Income from selling branded merchandise",
        category: "Content Creator",
        sortOrder: 12,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "digital-products",
    name: "Digital Products",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Package",
        color: "#14b8a6",
        backgroundColor: "#f0fdfa",
        darkMode: {
          color: "#2dd4bf",
          backgroundColor: "rgba(20, 184, 166, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Courses, ebooks, templates, and digital downloads",
        category: "Content Creator",
        sortOrder: 13,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  // Service Provider sources
  {
    id: "client-retainers",
    name: "Client Retainers",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "CalendarCheck",
        color: "#3b82f6",
        backgroundColor: "#eff6ff",
        darkMode: {
          color: "#60a5fa",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Monthly recurring retainer agreements",
        category: "Service Provider",
        sortOrder: 20,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "project-work",
    name: "Project-Based Work",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "FolderKanban",
        color: "#6366f1",
        backgroundColor: "#eef2ff",
        darkMode: {
          color: "#818cf8",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "One-time project payments",
        category: "Service Provider",
        sortOrder: 21,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "maintenance-contracts",
    name: "Maintenance Contracts",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Wrench",
        color: "#f59e0b",
        backgroundColor: "#fffbeb",
        darkMode: {
          color: "#fbbf24",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Ongoing maintenance and support agreements",
        category: "Service Provider",
        sortOrder: 22,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "consulting-fees",
    name: "Consulting Fees",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "UserCheck",
        color: "#10b981",
        backgroundColor: "#ecfdf5",
        darkMode: {
          color: "#34d399",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Consulting and advisory services",
        category: "Service Provider",
        sortOrder: 23,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "hourly-billing",
    name: "Hourly Billing",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Clock",
        color: "#06b6d4",
        backgroundColor: "#ecfeff",
        darkMode: {
          color: "#22d3ee",
          backgroundColor: "rgba(6, 182, 212, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Time-based billing for services",
        category: "Service Provider",
        sortOrder: 24,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  // E-commerce sources
  {
    id: "online-store",
    name: "Online Store",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Store",
        color: "#8b5cf6",
        backgroundColor: "#f5f3ff",
        darkMode: {
          color: "#a78bfa",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Direct sales from your online store",
        category: "E-commerce",
        sortOrder: 30,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "amazon-sales",
    name: "Amazon Sales",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "ShoppingCart",
        color: "#f97316",
        backgroundColor: "#fff7ed",
        darkMode: {
          color: "#fb923c",
          backgroundColor: "rgba(249, 115, 22, 0.1)",
        },
      },
      fees: { percentageFee: 15, method: "percentage" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Sales through Amazon marketplace",
        category: "E-commerce",
        sortOrder: 31,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "wholesale",
    name: "Wholesale",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Package2",
        color: "#0ea5e9",
        backgroundColor: "#f0f9ff",
        darkMode: {
          color: "#38bdf8",
          backgroundColor: "rgba(14, 165, 233, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Bulk wholesale orders",
        category: "E-commerce",
        sortOrder: 32,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "subscription-revenue",
    name: "Subscription Revenue",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "RefreshCw",
        color: "#10b981",
        backgroundColor: "#ecfdf5",
        darkMode: {
          color: "#34d399",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Recurring subscription payments",
        category: "E-commerce",
        sortOrder: 33,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "marketplace-sales",
    name: "Marketplace Sales",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "ShoppingBag",
        color: "#ec4899",
        backgroundColor: "#fdf2f8",
        darkMode: {
          color: "#f472b6",
          backgroundColor: "rgba(236, 72, 153, 0.1)",
        },
      },
      fees: { percentageFee: 10, method: "percentage" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Sales on Etsy, eBay, and other marketplaces",
        category: "E-commerce",
        sortOrder: 34,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  // SaaS/Tech sources
  {
    id: "license-fees",
    name: "License Fees",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Key",
        color: "#6366f1",
        backgroundColor: "#eef2ff",
        darkMode: {
          color: "#818cf8",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Software license and usage fees",
        category: "SaaS/Tech",
        sortOrder: 40,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "api-usage",
    name: "API Usage Fees",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Terminal",
        color: "#06b6d4",
        backgroundColor: "#ecfeff",
        darkMode: {
          color: "#22d3ee",
          backgroundColor: "rgba(6, 182, 212, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Pay-per-use API charges",
        category: "SaaS/Tech",
        sortOrder: 41,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "enterprise-contracts",
    name: "Enterprise Contracts",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Building2",
        color: "#3b82f6",
        backgroundColor: "#eff6ff",
        darkMode: {
          color: "#60a5fa",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Large enterprise agreements",
        category: "SaaS/Tech",
        sortOrder: 42,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "app-purchases",
    name: "App Purchases",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Smartphone",
        color: "#8b5cf6",
        backgroundColor: "#f5f3ff",
        darkMode: {
          color: "#a78bfa",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
        },
      },
      fees: { percentageFee: 30, method: "percentage" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "In-app purchases and app store sales",
        category: "SaaS/Tech",
        sortOrder: 43,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  // Freelancer platforms
  {
    id: "upwork",
    name: "Upwork",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Briefcase",
        color: "#10b981",
        backgroundColor: "#ecfdf5",
        darkMode: {
          color: "#34d399",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
        },
      },
      fees: { percentageFee: 10, method: "percentage" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Freelance work through Upwork",
        category: "Freelancer",
        sortOrder: 50,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "fiverr",
    name: "Fiverr",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Zap",
        color: "#10b981",
        backgroundColor: "#ecfdf5",
        darkMode: {
          color: "#34d399",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
        },
      },
      fees: { percentageFee: 20, method: "percentage" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Gigs and services on Fiverr",
        category: "Freelancer",
        sortOrder: 51,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  // Real Estate sources
  {
    id: "rental-income",
    name: "Rental Income",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Home",
        color: "#f59e0b",
        backgroundColor: "#fffbeb",
        darkMode: {
          color: "#fbbf24",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Monthly rental payments from properties",
        category: "Real Estate",
        sortOrder: 60,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "property-sales",
    name: "Property Sales",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Building",
        color: "#0ea5e9",
        backgroundColor: "#f0f9ff",
        darkMode: {
          color: "#38bdf8",
          backgroundColor: "rgba(14, 165, 233, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Income from selling properties",
        category: "Real Estate",
        sortOrder: 61,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "commissions",
    name: "Real Estate Commissions",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Percent",
        color: "#6366f1",
        backgroundColor: "#eef2ff",
        darkMode: {
          color: "#818cf8",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Agent commissions from property transactions",
        category: "Real Estate",
        sortOrder: 62,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "lease-payments",
    name: "Lease Payments",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "FileText",
        color: "#10b981",
        backgroundColor: "#ecfdf5",
        darkMode: {
          color: "#34d399",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Commercial lease payments",
        category: "Real Estate",
        sortOrder: 63,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "short-term-rentals",
    name: "Short-term Rentals",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Bed",
        color: "#ec4899",
        backgroundColor: "#fdf2f8",
        darkMode: {
          color: "#f472b6",
          backgroundColor: "rgba(236, 72, 153, 0.1)",
        },
      },
      fees: { percentageFee: 15, method: "percentage" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Airbnb and vacation rental income",
        category: "Real Estate",
        sortOrder: 64,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  // Manufacturing sources
  {
    id: "product-sales",
    name: "Product Sales",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Package",
        color: "#8b5cf6",
        backgroundColor: "#f5f3ff",
        darkMode: {
          color: "#a78bfa",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Direct product sales",
        category: "Manufacturing",
        sortOrder: 70,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "contract-manufacturing",
    name: "Contract Manufacturing",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Factory",
        color: "#0ea5e9",
        backgroundColor: "#f0f9ff",
        darkMode: {
          color: "#38bdf8",
          backgroundColor: "rgba(14, 165, 233, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Manufacturing services for other companies",
        category: "Manufacturing",
        sortOrder: 71,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "bulk-orders",
    name: "Bulk Orders",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Boxes",
        color: "#f59e0b",
        backgroundColor: "#fffbeb",
        darkMode: {
          color: "#fbbf24",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Large quantity orders",
        category: "Manufacturing",
        sortOrder: 72,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "b2b-sales",
    name: "B2B Sales",
    enabled: false,
    metadata: {
      icon: {
        type: "lucide",
        value: "Building2",
        color: "#3b82f6",
        backgroundColor: "#eff6ff",
        darkMode: {
          color: "#60a5fa",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        },
      },
      fees: { fixedFeeUSD: 0, method: "fixed" },
      settings: {
        defaultTaxRate: 0,
        commissionRate: 0,
        tax: { enabled: false, type: "percentage", value: 0 },
        defaultCurrency: "USD",
      },
      display: {
        description: "Business-to-business sales",
        category: "Manufacturing",
        sortOrder: 73,
      },
    },
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
];

/**
 * Core platform income sources - content creator and business platforms
 */
const corePlatformSources: IncomeSource[] = [
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
  // Additional dummy sources for demonstration
  {
    id: "instagram",
    name: "Instagram",
    enabled: false,
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
        tax: {
          enabled: false,
          type: "percentage",
          value: 0,
        },
        defaultCurrency: "USD",
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
        tax: {
          enabled: false,
          type: "percentage",
          value: 0,
        },
        defaultCurrency: "USD",
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
        tax: {
          enabled: false,
          type: "percentage",
          value: 0,
        },
        defaultCurrency: "USD",
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
 * Business income sources - combines all platform and business sources
 */
export const businessIncomeSources: IncomeSource[] = [
  ...corePlatformSources,
  ...additionalIncomeSources,
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
