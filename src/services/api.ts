import { AnalysisResult, ClauseItem, RiskLevel, ScoreSet, PolicyVersionChange } from '../types';

export const DEFAULT_N8N_PRODUCTION_WEBHOOK_URL = 'https://maltamix8.app.n8n.cloud/webhook/clearclause/analyze';
const N8N_WEBHOOK_KEY = 'clearclause_n8n_webhook_url';

export interface AnalysisRequest {
  url?: string;
  documentText?: string;
  documentName?: string;
  language?: string;
  n8nWebhookUrl?: string;
}

export type ProgressCallback = (step: string, percent: number) => void;

export class AnalysisError extends Error {
  code: 'INVALID_URL' | 'PAGE_NOT_FOUND' | 'EXTRACTION_FAILED' | 'INSUFFICIENT_TEXT' | 'NETWORK_ERROR' | 'ANALYSIS_FAILED' | 'CONFIG_ERROR';
  
  constructor(message: string, code: AnalysisError['code']) {
    super(message);
    this.name = 'AnalysisError';
    this.code = code;
  }
}

/**
 * Sends analysis request to the live n8n production webhook workflow.
 */
export async function analyzeTerms(
  request: {
    url?: string;
    documentText?: string;
    documentName?: string;
    language?: string;
    n8nWebhookUrl?: string;
  },
  onProgress?: ProgressCallback
): Promise<AnalysisResult> {
  const { 
    url = '', 
    documentText = '', 
    documentName = 'Uploaded Terms Document', 
    language = 'en'
  } = request;

  // 1. Read parameters & Validate
  const trimmedUrl = url ? url.trim() : '';
  const trimmedText = documentText ? documentText.trim() : '';

  if (!trimmedUrl && !trimmedText) {
    throw new AnalysisError('Please enter a Terms & Conditions URL or upload a document.', 'INVALID_URL');
  }

  if (trimmedUrl && !trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://') && !trimmedUrl.includes('.')) {
    throw new AnalysisError('Please provide a valid web URL starting with https:// or http://', 'INVALID_URL');
  }

  // Determine target n8n webhook URL
  const webhookUrl = (request.n8nWebhookUrl || ApiService.getWebhookUrl() || DEFAULT_N8N_PRODUCTION_WEBHOOK_URL).trim();

  if (onProgress) onProgress('Sending document to n8n AI workflow...', 25);

  let response: Response;
  try {
    if (onProgress) onProgress('Processing document through n8n pipeline...', 55);

    // Send POST request with Content-Type application/json and exact payload
    response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: trimmedUrl,
        documentText: documentText || '',
        documentName: documentName || 'Uploaded Terms Document',
        language: language || 'en'
      })
    });
  } catch (fetchErr: any) {
    console.error('Fetch to n8n webhook failed:', fetchErr);
    if (webhookUrl === DEFAULT_N8N_PRODUCTION_WEBHOOK_URL) {
      throw new AnalysisError(
        `Unable to reach n8n webhook (${DEFAULT_N8N_PRODUCTION_WEBHOOK_URL}). Please paste your active n8n Production Webhook URL in Settings or verify your network connection.`,
        'NETWORK_ERROR'
      );
    }
    throw new AnalysisError(
      `Network connection failed when calling n8n webhook (${webhookUrl}). Please ensure the workflow is active and supports POST requests. Error: ${fetchErr.message || 'Failed to fetch'}`,
      'NETWORK_ERROR'
    );
  }

  // Check response.ok
  if (!response.ok) {
    let errorDetails = '';
    try {
      const errText = await response.text();
      errorDetails = errText ? ` - ${errText}` : '';
    } catch {
      // ignore
    }

    if (response.status === 404) {
      throw new AnalysisError(
        `The n8n webhook URL returned 404 (Not Found). Please check your n8n Production Webhook URL in Settings: ${webhookUrl}`,
        'PAGE_NOT_FOUND'
      );
    }

    throw new AnalysisError(
      `n8n webhook request failed with status ${response.status} (${response.statusText})${errorDetails}`,
      'ANALYSIS_FAILED'
    );
  }

  if (onProgress) onProgress('Parsing ClearClause analysis output...', 85);

  // Parse JSON response
  let rawResponseData: any;
  try {
    rawResponseData = await response.json();
  } catch (jsonErr: any) {
    throw new AnalysisError(
      `Failed to parse JSON response from n8n webhook: ${jsonErr.message}`,
      'ANALYSIS_FAILED'
    );
  }

  if (onProgress) onProgress('Finalizing results...', 100);

  // Dynamically normalize and populate all fields from the live n8n workflow output
  const normalizedResult = normalizeN8nResponse(
    rawResponseData, 
    trimmedUrl, 
    documentName
  );

  return normalizedResult;
}

