import React from 'react';
import { RefreshCw, AlertTriangle, Calendar, HelpCircle } from 'lucide-react';
import { AutoRenewalSection as AutoRenewalType } from '../types';

interface AutoRenewalSectionProps {
  autoRenewal: AutoRenewalType;
}

export const AutoRenewalSection: React.FC<AutoRenewalSectionProps> = ({ autoRenewal }) => {
  return (
    <section id="section-renewal" className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[rgba(245,158,11,0.1)] border border-amber-500/20 flex items-center justify-center text-[#f59e0b]">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Auto-Renewal Terms
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Subscription rollovers, billing schedules, and cancellation paths
            </p>
          </div>
        </div>

        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
          autoRenewal.hasAutoRenewal
            ? 'bg-[rgba(245,158,11,0.15)] border-amber-500/30 text-[#f59e0b]'
            : 'bg-[rgba(16,185,129,0.15)] border-emerald-500/30 text-[#10b981]'
        }`}>
          {autoRenewal.hasAutoRenewal ? 'Auto-Renewal Enabled' : 'No Auto-Renewal'}
        </span>
      </div>

      {/* Prominent Warning Callout if Auto-Renewal Enabled */}
      {autoRenewal.hasAutoRenewal && autoRenewal.warningNotes && (
        <div className="p-4 rounded-lg bg-[rgba(245,158,11,0.08)] border border-amber-500/30 mb-5 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-[#f59e0b] uppercase tracking-wider mb-1">
              Renewal Notice
            </h4>
            <p className="text-xs text-amber-200 leading-relaxed">
              {autoRenewal.warningNotes}
            </p>
          </div>
        </div>
      )}

      {/* Detailed Q&A Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Renewal Frequency */}
        <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
          <div className="flex items-center gap-2 mb-1.5 text-[#94a3b8] text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Renewal Cadence</span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#f1f5f9]">
            {autoRenewal.renewalFrequency}
          </p>
        </div>

        {/* Cancellation Notice Window */}
        <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
          <div className="flex items-center gap-2 mb-1.5 text-[#94a3b8] text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Notice Deadline</span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#f1f5f9]">
            {autoRenewal.cancellationNoticeWindow}
          </p>
        </div>

        {/* How to Cancel */}
        <div className="sm:col-span-2 p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
          <div className="flex items-center gap-2 mb-2 text-[#94a3b8] text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>How to Cancel</span>
          </div>
          <div className="p-3 rounded-md bg-[#121417] border border-[#2a2e35] text-xs text-[#cbd5e1] leading-relaxed">
            {autoRenewal.howToCancel}
          </div>
        </div>

      </div>

    </section>
  );
};
