import { useState, useEffect } from "react";

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

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  showInstallPrompt: () => void;
  dismissInstallPrompt: () => void;
  installApp: () => Promise<boolean>;
}

export const usePWA = (): PWAState => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is running in standalone mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone ||
      document.referrer.includes("android-app://");

    setIsStandalone(standalone);
    setIsInstalled(standalone);

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("PWA install prompt is available");
    };

    // Handle app installation
    const handleAppInstalled = () => {
      console.log("PWA was installed successfully");
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);

      // Clear any install-related localStorage items
      localStorage.removeItem("pwa-install-dismissed");
      localStorage.removeItem("pwa-install-remind");
    };

    // Handle display mode changes
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
      setIsInstalled(e.matches);
    };

    const displayModeQuery = window.matchMedia("(display-mode: standalone)");

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    displayModeQuery.addListener(handleDisplayModeChange);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      displayModeQuery.removeListener(handleDisplayModeChange);
    };
  }, []);

  const showInstallPrompt = () => {
    // For iOS, we can't programmatically show install prompt
    // The component will handle showing instructions
    if (isIOS) {
      return;
    }

    // For supported browsers, trigger the install prompt
    if (deferredPrompt) {
      setIsInstallable(true);
    }
  };

  const dismissInstallPrompt = () => {
    setIsInstallable(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  const installApp = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.log("No install prompt available");
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`Install prompt outcome: ${outcome}`);

      if (outcome === "accepted") {
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      } else {
        setIsInstallable(false);
        localStorage.setItem("pwa-install-dismissed", "true");
        return false;
      }
    } catch (error) {
      console.error("Error during PWA installation:", error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    isStandalone,
    isIOS,
    showInstallPrompt,
    dismissInstallPrompt,
    installApp,
  };
};

export default usePWA;
