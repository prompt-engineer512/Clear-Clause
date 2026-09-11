import React, { useState } from 'react';
import { Clock, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import { TTSService } from '../utils/tts';

interface OneMinuteSummarySectionProps {
  summary: {
    headline: string;
    takeaways: string[];
    narrative: string;
  };
  companyName: string;
  currentLanguage: string;
}

export const OneMinuteSummarySection: React.FC<OneMinuteSummarySectionProps> = ({
  summary,
  companyName,
  currentLanguage
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const headline = summary?.headline || `${companyName} Terms Summary`;
  const narrative = summary?.narrative || 'Summary not provided.';
  const takeaways = Array.isArray(summary?.takeaways) ? summary.takeaways : [];

  const handleToggleAudio = () => {
    if (isPlaying) {
      TTSService.stop();
      setIsPlaying(false);
    } else {
      const fullTextToRead = `${headline}. Key points: ${takeaways.join('. ')}. Summary: ${narrative}`;
      
      const langCodeMap: Record<string, string> = {
        en: 'en-US',
        es: 'es-ES',
        fr: 'fr-FR',
        de: 'de-DE',
        ja: 'ja-JP',
        pt: 'pt-BR',
        hi: 'hi-IN',
        zh: 'zh-CN'
      };

      const speechLang = langCodeMap[currentLanguage] || 'en-US';

      const started = TTSService.speak(
        fullTextToRead,
        speechLang,
        1.0,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );

      if (started) {
        setIsPlaying(true);
      }
    }
  };

  return (
    <section id="section-summary" className="p-5 sm:p-6 rounded-xl bg-[#1c1f26] border border-[#2a2e35] border-l-4 border-l-[#3b82f6] shadow-sm">
      
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] border border-blue-500/20 flex items-center justify-center text-[#3b82f6]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              1-Minute Summary
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Executive plain-language brief for {companyName}
            </p>
          </div>
        </div>

        {/* Small Elegant Listen Button */}
        <button
          type="button"
          id="tts-listen-summary-btn"
          onClick={handleToggleAudio}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
            isPlaying
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse'
              : 'bg-[#181b1f] hover:bg-[#20242c] text-[#94a3b8] hover:text-[#f1f5f9] border-[#2a2e35]'
          }`}
          title="Listen to summary"
        >
          {isPlaying ? (
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
      </div>

      {/* Headline banner */}
      <div className="p-3.5 rounded-lg bg-[#181b1f] border border-[#2a2e35] mb-4">
        <p className="text-sm font-semibold text-[#f1f5f9] leading-relaxed">
          {headline}
        </p>
      </div>

      {/* Narrative paragraph */}
      <div className="mb-4">
        <p className="text-sm text-[#cbd5e1] leading-relaxed">
          {narrative}
        </p>
      </div>

      {/* Bulleted Takeaways */}
      {takeaways.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-[#2a2e35]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
            Key Takeaways
          </h4>
          <ul className="space-y-2">
            {takeaways.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </section>
  );
};
