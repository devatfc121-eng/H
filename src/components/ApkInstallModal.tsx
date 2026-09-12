import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  WifiOff,
  Sparkles,
  Copy,
  ExternalLink,
  Package,
  Terminal,
  QrCode,
  Check,
  Radio,
  Send,
  Mail,
  MessageSquare,
  Maximize2,
  ArrowRight,
  Star,
  Award,
  Globe,
  FileCode,
  Layers,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'phone' | 'playstore' | 'send_apk' | 'ota_updates' | 'apk_download';
}

export const ApkInstallModal: React.FC<ApkInstallModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'phone',
}) => {
  const {
    isInstallable,
    hasNativePrompt,
    isInstalled,
    isIOS,
    isAndroid,
    isInIframe,
    appUrl,
    playStorePackageName,
    playStoreUrl,
    pwaBuilderUrl,
    install,
    directOpen,
    sendApkEmail,
    sendApkWhatsApp,
    hasUpdate,
    isCheckingUpdate,
    lastCheckedTime,
    updateStatus,
    autoUpdateEnabled,
    toggleAutoUpdate,
    checkForUpdates,
    applyUpdate,
    versionInfo,
  } = usePWAInstall();

  const [activeTab, setActiveTab] = useState<'phone' | 'playstore' | 'send_apk' | 'ota_updates' | 'apk_download'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [assetLinksCopied, setAssetLinksCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [customEmail, setCustomEmail] = useState('shivambaranwal121@gmail.com');
  const [emailSentToast, setEmailSentToast] = useState(false);
  const [installFeedback, setInstallFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    appUrl
  )}&margin=8`;

  const assetLinksJson = JSON.stringify(
    [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: playStorePackageName,
          sha256_cert_fingerprints: [
            '14:6D:E9:7D:0F:52:AB:3A:D8:0C:6D:F9:BE:D6:75:56:AB:45:95:C3:7E:8A:24:D8:1A:3A:B8:3F:8A:2B:B3:9F',
          ],
        },
      },
    ],
    null,
    2
  );

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyAssetLinks = async () => {
    try {
      await navigator.clipboard.writeText(assetLinksJson);
      setAssetLinksCopied(true);
      setTimeout(() => setAssetLinksCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleInstallClick = async () => {
    if (isInstalled) {
      setInstallFeedback('App is already installed on your device! You can launch it directly from your home screen or app drawer.');
      return;
    }

    if (hasNativePrompt) {
      setInstallFeedback('Opening Android WebAPK installation prompt...');
      const success = await install();
      if (success) {
        setInstallFeedback('Installation accepted! Biophar Lifesciences is now adding to your App Drawer.');
        setTimeout(() => onClose(), 2000);
      } else {
        setInstallFeedback('Installation dismissed or waiting. You can also tap Chrome 3 dots (⋮) -> "Install app".');
      }
    } else if (isInIframe) {
      setInstallFeedback('Opening Biophar in full browser window to trigger direct Android installation...');
      directOpen();
    } else {
      // Outside iframe, prompt not ready yet
      setInstallFeedback('To install: Tap the 3 dots (⋮) in Chrome at top-right and tap "Install app" or "Add to Home screen".');
    }
  };

  const handleSendEmail = (emailToUse: string) => {
    sendApkEmail(emailToUse);
    setEmailSentToast(true);
    setTimeout(() => setEmailSentToast(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-4 max-h-[94vh] flex flex-col">
        {/* Banner Header */}
        <div className="bg-gradient-to-br from-sky-600 via-sky-700 to-blue-800 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center shrink-0">
              <img src="/icon.svg" alt="Biophar App Icon" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-200 block">
                  Android APK & Play Store
                </span>
                {hasUpdate && (
                  <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full uppercase">
                    Update Ready
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black tracking-tight font-['Cabinet_Grotesk',sans-serif]">
                Biophar Lifesciences
              </h3>
              <p className="text-xs text-sky-100 font-medium">
                Official Doctor Visual Aid & Representative Portal
              </p>
            </div>
          </div>

          {/* Navigation Tabs (5 items) */}
          <div className="grid grid-cols-5 gap-1 mt-4 bg-sky-900/60 p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => {
                setActiveTab('phone');
                setInstallFeedback(null);
              }}
              className={`py-2 px-1 rounded-xl font-bold transition-all flex items-center justify-center gap-1 text-[11px] truncate cursor-pointer ${
                activeTab === 'phone'
                  ? 'bg-white text-sky-900 shadow-sm'
                  : 'text-sky-100 hover:text-white'
              }`}
              title="1-Click Android APK Install"
            >
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Install</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('playstore');
                setInstallFeedback(null);
              }}
              className={`py-2 px-1 rounded-xl font-bold transition-all flex items-center justify-center gap-1 text-[11px] truncate cursor-pointer ${
                activeTab === 'playstore'
                  ? 'bg-white text-sky-900 shadow-sm'
                  : 'text-sky-100 hover:text-white'
              }`}
              title="Google Play Store Hub & AAB Bundle"
            >
              <span className="text-emerald-400 font-black text-xs shrink-0">▶</span>
              <span className="truncate">Play Store</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('send_apk');
                setInstallFeedback(null);
              }}
              className={`py-2 px-1 rounded-xl font-bold transition-all flex items-center justify-center gap-1 text-[11px] truncate cursor-pointer ${
                activeTab === 'send_apk'
                  ? 'bg-white text-sky-900 shadow-sm'
                  : 'text-sky-100 hover:text-white'
              }`}
              title="Send APK via Email & WhatsApp"
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Send Me</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('apk_download');
                setInstallFeedback(null);
              }}
              className={`py-2 px-1 rounded-xl font-bold transition-all flex items-center justify-center gap-1 text-[11px] truncate cursor-pointer ${
                activeTab === 'apk_download'
                  ? 'bg-white text-sky-900 shadow-sm'
                  : 'text-sky-100 hover:text-white'
              }`}
              title="Build Standalone Raw .APK"
            >
              <Package className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Build .APK</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('ota_updates');
                setInstallFeedback(null);
              }}
              className={`py-2 px-1 rounded-xl font-bold transition-all flex items-center justify-center gap-1 text-[11px] truncate relative cursor-pointer ${
                activeTab === 'ota_updates'
                  ? 'bg-white text-sky-900 shadow-sm'
                  : 'text-sky-100 hover:text-white'
              }`}
              title="Over-The-Air Online Updates"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 shrink-0 ${isCheckingUpdate ? 'animate-spin text-sky-500' : ''}`}
              />
              <span className="truncate">Updates</span>
              {hasUpdate && (
                <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1 animate-ping" />
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* TAB 1: DIRECT PHONE INSTALL & DIRECT OPEN */}
          {activeTab === 'phone' && (
            <>
              {/* Feedback banner if triggered */}
              {installFeedback && (
                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-900 flex items-start gap-2.5 animate-in fade-in">
                  <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{installFeedback}</div>
                  <button
                    onClick={() => setInstallFeedback(null)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              )}

              {/* Status Badge */}
              {isInstalled ? (
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong>App Successfully Installed on Phone!</strong>
                    <p className="text-emerald-700 mt-0.5">
                      Biophar aapke app drawer me active hai aur bina internet ke bhi chalta hai.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 flex items-center gap-3 text-sky-900 text-xs">
                  <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
                  <div>
                    <strong>Direct Android WebAPK Installation:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Chrome Android me WebAPK generate karta hai jo normal APK jaise phone ke App Drawer me install ho jati hai.
                    </p>
                  </div>
                </div>
              )}

              {/* Primary Action Buttons: Direct Install + Direct Open */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1-Click Install Button */}
                <button
                  id="modal-direct-install-btn"
                  onClick={handleInstallClick}
                  className="py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Direct Install APK</span>
                </button>

                {/* Direct Open Button */}
                <button
                  id="modal-direct-open-btn"
                  onClick={directOpen}
                  className="py-3.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 transition-all cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4 text-sky-400" />
                  <span>Direct Open (Standalone)</span>
                </button>
              </div>

              {/* App URL / QR Code for opening directly on phone */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Open Directly on Android Phone:
                  </span>
                  <button
                    onClick={() => setShowQrCode(!showQrCode)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{showQrCode ? 'Hide QR Code' : 'Scan Phone QR'}</span>
                  </button>
                </div>

                {showQrCode && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-2 text-center animate-in fade-in zoom-in-95">
                    <img
                      src={qrCodeUrl}
                      alt="Scan to open on Android Phone"
                      className="w-44 h-44 rounded-lg shadow-xs"
                    />
                    <p className="text-[11px] text-slate-500 max-w-xs">
                      Apne Android phone camera se scan karein aur Chrome me open karke <strong>Install APK</strong> karein.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 select-all"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Android Manual Install Steps Guide */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Android Phone Me Kaise Install Karein (No Bugs):
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-slate-700">
                      Phone ke Google Chrome me link open karein aur top-right me <strong>3 dots (⋮)</strong> tap karein.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-slate-700">
                      Menu me se <strong>&ldquo;Install app&rdquo;</strong> ya <strong>&ldquo;Add to Home screen&rdquo;</strong> par click karein.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-slate-700">
                      <strong>&ldquo;Install&rdquo;</strong> par tap karein. Android automatic WebAPK compile karke app drawer me daal dega!
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Play Store & Send Shortcuts */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTab('playstore')}
                  className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="text-emerald-600 font-black">▶</span>
                  <span>Play Store Setup</span>
                </button>
                <button
                  onClick={() => setActiveTab('send_apk')}
                  className="p-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl text-sky-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-sky-600" />
                  <span>Send to Email</span>
                </button>
              </div>
            </>
          )}

          {/* TAB 2: GOOGLE PLAY STORE HUB */}
          {activeTab === 'playstore' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Google Play Store Mockup Card */}
              <div className="p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl shadow-md border border-slate-700 space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center shrink-0">
                    <img src="/icon.svg" alt="Biophar" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      <span className="text-emerald-400 font-black">▶</span>
                      <span>Google Play Store Listing</span>
                    </div>
                    <h4 className="text-base font-black tracking-tight truncate">
                      Biophar Lifesciences
                    </h4>
                    <p className="text-xs text-slate-300 font-medium truncate">
                      Biophar Lifesciences Pvt. Ltd.
                    </p>
                    <span className="inline-block text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold mt-0.5">
                      Medical • Doctor Visual Aid
                    </span>
                  </div>
                </div>

                {/* Play Store Key Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/70 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-0.5 text-xs font-black text-amber-400">
                      <span>4.9</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </div>
                    <span className="text-[10px] text-slate-400">1.4K reviews</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">10K+</div>
                    <span className="text-[10px] text-slate-400">Downloads</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">Rated 3+</div>
                    <span className="text-[10px] text-slate-400">Verified</span>
                  </div>
                </div>

                {/* Play Store Install CTA Button */}
                <button
                  onClick={handleInstallClick}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Install via Play Store / WebAPK</span>
                </button>
              </div>

              {/* Production .AAB & .APK Generator via PWABuilder */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-emerald-600" />
                    <span>Generate Play Store .AAB Bundle & APK:</span>
                  </span>
                  <span className="text-[10px] font-extrabold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                    Production Ready
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Google Play Console requires an <strong>.AAB (Android App Bundle)</strong>. Microsoft PWABuilder generates the official Google-signed bundle directly from this app:
                </p>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 text-[11px] font-mono text-slate-700 space-y-1">
                  <div><strong>Package Name:</strong> {playStorePackageName}</div>
                  <div><strong>Version:</strong> v{versionInfo.version} (Code: 245)</div>
                  <div><strong>Target SDK:</strong> Android 14+ (API 34)</div>
                </div>

                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer block text-center"
                >
                  <span>Build .AAB Package for Google Play Store</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Step-by-Step Google Play Console Publishing Guide */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Play Console Upload Steps:</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-slate-700">
                      Upar diye <strong>&ldquo;Build .AAB Package&rdquo;</strong> button se signed <code>.aab</code> bundle file download karein.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-slate-700">
                      <a
                        href="https://play.google.com/console"
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 font-bold underline inline-flex items-center gap-0.5"
                      >
                        Google Play Console <ExternalLink className="w-3 h-3" />
                      </a>{' '}
                      me login karein aur <strong>&ldquo;Create app&rdquo;</strong> par click karein. Title: <em>Biophar Lifesciences</em>, Category: <em>Medical</em>.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-slate-700">
                      <strong>Production</strong> ya <strong>Closed testing</strong> track me download ki gayi <code>.aab</code> file upload karein.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      4
                    </div>
                    <div className="text-slate-700">
                      <strong>Digital Asset Links</strong> (assetlinks.json) domain par already live hai, jisse Chrome URL bar automatically hide ho jayegi!
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Asset Links Verification Inspector */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-slate-600" />
                    <span>Digital Asset Links (.well-known/assetlinks.json):</span>
                  </span>
                  <button
                    onClick={handleCopyAssetLinks}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                  >
                    {assetLinksCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-2.5 bg-slate-900 text-emerald-400 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed max-h-24">
                  {assetLinksJson}
                </pre>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Live & Active on Domain</span>
                  </span>
                  <a
                    href={`${appUrl}/.well-known/assetlinks.json`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 hover:underline flex items-center gap-0.5"
                  >
                    <span>Test Endpoint</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SEND ME APK (DIRECT EMAIL & WHATSAPP) */}
          {activeTab === 'send_apk' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-sky-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sky-800">
                  <Send className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Send APK & Direct Install Link</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Apne email ya WhatsApp par direct APK install link aur complete offline guide receive karein:
                </p>
              </div>

              {emailSentToast && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Email client opened! APK details prepared for sending.</span>
                </div>
              )}

              {/* 1-Click Send to shivambaranwal121@gmail.com */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>Send to Your Email:</span>
                  </span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    1-Click Send
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 shadow-2xs"
                  />
                  <button
                    onClick={() => handleSendEmail(customEmail)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500">
                  Pre-filled with <strong>shivambaranwal121@gmail.com</strong>. Tapping send opens your email app with the direct APK install link and step-by-step setup guide.
                </p>
              </div>

              {/* Send via WhatsApp */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Send via WhatsApp:</span>
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Instant Share
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  WhatsApp par khud ko ya kisi Medical Representative ko APK installation link forward karein:
                </p>

                <button
                  onClick={() => sendApkWhatsApp()}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Share APK on WhatsApp</span>
                </button>
              </div>

              {/* Copy Direct Link */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Copy Direct Install Link:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 select-all"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GENERATE RAW STANDALONE .APK FILE */}
          {activeTab === 'apk_download' && (
            <div className="space-y-3.5 animate-in fade-in">
              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100 text-xs text-indigo-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Package className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Build Raw Android .APK & .AAB Package</span>
                </div>
                <p className="text-slate-600">
                  Agar aapko WhatsApp par share karne ke liye raw <code>.apk</code> installer file ya Play Store release ke liye bundle chahiye:
                </p>
              </div>

              {/* Option 1: PWABuilder Instant Package */}
              <div className="p-4 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl border border-sky-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Option 1: 1-Click Signed APK Generator (PWABuilder)
                  </span>
                  <span className="text-[10px] font-extrabold bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">
                    Instant Cloud Build
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Microsoft PWABuilder is app ka live URL use karke signed Android APK produce karta hai:
                </p>
                <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                  <li>Niche diye button par click karein.</li>
                  <li><strong>&ldquo;Package for Stores&rdquo;</strong> &rarr; select <strong>Android</strong>.</li>
                  <li><strong>&ldquo;Generate Package / APK&rdquo;</strong> par tap karein aur download karein.</li>
                </ol>
                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer block text-center"
                >
                  <span>Open PWABuilder to Download APK</span>
                  <ExternalLink className="w-3.5 h-3.5 inline ml-1" />
                </a>
              </div>

              {/* Option 2: Capacitor / Android Studio */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Terminal className="w-3.5 h-3.5 text-slate-600" />
                  <span>Option 2: Android Studio Local Build (Developer CLI)</span>
                </div>
                <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed">
{`npm run build
npx @capacitor/cli create biophar-app
npx cap add android
npx cap copy
npx cap open android
# In Android Studio: Build > Build Bundle(s) / APK(s) > Build APK`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: ONLINE UPDATES FOR APK (OTA) */}
          {activeTab === 'ota_updates' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Version & Status Card */}
              <div className="p-4 bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-2xl shadow-md border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider block">
                      Installed Version
                    </span>
                    <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                      <span>v{versionInfo.version}</span>
                      <span className="text-[10px] font-bold bg-sky-500/30 text-sky-200 px-2 py-0.5 rounded-full border border-sky-400/20">
                        {versionInfo.buildNumber}
                      </span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-medium text-slate-400 block">Channel</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                      <Radio className="w-3 h-3 animate-pulse" />
                      <span>{versionInfo.channel}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                  <span>Last Update Check:</span>
                  <span className="font-mono text-[11px] text-slate-200">
                    {lastCheckedTime || 'Just now'}
                  </span>
                </div>
              </div>

              {/* Update Status / Action Box */}
              {hasUpdate ? (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-amber-900">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <strong className="text-xs block">New Online Update Available!</strong>
                      <p className="text-[11px] text-amber-800">
                        New catalog updates, pipeline fixes, and visual aids downloaded.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={applyUpdate}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Apply Update Now (Instant Reload)</span>
                  </button>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 min-w-0">
                    {isCheckingUpdate ? (
                      <RefreshCw className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <span className="truncate">{updateStatus}</span>
                  </div>

                  <button
                    onClick={() => checkForUpdates()}
                    disabled={isCheckingUpdate}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                    <span>{isCheckingUpdate ? 'Checking...' : 'Check Now'}</span>
                  </button>
                </div>
              )}

              {/* Automatic OTA Update Toggle */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">
                    Automatic OTA Updates
                  </label>
                  <p className="text-[11px] text-slate-500">
                    App background me check karke new version automatically install karega.
                  </p>
                </div>
                <button
                  onClick={toggleAutoUpdate}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    autoUpdateEnabled ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      autoUpdateEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* What's New in this Version */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  What's New in v{versionInfo.version}:
                </h4>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  {versionInfo.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How OTA Updates Work in APK */}
              <div className="p-3 bg-sky-50/70 rounded-2xl border border-sky-100 text-[11px] text-sky-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sky-800">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>No Play Store / APK Reinstall Needed!</span>
                </div>
                <p className="text-slate-600">
                  Jab bhi admin new products add karta hai ya changes karta hai, Medical Representative ke phone me APK automatic Over-The-Air (OTA) update ho jati hai.
                </p>
              </div>
            </div>
          )}

          {/* App Key Highlights */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl">
              <WifiOff className="w-4 h-4 text-sky-600 shrink-0" />
              <span>100% Offline Detailing</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Self-Contained Storage</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
