import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  CheckCircle,
  Check,
  Youtube,
  Music,
  Camera,
  Tv,
  Smartphone,
  Globe,
} from "lucide-react";
import { useOnboarding } from "../../hooks/useOnboarding";
import { defaultIncomeSources } from "../../config/incomeSources";
import type { IncomeSource } from "../../types/incomeSource";

const INCOME_SOURCES_STORAGE_KEY = "onboarding_income_sources";

interface IncomeSourcesStepProps {
  onNext: () => void;
  onSkip: () => void;
}

// Icon mapping for known platforms
const getIconComponent = (iconValue: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Youtube,
    Music,
    Camera,
    Tv,
    Smartphone,
    Globe,
  };

  return iconMap[iconValue] || Globe;
};

export const IncomeSourcesStep: React.FC<IncomeSourcesStepProps> = ({
  onNext,
  onSkip,
}) => {
  const { markStepCompleted } = useOnboarding();

  // State for managing selected income sources during onboarding
  const [selectedSources, setSelectedSources] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(INCOME_SOURCES_STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  // Save to localStorage whenever selection changes
  useEffect(() => {
    localStorage.setItem(
      INCOME_SOURCES_STORAGE_KEY,
      JSON.stringify(Array.from(selectedSources))
    );
  }, [selectedSources]);

  const handleToggleSource = (sourceId: string) => {
    setSelectedSources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sourceId)) {
        newSet.delete(sourceId);
      } else {
        newSet.add(sourceId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedSources.size === defaultIncomeSources.length) {
      setSelectedSources(new Set());
    } else {
      setSelectedSources(
        new Set(defaultIncomeSources.map((source) => source.id))
      );
    }
  };

  const handleContinue = () => {
    markStepCompleted("income-sources");
    onNext();
  };

  const handleSkip = () => {
    markStepCompleted("income-sources");
    onSkip();
  };

  // Group sources by category
  const sourcesByCategory = defaultIncomeSources.reduce((acc, source) => {
    const category = source.metadata?.display?.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(source);
    return acc;
  }, {} as Record<string, IncomeSource[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
          <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Configure Income Sources
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Select the platforms and services you use to generate revenue
        </p>
      </div>

      {/* Selection Summary */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-slate-600 dark:text-slate-400">
            Selected Sources: {selectedSources.size} /{" "}
            {defaultIncomeSources.length}
          </span>
          <button
            onClick={handleSelectAll}
            className="text-sm px-3 py-1 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            {selectedSources.size === defaultIncomeSources.length
              ? "Deselect All"
              : "Select All"}
          </button>
        </div>
      </div>

      {/* Income Sources by Category */}
      <div className="space-y-8">
        {Object.entries(sourcesByCategory).map(([category, sources]) => (
          <div key={category}>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sources.map((source) => {
                const isSelected = selectedSources.has(source.id);
                const IconComponent = getIconComponent(
                  source.metadata?.icon?.value || "Globe"
                );
                const iconColor = source.metadata?.icon?.color || "#6b7280";
                const iconBgColor =
                  source.metadata?.icon?.backgroundColor || "#f1f5f9";

                return (
                  <motion.div
                    key={source.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500"
                    }`}
                    onClick={() => handleToggleSource(source.id)}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: iconBgColor,
                            color: iconColor,
                          }}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                            {source.name}
                          </h4>

                          {source.metadata?.display?.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                              {source.metadata.display.description}
                            </p>
                          )}

                          <div className="text-xs text-slate-500 dark:text-slate-500 space-y-1">
                            {source.metadata?.fees && (
                              <div>
                                {source.metadata.fees.fixedFeeUSD && (
                                  <span>
                                    Fee: ${source.metadata.fees.fixedFeeUSD}
                                  </span>
                                )}
                                {source.metadata.fees.percentageFee && (
                                  <span>
                                    Fee: {source.metadata.fees.percentageFee}%
                                  </span>
                                )}
                              </div>
                            )}

                            {source.metadata?.settings?.defaultTaxRate && (
                              <div>
                                Tax Rate:{" "}
                                {source.metadata.settings.defaultTaxRate * 100}%
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Source Note */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 Don't see your income source? You can add custom sources later from
          the settings page.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          onClick={handleSkip}
          className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
        >
          Skip This Step
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <CheckCircle className="w-5 h-5" />
          Continue
        </button>
      </div>

      {/* Info Note */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You can modify your income sources anytime from the app settings
        </p>
      </div>
    </motion.div>
  );
};
