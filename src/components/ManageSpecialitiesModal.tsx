import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Stethoscope,
  Activity,
  Heart,
  Baby,
  Smile,
  Ear,
  Zap,
  ShieldAlert,
  Droplet,
  Wind,
  HeartPulse,
  Flame,
  Search,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { SpecialityItem, Product } from '../types';

interface ManageSpecialitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialities: SpecialityItem[];
  onAddSpeciality: (newSpec: SpecialityItem) => void;
  onUpdateSpeciality: (oldName: string, updatedSpec: SpecialityItem) => void;
  onDeleteSpeciality: (specName: string) => void;
  onResetSpecialities: () => void;
  products: Product[];
}

const PRESET_COLORS = [
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Rose Red', hex: '#e11d48' },
  { name: 'Amber Gold', hex: '#d97706' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Teal', hex: '#0d9488' },
  { name: 'Pink', hex: '#db2777' },
  { name: 'Cyan', hex: '#0891b2' },
  { name: 'Crimson', hex: '#dc2626' },
];

export const ManageSpecialitiesModal: React.FC<ManageSpecialitiesModalProps> = ({
  isOpen,
  onClose,
  specialities,
  onAddSpeciality,
  onUpdateSpeciality,
  onDeleteSpeciality,
  onResetSpecialities,
  products,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New speciality form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]?.hex || '#0284c7');
  const [errorMessage, setErrorMessage] = useState('');

  // Editing speciality state
  const [editingSpecName, setEditingSpecName] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editColor, setEditColor] = useState('');

  // Deletion confirmation
  const [confirmDeleteSpec, setConfirmDeleteSpec] = useState<SpecialityItem | null>(null);

  if (!isOpen) return null;

  const filteredSpecialities = specialities.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setNewName('');
    setNewDesc('');
    setNewColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)].hex);
    setErrorMessage('');
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      setErrorMessage('Speciality ka naam daalna zaroori hai.');
      return;
    }

    if (
      specialities.some(
        (s) => s.name.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setErrorMessage('Ye speciality pehle se maujood hai.');
      return;
    }

    const item: SpecialityItem = {
      id: `spec-custom-${Date.now()}`,
      name: trimmed,
      description: newDesc.trim() || 'Custom pharmaceutical therapeutic range',
      color: newColor,
    };

    onAddSpeciality(item);
    setIsAddingNew(false);
    setNewName('');
    setNewDesc('');
    setErrorMessage('');
  };

  const handleStartEdit = (spec: SpecialityItem) => {
    setEditingSpecName(spec.name);
    setEditName(spec.name);
    setEditDesc(spec.description || '');
    setEditColor(spec.color);
  };

  const handleSaveEdit = (spec: SpecialityItem) => {
    const trimmed = editName.trim();
    if (!trimmed) return;

    // Check if new name collides with another speciality
    if (
      trimmed.toLowerCase() !== spec.name.toLowerCase() &&
      specialities.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      alert('Is naam ki speciality pehle se exist karti hai.');
      return;
    }

    onUpdateSpeciality(spec.name, {
      ...spec,
      name: trimmed,
      description: editDesc.trim(),
      color: editColor,
    });

    setEditingSpecName(null);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteSpec) return;
    onDeleteSpeciality(confirmDeleteSpec.name);
    setConfirmDeleteSpec(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-200 block">
                PORTFOLIO CATEGORIES & DIVISIONS
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight font-['Cabinet_Grotesk',sans-serif]">
                Manage Doctor Specialities
              </h2>
              <p className="text-xs text-sky-100/90 mt-0.5">
                Specialities ko add, edit, rename ya delete karein ({specialities.length} total)
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
              placeholder="Search speciality (e.g. Dental, ENT, Ortho)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            {!isAddingNew && (
              <button
                type="button"
                onClick={handleStartAdd}
                className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Speciality</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (confirm('Kya aap sabhi standard pharma specialities ko reset/restore karna chahte hain?')) {
                  onResetSpecialities();
                }
              }}
              className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Reset to default standard list"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Add New Speciality Form */}
          {isAddingNew && (
            <form
              onSubmit={handleSaveNew}
              className="bg-sky-50/60 border-2 border-sky-300 rounded-2xl p-4 sm:p-5 space-y-3 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-sky-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  Nayi Speciality Add Karein
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
                <label className="text-xs font-bold text-slate-700">Speciality Ka Naam *</label>
                <input
                  type="text"
                  placeholder="e.g. Dental Products, Opthalmology, Urology, Nephrology"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description / Key Range (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Eye drops, oral care, kidney protection range"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              {/* Color Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Theme Color Pill</label>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setNewColor(c.hex)}
                      className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                        newColor === c.hex ? 'ring-3 ring-sky-500 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {newColor === c.hex && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
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
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Speciality</span>
                </button>
              </div>
            </form>
          )}

          {/* List of specialities */}
          <div className="space-y-2.5">
            {filteredSpecialities.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6">
                <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Koi speciality nahi mili</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Nayi speciality add karne ke liye "+ Add Speciality" button par click karein.
                </p>
              </div>
            ) : (
              filteredSpecialities.map((spec) => {
                const productCount = products.filter((p) => p.speciality === spec.name).length;
                const isEditing = editingSpecName === spec.name;

                if (isEditing) {
                  return (
                    <div
                      key={spec.id || spec.name}
                      className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-amber-800">
                          Edit Speciality: {spec.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingSpecName(null)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Naam</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Description</label>
                        <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">Color</label>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {PRESET_COLORS.map((c) => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => setEditColor(c.hex)}
                              className={`w-6 h-6 rounded-full ${
                                editColor === c.hex ? 'ring-2 ring-amber-500 scale-110' : ''
                              }`}
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingSpecName(null)}
                          className="px-3 py-1 text-xs font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(spec)}
                          className="px-3 py-1 text-xs font-black text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-xs"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={spec.id || spec.name}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-3.5 h-10 rounded-full shrink-0"
                        style={{ backgroundColor: spec.color || '#0284c7' }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-slate-900 leading-tight truncate">
                            {spec.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {productCount} {productCount === 1 ? 'Product' : 'Products'}
                          </span>
                        </div>
                        {spec.description && (
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {spec.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(spec)}
                        className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                        title="Edit Speciality"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteSpec(spec)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete Speciality"
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
        {confirmDeleteSpec && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-3 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="text-base font-black text-slate-900">
                Speciality Delete Karein?
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Aap <strong>"{confirmDeleteSpec.name}"</strong> ko delete karne ja rahe hain.
                {products.filter((p) => p.speciality === confirmDeleteSpec.name).length > 0 && (
                  <span className="block mt-1 font-bold text-amber-600">
                    Is speciality ke products "General Physician" me move kar diye jayenge taaki koi product delete na ho.
                  </span>
                )}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteSpec(null)}
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
            {specialities.length} Active Specialities • Real-time Sync
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
