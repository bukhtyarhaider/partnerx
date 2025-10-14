import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Briefcase,
  Laptop,
  TrendingUp,
  Store,
  Home,
  Plus,
  X,
  Search,
  Filter,
  Star,
  Sparkles,
  Grid3x3,
  List,
  ChevronDown,
  Edit2,
  Trash2,
} from "lucide-react";
import { useOnboarding } from "../../hooks/useOnboarding";
import { getIncomeSourcesForAccountType } from "../../config/incomeSources";
import { incomeSourceService } from "../../services/incomeSourceService";
import {
  getRecommendedSourcesForCategory,
  getCategoryById,
} from "../../config/businessCategories";
import type { IncomeSource } from "../../types/incomeSource";
import { useConfirmation } from "../../hooks/useConfirmation";
import { SuccessToast } from "../common/SuccessToast";
import { ConfirmationModal } from "../common/ConfirmationModal";

const INCOME_SOURCES_STORAGE_KEY = "onboarding_income_sources";

interface IncomeSourcesStepProps {
  onNext: () => void;
  onSkip: () => void;
  onPrevious?: () => void;
  canGoBack?: boolean;
  isLastStep?: boolean;
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
    Briefcase,
    Laptop,
    TrendingUp,
    Store,
    Home,
    DollarSign,
    Video: Camera,
    ShoppingCart: Store,
    Code: Laptop,
    Factory: Store,
    User: Briefcase,
  };

  return iconMap[iconValue] || Globe;
};

