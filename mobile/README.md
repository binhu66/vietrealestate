# VietRealty Mobile App

Capacitor wrapper for [https://vietrealty.vn](https://vietrealty.vn)

## Setup

```bash
# Install dependencies
npm install

# Add platforms (run once)
npx cap add ios
npx cap add android

# Sync after any web changes
npx cap sync

# Open in Xcode / Android Studio
npm run open:ios
npm run open:android
```

## iOS Publishing
1. Open in Xcode: `npm run open:ios`
2. Set Team & Bundle ID in Signing & Capabilities
3. Archive → Upload to App Store Connect
4. Fill App Store listing at appstoreconnect.apple.com

## Android Publishing
1. Open in Android Studio: `npm run open:android`
2. Build → Generate Signed Bundle (AAB)
3. Upload to Google Play Console
4. Fill store listing at play.google.com/console

## App Domains (for iOS)
- `vietrealty.vn` must be listed in `Associated Domains` entitlement
- Requires apple-app-site-association file at https://vietrealty.vn/.well-known/apple-app-site-association
