import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { authService } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { user, token } = await authService.login(email.trim().toLowerCase(), password);
      localStorage.setItem('shopsmart_token', token);
      localStorage.setItem('user', JSON.stringify({ ...user, authenticated: true }));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill for test/demo accounts
  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <div className="max-w-4xl w-full bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Brand Promo Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-indigo-400 no-underline">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <span>ShopSmart</span>
              <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">AI</span>
            </Link>

            <div className="space-y-3 pt-4">
              <h3 className="text-2xl font-extrabold text-white leading-tight m-0">
                Welcome Back!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed m-0">
                Log in to synchronize your active cart, continue placing orders, and receive real-time personalized AI product recommendations.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cloud cart & wishlist synchronization</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Order receipts & tracking dashboard</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Conversational shopping AI concierge</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Secure 256-bit JWT Session Authentication</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6 space-y-1">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight m-0">
              Sign In to Your Account
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 m-0">
              Enter your credentials to access your session.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-600 uppercase m-0">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-indigo-500/20 active:scale-[0.99] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Helper Chips for Review/Demo */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Quick Fill Demo Accounts:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('user@shopsmart.com', 'User@123')}
                className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                <span>Demo User</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@shopsmart.com', 'Admin@123')}
                className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                <span>Admin User</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 text-center mt-6 mb-0">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}