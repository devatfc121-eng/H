import React from 'react';
import { X, Check } from 'lucide-react';
import { PRODUCT_FORMS, SPECIALITIES } from '../data/initialProducts';
import { Speciality } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedForm: string;
  onSelectForm: (form: string) => void;
  selectedSpeciality: Speciality;
  onSelectSpeciality: (speciality: Speciality) => void;
  onReset: () => void;
  totalFilteredCount: number;
  availableSpecialities?: string[];
  onOpenManageSpecialities?: () => void;
  availableForms?: string[];
  onOpenManageForms?: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedForm,
  onSelectForm,
  selectedSpeciality,
  onSelectSpeciality,
  onReset,
  totalFilteredCount,
  availableSpecialities,
  onOpenManageSpecialities,
  availableForms,
  onOpenManageForms,
}) => {
  if (!isOpen) return null;

  const formsList = availableForms && availableForms.length > 0
    ? ['All', ...availableForms.filter((f) => f !== 'All')]
    : PRODUCT_FORMS;

  const specialityList = availableSpecialities && availableSpecialities.length > 0
    ? ['All', ...availableSpecialities.filter((s) => s !== 'All')]
    : SPECIALITIES;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Container matching Screenshot 2 */}
      <div className="relative z-10 w-full max-w-xl bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Filter Products
          </h2>
          <div className="flex items-center gap-3">
            <button
              id="filter-reset-btn"
              onClick={onReset}
              className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Options */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section: Product Form (matching Screenshot 2 chips) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Product Form
              </span>
              <div className="flex items-center gap-2">
                {onOpenManageForms && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenManageForms();
                    }}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 underline"
                  >
                    + Manage Forms
                  </button>
                )}
                <span className="text-xs text-slate-400">
                  {selectedForm === 'All' ? 'Showing all forms' : selectedForm}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {formsList.map((form) => {
                const isSelected = selectedForm === form;
                return (
                  <button
                    key={form}
                    onClick={() => onSelectForm(form)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900 ring-offset-1'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {form}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Doctor Speciality Filter */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Doctor Speciality
                </span>
                {onOpenManageSpecialities && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenManageSpecialities();
                    }}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 underline"
                  >
                    + Manage
                  </button>
                )}
              </div>
              <span className="text-xs text-slate-400">
                {selectedSpeciality === 'All' ? 'All Specialities' : selectedSpeciality}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {specialityList.map((spec) => {
                const isSelected = selectedSpeciality === spec;
                return (
                  <button
                    key={spec}
                    onClick={() => onSelectSpeciality(spec as Speciality)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-600 ring-offset-1'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with "Show Results" button matching Screenshot 2 */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-white">
          <button
            id="filter-show-results-btn"
            onClick={onClose}
            className="w-full py-3.5 bg-black hover:bg-slate-900 active:scale-[0.99] text-white font-bold rounded-2xl shadow-lg transition-all text-center text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <span>Show Results</span>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
              ({totalFilteredCount} Products)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
