import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  ShoppingCart,
  Check,
  ChevronRight,
  Minimize2,
  Maximize2,
  RotateCcw,
  Heart,
  Award
} from "lucide-react";
import { productService, cartService, wishlistService } from "../services/api";
import { resolveImageUrl } from "../utils/imageResolver";
import "./AISearch.css";

export default function AISearch({ onFilterResults, onAddToCart }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState({});
  const [wishlistIds, setWishlistIds] = useState({});
  const messagesEndRef = useRef(null);

  const [conversationState, setConversationState] = useState({
    step: "IDLE",
    category: null,
    subcategory: null,
    maxPrice: null,
    minPrice: null,
    preferredFeature: null,
    lastResults: []
  });

  const welcomeMessage = {
    id: 1,
    sender: "bot",
    text: "👋 Hello! I am your **ShopSmart AI Personal Concierge**.\n\nI can guide you step-by-step to find the perfect product suited to your budget and specifications.\n\nWhat are you looking to buy today?",
    quickActions: [
      "💻 Find a Laptop",
      "📱 Buy a Smartphone",
      "🎧 Wireless Headphones",
      "👟 Running Shoes",
      "🏠 Home Appliances"
    ]
  };

  const [messages, setMessages] = useState([welcomeMessage]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const items = await productService.getProducts({ limit: 100 });
        setCatalog(items || []);
      } catch (err) {
        console.error("Failed to load catalog into AI Concierge:", err);
      }
    };
    fetchCatalog();
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  const handleCartAdd = async (product) => {
    if (!product) return;
    setAddedItemIds((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product._id]: false }));
    }, 2000);

    const token = localStorage.getItem("shopsmart_token");
    if (token) {
      try {
        await cartService.addToCart(product._id, 1);
      } catch (err) {
        console.warn("Backend cart sync fallback:", err.message);
      }
    }

    if (typeof onAddToCart === "function") {
      onAddToCart(product);
    }
  };

  const handleWishlistToggle = async (product) => {
    if (!product) return;
    const token = localStorage.getItem("shopsmart_token");
    if (!token) {
      navigate('/login');
      return;
    }

    setWishlistIds((prev) => ({ ...prev, [product._id]: !prev[product._id] }));
    try {
      if (!wishlistIds[product._id]) {
        await wishlistService.addToWishlist(product._id);
      } else {
        await wishlistService.removeFromWishlist(product._id);
      }
    } catch (err) {
      console.warn("Wishlist sync note:", err.message);
    }
  };

  const generateBadge = (product, index) => {
    if (index === 0 && (product.rating >= 4.4 || product.isPopular)) {
      return { badge: "Best Overall", desc: "Top balance of performance, user rating, and durability." };
    }
    if (index === 1) {
      return { badge: "Best Value", desc: "Feature-packed specifications at a very competitive price." };
    }
    if (product.battery === 'Excellent') {
      return { badge: "Battery Champ", desc: "Optimized for heavy, all-day power efficiency." };
    }
    return { badge: "Editor's Pick", desc: `Equipped with ${product.specs?.split(',')[0] || 'high-tier components'}.` };
  };

  const processConversation = useCallback(async (userText) => {
    const text = userText.toLowerCase().trim();

    if (text === "reset" || text === "restart" || text === "clear" || text === "start over") {
      setConversationState({
        step: "IDLE",
        category: null,
        subcategory: null,
        maxPrice: null,
        minPrice: null,
        preferredFeature: null,
        lastResults: []
      });
      return {
        text: "🔄 I've refreshed our consultation. What category or product would you like to explore?",
        quickActions: ["💻 Laptops", "📱 Smartphones", "🎧 Audio & Earbuds", "👟 Footwear", "🏠 Home & Kitchen"]
      };
    }

    if (text.includes("compare")) {
      const targets = conversationState.lastResults.length >= 2 
        ? conversationState.lastResults.slice(0, 2) 
        : catalog.slice(0, 2);
        
      if (targets.length >= 2) {
        const [a, b] = targets;
        return {
          text: `📊 **Specification Comparison:**\n\n🔹 **${a.name}**\n• Price: ₹${Number(a.price).toLocaleString('en-IN')}\n• Rating: ★ ${a.rating}\n• Specs: ${a.specs}\n\n🔹 **${b.name}**\n• Price: ₹${Number(b.price).toLocaleString('en-IN')}\n• Rating: ★ ${b.rating}\n• Specs: ${b.specs}\n\n💡 **Recommendation**: Choose **${a.price < b.price ? a.name : b.name}** for maximum value, or **${a.rating >= b.rating ? a.name : b.name}** for premium user ratings.`,
          results: [a, b],
          quickActions: [`Add ${a.name.split(' ').slice(0, 2).join(' ')} to Cart`, `Add ${b.name.split(' ').slice(0, 2).join(' ')} to Cart`, "Explore more options"]
        };
      }
    }

    const categoryDetect = {
      laptop: { cat: "Electronics", sub: "laptop", label: "Laptop" },
      phone: { cat: "Electronics", sub: "phone", label: "Smartphone" },
      smartphone: { cat: "Electronics", sub: "phone", label: "Smartphone" },
      headphone: { cat: "Electronics", sub: "headphones", label: "Headphones / Audio" },
      earbuds: { cat: "Electronics", sub: "earbuds", label: "Wireless Earbuds" },
      shoes: { cat: "Fashion", sub: "shoes", label: "Shoes & Footwear" },
      sneakers: { cat: "Fashion", sub: "sneakers", label: "Sneakers" },
      watch: { cat: "Fashion", sub: "watch", label: "Wrist Watch" },
      home: { cat: "Home", sub: null, label: "Home Appliances" },
      tv: { cat: "Electronics", sub: "tv", label: "Smart TV" }
    };

    const detectedKey = Object.keys(categoryDetect).find(k => text.includes(k));

    if (detectedKey && conversationState.step === "IDLE" && !text.includes("under") && !text.includes("below") && !text.includes("₹")) {
      const { cat, sub, label } = categoryDetect[detectedKey];
      setConversationState(prev => ({
        ...prev,
        step: "SELECT_BUDGET",
        category: cat,
        subcategory: sub
      }));

      return {
        text: `🎯 **Step 1 of 2: Budget Planning**\n\nGreat choice! Let's narrow down options for **${label}**.\n\nWhat is your preferred price bracket?`,
        quickActions: [
          `Under ₹20,000`,
          `₹20,000 - ₹40,000`,
          `₹40,000 - ₹60,000`,
          `Above ₹60,000`
        ]
      };
    }

    if (conversationState.step === "SELECT_BUDGET") {
      let maxP = 100000;
      let minP = 0;

      if (text.includes("20,000") && text.includes("under")) { maxP = 20000; minP = 0; }
      else if (text.includes("20,000") && text.includes("40,000")) { minP = 20000; maxP = 40000; }
      else if (text.includes("40,000") && text.includes("60,000")) { minP = 40000; maxP = 60000; }
      else if (text.includes("above") || text.includes("60,000")) { minP = 60000; maxP = 500000; }

      setConversationState(prev => ({
        ...prev,
        step: "SELECT_FEATURE",
        minPrice: minP,
        maxPrice: maxP
      }));

      return {
        text: `⚡ **Step 2 of 2: Feature Preference**\n\nBudget noted (₹${minP.toLocaleString('en-IN')} – ₹${maxP.toLocaleString('en-IN')}).\n\nWhat is your top priority for this purchase?`,
        quickActions: [
          "🔋 Best Battery Life",
          "🚀 High Performance & Speed",
          "🪶 Lightweight & Compact",
          "⭐ Highest Rated Overall"
        ]
      };
    }

    try {
      const searchContext = {
        lastCategory: conversationState.category,
        lastSubcategory: conversationState.subcategory,
        lastMaxPrice: conversationState.maxPrice
      };

      const response = await productService.parseAISearch(userText, searchContext);
      let matched = response && response.length > 0 ? response : catalog.filter(p => {
        const matchesCategory = conversationState.category ? p.category === conversationState.category : true;
        const matchesSubcategory = conversationState.subcategory ? (p.name.toLowerCase().includes(conversationState.subcategory) || p.specs?.toLowerCase().includes(conversationState.subcategory)) : true;
        const matchesPrice = conversationState.maxPrice ? p.price <= conversationState.maxPrice : true;
        return matchesCategory && matchesSubcategory && matchesPrice;
      });

      if (matched.length > 0) {
        const topPicks = matched.slice(0, 3);
        setConversationState(prev => ({
          ...prev,
          step: "IDLE",
          lastResults: topPicks
        }));

        if (typeof onFilterResults === 'function') {
          onFilterResults(matched);
        }

        return {
          text: `🎉 **Personalized Recommendations Found!**\n\nBased on your selected criteria, here are the top **${topPicks.length} verified match(es)**:`,
          results: topPicks.map((p, idx) => ({
            ...p,
            recommendationBadge: generateBadge(p, idx)
          })),
          quickActions: [
            "📊 Compare Top 2 Options",
            "💰 Show me cheaper alternatives",
            "🔄 Start a new search"
          ]
        };
      }
    } catch (err) {
      console.warn("AI search error:", err);
    }

    const popularPicks = catalog.filter(p => p.isPopular).slice(0, 3);
    return {
      text: "I couldn't find an exact item matching those exact constraints. Here are our top customer-rated recommendations:",
      results: popularPicks.map((p, idx) => ({
        ...p,
        recommendationBadge: { badge: "Popular Choice", desc: "Top seller with 4.5+ star verified reviews." }
      })),
      quickActions: ["💻 Laptops under ₹40k", "📱 Best phones", "🔄 Reset Search"]
    };
  }, [catalog, conversationState, onFilterResults]);

  const handleSend = async (customText = null) => {
    const textToSend = (customText || query).trim();
    if (!textToSend || isLoading) return;

    setQuery("");
    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: textToSend }]);
    setIsLoading(true);

    try {
      const response = await processConversation(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: response.text,
          results: response.results || [],
          quickActions: response.quickActions || []
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "I encountered a minor network issue. Please select an option below or type your query again."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-search-container">
      <button
        className="chat-launcher-btn flex items-center justify-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open ShopSmart AI Shopping Concierge"
      >
        {isOpen ? (
          "✕"
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>ASK</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className={`chat-dialog-box ${isExpanded ? "expanded" : ""}`}>
          
          <div className="chat-header">
            <div className="avatar-info">
              <span className="bot-avatar">
                <Bot className="w-5 h-5 text-indigo-600" />
              </span>
              <div>
                <h4>ShopSmart Concierge</h4>
                <p className="status">Step-by-Step Shopping Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setMessages([welcomeMessage]);
                  setConversationState({
                    step: "IDLE",
                    category: null,
                    subcategory: null,
                    maxPrice: null,
                    minPrice: null,
                    preferredFeature: null,
                    lastResults: []
                  });
                }}
                className="header-icon-btn"
                title="Restart Consultation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="header-icon-btn"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-row ${
                  msg.sender === "user" ? "user justify-end" : "bot justify-start"
                }`}
              >
                <div
                  className={`flex items-start gap-2.5 max-w-[94%] ${
                    msg.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-full shrink-0 shadow-xs mt-0.5 ${
                      msg.sender === "user"
                        ? "bg-indigo-700 text-white"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex flex-col gap-2.5 w-full">
                    <div className="message-bubble whitespace-pre-line shadow-xs">
                      {msg.text}
                    </div>

                    {msg.results && msg.results.length > 0 && (
                      <div className="flex flex-col gap-2.5 w-full mt-1">
                        {msg.results.map((item) => (
                          <div
                            key={item._id}
                            className="bg-white border border-gray-100 hover:border-indigo-200 rounded-2xl p-3 shadow-xs transition flex flex-col gap-2"
                          >
                            <div className="flex gap-3 items-center">
                              <Link
                                to={`/product/${item._id}`}
                                className="w-16 h-16 rounded-xl bg-slate-50 border border-gray-100 shrink-0 overflow-hidden flex items-center justify-center p-1"
                              >
                                <img
                                  src={resolveImageUrl(item.image)}
                                  alt={item.name}
                                  className="w-full h-full object-contain mix-blend-multiply"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80";
                                  }}
                                />
                              </Link>

                              <div className="min-w-0 flex-1">
                                {item.recommendationBadge && (
                                  <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md mb-1">
                                    <Award className="w-3 h-3 text-indigo-600" />
                                    {item.recommendationBadge.badge}
                                  </span>
                                )}

                                <Link
                                  to={`/product/${item._id}`}
                                  className="no-underline text-inherit block"
                                >
                                  <h5 className="text-xs font-bold text-gray-900 truncate m-0 hover:text-indigo-600 transition">
                                    {item.name}
                                  </h5>
                                </Link>

                                <p className="text-[10.5px] text-gray-500 truncate m-0 mt-0.5">
                                  {item.specs || "Standard specifications"}
                                </p>

                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-black text-gray-900">
                                    ₹{Number(item.price).toLocaleString("en-IN")}
                                  </span>
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                    ★ {item.rating || '4.2'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {item.recommendationBadge?.desc && (
                              <p className="text-[10.5px] text-slate-600 bg-slate-50 border border-slate-100 p-1.5 rounded-lg m-0 italic">
                                "{item.recommendationBadge.desc}"
                              </p>
                            )}

                            <div className="flex items-center gap-1.5 pt-1 border-t border-gray-50">
                              <button
                                type="button"
                                onClick={() => handleCartAdd(item)}
                                className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer ${
                                  addedItemIds[item._id]
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-gray-800"
                                }`}
                              >
                                {addedItemIds[item._id] ? (
                                  <>
                                    <Check className="w-3 h-3" /> Added
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart className="w-3 h-3" /> Add to Cart
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleCartAdd(item);
                                  setIsOpen(false);
                                  navigate('/cart');
                                }}
                                className="flex-1 text-[11px] font-bold py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span>Buy Now</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleWishlistToggle(item)}
                                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                  wishlistIds[item._id]
                                    ? "bg-red-50 border-red-200 text-red-500"
                                    : "bg-white border-gray-200 text-gray-400 hover:text-red-500"
                                }`}
                                title="Wishlist"
                              >
                                <Heart className={`w-3.5 h-3.5 ${wishlistIds[item._id] ? 'fill-red-500' : ''}`} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {msg.quickActions.map((action, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(action)}
                            className="text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-3 py-1.5 rounded-xl border border-indigo-200/80 transition cursor-pointer text-left shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold bg-indigo-50 p-2.5 rounded-xl w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>ShopSmart Concierge is finding the best matches...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="chat-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Ask about products, budget, specs (e.g. 'Laptop under 40k')..."
              value={query}
              disabled={isLoading}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" disabled={isLoading || !query.trim()}>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}