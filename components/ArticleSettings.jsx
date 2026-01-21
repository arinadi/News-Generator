// ArticleSettings Component
import React, { useState } from 'react';
import { CONFIG } from '../config.js';

export function ArticleSettings({ settings, onSettingsChange }) {
  const handleChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="glass-card fade-in">
      <h2 className="newspaper-headline text-3xl font-bold mb-8">
        ⚙️ Article Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {/* Language Selection */}
        <div className="input-group">
          <label className="input-label">Language</label>
          <select
            className="select-field h-10"
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

        {/* Tone Selection */}
        <div className="input-group">
          <label className="input-label">Tone</label>
          <select
            className="select-field h-10"
            value={settings.tone}
            onChange={(e) => handleChange('tone', e.target.value)}
          >
            {CONFIG.TONES.map((tone) => (
              <option key={tone.value} value={tone.value}>
                {tone.label}
              </option>
            ))}
          </select>
        </div>

        {/* Style Selection */}
        <div className="input-group">
          <label className="input-label">Style</label>
          <select
            className="select-field h-10"
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
          <label className="input-label">Goal Optimization</label>
          <select
            className="select-field h-10"
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
          <label className="input-label">Date Format</label>
          <select
            className="select-field h-10"
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
            Minimum Word Count: <span className="text-primary-600 font-bold">{settings.minWordCount}</span>
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={settings.minWordCount}
            onChange={(e) => handleChange('minWordCount', parseInt(e.target.value))}
            className="w-full mt-1"
            style={{
              accentColor: 'var(--primary-500)',
            }}
          />
          <div className="flex justify-between text-sm text-muted mt-2">
            <span>100</span>
            <span>2000</span>
          </div>
        </div>
      </div>

      {/* Settings Preview */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-paper-border">
        <p className="text-sm font-bold mb-3 opacity-60 tracking-wider">CURRENT CONFIGURATION:</p>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <div>
            <span className="text-muted">Language:</span>{' '}
            <span className="font-bold">
              {CONFIG.LANGUAGES.find(l => l.value === settings.language)?.label}
            </span>
          </div>
          <div>
            <span className="text-muted">Tone:</span>{' '}
            <span className="font-bold">
              {CONFIG.TONES.find(t => t.value === settings.tone)?.label}
            </span>
          </div>
          <div>
            <span className="text-muted">Style:</span>{' '}
            <span className="font-bold">
              {CONFIG.STYLES.find(s => s.value === settings.style)?.label}
            </span>
          </div>
          <div>
            <span className="text-muted">Target:</span>{' '}
            <span className="font-bold">
              {CONFIG.GOALS.find(g => g.value === settings.goal)?.label}
            </span>
          </div>
          <div>
            <span className="text-muted">Words:</span>{' '}
            <span className="font-bold text-primary-600">
              ~{settings.minWordCount}+
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
