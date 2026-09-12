import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, Layers, Stethoscope, FileText, Check } from 'lucide-react';
import { UpcomingProduct } from '../types';

interface AddEditUpcomingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (product: UpcomingProduct) => void;
  onSaveProduct?: (product: UpcomingProduct) => void;
  productToEdit?: UpcomingProduct | null;
  availableSpecialities?: string[];
  specialities?: string[];
  productForms?: string[];
}

export const AddEditUpcomingModal: React.FC<AddEditUpcomingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onSaveProduct,
  productToEdit,
  availableSpecialities = [],
  specialities = [],
  productForms = [],
}) => {
  const allSpecialities =
    (availableSpecialities && availableSpecialities.length > 0
      ? availableSpecialities
      : specialities && specialities.length > 0
      ? specialities
      : ['General Physician', 'Orthopedic', 'Cardiology', 'Gynecology', 'Pediatrics', 'Dermatology', 'Neurology']);

  const [name, setName] = useState('');
  const [composition, setComposition] = useState('');
  const [form, setForm] = useState('Tablet');
  const [packaging, setPackaging] = useState('10*10 Alu Alu');
  const [expectedLaunch, setExpectedLaunch] = useState('November 2026');
  const [targetSpeciality, setTargetSpeciality] = useState('General Physician');
  const [stage, setStage] = useState<UpcomingProduct['stage']>('Pre-Launch Batch');
  const [highlights, setHighlights] = useState('');
  const [approxMrp, setApproxMrp] = useState<number | ''>(1200);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setComposition(productToEdit.composition);
      setForm(productToEdit.form);
      setPackaging(productToEdit.packaging);
      setExpectedLaunch(productToEdit.expectedLaunch);
      setTargetSpeciality(productToEdit.targetSpeciality);
      setStage(productToEdit.stage);
      setHighlights(productToEdit.highlights?.join('\n') || '');
      setApproxMrp(productToEdit.approxMrp || '');
      setNotes(productToEdit.notes || '');
    } else {
      setName('');
      setComposition('');
      setForm('Tablet');
      setPackaging('10*10 Alu Alu');
      setExpectedLaunch('December 2026');
      setTargetSpeciality(allSpecialities[0] || 'General Physician');
      setStage('Pre-Launch Batch');
      setHighlights('Advanced therapeutic efficacy\nSuperior doctor acceptance\nExcellent safety profile');
      setApproxMrp(950);
      setNotes('');
    }
  }, [productToEdit, isOpen, allSpecialities]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !composition.trim()) return;

    const parsedHighlights = highlights
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const savedProduct: UpcomingProduct = {
      id: productToEdit?.id || `up-${Date.now()}`,
      name: name.trim(),
      composition: composition.trim(),
      form: form.trim(),
      packaging: packaging.trim(),
      expectedLaunch: expectedLaunch.trim(),
      targetSpeciality,
      stage,
      highlights: parsedHighlights.length > 0 ? parsedHighlights : ['High stability & purity formulation'],
      approxMrp: typeof approxMrp === 'number' ? approxMrp : undefined,
      notes: notes.trim(),
      badgeColor: productToEdit?.badgeColor || '#6366f1',
    };

    const callback = onSave || onSaveProduct;
    if (callback) {
      callback(savedProduct);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {productToEdit ? 'Edit Upcoming Product' : 'Add Upcoming Product'}
              </h3>
              <p className="text-xs text-slate-500">
                Pipeline R&D products for doctor pre-detailing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Product Brand Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Biogard-DSR Gold"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Active Molecule Composition *
            </label>
            <input
              type="text"
              required
              value={composition}
              onChange={(e) => setComposition(e.target.value)}
              placeholder="e.g. Ilaprazole 10mg + Domperidone SR 30mg"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Dosage Form
              </label>
              <input
                type="text"
                value={form}
                onChange={(e) => setForm(e.target.value)}
                placeholder="Tablet, Capsule, Syrup"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Packaging Specs
              </label>
              <input
                type="text"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
                placeholder="10*10 Alu Alu, 200ml Pet"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Expected Launch Date
              </label>
              <input
                type="text"
                value={expectedLaunch}
                onChange={(e) => setExpectedLaunch(e.target.value)}
                placeholder="e.g. November 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Target Doctor Speciality
              </label>
              <select
                value={targetSpeciality}
                onChange={(e) => setTargetSpeciality(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                {allSpecialities.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                R&D / Pipeline Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="Pre-Launch Batch">Pre-Launch Batch</option>
                <option value="Stability Testing">Stability Testing</option>
                <option value="DCGI Approval">DCGI Approval</option>
                <option value="Packaging & Design">Packaging & Design</option>
                <option value="Coming Soon">Coming Soon</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Approx MRP (₹)
              </label>
              <input
                type="number"
                value={approxMrp}
                onChange={(e) => setApproxMrp(e.target.value ? Number(e.target.value) : '')}
                placeholder="Expected MRP"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Key Clinical Highlights (One per line)
            </label>
            <textarea
              rows={3}
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="Sustained 24hr action&#10;No food interaction&#10;Superior patient compliance"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Representative Notes / Progress Update
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Trial samples arriving next month for KOLs"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{productToEdit ? 'Save Changes' : 'Add to Pipeline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
