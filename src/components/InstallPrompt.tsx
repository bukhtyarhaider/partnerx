import React, { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

interface InstallPromptProps {
  onClose?: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      setHasBeenDismissed(true);
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already in standalone mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone ||
      document.referrer.includes("android-app://");
    setIsStandalone(standalone);

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);

      // Show install prompt after a short delay if not in standalone mode
      if (!standalone && !dismissed) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 3000);
      }
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      // Analytics or other tracking can go here
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // For iOS devices, show manual install instructions
    if (iOS && !standalone && !dismissed) {
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error("Error during installation:", error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setHasBeenDismissed(true);
    localStorage.setItem("pwa-install-dismissed", "true");
    onClose?.();
  };

  const handleRemindLater = () => {
    setShowInstallPrompt(false);
    // Set a timestamp to show again in 7 days
    const remindDate = new Date();
    remindDate.setDate(remindDate.getDate() + 7);
    localStorage.setItem("pwa-install-remind", remindDate.toISOString());
  };

  // Don't show if already installed or dismissed
  if (isStandalone || hasBeenDismissed || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Install PartnerWise
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {isIOS
            ? "Add PartnerWise to your home screen for the best experience!"
            : "Install PartnerWise for faster access and offline use."}
        </p>

        {isIOS ? (
          <div className="space-y-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p className="mb-2">To install:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Tap the Share button in Safari</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleRemindLater}
                className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleRemindLater}
              className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleInstallClick}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Install</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallPrompt;
