# News Generator AI - Documentation

## Overview

News Generator AI is a modern web application that transforms raw content into professional news articles using Google's Gemini AI. Built with React 19 and Tailwind CSS, it provides an intuitive interface for content creators, journalists, and writers to quickly generate high-quality articles.

## Features

### 1. Multiple Input Methods
- **Text Input**: Direct paste of raw content
- **File Upload**: Support for TXT, PDF, DOC, and DOCX files
- **Drag & Drop**: Easy file upload with drag-and-drop interface
- **File Validation**: Automatic validation of file size (max 10MB) and type

### 2. AI-Powered Title Generation
- Generate 3 unique title options based on your content
- Titles are contextually relevant and engaging
- One-click regeneration for different options
- Visual selection interface with radio buttons

### 3. Customizable Article Settings
- **Language**: 7+ languages supported (Indonesian, English, Spanish, French, German, Japanese, Chinese)
- **Tone**: 6 tone options (Formal, Professional, Casual, Friendly, Authoritative, Conversational)
- **Date Format**: 5 different date format options
- **Word Count**: Adjustable minimum word count (100-2000 words)

### 4. Context Configuration
- Add additional background information
- Quick templates for common scenarios:
  - Press Release
  - Event Coverage
  - Interview
  - Research Report
- Collapsible section to save space

### 5. Article Output & Export
- **Copy to Clipboard**: One-click copy functionality
- **Export**: Download as text file
- **Print**: Print-friendly formatting
- **Email**: Share via email
- **Word Count**: Real-time word and paragraph count
- **Regeneration**: Generate alternative versions

## Technology Stack

### Frontend Framework
- **React 19**: Latest version with concurrent features
- **No Build Process**: Uses importmaps for direct browser module loading
- **Modern JavaScript**: ES6+ features with native modules

### Styling
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **Custom CSS**: Premium design system with:
  - CSS Variables for theming
  - Glassmorphism effects
  - Smooth animations
  - Dark mode support

### AI Integration
- **Google Gemini API**: gemini-3-flash-preview model
- **Retry Logic**: Automatic retry with exponential backoff
- **Error Handling**: Comprehensive error messages
- **Rate Limiting**: Handles API rate limits gracefully

### File Processing
- **PDF.js**: Extract text from PDF files
- **Mammoth.js**: Extract text from Word documents
- **Native FileReader**: Handle text files

## Project Structure

```
NewsGenerator/
├── index.html                 # Main HTML entry point
├── app.jsx                    # Main React application
├── config.js                  # Configuration file
├── styles.css                 # Custom styles
├── README.md                  # User documentation
├── Documentation.md           # Technical documentation (this file)
├── package.json               # NPM configuration
│
├── components/                # React components
│   ├── InputForm.jsx         # Input handling component
│   ├── ContextConfig.jsx     # Context configuration
│   ├── ArticleSettings.jsx   # Settings configuration
│   ├── TitleSelector.jsx     # Title selection interface
│   └── ArticleOutput.jsx     # Article display & export
│
├── services/                  # Business logic
│   └── geminiService.js      # Gemini API integration
│
└── utils/                     # Utility functions
    └── fileReader.js         # File processing utilities
```

## Setup Instructions

### 1. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure API Key

The application handles API keys securely via the user interface and browser local storage.

1.  **Open the App**: Run the development server and open it in your browser.
2.  **Access Config**: Click the **"Configure"** button in the **AI Configuration** card at the top.
3.  **Enter Key**: Paste your Google Gemini API Key.
4.  **Save**: Click **"Save Configuration"**. Your key will be saved in your browser's local storage and used for all subsequent requests.

