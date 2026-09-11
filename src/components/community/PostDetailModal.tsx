import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft, 
  ThumbsUp, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Flag, 
  CheckCircle, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  User, 
  UserX, 
  Reply, 
  Trash2, 
  Edit3, 
  Pin, 
  ShieldAlert, 
  AlertCircle, 
  Bot, 
  Send,
  FileText,
  CornerDownRight
} from 'lucide-react';
import { CommunityPost, CommunityComment, CommunityAIAnswer } from '../../types';
import { CategoryBadge } from './CategoryBadges';
import { formatTimeAgo } from '../../utils/timeAgo';
import { communityService } from '../../services/communityService';

interface PostDetailModalProps {
  post: CommunityPost;
  onClose: () => void;
  currentUser: { email: string; name: string } | null;
  onToggleHelpful: (postId: string) => void;
  isHelpful: boolean;
  onToggleSave: (postId: string) => void;
  isSaved: boolean;
  onReportPost: (post: CommunityPost) => void;
  onReportComment: (comment: CommunityComment) => void;
  onShare: (post: CommunityPost) => void;
  onDeletePost?: (postId: string) => void;
  onEditPost?: (post: CommunityPost) => void;
  onPostUpdated?: (updated: CommunityPost) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post: initialPost,
  onClose,
  currentUser,
  onToggleHelpful,
  isHelpful,
  onToggleSave,
  isSaved,
  onReportPost,
  onReportComment,
  onShare,
  onDeletePost,
  onEditPost,
  onPostUpdated
}) => {
  const [post, setPost] = useState<CommunityPost>(initialPost);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentAnonymous, setCommentAnonymous] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const currentUserId = currentUser ? currentUser.email : 'guest-user';
  const currentUserName = currentUser ? currentUser.name : 'Community Guest';
  const isPostAuthor = post.userId === currentUserId || (currentUser && currentUser.email === 'mayuribhoi213@gmail.com');

  useEffect(() => {
    loadComments();
  }, [post.id]);

  const loadComments = () => {
    const list = communityService.getComments(post.id);
    setComments(list);
  };

  const handleAskAI = async () => {
    setIsGeneratingAI(true);
    try {
      const aiAns = await communityService.generateAIAnswer(post.id);
      const updatedPost = { ...post, aiAnswer: aiAns };
      setPost(updatedPost);
      if (onPostUpdated) onPostUpdated(updatedPost);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError(null);

    if (!commentText.trim()) {
      setCommentError('Please write your answer or comment before submitting.');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const newComment = communityService.createComment({
        postId: post.id,
        userId: currentUserId,
        userName: currentUserName,
        content: commentText.trim(),
        parentCommentId: null,
        anonymous: commentAnonymous
      });

      setCommentText('');
      setComments((prev) => [...prev, newComment]);
      const updatedPost = { ...post, commentCount: (post.commentCount || 0) + 1 };
      setPost(updatedPost);
      if (onPostUpdated) onPostUpdated(updatedPost);
    } catch (err: any) {
      setCommentError(err?.message || 'Failed to submit comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSubmitReply = (parentCommentId: string) => {
    if (!replyText.trim()) return;

    try {
      const newReply = communityService.createComment({
        postId: post.id,
        userId: currentUserId,
        userName: currentUserName,
        content: replyText.trim(),
        parentCommentId: parentCommentId,
        anonymous: false
      });

      setReplyText('');
      setReplyingToId(null);
      setComments((prev) => [...prev, newReply]);
      const updatedPost = { ...post, commentCount: (post.commentCount || 0) + 1 };
      setPost(updatedPost);
      if (onPostUpdated) onPostUpdated(updatedPost);
    } catch (err: any) {
      alert(err?.message || 'Failed to submit reply.');
    }
  };

  const handleMarkBestAnswer = (commentId: string) => {
    try {
      communityService.markBestAnswer(post.id, commentId, currentUserId, currentUser?.email === 'mayuribhoi213@gmail.com');
      loadComments();
      const updated = communityService.getPostById(post.id);
      if (updated) {
        setPost(updated);
        if (onPostUpdated) onPostUpdated(updated);
      }
    } catch (err: any) {
      alert(err?.message || 'Could not mark best answer.');
    }
  };

  const handleToggleHelpfulComment = (commentId: string) => {
    try {
      communityService.toggleHelpfulComment(commentId, currentUserId);
      loadComments();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      communityService.deleteComment(commentId, currentUserId, currentUser?.email === 'mayuribhoi213@gmail.com');
      loadComments();
      const updated = communityService.getPostById(post.id);
      if (updated) {
        setPost(updated);
        if (onPostUpdated) onPostUpdated(updated);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to delete comment.');
    }
  };

  // Group comments into root comments and nested replies
  const rootComments = comments.filter((c) => !c.parentCommentId);
  const getRepliesFor = (commentId: string) => comments.filter((c) => c.parentCommentId === commentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="w-full max-w-3xl rounded-2xl bg-[#1c1f26] border border-[#2a2e35] shadow-2xl overflow-hidden my-4 sm:my-8 text-left flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Back button and Quick Actions */}
        <div className="sticky top-0 z-20 px-5 sm:px-6 py-4 bg-[#181b1f]/95 backdrop-blur-md border-b border-[#2a2e35] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-[#252a33] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#3b82f6]" />
            <span>Back to Community</span>
          </button>

          <div className="flex items-center gap-1.5">
            {isPostAuthor && onEditPost && (
              <button
                type="button"
                onClick={() => onEditPost(post)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#252a33] transition cursor-pointer"
                title="Edit post"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {isPostAuthor && onDeletePost && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this discussion?')) {
                    onDeletePost(post.id);
                    onClose();
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#252a33] transition cursor-pointer"
                title="Delete post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#252a33] transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
          
          {/* Post Content Article */}
          <article className="space-y-4">
            
            {/* Meta Tags / Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={post.category} size="md" />

              {post.pinned && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/25">
                  <Pin className="w-3.5 h-3.5 rotate-45" />
                  <span>Pinned Discussion</span>
                </span>
              )}

              {post.status === 'solved' && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/25">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Solved</span>
                </span>
              )}

              {post.status === 'locked' && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-500/10 px-2.5 py-1 rounded-md border border-slate-500/25">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Locked</span>
                </span>
              )}
            </div>

            {/* Author details */}
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                post.anonymous
                  ? 'bg-[#252a33] text-slate-400 border border-[#2a2e35]'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm'
              }`}>
                {post.anonymous ? <UserX className="w-4 h-4" /> : (post.authorAvatar || <User className="w-4 h-4" />)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {post.anonymous ? 'Anonymous Member' : post.authorName}
                  </span>
                  {post.authorRole === 'moderator' && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Mod
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{formatTimeAgo(post.createdAt)}</span>
                  {post.sourceDocument && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-blue-400">
                        <FileText className="w-3 h-3" />
                        <span>{post.sourceDocument}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {post.title}
            </h1>

            {/* Full text content */}
            <div className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line font-normal bg-[#14171c]/50 p-4 sm:p-5 rounded-xl border border-[#2a2e35]/60">
              {post.content}
            </div>

            {/* Screenshot attachment preview */}
            {post.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-[#2a2e35] max-h-96 bg-black/50">
                <img
                  src={post.imageUrl}
                  alt="Post attachment"
                  className="w-full h-auto max-h-96 object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Post actions bar */}
            <div className="flex items-center justify-between pt-3 pb-2 border-b border-[#2a2e35] text-xs">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  id="detail-helpful-btn"
                  onClick={() => onToggleHelpful(post.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isHelpful
                      ? 'bg-blue-500/20 text-[#3b82f6] border border-blue-500/40'
                      : 'bg-[#181b1f] hover:bg-[#252a33] text-slate-300 border border-[#2a2e35]'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isHelpful ? 'fill-blue-500 text-[#3b82f6]' : ''}`} />
                  <span>Helpful</span>
                  <span className="bg-[#121417] px-1.5 py-0.2 rounded-md font-bold text-[11px] text-white">
                    {post.helpfulCount}
                  </span>
                </button>

                <div className="flex items-center gap-1.5 text-slate-400 px-2 py-1 text-xs">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{comments.length} comments</span>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => onToggleSave(post.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition cursor-pointer text-xs font-medium ${
                    isSaved
                      ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white bg-[#181b1f] hover:bg-[#252a33] border border-[#2a2e35]'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400' : ''}`} />
                  <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onShare(post)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white bg-[#181b1f] hover:bg-[#252a33] border border-[#2a2e35] transition cursor-pointer text-xs font-medium"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button
                  type="button"
                  onClick={() => onReportPost(post)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#252a33] transition cursor-pointer"
                  title="Report post"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

          </article>

          {/* AI Answer Section (#7) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1524] border border-blue-500/30 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[#2F8CFF]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F8CFF]">
                    Clear Clause AI Explanation
                  </h4>
                  <span className="text-[11px] text-slate-400">Powered by Gemini 3.8 Flash</span>
                </div>
              </div>

              {!post.aiAnswer && (
                <button
                  type="button"
                  id="ask-ai-detail-btn"
                  onClick={handleAskAI}
                  disabled={isGeneratingAI}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1677FF] hover:bg-blue-600 rounded-xl transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAI ? 'Analyzing Clause...' : '✨ Ask Clear Clause AI'}</span>
                </button>
              )}
            </div>

            {post.aiAnswer ? (
              <div className="space-y-3">
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                  {post.aiAnswer.content}
                </div>
                <div className="pt-2 border-t border-blue-500/20 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="italic">
                    {post.aiAnswer.disclaimer}
                  </span>
                  <span>{formatTimeAgo(post.aiAnswer.generatedAt)}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                Click <span className="text-blue-400 font-semibold">"✨ Ask Clear Clause AI"</span> to get an instant, plain-English breakdown of this question and its consumer legal implications.
              </p>
            )}
          </div>

          {/* Comments and Answers Section */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#2a2e35] pb-3">
              <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                <span>Discussion & Answers</span>
                <span className="text-xs font-normal text-slate-400">({comments.length})</span>
              </h3>
            </div>

            {/* Comment Form */}
            {post.status !== 'locked' ? (
              <form onSubmit={handleSubmitComment} className="p-4 rounded-xl bg-[#14171c] border border-[#2a2e35] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Add to the discussion
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={commentAnonymous}
                      onChange={(e) => setCommentAnonymous(e.target.checked)}
                      className="rounded border-[#2a2e35] text-blue-500 focus:ring-0"
                    />
                    <span>Post anonymously</span>
                  </label>
                </div>

                {commentError && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{commentError}</span>
                  </div>
                )}

                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  placeholder="Share legal context, similar experiences, or clarification..."
                  className="w-full rounded-xl bg-[#181b1f] border border-[#2a2e35] p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-y"
                />

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim()}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3b82f6] hover:bg-blue-600 rounded-xl transition cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingComment ? 'Posting...' : 'Post Answer'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#14171c] border border-[#2a2e35] text-xs text-slate-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>This discussion is locked. New comments and replies are currently disabled.</span>
              </div>
            )}

            {/* Comment List */}
            {rootComments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No comments yet. Be the first to provide insight!
              </div>
            ) : (
              <div className="space-y-4">
                {rootComments.map((comment) => {
                  const replies = getRepliesFor(comment.id);
                  const isCommentHelpful = comment.helpfulUserIds.includes(currentUserId);
                  const isAuthorOfComment = comment.userId === currentUserId;

                  return (
                    <div
                      key={comment.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        comment.isBestAnswer
                          ? 'bg-[#0e221b] border-emerald-500/40 shadow-md ring-1 ring-emerald-500/30'
                          : 'bg-[#181b1f] border-[#2a2e35]'
                      }`}
                    >
                      {/* Best Answer Badge */}
                      {comment.isBestAnswer && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>✅ Best Answer Selected by Author</span>
                        </div>
                      )}

                      {/* Comment Author Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            comment.anonymous ? 'bg-[#252a33] text-slate-400' : 'bg-blue-600 text-white'
                          }`}>
                            {comment.anonymous ? <UserX className="w-3 h-3" /> : (comment.authorAvatar || 'U')}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white">
                              {comment.anonymous ? 'Anonymous Member' : comment.authorName}
                            </span>
                            <span className="text-[11px] text-slate-400 ml-2">
                              {formatTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Mark as Best Answer button (for post author) */}
                          {isPostAuthor && (
                            <button
                              type="button"
                              onClick={() => handleMarkBestAnswer(comment.id)}
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                                comment.isBestAnswer
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-[#14171c] text-slate-300 hover:text-emerald-400 border-[#2a2e35] hover:border-emerald-500/30'
                              }`}
                              title={comment.isBestAnswer ? 'Unmark as best answer' : 'Mark as best answer'}
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>{comment.isBestAnswer ? 'Best Answer' : 'Mark Best Answer'}</span>
                            </button>
                          )}

                          {/* Delete Comment */}
                          {(isAuthorOfComment || isPostAuthor) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                              title="Delete comment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onReportComment(comment)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                            title="Report comment"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Comment Body */}
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal pl-8">
                        {comment.content}
                      </p>

                      {/* Comment Toolbar */}
                      <div className="flex items-center gap-4 mt-3 pl-8 text-xs text-slate-400">
                        <button
                          type="button"
                          onClick={() => handleToggleHelpfulComment(comment.id)}
                          className={`flex items-center gap-1 hover:text-white transition cursor-pointer ${
                            isCommentHelpful ? 'text-blue-400 font-semibold' : ''
                          }`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${isCommentHelpful ? 'fill-blue-500 text-blue-400' : ''}`} />
                          <span>Helpful ({comment.helpfulCount})</span>
                        </button>

                        {post.status !== 'locked' && (
                          <button
                            type="button"
                            onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                            className="flex items-center gap-1 hover:text-white transition cursor-pointer"
                          >
                            <Reply className="w-3 h-3" />
                            <span>Reply</span>
                          </button>
                        )}
                      </div>

                      {/* Inline Reply Input */}
                      {replyingToId === comment.id && (
                        <div className="mt-3 pl-8 animate-in fade-in">
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#14171c] border border-[#2a2e35]">
                            <CornerDownRight className="w-4 h-4 text-slate-500 shrink-0" />
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to ${comment.authorName}...`}
                              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSubmitReply(comment.id);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleSubmitReply(comment.id)}
                              className="px-3 py-1 rounded-lg bg-[#3b82f6] text-white text-xs font-semibold hover:bg-blue-600 transition cursor-pointer shrink-0"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Nested Replies List */}
                      {replies.length > 0 && (
                        <div className="mt-4 pl-8 space-y-3 border-l-2 border-[#2a2e35] ml-3">
                          {replies.map((reply) => (
                            <div key={reply.id} className="p-3 rounded-xl bg-[#14171c] border border-[#2a2e35]/70 text-xs">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-slate-200">
                                    {reply.anonymous ? 'Anonymous Member' : reply.authorName}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {formatTimeAgo(reply.createdAt)}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => onReportComment(reply)}
                                  className="text-slate-500 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                                  title="Report reply"
                                >
                                  <Flag className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-slate-300 leading-relaxed font-normal">
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </section>

        </div>
      </div>
    </div>
  );
};
