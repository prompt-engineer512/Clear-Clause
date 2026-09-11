import React from 'react';
import { 
  ThumbsUp, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Flag, 
  Pin, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  User, 
  UserX,
  FileText
} from 'lucide-react';
import { CommunityPost } from '../../types';
import { CategoryBadge } from './CategoryBadges';
import { formatTimeAgo } from '../../utils/timeAgo';

interface PostCardProps {
  post: CommunityPost;
  onOpenDetail: (post: CommunityPost) => void;
  onToggleHelpful: (postId: string, e: React.MouseEvent) => void;
  isHelpful: boolean;
  onToggleSave: (postId: string, e: React.MouseEvent) => void;
  isSaved: boolean;
  onReport: (post: CommunityPost, e: React.MouseEvent) => void;
  onShare: (post: CommunityPost, e: React.MouseEvent) => void;
  onSelectCategory?: (cat: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onOpenDetail,
  onToggleHelpful,
  isHelpful,
  onToggleSave,
  isSaved,
  onReport,
  onShare,
  onSelectCategory
}) => {
  return (
    <article
      id={`community-post-${post.id}`}
      onClick={() => onOpenDetail(post)}
      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden p-5 sm:p-6 ${
        post.pinned
          ? 'bg-[#181f2c] border-blue-500/30 hover:border-blue-500/50 shadow-md'
          : 'bg-[#1c1f26] border-[#2a2e35] hover:border-slate-600 hover:bg-[#1f232b]'
      }`}
    >
      {/* Pinned / Solved status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {post.pinned && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/25">
              <Pin className="w-3 h-3 rotate-45" />
              <span>Pinned Discussion</span>
            </span>
          )}

          {post.status === 'solved' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
              <CheckCircle2 className="w-3 h-3" />
              <span>Solved</span>
            </span>
          )}

          {post.status === 'locked' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full border border-slate-500/25">
              <Lock className="w-3 h-3" />
              <span>Locked</span>
            </span>
          )}

          {post.aiAnswer && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
              <Sparkles className="w-3 h-3" />
              <span>Clear Clause AI Answered</span>
            </span>
          )}
        </div>

        {/* Category Badge */}
        <CategoryBadge 
          category={post.category} 
          onClick={onSelectCategory ? () => onSelectCategory(post.category) : undefined} 
        />
      </div>

      {/* Author & Timestamp Row */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
          post.anonymous
            ? 'bg-[#252a33] text-slate-400 border border-[#2a2e35]'
            : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs'
        }`}>
          {post.anonymous ? <UserX className="w-3.5 h-3.5" /> : (post.authorAvatar || <User className="w-3 h-3" />)}
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="font-semibold text-slate-200">
            {post.anonymous ? 'Anonymous Member' : post.authorName}
          </span>
          {post.authorRole === 'moderator' && (
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Mod
            </span>
          )}
          <span className="text-slate-500 text-[11px]">•</span>
          <span className="text-slate-400 text-[11px]">
            {formatTimeAgo(post.createdAt)}
          </span>
          {post.sourceDocument && (
            <>
              <span className="text-slate-500 text-[11px] hidden sm:inline">•</span>
              <span className="text-blue-400/90 text-[11px] items-center gap-1 hidden sm:inline-flex">
                <FileText className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{post.sourceDocument}</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Post Title */}
      <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug mb-2">
        {post.title}
      </h3>

      {/* Excerpt / Content Preview */}
      <p className="text-xs sm:text-sm text-[#94a3b8] line-clamp-3 leading-relaxed font-normal mb-4">
        {post.content}
      </p>

      {/* Attached Image Thumbnail Preview */}
      {post.imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-[#2a2e35] max-h-48 bg-black/40">
          <img
            src={post.imageUrl}
            alt="Post attachment preview"
            className="w-full h-auto max-h-48 object-cover group-hover:scale-101 transition duration-300"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Action Toolbar */}
      <div 
        className="flex items-center justify-between pt-3 border-t border-[#2a2e35] text-xs text-slate-400"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Helpful Button */}
          <button
            type="button"
            id={`post-helpful-btn-${post.id}`}
            onClick={(e) => onToggleHelpful(post.id, e)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              isHelpful
                ? 'bg-blue-500/20 text-[#3b82f6] border border-blue-500/40 font-semibold'
                : 'hover:bg-[#252a33] text-slate-400 hover:text-white border border-transparent'
            }`}
            title="Mark this post as helpful"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${isHelpful ? 'fill-blue-500 text-[#3b82f6]' : ''}`} />
            <span>Helpful</span>
            <span className="font-semibold ml-0.5">{post.helpfulCount}</span>
          </button>

          {/* Comment Count / Jump */}
          <button
            type="button"
            onClick={() => onOpenDetail(post)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium hover:bg-[#252a33] text-slate-400 hover:text-white transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Save / Bookmark Button */}
          <button
            type="button"
            id={`post-save-btn-${post.id}`}
            onClick={(e) => onToggleSave(post.id, e)}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isSaved
                ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-[#252a33]'
            }`}
            title={isSaved ? 'Saved to bookmarks' : 'Save post'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Share Button */}
          <button
            type="button"
            id={`post-share-btn-${post.id}`}
            onClick={(e) => onShare(post, e)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#252a33] transition cursor-pointer"
            title="Share discussion"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Report Button */}
          <button
            type="button"
            id={`post-report-btn-${post.id}`}
            onClick={(e) => onReport(post, e)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#252a33] transition cursor-pointer"
            title="Report violation"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
