import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, CheckCircle, AlertCircle } from "lucide-react";
import { useOnboarding } from "../../hooks/useOnboarding";
import type { BusinessInfo } from "../../types/onboarding";
import { BUSINESS_TYPES } from "../../types/onboarding";

const INPUT_STYLES =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition-colors duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20";

const LABEL_STYLES =
  "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

const SELECT_STYLES =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition-colors duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20";

interface BusinessInfoStepProps {
  onNext: () => void;
}

export const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({
  onNext,
}) => {
  const { businessInfo, updateBusinessInfo, markStepCompleted } =
    useOnboarding();

  const [formData, setFormData] = useState<BusinessInfo>({
    name: "",
    type: "sole-proprietorship",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    phone: "",
    email: "",
    website: "",
    taxId: "",
    registrationNumber: "",
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
      newErrors.name = "Business name is required";
    }

    if (!formData.address.street.trim()) {
      newErrors.address = "Street address is required";
    }

    if (!formData.address.city.trim()) {
      newErrors.address = newErrors.address || "City is required";
    }

    if (!formData.address.state.trim()) {
      newErrors.address = newErrors.address || "State is required";
    }

    if (!formData.address.zipCode.trim()) {
      newErrors.address = newErrors.address || "ZIP code is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website =
        "Please enter a valid website URL (include http:// or https://)";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    if (field === "address") return; // Handle address separately
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (
    field: keyof BusinessInfo["address"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (!isValid) return;

    updateBusinessInfo(formData);
    markStepCompleted("business-info");
    onNext();
  };

  const handleSaveProgress = () => {
    updateBusinessInfo(formData);
  };

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
          Tell us about your business
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Help us set up your account with some basic business information
        </p>
      </div>

      <div className="space-y-6">
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className={LABEL_STYLES}>
            Business Name *
          </label>
          <input
            id="businessName"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter your business name"
            className={INPUT_STYLES}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Business Type */}
        <div>
          <label htmlFor="businessType" className={LABEL_STYLES}>
            Business Type *
          </label>
          <select
            id="businessType"
            value={formData.type}
            onChange={(e) =>
              handleInputChange("type", e.target.value as BusinessInfo["type"])
            }
            className={SELECT_STYLES}
          >
            {BUSINESS_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Address Section */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Business Address
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="street" className={LABEL_STYLES}>
                Street Address *
              </label>
              <input
                id="street"
                type="text"
                value={formData.address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                placeholder="123 Main Street"
                className={INPUT_STYLES}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className={LABEL_STYLES}>
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  placeholder="City"
                  className={INPUT_STYLES}
                />
              </div>
              <div>
                <label htmlFor="state" className={LABEL_STYLES}>
                  State *
                </label>
                <input
                  id="state"
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  placeholder="State"
                  className={INPUT_STYLES}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipCode" className={LABEL_STYLES}>
                  ZIP Code *
                </label>
                <input
                  id="zipCode"
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) =>
                    handleAddressChange("zipCode", e.target.value)
                  }
                  placeholder="12345"
                  className={INPUT_STYLES}
                />
              </div>
              <div>
                <label htmlFor="country" className={LABEL_STYLES}>
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value={formData.address.country}
                  onChange={(e) =>
                    handleAddressChange("country", e.target.value)
                  }
                  placeholder="Country"
                  className={INPUT_STYLES}
                />
              </div>
            </div>

            {errors.address && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.address}
              </p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Contact Information (Optional)
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className={LABEL_STYLES}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="business@example.com"
                className={INPUT_STYLES}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className={LABEL_STYLES}>
                Phone Number
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

            <div>
              <label htmlFor="website" className={LABEL_STYLES}>
                Website
              </label>
              <input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://www.example.com"
                className={INPUT_STYLES}
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.website}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Tax Information (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="taxId" className={LABEL_STYLES}>
                Tax ID / EIN
              </label>
              <input
                id="taxId"
                type="text"
                value={formData.taxId}
                onChange={(e) => handleInputChange("taxId", e.target.value)}
                placeholder="12-3456789"
                className={INPUT_STYLES}
              />
            </div>
            <div>
              <label htmlFor="registrationNumber" className={LABEL_STYLES}>
                Business Registration Number
              </label>
              <input
                id="registrationNumber"
                type="text"
                value={formData.registrationNumber}
                onChange={(e) =>
                  handleInputChange("registrationNumber", e.target.value)
                }
                placeholder="Registration number"
                className={INPUT_STYLES}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={LABEL_STYLES}>
            Business Description (Optional)
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Brief description of your business..."
            rows={3}
            className={INPUT_STYLES}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          onClick={handleSaveProgress}
          className="flex-1 px-6 py-3 border border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-200"
        >
          Save Progress
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isValid
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl"
              : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
          }`}
        >
          {isValid ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Continue
            </>
          ) : (
            "Complete Required Fields"
          )}
        </button>
      </div>

      {/* Requirements Notice */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          * Required fields must be completed to continue
        </p>
      </div>
    </motion.div>
  );
};
