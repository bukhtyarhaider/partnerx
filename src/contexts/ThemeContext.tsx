import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContextBase";
import type { Theme } from "./ThemeContextBase";
import { updateFaviconForTheme } from "../utils/themeAwareIcons";
import { DynamicManifestManager } from "../utils/dynamicManifest";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "dark"; // Default to dark theme

    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Update PWA theme colors and icons (async)
      updatePWAThemeColors(theme).catch(console.error);
    }
  }, [theme, isInitialized]);

  const updatePWAThemeColors = async (currentTheme: Theme) => {
    const colors = {
      light: "#ffffff", // White for light mode
      dark: "#0f172b",
    };

    // Remove existing theme-color meta tags (including media query ones)
    const existingMetas = document.querySelectorAll('meta[name="theme-color"]');
    existingMetas.forEach((meta) => meta.remove());

    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = colors[currentTheme];
    document.head.appendChild(meta);

    const androidMeta = document.createElement("meta");
    androidMeta.name = "theme-color";
    androidMeta.content = colors[currentTheme];
    androidMeta.setAttribute("media", "(prefers-color-scheme: no-preference)");
    document.head.appendChild(androidMeta);

    // Update msapplication-navbutton-color
    const navButtonMeta = document.querySelector(
      'meta[name="msapplication-navbutton-color"]'
    );
    if (navButtonMeta) {
      navButtonMeta.setAttribute("content", colors[currentTheme]);
    }

    // Update Apple status bar style
    const statusBarMeta = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    if (statusBarMeta) {
      statusBarMeta.setAttribute(
        "content",
        currentTheme === "light" ? "default" : "black-translucent"
      );
    }

    // Update favicon and icons for the current theme
    updateFaviconForTheme(currentTheme);

    // Update PWA manifest with theme-appropriate icons
    try {
      const manifestManager = DynamicManifestManager.getInstance();
      await manifestManager.updateTheme(currentTheme);
    } catch (error) {
      console.warn("Failed to update PWA manifest:", error);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
