import { useEffect } from "react";

// Accessibility utilities
export const useA11yEnhancements = () => {
  useEffect(() => {
    // Set up skip links for keyboard navigation
    const createSkipLink = () => {
      const skipLink = document.createElement("a");
      skipLink.href = "#main-content";
      skipLink.textContent = "Skip to main content";
      skipLink.className =
        "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50";
      skipLink.style.position = "absolute";
      skipLink.style.top = "-40px";
      skipLink.style.left = "6px";
      skipLink.style.transition = "top 0.3s";
      skipLink.addEventListener("focus", () => {
        skipLink.style.top = "6px";
      });
      skipLink.addEventListener("blur", () => {
        skipLink.style.top = "-40px";
      });

      document.body.insertBefore(skipLink, document.body.firstChild);
    };

    // Add focus management
    const manageFocus = () => {
      // Ensure main content has proper id
      const mainContent = document.querySelector('[role="main"], main, #root');
      if (mainContent && !mainContent.id) {
        mainContent.id = "main-content";
      }

      // Add aria-label to interactive elements without labels
      const unlabeledButtons = document.querySelectorAll(
        "button:not([aria-label]):not([aria-labelledby])"
      );
      unlabeledButtons.forEach((button) => {
        if (!button.textContent?.trim()) {
          button.setAttribute("aria-label", "Interactive button");
        }
      });
    };

    // Announce dynamic content changes
    const createLiveRegion = () => {
      if (!document.getElementById("aria-live-region")) {
        const liveRegion = document.createElement("div");
        liveRegion.id = "aria-live-region";
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.setAttribute("aria-atomic", "true");
        liveRegion.style.position = "absolute";
        liveRegion.style.left = "-10000px";
        liveRegion.style.width = "1px";
        liveRegion.style.height = "1px";
        liveRegion.style.overflow = "hidden";
        document.body.appendChild(liveRegion);
      }
    };

    // Improve color contrast in high contrast mode
    const setupHighContrastMode = () => {
      const mediaQuery = window.matchMedia("(prefers-contrast: high)");
      const updateContrast = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) {
          document.documentElement.classList.add("high-contrast");
        } else {
          document.documentElement.classList.remove("high-contrast");
        }
      };

      updateContrast(mediaQuery);
      mediaQuery.addEventListener("change", updateContrast);

      return () => mediaQuery.removeEventListener("change", updateContrast);
    };

    // Reduce motion for users who prefer it
    const setupReducedMotion = () => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const updateMotion = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) {
          document.documentElement.classList.add("reduce-motion");
        } else {
          document.documentElement.classList.remove("reduce-motion");
        }
      };

      updateMotion(mediaQuery);
      mediaQuery.addEventListener("change", updateMotion);

      return () => mediaQuery.removeEventListener("change", updateMotion);
    };

    createSkipLink();
    manageFocus();
    createLiveRegion();
    const cleanupContrast = setupHighContrastMode();
    const cleanupMotion = setupReducedMotion();

    return () => {
      cleanupContrast?.();
      cleanupMotion?.();
    };
  }, []);
};

// Utility function to announce messages to screen readers
export const announceToScreenReader = (message: string) => {
  const liveRegion = document.getElementById("aria-live-region");
  if (liveRegion) {
    liveRegion.textContent = message;
    // Clear after a delay to allow re-announcing the same message
    setTimeout(() => {
      liveRegion.textContent = "";
    }, 1000);
  }
};

export default useA11yEnhancements;
