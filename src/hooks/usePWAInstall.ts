import { useEffect, useState, useCallback, useRef } from 'react';
import { CURRENT_APP_VERSION, AppVersionInfo } from '../utils/appVersion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface UsePWAReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isInIframe: boolean;
  hasNativePrompt: boolean;
  appUrl: string;
  sharedUrl: string;
  playStorePackageName: string;
  playStoreUrl: string;
  pwaBuilderUrl: string;
  install: () => Promise<boolean>;
  directOpen: () => void;
  sendApkEmail: (email?: string) => void;
  sendApkWhatsApp: (phone?: string) => void;
  openPlayStoreBuilder: () => void;
  // OTA Online Update Features
  hasUpdate: boolean;
  isCheckingUpdate: boolean;
  offlineReady: boolean;
  lastCheckedTime: string | null;
  updateStatus: string;
  autoUpdateEnabled: boolean;
  toggleAutoUpdate: () => void;
  checkForUpdates: () => Promise<boolean>;
  applyUpdate: () => void;
  versionInfo: AppVersionInfo;
}

export function usePWAInstall(): UsePWAReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  const sharedUrl = 'https://ais-pre-xxm73hnyy5dz76kd43hp3w-134275216334.asia-east1.run.app';
  const appUrl =
    typeof window !== 'undefined' && window.location.origin.includes('http')
      ? window.location.origin
      : sharedUrl;

  const playStorePackageName = 'com.biopharlifesciences.app';
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${playStorePackageName}`;
  const pwaBuilderUrl = `https://www.pwabuilder.com?site=${encodeURIComponent(appUrl)}`;

  // OTA Update States
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('System up to date');
  const [lastCheckedTime, setLastCheckedTime] = useState<string | null>(() => {
    return localStorage.getItem('biophar_last_ota_check') || 'Just now';
  });
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('biophar_auto_ota_update');
    return saved !== null ? saved === 'true' : true;
  });

  const swRegistrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // Detect standalone mode (already installed as APK / PWA)
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');
    setIsInstalled(isStandalone);

    // Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Register and Monitor ServiceWorker for Online OTA Updates
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    let isMounted = true;

    // Helper to listen to state changes on new service workers
    const monitorWorker = (worker: ServiceWorker) => {
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New update is available & waiting to be applied!
            if (isMounted) {
              setHasUpdate(true);
              setUpdateStatus(`New update v${CURRENT_APP_VERSION.version} ready to install!`);
            }
          } else {
            // First install offline cache ready
            if (isMounted) {
              setOfflineReady(true);
              setUpdateStatus('App cached for offline use');
            }
          }
        }
      });
    };

    // Check existing registration
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg || !isMounted) return;
      swRegistrationRef.current = reg;

      if (reg.waiting) {
        setHasUpdate(true);
        setUpdateStatus('New update downloaded and waiting to install');
      }

      if (reg.installing) {
        monitorWorker(reg.installing);
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          monitorWorker(newWorker);
        }
      });
    });

    // Auto reload when the controller changes after skipWaiting
    let refreshing = false;
    const handleControllerChange = () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    // Periodic check for OTA updates (every 20 minutes when active and online)
    const periodicInterval = setInterval(() => {
      if (navigator.onLine && swRegistrationRef.current) {
        swRegistrationRef.current.update().catch(() => {});
      }
    }, 20 * 60 * 1000);

    // Also check when device reconnects to internet
    const handleOnline = () => {
      if (swRegistrationRef.current) {
        swRegistrationRef.current.update().catch(() => {});
      }
    };
    window.addEventListener('online', handleOnline);

    return () => {
      isMounted = false;
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      window.removeEventListener('online', handleOnline);
      clearInterval(periodicInterval);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          return true;
        }
      } catch (err) {
        console.error('PWA install error:', err);
      }
    } else if (isInIframe) {
      // Inside iframe preview, Chrome restricts prompt. Opening in standalone tab directly enables install prompt!
      window.open(appUrl, '_blank');
      return true;
    }
    return false;
  };

  // Direct Open: Opens the application in a clean standalone app window or tab
  const directOpen = useCallback(() => {
    const targetUrl = appUrl;
    try {
      const features = 'width=1280,height=840,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes';
      const win = window.open(targetUrl, '_blank', features);
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.open(targetUrl, '_blank');
      }
    } catch {
      window.open(targetUrl, '_blank');
    }
  }, [appUrl]);

  // Send APK install instructions to user's email (default shivambaranwal121@gmail.com)
  const sendApkEmail = useCallback(
    (targetEmail = 'shivambaranwal121@gmail.com') => {
      const subject = encodeURIComponent('Biophar Lifesciences - Direct Android APK Install & Access Link');
      const body = encodeURIComponent(
`Hello Shivam,

Here is your direct installation link and details for the Biophar Lifesciences Mobile App & Android APK:

📱 DIRECT 1-CLICK ANDROID APK INSTALL LINK:
${appUrl}

⚡ HOW TO INSTALL ON YOUR ANDROID PHONE (30 SECONDS):
1. Open the link above in Google Chrome on your Android phone.
2. Tap the 3 dots (⋮) in the top-right corner.
3. Tap "Install app" or "Add to Home screen".
4. Chrome will compile the WebAPK and add the Biophar icon directly into your Android App Drawer!

🚀 DIRECT CLOUD APK BUILDER (.APK / .AAB):
https://www.pwabuilder.com?site=${encodeURIComponent(appUrl)}

✨ KEY HIGHLIGHTS:
• 100% Offline Doctor Visual Aid Presenter (no internet required during detailing)
• Automatic Over-The-Air (OTA) Online Updates
• Chemist Order & Indent Generation via WhatsApp
• 5-Stage Order Management Pipeline

Best regards,
Biophar Lifesciences Team`
      );
      window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    },
    [appUrl]
  );

  // Send APK install instructions via WhatsApp
  const sendApkWhatsApp = useCallback(
    (customPhone?: string) => {
      const text = encodeURIComponent(
`*Biophar Lifesciences - Direct Android APK Installation* 📲💊

Install the official Biophar Doctor Visual Aid App on your Android Phone:

🔗 *Direct Install Link:*
${appUrl}

👉 *Steps to Install on Android:*
1. Link open karein Chrome browser me.
2. Top-right me 3 dots (⋮) tap karein.
3. "Install app" par click karein.
4. App direct aapke phone ke app drawer me install ho jayegi!

✅ 100% Offline Doctor Detailing
✅ Over-The-Air Online Updates`
      );
      const waUrl = customPhone
        ? `https://api.whatsapp.com/send?phone=${customPhone.replace(/[^0-9]/g, '')}&text=${text}`
        : `https://api.whatsapp.com/send?text=${text}`;
      window.open(waUrl, '_blank');
    },
    [appUrl]
  );

  // Toggle Auto OTA Updates
  const toggleAutoUpdate = useCallback(() => {
    setAutoUpdateEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('biophar_auto_ota_update', String(next));
      return next;
    });
  }, []);

  // Check for updates manually
  const checkForUpdates = useCallback(async (): Promise<boolean> => {
    setIsCheckingUpdate(true);
    setUpdateStatus('Checking server for updates...');

    const timestamp = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          swRegistrationRef.current = registration;
          // Trigger service worker check
          await registration.update();

          if (registration.waiting) {
            setHasUpdate(true);
            setUpdateStatus('New update downloaded and ready!');
            localStorage.setItem('biophar_last_ota_check', `${timestamp} (Update found)`);
            setLastCheckedTime(`${timestamp} (Update found)`);
            setIsCheckingUpdate(false);
            return true;
          }
        }
      }

      // Simulate network manifest/header verification
      await new Promise((res) => setTimeout(res, 800));

      setUpdateStatus(`You are on the latest version (v${CURRENT_APP_VERSION.version})`);
      localStorage.setItem('biophar_last_ota_check', `${timestamp} (Up to date)`);
      setLastCheckedTime(`${timestamp} (Up to date)`);
      setIsCheckingUpdate(false);
      return false;
    } catch {
      setUpdateStatus('Could not reach update server. Checking in offline mode.');
      setIsCheckingUpdate(false);
      return false;
    }
  }, []);

  // Apply the update immediately
  const applyUpdate = useCallback(() => {
    if (swRegistrationRef.current?.waiting) {
      swRegistrationRef.current.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  }, []);

  const openPlayStoreBuilder = useCallback(() => {
    window.open(pwaBuilderUrl, '_blank');
  }, [pwaBuilderUrl]);

  return {
    isInstallable: !!deferredPrompt || isInIframe,
    hasNativePrompt: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    isInIframe,
    appUrl,
    sharedUrl,
    playStorePackageName,
    playStoreUrl,
    pwaBuilderUrl,
    install,
    directOpen,
    sendApkEmail,
    sendApkWhatsApp,
    openPlayStoreBuilder,
    hasUpdate,
    isCheckingUpdate,
    offlineReady,
    lastCheckedTime,
    updateStatus,
    autoUpdateEnabled,
    toggleAutoUpdate,
    checkForUpdates,
    applyUpdate,
    versionInfo: CURRENT_APP_VERSION,
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
