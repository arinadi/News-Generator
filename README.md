# News Generator AI

![News Generator](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-19-61dafb) ![Gemini](https://img.shields.io/badge/Google-Gemini-4285f4)

Transform your raw content into professional news articles with AI-powered generation using Google Gemini.

## ✨ Features

- 📝 **Multiple Input Methods**: Paste text directly or upload files (TXT, PDF, DOC, DOCX)
- 🎯 **Smart Title Generation**: Get 3 AI-generated title options to choose from
- ⚙️ **Customizable Settings**: Configure language, tone, date format, and word count
- 🌐 **Multi-language Support**: Generate articles in 7+ languages
- 📋 **Easy Export**: Copy, download, print, or email generated articles
- 🎨 **Modern UI**: Beautiful, responsive design with glassmorphism effects
- 🔄 **Regeneration**: Don't like the result? Regenerate with one click

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
   - Provide additional background information
   - Use quick templates for common scenarios

3. **Configure Settings**:
   - Choose your language
   - Select the tone (formal, casual, professional, etc.)
   - Pick a date format
   - Set minimum word count

4. **Generate Titles**:
   - Click "Generate Title Options"
   - Choose from 3 AI-generated titles
   - Regenerate if needed

5. **Generate Article**:
   - Click "Generate Full Article"
   - Review the generated content
   - Copy, export, or regenerate as needed

## 🛠️ Technology Stack

- **Frontend**: React 19 (via importmaps - no build process!)
- **Styling**: Tailwind CSS + Custom CSS
- **AI Engine**: Google Gemini API (gemini-1.5-flash-latest)
- **File Processing**: 
  - PDF.js for PDF files
  - Mammoth.js for Word documents

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

**Made with ❤️ using React 19 and Google Gemini AI**
