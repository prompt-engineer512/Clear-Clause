import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  Check, 
  Trash2, 
  EyeOff, 
  Eye, 
  Lock, 
  Pin, 
  AlertTriangle,
  FileText,
  Clock
} from 'lucide-react';
import { CommunityReport, CommunityPost } from '../../types';
import { communityService } from '../../services/communityService';
import { formatTimeAgo } from '../../utils/timeAgo';

interface AdminModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionComplete: (msg: string) => void;
}

export const AdminModerationModal: React.FC<AdminModerationModalProps> = ({
  isOpen,
  onClose,
  onActionComplete
}) => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'manage_posts'>('reports');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    setReports(communityService.getReports());
    setPosts(communityService.getPosts({ showHidden: true }));
  };

  if (!isOpen) return null;

  const handleUpdateReport = (id: string, status: 'reviewed' | 'dismissed') => {
    communityService.updateReportStatus(id, status);
    loadData();
    onActionComplete(`Report marked as ${status}.`);
  };

  const handleDeletePost = (postId: string) => {
    if (!window.confirm('Are you sure you want to completely remove this post and all associated comments?')) return;
    communityService.deletePost(postId, 'admin', true);
    loadData();
    onActionComplete('Post removed by administrator.');
  };

  const handleToggleLock = (postId: string) => {
    const isLocked = communityService.toggleLockPost(postId);
    loadData();
    onActionComplete(isLocked ? 'Discussion locked.' : 'Discussion unlocked.');
  };

  const handleTogglePin = (postId: string) => {
    const isPinned = communityService.togglePinPost(postId);
    loadData();
    onActionComplete(isPinned ? 'Post pinned to top of Community.' : 'Post unpinned.');
  };

  const handleToggleHide = (postId: string, currentStatus: string) => {
    const shouldHide = currentStatus !== 'hidden';
    communityService.setPostHidden(postId, shouldHide);
    loadData();
    onActionComplete(shouldHide ? 'Post hidden from public feed.' : 'Post unhidden.');
  };

  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="w-full max-w-3xl rounded-2xl bg-[#1c1f26] border border-rose-500/30 shadow-2xl overflow-hidden my-6 text-left flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-rose-500/10 border-b border-[#2a2e35] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Community Moderation & Safety Desk</h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">Review flagged discussions, remove spam, lock or pin legal alerts</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#252a33] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#2a2e35] px-6 bg-[#14171c]">
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>Flagged Reports</span>
            {pendingReports.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {pendingReports.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manage_posts')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'manage_posts'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Manage All Discussions ({posts.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'reports' ? (
            reports.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                🎉 No reports flagged! Community discussions are clean and constructive.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      rep.status === 'pending'
                        ? 'bg-[#181b22] border-rose-500/30'
                        : 'bg-[#14171c] border-[#2a2e35] opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold uppercase tracking-wider text-rose-400 text-[10px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/25">
                          {rep.reason}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{formatTimeAgo(rep.createdAt)}</span>
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        rep.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {rep.status}
                      </span>
                    </div>

                    <div>
                      <p className="font-semibold text-white">{rep.itemTitle}</p>
                      {rep.itemSnippet && (
                        <p className="text-slate-400 line-clamp-2 italic mt-0.5">
                          "{rep.itemSnippet}"
                        </p>
                      )}
                      {rep.details && (
                        <p className="text-slate-300 mt-1.5 p-2 rounded bg-[#121417] border border-[#2a2e35]">
                          Reporter Note: {rep.details}
                        </p>
                      )}
                    </div>

                    {rep.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2a2e35]">
                        <button
                          type="button"
                          onClick={() => handleUpdateReport(rep.id, 'dismissed')}
                          className="px-3 py-1 rounded-lg bg-[#14171c] hover:bg-[#252a33] text-slate-300 border border-[#2a2e35] transition cursor-pointer"
                        >
                          Dismiss
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateReport(rep.id, 'reviewed')}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition cursor-pointer"
                        >
                          Mark Reviewed
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-[#14171c] border border-[#2a2e35] flex items-center justify-between gap-4 text-xs"
                >
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white truncate max-w-md">{p.title}</span>
                      {p.pinned && <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">Pinned</span>}
                      {p.status === 'locked' && <span className="text-[10px] text-slate-400 bg-slate-500/10 px-1.5 py-0.2 rounded">Locked</span>}
                      {p.status === 'hidden' && <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded">Hidden</span>}
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      By {p.authorName} • {p.category} • {p.commentCount} comments • {p.helpfulCount} helpful
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTogglePin(p.id)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        p.pinned
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : 'bg-[#181b1f] text-slate-400 hover:text-white border-[#2a2e35]'
                      }`}
                      title={p.pinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleLock(p.id)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        p.status === 'locked'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-[#181b1f] text-slate-400 hover:text-white border-[#2a2e35]'
                      }`}
                      title={p.status === 'locked' ? 'Unlock discussion' : 'Lock discussion'}
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleHide(p.id, p.status)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        p.status === 'hidden'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-[#181b1f] text-slate-400 hover:text-white border-[#2a2e35]'
                      }`}
                      title={p.status === 'hidden' ? 'Unhide post' : 'Hide post'}
                    >
                      {p.status === 'hidden' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePost(p.id)}
                      className="p-1.5 rounded-lg bg-[#181b1f] hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 border border-[#2a2e35] transition cursor-pointer"
                      title="Permanently remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
