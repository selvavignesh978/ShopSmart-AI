// D:\finalproject\shopsmart-frontend\src\pages\Cart.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CartItem from '../components/CartItem';
import {
  ArrowLeft,
  MapPin,
  PlusCircle,
  CheckCircle2,
  Loader2,
  Home,
  Building,
  Pencil,
  Trash2,
  Lock,
  CreditCard,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { authService, paymentService } from '../services/api';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

function CustomCardPaymentForm({
  cart,
  totalPrice,
  shippingAddress,
  clearCart,
  setErrorMsg,
  isAddressValid
}) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardForm, setCardForm] = useState({
    holderName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: ''
  });

  const formatCardNumber = (value) => {
    const clean = value.replace(/\D/g, '').slice(0, 16);
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleCustomPay = async (e) => {
    e.preventDefault();

    if (!isAddressValid) {
      setErrorMsg('Please select a valid delivery address.');
      return;
    }

    const cleanCardNumber = cardForm.cardNumber.replace(/\s+/g, '');
    if (cleanCardNumber.length < 13) {
      setErrorMsg('Please enter a valid card number (13-16 digits).');
      return;
    }

    if (!cardForm.holderName.trim()) {
      setErrorMsg('Please enter the Cardholder Name.');
      return;
    }

    if (!cardForm.expMonth || !cardForm.expYear) {
      setErrorMsg('Please select expiry month and year.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const sanitizedItems = cart.map((item) => {
        const resolvedId =
          item.product?._id ||
          (typeof item.product === 'string' ? item.product : null) ||
          item.productId?._id ||
          (typeof item.productId === 'string' ? item.productId : null) ||
          item._id ||
          item.id;

        return {
          _id: resolvedId,
          product: resolvedId,
          name: item.productId?.name || item.product?.name || item.name || 'Product',
          price: Number(item?.productId?.price ?? item?.price ?? item?.product?.price ?? 0),
          quantity: Number(item?.quantity ?? 1),
          image: item.productId?.image || item.product?.image || item.image || ''
        };
      });

      await paymentService.payWithCustomCard({
        items: sanitizedItems,
        totalAmount: totalPrice,
        shippingAddress,
        cardDetails: {
          holderName: cardForm.holderName.trim(),
          cardNumber: cleanCardNumber,
          expMonth: cardForm.expMonth,
          expYear: cardForm.expYear
        }
      });

      if (typeof clearCart === 'function') clearCart();
      navigate('/orders');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Payment failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleCustomPay} className="space-y-3 pt-2">
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
          Cardholder Name
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Ajay Kumar"
          value={cardForm.holderName}
          onChange={(e) => setCardForm({ ...cardForm, holderName: e.target.value })}
          className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            required
            placeholder="XXXX XXXX XXXX XXXX"
            value={cardForm.cardNumber}
            onChange={(e) => setCardForm({ ...cardForm, cardNumber: formatCardNumber(e.target.value) })}
            className="w-full p-2.5 pr-10 bg-slate-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
          <CreditCard className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Month</label>
          <select
            required
            value={cardForm.expMonth}
            onChange={(e) => setCardForm({ ...cardForm, expMonth: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">MM</option>
            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Year</label>
          <select
            required
            value={cardForm.expYear}
            onChange={(e) => setCardForm({ ...cardForm, expYear: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">YY</option>
            {['2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035'].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">CVV</label>
          <input
            type="password"
            maxLength={4}
            required
            placeholder="•••"
            value={cardForm.cvv}
            onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '') })}
            className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-mono text-center outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isProcessing || totalPrice <= 0}
        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3.5 rounded-2xl font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" /> Pay ₹{Number(totalPrice || 0).toLocaleString('en-IN')} & Place Order
          </>
        )}
      </button>
    </form>
  );
}

