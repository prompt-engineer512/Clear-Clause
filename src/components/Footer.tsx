import React from 'react';
import { ShieldAlert, Heart, Github, Globe } from 'lucide-react';
import { ActivePage } from '../types';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0a0e14] text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
          
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ClearClause Logo"
              className="w-8 h-8 rounded-lg object-contain"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="font-bold text-white tracking-tight font-['Space_Grotesk'] text-base">
                Clear<span className="text-teal-400">Clause</span>
              </span>
              <p className="text-xs text-slate-500">
                AI-Powered Legal Transparency & Privacy Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-5 text-xs">
            <button
              onClick={() => setActivePage('home')}
              className="text-slate-400 hover:text-teal-300 transition"
            >
              Analyze
            </button>
            <button
              onClick={() => setActivePage('about')}
              className="text-slate-400 hover:text-teal-300 transition"
            >
              About Us
            </button>
            <button
              onClick={() => setActivePage('contact')}
              className="text-slate-400 hover:text-teal-300 transition"
            >
              Contact Us
            </button>
            <button
              onClick={() => setActivePage('history')}
              className="text-slate-400 hover:text-teal-300 transition"
            >
              History
            </button>
            <button
              onClick={() => setActivePage('community')}
              className="text-slate-400 hover:text-teal-300 transition"
            >
              Community
            </button>
            <button
              onClick={() => setActivePage('settings')}
              className="text-slate-400 hover:text-teal-300 transition"
            >
              Settings & n8n
            </button>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="max-w-2xl text-center sm:text-left leading-relaxed">
            <strong className="text-slate-400">Legal Disclaimer: </strong>
            ClearClause provides automated AI analysis for educational and comprehension purposes. It does not constitute formal legal counsel or an attorney-client relationship.
          </p>
          
          <div className="shrink-0 text-slate-500 font-mono">
            © {new Date().getFullYear()} ClearClause. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
