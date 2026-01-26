# Revision Proposal – News Generator AI Prompt System

This document contains **concrete and implementable revisions** to the News Generator AI prompt system so it is **safe, relevant, and suitable for professional newsroom use (newsroom‑ready)**.

---

## 1. Purpose of the Revision

The objectives of this revision are to:

- Reduce the risk of **factual hallucination and biased framing** by AI
- Ensure the AI functions as an **editorial assistant**, not an autonomous writer
- Clearly separate **news production** from **non‑news / content / marketing use cases**
- Provide stronger **editorial control** for journalists and editors

---

## 2. Core Issues in the Current Prompt Design

### 2.1 Emotion‑Driven Forced Tone

The current prompt enforces emotional tone using instructions such as:

> "FORCE a Highly Optimistic / Critical Tone"

**Risks in a newsroom context:**
- Distorts factual proportionality
- Encourages emotional framing
- Conflicts with core principles of neutral reporting

---

### 2.2 No Explicit Ban on Adding Facts

The current system does **not explicitly prohibit** the AI from:
- Inferring causes
- Adding background context
- Generalizing impacts

This creates a high risk of factual fabrication in news writing.

---

### 2.3 Over‑Emphasis on “Human‑Like Writing”

Instructions prioritizing output that *“feels written by a human”* encourage the AI to:
- Fill informational gaps
- Smooth over missing data

In journalism:

> **Accurate but rigid is preferable to fluent but assumptive.**

---

## 3. New Principle: News Mode vs Content Mode

### 3.1 New Global Parameter

Introduce a global parameter:

```js
mode: 'news' | 'content'
```

This parameter determines whether editorial guardrails are strictly enforced.

---

## 4. Revised System Instruction (NEWS MODE)

The following block is **mandatory** when `mode === 'news'`:

```text
NON‑NEGOTIABLE JOURNALISM RULES (NEWS MODE):
1. You MUST NOT add facts, data, causes, impacts, or quotes that are not explicitly present in the Source Material or Context.
2. You MUST NOT speculate, infer motives, predict outcomes, or generalize impacts.
3. If information is missing or unclear, you MUST state this explicitly.
4. Clearly separate FACTS from STATEMENTS and attribute opinions to named sources.
5. Neutrality OVERRIDES tone or style instructions if there is any conflict.
```

These rules act as **editorial guardrails**, not stylistic preferences.

---

## 5. Redefining Tone → News Angle

### 5.1 Deprecated Concept

Tone as emotional direction:
- Positive
- Negative

This model is unsuitable for news reporting.

---

### 5.2 New Concept: News Angle

```js
const NEWS_ANGLE = {
  straight: "Report facts only. No emotional framing or value judgement.",
  impact: "Emphasize public impact strictly using stated facts.",
  accountability: "Highlight responsibility, process, and official responses without accusation.",
  human_interest: "Focus on human aspects based only on quoted or described sources."
};
```

This reflects how editors actually assign coverage angles in newsrooms.

---

## 6. Additional Prompt‑Level Guardrails

Append the following to all system instructions in NEWS MODE:

```text
FINAL SELF‑CHECK BEFORE ANSWERING:
- Can every factual statement be traced directly to the Source Material or Context?
- Are all opinions clearly attributed to identifiable sources?
- Are dates, numbers, and locations explicitly stated or omitted if unknown?
If any answer is NO, revise before responding.
```

---

## 7. Revisions to `generateNewsArticle` Prompt

Add the following block:

```text
FACT DISCIPLINE:
- Use ONLY information explicitly present in the Source Material or Context.
- Do NOT add background, causes, or impacts unless clearly stated.
- If details are unavailable, state that they have not yet been disclosed.
```

**Note:** The `wordCount` parameter should either be enforced or removed to avoid misleading UX.

---

## 8. Revisions to `regenerateArticle` Prompt

This function should behave as **copy‑editing**, not rewriting. Add the following constraints:

```text
EDITORIAL CONSTRAINTS:
- Do NOT change factual meaning.
- Preserve all names, numbers, dates, and quotes exactly.
- Do NOT soften, exaggerate, or reframe critical facts.
- Changes are limited to clarity, grammar, and flow.
```

---

## 9. Revisions to `regenerateTitles` Prompt

Add the following rules:

```text
HEADLINE RULES:
- Headlines MUST accurately reflect the article content.
- NO exaggeration and NO clickbait.
- Avoid certainty‑implying words unless explicitly supported by the article.
```

---

## 10. AI’s Role in the Newsroom

With these revisions, the AI is positioned as:

- A junior reporting assistant
- A structural and language support tool
- NOT an editorial decision‑maker

Final responsibility remains with human journalists and editors.

---

## 11. Feature Updates Required for Newsroom Use

To support the revised prompt system, the following **product features** are required.

### 11.1 News Mode Toggle

**Feature:** Global toggle: `News Mode / Content Mode`

**Behavior in News Mode:**
- Enforces all editorial guardrails
- Disables emotionally forced tone options
- Replaces Tone selector with **News Angle** selector

This makes editorial intent explicit and auditable.

---

### 11.2 Structured Journalist Input Fields

Replace or complement the free-text input with structured fields:

- What happened (event summary)
- Where and when
- Who is involved
- Official statements / quotes
- What is still unknown

**Benefit:**
- Reduces AI inference
- Encourages reporter-style thinking
- Improves factual accuracy

---

### 11.3 News Angle Selector (UX)

Replace emotional Tone dropdown with:

- Straight News
- Public Impact
- Accountability
- Human Interest

Each option maps directly to `NEWS_ANGLE` instructions in the prompt.

---

### 11.4 Editorial Checklist Panel

Add a pre-publish checklist visible in News Mode:

- [ ] Covers 5W+1H
- [ ] All opinions are attributed
- [ ] No unsupported claims
- [ ] No emotional or promotional language

This reinforces human editorial responsibility.

---

### 11.5 Regeneration Controls (Granular)

Replace generic “Regenerate Article” with targeted actions:

- Rewrite lead only
- Improve clarity without changing facts
- Shorten article
- Neutralize language

This aligns regeneration with editorial workflows.

---

## 12. UX Changes for Review and Editing

### 12.1 Highlighted Article Layers

In article output view, visually distinguish:
- Lead paragraph
- Quotes
- Data (numbers, dates, locations)

This helps editors quickly scan for risk areas.

---

### 12.2 Version History

Implement lightweight versioning:

- AI Draft
- Edited Draft
- Final Version

Include timestamps and editor notes.

---

### 12.3 Transparency Indicators

Display internal metadata (not public-facing):

- Generated with AI
- Last edited by human
- News Mode enabled

This supports accountability and internal compliance.

---

## 13. Conclusion

These revisions transform the system from:

> **Content Generator → Newsroom-Ready Editorial Assistant**

By combining:
- strict prompt-level guardrails
- clear feature boundaries
- journalist-centric UX

News Generator AI can be deployed **ethically, safely, and professionally** in real newsroom environments.

