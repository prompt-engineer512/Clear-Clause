import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { ClauseItem, RiskLevel } from '../types';

interface RiskHighlightsSectionProps {
  clauses: ClauseItem[];
}

export const RiskHighlightsSection: React.FC<RiskHighlightsSectionProps> = ({ clauses }) => {
  const [filter, setFilter] = useState<'all' | RiskLevel>('all');

  const filteredClauses = filter === 'all' 
    ? clauses 
    : clauses.filter(c => c.riskLevel === filter);

  const counts = {
    all: clauses.length,
    safe: clauses.filter(c => c.riskLevel === 'safe').length,
    caution: clauses.filter(c => c.riskLevel === 'caution').length,
    concerning: clauses.filter(c => c.riskLevel === 'concerning').length
  };

  return (
    <section id="section-highlights" className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Risk Categorization
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Clauses grouped by risk severity
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#181b1f] rounded-lg border border-[#2a2e35]">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              filter === 'all'
                ? 'bg-[#1c1f26] text-white border border-[#2a2e35]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            All ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => setFilter('safe')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 cursor-pointer ${
              filter === 'safe'
                ? 'bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-emerald-500/30'
                : 'text-[#94a3b8] hover:text-[#10b981]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span>Favorable ({counts.safe})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('caution')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 cursor-pointer ${
              filter === 'caution'
                ? 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-amber-500/30'
                : 'text-[#94a3b8] hover:text-[#f59e0b]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
            <span>Caution ({counts.caution})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('concerning')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 cursor-pointer ${
              filter === 'concerning'
                ? 'bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-red-500/30'
                : 'text-[#94a3b8] hover:text-[#ef4444]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
            <span>High Risk ({counts.concerning})</span>
          </button>
        </div>
      </div>

      {/* Grid of Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredClauses.map((clause) => {
          let badgeStyle = 'bg-slate-800 text-slate-300';
          let borderAccent = 'border-l-2 border-l-[#2a2e35]';

          if (clause.riskLevel === 'safe') {
            badgeStyle = 'bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-emerald-500/20';
            borderAccent = 'border-l-2 border-l-[#10b981]';
          } else if (clause.riskLevel === 'caution') {
            badgeStyle = 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-amber-500/20';
            borderAccent = 'border-l-2 border-l-[#f59e0b]';
          } else if (clause.riskLevel === 'concerning') {
            badgeStyle = 'bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-red-500/20';
            borderAccent = 'border-l-2 border-l-[#ef4444]';
          }

          return (
            <div
              key={clause.id}
              className={`p-3.5 rounded-lg bg-[#181b1f] border border-[#2a2e35] ${borderAccent} transition shadow-sm flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-[#f1f5f9] line-clamp-1">
                    {clause.title}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${badgeStyle}`}>
                    {clause.riskLevel === 'concerning' ? 'High Risk' : clause.riskLevel === 'caution' ? 'Caution' : 'Favorable'}
                  </span>
                </div>
                <p className="text-xs text-[#cbd5e1] leading-relaxed mb-2">
                  {clause.explanation}
                </p>
              </div>

              <div className="pt-2 border-t border-[#2a2e35] mt-1">
                <span className="text-[11px] text-[#94a3b8] block line-clamp-2">
                  <span className="font-semibold text-slate-300">Why it matters: </span>
                  {clause.whyItMatters}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
