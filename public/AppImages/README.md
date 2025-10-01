# PartnerWise App Icons & Assets

This folder contains all the icons and assets for the PartnerWise app organized by platform.

## 📁 Folder Structure

```
AppImages/
├── android/          # Android PWA icons
├── ios/             # iOS app icons and touch icons  
├── windows/         # Windows tile icons
├── macos/          # macOS app icons
├── web/            # Web favicons and screenshots
└── splash/         # iOS splash screens
```

## 🤖 Android Icons (`/android/`)

- `partnerwise-64x64.png` - Small notification icon
- `partnerwise-192x192.png` - Standard app icon
- `partnerwise-512x512.png` - High-res app icon
- `partnerwise-maskable-512x512.png` - Adaptive/maskable icon with safe zone

**Usage:** PWA manifest, Play Store listing, home screen

## 🍎 iOS Icons (`/ios/`)

- `partnerwise-apple-touch-icon.png` - Default Apple touch icon (180x180)
- `partnerwise-apple-touch-icon-57x57.png` - iOS 6 and below
- `partnerwise-apple-touch-icon-60x60.png` - iPhone (iOS 7+)
- `partnerwise-apple-touch-icon-72x72.png` - iPad (iOS 6 and below)
- `partnerwise-apple-touch-icon-76x76.png` - iPad (iOS 7+)
- `partnerwise-apple-touch-icon-114x114.png` - iPhone Retina (iOS 6 and below)
- `partnerwise-apple-touch-icon-120x120.png` - iPhone Retina (iOS 7+)
- `partnerwise-apple-touch-icon-144x144.png` - iPad Retina (iOS 6 and below)
- `partnerwise-apple-touch-icon-152x152.png` - iPad Retina (iOS 7+)
- `partnerwise-apple-touch-icon-180x180.png` - iPhone 6 Plus

**Usage:** Apple touch icons for web apps, Safari bookmarks

## 🖼️ Splash Screens (`/splash/`)

- `partnerwise-ios-splash-2048-2732.png` - iPad Pro 12.9" (2048×2732)
- `partnerwise-ios-splash-1668-2224.png` - iPad Pro 10.5" (1668×2224)
- `partnerwise-ios-splash-1536-2048.png` - iPad Pro 9.7" / iPad Air (1536×2048)
- `partnerwise-ios-splash-1125-2436.png` - iPhone X/XS/11 Pro (1125×2436)
- `partnerwise-ios-splash-1242-2208.png` - iPhone 6+/7+/8+ (1242×2208)
- `partnerwise-ios-splash-750-1334.png` - iPhone 6/7/8/SE2 (750×1334)
- `partnerwise-ios-splash-828-1792.png` - iPhone XR/11 (828×1792)

**Usage:** iOS PWA launch screens

## 🪟 Windows Icons (`/windows/`)

- `partnerwise-tile-64x64.png` - Small tile
- `partnerwise-tile-192x192.png` - Medium tile
- `partnerwise-tile-512x512.png` - Large tile

**Usage:** Windows 10/11 tiles, Microsoft Store

## 🍎 macOS Icons (`/macos/`)

- `partnerwise-macos-64x64.png` - Small icon
- `partnerwise-macos-192x192.png` - Standard icon  
- `partnerwise-macos-512x512.png` - High-res icon

**Usage:** macOS app bundle, Dock icon

## 🌐 Web Assets (`/web/`)

- `partnerwise-favicon.svg` - Scalable favicon
- `partnerwise-favicon.ico` - Legacy favicon
- `partnerwise-logo.png` - Main brand logo
- `partnerwise-screenshot-wide.png` - Desktop app screenshot (1280×720)
- `partnerwise-screenshot-narrow.png` - Mobile app screenshot (390×844)

**Usage:** Website favicon, manifest screenshots, app store listings

## 🎨 Design Guidelines

### Icon Safe Zones
- **Android Maskable:** 80px safe zone in 512×512 canvas
- **iOS:** No transparency, square with rounded corners applied by system
- **Windows:** Support for transparent backgrounds

### Color Scheme
- **Primary:** #1f2937 (Dark Gray)
- **Background:** #ffffff (White)
- **Accent:** #00b98d (Wise Green)

### File Formats
- **PNG:** All icons (24-bit with alpha channel)
- **SVG:** Scalable favicon only
- **ICO:** Legacy favicon support

## 🔄 Updating Icons

1. **Replace source files** in respective platform folders
2. **Update paths** in `vite.config.ts` if needed
3. **Test on target platforms** before deploying
4. **Clear browser cache** to see changes

## 📱 Platform Testing

- **Android:** Chrome Dev Tools → Application → Manifest
- **iOS:** Safari Web Inspector → Add to Home Screen
- **Windows:** Edge → Install app
- **Desktop:** All modern browsers support PWA installation

---

**Note:** These are currently placeholder icons based on the original PartnerX logo. Replace with professionally designed PartnerWise icons for production use.