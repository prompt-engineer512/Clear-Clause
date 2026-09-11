import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  ShieldCheck, 
  Scale, 
  BookOpen, 
  GitCompare,
  ArrowRight,
  Info
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage } from '../types';
import { ApiService } from '../services/api';
import { TTSService } from '../utils/tts';
import { useTheme } from '../context/ThemeContext';

interface ClearClauseChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  activeDocument?: {
    companyName?: string;
    documentTitle?: string;
    summarySnippet?: string;
  } | null;
  activeClause?: {
    title?: string;
    snippet?: string;
    explanation?: string;
    riskLevel?: string;
  } | null;
  onClearActiveClause?: () => void;
}

const STORAGE_CHAT_KEY = 'clearclause_ai_chat_history';

const INITIAL_GREETING = `Hello! I am **Clear Clause AI**.

I help you decode, summarize, and understand complex legal language, terms of service, and privacy policies in plain English.

How can I help you today? You can:
- Paste a confusing clause for a plain-English explanation
- Ask about termination rules, liability limits, or auto-renewals
- Check for hidden risks or compare two different clauses
- Look up legal terminology without the legalese`;

export const ClearClauseChatbot: React.FC<ClearClauseChatbotProps> = ({
  isOpen,
  onClose,
  activeDocument,
  activeClause,
  onClearActiveClause
}) => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHAT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'welcome-msg',
        role: 'model',
        content: INITIAL_GREETING,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'quick-actions'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save messages to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Handle auto-focus and pre-filling if activeClause is passed
  useEffect(() => {
    if (isOpen && activeClause && activeClause.snippet) {
      const prompt = `Please explain this "${activeClause.title || 'selected clause'}" in simple terms and evaluate its risks:\n\n"${activeClause.snippet}"`;
      setInputMessage(prompt);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } else if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen, activeClause]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build past history turns for conversation context
      const historyPayload = messages
        .filter((m) => !m.isError)
        .map((m) => ({
          role: m.role,
          content: m.content
        }));

      const reply = await ApiService.sendChatMessage({
        message: text,
        history: historyPayload,
        contextDocument: activeDocument ? {
          companyName: activeDocument.companyName,
          documentTitle: activeDocument.documentTitle,
          summarySnippet: activeDocument.summarySnippet
        } : undefined,
        activeClause: activeClause ? {
          title: activeClause.title,
          snippet: activeClause.snippet,
          explanation: activeClause.explanation,
          riskLevel: activeClause.riskLevel
        } : undefined
      });

      const modelMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, modelMessage]);

      if (activeClause && onClearActiveClause) {
        onClearActiveClause();
      }
    } catch (err: any) {
      const errMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `**Notice:** ${err.message || 'Unable to connect with Clear Clause AI. Please verify your connection or Gemini API credentials.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeak = (id: string, text: string) => {
    if (playingMessageId === id) {
      TTSService.stop();
      setPlayingMessageId(null);
    } else {
      TTSService.stop();
      // Remove markdown asterisks and hash marks for smoother text-to-speech
      const plainText = text.replace(/[*#_`>]/g, '').trim();
      const started = TTSService.speak(
        plainText,
        'en-US',
        1.0,
        () => setPlayingMessageId(null),
        () => setPlayingMessageId(null)
      );
      if (started) {
        setPlayingMessageId(id);
      }
    }
  };

  const handleResetChat = () => {
    TTSService.stop();
    setPlayingMessageId(null);
    const freshMessages: ChatMessage[] = [
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: INITIAL_GREETING,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(freshMessages);
    localStorage.removeItem(STORAGE_CHAT_KEY);
    if (onClearActiveClause) onClearActiveClause();
  };

  // Quick action triggers
  const handleQuickAction = (type: 'explain' | 'summarize' | 'risks' | 'simply' | 'term' | 'compare') => {
    let template = '';
    switch (type) {
      case 'explain':
        template = 'Can you explain this clause in clear, simple language?\n\n[Paste your legal clause here]';
        break;
      case 'summarize':
        template = 'Please provide a concise, high-level summary of the key obligations and terms in this clause:\n\n[Paste clause here]';
        break;
      case 'risks':
        template = 'Analyze this clause and identify potential risks or concerning wording using 🟢 Low, 🟡 Medium, and 🔴 High risk levels:\n\n[Paste clause here]';
        break;
      case 'simply':
        template = 'Explain this legal clause as if I am five years old, in plain everyday English with zero legal jargon:\n\n[Paste clause here]';
        break;
      case 'term':
        template = 'Define and explain this legal term in straightforward language: ';
        break;
      case 'compare':
        template = 'Please compare these two legal clauses and highlight differences in user rights, restrictions, and liability:\n\nClause 1:\n[Paste Clause 1]\n\nClause 2:\n[Paste Clause 2]';
        break;
    }
    setInputMessage(template);
    setActiveTab('chat');
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        if (type === 'term') {
          textareaRef.current.setSelectionRange(template.length, template.length);
        }
      }
    }, 50);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed z-50 transition-all duration-200 flex flex-col ${
        isExpanded 
          ? 'inset-4 sm:inset-6 md:inset-10 max-w-5xl mx-auto rounded-2xl shadow-2xl overflow-hidden' 
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[460px] h-[640px] max-h-[88vh] rounded-2xl shadow-2xl overflow-hidden'
      }`}
      style={{
        backgroundColor: isDark ? '#05070D' : '#FFFFFF',
        border: `1px solid ${isDark ? '#172B46' : '#E5E5E5'}`,
        boxShadow: isDark 
          ? '0 25px 50px -12px rgba(5, 7, 13, 0.8), 0 0 0 1px #172B46'
          : '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px #E5E5E5'
      }}
    >
      {/* 1. Header */}
      <div 
        className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b select-none transition-colors"
        style={{
          backgroundColor: isDark ? '#081426' : '#F7F7F7',
          borderColor: isDark ? '#172B46' : '#E5E5E5'
        }}
      >
        <div className="flex items-center gap-3">
          {/* Logo / Bot Icon */}
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundColor: isDark ? '#0B1F3A' : '#EBF3FF',
              border: `1px solid ${isDark ? '#172B46' : '#D1E5FF'}`
            }}
          >
            <Bot className="w-4.5 h-4.5 text-[#2F8CFF]" />
            <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ${isDark ? 'ring-[#081426]' : 'ring-white'}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold text-sm sm:text-base font-['Space_Grotesk'] tracking-tight ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                Clear Clause AI
              </h3>
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.2 rounded-full border ${
                isDark 
                  ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50' 
                  : 'text-emerald-700 bg-emerald-50 border-emerald-200'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-[#A7B4C8]' : 'text-[#555555]'}`}>
              Understand legal language clearly.
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            id="chat-reset-btn"
            onClick={handleResetChat}
            title="Reset Chat"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isDark 
                ? 'text-[#A7B4C8] hover:text-white hover:bg-[#0B1F3A]' 
                : 'text-[#555555] hover:text-[#111111] hover:bg-[#EEEEEE]'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="chat-expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
            className={`hidden sm:inline-flex p-1.5 rounded-lg transition cursor-pointer ${
              isDark 
                ? 'text-[#A7B4C8] hover:text-white hover:bg-[#0B1F3A]' 
                : 'text-[#555555] hover:text-[#111111] hover:bg-[#EEEEEE]'
            }`}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            id="chat-close-btn"
            onClick={() => {
              TTSService.stop();
              onClose();
            }}
            title="Close Chat"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isDark 
                ? 'text-[#A7B4C8] hover:text-white hover:bg-[#0B1F3A]' 
                : 'text-[#555555] hover:text-[#111111] hover:bg-[#EEEEEE]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Context Banner if loaded */}
      {(activeClause || activeDocument) && (
        <div 
          className="px-4 py-2 border-b text-xs flex items-center justify-between transition-colors"
          style={{
            backgroundColor: isDark ? '#081426' : '#F7F7F7',
            borderColor: isDark ? '#172B46' : '#E5E5E5'
          }}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-[#1677FF] shrink-0" />
            <span className={`shrink-0 font-medium ${isDark ? 'text-[#A7B4C8]' : 'text-[#555555]'}`}>Context:</span>
            <span className={`truncate font-medium ${isDark ? 'text-white' : 'text-[#111111]'}`}>
              {activeClause ? activeClause.title || 'Selected Clause' : activeDocument?.companyName}
            </span>
          </div>
          {onClearActiveClause && activeClause && (
            <button
              onClick={onClearActiveClause}
              className="text-[11px] text-[#2F8CFF] hover:underline cursor-pointer shrink-0 ml-2"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Quick Action Navigation Pills */}
      <div 
        className="px-4 py-2 border-b flex items-center gap-1.5 overflow-x-auto no-scrollbar transition-colors"
        style={{
          backgroundColor: isDark ? '#05070D' : '#FFFFFF',
          borderColor: isDark ? '#172B46' : '#E5E5E5'
        }}
      >
        <button
          onClick={() => handleQuickAction('explain')}
          className={`whitespace-nowrap px-2.5 py-1 text-xs rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 border ${
            isDark 
              ? 'text-[#A7B4C8] hover:text-white bg-[#081426] hover:bg-[#0B1F3A] border-[#172B46]' 
              : 'text-[#555555] hover:text-[#111111] bg-[#F7F7F7] hover:bg-[#EEEEEE] border-[#E5E5E5]'
          }`}
        >
          <HelpCircle className="w-3 h-3 text-[#2F8CFF]" />
          <span>Explain a Clause</span>
        </button>

        <button
          onClick={() => handleQuickAction('summarize')}
          className={`whitespace-nowrap px-2.5 py-1 text-xs rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 border ${
            isDark 
              ? 'text-[#A7B4C8] hover:text-white bg-[#081426] hover:bg-[#0B1F3A] border-[#172B46]' 
              : 'text-[#555555] hover:text-[#111111] bg-[#F7F7F7] hover:bg-[#EEEEEE] border-[#E5E5E5]'
          }`}
        >
          <FileText className="w-3 h-3 text-[#2F8CFF]" />
          <span>Summarize</span>
        </button>

        <button
          onClick={() => handleQuickAction('risks')}
          className={`whitespace-nowrap px-2.5 py-1 text-xs rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 border ${
            isDark 
              ? 'text-[#A7B4C8] hover:text-white bg-[#081426] hover:bg-[#0B1F3A] border-[#172B46]' 
              : 'text-[#555555] hover:text-[#111111] bg-[#F7F7F7] hover:bg-[#EEEEEE] border-[#E5E5E5]'
          }`}
        >
          <ShieldCheck className="w-3 h-3 text-[#10b981]" />
          <span>Find Risks</span>
        </button>

        <button
          onClick={() => handleQuickAction('simply')}
          className={`whitespace-nowrap px-2.5 py-1 text-xs rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 border ${
            isDark 
              ? 'text-[#A7B4C8] hover:text-white bg-[#081426] hover:bg-[#0B1F3A] border-[#172B46]' 
              : 'text-[#555555] hover:text-[#111111] bg-[#F7F7F7] hover:bg-[#EEEEEE] border-[#E5E5E5]'
          }`}
        >
          <Sparkles className="w-3 h-3 text-[#f59e0b]" />
          <span>Explain Simply</span>
        </button>

        <button
          onClick={() => handleQuickAction('term')}
          className={`whitespace-nowrap px-2.5 py-1 text-xs rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 border ${
            isDark 
              ? 'text-[#A7B4C8] hover:text-white bg-[#081426] hover:bg-[#0B1F3A] border-[#172B46]' 
              : 'text-[#555555] hover:text-[#111111] bg-[#F7F7F7] hover:bg-[#EEEEEE] border-[#E5E5E5]'
          }`}
        >
          <BookOpen className="w-3 h-3 text-[#2F8CFF]" />
          <span>Define Legal Term</span>
        </button>

        <button
          onClick={() => handleQuickAction('compare')}
          className={`whitespace-nowrap px-2.5 py-1 text-xs rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 border ${
            isDark 
              ? 'text-[#A7B4C8] hover:text-white bg-[#081426] hover:bg-[#0B1F3A] border-[#172B46]' 
              : 'text-[#555555] hover:text-[#111111] bg-[#F7F7F7] hover:bg-[#EEEEEE] border-[#E5E5E5]'
          }`}
        >
          <GitCompare className="w-3 h-3 text-[#a855f7]" />
          <span>Compare Clauses</span>
        </button>
      </div>

      {/* 2. Chat Area */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 space-y-4 transition-colors"
        style={{
          backgroundColor: isDark ? '#05070D' : '#FFFFFF'
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSpeaking = playingMessageId === msg.id;

          return (
            <div 
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div 
                className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'rounded-tr-xs text-white shadow-xs'
                    : `rounded-tl-xs shadow-xs ${isDark ? 'text-white' : 'text-[#111111]'}`
                }`}
                style={
                  isUser
                    ? {
                        backgroundColor: isDark ? '#0B1F3A' : '#1677FF',
                        border: `1px solid ${isDark ? '#172B46' : '#1677FF'}`,
                        color: '#FFFFFF'
                      }
                    : {
                        backgroundColor: isDark ? '#081426' : '#F7F7F7',
                        border: `1px solid ${isDark ? '#172B46' : '#E5E5E5'}`,
                        color: isDark ? '#FFFFFF' : '#111111'
                      }
                }
              >
                {/* Role Header for AI messages */}
                {!isUser && (
                  <div className={`flex items-center justify-between pb-1.5 mb-2 border-b ${isDark ? 'border-[#172B46]/60' : 'border-[#E5E5E5]'}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
                      <span className={`text-xs font-semibold tracking-tight font-['Space_Grotesk'] ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                        Clear Clause AI
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.content)}
                        title={isSpeaking ? 'Stop Audio' : 'Listen with Audio'}
                        className={`p-1 rounded text-xs transition cursor-pointer ${
                          isSpeaking 
                            ? 'text-[#2F8CFF] bg-[#0B1F3A]' 
                            : isDark 
                              ? 'text-[#A7B4C8] hover:text-white hover:bg-[#0B1F3A]'
                              : 'text-[#555555] hover:text-[#111111] hover:bg-[#EEEEEE]'
                        }`}
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        title="Copy to Clipboard"
                        className={`p-1 rounded text-xs transition cursor-pointer ${
                          isDark 
                            ? 'text-[#A7B4C8] hover:text-white hover:bg-[#0B1F3A]' 
                            : 'text-[#555555] hover:text-[#111111] hover:bg-[#EEEEEE]'
                        }`}
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Formatted Message Body with Markdown */}
                <div className={`chat-markdown-content space-y-2 text-[13.5px] leading-relaxed ${isDark ? 'text-[#FFFFFF]' : 'text-[#111111]'}`}>
                  <Markdown
                    components={{
                      h1: ({ children }) => <h1 className={`text-base font-bold mt-2 mb-1 ${isDark ? 'text-white' : 'text-[#111111]'}`}>{children}</h1>,
                      h2: ({ children }) => <h2 className={`text-sm font-bold mt-2 mb-1 ${isDark ? 'text-white' : 'text-[#111111]'}`}>{children}</h2>,
                      h3: ({ children }) => <h3 className={`text-xs font-bold uppercase tracking-wider mt-2 mb-1 ${isDark ? 'text-[#2F8CFF]' : 'text-[#1677FF]'}`}>{children}</h3>,
                      p: ({ children }) => <p className={`mb-2 leading-relaxed ${isDark ? 'text-[#FFFFFF]' : 'text-[#111111]'}`}>{children}</p>,
                      ul: ({ children }) => <ul className={`list-disc pl-4 space-y-1 mb-2 ${isDark ? 'text-[#FFFFFF]' : 'text-[#111111]'}`}>{children}</ul>,
                      ol: ({ children }) => <ol className={`list-decimal pl-4 space-y-1 mb-2 ${isDark ? 'text-[#FFFFFF]' : 'text-[#111111]'}`}>{children}</ol>,
                      li: ({ children }) => <li className={`leading-relaxed ${isDark ? 'text-[#FFFFFF]' : 'text-[#111111]'}`}>{children}</li>,
                      strong: ({ children }) => <strong className={`font-semibold ${isDark ? 'text-white' : 'text-[#111111]'}`}>{children}</strong>,
                      code: ({ children }) => (
                        <code className={`px-1.5 py-0.5 rounded text-xs font-mono border ${
                          isDark 
                            ? 'bg-[#05070D] text-[#2F8CFF] border-[#172B46]' 
                            : 'bg-[#EEEEEE] text-[#1677FF] border-[#E5E5E5]'
                        }`}>
                          {children}
                        </code>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className={`border-l-2 border-[#1677FF] pl-3 my-2 text-xs italic py-1 rounded-r ${
                          isDark 
                            ? 'text-[#A7B4C8] bg-[#05070D]/50' 
                            : 'text-[#555555] bg-[#EEEEEE]/50'
                        }`}>
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {msg.content}
                  </Markdown>
                </div>

                <div className={`mt-1.5 text-[10px] text-right ${
                  isUser 
                    ? 'text-white/80' 
                    : isDark ? 'text-[#A7B4C8]/70' : 'text-[#737373]'
                }`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading / Thinking Indicator */}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div 
              className="rounded-2xl rounded-tl-xs px-4 py-3 text-sm flex items-center gap-3 transition-colors shadow-xs"
              style={{
                backgroundColor: isDark ? '#081426' : '#F7F7F7',
                border: `1px solid ${isDark ? '#172B46' : '#E5E5E5'}`
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#2F8CFF] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className={`text-xs font-medium ${isDark ? 'text-[#A7B4C8]' : 'text-[#555555]'}`}>
                Clear Clause AI is analyzing clause...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input Area */}
      <div 
        className="p-3 sm:p-4 border-t relative transition-colors"
        style={{
          backgroundColor: isDark ? '#081426' : '#F7F7F7',
          borderColor: isDark ? '#172B46' : '#E5E5E5'
        }}
      >
        <div 
          className="rounded-xl border flex flex-col focus-within:border-[#1677FF] transition-all"
          style={{
            backgroundColor: isDark ? '#05070D' : '#FFFFFF',
            borderColor: isDark ? '#172B46' : '#E5E5E5'
          }}
        >
          <textarea
            ref={textareaRef}
            id="chatbot-input-field"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={isExpanded ? 3 : 2}
            placeholder="Ask Clear Clause about a legal clause... (e.g. What does this termination clause mean?)"
            className={`w-full bg-transparent px-3.5 py-2.5 text-sm focus:outline-none resize-none leading-relaxed ${
              isDark 
                ? 'text-white placeholder-[#A7B4C8]/60' 
                : 'text-[#111111] placeholder-[#888888]'
            }`}
          />

          <div className={`px-3 py-2 flex items-center justify-between border-t ${
            isDark ? 'border-[#172B46]/60' : 'border-[#E5E5E5]'
          }`}>
            <div className={`flex items-center gap-2 text-[11px] ${
              isDark ? 'text-[#A7B4C8]' : 'text-[#737373]'
            }`}>
              <span className="hidden sm:inline">Enter to send, Shift+Enter for new line</span>
            </div>

            <div className="flex items-center gap-2">
              {inputMessage.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setInputMessage('')}
                  className={`text-xs px-2 py-1 rounded transition cursor-pointer ${
                    isDark ? 'text-[#A7B4C8] hover:text-white' : 'text-[#555555] hover:text-[#111111]'
                  }`}
                >
                  Clear
                </button>
              )}

              <button
                id="chatbot-send-btn"
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition cursor-pointer shadow-sm ${
                  !inputMessage.trim() || isLoading
                    ? isDark ? 'opacity-40 cursor-not-allowed bg-[#0B1F3A]' : 'opacity-40 cursor-not-allowed bg-[#E5E5E5] text-[#888888]'
                    : 'bg-[#1677FF] hover:bg-[#2F8CFF] active:scale-95'
                }`}
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className={`mt-2 text-center text-[10px] flex items-center justify-center gap-1 ${
          isDark ? 'text-[#A7B4C8]/70' : 'text-[#737373]'
        }`}>
          <Info className="w-3 h-3 text-[#1677FF]" />
          <span>Clear Clause AI provides educational explanations and is not formal legal counsel.</span>
        </div>
      </div>
    </div>
  );
};
