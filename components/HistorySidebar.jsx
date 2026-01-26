// HistorySidebar Component
import React from 'react';
import { CONFIG } from '../config.js';

export function HistorySidebar({ 
  isOpen, 
  onClose, 
  history, 
  onLoad, 
  onDelete, 
  onClear 
}) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <div 
        className={`fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-200 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <span>⏳</span> History
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center text-muted py-10 opacity-60">
              <p className="text-4xl mb-2">📭</p>
              <p>No history yet</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all hover:border-primary-200 cursor-pointer"
                onClick={() => onLoad(item)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted bg-gray-100 px-1.5 py-0.5 rounded">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-red-500 rounded transition-all text-xs"
                    title="Delete Draft"
                  >
                    🗑️
                  </button>
                </div>
                
                <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1 line-clamp-2">
                  {item.output?.titles?.[0] || 'Untitled Draft'}
                </h4>
                
                <div className="space-y-2 mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Raw Text</span>
                    <p className="text-xs text-muted line-clamp-2">{item.inputText}</p>
                  </div>
                  
                  {item.context && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Context</span>
                      <p className="text-xs text-muted line-clamp-2">{item.context}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 text-[10px] text-gray-500">
                   <span className="bg-blue-50 text-blue-600 px-1 py-0.5 rounded border border-blue-100">
                     {CONFIG.ANGLES.find(a => a.value === item.settings.angle)?.label || item.settings.angle}
                   </span>
                   <span className="bg-purple-50 text-purple-600 px-1 py-0.5 rounded border border-purple-100">
                     {CONFIG.STYLES.find(s => s.value === item.settings.style)?.label || item.settings.style}
                   </span>
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all history?')) {
                  onClear();
                }
              }}
              className="w-full btn btn-outline border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-sm py-2"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </>
  );
}
