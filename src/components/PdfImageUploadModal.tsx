import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Sparkles,
  Download,
  Plus,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { Product } from '../types';
import { convertPdfToImages, compressImageFile, PdfPageImage } from '../utils/pdfToImage';

interface PdfImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onCreateProductFromImage?: (image: string, pdfPages?: string[]) => void;
  initialProductId?: string;
}

export const PdfImageUploadModal: React.FC<PdfImageUploadModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProduct,
  onCreateProductFromImage,
  initialProductId,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || (products?.[0]?.id ?? '')
  );

  React.useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    }
  }, [initialProductId, isOpen]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [convertedPages, setConvertedPages] = useState<PdfPageImage[]>([]);
  const [pdfFileName, setPdfFileName] = useState('');
  const [selectedPageForCover, setSelectedPageForCover] = useState<number>(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const targetProduct = products.find((p) => p.id === selectedProductId);

  // Handle PDF file selection
  const handlePdfUpload = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');
    setPdfFileName(file.name);

    try {
      // Convert up to 10 pages with high crisp resolution (scale 1.8)
      const pages = await convertPdfToImages(file, 10, 1.8);
      if (pages.length === 0) {
        throw new Error('PDF me koi readable page nahi mila.');
      }
      setConvertedPages(pages);
      setSelectedPageForCover(1);
      setSuccessMessage(
        `PDF safaltapoorvak convert ho gaya! ${pages.length} pages images ban chuke hain.`
      );
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(
        'PDF convert karne me samasya aayi. Kripya dusra PDF try karein ya standard image upload karein.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle regular Image file (Gallery / Camera)
  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const dataUrl = await compressImageFile(file, 900);
      const singlePage: PdfPageImage = {
        pageNumber: 1,
        dataUrl,
        width: 800,
        height: 600,
      };
      setConvertedPages([singlePage]);
      setSelectedPageForCover(1);
      setPdfFileName(file.name);
      setSuccessMessage('Image upload & optimize ho gaya!');
    } catch (err) {
      console.error(err);
      setErrorMessage('Image read karne me error aaya.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Apply to selected product
  const handleApplyToProduct = () => {
    if (!targetProduct) {
      setErrorMessage('Kripya ek product chuniye.');
      return;
    }

    if (convertedPages.length === 0) {
      setErrorMessage('Kripya pehle PDF ya image upload karein.');
      return;
    }

    const coverPage =
      convertedPages.find((p) => p.pageNumber === selectedPageForCover) || convertedPages[0];

    const allPagesDataUrls = convertedPages.map((p) => p.dataUrl);

    const updatedProduct: Product = {
      ...targetProduct,
      image: coverPage.dataUrl,
      // Add all converted pages as Doctor Visual Aid Slides
      pdfVisualAidPages: allPagesDataUrls,
      images: Array.from(new Set([...(targetProduct.images || []), ...allPagesDataUrls])),
    };

    onUpdateProduct(updatedProduct);
    setSuccessMessage(
      `"${targetProduct.name}" me ${convertedPages.length} images & visual aid slides save ho gaye!`
    );
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Create new product with this image
  const handleCreateNewProduct = () => {
    if (convertedPages.length === 0) return;
    const coverPage =
      convertedPages.find((p) => p.pageNumber === selectedPageForCover) || convertedPages[0];
    const allPagesDataUrls = convertedPages.map((p) => p.dataUrl);

    if (onCreateProductFromImage) {
      onCreateProductFromImage(coverPage.dataUrl, allPagesDataUrls);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-200 block">
                Visual Aid & Packaging Hub
              </span>
              <h3 className="text-xl font-black tracking-tight">
                Upload PDF Brochure or Medicine Photos
              </h3>
              <p className="text-xs text-sky-100 font-medium">
                Kisi bhi PDF brochure ko HD images me convert karke doctor detailing me dikhayein
              </p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {/* Notification Banners */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Upload Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. PDF File Upload */}
            <button
              id="upload-pdf-action-btn"
              onClick={() => pdfInputRef.current?.click()}
              disabled={isProcessing}
              className="p-4 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/60 hover:bg-sky-100/80 hover:border-sky-500 transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-sky-950 block">Upload PDF Brochure</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Auto-convert PDF pages to images
                </span>
              </div>
            </button>

            {/* 2. Photo Gallery Upload */}
            <button
              id="upload-image-action-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="p-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/80 hover:border-emerald-500 transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-emerald-950 block">Choose from Gallery</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  JPG, PNG, WebP medicine pack
                </span>
              </div>
            </button>

            {/* 3. Camera Click */}
            <button
              id="upload-camera-action-btn"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isProcessing}
              className="p-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 hover:bg-amber-100/80 hover:border-amber-500 transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-amber-950 block">Click Live Photo</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Direct phone camera capture
                </span>
              </div>
            </button>
          </div>

          {/* Hidden HTML Inputs */}
          <input
            type="file"
            ref={pdfInputRef}
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handlePdfUpload(e.target.files[0]);
              }
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleImageUpload(e.target.files[0]);
              }
            }}
          />
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleImageUpload(e.target.files[0]);
              }
            }}
          />

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
              <div>
                <strong className="text-sm text-slate-900 block font-bold">
                  PDF & Images Processing ho raha hai...
                </strong>
                <span className="text-xs text-slate-500">
                  Pages ko HD images me render aur optimize kiya ja raha hai...
                </span>
              </div>
            </div>
          )}

          {/* Converted Pages Gallery */}
          {convertedPages.length > 0 && !isProcessing && (
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-sky-600" />
                    <span>Converted Pages / Images ({convertedPages.length})</span>
                  </h4>
                  {pdfFileName && (
                    <span className="text-[11px] text-slate-500 font-medium truncate block max-w-xs">
                      File: {pdfFileName}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                  Tap any image to set as Primary Pack Cover
                </span>
              </div>

              {/* Thumbnails Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {convertedPages.map((page) => {
                  const isCover = selectedPageForCover === page.pageNumber;
                  return (
                    <div
                      key={page.pageNumber}
                      onClick={() => setSelectedPageForCover(page.pageNumber)}
                      className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all bg-white flex flex-col group ${
                        isCover
                          ? 'border-sky-600 shadow-md ring-2 ring-sky-300'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className="relative h-36 bg-slate-50 flex items-center justify-center p-2 overflow-hidden">
                        <img
                          src={page.dataUrl}
                          alt={`Page ${page.pageNumber}`}
                          className="max-h-full max-w-full object-contain rounded drop-shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(page.dataUrl);
                          }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
                          title="View Full Size"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700">Page {page.pageNumber}</span>
                        {isCover && (
                          <span className="px-1.5 py-0.5 bg-sky-600 text-white font-extrabold text-[9px] rounded-full">
                            Cover Pack
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Target Product Selection */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Select Product to Assign:
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  >
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} ({prod.form} - {prod.packaging})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                  <button
                    id="save-images-to-product-btn"
                    onClick={handleApplyToProduct}
                    className="w-full sm:flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save as Visual Aid Slides for &ldquo;{targetProduct?.name}&rdquo;</span>
                  </button>

                  {onCreateProductFromImage && (
                    <button
                      onClick={handleCreateNewProduct}
                      className="w-full sm:w-auto py-3 px-4 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-sky-600" />
                      <span>Create New Product with this PDF</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Guidance in Hindi & English */}
          <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl text-xs space-y-2 text-slate-700">
            <span className="font-extrabold text-sky-900 block flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Kaise Kaam Karta Hai (How It Works):</span>
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
              <li>
                <strong>PDF Upload:</strong> Kisi bhi company ki medicine brochure, visual aid folder, ya LBL leaflet ka PDF upload karein. App har page ko HD images me nikaal lega.
              </li>
              <li>
                <strong>Camera / Photo:</strong> Clinic ya shop me medicine box ka live photo lekar add karein.
              </li>
              <li>
                <strong>Doctor Presentation:</strong> Ye sabhi converted images & slides doctor detailing mode me slide-by-slide zoom hokar dikhengi.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Preview Lightbox */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage}
            alt="Full size preview"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />
          <span className="text-white/80 text-xs mt-3 font-medium">Click anywhere to close</span>
        </div>
      )}
    </div>
  );
};
