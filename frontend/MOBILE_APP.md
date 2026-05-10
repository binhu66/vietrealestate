# BinHorizon Mobile App (Capacitor)

Native iOS + Android shells that load the live web app at https://binhorizon.com.

## Architecture

- **Web layer**: existing Next.js app on Cloudflare Pages (no changes needed)
- **Native shell**: Capacitor wraps a WKWebView (iOS) / WebView (Android) pointing at the production URL via `capacitor.config.ts → server.url`
- **Deep links**: iOS Universal Links (`apple-app-site-association`) + Android App Links (`assetlinks.json`) route `https://binhorizon.com/*` URLs into the app
- **Bundle ID**: `com.binhorizon.app` (matches AASA `appID` and Android `package_name`)

## Project Layout

```
frontend/
├── capacitor.config.ts        # appId, server URL, splash, status bar
├── ios/                       # Xcode project — open with `npx cap open ios`
│   └── App/App/
│       ├── App.entitlements   # Associated Domains (binhorizon.com)
│       └── Assets.xcassets/   # icon + splash (auto-generated)
├── android/                   # Android Studio project — open with `npx cap open android`
│   └── app/src/main/
│       ├── AndroidManifest.xml  # App Links intent filter
│       └── res/                 # icons + splash (auto-generated)
└── resources/                 # source SVG/PNG for icon + splash
```

## Daily Workflow

```bash
# After web changes you want bundled (only matters once we move off remote URL)
npx cap sync

# Open native projects
npx cap open ios      # → Xcode
npx cap open android  # → Android Studio

# Regenerate icons + splash from resources/icon-only.png and resources/splash.png
npx capacitor-assets generate \
  --iconBackgroundColor '#DC2626' \
  --splashBackgroundColor '#DC2626'
```

## Universal / App Links

iOS — `public/.well-known/apple-app-site-association` (already deployed at https://binhorizon.com/.well-known/apple-app-site-association):
```json
{ "applinks": { "details": [{ "appID": "TEAMID.com.binhorizon.app", "paths": ["*"] }] } }
```
Replace `TEAMID` with your real Apple Developer Team ID once known.

Android — `public/.well-known/assetlinks.json`:
```json
[{ "relation": ["delegate_permission/common.handle_all_urls"],
   "target": { "namespace": "android_app", "package_name": "com.binhorizon.app",
               "sha256_cert_fingerprints": ["…"] } }]
```
Replace `REPLACE_WITH_RELEASE_KEYSTORE_SHA256_FINGERPRINT` after generating your release keystore:
```bash
keytool -list -v -keystore ~/release.keystore -alias binhorizon | grep SHA256
```

## App Store Risk

This app loads a remote URL inside a WebView. Apple **may** reject under guideline **4.2 (Minimum Functionality)** — "wrapper" apps. Mitigations:
1. Add at least one native capability the web can't do (push notifications, biometric login, native share sheet, etc.)
2. Or migrate to bundled static assets via `next build && next export` (server-rendered routes need refactor)

Recommended next step: add `@capacitor/push-notifications` for FCM/APNs delivered via Supabase. That alone usually clears 4.2.

## Build Locally

```bash
# iOS — needs Xcode 15+, valid signing identity
npx cap open ios
# Then in Xcode: Product → Build (⌘B), or run on simulator/device

# Android — needs Android Studio + Android SDK
npx cap open android
# Then: Build → Make Project, or Run on emulator/device
```

## TODO

- [ ] Replace `TEAMID` in AASA with real Apple Team ID
- [ ] Generate release keystore + replace SHA256 placeholder in `assetlinks.json`
- [ ] Add `@capacitor/push-notifications` (mitigates App Store 4.2 risk)
- [ ] Apple Developer Portal: register App ID `com.binhorizon.app` with Associated Domains capability
- [ ] Google Play Console: create app entry, upload first AAB
- [ ] Splash screen branding pass (current is plain VR red — designer review)
