import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { resolveImageUrl } from '../utils/imageResolver';

export default function CartItem({ item, removeFromCart, onUpdateQuantity }) {
  if (!item) return null;

  const quantity = Number(item.quantity) || 1;
  const unitPrice = Number(item.price ?? item.product?.price ?? item.productId?.price ?? 0);
  const itemTotal = unitPrice * quantity;
  const productId = item._id || item.product?._id || item.productId?._id;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 border border-gray-100 rounded-2xl shadow-xs gap-4 transition hover:border-gray-200">
      {/* Left Segment: Image Thumbnail & Product Details */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center p-1.5">
          <img 
            src={resolveImageUrl(item.image || item.product?.image || item.productId?.image)} 
            alt={item.name || 'Cart item'} 
            className="w-full h-full object-contain mix-blend-multiply"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80";
            }}
          />
        </div>
        
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate m-0">
            {item.name || item.product?.name || item.productId?.name || 'Product'}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-indigo-600 font-extrabold">
              ₹{itemTotal.toLocaleString('en-IN')}
            </span>
            {quantity > 1 && (
              <span className="text-xs text-gray-400 font-medium">
                (₹{unitPrice.toLocaleString('en-IN')} each)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Segment: Quantity Stepper & Remove Action */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
        <div className="flex items-center border border-gray-200 rounded-xl bg-slate-50 p-0.5">
          <button
            type="button"
            onClick={() => onUpdateQuantity && onUpdateQuantity(productId, Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="p-1.5 text-gray-500 hover:text-indigo-600 disabled:text-gray-300 transition cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          
          <span className="w-8 text-center text-xs font-bold text-gray-800">
            {quantity}
          </span>
          
          <button
            type="button"
            onClick={() => onUpdateQuantity && onUpdateQuantity(productId, quantity + 1)}
            className="p-1.5 text-gray-500 hover:text-indigo-600 transition cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => removeFromCart && removeFromCart(productId)}
          className="text-gray-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition cursor-pointer"
          aria-label="Remove item"
          title="Remove from Cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}