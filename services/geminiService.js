import { GoogleGenAI, Type } from "@google/genai";
import { CONFIG } from '../config.js';

// Helper to set defaults if needed, though mostly handled by UI
export const getApiKey = () => {
    return localStorage.getItem('gemini_api_key') || '';
};

export const getModel = () => {
    return localStorage.getItem('gemini_model') || 'gemini-3-flash-preview';
};

// We receive urgency to instantiate on demand
// Removed static `const ai = ...`

const GOAL_INSTRUCTIONS = {
    google_news: "Prioritize Google News principles: Timeliness, Authority, and Trustworthiness. Focus on factual reporting, clear attribution, and precise entity usage (names, organizations, locations).",
    seo_ranking: "Optimize for Semantic SEO. Use natural keyword integration, comprehensive topic coverage, and structure the content to answer specific user search intents.",
    viral_social: "Focus on Shareability and Engagement. Use a compelling narrative voice, emotional resonance, and punchy, memorable phrasing while maintaining accuracy.",
    informational: "Prioritize Clarity and Depth. transform complex information into accessible, easy-to-digest knowledge. Use analogies where helpful and ensure logical flow."
};

const ANGLE_INSTRUCTIONS = {
    straight: "Report facts only. No emotional framing or value judgement. Use flat, objective language.",
    impact: "Emphasize public impact strictly using stated facts. Focus on how this affects the community or specific groups without exaggeration.",
    accountability: "Highlight responsibility, process, and official responses. Focus on the 'who' and 'how' of decision making without making accusations.",
    human_interest: "Focus on human aspects based only on quoted or described sources. Highlight personal stories if present in the source."
};

const STYLE_INSTRUCTIONS = {
    formal: "Use a Sophisticated and Academic style. Employ precise vocabulary and complex sentence structures where appropriate. Maintain a respectful distance.",
    professional: "Use a Standard Journalistic style. Be direct, active, and concise. Avoid fluff. Prioritize clarity and information density.",
    casual: "Use a Conversational and Relatable style. Write as if speaking to a peer. Use contractions and simpler vocabulary, but keep it respectful.",
    friendly: "Use a Warm and Inviting style. Engage the reader directly ('you'). Use positive reinforcement and an encouraging voice.",
    authoritative: "Use a Decisive and Expert style. Write with conviction. Avoid hedging (keywords: 'maybe', 'perhaps'). State facts clearly.",
    conversational: "Use a Narrative and Engaging style. Focus on storytelling and flow. Connect ideas smoothly to keep the reader hooked."
};

export const getSystemInstruction = (angle, style, goal) => {
    return `You are a Senior Editor and expert Journalist. Your goal is to produce content that feels clearly written by a skilled human, not an AI.

**NON‑NEGOTIABLE JOURNALISM RULES (NEWS MODE):**
1. You MUST NOT add facts, data, causes, impacts, or quotes that are not explicitly present in the Source Material or Context.
2. You MUST NOT speculate, infer motives, predict outcomes, or generalize impacts.
3. If information is missing or unclear, you MUST state this explicitly.
4. Clearly separate FACTS from STATEMENTS and attribute opinions to named sources.
5. Neutrality OVERRIDES tone or style instructions if there is any conflict.

**Core Writing Principles:**
1. **Natural Flow**: Vary sentence structure and length. Mix short, punchy sentences with longer, descriptive ones. Avoid repetitive patterns.
2. **Active Voice**: Use active voice whenever possible (e.g., "The committee decided" instead of "It was decided by the committee").
3. **Show, Don't Just Tell**: detailed descriptions over generic adjectives.
4. **Avoid AI Cliches**: generic transitions like "In conclusion," "Furthermore," "It is important to note," or "Delving into."
5. **Directness**: Get to the point. Cut unnecessary fluff words.
6. **Angle Direction**: You must frame the story according to the chosen **News Angle**:
   - ${ANGLE_INSTRUCTIONS[angle] || ANGLE_INSTRUCTIONS.straight}

**Specific Directions:**
- **Goal**: ${GOAL_INSTRUCTIONS[goal] || GOAL_INSTRUCTIONS.google_news}
- **Style**: ${STYLE_INSTRUCTIONS[style] || STYLE_INSTRUCTIONS.professional}

**Editorial Standards:**
- **The Lead (Lede)**: Start strong. The first paragraph must hook the reader and summarize the most critical info (Who, What, Where, When, Why).
- **Paragraphs**: specific paragraph counts. Let the content dictate the structure, but keep paragraphs digestible (typically 2-5 sentences).
- **Formatting**: Use double newlines (\n\n) between paragraphs for readability.
- **Punctuation**: Follow Indonesian standards (KBBI/PUEBI) strictly if writing in Indonesian.
- **Attribution**: specific quotes ("...") to their sources clearly.
- **No Internal Hashtags**: NEVER put hashtags inside the article body.

**FINAL SELF‑CHECK BEFORE ANSWERING:**
- Can every factual statement be traced directly to the Source Material or Context?
- Are all opinions clearly attributed to identifiable sources?
- Are dates, numbers, and locations explicitly stated or omitted if unknown?
If any answer is NO, revise before responding.`;
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

const generateHash = async (text) => {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const CACHE_KEY_PREFIX = 'gemini_cache_';
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days

const getFromCache = (hash) => {
    try {
        const cached = localStorage.getItem(CACHE_KEY_PREFIX + hash);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_EXPIRATION) {
                return data;
            }
            localStorage.removeItem(CACHE_KEY_PREFIX + hash);
        }
    } catch (e) {
        console.warn('Cache read error', e);
    }
    return null;
};

