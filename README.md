# News Generator AI

![News Generator](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-19-61dafb) ![Gemini](https://img.shields.io/badge/Google-Gemini-4285f4)

Transform your raw content into professional news articles with AI-powered generation using Google Gemini.

## ✨ Features

- 📰 **Premium Newspaper Aesthetic**: Standardized typography with bold headlines and professional layout
- 📝 **Multiple Input Methods**: Paste text directly or upload files (TXT, PDF, DOC, DOCX)
- 🎯 **Smart Title Generation**: Get multiple AI-generated title options automatically
- ⚙️ **Dynamic Instructions**: Tone, Style, and Goal settings now dynamically adjust AI system prompts for superior precision
- 🔗 **URL Settings Sync**: Your configuration is automatically saved in the URL—perfect for bookmarking or sharing presets
- 📋 **Complete Export Logic**: Copy, download, print, or email articles—now always including selected or fallback titles
- 🎨 **Modern & Neat UI**: Responsive design with clean card structures and focus on readability
- 🔄 **Precision Regeneration**: Independently regenerate the article body, titles, or hashtags with optimized 1x API calls

## 🚀 Quick Start

### Prerequisites

1. **Node.js** - Version 18 or higher
2. **Google Gemini API Key** - Get yours from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. **Setup Environment Variables:**

   Copy the example file:
   ```bash
   copy .env.example .env
   ```

   Edit `.env` and add your API key:
   ```env
   VITE_GEMINI_API_KEY=your-actual-api-key-here
   ```

   **Alternative:** You can also hardcode the API key in `config.js` (not recommended for production):
   ```javascript
   GEMINI_API_KEY: 'your-actual-api-key-here',
   ```

4. Start development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:8080`

> **📝 Note:** See [ENV_SETUP.md](ENV_SETUP.md) for detailed environment variables configuration.

## 📖 How to Use

1. **Input Content**: 
   - Paste your raw text directly, or
   - Upload a file (TXT, PDF, DOC, DOCX)

2. **Add Context** (Optional):
   - Provide additional background information or instructions

3. **Configure Settings**:
   - Choose language, tone, style, and date format
   - Set minimum word count and target optimization goal
   - *Note: Settings are automatically saved in the URL for easy access later*

4. **Generate Everything**:
   - Click "Generate Professional News Article" to create titles, body, and hashtags simultaneously (Optimized minimal API calls)

5. **Refine & Export**:
   - Select your favorite title (or export all of them)
   - Regenerate specific sections if needed
   - Use the standardized action buttons to Copy, Export, Print, or Email

## 🛠️ Technology Stack

- **Frontend**: React 19 (Modern functional components)
- **Build Tool**: Vite (Fast HMR and optimized builds)
- **Styling**: Tailwind CSS + Custom Typography System
- **AI Engine**: Google Gemini API (gemini-1.5-flash-latest)
- **Libraries**: 
  - PDF.js / Mammoth.js (File processing)
  - Lucide React (Iconography system)

## 📁 Project Structure

```
NewsGenerator/
├── index.html              # Main HTML entry point
├── app.jsx                 # Main React application
├── config.js               # Configuration (API key, settings)
├── styles.css              # Custom styles
├── components/
│   ├── InputForm.jsx       # File upload & text input
│   ├── ContextConfig.jsx   # Additional context configuration
│   ├── ArticleSettings.jsx # Language, tone, format settings
│   ├── TitleSelector.jsx   # Title selection interface
│   └── ArticleOutput.jsx   # Article display & export
├── services/
│   └── geminiService.js    # Google Gemini API integration
└── utils/
    └── fileReader.js       # File processing utilities
```

## ⚙️ Configuration Options

### Languages
- Bahasa Indonesia
- English
- Español
- Français
- Deutsch
- 日本語
- 中文

### Tones
- Formal
- Professional
- Casual
- Friendly
- Authoritative
- Conversational

### Date Formats
- DD/MM/YYYY
- MM/DD/YYYY
- YYYY-MM-DD
- DD MMMM YYYY
- MMMM DD, YYYY

### Word Count
- Range: 100 - 2000 words
- Default: 300 words

## 🔒 Security Notes

⚠️ **Important**: This is a client-side application, which means your API key will be visible in the browser. For production use:

1. Implement a backend proxy to hide your API key
2. Use API key restrictions in Google Cloud Console
3. Set up usage quotas and monitoring

## 🎨 Design Features

- **Glassmorphism Effects**: Modern, translucent card designs
- **Smooth Animations**: Fade-in, slide-in, and hover effects
- **Dark Mode Support**: Automatically adapts to system preferences
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Premium UI**: Vibrant gradients and modern typography

## 📝 License

ISC License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

---

**Created with 💻 #vibescoding using React 19 and Google Gemini AI**
