// ContextConfig Component
import React, { useState } from 'react';

export function ContextConfig({ onContextChange }) {
  const [context, setContext] = useState('');

  const handleContextChange = (e) => {
    const value = e.target.value;
    setContext(value);
    onContextChange(value);
  };

  return (
    <div className="glass-card fade-in">
      <h2 className="newspaper-headline">
        💡 Additional Context
      </h2>

      <div className="input-group mt-8">
        <div className="flex justify-between items-center mb-4">
          <label htmlFor="context-input" className="input-label mb-0">
            Reference Material / URL / Instructions
          </label>
          <span className="text-sm text-muted">
            {context.length.toLocaleString()} characters
          </span>
        </div>
        
        <textarea
          id="context-input"
          className="textarea-field min-h-[200px]"
          placeholder="E.g., paste a scientific study, a long interview transcript, or specific editor notes..."
          value={context}
          onChange={handleContextChange}
        />
        
        <div className="flex justify-between items-start mt-4">
          <p className="text-sm text-muted italic flex-1 mr-4">
            <strong>Tip:</strong> Adding context helps generate more accurate and relevant articles. 
            Include information about the target audience, publication type, or specific angles you want to emphasize.
          </p>
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
    </div>
  );
}
