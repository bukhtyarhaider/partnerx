import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import { useOnboarding } from "../../hooks/useOnboarding";
import type { Partner } from "../../types/partner";

const PARTNERS_STORAGE_KEY = "onboarding_partners";

interface AddPartnersStepProps {
  onNext: () => void;
  onSkip: () => void;
  onPrevious?: () => void;
  canGoBack?: boolean;
  isLastStep?: boolean;
}

interface PartnerFormData {
  name: string;
  equity: string;
}

export const AddPartnersStep: React.FC<AddPartnersStepProps> = ({
  onNext,
  onSkip,
  onPrevious,
  canGoBack = false,
}) => {
  const { markStepCompleted } = useOnboarding();

  const [partners, setPartners] = useState<Partner[]>(() => {
    const stored = localStorage.getItem(PARTNERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    equity: "",
  });

  useEffect(() => {
    localStorage.setItem(PARTNERS_STORAGE_KEY, JSON.stringify(partners));
  }, [partners]);

  const totalEquity = partners.reduce(
    (sum: number, partner: Partner) => sum + partner.equity,
    0
  );
  const remainingEquity = 1 - totalEquity;

  const availableEquity = editingPartner
    ? remainingEquity + editingPartner.equity
    : remainingEquity;

  const resetForm = () => {
    setFormData({ name: "", equity: "" });
    setEditingPartner(null);
  };

  const handleInputChange = (field: keyof PartnerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generatePartnerId = () => {
    return `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const validateForm = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("Partner name is required");
    }

    const equityValue = parseFloat(formData.equity);
    const availableEquityPercent = availableEquity * 100;
    // Add small epsilon for floating-point comparison tolerance
    const EPSILON = 0.01;

    if (!formData.equity || isNaN(equityValue)) {
      errors.push("Please enter a valid equity percentage");
    } else if (equityValue <= 0) {
      errors.push("Equity must be greater than 0%");
    } else if (equityValue > 100) {
      errors.push("Equity cannot exceed 100%");
    } else if (equityValue > availableEquityPercent + EPSILON) {
      errors.push(
        `Only ${availableEquityPercent.toFixed(1)}% equity is available`
      );
    }

    return { valid: errors.length === 0, errors };
  };

  const handleSubmit = () => {
    const validation = validateForm();
    if (!validation.valid) {
      alert(validation.errors.join("\n"));
      return;
    }

    const equityDecimal = parseFloat(formData.equity) / 100;

    const partnerData: Partner = {
      id: editingPartner?.id || generatePartnerId(),
      name: formData.name.trim(),
      displayName: formData.name.trim(),
      equity: equityDecimal,
      joinDate: new Date().toISOString().split("T")[0],
      isActive: true,
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
      equity: (partner.equity * 100).toString(),
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
    if (totalEquity > 1) {
      alert("Total equity cannot exceed 100%. Please adjust partner shares.");
      return;
    }
    markStepCompleted("add-partners");
    onNext();
  };

  const handleSkip = () => {
    markStepCompleted("add-partners");
    onSkip();
  };

  // Form validation with floating-point tolerance
  const equityValue = parseFloat(formData.equity);
  const availableEquityPercent = availableEquity * 100;
  const EPSILON = 0.01; // Small tolerance for floating-point precision

  const isFormValid =
    formData.name.trim() &&
    formData.equity &&
    !isNaN(equityValue) &&
    equityValue > 0 &&
    equityValue <= availableEquityPercent + EPSILON;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl mx-auto p-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl mb-4 shadow-lg"
        >
          <Users className="w-10 h-10 text-green-600 dark:text-green-400" />
        </motion.div>
        <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-3">
          Business Partners
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-4">
          Add your business partners and their equity distribution
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <span className="text-xl">💡</span>
          <p className="text-sm text-green-800 dark:text-green-200">
            For personal use? Skip this step
          </p>
        </div>
      </div>

      {/* Equity Summary */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-5 mb-6 border border-slate-200 dark:border-slate-600">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Total Allocated
            </p>
            <p
              className={`text-2xl font-bold ${
                totalEquity > 1
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {(totalEquity * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Available
            </p>
            <p
              className={`text-2xl font-bold ${
                remainingEquity < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-800 dark:text-slate-200"
              }`}
            >
              {(remainingEquity * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        {totalEquity > 1 && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-3 flex items-center justify-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Total equity cannot exceed 100%
          </p>
        )}
      </div>

      {/* Partners List */}
      {partners.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
            Partners ({partners.length})
          </h3>
          <div className="space-y-3">
            {partners.map((partner: Partner) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-xl p-4 border-2 transition-all duration-200 ${
                  editingPartner?.id === partner.id
                    ? "bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600"
                    : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        {partner.name}
                      </h4>
                      {editingPartner?.id === partner.id && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded">
                          Editing
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Equity: {(partner.equity * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(partner)}
                      className="p-2 text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                      title="Edit partner"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRemove(partner.id)}
                      className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title="Remove partner"
                    >
                      <Trash2 className="w-5 h-5" />
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
            <div
              className={`border-2 rounded-xl p-6 ${
                editingPartner
                  ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                  : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {editingPartner ? "Edit Partner" : "Add Partner"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editingPartner && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    Editing <strong>{editingPartner.name}</strong>. Available
                    equity includes their current share.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Partner Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter partner name"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition-colors duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-green-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Equity Percentage *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max={availableEquity * 100}
                      step="0.1"
                      value={formData.equity}
                      onChange={(e) =>
                        handleInputChange("equity", e.target.value)
                      }
                      placeholder="50"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-800 outline-none transition-colors duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-green-400"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium">
                      %
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    Available: {(availableEquity * 100).toFixed(1)}%
                    {editingPartner && " (including current equity)"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isFormValid
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
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
        <motion.button
          onClick={() => setShowAddForm(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-center gap-3 px-6 py-5 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-xl hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all duration-200 mb-6"
        >
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-semibold text-base">Add Business Partner</span>
        </motion.button>
      )}

      {/* Skip Message for No Partners */}
      {partners.length === 0 && !showAddForm && (
        <div className="mb-6 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Using this app for personal income tracking?
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              You can skip this step and continue to the next section
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
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
        <motion.button
          onClick={handleSkip}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-6 py-4 border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200 font-medium"
        >
          Skip
        </motion.button>
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={totalEquity > 1}
          className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            totalEquity > 1
              ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          Continue
        </motion.button>
      </div>

      {/* Info Note */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          💡 You can manage partners anytime from the app settings
        </p>
      </div>
    </motion.div>
  );
};
