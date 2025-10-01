import { useEffect } from "react";
import { useTheme } from "./useTheme";

// Theme colors for different modes
const THEME_COLORS = {
  light: {
    primary: "#ffffff", // White background for light mode
    secondary: "#f8fafc", // Light gray
    accent: "#00b98d", // Green accent
  },
  dark: {
    primary: "#0f172b", // Dark gray background for dark mode
    secondary: "#111827", // Darker gray
    accent: "#00b98d", // Green accent (same)
  },
} as const;

/**
 * Custom hook to handle dynamic theme color updates for PWA status bar
 * This updates the meta theme-color tag when the theme changes
 */
export const useThemeColor = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Update theme-color meta tag
    const updateThemeColor = (color: string) => {
      // Remove existing theme-color meta tags
      const existingMetas = document.querySelectorAll(
        'meta[name="theme-color"]'
      );
      existingMetas.forEach((meta) => meta.remove());

      // Create new theme-color meta tag
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = color;
      document.head.appendChild(meta);

      // Also update msapplication-navbutton-color for better Windows support
      const navButtonMeta = document.querySelector(
        'meta[name="msapplication-navbutton-color"]'
      );
      if (navButtonMeta) {
        navButtonMeta.setAttribute("content", color);
      }

      // Update Apple status bar style based on theme
      const statusBarMeta = document.querySelector(
        'meta[name="apple-mobile-web-app-status-bar-style"]'
      );
      if (statusBarMeta) {
        // Use 'default' for light theme, 'black-translucent' for dark theme
        statusBarMeta.setAttribute(
          "content",
          theme === "light" ? "default" : "black-translucent"
        );
      }
    };

    // Apply the appropriate theme color
    const colors = THEME_COLORS[theme];
    updateThemeColor(colors.primary);

    // Also update CSS custom properties for additional theming
    const root = document.documentElement;
    root.style.setProperty("--theme-color-primary", colors.primary);
    root.style.setProperty("--theme-color-secondary", colors.secondary);
    root.style.setProperty("--theme-color-accent", colors.accent);
  }, [theme]);

  return {
    currentTheme: theme,
    colors: THEME_COLORS[theme],
  };
};
