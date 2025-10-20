import { X, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { BusinessInfo } from "../types/onboarding";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);

  useEffect(() => {
    setIsMounted(true);

    const saved = localStorage.getItem("business_info");
    if (saved) {
      try {
        setBusinessInfo(JSON.parse(saved));
      } catch (error) {
        console.warn("Failed to parse business info:", error);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen || !isMounted) return null;

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 dark:border dark:border-slate-700 animate-scale-in"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            About PartnerWise
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* App Details */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            App Details
          </h3>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <li>
              <strong>Name:</strong> {!businessInfo?.name || "PartnerWise"}
            </li>
            <li>
              <strong>Version:</strong> 1.0.0 (pre-release)
            </li>
            <li>
              <strong>Release Date:</strong> Sep 30, 2025
            </li>
          </ul>
        </div>

        {/* Developer Info */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            About the Developer
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Built by{" "}
            <a
              href="https://github.com/bukhtyarhaider"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              Bukhtyar Haider
            </a>
            , passionate about clean and efficient software.
          </p>
          <div className="mt-3 flex gap-4 text-slate-500 dark:text-slate-400">
            <a
              href="https://github.com/bukhtyarhaider"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/bukhtyarhaider"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

// Component to trigger the About modal - can be used in settings
interface AboutSettingsButtonProps {
  onClick: () => void;
}

export function AboutSettingsButton({ onClick }: AboutSettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 hover:shadow-md active:scale-[0.98] flex items-center gap-3"
    >
      <div className="rounded-full bg-slate-100 dark:bg-slate-900/30 p-3 flex-shrink-0">
        <Info className="size-5 text-slate-600 dark:text-slate-400" />
      </div>
      <div className="text-left flex-1 min-w-0">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
          About App
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          View app information and developer details
        </p>
      </div>
    </button>
  );
}
