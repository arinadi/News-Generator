// ApiKeyConfig Component
import React, { useState, useEffect } from 'react';

export function ApiKeyConfig({ onConfigSave }) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-3-flash-preview');
  const [showConfig, setShowConfig] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load existing config
    const savedKey = localStorage.getItem('gemini_api_key');
    const savedModel = localStorage.getItem('gemini_model');
    
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    } else {
      setShowConfig(true); // Auto-show if no key
    }
    
    if (savedModel) {
      setModel(savedModel);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      alert('Please enter a valid API Key');
      return;
    }
    
    localStorage.setItem('gemini_api_key', apiKey);
    localStorage.setItem('gemini_model', model);
    
    setIsSaved(true);
    setShowConfig(false);
    
    // Notify parent to re-validate
    if (onConfigSave) {
      onConfigSave();
    }
  };

  const handleClear = () => {
    if (window.confirm('Remove API Key? You will need to enter it again to generate content.')) {
      localStorage.removeItem('gemini_api_key');
      localStorage.removeItem('gemini_model'); // Optional: clear model too or keep preference
      setApiKey('');
      setIsSaved(false);
      setShowConfig(true);
      if (onConfigSave) onConfigSave();
    }
  };

  const MODELS = [
    { value: 'gemini-3-flash-preview', label: 'Gemini 3 Flash Preview (Most Balanced - Speed & Scale)' },
    { value: 'gemini-3-pro-preview', label: 'Gemini 3 Pro Preview (Most Intelligent - Frontier Intelligence)' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Stable - Price-Performance)' },
    { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite (Ultra Fast - Cost-Efficient)' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Thinking/Reasoning - Advanced)' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-6">
      <div className={`glass-card transition-all duration-300 ${!isSaved ? 'border-red-300 bg-red-50/50' : 'bg-white/60'}`}>
        
        {/* Header / Summary View */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${isSaved ? 'text-green-500' : 'text-red-500'}`}>
              {isSaved ? '🔐' : '🔑'}
            </span>
            <div>
              <h3 className="font-bold text-gray-800">
                AI Configuration
                {isSaved && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Connected</span>}
              </h3>
              {isSaved && !showConfig && (
                <p className="text-xs text-muted">
                  Using <strong>{MODELS.find(m => m.value === model)?.label || model}</strong>
                </p>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="text-sm font-semibold text-primary underline decoration-dotted hover:text-primary-700"
          >
            {showConfig ? 'Hide Config' : 'Configure'}
          </button>
        </div>

        {/* Expanded Config Form */}
        {showConfig && (
          <div className="mt-6 pt-6 border-t border-gray-200/50 fade-in">
             
             {/* API Key Input */}
             <div className="mb-4">
               <label className="block text-sm font-semibold text-gray-700 mb-1">
                 Google Gemini API Key
               </label>
               <div className="flex gap-2">
                 <input
                   type="password"
                   className="flex-1 input-field"
                   placeholder="Enter your AI Studio API Key (begins with AIza...)"
                   value={apiKey}
                   onChange={(e) => setApiKey(e.target.value)}
                 />
                 {isSaved && (
                   <button 
                    onClick={handleClear}
                    className="btn btn-outline border-red-200 text-red-600 hover:bg-red-50"
                    title="Remove Key"
                   >
                     ✕
                   </button>
                 )}
               </div>
               <p className="text-xs text-muted mt-1">
                 Your key is stored locally in your browser. Get a key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>.
               </p>
             </div>

             {/* Model Selection */}
             <div className="mb-6">
               <label className="block text-sm font-semibold text-gray-700 mb-1">
                 AI Model
               </label>
               <select 
                 className="input-field w-full"
                 value={model}
                 onChange={(e) => setModel(e.target.value)}
               >
                 {MODELS.map(m => (
                   <option key={m.value} value={m.value}>{m.label}</option>
                 ))}
               </select>
               <p className="text-xs text-muted mt-1">
                 Select the model that best fits your needs. <strong>Gemini 3 Flash</strong> is recommended for speed and quality.
               </p>
             </div>

             {/* Save Button */}
             <div className="flex justify-end">
               <button 
                 onClick={handleSave}
                 className="btn btn-primary px-8"
               >
                 Save Configuration
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
