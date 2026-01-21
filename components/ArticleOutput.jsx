// ArticleOutput Component
import React, { useState } from 'react';

export function ArticleOutput({ 
  article, 
  hashtags = [], 
  selectedTitles = [],
  isLoading, 
  isRegeneratingHashtags, 
  onRegenerateArticle, 
  onRegenerateHashtags 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const titlesText = selectedTitles.length > 0 ? selectedTitles.join('\n') + '\n\n' : '';
    const fullContent = `${titlesText}${article}\n\n${hashtags.join(' ')}`;
    try {
      await navigator.clipboard.writeText(fullContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExport = (format) => {
    const titlesText = selectedTitles.length > 0 ? selectedTitles.join('\n') + '\n\n' : '';
    const fullContent = `${titlesText}${article}\n\nHashtags:\n${hashtags.join(', ')}`;
    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Get the first selected title or fallback
    let fileName = 'news-article';
    if (selectedTitles && selectedTitles.length > 0) {
      // Clean the title for filename
      fileName = selectedTitles[0].replace(/[^a-z0-9]/gi, '-').toLowerCase().substring(0, 50);
    } else {
      fileName = `news-article-${Date.now()}`;
    }
    
    a.download = `${fileName}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (isLoading) {
    return (
      <div className="glass-card fade-in">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
          📄 Generating SEO Article...
        </h2>
        <div className="space-y-3">
          <div className="skeleton h-8"></div>
          <div className="skeleton h-4"></div>
          <div className="skeleton h-4"></div>
          <div className="skeleton h-4 w-3/4"></div>
          <div className="skeleton h-8 mt-6"></div>
          <div className="skeleton h-4"></div>
          <div className="skeleton h-4 w-1/2"></div>
        </div>
        <div className="text-center mt-6">
          <div className="spinner"></div>
          <p className="text-gray-600 mt-3 font-medium">Fine-tuning SEO and robot-friendly structure...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  const wordCount = countWords(article);

  return (
    <div className="glass-card fade-in">
      <div className="flex justify-between items-center mb-10 flex-wrap gap-6">
        <h2 className="newspaper-headline text-4xl font-bold">
          📄 Drafted Article
        </h2>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleCopy}
            className={`btn ${copied ? 'btn-secondary' : 'btn-primary'} h-12 px-6`}
          >
            {copied ? <span>✓</span> : <span>📋</span>}
            <span>{copied ? 'Copied' : 'Copy All'}</span>
          </button>
          <button
            onClick={() => handleExport('txt')}
            className="btn btn-outline h-12 px-6 flex items-center gap-2"
          >
            <span>💾</span>
            <span>Export TXT</span>
          </button>
        </div>
      </div>

      {/* Stats & Actions */}
      <div className="mb-10 flex justify-between items-center flex-wrap gap-4 border-b border-paper-border pb-6">
        <div className="flex gap-4">
          <span className="inline-flex items-center px-6 py-2 rounded-full text-sm font-bold bg-primary-100 text-primary-800">
            📊 {wordCount} words
          </span>
          <span className="inline-flex items-center px-6 py-2 rounded-full text-sm font-bold bg-accent-100 text-accent-800">
            📝 {article.split('\n\n').filter(p => p.trim()).length} paragraphs
          </span>
        </div>
        
        <button
          onClick={onRegenerateArticle}
          className="btn btn-outline btn-sm text-sm py-2 px-4 flex gap-2"
          disabled={isLoading}
        >
          🔄 Regenerate Body
        </button>
      </div>

      {/* Article Content */}
      <div className="article-content max-w-none">
        <div className="space-y-8 leading-relaxed text-2xl">
          {article.split('\n\n').map((paragraph, idx) => {
            if (!paragraph.trim()) return null;
            
            // Detection for subheadings or bullet points
            if (paragraph.startsWith('## ')) {
              return <h3 key={idx} className="text-3xl font-bold mt-12 mb-6">{paragraph.replace('## ', '')}</h3>;
            }
            
            return (
              <p key={idx} className="text-main">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>

      {/* Hashtags Section */}
      <div className="mt-12 p-10 bg-gray-50 rounded-2xl border-2 border-dashed border-paper-border relative overflow-hidden">
        <div className="absolute top-4 right-4">
           <button
            onClick={onRegenerateHashtags}
            className="text-muted hover:text-accent-500 transition-colors text-2xl"
            title="Regenerate Hashtags"
            disabled={isRegeneratingHashtags}
          >
            <span className={isRegeneratingHashtags ? 'animate-spin inline-block' : ''}>🔄</span>
          </button>
        </div>
        <h3 className="text-lg font-bold text-muted uppercase tracking-widest mb-6 flex items-center gap-3">
          🏷️ SEO Hashtags
        </h3>
        <div className="flex flex-wrap gap-3">
          {hashtags.map((tag, index) => (
            <span 
              key={index} 
              className="px-5 py-2 bg-white border border-paper-border rounded-xl text-lg text-primary-600 font-medium shadow-sm"
            >
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
          {hashtags.length === 0 && <p className="text-muted italic text-lg">No hashtags generated</p>}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-12 pt-10 border-t border-paper-border flex gap-4 flex-wrap">
        <button
          onClick={() => {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
              <html>
                <head>
                  <title>News Article - Generated by AI</title>
                  <style>
                    body { font-family: 'Lora', serif; line-height: 1.8; max-width: 800px; margin: 60px auto; padding: 0 40px; color: #1a1a1a; background: #fdfbf7; }
                    h1 { font-size: 3rem; margin-bottom: 2rem; border-bottom: 4px solid #1a1a1a; padding-bottom: 1rem; }
                    p { margin-bottom: 24px; text-align: justify; font-size: 20px; }
                    .hashtags { margin-top: 60px; border-top: 1px solid #e8e4db; padding-top: 30px; font-style: italic; color: #db2777; font-size: 18px; }
                  </style>
                </head>
                <body>
                  <h1>${selectedTitles[0] || 'Generated Article'}</h1>
                  ${article.split('\n\n').map((p, i) => `<p>${p}</p>`).join('')}
                  <div class="hashtags">${hashtags.join(' ')}</div>
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.setTimeout(() => printWindow.print(), 500);
          }}
          className="btn btn-outline h-12 px-6 flex items-center gap-2"
        >
          <span>🖨️</span>
          <span>Print Article</span>
        </button>
        <button
          onClick={() => {
            const body = `${article}\n\nSEO Hashtags:\n${hashtags.join(' ')}`;
            const mailtoLink = `mailto:?subject=AI Generated News Article&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
          }}
          className="btn btn-outline h-12 px-6 flex items-center gap-2"
        >
          <span>📧</span>
          <span>Send via Email</span>
        </button>
      </div>
    </div>
  );
}
