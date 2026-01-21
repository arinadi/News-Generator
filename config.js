// Configuration for News Generator Application
export const CONFIG = {
  // Google Gemini API Configuration
  // Priority: 1. Environment Variable, 2. Hardcoded (for development)
  // For production, set VITE_GEMINI_API_KEY in your hosting platform
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE',
  GEMINI_MODEL: 'gemini-flash-latest',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models',

  // Language Options
  LANGUAGES: [
    { value: 'id', label: 'Bahasa Indonesia' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ja', label: '日本語' },
    { value: 'zh', label: '中文' },
  ],

  // Tone Options
  TONES: [
    { value: 'positive', label: 'Positive' },
    { value: 'negative', label: 'Negative' },
    { value: 'neutral', label: 'Neutral' },
  ],

  // Style Options
  STYLES: [
    { value: 'formal', label: 'Formal' },
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'conversational', label: 'Conversational' },
  ],

  // Date Format Options
  DATE_FORMATS: [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (21/01/2026)' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (01/21/2026)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-01-21)' },
    { value: 'DD MMMM YYYY', label: 'DD MMMM YYYY (21 January 2026)' },
    { value: 'MMMM DD, YYYY', label: 'MMMM DD, YYYY (January 21, 2026)' },
  ],

  // Goal Options
  GOALS: [
    { value: 'google_news', label: 'Google News Optimization' },
    { value: 'seo_ranking', label: 'General SEO Ranking' },
    { value: 'viral_social', label: 'Social Media Virality' },
    { value: 'informational', label: 'Informational/Educational' },
  ],

  // Default Settings
  DEFAULTS: {
    language: 'id',
    tone: 'neutral',
    style: 'professional',
    goal: 'google_news',
    dateFormat: 'DD/MM/YYYY',
    minWordCount: 300,
    maxWordCount: 2000,
  },

  // File Upload Settings
  FILE_UPLOAD: {
    maxSizeMB: 10,
    acceptedTypes: ['.txt', '.pdf', '.doc', '.docx'],
    acceptedMimeTypes: [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
};
