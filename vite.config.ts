import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
        ],
        // Don't use navigateFallback in development - it causes issues
        // Only redirect to offline.html when actually offline
        navigateFallback: undefined,
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
      },
      includeAssets: [
        "AppImages/web/partnerwise-favicon.svg",
        "AppImages/web/partnerwise-favicon.ico",
        "AppImages/web/partnerwise-logo.png",
        "AppImages/ios/partnerwise-apple-touch-icon.png",
        "AppImages/ios/partnerwise-apple-touch-icon-180x180.png",
        "AppImages/ios/partnerwise-apple-touch-icon-152x152.png",
        "AppImages/ios/partnerwise-apple-touch-icon-144x144.png",
        "AppImages/ios/partnerwise-apple-touch-icon-120x120.png",
        "AppImages/ios/partnerwise-apple-touch-icon-114x114.png",
        "AppImages/ios/partnerwise-apple-touch-icon-76x76.png",
        "AppImages/ios/partnerwise-apple-touch-icon-72x72.png",
        "AppImages/ios/partnerwise-apple-touch-icon-60x60.png",
        "AppImages/ios/partnerwise-apple-touch-icon-57x57.png",
        "AppImages/android/partnerwise-64x64.png",
        "AppImages/android/partnerwise-192x192.png",
        "AppImages/android/partnerwise-512x512.png",
        "AppImages/android/partnerwise-maskable-512x512.png",
        "AppImages/android/android-launchericon-48-48.png",
        "AppImages/android/android-launchericon-72-72.png",
        "AppImages/android/android-launchericon-96-96.png",
        "AppImages/android/android-launchericon-144-144.png",
        "AppImages/android/android-launchericon-192-192.png",
        "AppImages/android/android-launchericon-512-512.png",
        "AppImages/splash/partnerwise-ios-splash-2048-2732.png",
        "AppImages/splash/partnerwise-ios-splash-1668-2224.png",
        "AppImages/splash/partnerwise-ios-splash-1536-2048.png",
        "AppImages/splash/partnerwise-ios-splash-1125-2436.png",
        "AppImages/splash/partnerwise-ios-splash-1242-2208.png",
        "AppImages/splash/partnerwise-ios-splash-750-1334.png",
        "AppImages/splash/partnerwise-ios-splash-828-1792.png",
        "AppImages/windows/partnerwise-tile-512x512.png",
        "AppImages/windows/partnerwise-tile-192x192.png",
        "AppImages/windows/partnerwise-tile-64x64.png",
        "AppImages/windows11/Square150x150Logo.scale-100.png",
        "AppImages/windows11/Square44x44Logo.scale-100.png",
        "AppImages/windows11/StoreLogo.scale-100.png",
        "AppImages/windows11/Wide310x150Logo.scale-100.png",
        "AppImages/macos/partnerwise-macos-512x512.png",
        "AppImages/macos/partnerwise-macos-192x192.png",
        "AppImages/macos/partnerwise-macos-64x64.png",
        "AppImages/web/partnerwise-screenshot-wide.png",
        "AppImages/web/partnerwise-screenshot-narrow.png",
      ],
      manifest: {
        id: "/",
        name: "PartnerWise",
        short_name: "PartnerWise",
        description:
          "Manage your personal finances with ease. Track income, expenses, donations, and partnerships in one beautiful app with PartnerWise.",
        categories: ["finance", "productivity", "business"],
        lang: "en",
        dir: "ltr",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        display_override: [
          "window-controls-overlay",
          "standalone",
          "minimal-ui",
        ],
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        prefer_related_applications: false,
        icons: [
          {
            src: "/AppImages/android/partnerwise-64x64.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/AppImages/android/partnerwise-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/AppImages/android/partnerwise-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/AppImages/android/partnerwise-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/AppImages/android/partnerwise-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any",
          },
        ],
        screenshots: [
          {
            src: "/AppImages/web/partnerwise-screenshot-wide.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
            label: "PartnerWise Dashboard - Wide View",
          },
          {
            src: "/AppImages/web/partnerwise-screenshot-narrow.png",
            sizes: "390x844",
            type: "image/png",
            form_factor: "narrow",
            label: "PartnerWise Mobile View",
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
});
