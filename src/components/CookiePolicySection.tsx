import React from 'react';
import { Cookie, AlertTriangle, Crosshair } from 'lucide-react';
import { CookiePolicySection as CookiePolicyType } from '../types';

interface CookiePolicySectionProps {
  cookies: CookiePolicyType;
}

export const CookiePolicySection: React.FC<CookiePolicySectionProps> = ({ cookies }) => {
  const cookieTypes = Array.isArray(cookies?.cookieTypes) ? cookies.cookieTypes : [];
  const importantConcerns = Array.isArray(cookies?.importantConcerns) ? cookies.importantConcerns : [];
  const trackingInfo = cookies?.trackingInformation || 'Standard cookies are utilized for essential authentication and session persistence.';

  return (
    <section id="section-cookies" className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
          <Cookie className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Cookie & Tracking Policy
          </h3>
          <p className="text-xs text-[#94a3b8]">
            Browser trackers, pixel beacons, and telemetry mechanisms
          </p>
        </div>
      </div>

      {/* Cookie Types Table / Badges */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-3">
          Identified Cookie Categories
        </h4>
        {cookieTypes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {cookieTypes.map((c, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#181b1f] border border-[#2a2e35] flex items-center justify-between gap-2">
                <div className="overflow-hidden">
                  <span className="text-xs font-mono font-semibold text-[#f1f5f9] block truncate">
                    {c.name}
                  </span>
                  <span className="text-[11px] text-[#94a3b8] line-clamp-1">
                    {c.purpose}
                  </span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 border ${
                  c.isTracking 
                    ? 'bg-[rgba(245,158,11,0.15)] border-amber-500/30 text-[#f59e0b]' 
                    : 'bg-[#121417] border-[#2a2e35] text-[#94a3b8]'
                }`}>
                  {c.isTracking ? 'Tracking Tag' : 'Session Core'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#94a3b8]">Essential security and authentication cookies.</p>
        )}
      </div>

      {/* Tracking Details & Purposes */}
      <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35] mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2 flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span>Tracking Mechanics</span>
        </h4>
        <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
          {trackingInfo}
        </p>
      </div>

      {/* Important Concerns */}
      {importantConcerns.length > 0 && (
        <div className="p-3.5 rounded-lg bg-[rgba(245,158,11,0.08)] border border-amber-500/30">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f59e0b] mb-1.5 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Notable Tracking Concerns</span>
          </h4>
          <ul className="space-y-1">
            {importantConcerns.map((concern, idx) => (
              <li key={idx} className="text-xs text-amber-200 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 shrink-0" />
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </section>
  );
};