function StripePaymentForm({
  cart,
  totalPrice,
  shippingAddress,
  clearCart,
  setErrorMsg,
  isAddressValid
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (!isAddressValid) {
      setErrorMsg('Please select a valid delivery address before proceeding.');
      return;
    }

    if (!Array.isArray(cart) || cart.length === 0 || totalPrice <= 0) {
      setErrorMsg('Your cart is empty or has an invalid total.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const sanitizedItems = cart.map((item) => {
        const resolvedId =
          item.product?._id ||
          (typeof item.product === 'string' ? item.product : null) ||
          item.productId?._id ||
          (typeof item.productId === 'string' ? item.productId : null) ||
          item._id ||
          item.id;

        return {
          _id: resolvedId,
          product: resolvedId,
          name: item.productId?.name || item.product?.name || item.name || 'Product',
          price: Number(item?.productId?.price ?? item?.price ?? item?.product?.price ?? 0),
          quantity: Number(item?.quantity ?? 1),
          image: item.productId?.image || item.product?.image || item.image || ''
        };
      });

      const response = await paymentService.createOrder(
        sanitizedItems,
        totalPrice,
        shippingAddress
      );

      const clientSecret = response.clientSecret || response.data?.clientSecret;
      const dbOrderId = response.dbOrderId || response.data?.dbOrderId;

      if (!clientSecret) {
        throw new Error('Failed to obtain payment authorization secret.');
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'ShopSmart Customer',
            address: {
              line1: shippingAddress.street,
              city: shippingAddress.city,
              state: shippingAddress.state || 'Tamil Nadu',
              postal_code: String(shippingAddress.pincode),
              country: 'IN'
            }
          }
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent?.status === 'succeeded') {
        const paymentMethod = result.paymentIntent.payment_method;
        let cardMetadata = null;

        if (typeof paymentMethod === 'object' && paymentMethod?.card) {
          cardMetadata = {
            holderName: paymentMethod.billing_details?.name || 'Cardholder',
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            expMonth: paymentMethod.card.exp_month,
            expYear: paymentMethod.card.exp_year,
            paymentMethodId: paymentMethod.id
          };
        }

        await paymentService.verifyPayment({
          paymentIntentId: result.paymentIntent.id,
          dbOrderId: dbOrderId,
          cardDetails: cardMetadata
        });

        if (typeof clearCart === 'function') clearCart();
        navigate('/orders');
      }
    } catch (err) {
      console.error('Payment failed:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Payment card transaction failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmitPayment} className="space-y-4 pt-2">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-indigo-600" /> Stripe Sandbox Input
        </label>
        <div className="p-3.5 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 shadow-2xs">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#1e293b',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  '::placeholder': { color: '#94a3b8' }
                },
                invalid: { color: '#ef4444' }
              }
            }}
          />
        </div>
        <p className="text-[11px] text-gray-400 m-0">
          Stripe Sandbox: Use test card <code className="bg-slate-100 text-indigo-600 font-bold px-1.5 py-0.5 rounded">4242 4242 4242 4242</code>
        </p>
      </div>

      <button
        type="submit"
        disabled={isProcessing || !stripe || totalPrice <= 0}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3.5 rounded-2xl font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Authorizing Payment...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" /> Pay ₹{Number(totalPrice || 0).toLocaleString('en-IN')} with Stripe
          </>
        )}
      </button>
    </form>
  );
}

