import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// Read package.json for version
import pkg from "./package.json";

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_DATE__: JSON.stringify(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    ),
  },
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
        "favicon.svg",
        "favicon.ico",
        "logo.png",
        "logo.svg",
        "AppImages/ios/180.png",
        "AppImages/ios/152.png",
        "AppImages/ios/144.png",
        "AppImages/ios/120.png",
        "AppImages/ios/114.png",
        "AppImages/ios/76.png",
        "AppImages/ios/72.png",
        "AppImages/ios/60.png",
        "AppImages/ios/57.png",
        "AppImages/ios/192.png",
        "AppImages/ios/512.png",
        "AppImages/android/android-launchericon-48-48.png",
        "AppImages/android/android-launchericon-72-72.png",
        "AppImages/android/android-launchericon-96-96.png",
        "AppImages/android/android-launchericon-144-144.png",
        "AppImages/android/android-launchericon-192-192.png",
        "AppImages/android/android-launchericon-512-512.png",
        "AppImages/windows11/Square150x150Logo.scale-100.png",
        "AppImages/windows11/Square44x44Logo.scale-100.png",
        "AppImages/windows11/StoreLogo.scale-100.png",
        "AppImages/windows11/Wide310x150Logo.scale-100.png",
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
            src: "/AppImages/ios/64.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/AppImages/ios/192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/AppImages/ios/512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/AppImages/android/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/AppImages/android/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any",
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
