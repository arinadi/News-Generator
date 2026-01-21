// Main App Component
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { InputForm } from './components/InputForm.jsx';
import { ContextConfig } from './components/ContextConfig.jsx';
import { ArticleSettings } from './components/ArticleSettings.jsx';
import { TitleSelector } from './components/TitleSelector.jsx';
import { ArticleOutput } from './components/ArticleOutput.jsx';
import { 
  generateNewsArticle, 
  regenerateTitles, 
  regenerateHashtags, 
  regenerateArticle, 
  validateAPIKey 
} from './services/geminiService.js';
import { CONFIG } from './config.js';

function App() {
  // State management
  const [inputText, setInputText] = useState('');
  const [context, setContext] = useState('');
  const [settings, setSettings] = useState(CONFIG.DEFAULTS);
  const [titles, setTitles] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [article, setArticle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegeneratingTitles, setIsRegeneratingTitles] = useState(false);
  const [isRegeneratingHashtags, setIsRegeneratingHashtags] = useState(false);
  const [isRegeneratingArticle, setIsRegeneratingArticle] = useState(false);
  const [error, setError] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState(true);

  // Validate API key on mount
  useEffect(() => {
    const validation = validateAPIKey();
    setApiKeyValid(validation.valid);
    if (!validation.valid) {
      setError(validation.message);
    }

    // Hide loading screen
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.remove();
        }, 500);
      }
    }, 500);
  }, []);

  // Handle input change
  const handleInputChange = (text) => {
    setInputText(text);
    resetState();
  };

  const resetState = () => {
    setTitles([]);
    setHashtags([]);
    setSelectedTitles([]);
    setArticle('');
    setError('');
  };

  // Handle file upload
  const handleFileUpload = (text, file) => {
    setInputText(text);
    resetState();
  };

  // Handle context change
  const handleContextChange = (newContext) => {
    setContext(newContext);
  };

  // Handle settings change
  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  // Unified Generate Content
  const handleGenerateAll = async () => {
    if (!inputText.trim()) {
      setError('Please provide input text first');
      return;
    }

    if (!apiKeyValid) {
      setError('Please configure your API key');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const result = await generateNewsArticle(
        inputText,
        settings.dateFormat,
        settings.tone,
        settings.style,
        settings.goal,
        settings.minWordCount,
        context,
        settings.language
      );
      
      setTitles(result.titles);
      setArticle(result.article);
      setHashtags(result.hashtags);
      setSelectedTitles([]); // Don't default check title option
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Independent Regeneration functions
  const handleRegenerateTitles = async () => {
    // Only regenerate titles that are NOT in selectedTitles
    const unselectedIndices = titles
      .map((t, i) => (selectedTitles.includes(t) ? -1 : i))
      .filter((i) => i !== -1);

    if (unselectedIndices.length === 0) {
      setError('All titles are selected. Uncheck at least one to regenerate.');
      return;
    }

    setIsRegeneratingTitles(true);
    try {
      const result = await regenerateTitles(article, settings.language, unselectedIndices.length);
      
      const newTitles = [...titles];
      result.titles.forEach((newTitle, i) => {
        newTitles[unselectedIndices[i]] = newTitle;
      });
      
      setTitles(newTitles);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRegeneratingTitles(false);
    }
  };

  const handleRegenerateHashtags = async () => {
    setIsRegeneratingHashtags(true);
    try {
      const result = await regenerateHashtags(article, settings.language);
      setHashtags(result.hashtags);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRegeneratingHashtags(false);
    }
  };

  const handleRegenerateArticle = async () => {
    setIsRegeneratingArticle(true);
    try {
      const result = await regenerateArticle(
        inputText,
        settings.dateFormat,
        settings.tone,
        settings.style,
        settings.goal,
        settings.minWordCount,
        article,
        context,
        settings.language
      );
      setArticle(result.article);
      
      // Automatically refresh hashtags when body updates
      setIsRegeneratingHashtags(true);
      try {
        const hashtagsResult = await regenerateHashtags(result.article, settings.language);
        setHashtags(hashtagsResult.hashtags);
      } catch (hErr) {
        console.error('Failed to auto-refresh hashtags:', hErr);
      } finally {
        setIsRegeneratingHashtags(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRegeneratingArticle(false);
    }
  };

  const handleTitleSelect = (title) => {
    setSelectedTitles((prev) => 
      prev.includes(title) 
        ? prev.filter((t) => t !== title) 
        : [...prev, title]
    );
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <header className="text-center mb-16 md:mb-20 fade-in">
          <h1 className="newspaper-headline font-black mb-4 border-b-8 border-current inline-block pb-2 px-6">
            THE NEWS GENERATOR
          </h1>
          <p className="text-lg md:text-2xl text-muted max-w-3xl mx-auto px-4 mt-4 italic opacity-80">
            "Your Daily Source for AI-Powered Journalism Excellence"
          </p>
        </header>

        {/* API Key Warning */}
        {!apiKeyValid && (
          <div className="glass-card mb-6 bg-red-50 border-2 border-red-300">
            <div className="flex items-start gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-bold text-red-800 mb-2">API Key Required</h3>
                <p className="text-red-700 mb-2">
                  Please configure your Google Gemini API key in <code className="bg-red-100 px-2 py-1 rounded">config.js</code>
                </p>
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-flex mt-2"
                >
                  Get API Key →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Global Error */}
        {error && (
          <div className="glass-card mb-6 bg-red-50 border-2 border-red-300 fade-in">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div className="flex-1">
                <h3 className="font-bold text-red-800 mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {/* Step 1: Input */}
          <InputForm
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />

          {/* Step 2: Context (Optional) */}
          <ContextConfig onContextChange={handleContextChange} />

          {/* Step 3: Settings */}
          <ArticleSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />

          {/* Unified Generate Button */}
          {inputText && !article && !isGenerating && (
            <div className="text-center fade-in pb-8">
              <button
                onClick={handleGenerateAll}
                className="btn btn-primary h-14 px-10 text-lg shadow-lg hover:scale-[1.02] transition-all"
                disabled={!apiKeyValid}
              >
                <span>🚀</span>
                <span>Generate Professional News Article</span>
              </button>
            </div>
          )}

          {/* Results Area */}
          {(article || isGenerating) && (
            <div className="space-y-6 fade-in">
              {/* Title Selection & Regeneration */}
              <TitleSelector
                titles={titles}
                isLoading={isGenerating || isRegeneratingTitles}
                selectedTitle={selectedTitles}
                onTitleSelect={handleTitleSelect}
                onRegenerate={handleRegenerateTitles}
              />

              {/* Full Article Output with Hashtags & Independent Regeneration */}
              <ArticleOutput
                article={article}
                hashtags={hashtags}
                selectedTitles={selectedTitles}
                isLoading={isGenerating || isRegeneratingArticle}
                isRegeneratingHashtags={isRegeneratingHashtags}
                onRegenerateArticle={handleRegenerateArticle}
                onRegenerateHashtags={handleRegenerateHashtags}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-20 text-muted text-lg border-t border-paper-border pt-10">
          <p>Powered by Google Gemini AI • Built with React 19</p>
        </footer>
      </div>
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
