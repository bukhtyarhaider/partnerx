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
  const goToNextStep = () => {
    setProgress((prev) => {
      if (prev.currentStepIndex < prev.steps.length - 1) {
        const newProgress = {
          ...prev,
          currentStepIndex: prev.currentStepIndex + 1,
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

  const goToPreviousStep = () => {
    setProgress((prev) => {
      if (prev.currentStepIndex > 0) {
        const newProgress = {
          ...prev,
          currentStepIndex: prev.currentStepIndex - 1,
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
  const migrateOnboardingDataToMain = useCallback(() => {
    try {
      // Migrate partners data
      const onboardingPartners = localStorage.getItem("onboarding_partners");
      if (onboardingPartners && !localStorage.getItem("partnerConfig")) {
        const partners = JSON.parse(onboardingPartners);
        const business = businessInfo;

        if (partners.length > 0) {
          const partnerConfig = {
            partners,
            companyName: business?.name || "Your Business",
            totalEquity: 1,
            lastUpdated: new Date().toISOString(),
          };
          localStorage.setItem("partnerConfig", JSON.stringify(partnerConfig));
        }
      }

      // Migrate donation config
      const onboardingDonationConfig = localStorage.getItem(
        "onboarding_donation_config"
      );
      if (onboardingDonationConfig && !localStorage.getItem("donationConfig")) {
        localStorage.setItem("donationConfig", onboardingDonationConfig);
      }

      // Migrate income sources
      const onboardingIncomeSources = localStorage.getItem(
        "onboarding_income_sources"
      );
      if (
        onboardingIncomeSources &&
        !localStorage.getItem("incomeSourceConfig")
      ) {
        // The income source service will handle this migration automatically when it loads
        // We just need to trigger a reload by clearing any cached instances
        window.dispatchEvent(new CustomEvent("onboarding-data-migrated"));
      }
    } catch (error) {
      console.warn("Failed to migrate onboarding data:", error);
    }
  }, [businessInfo]);

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
