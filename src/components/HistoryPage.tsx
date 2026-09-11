import React, { useState } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { HistoryItem, RiskLevel } from '../types';

interface HistoryPageProps {
  historyItems: HistoryItem[];
  onOpenItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onNewAnalysis: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  historyItems,
  onOpenItem,
  onDeleteItem,
  onClearAll,
  onNewAnalysis
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');

  const filtered = historyItems.filter((item) => {
    const matchesSearch = 
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.documentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = riskFilter === 'all' || item.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'safe':
        return {
          icon: ShieldCheck,
          label: 'Favorable',
          classes: 'bg-[rgba(16,185,129,0.15)] border-emerald-500/30 text-[#10b981]'
        };
      case 'caution':
        return {
          icon: AlertTriangle,
          label: 'Caution',
          classes: 'bg-[rgba(245,158,11,0.15)] border-amber-500/30 text-[#f59e0b]'
        };
      default:
        return {
          icon: AlertCircle,
          label: 'High Risk',
          classes: 'bg-[rgba(239,68,68,0.15)] border-red-500/30 text-[#ef4444]'
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181b1f] border border-[#2a2e35] text-xs text-[#94a3b8] mb-2">
            <HistoryIcon className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Analysis Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Analysis History
          </h1>
          <p className="text-sm text-[#94a3b8] mt-1">
            Review and revisit previously analyzed Terms & Conditions documents.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {historyItems.length > 0 && (
            <button
              type="button"
              id="clear-all-history-btn"
              onClick={onClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#94a3b8] hover:text-[#ef4444] bg-[#181b1f] hover:bg-[#20242c] border border-[#2a2e35] transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          <button
            type="button"
            id="history-new-analysis-btn"
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#3b82f6] hover:bg-blue-600 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Controls Row: Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-2 bg-[#1c1f26] border border-[#2a2e35] rounded-xl">
        
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#94a3b8] shrink-0" />
          <input
            id="history-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company or document..."
            className="w-full bg-transparent text-xs text-[#f1f5f9] placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setRiskFilter('all')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
              riskFilter === 'all'
                ? 'bg-[#181b1f] text-white border border-[#2a2e35]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setRiskFilter('safe')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
              riskFilter === 'safe'
                ? 'bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-emerald-500/30'
                : 'text-[#94a3b8] hover:text-[#10b981]'
            }`}
          >
            Favorable
          </button>
          <button
            type="button"
            onClick={() => setRiskFilter('caution')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
              riskFilter === 'caution'
                ? 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-amber-500/30'
                : 'text-[#94a3b8] hover:text-[#f59e0b]'
            }`}
          >
            Caution
          </button>
          <button
            type="button"
            onClick={() => setRiskFilter('concerning')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
              riskFilter === 'concerning'
                ? 'bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-red-500/30'
                : 'text-[#94a3b8] hover:text-[#ef4444]'
            }`}
          >
            High Risk
          </button>
        </div>

      </div>

      {/* History Items List or Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl bg-[#1c1f26] border border-[#2a2e35]">
          <div className="w-12 h-12 rounded-xl bg-[#181b1f] border border-[#2a2e35] flex items-center justify-center text-[#94a3b8] mx-auto mb-4">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            {historyItems.length === 0 ? 'No Analyzed Documents Yet' : 'No Matching Records Found'}
          </h3>
          <p className="text-xs text-[#94a3b8] max-w-sm mx-auto mb-6">
            {historyItems.length === 0
              ? 'Paste any Terms of Service link or upload a legal document on the home page to start your first analysis.'
              : 'Try clearing your search query or filter tags to display your saved items.'}
          </p>
          <button
            type="button"
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#3b82f6] hover:bg-blue-600 transition shadow-sm cursor-pointer"
          >
            <span>Start an Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const badge = getRiskBadge(item.riskLevel);
            const Icon = badge.icon;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#1c1f26] border border-[#2a2e35] hover:border-slate-600 transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                {/* Left: Info */}
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onOpenItem(item)}
                >
                  <div className="flex flex-wrap items-center gap-2.5 mb-1">
                    <h3 className="text-base font-semibold text-white group-hover:text-[#3b82f6] transition">
                      {item.companyName}
                    </h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badge.classes}`}>
                      <Icon className="w-3 h-3" />
                      <span>Score {item.overallScore}% • {badge.label}</span>
                    </span>
                  </div>

                  <p className="text-xs text-[#cbd5e1] line-clamp-1 mb-2">
                    {item.documentTitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#94a3b8]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.analyzedDate}</span>
                    </span>
                    {item.summarySnippet && (
                      <span className="text-slate-400 italic line-clamp-1">
                        "{item.summarySnippet}"
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => onOpenItem(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#f1f5f9] bg-[#181b1f] hover:bg-[#20242c] border border-[#2a2e35] transition cursor-pointer"
                  >
                    <span>View Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#3b82f6]" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#181b1f] transition cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
