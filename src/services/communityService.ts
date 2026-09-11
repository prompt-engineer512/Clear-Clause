import { 
  CommunityPost, 
  CommunityComment, 
  CommunityReport, 
  CommunityNotification, 
  CommunityCategory,
  CommunityFilter,
  CommunityAIAnswer
} from '../types';

const STORAGE_POSTS_KEY = 'clearclause_community_posts_v1';
const STORAGE_COMMENTS_KEY = 'clearclause_community_comments_v1';
const STORAGE_SAVED_KEY = 'clearclause_community_saved_v1';
const STORAGE_REPORTS_KEY = 'clearclause_community_reports_v1';
const STORAGE_NOTIFICATIONS_KEY = 'clearclause_community_notifications_v1';

// Seed sample discussions per prompt requirements (#19)
const SEED_POSTS: CommunityPost[] = [
  {
    id: 'post-seed-1',
    userId: 'user-mayuri',
    authorName: 'Mayuri B.',
    authorAvatar: 'MB',
    authorRole: 'user',
    title: 'Can someone explain this automatic renewal clause?',
    content: 'I noticed this clause in a streaming service contract:\n\n"Your subscription will automatically renew at the end of each billing cycle unless cancelled at least 48 hours before the renewal date. Upon renewal, the prevailing monthly fee will be billed directly to your stored payment method without prior affirmative notice."\n\nIs it legal for them not to send a reminder before debiting my card, especially if the price increases?',
    category: 'Refund & Money',
    anonymous: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    helpfulCount: 14,
    helpfulUserIds: ['user-sarah', 'user-alex', 'user-david'],
    commentCount: 4,
    status: 'solved',
    pinned: true,
    bestAnswerCommentId: 'comment-seed-1-2',
    aiAnswer: {
      content: 'Automatic renewal generally means that a subscription continues automatically after the current cycle unless canceled according to stated terms.\n\nKey takeaways:\n• Many jurisdictions require reasonable advance notice if pricing changes.\n• A 48-hour cancellation requirement is common in consumer agreements, but companies cannot make the cancellation process unreasonably difficult compared to signup (the "Click-to-Cancel" rule).\n• Keep record of cancellation confirmation emails.',
      generatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      disclaimer: 'AI-generated information is for educational purposes and should not be treated as legal advice.'
    },
    isDemo: true,
    tags: ['auto-renewal', 'billing', 'cancellation'],
    sourceDocument: 'Streaming Plus Terms'
  },
  {
    id: 'post-seed-2',
    userId: 'user-alex',
    authorName: 'Alex Mercer',
    authorAvatar: 'AM',
    authorRole: 'user',
    title: 'What happens to my personal data after I delete my account?',
    content: 'I requested account deletion on a shopping portal, but their Privacy section says:\n\n"We retain transaction logs, device identifiers, and anonymized behavioral telemetry indefinitely for fraud prevention, audit compliance, and legitimate business operations."\n\nDoes this mean my data is never truly expunged? Can they still link it back to my identity?',
    category: 'Privacy',
    anonymous: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    helpfulCount: 21,
    helpfulUserIds: ['user-mayuri', 'user-elena', 'user-chen'],
    commentCount: 3,
    status: 'open',
    pinned: false,
    aiAnswer: {
      content: 'Under data protection frameworks (such as GDPR or CCPA), companies may retain specific transaction records required for tax, accounting, and anti-fraud purposes even after account deletion.\n\nHowever, true personal identifiers should be pseudonymized or stripped of direct links to your real name or contact info. If they retain raw identifiers indefinitely without specific legal hold justifications, it warrants scrutiny.',
      generatedAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(),
      disclaimer: 'AI-generated information is for educational purposes and should not be treated as legal advice.'
    },
    isDemo: true,
    tags: ['privacy', 'deletion', 'gdpr'],
    sourceDocument: 'RetailExpress Privacy Policy'
  },
  {
    id: 'post-seed-3',
    userId: 'user-david',
    authorName: 'Anonymous Member',
    authorRole: 'user',
    title: 'I found a hidden mandatory arbitration clause and class action waiver',
    content: 'Analyzing the updated Terms of Service for my smart fitness tracker with Clear Clause, I found Section 14:\n\n"You agree that all disputes shall be resolved exclusively through binding individual arbitration administered by AAA, and you expressly waive any right to bring or participate in any class action, collective proceeding, or representative lawsuit."\n\nIs there usually an opt-out window for these clauses?',
    category: 'Hidden Clauses',
    anonymous: true,
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    helpfulCount: 19,
    helpfulUserIds: ['user-mayuri', 'user-sarah'],
    commentCount: 2,
    status: 'open',
    pinned: false,
    aiAnswer: null,
    isDemo: true,
    tags: ['arbitration', 'class-action', 'rights'],
    sourceDocument: 'FitLife Device Terms'
  },
  {
    id: 'post-seed-4',
    userId: 'user-elena',
    authorName: 'Elena Rostova',
    authorAvatar: 'ER',
    authorRole: 'moderator',
    title: 'Can a company change its Terms & Conditions without notifying users?',
    content: 'I keep seeing this phrasing across mobile apps:\n\n"We reserve the right to modify these Terms at any time without notice. Your continued use of the Application following any amendments constitutes acceptance of the revised Terms."\n\nAre unilateral modifications without any email or in-app pop-up notification enforceable?',
    category: 'Risk Alerts',
    anonymous: false,
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    helpfulCount: 32,
    helpfulUserIds: ['user-david', 'user-alex', 'user-mayuri'],
    commentCount: 5,
    status: 'open',
    pinned: true,
    aiAnswer: {
      content: 'Courts in many jurisdictions have found "browsewrap" or unilateral "no-notice" modifications unenforceable, especially when altering material terms like arbitration, pricing, or data ownership.\n\nBest practice requires companies to provide conspicuous notice (such as an email notification or mandatory click-through modal) when making substantial changes to user agreements.',
      generatedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      disclaimer: 'AI-generated information is for educational purposes and should not be treated as legal advice.'
    },
    isDemo: true,
    tags: ['unilateral-change', 'notice', 'enforceability']
  },
  {
    id: 'post-seed-5',
    userId: 'user-chen',
    authorName: 'Chen Wei',
    authorAvatar: 'CW',
    authorRole: 'user',
    title: 'Is this refund policy fair? 15% restocking fee on digital software downloads',
    content: 'Bought a license key for productivity software that had fatal bugs on my machine. When I asked for a refund within 4 hours of purchase, support pointed to:\n\n"All digital product sales are final. Discretionary refund requests are subject to a 15% non-refundable administrative processing fee."\n\nCan an automated digital download realistically claim administrative restocking costs?',
    category: 'Refund & Money',
    anonymous: false,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    helpfulCount: 16,
    helpfulUserIds: ['user-sarah'],
    commentCount: 1,
    status: 'open',
    pinned: false,
    aiAnswer: null,
    isDemo: true,
    tags: ['refunds', 'digital-goods', 'consumer-rights']
  },
  {
    id: 'post-seed-6',
    userId: 'user-sarah',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'SJ',
    authorRole: 'user',
    title: 'What information does this ride-hailing app actually collect in background?',
    content: 'Looking through the permissions breakdown:\n\n"The App may collect precise location data when running in background, Bluetooth beacon proximity, WiFi SSID network identifiers, and accelerometer telemetry to optimize dispatch and safety."\n\nWhy does a taxi app need WiFi SSIDs and Bluetooth beacons when GPS is already granted?',
    category: 'Security',
    anonymous: false,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    helpfulCount: 27,
    helpfulUserIds: ['user-mayuri', 'user-alex', 'user-chen'],
    commentCount: 3,
    status: 'open',
    pinned: false,
    aiAnswer: null,
    isDemo: true,
    tags: ['background-tracking', 'location', 'security']
  }
];

