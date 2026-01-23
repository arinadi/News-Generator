// InputForm Component
import React, { useState, useRef } from 'react';
import { readFile, formatFileSize } from '../utils/fileReader.js';

export function InputForm({ onInputChange, onFileUpload }) {
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    onInputChange(text);
    setError('');
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    setIsLoading(true);
    setError('');

    try {
      const text = await readFile(file);
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
      });
      setInputText(text);
      onFileUpload(text, file);
      onInputChange(text);
    } catch (err) {
      setError(err.message);
      setUploadedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleClear = () => {
    setInputText('');
    setUploadedFile(null);
    setError('');
    onInputChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="glass-card fade-in">
      <h2 className="newspaper-headline">
        📝 Input Content
      </h2>

      {/* File Upload Area */}
      <div
        className={`file-upload-area mb-8 py-12 ${isDragging ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        
        {isLoading ? (
          <div className="py-6">
            <div className="spinner mb-4"></div>
            <p className="text-muted">Reading file...</p>
          </div>
        ) : uploadedFile ? (
          <div className="py-6">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-xl font-semibold mb-2">{uploadedFile.name}</p>
            <p className="text-muted">{formatFileSize(uploadedFile.size)}</p>
            <div className="flex justify-center mt-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="btn btn-outline h-12 px-6 flex items-center gap-2"
              >
                <span>🗑️</span>
                <span>Remove File</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-xl font-semibold mb-2">
              Drop your file here or click to browse
            </p>
            <p className="text-muted">
              Supported: TXT, PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Text Input Area */}
      <div className="input-group">
        <label className="input-label mb-4">
          Or paste your text directly:
        </label>
        <textarea
          className="textarea-field min-h-[300px]"
          placeholder="Enter or paste your raw text here..."
          value={inputText}
          onChange={handleTextChange}
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-muted">
            {inputText.length.toLocaleString()} characters
          </span>
          {inputText && (
            <button
              onClick={handleClear}
              className="btn btn-outline h-10 px-4 text-sm flex items-center gap-2"
            >
              <span>🗑️</span>
              <span>Clear Text</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="font-semibold">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
