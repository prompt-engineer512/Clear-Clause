import React from 'react';
import { History, PlusCircle, MinusCircle } from 'lucide-react';
import { PolicyVersionChange } from '../types';

interface PolicyChangesSectionProps {
  changes: PolicyVersionChange[];
}

export const PolicyChangesSection: React.FC<PolicyChangesSectionProps> = ({ changes }) => {
  if (!changes || changes.length === 0) return null;

  return (
    <section id="section-changes" className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
          <History className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Policy Changes Over Time
          </h3>
          <p className="text-xs text-[#94a3b8]">
            Historical updates, newly introduced clauses, and privacy impact
          </p>
        </div>
      </div>

      {/* Version Changes List */}
      <div className="space-y-3.5">
        {changes.map((change) => (
          <div key={change.id} className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-[#3b82f6] px-2 py-0.5 rounded bg-[rgba(59,130,246,0.1)] border border-blue-500/30">
                  {change.version}
                </span>
                <span className="text-xs text-[#94a3b8]">{change.date}</span>
              </div>

              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                change.privacyImpact === 'positive'
                  ? 'bg-[rgba(16,185,129,0.15)] border-emerald-500/30 text-[#10b981]'
                  : change.privacyImpact === 'negative'
                  ? 'bg-[rgba(239,68,68,0.15)] border-red-500/30 text-[#ef4444]'
                  : 'bg-[#121417] border-[#2a2e35] text-[#94a3b8]'
              }`}>
                {change.privacyImpact === 'positive' ? 'Privacy Friendly Change' : change.privacyImpact === 'negative' ? 'Increased Data Collection' : 'Neutral Administrative Update'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#cbd5e1] mb-3 leading-relaxed">
              {change.summary}
            </p>

            {/* Added & Removed Clauses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#2a2e35]">
              
              {/* Added */}
              {change.addedClauses.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-[#10b981] flex items-center gap-1.5 mb-1.5">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Added Clauses</span>
                  </span>
                  <ul className="space-y-1">
                    {change.addedClauses.map((c, idx) => (
                      <li key={idx} className="text-xs text-[#cbd5e1] leading-relaxed">
                        • {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Removed */}
              {change.removedClauses.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-[#94a3b8] flex items-center gap-1.5 mb-1.5">
                    <MinusCircle className="w-3.5 h-3.5" />
                    <span>Removed Clauses</span>
                  </span>
                  <ul className="space-y-1">
                    {change.removedClauses.map((c, idx) => (
                      <li key={idx} className="text-xs text-[#94a3b8] leading-relaxed">
                        • {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
