import React from 'react';
import { UserCheck, CheckCircle2, XCircle, Sliders, Globe } from 'lucide-react';
import { UserRightsSection as UserRightsType } from '../types';

interface UserRightsSectionProps {
  rights: UserRightsType;
}

export const UserRightsSection: React.FC<UserRightsSectionProps> = ({ rights }) => {
  const coreRights = [
    { label: 'Right to Access Data', available: Boolean(rights?.dataAccess), desc: 'Request full copy of collected records' },
    { label: 'Right to Delete Data', available: Boolean(rights?.dataDeletion), desc: 'Erase telemetry and personal identifiers' },
    { label: 'Right to Delete Account', available: Boolean(rights?.accountDeletion), desc: 'Permanently close account without retention' }
  ];

  const optOutRights = Array.isArray(rights?.optOutRights) ? rights.optOutRights : [];
  const jurisdictionRights = Array.isArray(rights?.jurisdictionRights) ? rights.jurisdictionRights : [];

  return (
    <section id="section-rights" className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
          <UserCheck className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            User Rights & Controls
          </h3>
          <p className="text-xs text-[#94a3b8]">
            Data portability, account deletion, and opt-out privileges
          </p>
        </div>
      </div>

      {/* 3 Core Rights Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {coreRights.map((item) => (
          <div
            key={item.label}
            className={`p-3.5 rounded-lg border flex flex-col justify-between ${
              item.available
                ? 'bg-[rgba(16,185,129,0.08)] border-emerald-500/30 text-[#10b981]'
                : 'bg-[rgba(239,68,68,0.08)] border-red-500/30 text-[#ef4444]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-[#f1f5f9]">{item.label}</span>
              {item.available ? (
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-[#ef4444] shrink-0" />
              )}
            </div>
            <span className="text-[11px] text-[#94a3b8] leading-snug">
              {item.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Opt-out and Jurisdictional Rights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Opt-out Rights */}
        <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-3 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Available Opt-Outs</span>
          </h4>
          {optOutRights.length > 0 ? (
            <ul className="space-y-2">
              {optOutRights.map((opt, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#cbd5e1] leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3b82f6] mt-0.5 shrink-0" />
                  <span>{opt}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#94a3b8]">Standard promotional email and marketing opt-out settings.</p>
          )}
        </div>

        {/* Legal Jurisdictions */}
        <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-3 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Jurisdiction Protections</span>
          </h4>
          {jurisdictionRights.length > 0 ? (
            <ul className="space-y-2">
              {jurisdictionRights.map((jur, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#cbd5e1] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <span>{jur}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#94a3b8]">Standard statutory consumer rights applied per regional laws.</p>
          )}
        </div>

      </div>

    </section>
  );
};
