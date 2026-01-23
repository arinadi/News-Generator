// ArticleOutput Component
import React, { useState } from 'react';

export function ArticleOutput({ 
  article, 
  titles = [],
  hashtags = [], 
  selectedTitles = [],
  isLoading, 
  isRegeneratingHashtags, 
  onRegenerateArticle, 
  onRegenerateHashtags 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const effectiveTitles = selectedTitles.length > 0 ? selectedTitles : titles;
    const titlesText = effectiveTitles.length > 0 ? effectiveTitles.join('\n') + '\n\n' : '';
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
    const effectiveTitles = selectedTitles.length > 0 ? selectedTitles : titles;
    const titlesText = effectiveTitles.length > 0 ? effectiveTitles.join('\n') + '\n\n' : '';
    const fullContent = `${titlesText}${article}\n\nHashtags:\n${hashtags.join(', ')}`;
    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Get the first selected title or fallback
    let fileName = 'news-article';
    if (effectiveTitles && effectiveTitles.length > 0) {
      // Clean the title for filename
      fileName = effectiveTitles[0].replace(/[^a-z0-9]/gi, '-').toLowerCase().substring(0, 50);
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
        <h2 className="newspaper-headline">
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
        <h2 className="newspaper-headline">
          📄 Drafted Article
        </h2>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleCopy}
            className={`btn ${copied ? 'btn-secondary' : 'btn-primary'}`}
          >
            <span>{copied ? '✓' : '📋'}</span>
            <span>{copied ? 'Copied' : 'Copy All'}</span>
          </button>
          <button
            onClick={() => handleExport('txt')}
            className="btn btn-outline"
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
        <div className="space-y-8 leading-relaxed">
          {article.split('\n\n').map((paragraph, idx) => {
            if (!paragraph.trim()) return null;
            
            // Detection for subheadings or bullet points
            if (paragraph.startsWith('## ')) {
              return <h3 key={idx} className="mt-12 mb-6">{paragraph.replace('## ', '')}</h3>;
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
              className="px-5 py-2 bg-white border border-paper-border rounded-xl text-primary-600 font-medium shadow-sm"
            >
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
          {hashtags.length === 0 && <p className="text-muted italic">No hashtags generated</p>}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-12 pt-10 border-t border-paper-border flex gap-4 flex-wrap">
        <button
          onClick={() => {
            const printWindow = window.open('', '_blank');
            const effectiveTitles = selectedTitles.length > 0 ? selectedTitles : titles;
            printWindow.document.write(`
              <html>
                <head>
                  <title>News Article - Generated by AI</title>
                  <style>
                    body { font-family: 'Lora', serif; line-height: 1.8; max-width: 800px; margin: 60px auto; padding: 0 40px; color: #1a1a1a; background: #fdfbf7; }
                    .titles { border-bottom: 4px solid #1a1a1a; margin-bottom: 2rem; padding-bottom: 1rem; }
                    h1 { font-size: 2.2rem; margin-bottom: 0.5rem; line-height: 1.2; }
                    p { margin-bottom: 24px; text-align: justify; font-size: 20px; }
                    .hashtags { margin-top: 60px; border-top: 1px solid #e8e4db; padding-top: 30px; font-style: italic; color: #db2777; font-size: 18px; }
                  </style>
                </head>
                <body>
                  <div class="titles">
                    ${effectiveTitles.map(t => `<h1>${t}</h1>`).join('')}
                  </div>
                  ${article.split('\n\n').map((p, i) => `<p>${p}</p>`).join('')}
                  <div class="hashtags">${hashtags.join(' ')}</div>
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.setTimeout(() => printWindow.print(), 500);
          }}
          className="btn btn-outline"
        >
          <span>🖨️</span>
          <span>Print Article</span>
        </button>
        <button
          onClick={() => {
            const effectiveTitles = selectedTitles.length > 0 ? selectedTitles : titles;
            const titlesText = effectiveTitles.join('\n') + '\n\n';
            const body = `${titlesText}${article}\n\nSEO Hashtags:\n${hashtags.join(' ')}`;
            const mailtoLink = `mailto:?subject=AI Generated News Article&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
          }}
          className="btn btn-outline"
        >
          <span>📧</span>
          <span>Send via Email</span>
        </button>
      </div>
    </div>
  );
}
