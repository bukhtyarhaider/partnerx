import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Briefcase,
  ShoppingCart,
  Code,
  Laptop,
  Home,
  Factory,
  User,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useOnboarding } from "../../hooks/useOnboarding";
import { businessCategories } from "../../config/businessCategories";
import type { BusinessCategoryId } from "../../types/businessCategory";

const CATEGORY_STORAGE_KEY = "onboarding_business_category";

interface BusinessCategoryStepProps {
  onNext: () => void;
  onSkip: () => void;
  onPrevious?: () => void;
  canGoBack?: boolean;
}

// Icon mapping
const getIconComponent = (iconValue: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Video,
    Briefcase,
    ShoppingCart,
    Code,
    Laptop,
    Home,
    Factory,
    User,
  };
  return iconMap[iconValue] || Briefcase;
};

export const BusinessCategoryStep: React.FC<BusinessCategoryStepProps> = ({
  onNext,
  onSkip,
  onPrevious,
  canGoBack = false,
}) => {
  const { markStepCompleted, businessInfo } = useOnboarding();
  const isPersonal = businessInfo?.type === "personal";

  const [selectedCategory, setSelectedCategory] =
    useState<BusinessCategoryId | null>(() => {
      const stored = localStorage.getItem(CATEGORY_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as BusinessCategoryId) : null;
    });

  // Save to localStorage whenever selection changes
  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem(
        CATEGORY_STORAGE_KEY,
        JSON.stringify(selectedCategory)
      );
    }
  }, [selectedCategory]);

  const handleContinue = () => {
    if (!selectedCategory) {
      alert("Please select a business category to continue");
      return;
    }

    markStepCompleted("business-category");
    onNext();
  };

  const handleSkip = () => {
    // Set a default category if skipped
    const defaultCategory: BusinessCategoryId = isPersonal
      ? "personal"
      : "content-creator";
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(defaultCategory));
    markStepCompleted("business-category");
    onSkip();
  };

  // Filter categories based on account type
  const availableCategories = isPersonal
    ? businessCategories.filter((cat) => cat.id === "personal")
    : businessCategories.filter((cat) => cat.id !== "personal");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-6xl mx-auto p-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl mb-4 shadow-lg"
        >
          <Briefcase className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </motion.div>
        <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-3">
          {isPersonal ? "Your Income Type" : "Choose Your Business Category"}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {isPersonal
            ? "This will help us suggest relevant income sources for you"
            : "Select the category that best describes your business. We'll suggest relevant income sources based on your choice."}
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {availableCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const IconComponent = getIconComponent(category.icon.value);

          return (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                isSelected
                  ? "border-blue-500 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-blue-900/30 shadow-2xl shadow-blue-200/50 dark:shadow-blue-900/30"
                  : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl"
              }`}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl z-10"
                  >
                    <CheckCircle className="w-7 h-7 text-white font-bold" />
                  </motion.div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-20 -mt-20"></div>
                </>
              )}

              <div className="p-6">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative mb-4"
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg mx-auto"
                    style={{
                      backgroundColor: category.icon.backgroundColor,
                      color: category.icon.color,
                    }}
                  >
                    <IconComponent className="w-8 h-8" />
                  </div>
                  {isSelected && (
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl -z-10 blur"></div>
                  )}
                </motion.div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Examples */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide">
                      Examples:
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {category.examples.slice(0, 3).map((example, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Overlay Effect */}
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Info Box */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-8"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                What's Next?
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                We'll suggest income sources that are relevant to{" "}
                <strong>
                  {
                    businessCategories.find((c) => c.id === selectedCategory)
                      ?.name
                  }
                </strong>{" "}
                businesses. You can customize and add your own sources at any
                time.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {canGoBack && onPrevious && (
          <motion.button
            onClick={onPrevious}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 sm:flex-none sm:px-8 px-6 py-4 border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200 font-medium"
          >
            Previous
          </motion.button>
        )}
        {!isPersonal && (
          <motion.button
            onClick={handleSkip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-4 border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200 font-medium"
          >
            Skip
          </motion.button>
        )}
        <motion.button
          onClick={handleContinue}
          disabled={!selectedCategory}
          whileHover={{ scale: selectedCategory ? 1.02 : 1 }}
          whileTap={{ scale: selectedCategory ? 0.98 : 1 }}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Income Sources
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          💡 Don't worry, you can always customize your income sources later
        </p>
      </div>
    </motion.div>
  );
};
