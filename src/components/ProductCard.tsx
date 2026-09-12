import React from 'react';
import { ShoppingCart, Trash2, Edit2, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductPackVisual } from './ProductPackVisual';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onDeleteProduct?: (productId: string, productName: string, e: React.MouseEvent) => void;
  onEditProduct?: (product: Product, e: React.MouseEvent) => void;
  isAdminMode: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onDeleteProduct,
  onEditProduct,
  isAdminMode,
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-2xl p-3 sm:p-3.5 shadow-xs hover:shadow-md border border-slate-100/90 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Meta: BIOPHAR Logo & GST Tag matching screenshot 1 */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-extrabold text-sky-700 tracking-wider">
            {product.brand || 'BIOPHAR'}
          </span>
          {product.isNew && (
            <span className="bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
              NEW
            </span>
          )}
        </div>
        <span className="text-[8px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
          GST: {product.gst}%
        </span>
      </div>

      {/* Visual Pharma Medicine Pack Visual */}
      <div className="my-1">
        <ProductPackVisual
          name={product.name}
          form={product.form}
          color={product.badgeColor}
          composition={product.composition}
          image={product.image}
          size="md"
        />
      </div>

      {/* Product Content Details matching screenshot 1 */}
      <div className="mt-2 text-left">
        {/* Product Title */}
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-sky-700 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Packaging details */}
        <p className="text-xs font-semibold text-slate-600 mt-0.5">
          {product.packaging}
        </p>

        {/* Composition preview */}
        <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5" title={product.composition}>
          {product.composition}
        </p>

        {/* Price & Add to Cart Action Row matching screenshot */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider block">
              MRP:
            </span>
            <span className="text-sm sm:text-base font-black text-slate-900">
              ₹ {product.mrp.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Cart / Sample Order Blue Button matching screenshot 1 */}
          <div className="flex items-center gap-1">
            <button
              id={`add-cart-btn-${product.id}`}
              type="button"
              onClick={(e) => onAddToCart(product, e)}
              className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white flex items-center justify-center transition-all duration-150 active:scale-90 border border-sky-200 shadow-xs"
              title="Add to Doctor Cart / Sample Request"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin Controls (When Admin Mode is active or on hover): Delete & Edit */}
        {isAdminMode && (
          <div className="mt-2 pt-2 border-t border-dashed border-slate-200 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={(e) => onEditProduct && onEditProduct(product, e)}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
            <button
              id={`delete-btn-${product.id}`}
              type="button"
              onClick={(e) => onDeleteProduct && onDeleteProduct(product.id, product.name, e)}
              className="py-1 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
              title="Delete Product"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
