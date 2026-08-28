import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, ShieldCheck, ArrowLeft } from 'lucide-react';
import { authService } from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.me();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load user profile:", err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-xs p-6 md:p-10 space-y-8">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 m-0">{profile?.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5 m-0">ShopSmart Registered Member</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email Address
            </span>
            <p className="text-sm font-semibold text-gray-800 m-0">{profile?.email}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-500" /> Mobile Number
            </span>
            <p className="text-sm font-semibold text-gray-800 m-0">{profile?.mobile || 'Not specified'}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Date of Birth
            </span>
            <p className="text-sm font-semibold text-gray-800 m-0">
              {profile?.dob ? new Date(profile.dob).toLocaleDateString('en-IN') : 'Not specified'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Account Security
            </span>
            <p className="text-sm font-semibold text-emerald-700 m-0">JWT Protected Session Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}