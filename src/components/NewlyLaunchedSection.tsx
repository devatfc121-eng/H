import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  ShoppingCart,
  CheckCircle,
  X,
  Calendar,
  Layers,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../types';
import { ProductPackVisual } from './ProductPackVisual';

interface NewlyLaunchedSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string, productName: string) => void;
  onAddNewProduct: () => void;
  isAdminMode: boolean;
}

export const NewlyLaunchedSection: React.FC<NewlyLaunchedSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onEditProduct,
  onDeleteProduct,
  onAddNewProduct,
  isAdminMode,
}) => {
  // Filter newly launched products (or take products marked isNew / created recently)
  const newlyLaunchedProducts = products.filter((p) => p.isNew || p.badgeColor === '#e11d48' || p.isFastMoving);
  const displayList = newlyLaunchedProducts.length > 0 ? newlyLaunchedProducts : products.slice(0, 4);

  return (
    <section id="section-newly-launched" className="px-4 sm:px-6 pt-4 pb-3">
      <div className="bg-gradient-to-br from-emerald-950/5 via-slate-50 to-teal-900/5 rounded-3xl p-4 sm:p-5 border border-emerald-200/70 shadow-xs">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3 h-3" />
                Newly Launched
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                {displayList.length} New Formulations
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-1">
              Newly Launched Products
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Latest authorized DCGI approved molecules ready for immediate doctor detailing & sample distribution.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="btn-add-newly-launched"
              onClick={onAddNewProduct}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              title="Add a new product to Newly Launched"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Add Newly Launched</span>
            </button>
          </div>
        </div>

        {/* Horizontal scrollable / Grid of Newly Launched Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayList.map((product) => (
            <div
              key={product.id}
              id={`newly-launched-card-${product.id}`}
              className="bg-white rounded-2xl p-3.5 border border-emerald-200/80 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between group relative"
            >
              {/* Card Top Meta */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ★ LATEST RELEASE
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    GST {product.gst}%
                  </span>
                </div>

                {/* Visual Pack */}
                <div
                  className="cursor-pointer my-1"
                  onClick={() => onSelectProduct(product)}
                >
                  <ProductPackVisual
                    name={product.name}
                    form={product.form}
                    color={product.badgeColor || '#059669'}
                    composition={product.composition}
                    image={product.image}
                    size="md"
                  />
                </div>

                {/* Product Info */}
                <div
                  className="cursor-pointer mt-2"
                  onClick={() => onSelectProduct(product)}
                >
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[11px] font-bold text-emerald-800 line-clamp-1 mt-0.5">
                    {product.packaging} • {product.form}
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-tight" title={product.composition}>
                    {product.composition}
                  </p>

                  {/* Speciality Badge */}
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {product.speciality}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-[9px] font-bold text-slate-600 uppercase block">
                      MRP
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      ₹ {product.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    id={`btn-cart-newly-${product.id}`}
                    onClick={(e) => onAddToCart(product, e)}
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all active:scale-95 border border-emerald-200"
                    title="Add to Doctor Cart / Sample Request"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-dashed border-slate-200">
                  <button
                    id={`btn-edit-newly-${product.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProduct(product);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    id={`btn-delete-newly-${product.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete "${product.name}" from Newly Launched?`)) {
                        onDeleteProduct(product.id, product.name);
                      }
                    }}
                    className="py-1.5 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
