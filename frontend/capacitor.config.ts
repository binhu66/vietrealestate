import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.binhorizon.app',
  appName: 'BinHorizon',
  webDir: 'public', // placeholder; we use server.url for live remote
  server: {
    // Loads the live web app inside the native shell.
    // Switch to a static-bundled build later if App Store rejects "wrapper" apps.
    url: 'https://binhorizon.com',
    cleartext: false,
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#DC2626', // brand red
    limitsNavigationsToAppBoundDomains: true,
  },
  android: {
    backgroundColor: '#DC2626',
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#DC2626',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#FFFFFF',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#DC2626',
    },
  },
};

export default config;
