// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Edit3, Trash2, Check } from 'lucide-react';
import { resolveImageUrl } from '../utils/imageResolver';

export default function ProductCard({ product, addToCart, onEdit, onDelete }) {
  if (!product) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [added, setAdded] = useState(false);
  const [editForm, setEditForm] = useState({
    name: product.name || '',
    price: product.price ?? 0
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    onEdit(product._id, { ...editForm, price: Number(editForm.price) });
    setIsEditing(false);
  };

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group bg-white border border-slate-200/80 hover:border-indigo-400/80 rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="p-4 space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1.5 rounded-md font-semibold transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-1.5 rounded-md font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Top Product Image Box */}
          <Link
            to={`/product/${product._id}`}
            className="block relative w-full h-48 bg-slate-50 border-b border-slate-100 overflow-hidden"
          >
            <img
              src={resolveImageUrl(product.image)}
              alt={product.name || 'Product'}
              className="w-full h-full object-contain p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ease-out"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
              }}
            />
            {product.isPopular && (
              <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                Popular
              </span>
            )}
          </Link>

          {/* Card Body */}
          <div className="p-4 flex flex-col flex-1 justify-between gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                  {product.category || 'General'}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded transition"
                    title="Edit item"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <Link to={`/product/${product._id}`} className="no-underline text-inherit block">
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-indigo-600 transition-colors m-0">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1 min-h-[32px] m-0">
                {product.specs || product.description || 'Standard specifications'}
              </p>

              <div className="flex items-center gap-1 mt-2">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 text-amber-900 px-1.5 py-0.5 rounded text-[11px] font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{product.rating ? Number(product.rating).toFixed(1) : '4.2'}</span>
                </div>
              </div>
            </div>

            {/* Price & Action Button */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-400 font-medium block leading-none mb-0.5">Price</span>
                <span className="text-base font-black text-slate-900">
                  ₹{Number(product.price || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" /> Add
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}