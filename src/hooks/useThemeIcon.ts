import { useEffect, useState } from "react";
import { useTheme } from "./useTheme";
import { generateThemeIcon, svgToDataUrl } from "../utils/themeAwareIcons";

interface UseThemeIconOptions {
  size?: number;
  format?: "svg" | "dataUrl";
}

/**
 * Hook to generate theme-aware icons that update when theme changes
 */
export const useThemeIcon = (options: UseThemeIconOptions = {}) => {
  const { theme } = useTheme();
  const { size = 32, format = "dataUrl" } = options;

  const [icon, setIcon] = useState<string>("");

  useEffect(() => {
    const svg = generateThemeIcon(theme, size);
    const result = format === "svg" ? svg : svgToDataUrl(svg);
    setIcon(result);
  }, [theme, size, format]);

  return icon;
};

/**
 * Hook to generate multiple theme-aware icons of different sizes
 */
export const useThemeIcons = (sizes: number[] = [16, 32, 64]) => {
  const { theme } = useTheme();
  const [icons, setIcons] = useState<Record<number, string>>({});

  useEffect(() => {
    const newIcons: Record<number, string> = {};

    sizes.forEach((size) => {
      const svg = generateThemeIcon(theme, size);
      newIcons[size] = svgToDataUrl(svg);
    });

    setIcons(newIcons);
  }, [theme, sizes]);

  return icons;
};
