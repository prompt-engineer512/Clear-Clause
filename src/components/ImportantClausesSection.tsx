import React, { useState } from 'react';
import { EyeOff, ChevronDown, ChevronUp, AlertCircle, AlertTriangle, CheckCircle2, Quote, Bot, Users } from 'lucide-react';
import { ClauseItem, RiskLevel } from '../types';

interface ImportantClausesSectionProps {
  clauses: ClauseItem[];
  onAskAI?: (clause: ClauseItem) => void;
  onDiscussInCommunity?: (clause: ClauseItem) => void;
}

export const ImportantClausesSection: React.FC<ImportantClausesSectionProps> = ({ clauses, onAskAI, onDiscussInCommunity }) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [clauses[0]?.id || '']: true
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'concerning':
        return {
          icon: AlertCircle,
          label: 'High Risk',
          classes: 'bg-[rgba(239,68,68,0.15)] border-red-500/20 text-[#ef4444]'
        };
      case 'caution':
        return {
          icon: AlertTriangle,
          label: 'Caution',
          classes: 'bg-[rgba(245,158,11,0.15)] border-amber-500/20 text-[#f59e0b]'
        };
      default:
        return {
          icon: CheckCircle2,
          label: 'Favorable',
          classes: 'bg-[rgba(16,185,129,0.15)] border-emerald-500/20 text-[#10b981]'
        };
    }
  };

  return (
    <section id="section-clauses" className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[rgba(245,158,11,0.1)] border border-amber-500/20 flex items-center justify-center text-[#f59e0b]">
            <EyeOff className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Important Clauses
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Critical legal conditions and rights terms
            </p>
          </div>
        </div>

        <span className="text-xs text-[#94a3b8] font-mono hidden sm:inline">
          {clauses.length} clauses analyzed
        </span>
      </div>

      {/* Clauses Accordion List */}
      <div className="space-y-2.5">
        {clauses.map((clause) => {
          const isExpanded = !!expandedIds[clause.id];
          const badge = getRiskBadge(clause.riskLevel);
          const Icon = badge.icon;

          return (
            <div
              key={clause.id}
              className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-[#181b1f] border-slate-600'
                  : 'bg-[#181b1f]/70 border-[#2a2e35] hover:border-slate-600'
              }`}
            >
              {/* Accordion Header / Trigger */}
              <button
                type="button"
                id={`clause-toggle-${clause.id}`}
                onClick={() => toggleExpand(clause.id)}
                className="w-full p-3.5 flex items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1 ${badge.classes}`}>
                    <Icon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-sm font-medium text-[#f1f5f9] truncate">
                    {clause.title}
                  </span>
                </div>

                <div className="text-[#94a3b8] shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-300" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-[#2a2e35] space-y-3">
                  
                  {/* Simple Explanation */}
                  <div>
                    <h5 className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                      Plain Meaning
                    </h5>
                    <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                      {clause.explanation}
                    </p>
                  </div>

                  {/* Why It Matters */}
                  <div className="p-3 rounded-lg bg-[#121417] border border-[#2a2e35]">
                    <h5 className="text-[11px] font-semibold uppercase tracking-wider text-[#f59e0b] mb-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Why It Matters</span>
                    </h5>
                    <p className="text-xs text-[#cbd5e1] leading-relaxed">
                      {clause.whyItMatters}
                    </p>
                  </div>

                  {/* Original Snippet if present */}
                  {clause.originalSnippet && (
                    <div className="p-2.5 rounded bg-[#121417]/60 border border-[#2a2e35] text-[#94a3b8] text-[11px] font-mono leading-relaxed flex items-start gap-2">
                      <Quote className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                      <span className="italic line-clamp-3">"{clause.originalSnippet}"</span>
                    </div>
                  )}

                  {/* Ask AI & Discuss with Community Triggers */}
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-[#2a2e35]/60">
                    {onDiscussInCommunity && (
                      <button
                        type="button"
                        onClick={() => onDiscussInCommunity(clause)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#14171c] hover:bg-[#252a33] border border-[#2a2e35] transition cursor-pointer"
                        title="Start a discussion about this clause with the Clear Clause community"
                      >
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span>Discuss with Community</span>
                      </button>
                    )}

                    {onAskAI && (
                      <button
                        type="button"
                        onClick={() => onAskAI(clause)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#2F8CFF] hover:text-white bg-[#081426] hover:bg-[#0B1F3A] border border-[#172B46] hover:border-[#1677FF] transition cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5 text-[#2F8CFF]" />
                        <span>Ask Clear Clause AI</span>
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};
