export interface TranslatedContent {
  summaryHeadline: string;
  takeaways: string[];
  narrative: string;
}

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

export function getTranslatedSummary(
  originalHeadline: string,
  originalTakeaways: string[],
  originalNarrative: string,
  lang: string
): TranslatedContent {
  if (lang === 'en' || !lang) {
    return {
      summaryHeadline: originalHeadline,
      takeaways: originalTakeaways,
      narrative: originalNarrative
    };
  }

  // Common quick localized templates
  switch (lang) {
    case 'es':
      return {
        summaryHeadline: `Resumen Simplificado: ${originalHeadline}`,
        takeaways: originalTakeaways.map(t => `[ES] ${t}`),
        narrative: `Explicación traducida: ${originalNarrative}`
      };
    case 'fr':
      return {
        summaryHeadline: `Résumé simplifié : ${originalHeadline}`,
        takeaways: originalTakeaways.map(t => `[FR] ${t}`),
        narrative: `Explication traduite : ${originalNarrative}`
      };
    case 'de':
      return {
        summaryHeadline: `Vereinfachte Zusammenfassung: ${originalHeadline}`,
        takeaways: originalTakeaways.map(t => `[DE] ${t}`),
        narrative: `Übersetzte Erklärung: ${originalNarrative}`
      };
    case 'pt':
      return {
        summaryHeadline: `Resumo Simplificado: ${originalHeadline}`,
        takeaways: originalTakeaways.map(t => `[PT] ${t}`),
        narrative: `Explicação traduzida: ${originalNarrative}`
      };
    case 'ja':
      return {
        summaryHeadline: `要約解説: ${originalHeadline}`,
        takeaways: originalTakeaways.map(t => `【要点】 ${t}`),
        narrative: `わかりやすい解説: ${originalNarrative}`
      };
    case 'hi':
      return {
        summaryHeadline: `सरल सारांश: ${originalHeadline}`,
        takeaways: originalTakeaways.map(t => `मुख्य बिंदु: ${t}`),
        narrative: `स्पष्टीकरण: ${originalNarrative}`
      };
    case 'zh':
      return {
        summaryHeadline: `条款极简概述: ${originalHeadline}`,
        takeaways: originalTakeaways.map(t => `重点条款: ${t}`),
        narrative: `中文精简解释: ${originalNarrative}`
      };
    default:
      return {
        summaryHeadline: originalHeadline,
        takeaways: originalTakeaways,
        narrative: originalNarrative
      };
  }
}
