/**
 * App metadata - dynamically injected at build time
 * These values are set in vite.config.ts using Vite's define option
 */

export const APP_METADATA = {
  version: __APP_VERSION__,
  buildDate: __BUILD_DATE__,
  name: "PartnerWise",
} as const;
