import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Flame, 
  Clock, 
  ThumbsUp, 
  HelpCircle, 
  CheckCircle2, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  User, 
  ShieldAlert, 
  BookOpen, 
  AlertCircle,
  TrendingUp,
  MessageSquareText,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { 
  CommunityPost, 
  CommunityCategory, 
  CommunityFilter, 
  PreFillPostData,
  CommunityComment
} from '../../types';
import { CATEGORIES_CONFIG } from './CategoryBadges';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import { PostDetailModal } from './PostDetailModal';
import { ReportModal } from './ReportModal';
import { CommunityProfileModal } from './CommunityProfileModal';
import { AdminModerationModal } from './AdminModerationModal';
import { communityService } from '../../services/communityService';

interface CommunityPageProps {
  currentUser: { email: string; name: string } | null;
  onOpenAuth: () => void;
  showToast: (message: string) => void;
  preFillData?: PreFillPostData | null;
  onClearPreFill?: () => void;
  initialPostId?: string | null;
}

const FILTER_TABS: { id: CommunityFilter; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'latest', label: 'Latest', icon: Clock },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'helpful', label: 'Most Helpful', icon: ThumbsUp },
  { id: 'unanswered', label: 'Unanswered', icon: HelpCircle },
  { id: 'solved', label: 'Solved', icon: CheckCircle2 }
];

