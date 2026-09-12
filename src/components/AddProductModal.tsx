import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Sparkles,
  Check,
  PackagePlus,
  AlertCircle,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  FileText,
  Loader2,
  Layers,
} from 'lucide-react';
import { Product, ProductForm, Speciality } from '../types';
import { PRODUCT_FORMS, SPECIALITIES } from '../data/initialProducts';
import { convertPdfToImages, compressImageFile } from '../utils/pdfToImage';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (product: Product) => void;
  productToEdit?: Product | null;
  initialImage?: string;
  initialPdfPages?: string[];
  availableSpecialities?: string[];
  onOpenManageSpecialities?: () => void;
  availableForms?: string[];
  onOpenManageForms?: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSaveProduct,
  productToEdit,
  initialImage,
  initialPdfPages,
  availableSpecialities,
  onOpenManageSpecialities,
  availableForms,
  onOpenManageForms,
}) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('BIOPHAR');
  const [composition, setComposition] = useState('');
  const [form, setForm] = useState<ProductForm>('Tablet');
  const [packaging, setPackaging] = useState('10*10 Alu Alu');
  const [packSize, setPackSize] = useState('100 Tablets');
  const [mrp, setMrp] = useState<number>(1250);
  const [gst, setGst] = useState<number>(5);
  const [speciality, setSpeciality] = useState<Speciality>('General Physician');
  const [description, setDescription] = useState('');
  const [indicationsText, setIndicationsText] = useState('');
  const [dosageGuide, setDosageGuide] = useState('');
  const [image, setImage] = useState<string>('');
  const [pdfVisualAidPages, setPdfVisualAidPages] = useState<string[]>([]);
  const [isConvertingPdf, setIsConvertingPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setBrand(productToEdit.brand || 'BIOPHAR');
      setComposition(productToEdit.composition);
      setForm(productToEdit.form);
      setPackaging(productToEdit.packaging);
      setPackSize(productToEdit.packSize || productToEdit.packaging);
      setMrp(productToEdit.mrp);
      setGst(productToEdit.gst || 5);
      setSpeciality(productToEdit.speciality || 'General Physician');
      setDescription(productToEdit.description);
      setIndicationsText(productToEdit.indications ? productToEdit.indications.join('\n') : '');
      setDosageGuide(productToEdit.dosageGuide || '');
      setImage(productToEdit.image || '');
      setPdfVisualAidPages(productToEdit.pdfVisualAidPages || []);
    } else {
      resetForm();
      if (initialImage) {
        setImage(initialImage);
      }
      if (initialPdfPages && initialPdfPages.length > 0) {
        setPdfVisualAidPages(initialPdfPages);
        if (!initialImage && initialPdfPages[0]) {
          setImage(initialPdfPages[0]);
        }
      }
    }
  }, [productToEdit, isOpen, initialImage, initialPdfPages]);

  const resetForm = () => {
    setName('');
    setBrand('BIOPHAR');
    setComposition('');
    setForm('Tablet');
    setPackaging('10*10 Alu Alu');
    setPackSize('100 Tablets');
    setMrp(1200);
    setGst(5);
    setSpeciality('General Physician');
    setDescription('');
    setIndicationsText('');
    setDosageGuide('');
    setImage('');
    setPdfVisualAidPages([]);
    setPdfFileName('');
    setError('');
  };

  const handleImageFile = async (file: File) => {
    try {
      const dataUrl = await compressImageFile(file, 900);
      setImage(dataUrl);
      // Also add to visual aid pages if none exist
      setPdfVisualAidPages((prev) => (prev.length === 0 ? [dataUrl] : prev));
    } catch {
      setError('Image load karne me samasya aayi.');
    }
  };

  const handlePdfFile = async (file: File) => {
    setIsConvertingPdf(true);
    setError('');
    setPdfFileName(file.name);
    try {
      const pages = await convertPdfToImages(file, 8, 1.8);
      if (pages.length === 0) {
        throw new Error('No pages found');
      }
      const dataUrls = pages.map((p) => p.dataUrl);
      setPdfVisualAidPages(dataUrls);
      // Auto set first page as the main cover image
      if (dataUrls[0]) {
        setImage(dataUrls[0]);
      }
    } catch (err) {
      console.error(err);
      setError('PDF convert karne me error aaya. Kripya normal image use karein.');
    } finally {
      setIsConvertingPdf(false);
    }
  };

  const handleQuickFill = (type: string) => {
    if (type === 'ortho') {
      setName('Acephar-SP');
      setComposition('Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg Tablets');
      setForm('Tablet');
      setPackaging('10*10 Alu Alu');
      setPackSize('100 Tablets');
      setMrp(1380);
      setGst(5);
      setSpeciality('Orthopedic');
      setDescription('Triple combination anti-inflammatory and proteolytic enzyme therapy for severe sports trauma, osteoarthritis, and dental inflammation.');
      setIndicationsText('Rheumatoid Arthritis\nPost-operative traumatic pain\nSpondylitis and lumbago');
      setDosageGuide('1 tablet twice daily after meals.');
    } else if (type === 'gastro') {
      setName('Bio-Rab DSR');
      setComposition('Rabeprazole Sodium 20mg + Domperidone 30mg SR Capsules');
      setForm('Capsule');
      setPackaging('10*10 Alu Alu');
      setPackSize('100 Capsules');
      setMrp(1520);
      setGst(5);
      setSpeciality('Gastroenterology');
      setDescription('Advanced dual release therapy for severe gastroesophageal reflux disease, hyperacidity, and heartburn relief.');
      setIndicationsText('Gastroesophageal Reflux Disease (GERD)\nPeptic ulcer disease\nDyspepsia and nausea');
      setDosageGuide('1 capsule daily in the morning on an empty stomach.');
    } else if (type === 'derma') {
      setName('Bio-Calm Gel');
      setComposition('Diclofenac Diethylamine 1.16% + Linseed Oil 3% + Methyl Salicylate 10% + Menthol 5% Gel');
      setForm('Gel');
      setPackaging('30g Lami Tube');
      setPackSize('30g Tube');
      setMrp(135);
      setGst(12);
      setSpeciality('Orthopedic');
      setDescription('Fast-acting deep penetrating pain relief gel for sprains, muscle spasm, and joint stiffness.');
      setIndicationsText('Muscular pain & sprains\nLow back ache\nNeck & shoulder stiffness');
      setDosageGuide('Apply 3 to 4 times daily to affected region with gentle massage.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a product name');
      return;
    }
    if (!composition.trim()) {
      setError('Please enter medicine composition');
      return;
    }
    if (!mrp || mrp <= 0) {
      setError('Please enter a valid MRP');
      return;
    }

    const indications = indicationsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newProduct: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      name: name.trim(),
      brand: brand.trim() || 'BIOPHAR',
      composition: composition.trim(),
      form,
      packaging: packaging.trim() || '10*10 Alu Alu',
      packSize: packSize.trim() || packaging.trim(),
      mrp: Number(mrp),
      gst: Number(gst) || 5,
      speciality,
      description: description.trim() || `${name} is formulated for clinical efficacy.`,
      indications: indications.length > 0 ? indications : ['As advised by treating doctor.'],
      keyBenefits: [
        'Clinically proven high bioavailability',
        'Stringent WHO-GMP quality assured manufacturing',
        'Excellent patient tolerability & compliance',
      ],
      dosageGuide: dosageGuide.trim() || 'As directed by physician.',
      image: image || undefined,
      pdfVisualAidPages: pdfVisualAidPages.length > 0 ? pdfVisualAidPages : undefined,
      images: Array.from(new Set([image, ...pdfVisualAidPages].filter(Boolean) as string[])),
      createdAt: productToEdit?.createdAt || new Date().toISOString(),
      isNew: !productToEdit,
    };

    onSaveProduct(newProduct);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {productToEdit ? 'Edit Product' : 'Add New Pharma Product'}
              </h2>
              <p className="text-xs text-slate-500">
                Product will immediately show in the Doctor visual aid catalog
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Real Medicine Box Photo Capture / Upload & PDF Brochure */}
          <div className="p-3.5 bg-sky-50/70 rounded-2xl border border-sky-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-sky-600" />
                <span>Product Photo / PDF Brochure (Auto-Convert to Images)</span>
              </span>
              {(image || pdfVisualAidPages.length > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    setImage('');
                    setPdfVisualAidPages([]);
                    setPdfFileName('');
                  }}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove All</span>
                </button>
              )}
            </div>

            {/* Hidden native inputs for camera, gallery & PDF */}
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageFile(e.target.files[0]);
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
                  handleImageFile(e.target.files[0]);
                }
              }}
            />
            <input
              type="file"
              ref={pdfInputRef}
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handlePdfFile(e.target.files[0]);
                }
              }}
            />

            {/* Processing Spinner */}
            {isConvertingPdf && (
              <div className="py-6 flex flex-col items-center justify-center bg-white rounded-xl border border-sky-200">
                <Loader2 className="w-6 h-6 text-sky-600 animate-spin mb-2" />
                <span className="text-xs font-bold text-slate-800">
                  PDF pages ko HD images me convert kiya ja raha hai...
                </span>
                <span className="text-[10px] text-slate-500">File: {pdfFileName}</span>
              </div>
            )}

            {/* Preview Selected Main Cover */}
            {!isConvertingPdf && image && (
              <div className="relative w-full h-36 bg-white rounded-xl border border-sky-200 overflow-hidden flex items-center justify-center p-2 mb-2">
                <img
                  src={image}
                  alt="Medicine Packaging"
                  className="max-h-full max-w-full object-contain rounded-lg drop-shadow"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                  Primary Pack Cover
                </div>
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1 shadow-sm transition-colors"
                  title="Remove cover photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">Remove Image</span>
                </button>
              </div>
            )}

            {/* Converted PDF Pages / Visual Aid Carousel */}
            {!isConvertingPdf && pdfVisualAidPages.length > 0 && (
              <div className="mb-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                    <span>Visual Aid Slides ({pdfVisualAidPages.length} pages)</span>
                  </span>
                  <span className="text-sky-600 text-[10px]">Tap to set cover • ✕ to delete</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {pdfVisualAidPages.map((pageUrl, idx) => (
                    <div
                      key={idx}
                      className="relative shrink-0 group"
                    >
                      <div
                        onClick={() => setImage(pageUrl)}
                        className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-transform active:scale-95 bg-white ${
                          image === pageUrl ? 'border-sky-600 ring-2 ring-sky-300' : 'border-slate-200'
                        }`}
                      >
                        <img src={pageUrl} alt={`Page ${idx + 1}`} className="w-full h-full object-contain" />
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[8px] text-center font-bold">
                          P{idx + 1}
                        </span>
                      </div>

                      {/* Delete Slide Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPdfVisualAidPages((prev) => prev.filter((_, pIdx) => pIdx !== idx));
                          if (image === pageUrl) {
                            setImage('');
                          }
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-colors"
                        title="Delete this slide"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3 Upload Action Buttons */}
            {!isConvertingPdf && (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="py-2.5 px-2 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 shadow-xs transition-colors"
                >
                  <Camera className="w-4 h-4 text-sky-600" />
                  <span className="text-[11px]">Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-2 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 shadow-xs transition-colors"
                >
                  <Upload className="w-4 h-4 text-sky-600" />
                  <span className="text-[11px]">Gallery Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  className="py-2.5 px-2 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 shadow-xs transition-colors"
                >
                  <FileText className="w-4 h-4 text-sky-600" />
                  <span className="text-[11px]">Upload PDF</span>
                </button>
              </div>
            )}
            <p className="text-[10px] text-slate-500 mt-1.5">
              Doctor ko dikhane ke liye real pack photo ya PDF brochure upload karein. PDF ke har page ko images me convert kiya jata hai.
            </p>
          </div>

          {/* Quick Presets for Rapid Testing */}
          {!productToEdit && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Template Fill (Auto-Fill Example Data):
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('ortho')}
                  className="px-2.5 py-1 bg-white hover:bg-sky-50 text-sky-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-sky-500" />
                  <span>+ Acephar-SP (Ortho)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('gastro')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>+ Bio-Rab DSR (Gastro)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('derma')}
                  className="px-2.5 py-1 bg-white hover:bg-violet-50 text-violet-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-violet-500" />
                  <span>+ Bio-Calm Gel (Pain Relief)</span>
                </button>
              </div>
            </div>
          )}

          {/* Product Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Medicine Name *
              </label>
              <input
                id="input-product-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acephar-CT, 5 Fill D3 Plus"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Brand / Division
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="BIOPHAR"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Composition */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Active Generic Composition *
            </label>
            <input
              id="input-product-composition"
              type="text"
              required
              value={composition}
              onChange={(e) => setComposition(e.target.value)}
              placeholder="e.g. Aceclofenac 100mg + Paracetamol 325mg + Trypsin Chymotrypsin"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
            />
          </div>

          {/* Form & Speciality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Dosage Form
                </label>
                {onOpenManageForms && (
                  <button
                    type="button"
                    onClick={onOpenManageForms}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-700 underline"
                  >
                    + Manage Forms
                  </button>
                )}
              </div>
              <select
                id="input-product-form"
                value={form}
                onChange={(e) => setForm(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              >
                {(availableForms && availableForms.length > 0
                  ? availableForms
                  : PRODUCT_FORMS.filter((f) => f !== 'All')
                ).map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Doctor Speciality
                </label>
                {onOpenManageSpecialities && (
                  <button
                    type="button"
                    onClick={onOpenManageSpecialities}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-700 underline"
                  >
                    + Manage Specialities
                  </button>
                )}
              </div>
              <select
                id="input-product-speciality"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value as Speciality)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              >
                {(availableSpecialities && availableSpecialities.length > 0
                  ? availableSpecialities.filter((s) => s !== 'All')
                  : SPECIALITIES.filter((s) => s !== 'All')
                ).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Packaging & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Packaging (e.g. Alu Alu)
              </label>
              <input
                type="text"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
                placeholder="10*10 Alu Alu"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                MRP (₹) *
              </label>
              <input
                id="input-product-mrp"
                type="number"
                required
                min="1"
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                placeholder="1125"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                GST / Tax %
              </label>
              <select
                value={gst}
                onChange={(e) => setGst(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              >
                <option value={5}>5% (Medicines)</option>
                <option value={12}>12% (Nutraceuticals)</option>
                <option value={18}>18% (Derma/Cosmetics)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Therapeutic Description (Shown to Doctors)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Indicated for rapid relief in painful inflammatory conditions, post-operative wound edema..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Clinical Indications (One per line) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Clinical Indications (Enter each indication on a new line)
            </label>
            <textarea
              rows={2}
              value={indicationsText}
              onChange={(e) => setIndicationsText(e.target.value)}
              placeholder="Post-operative edema&#10;Osteoarthritis&#10;Traumatic sports injuries"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Dosage & Administration Guide
            </label>
            <input
              type="text"
              value={dosageGuide}
              onChange={(e) => setDosageGuide(e.target.value)}
              placeholder="e.g. 1 tablet twice daily after meals"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-product-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{productToEdit ? 'Save Changes' : 'Add to Doctor Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