export default function Cart({ cart = [], removeFromCart, clearCart, updateQuantity }) {
  const [paymentMode, setPaymentMode] = useState('custom'); // 'custom' | 'stripe'
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Memoize Stripe Promise once so it never triggers "Unsupported prop change on Elements"
  const stripePromiseInstance = useMemo(() => {
    if (stripePublishableKey && stripePublishableKey.startsWith('pk_')) {
      return loadStripe(stripePublishableKey).catch(() => null);
    }
    return null;
  }, []);

  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false
  });

  const getItemPrice = (item) => {
    const rawPrice = item?.productId?.price ?? item?.price ?? item?.product?.price ?? 0;
    const parsed = Number(rawPrice);
    return isNaN(parsed) ? 0 : parsed;
  };

  const getItemQuantity = (item) => {
    const qty = Number(item?.quantity ?? 1);
    return isNaN(qty) || qty < 1 ? 1 : qty;
  };

  const totalUnits = (Array.isArray(cart) ? cart : []).reduce(
    (sum, item) => sum + getItemQuantity(item),
    0
  );

  const totalPrice = (Array.isArray(cart) ? cart : []).reduce((total, item) => {
    return total + getItemPrice(item) * getItemQuantity(item);
  }, 0);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  const fetchUserProfile = async () => {
    if (user) {
      try {
        const profile = await authService.me();
        if (profile?.addresses && profile.addresses.length > 0) {
          setAddresses(profile.addresses);
          const defaultIdx = profile.addresses.findIndex((a) => a.isDefault);
          setSelectedAddressIndex(defaultIdx !== -1 ? defaultIdx : 0);
        } else {
          setShowAddressForm(true);
        }
      } catch (err) {
        console.error('Failed to load profile addresses:', err);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleOpenAddForm = () => {
    setEditingAddressId(null);
    setAddressForm({
      street: '',
      city: '',
      state: 'Tamil Nadu',
      pincode: '',
      landmark: '',
      isDefault: false
    });
    setShowAddressForm(true);
  };

  const handleOpenEditForm = (addr, e) => {
    if (e) e.stopPropagation();
    setEditingAddressId(addr._id);
    setAddressForm({
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      landmark: addr.landmark || '',
      isDefault: addr.isDefault || false
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this delivery address?')) return;

    try {
      const updatedList = await authService.deleteAddress(addressId);
      setAddresses(updatedList || []);
      setSelectedAddressIndex(0);
      if (!updatedList || updatedList.length === 0) {
        setShowAddressForm(true);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete address.');
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.street || !addressForm.city || !addressForm.pincode) {
      setErrorMsg('Please complete street, city, and pincode.');
      return;
    }

    try {
      let updatedList;
      if (editingAddressId) {
        updatedList = await authService.updateAddress(editingAddressId, addressForm);
      } else {
        updatedList = await authService.addAddress(addressForm);
        setSelectedAddressIndex((updatedList?.length || 1) - 1);
      }

      setAddresses(updatedList || []);
      setShowAddressForm(false);
      setEditingAddressId(null);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save address.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition mb-6">
        <ArrowLeft className="w-4 h-4" /> Continue Browsing Catalog
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8 m-0">Checkout & Payment</h1>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          {errorMsg}
        </div>
      )}

      {!Array.isArray(cart) || cart.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl shadow-xs">
          <p className="text-gray-500 font-medium">Your cart selection is empty.</p>
          <Link to="/" className="mt-3 inline-block text-sm text-indigo-600 font-bold hover:underline">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 m-0">
                  <MapPin className="w-5 h-5 text-indigo-600" /> Select Delivery Address
                </h2>
                <button
                  type="button"
                  onClick={handleOpenAddForm}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Add New Address
                </button>
              </div>

              {addresses.length > 0 && !showAddressForm && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {addresses.map((addr, idx) => (
                    <div
                      key={addr._id || idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                        selectedAddressIndex === idx
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                          : 'border-gray-100 bg-slate-50/60 hover:border-gray-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                            {idx === 0 ? <Home className="w-3.5 h-3.5 text-indigo-500" /> : <Building className="w-3.5 h-3.5 text-indigo-500" />} Address #{idx + 1}
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            {selectedAddressIndex === idx && (
                              <CheckCircle2 className="w-4 h-4 text-indigo-600 mr-1" />
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleOpenEditForm(addr, e)}
                              className="p-1 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-white transition"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteAddress(addr._id, e)}
                              className="p-1 rounded-md text-gray-500 hover:text-red-600 hover:bg-white transition"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm font-bold text-gray-900 m-0">{addr.street}</p>
                        <p className="text-xs text-gray-600 m-0">{addr.city}, {addr.state} - {addr.pincode}</p>
                        {addr.landmark && <p className="text-[11px] text-gray-400 m-0">Landmark: {addr.landmark}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showAddressForm && (
                <form onSubmit={handleSaveAddress} className="space-y-4 pt-2 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 m-0">
                    {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 18 202 Karavilai"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chennai"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tamil Nadu"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pincode</label>
                      <input
                        type="text"
                        required
                        placeholder="600056"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Landmark</label>
                      <input
                        type="text"
                        placeholder="e.g. Near Kovil"
                        value={addressForm.landmark}
                        onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer"
                    >
                      {editingAddressId ? 'Update Address' : 'Save Address'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-900 m-0">
                Review Cart Items ({totalUnits} {totalUnits === 1 ? 'item' : 'items'})
              </h2>
              {cart.map((item, index) => (
                <CartItem 
                  key={item._id || item.productId?._id || index} 
                  item={item} 
                  removeFromCart={removeFromCart} 
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          </div>

          {/* Payment & Summary */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xs h-fit space-y-5">
            <h2 className="text-base font-bold text-gray-900 m-0">Payment Summary</h2>

            <div className="space-y-2 border-b border-gray-100 pb-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Items ({totalUnits})</span>
                <span className="font-bold text-gray-800">₹{Number(totalPrice || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-extrabold text-gray-900">
              <span>Total Payable</span>
              <span className="text-indigo-600">₹{Number(totalPrice || 0).toLocaleString('en-IN')}</span>
            </div>

            {/* Payment Method Selector */}
            <div className="border border-gray-100 rounded-2xl p-1 bg-slate-50 flex gap-1">
              <button
                type="button"
                onClick={() => {
                  setPaymentMode('custom');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  paymentMode === 'custom'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Custom Card (Any Card)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentMode('stripe');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  paymentMode === 'stripe'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Stripe Elements
              </button>
            </div>

            {/* Payment Form Renderer */}
            {paymentMode === 'custom' ? (
              <CustomCardPaymentForm
                cart={cart}
                totalPrice={totalPrice}
                shippingAddress={addresses[selectedAddressIndex]}
                clearCart={clearCart}
                setErrorMsg={setErrorMsg}
                isAddressValid={Boolean(addresses[selectedAddressIndex])}
              />
            ) : stripePromiseInstance ? (
              <Elements stripe={stripePromiseInstance}>
                <StripePaymentForm
                  cart={cart}
                  totalPrice={totalPrice}
                  shippingAddress={addresses[selectedAddressIndex]}
                  clearCart={clearCart}
                  setErrorMsg={setErrorMsg}
                  isAddressValid={Boolean(addresses[selectedAddressIndex])}
                />
              </Elements>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs space-y-2">
                <p className="flex items-center gap-1.5 font-bold m-0">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Stripe is not configured or blocked on this network.
                </p>
                <p className="m-0">
                  Use the <strong>Custom Card (Any Card)</strong> tab to place your order.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}