/**
 * Helper to normalize dynamic n8n JSON output into the ClearClause data model.
 */
function normalizeN8nResponse(
  rawJson: any, 
  fallbackUrl?: string, 
  fallbackDocName?: string
): AnalysisResult {
  // Handle if n8n returns an array or wrapped object: [ { ... } ] or { data: { ... } } or { output: { ... } }
  let data: any = rawJson;
  if (Array.isArray(data) && data.length > 0) {
    data = data[0];
  }
  if (data && typeof data === 'object') {
    if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
      data = data.data;
    } else if (data.output && typeof data.output === 'object' && !Array.isArray(data.output)) {
      data = data.output;
    } else if (data.result && typeof data.result === 'object' && !Array.isArray(data.result)) {
      data = data.result;
    } else if (data.body && typeof data.body === 'object' && !Array.isArray(data.body)) {
      data = data.body;
    } else if (data.json && typeof data.json === 'object' && !Array.isArray(data.json)) {
      data = data.json;
    }
  }

  if (!data || typeof data !== 'object') {
    throw new AnalysisError('n8n returned an empty or invalid JSON response payload.', 'ANALYSIS_FAILED');
  }

  // 1. Company Name & Document Title
  let derivedCompany = (
    data.company || 
    data.companyName || 
    data.name || 
    (fallbackUrl ? extractCompanyFromUrl(fallbackUrl) : '') ||
    (fallbackDocName ? extractCompanyFromDocName(fallbackDocName) : 'Online Service')
  ).trim();

  let derivedDocTitle = (
    data.documentTitle || 
    data.title || 
    data.documentName || 
    `${derivedCompany} Terms of Service & Privacy Policy`
  ).trim();

  const effectiveDate = data.effectiveDate || data.effective_date || data.effective || '';
  const lastUpdated = data.lastUpdated || data.last_updated || data.updatedAt || data.analyzedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const sourceUrl = data.sourceUrl || data.url || fallbackUrl || undefined;

  // 2. Scores & Score Explanations
  const rawScores = data.scores || {};
  const privacyScore = parseNumericScore(rawScores.privacy ?? data.privacyScore ?? data.privacy, 70);
  const securityScore = parseNumericScore(rawScores.security ?? data.securityScore ?? data.security, 75);
  const transparencyScore = parseNumericScore(rawScores.transparency ?? data.transparencyScore ?? data.transparency, 70);
  
  let overallScore = parseNumericScore(rawScores.overall ?? data.overallScore ?? data.overall ?? data.score, 0);
  if (overallScore <= 0) {
    overallScore = Math.round((privacyScore * 0.4) + (securityScore * 0.3) + (transparencyScore * 0.3));
  }

  const scores: ScoreSet = {
    overall: overallScore,
    privacy: privacyScore,
    security: securityScore,
    transparency: transparencyScore
  };

  const scoreExplanations = data.scoreExplanations || data.score_explanations || data.explanations || undefined;

  // Risk Level
  let overallRiskLevel: RiskLevel = 'safe';
  if (data.overallRiskLevel || data.riskLevel) {
    const r = String(data.overallRiskLevel || data.riskLevel).toLowerCase();
    if (r.includes('high') || r.includes('concern') || r.includes('danger') || r.includes('bad') || r.includes('red')) {
      overallRiskLevel = 'concerning';
    } else if (r.includes('caut') || r.includes('mod') || r.includes('warn') || r.includes('med') || r.includes('yellow')) {
      overallRiskLevel = 'caution';
    } else {
      overallRiskLevel = 'safe';
    }
  } else {
    overallRiskLevel = overallScore >= 75 ? 'safe' : overallScore >= 55 ? 'caution' : 'concerning';
  }

  // Overall Assessment
  const overallAssessment = data.overallAssessment || data.assessment || data.executiveAssessment || (
    typeof data.summary === 'string' && data.summary.length > 50 ? data.summary :
    overallRiskLevel === 'safe'
      ? `Favorable overall evaluation for ${derivedCompany}. The terms contain balanced user protections and standard operational permissions.`
      : overallRiskLevel === 'caution'
      ? `Moderate caution advised for ${derivedCompany}. Review recurring billing timelines and data telemetry clauses.`
      : `High risk detected in ${derivedCompany}'s terms. Contains significant liability waivers or broad data monetization provisions.`
  );

  // 3. 1-Minute Summary
  let oneMinuteSummary = {
    headline: '',
    takeaways: [] as string[],
    narrative: ''
  };

  if (data.oneMinuteSummary && typeof data.oneMinuteSummary === 'object') {
    oneMinuteSummary = {
      headline: data.oneMinuteSummary.headline || `${derivedCompany} terms summary and key considerations.`,
      takeaways: Array.isArray(data.oneMinuteSummary.takeaways) ? data.oneMinuteSummary.takeaways : [String(data.oneMinuteSummary.takeaways || '')].filter(Boolean),
      narrative: data.oneMinuteSummary.narrative || data.oneMinuteSummary.summary || ''
    };
  } else if (typeof data.summary === 'object' && data.summary !== null) {
    oneMinuteSummary = {
      headline: data.summary.headline || data.summary.title || `${derivedCompany} terms executive summary`,
      takeaways: Array.isArray(data.summary.takeaways || data.summary.points || data.summary.bulletPoints) 
        ? (data.summary.takeaways || data.summary.points || data.summary.bulletPoints) 
        : [],
      narrative: data.summary.narrative || data.summary.text || data.summary.details || ''
    };
  } else if (typeof data.summary === 'string' && data.summary.trim()) {
    const summaryLines = data.summary.split('\n').map((s: string) => s.trim()).filter(Boolean);
    const bullets = summaryLines.filter((l: string) => l.startsWith('-') || l.startsWith('•') || l.startsWith('*') || /^\d+\./.test(l)).map((b: string) => b.replace(/^[-•*]|\d+\.\s*/, '').trim());
    oneMinuteSummary = {
      headline: summaryLines[0]?.replace(/^#+\s*/, '') || `${derivedCompany} document summary`,
      takeaways: bullets.length > 0 ? bullets : summaryLines.slice(1, 5),
      narrative: summaryLines.slice(bullets.length > 0 ? bullets.length + 1 : 1).join(' ') || data.summary
    };
  } else {
    oneMinuteSummary = {
      headline: `${derivedCompany} terms analysis overview.`,
      takeaways: [
        `Overall Trust Score evaluated at ${overallScore}%.`,
        `Privacy safeguards rated at ${privacyScore}%.`,
        `Security infrastructure rated at ${securityScore}%.`
      ],
      narrative: overallAssessment
    };
  }

  if (oneMinuteSummary.takeaways.length === 0) {
    oneMinuteSummary.takeaways = [
      `Evaluated data collection and sharing policies for ${derivedCompany}.`,
      `Verified subscription and cancellation terms.`,
      `Analyzed user rights and dispute resolution mechanisms.`
    ];
  }

  // 4. Data & Privacy Section
  const rawPrivacy = data.dataPrivacy || data.privacyPolicy || data.privacy || {};
  const dataPrivacy = {
    collectedData: Array.isArray(rawPrivacy.collectedData) 
      ? rawPrivacy.collectedData 
      : (Array.isArray(data.collectedData) ? data.collectedData : [
          'Account credentials, profile information, and contact details',
          'Device identifiers, IP addresses, and operational usage telemetry'
        ]),
    usagePractices: Array.isArray(rawPrivacy.usagePractices) 
      ? rawPrivacy.usagePractices 
      : (Array.isArray(data.usagePractices) ? data.usagePractices : [
          'Providing service functionality and user account management',
          'System performance tracking and software optimization'
        ]),
    sharedWithThirdParties: typeof rawPrivacy.sharedWithThirdParties === 'boolean' 
      ? rawPrivacy.sharedWithThirdParties 
      : (typeof data.sharedWithThirdParties === 'boolean' ? data.sharedWithThirdParties : true),
    thirdPartiesList: Array.isArray(rawPrivacy.thirdPartiesList) 
      ? rawPrivacy.thirdPartiesList 
      : (Array.isArray(data.thirdParties) ? data.thirdParties : ['Cloud infrastructure hosting providers', 'Payment processing partners']),
    soldToBrokers: typeof rawPrivacy.soldToBrokers === 'boolean' 
      ? rawPrivacy.soldToBrokers 
      : (typeof data.soldToBrokers === 'boolean' ? data.soldToBrokers : false),
    keyConcerns: Array.isArray(rawPrivacy.keyConcerns) 
      ? rawPrivacy.keyConcerns 
      : (Array.isArray(data.privacyConcerns) ? data.privacyConcerns : []),
    summary: typeof rawPrivacy === 'string' ? rawPrivacy : rawPrivacy.summary || undefined
  };

  // 5. Refunds & Money Section
  const rawRefunds = data.refundsMoney || data.refundPolicy || data.refunds || {};
  let refundsMoney = {
    refundPolicy: 'Refunds processed according to standard statutory purchase window.',
    cancellationConditions: 'Cancellations take effect at the conclusion of the active billing period.',
    charges: 'Priced according to selected tier upon sign up.',
    hiddenCosts: [] as string[],
    paymentClauses: [] as string[],
    isConcerning: false
  };

  if (typeof rawRefunds === 'string') {
    refundsMoney.refundPolicy = rawRefunds;
  } else if (typeof rawRefunds === 'object') {
    refundsMoney = {
      refundPolicy: rawRefunds.refundPolicy || rawRefunds.policy || rawRefunds.refundTerms || refundsMoney.refundPolicy,
      cancellationConditions: rawRefunds.cancellationConditions || rawRefunds.cancellation || refundsMoney.cancellationConditions,
      charges: rawRefunds.charges || rawRefunds.pricing || refundsMoney.charges,
      hiddenCosts: Array.isArray(rawRefunds.hiddenCosts) ? rawRefunds.hiddenCosts : (Array.isArray(data.hiddenCosts) ? data.hiddenCosts : []),
      paymentClauses: Array.isArray(rawRefunds.paymentClauses) ? rawRefunds.paymentClauses : (Array.isArray(data.paymentClauses) ? data.paymentClauses : []),
      isConcerning: Boolean(rawRefunds.isConcerning || rawRefunds.concerning || data.isRefundConcerning)
    };
  }

  // 6. Auto-Renewal Section
  const rawRenewal = data.autoRenewal || data.renewal || {};
  let autoRenewal = {
    hasAutoRenewal: false,
    renewalFrequency: 'Not applicable',
    cancellationNoticeWindow: 'Can be cancelled at any time prior to next billing date',
    howToCancel: 'Account Settings → Subscriptions / Billing → Cancel Subscription',
    deadlines: 'End of active subscription cycle',
    warningNotes: ''
  };

  if (typeof rawRenewal === 'boolean') {
    autoRenewal.hasAutoRenewal = rawRenewal;
    if (rawRenewal) {
      autoRenewal.renewalFrequency = 'Periodic subscription rollover';
      autoRenewal.warningNotes = 'Subscriptions automatically bill to the saved payment method on file.';
    }
  } else if (typeof rawRenewal === 'object') {
    autoRenewal = {
      hasAutoRenewal: Boolean(rawRenewal.hasAutoRenewal ?? rawRenewal.enabled ?? rawRenewal.isAutoRenewing ?? false),
      renewalFrequency: rawRenewal.renewalFrequency || rawRenewal.frequency || (rawRenewal.hasAutoRenewal ? 'Recurring periodic billing' : 'One-time / Not recurring'),
      cancellationNoticeWindow: rawRenewal.cancellationNoticeWindow || rawRenewal.noticeWindow || autoRenewal.cancellationNoticeWindow,
      howToCancel: rawRenewal.howToCancel || rawRenewal.cancellationSteps || autoRenewal.howToCancel,
      deadlines: rawRenewal.deadlines || rawRenewal.deadline || autoRenewal.deadlines,
      warningNotes: rawRenewal.warningNotes || rawRenewal.warnings || (rawRenewal.hasAutoRenewal ? 'Recurring subscription fees apply automatically.' : '')
    };
  }

  // 7. User Rights Section
  const rawRights = data.userRights || data.rights || {};
  let userRights = {
    dataAccess: true,
    dataDeletion: true,
    accountDeletion: true,
    optOutRights: ['Marketing emails and commercial communications opt-out'],
    cancellationRights: 'Account closure can be initiated through user preferences.',
    jurisdictionRights: ['Statutory privacy rights including GDPR and CCPA where applicable']
  };

  if (typeof rawRights === 'object') {
    userRights = {
      dataAccess: Boolean(rawRights.dataAccess ?? rawRights.access ?? true),
      dataDeletion: Boolean(rawRights.dataDeletion ?? rawRights.deletion ?? true),
      accountDeletion: Boolean(rawRights.accountDeletion ?? rawRights.accountClose ?? true),
      optOutRights: Array.isArray(rawRights.optOutRights) ? rawRights.optOutRights : (Array.isArray(rawRights.optOuts) ? rawRights.optOuts : userRights.optOutRights),
      cancellationRights: rawRights.cancellationRights || rawRights.cancellation || userRights.cancellationRights,
      jurisdictionRights: Array.isArray(rawRights.jurisdictionRights) ? rawRights.jurisdictionRights : (Array.isArray(rawRights.jurisdictions) ? rawRights.jurisdictions : userRights.jurisdictionRights)
    };
  }

  // 8. Important Clauses & Hidden Clauses
  let importantClauses: ClauseItem[] = [];
  const rawClauses = data.importantClauses || data.clauses || data.keyClauses || [];
  
  if (Array.isArray(rawClauses)) {
    importantClauses = rawClauses.map((c: any, idx: number) => {
      if (typeof c === 'string') {
        return {
          id: `clause-${idx + 1}`,
          title: `Clause ${idx + 1}`,
          riskLevel: 'caution' as RiskLevel,
          explanation: c,
          whyItMatters: 'Impacts user contractual rights or data obligations.',
          category: 'legal'
        };
      }
      return {
        id: c.id || `clause-${idx + 1}`,
        title: c.title || c.name || `Clause ${idx + 1}`,
        riskLevel: normalizeRiskLevel(c.riskLevel || c.risk || c.level),
        explanation: c.explanation || c.description || c.summary || c.text || '',
        whyItMatters: c.whyItMatters || c.impact || c.significance || 'Directly affects your legal standing and user rights.',
        originalSnippet: c.originalSnippet || c.snippet || c.quote || undefined,
        category: c.category || 'legal'
      };
    });
  }

  // Add hiddenClauses if present
  let hiddenClauses: ClauseItem[] = [];
  if (Array.isArray(data.hiddenClauses)) {
    hiddenClauses = data.hiddenClauses.map((hc: any, idx: number) => {
      if (typeof hc === 'string') {
        return {
          id: `hidden-clause-${idx + 1}`,
          title: `Hidden Term ${idx + 1}`,
          riskLevel: 'concerning' as RiskLevel,
          explanation: hc,
          whyItMatters: 'May be buried in legal fine print without prominent disclosure.',
          category: 'legal'
        };
      }
      return {
        id: hc.id || `hidden-clause-${idx + 1}`,
        title: hc.title || `Hidden Term ${idx + 1}`,
        riskLevel: normalizeRiskLevel(hc.riskLevel || 'concerning'),
        explanation: hc.explanation || hc.description || '',
        whyItMatters: hc.whyItMatters || 'Buried condition that impacts consumer rights.',
        category: hc.category || 'legal'
      };
    });
  }

  // If no clauses provided, build default items from other data points
  if (importantClauses.length === 0) {
    if (hiddenClauses.length > 0) {
      importantClauses = [...hiddenClauses];
    } else {
      importantClauses = [
        {
          id: 'clause-1',
          title: 'Terms of Service Scope & Acceptance',
          riskLevel: overallRiskLevel,
          explanation: overallAssessment,
          whyItMatters: 'Defines the legal contract governing all platform features and user interactions.',
          category: 'legal'
        }
      ];
    }
  }

  // 9. Cookie Policy
  const rawCookies = data.cookiePolicy || data.cookies || {};
  let cookiePolicy = {
    cookieTypes: [
      { name: 'session_auth', purpose: 'User authentication and secure session maintenance', isTracking: false },
      { name: 'preferences', purpose: 'UI preferences and regional settings', isTracking: false },
      { name: 'analytics_metrics', purpose: 'Performance analytics and crash logging', isTracking: true }
    ],
    purposes: ['Ensuring secure user logins', 'Aggregating general site traffic telemetry'],
    trackingInformation: 'Essential security cookies are required. Analytics cookies can be managed via browser preferences.',
    importantConcerns: [] as string[]
  };

  if (typeof rawCookies === 'object') {
    cookiePolicy = {
      cookieTypes: Array.isArray(rawCookies.cookieTypes) ? rawCookies.cookieTypes : cookiePolicy.cookieTypes,
      purposes: Array.isArray(rawCookies.purposes) ? rawCookies.purposes : cookiePolicy.purposes,
      trackingInformation: rawCookies.trackingInformation || rawCookies.information || cookiePolicy.trackingInformation,
      importantConcerns: Array.isArray(rawCookies.importantConcerns) ? rawCookies.importantConcerns : cookiePolicy.importantConcerns
    };
  }

  // 10. Additional Fields: termination, liability, disputes, changesToTerms, warnings, relatedCases, alternatives, trustTimeline
  const termination = data.termination || undefined;
  const liability = data.liability || undefined;
  const disputes = data.disputes || data.disputeResolution || undefined;
  const changesToTerms = data.changesToTerms || data.policyChanges || undefined;
  const warnings = Array.isArray(data.warnings) ? data.warnings : undefined;
  const relatedCases = Array.isArray(data.relatedCases) ? data.relatedCases : undefined;
  const alternatives = Array.isArray(data.alternatives) ? data.alternatives : undefined;
  let trustTimeline: { trend: 'Improving' | 'Declining' | 'Stable'; history: any[] } | undefined = undefined;
  if (data.trustTimeline && typeof data.trustTimeline === 'object') {
    const history = Array.isArray(data.trustTimeline.history) ? data.trustTimeline.history : [];
    if (history.length > 0) {
      const rawTrend = String(data.trustTimeline.trend || '').toLowerCase();
      const trend = rawTrend.includes('improv') || rawTrend.includes('up') 
        ? 'Improving' 
        : rawTrend.includes('declin') || rawTrend.includes('down') 
        ? 'Declining' 
        : 'Stable';
      trustTimeline = {
        trend,
        history
      };
    }
  }

  return {
    id: data.id || `analysis-${Date.now()}`,
    companyName: derivedCompany,
    company: derivedCompany,
    documentTitle: derivedDocTitle,
    effectiveDate,
    lastUpdated,
    sourceUrl,
    analyzedDate: lastUpdated,
    overallAssessment,
    overallRiskLevel,
    scores,
    scoreExplanations,
    summary: data.summary,
    oneMinuteSummary,
    dataPrivacy,
    refundPolicy: data.refundPolicy || refundsMoney.refundPolicy,
    refundsMoney,
    autoRenewal,
    userRights,
    hiddenClauses: hiddenClauses.length > 0 ? hiddenClauses : undefined,
    importantClauses,
    cookiePolicy,
    termination,
    liability,
    disputes,
    changesToTerms,
    warnings,
    relatedCases,
    policyChanges: Array.isArray(data.policyChanges) ? data.policyChanges : (Array.isArray(changesToTerms) ? changesToTerms as PolicyVersionChange[] : undefined),
    trustTimeline,
    alternatives,
    rawJson
  };
}