export const IncomeSourcesStep: React.FC<IncomeSourcesStepProps> = ({
  onNext,
  onSkip,
  onPrevious,
  canGoBack = false,
}) => {
  const { markStepCompleted, businessInfo } = useOnboarding();
  const isPersonal = businessInfo?.type === "personal";

  // Get selected business category
  const [businessCategory] = useState<string | null>(() => {
    const stored = localStorage.getItem("onboarding_business_category");
    return stored ? JSON.parse(stored) : null;
  });

  // State for managing selected income sources during onboarding
  const [selectedSources, setSelectedSources] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(INCOME_SOURCES_STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  // State for tracking custom sources created during onboarding
  const [customSources, setCustomSources] = useState<IncomeSource[]>(() => {
    const stored = localStorage.getItem("onboarding_custom_sources");
    return stored ? JSON.parse(stored) : [];
  });

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // Custom source modal state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [customSourceName, setCustomSourceName] = useState("");
  const [customSourceCurrency, setCustomSourceCurrency] = useState<
    "PKR" | "USD"
  >("USD");
  const [customTaxEnabled, setCustomTaxEnabled] = useState(false);
  const [customTaxType, setCustomTaxType] = useState<"percentage" | "fixed">(
    "percentage"
  );
  const [customTaxValue, setCustomTaxValue] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // Toast and confirmation state
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { confirmation, showConfirmation, hideConfirmation, confirmAndHide } =
    useConfirmation();

  // Save to localStorage whenever selection changes
  useEffect(() => {
    localStorage.setItem(
      INCOME_SOURCES_STORAGE_KEY,
      JSON.stringify(Array.from(selectedSources))
    );
  }, [selectedSources]);

  // Save custom sources to localStorage
  useEffect(() => {
    localStorage.setItem(
      "onboarding_custom_sources",
      JSON.stringify(customSources)
    );
  }, [customSources]);

  // Get all sources
  const allSources = getIncomeSourcesForAccountType(isPersonal);

  // Get recommended sources based on category
  const recommendedIds = useMemo(() => {
    if (!businessCategory) return [];
    return getRecommendedSourcesForCategory(businessCategory);
  }, [businessCategory]);

  // Extract unique categories from sources
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    allSources.forEach((source) => {
      if (source.metadata?.display?.category) {
        categories.add(source.metadata.display.category);
      }
    });
    return Array.from(categories).sort();
  }, [allSources]);

  // Filter and search sources
  const filteredSources = useMemo(() => {
    let filtered = [...allSources];

    // Apply category filter
    if (selectedCategory !== "all") {
      if (selectedCategory === "recommended") {
        filtered = filtered.filter((source) =>
          recommendedIds.includes(source.id)
        );
      } else {
        filtered = filtered.filter(
          (source) => source.metadata?.display?.category === selectedCategory
        );
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (source) =>
          source.name.toLowerCase().includes(query) ||
          source.metadata?.display?.description
            ?.toLowerCase()
            .includes(query) ||
          source.metadata?.display?.category?.toLowerCase().includes(query)
      );
    }

    // Sort: recommended first, then alphabetically
    filtered.sort((a, b) => {
      const aIsRecommended = recommendedIds.includes(a.id);
      const bIsRecommended = recommendedIds.includes(b.id);

      if (aIsRecommended && !bIsRecommended) return -1;
      if (!aIsRecommended && bIsRecommended) return 1;

      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [allSources, selectedCategory, searchQuery, recommendedIds]);

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

  const handleOpenEditCustomSource = (source: IncomeSource) => {
    setEditingSourceId(source.id);
    setCustomSourceName(source.name);
    setCustomSourceCurrency(
      source.metadata?.settings?.defaultCurrency || "USD"
    );
    setCustomTaxEnabled(source.metadata?.settings?.tax?.enabled || false);
    setCustomTaxType(source.metadata?.settings?.tax?.type || "percentage");
    setCustomTaxValue(
      source.metadata?.settings?.tax?.enabled
        ? String(source.metadata.settings.tax.value)
        : ""
    );
    setShowCustomModal(true);
  };

  const handleDeleteCustomSource = (sourceId: string) => {
    const sourceToDelete = customSources.find((s) => s.id === sourceId);

    showConfirmation({
      title: "Delete Custom Source",
      message: `Are you sure you want to delete "${sourceToDelete?.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          // Remove from onboarding state
          setCustomSources((prev) => prev.filter((s) => s.id !== sourceId));

          // Remove from main config
          await incomeSourceService.removeSource(sourceId);

          setToastMessage("Custom source deleted successfully!");
          setShowSuccessToast(true);
        } catch (error) {
          console.error("Failed to delete custom source:", error);
          setToastMessage(
            error instanceof Error
              ? error.message
              : "Failed to delete custom income source"
          );
          setShowSuccessToast(true);
        }
      },
    });
  };

  const handleAddCustomSource = async () => {
    if (!customSourceName.trim()) {
      setToastMessage("Please enter a source name");
      setShowSuccessToast(true);
      return;
    }

    setIsAddingCustom(true);
    try {
      const sourceId =
        editingSourceId ||
        customSourceName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

      // Create the custom source object
      const now = new Date().toISOString();
      const existingSource = customSources.find((s) => s.id === sourceId);

      const customSource: IncomeSource = {
        id: sourceId,
        name: customSourceName,
        enabled: true,
        createdAt: existingSource?.createdAt || now,
        updatedAt: now,
        metadata: {
          icon: {
            type: "lucide" as const,
            value: "DollarSign",
            color: "#10b981",
            backgroundColor: "#ecfdf5",
          },
          fees: {
            fixedFeeUSD: 0,
            method: "fixed" as const,
          },
          settings: {
            defaultTaxRate: 0,
            commissionRate: 0,
            defaultCurrency: customSourceCurrency,
            tax: customTaxEnabled
              ? {
                  enabled: true,
                  type: customTaxType,
                  value: parseFloat(customTaxValue) || 0,
                }
              : {
                  enabled: false,
                  type: "percentage" as const,
                  value: 0,
                },
          },
          display: {
            description: `Custom income source: ${customSourceName}`,
            category: "Custom",
            sortOrder: 999,
          },
        },
      };

      if (editingSourceId) {
        // Update existing source
        await incomeSourceService.updateSource(sourceId, customSource);

        // Update in onboarding state
        setCustomSources((prev) =>
          prev.map((s) => (s.id === sourceId ? customSource : s))
        );

        setToastMessage(
          `Custom income source "${customSourceName}" has been updated!`
        );
        setShowSuccessToast(true);
      } else {
        // Add new source to main config
        await incomeSourceService.addSource(customSource);

        // Track custom source in onboarding state to show in selected list
        setCustomSources((prev) => [...prev, customSource]);

        // Automatically select the custom source
        setSelectedSources((prev) => new Set(prev).add(sourceId));

        setToastMessage(
          `Custom income source "${customSourceName}" has been created!`
        );
        setShowSuccessToast(true);
      }

      // Reset form
      setEditingSourceId(null);
      setCustomSourceName("");
      setCustomSourceCurrency("USD");
      setCustomTaxEnabled(false);
      setCustomTaxType("percentage");
      setCustomTaxValue("");
      setShowCustomModal(false);
    } catch (error) {
      console.error("Failed to add/update custom source:", error);
      setToastMessage(
        error instanceof Error
          ? error.message
          : "Failed to add/update custom income source"
      );
      setShowSuccessToast(true);
    } finally {
      setIsAddingCustom(false);
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

  const handleSelectAll = () => {
    const allIds = filteredSources.map((s) => s.id);
    setSelectedSources(new Set(allIds));
  };

  const handleClearAll = () => {
    setSelectedSources(new Set());
  };

  const handleSelectRecommended = () => {
    setSelectedSources(new Set(recommendedIds));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-7xl mx-auto p-4 sm:p-6"
    >
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-2xl mb-3 sm:mb-4 shadow-lg"
        >
          <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" />
        </motion.div>
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2 sm:mb-3">
          Select Income Sources
        </h2>
        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
          {isPersonal
            ? "Choose the types of income you want to track"
            : "Select the platforms and services you use to generate revenue"}
        </p>
      </div>

      {/* Category Info Banner */}
      {businessCategory && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
              <strong className="font-semibold">
                {getCategoryById(businessCategory)?.name}
              </strong>{" "}
              • Recommended sources are marked with{" "}
              <Star
                className="w-3 h-3 sm:w-4 sm:h-4 inline text-amber-500"
                fill="currentColor"
              />
            </p>
          </div>
        </motion.div>
      )}

      {/* Controls Bar */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search income sources..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-sm sm:text-base text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* View Mode Toggle - Desktop Only */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter and Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Category Filter */}
          <div className="relative flex-1">
            <button
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className="w-full sm:w-auto flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <Filter className="w-4 h-4" />
              <span className="flex-1 sm:flex-none text-left">
                {selectedCategory === "all"
                  ? "All Categories"
                  : selectedCategory === "recommended"
                  ? "Recommended"
                  : selectedCategory}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Category Dropdown */}
            <AnimatePresence>
              {showCategoryFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto sm:min-w-[250px] mt-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="max-h-64 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setShowCategoryFilter(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                        selectedCategory === "all"
                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-medium"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      All Categories
                    </button>
                    {recommendedIds.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedCategory("recommended");
                          setShowCategoryFilter(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 ${
                          selectedCategory === "recommended"
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-medium"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <Star
                          className="w-4 h-4 text-amber-500"
                          fill="currentColor"
                        />
                        Recommended
                      </button>
                    )}
                    <div className="h-px bg-slate-200 dark:bg-slate-600 my-1" />
                    {availableCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowCategoryFilter(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                          selectedCategory === category
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-medium"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Actions - Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            {recommendedIds.length > 0 && (
              <button
                onClick={handleSelectRecommended}
                className="px-3 py-2 text-xs font-medium border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors flex items-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5" />
                Select Recommended
              </button>
            )}
            <button
              onClick={handleSelectAll}
              className="px-3 py-2 text-xs font-medium border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-2 text-xs font-medium border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              {selectedSources.size + customSources.length} source
              {selectedSources.size + customSources.length !== 1
                ? "s"
                : ""}{" "}
              selected
              {customSources.length > 0 && (
                <span className="text-emerald-600 dark:text-emerald-400">
                  {" "}
                  ({customSources.length} custom)
                </span>
              )}
              {filteredSources.length !== allSources.length && (
                <span className="text-slate-500 dark:text-slate-400">
                  {" "}
                  • {filteredSources.length} shown
                </span>
              )}
            </span>
          </div>

          {/* Mobile Quick Actions */}
          <div className="flex sm:hidden items-center gap-1.5">
            {recommendedIds.length > 0 && (
              <button
                onClick={handleSelectRecommended}
                className="px-2 py-1 text-xs font-medium border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 rounded-md hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              >
                <Star className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleClearAll}
              disabled={selectedSources.size === 0}
              className="px-2 py-1 text-xs font-medium border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Custom Sources Section */}
      {customSources.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
            Your Custom Sources
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              ({customSources.length})
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {customSources.map((source) => {
              const IconComponent = DollarSign;
              const iconColor = source.metadata?.icon?.color || "#10b981";
              const iconBgColor =
                source.metadata?.icon?.backgroundColor || "#ecfdf5";

              return (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-400 dark:border-emerald-600 rounded-2xl shadow-md"
                >
                  {/* Custom Badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                    Custom
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: iconBgColor,
                        color: iconColor,
                      }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base mb-1 truncate">
                        {source.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                        {source.metadata?.display?.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="px-2 py-0.5 bg-white/50 dark:bg-slate-800/50 rounded">
                          {source.metadata?.settings?.defaultCurrency || "USD"}
                        </span>
                        {source.metadata?.settings?.tax?.enabled && (
                          <span className="px-2 py-0.5 bg-white/50 dark:bg-slate-800/50 rounded">
                            Tax: {source.metadata.settings.tax.value}
                            {source.metadata.settings.tax.type === "percentage"
                              ? "%"
                              : " fixed"}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditCustomSource(source)}
                          className="flex-1 px-3 py-1.5 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCustomSource(source.id)}
                          className="flex-1 px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sources Grid/List */}
      {filteredSources.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 sm:py-16"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2">
            No income sources found
          </p>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">
            Try adjusting your search or filters
          </p>
        </motion.div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6"
              : "space-y-3 mb-6"
          }
        >
          {filteredSources.map((source) => {
            const isSelected = selectedSources.has(source.id);
            const isRecommended = recommendedIds.includes(source.id);
            const IconComponent = getIconComponent(
              source.metadata?.icon?.value || "Globe"
            );
            const iconColor = source.metadata?.icon?.color || "#6b7280";
            const iconBgColor =
              source.metadata?.icon?.backgroundColor || "#f1f5f9";

            return (
              <SourceCard
                key={source.id}
                source={source}
                isSelected={isSelected}
                isRecommended={isRecommended}
                IconComponent={IconComponent}
                iconColor={iconColor}
                iconBgColor={iconBgColor}
                viewMode={viewMode}
                onToggle={() => handleToggleSource(source.id)}
              />
            );
          })}
        </div>
      )}

      {/* Add Custom Source Button */}
      <motion.button
        type="button"
        onClick={() => setShowCustomModal(true)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full p-4 sm:p-5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 mb-6"
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="font-semibold text-sm sm:text-base">
            Add Custom Income Source
          </span>
        </div>
      </motion.button>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {canGoBack && onPrevious && (
          <motion.button
            onClick={onPrevious}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 sm:flex-none sm:px-8 px-6 py-3 sm:py-4 border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200 font-medium text-sm sm:text-base"
          >
            Previous
          </motion.button>
        )}
        <motion.button
          onClick={handleSkip}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-6 py-3 sm:py-4 border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200 font-medium text-sm sm:text-base"
        >
          Skip
        </motion.button>
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          Continue
        </motion.button>
      </div>

      {/* Info Note */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          💡 You can modify your income sources anytime from the app settings
        </p>
      </div>

      {/* Custom Source Modal */}
      <CustomSourceModal
        isOpen={showCustomModal}
        onClose={() => {
          setShowCustomModal(false);
          setEditingSourceId(null);
          setCustomSourceName("");
          setCustomSourceCurrency("USD");
          setCustomTaxEnabled(false);
          setCustomTaxType("percentage");
          setCustomTaxValue("");
        }}
        isEditing={!!editingSourceId}
        customSourceName={customSourceName}
        setCustomSourceName={setCustomSourceName}
        customSourceCurrency={customSourceCurrency}
        setCustomSourceCurrency={setCustomSourceCurrency}
        customTaxEnabled={customTaxEnabled}
        setCustomTaxEnabled={setCustomTaxEnabled}
        customTaxType={customTaxType}
        setCustomTaxType={setCustomTaxType}
        customTaxValue={customTaxValue}
        setCustomTaxValue={setCustomTaxValue}
        isAddingCustom={isAddingCustom}
        onAdd={handleAddCustomSource}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        variant={confirmation.variant}
        onConfirm={confirmAndHide}
        onClose={hideConfirmation}
      />

      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        type="income"
        message={toastMessage}
        duration={3000}
      />
    </motion.div>
  );
};

// Source Card Component
interface SourceCardProps {
  source: IncomeSource;
  isSelected: boolean;
  isRecommended: boolean;
  IconComponent: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBgColor: string;
  viewMode: "grid" | "list";
  onToggle: () => void;
}

const SourceCard: React.FC<SourceCardProps> = ({
  source,
  isSelected,
  isRecommended,
  IconComponent,
  iconColor,
  iconBgColor,
  viewMode,
  onToggle,
}) => {
  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onToggle}
        className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 p-4 ${
          isSelected
            ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 shadow-lg"
            : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ backgroundColor: iconBgColor, color: iconColor }}
          >
            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
                {source.name}
              </h4>
              {isRecommended && (
                <Star
                  className="w-4 h-4 text-amber-500 flex-shrink-0"
                  fill="currentColor"
                />
              )}
            </div>
            {source.metadata?.display?.description && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                {source.metadata.display.description}
              </p>
            )}
          </div>

          {/* Checkbox */}
          <div
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              isSelected
                ? "bg-emerald-500 border-emerald-500"
                : "border-slate-300 dark:border-slate-500"
            }`}
          >
            {isSelected && (
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        isSelected
          ? "border-emerald-500 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:via-emerald-800/20 dark:to-emerald-900/30 shadow-xl shadow-emerald-200/50 dark:shadow-emerald-900/30"
          : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg"
      }`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl z-10"
          >
            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white font-bold" />
          </motion.div>
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
        </>
      )}

      {/* Recommended Badge */}
      {isRecommended && !isSelected && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <Star
            className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500"
            fill="currentColor"
          />
        </div>
      )}

      <div className="p-4 sm:p-6">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative mb-3 sm:mb-4"
        >
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg mx-auto"
            style={{ backgroundColor: iconBgColor, color: iconColor }}
          >
            <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          {isSelected && (
            <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl -z-10 blur"></div>
          )}
        </motion.div>

        {/* Content */}
        <div className="text-center">
          <h4 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-1 sm:mb-2 tracking-tight">
            {source.name}
          </h4>

          {source.metadata?.display?.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
              {source.metadata.display.description}
            </p>
          )}

          {/* Tags/Badges */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-3">
            {source.metadata?.display?.category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                {source.metadata.display.category}
              </span>
            )}
            {source.metadata?.fees && (
              <>
                {source.metadata.fees.fixedFeeUSD &&
                  source.metadata.fees.fixedFeeUSD > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      ${source.metadata.fees.fixedFeeUSD} fee
                    </span>
                  )}
                {source.metadata.fees.percentageFee &&
                  source.metadata.fees.percentageFee > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {source.metadata.fees.percentageFee}% fee
                    </span>
                  )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Selected Overlay Effect */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
      )}
    </motion.div>
  );
};

// Custom Source Modal Component
interface CustomSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing?: boolean;
  customSourceName: string;
  setCustomSourceName: (value: string) => void;
  customSourceCurrency: "PKR" | "USD";
  setCustomSourceCurrency: (value: "PKR" | "USD") => void;
  customTaxEnabled: boolean;
  setCustomTaxEnabled: (value: boolean) => void;
  customTaxType: "percentage" | "fixed";
  setCustomTaxType: (value: "percentage" | "fixed") => void;
  customTaxValue: string;
  setCustomTaxValue: (value: string) => void;
  isAddingCustom: boolean;
  onAdd: () => void;
}

const CustomSourceModal: React.FC<CustomSourceModalProps> = ({
  isOpen,
  onClose,
  isEditing = false,
  customSourceName,
  setCustomSourceName,
  customSourceCurrency,
  setCustomSourceCurrency,
  customTaxEnabled,
  setCustomTaxEnabled,
  customTaxType,
  setCustomTaxType,
  customTaxValue,
  setCustomTaxValue,
  isAddingCustom,
  onAdd,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
              {isEditing ? "Edit Custom Source" : "Add Custom Source"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Source Name *
              </label>
              <input
                type="text"
                value={customSourceName}
                onChange={(e) => setCustomSourceName(e.target.value)}
                placeholder="e.g., Consulting, Etsy Shop"
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Default Currency *
              </label>
              <select
                value={customSourceCurrency}
                onChange={(e) =>
                  setCustomSourceCurrency(e.target.value as "PKR" | "USD")
                }
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="USD">USD (US Dollar)</option>
                <option value="PKR">PKR (Pakistani Rupee)</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="custom-tax-enabled"
                  checked={customTaxEnabled}
                  onChange={(e) => setCustomTaxEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                />
                <label
                  htmlFor="custom-tax-enabled"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Enable Tax Deduction
                </label>
              </div>

              {customTaxEnabled && (
                <div className="space-y-3 pl-6 border-l-2 border-emerald-200 dark:border-emerald-800">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Tax Type
                    </label>
                    <select
                      value={customTaxType}
                      onChange={(e) =>
                        setCustomTaxType(
                          e.target.value as "percentage" | "fixed"
                        )
                      }
                      className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (PKR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {customTaxType === "percentage"
                        ? "Tax Percentage"
                        : "Tax Amount (PKR)"}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={customTaxValue}
                      onChange={(e) => setCustomTaxValue(e.target.value)}
                      placeholder={
                        customTaxType === "percentage"
                          ? "e.g., 2.5"
                          : "e.g., 5000"
                      }
                      className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              disabled={isAddingCustom || !customSourceName.trim()}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isAddingCustom
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                ? "Update Source"
                : "Add Source"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
