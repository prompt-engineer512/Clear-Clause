import React, { useState, useRef } from 'react';
import { 
  Link as LinkIcon, 
  UploadCloud, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  Shield, 
  EyeOff, 
  Clock, 
  X, 
  AlertCircle,
  Bot
} from 'lucide-react';

interface HomeHeroProps {
  onAnalyze: (data: { url?: string; documentText?: string; documentName?: string; language?: string }) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
  onOpenChat?: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onAnalyze,
  isLoading,
  errorMessage,
  onClearError,
  onOpenChat
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; text: string; size: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    onClearError();
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSelectedFile({
        name: file.name,
        text: content || '',
        size: file.size
      });
      setUrlInput('');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (selectedFile) {
      onAnalyze({
        documentText: selectedFile.text,
        documentName: selectedFile.name,
        language: 'en'
      });
    } else if (urlInput.trim()) {
      onAnalyze({
        url: urlInput.trim(),
        language: 'en'
      });
    }
  };

  const handleQuickSample = (sampleUrl: string) => {
    onClearError();
    setSelectedFile(null);
    setUrlInput(sampleUrl);
    onAnalyze({ url: sampleUrl, language: 'en' });
  };

  return (
    <div className="relative min-h-[calc(100vh-3.75rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      
      {/* Sleek Subtle Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        
        {/* Minimal Category Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181b1f] border border-[#2a2e35] text-xs font-medium text-[#94a3b8] mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span>AI-Powered Legal Clarity & Privacy Intelligence</span>
        </div>

        {/* Central Strong Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6 leading-tight">
          Understand What You're Agreeing To.
        </h1>

        {/* Central Input Box Area */}
        <form
          onSubmit={handleSubmit}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full bg-[#1c1f26] border ${
            isDragging 
              ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/20' 
              : 'border-[#2a2e35] hover:border-slate-600 focus-within:border-[#3b82f6] focus-within:ring-2 focus-within:ring-[#3b82f6]/15'
          } rounded-xl p-4 shadow-xl transition-all text-left`}
        >
          {/* File Selected Badge if any */}
          {selectedFile && (
            <div className="mb-3 flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#181b1f] border border-[#2a2e35]">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <FileText className="w-4 h-4 text-[#3b82f6] shrink-0" />
                <span className="text-xs font-medium text-[#f1f5f9] truncate">{selectedFile.name}</span>
                <span className="text-xs text-[#94a3b8] shrink-0">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                type="button"
                id="remove-file-btn"
                onClick={() => setSelectedFile(null)}
                className="p-1 rounded text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#2a2e35] transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Primary Text/URL Input */}
          <div className="flex items-center gap-3 px-1 py-1">
            <LinkIcon className="w-4 h-4 text-[#94a3b8] shrink-0" />
            <input
              id="tos-url-input"
              type="text"
              value={urlInput}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-1p-ignore="true"
              data-protonpass-ignore="true"
              data-lpignore="true"
              data-bwignore="true"
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (selectedFile) setSelectedFile(null);
                onClearError();
              }}
              placeholder={selectedFile ? "File attached for analysis" : "Paste a Terms & Conditions URL here... (e.g. spotify.com/legal)"}
              disabled={isLoading || !!selectedFile}
              className="w-full bg-transparent text-[#f1f5f9] placeholder:text-slate-500 text-sm sm:text-base focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Bottom Action Row: Upload Document on left, Analyze on right */}
          <div className="mt-3 pt-3 border-t border-[#2a2e35] flex items-center justify-between gap-3">
            
            {/* Upload Document Button */}
            <div className="flex items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.docx,.doc,.md"
                onChange={handleFileChange}
                className="hidden"
                id="tos-file-upload-input"
              />
              <button
                type="button"
                id="upload-doc-trigger-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#94a3b8] hover:text-[#f1f5f9] bg-[#181b1f] hover:bg-[#20242c] border border-[#2a2e35] transition disabled:opacity-50 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span>Upload Document</span>
              </button>
            </div>

            {/* Analyze Button */}
            <button
              type="submit"
              id="analyze-submit-btn"
              disabled={isLoading || (!urlInput.trim() && !selectedFile)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#3b82f6] hover:bg-blue-600 disabled:bg-[#181b1f] disabled:text-slate-600 disabled:border disabled:border-[#2a2e35] disabled:cursor-not-allowed transition shadow-sm cursor-pointer"
            >
              <span>Analyze</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Error Alert Display */}
        {errorMessage && (
          <div className="mt-4 w-full p-3 rounded-lg bg-red-950/30 border border-red-800/50 text-red-300 text-xs flex items-start gap-2.5 text-left animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Notice: </span>
              {errorMessage}
            </div>
            <button onClick={onClearError} className="text-red-400 hover:text-red-200 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick Sample Links for instant testing */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-[#94a3b8]">
          <span className="text-slate-500 font-medium">Quick Test:</span>
          {[
            { name: 'Spotify Terms', url: 'https://www.spotify.com/legal/end-user-agreement/' },
            { name: 'Discord Terms', url: 'https://discord.com/terms' },
            { name: 'TikTok Policy', url: 'https://www.tiktok.com/legal/terms-of-service' },
            { name: 'Netflix Terms', url: 'https://help.netflix.com/legal/termsofuse' },
          ].map((sample) => (
            <button
              key={sample.name}
              type="button"
              id={`quick-sample-${sample.name.toLowerCase().split(' ')[0]}`}
              onClick={() => handleQuickSample(sample.url)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-md bg-[#181b1f] hover:bg-[#20242c] border border-[#2a2e35] hover:border-slate-600 text-[#94a3b8] hover:text-[#3b82f6] transition text-xs cursor-pointer"
            >
              {sample.name}
            </button>
          ))}
        </div>

        {/* 4 Small Example Capabilities below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 w-full text-left">
          
          <div className="p-4 rounded-xl bg-[#1c1f26] border border-[#2a2e35] hover:border-slate-600 transition group">
            <div className="w-8 h-8 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6] mb-3">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Understand Privacy Risks</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Detect what personal data is logged, whether it's sold to data brokers, and who it's shared with.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1c1f26] border border-[#2a2e35] hover:border-slate-600 transition group">
            <div className="w-8 h-8 rounded-lg bg-[rgba(245,158,11,0.1)] border border-amber-500/20 flex items-center justify-center text-[#f59e0b] mb-3">
              <EyeOff className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Find Hidden Clauses</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Uncover sneaky auto-renewals, strict no-refund penalties, and binding arbitration waivers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1c1f26] border border-[#2a2e35] hover:border-slate-600 transition group">
            <div className="w-8 h-8 rounded-lg bg-[rgba(16,185,129,0.1)] border border-emerald-500/20 flex items-center justify-center text-[#10b981] mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Get a 1-Minute Summary</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Cut through dense legal jargon into plain, actionable bullet points in seconds.
            </p>
          </div>

          <div 
            onClick={onOpenChat}
            className={`p-4 rounded-xl bg-[#1c1f26] border border-[#2a2e35] hover:border-[#1677FF] transition group ${
              onOpenChat ? 'cursor-pointer' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#2F8CFF] group-hover:bg-[#1677FF] group-hover:text-white transition-colors mb-3">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-sm font-semibold text-white">Ask Clear Clause AI</h3>
              <span className="text-[9px] px-1 py-0.2 rounded bg-[#1677FF]/20 text-[#2F8CFF] font-semibold border border-[#1677FF]/30">NEW</span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Chat with our AI assistant to decode clauses, summarize contracts, and look up legal terms.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
