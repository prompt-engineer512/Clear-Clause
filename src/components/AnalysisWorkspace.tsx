import React, { useState } from 'react';
import { 
  Clock, 
  Shield, 
  DollarSign, 
  RefreshCw, 
  UserCheck, 
  EyeOff, 
  Filter, 
  Cookie, 
  Scale, 
  History, 
  Activity, 
  Sparkles,
  Download, 
  Volume2, 
  VolumeX, 
  Globe, 
  ArrowLeft,
  ExternalLink,
  Calendar,
  Layers,
  ChevronRight,
  Bot
} from 'lucide-react';
import { AnalysisResult, ClauseItem, WorkspaceSection } from '../types';
import { ScoreGauges } from './ScoreGauges';
import { OneMinuteSummarySection } from './OneMinuteSummarySection';
import { DataPrivacySection } from './DataPrivacySection';
import { RefundsMoneySection } from './RefundsMoneySection';
import { AutoRenewalSection } from './AutoRenewalSection';
import { UserRightsSection } from './UserRightsSection';
import { ImportantClausesSection } from './ImportantClausesSection';
import { RiskHighlightsSection } from './RiskHighlightsSection';
import { CookiePolicySection } from './CookiePolicySection';
import { RelatedCasesSection } from './RelatedCasesSection';
import { PolicyChangesSection } from './PolicyChangesSection';
import { TrustTimelineSection } from './TrustTimelineSection';
import { BetterAlternativesSection } from './BetterAlternativesSection';
import { LANGUAGES, getTranslatedSummary } from '../utils/translations';
import { TTSService } from '../utils/tts';

interface AnalysisWorkspaceProps {
  analysis: AnalysisResult;
  onNewAnalysis: () => void;
  onAskAI?: (clause?: ClauseItem) => void;
  onDiscussInCommunity?: (clause: ClauseItem, companyName?: string) => void;
}

