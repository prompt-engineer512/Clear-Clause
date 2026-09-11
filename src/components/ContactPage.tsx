import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, Sparkles, Building, HelpCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitted(true);
    // Reset form after submission
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Top Heading */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-4">
          <Mail className="w-3.5 h-3.5 text-teal-400" />
          <span>Get in Touch with Our Team</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] mb-4">
          We'd Love to Hear from You.
        </h1>
        
        <p className="text-sm text-slate-400 leading-relaxed">
          Have questions about an analysis, want to request support for a specific policy format, or interested in enterprise n8n workflow integrations? Reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Information Cards */}
        <div className="md:col-span-1 space-y-4">
          
          <div className="p-5 rounded-2xl bg-[#131923] border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Feedback & Suggestions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Help us improve our legal AI clarity algorithms and document parsing models.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#131923] border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <Building className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Enterprise & API</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Custom webhooks, automated vendor contract screening, and privacy compliance.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#131923] border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Response Time</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our engineering and legal research team replies within 24 hours.
            </p>
          </div>

        </div>

        {/* Right Contact Form */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-[#131923] border border-slate-800 shadow-md">
          
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-['Space_Grotesk']">
                Message Sent Successfully!
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                Thank you for contacting ClearClause. We have received your inquiry and our team will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Policy analysis inquiry, n8n webhook question"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your thoughts, questions, or feedback here..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <button
                type="submit"
                id="contact-submit-btn"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition shadow-md flex items-center justify-center gap-2 font-['Space_Grotesk']"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
