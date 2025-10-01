// Dynamic icon generator for theme-aware PWA icons
export interface IconConfig {
  size: number;
  theme: "light" | "dark";
  purpose?: "any" | "maskable" | "maskable any";
}

export interface ThemeAwareIconSet {
  light: {
    background: string;
    foreground: string;
    accent: string;
  };
  dark: {
    background: string;
    foreground: string;
    accent: string;
  };
}

// Define theme-aware color schemes for icons
export const ICON_THEMES: ThemeAwareIconSet = {
  light: {
    background: "#ffffff", // White background for light theme
    foreground: "#1f2937", // Dark foreground for contrast
    accent: "#00b98d", // Green accent color
  },
  dark: {
    background: "#0f172b", // Dark background for dark theme
    foreground: "#ffffff", // White foreground for contrast
    accent: "#00b98d", // Green accent color (same)
  },
};

/**
 * Generate SVG icon with theme-aware colors
 */
export const generateThemeIcon = (
  theme: "light" | "dark",
  size: number = 512
): string => {
  const colors = ICON_THEMES[theme];

  // Create SVG with the app's logo and appropriate background
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
      <!-- Background circle -->
      <circle cx="256" cy="256" r="256" fill="${colors.background}"/>
      
      <!-- Main icon container -->
      <g transform="translate(128, 128)">
        <!-- Icon background -->
        <rect x="32" y="32" width="192" height="192" rx="32" fill="${colors.accent}"/>
        
        <!-- Dashboard/Layout icon -->
        <g transform="translate(80, 80)" fill="${colors.background}">
          <!-- Top row -->
          <rect x="0" y="0" width="40" height="40" rx="4"/>
          <rect x="50" y="0" width="40" height="40" rx="4"/>
          <!-- Bottom row -->
          <rect x="0" y="50" width="90" height="40" rx="4"/>
        </g>
        
        <!-- App name text (optional, can be removed for cleaner look) -->
        <text x="128" y="200" text-anchor="middle" font-family="Arial, sans-serif" 
              font-size="24" font-weight="bold" fill="${colors.foreground}">PX</text>
      </g>
      
      <!-- Border ring for better definition -->
      <circle cx="256" cy="256" r="240" fill="none" stroke="${colors.foreground}" 
              stroke-width="4" opacity="0.1"/>
    </svg>
  `;

  return svg;
};

/**
 * Convert SVG to data URL for use in manifest
 */
export const svgToDataUrl = (svg: string): string => {
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
};

export interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose: string;
  id: string;
  theme: "light" | "dark";
}

/**
 * Generate icon configurations for both themes
 */
export const generateIconConfigs = (): ManifestIcon[] => {
  const sizes = [64, 192, 512];
  const configs: ManifestIcon[] = [];

  for (const theme of ["light", "dark"] as const) {
    for (const size of sizes) {
      const svg = generateThemeIcon(theme, size);
      const dataUrl = svgToDataUrl(svg);

      // Regular icon
      configs.push({
        src: dataUrl,
        sizes: `${size}x${size}`,
        type: "image/svg+xml",
        purpose: "any",
        id: `icon-${theme}-${size}`,
        theme: theme,
      });

      // Maskable version (512px only)
      if (size === 512) {
        configs.push({
          src: dataUrl,
          sizes: `${size}x${size}`,
          type: "image/svg+xml",
          purpose: "maskable",
          id: `icon-${theme}-${size}-maskable`,
          theme: theme,
        });
      }
    }
  }

  return configs;
};

/**
 * Update PWA manifest with theme-appropriate icons
 */
export const updateManifestIcons = (theme: "light" | "dark") => {
  // Check if we're in a service worker context or main thread
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    // We can't directly modify the manifest, but we can register a new one
    // This is a more complex implementation that would require service worker updates
    console.log(`Would update manifest icons for ${theme} theme`);
  }

  // For now, we'll update the link tags for immediate favicon changes
  updateFaviconForTheme(theme);
};

/**
 * Update favicon based on current theme
 */
export const updateFaviconForTheme = (theme: "light" | "dark") => {
  // Remove existing favicon
  const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
  existingFavicons.forEach((link) => {
    if (link.getAttribute("data-theme-generated")) {
      link.remove();
    }
  });

  // Generate new favicon
  const svg = generateThemeIcon(theme, 32);
  const dataUrl = svgToDataUrl(svg);

  // Create new favicon link
  const faviconLink = document.createElement("link");
  faviconLink.rel = "icon";
  faviconLink.type = "image/svg+xml";
  faviconLink.href = dataUrl;
  faviconLink.setAttribute("data-theme-generated", "true");

  document.head.appendChild(faviconLink);

  // Also create PNG fallback
  createPngFavicon(theme);
};

/**
 * Create PNG favicon using canvas (for better browser support)
 */
const createPngFavicon = (theme: "light" | "dark") => {
  const canvas = document.createElement("canvas");
  const size = 32;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const colors = ICON_THEMES[theme];

  // Draw background circle
  ctx.fillStyle = colors.background;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // Draw icon background
  ctx.fillStyle = colors.accent;
  ctx.fillRect(8, 8, 16, 16);

  // Draw simple dashboard icon
  ctx.fillStyle = colors.background;
  ctx.fillRect(10, 10, 4, 4);
  ctx.fillRect(16, 10, 4, 4);
  ctx.fillRect(10, 16, 10, 4);

  // Convert to blob and create link
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.href = url;
      link.setAttribute("data-theme-generated", "true");
      document.head.appendChild(link);
    }
  });
};
