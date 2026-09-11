import React from 'react';
import { 
  ShieldCheck, 
  Eye, 
  Sparkles, 
  Scale, 
  FileText, 
  Users, 
  Lock, 
  HeartHandshake,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  onStartAnalysis: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStartAnalysis }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Hero Badge & Heading */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Our Mission for Consumer Transparency</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] mb-4">
          Demystifying the Fine Print for Everyone.
        </h1>
        
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          ClearClause is an AI-powered legal intelligence platform dedicated to bringing clarity, privacy awareness, and fair contract transparency to everyday internet users.
        </p>
      </div>

      {/* Why We Built ClearClause */}
      <div className="p-8 rounded-2xl bg-[#131923] border border-slate-800 shadow-md mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 via-emerald-400 to-indigo-500" />
        
        <h2 className="text-lg font-bold text-white mb-3 font-['Space_Grotesk']">
          The Problem with Modern Terms & Conditions
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          The average internet user encounters more than 40 different Terms of Service and Privacy Policies each year. Reading them all would take an estimated 250+ hours of dense legal reading. As a result, 97% of users click <strong className="text-slate-200">"I Agree"</strong> without knowing what rights they waive, what personal telemetry is tracked, or what hidden recurring fees await them.
        </p>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          ClearClause bridges this asymmetry. We use specialized AI legal models and automated n8n pipelines to instantly scan 50-page contracts, identify high-risk clauses, translate legalese into plain English, and provide actionable scores.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-white text-center mb-8 font-['Space_Grotesk']">
          Our Core Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Radical Transparency</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We believe digital products should clearly disclose data monetization, third-party broker sharing, and tracking without hiding behind obfuscated clauses.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Privacy Awareness</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering consumers with complete knowledge of their digital footprint, biometrics collection, cross-device pixels, and right to be forgotten.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Pure Simplicity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transforming convoluted legal jargon into clear, digestible, 1-minute executive summaries that anyone can understand in seconds.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Informed Decision Making</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Helping users make conscious choices about which services to trust and discovering ethical, privacy-first software alternatives.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-[#131923] to-slate-900 border border-slate-800 text-center">
        <h3 className="text-xl font-bold text-white mb-2 font-['Space_Grotesk']">
          Ready to Audit Your First Agreement?
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
          Paste any website link or upload your contract file now to see our AI analysis in action.
        </p>
        <button
          type="button"
          onClick={onStartAnalysis}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition shadow-md font-['Space_Grotesk']"
        >
          <span>Try ClearClause Free</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
