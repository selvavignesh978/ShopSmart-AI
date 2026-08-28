import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  MapPin,
  AlertCircle,
  Pencil,
  Check,
  X,
  CreditCard
} from 'lucide-react';
import { paymentService } from '../services/api';
import { resolveImageUrl } from '../utils/imageResolver';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await paymentService.getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await paymentService.cancelOrder(orderId);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleStartEdit = (order) => {
    setEditingOrderId(order._id);
    setAddressForm({
      street: order.shippingAddress?.street || '',
      city: order.shippingAddress?.city || '',
      state: order.shippingAddress?.state || '',
      pincode: order.shippingAddress?.pincode || '',
      landmark: order.shippingAddress?.landmark || ''
    });
  };

  const handleSaveAddress = async (orderId) => {
    if (!addressForm.street || !addressForm.city || !addressForm.pincode) {
      alert('Please fill in street, city, and pincode');
      return;
    }

    setIsUpdating(true);
    try {
      await paymentService.updateOrderAddress(orderId, addressForm);
      setEditingOrderId(null);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order address');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 m-0">
          My Orders & Receipts
        </h1>
        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">
          {orders.length} Order(s)
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl shadow-xs">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">You have not placed any orders yet.</p>
          <Link
            to="/"
            className="mt-3 inline-block text-sm text-indigo-600 font-bold hover:underline"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-100 rounded-2xl shadow-xs p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 text-xs">
                <div>
                  <span className="text-gray-400 font-bold uppercase">Order ID: </span>
                  <span className="font-mono text-gray-800 font-bold">
                    {order.paymentIntentId || order._id}
                  </span>
                </div>
                <div className="text-gray-400">
                  Placed on:{' '}
                  <span className="text-gray-700 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div>
                  {order.paymentStatus === 'paid' && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                    </span>
                  )}
                  {order.paymentStatus === 'cancelled' && (
                    <span className="inline-flex items-center gap-1 text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full font-bold">
                      <XCircle className="w-3.5 h-3.5" /> Cancelled
                    </span>
                  )}
                  {order.paymentStatus === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-bold">
                      <AlertCircle className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-50">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center p-1 shrink-0">
                        <img
                          src={resolveImageUrl(item.product?.image || item.image)}
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80';
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 m-0">{item.name}</h4>
                        <p className="text-xs text-gray-400 m-0">
                          Qty: {item.quantity} × ₹
                          {Number(item.price || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      ₹
                      {(
                        Number(item.price || 0) * (item.quantity || 1)
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-gray-600">
                {editingOrderId === order._id ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between font-bold text-gray-700 pb-1 border-b border-gray-200">
                      <span>Edit Delivery Address</span>
                      <button
                        onClick={() => setEditingOrderId(null)}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={addressForm.street}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, street: e.target.value })
                        }
                        className="p-2 border border-gray-200 rounded-lg bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, city: e.target.value })
                        }
                        className="p-2 border border-gray-200 rounded-lg bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, state: e.target.value })
                        }
                        className="p-2 border border-gray-200 rounded-lg bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={addressForm.pincode}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, pincode: e.target.value })
                        }
                        className="p-2 border border-gray-200 rounded-lg bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Landmark"
                        value={addressForm.landmark}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, landmark: e.target.value })
                        }
                        className="p-2 border border-gray-200 rounded-lg bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500 sm:col-span-2"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => setEditingOrderId(null)}
                        className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveAddress(order._id)}
                        disabled={isUpdating}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1 cursor-pointer disabled:bg-indigo-300"
                      >
                        <Check className="w-3.5 h-3.5" /> Save Address
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-700">Delivered to: </span>
                        {order.shippingAddress?.street}, {order.shippingAddress?.city},{' '}
                        {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                        {order.shippingAddress?.landmark &&
                          ` (Landmark: ${order.shippingAddress.landmark})`}
                      </div>
                    </div>

                    {order.paymentStatus !== 'cancelled' && (
                      <button
                        onClick={() => handleStartEdit(order)}
                        className="text-indigo-600 hover:text-indigo-800 p-1.5 hover:bg-indigo-50 rounded-lg transition shrink-0 inline-flex items-center gap-1 font-semibold cursor-pointer"
                        title="Edit Delivery Address"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Card & Payment Metadata */}
              {order.cardDetails?.last4 && (
                <div className="flex items-center gap-2 text-xs text-slate-700 bg-indigo-50/60 border border-indigo-100 p-2.5 rounded-xl font-medium">
                  <CreditCard className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Paid with</span>
                  <span className="uppercase font-bold text-indigo-700">{order.cardDetails.brand}</span>
                  <span className="font-mono font-semibold">•••• {order.cardDetails.last4}</span>
                  {order.cardDetails.expMonth && (
                    <span className="text-slate-400">
                      (Exp: {order.cardDetails.expMonth}/{order.cardDetails.expYear})
                    </span>
                  )}
                </div>
              )}

              {/* Total & Action */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400 block">
                    Total Charged
                  </span>
                  <span className="text-lg font-black text-indigo-600">
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
                {order.paymentStatus !== 'cancelled' && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition cursor-pointer"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}