const saveToCache = (hash, data) => {
    try {
        const cacheData = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY_PREFIX + hash, JSON.stringify(cacheData));
    } catch (e) {
        console.warn('Cache write error', e);
    }
};

const generateContentWithSchema = async (prompt, schema, customInstruction, bypassCache = false) => {
    try {
        const API_KEY = getApiKey();
        if (!API_KEY) {
            throw new Error("API Key is missing. Please configure it in the settings.");
        }

        const modelId = getModel();
        
        // Caching logic
        const cacheInput = JSON.stringify({ prompt, schema, customInstruction, modelId });
        const hash = await generateHash(cacheInput);
        
        if (!bypassCache) {
            const cachedResult = getFromCache(hash);
            if (cachedResult) {
                console.log('Serving from local cache...');
                return cachedResult;
            }
        }

        const ai = new GoogleGenAI({ 
            apiKey: API_KEY,
            apiVersion: 'v1alpha'
        });

        const response = await ai.models.generateContent({
            model: modelId,
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

        const result = JSON.parse(response.text);
        saveToCache(hash, result);
        return result;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to get a valid response from the AI. Please check your API key and input.");
    }
}

export const generateNewsArticle = async (
    inputText,
    dateFormat,
    angle,
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

        **FACT DISCIPLINE:**
        - Use ONLY information explicitly present in the Source Material or Context.
        - Do NOT add background, causes, or impacts unless clearly stated.
        - If details are unavailable, state that they have not yet been disclosed.

        **Output**:
        Return a JSON object with:
        - 'titles': 3 compelling headlines.
        - 'article': The full body text.
        - 'hashtags': 5-8 relevant tags.
    `;
    const instruction = getSystemInstruction(angle, style, goal);
    return generateContentWithSchema(prompt, fullSchema, instruction);
};

export const regenerateTitles = async (
    article,
    language,
    angle = 'straight',
    style = 'professional',
    goal = 'google_news',
    count = 3
) => {
    const prompt = `
        Generate ${count} NEW, distinct headlines for the article below.
        Language: ${language}.
        Goal: High CTR and Relevance for ${goal}.
        
        **HEADLINE RULES:**
        - Headlines MUST accurately reflect the article content.

        **Article Summary:**
        ${article.substring(0, 500)}...
    `;
    
    const instruction = getSystemInstruction(angle, style, goal);
    return generateContentWithSchema(prompt, titlesSchema, instruction, true);
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
    const instruction = getSystemInstruction('straight', 'professional', goal);
    return generateContentWithSchema(prompt, hashtagsSchema, instruction, true);
};

export const regenerateArticle = async (
    inputText,
    dateFormat,
    angle,
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
        Rewrite the following article to match a ${angle} angle and ${style} style.
        
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

        **EDITORIAL CONSTRAINTS:**
        - Do NOT change factual meaning.
        - Preserve all names, numbers, dates, and quotes exactly.
        - Do NOT soften, exaggerate, or reframe critical facts.
        - Changes are limited to clarity, grammar, and flow.
    `;
    const instruction = getSystemInstruction(angle, style, goal);
    return generateContentWithSchema(prompt, articleSchema, instruction, true);
};

export function validateAPIKey() {
    const key = getApiKey();

    if (!key) {
        return {
            valid: false,
            message: 'Internal: API Key missing', // Message used by UI logic
        };
    }
    
    return {
        valid: true,
        message: 'API key configured',
    };
}
