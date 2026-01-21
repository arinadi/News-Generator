// File Reader Utilities
import { CONFIG } from '../config.js';

/**
 * Validate file size and type
 */
export function validateFile(file) {
  const errors = [];
  
  // Check file size
  const maxSizeBytes = CONFIG.FILE_UPLOAD.maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(`File size exceeds ${CONFIG.FILE_UPLOAD.maxSizeMB}MB limit`);
  }
  
  // Check file type
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  if (!CONFIG.FILE_UPLOAD.acceptedTypes.includes(fileExtension)) {
    errors.push(`File type ${fileExtension} is not supported. Accepted types: ${CONFIG.FILE_UPLOAD.acceptedTypes.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Read text file
 */
export function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    
    reader.onerror = (e) => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Read PDF file using PDF.js
 * Note: This requires pdf.js library to be loaded
 */
export async function readPDFFile(file) {
  try {
    // Check if PDF.js is available
    if (typeof pdfjsLib === 'undefined') {
      throw new Error('PDF.js library is not loaded');
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  } catch (error) {
    throw new Error(`Failed to read PDF: ${error.message}`);
  }
}

/**
 * Read Word document using Mammoth.js
 * Note: This requires mammoth.js library to be loaded
 */
export async function readWordFile(file) {
  try {
    // Check if Mammoth is available
    if (typeof mammoth === 'undefined') {
      throw new Error('Mammoth.js library is not loaded');
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return result.value;
  } catch (error) {
    throw new Error(`Failed to read Word document: ${error.message}`);
  }
}

/**
 * Main file reader function - automatically detects file type
 */
export async function readFile(file) {
  // Validate file first
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }
  
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  try {
    switch (fileExtension) {
      case '.txt':
        return await readTextFile(file);
      
      case '.pdf':
        return await readPDFFile(file);
      
      case '.doc':
      case '.docx':
        return await readWordFile(file);
      
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
