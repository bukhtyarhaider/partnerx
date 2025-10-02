import React from "react";
import { Settings } from "lucide-react";

interface DonationSettingsButtonProps {
  onClick: () => void;
  className?: string;
}

export const DonationSettingsButton: React.FC<DonationSettingsButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 ${className}`}
      title="Configure donation settings"
    >
      <Settings size={16} />
      <span className="hidden sm:inline">Donation Settings</span>
    </button>
  );
};
