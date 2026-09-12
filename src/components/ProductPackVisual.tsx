import React from 'react';
import { ProductForm } from '../types';

interface ProductPackVisualProps {
  name: string;
  form: ProductForm;
  color?: string;
  composition?: string;
  size?: 'sm' | 'md' | 'lg';
  image?: string;
}

export const ProductPackVisual: React.FC<ProductPackVisualProps> = ({
  name,
  form,
  color = '#0284c7',
  composition,
  size = 'md',
  image,
}) => {
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  // If user uploaded a custom packaging image or camera capture
  if (image) {
    return (
      <div
        id={`pack-visual-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-2 shadow-inner ${
          isLg ? 'h-56 w-full' : isSm ? 'h-28 w-full' : 'h-40 w-full'
        }`}
      >
        <img
          src={image}
          alt={name}
          className="max-h-full max-w-full object-contain drop-shadow-md rounded-lg"
          referrerPolicy="no-referrer"
        />
        <span className="absolute top-1.5 right-2 px-1.5 py-0.5 bg-slate-900/70 text-white text-[8px] font-semibold rounded backdrop-blur-xs">
          {form}
        </span>
      </div>
    );
  }

  // Choose accent colors based on form
  const getAccent = () => {
    switch (form) {
      case 'Injection':
        return '#dc2626';
      case 'Softgel':
        return '#0284c7';
      case 'Capsule':
        return '#d97706';
      case 'Syrup':
      case 'Dry Syrup':
        return '#059669';
      case 'Cream':
      case 'Gel':
      case 'Ointment':
        return '#7c3aed';
      case 'Drops':
      case 'Eye Drops':
      case 'Ear Drops':
        return '#0891b2';
      default:
        return color || '#2563eb';
    }
  };

  const accent = getAccent();

  return (
    <div
      id={`pack-visual-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
      className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/80 select-none ${
        isLg ? 'h-56 w-full' : isSm ? 'h-28 w-full' : 'h-40 w-full'
      }`}
    >
      {/* Subtle pharma grid background pattern */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:12px_12px]" />

      {/* Realistic 3D Pharma Medicine Pack Rendering */}
      <div className="relative z-10 flex items-center justify-center gap-2 p-2">
        {/* Main Box/Bottle */}
        {form === 'Injection' ? (
          <div className="flex items-end gap-2">
            {/* Box */}
            <div className="w-20 h-28 bg-white rounded shadow-md border border-slate-300 flex flex-col justify-between p-1.5 transform -rotate-1">
              <div className="flex justify-between items-center text-[7px] font-bold text-slate-400">
                <span>BIOPHAR</span>
                <span className="text-red-500">Rx</span>
              </div>
              <div className="text-center">
                <div className="h-1 w-full rounded" style={{ backgroundColor: accent }} />
                <span className="text-[10px] font-extrabold text-slate-800 leading-tight block mt-1 line-clamp-1">{name}</span>
                <span className="text-[6px] text-slate-500 font-medium">Inj. I.M. / I.V.</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded text-[5px] text-center text-slate-400 flex items-center justify-center">
                Ampoules
              </div>
            </div>
            {/* Ampoules */}
            <div className="flex gap-1">
              {[1, 2].map((i) => (
                <div key={i} className="w-3.5 h-16 bg-gradient-to-r from-amber-100/90 to-amber-200 rounded-t-full rounded-b border border-amber-300 shadow-sm relative flex flex-col items-center justify-end pb-1">
                  <div className="w-1.5 h-3 bg-amber-300/60 rounded-t-full -mt-2 mb-auto" />
                  <div className="w-full h-1 bg-red-400 mb-2 opacity-80" />
                  <span className="text-[5px] text-amber-900 font-bold rotate-90 origin-center whitespace-nowrap">2ml</span>
                </div>
              ))}
            </div>
          </div>
        ) : form === 'Softgel' ? (
          <div className="flex items-center gap-2">
            {/* Bottle */}
            <div className="w-16 h-28 bg-gradient-to-b from-amber-900/90 via-amber-950 to-amber-900 rounded-xl shadow-md border border-amber-800 flex flex-col items-center justify-between p-1 relative">
              <div className="w-10 h-3 bg-gradient-to-b from-yellow-200 to-yellow-500 rounded-t-sm shadow-sm" />
              <div className="w-14 bg-white/95 rounded p-1 text-center shadow-inner my-auto">
                <span className="text-[6px] text-sky-800 font-bold block">BIOPHAR</span>
                <span className="text-[8px] font-extrabold text-slate-900 line-clamp-1">{name}</span>
                <div className="h-0.5 w-6 mx-auto rounded mt-0.5" style={{ backgroundColor: accent }} />
              </div>
              <span className="text-[6px] text-amber-200/90 font-mono">60 Softgels</span>
            </div>
            {/* Softgel Pills */}
            <div className="flex flex-col gap-1.5">
              <div className="w-6 h-3 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-md transform rotate-12 border border-amber-300" />
              <div className="w-6 h-3 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full shadow-md transform -rotate-6 border border-amber-200" />
            </div>
          </div>
        ) : form === 'Cream' || form === 'Gel' || form === 'Ointment' ? (
          <div className="flex items-center gap-2">
            {/* Box */}
            <div className="w-24 h-16 bg-white rounded shadow-md border border-slate-300 flex flex-col justify-between p-1.5">
              <div className="flex justify-between items-center text-[7px] font-bold text-slate-400">
                <span>BIOPHAR</span>
                <span className="text-violet-600">Rx</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-extrabold text-slate-800 leading-tight block line-clamp-1">{name}</span>
                <div className="h-1 w-full rounded mt-0.5" style={{ backgroundColor: accent }} />
              </div>
              <span className="text-[6px] text-slate-400 text-right">Net Wt. 15g</span>
            </div>
            {/* Tube */}
            <div className="w-16 h-7 bg-gradient-to-r from-slate-100 via-white to-slate-200 rounded-r-md border border-slate-300 shadow-sm flex items-center justify-between px-1">
              <div className="w-2 h-4 bg-violet-600 rounded-l-sm" />
              <span className="text-[7px] font-bold text-slate-700 truncate">{name}</span>
            </div>
          </div>
        ) : form === 'Syrup' || form === 'Dry Syrup' || form === 'Drops' ? (
          <div className="flex items-center gap-2">
            {/* Syrup Box */}
            <div className="w-18 h-28 bg-white rounded shadow-md border border-slate-300 flex flex-col justify-between p-1.5">
              <div className="text-[7px] font-bold text-slate-400">BIOPHAR</div>
              <div className="text-center">
                <span className="text-[10px] font-extrabold text-slate-800 leading-tight block line-clamp-1">{name}</span>
                <span className="text-[7px] text-emerald-600 font-semibold">{form}</span>
                <div className="h-1 w-full rounded mt-1" style={{ backgroundColor: accent }} />
              </div>
              <div className="text-[6px] text-slate-400 flex justify-between">
                <span>100 ml</span>
                <span>Oral Sol.</span>
              </div>
            </div>
            {/* Bottle */}
            <div className="w-10 h-22 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-lg shadow-md border border-amber-900 flex flex-col items-center justify-between p-1">
              <div className="w-6 h-3 bg-white rounded-t-sm shadow-sm" />
              <div className="w-8 bg-white/90 rounded p-0.5 text-center">
                <span className="text-[6px] font-bold text-slate-800 block truncate">{name}</span>
              </div>
              <div className="w-5 h-1 bg-amber-500/50 rounded" />
            </div>
          </div>
        ) : (
          /* Default: Tablet & Capsule Box + Blister Strip */
          <div className="flex items-center gap-2">
            {/* Medicine Box */}
            <div className="w-22 h-28 bg-white rounded-md shadow-md border border-slate-300 flex flex-col justify-between p-1.5 relative group">
              <div className="flex justify-between items-center text-[7px] font-bold text-slate-400">
                <span className="text-sky-700 font-extrabold">BIOPHAR</span>
                <span className="text-rose-600">Rx</span>
              </div>

              <div className="text-center my-auto">
                <div className="h-1.5 w-full rounded-sm mb-1.5" style={{ backgroundColor: accent }} />
                <span className="text-[11px] font-extrabold text-slate-900 leading-tight block line-clamp-2">
                  {name}
                </span>
                <span className="text-[7px] font-semibold text-slate-500 uppercase tracking-wider block mt-0.5">
                  {form}s
                </span>
              </div>

              <div className="border-t border-slate-100 pt-1 flex justify-between items-end text-[6px] text-slate-400">
                <span>10x10</span>
                <span className="font-semibold text-slate-600">Alu Alu</span>
              </div>
            </div>

            {/* Foil Blister Strip (Alu Alu) */}
            <div className="w-14 h-24 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 rounded-md border border-slate-300 shadow-sm p-1 grid grid-cols-2 gap-1 place-items-center">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full bg-gradient-to-br from-white via-slate-200 to-slate-400 shadow-inner border border-slate-300 flex items-center justify-center"
                >
                  <div className="w-2 h-2 rounded-full bg-slate-100 opacity-60 shadow-sm" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Brand Watermark / Stamp */}
      <div className="absolute top-1.5 left-2 flex items-center gap-1">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
        <span className="text-[8px] font-extrabold tracking-wider text-slate-500 uppercase">BIOPHAR</span>
      </div>

      {/* Form badge in corner */}
      <span className="absolute top-1.5 right-2 px-1.5 py-0.5 bg-slate-900/5 text-slate-600 text-[8px] font-semibold rounded backdrop-blur-xs">
        {form}
      </span>
    </div>
  );
};
