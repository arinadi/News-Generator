// ArticleSettings Component
import React from 'react';
import { CONFIG } from '../config.js';

export function ArticleSettings({ settings, onSettingsChange }) {
  const handleChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const getLabel = (list, val) => list.find(i => i.value === val)?.label;
  const getDescription = (list, val) => list.find(i => i.value === val)?.description;

  return (
    <div className="glass-card fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="newspaper-headline">
          ⚙️ Article Settings
        </h2>
        <span className="bg-primary-50 text-primary-700 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
          Newsroom Mode
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Language Selection */}
        <div className="input-group">
          <label className="input-label">Language</label>
          <select
            className="select-field"
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
          >
            {CONFIG.LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Angle Selection (Replaces Tone) */}
        <div className="input-group">
          <label className="input-label flex justify-between">
            <span>News Angle</span>
            <span className="text-xs font-normal text-muted opacity-80" title="Determines the framing of the report">ℹ️ Framing</span>
          </label>
          <select
            className="select-field"
            value={settings.angle}
            onChange={(e) => handleChange('angle', e.target.value)}
          >
            {CONFIG.ANGLES.map((angle) => (
              <option key={angle.value} value={angle.value}>
                {angle.label}
              </option>
            ))}
          </select>
        </div>

        {/* Style Selection */}
        <div className="input-group">
          <label className="input-label">Writing Style</label>
          <select
            className="select-field"
            value={settings.style}
            onChange={(e) => handleChange('style', e.target.value)}
          >
            {CONFIG.STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        {/* Goal Optimization */}
        <div className="input-group">
          <label className="input-label">Optimization Goal</label>
          <select
            className="select-field"
            value={settings.goal}
            onChange={(e) => handleChange('goal', e.target.value)}
          >
            {CONFIG.GOALS.map((goal) => (
              <option key={goal.value} value={goal.value}>
                {goal.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Format Selection */}
        <div className="input-group">
          <label className="input-label">Dateline Format</label>
          <select
            className="select-field"
            value={settings.dateFormat}
            onChange={(e) => handleChange('dateFormat', e.target.value)}
          >
            {CONFIG.DATE_FORMATS.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        {/* Word Count */}
        <div className="input-group">
          <label className="input-label">
            Target Length: <span className="text-primary-600 font-bold">{settings.minWordCount} words</span>
          </label>
          <input
            type="range"
            min="200"
            max="1500"
            step="50"
            value={settings.minWordCount}
            onChange={(e) => handleChange('minWordCount', parseInt(e.target.value))}
            className="w-full mt-2"
            style={{ accentColor: 'var(--primary-500)' }}
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>Brief (200)</span>
            <span>Feature (1500)</span>
          </div>
        </div>
      </div>

      {/* Enhanced Informative Preview */}
      <div className="mt-8 pt-6 border-t border-gray-100">
         <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
            EFFECT OF CURRENT CONFIGURATION
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Angle Effect */}
            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
               <div className="text-xs text-blue-600 font-bold mb-1 uppercase">Angle: {getLabel(CONFIG.ANGLES, settings.angle)}</div>
               <p className="text-xs text-blue-800 leading-relaxed">
                 {getDescription(CONFIG.ANGLES, settings.angle)}
               </p>
            </div>

            {/* Style Effect */}
            <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100">
               <div className="text-xs text-purple-600 font-bold mb-1 uppercase">Style: {getLabel(CONFIG.STYLES, settings.style)}</div>
               <p className="text-xs text-purple-800 leading-relaxed">
                 {getDescription(CONFIG.STYLES, settings.style)}
               </p>
            </div>

            {/* Goal Effect */}
            <div className="bg-green-50/50 p-3 rounded-lg border border-green-100">
               <div className="text-xs text-green-600 font-bold mb-1 uppercase">Goal: {getLabel(CONFIG.GOALS, settings.goal)}</div>
               <p className="text-xs text-green-800 leading-relaxed">
                 {getDescription(CONFIG.GOALS, settings.goal)}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
