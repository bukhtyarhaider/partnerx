import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { BusinessInfo } from "../types/onboarding";

export function AppInfoModal() {
  const [isOpen, setIsOpen] = useState(false);
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
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 dark:border dark:border-slate-700 animate-scale-in"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            App Info & Developer
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
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
              <strong>Name:</strong> {businessInfo?.name || "PartnerWise"}
            </li>
            <li>
              <strong>Version:</strong> 1.0.0 (pre-release)
            </li>
            <li>
              <strong>Build:</strong> Sep 30, 2025
            </li>
            <li>
              <strong>Stack:</strong> React + TypeScript + Tailwind CSS
            </li>
            <li>
              <strong>License:</strong> MIT
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
              className="hover:text-slate-700 dark:hover:text-slate-200"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/bukhtyarhaider"
              target="_blank"
              className="hover:text-slate-700 dark:hover:text-slate-200"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        About App
      </button>

      {isMounted && isOpen ? createPortal(modal, document.body) : null}
    </>
  );
}
