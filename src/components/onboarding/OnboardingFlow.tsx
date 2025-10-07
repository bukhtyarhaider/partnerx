import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "../../hooks/useOnboarding";
import { BusinessInfoStep } from "./BusinessInfoStep";
import { AddPartnersStep } from "./AddPartnersStep";
import { IncomeSourcesStep } from "./IncomeSourcesStep";
import { DonationConfigStep } from "./DonationConfigStep";
import { PinSetupStep } from "./PinSetupStep";

const stepComponents = {
  "business-info": BusinessInfoStep,
  "add-partners": AddPartnersStep,
  "income-sources": IncomeSourcesStep,
  "donation-config": DonationConfigStep,
  "pin-setup": PinSetupStep,
};

export const OnboardingFlow: React.FC = () => {
  const {
    progress,
    businessInfo,
    goToNextStep,
    goToPreviousStep,
    completeOnboarding,
  } = useOnboarding();

  const currentStep = progress.steps[progress.currentStepIndex];
  const isLastStep = progress.currentStepIndex === progress.steps.length - 1;
  const isFirstStep = progress.currentStepIndex === 0;
  const isPersonal = businessInfo?.type === "personal";

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      goToNextStep();
    }
  };

  const handleSkip = () => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      goToNextStep();
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      goToPreviousStep();
    }
  };

  const getStepComponent = (stepId: string) => {
    const Component = stepComponents[stepId as keyof typeof stepComponents];
    if (!Component) return null;

    return (
      <Component
        onNext={handleNext}
        onSkip={handleSkip}
        onPrevious={handlePrevious}
        canGoBack={!isFirstStep}
        isLastStep={isLastStep}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {isPersonal
                    ? `Welcome ${businessInfo?.name ? businessInfo.name : ""}!`
                    : `Welcome to ${businessInfo?.name || "PartnerWise"}`}
                </h1>
                <div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  Step {progress.currentStepIndex + 1} of{" "}
                  {progress.steps.length}
                </div>
              </div>

              {/* Simple Progress Bar */}
              <div className="relative mb-2">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        ((progress.currentStepIndex + 1) /
                          progress.steps.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Current Step Info */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {currentStep.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {currentStep.description}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {progress.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === progress.currentStepIndex
                          ? "bg-emerald-500 w-6"
                          : step.completed
                          ? "bg-emerald-300 dark:bg-emerald-700"
                          : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {getStepComponent(currentStep.id)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
