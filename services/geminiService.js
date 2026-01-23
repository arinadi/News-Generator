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

const GOAL_INSTRUCTIONS = {
    google_news: "Prioritize Google News Indexing Standards, high-authority indexing, and E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) signals. Use names of people, organizations, and precise locations (entities).",
    seo_ranking: "Optimize for General SEO Ranking and long-tail keywords. Focus on search intent and relevant semantic entities to improve organic visibility.",
    viral_social: "Focus on Social Media Virality. Create high-engagement content with emotional hooks, punchy sentences, and shareable insights.",
    informational: "Prioritize Informational/Educational value. Deliver deep, clear, and comprehensive explanations with an emphasis on factual accuracy and clarity."
};

const TONE_INSTRUCTIONS = {
    positive: "Use an optimistic, uplifting, and solution-oriented tone. Highlight progress and positive outcomes.",
    negative: "Use a critical, cautionary, or investigative tone. Highlight risks, challenges, or problematic aspects.",
    neutral: "Use an objective, balanced, and unbiased tone. Avoid taking sides; present facts as they are."
};

const STYLE_INSTRUCTIONS = {
    formal: "Adhere to a strict Formal style. Use sophisticated vocabulary and professional terminology. Maintain professional distance.",
    professional: "Use a standard Professional journalistic style. Clear, concise, and authoritative without unnecessary jargon.",
    casual: "Adopt a Casual and accessible style. Use conversational language and simplified sentence structures for a general audience.",
    friendly: "Use a Friendly and approachable style. Make the content feel inviting and easy to relate to.",
    authoritative: "Maintain an Authoritative stance. Position the narrative as a definitive expert source with decisive language.",
    conversational: "Write in a Conversational manner. Speak directly to the reader to build engagement and connection."
};

const getSystemInstruction = (tone, style, goal) => {
    return `You are a Senior SEO Journalist and Editor-in-Chief for a major international news wire service. 

**Strict Editorial Guidelines:**
1. **The Lead (Lede)**: The first paragraph MUST contain the Who, What, Where, When, and Why. 
2. **Inverted Pyramid**: Information flows from most important to least important.
3. **Core Directive**: ${GOAL_INSTRUCTIONS[goal] || GOAL_INSTRUCTIONS.google_news}
4. **Tone & Voice**: ${TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.neutral} ${STYLE_INSTRUCTIONS[style] || STYLE_INSTRUCTIONS.professional}
5. **Freshness**: The dateline is critical for indexing.
6. **Mobile Readability**: Use clear, declarative sentences and short paragraphs (2-3 sentences).
7. **Formatting**: Use double newlines (\n\n) between paragraphs.
8. **Punctuation (KBBI/PUEBI)**: Adhere strictly to Indonesian punctuation standards (if using Indonesian).
9. **Professional Quotes**: Use double quotation marks ("...") with clear formal attribution.
10. **No Internal Hashtags**: Never include hashtags inside the 'article' text field.`;
};

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

const generateContentWithSchema = async (prompt, schema, customInstruction) => {
    try {
        const response = await ai.models.generateContent({
            model: CONFIG.GEMINI_MODEL,
            contents: prompt,
            config: {
                systemInstruction: customInstruction,
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
        Transform the following source into a high-authority article optimized for ${goal}.

        **Source Text:**
        ---
        ${inputText}
        ---
        ${contextPrompt}

        **Strict Editorial Requirements:**
        - **Language:** ${language}
        - **Optimization Goal:** ${goal}
        - **Tone:** ${tone}
        - **Style:** ${style}
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
          1. 'titles': Array of 3 optimized headline options for ${goal}.
          2. 'article': The full article text.
          3. 'hashtags': Array of 5-8 SEO-friendly hashtags.
        - All content must be in ${language}.
    `;
    const instruction = getSystemInstruction(tone, style, goal);
    return generateContentWithSchema(prompt, fullSchema, instruction);
};

export const regenerateTitles = async (
    article,
    language,
    tone = 'neutral',
    style = 'professional',
    goal = 'google_news',
    count = 3
) => {
    const prompt = `
        Based on this article, generate ${count} NEW high-CTR headlines in ${language} optimized for ${goal}. 
        Headline rules: No clickbait, include primary entities, under 70 characters, matching a ${tone} tone.

        **Article:**
        ---
        ${article}
        ---
    `;
    // For regeneration, we just use the base professional instruction or pass options if we want consistency
    const instruction = getSystemInstruction(tone, style, goal);
    return generateContentWithSchema(prompt, titlesSchema, instruction);
};

export const regenerateHashtags = async (
    article,
    language,
    goal = 'google_news'
) => {
    const prompt = `
        Based on this article, generate NEW SEO-optimized hashtags in ${language} for ${goal}. 
        Focus on trending keywords and topic entities relevant to ${goal}.

        **Article:**
        ---
        ${article}
        ---
    `;
    const instruction = getSystemInstruction('neutral', 'professional', goal);
    return generateContentWithSchema(prompt, hashtagsSchema, instruction);
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
        Rewrite this draft into a high-quality article optimized for ${goal}. 
        Focus: Strengthen the lead paragraph, optimize entity placement, and ensure the flow matches a ${tone} tone and ${style} style.

        **Source Info:** ${inputText}
        **Original Draft:** ${originalArticle}
        ${contextPrompt}

        **Editorial Requirements:**
        - Language: ${language}
        - Optimization Goal: ${goal}
        - Tone: ${tone}
        - Style: ${style}
        - Structure: Dateline (${dateFormat}) followed by inverted pyramid.
        - Formatting: ALWAYS use 4-6 distinct, short paragraphs separated by double newlines (\n\n).
        - Punctuation: Strict KBBI/PUEBI standards.
        - Quotes: Formal formatting with "..." and clear attribution.
        - Constraint: Keep the article body text completely free of hashtags.
        - Objective: Maximum authority and alignment with ${goal} standards.
    `;
    const instruction = getSystemInstruction(tone, style, goal);
    return generateContentWithSchema(prompt, articleSchema, instruction);
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
