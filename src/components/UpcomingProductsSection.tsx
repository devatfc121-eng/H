import React from 'react';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileBadge,
} from 'lucide-react';
import { UpcomingProduct } from '../types';

interface UpcomingProductsSectionProps {
  upcomingProducts: UpcomingProduct[];
  onAddUpcoming: () => void;
  onEditUpcoming: (product: UpcomingProduct) => void;
  onDeleteUpcoming: (productId: string, name: string) => void;
  onRecordDoctorInterest: (product: UpcomingProduct) => void;
}

export const UpcomingProductsSection: React.FC<UpcomingProductsSectionProps> = ({
  upcomingProducts,
  onAddUpcoming,
  onEditUpcoming,
  onDeleteUpcoming,
  onRecordDoctorInterest,
}) => {
  const getStageBadgeClass = (stage: UpcomingProduct['stage']) => {
    switch (stage) {
      case 'DCGI Approval':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Stability Testing':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Pre-Launch Batch':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Packaging & Design':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <section id="section-upcoming-products" className="px-4 sm:px-6 pt-3 pb-4">
      <div className="bg-gradient-to-br from-indigo-950/5 via-slate-50 to-blue-900/5 rounded-3xl p-4 sm:p-5 border border-indigo-200/70 shadow-xs">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                <Clock className="w-3 h-3" />
                Upcoming Products
              </span>
              <span className="text-xs font-bold text-indigo-900 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                {upcomingProducts.length} Pipeline Formulations
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-1">
              Upcoming Formulations Pipeline
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Pre-detailing portfolio for key doctors: Showcase upcoming DCGI approved medicines and gather early prescription commitments.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="btn-add-upcoming-product"
              onClick={onAddUpcoming}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Add Upcoming Product</span>
            </button>
          </div>
        </div>

        {/* Grid of Upcoming Products */}
        {upcomingProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-indigo-200">
            <p className="text-xs text-slate-500 font-medium">
              No upcoming products in the pipeline. Click "+ Add Upcoming Product" to introduce your next launches.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {upcomingProducts.map((item) => (
              <div
                key={item.id}
                id={`upcoming-card-${item.id}`}
                className="bg-white rounded-2xl p-3.5 border border-indigo-100 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Stage & Expected Launch */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStageBadgeClass(
                        item.stage
                      )}`}
                    >
                      {item.stage}
                    </span>
                    <span className="text-[10px] font-extrabold text-indigo-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.expectedLaunch}
                    </span>
                  </div>

                  {/* Brand & Composition */}
                  <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                    {item.packaging} • {item.form}
                  </p>
                  <p className="text-[11px] text-indigo-950/80 font-medium line-clamp-2 mt-1 leading-tight" title={item.composition}>
                    {item.composition}
                  </p>

                  {/* Speciality and Approx Price */}
                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-bold">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {item.targetSpeciality}
                    </span>
                    {item.approxMrp && (
                      <span className="text-slate-600 font-semibold">
                        Exp. MRP ~ ₹{item.approxMrp}
                      </span>
                    )}
                  </div>

                  {/* Highlights */}
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="mt-2.5 p-2 bg-indigo-50/50 rounded-xl space-y-1 text-[10px] text-slate-600">
                      {item.highlights.slice(0, 2).map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span className="line-clamp-1">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-[10px] text-slate-400 italic mt-1.5 line-clamp-1">
                      Note: {item.notes}
                    </p>
                  )}
                </div>

                {/* Actions: Pre-book interest, Edit, Delete */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                  <button
                    id={`btn-interest-${item.id}`}
                    onClick={() => onRecordDoctorInterest(item)}
                    className="w-full py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Doctor Feedback / Pre-Commit</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      id={`btn-edit-upcoming-${item.id}`}
                      onClick={() => onEditUpcoming(item)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      id={`btn-delete-upcoming-${item.id}`}
                      onClick={() => {
                        if (window.confirm(`Delete "${item.name}" from Upcoming Products?`)) {
                          onDeleteUpcoming(item.id, item.name);
                        }
                      }}
                      className="py-1.5 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      title="Delete upcoming product"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
