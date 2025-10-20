import { useState } from "react";
import {
  Settings,
  DollarSign,
  Users,
  Database,
  Moon,
  Sun,
  LockKeyhole,
  X,
  Vibrate,
  Info,
} from "lucide-react";
import { DonationConfigModal } from "./DonationConfigModal";
import { IncomeSourceSettingsModal } from "./IncomeSourceSettingsModal";
import { PartnerSettingsModal } from "./PartnerSettingsModal";
import { PinSettingsModal } from "./PinSettingsModal";
import { ImportExport } from "./ImportExport";
import { AboutModal } from "./AboutModal";
import { useTheme } from "../hooks/useTheme";
import { useBusinessInfo } from "../hooks/useBusinessInfo";
import { useHaptics } from "../hooks/useHaptics";
import type { AppHandlers } from "../types";

interface DesktopSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppHandlers;
}

export const DesktopSettingsModal = ({
  isOpen,
  onClose,
  appState,
}: DesktopSettingsModalProps) => {
  const { theme, toggleTheme } = useTheme();
  const { isPersonalMode } = useBusinessInfo();
  const {
    isEnabled: isHapticsEnabled,
    toggleHaptics,
    triggerHaptic,
  } = useHaptics();

  const [isDonationConfigOpen, setIsDonationConfigOpen] = useState(false);
  const [isIncomeSettingsOpen, setIsIncomeSettingsOpen] = useState(false);
  const [isPartnerSettingsOpen, setIsPartnerSettingsOpen] = useState(false);
  const [isPinSettingsOpen, setIsPinSettingsOpen] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  if (!isOpen) return null;

  const settingsItems = [
    {
      id: "pin",
      title: "PIN Lock",
      description: "Change or set up your PIN code",
      icon: LockKeyhole,
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      onClick: () => setIsPinSettingsOpen(true),
    },
    {
      id: "donation",
      title: "Donation Settings",
      description: "Configure donation percentage and preferences",
      icon: DollarSign,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      onClick: () => setIsDonationConfigOpen(true),
    },
    {
      id: "income",
      title: "Income Sources",
      description: "Manage your income source categories",
      icon: DollarSign,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      onClick: () => setIsIncomeSettingsOpen(true),
    },
    ...(!isPersonalMode
      ? [
          {
            id: "partners",
            title: "Partner Settings",
            description: "Configure partner information and distribution",
            icon: Users,
            iconBg: "bg-purple-100 dark:bg-purple-900/30",
            iconColor: "text-purple-600 dark:text-purple-400",
            onClick: () => setIsPartnerSettingsOpen(true),
          },
        ]
      : []),
    {
      id: "data",
      title: "Data Management",
      description: "Import and export your financial data",
      icon: Database,
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      onClick: () => setShowDataManagement(!showDataManagement),
    },
    {
      id: "about",
      title: "About App",
      description: "View app information and developer details",
      icon: Info,
      iconBg: "bg-slate-100 dark:bg-slate-900/30",
      iconColor: "text-slate-600 dark:text-slate-400",
      onClick: () => setIsAboutOpen(true),
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden pointer-events-auto border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <Settings className="size-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Manage your app preferences and configurations
              </p>

              {/* Theme Toggle Card */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <button
                  onClick={() => {
                    triggerHaptic("medium");
                    toggleTheme();
                  }}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3">
                      {theme === "dark" ? (
                        <Moon className="size-5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Sun className="size-5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        Theme
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {theme === "dark" ? "Dark Mode" : "Light Mode"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                      {theme}
                    </span>
                  </div>
                </button>
              </div>

              {/* Haptics Toggle Card */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <button
                  onClick={() => {
                    triggerHaptic("medium");
                    toggleHaptics();
                  }}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
                      <Vibrate className="size-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        Haptic Feedback
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isHapticsEnabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {isHapticsEnabled ? "On" : "Off"}
                    </span>
                  </div>
                </button>
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {settingsItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      triggerHaptic("light");
                      item.onClick();
                    }}
                    className="rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-full ${item.iconBg} p-3 flex-shrink-0`}
                      >
                        <item.icon className={`size-5 ${item.iconColor}`} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Data Management Section - Expandable */}
              {showDataManagement && (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
                    Import & Export Data
                  </h3>
                  <ImportExport
                    transactions={appState.transactions}
                    expenses={appState.expenses}
                    donationPayouts={appState.donationPayouts}
                    onImport={appState.handleImport}
                    summaries={appState.summaries}
                    donationConfig={appState.donationConfig}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Modals */}
      <PinSettingsModal
        isOpen={isPinSettingsOpen}
        onClose={() => setIsPinSettingsOpen(false)}
      />

      <DonationConfigModal
        isOpen={isDonationConfigOpen}
        onClose={() => setIsDonationConfigOpen(false)}
        config={appState.donationConfig}
        onUpdate={appState.handleUpdateDonationConfig}
      />

      <IncomeSourceSettingsModal
        isOpen={isIncomeSettingsOpen}
        onClose={() => setIsIncomeSettingsOpen(false)}
      />

      {!isPersonalMode && (
        <PartnerSettingsModal
          isOpen={isPartnerSettingsOpen}
          onClose={() => setIsPartnerSettingsOpen(false)}
        />
      )}

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};
