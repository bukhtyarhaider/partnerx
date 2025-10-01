import {
  generateThemeIcon,
  svgToDataUrl,
  ICON_THEMES,
} from "./themeAwareIcons";

interface PWAManifest {
  name?: string;
  short_name?: string;
  theme_color?: string;
  background_color?: string;
  icons?: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }>;
  [key: string]: unknown;
}

/**
 * Dynamic PWA manifest generator that adapts to theme changes
 */
export class DynamicManifestManager {
  private static instance: DynamicManifestManager;
  private currentTheme: "light" | "dark" = "dark";
  private originalManifest: PWAManifest | null = null;

  private constructor() {
    this.loadOriginalManifest();
  }

  static getInstance(): DynamicManifestManager {
    if (!DynamicManifestManager.instance) {
      DynamicManifestManager.instance = new DynamicManifestManager();
    }
    return DynamicManifestManager.instance;
  }

  private async loadOriginalManifest() {
    try {
      const manifestLink = document.querySelector(
        'link[rel="manifest"]'
      ) as HTMLLinkElement;
      if (manifestLink) {
        const response = await fetch(manifestLink.href);
        this.originalManifest = await response.json();
      }
    } catch (error) {
      console.warn("Could not load original manifest:", error);
    }
  }

  /**
   * Update the PWA theme and regenerate manifest with theme-appropriate icons
   */
  async updateTheme(theme: "light" | "dark") {
    this.currentTheme = theme;
    await this.regenerateManifest();
  }

  /**
   * Generate a new manifest with theme-aware icons
   */
  private async regenerateManifest() {
    if (!this.originalManifest) return;

    const themeColors = ICON_THEMES[this.currentTheme];
    const newManifest = {
      ...this.originalManifest,
      theme_color: themeColors.background,
      background_color: themeColors.background,
      icons: this.generateThemeAwareIcons(),
    };

    // Create and register the new manifest
    await this.registerNewManifest(newManifest);
  }

  /**
   * Generate icons for the current theme
   */
  private generateThemeAwareIcons() {
    const sizes = [64, 192, 512];
    const icons = [];

    for (const size of sizes) {
      const svg = generateThemeIcon(this.currentTheme, size);
      const dataUrl = svgToDataUrl(svg);

      // Standard icon
      icons.push({
        src: dataUrl,
        sizes: `${size}x${size}`,
        type: "image/svg+xml",
        purpose: "any",
      });

      // Maskable icon (for 512px only)
      if (size === 512) {
        icons.push({
          src: dataUrl,
          sizes: `${size}x${size}`,
          type: "image/svg+xml",
          purpose: "maskable",
        });
      }
    }

    return icons;
  }

  /**
   * Register a new manifest by creating a blob URL and updating the link tag
   */
  private async registerNewManifest(manifest: PWAManifest) {
    const manifestBlob = new Blob([JSON.stringify(manifest)], {
      type: "application/json",
    });
    const manifestUrl = URL.createObjectURL(manifestBlob);

    // Remove existing manifest link
    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) {
      existingManifest.remove();
    }

    // Add new manifest link
    const newManifestLink = document.createElement("link");
    newManifestLink.rel = "manifest";
    newManifestLink.href = manifestUrl;
    newManifestLink.setAttribute("data-theme", this.currentTheme);
    document.head.appendChild(newManifestLink);

    // Clean up old URL after a delay
    setTimeout(() => {
      const oldUrl = existingManifest?.getAttribute("href");
      if (oldUrl && oldUrl.startsWith("blob:")) {
        URL.revokeObjectURL(oldUrl);
      }
    }, 1000);
  }

  /**
   * Get the current theme
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
}
