import React from 'react';
import { Shield, Database, Share2, AlertTriangle, Users, Lock } from 'lucide-react';
import { DataPrivacySection as DataPrivacyType } from '../types';

interface DataPrivacySectionProps {
  data: DataPrivacyType;
}

export const DataPrivacySection: React.FC<DataPrivacySectionProps> = ({ data }) => {
  const collectedData = Array.isArray(data?.collectedData) ? data.collectedData : [];
  const usagePractices = Array.isArray(data?.usagePractices) ? data.usagePractices : [];
  const thirdPartiesList = Array.isArray(data?.thirdPartiesList) ? data.thirdPartiesList : [];
  const keyConcerns = Array.isArray(data?.keyConcerns) ? data.keyConcerns : [];

  return (
    <section id="section-privacy" className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Data & Privacy Practices
          </h3>
          <p className="text-xs text-[#94a3b8]">
            How personal information is collected, monetized, and shared
          </p>
        </div>
      </div>

      {/* Quick Status Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        
        <div className="p-3.5 rounded-lg bg-[#181b1f] border border-[#2a2e35] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-4 h-4 text-[#94a3b8]" />
            <span className="text-xs font-medium text-[#f1f5f9]">Shared with Third Parties</span>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            data?.sharedWithThirdParties 
              ? 'bg-[rgba(245,158,11,0.15)] border-amber-500/30 text-[#f59e0b]' 
              : 'bg-[rgba(16,185,129,0.15)] border-emerald-500/30 text-[#10b981]'
          }`}>
            {data?.sharedWithThirdParties ? 'Yes, Shared' : 'No 3rd-Party Sharing'}
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#181b1f] border border-[#2a2e35] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-[#94a3b8]" />
            <span className="text-xs font-medium text-[#f1f5f9]">Sold to Data Brokers</span>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            data?.soldToBrokers 
              ? 'bg-[rgba(239,68,68,0.15)] border-red-500/30 text-[#ef4444]' 
              : 'bg-[rgba(16,185,129,0.15)] border-emerald-500/30 text-[#10b981]'
          }`}>
            {data?.soldToBrokers ? 'Yes, Sold' : 'Not Sold to Brokers'}
          </span>
        </div>

      </div>

      {/* Grid: What Data is Collected & How Used */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        
        {/* Collected Data */}
        <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-3 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Data Collected</span>
          </h4>
          {collectedData.length > 0 ? (
            <ul className="space-y-2">
              {collectedData.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#cbd5e1] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#94a3b8]">Standard operational telemetry and account details.</p>
          )}
        </div>

        {/* How Data is Used */}
        <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-3 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>How Data is Used</span>
          </h4>
          {usagePractices.length > 0 ? (
            <ul className="space-y-2">
              {usagePractices.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#cbd5e1] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#94a3b8]">Service fulfillment, fraud prevention, and system maintenance.</p>
          )}
        </div>

      </div>

      {/* Third Parties List */}
      {thirdPartiesList.length > 0 && (
        <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35] mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#94a3b8]" />
            <span>Third-Party Recipients</span>
          </h4>
          <div className="flex flex-wrap gap-2 pt-1">
            {thirdPartiesList.map((partner, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-[#121417] text-[#f1f5f9] text-xs border border-[#2a2e35]">
                {partner}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Key Privacy Concerns */}
      {keyConcerns.length > 0 && (
        <div className="p-4 rounded-lg bg-[rgba(245,158,11,0.08)] border border-amber-500/30">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f59e0b] mb-2 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Notable Privacy Concerns</span>
          </h4>
          <ul className="space-y-1.5">
            {keyConcerns.map((concern, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-amber-200 leading-relaxed">
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
