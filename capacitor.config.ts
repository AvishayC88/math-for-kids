import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Development identifier; finalize before App Store registration.
  appId: 'com.avishaycohen.mathforkids',
  appName: 'Math for Kids',
  webDir: 'dist-ios',
  // CSS owns safe-area padding, including full-screen overlays.
  ios: { contentInset: 'never' },
};

export default config;
