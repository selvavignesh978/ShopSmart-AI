import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { authService } from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, text: '', color: 'bg-gray-200' };
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 1, text: 'Weak', color: 'bg-amber-400' };
    if (score <= 4) return { score: 2, text: 'Moderate', color: 'bg-indigo-500' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, dob, mobile, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !dob || !mobile.trim() || !password || !confirmPassword) {
      setError('Please complete all required fields.');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        mobile: cleanMobile,
        dob
      });

      const token = response.token;
      const user = response.user;

      localStorage.setItem('shopsmart_token', token);
      localStorage.setItem('user', JSON.stringify({ ...user, authenticated: true }));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create your account.');
    } finally {
      setLoading(false);
    }
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
                Unlock Intelligent E-Commerce
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed m-0">
                Create an account to save shopping carts across devices, receive history-based product recommendations, and use conversational AI search.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Natural-language conversational search</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-time order simulation & tracking</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Personalized category recommendations</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Encrypted with standard JWT & Bcrypt</span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6 space-y-1">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight m-0">
              Create Your Account
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 m-0">
              Enter your personal details below to register.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Full Name & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ajay Kumar"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

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
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* DOB & Mobile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                  Date of Birth
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="date"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
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

              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-gray-200'}`} />
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-gray-200'}`} />
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-gray-200'}`} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500">{strength.text}</span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs sm:text-sm text-gray-500 text-center mt-6 mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}