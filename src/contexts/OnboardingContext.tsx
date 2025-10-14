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

  // Function to migrate onboarding data to main app storage
  const migrateOnboardingDataToMain = useCallback(async () => {
    try {
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
          }
        } catch (error) {
          console.warn("Failed to parse partner data:", error);
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
          }
        } catch (error) {
          console.warn("Failed to parse donation config:", error);
        }
      }

      // Migrate income sources (selected templates + custom sources)
      const onboardingIncomeSources = localStorage.getItem(
        "onboarding_income_sources"
      );
      const onboardingCustomSources = localStorage.getItem(
        "onboarding_custom_sources"
      );

      // Get selected template IDs
      let selectedSourceIds: string[] = [];
      if (onboardingIncomeSources) {
        try {
          const parsed = JSON.parse(onboardingIncomeSources);
          if (Array.isArray(parsed)) {
            selectedSourceIds = parsed;
          }
        } catch (error) {
          console.warn("Failed to parse income sources:", error);
        }
      }

      // Get custom sources
      let customSources: unknown[] = [];
      if (onboardingCustomSources) {
        try {
          const parsed = JSON.parse(onboardingCustomSources);
          if (Array.isArray(parsed)) {
            customSources = parsed;
          }
        } catch (error) {
          console.warn("Failed to parse custom sources:", error);
        }
      }

      // Only migrate if there are selected sources or custom sources
      if (selectedSourceIds.length > 0 || customSources.length > 0) {
        try {
          // Import the necessary functions
          const { getIncomeSourcesForAccountType } = await import(
            "../config/incomeSources"
          );

          // Get all available template sources based on account type
          const isPersonal = businessInfo?.type === "personal";
          const allTemplateSources = getIncomeSourcesForAccountType(isPersonal);

          // Create proper IncomeSourceConfig with enabled template sources
          const enabledTemplateSources = allTemplateSources.map((source) => ({
            ...source,
            enabled: selectedSourceIds.includes(source.id),
            updatedAt: new Date().toISOString(),
          }));

          // Custom sources should be enabled and validated
          // Ensure they have the proper structure and enabled flag
          const enabledCustomSources = customSources.map((source) => {
            const typedSource = source as Record<string, unknown>;
            return {
              ...typedSource,
              enabled: true, // Custom sources are always enabled when created
              updatedAt: new Date().toISOString(),
            };
          });

          const allSources = [
            ...enabledTemplateSources,
            ...enabledCustomSources,
          ];

          // Determine default source ID
          const firstCustomSourceId =
            enabledCustomSources.length > 0 &&
            typeof enabledCustomSources[0] === "object" &&
            enabledCustomSources[0] !== null &&
            "id" in enabledCustomSources[0]
              ? String(enabledCustomSources[0].id)
              : undefined;
          const firstSourceId =
            allSources.length > 0 &&
            typeof allSources[0] === "object" &&
            allSources[0] !== null &&
            "id" in allSources[0]
              ? String(allSources[0].id)
              : undefined;

          const incomeSourceConfig = {
            sources: allSources,
            defaultSourceId:
              selectedSourceIds[0] || firstCustomSourceId || firstSourceId, // Use first selected or custom as default
            version: "1.0.0",
            lastUpdated: new Date().toISOString(),
          };

          localStorage.setItem(
            "incomeSourceConfig",
            JSON.stringify(incomeSourceConfig)
          );

          // Trigger reload event for income source service
          window.dispatchEvent(new CustomEvent("onboarding-data-migrated"));
        } catch (error) {
          console.warn("Failed to migrate income sources:", error);
        }
      }
    } catch (error) {
      console.warn("Failed to migrate onboarding data:", error);
    }
  }, [businessInfo]);

  // Completion management
  const completeOnboarding = useCallback(async () => {
    // First, migrate onboarding data to main app storage
    await migrateOnboardingDataToMain();

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
