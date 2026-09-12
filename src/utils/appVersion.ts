export interface AppVersionInfo {
  version: string;
  buildNumber: string;
  releaseDate: string;
  channel: string;
  features: string[];
}

export const CURRENT_APP_VERSION: AppVersionInfo = {
  version: '2.4.6',
  buildNumber: '2026.09.12-ota-admin',
  releaseDate: 'September 2026',
  channel: 'Google Play Store & Admin OTA Broadcast',
  features: [
    'Admin Side Online OTA Update Publisher & Realtime Broadcast to MR Devices',
    'Direct 1-Click APK Dispatch to devatfc121@gmail.com with Full Setup Guide',
    'Ultra-Smooth Online APK Execution with Stale-While-Revalidate Image & Font Caching',
    'Google Play Store TWA Release Kit & .AAB Bundle Generator (Android 14+)',
    '1-Click Android WebAPK Direct Installation & Standalone Offline Detailing',
    'Digital Asset Links Domain Verification (assetlinks.json)',
    'Chemist Indent Cart & Direct WhatsApp Order Generator',
    '5-Stage Order Lifecycle Pipeline with Doctor Interest Tracking',
  ],
};
