import React from 'react';
import { DollarSign, AlertCircle, CheckCircle, RefreshCcw, CreditCard } from 'lucide-react';
import { RefundMoneySection as RefundType } from '../types';

interface RefundsMoneySectionProps {
  refunds: RefundType;
}

export const RefundsMoneySection: React.FC<RefundsMoneySectionProps> = ({ refunds }) => {
  return (
    <section id="section-refunds" className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[rgba(16,185,129,0.1)] border border-emerald-500/20 flex items-center justify-center text-[#10b981]">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Refunds & Money
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Pricing structures, cancellation terms, and fees
            </p>
          </div>
        </div>

        {refunds.isConcerning && (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(239,68,68,0.15)] border border-red-500/30 text-[#ef4444] flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" />
            <span>Concerning Terms</span>
          </span>
        )}
      </div>

      {/* Primary 2-Column Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        
        {/* Refund Policy */}
        <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2 flex items-center gap-2">
            <RefreshCcw className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Refund Policy</span>
          </h4>
          <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
            {refunds.refundPolicy}
          </p>
        </div>

        {/* Cancellation Conditions */}
        <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2 flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Cancellation Conditions</span>
          </h4>
          <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
            {refunds.cancellationConditions}
          </p>
        </div>

      </div>

      {/* Charges & Hidden Costs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        
        <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] block mb-1">Standard Pricing / Charges</span>
          <p className="text-xs sm:text-sm font-medium text-[#f1f5f9]">{refunds.charges}</p>
        </div>

        <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] block mb-2">Hidden Costs & Surcharges</span>
          {refunds.hiddenCosts && refunds.hiddenCosts.length > 0 ? (
            <ul className="space-y-1.5">
              {refunds.hiddenCosts.map((cost, idx) => (
                <li key={idx} className="text-xs text-amber-200 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 shrink-0" />
                  <span>{cost}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#10b981] flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>No unexpected hidden fees detected</span>
            </p>
          )}
        </div>

      </div>

      {/* Payment Clauses List */}
      {refunds.paymentClauses && refunds.paymentClauses.length > 0 && (
        <div className="pt-3 border-t border-[#2a2e35]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
            Payment Agreement Notes
          </h4>
          <ul className="space-y-1.5">
            {refunds.paymentClauses.map((clause, idx) => (
              <li key={idx} className="text-xs text-[#94a3b8] flex items-start gap-2">
                <span className="text-slate-600 font-mono">•</span>
                <span>{clause}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </section>
  );
};