const SEED_COMMENTS: CommunityComment[] = [
  {
    id: 'comment-seed-1-1',
    postId: 'post-seed-1',
    userId: 'user-sarah',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'SJ',
    content: 'Check your state laws or country rules. In California (Automatic Renewal Law) and the EU, merchants MUST provide clear and conspicuous notice before renewal if the initial term was for a year or longer, or if price changes.',
    parentCommentId: null,
    createdAt: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString(),
    isBestAnswer: false,
    helpfulCount: 6,
    helpfulUserIds: ['user-mayuri', 'user-alex']
  },
  {
    id: 'comment-seed-1-2',
    postId: 'post-seed-1',
    userId: 'user-counsel',
    authorName: 'David Miller',
    authorAvatar: 'DM',
    content: 'Most importantly: If they increase the price between cycles, they cannot silently bill the higher amount without prior affirmative consent. Take a screenshot of the original pricing checkout page. If you get billed an unexpected higher rate, you have strong grounds for a dispute through your credit card provider.',
    parentCommentId: null,
    createdAt: new Date(Date.now() - 1.6 * 60 * 60 * 1000).toISOString(),
    isBestAnswer: true, // Best Answer!
    helpfulCount: 11,
    helpfulUserIds: ['user-mayuri', 'user-alex', 'user-chen', 'user-elena']
  },
  {
    id: 'comment-seed-1-3',
    postId: 'post-seed-1',
    userId: 'user-mayuri',
    authorName: 'Mayuri B.',
    authorAvatar: 'MB',
    content: 'Thank you David! That is super clarifying. Marked as best answer! I checked and they did indeed increase the price without an email.',
    parentCommentId: 'comment-seed-1-2',
    createdAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString(),
    isBestAnswer: false,
    helpfulCount: 3,
    helpfulUserIds: ['user-counsel']
  },
  {
    id: 'comment-seed-2-1',
    postId: 'post-seed-2',
    userId: 'user-elena',
    authorName: 'Elena Rostova',
    authorAvatar: 'ER',
    content: 'Under GDPR Article 17 ("Right to Erasure"), they can only keep what is strictly necessary for statutory legal obligations (like financial records for 5-7 years). If you are in the EU or UK, you can send a formal data rectification request asking them to certify erasure of marketing and telemetry tables.',
    parentCommentId: null,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isBestAnswer: false,
    helpfulCount: 8,
    helpfulUserIds: ['user-alex', 'user-mayuri']
  },
  {
    id: 'comment-seed-4-1',
    postId: 'post-seed-4',
    userId: 'user-david',
    authorName: 'David Miller',
    authorAvatar: 'DM',
    content: 'Courts in several US circuits (e.g., Sgouros v. TransUnion) held that unilateral changes require reasonable communicability. You cannot bind customers to retroactive changes simply by updating a hidden link in the footer.',
    parentCommentId: null,
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    isBestAnswer: false,
    helpfulCount: 12,
    helpfulUserIds: ['user-elena', 'user-alex']
  }
];