export const CommunityPage: React.FC<CommunityPageProps> = ({
  currentUser,
  onOpenAuth,
  showToast,
  preFillData,
  onClearPreFill,
  initialPostId
}) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeFilter, setActiveFilter] = useState<CommunityFilter>('latest');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPostDetail, setSelectedPostDetail] = useState<CommunityPost | null>(null);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [reportTarget, setReportTarget] = useState<{ post?: CommunityPost; comment?: CommunityComment } | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [showGuidelinesBanner, setShowGuidelinesBanner] = useState(true);

  const currentUserId = currentUser ? currentUser.email : 'guest-user';

  // Load posts whenever search, category, or filter tab changes
  useEffect(() => {
    loadPosts();
  }, [searchQuery, selectedCategory, activeFilter]);

  // Handle pre-fill from analyzer
  useEffect(() => {
    if (preFillData) {
      setIsCreateModalOpen(true);
    }
  }, [preFillData]);

  // Handle direct post jump from notification
  useEffect(() => {
    if (initialPostId) {
      const p = communityService.getPostById(initialPostId);
      if (p) setSelectedPostDetail(p);
    }
  }, [initialPostId]);

  const loadPosts = () => {
    const list = communityService.getPosts({
      search: searchQuery,
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      filter: activeFilter
    });
    setPosts(list);
  };

  const handlePostCreated = (newPost: CommunityPost) => {
    loadPosts();
    showToast(editingPost ? 'Post updated successfully!' : 'Your discussion is now live on Community!');
    setEditingPost(null);
    if (onClearPreFill) onClearPreFill();
  };

  const handleToggleHelpful = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const { isHelpful } = communityService.toggleHelpfulPost(postId, currentUserId);
      loadPosts();
      if (selectedPostDetail && selectedPostDetail.id === postId) {
        const updated = communityService.getPostById(postId);
        if (updated) setSelectedPostDetail(updated);
      }
      showToast(isHelpful ? 'Marked as helpful 👍' : 'Reaction removed');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSave = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const saved = communityService.toggleSavePost(postId);
      loadPosts();
      showToast(saved ? 'Discussion saved to your profile 🔖' : 'Removed from saved items');
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (post: CommunityPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/#community-${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Discussion link copied to clipboard!');
      }).catch(() => {
        showToast(`Link: ${shareUrl}`);
      });
    } else {
      showToast('Discussion link generated.');
    }
  };

  const handleDeletePost = (postId: string) => {
    try {
      communityService.deletePost(postId, currentUserId, currentUser?.email === 'mayuribhoi213@gmail.com');
      loadPosts();
      if (selectedPostDetail && selectedPostDetail.id === postId) {
        setSelectedPostDetail(null);
      }
      showToast('Discussion deleted.');
    } catch (err: any) {
      alert(err?.message || 'Could not delete post.');
    }
  };

  const trendingPosts = communityService.getPosts({ filter: 'trending' }).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* 1. Header Section */}
      <header className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#161e2e] via-[#1a202c] to-[#14171c] border border-[#2a2e35] shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-[#3b82f6] text-xs font-semibold uppercase tracking-wider mb-3">
              <MessageSquareText className="w-3.5 h-3.5" />
              <span>Clear Clause Legal Forum</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              Community Clause Discussions
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              Explore user-submitted contract terms, compare consumer rights interpretations, and get instant explanations powered by Clear Clause AI and real user insights.
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              id="community-create-post-btn"
              onClick={() => {
                setEditingPost(null);
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#3b82f6] hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </button>

            <button
              type="button"
              id="community-profile-btn"
              onClick={() => setIsProfileModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-[#181b1f] hover:bg-[#252a33] border border-[#2a2e35] transition cursor-pointer"
            >
              <User className="w-4 h-4 text-[#3b82f6]" />
              <span>My Profile</span>
            </button>

            {/* Admin Desk Trigger */}
            <button
              type="button"
              id="community-admin-desk-btn"
              onClick={() => setIsAdminModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition cursor-pointer"
              title="Moderation & Safety"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden sm:inline">Moderation</span>
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="mt-6 pt-5 border-t border-[#2a2e35]/80 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="community-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clauses, keywords, privacy terms, arbitration, or companies..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#121417] border border-[#2a2e35] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-400 whitespace-nowrap hidden sm:block">
            Showing <strong className="text-white font-semibold">{posts.length}</strong> discussions
          </div>
        </div>
      </header>

      {/* 2. Educational & Guidelines Safety Banner (#13) */}
      {showGuidelinesBanner && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-start justify-between gap-3 text-xs text-blue-200">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-white block">
                Community Guidelines & Educational Notice
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Clear Clause discussions are user-generated educational comparisons. They do not constitute formal legal advice. Please do NOT post passwords, financial numbers, or private credentials.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowGuidelinesBanner(false)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-blue-500/20 transition cursor-pointer shrink-0"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Category Filters Horizontal Scroll / Chips (#2) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Categories</span>
          </span>
          {selectedCategory !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="text-[11px] text-blue-400 hover:underline cursor-pointer"
            >
              Reset to All
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-[#3b82f6] text-white border-blue-500 shadow-sm font-semibold'
                : 'bg-[#181b1f] text-slate-300 border-[#2a2e35] hover:border-slate-600 hover:bg-[#20242c]'
            }`}
          >
            All Categories ({communityService.getPosts({ search: searchQuery }).length})
          </button>

          {CATEGORIES_CONFIG.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? `${cat.bgColor} ${cat.color} ${cat.borderColor} font-semibold ring-1 ring-blue-500/30`
                    : 'bg-[#181b1f] text-slate-300 border-[#2a2e35] hover:border-slate-600 hover:bg-[#20242c]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? cat.color : 'text-slate-400'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Filter Tabs (#9: Latest, Trending, Most Helpful, Unanswered, Solved) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2e35] pb-2">
        <div className="flex items-center gap-1 sm:gap-2">
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                id={`filter-tab-${tab.id}`}
                onClick={() => setActiveFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-500/15 text-[#3b82f6] border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c1f26]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Create Post quick button */}
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="sm:hidden inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-[#3b82f6] rounded-lg cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Post</span>
        </button>
      </div>

      {/* 5. Main Feed Layout (Left: Posts, Right: Sidebar on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Feed Content (8 cols) */}
        <main className="lg:col-span-8 space-y-4">
          {posts.length === 0 ? (
            <div className="rounded-2xl p-10 bg-[#1c1f26] border border-[#2a2e35] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">No discussions found</h3>
              <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
                {searchQuery
                  ? `No posts matched "${searchQuery}". Try different keywords or reset category filters.`
                  : 'There are no discussions matching this filter yet. Be the first to start a conversation!'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setActiveFilter('latest');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#3b82f6] bg-blue-500/10 border border-blue-500/25 hover:bg-blue-500/20 transition cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onOpenDetail={(p) => setSelectedPostDetail(p)}
                onToggleHelpful={handleToggleHelpful}
                isHelpful={post.helpfulUserIds.includes(currentUserId)}
                onToggleSave={handleToggleSave}
                isSaved={communityService.isPostSaved(post.id)}
                onReport={(p, e) => {
                  e.stopPropagation();
                  setReportTarget({ post: p });
                }}
                onShare={handleShare}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
              />
            ))
          )}
        </main>

        {/* Right Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-5">
          
          {/* Trending Discussions Widget */}
          <div className="p-5 rounded-2xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Trending Discussions</span>
            </div>

            <div className="space-y-3">
              {trendingPosts.map((tp, idx) => (
                <div
                  key={tp.id}
                  onClick={() => setSelectedPostDetail(tp)}
                  className="group p-3 rounded-xl bg-[#14171c] hover:bg-[#1c222e] border border-[#2a2e35] transition cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-blue-400">#{idx + 1} {tp.category}</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-slate-500" />
                      <span>{tp.helpfulCount}</span>
                    </span>
                  </div>
                  <h4 className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {tp.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Legal Clause Help Card */}
          <div className="p-5 rounded-2xl bg-[#0e1726] border border-blue-500/30 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2F8CFF]">
              <Sparkles className="w-4 h-4" />
              <span>Analyzed a Document?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              You can discuss clauses found in the <strong>Terms Analyzer</strong> directly with this community. Look for the <span className="text-blue-400 font-semibold">"💬 Discuss with Community"</span> button on any clause card.
            </p>
          </div>

          {/* Safety & Moderation Summary */}
          <div className="p-5 rounded-2xl bg-[#1c1f26] border border-[#2a2e35] text-xs text-slate-400 space-y-2.5">
            <div className="flex items-center gap-2 font-semibold text-white">
              <BookOpen className="w-4 h-4 text-[#3b82f6]" />
              <span>Community Standards</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
              <li>Keep inquiries professional and objective</li>
              <li>Mark answers as <strong className="text-emerald-400">Best Answer</strong> when your question is answered</li>
              <li>Helpful votes promote reliable analysis</li>
              <li>Report misleading advice or offensive submissions</li>
            </ul>
          </div>

        </aside>

      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPost(null);
          if (onClearPreFill) onClearPreFill();
        }}
        currentUser={currentUser}
        onPostCreated={handlePostCreated}
        preFillData={preFillData}
        editingPost={editingPost}
      />

      {selectedPostDetail && (
        <PostDetailModal
          post={selectedPostDetail}
          onClose={() => setSelectedPostDetail(null)}
          currentUser={currentUser}
          onToggleHelpful={(postId) => handleToggleHelpful(postId)}
          isHelpful={selectedPostDetail.helpfulUserIds.includes(currentUserId)}
          onToggleSave={(postId) => handleToggleSave(postId)}
          isSaved={communityService.isPostSaved(selectedPostDetail.id)}
          onReportPost={(post) => setReportTarget({ post })}
          onReportComment={(comment) => setReportTarget({ comment })}
          onShare={(p) => handleShare(p)}
          onDeletePost={handleDeletePost}
          onEditPost={(p) => {
            setEditingPost(p);
            setSelectedPostDetail(null);
            setIsCreateModalOpen(true);
          }}
          onPostUpdated={(updated) => {
            setSelectedPostDetail(updated);
            loadPosts();
          }}
        />
      )}

      {reportTarget && (
        <ReportModal
          isOpen={true}
          onClose={() => setReportTarget(null)}
          postId={reportTarget.post?.id || reportTarget.comment?.postId}
          commentId={reportTarget.comment?.id}
          itemTitle={reportTarget.post?.title || `Comment on post`}
          itemSnippet={reportTarget.post?.content || reportTarget.comment?.content}
          currentUserId={currentUserId}
          onReportSubmitted={(msg) => showToast(msg)}
        />
      )}

      <CommunityProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onOpenDetail={(p) => {
          setIsProfileModalOpen(false);
          setSelectedPostDetail(p);
        }}
        onToggleHelpful={handleToggleHelpful}
        onToggleSave={handleToggleSave}
        onReport={(p, e) => {
          e.stopPropagation();
          setReportTarget({ post: p });
        }}
        onShare={handleShare}
      />

      <AdminModerationModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onActionComplete={(msg) => {
          showToast(msg);
          loadPosts();
        }}
      />

    </div>
  );
};
