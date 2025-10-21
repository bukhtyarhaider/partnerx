import type {
  IncomeSource,
  IncomeSourceConfig,
  IncomeSourceService,
  IncomeSourceValidation,
} from "../types/incomeSource";
import { defaultIncomeSourceConfig } from "../config/incomeSources";

/**
 * Mock implementation of IncomeSourceService
 * This simulates a backend service and can be easily replaced with real API calls
 */
class MockIncomeSourceService implements IncomeSourceService {
  private config: IncomeSourceConfig;

  constructor(initialConfig: IncomeSourceConfig = defaultIncomeSourceConfig) {
    // In a real implementation, this would be loaded from localStorage, sessionStorage, or API
    this.config = { ...initialConfig };
    this.loadConfig();
  }

  async getSources(): Promise<IncomeSource[]> {
    // Simulate network delay
    await this.simulateDelay();
    return [...this.config.sources];
  }

  async getSource(id: string): Promise<IncomeSource | null> {
    await this.simulateDelay();
    const source = this.config.sources.find((s) => s.id === id);
    return source ? { ...source } : null;
  }

  async addSource(
    source: Omit<IncomeSource, "createdAt" | "updatedAt">
  ): Promise<IncomeSource> {
    await this.simulateDelay();

    const validation = this.validateSource(source);
    if (!validation.isValid) {
      throw new Error(`Invalid source: ${validation.errors.join(", ")}`);
    }

    const isUnique = await this.isSourceIdUnique(source.id);
    if (!isUnique) {
      throw new Error(`Source with ID '${source.id}' already exists`);
    }

    const now = new Date().toISOString();
    const newSource: IncomeSource = {
      ...source,
      createdAt: now,
      updatedAt: now,
    };

    this.config.sources.push(newSource);
    this.config.lastUpdated = now;

    // In a real implementation, this would persist to backend
    this.persistConfig();

    return { ...newSource };
  }

  async updateSource(
    id: string,
    updates: Partial<IncomeSource>
  ): Promise<IncomeSource> {
    await this.simulateDelay();

    const sourceIndex = this.config.sources.findIndex((s) => s.id === id);
    if (sourceIndex === -1) {
      throw new Error(`Source with ID '${id}' not found`);
    }

    const currentSource = this.config.sources[sourceIndex];
    const updatedSource: IncomeSource = {
      ...currentSource,
      ...updates,
      id: currentSource.id, // Prevent ID changes
      createdAt: currentSource.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    const validation = this.validateSource(updatedSource);
    if (!validation.isValid) {
      throw new Error(`Invalid source update: ${validation.errors.join(", ")}`);
    }

    this.config.sources[sourceIndex] = updatedSource;
    this.config.lastUpdated = new Date().toISOString();

    this.persistConfig();

    return { ...updatedSource };
  }

  async removeSource(id: string): Promise<boolean> {
    await this.simulateDelay();

    const initialLength = this.config.sources.length;
    this.config.sources = this.config.sources.filter((s) => s.id !== id);

    if (this.config.sources.length < initialLength) {
      this.config.lastUpdated = new Date().toISOString();
      this.persistConfig();
      return true;
    }

    return false;
  }

  validateSource(source: Partial<IncomeSource>): IncomeSourceValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!source.id || source.id.trim() === "") {
      errors.push("Source ID is required");
    } else if (!/^[a-z0-9_-]+$/.test(source.id)) {
      errors.push(
        "Source ID must contain only lowercase letters, numbers, underscores, and hyphens"
      );
    }

    if (!source.name || source.name.trim() === "") {
      errors.push("Source name is required");
    }

    if (source.enabled === undefined) {
      errors.push("Enabled status is required");
    }

    // Metadata validation
    if (source.metadata?.fees) {
      const fees = source.metadata.fees;
      if (fees.fixedFeeUSD && fees.fixedFeeUSD < 0) {
        errors.push("Fixed fee cannot be negative");
      }
      if (
        fees.percentageFee &&
        (fees.percentageFee < 0 || fees.percentageFee > 100)
      ) {
        errors.push("Percentage fee must be between 0 and 100");
      }
    }

    if (source.metadata?.settings) {
      const settings = source.metadata.settings;
      if (
        settings.defaultTaxRate &&
        (settings.defaultTaxRate < 0 || settings.defaultTaxRate > 100)
      ) {
        errors.push("Default tax rate must be between 0 and 100");
      }
      if (
        settings.commissionRate &&
        (settings.commissionRate < 0 || settings.commissionRate > 100)
      ) {
        errors.push("Commission rate must be between 0 and 100");
      }
    }

    // Warnings
    if (!source.metadata?.icon) {
      warnings.push("No icon specified - default icon will be used");
    }