export const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  analysis,
  onNewAnalysis,
  onAskAI,
  onDiscussInCommunity
}) => {
  const [activeSection, setActiveSection] = useState<WorkspaceSection>('overview');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Compute translated summary
  const translated = getTranslatedSummary(
    analysis?.oneMinuteSummary?.headline || `${analysis?.companyName || 'Document'} Terms Summary`,
    analysis?.oneMinuteSummary?.takeaways || [],
    analysis?.oneMinuteSummary?.narrative || 'Summary not provided.',
    selectedLanguage
  );

  const sidebarNavItems = [
    { id: 'overview' as WorkspaceSection, label: 'Overview & Scores', icon: Layers, show: true },
    { id: 'summary' as WorkspaceSection, label: '1-Minute Summary', icon: Clock, show: Boolean(analysis?.oneMinuteSummary) },
    { id: 'privacy' as WorkspaceSection, label: 'Data & Privacy', icon: Shield, show: Boolean(analysis?.dataPrivacy) },
    { id: 'refunds' as WorkspaceSection, label: 'Refunds & Money', icon: DollarSign, show: Boolean(analysis?.refundsMoney) },
    { id: 'renewal' as WorkspaceSection, label: 'Auto-Renewal', icon: RefreshCw, show: Boolean(analysis?.autoRenewal) },
    { id: 'rights' as WorkspaceSection, label: 'Your Rights', icon: UserCheck, show: Boolean(analysis?.userRights) },
    { id: 'clauses' as WorkspaceSection, label: 'Important Clauses', icon: EyeOff, show: Boolean(analysis?.importantClauses && analysis.importantClauses.length > 0) },
    { id: 'highlights' as WorkspaceSection, label: 'Risk Highlights', icon: Filter, show: Boolean(analysis?.importantClauses && analysis.importantClauses.length > 0) },
    { id: 'cookies' as WorkspaceSection, label: 'Cookie Policy', icon: Cookie, show: Boolean(analysis?.cookiePolicy) },
    { id: 'cases' as WorkspaceSection, label: 'Related Cases', icon: Scale, show: Boolean(analysis?.relatedCases && analysis.relatedCases.length > 0) },
    { id: 'changes' as WorkspaceSection, label: 'Policy Changes', icon: History, show: Boolean(analysis?.policyChanges && analysis.policyChanges.length > 0) },
    { id: 'trust' as WorkspaceSection, label: 'Trust Timeline', icon: Activity, show: Boolean(analysis?.trustTimeline?.history && analysis.trustTimeline.history.length > 0) },
    { id: 'alternatives' as WorkspaceSection, label: 'Better Alternatives', icon: Sparkles, show: Boolean(analysis?.alternatives && analysis.alternatives.length > 0) }
  ].filter(item => item.show);

  const handleToggleGlobalAudio = () => {
    if (isAudioPlaying) {
      TTSService.stop();
      setIsAudioPlaying(false);
    } else {
      const fullText = `ClearClause analysis for ${analysis.companyName}. ${analysis.overallAssessment}. 1-minute summary: ${translated.summaryHeadline}. ${translated.takeaways.join('. ')}`;
      const started = TTSService.speak(
        fullText,
        selectedLanguage === 'en' ? 'en-US' : selectedLanguage,
        1.0,
        () => setIsAudioPlaying(false),
        () => setIsAudioPlaying(false)
      );
      if (started) setIsAudioPlaying(true);
    }
  };

  const handlePrintOrPdf = () => {
    window.print();
  };

  const getOverallRiskBadge = () => {
    switch (analysis.overallRiskLevel) {
      case 'safe':
        return {
          label: 'Low Risk / Favorable',
          classes: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
        };
      case 'caution':
        return {
          label: 'Moderate Caution',
          classes: 'bg-amber-500/15 border-amber-500/30 text-amber-400'
        };
      default:
        return {
          label: 'High Concern',
          classes: 'bg-red-500/15 border-red-500/30 text-red-400'
        };
    }
  };

  const riskBadge = getOverallRiskBadge();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      {/* Top Header Card */}
      <div className="p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm mb-6">
        
        {/* Row 1: Company Name, Risk Badge, Actions */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#2a2e35]">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {analysis.companyName}
              </h1>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${riskBadge.classes}`}>
                {riskBadge.label}
              </span>
            </div>

            <p className="text-sm font-medium text-[#94a3b8]">
              {analysis.documentTitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#94a3b8]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Analyzed on {analysis.analyzedDate}</span>
              </span>

              {analysis.effectiveDate && (
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Effective: {analysis.effectiveDate}</span>
                </span>
              )}

              {analysis.lastUpdated && analysis.lastUpdated !== analysis.analyzedDate && (
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  <span>Last Updated: {analysis.lastUpdated}</span>
                </span>
              )}

              {analysis.sourceUrl && (
                <a
                  href={analysis.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-1 text-[#3b82f6] hover:text-blue-400 transition truncate max-w-xs sm:max-w-md"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{analysis.sourceUrl}</span>
                </a>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#181b1f] border border-[#2a2e35] text-xs text-[#94a3b8]">
              <Globe className="w-3.5 h-3.5 text-[#3b82f6]" />
              <select
                id="language-selector"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-[#f1f5f9] text-xs font-medium focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#181b1f] text-[#f1f5f9]">
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Listen Audio Button */}
            <button
              type="button"
              id="tts-listen-workspace-btn"
              onClick={handleToggleGlobalAudio}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                isAudioPlaying
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse'
                  : 'bg-[#181b1f] text-[#94a3b8] hover:text-[#f1f5f9] border-[#2a2e35] hover:bg-[#1c1f26]'
              }`}
              title="Listen to full executive summary"
            >
              {isAudioPlaying ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#3b82f6]" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#3b82f6]" />
                  <span>Listen 🔊</span>
                </>
              )}
            </button>

            {/* PDF / Print Download Button */}
            <button
              type="button"
              id="pdf-download-btn"
              onClick={handlePrintOrPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#181b1f] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#2a2e35] hover:bg-[#1c1f26] transition cursor-pointer"
              title="Download or Print PDF Analysis"
            >
              <Download className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span>Export PDF ↓</span>
            </button>

            {/* Ask Clear Clause AI Button */}
            {onAskAI && (
              <button
                type="button"
                id="ask-ai-workspace-btn"
                onClick={() => onAskAI()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#081426] text-[#2F8CFF] hover:text-white border border-[#172B46] hover:border-[#1677FF] hover:bg-[#0B1F3A] transition cursor-pointer shadow-sm"
                title="Ask Clear Clause AI about this document"
              >
                <Bot className="w-3.5 h-3.5 text-[#2F8CFF]" />
                <span>Ask Clear Clause AI</span>
              </button>
            )}

            {/* New Analysis Button */}
            <button
              type="button"
              id="new-analysis-workspace-btn"
              onClick={onNewAnalysis}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#3b82f6] hover:bg-blue-600 transition shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </button>

          </div>
        </div>

        {/* Overall Assessment Statement */}
        <div className="pt-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] block mb-1">
            Executive Assessment
          </span>
          <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed font-normal">
            {analysis.overallAssessment}
          </p>
        </div>

        {/* 4 Prominent Circular Risk Score Gauges */}
        <div className="mt-5 pt-5 border-t border-[#2a2e35]">
          <ScoreGauges scores={analysis.scores} scoreExplanations={analysis.scoreExplanations} />
        </div>

        {/* Warnings Banner if returned from analysis */}
        {analysis.warnings && analysis.warnings.length > 0 && (
          <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <div className="flex items-center gap-2 mb-2 font-semibold text-xs uppercase tracking-wider text-amber-400">
              <span>⚠️ Critical Warnings & Alerts</span>
            </div>
            <ul className="space-y-1 text-xs">
              {analysis.warnings.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Main Analysis Workspace Layout (Sidebar + Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Navigation Sidebar */}
        <aside className="lg:col-span-3 lg:sticky lg:top-20 space-y-1 bg-[#181b1f] border border-[#2a2e35] rounded-xl p-3 shadow-sm">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] border-b border-[#2a2e35] mb-1">
            Sections
          </div>

          <nav className="space-y-0.5">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setActiveSection(item.id);
                    const elem = document.getElementById(`section-${item.id}`);
                    if (elem) {
                      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[rgba(59,130,246,0.1)] text-[#3b82f6] font-medium'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1c1f26]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#3b82f6]' : 'text-[#94a3b8]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 mt-2 border-t border-[#2a2e35]">
            <button
              type="button"
              id="sidebar-new-analysis-btn"
              onClick={onNewAnalysis}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-[#3b82f6] hover:bg-blue-600 transition shadow-sm cursor-pointer"
            >
              <span>+</span>
              <span>New Analysis</span>
            </button>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* 1-Minute Summary Section */}
          <OneMinuteSummarySection
            summary={{
              headline: translated.summaryHeadline,
              takeaways: translated.takeaways,
              narrative: translated.narrative
            }}
            companyName={analysis.companyName}
            currentLanguage={selectedLanguage}
          />

          {/* Important Clauses Section */}
          <ImportantClausesSection 
            clauses={analysis.importantClauses} 
            onAskAI={onAskAI ? (clause) => onAskAI(clause) : undefined}
            onDiscussInCommunity={onDiscussInCommunity ? (clause) => onDiscussInCommunity(clause, analysis.companyName) : undefined}
          />

          {/* Red / Yellow / Green Highlights Section */}
          <RiskHighlightsSection clauses={analysis.importantClauses} />

          {/* Legal Safeguards / Disputes / Liability / Termination if provided */}
          {(analysis.disputes || analysis.liability || analysis.termination) && (
            <section id="section-legal-safeguards" className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    Disputes, Liability & Termination
                  </h3>
                  <p className="text-xs text-[#94a3b8]">
                    Contractual liability limitations, arbitration terms, and cancellation rules
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.disputes && (
                  <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                      Dispute Resolution & Arbitration
                    </h4>
                    <p className="text-xs text-[#cbd5e1] leading-relaxed">
                      {typeof analysis.disputes === 'string' ? analysis.disputes : (analysis.disputes.terms || analysis.disputes.jurisdiction || 'Mandatory individual arbitration and waiver of class action rights.')}
                    </p>
                  </div>
                )}

                {analysis.liability && (
                  <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                      Limitation of Liability
                    </h4>
                    <p className="text-xs text-[#cbd5e1] leading-relaxed">
                      {typeof analysis.liability === 'string' ? analysis.liability : (analysis.liability.limits || analysis.liability.disclaimers || 'Direct and consequential damages strictly capped or disclaimed to the maximum extent permitted.')}
                    </p>
                  </div>
                )}

                {analysis.termination && (
                  <div className="p-4 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                      Account Termination
                    </h4>
                    <p className="text-xs text-[#cbd5e1] leading-relaxed">
                      {typeof analysis.termination === 'string' ? analysis.termination : (analysis.termination.conditions || analysis.termination.rights || 'Service provider reserves right to suspend or terminate accounts for terms violation.')}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Data & Privacy Section */}
          <DataPrivacySection data={analysis.dataPrivacy} />

          {/* Refunds & Money Section */}
          <RefundsMoneySection refunds={analysis.refundsMoney} />

          {/* Auto-Renewal Section */}
          <AutoRenewalSection autoRenewal={analysis.autoRenewal} />

          {/* User Rights Section */}
          <UserRightsSection rights={analysis.userRights} />

          {/* Cookie Policy Section */}
          <CookiePolicySection cookies={analysis.cookiePolicy} />

          {/* Company Trust Timeline */}
          {analysis.trustTimeline?.history && analysis.trustTimeline.history.length > 0 && (
            <TrustTimelineSection trustTimeline={analysis.trustTimeline} companyName={analysis.companyName} />
          )}

          {/* Policy Changes Over Time */}
          {analysis.policyChanges && analysis.policyChanges.length > 0 && (
            <PolicyChangesSection changes={analysis.policyChanges} />
          )}

          {/* Related Cases Section */}
          {analysis.relatedCases && analysis.relatedCases.length > 0 && (
            <RelatedCasesSection cases={analysis.relatedCases} companyName={analysis.companyName} />
          )}

          {/* Better Alternatives Section */}
          {analysis.alternatives && analysis.alternatives.length > 0 && (
            <BetterAlternativesSection alternatives={analysis.alternatives} companyName={analysis.companyName} />
          )}

        </main>

      </div>

    </div>
  );
};
