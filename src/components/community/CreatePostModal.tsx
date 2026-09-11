import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Upload, 
  UserX, 
  ShieldAlert, 
  AlertCircle, 
  Sparkles, 
  HelpCircle,
  FileText,
  Trash2
} from 'lucide-react';
import { CommunityCategory, CommunityPost, PreFillPostData } from '../../types';
import { CATEGORIES_CONFIG } from './CategoryBadges';
import { communityService } from '../../services/communityService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { email: string; name: string } | null;
  onPostCreated: (post: CommunityPost) => void;
  preFillData?: PreFillPostData | null;
  editingPost?: CommunityPost | null;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPostCreated,
  preFillData,
  editingPost
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CommunityCategory>('Ask Clear Clause');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [anonymous, setAnonymous] = useState(false);
  const [sourceDocument, setSourceDocument] = useState('');
  const [safetyWarning, setSafetyWarning] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setCategory(editingPost.category);
      setImageUrl(editingPost.imageUrl || '');
      setAnonymous(editingPost.anonymous || false);
      setSourceDocument(editingPost.sourceDocument || '');
    } else if (preFillData) {
      setTitle(preFillData.title || '');
      setContent(preFillData.content || '');
      if (preFillData.category) {
        setCategory(preFillData.category);
      }
      setSourceDocument(preFillData.sourceDocument || '');
    } else {
      setTitle('');
      setContent('');
      setCategory('Ask Clear Clause');
      setImageUrl('');
      setAnonymous(false);
      setSourceDocument('');
    }
    setFormError(null);
    setSafetyWarning(null);
  }, [preFillData, editingPost, isOpen]);

  // Live safety analysis
  const handleContentChange = (val: string) => {
    setContent(val);
    const check = communityService.validateContentSafety(`${title} ${val}`);
    if (!check.safe) {
      setSafetyWarning(check.warning || 'Potentially sensitive details detected.');
    } else {
      setSafetyWarning(null);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const check = communityService.validateContentSafety(`${val} ${content}`);
    if (!check.safe) {
      setSafetyWarning(check.warning || 'Potentially sensitive details detected.');
    } else {
      setSafetyWarning(null);
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size must be smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
        setFormError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Please enter a clear, descriptive title.');
      return;
    }
    if (title.trim().length < 8) {
      setFormError('Title must be at least 8 characters long.');
      return;
    }
    if (!content.trim()) {
      setFormError('Please provide description or the clause text you are asking about.');
      return;
    }

    // Safety validation
    const safetyCheck = communityService.validateContentSafety(`${title} ${content}`);
    if (!safetyCheck.safe) {
      setFormError(safetyCheck.warning || 'Sensitive info detected.');
      return;
    }

    setIsSubmitting(true);

    try {
      const authorUserId = currentUser ? currentUser.email : 'guest-user';
      const authorUserName = currentUser ? currentUser.name : 'Community Guest';

      if (editingPost) {
        const updated = communityService.updatePost(editingPost.id, authorUserId, {
          title,
          content,
          category,
          imageUrl: imageUrl || undefined
        });
        if (updated) {
          onPostCreated(updated);
          onClose();
        }
      } else {
        const created = communityService.createPost({
          title,
          content,
          category,
          imageUrl: imageUrl || undefined,
          anonymous,
          userId: authorUserId,
          userName: authorUserName,
          sourceDocument: sourceDocument || undefined
        });

        onPostCreated(created);
        onClose();
      }
    } catch (err: any) {
      setFormError(err?.message || 'Failed to publish post. Please check all fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-[#1c1f26] border border-[#2a2e35] shadow-2xl p-5 sm:p-7 relative my-8 overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2e35]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                {editingPost ? 'Edit Discussion' : 'Create a Community Post'}
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Ask questions, share tricky clauses, or discuss consumer agreements
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

        {/* Sensitive data warning banner */}
        {safetyWarning && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-semibold block text-amber-400">Security Warning:</span>
              <span>{safetyWarning}</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {formError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          
          {/* Row 1: Category dropdown & Document Origin (if any) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CommunityCategory)}
                className="w-full rounded-xl bg-[#14171c] border border-[#2a2e35] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
              >
                {CATEGORIES_CONFIG.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#14171c] text-white py-1">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                Source Document / Company (Optional)
              </label>
              <input
                type="text"
                value={sourceDocument}
                onChange={(e) => setSourceDocument(e.target.value)}
                placeholder="e.g., Spotify Terms of Service, Netflix, Gym Contract"
                className="w-full rounded-xl bg-[#14171c] border border-[#2a2e35] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
              Post Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Can someone explain this automatic renewal clause?"
              className="w-full rounded-xl bg-[#14171c] border border-[#2a2e35] px-3.5 py-2.5 text-sm text-white font-medium placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Content / Clause Text */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                Clause Text & Your Question <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">Supports Markdown quotes</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={6}
              placeholder="Quote the specific clause you encountered and describe what you are trying to understand..."
              className="w-full rounded-xl bg-[#14171c] border border-[#2a2e35] p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition leading-relaxed resize-y font-normal"
            />
          </div>

          {/* Screenshot / Image Attachment */}
          <div className="p-3.5 rounded-xl bg-[#14171c] border border-[#2a2e35] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#f1f5f9] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span>Screenshot or Document Attachment (Optional)</span>
              </span>

              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    imageInputMode === 'upload' ? 'bg-[#2a2e35] text-white font-medium' : 'text-slate-400'
                  }`}
                >
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    imageInputMode === 'url' ? 'bg-[#2a2e35] text-white font-medium' : 'text-slate-400'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {imageInputMode === 'upload' ? (
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1c1f26] hover:bg-[#252a33] border border-[#2a2e35] text-xs text-slate-300 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#3b82f6]" />
                  <span>Choose Image File...</span>
                </button>
                <span className="text-[11px] text-slate-500">Max 5MB (PNG, JPG, WebP)</span>
              </div>
            ) : (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/screenshot.png"
                className="w-full rounded-lg bg-[#1c1f26] border border-[#2a2e35] px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            )}

            {/* Image Preview */}
            {imageUrl && (
              <div className="relative inline-block mt-2 rounded-lg overflow-hidden border border-[#2a2e35] max-h-36">
                <img
                  src={imageUrl}
                  alt="Attachment preview"
                  className="max-h-36 object-contain rounded-lg bg-black/40"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-rose-400 hover:text-white transition cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Anonymous Posting Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#14171c] border border-[#2a2e35]">
            <div className="flex items-center gap-2.5">
              <UserX className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-xs font-semibold text-white block">
                  Post anonymously
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Hide your name and avatar. Will display as "Anonymous Member".
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#2a2e35] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3b82f6]" />
            </label>
          </div>

          {/* Educational notice */}
          <div className="text-[11px] text-slate-500 bg-[#181b1f]/60 p-2.5 rounded-lg border border-[#2a2e35]/50 flex items-start gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Discussions in Clear Clause Community are user-generated for educational comparison and should not be treated as formal legal advice.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2a2e35]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#14171c] hover:bg-[#252a33] border border-[#2a2e35] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#3b82f6] hover:bg-blue-600 rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publishing...' : editingPost ? 'Save Changes' : 'Post to Community'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
