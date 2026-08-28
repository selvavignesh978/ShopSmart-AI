import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-auto border-t border-slate-800">
      {/* Service Highlights Strip */}
      <div className="border-b border-slate-800 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white m-0">Fast Delivery</h4>
                <p className="text-xs text-gray-400 m-0">Express dispatch to your door</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white m-0">7-Day Easy Return</h4>
                <p className="text-xs text-gray-400 m-0">Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white m-0">100% Secure</h4>
                <p className="text-xs text-gray-400 m-0">Protected checkout sessions</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white m-0">AI-Powered Search</h4>
                <p className="text-xs text-gray-400 m-0">Smart natural language matching</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="text-xl font-bold flex items-center gap-2 text-indigo-400 no-underline">
              <Sparkles className="w-5 h-5 text-indigo-400" /> ShopSmart <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">AI</span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your next-generation e-commerce shopping destination with dynamic inventory management and personalized conversational AI search.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider m-0">Navigation</h4>
            <ul className="space-y-2 text-xs list-none p-0 m-0">
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition">Discover Catalog</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-indigo-400 transition">About ShopSmart</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition">Customer Support</Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-indigo-400 transition">Orders & Tracking</Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider m-0">Top Categories</h4>
            <ul className="space-y-2 text-xs list-none p-0 m-0">
              <li>
                <Link to="/?category=Electronics" className="text-gray-400 hover:text-indigo-400 transition">Electronics & Gadgets</Link>
              </li>
              <li>
                <Link to="/?category=Fashion" className="text-gray-400 hover:text-indigo-400 transition">Fashion & Apparel</Link>
              </li>
              <li>
                <Link to="/?category=Home" className="text-gray-400 hover:text-indigo-400 transition">Home & Living</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider m-0">Contact Us</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="flex items-center gap-2 m-0">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" /> support@shopsmart-ai.com
              </p>
              <p className="flex items-center gap-2 m-0">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" /> 1800-425-SMART
              </p>
              <p className="flex items-start gap-2 m-0">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" /> Block-C, Tech Park Campus, Chennai, Tamil Nadu
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="m-0">
            &copy; {new Date().getFullYear()} ShopSmart AI. All rights reserved.
          </p>
          <a  href="https://www.google.com/maps/search/?api=1&query=Tech+Park+Campus+Chennai+Tamil+Nadu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200">
          <span>Open in Google Maps</span>
          <span className="text-base">📍</span>
         </a>
          <p className="flex items-center gap-1 m-0">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> on the MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
}