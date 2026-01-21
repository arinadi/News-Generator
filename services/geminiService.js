import { GoogleGenAI, Type } from "@google/genai";
import { CONFIG } from '../config.js';

// Get API Key from Environment or Config
const getApiKey = () => {
    return CONFIG.GEMINI_API_KEY === 'YOUR_API_KEY_HERE' 
        ? import.meta.env.VITE_GEMINI_API_KEY 
        : CONFIG.GEMINI_API_KEY;
};

// Initialize GoogleGenAI
const API_KEY = getApiKey();
const ai = new GoogleGenAI({ 
    apiKey: API_KEY || "",
    apiVersion: 'v1alpha' // Using beta/alpha for structured JSON schemas if needed
});

const systemInstruction = `You are a Senior SEO Journalist and Editor-in-Chief for a major international news wire service. Your specialty is Google News Optimization, focusing on high-authority indexing and E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) signals.

Strict Google News Optimization Rules:
1. **The Lead (Lede)**: The first paragraph MUST contain the Who, What, Where, When, and Why. It must be a complete summary of the news.
2. **Inverted Pyramid Structure**: Information flows from most important to least important.
3. **Professional Journalism Tone**: Use objective, neutral, and authoritative language. Avoid clickbait; use accurate, descriptive headlines.
4. **Entity-Based SEO**: Prioritize names of people, organizations, and precise locations. Google News uses entities to categorize content.
5. **Freshness & Timeliness**: Ensure the article feels current. The dateline is critical for indexing.
6. **NLP Optimization**: Use clear, declarative sentences. Avoid complex fluff. Use short paragraphs (2-3 sentences) for mobile readability.
7. **Structured Formatting**: Use double newlines (\n\n) between paragraphs to ensure clear separation.
8. **E-E-A-T Signals**: Include attributions for facts and quotes. Use active voice.
9. **SEO Hashtags**: Generate 5-8 relevant, trending, and SEO-friendly hashtags (broad and niche) for maximum reach. 
10. **NO HASHTAGS IN BODY**: Never include hashtags inside the 'article' text field. Hashtags must ONLY exist in the 'hashtags' array.
11. **Punctuation Standards (KBBI/PUEBI)**: Adhere strictly to Indonesian punctuation standards (KBBI/PUEBI). Use proper capitalization, commas, and periods.
12. **Professional Quotes**: Format quotes clearly using double quotation marks ("..."). Example: "Satu langkah besar bagi keadilan," ujar Supratman. Ensure attributions are clear and formal.`;

const fullSchema = {
    type: Type.OBJECT,
    properties: {
        titles: {
            type: Type.ARRAY,
            description: "Three SEO-optimized, keyword-rich headline options.",
            items: { type: Type.STRING }
        },
        hashtags: {
            type: Type.ARRAY,
            description: "A list of 5-8 SEO-optimized hashtags.",
            items: { type: Type.STRING }
        },
        article: {
            type: Type.STRING,
            description: "The full news article with a clear dateline and inverted pyramid structure."
        }
    },
    required: ['titles', 'article', 'hashtags']
};

const titlesSchema = {
    type: Type.OBJECT,
    properties: {
        titles: {
            type: Type.ARRAY,
            description: "Three new SEO-optimized headline options with high search relevance.",
            items: { type: Type.STRING }
        }
    },
    required: ['titles']
};

const hashtagsSchema = {
    type: Type.OBJECT,
    properties: {
        hashtags: {
            type: Type.ARRAY,
            description: "A list of new SEO-optimized hashtags.",
            items: { type: Type.STRING }
        }
    },
    required: ['hashtags']
};

const articleSchema = {
    type: Type.OBJECT,
    properties: {
        article: {
            type: Type.STRING,
            description: "The rewritten news article, re-optimized for SEO and readability."
        }
    },
    required: ['article']
};

const generateContentWithSchema = async (prompt, schema) => {
    try {
        const response = await ai.models.generateContent({
            model: CONFIG.GEMINI_MODEL,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        });

        if (!response.text) {
            throw new Error('API returned an empty response.');
        }

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to get a valid response from the AI. Please check your API key and input.");
    }
}

