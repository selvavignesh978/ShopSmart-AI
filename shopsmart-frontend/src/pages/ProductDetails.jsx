import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageSquare,
  Send,
  User,
  Plus,
  Minus,
  Check,
  Zap,
  PackageCheck,
  Ban,
  BatteryCharging,
  Layers
} from "lucide-react";
import { productService, recommendationService } from "../services/api";
import ProductCard from "../components/ProductCard";

const BACKEND_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

const resolveImageUrl = (img) => {
  if (!img || typeof img !== 'string') {
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
  }

  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
    return encodeURI(img);
  }

  let formattedPath = img.replace(/^\.?\//, '/');
  if (!formattedPath.startsWith('/')) {
    formattedPath = `/${formattedPath}`;
  }

  return encodeURI(`${BACKEND_BASE_URL}${formattedPath}`);
};

export default function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      reviewer: "Ramesh Kumar",
      rating: 5,
      comment: "Absolutely amazing product! Exceeded my expectations, and the shipping was fast.",
      date: "12-06-2026"
    },
    {
      id: 2,
      reviewer: "Sneha J.",
      rating: 4,
      comment: "Very solid build quality. Highly recommended for daily use.",
      date: "10-06-2026"
    }
  ]);

  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewerRating] = useState(5);
  const [reviewComment, setReviewerComment] = useState("");

  useEffect(() => {
    const fetchProductAndRecs = async () => {
      setLoading(true);
      try {
        const foundItem = await productService.getProductById(id);
        setProduct(foundItem);
        setQuantity(1);

        const token = localStorage.getItem('shopsmart_token');
        if (token && foundItem) {
          recommendationService.logView(foundItem._id).catch(() => {});
        }

        if (foundItem) {
          const allCatalog = await productService.getProducts({ category: foundItem.category });
          const filtered = (allCatalog || []).filter(p => p._id !== foundItem._id).slice(0, 4);
          setRecommendations(filtered);
        }
      } catch (err) {
        console.error("Failed to load item details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRecs();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newReview = {
      id: Date.now(),
      reviewer: reviewerName.trim() || "Anonymous Shopper",
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
      date: new Date().toLocaleDateString("en-IN")
    };

    setReviews([newReview, ...reviews]);

    const token = localStorage.getItem('shopsmart_token');
    if (token && product) {
      try {
        await productService.createReview(product._id, {
          rating: Number(reviewRating),
          comment: reviewComment.trim()
        });
      } catch (err) {
        console.warn("Backend review sync note:", err.message);
      }
    }

    setReviewerName("");
    setReviewerComment("");
    setReviewerRating(5);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <span className="text-sm text-gray-500 font-medium">Loading product specifications...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The item you are looking for does not exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition">
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const rawStock = product.stock !== undefined && product.stock !== null ? Number(product.stock) : 25;
  const stockCount = rawStock > 0 ? rawStock : 25;
  const isOutOfStock = false;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10">
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Previous View
      </button>

      {/* Main Showcase Grid */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 md:p-10">
        
        {/* Left: Product Image */}
        <div className="lg:col-span-6 w-full h-[350px] sm:h-[480px] bg-gradient-to-b from-slate-50 to-gray-50 border border-gray-100 rounded-3xl overflow-hidden flex items-center justify-center relative p-6">
          <img
            src={resolveImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transform hover:scale-105 transition duration-500 ease-out"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80";
            }}
          />
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category & Stock Badges */}
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100/80 px-3.5 py-1.5 rounded-full">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                {product.category || 'General'}
              </span>

              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  <Ban className="w-3.5 h-3.5" /> Out of Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {stockCount} In Stock
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-snug m-0">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-amber-800 px-3 py-1 rounded-xl font-extrabold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating ? Number(product.rating).toFixed(1) : "4.2"}</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                ({product.numReviews || reviews.length} verified ratings)
              </span>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed m-0 pt-1">
              {product.description || "High quality product crafted with premium materials and dependable performance."}
            </p>

            {/* Price */}
            <div className="pt-4 pb-2 border-y border-gray-100 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                ₹{Number(product.price || 0).toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                Inclusive of all taxes
              </span>
            </div>

            {/* Structured Technical Specifications */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" /> Technical Specifications
              </span>

              {product.specs ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.specs.split(',').map((spec, index) => {
                    const trimmed = spec.trim();
                    if (!trimmed) return null;
                    return (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-xs font-semibold text-gray-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                        <span className="truncate">{trimmed}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-gray-500 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                  Standard manufacturer specifications.
                </div>
              )}

              {product.battery && (
                <div className="inline-flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl font-bold mt-1">
                  <BatteryCharging className="w-4 h-4 text-emerald-600" />
                  <span>{product.battery} Battery Backup</span>
                </div>
              )}
            </div>
          </div>

          {/* Stepper & Add to Cart */}
          <div className="space-y-6 pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center justify-between border-2 border-gray-200 rounded-2xl bg-slate-50 p-1">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-gray-600 hover:text-indigo-600 disabled:text-gray-300 transition cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-extrabold text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= stockCount}
                  onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                  className="p-2.5 text-gray-600 hover:text-indigo-600 disabled:text-gray-300 transition cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md ${
                  added
                    ? "bg-emerald-600 text-white shadow-emerald-500/20"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 active:scale-[0.99] cursor-pointer"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Item Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-[11px] sm:text-xs text-gray-500 font-semibold">
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Express Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                <RotateCcw className="w-4 h-4 text-indigo-600" />
                <span>7-Day Return</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Secure Warranty</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-10 space-y-8">
        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4 m-0">
          <MessageSquare className="w-5 h-5 text-indigo-600" /> Public Reviews & Feedback
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-slate-50 border border-slate-100 p-5 rounded-2xl h-fit">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Ajay"
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewerRating(Number(e.target.value))}
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="3">⭐⭐⭐ 3 Stars</option>
                  <option value="2">⭐⭐ 2 Stars</option>
                  <option value="1">⭐ 1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comments</label>
                <textarea
                  rows="3"
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder="Share your thoughts about this item..."
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Submit Review
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Latest Reviews ({reviews.length})</h3>
            
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
              {reviews.map((rev) => (
                <div key={rev.id} className="border border-gray-100 bg-white p-4 rounded-2xl shadow-xs flex gap-3 items-start">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-gray-900 truncate m-0">{rev.reviewer}</h4>
                      <span className="text-xs text-gray-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 my-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3 h-3 ${
                            idx < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed m-0">{rev.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-6 pt-4">
          <h2 className="text-xl font-extrabold text-gray-900 m-0">Similar Products You May Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                addToCart={addToCart}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}