class CommunityService {
  private posts: CommunityPost[] = [];
  private comments: CommunityComment[] = [];
  private savedPostIds: Set<string> = new Set();
  private reports: CommunityReport[] = [];
  private notifications: CommunityNotification[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedPosts = localStorage.getItem(STORAGE_POSTS_KEY);
      if (storedPosts) {
        this.posts = JSON.parse(storedPosts);
      } else {
        this.posts = [...SEED_POSTS];
        this.savePosts();
      }

      const storedComments = localStorage.getItem(STORAGE_COMMENTS_KEY);
      if (storedComments) {
        this.comments = JSON.parse(storedComments);
      } else {
        this.comments = [...SEED_COMMENTS];
        this.saveComments();
      }

      const storedSaved = localStorage.getItem(STORAGE_SAVED_KEY);
      if (storedSaved) {
        this.savedPostIds = new Set(JSON.parse(storedSaved));
      }

      const storedReports = localStorage.getItem(STORAGE_REPORTS_KEY);
      if (storedReports) {
        this.reports = JSON.parse(storedReports);
      }

      const storedNotifications = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
      if (storedNotifications) {
        this.notifications = JSON.parse(storedNotifications);
      } else {
        this.notifications = [
          {
            id: 'notif-welcome',
            userId: 'current-user',
            type: 'pinned',
            title: 'Welcome to Clear Clause Community',
            message: 'Discuss legal clauses, analyze terms together, and ask questions.',
            postId: 'post-seed-1',
            read: false,
            createdAt: new Date().toISOString()
          }
        ];
        this.saveNotifications();
      }
    } catch (err) {
      console.error('Error initializing community service:', err);
      this.posts = [...SEED_POSTS];
      this.comments = [...SEED_COMMENTS];
    }
  }

  private savePosts() {
    try {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(this.posts));
    } catch (e) {
      console.error(e);
    }
  }

  private saveComments() {
    try {
      localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(this.comments));
    } catch (e) {
      console.error(e);
    }
  }

  private saveSaved() {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(Array.from(this.savedPostIds)));
    } catch (e) {
      console.error(e);
    }
  }

  private saveReports() {
    try {
      localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(this.reports));
    } catch (e) {
      console.error(e);
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(this.notifications));
    } catch (e) {
      console.error(e);
    }
  }

  // Content safety check (credit cards, passwords, SSN)
  public validateContentSafety(text: string): { safe: boolean; warning?: string } {
    if (!text) return { safe: true };

    // Credit card patterns (e.g., 16 digits)
    const creditCardRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b/;
    if (creditCardRegex.test(text)) {
      return {
        safe: false,
        warning: 'For your security, please do not post payment card numbers or financial account digits.'
      };
    }

    // Password keywords with values
    const passwordRegex = /(?:password|pwd|secret_key|api_key)\s*[:=]\s*\S+/i;
    if (passwordRegex.test(text)) {
      return {
        safe: false,
        warning: 'Please remove any passwords, private credentials, or access tokens from your post.'
      };
    }

    // US SSN pattern
    const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/;
    if (ssnRegex.test(text)) {
      return {
        safe: false,
        warning: 'Please do not post Social Security numbers or government ID numbers.'
      };
    }

    return { safe: true };
  }

  public getPosts(params?: {
    search?: string;
    category?: string;
    filter?: CommunityFilter;
    savedOnly?: boolean;
    userId?: string;
    showHidden?: boolean;
  }): CommunityPost[] {
    let list = [...this.posts];

    // Filter out hidden posts unless explicitly requested (e.g. for admin)
    if (!params?.showHidden) {
      list = list.filter((p) => p.status !== 'hidden');
    }

    // Filter by saved
    if (params?.savedOnly) {
      list = list.filter((p) => this.savedPostIds.has(p.id));
    }

    // Filter by specific user
    if (params?.userId) {
      list = list.filter((p) => p.userId === params.userId);
    }

    // Filter by category
    if (params?.category && params.category !== 'All' && params.category !== 'all') {
      list = list.filter((p) => p.category === params.category);
    }

    // Search query (title, content, tags, category, author)
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
          (!p.anonymous && p.authorName.toLowerCase().includes(q))
      );
    }

    // Sorting and view filters
    const filter = params?.filter || 'latest';
    switch (filter) {
      case 'trending':
        // Trending: combination of helpful count + comment count, recent boost
        list.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          const scoreA = a.helpfulCount * 2 + a.commentCount * 3;
          const scoreB = b.helpfulCount * 2 + b.commentCount * 3;
          return scoreB - scoreA;
        });
        break;
      case 'helpful':
        list.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return b.helpfulCount - a.helpfulCount;
        });
        break;
      case 'unanswered':
        list = list.filter((p) => p.commentCount === 0 && !p.bestAnswerCommentId);
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'solved':
        list = list.filter((p) => p.status === 'solved' || !!p.bestAnswerCommentId);
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'latest':
      case 'all':
      default:
        list.sort((a, b) => {
          // Pinned posts always on top
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
    }

    return list;
  }

  public getPostById(id: string): CommunityPost | null {
    return this.posts.find((p) => p.id === id) || null;
  }

  public createPost(data: {
    title: string;
    content: string;
    category: CommunityCategory;
    imageUrl?: string;
    anonymous?: boolean;
    userId: string;
    userName: string;
    sourceDocument?: string;
    tags?: string[];
  }): CommunityPost {
    const safetyCheck = this.validateContentSafety(`${data.title} ${data.content}`);
    if (!safetyCheck.safe) {
      throw new Error(safetyCheck.warning || 'Your post contains potentially sensitive information.');
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: data.userId,
      authorName: data.anonymous ? 'Anonymous Member' : data.userName,
      authorAvatar: data.anonymous ? undefined : (data.userName.slice(0, 2).toUpperCase() || 'U'),
      authorRole: 'user',
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category,
      imageUrl: data.imageUrl,
      anonymous: data.anonymous ?? false,
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      helpfulUserIds: [],
      commentCount: 0,
      status: 'open',
      pinned: false,
      isDemo: false,
      sourceDocument: data.sourceDocument,
      tags: data.tags
    };

    this.posts.unshift(newPost);
    this.savePosts();
    return newPost;
  }

  public updatePost(
    id: string,
    userId: string,
    updates: {
      title?: string;
      content?: string;
      category?: CommunityCategory;
      imageUrl?: string;
    }
  ): CommunityPost | null {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const post = this.posts[index];
    if (post.userId !== userId) {
      throw new Error('You do not have permission to edit this post.');
    }

    if (updates.title || updates.content) {
      const safetyCheck = this.validateContentSafety(`${updates.title || post.title} ${updates.content || post.content}`);
      if (!safetyCheck.safe) {
        throw new Error(safetyCheck.warning || 'Your post contains sensitive content.');
      }
    }

    const updated: CommunityPost = {
      ...post,
      ...updates,
      title: updates.title ? updates.title.trim() : post.title,
      content: updates.content ? updates.content.trim() : post.content,
      updatedAt: new Date().toISOString()
    };

    this.posts[index] = updated;
    this.savePosts();
    return updated;
  }

  public deletePost(id: string, userId: string, isAdmin = false): boolean {
    const post = this.posts.find((p) => p.id === id);
    if (!post) return false;

    if (post.userId !== userId && !isAdmin) {
      throw new Error('You do not have permission to delete this post.');
    }

    this.posts = this.posts.filter((p) => p.id !== id);
    this.comments = this.comments.filter((c) => c.postId !== id);
    this.savedPostIds.delete(id);

    this.savePosts();
    this.saveComments();
    this.saveSaved();
    return true;
  }

  public toggleHelpfulPost(postId: string, userId: string): { post: CommunityPost; isHelpful: boolean } {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    const alreadyVoted = post.helpfulUserIds.includes(userId);
    let isHelpful = false;

    if (alreadyVoted) {
      post.helpfulUserIds = post.helpfulUserIds.filter((id) => id !== userId);
      post.helpfulCount = Math.max(0, post.helpfulCount - 1);
      isHelpful = false;
    } else {
      post.helpfulUserIds.push(userId);
      post.helpfulCount += 1;
      isHelpful = true;

      // Notify post author
      if (post.userId !== userId) {
        this.addNotification({
          userId: post.userId,
          type: 'comment',
          title: 'Helpful reaction received',
          message: `Someone found your post "${post.title.slice(0, 35)}..." helpful!`,
          postId: post.id
        });
      }
    }

    this.savePosts();
    return { post: { ...post }, isHelpful };
  }

  public toggleSavePost(postId: string): boolean {
    let saved = false;
    if (this.savedPostIds.has(postId)) {
      this.savedPostIds.delete(postId);
      saved = false;
    } else {
      this.savedPostIds.add(postId);
      saved = true;
    }
    this.saveSaved();
    return saved;
  }

  public isPostSaved(postId: string): boolean {
    return this.savedPostIds.has(postId);
  }

  public getSavedPostIds(): string[] {
    return Array.from(this.savedPostIds);
  }

  // Comments
  public getComments(postId: string): CommunityComment[] {
    return this.comments
      .filter((c) => c.postId === postId)
      .sort((a, b) => {
        // Best answer first
        if (a.isBestAnswer && !b.isBestAnswer) return -1;
        if (!a.isBestAnswer && b.isBestAnswer) return 1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }

  public createComment(data: {
    postId: string;
    userId: string;
    userName: string;
    content: string;
    parentCommentId?: string | null;
    anonymous?: boolean;
  }): CommunityComment {
    const safetyCheck = this.validateContentSafety(data.content);
    if (!safetyCheck.safe) {
      throw new Error(safetyCheck.warning || 'Your comment contains sensitive information.');
    }

    const post = this.posts.find((p) => p.id === data.postId);
    if (!post) throw new Error('Post not found');

    if (post.status === 'locked') {
      throw new Error('This discussion has been locked by moderators.');
    }

    const newComment: CommunityComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      postId: data.postId,
      userId: data.userId,
      authorName: data.anonymous ? 'Anonymous Member' : data.userName,
      authorAvatar: data.anonymous ? undefined : (data.userName.slice(0, 2).toUpperCase() || 'U'),
      content: data.content.trim(),
      parentCommentId: data.parentCommentId || null,
      createdAt: new Date().toISOString(),
      isBestAnswer: false,
      helpfulCount: 0,
      helpfulUserIds: [],
      anonymous: data.anonymous ?? false
    };

    this.comments.push(newComment);
    post.commentCount = (post.commentCount || 0) + 1;

    this.saveComments();
    this.savePosts();

    // Create notification
    if (data.parentCommentId) {
      const parentComment = this.comments.find((c) => c.id === data.parentCommentId);
      if (parentComment && parentComment.userId !== data.userId) {
        this.addNotification({
          userId: parentComment.userId,
          type: 'reply',
          title: 'New reply to your comment',
          message: `${data.anonymous ? 'Someone' : data.userName} replied to your answer.`,
          postId: data.postId,
          commentId: newComment.id
        });
      }
    } else if (post.userId !== data.userId) {
      this.addNotification({
        userId: post.userId,
        type: 'comment',
        title: 'New comment on your post',
        message: `${data.anonymous ? 'Someone' : data.userName} commented on "${post.title.slice(0, 30)}..."`,
        postId: data.postId,
        commentId: newComment.id
      });
    }

    return newComment;
  }

  public deleteComment(commentId: string, userId: string, isAdmin = false): boolean {
    const comment = this.comments.find((c) => c.id === commentId);
    if (!comment) return false;

    if (comment.userId !== userId && !isAdmin) {
      throw new Error('You do not have permission to delete this comment.');
    }

    const post = this.posts.find((p) => p.id === comment.postId);
    if (post && post.bestAnswerCommentId === commentId) {
      post.bestAnswerCommentId = undefined;
      post.status = 'open';
    }
    if (post && post.commentCount > 0) {
      post.commentCount -= 1;
    }

    this.comments = this.comments.filter((c) => c.id !== commentId);
    this.saveComments();
    this.savePosts();
    return true;
  }

  public toggleHelpfulComment(commentId: string, userId: string): { comment: CommunityComment; isHelpful: boolean } {
    const comment = this.comments.find((c) => c.id === commentId);
    if (!comment) throw new Error('Comment not found');

    const alreadyVoted = comment.helpfulUserIds.includes(userId);
    let isHelpful = false;

    if (alreadyVoted) {
      comment.helpfulUserIds = comment.helpfulUserIds.filter((id) => id !== userId);
      comment.helpfulCount = Math.max(0, comment.helpfulCount - 1);
      isHelpful = false;
    } else {
      comment.helpfulUserIds.push(userId);
      comment.helpfulCount += 1;
      isHelpful = true;
    }

    this.saveComments();
    return { comment: { ...comment }, isHelpful };
  }

  // Best Answer Selection (#6)
  public markBestAnswer(postId: string, commentId: string, currentUserId: string, isAdmin = false): boolean {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    if (post.userId !== currentUserId && !isAdmin) {
      throw new Error('Only the author of the post can select the Best Answer.');
    }

    // Toggle off if already selected
    if (post.bestAnswerCommentId === commentId) {
      post.bestAnswerCommentId = undefined;
      post.status = 'open';
      const comment = this.comments.find((c) => c.id === commentId);
      if (comment) comment.isBestAnswer = false;
    } else {
      // Clear previous best answers for this post
      this.comments.forEach((c) => {
        if (c.postId === postId) c.isBestAnswer = false;
      });

      const comment = this.comments.find((c) => c.id === commentId);
      if (comment) {
        comment.isBestAnswer = true;
        post.bestAnswerCommentId = commentId;
        post.status = 'solved';

        // Notify comment author
        if (comment.userId !== currentUserId) {
          this.addNotification({
            userId: comment.userId,
            type: 'best_answer',
            title: 'Your answer was marked as Best Answer! ✅',
            message: `The author marked your answer on "${post.title.slice(0, 30)}..." as solved!`,
            postId: post.id,
            commentId: comment.id
          });
        }
      }
    }

    this.saveComments();
    this.savePosts();
    return true;
  }

  // AI Answer Generation (#7)
  public async generateAIAnswer(postId: string): Promise<CommunityAIAnswer> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    if (post.aiAnswer) {
      return post.aiAnswer;
    }

    try {
      const res = await fetch('/api/community/ai-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          category: post.category
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Server returned an error');
      }

      const data = await res.json();
      const aiAnswer: CommunityAIAnswer = {
        content: data.answer,
        generatedAt: data.generatedAt || new Date().toISOString(),
        disclaimer: data.disclaimer || 'AI-generated information is for educational purposes and should not be treated as legal advice.'
      };

      post.aiAnswer = aiAnswer;
      this.savePosts();
      return aiAnswer;
    } catch (err: any) {
      // Intelligent educational fallback so users get instant answers even if offline or key is pending
      const fallbackText = `Based on common contract and consumer rights principles regarding "${post.title}":\n\n• Legal Meaning: In plain terms, this category of terms addresses ${post.category.toLowerCase()} obligations. Standard consumer contracts require clear mutual consent, unambiguous definitions, and fair notice.\n• Practical Consideration: Check whether the company provides a direct opt-out mechanism or an opportunity to cancel without penalties. Take dated screenshots of current policy statements.\n• Next Step: If this involves unexpected financial transactions or unnotified terms modifications, consult official consumer protection bodies or certified counsel for formal advice.`;

      const aiAnswer: CommunityAIAnswer = {
        content: fallbackText,
        generatedAt: new Date().toISOString(),
        disclaimer: 'AI-generated information is for educational purposes and should not be treated as legal advice.'
      };

      post.aiAnswer = aiAnswer;
      this.savePosts();
      return aiAnswer;
    }
  }

  // Moderation & Reporting (#12)
  public createReport(report: Omit<CommunityReport, 'id' | 'createdAt' | 'status'>): CommunityReport {
    const newReport: CommunityReport = {
      ...report,
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.reports.unshift(newReport);
    this.saveReports();
    return newReport;
  }

  public getReports(): CommunityReport[] {
    return [...this.reports];
  }

  public updateReportStatus(id: string, status: 'reviewed' | 'dismissed'): void {
    const rep = this.reports.find((r) => r.id === id);
    if (rep) {
      rep.status = status;
      this.saveReports();

      // Notify reporter
      if (rep.reporterId) {
        this.addNotification({
          userId: rep.reporterId,
          type: 'report_reviewed',
          title: 'Report status updated',
          message: `Your report regarding "${(rep.itemTitle || 'content').slice(0, 30)}" was ${status}.`,
          postId: rep.postId || ''
        });
      }
    }
  }

  public togglePinPost(postId: string): boolean {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return false;
    post.pinned = !post.pinned;
    this.savePosts();
    return post.pinned;
  }

  public toggleLockPost(postId: string): boolean {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return false;
    post.status = post.status === 'locked' ? 'open' : 'locked';
    this.savePosts();
    return post.status === 'locked';
  }

  public setPostHidden(postId: string, hidden: boolean): boolean {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return false;
    post.status = hidden ? 'hidden' : 'open';
    this.savePosts();
    return hidden;
  }

  // Notifications (#15)
  private addNotification(notif: Omit<CommunityNotification, 'id' | 'createdAt' | 'read'>) {
    const item: CommunityNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    this.notifications.unshift(item);
    this.saveNotifications();
  }

  public getNotifications(userId?: string): CommunityNotification[] {
    if (!userId || userId === 'guest') {
      return this.notifications.slice(0, 10);
    }
    return this.notifications.filter((n) => n.userId === userId || n.userId === 'current-user');
  }

  public getUnreadNotificationCount(userId?: string): number {
    return this.getNotifications(userId).filter((n) => !n.read).length;
  }

  public markNotificationAsRead(id: string): void {
    const n = this.notifications.find((item) => item.id === id);
    if (n) {
      n.read = true;
      this.saveNotifications();
    }
  }

  public markAllNotificationsAsRead(userId?: string): void {
    this.notifications.forEach((n) => {
      if (!userId || n.userId === userId || n.userId === 'current-user') {
        n.read = true;
      }
    });
    this.saveNotifications();
  }

  // Profile stats (#10)
  public getUserProfileStats(userId: string) {
    const userPosts = this.posts.filter((p) => p.userId === userId);
    const totalHelpfulReceived = userPosts.reduce((acc, p) => acc + (p.helpfulCount || 0), 0);
    const savedPosts = this.posts.filter((p) => this.savedPostIds.has(p.id));

    return {
      postCount: userPosts.length,
      helpfulReceived: totalHelpfulReceived,
      savedCount: savedPosts.length,
      userPosts,
      savedPosts
    };
  }
}

export const communityService = new CommunityService();
