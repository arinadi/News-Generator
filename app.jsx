// Main App Component
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { InputForm } from './components/InputForm.jsx';
import { ContextConfig } from './components/ContextConfig.jsx';
import { ArticleSettings } from './components/ArticleSettings.jsx';
import { TitleSelector } from './components/TitleSelector.jsx';
import { ArticleOutput } from './components/ArticleOutput.jsx';
import { HistorySidebar } from './components/HistorySidebar.jsx';
import { ApiKeyConfig } from './components/ApiKeyConfig.jsx';
import { 
  generateNewsArticle, 
  regenerateTitles, 
  regenerateHashtags, 
  regenerateArticle, 
  validateAPIKey 
} from './services/geminiService.js';
import { CONFIG } from './config.js';
import { saveDraft, getDrafts, deleteDraft, clearHistory } from './utils/storage.js';

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

  // History State
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Validate API key on mount and Load settings from URL
  useEffect(() => {
    const validation = validateAPIKey();
    setApiKeyValid(validation.valid);
    setApiKeyValid(validation.valid);
    // User requested no error on missing key, just hide content
    // if (!validation.valid) { setError(validation.message); }

    // Load History
    setHistory(getDrafts());

    // Load settings from URL
    const params = new URLSearchParams(window.location.search);
    const urlSettings = {};
    Object.keys(CONFIG.DEFAULTS).forEach(key => {
      const val = params.get(key);
      if (val !== null) {
        urlSettings[key] = isNaN(val) || key !== 'minWordCount' ? val : parseInt(val);
      }
    });
    if (Object.keys(urlSettings).length > 0) {
      setSettings(prev => ({ ...prev, ...urlSettings }));
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

  // Sync settings to URL whenever they change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(settings).forEach(([key, val]) => {
      params.set(key, val);
    });
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [settings]);

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

  // Handle History Operations
  const handleLoadDraft = (draft) => {
    // Support both old and new (if any) structures, preferring text/context
    setInputText(draft.inputText || draft.simpleInput || '');
    setContext(draft.context || '');
    setSettings(draft.settings);
    setArticle(draft.output.article);
    setTitles(draft.output.titles);
    setHashtags(draft.output.hashtags);
    setShowHistory(false);
  };

  const handleDeleteDraft = (id) => {
    setHistory(deleteDraft(id));
  };

  const handleClearHistory = () => {
    setHistory(clearHistory());
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
        settings.angle,
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

      // Save to History
      const newHistory = saveDraft({
        inputText,
        context,
        settings,
        output: result
      });
      setHistory(newHistory);

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
      const result = await regenerateTitles(
        article, 
        settings.language, 
        settings.angle, 
        settings.style, 
        settings.goal, 
        unselectedIndices.length
      );
      
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
      const result = await regenerateHashtags(article, settings.language, settings.goal);
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
        settings.angle,
        settings.style,
        settings.goal,
        settings.minWordCount,
        article,
        context,
        settings.language
      );
      setArticle(result.article);
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

  // Handle New Session
  const handleNewSession = () => {
    if (inputText && !window.confirm('Start a new session? Current input will be lost.')) {
      return;
    }
    setInputText('');
    setContext('');
    resetState();
  };

  return (
    <div className="min-h-screen py-8 relative">
      <HistorySidebar 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)}
        history={history}
        onLoad={handleLoadDraft}
        onDelete={handleDeleteDraft}
        onClear={handleClearHistory}
      />

      <div className={`container transition-transform duration-300 ${showHistory ? 'translate-x-64' : ''}`}>
        {/* Header */}
        <header className="text-center fade-in relative">
          <h1 className="main-headline mb-4">
            THE NEWS GENERATOR
          </h1>
          <p className="text-lg md:text-2xl text-muted max-w-3xl mx-auto px-4 mt-4 italic opacity-80">
            "Your Daily Source for AI-Powered Journalism Excellence"
          </p>
          
          <div className="flex justify-end items-center gap-3 mt-6 mb-4 px-4 max-w-4xl mx-auto">

            <button 
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 text-sm font-bold text-muted hover:text-primary-600 transition-colors bg-white/50 px-4 py-2 rounded-full border border-gray-200 hover:border-primary-300 shadow-sm"
            >

              <span>History</span>
              <span className="text-lg">⏳</span>
            </button>
            <button 
              onClick={handleNewSession}
              className="flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800 transition-colors bg-white/50 px-4 py-2 rounded-full border border-primary-100 hover:border-primary-200 shadow-sm"
              title="Start Fresh"
            >
              <span>New Session</span>
              <span className="text-lg">✨</span>
            </button>
          </div>
        </header>

        {/* API Key Configuration */}
        <ApiKeyConfig 
          onConfigSave={() => {
            const validation = validateAPIKey();
            setApiKeyValid(validation.valid);
            if(validation.valid) setError('');
          }}
        />

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
        {/* Main Content - Only shown when API Key is valid */}
        {apiKeyValid && (
        <div className="space-y-6 fade-in">
          {/* Step 1: Input */}
          <InputForm
            inputText={inputText}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />

          {/* Step 2: Context (Optional) */}
          <ContextConfig 
            context={context}
            onContextChange={handleContextChange} 
          />

          {/* Step 3: Settings */}
          <ArticleSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />

          {/* Unified Generate Button */}
          {inputText && !isGenerating && (
            <div className="text-center fade-in pb-8">
              <button
                onClick={handleGenerateAll}
                className="btn btn-primary h-14 px-10 text-lg shadow-lg hover:scale-[1.02] transition-all"
                disabled={!apiKeyValid}
              >
                <span>{article ? '🔄' : '🚀'}</span>
                <span>{article ? 'Regenerate Full Story' : 'Generate Professional News Article'}</span>
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
                titles={titles}
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
        )}

        {/* Footer */}
        <footer className="text-center mt-20 border-t border-paper-border pt-12 pb-8 fade-in">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-muted text-sm md:text-base">
              <span className="flex items-center gap-2">
                <span className="opacity-60">Tech:</span>
                <span className="font-semibold px-2 py-0.5 rounded bg-paper-dark/5">React 19</span>
                <span className="font-semibold px-2 py-0.5 rounded bg-paper-dark/5">Vite</span>
                <span className="font-semibold px-2 py-0.5 rounded bg-paper-dark/5">Tailwind</span>
                <span className="font-semibold px-2 py-0.5 rounded bg-paper-dark/5">Gemini API</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-paper-border hidden md:block"></span>
              <a 
                href="https://github.com/arinadi/News-Generator" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.412-4.041-1.412-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub Source
              </a>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <p className="text-muted italic opacity-90">
                Created with full <span className="text-primary font-bold">#vibescoding</span> using Gemini & Claude
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
