import React, { useState } from 'react';
import { X, Printer, Download, Share2, Search, FileSpreadsheet, Check } from 'lucide-react';
import { Product } from '../types';

interface RateListPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const RateListPrintModal: React.FC<RateListPrintModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpeciality, setFilterSpeciality] = useState('All');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.composition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = filterSpeciality === 'All' || p.speciality === filterSpeciality;
    return matchesSearch && matchesSpec;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    let text = `*BIOPHAR LIFESCIENCES - DOCTOR RATE LIST*\n_Total Products: ${filteredProducts.length}_\n\n`;
    filteredProducts.forEach((p, idx) => {
      text += `${idx + 1}. *${p.name}* (${p.form})\n`;
      text += `   Comp: ${p.composition}\n`;
      text += `   Pack: ${p.packaging} | MRP: ₹${p.mrp} (GST: ${p.gst}%)\n\n`;
    });
    text += `Representative: Shivam Baranwal (Biophar Lifesciences)`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyText = () => {
    let text = `BIOPHAR LIFESCIENCES - PRODUCT RATE LIST\n\n`;
    filteredProducts.forEach((p, idx) => {
      text += `${idx + 1}. ${p.name} | ${p.composition} | ${p.packaging} | MRP: ₹${p.mrp}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden print:max-h-none print:shadow-none print:rounded-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Official Doctor Rate List & Catalog
              </h2>
              <p className="text-xs text-slate-500">
                Print or share complete medicine list with MRP, GST, and Packaging
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              title="Print Rate List"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              title="Share on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={handleCopyText}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : null}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar (Hidden in print) */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search product or composition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            Showing {filteredProducts.length} of {products.length} Products
          </span>
        </div>

        {/* Printable Document Layout */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 print:p-0 print:overflow-visible">
          {/* Header on Paper */}
          <div className="border-b-2 border-sky-600 pb-3 mb-4 flex justify-between items-end">
            <div>
              <span className="text-xs font-black text-sky-700 tracking-widest uppercase">
                BIOPHAR LIFESCIENCES PVT. LTD.
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                DOCTOR & CHEMIST PRICE LIST
              </h1>
              <p className="text-xs text-slate-500">
                WHO-GMP Certified Formulations • High Efficacy Bio-Equivalence
              </p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p className="font-bold">MR: Shivam Baranwal</p>
              <p>Email: shivambaranwal121@gmail.com</p>
              <p className="text-[10px] text-slate-400">Date: {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-sky-50 text-sky-950 font-black border-y border-sky-200">
                <th className="py-2.5 px-2 w-10 text-center">#</th>
                <th className="py-2.5 px-3">Product Name & Division</th>
                <th className="py-2.5 px-3">Generic Composition</th>
                <th className="py-2.5 px-2 text-center">Dosage</th>
                <th className="py-2.5 px-2">Packaging</th>
                <th className="py-2.5 px-2 text-center">GST</th>
                <th className="py-2.5 px-3 text-right">MRP (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod, index) => (
                <tr key={prod.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-2 text-center text-slate-400 font-mono">{index + 1}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-extrabold text-slate-900 text-sm block">{prod.name}</span>
                    <span className="text-[10px] font-bold text-sky-700">{prod.brand}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-medium max-w-xs">{prod.composition}</td>
                  <td className="py-2.5 px-2 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-[10px] text-slate-700">
                      {prod.form}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-semibold text-slate-700">{prod.packaging}</td>
                  <td className="py-2.5 px-2 text-center font-bold text-slate-600">{prod.gst}%</td>
                  <td className="py-2.5 px-3 text-right font-black text-sky-700 text-sm">
                    ₹{prod.mrp.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Notes */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
            <div>
              <p>• Prices subject to change as per regulatory revisions.</p>
              <p>• Available through all authorized stockists & pharmacy distributors.</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-700">BIOPHAR LIFESCIENCES</p>
              <p>Chandigarh & Panchkula, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
