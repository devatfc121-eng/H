import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  Pill,
  Search,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { Product } from '../types';

interface ManageProductFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productForms: string[];
  onAddProductForm: (newForm: string) => void;
  onUpdateProductForm: (oldForm: string, updatedForm: string) => void;
  onDeleteProductForm: (formName: string) => void;
  onResetProductForms: () => void;
  products: Product[];
}

export const ManageProductFormsModal: React.FC<ManageProductFormsModalProps> = ({
  isOpen,
  onClose,
  productForms,
  onAddProductForm,
  onUpdateProductForm,
  onDeleteProductForm,
  onResetProductForms,
  products,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFormName, setNewFormName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Editing state
  const [editingForm, setEditingForm] = useState<string | null>(null);
  const [editFormName, setEditFormName] = useState('');

  // Delete confirmation
  const [confirmDeleteForm, setConfirmDeleteForm] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredForms = productForms.filter((f) =>
    f.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFormName.trim();
    if (!trimmed) {
      setErrorMessage('Product dosage form ka naam daalein (e.g. Sachet, Nasal Spray).');
      return;
    }

    if (
      productForms.some(
        (f) => f.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setErrorMessage('Ye dosage form pehle se maujood hai.');
      return;
    }

    onAddProductForm(trimmed);
    setNewFormName('');
    setIsAddingNew(false);
    setErrorMessage('');
  };

  const handleStartEdit = (form: string) => {
    setEditingForm(form);
    setEditFormName(form);
  };

  const handleSaveEdit = (oldForm: string) => {
    const trimmed = editFormName.trim();
    if (!trimmed) return;

    if (
      trimmed.toLowerCase() !== oldForm.toLowerCase() &&
      productForms.some((f) => f.toLowerCase() === trimmed.toLowerCase())
    ) {
      alert('Is naam ka dosage form pehle se exist karta hai.');
      return;
    }

    onUpdateProductForm(oldForm, trimmed);
    setEditingForm(null);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteForm) return;
    onDeleteProductForm(confirmDeleteForm);
    setConfirmDeleteForm(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-sky-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Pill className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 block">
                DOSAGE FORMS & PACK TYPES
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight font-['Cabinet_Grotesk',sans-serif]">
                Manage Product Forms
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Tablet, Syrup, Drops, Ointment, Sachet, etc. add ya delete karein ({productForms.length} total)
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search form (e.g. Tablet, Syrup, Sachet, Spray)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            {!isAddingNew && (
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(true);
                  setNewFormName('');
                  setErrorMessage('');
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Form</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (confirm('Kya aap sabhi standard pharmaceutical dosage forms ko restore/reset karna chahte hain?')) {
                  onResetProductForms();
                }
              }}
              className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Reset to default dosage forms"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Add New Form */}
          {isAddingNew && (
            <form
              onSubmit={handleSaveNew}
              className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Naya Product Form Add Karein
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMessage && (
                <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Form Ka Naam *</label>
                <input
                  type="text"
                  placeholder="e.g. Sachet, Nasal Spray, Mouthwash, Powder, Lotion"
                  value={newFormName}
                  onChange={(e) => setNewFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Form</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Forms */}
          <div className="space-y-2">
            {filteredForms.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6">
                <Pill className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Koi dosage form nahi mila</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Naya form add karne ke liye "+ Add Form" par click karein.
                </p>
              </div>
            ) : (
              filteredForms.map((form) => {
                const count = products.filter((p) => p.form.toLowerCase() === form.toLowerCase()).length;
                const isEditing = editingForm === form;

                if (isEditing) {
                  return (
                    <div
                      key={form}
                      className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-3 flex items-center justify-between gap-2"
                    >
                      <input
                        type="text"
                        value={editFormName}
                        onChange={(e) => setEditFormName(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingForm(null)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-200 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(form)}
                        className="px-3 py-1.5 text-xs font-black text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={form}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                        <Pill className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 leading-tight">
                          {form}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {count} {count === 1 ? 'Product mapped' : 'Products mapped'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(form)}
                        className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                        title="Edit Form"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteForm(form)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete Form"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal Overlay */}
        {confirmDeleteForm && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-3 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="text-base font-black text-slate-900">
                Form Delete Karein?
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Aap <strong>"{confirmDeleteForm}"</strong> dosage form ko delete karne ja rahe hain.
                {products.filter((p) => p.form.toLowerCase() === confirmDeleteForm.toLowerCase()).length > 0 && (
                  <span className="block mt-1 font-bold text-amber-600">
                    Is form ke products automatically "Tablet" me move ho jayenge taaki koi product defect na ho.
                  </span>
                )}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteForm(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs shadow-xs transition-colors"
                >
                  Haan, Delete Karein
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-semibold">
            {productForms.length} Active Dosage Forms • Real-time Sync
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
