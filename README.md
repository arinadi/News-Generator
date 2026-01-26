# The News Generator AI
## 📰 Kuli Tinta AI - Expert SEO Journalism

![News Generator](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-19-61dafb) ![Gemini](https://img.shields.io/badge/Google-Gemini-4285f4) ![Vibescoding](https://img.shields.io/badge/%23-vibescoding-blueviolet)

Transform your raw content into professional, SEO-optimized news articles with an AI-powered expert journalist agent. Built with a full **#vibescoding** approach using Google Gemini and Claude.

## ✨ Key Features

- 📰 **Premium Newspaper Aesthetic**: Pro-grade typography with bold headlines, glassmorphism effects, and a layout designed for readability.
- 🎯 **Expert AI Agent**: Acts as an Expert SEO Journalist and News Editor (affectionately named **Kuli Tinta AI**), ensuring high factual density and professional framing.
- 🔄 **Precision Regeneration**: Independently regenerate titles, the article body, or hashtags without losing your progress.
- ⚡ **Optimized 1x API Calls**: Generates everything (multiple titles, body, hashtags) in a single efficient request.
- ⚙️ **Dynamic News Angles**: Choose from Straight News, Public Impact, Accountability, or Human Interest to frame your story.
- 🔗 **Smart URL Sync**: Your configuration (language, angle, goal, etc.) is automatically synced to the URL for easy bookmarking.
- ⏳ **History Sidebar**: Automatically saves your drafts to browser local storage so you never lose your work.
- 📝 **Multiple Input Methods**: Paste text directly or upload files (TXT, PDF, DOC, DOCX) for processing.
- 📤 **Complete Export Logic**: Copy, download (TXT), print, or email articles with standardized formatting.

## 🚀 Quick Start

### Prerequisites

1. **Node.js** - Version 18 or higher
2. **Google Gemini API Key** - Get yours from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. **Configure API Key:**
   Open the application in your browser and click "Configure" in the **AI Configuration** section. Paste your Gemini API Key there (stored securely in your browser's local storage).

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173` (or the port shown in your terminal)

## 📖 How to Use

1. **Input Content**: Paste raw text or upload a document (PDF/DOCX/TXT).
2. **Configure Context**: Add background info or specific instructions to guide the AI.
3. **Set the Angle**: Choose how you want the story framed (e.g., Straight News, Public Impact).
4. **Generate**: Click "Generate Professional News Article" to see the magic happen.
5. **Refine**: Pick your favorite titles, or regenerate specific sections if they aren't quite right.
6. **Export**: Use the action buttons to copy, print, or download your masterpiece.

## 🛠️ Technology Stack

- **Core**: React 19 (Functional Components & Hooks)
- **Build**: Vite (Fast HMR)
- **Styling**: Tailwind CSS + Custom Design System
- **AI**: Google Gemini API (`gemini-3-flash-preview` or `gemini-3-pro-preview`)
- **Libraries**: 
  - [PDF.js](https://mozilla.github.io/pdf.js/) & [Mammoth.js](https://github.com/mwilliamson/mammoth.js) (Client-side file parsing)
  - Browser Local Storage (Persistence)

## 📁 Project Structure

```
NewsGenerator/
├── app.jsx                 # Main React Application
├── config.js               # App & AI configurations
├── services/
│   └── geminiService.js    # AI Agent logic & API integration
├── components/
│   ├── HistorySidebar.jsx  # Local storage draft management
│   ├── InputForm.jsx       # File & text input handling
│   ├── ArticleSettings.jsx # Configuration UI (Angle, Style, Goal)
│   └── ArticleOutput.jsx   # Results display & export tools
├── utils/
│   ├── storage.js          # History persistence logic
│   └── fileReader.js       # PDF/Word/Text parsing utilities
└── styles.css              # Custom newspaper-themed styling
```

## ⚙️ Configuration Options

### News Angles
- **Straight News**: Facts only. No emotional framing.
- **Public Impact**: Emphasizes how the news affects the public.
- **Accountability**: Highlights responsibility and official responses.
- **Human Interest**: Focuses on the human stories behind the facts.

### Optimization Goals
- **Google News**: Prioritizes timeliness, authority, and factual density.
- **SEO Ranking**: Focuses on keyword integration and coverage.
- **Social Virality**: Optimizes for shareability and hooks.
- **Informational**: Prioritizes clarity and depth.

## 🔒 Security Notes

⚠️ **Important**: This is a client-side application. For production use, it is recommended to implement a backend proxy to protect your API keys.

## 💻 #vibescoding Origin

This project was developed using a **"full vibescoding"** approach—pairing human creativity with the power of Gemini and Claude to build a premium application rapidly through iterative, natural language instruction.

---
**Created with ❤️ by [@arinadi.id](https://github.com/arinadi)**
