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
  const { markStepCompleted, businessInfo } = useOnboarding();
  const isPersonal = businessInfo?.type === "personal";

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

  const handleContinue = () => {
    markStepCompleted("income-sources");
    onNext();
  };

  const handleSkip = () => {
    markStepCompleted("income-sources");
    onSkip();
  };

  // Show only TikTok and YouTube by default
  const defaultSources = defaultIncomeSources.filter(
    (source) => source.id === "tiktok" || source.id === "youtube"
  );

  const [showCustom, setShowCustom] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-2xl mb-4 shadow-lg"
        >
          <DollarSign className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </motion.div>
        <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-3">
          Income Sources
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Select the platforms and services you use to generate revenue
        </p>
      </div>

      {/* Auto-Skip Info for Personal Users */}
      {isPersonal && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-1">
                Personal Account Setup
              </h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Since you selected a <strong>Personal</strong> account, the
                Partners step will be automatically skipped after this.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Selection Summary */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-slate-600 dark:text-slate-400">
            Selected Sources: {selectedSources.size}
          </span>
          {selectedSources.size > 0 && (
            <button
              onClick={() => setSelectedSources(new Set())}
              className="text-sm px-3 py-1 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Default Income Sources (TikTok & YouTube) */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Select Your Platforms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defaultSources.map((source) => {
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
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? "border-emerald-500 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:via-emerald-800/20 dark:to-emerald-900/30 shadow-xl shadow-emerald-200/50 dark:shadow-emerald-900/30"
                      : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg"
                  }`}
                  onClick={() => handleToggleSource(source.id)}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl z-10"
                      >
                        <Check className="w-6 h-6 text-white font-bold" />
                      </motion.div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
                    </>
                  )}

                  <div className="p-7">
                    <div className="flex items-center gap-5">
                      {/* Icon Container */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative"
                      >
                        <div
                          className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                          style={{
                            backgroundColor: iconBgColor,
                            color: iconColor,
                          }}
                        >
                          <IconComponent className="w-10 h-10" />
                        </div>
                        {isSelected && (
                          <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl -z-10 blur"></div>
                        )}
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-1.5 tracking-tight">
                          {source.name}
                        </h4>

                        {source.metadata?.display?.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                            {source.metadata.display.description}
                          </p>
                        )}

                        {/* Tags/Badges */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {source.metadata?.fees && (
                            <>
                              {source.metadata.fees.fixedFeeUSD && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                  ${source.metadata.fees.fixedFeeUSD} fee
                                </span>
                              )}
                              {source.metadata.fees.percentageFee && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                  {source.metadata.fees.percentageFee}% fee
                                </span>
                              )}
                            </>
                          )}

                          {source.metadata?.settings?.defaultTaxRate && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                              {source.metadata.settings.defaultTaxRate * 100}%
                              tax
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Overlay Effect */}
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom Source Option */}
      <div className="mt-8">
        <motion.button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full p-5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
              <span className="text-2xl">+</span>
            </div>
            <span className="font-semibold text-base">
              Need a Custom Income Source?
            </span>
          </div>
        </motion.button>

        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">ℹ️</span>
              </div>
              <div>
                <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Add Custom Sources Later
                </h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  You can add custom income sources after completing onboarding
                  from the app settings.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Custom sources allow you to track income from{" "}
                  <strong>any platform or service</strong> not listed here -
                  freelancing, consulting, e-commerce, and more!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <motion.button
          onClick={handleSkip}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-6 py-4 border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200 font-medium"
        >
          Skip This Step
        </motion.button>
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <CheckCircle className="w-5 h-5" />
          {isPersonal ? "Continue to Donations" : "Continue"}
        </motion.button>
      </div>

      {/* Info Note */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          💡 You can modify your income sources anytime from the app settings
        </p>
      </div>
    </motion.div>
  );
};
