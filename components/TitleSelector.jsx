// TitleSelector Component
import React, { useState } from 'react';

export function TitleSelector({ titles, isLoading, onTitleSelect, onRegenerate, selectedTitle }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (isLoading) {
    return (
      <div className="glass-card fade-in">
        <h2 className="newspaper-headline">
          📰 Title Options
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-16"></div>
          ))}
        </div>
        <div className="text-center mt-4">
          <div className="spinner"></div>
          <p className="text-gray-600 mt-3">Generating titles...</p>
        </div>
      </div>
    );
  }

  if (!titles || titles.length === 0) {
    return null;
  }

  return (
    <div className="glass-card fade-in">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="newspaper-headline">
          <span>📰</span> Title Options
        </h2>
        <button
          onClick={onRegenerate}
          className="btn btn-outline btn-sm flex items-center gap-2"
          disabled={isLoading}
        >
          <span>🔄</span>
          <span>Regenerate Titles</span>
        </button>
      </div>

      <div className="radio-group">
        {titles.map((title, index) => {
          const isSelected = Array.isArray(selectedTitle) ? selectedTitle.includes(title) : selectedTitle === title;
          return (
            <div
              key={index}
              className={`radio-option ${isSelected ? 'selected' : ''} p-3 md:p-4 mb-2 border-2`}
              onClick={() => onTitleSelect(title)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transform: hoveredIndex === index && window.innerWidth > 768 ? 'scale(1.01)' : 'scale(1)',
                transition: 'all 0.2s ease',
                borderColor: isSelected ? 'var(--primary-500)' : 'var(--paper-border)',
                backgroundColor: isSelected ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'var(--dark-surface-light)' : 'var(--primary-50)') : 'var(--paper-bg)',
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-gray-300'
                }`}>
                  {isSelected && <span className="text-xs">✓</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-gray-400 text-sm">#{index + 1}</span>
                    <p className="text-lg font-medium leading-snug">
                      {title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(Array.isArray(selectedTitle) ? selectedTitle.length > 0 : selectedTitle) && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded slide-in">
          <p className="text-sm text-green-800">
            <strong>✓ Selected:</strong> {Array.isArray(selectedTitle) ? selectedTitle.join(', ') : selectedTitle}
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-muted italic opacity-80">
          Selected titles will be included in the final article output.
        </p>
        <p className="text-sm text-blue-800 mt-2">
          <strong>Tip:</strong> Choose the title that best captures the essence of your article. 
          You can regenerate to get different options.
        </p>
      </div>
    </div>
  );
}
