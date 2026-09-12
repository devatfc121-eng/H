import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Activity,
  Award,
  Sparkles,
  Pill,
  FileText,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Upload,
  Plus,
  Trash2,
} from 'lucide-react';
import { Product } from '../types';
import { ProductPackVisual } from './ProductPackVisual';

interface VisualAidModeProps {
  products: Product[];
  initialProductId?: string;
  isOpen: boolean;
  onClose: () => void;
  onRequestSample: (product: Product) => void;
  onOpenUploadModal?: (product: Product) => void;
  onUpdateProduct?: (updatedProduct: Product) => void;
}

export const VisualAidMode: React.FC<VisualAidModeProps> = ({
  products,
  initialProductId,
  isOpen,
  onClose,
  onRequestSample,
  onOpenUploadModal,
  onUpdateProduct,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!initialProductId) return 0;
    const idx = products.findIndex((p) => p.id === initialProductId);
    return idx >= 0 ? idx : 0;
  });

  const [viewMode, setViewMode] = useState<'detailing' | 'brochure'>('detailing');
  const [slidePage, setSlidePage] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const slideFileInputRef = React.useRef<HTMLInputElement | null>(null);

  if (!isOpen || !products || products.length === 0) return null;

  const currentProduct = products[currentIndex] || products[0];
  if (!currentProduct) return null;

  const visualAidPages = Array.from(
    new Set(
      [
        ...(currentProduct.pdfVisualAidPages || []),
        ...(currentProduct.images || []),
        currentProduct.image,
      ].filter(Boolean) as string[]
    )
  );

  const handleAddSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const currentPages = currentProduct.pdfVisualAidPages || [];
      const updatedProduct: Product = {
        ...currentProduct,
        image: currentProduct.image || base64,
        pdfVisualAidPages: [...currentPages, base64],
      };
      if (onUpdateProduct) {
        onUpdateProduct(updatedProduct);
      }
      setViewMode('brochure');
      setSlidePage(currentPages.length);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDeleteCurrentSlide = () => {
    const targetImage = visualAidPages[slidePage];
    if (!targetImage) return;

    if (!confirm(`Kya aap is Visual Aid slide ${slidePage + 1} ko delete karna chahte hain?`)) {
      return;
    }

    const newPdfPages = (currentProduct.pdfVisualAidPages || []).filter((img) => img !== targetImage);
    const newImages = (currentProduct.images || []).filter((img) => img !== targetImage);
    const newMainImage =
      currentProduct.image === targetImage
        ? newPdfPages[0] || newImages[0] || undefined
        : currentProduct.image;

    const updatedProduct: Product = {
      ...currentProduct,
      image: newMainImage,
      pdfVisualAidPages: newPdfPages,
      images: newImages,
    };

    if (onUpdateProduct) {
      onUpdateProduct(updatedProduct);
    }
    setSlidePage((prev) => Math.max(0, prev - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1));
    setSlidePage(0);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0));
    setSlidePage(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between overflow-hidden animate-in fade-in duration-200 select-none">
      {/* Top Bar for Medical Rep during Doctor Clinic Detailing */}
      <div className="bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-black text-sm">
            BP
          </div>
          <div>
            <span className="text-xs text-sky-400 font-extrabold uppercase tracking-widest block">
              BIOPHAR LIFESCIENCES • VISUAL AID DETAILER
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Product {currentIndex + 1} of {products.length} • {currentProduct.speciality}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Switcher if Visual Aid slides/images exist */}
          {visualAidPages.length > 0 && (
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('detailing')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  viewMode === 'detailing' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Detailing
              </button>
              <button
                type="button"
                onClick={() => setViewMode('brochure')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                  viewMode === 'brochure' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>PDF Slides ({visualAidPages.length})</span>
              </button>
            </div>
          )}

          {/* Quick upload modal trigger */}
          {onOpenUploadModal && (
            <button
              type="button"
              onClick={() => onOpenUploadModal(currentProduct)}
              className="bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 border border-slate-700 transition-colors"
              title="Attach PDF Brochure or Images"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add PDF/Photo</span>
            </button>
          )}

          <button
            onClick={() => onRequestSample(currentProduct)}
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold px-3.5 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Offer Dr. Sample</span>
          </button>

          <button
            id="close-visual-aid-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'brochure' && visualAidPages.length > 0 ? (
        /* PDF Brochure Slide Viewer */
        <div className="flex-1 flex flex-col items-center justify-between p-3 sm:p-6 overflow-hidden">
          {/* Hidden input for adding visual aid slides */}
          <input
            ref={slideFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAddSlide}
          />

          {/* Zoom & Slide Controls Bar */}
          <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <span className="text-sky-400 font-extrabold">{currentProduct.name}</span>
              <span className="text-slate-500">•</span>
              <span>Slide {slidePage + 1} of {visualAidPages.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => slideFileInputRef.current?.click()}
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                title="Add new visual aid image to this product"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Slide</span>
              </button>

              {visualAidPages.length > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteCurrentSlide}
                  className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Delete current slide"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete Slide</span>
                </button>
              )}

              <div className="h-4 w-px bg-slate-700 mx-1" />

              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-400 min-w-10 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-bold"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Active HD Slide Canvas */}
          <div className="flex-1 w-full max-w-5xl flex items-center justify-center overflow-auto p-2 bg-slate-900/50 rounded-3xl border border-slate-800/80 relative">
            <img
              src={visualAidPages[slidePage] || currentProduct.image}
              alt={`${currentProduct.name} Slide ${slidePage + 1}`}
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-150"
            />
          </div>

          {/* Bottom Slide Paging & Thumbnails */}
          <div className="w-full max-w-4xl flex items-center justify-between gap-4 mt-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
            <button
              type="button"
              disabled={slidePage === 0}
              onClick={() => setSlidePage((p) => Math.max(0, p - 1))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-white flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev Slide</span>
            </button>

            {/* Thumbnail selector */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {visualAidPages.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSlidePage(idx)}
                  className={`relative w-12 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-white ${
                    slidePage === idx ? 'border-sky-400 ring-2 ring-sky-300 scale-105' : 'border-slate-700 opacity-60'
                  }`}
                >
                  <img src={url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-white font-bold">
                    P{idx + 1}
                  </span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => slideFileInputRef.current?.click()}
                className="w-12 h-14 rounded-lg border-2 border-dashed border-slate-600 hover:border-sky-400 bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white flex flex-col items-center justify-center shrink-0 transition-colors"
                title="Add new visual aid image"
              >
                <Plus className="w-4 h-4" />
                <span className="text-[8px] font-bold mt-0.5">Add</span>
              </button>
            </div>

            <button
              type="button"
              disabled={slidePage === visualAidPages.length - 1}
              onClick={() => setSlidePage((p) => Math.min(visualAidPages.length - 1, p + 1))}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-white flex items-center gap-1"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Detailing View */
        <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Column: Big Brand, Composition & Core Clinical Proposition */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>WHO-GMP Quality Formulation</span>
                </div>
                {visualAidPages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setViewMode('brochure')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    <Layers className="w-3 h-3" />
                    <span>View PDF Slides ({visualAidPages.length})</span>
                  </button>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-['Cabinet_Grotesk',sans-serif]">
                {currentProduct.name}
              </h1>

              {/* Formulation Pill */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 sm:p-4 text-sky-200 text-sm sm:text-base font-semibold italic">
                {currentProduct.composition}
              </div>

              {/* Scientific Rationale / Therapeutic Indication */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {currentProduct.description}
              </p>

              {/* Key Clinical Indications */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Approved Clinical Indications:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentProduct.indications.map((ind, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-2 rounded-xl text-xs text-slate-200 font-medium"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dosage & Packaging */}
              <div className="flex items-center gap-4 pt-2 text-xs text-slate-300">
                <div className="bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Pack Size</span>
                  <span className="font-bold text-white text-sm">{currentProduct.packaging}</span>
                </div>
                <div className="bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Doctor MRP</span>
                  <span className="font-black text-amber-400 text-sm">₹{currentProduct.mrp}</span>
                </div>
                <div className="bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Dosage</span>
                  <span className="font-semibold text-white text-xs">{currentProduct.dosageGuide || 'As directed'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Pack Visual Display */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-slate-900 text-center relative overflow-hidden">
                <div className="text-[10px] font-extrabold text-sky-700 uppercase tracking-widest mb-2">
                  {currentProduct.brand} LIFESCIENCES
                </div>
                <ProductPackVisual
                  name={currentProduct.name}
                  form={currentProduct.form}
                  color={currentProduct.badgeColor}
                  composition={currentProduct.composition}
                  image={currentProduct.image}
                  size="lg"
                />
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>{currentProduct.form} Form</span>
                  <span>GST {currentProduct.gst}%</span>
                  <span className="text-sky-600 font-black">₹{currentProduct.mrp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Detailing Navigation Controls */}
      <div className="bg-slate-900/95 backdrop-blur-md px-4 sm:px-8 py-3 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Medicine</span>
        </button>

        {/* Medicine Dots Indicator */}
        <div className="flex items-center gap-1.5 max-w-xs overflow-x-auto py-1">
          {products.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx
                  ? 'w-6 bg-sky-400'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={p.name}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-xl text-xs font-bold text-white transition-colors shadow-md shadow-sky-600/20"
        >
          <span>Next Medicine</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