    if (!source.metadata?.display?.description) {
      warnings.push(
        "No description provided - consider adding one for better UX"
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async isSourceIdUnique(id: string, excludeId?: string): Promise<boolean> {
    await this.simulateDelay(50); // Shorter delay for validation

    const existingSource = this.config.sources.find(
      (s) => s.id === id && s.id !== excludeId
    );

    return !existingSource;
  }

  /**
   * Get the current configuration (useful for debugging or export)
   */
  async getConfig(): Promise<IncomeSourceConfig> {
    await this.simulateDelay();
    return { ...this.config };
  }

  /**
   * Reset to default configuration
   */
  async resetToDefault(): Promise<void> {
    await this.simulateDelay();
    this.config = { ...defaultIncomeSourceConfig };
    this.persistConfig();
  }

  /**
   * Simulate network delay for realistic async behavior
   */
  private async simulateDelay(ms: number = 100): Promise<void> {
    // Skip delay in test environment (when available)
    const isTest =
      typeof globalThis !== "undefined" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).process?.env?.NODE_ENV === "test";

    if (!isTest) {
      await new Promise((resolve) => setTimeout(resolve, ms));
    }
  }

  /**
   * Persist configuration (in real implementation, this would call backend API)
   */
  private persistConfig(): void {
    // In a real implementation, this would:
    // 1. Call backend API to save changes
    // 2. Update localStorage/sessionStorage for offline support
    // 3. Emit events for other parts of the app to react to changes

    try {
      // Store as array of IncomeSource objects for simplicity and consistency
      // This makes it easier to work with throughout the app
      localStorage.setItem(
        "incomeSourceConfig",
        JSON.stringify(this.config.sources)
      );

      if (import.meta.env.DEV) {
        console.log(
          "✓ Persisted income source config:",
          this.config.sources.length,
          "sources"
        );
      }
    } catch (error) {
      console.warn(
        "Failed to persist income source config to localStorage:",
        error
      );
    }
  }

  /**
   * Load configuration from storage (called during initialization)
   */
  private loadConfig(): void {
    try {
      // Load from incomeSourceConfig first
      const stored = localStorage.getItem("incomeSourceConfig");
      if (stored) {
        const parsedConfig = JSON.parse(stored);

        // Handle different storage formats
        if (Array.isArray(parsedConfig)) {
          // Direct array of IncomeSource objects (expected format)
          if (parsedConfig.length > 0 && typeof parsedConfig[0] === "object") {
            this.config = {
              sources: parsedConfig,
              version: "1.0.0",
              lastUpdated: new Date().toISOString(),
            };
            if (import.meta.env.DEV) {
              console.log(
                "✓ Loaded income source config:",
                this.config.sources.length,
                "sources"
              );
            }
            return;
          }
        } else if (
          parsedConfig.sources &&
          Array.isArray(parsedConfig.sources)
        ) {
          // Standard IncomeSourceConfig object format
          this.config = {
            ...defaultIncomeSourceConfig,
            ...parsedConfig,
            sources: parsedConfig.sources || defaultIncomeSourceConfig.sources,
          };
          if (import.meta.env.DEV) {
            console.log(
              "✓ Loaded income source config:",
              this.config.sources.length,
              "sources"
            );
          }
          return;
        }
      }

      // Check for onboarding income sources (migration path)
      const onboardingSources = localStorage.getItem(
        "onboarding_income_sources"
      );
      if (onboardingSources) {
        const parsed = JSON.parse(onboardingSources);

        // Should be array of full IncomeSource objects
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === "object") {
            this.config = {
              sources: parsed,
              version: "1.0.0",
              lastUpdated: new Date().toISOString(),
            };

            // Save as main config
            localStorage.setItem("incomeSourceConfig", JSON.stringify(parsed));

            if (import.meta.env.DEV) {
              console.log(
                "✓ Migrated income sources from onboarding:",
                parsed.length,
                "sources"
              );
            }
            return;
          }
        }
      }

      // Fall back to default
      this.config = { ...defaultIncomeSourceConfig };
      if (import.meta.env.DEV) {
        console.log("✓ Using default income source config");
      }
    } catch (error) {
      console.warn(
        "Failed to load income source config from localStorage:",
        error
      );
      this.config = { ...defaultIncomeSourceConfig };
    }
  }
}

// Create singleton instance
export const incomeSourceService = new MockIncomeSourceService();

/**
 * Factory function to create a new service instance
 * Useful for testing or when you need isolated instances
 */
export const createIncomeSourceService = (
  initialConfig?: IncomeSourceConfig
): IncomeSourceService => {
  return new MockIncomeSourceService(initialConfig);
};
