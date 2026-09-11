import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { TrustTimelinePoint } from '../types';

interface TrustTimelineSectionProps {
  trustTimeline?: {
    trend: 'Improving' | 'Declining' | 'Stable';
    history: TrustTimelinePoint[];
  };
  companyName: string;
}

export const TrustTimelineSection: React.FC<TrustTimelineSectionProps> = ({ trustTimeline, companyName }) => {
  if (!trustTimeline || !trustTimeline.history || trustTimeline.history.length === 0) {
    return null;
  }

  const currentTrend = trustTimeline.trend || 'Stable';

  const getTrendIcon = () => {
    switch (currentTrend) {
      case 'Improving':
        return <TrendingUp className="w-4 h-4 text-[#10b981]" />;
      case 'Declining':
        return <TrendingDown className="w-4 h-4 text-[#ef4444]" />;
      default:
        return <Minus className="w-4 h-4 text-[#f59e0b]" />;
    }
  };

  const getTrendBadgeStyle = () => {
    switch (currentTrend) {
      case 'Improving':
        return 'bg-[rgba(16,185,129,0.15)] border-emerald-500/30 text-[#10b981]';
      case 'Declining':
        return 'bg-[rgba(239,68,68,0.15)] border-red-500/30 text-[#ef4444]';
      default:
        return 'bg-[rgba(245,158,11,0.15)] border-amber-500/30 text-[#f59e0b]';
    }
  };

  return (
    <section id="section-trust" className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Trust Timeline
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Longitudinal privacy trajectory for {companyName}
            </p>
          </div>
        </div>

        {/* Overall Trend Indicator */}
        <div className={`px-3 py-1 rounded-full border flex items-center gap-2 text-xs font-semibold ${getTrendBadgeStyle()}`}>
          {getTrendIcon()}
          <span>Trend: {currentTrend}</span>
        </div>
      </div>

      {/* Visual Timeline Bars */}
      <div className="space-y-3 pt-1">
        {trustTimeline.history.map((point) => {
          const isHigh = point.score >= 75;
          const isMed = point.score >= 55 && point.score < 75;

          const barColor = isHigh 
            ? 'bg-[#10b981]' 
            : isMed 
            ? 'bg-[#f59e0b]' 
            : 'bg-[#ef4444]';

          return (
            <div key={point.year} className="p-3.5 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="font-mono text-xs font-bold text-[#f1f5f9]">
                  {point.year}
                </span>

                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="text-[#cbd5e1] font-mono">{point.score}/100</span>
                  <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${
                    point.status === 'improving'
                      ? 'bg-[rgba(16,185,129,0.15)] border-emerald-500/30 text-[#10b981]'
                      : point.status === 'declining'
                      ? 'bg-[rgba(239,68,68,0.15)] border-red-500/30 text-[#ef4444]'
                      : 'bg-[#121417] border-[#2a2e35] text-[#94a3b8]'
                  }`}>
                    {point.status}
                  </span>
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="w-full bg-[#121417] rounded-full h-1.5 overflow-hidden mb-2 border border-[#2a2e35]">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: `${point.score}%` }}
                />
              </div>

              <p className="text-[11px] text-[#94a3b8] leading-tight">
                {point.eventHighlight}
              </p>
            </div>
          );
        })}
      </div>

    </section>
  );
};
