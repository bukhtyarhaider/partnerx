/**
 * Types and interfaces for dynamic income sources
 * This replaces hardcoded platform references with a flexible, configurable system
 */

export interface IncomeSourceMetadata {
  /** Optional icon configuration */
  icon?: {
    /** Icon type - can be a lucide icon name or custom image path */
    type: "lucide" | "image";
    /** Icon identifier - lucide icon name or image path */
    value: string;
    /** Icon color for theming */
    color?: string;
    /** Background color for icon container */
    backgroundColor?: string;
    /** Dark mode variants */
    darkMode?: {
      color?: string;
      backgroundColor?: string;
    };
  };

  /** Revenue processing configuration */
  fees?: {
    /** Fixed fee amount in USD */
    fixedFeeUSD?: number;
    /** Percentage-based fee (0-100) */
    percentageFee?: number;
    /** Fee calculation method */
    method?: "fixed" | "percentage" | "hybrid";
  };

  /** Platform-specific settings */
  settings?: {
    /** Default tax rate for this platform */
    defaultTaxRate?: number;
    /** Commission rate split */
    commissionRate?: number;
    /** Analytics URL template */
    analyticsUrl?: string;
    /** API configuration for future integration */
    apiConfig?: {
      baseUrl?: string;
      authType?: "oauth" | "apikey" | "none";
      requiredScopes?: string[];
    };
    /** Tax configuration */
    tax?: {
      /** Whether tax is enabled for this income source */
      enabled: boolean;
      /** Tax calculation method - percentage or fixed amount */
      type: "percentage" | "fixed";
      /** Tax value (percentage 0-100 or fixed amount in PKR) */
      value: number;
    };
    /** Default currency for this income source */
    defaultCurrency?: "PKR" | "USD";
  };

  /** Display configuration */
  display?: {
    /** Custom display name (if different from name) */
    displayName?: string;
    /** Description for tooltips/help */
    description?: string;
    /** Category for grouping */
    category?: string;
    /** Sort order */
    sortOrder?: number;
  };
}

export interface IncomeSource {
  /** Unique identifier for the income source */
  id: string;

  /** Human-readable name */
  name: string;

  /** Whether this source is currently active/enabled */
  enabled: boolean;

  /** Optional metadata for enhanced functionality */
  metadata?: IncomeSourceMetadata;

  /** Timestamp when this source was created */
  createdAt: string;

  /** Timestamp when this source was last updated */
  updatedAt: string;
}

export interface IncomeSourceConfig {
  /** Array of available income sources */
  sources: IncomeSource[];

  /** Default source ID to use for new transactions */
  defaultSourceId?: string;

  /** Configuration metadata */
  version: string;
  lastUpdated: string;
}

export interface IncomeSourceValidation {
  /** Whether the source configuration is valid */
  isValid: boolean;

  /** Array of validation errors */
  errors: string[];

  /** Array of warnings */
  warnings?: string[];
}

/**
 * Service interface for income source management
 * This will be implemented to support future backend integration
 */
export interface IncomeSourceService {
  /** Get all available income sources */
  getSources(): Promise<IncomeSource[]>;

  /** Get a specific income source by ID */
  getSource(id: string): Promise<IncomeSource | null>;

  /** Add a new income source */
  addSource(
    source: Omit<IncomeSource, "createdAt" | "updatedAt">
  ): Promise<IncomeSource>;

  /** Update an existing income source */
  updateSource(
    id: string,
    updates: Partial<IncomeSource>
  ): Promise<IncomeSource>;

  /** Remove an income source */
  removeSource(id: string): Promise<boolean>;

  /** Validate income source configuration */
  validateSource(source: Partial<IncomeSource>): IncomeSourceValidation;

  /** Check if source ID is unique */
  isSourceIdUnique(id: string, excludeId?: string): Promise<boolean>;

  /** Reload configuration from storage */
  reload(): Promise<void>;
}

/**
 * Hook interface for consuming income sources in React components
 */
export interface UseIncomeSourcesResult {
  /** Array of available income sources */
  sources: IncomeSource[];

  /** Loading state */
  loading: boolean;

  /** Error state */
  error: string | null;

  /** Get source by ID */
  getSourceById: (id: string) => IncomeSource | undefined;

  /** Get enabled sources only */
  getEnabledSources: () => IncomeSource[];

  /** Refresh sources from service */
  refresh: () => Promise<void>;
}
