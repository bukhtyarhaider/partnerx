import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, AlertCircle, Trash2, Edit2, X, Save } from "lucide-react";
import type { Partner, PartnerConfig } from "../types/partner";

interface PartnerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PartnerFormData {
  name: string;
  equity: string;
}

const PARTNER_CONFIG_KEY = "partnerConfig";

export const PartnerSettingsModal: React.FC<PartnerSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    equity: "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Load partners from storage
  useEffect(() => {
    if (isOpen) {
      try {
        const configStr = localStorage.getItem(PARTNER_CONFIG_KEY);
        if (configStr) {
          const config: PartnerConfig = JSON.parse(configStr);
          setPartners(config.partners || []);
        } else {
          setPartners([]);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("Failed to load partners:", error);
        }
        setPartners([]);
      }
      setHasChanges(false);
      setShowAddForm(false);
      setEditingPartner(null);
      resetForm();
    }
  }, [isOpen]);

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

    let updatedPartners: Partner[];
    if (editingPartner) {
      updatedPartners = partners.map((p) =>
        p.id === editingPartner.id ? partnerData : p
      );
    } else {
      updatedPartners = [...partners, partnerData];
    }

    setPartners(updatedPartners);
    setHasChanges(true);
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
    if (
      window.confirm(
        "Are you sure you want to remove this partner? This action cannot be undone."
      )
    ) {
      setPartners((prev) => prev.filter((p) => p.id !== partnerId));
      setHasChanges(true);
    }
  };

  const handleCancel = () => {
    resetForm();
    setShowAddForm(false);
  };

  const handleSave = () => {
    if (totalEquity > 1) {
      alert("Total equity cannot exceed 100%. Please adjust partner shares.");
      return;
    }

    try {
      // Get business info for company name
      const businessInfoStr = localStorage.getItem("business_info");
      const businessInfo = businessInfoStr ? JSON.parse(businessInfoStr) : null;

      // Create the partner config object
      const partnerConfig: PartnerConfig = {
        partners,
        companyName: businessInfo?.name || "Your Business",
        totalEquity: 1,
        lastUpdated: new Date().toISOString(),
      };

      // Save to partnerConfig
      localStorage.setItem(PARTNER_CONFIG_KEY, JSON.stringify(partnerConfig));

      if (import.meta.env.DEV) {
        console.log("✓ Saved partner config:", partners.length, "partners");
      }

      // Trigger events for components to pick up changes
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(
        new CustomEvent("partner-config-updated", {
          detail: { partnerConfig },
        })
      );

      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error("Failed to save partner config:", error);
      alert("Failed to save partner settings. Please try again.");
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        )
      ) {
        // Reload from storage to discard changes
        const configStr = localStorage.getItem(PARTNER_CONFIG_KEY);
        if (configStr) {
          try {
            const config: PartnerConfig = JSON.parse(configStr);
            setPartners(config.partners || []);
          } catch {
            setPartners([]);
          }
        } else {
          setPartners([]);
        }
        setHasChanges(false);
        setShowAddForm(false);
        setEditingPartner(null);
        resetForm();
        onClose();
      }
    } else {
      onClose();
    }
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  Partner Settings
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Manage business partners and equity distribution
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
            {/* Equity Summary */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl p-5 mb-6 border border-slate-200 dark:border-slate-600">
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
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600"
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
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded">
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
                            className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
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
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
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
                      <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          Editing <strong>{editingPartner.name}</strong>.
                          Available equity includes their current share.
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
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Enter partner name"
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-blue-400"
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
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-800 outline-none transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-blue-400"
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
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
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
                className="w-full flex items-center justify-center gap-3 px-6 py-5 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-semibold text-base">
                  Add Business Partner
                </span>
              </motion.button>
            )}

            {/* Empty State */}
            {partners.length === 0 && !showAddForm && (
              <div className="mb-6 p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                <p className="text-slate-600 dark:text-slate-400 mb-2 font-medium">
                  No partners added yet
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Click "Add Business Partner" to get started
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 p-6 dark:border-slate-700">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || totalEquity > 1}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                hasChanges && totalEquity <= 1
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              }`}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