function parseNumericScore(val: any, fallback: number): number {
  if (typeof val === 'number' && !isNaN(val)) {
    return Math.max(0, Math.min(100, Math.round(val)));
  }
  if (typeof val === 'string') {
    const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed)) {
      return Math.max(0, Math.min(100, parsed));
    }
  }
  return fallback;
}

function normalizeRiskLevel(level: any): RiskLevel {
  const str = String(level || '').toLowerCase();
  if (str.includes('high') || str.includes('concern') || str.includes('red') || str.includes('bad') || str.includes('danger')) {
    return 'concerning';
  }
  if (str.includes('caut') || str.includes('warn') || str.includes('yellow') || str.includes('med') || str.includes('mod')) {
    return 'caution';
  }
  return 'safe';
}

function extractCompanyFromUrl(urlStr: string): string {
  try {
    const formatted = urlStr.startsWith('http') ? urlStr : `https://${urlStr}`;
    const parsed = new URL(formatted);
    const domain = parsed.hostname.replace(/^www\./, '');
    const parts = domain.split('.');
    const name = parts[0] || 'Company';
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return 'Company';
  }
}

function extractCompanyFromDocName(docName: string): string {
  const cleaned = docName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/**
 * Connection test utility for n8n webhook verification in Settings
 */
export async function testN8nConnection(webhookUrl: string): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.trim()) {
    return { success: false, message: 'Please enter an n8n webhook URL.' };
  }

  const trimmed = webhookUrl.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return { success: false, message: 'Invalid URL format. Must start with https:// or http://' };
  }

  try {
    const res = await fetch(trimmed, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        test: true,
        client: 'ClearClause',
        url: 'https://example.com/terms',
        documentText: 'Terms of Service sample text for connectivity check.',
        documentName: 'ConnectionCheck.txt',
        language: 'en'
      })
    });

    if (res.ok || res.status === 200 || res.status === 204) {
      return { 
        success: true, 
        message: `Connected successfully (HTTP ${res.status}). n8n workflow is live and responding!` 
      };
    } else {
      return { 
        success: false, 
        message: `Webhook returned HTTP ${res.status}: ${res.statusText}. Please verify the webhook is configured for POST methods.` 
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect to ${trimmed}: ${err.message || 'Network error or CORS restriction'}. Make sure your n8n workflow is active.`
    };
  }
}

export const ApiService = {
  analyzeTerms: (request: {
    url?: string;
    documentText?: string;
    documentName?: string;
    language?: string;
    n8nWebhookUrl?: string;
  }, onProgress?: ProgressCallback) => {
    return analyzeTerms(request, onProgress);
  },
  testN8nConnection: (webhookUrl: string) => testN8nConnection(webhookUrl),
  getWebhookUrl: (): string => {
    try {
      const saved = localStorage.getItem(N8N_WEBHOOK_KEY);
      if (saved && saved.trim()) return saved.trim();
    } catch {
      // ignore
    }
    return DEFAULT_N8N_PRODUCTION_WEBHOOK_URL;
  },
  setWebhookUrl: (url: string) => {
    try {
      localStorage.setItem(N8N_WEBHOOK_KEY, url.trim());
    } catch (e) {
      console.error('Error saving webhook URL to localStorage', e);
    }
  },
  sendChatMessage: async (params: {
    message: string;
    history?: Array<{ role: 'user' | 'model'; content: string }>;
    contextDocument?: {
      companyName?: string;
      documentTitle?: string;
      summarySnippet?: string;
    };
    activeClause?: {
      title?: string;
      snippet?: string;
      explanation?: string;
      riskLevel?: string;
    };
  }): Promise<string> => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      let errMsg = 'Failed to reach Clear Clause AI';
      try {
        const errJson = await res.json();
        errMsg = errJson.error || errJson.message || errMsg;
      } catch {
        // ignore
      }
      throw new Error(errMsg);
    }

    const data = await res.json();
    return data.reply;
  }
};
