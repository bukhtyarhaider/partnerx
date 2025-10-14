import type { BusinessCategory } from "../types/businessCategory";

/**
 * Business category definitions with recommended income sources
 */
export const businessCategories: BusinessCategory[] = [
  {
    id: "content-creator",
    name: "Content Creator",
    description:
      "YouTubers, podcasters, streamers, and digital content producers",
    icon: {
      type: "lucide",
      value: "Video",
      color: "#ef4444",
      backgroundColor: "#fef2f2",
    },
    examples: [
      "YouTube creators",
      "Twitch streamers",
      "Podcasters",
      "Instagram influencers",
      "TikTok creators",
    ],
    recommendedSources: [
      "youtube",
      "twitch",
      "tiktok",
      "instagram",
      "patreon",
      "sponsorships",
      "affiliate-marketing",
      "merchandise",
      "digital-products",
    ],
    sortOrder: 1,
  },
  {
    id: "service-provider",
    name: "Service Provider / Agency",
    description: "Agencies, consultants, and professional service businesses",
    icon: {
      type: "lucide",
      value: "Briefcase",
      color: "#3b82f6",
      backgroundColor: "#eff6ff",
    },
    examples: [
      "Marketing agencies",
      "Design studios",
      "Consulting firms",
      "Legal services",
      "Accounting firms",
    ],
    recommendedSources: [
      "client-retainers",
      "project-work",
      "maintenance-contracts",
      "consulting-fees",
      "hourly-billing",
    ],
    sortOrder: 2,
  },
  {
    id: "ecommerce",
    name: "E-commerce / Product Seller",
    description: "Online stores, retail businesses, and product sellers",
    icon: {
      type: "lucide",
      value: "ShoppingCart",
      color: "#8b5cf6",
      backgroundColor: "#f5f3ff",
    },
    examples: [
      "Shopify stores",
      "Amazon sellers",
      "Etsy shops",
      "Wholesale distributors",
      "Subscription boxes",
    ],
    recommendedSources: [
      "online-store",
      "amazon-sales",
      "wholesale",
      "subscription-revenue",
      "marketplace-sales",
    ],
    sortOrder: 3,
  },
  {
    id: "saas-tech",
    name: "SaaS / Tech Startup",
    description: "Software companies, app developers, and tech startups",
    icon: {
      type: "lucide",
      value: "Code",
      color: "#06b6d4",
      backgroundColor: "#ecfeff",
    },
    examples: [
      "SaaS platforms",
      "Mobile apps",
      "API services",
      "Software licenses",
      "Tech products",
    ],
    recommendedSources: [
      "subscription-revenue",
      "license-fees",
      "api-usage",
      "enterprise-contracts",
      "app-purchases",
    ],
    sortOrder: 4,
  },
  {
    id: "freelancer",
    name: "Freelancer / Consultant",
    description: "Independent contractors and solo professionals",
    icon: {
      type: "lucide",
      value: "Laptop",
      color: "#10b981",
      backgroundColor: "#ecfdf5",
    },
    examples: [
      "Freelance writers",
      "Designers",
      "Developers",
      "Photographers",
      "Virtual assistants",
    ],
    recommendedSources: [
      "freelance",
      "project-work",
      "hourly-billing",
      "upwork",
      "fiverr",
    ],
    sortOrder: 5,
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Property investors, agents, and real estate businesses",
    icon: {
      type: "lucide",
      value: "Home",
      color: "#f59e0b",
      backgroundColor: "#fffbeb",
    },
    examples: [
      "Rental properties",
      "Real estate agents",
      "Property flipping",
      "Commercial leasing",
      "Airbnb hosting",
    ],
    recommendedSources: [
      "rental-income",
      "property-sales",
      "commissions",
      "lease-payments",
      "short-term-rentals",
    ],
    sortOrder: 6,
  },
  {
    id: "manufacturing",
    name: "Manufacturing / Production",
    description: "Manufacturers, producers, and production businesses",
    icon: {
      type: "lucide",
      value: "Factory",
      color: "#6366f1",
      backgroundColor: "#eef2ff",
    },
    examples: [
      "Product manufacturing",
      "Food production",
      "Crafts & handmade goods",
      "Contract manufacturing",
      "Assembly services",
    ],
    recommendedSources: [
      "product-sales",
      "wholesale",
      "contract-manufacturing",
      "bulk-orders",
      "b2b-sales",
    ],
    sortOrder: 7,
  },
  {
    id: "personal",
    name: "Personal Finance",
    description: "Individual income tracking for personal use",
    icon: {
      type: "lucide",
      value: "User",
      color: "#ec4899",
      backgroundColor: "#fdf2f8",
    },
    examples: [
      "Salary tracking",
      "Side hustles",
      "Investment income",
      "Rental income",
      "Freelance work",
    ],
    recommendedSources: [
      "salary",
      "freelance",
      "investments",
      "side-business",
      "rental-income",
    ],
    sortOrder: 8,
  },
];

/**
 * Get category by ID
 */
export const getCategoryById = (id: string): BusinessCategory | undefined => {
  return businessCategories.find((cat) => cat.id === id);
};

/**
 * Get recommended sources for a category
 */
export const getRecommendedSourcesForCategory = (
  categoryId: string
): string[] => {
  const category = getCategoryById(categoryId);
  return category?.recommendedSources || [];
};
