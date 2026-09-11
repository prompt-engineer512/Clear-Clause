export type RiskLevel = 'safe' | 'caution' | 'concerning';

export interface ScoreSet {
  overall: number;
  privacy: number;
  security: number;
  transparency: number;
}

export interface ScoreExplanations {
  overall?: string;
  privacy?: string;
  security?: string;
  transparency?: string;
  [key: string]: string | undefined;
}

export interface ClauseItem {
  id: string;
  title: string;
  riskLevel: RiskLevel;
  explanation: string;
  whyItMatters: string;
  originalSnippet?: string;
  category: 'data' | 'financial' | 'legal' | 'tracking' | 'rights' | string;
}

export interface DataPrivacySection {
  collectedData: string[];
  usagePractices: string[];
  sharedWithThirdParties: boolean;
  thirdPartiesList: string[];
  soldToBrokers: boolean;
  keyConcerns: string[];
  summary?: string;
}

export interface RefundMoneySection {
  refundPolicy: string;
  cancellationConditions: string;
  charges: string;
  hiddenCosts: string[];
  paymentClauses: string[];
  isConcerning: boolean;
}

export interface AutoRenewalSection {
  hasAutoRenewal: boolean;
  renewalFrequency: string;
  cancellationNoticeWindow: string;
  howToCancel: string;
  deadlines: string;
  warningNotes: string;
}

export interface UserRightsSection {
  dataAccess: boolean;
  dataDeletion: boolean;
  accountDeletion: boolean;
  optOutRights: string[];
  cancellationRights: string;
  jurisdictionRights: string[];
}

export interface CookieInfo {
  name: string;
  purpose: string;
  isTracking: boolean;
}

export interface CookiePolicySection {
  cookieTypes: CookieInfo[];
  purposes: string[];
  trackingInformation: string;
  importantConcerns: string[];
}

export interface RelatedCase {
  id: string;
  title: string;
  description: string;
  date: string;
  relevance: string;
  outcome?: string;
}

export interface PolicyVersionChange {
  id: string;
  date: string;
  version: string;
  summary: string;
  addedClauses: string[];
  removedClauses: string[];
  privacyImpact: 'positive' | 'negative' | 'neutral';
}

export interface TrustTimelinePoint {
  year: string;
  score: number;
  status: 'improving' | 'declining' | 'stable';
  eventHighlight: string;
}

export interface AlternativeService {
  id: string;
  name: string;
  category: string;
  score: number;
  reason: string;
  advantages: string[];
  url?: string;
}

export interface AnalysisResult {
  id: string;
  companyName: string;
  company?: string;
  documentTitle: string;
  effectiveDate?: string;
  lastUpdated?: string;
  sourceUrl?: string;
  analyzedDate: string;
  overallAssessment: string;
  overallRiskLevel: RiskLevel;
  scores: ScoreSet;
  scoreExplanations?: ScoreExplanations;
  summary?: string | { headline: string; takeaways: string[]; narrative: string };
  oneMinuteSummary: {
    headline: string;
    takeaways: string[];
    narrative: string;
  };
  dataPrivacy: DataPrivacySection;
  refundPolicy?: string | RefundMoneySection;
  refundsMoney: RefundMoneySection;
  autoRenewal: AutoRenewalSection;
  userRights: UserRightsSection;
  hiddenClauses?: ClauseItem[];
  importantClauses: ClauseItem[];
  cookiePolicy: CookiePolicySection;
  termination?: string | { conditions?: string; rights?: string; noticePeriod?: string; notes?: string };
  liability?: string | { limits?: string; disclaimers?: string; damagesCapped?: string; notes?: string };
  disputes?: string | { arbitration?: boolean; jurisdiction?: string; classActionWaiver?: boolean; terms?: string; notes?: string };
  changesToTerms?: string | PolicyVersionChange[] | string[];
  warnings?: string[];
  relatedCases?: RelatedCase[];
  policyChanges?: PolicyVersionChange[];
  trustTimeline?: {
    trend: 'Improving' | 'Declining' | 'Stable';
    history: TrustTimelinePoint[];
  };
  alternatives?: AlternativeService[];
  rawJson?: any;
}

export interface HistoryItem {
  id: string;
  companyName: string;
  documentTitle: string;
  analyzedDate: string;
  sourceUrl?: string;
  overallScore: number;
  riskLevel: RiskLevel;
  summarySnippet: string;
  analysisData?: AnalysisResult;
  fullAnalysis?: AnalysisResult;
}

export interface UserSettings {
  theme: 'deep-charcoal' | 'dark-slate' | 'dark-navy';
  preferredLanguage: string;
  n8nWebhookUrl: string;
  saveHistoryLocally: boolean;
  audioVoiceSpeed: number;
  autoListenOnOpen: boolean;
}

export type ActivePage = 'home' | 'login' | 'about' | 'contact' | 'history' | 'settings' | 'community';

export type CommunityCategory =
  | 'Ask Clear Clause'
  | 'Privacy'
  | 'Refund & Money'
  | 'Hidden Clauses'
  | 'Security'
  | 'App/Website Reviews'
  | 'Risk Alerts'
  | 'Learn'
  | 'Suggestions'
  | 'General Discussion';

export type CommunityFilter = 'all' | 'latest' | 'trending' | 'helpful' | 'unanswered' | 'solved';

export interface CommunityUser {
  id: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  joinedDate: string;
}

export interface CommunityAIAnswer {
  content: string;
  generatedAt: string;
  disclaimer: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: 'user' | 'admin' | 'moderator';
  title: string;
  content: string;
  category: CommunityCategory;
  imageUrl?: string;
  anonymous?: boolean;
  createdAt: string;
  updatedAt?: string;
  helpfulCount: number;
  helpfulUserIds: string[];
  commentCount: number;
  status: 'open' | 'solved' | 'locked' | 'hidden';
  pinned?: boolean;
  bestAnswerCommentId?: string;
  aiAnswer?: CommunityAIAnswer | null;
  isDemo?: boolean;
  tags?: string[];
  sourceDocument?: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  parentCommentId?: string | null;
  createdAt: string;
  isBestAnswer?: boolean;
  helpfulCount: number;
  helpfulUserIds: string[];
  anonymous?: boolean;
}

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'misleading'
  | 'offensive'
  | 'personal_info'
  | 'other';

export interface CommunityReport {
  id: string;
  reporterId: string;
  reporterName?: string;
  postId?: string;
  commentId?: string;
  itemTitle?: string;
  itemSnippet?: string;
  reason: ReportReason;
  details?: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
}

export interface CommunityNotification {
  id: string;
  userId: string;
  type: 'comment' | 'reply' | 'best_answer' | 'pinned' | 'report_reviewed';
  title: string;
  message: string;
  postId: string;
  commentId?: string;
  read: boolean;
  createdAt: string;
}

export interface PreFillPostData {
  title?: string;
  category?: CommunityCategory;
  content?: string;
  sourceDocument?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  isError?: boolean;
}

export type WorkspaceSection =
  | 'overview'
  | 'summary'
  | 'privacy'
  | 'refunds'
  | 'renewal'
  | 'rights'
  | 'clauses'
  | 'highlights'
  | 'cookies'
  | 'cases'
  | 'changes'
  | 'trust'
  | 'alternatives';
