import React from 'react';
import { ScoreSet, ScoreExplanations } from '../types';

interface ScoreGaugesProps {
  scores: ScoreSet;
  scoreExplanations?: ScoreExplanations;
}

export const ScoreGauges: React.FC<ScoreGaugesProps> = ({ scores, scoreExplanations }) => {
  const getScoreColor = (score: number) => {
    if (score >= 75) {
      return {
        text: 'text-[#10b981]',
        stroke: '#10b981',
        bgStroke: 'rgba(16, 185, 129, 0.12)',
        badgeBg: 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]',
        label: 'Favorable'
      };
    }
    if (score >= 55) {
      return {
        text: 'text-[#f59e0b]',
        stroke: '#f59e0b',
        bgStroke: 'rgba(245, 158, 11, 0.12)',
        badgeBg: 'bg-[#f59e0b]/10 border-[#f59e0b]/30 text-[#f59e0b]',
        label: 'Caution'
      };
    }
    return {
      text: 'text-[#ef4444]',
      stroke: '#ef4444',
      bgStroke: 'rgba(239, 68, 68, 0.12)',
      badgeBg: 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]',
      label: 'High Risk'
    };
  };

  const scoreItems = [
    { 
      title: 'Overall Trust', 
      value: scores.overall, 
      desc: scoreExplanations?.overall || 'Composite safety index' 
    },
    { 
      title: 'Privacy', 
      value: scores.privacy, 
      desc: scoreExplanations?.privacy || 'Data harvesting safeguards' 
    },
    { 
      title: 'Security', 
      value: scores.security, 
      desc: scoreExplanations?.security || 'Encryption standards' 
    },
    { 
      title: 'Transparency', 
      value: scores.transparency, 
      desc: scoreExplanations?.transparency || 'Clarity of legal terms' 
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {scoreItems.map((item) => {
        const style = getScoreColor(item.value);
        const radius = 32;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (item.value / 100) * circumference;

        return (
          <div
            key={item.title}
            className="p-4 rounded-xl bg-[#1c1f26] border border-[#2a2e35] text-center transition-all hover:border-slate-700/80 flex flex-col items-center justify-between"
          >
            {/* SVG Circular Gauge */}
            <div className="relative w-20 h-20 mb-2 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
                {/* Track */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke={style.bgStroke}
                  strokeWidth="5"
                  fill="transparent"
                />
                {/* Progress */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke={style.stroke}
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Inner number */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-bold ${style.text} leading-none font-['Space_Grotesk']`}>
                  {item.value}%
                </span>
              </div>
            </div>

            {/* Score Label & Meta */}
            <div className="w-full">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
                {item.title}
              </div>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style.badgeBg} mb-1`}>
                {style.label}
              </span>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {item.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
