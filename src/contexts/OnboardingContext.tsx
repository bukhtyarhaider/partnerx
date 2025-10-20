import { useState, useMemo, useCallback, type ReactNode } from "react";
import { OnboardingContext } from "./OnboardingContextBase";
import type {
  BusinessInfo,
  OnboardingProgress,
  OnboardingContextValue,
} from "../types/onboarding";
import { ONBOARDING_STEPS } from "../types/onboarding";

const ONBOARDING_STORAGE_KEY = "onboarding_progress";
const BUSINESS_INFO_STORAGE_KEY = "business_info";

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  // Initialize progress from localStorage or defaults
  const [progress, setProgress] = useState<OnboardingProgress>(() => {
    const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          steps: ONBOARDING_STEPS.map((step) => ({
            ...step,
            completed:
              parsed.steps?.find(
                (s: { id: string; completed: boolean }) => s.id === step.id
              )?.completed || false,
          })),
        };
      } catch {
        // Fall back to defaults if parsing fails
      }
    }

    return {
      currentStepIndex: 0,
      steps: [...ONBOARDING_STEPS],
    };
  });

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(() => {
    const stored = localStorage.getItem(BUSINESS_INFO_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Check if onboarding is completed
  const isCompleted = useMemo(() => {
    return (
      progress.completedAt != null &&
      progress.steps
        .filter((step) => !step.skippable)
        .every((step) => step.completed)
    );
  }, [progress]);

  // Navigation functions
  const goToNextStep = useCallback(() => {
    setProgress((prev) => {
      if (prev.currentStepIndex < prev.steps.length - 1) {
        let nextStepIndex = prev.currentStepIndex + 1;

        // Skip the "add-partners" step if user chose "personal" account type
        const isPersonalAccount = businessInfo?.type === "personal";
        const nextStep = prev.steps[nextStepIndex];

        if (isPersonalAccount && nextStep?.id === "add-partners") {
          // Skip to the step after partners
          nextStepIndex = Math.min(nextStepIndex + 1, prev.steps.length - 1);

          // Auto-complete the partners step since we're skipping it
          const updatedSteps = prev.steps.map((step) =>
            step.id === "add-partners" ? { ...step, completed: true } : step
          );

          const newProgress = {
            ...prev,
            currentStepIndex: nextStepIndex,
            steps: updatedSteps,
          };
          localStorage.setItem(
            ONBOARDING_STORAGE_KEY,
            JSON.stringify(newProgress)
          );
          return newProgress;
        }

        const newProgress = {
          ...prev,
          currentStepIndex: nextStepIndex,
        };
        localStorage.setItem(
          ONBOARDING_STORAGE_KEY,
          JSON.stringify(newProgress)
        );
        return newProgress;
      }
      return prev;
    });
  }, [businessInfo?.type]);

  const goToPreviousStep = useCallback(() => {
    setProgress((prev) => {
      if (prev.currentStepIndex > 0) {
        let previousStepIndex = prev.currentStepIndex - 1;

        // Skip back over the "add-partners" step if user chose "personal" account type
        const isPersonalAccount = businessInfo?.type === "personal";
        const previousStep = prev.steps[previousStepIndex];

        if (isPersonalAccount && previousStep?.id === "add-partners") {
          // Skip to the step before partners
          previousStepIndex = Math.max(previousStepIndex - 1, 0);
        }

        const newProgress = {
          ...prev,
          currentStepIndex: previousStepIndex,
        };
        localStorage.setItem(
          ONBOARDING_STORAGE_KEY,
          JSON.stringify(newProgress)
        );
        return newProgress;
      }
      return prev;
    });
  }, [businessInfo?.type]);

  const goToStep = (stepIndex: number) => {
    setProgress((prev) => {
      if (stepIndex >= 0 && stepIndex < prev.steps.length) {
        const newProgress = {
          ...prev,
          currentStepIndex: stepIndex,
        };
        localStorage.setItem(
          ONBOARDING_STORAGE_KEY,
          JSON.stringify(newProgress)
        );
        return newProgress;
      }
      return prev;
    });
  };

  // Business info management
  const updateBusinessInfo = (info: Partial<BusinessInfo>) => {
    setBusinessInfo((prev) => {
      const newInfo = prev ? { ...prev, ...info } : (info as BusinessInfo);
      localStorage.setItem(BUSINESS_INFO_STORAGE_KEY, JSON.stringify(newInfo));
      return newInfo;
    });
  };

  // Step management
  const markStepCompleted = (stepId: string) => {
    setProgress((prev) => {
      const newSteps = prev.steps.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      );
      const newProgress = {
        ...prev,
        steps: newSteps,
      };
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const canProceedToNextStep = useCallback((): boolean => {
    const currentStep = progress.steps[progress.currentStepIndex];
    return currentStep
      ? currentStep.completed || (currentStep.skippable ?? false)
      : false;
  }, [progress.steps, progress.currentStepIndex]);

  // Validate migrated data to ensure integrity
  const validateMigratedData = useCallback((): boolean => {
    try {
      let isValid = true;

      // Validate partner config if it exists
      const partnerConfigStr = localStorage.getItem("partnerConfig");
      if (partnerConfigStr) {
        const partnerConfig = JSON.parse(partnerConfigStr);

        if (!partnerConfig.partners || !Array.isArray(partnerConfig.partners)) {
          console.error("❌ Invalid partnerConfig: partners array missing");
          isValid = false;
        } else if (partnerConfig.partners.length > 0) {
          // Validate equity totals
          const totalEquity = partnerConfig.partners.reduce(
            (sum: number, p: { equity?: number }) => sum + (p.equity || 0),
            0
          );

          if (totalEquity > 1.01) {
            // Allow small floating point errors
            console.error(
              "❌ Invalid partnerConfig: total equity exceeds 100%",
              totalEquity
            );
            isValid = false;
          }

          // Validate each partner has required fields
          for (const partner of partnerConfig.partners) {
            if (
              !partner.id ||
              !partner.name ||
              typeof partner.equity !== "number"
            ) {
              console.error("❌ Invalid partner data:", partner);
              isValid = false;
            }
          }
        }
      }

      // Validate donation config if it exists
      const donationConfigStr = localStorage.getItem("donationConfig");
      if (donationConfigStr) {
        const donationConfig = JSON.parse(donationConfigStr);

        if (typeof donationConfig.enabled !== "boolean") {
          console.error("❌ Invalid donationConfig: enabled field invalid");
          isValid = false;
        }

        if (donationConfig.enabled) {
          if (
            typeof donationConfig.percentage !== "number" ||
            donationConfig.percentage < 0 ||
            donationConfig.percentage > 100
          ) {
            console.error("❌ Invalid donationConfig: percentage out of range");
            isValid = false;
          }
        }
      }

      // Validate income source config if it exists
      const incomeSourceConfigStr = localStorage.getItem("incomeSourceConfig");
      if (incomeSourceConfigStr) {
        try {
          const config = JSON.parse(incomeSourceConfigStr);

          // Income sources are stored as a direct array
          if (!Array.isArray(config)) {
            if (import.meta.env.DEV) {
              console.error("❌ Invalid incomeSourceConfig: not an array");
              console.log("Actual structure:", config);
            }
            isValid = false;
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error("❌ Failed to parse incomeSourceConfig:", error);
          }
          isValid = false;
        }
      }

      if (isValid && import.meta.env.DEV) {
        console.log("✓ All migrated data validated successfully");
      }

      return isValid;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error validating migrated data:", error);
      }
      return false;
    }
  }, []);

  // Function to clean up temporary onboarding data
  const cleanupOnboardingData = useCallback(() => {
    try {
      // Remove temporary onboarding keys after migration
      const keysToRemove = [
        "onboarding_progress",
        "onboarding_partners",
        "onboarding_donation_config",
        "onboarding_income_sources",
      ];

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      if (import.meta.env.DEV) {
        console.log("✓ Cleaned up temporary onboarding data");
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Failed to cleanup onboarding data:", error);
      }
    }
  }, []); // Function to migrate onboarding data to main app storage
  const migrateOnboardingDataToMain = useCallback(() => {
    try {
      let migrationSuccessful = true;

      // Migrate partners data (only if partners were added)
      const onboardingPartners = localStorage.getItem("onboarding_partners");
      if (onboardingPartners) {
        try {
          const partners = JSON.parse(onboardingPartners);
          const business = businessInfo;

          // Only create partner config if partners were actually added
          if (Array.isArray(partners) && partners.length > 0) {
            const partnerConfig = {
              partners,
              companyName: business?.name || "Your Business",
              totalEquity: 1,
              lastUpdated: new Date().toISOString(),
            };
            localStorage.setItem(
              "partnerConfig",
              JSON.stringify(partnerConfig)
            );
            if (import.meta.env.DEV) {
              console.log(
                "✓ Migrated partner config:",
                partners.length,
                "partners"
              );
            }
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn("Failed to parse partner data:", error);
          }
          migrationSuccessful = false;
        }
      }

      // Migrate donation config (only if donations were enabled)
      const onboardingDonationConfig = localStorage.getItem(
        "onboarding_donation_config"
      );
      if (onboardingDonationConfig) {
        try {
          const donationConfig = JSON.parse(onboardingDonationConfig);
          // Only migrate if donations were explicitly enabled
          if (donationConfig && donationConfig.enabled) {
            localStorage.setItem("donationConfig", onboardingDonationConfig);
            if (import.meta.env.DEV) {
              console.log("✓ Migrated donation config");
            }
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn("Failed to parse donation config:", error);
          }
          migrationSuccessful = false;
        }
      }

      // Migrate income sources (only if sources were selected)
      const onboardingIncomeSources = localStorage.getItem(
        "onboarding_income_sources"
      );
      if (onboardingIncomeSources) {
        try {
          const sources = JSON.parse(onboardingIncomeSources);
          // Only migrate if sources were actually selected
          if (Array.isArray(sources) && sources.length > 0) {
            localStorage.setItem("incomeSourceConfig", onboardingIncomeSources);
            if (import.meta.env.DEV) {
              console.log(
                "✓ Migrated income sources:",
                sources.length,
                "sources"
              );
            }
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn("Failed to parse income sources:", error);
          }
          migrationSuccessful = false;
        }
      }

      // If migration was successful, validate and clean up
      if (migrationSuccessful) {
        // Trigger reload event for all services
        window.dispatchEvent(new CustomEvent("onboarding-data-migrated"));

        // Cleanup after a short delay to ensure all listeners have processed
        setTimeout(() => {
          // Validate before cleanup
          if (validateMigratedData()) {
            if (import.meta.env.DEV) {
              console.log("✓ Data migration validation passed");
            }
            cleanupOnboardingData();
          } else {
            if (import.meta.env.DEV) {
              console.warn(
                "⚠️ Data migration validation failed, keeping onboarding data"
              );
            }
          }
        }, 100);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Failed to migrate onboarding data:", error);
      }
    }
  }, [businessInfo, cleanupOnboardingData, validateMigratedData]);

  // Completion management
  const completeOnboarding = useCallback(() => {
    // First, migrate onboarding data to main app storage
    migrateOnboardingDataToMain();

    setProgress((prev) => {
      const newProgress = {
        ...prev,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(newProgress));
      return newProgress;
    });
  }, [migrateOnboardingDataToMain]);

  const resetOnboarding = () => {
    // Clear all onboarding-related data
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    localStorage.removeItem(BUSINESS_INFO_STORAGE_KEY);

    // Clear transaction-related data for security (as per requirements)
    localStorage.removeItem("transactions");
    localStorage.removeItem("expenses");
    localStorage.removeItem("donationPayouts");
    localStorage.removeItem("summaries");
    localStorage.removeItem("donationConfig");
    localStorage.removeItem("partnerConfig");
    localStorage.removeItem("incomeSourceConfig");

    // Reset state
    setProgress({
      currentStepIndex: 0,
      steps: [...ONBOARDING_STEPS],
    });
    setBusinessInfo(null);
  };

  const value = useMemo<OnboardingContextValue>(
    () => ({
      progress,
      businessInfo,
      isCompleted,
      goToNextStep,
      goToPreviousStep,
      goToStep,
      updateBusinessInfo,
      completeOnboarding,
      resetOnboarding,
      markStepCompleted,
      canProceedToNextStep,
    }),
    [
      progress,
      businessInfo,
      isCompleted,
      goToNextStep,
      goToPreviousStep,
      canProceedToNextStep,
      completeOnboarding,
    ]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
