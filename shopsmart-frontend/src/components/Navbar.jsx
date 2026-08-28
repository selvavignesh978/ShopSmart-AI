import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Sparkles, User, Settings, Package } from 'lucide-react';

export default function Navbar({ cartCount }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Safely grab user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // Close dropdown cleanly when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('shopsmart_token');
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50 w-full">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        
        {/* Left Side: Brand Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-indigo-400">
          <Sparkles className="w-6 h-6 text-indigo-400" /> ShopSmart <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">AI</span>
        </Link>
        
        {/* Right Side: Interactive Navigation Menu Hub */}
        <div className="flex items-center gap-6">
          
          {/* Links accessible on header row */}
          <Link to="/about" className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition">
            Contact
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              {/* Cart Icon */}
              <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-full transition">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile Avatar & Dropdown Container */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-300" />
                  )}
                </button>

                {/* Professional Popup Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-slate-950 border border-slate-800 shadow-xl py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-gray-400 truncate">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                    </div>

                    {/* Menu Links */}
                    <div className="py-1">
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Package className="w-4 h-4 text-gray-400" />
                        My Orders & Receipts
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        Account Settings
                      </Link>
                    </div>

                    {/* Action Button */}
                    <div className="border-t border-slate-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition">Login</Link>
              <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-md text-sm font-medium transition">Signup</Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}