export const generateNewsArticle = async (
    inputText,
    dateFormat,
    tone,
    style,
    goal,
    wordCount,
    context,
    language
) => {
    const contextPrompt = context.trim() 
        ? `\n**Additional Context (Keywords/Entities to prioritize):**\n---\n${context}\n---`
        : '';

    const prompt = `
        Transform the following source into a high-authority, Google News-optimized article.

        **Source Text:**
        ---
        ${inputText}
        ---
        ${contextPrompt}

        **Strict Editorial Requirements:**
        - **Language:** ${language}
        - **Optimization Goal:** ${goal} (Priority: Google News Indexing Standards)
        - **Structure**: Start with a professional Dateline (${dateFormat}).
        - **The Lede**: The first paragraph must be a hard-news summary (Who, What, Where, When, Why).
        - **SEO**: Focus on entity recognition (names, places, organizations). Use high-relevance keywords for ${goal}.
        - **Formatting**: Separate exactly 4-6 paragraphs with double newlines (\n\n). 
        - **Standards**: Follow the Inverted Pyramid model. Each paragraph must be exactly 2-3 sentences long.
        - **Punctuation**: Use strict KBBI/PUEBI standards.
        - **Quotes**: Format quotes professionally with "..." and clear formal attribution.
        - **Constraint**: DO NOT include any hashtags inside the article text. Keep the article text clean.

        **Output Requirement:**
        - You MUST return a JSON object containing:
          1. 'titles': Array of 3 Google News-optimized headline options.
          2. 'article': The full news article text.
          3. 'hashtags': Array of 5-8 SEO-friendly hashtags.
        - All content must be in ${language}.
    `;
    return generateContentWithSchema(prompt, fullSchema);
};

export const regenerateTitles = async (
    article,
    language,
    count = 3
) => {
    const prompt = `
        Based on this article, generate ${count} NEW high-CTR, Google News-optimized headlines in ${language}. 
        Headline rules: No clickbait, include primary entities, under 70 characters.

        **Article:**
        ---
        ${article}
        ---
    `;
    return generateContentWithSchema(prompt, titlesSchema);
};

export const regenerateHashtags = async (
    article,
    language
) => {
    const prompt = `
        Based on this article, generate NEW SEO-optimized hashtags in ${language}. 
        Focus on news-specific trending keywords and topic entities.

        **Article:**
        ---
        ${article}
        ---
    `;
    return generateContentWithSchema(prompt, hashtagsSchema);
};

export const regenerateArticle = async (
    inputText,
    dateFormat,
    tone,
    style,
    goal,
    wordCount,
    originalArticle,
    context,
    language
) => {
    const contextPrompt = context.trim() 
        ? `\n**Focus Keywords/Context:**\n${context}`
        : '';

    const prompt = `
        Rewrite this draft into a professional Google News-ready article. 
        Focus: Strengthen the lead paragraph, optimize entity placement, and ensure inverted pyramid flow.

        **Source Info:** ${inputText}
        **Original Draft:** ${originalArticle}
        ${contextPrompt}

        **Editorial Requirements:**
        - Language: ${language}, Optimization: ${goal}.
        - Structure: Dateline (${dateFormat}) followed by inverted pyramid.
        - Formatting: ALWAYS use 4-6 distinct, short paragraphs separated by double newlines (\n\n).
        - Punctuation: Strict KBBI/PUEBI standards.
        - Quotes: Formal formatting with "..." and clear attribution.
        - Constraint: Keep the article body text completely free of hashtags.
        - Objective: Maximum authority and trust (E-E-A-T) for Google News algorithms.
    `;
    return generateContentWithSchema(prompt, articleSchema);
};

export function validateAPIKey() {
    const key = getApiKey();

    if (!key || key === 'YOUR_API_KEY_HERE') {
        return {
            valid: false,
            message: 'Please configure your Google Gemini API key in .env or config.js',
        };
    }
    
    return {
        valid: true,
        message: 'API key configured',
    };
}