> **💡 Privacy Note:** Your API key never leaves your browser (except to communicate with Google's API) and is never stored on a server.


### 3. Run the Application

#### Development:
```bash
npm install
npm run dev
```

#### Production Build:
```bash
npm run build
npm run preview
```

## Usage Guide

### Step 1: Input Content

**Method A: Text Input**
1. Type or paste your raw content in the text area
2. The character count updates in real-time

**Method B: File Upload**
1. Click the upload area or drag & drop a file
2. Supported formats: TXT, PDF, DOC, DOCX
3. Maximum file size: 10MB
4. The file content will be automatically extracted

### Step 2: Add Context (Optional)

1. Click to expand the "Additional Context" section
2. Choose a quick template or write custom context
3. This helps the AI understand the purpose and audience

### Step 3: Configure Settings

1. **Language**: Select the output language
2. **Tone**: Choose the writing style
3. **Date Format**: Pick your preferred date format
4. **Word Count**: Adjust the minimum word count slider

### Step 4: Generate Titles

1. Click "Generate Title Options"
2. Wait for AI to generate 3 title options
3. Review the options and select your favorite
4. Click "Regenerate" if you want different options

### Step 5: Generate Article

1. Click "Generate Full Article"
2. Wait for the AI to write the complete article
3. Review the generated content
4. Use the action buttons:
   - **Copy**: Copy to clipboard
   - **Regenerate**: Generate a new version
   - **Export**: Download as text file
   - **Print**: Print the article
   - **Email**: Share via email

## API Integration Details

### Gemini API Configuration

```javascript
{
  model: 'gemini-3-flash-preview',
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192
}
```

### Error Handling

The application handles various API errors:
- **Invalid API Key**: Clear error message with link to get key
- **Rate Limiting**: Automatic retry with exponential backoff
- **Network Errors**: Retry logic with user feedback
- **Invalid Response**: Graceful error handling

### Retry Logic

- **Initial Retry**: 1 second delay
- **Second Retry**: 2 seconds delay
- **Third Retry**: 4 seconds delay
- **Maximum Retries**: 3 attempts

## Design System

### Color Palette

**Primary Colors** (Blue)
- 50: #f0f9ff
- 500: #0ea5e9
- 600: #0284c7

**Accent Colors** (Purple)
- 50: #fdf4ff
- 500: #d946ef
- 600: #c026d3

**Neutral Colors**
- Gray scale from 50 to 900

### Typography

- **Font Family**: Inter (Google Fonts)
- **Fallback**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)

### Spacing System

- XS: 0.5rem (8px)
- SM: 0.75rem (12px)
- MD: 1rem (16px)
- LG: 1.5rem (24px)
- XL: 2rem (32px)
- 2XL: 3rem (48px)

### Border Radius

- SM: 0.375rem
- MD: 0.5rem
- LG: 0.75rem
- XL: 1rem
- 2XL: 1.5rem

## Security Considerations

### API Key Security

⚠️ **Warning**: This is a client-side application. The API key is visible in the browser.

**For Production:**
1. Create a backend API proxy
2. Store API key in environment variables
3. Implement rate limiting
4. Add authentication

**API Key Restrictions:**
1. Go to Google Cloud Console
2. Set HTTP referrer restrictions
3. Limit to your domain
4. Set usage quotas

### Content Security

- All user input is sanitized
- No server-side storage of content
- Files are processed client-side only
- No data is sent to external servers (except Gemini API)

## Browser Compatibility

### Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Required Features

- ES6 Modules support
- Fetch API
- FileReader API
- Clipboard API
- CSS Grid & Flexbox

## Performance Optimization

### Loading Strategy

1. **HTML First**: Minimal HTML loads immediately
2. **CSS**: Tailwind CSS loaded from CDN (cached)
3. **React**: Loaded via importmaps (cached by browser)
4. **Libraries**: PDF.js and Mammoth.js loaded from CDN

### File Processing

- Files are processed in chunks for large documents
- Progress indicators for long operations
- Async/await for non-blocking operations

## Troubleshooting

### Common Issues

**1. API Key Error**
- Verify API key is correct in `config.js`
- Check API key is enabled in Google Cloud Console
- Ensure billing is enabled (if required)

**2. File Upload Fails**
- Check file size (max 10MB)
- Verify file type is supported
- Ensure browser supports FileReader API

**3. PDF Reading Fails**
- Check if PDF.js loaded correctly
- Try a different PDF file
- Check browser console for errors

**4. Titles Not Generating**
- Verify input text is not empty
- Check API key is valid
- Check browser console for API errors

**5. Styling Issues**
- Clear browser cache
- Check if Tailwind CSS loaded
- Verify custom CSS file loaded

## Future Enhancements

### Planned Features

- [ ] Backend API proxy for secure API key storage
- [ ] User authentication and saved articles
- [ ] Multiple article formats (blog, press release, etc.)
- [ ] SEO optimization suggestions
- [ ] Plagiarism checking
- [ ] Multi-article batch generation
- [ ] Article templates library
- [ ] Collaboration features
- [ ] Analytics dashboard

### Potential Improvements

- Image generation for articles
- Social media post generation
- Automatic fact-checking
- Citation management
- Version history
- A/B testing for titles

## Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- Use ES6+ features
- Follow React best practices
- Comment complex logic
- Use meaningful variable names
- Keep functions small and focused

## License

ISC License - See LICENSE file for details

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Powered by**: Google Gemini AI & React 19
