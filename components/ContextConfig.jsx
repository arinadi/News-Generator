// ContextConfig Component
import React, { useState } from 'react';

export function ContextConfig({ onContextChange }) {
  const [context, setContext] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const contextTemplates = [
    {
      label: 'Press Release',
      value: 'This is a press release from a company announcing a new product/service.',
    },
    {
      label: 'Event Coverage',
      value: 'This is coverage of a recent event that took place.',
    },
    {
      label: 'Interview',
      value: 'This is based on an interview with a key person.',
    },
    {
      label: 'Research Report',
      value: 'This is based on research findings and data analysis.',
    },
  ];

  const handleContextChange = (e) => {
    const value = e.target.value;
    setContext(value);
    onContextChange(value);
  };

  const handleTemplateSelect = (template) => {
    setContext(template.value);
    onContextChange(template.value);
  };

  return (
    <div className="glass-card fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="newspaper-headline text-2xl font-bold text-gray-800">
          💡 Additional Context
        </h2>
      </div>

      <div className="mt-4">
        {/* Context Templates */}
        <div className="mb-4">
          <label className="input-label mb-2">Quick Templates:</label>
          <div className="flex flex-wrap gap-2">
            {contextTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => handleTemplateSelect(template)}
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <span>📝</span>
                <span>{template.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Context Input */}
        <div className="glass-card">
        <label htmlFor="context-input" className="input-label text-lg mb-3">
          Reference Material / URL / Instructions
        </label>
        <textarea
          id="context-input"
          className="textarea-field text-lg min-h-[160px]"
          placeholder="E.g., paste a scientific study, a long interview transcript, or specific editor notes..."
          value={context}
          onChange={handleContextChange}
        />
        <p className="text-sm text-muted mt-3 italic">
          Tip: Adding context helps Gemini produce more accurate and nuanced articles.
        </p>
        <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {context.length} characters
            </span>
            {context && (
              <button
                onClick={() => {
                  setContext('');
                  onContextChange('');
                }}
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <span>🗑️</span>
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Adding context helps generate more accurate and relevant articles. 
            Include information about the target audience, publication type, or specific angles you want to emphasize.
          </p>
        </div>
      </div>
    </div>
  );
}
