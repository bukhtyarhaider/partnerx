// @ts-expect-error: virtual module provided by the PWA/Vite plugin
import { registerSW } from "virtual:pwa-register";

// Optional: Ask user to reload when there's a new version
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App is ready to work offline");
  },
});
