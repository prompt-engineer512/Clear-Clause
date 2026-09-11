import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { AnalysisLoading } from './components/AnalysisLoading';
import { AnalysisWorkspace } from './components/AnalysisWorkspace';
import { HistoryPage } from './components/HistoryPage';
import { SettingsPage } from './components/SettingsPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { ClearClauseChatbot } from './components/ClearClauseChatbot';
import { CommunityPage } from './components/community/CommunityPage';
import { ActivePage, AnalysisResult, HistoryItem, PreFillPostData } from './types';
import { ApiService } from './services/api';
import { sampleSpotifyAnalysis, sampleDiscordAnalysis, sampleTikTokAnalysis, sampleNetflixAnalysis } from './data/sampleAnalyses';
import { Bot } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

const STORAGE_HISTORY_KEY = 'clearclause_analysis_history';
const STORAGE_USER_KEY = 'clearclause_user_auth';

export default function App() {
  const { isDark } = useTheme();
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatClause, setActiveChatClause] = useState<{
    title?: string;
    snippet?: string;
    explanation?: string;
    riskLevel?: string;
  } | null>(null);

  // History State
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading history from localStorage', e);
    }
    // Default seed items if empty
    return [
      {
        id: sampleSpotifyAnalysis.id,
        companyName: sampleSpotifyAnalysis.companyName,
        documentTitle: sampleSpotifyAnalysis.documentTitle,
        analyzedDate: sampleSpotifyAnalysis.analyzedDate,
        overallScore: sampleSpotifyAnalysis.scores.overall,
        riskLevel: sampleSpotifyAnalysis.overallRiskLevel,
        summarySnippet: sampleSpotifyAnalysis.oneMinuteSummary.headline,
        fullAnalysis: sampleSpotifyAnalysis
      },
      {
        id: sampleDiscordAnalysis.id,
        companyName: sampleDiscordAnalysis.companyName,
        documentTitle: sampleDiscordAnalysis.documentTitle,
        analyzedDate: sampleDiscordAnalysis.analyzedDate,
        overallScore: sampleDiscordAnalysis.scores.overall,
        riskLevel: sampleDiscordAnalysis.overallRiskLevel,
        summarySnippet: sampleDiscordAnalysis.oneMinuteSummary.headline,
        fullAnalysis: sampleDiscordAnalysis
      },
      {
        id: sampleTikTokAnalysis.id,
        companyName: sampleTikTokAnalysis.companyName,
        documentTitle: sampleTikTokAnalysis.documentTitle,
        analyzedDate: sampleTikTokAnalysis.analyzedDate,
        overallScore: sampleTikTokAnalysis.scores.overall,
        riskLevel: sampleTikTokAnalysis.overallRiskLevel,
        summarySnippet: sampleTikTokAnalysis.oneMinuteSummary.headline,
        fullAnalysis: sampleTikTokAnalysis
      },
      {
        id: sampleNetflixAnalysis.id,
        companyName: sampleNetflixAnalysis.companyName,
        documentTitle: sampleNetflixAnalysis.documentTitle,
        analyzedDate: sampleNetflixAnalysis.analyzedDate,
        overallScore: sampleNetflixAnalysis.scores.overall,
        riskLevel: sampleNetflixAnalysis.overallRiskLevel,
        summarySnippet: sampleNetflixAnalysis.oneMinuteSummary.headline,
        fullAnalysis: sampleNetflixAnalysis
      }
    ];
  });

  // User Auth State
  const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_USER_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Community Integration State
  const [communityPreFillData, setCommunityPreFillData] = useState<PreFillPostData | null>(null);
  const [communitySelectedPostId, setCommunitySelectedPostId] = useState<string | null>(null);

  // Save history to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(historyItems));
    } catch (e) {
      console.error('Error saving history', e);
    }
  }, [historyItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartAnalysis = async (input: { url?: string; documentText?: string; documentName?: string; language?: string }) => {
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingProgress(10);
    setLoadingStep('Fetching policy...');

    try {
      // Step simulation for smooth transition
      const timer1 = setTimeout(() => {
        setLoadingProgress(35);
        setLoadingStep('Reading the document...');
      }, 500);

      const timer2 = setTimeout(() => {
        setLoadingProgress(60);
        setLoadingStep('Identifying important clauses...');
      }, 1000);

      const timer3 = setTimeout(() => {
        setLoadingProgress(82);
        setLoadingStep('Analyzing privacy practices...');
      }, 1400);

      const timer4 = setTimeout(() => {
        setLoadingProgress(95);
        setLoadingStep('Calculating risk scores...');
      }, 1800);

      const result = await ApiService.analyzeTerms({
        url: input.url,
        documentText: input.documentText,
        documentName: input.documentName,
        language: input.language
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);

      setLoadingProgress(100);

      setTimeout(() => {
        setCurrentAnalysis(result);
        setIsLoading(false);
        setActivePage('home');

        // Add to history if not already present
        const newHistoryItem: HistoryItem = {
          id: result.id,
          companyName: result.companyName,
          documentTitle: result.documentTitle,
          analyzedDate: result.analyzedDate,
          overallScore: result.scores.overall,
          riskLevel: result.overallRiskLevel,
          summarySnippet: result.oneMinuteSummary.headline,
          fullAnalysis: result
        };

        setHistoryItems((prev) => {
          const filtered = prev.filter((item) => item.id !== result.id);
          return [newHistoryItem, ...filtered];
        });

        showToast(`Analysis complete for ${result.companyName}`);
      }, 400);

    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'An error occurred while analyzing the document.');
    }
  };

  const handleOpenHistoryItem = (item: HistoryItem) => {
    if (item.fullAnalysis) {
      setCurrentAnalysis(item.fullAnalysis);
    } else {
      // Fallback
      setCurrentAnalysis(sampleSpotifyAnalysis);
    }
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Record removed from history');
  };

  const handleClearAllHistory = () => {
    setHistoryItems([]);
    showToast('All history cleared');
  };

  const handleLoginSuccess = (userData: { email: string; name: string }) => {
    setUser(userData);
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }
    showToast(`Welcome, ${userData.name}!`);
  };

  const handleAskAIAboutClause = (clause?: any) => {
    if (clause) {
      setActiveChatClause({
        title: clause.title,
        snippet: clause.originalSnippet || clause.explanation,
        explanation: clause.explanation,
        riskLevel: clause.riskLevel
      });
    }
    setIsChatOpen(true);
  };

  const handleDiscussClauseInCommunity = (clause: any, companyName?: string) => {
    const docName = companyName || 'Terms of Service';
    setCommunityPreFillData({
      title: `Can someone explain this clause from ${docName}?`,
      content: `I was analyzing ${docName} on Clear Clause and found this clause:\n\n> "${clause.originalSnippet || clause.title}"\n\n**Plain Meaning:** ${clause.explanation}\n**Why it matters:** ${clause.whyItMatters}\n\nCould someone share real-world experience or legal perspective on this?`,
      category: clause.riskLevel === 'concerning' ? 'Risk Alerts' : 'Hidden Clauses',
      sourceDocument: docName
    });
    setActivePage('community');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter',sans-serif] app-radial-bg selection:bg-blue-500/25 selection:text-blue-200 theme-text-primary">
      
      {/* Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        hasActiveAnalysis={!!currentAnalysis}
        onResetAnalysis={() => {
          setCurrentAnalysis(null);
          setErrorMessage(null);
        }}
        historyCount={historyItems.length}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenChat={() => setIsChatOpen(prev => !prev)}
        isChatOpen={isChatOpen}
        onSelectCommunityPost={(postId) => {
          setCommunitySelectedPostId(postId);
          setActivePage('community');
        }}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#1c1f26]/95 border border-[#2a2e35] text-[#f1f5f9] text-xs font-semibold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Routing Views */}
      <div className="flex-1">
        
        {/* PAGE 1: HOME */}
        {activePage === 'home' && (
          <>
            {isLoading ? (
              <AnalysisLoading
                currentStep={loadingStep}
                progressPercent={loadingProgress}
              />
            ) : currentAnalysis ? (
              <AnalysisWorkspace
                analysis={currentAnalysis}
                onNewAnalysis={() => {
                  setCurrentAnalysis(null);
                  setErrorMessage(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onAskAI={handleAskAIAboutClause}
                onDiscussInCommunity={handleDiscussClauseInCommunity}
              />
            ) : (
              <HomeHero
                onAnalyze={handleStartAnalysis}
                isLoading={isLoading}
                errorMessage={errorMessage}
                onClearError={() => setErrorMessage(null)}
                onOpenChat={() => setIsChatOpen(true)}
              />
            )}
          </>
        )}

        {/* PAGE 2: ABOUT US */}
        {activePage === 'about' && (
          <AboutPage
            onStartAnalysis={() => {
              setActivePage('home');
              setCurrentAnalysis(null);
            }}
          />
        )}

        {/* PAGE 3: CONTACT US */}
        {activePage === 'contact' && <ContactPage />}

        {/* PAGE 4: HISTORY */}
        {activePage === 'history' && (
          <HistoryPage
            historyItems={historyItems}
            onOpenItem={handleOpenHistoryItem}
            onDeleteItem={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
            onNewAnalysis={() => {
              setActivePage('home');
              setCurrentAnalysis(null);
            }}
          />
        )}

        {/* PAGE 5: SETTINGS */}
        {activePage === 'settings' && (
          <SettingsPage
            user={user}
            onClearHistory={handleClearAllHistory}
            onSaveNotification={(msg) => showToast(msg)}
          />
        )}

        {/* PAGE 6: COMMUNITY */}
        {activePage === 'community' && (
          <CommunityPage
            currentUser={user}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            showToast={showToast}
            preFillData={communityPreFillData}
            onClearPreFill={() => setCommunityPreFillData(null)}
            initialPostId={communitySelectedPostId}
          />
        )}

      </div>

      {/* Floating Clear Clause AI Launcher Button (when chat window is minimized/closed) */}
      {!isChatOpen && (
        <button
          id="floating-chatbot-launcher"
          onClick={() => setIsChatOpen(true)}
          className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3 px-4 py-3 rounded-full font-medium text-sm transition-all duration-300 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 group border ${
            isDark 
              ? 'bg-[#081426] border-[#172B46] text-white' 
              : 'bg-white border-[#E5E5E5] text-[#111111] shadow-lg'
          }`}
          style={{
            boxShadow: isDark 
              ? '0 10px 25px -5px rgba(5, 7, 13, 0.7), 0 0 15px -3px rgba(22, 119, 255, 0.3)'
              : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 15px -3px rgba(22, 119, 255, 0.2)'
          }}
          aria-label="Open Clear Clause AI"
        >
          <div className="relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
              isDark 
                ? 'bg-[#0B1F3A] border-[#172B46] text-[#2F8CFF] group-hover:bg-[#1677FF] group-hover:text-white' 
                : 'bg-blue-50 border-blue-200 text-[#1677FF] group-hover:bg-[#1677FF] group-hover:text-white'
            }`}>
              <Bot className="w-4.5 h-4.5" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bg-card)] animate-pulse" />
          </div>

          <div className="text-left pr-1">
            <div className="flex items-center gap-1.5 leading-none">
              <span className={`font-semibold text-xs tracking-tight font-['Space_Grotesk'] ${
                isDark ? 'text-white' : 'text-[#111111]'
              }`}>
                Clear Clause AI
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-[#1677FF]/15 text-[#1677FF] border border-[#1677FF]/30 font-semibold">
                AI
              </span>
            </div>
            <span className={`text-[10px] leading-none block mt-1 ${
              isDark ? 'text-[#A7B4C8]' : 'text-[#555555]'
            }`}>
              Ask about any clause
            </span>
          </div>
        </button>
      )}

      {/* Clear Clause AI Chatbot Window */}
      <ClearClauseChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeDocument={currentAnalysis ? {
          companyName: currentAnalysis.companyName,
          documentTitle: currentAnalysis.documentTitle,
          summarySnippet: currentAnalysis.oneMinuteSummary?.headline
        } : null}
        activeClause={activeChatClause}
        onClearActiveClause={() => setActiveChatClause(null)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Global Footer */}
      <Footer setActivePage={setActivePage} />

    </div>
  );
}
