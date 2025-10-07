import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Eye, EyeOff, Plus, Trash2, Save } from "lucide-react";
import { useIncomeSources } from "../hooks/useIncomeSources";
import { incomeSourceService } from "../services/incomeSourceService";
import type { IncomeSource } from "../types";

interface IncomeSourceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncomeSourceSettingsModal: React.FC<
  IncomeSourceSettingsModalProps
> = ({ isOpen, onClose }) => {
  const { sources, loading, error, refresh } = useIncomeSources();
  const [modifiedSources, setModifiedSources] = useState<IncomeSource[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");

  // Initialize modified sources when modal opens
  useEffect(() => {
    if (isOpen && sources.length > 0) {
      setModifiedSources([...sources]);
      setHasChanges(false);
    }
  }, [isOpen, sources]);

  const handleToggleSource = (sourceId: string) => {
    setModifiedSources((prev) =>
      prev.map((source) =>
        source.id === sourceId
          ? { ...source, enabled: !source.enabled }
          : source
      )
    );
    setHasChanges(true);
  };

  const handleAddSource = async () => {
    if (!newSourceName.trim()) return;

    try {
      const newSource: Omit<IncomeSource, "createdAt" | "updatedAt"> = {
        id: newSourceName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        name: newSourceName,
        enabled: true,
        metadata: {
          icon: {
            type: "lucide",
            value: "DollarSign",
            color: "#10b981",
          },
          display: {
            description: "Custom income source",
            category: "custom",
          },
        },
      };

      await incomeSourceService.addSource(newSource);
      await refresh();
      setNewSourceName("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add income source:", error);
    }
  };

  const handleRemoveSource = async (sourceId: string) => {
    try {
      await incomeSourceService.removeSource(sourceId);
      await refresh();
    } catch (error) {
      console.error("Failed to remove income source:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update each modified source
      for (const source of modifiedSources) {
        const originalSource = sources.find((s) => s.id === source.id);
        if (originalSource && originalSource.enabled !== source.enabled) {
          await incomeSourceService.updateSource(source.id, {
            enabled: source.enabled,
          });
        }
      }

      await refresh();
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save income source settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        )
      ) {
        setHasChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

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
          className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Income Source Settings
            </h2>
            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                Error loading income sources: {error}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Manage your income sources. Disabled sources won't appear in
                  transaction forms.
                </p>

                {/* Add New Source */}
                {showAddForm ? (
                  <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Income source name"
                        value={newSourceName}
                        onChange={(e) => setNewSourceName(e.target.value)}
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddSource()
                        }
                      />
                      <button
                        onClick={handleAddSource}
                        disabled={!newSourceName.trim()}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setNewSourceName("");
                        }}
                        className="rounded-lg bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 p-4 text-slate-600 hover:border-slate-400 hover:text-slate-700 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-300"
                  >
                    <Plus size={16} />
                    Add Custom Income Source
                  </button>
                )}

                {/* Income Sources List */}
                <div className="space-y-2">
                  {modifiedSources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleSource(source.id)}
                          className={`rounded-lg p-2 transition-colors ${
                            source.enabled
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                          }`}
                        >
                          {source.enabled ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-slate-100">
                            {source.name}
                          </h3>
                          {source.metadata?.display?.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {source.metadata.display.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {source.metadata?.display?.category === "custom" && (
                        <button
                          onClick={() => handleRemoveSource(source.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          title="Remove custom source"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 p-6 dark:border-slate-700">
            <button
              onClick={handleClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
