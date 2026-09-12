import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  Share2,
  Plus,
  Minus,
  CheckCircle2,
  Trash2,
  Edit2,
  Presentation,
  ShieldAlert,
  FileText,
  BadgePercent,
  Pill,
  Camera,
  Upload,
  Layers,
  Maximize2,
  X,
} from 'lucide-react';
import { Product } from '../types';
import { ProductPackVisual } from './ProductPackVisual';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, type?: 'Order' | 'Sample Request') => void;
  onDeleteProduct?: (productId: string, productName: string) => void;
  onEditProduct?: (product: Product) => void;
  onUpdateProduct?: (updatedProduct: Product) => void;
  onOpenVisualAid?: (product: Product) => void;
  onOpenUploadModal?: (product: Product) => void;
  isAdminMode: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onDeleteProduct,
  onEditProduct,
  onUpdateProduct,
  onOpenVisualAid,
  onOpenUploadModal,
  isAdminMode,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [deleteSlideConfirmIndex, setDeleteSlideConfirmIndex] = useState<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  if (!isOpen || !product) return null;

  const allImages = Array.from(
    new Set(
      [
        product.image,
        ...(product.pdfVisualAidPages || []),
        ...(product.images || []),
      ].filter(Boolean) as string[]
    )
  );

  const handleAddVisualAidImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const currentPages = product.pdfVisualAidPages || [];
      const updatedProduct: Product = {
        ...product,
        image: product.image || base64,
        pdfVisualAidPages: [...currentPages, base64],
      };
      if (onUpdateProduct) {
        onUpdateProduct(updatedProduct);
      }
      setActiveSlideIndex(currentPages.length);
    };
    reader.readAsDataURL(file);
    // reset input value so user can upload same file again if needed
    e.target.value = '';
  };

  const handleDeleteSlide = (slideIndexToDelete: number) => {
    const targetImage = allImages[slideIndexToDelete];
    if (!targetImage) return;

    const newPdfPages = (product.pdfVisualAidPages || []).filter((img) => img !== targetImage);
    const newImages = (product.images || []).filter((img) => img !== targetImage);
    const newMainImage =
      product.image === targetImage
        ? newPdfPages[0] || newImages[0] || undefined
        : product.image;

    const updatedProduct: Product = {
      ...product,
      image: newMainImage,
      pdfVisualAidPages: newPdfPages,
      images: newImages,
    };

    if (onUpdateProduct) {
      onUpdateProduct(updatedProduct);
    }
    setDeleteSlideConfirmIndex(null);
    setActiveSlideIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSetAsPrimary = (imgUrl: string) => {
    const updatedProduct: Product = {
      ...product,
      image: imgUrl,
    };
    if (onUpdateProduct) {
      onUpdateProduct(updatedProduct);
    }
  };

  const handleShare = () => {
    const text = `*${product.name}* (${product.brand})\nComposition: ${product.composition}\nPack: ${product.packaging}\nMRP: ₹${product.mrp}\nGST: ${product.gst}%\nIndication: ${product.description}`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  const totalPrice = product.mrp * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Container matching screenshot 4 */}
      <div className="relative w-full max-w-lg bg-white sm:rounded-3xl min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Top App Bar with Back, Cart, Share matching screenshot 4 */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100">
          <button
            id="detail-back-btn"
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {/* Visual Aid Presentation Slide trigger */}
            <button
              onClick={() => onOpenVisualAid && onOpenVisualAid(product)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold transition-colors border border-sky-200"
              title="Doctor Visual Detailing Slide"
            >
              <Presentation className="w-3.5 h-3.5 text-sky-600" />
              <span>Visual Aid</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
              title="Share Details"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {copiedNotification && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold text-center animate-in fade-in">
              Product details copied to clipboard! Ready to send to Doctor.
            </div>
          )}

          {/* Product Pack Visual Rendering */}
          <div className="mb-3">
            <div className="relative">
              <ProductPackVisual
                name={product.name}
                form={product.form}
                color={product.badgeColor}
                composition={product.composition}
                image={allImages[activeSlideIndex] || product.image}
                size="lg"
              />
              {(allImages[activeSlideIndex] || product.image) && (
                <button
                  type="button"
                  onClick={() => setSelectedPreviewImage(allImages[activeSlideIndex] || product.image || null)}
                  className="absolute top-2 right-2 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-xl text-xs flex items-center gap-1 backdrop-blur-xs shadow-md"
                  title="View Full Resolution Image"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">Zoom</span>
                </button>
              )}
            </div>

            {/* Hidden file input for adding visual aid images directly */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAddVisualAidImage}
            />

            {/* Visual Aid Management Bar (Add Image, Delete Slide, Set as Cover) */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs transition-all"
                  title="Add another photo or visual aid slide"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Visual Aid Image</span>
                </button>

                {onOpenUploadModal && (
                  <button
                    type="button"
                    onClick={() => onOpenUploadModal(product)}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                    title="Upload multi-page PDF brochure"
                  >
                    <Upload className="w-3.5 h-3.5 text-sky-600" />
                    <span className="hidden sm:inline">Upload PDF</span>
                  </button>
                )}
              </div>

              {allImages.length > 0 && allImages[activeSlideIndex] && (
                <div className="flex items-center gap-1.5">
                  {allImages[activeSlideIndex] !== product.image && (
                    <button
                      type="button"
                      onClick={() => handleSetAsPrimary(allImages[activeSlideIndex])}
                      className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-semibold transition-colors"
                      title="Set current slide as main pack photo"
                    >
                      Make Cover
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setDeleteSlideConfirmIndex(activeSlideIndex)}
                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                    title="Delete current visual aid slide"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Delete Slide</span>
                  </button>
                </div>
              )}
            </div>

            {/* Visual Aid Pages / Multiple Images Strip */}
            {allImages.length > 0 && (
              <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5 px-1">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                    <span>Visual Aid Slides & Pages ({allImages.length})</span>
                  </span>
                  <span className="text-[10px] text-sky-600 font-semibold">
                    Viewing Slide {activeSlideIndex + 1} of {allImages.length}
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {allImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative group shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveSlideIndex(idx)}
                        className={`relative w-14 h-16 rounded-xl overflow-hidden border-2 bg-white transition-all block ${
                          activeSlideIndex === idx
                            ? 'border-sky-600 ring-2 ring-sky-200 scale-105 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt={`Slide ${idx + 1}`} className="w-full h-full object-contain" />
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[8px] font-bold text-center">
                          P{idx + 1}
                        </span>
                      </button>

                      {/* Instant Delete Cross on Thumbnail */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteSlideConfirmIndex(idx);
                        }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                        title="Delete this slide"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add Slide Quick Tile */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-14 h-16 rounded-xl border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/50 hover:bg-sky-100/50 flex flex-col items-center justify-center text-sky-600 shrink-0 transition-colors"
                    title="Add image slide"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-[9px] font-black mt-0.5">+ Add</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Product Title Header matching screenshot 4 */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-700 tracking-wider uppercase">
                {product.brand} LIFESCIENCES
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {product.speciality}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {product.name}
            </h1>
          </div>

          {/* COMPOSITION Section matching screenshot 4 */}
          <div>
            <h2 className="text-xs font-extrabold text-blue-600 tracking-wider uppercase mb-2">
              COMPOSITION
            </h2>
            <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-3.5 text-slate-800 text-sm sm:text-base font-semibold italic">
              {product.composition}
            </div>
          </div>

          {/* PACKAGING DETAILS Section matching screenshot 4 */}
          <div>
            <h2 className="text-xs font-extrabold text-blue-600 tracking-wider uppercase mb-2">
              PACKAGING DETAILS
            </h2>
            <div className="bg-sky-50/30 border border-sky-100/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 text-base">
                  {product.packaging}
                </span>
                <span className="text-xl font-black text-sky-600">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="h-[1px] bg-slate-200/80 my-3" />

              <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-500 mb-4">
                <div>
                  <span className="block uppercase tracking-wider text-[10px] text-slate-400 font-bold">
                    DIMENSION / SIZE
                  </span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                    {product.packSize || product.packaging}
                  </span>
                </div>
                <div>
                  <span className="block uppercase tracking-wider text-[10px] text-slate-400 font-bold">
                    QUANTITY
                  </span>
                  <div className="flex items-center gap-2.5 mt-0.5">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold text-slate-800 min-w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <button
                  id="detail-add-cart-btn"
                  onClick={() => {
                    onAddToCart(product, quantity, 'Order');
                    onClose();
                  }}
                  className="w-full py-3 px-4 border-2 border-sky-600 hover:bg-sky-50 active:scale-[0.99] text-sky-600 font-extrabold rounded-2xl flex items-center justify-center gap-2 text-sm tracking-wide transition-all shadow-xs"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>ADD THIS PACK TO CART ({quantity} Pack = ₹{totalPrice.toLocaleString('en-IN')})</span>
                </button>

                <button
                  id="detail-request-sample-btn"
                  onClick={() => {
                    onAddToCart(product, 1, 'Sample Request');
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold rounded-2xl flex items-center justify-center gap-2 text-xs transition-all"
                >
                  <Pill className="w-4 h-4 text-emerald-600" />
                  <span>Request Doctor Sample (Free LBL/Prescription Sample)</span>
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCT DESCRIPTION Section matching screenshot 4 */}
          <div>
            <h2 className="text-xs font-extrabold text-blue-600 tracking-wider uppercase mb-2">
              PRODUCT DESCRIPTION
            </h2>
            <div className="text-slate-800 text-sm leading-relaxed space-y-2">
              <p className="font-semibold text-slate-700">{product.description}</p>
              <div className="flex items-center gap-2 pt-1 text-xs font-bold text-slate-600">
                <BadgePercent className="w-4 h-4 text-amber-600" />
                <span>GST / Tax: {product.gst}%</span>
              </div>
            </div>
          </div>

          {/* Key Clinical Indications & Benefits for Doctor Detailing */}
          {product.indications && product.indications.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <h2 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>CLINICAL INDICATIONS (For Doctor Discussion)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.indications.map((ind, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dosage Guide */}
          {product.dosageGuide && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900">
              <span className="font-bold block uppercase tracking-wider text-[10px] text-amber-700 mb-0.5">
                DOSAGE & ADMINISTRATION GUIDELINES:
              </span>
              <span>{product.dosageGuide}</span>
            </div>
          )}

          {/* Admin Management Section: Edit & Delete matching user request! */}
          <div className="pt-4 border-t border-dashed border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Admin Product Controls
              </span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                ID: {product.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onEditProduct && onEditProduct(product);
                  onClose();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Edit Product Details</span>
              </button>

              <button
                id="modal-delete-product-btn"
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Alert Overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full text-center shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete {product.name}?</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Are you sure you want to remove this product from the doctor showcase catalog?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  id="confirm-delete-btn"
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    onDeleteProduct && onDeleteProduct(product.id, product.name);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Single Slide Confirmation Alert Overlay */}
        {deleteSlideConfirmIndex !== null && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full text-center shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Visual Aid Slide {deleteSlideConfirmIndex + 1} Delete Karein?
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Ye image / visual aid page is product ke gallery aur slideshow se remove ho jayega.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteSlideConfirmIndex(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSlide(deleteSlideConfirmIndex)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
                >
                  Haan, Slide Hatayein
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen HD Zoom Lightbox */}
        {selectedPreviewImage && (
          <div className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-3 animate-in fade-in">
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={() => setSelectedPreviewImage(null)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-auto">
              <img
                src={selectedPreviewImage}
                alt="Product Zoom Preview"
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
