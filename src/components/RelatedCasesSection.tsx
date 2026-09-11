import React from 'react';
import { Scale, Calendar, AlertCircle } from 'lucide-react';
import { RelatedCase } from '../types';

interface RelatedCasesSectionProps {
  cases: RelatedCase[];
  companyName: string;
}

export const RelatedCasesSection: React.FC<RelatedCasesSectionProps> = ({ cases, companyName }) => {
  if (!cases || cases.length === 0) return null;

  return (
    <section id="section-cases" className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
          <Scale className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Related Regulatory Cases & Incidents
          </h3>
          <p className="text-xs text-[#94a3b8]">
            Legal precedents and past regulatory enforcement for {companyName}
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {cases.map((c) => (
          <div key={c.id} className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35] transition">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h4 className="text-sm font-semibold text-[#f1f5f9] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#3b82f6] shrink-0" />
                <span>{c.title}</span>
              </h4>
              <span className="text-[11px] font-mono text-[#94a3b8] px-2 py-0.5 rounded bg-[#121417] border border-[#2a2e35] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#94a3b8]" />
                <span>{c.date}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed mb-3">
              {c.description}
            </p>

            <div className="pt-2 border-t border-[#2a2e35] flex items-center justify-between text-xs">
              <span className="text-[#94a3b8]">
                <strong className="text-slate-300">Relevance: </strong>
                {c.relevance}
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
