// Configuration for News Generator Application
export const CONFIG = {
  // Google Gemini API Configuration is now handled via the UI (stored in localStorage)
  GEMINI_MODEL: 'gemini-3-flash-preview',
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

  // News Angles (Replacing Tones)
  ANGLES: [
    { value: 'straight', label: 'Straight News', description: 'Report facts only. No emotional framing or value judgement.' },
    { value: 'impact', label: 'Public Impact', description: 'Emphasize public impact strictly using stated facts.' },
    { value: 'accountability', label: 'Accountability', description: 'Highlight responsibility, process, and official responses.' },
    { value: 'human_interest', label: 'Human Interest', description: 'Focus on human aspects based only on quoted sources.' },
  ],

  // Style Options
  STYLES: [
    { value: 'formal', label: 'Formal', description: 'Sophisticated and academic. For high-level analysis.' },
    { value: 'professional', label: 'Professional', description: 'Standard journalistic style. Direct and active.' },
    { value: 'casual', label: 'Casual', description: 'Conversational and relatable. Good for blogs.' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and inviting. Engaging for general audiences.' },
    { value: 'authoritative', label: 'Authoritative', description: 'Decisive and expert. Avoids hedging.' },
    { value: 'conversational', label: 'Conversational', description: 'Narrative and engaging. Focuses on flow.' },
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
    { value: 'google_news', label: 'Google News Optimization', description: 'Prioritizes timeliness, authority, and factual density.' },
    { value: 'seo_ranking', label: 'General SEO Ranking', description: 'Focuses on keyword integration and comprehensive coverage.' },
    { value: 'viral_social', label: 'Social Media Virality', description: 'Optimizes for shareability, hooks, and emotional engagement.' },
    { value: 'informational', label: 'Informational/Educational', description: 'Prioritizes clarity, depth, and ease of understanding.' },
  ],

  // Default Settings
  DEFAULTS: {
    language: 'id',
    angle: 'straight',
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
