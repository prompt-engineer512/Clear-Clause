import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Workflow, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Moon, 
  Sun,
  Globe, 
  Database, 
  Code,
  Save
} from 'lucide-react';
import { ApiService } from '../services/api';
import { LANGUAGES } from '../utils/translations';
import { useTheme } from '../context/ThemeContext';

interface SettingsPageProps {
  user: { email: string; name: string } | null;
  onClearHistory: () => void;
  onSaveNotification?: (msg: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onClearHistory,
  onSaveNotification
}) => {
  const { theme: currentTheme, setTheme, isDark } = useTheme();
  const [n8nUrl, setN8nUrl] = useState(() => ApiService.getWebhookUrl());
  const [testStatus, setTestStatus] = useState<{
    testing: boolean;
    success?: boolean;
    message?: string;
  }>({ testing: false });

  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveN8n = (e: React.FormEvent) => {
    e.preventDefault();
    ApiService.setWebhookUrl(n8nUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    if (onSaveNotification) onSaveNotification('Settings saved successfully');
  };

  const handleTestConnection = async () => {
    setTestStatus({ testing: true });
    const result = await ApiService.testN8nConnection(n8nUrl);
    setTestStatus({
      testing: false,
      success: result.success,
      message: result.message
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181b1f] border border-[#2a2e35] text-xs text-[#94a3b8] mb-2">
          <SettingsIcon className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span>System & Workflow Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Settings & Integrations
        </h1>
        <p className="text-sm text-[#94a3b8] mt-1">
          Configure your n8n AI legal pipeline, language preferences, and data options.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* SECTION 1: n8n Backend Workflow Integration */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
              <Workflow className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                n8n Backend Workflow Integration
              </h3>
              <p className="text-xs text-[#94a3b8]">
                Connect your production n8n automation webhook for AI document processing
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveN8n} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 uppercase tracking-wider">
                n8n Webhook URL (Production / Test)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  id="n8n-webhook-url-input"
                  value={n8nUrl}
                  onChange={(e) => setN8nUrl(e.target.value)}
                  placeholder="https://your-n8n-instance.com/webhook/clearclause-analysis"
                  className="flex-1 px-3.5 py-2 rounded-lg bg-[#181b1f] border border-[#2a2e35] text-xs font-mono text-[#f1f5f9] placeholder:text-slate-600 focus:outline-none focus:border-[#3b82f6]"
                />
                <button
                  type="button"
                  id="test-n8n-connection-btn"
                  onClick={handleTestConnection}
                  disabled={testStatus.testing || !n8nUrl.trim()}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-[#cbd5e1] bg-[#181b1f] hover:bg-[#20242c] border border-[#2a2e35] disabled:opacity-50 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testStatus.testing ? 'animate-spin text-[#3b82f6]' : ''}`} />
                  <span>{testStatus.testing ? 'Testing...' : 'Test Connection'}</span>
                </button>
                <button
                  type="submit"
                  id="save-n8n-url-btn"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#3b82f6] hover:bg-blue-600 transition shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save URL</span>
                </button>
              </div>
            </div>

            {/* Test Connection Output Feedback */}
            {testStatus.message && (
              <div className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                testStatus.success 
                  ? 'bg-[rgba(16,185,129,0.1)] border-emerald-500/30 text-[#10b981]'
                  : 'bg-[rgba(245,158,11,0.1)] border-amber-500/30 text-[#f59e0b]'
              }`}>
                {testStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                )}
                <span>{testStatus.message}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/30 text-[#3b82f6] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3b82f6]" />
                <span>Webhook URL configuration updated successfully.</span>
              </div>
            )}

            {/* Integration Payload Notes */}
            <div className="pt-3 border-t border-[#2a2e35]">
              <h4 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span>Webhook Payload Specification</span>
              </h4>
              <p className="text-xs text-[#94a3b8] leading-relaxed mb-2">
                When you submit an analysis in ClearClause, a JSON POST request is sent to your webhook:
              </p>
              <pre className="p-3 rounded-lg bg-[#121417] border border-[#2a2e35] text-[11px] font-mono text-[#3b82f6] overflow-x-auto">
{`{
  "url": "https://example.com/terms",
  "documentText": "Full policy content string...",
  "documentName": "TermsOfService.pdf",
  "requestedAt": "2026-08-31T12:00:00.000Z"
}`}
              </pre>
            </div>
          </form>
        </div>

        {/* SECTION 2: Appearance & Preferences */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Appearance & Theme
              </h3>
              <p className="text-xs text-[#94a3b8]">
                Switch between high-contrast dark theme, crisp light theme, or follow system preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            {[
              { 
                id: 'dark' as const, 
                label: 'Dark Mode', 
                desc: 'Deep black & charcoal (#0A0A0A) for focused, comfortable legal review', 
                icon: Moon 
              },
              { 
                id: 'light' as const, 
                label: 'Light Mode', 
                desc: 'Crisp white (#FFFFFF) with refined slate borders & maximum document legibility', 
                icon: Sun 
              }
            ].map((themeOpt) => {
              const IconComp = themeOpt.icon;
              const isSelected = currentTheme === themeOpt.id;

              return (
                <div
                  key={themeOpt.id}
                  id={`settings-theme-${themeOpt.id}`}
                  onClick={() => setTheme(themeOpt.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#181b1f] border-[#3b82f6] text-white ring-1 ring-[#3b82f6]'
                      : 'bg-[#181b1f] border-[#2a2e35] text-[#94a3b8] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-[#3b82f6]' : 'text-[#94a3b8]'}`} />
                      <span className="text-xs font-semibold text-[#f1f5f9]">{themeOpt.label}</span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3b82f6]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#94a3b8] leading-tight">
                    {themeOpt.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: Language & Default Region */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Default Analysis Language
              </h3>
              <p className="text-xs text-[#94a3b8]">
                Target language for AI-simplified explanations and speech output
              </p>
            </div>
          </div>

          <div className="max-w-xs">
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#181b1f] border border-[#2a2e35] text-xs text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6] cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#181b1f] text-[#f1f5f9]">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SECTION 4: Data & History Storage */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[rgba(239,68,68,0.1)] border border-red-500/20 flex items-center justify-center text-[#ef4444]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Local History Storage
              </h3>
              <p className="text-xs text-[#94a3b8]">
                All document summaries are stored privately in your browser session
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClearHistory}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#ef4444] bg-[rgba(239,68,68,0.1)] hover:bg-[rgba(239,68,68,0.2)] border border-red-500/30 transition cursor-pointer"
          >
            Clear Stored History
          </button>
        </div>

      </div>

    </div>
  );
};
