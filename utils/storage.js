// Local Storage Utils

const STORAGE_KEY = 'news_generator_drafts_v1';

export const saveDraft = (data) => {
  try {
    const currentHistory = getDrafts();
    const newDraft = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...data
    };
    
    // Keep only last 50 items
    const updatedHistory = [newDraft, ...currentHistory].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (err) {
    console.error('Failed to save draft:', err);
    return [];
  }
};

export const getDrafts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Failed to load drafts:', err);
    return [];
  }
};

export const deleteDraft = (id) => {
  try {
    const currentHistory = getDrafts();
    const updatedHistory = currentHistory.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (err) {
    console.error('Failed to delete draft:', err);
    return [];
  }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Failed to clear history:', err);
    return [];
  }
};
