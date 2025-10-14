/**
 * Business category types and interfaces
 * Used to organize income source templates by industry/business type
 */

export type BusinessCategoryId =
  | "content-creator"
  | "service-provider"
  | "ecommerce"
  | "saas-tech"
  | "freelancer"
  | "real-estate"
  | "manufacturing"
  | "personal";

export interface BusinessCategory {
  /** Unique identifier */
  id: BusinessCategoryId;

  /** Display name */
  name: string;

  /** Description of the category */
  description: string;

  /** Icon configuration */
  icon: {
    type: "lucide";
    value: string;
    color: string;
    backgroundColor: string;
  };

  /** Example businesses/use cases */
  examples: string[];

  /** Recommended income source IDs for this category */
  recommendedSources: string[];

  /** Sort order for display */
  sortOrder: number;
}

export interface BusinessCategorySelection {
  /** Selected category */
  categoryId: BusinessCategoryId;

  /** Timestamp when selected */
  selectedAt: string;

  /** Whether custom sources were added */
  hasCustomSources?: boolean;
}
