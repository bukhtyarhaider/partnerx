import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";
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
    goToStep,
    completeOnboarding,
  } = useOnboarding();

  const currentStep = progress.steps[progress.currentStepIndex];
  const isLastStep = progress.currentStepIndex === progress.steps.length - 1;
  const isFirstStep = progress.currentStepIndex === 0;

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

    return <Component onNext={handleNext} onSkip={handleSkip} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  Welcome to {businessInfo?.name || "PartnerX"}
                </h1>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Step {progress.currentStepIndex + 1} of{" "}
                  {progress.steps.length}
                </div>
              </div>

              {/* Step Indicators */}
              <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        (progress.currentStepIndex /
                          (progress.steps.length - 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>

                {progress.steps.map((step, index) => {
                  const isActive = index === progress.currentStepIndex;
                  const isCompleted = step.completed;
                  const isPast = index < progress.currentStepIndex;

                  return (
                    <button
                      key={step.id}
                      onClick={() => (isPast ? goToStep(index) : undefined)}
                      className={`relative z-10 w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        isActive
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-lg scale-110"
                          : isCompleted
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : isPast
                          ? "border-emerald-300 bg-emerald-100 text-emerald-600 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 cursor-pointer hover:scale-105"
                          : "border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-500"
                      }`}
                      disabled={!isPast}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-semibold">
                          {index + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Step Labels */}
              <div className="flex items-start justify-between mt-4">
                {progress.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex-1 text-center px-2 ${
                      index === 0
                        ? "text-left"
                        : index === progress.steps.length - 1
                        ? "text-right"
                        : ""
                    }`}
                  >
                    <div
                      className={`text-sm font-medium transition-colors duration-300 ${
                        index === progress.currentStepIndex
                          ? "text-emerald-600 dark:text-emerald-400"
                          : step.completed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {step.description}
                    </div>
                  </div>
                ))}
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

        {/* Navigation Footer */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/20 dark:border-slate-700/50">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isFirstStep
                  ? "text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {currentStep.skippable && !isLastStep && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200"
                >
                  Skip
                </button>
              )}
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400">
              {progress.currentStepIndex + 1} / {progress.steps.length}
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="max-w-2xl mx-auto mt-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Need help? You can always modify these settings later from the app
            preferences.
          </p>
        </div>
      </div>
    </div>
  );
};
