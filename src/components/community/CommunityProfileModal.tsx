import React, { useState } from 'react';
import { X, User, ThumbsUp, FileText, Bookmark, Calendar, Award } from 'lucide-react';
import { CommunityPost } from '../../types';
import { communityService } from '../../services/communityService';
import { PostCard } from './PostCard';

interface CommunityProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { email: string; name: string } | null;
  onOpenDetail: (post: CommunityPost) => void;
  onToggleHelpful: (postId: string, e: React.MouseEvent) => void;
  onToggleSave: (postId: string, e: React.MouseEvent) => void;
  onReport: (post: CommunityPost, e: React.MouseEvent) => void;
  onShare: (post: CommunityPost, e: React.MouseEvent) => void;
}

export const CommunityProfileModal: React.FC<CommunityProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenDetail,
  onToggleHelpful,
  onToggleSave,
  onReport,
  onShare
}) => {
  const [activeTab, setActiveTab] = useState<'my_posts' | 'saved'>('my_posts');

  if (!isOpen) return null;

  const userId = currentUser ? currentUser.email : 'guest-user';
  const userName = currentUser ? currentUser.name : 'Community Member';
  const stats = communityService.getUserProfileStats(userId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="w-full max-w-3xl rounded-2xl bg-[#1c1f26] border border-[#2a2e35] shadow-2xl overflow-hidden my-6 text-left flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#141c2c] to-[#181b22] border-b border-[#2a2e35] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#3b82f6] flex items-center justify-center text-white text-xl font-bold shadow-md">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{userName}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25">
                  Contributor
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Joined Clear Clause Community in 2026</span>
              </p>
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

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-3 p-4 sm:p-5 border-b border-[#2a2e35] bg-[#14171c]">
          <div className="p-3 rounded-xl bg-[#181b1f] border border-[#2a2e35] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{stats.postCount}</p>
              <p className="text-[11px] text-slate-400 font-medium">Discussions</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#181b1f] border border-[#2a2e35] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{stats.helpfulReceived}</p>
              <p className="text-[11px] text-slate-400 font-medium">Helpful Received</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#181b1f] border border-[#2a2e35] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{stats.savedCount}</p>
              <p className="text-[11px] text-slate-400 font-medium">Saved Posts</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#2a2e35] px-6">
          <button
            type="button"
            onClick={() => setActiveTab('my_posts')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'my_posts'
                ? 'border-[#3b82f6] text-[#3b82f6]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            My Discussions ({stats.postCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'saved'
                ? 'border-[#3b82f6] text-[#3b82f6]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Saved Items ({stats.savedCount})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'my_posts' ? (
            stats.userPosts.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                You haven't posted any community discussions yet.
              </div>
            ) : (
              stats.userPosts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  onOpenDetail={onOpenDetail}
                  onToggleHelpful={onToggleHelpful}
                  isHelpful={p.helpfulUserIds.includes(userId)}
                  onToggleSave={onToggleSave}
                  isSaved={communityService.isPostSaved(p.id)}
                  onReport={onReport}
                  onShare={onShare}
                />
              ))
            )
          ) : (
            stats.savedPosts.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No saved posts. Click the bookmark icon on any discussion to save it here!
              </div>
            ) : (
              stats.savedPosts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  onOpenDetail={onOpenDetail}
                  onToggleHelpful={onToggleHelpful}
                  isHelpful={p.helpfulUserIds.includes(userId)}
                  onToggleSave={onToggleSave}
                  isSaved={true}
                  onReport={onReport}
                  onShare={onShare}
                />
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};
