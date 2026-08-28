import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { contactService } from "../services/api";

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Technical Product Support",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill out all mandatory contact fields.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await contactService.submitContact(formData);
      setFormSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "Technical Product Support",
        message: ""
      });
      setTimeout(() => setFormSubmitted(false), 7000);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to dispatch message ticket. Please verify your details or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Dedicated Help & Assistance
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 m-0">
          Get in Touch with <span className="text-indigo-600">ShopSmart</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto m-0">
          Have an inquiry about an order status, payment verification, product specifications, or how our conversational AI assistant recommends items? Drop us a line below!
        </p>
      </div>

      {/* Main Grid: Left Channels + Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Contact Channels */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 m-0">Contact Channels</h2>
            <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 24/7 Monitored
            </span>
          </div>

          {/* Email Card */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs flex items-start gap-4 hover:border-indigo-200 transition duration-200">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Electronic Mail
              </span>
              <a
                href="mailto:support@shopsmart-ai.com"
                className="text-sm sm:text-base font-bold text-gray-900 hover:text-indigo-600 transition truncate block m-0 mt-0.5"
              >
                support@shopsmart-ai.com
              </a>
              <p className="text-xs text-gray-400 mt-1 m-0">
                Average reply turnaround time: within 12 hours.
              </p>
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs flex items-start gap-4 hover:border-indigo-200 transition duration-200">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Toll-Free Customer Line
              </span>
              <a
                href="tel:180042576278"
                className="text-sm sm:text-base font-bold text-gray-900 hover:text-indigo-600 transition block m-0 mt-0.5"
              >
                1800-425-SMART
              </a>
              <p className="text-xs text-gray-400 mt-1 m-0">
                Direct helpline for quick order & tracking queries.
              </p>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs flex items-start gap-4 hover:border-indigo-200 transition duration-200">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Technology Headquarters
                </span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Tech+Park+Campus+Chennai+Tamil+Nadu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                >
                  Map <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm sm:text-base font-bold text-gray-900 m-0 mt-0.5">
                Block-C, Tech Park Campus
              </p>
              <p className="text-xs text-gray-500 mt-0.5 m-0">
                Chennai, Tamil Nadu, India
              </p>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs flex items-start gap-4 hover:border-indigo-200 transition duration-200">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Support Hours
              </span>
              <p className="text-sm sm:text-base font-bold text-gray-900 m-0 mt-0.5">
                Monday – Saturday
              </p>
              <p className="text-xs text-gray-500 mt-0.5 m-0">
                09:00 AM – 06:00 PM IST (Active Support)
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7 bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900 m-0 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" /> Send an Electronic Message
            </h3>
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Prompt Response
            </span>
          </div>

          {/* Success Notification Alert */}
          {formSubmitted && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-sm flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Inquiry Logged!</strong> Your message ticket has been registered in the database. Our team will contact you shortly.
              </div>
            </div>
          )}

          {/* Error Notification Alert */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-center gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ajay"
                  className="w-full p-3 text-sm border border-gray-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full p-3 text-sm border border-gray-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                Inquiry Topic
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 text-sm border border-gray-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-800 transition cursor-pointer"
              >
                <option value="Technical Product Support">Technical Product Support</option>
                <option value="Order Tracking & Cart Sessions">Order Tracking & Cart Sessions</option>
                <option value="AI Assistant Engine Feedback">AI Assistant Engine Feedback</option>
                <option value="Business Partnerships">Business Partnerships</option>
                <option value="Return & Replacement Queries">Return & Replacement Queries</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase m-0">
                  Message Detail <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400">
                  {formData.message.length} / 1000 characters
                </span>
              </div>
              <textarea
                rows="5"
                required
                maxLength={1000}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your inquiry or question in detail..."
                className="w-full p-3 text-sm border border-gray-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3.5 px-6 rounded-2xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-indigo-500/20 active:scale-[0.99] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching Message Entry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message Entry</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}