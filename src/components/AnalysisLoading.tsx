import React from 'react';
import { ShieldCheck, Cpu, Search, Lock, FileCheck2, Sparkles } from 'lucide-react';

interface AnalysisLoadingProps {
  currentStep: string;
  progressPercent: number;
}

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({
  currentStep,
  progressPercent
}) => {
  const stepsList = [
    { label: 'Fetching document source...', icon: Search },
    { label: 'Reading and parsing clauses...', icon: FileCheck2 },
    { label: 'Extracting key obligations...', icon: Cpu },
    { label: 'Analyzing privacy and security practices...', icon: Lock },
    { label: 'Computing risk scores and plain summary...', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Central Card */}
      <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-2xl text-center relative overflow-hidden">
        
        {/* Animated AI Emblem */}
        <div className="relative w-16 h-16 mx-auto mb-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-xl bg-blue-500/20 animate-ping opacity-30" />
          <div className="relative w-14 h-14 rounded-xl bg-[#181b1f] border border-[#3b82f6]/40 flex items-center justify-center text-[#3b82f6] shadow-lg">
            <Sparkles className="w-7 h-7 animate-pulse text-[#3b82f6]" />
          </div>
        </div>

        {/* Status Text */}
        <h2 className="text-xl font-semibold text-white mb-1.5 tracking-tight">
          Analyzing Document
        </h2>

        <p className="text-xs sm:text-sm font-medium text-[#3b82f6] min-h-[1.5rem] transition-all duration-300 mb-5">
          {currentStep || 'Initializing analysis pipeline...'}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-[#121417] rounded-full h-2 mb-2 p-0.5 border border-[#2a2e35] overflow-hidden">
          <div
            className="bg-[#3b82f6] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(8, Math.min(100, progressPercent))}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-[#94a3b8] font-mono mb-6">
          <span>CLEARCLAUSE_AI</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>

        {/* Step Indicator Checklist */}
        <div className="space-y-2 text-left pt-4 border-t border-[#2a2e35]">
          {stepsList.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = progressPercent > (idx + 1) * 19;
            const isCurrent = currentStep === step.label;

            return (
              <div 
                key={step.label}
                className={`flex items-center gap-2.5 text-xs transition-colors duration-200 ${
                  isCompleted
                    ? 'text-[#10b981] font-medium'
                    : isCurrent
                    ? 'text-[#3b82f6] font-semibold'
                    : 'text-slate-500'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                  isCompleted 
                    ? 'bg-[rgba(16,185,129,0.2)] text-[#10b981] border border-emerald-500/40'
                    : isCurrent 
                    ? 'bg-[rgba(59,130,246,0.2)] text-[#3b82f6] border border-blue-500/50 animate-pulse'
                    : 'bg-[#181b1f] text-slate-600 border border-[#2a2e35]'
                }`}>
                  <Icon className="w-2.5 h-2.5" />
                </div>
                <span className="truncate">{step.label}</span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
