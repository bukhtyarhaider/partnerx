import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Building2,
  Users,
  Briefcase,
  Building,
  Heart,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useOnboarding } from "../../hooks/useOnboarding";
import type { BusinessInfo } from "../../types/onboarding";
import { BUSINESS_TYPES } from "../../types/onboarding";

const INPUT_STYLES =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition-colors duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20";

const LABEL_STYLES =
  "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

interface BusinessInfoStepProps {
  onNext: () => void;
  onPrevious?: () => void;
  canGoBack?: boolean;
  isLastStep?: boolean;
  onSkip?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  Building2,
  Users,
  Briefcase,
  Building,
  Heart,
  MoreHorizontal,
};

export const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({
  onNext,
  onPrevious,
  canGoBack = false,
}) => {
  const { businessInfo, updateBusinessInfo, markStepCompleted } =
    useOnboarding();

  const [formData, setFormData] = useState<BusinessInfo>({
    name: "",
    type: "personal",
    phone: "",
    email: "",
    description: "",
    ...businessInfo,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BusinessInfo, string>>
  >({});
  const [isValid, setIsValid] = useState(false);

  // Validate form
  useEffect(() => {
    const newErrors: Partial<Record<keyof BusinessInfo, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!isValid) return;

    updateBusinessInfo(formData);
    markStepCompleted("business-info");
    onNext();
  };

  const isPersonal = formData.type === "personal";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
          <Building2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          {isPersonal
            ? "Welcome to Your Personal Ledger"
            : "Welcome to PartnerWise"}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {isPersonal
            ? "Let's set up your personal finance tracking"
            : "Let's get started with your business information"}
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Type Selection */}
        <div>
          <label className={LABEL_STYLES}>
            How will you use PartnerWise? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BUSINESS_TYPES.map((type) => {
              const IconComponent = iconMap[type.icon] || Building2;
              const isSelected = formData.type === type.value;

              return (
                <motion.button
                  key={type.value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange("type", type.value)}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? "bg-emerald-100 dark:bg-emerald-900/40"
                          : "bg-slate-100 dark:bg-slate-600"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 ${
                          isSelected
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-600 dark:text-slate-300"
                        }`}
                      />
                    </div>
                    <span
                      className={`font-medium ${
                        isSelected
                          ? "text-emerald-900 dark:text-emerald-100"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {type.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className={LABEL_STYLES}>
            {isPersonal ? "Your Name" : "Business Name"} *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder={isPersonal ? "Enter your name" : "Enter business name"}
            className={INPUT_STYLES}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email (Optional) */}
        <div>
          <label htmlFor="email" className={LABEL_STYLES}>
            Email Address <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="your@email.com"
            className={INPUT_STYLES}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone (Optional) */}
        <div>
          <label htmlFor="phone" className={LABEL_STYLES}>
            Phone Number <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="(555) 123-4567"
            className={INPUT_STYLES}
          />
        </div>

        {/* Description (Optional) */}
        <div>
          <label htmlFor="description" className={LABEL_STYLES}>
            Description <span className="text-slate-400">(optional)</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder={
              isPersonal
                ? "Add any notes about how you'll use this app..."
                : "Brief description of your business..."
            }
            rows={3}
            className={INPUT_STYLES}
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            This is for your reference only
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
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
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`flex-1 px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isValid
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl"
              : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
          }`}
        >
          {isValid ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Continue to Income Sources
            </>
          ) : (
            "Please complete required fields"
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Don't worry, you can update this information anytime
        </p>
      </div>
    </motion.div>
  );
};
