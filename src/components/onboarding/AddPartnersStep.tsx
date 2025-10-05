import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  CheckCircle,
  AlertCircle,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useOnboarding } from "../../hooks/useOnboarding";
import type { Partner } from "../../types/partner";

const INPUT_STYLES =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition-colors duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20";

const LABEL_STYLES =
  "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

const PARTNERS_STORAGE_KEY = "onboarding_partners";

interface AddPartnersStepProps {
  onNext: () => void;
  onSkip: () => void;
}

interface PartnerFormData {
  name: string;
  displayName: string;
  equity: string;
  email?: string;
  role?: string;
}

export const AddPartnersStep: React.FC<AddPartnersStepProps> = ({
  onNext,
  onSkip,
}) => {
  const { markStepCompleted } = useOnboarding();

  // State for managing partners during onboarding
  const [partners, setPartners] = useState<Partner[]>(() => {
    const stored = localStorage.getItem(PARTNERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    displayName: "",
    equity: "",
    email: "",
    role: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PartnerFormData, string>>
  >({});

  // Save partners to localStorage whenever partners change
  useEffect(() => {
    localStorage.setItem(PARTNERS_STORAGE_KEY, JSON.stringify(partners));
  }, [partners]);

  // Calculate total equity
  const totalEquity = partners.reduce(
    (sum: number, partner: Partner) => sum + partner.equity,
    0
  );
  const remainingEquity = 1 - totalEquity;

  // Validate form
  useEffect(() => {
    const newErrors: Partial<Record<keyof PartnerFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Partner name is required";
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }

    const equityValue = parseFloat(formData.equity);
    if (!formData.equity || isNaN(equityValue) || equityValue <= 0) {
      newErrors.equity = "Equity must be a positive number";
    } else if (equityValue > remainingEquity * 100) {
      newErrors.equity = `Equity cannot exceed ${(
        remainingEquity * 100
      ).toFixed(2)}%`;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
  }, [formData, remainingEquity]);

  const resetForm = () => {
    setFormData({
      name: "",
      displayName: "",
      equity: "",
      email: "",
      role: "",
    });
    setErrors({});
    setEditingPartner(null);
  };

  const handleInputChange = (field: keyof PartnerFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generatePartnerId = () => {
    return `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = () => {
    if (Object.keys(errors).length > 0) return;

    const equityDecimal = parseFloat(formData.equity) / 100;

    const partnerData: Partner = {
      id: editingPartner?.id || generatePartnerId(),
      name: formData.name.trim(),
      displayName: formData.displayName.trim(),
      equity: equityDecimal,
      joinDate: new Date().toISOString().split("T")[0],
      isActive: true,
      metadata: {
        email: formData.email || undefined,
        role: formData.role || undefined,
      },
    };

    if (editingPartner) {
      setPartners((prev) =>
        prev.map((p) => (p.id === editingPartner.id ? partnerData : p))
      );
    } else {
      setPartners((prev) => [...prev, partnerData]);
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      displayName: partner.displayName,
      equity: (partner.equity * 100).toString(),
      email: partner.metadata?.email || "",
      role: partner.metadata?.role || "",
    });
    setShowAddForm(true);
  };

  const handleRemove = (partnerId: string) => {
    setPartners((prev) => prev.filter((p) => p.id !== partnerId));
  };

  const handleCancel = () => {
    resetForm();
    setShowAddForm(false);
  };

  const handleContinue = () => {
    markStepCompleted("add-partners");
    onNext();
  };

  const handleSkip = () => {
    markStepCompleted("add-partners");
    onSkip();
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.name &&
    formData.displayName &&
    formData.equity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Add Your Partners
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Set up your business partners and their equity distribution
        </p>
      </div>

      {/* Equity Summary */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Total Equity Allocated:
          </span>
          <span
            className={`font-semibold ${
              totalEquity > 1
                ? "text-red-600 dark:text-red-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {(totalEquity * 100).toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span className="text-slate-600 dark:text-slate-400">
            Remaining Available:
          </span>
          <span
            className={`font-semibold ${
              remainingEquity < 0
                ? "text-red-600 dark:text-red-400"
                : "text-slate-800 dark:text-slate-200"
            }`}
          >
            {(remainingEquity * 100).toFixed(2)}%
          </span>
        </div>
        {totalEquity > 1 && (
          <p className="text-red-600 dark:text-red-400 text-xs mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Total equity cannot exceed 100%
          </p>
        )}
      </div>

      {/* Existing Partners */}
      {partners.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Current Partners
          </h3>
          <div className="space-y-3">
            {partners.map((partner: Partner) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        {partner.displayName}
                      </h4>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        ({partner.name})
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600 dark:text-slate-400">
                      <span>Equity: {(partner.equity * 100).toFixed(2)}%</span>
                      {partner.metadata?.role && (
                        <span>Role: {partner.metadata.role}</span>
                      )}
                      {partner.metadata?.email && (
                        <span>Email: {partner.metadata.email}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(partner)}
                      className="p-2 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemove(partner.id)}
                      className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add Partner Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                {editingPartner ? "Edit Partner" : "Add New Partner"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="partnerName" className={LABEL_STYLES}>
                    Full Name *
                  </label>
                  <input
                    id="partnerName"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="John Doe"
                    className={INPUT_STYLES}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="displayName" className={LABEL_STYLES}>
                    Display Name *
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      handleInputChange("displayName", e.target.value)
                    }
                    placeholder="John"
                    className={INPUT_STYLES}
                  />
                  {errors.displayName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.displayName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="equity" className={LABEL_STYLES}>
                    Equity Percentage *
                  </label>
                  <div className="relative">
                    <input
                      id="equity"
                      type="number"
                      min="0"
                      max={remainingEquity * 100}
                      step="0.01"
                      value={formData.equity}
                      onChange={(e) =>
                        handleInputChange("equity", e.target.value)
                      }
                      placeholder="50.00"
                      className={INPUT_STYLES}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400">
                      %
                    </span>
                  </div>
                  {errors.equity && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.equity}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className={LABEL_STYLES}>
                    Role (Optional)
                  </label>
                  <input
                    id="role"
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    placeholder="Co-founder, CTO, etc."
                    className={INPUT_STYLES}
                  />
                </div>

                <div>
                  <label htmlFor="partnerEmail" className={LABEL_STYLES}>
                    Email (Optional)
                  </label>
                  <input
                    id="partnerEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john@example.com"
                    className={INPUT_STYLES}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isFormValid
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {editingPartner ? "Update Partner" : "Add Partner"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Partner Button */}
      {!showAddForm && (
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Partner
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
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
          You can always add or modify partners later from the settings
        </p>
      </div>
    </motion.div>
  );
};
