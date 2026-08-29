// D:\finalproject\shopsmart-frontend\src\components\Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Sparkles, User, Settings, Package, Menu, X } from 'lucide-react';

export default function Navbar({ cartCount = 0 }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Safely parse user from localStorage
  const user = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('shopsmart_token');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50 w-full min-w-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center gap-3">
        
        {/* Left Side: Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-indigo-400 no-underline shrink-0">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 shrink-0" />
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">ShopSmart</span>
          <span className="text-[10px] sm:text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">AI</span>
        </Link>
        
        {/* Center: Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/about" className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition no-underline">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition no-underline">
            Contact
          </Link>
        </div>

        {/* Right Side: Action Hub */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Cart Icon */}
          <Link 
            to="/cart" 
            className="relative p-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-full transition"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            /* User Avatar & Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer shrink-0"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                )}
              </button>

              {/* Popup Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 sm:w-56 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-[11px] text-gray-400 m-0">Signed in as</p>
                    <p className="text-xs sm:text-sm font-semibold text-white m-0 truncate">{user.email || user.name}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition no-underline"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Package className="w-4 h-4 text-gray-400" />
                      My Orders & Receipts
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition no-underline"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      Account Settings
                    </Link>
                  </div>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-xs sm:text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="text-xs sm:text-sm font-medium text-gray-300 hover:text-indigo-400 px-3 py-1.5 transition no-underline">
                Login
              </Link>
              <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-white transition no-underline shadow-xs">
                Signup
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 px-4 py-3 space-y-2">
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-indigo-400 no-underline"
          >
            About ShopSmart
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-indigo-400 no-underline"
          >
            Contact & Support
          </Link>

          {!user && (
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-2 text-xs font-bold text-gray-300 bg-slate-800 rounded-xl no-underline"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl no-underline"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}