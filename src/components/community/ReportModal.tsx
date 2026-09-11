import React, { useState } from 'react';
import { Flag, X, AlertCircle, ShieldAlert, Check } from 'lucide-react';
import { ReportReason } from '../../types';
import { communityService } from '../../services/communityService';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  commentId?: string;
  itemTitle?: string;
  itemSnippet?: string;
  currentUserId: string;
  onReportSubmitted: (msg: string) => void;
}

const REPORT_REASONS: { id: ReportReason; label: string; desc: string }[] = [
  { id: 'spam', label: 'Spam or Commercial Solicitation', desc: 'Promotional links, bot generated text, or repetitive posting.' },
  { id: 'misleading', label: 'Misleading or Harmful Legal Advice', desc: 'Factually wrong legal claims, dangerous instructions, or deceptive interpretations.' },
  { id: 'personal_info', label: 'Personal Sensitive Information', desc: 'Contains credit cards, passwords, phone numbers, addresses, or private credentials.' },
  { id: 'harassment', label: 'Harassment or Bullying', desc: 'Attacking individuals, threatening remarks, or derogatory behavior.' },
  { id: 'offensive', label: 'Offensive or Inappropriate Content', desc: 'Vulgar language, discriminatory statements, or hate speech.' },
  { id: 'other', label: 'Other Violation', desc: 'Issues conflicting with Clear Clause community standards.' }
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  postId,
  commentId,
  itemTitle,
  itemSnippet,
  currentUserId,
  onReportSubmitted
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason>('spam');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      communityService.createReport({
        reporterId: currentUserId || 'anonymous-reporter',
        postId,
        commentId,
        itemTitle: itemTitle || 'Community Contribution',
        itemSnippet: itemSnippet ? itemSnippet.slice(0, 100) : undefined,
        reason: selectedReason,
        details: details.trim() || undefined
      });

      onReportSubmitted('Report submitted. Our moderation team will review this promptly.');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg rounded-2xl bg-[#1c1f26] border border-[#2a2e35] shadow-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2e35]">
          <div className="flex items-center gap-2.5 text-rose-400">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Report Content</h3>
              <p className="text-xs text-[#94a3b8]">Help maintain a safe and constructive legal forum</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#252a33] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details Preview */}
        {(itemTitle || itemSnippet) && (
          <div className="my-4 p-3 rounded-lg bg-[#14171c] border border-[#2a2e35] text-xs">
            <span className="text-[#94a3b8] font-medium block mb-1">Reporting:</span>
            {itemTitle && <p className="font-semibold text-white truncate">{itemTitle}</p>}
            {itemSnippet && <p className="text-slate-400 line-clamp-2 italic mt-0.5">"{itemSnippet}"</p>}
          </div>
        )}

        {error && (
          <div className="my-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
              Reason for Report
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {REPORT_REASONS.map((r) => {
                const isSelected = selectedReason === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedReason(r.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500/40 text-white'
                        : 'bg-[#181b1f] border-[#2a2e35] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-500'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{r.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{r.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
              Additional Details (Optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide any context that will assist moderators..."
              rows={2}
              className="w-full rounded-xl bg-[#14171c] border border-[#2a2e35] p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#2a2e35]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#181b1f] hover:bg-[#252a33] border border-[#2a2e35] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
