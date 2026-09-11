import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AlternativeService } from '../types';

interface BetterAlternativesSectionProps {
  alternatives: AlternativeService[];
  companyName: string;
}

export const BetterAlternativesSection: React.FC<BetterAlternativesSectionProps> = ({ alternatives, companyName }) => {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <section id="section-alternatives" className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Better Alternatives
          </h3>
          <p className="text-xs text-[#94a3b8]">
            Services with more consumer-friendly policies and data practices
          </p>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {alternatives.map((alt) => (
          <div
            key={alt.id}
            className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35] hover:border-slate-600 transition shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-[#f1f5f9]">{alt.name}</h4>
                  <span className="text-[10px] text-[#3b82f6] font-medium uppercase tracking-wider">{alt.category}</span>
                </div>
                
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[rgba(16,185,129,0.15)] border border-emerald-500/30 text-[#10b981] text-xs font-semibold font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{alt.score}/100</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#cbd5e1] mb-3 leading-relaxed">
                {alt.reason}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-[#2a2e35]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8] block mb-1">
                  Key Advantages
                </span>
                {alt.advantages.map((adv, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-[#cbd5e1]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] mt-0.5 shrink-0" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
