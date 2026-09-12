import React from 'react';
import {
  ShoppingCart,
  User,
  ShieldCheck,
  Stethoscope,
  Plus,
  Coins,
  FileSpreadsheet,
  Download,
  Printer,
  WifiOff,
  FileText,
  Globe,
  PackageCheck,
  Maximize2,
} from 'lucide-react';

interface HeaderProps {
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onOpenAddModal: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders?: () => void;
  onOpenServices: (serviceKey?: string) => void;
  onOpenApkModal?: () => void;
  onOpenRateListModal?: () => void;
  onOpenPdfImageModal?: () => void;
  onOpenGooglePortal?: () => void;
  productCount: number;
  isOnline?: boolean;
  hasUpdate?: boolean;
  onDirectOpen?: () => void;
  onOpenPlayStore?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAdminMode,
  onToggleAdminMode,
  onOpenAddModal,
  cartCount,
  onOpenCart,
  onOpenOrders,
  onOpenServices,
  onOpenApkModal,
  onOpenRateListModal,
  onOpenPdfImageModal,
  onOpenGooglePortal,
  productCount,
  isOnline = true,
  hasUpdate = false,
  onDirectOpen,
  onOpenPlayStore,
}) => {
  return (
    <header className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white pt-4 pb-4 px-4 sm:px-6 shadow-md transition-all">
      {/* Top Status and Actions */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          {/* User Greeting matching screenshot */}
          <div>
            <span className="text-sky-100 text-xs sm:text-sm font-medium tracking-wide block">
              Welcome Back,
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase font-['Cabinet_Grotesk',sans-serif]">
                SHIVAM
              </h1>
              <span className="text-[10px] bg-white/20 text-white font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs border border-white/20">
                {isAdminMode ? 'Admin Manager' : 'Doctor Showcase'}
              </span>
              {!isOnline && (
                <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <WifiOff className="w-3 h-3" />
                  <span>Offline Ready</span>
                </span>
              )}
            </div>
          </div>

          {/* Right Action Chips matching screenshot */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* APK Install / Update Button */}
            {onOpenApkModal && (
              <button
                id="header-install-apk-btn"
                onClick={onOpenApkModal}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full font-extrabold text-xs shadow-md border transition-transform active:scale-95 ${
                  hasUpdate
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-300 ring-2 ring-amber-400/40'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400'
                }`}
                title={hasUpdate ? 'New APK Update Ready to Install!' : 'Install Mobile App / APK on Phone'}
              >
                {hasUpdate ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
                    </span>
                    <span className="whitespace-nowrap">Update APK</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span className="whitespace-nowrap">Install APK</span>
                  </>
                )}
              </button>
            )}

            {/* Google Play Store Hub */}
            {onOpenPlayStore && (
              <button
                id="header-play-store-btn"
                onClick={onOpenPlayStore}
                title="Google Play Store Hub & AAB Package"
                className="flex items-center gap-1.5 bg-emerald-600/90 hover:bg-emerald-600 active:scale-95 text-white px-2.5 sm:px-3 py-1.5 rounded-full font-bold text-xs border border-emerald-400/40 shadow-xs transition-transform cursor-pointer"
              >
                <span className="text-emerald-200 font-black text-xs">▶</span>
                <span className="whitespace-nowrap">Play Store</span>
              </button>
            )}

            {/* Direct Open Button */}
            {onDirectOpen && (
              <button
                id="header-direct-open-btn"
                onClick={onDirectOpen}
                title="Direct Open Standalone App"
                className="hidden sm:flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 text-white px-2.5 py-1.5 rounded-full font-bold text-xs border border-white/30 transition-transform"
              >
                <Maximize2 className="w-3.5 h-3.5 text-sky-200" />
                <span>Direct Open</span>
              </button>
            )}

            {/* Google Portal & Sheets Sync */}
            {onOpenGooglePortal && (
              <button
                id="header-google-portal-btn"
                onClick={onOpenGooglePortal}
                title="Google Portal, Sheets Sync & Drive Backup"
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 text-white px-2.5 sm:px-3 py-1.5 rounded-full font-bold text-xs border border-white/30 transition-transform"
              >
                <Globe className="w-3.5 h-3.5 text-sky-200" />
                <span className="hidden sm:inline">Google Portal</span>
              </button>
            )}

            {/* Rate List Print */}
            {onOpenRateListModal && (
              <button
                id="header-rate-list-btn"
                onClick={onOpenRateListModal}
                title="Print Doctor Rate List / Save PDF"
                className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-transform active:scale-95 border border-white/30"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}

            {/* PDF Brochure & Image Upload Hub */}
            {onOpenPdfImageModal && (
              <button
                id="header-pdf-image-btn"
                onClick={onOpenPdfImageModal}
                title="Upload PDF Brochure or Medicine Images"
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 text-white px-2.5 sm:px-3 py-1.5 rounded-full font-bold text-xs border border-white/30 transition-transform"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PDF / Image</span>
              </button>
            )}

            {/* 180 pts Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-100/95 text-amber-900 px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-xs border border-amber-300">
              <Coins className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>180 pts</span>
            </div>

            {/* Orders Pipeline Quick Access */}
            {onOpenOrders && (
              <button
                id="header-orders-btn"
                onClick={onOpenOrders}
                title="Orders Pipeline (Pending, Process, Dispatch, Delivered)"
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2.5 sm:px-3 py-1.5 rounded-full font-bold text-xs border border-white/30 transition-transform active:scale-95"
              >
                <PackageCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden sm:inline">Orders</span>
              </button>
            )}

            {/* Visiting Card / Docs Quick Icon */}
            <button
              id="header-visiting-card-btn"
              onClick={() => onOpenServices('Visiting Card')}
              title="MR Digital Card"
              className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-transform active:scale-95 border border-white/30"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>

            {/* Cart Icon */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              title="Cart / Doctor Sample Requests"
              className="relative w-8 h-8 sm:w-9 sm:h-9 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-transform active:scale-95 border border-white/30"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile / Admin Menu */}
            <button
              id="header-profile-btn"
              onClick={() => onOpenServices('MR')}
              title="Profile & MR Info"
              className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-transform active:scale-95 border border-white/30"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Bar: Doctor Mode Switcher & Add Product Button */}
        <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              id="mode-toggle-btn"
              onClick={onToggleAdminMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition-all shadow-xs ${
                isAdminMode
                  ? 'bg-amber-400 text-slate-900 hover:bg-amber-300'
                  : 'bg-white text-sky-800 hover:bg-sky-50'
              }`}
            >
              {isAdminMode ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
                  <span>Admin Mode (Add & Delete Enabled)</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-3.5 h-3.5 text-sky-700" />
                  <span>Doctor Presentation View</span>
                </>
              )}
            </button>

            <span className="text-sky-100/90 text-xs hidden sm:inline">
              {productCount} medicines available
            </span>
          </div>

          {/* Quick Add Product Button (Always accessible to Shivam) */}
          <button
            id="header-add-product-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold px-3.5 py-1.5 rounded-full shadow-md transition-all text-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Add New Product</span>
          </button>
        </div>
      </div>
    </header>
  );
};
