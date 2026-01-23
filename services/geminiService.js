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
    google_news: "Prioritize Google News principles: Timeliness, Authority, and Trustworthiness. Focus on factual reporting, clear attribution, and precise entity usage (names, organizations, locations).",
    seo_ranking: "Optimize for Semantic SEO. Use natural keyword integration, comprehensive topic coverage, and structure the content to answer specific user search intents.",
    viral_social: "Focus on Shareability and Engagement. Use a compelling narrative voice, emotional resonance, and punchy, memorable phrasing while maintaining accuracy.",
    informational: "Prioritize Clarity and Depth. transform complex information into accessible, easy-to-digest knowledge. Use analogies where helpful and ensure logical flow."
};

const TONE_INSTRUCTIONS = {
    positive: "FORCE a Highly Optimistic Tone. You MUST use uplifting vocabulary (e.g., 'triumph', 'breakthrough', 'visionary', 'success'). Frame every challenge as an opportunity. Focus strictly on benefits and progress.",
    negative: "FORCE a Critical and Warning Tone. You MUST use cautionary vocabulary (e.g., 'risk', 'crisis', 'failure', 'concern', 'alarming'). Focus on the severity of issues and potential negative consequences.",
    neutral: "FORCE a Clinical and Detached Tone. You MUST act as a disinterested reporter. BANNED: emotively charged adjectives (e.g., 'exciting', 'terrible', 'wonderful'). vital: Use flat, factual language only."
};

const STYLE_INSTRUCTIONS = {
    formal: "Use a Sophisticated and Academic style. Employ precise vocabulary and complex sentence structures where appropriate. Maintain a respectful distance.",
    professional: "Use a Standard Journalistic style. Be direct, active, and concise. Avoid fluff. Prioritize clarity and information density.",
    casual: "Use a Conversational and Relatable style. Write as if speaking to a peer. Use contractions and simpler vocabulary, but keep it respectful.",
    friendly: "Use a Warm and Inviting style. Engage the reader directly ('you'). Use positive reinforcement and an encouraging voice.",
    authoritative: "Use a Decisive and Expert style. Write with conviction. Avoid hedging (keywords: 'maybe', 'perhaps'). State facts clearly.",
    conversational: "Use a Narrative and Engaging style. Focus on storytelling and flow. Connect ideas smoothly to keep the reader hooked."
};

const getSystemInstruction = (tone, style, goal) => {
    return `You are a Senior Editor and expert Journalist. Your goal is to produce content that feels clearly written by a skilled human, not an AI.

**Core Writing Principles:**
1. **Natural Flow**: Vary sentence structure and length. Mix short, punchy sentences with longer, descriptive ones. Avoid repetitive patterns.
2. **Active Voice**: Use active voice whenever possible (e.g., "The committee decided" instead of "It was decided by the committee").
3. **Show, Don't Just Tell**: detailed descriptions over generic adjectives.
4. **Avoid AI Cliches**: generic transitions like "In conclusion," "Furthermore," "It is important to note," or "Delving into."
5. **Directness**: Get to the point. Cut unnecessary fluff words.
6. **Tone Amplification**: You must proactively select vocabulary that aligns with the chosen **Tone**. If Positive, use inspiring words. If Negative, use urgent/warning words. If Neutral, use flat words.

**Specific Directions:**
- **Goal**: ${GOAL_INSTRUCTIONS[goal] || GOAL_INSTRUCTIONS.google_news}
- **Tone**: ${TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.neutral}
- **Style**: ${STYLE_INSTRUCTIONS[style] || STYLE_INSTRUCTIONS.professional}

**Editorial Standards:**
- **The Lead (Lede)**: Start strong. The first paragraph must hook the reader and summarize the most critical info (Who, What, Where, When, Why).
- **Paragraphs**: specific paragraph counts. Let the content dictate the structure, but keep paragraphs digestible (typically 2-5 sentences).
- **Formatting**: Use double newlines (\n\n) between paragraphs for readability.
- **Punctuation**: Follow Indonesian standards (KBBI/PUEBI) strictly if writing in Indonesian.
- **Attribution**: specific quotes ("...") to their sources clearly.
- **No Internal Hashtags**: NEVER put hashtags inside the article body.`;
};

const fullSchema = {
    type: Type.OBJECT,
    properties: {
        titles: {
            type: Type.ARRAY,
            description: "Three engaging, high-CTR, and SEO-optimized headline options.",
            items: { type: Type.STRING }
        },
        hashtags: {
            type: Type.ARRAY,
            description: "A list of 5-8 relevant, high-traffic hashtags.",
            items: { type: Type.STRING }
        },
        article: {
            type: Type.STRING,
            description: "The full news article, formatted with natural paragraph breaks."
        }
    },
    required: ['titles', 'article', 'hashtags']
};

const titlesSchema = {
    type: Type.OBJECT,
    properties: {
        titles: {
            type: Type.ARRAY,
            description: "Three new, distinct headline options.",
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
            description: "A list of new, trending hashtags.",
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
            description: "The rewritten, improved news article."
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
        ? `\n**Context & Keywords:**\n${context}`
        : '';

    const prompt = `
        Write a high-quality news article based on the following source.

        **Source Material:**
        ---
        ${inputText}
        ---
        ${contextPrompt}

        **Instructions:**
        1.  **Language**: Write in ${language}.
        2.  **Date**: Include a dateline (${dateFormat}) at the start.
        3.  **Structure**: logic of the "Inverted Pyramid"—most important info first.
        4.  **Flow**: Ensure smooth transitions between paragraphs. meaningful paragraph breaks where the topic shifts or pauses.
        5.  **Constraints**: 
            - NO hashtags in the body text.
            - NO 'Conclusion' headers or summary paragraphs at the end unless typical for the style.

        **Output**:
        Return a JSON object with:
        - 'titles': 3 compelling headlines.
        - 'article': The full body text.
        - 'hashtags': 5-8 relevant tags.
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
        Generate ${count} NEW, distinct headlines for the article below.
        Language: ${language}.
        Goal: High CTR and Relevance for ${goal}.
        
        **Article Summary:**
        ${article.substring(0, 500)}...
    `;
    
    const instruction = getSystemInstruction(tone, style, goal);
    return generateContentWithSchema(prompt, titlesSchema, instruction);
};

export const regenerateHashtags = async (
    article,
    language,
    goal = 'google_news'
) => {
    const prompt = `
        Generate a fresh set of SEO-optimized hashtags for the article below.
        Language: ${language}.
        Focus: Trending and descriptive tags for ${goal}.

        **Article Summary:**
        ${article.substring(0, 500)}...
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
        ? `\n**Context:** ${context}`
        : '';

    const prompt = `
        Rewrite the following article to match a ${tone} tone and ${style} style.
        
        **Original Text:**
        ${originalArticle}

        **Additional Context:**
        ${inputText}
        ${contextPrompt}

        **Directives:**
        - Language: ${language}
        - Dateline: ${dateFormat}
        - Improve flow and readability.
        - Use active voice.
        - Remove any robotic or repetitive phrasing.
        - NO hashtags in the body.
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
