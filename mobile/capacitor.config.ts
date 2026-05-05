import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "vn.vietrealty.app",
  appName: "VietRealty",
  webDir: "www",
  server: {
    // Load from production site — no need to bundle a static build
    url: "https://vietrealty.vn",
    cleartext: false,
    // Allow cookies/auth to persist
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "Default",
      backgroundColor: "#ffffff",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Geolocation: {
      // iOS only — required description for Info.plist
    },
  },
  ios: {
    scheme: "VietRealty",
    contentInset: "automatic",
    preferredContentMode: "mobile",
    // limitsNavigationsToAppBoundDomains must be true to pass App Store review
    limitsNavigationsToAppBoundDomains: true,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
