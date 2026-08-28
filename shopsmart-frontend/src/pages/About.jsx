import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, Cpu, Users, ArrowRight, ShieldCheck, Heart, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-fadeIn">
      
      {/* Hero Banner Grid Segment */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-16 shadow-xl text-center md:text-left grid grid-cols-1 md:grid-cols-5 gap-8 items-center w-full">
        <div className="md:col-span-3 space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Next-Generation E-Commerce
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight m-0 text-white">
            Welcome to ShopSmart <span className="text-indigo-400">AI</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            We are redefining the online retail experience by combining an expansive premium product catalog with an intuitive, multi-turn AI shopping conversational engine.
          </p>
          <div className="pt-2">
            <Link to="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md hover:shadow-indigo-500/20 text-sm">
              Explore Active Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dynamic Stats Dashboard Widget Grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4 w-full">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xs">
            <h3 className="text-2xl sm:text-3xl font-black text-indigo-400 m-0">50+</h3>
            <p className="text-xs text-slate-400 font-medium mt-1 mb-0 uppercase tracking-wide">Curated Products</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xs">
            <h3 className="text-2xl sm:text-3xl font-black text-indigo-400 m-0">3</h3>
            <p className="text-xs text-slate-400 font-medium mt-1 mb-0 uppercase tracking-wide">Core Categories</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xs">
            <h3 className="text-2xl sm:text-3xl font-black text-indigo-400 m-0">Instant</h3>
            <p className="text-xs text-slate-400 font-medium mt-1 mb-0 uppercase tracking-wide">AI Recommendations</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xs">
            <h3 className="text-2xl sm:text-3xl font-black text-indigo-400 m-0">100%</h3>
            <p className="text-xs text-slate-400 font-medium mt-1 mb-0 uppercase tracking-wide">Secure Checkout</p>
          </div>
        </div>
      </div>

      {/* Core Technology Core Pillars Segment */}
      <div className="space-y-6 w-full">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight m-0">
            How ShopSmart Empowers You
          </h2>
          <p className="text-sm text-gray-500">
            Intelligent design paired with direct user control options makes finding item matches quick and pleasant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Pillar 1 */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-4 hover:border-indigo-200 transition duration-300">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 m-0">Natural Language Parsing Engine</h3>
            <p className="text-sm text-gray-600 leading-relaxed m-0">
              Our assistant evaluates filters step-by-step: looking at keyword queries, budget requirements, and specs like battery performance criteria instantly.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-4 hover:border-indigo-200 transition duration-300">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 m-0">Diverse Product Cataloging</h3>
            <p className="text-sm text-gray-600 leading-relaxed m-0">
              From premium high-performance laptops and mobile electronics to home essentials, kitchen cookware, and active fashion attire.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-4 hover:border-indigo-200 transition duration-300">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 m-0">Interactive Community Feedback</h3>
            <p className="text-sm text-gray-600 leading-relaxed m-0">
              Shoppers can instantly review specifications, leave verified star counts, and add comments using our real-time public logs area.
            </p>
          </div>
        </div>
      </div>

      {/* Corporate Values Row Matrix */}
      <div className="bg-slate-100/60 border border-slate-200/50 rounded-2xl p-6 md:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center w-full">
        <div className="flex flex-col items-center gap-2 p-4">
          <ShieldCheck className="w-8 h-8 text-indigo-600" />
          <h4 className="text-base font-bold text-gray-900 m-0">Data Security Assured</h4>
          <p className="text-xs sm:text-sm text-gray-500 m-0 max-w-xs">
            User credentials and cart operations are processed with local authorization checkpoints.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 border-y sm:border-y-0 sm:border-x border-slate-200/80">
          <Heart className="w-8 h-8 text-indigo-600" />
          <h4 className="text-base font-bold text-gray-900 m-0">Customer-Centric Care</h4>
          <p className="text-xs sm:text-sm text-gray-500 m-0 max-w-xs">
            Designed to maintain a human-like, friendly dialogue flow that values customer choice above all.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 p-4">
          <Zap className="w-8 h-8 text-indigo-600" />
          <h4 className="text-base font-bold text-gray-900 m-0">Lightning-Fast Vite Build</h4>
          <p className="text-xs sm:text-sm text-gray-500 m-0 max-w-xs">
            Optimized components minimize resource drag, running lightweight page loading speeds on any mobile or desktop view.
          </p>
        </div>
      </div>

    </div>
  );
}