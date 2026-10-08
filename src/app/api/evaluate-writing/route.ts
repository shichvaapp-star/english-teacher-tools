import { NextResponse } from "next/server";

export interface RubricCategoryScore {
  score: number; // 0 to max
  max: number;
  commentHebrew: string;
  bandLevelObserved?: string; // e.g. "Band I", "Band II", "Band III"
}

export interface WritingCorrection {
  original: string;
  suggestion: string;
  explanationHebrew: string;
  category?: "capitalization" | "grammar" | "vocabulary" | "spelling" | "punctuation" | "hebrew_interference";
}

export interface VocabularyUpgrade {
  original: string;
  enriched: string;
  explanationHebrew: string;
}

export interface WritingEvaluationResult {
  score: number; // 0 to 100
  encouragement: string;
  teacherNote?: string; // Personal paragraph in Hebrew from the teacher
  isSpamOrGibberish: boolean;
  strengths: string[];
  tips: string[];
  rubric: {
    contentAndOrganization: RubricCategoryScore; // max 35%
    vocabulary: RubricCategoryScore; // max 25%
    languageAndGrammar: RubricCategoryScore; // max 25%
    mechanicsAndSpelling: RubricCategoryScore; // max 15%
  };
  corrections?: WritingCorrection[];
  vocabularyUpgrades?: VocabularyUpgrade[];
  hebrewInterferenceNotes?: string[];
}

// Clean and extract JSON from markdown wrappers or raw text
function extractJsonFromText(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

// Rigorous validator ensuring all Capital Letter errors are flagged and explained
function ensureCapitalizationChecks(
  essayText: string,
  existingCorrections: WritingCorrection[] = [],
  level: string = "Level 2"
): WritingCorrection[] {
  const corrections = [...existingCorrections];

  const hasCorrectionFor = (target: string) => {
    const clean = target.trim().toLowerCase();
    return corrections.some((c) => c.original.trim().toLowerCase() === clean);
  };

  // 1. Lowercase standalone 'i' (must be capital 'I')
  if (/\bi\b/.test(essayText) && !hasCorrectionFor("i")) {
    corrections.unshift({
      original: "i",
      suggestion: "I",
      explanationHebrew: "באנגלית, כינוי הגוף 'I' (אני) נכתב תמיד באות גדולה (Capital letter), בכל מקום במשפט.",
      category: "capitalization",
    });
  }

  // 2. Scan lines for closing formulas and line starters
  const lines = essayText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    // Check letter closings like "by", "bye"
    if (/^by\b/i.test(line)) {
      const firstWord = line.split(/[\s,]+/)[0];
      if (firstWord && (firstWord === "by" || firstWord === "bye")) {
        if (!hasCorrectionFor(firstWord)) {
          corrections.unshift({
            original: firstWord,
            suggestion: "Bye,",
            explanationHebrew: "בסיום מכתב, ברכת הפרידה נכתבת באות גדולה (Capital letter) ועם פסיק: 'Bye,' או 'From,'.",
            category: "capitalization",
          });
        }
      }
    }

    // Check lines starting with a lowercase English letter (not punctuation)
    const lineStartMatch = line.match(/^([a-z][a-z0-9']*)/);
    if (lineStartMatch) {
      const lowerWord = lineStartMatch[1];
      if (!hasCorrectionFor(lowerWord)) {
        const capitalized = lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
        corrections.unshift({
          original: lowerWord,
          suggestion: capitalized,
          explanationHebrew: "באנגלית, כל שורה, משפט או ברכה חייבים להתחיל באות גדולה (Capital letter).",
          category: "capitalization",
        });
      }
    }
  }

  // 3. Check sentence openings after punctuation (. ! ?)
  const sentenceStarts = essayText.match(/[.!?]\s+([a-z][a-z0-9']*)/g);
  if (sentenceStarts) {
    for (const match of sentenceStarts) {
      const lowerWord = match.replace(/^[.!?]\s+/, "");
      if (lowerWord && !hasCorrectionFor(lowerWord)) {
        const capitalized = lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
        corrections.unshift({
          original: lowerWord,
          suggestion: capitalized,
          explanationHebrew: "משפט חדש לאחר נקודה חייב להתחיל באות גדולה (Capital letter).",
          category: "capitalization",
        });
      }
    }
  }

  return corrections;
}

// Quick deterministic anti-spam & gibberish detector
function detectObviousSpam(text: string, minWords: number, level: string = "Level 2"): WritingEvaluationResult | null {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const cleanWords = lowerWords.filter((w) => w.length > 0);

  const minWordThreshold = level === "Level 1" ? 2 : 5;
  if (cleanWords.length < minWordThreshold) {
    return {
      score: level === "Level 1" ? 30 : 10,
      encouragement: level === "Level 1" ? "כתבת מעט מאוד. נסו לכתוב עוד 1-2 מילים כדי לקבל משוב!" : "החיבור קצרצר ביותר (פחות מ-5 מילים). יש לכתוב פסקה שלמה באנגלית.",
      teacherNote: "החיבור שהוגש קצר מכדי שנוכל להעריך אותו לפי מחוון משרד החינוך. נסו להשתמש במשפטי הפתיחה ובבנק המילים כדי לכתוב לפחות מספר משפטים שלמים.",
      isSpamOrGibberish: true,
      strengths: [],
      tips: [
        level === "Level 1" ? "לחצו על משפטי הפתיחה או על בנק המילים כדי להוסיף מילים." : "אנא כתבו לפחות פסקה אחת בת מספר משפטים באנגלית מלאה.",
        `יעד המילים למשימה זו הוא לפחות ${minWords} מילים.`,
      ],
      rubric: {
        contentAndOrganization: { score: 2, max: 35, commentHebrew: "החיבור קצר מדי ולא מפתח רעיון." },
        vocabulary: { score: 3, max: 25, commentHebrew: "אוצר מילים לא מספק." },
        languageAndGrammar: { score: 3, max: 25, commentHebrew: "אין משפטים שלמים לבדיקה." },
        mechanicsAndSpelling: { score: 2, max: 15, commentHebrew: "קצר מדי להערכה." },
      },
    };
  }

  // 1. Check unique word ratio (vocabulary repetition / spam check)
  const uniqueWords = new Set(cleanWords);
  const uniqueRatio = uniqueWords.size / cleanWords.length;

  // Count top repeated word
  const frequencies: Record<string, number> = {};
  for (const w of cleanWords) {
    frequencies[w] = (frequencies[w] || 0) + 1;
  }
  const maxFreq = Math.max(...Object.values(frequencies));
  const maxFreqRatio = maxFreq / cleanWords.length;

  // If a single word makes up > 45% of all words, or unique ratio is under 30% for a text with > 15 words
  if (cleanWords.length >= 15 && (maxFreqRatio > 0.45 || (level !== "Level 1" && uniqueRatio < 0.3))) {
    const mostRepeatedWord = Object.entries(frequencies).find(([, count]) => count === maxFreq)?.[0] || "מילה";
    return {
      score: 15,
      encouragement: "זוהתה חזרתיות קיצונית על אותן מילים ללא משפטים בעלי משמעות.",
      teacherNote: `שלום! שמנו לב שהמילה "${mostRepeatedWord}" חוזרת שוב ושוב. כתיבה באנגלית דורשת פיתוח רעיונות מגוונים בעזרת מילות קישור ופעלים שונים. נסו שוב ונשמח לבדוק!`,
      isSpamOrGibberish: true,
      strengths: [],
      tips: [
        `המילה "${mostRepeatedWord}" מופיעה ${maxFreq} פעמים מתוך ${cleanWords.length} מילים.`,
        "חיבור באנגלית דורש משפטים שלמים עם נושא, פועל, ותוכן אמיתי הקשור למשימה.",
        "הימנעו מהעתקה או שכפול של מילות קישור ללא משפטים מחברים ביניהן.",
      ],
      rubric: {
        contentAndOrganization: {
          score: 3,
          max: 35,
          commentHebrew: "הטקסט מכיל רצף מילים חוזרות ללא תוכן או מבנה הגיוני.",
        },
        vocabulary: {
          score: 4,
          max: 25,
          commentHebrew: "אוצר מילים מוגבל ביותר המורכב מחזרות על אותן מילים.",
        },
        languageAndGrammar: {
          score: 4,
          max: 25,
          commentHebrew: "אין תחביר תקין של משפטים באנגלית (חסרים נושאים ופעלים).",
        },
        mechanicsAndSpelling: {
          score: 4,
          max: 15,
          commentHebrew: "סימני פיסוק או מילים משוכפלות ללא פיסוק משפטים תקין.",
        },
      },
    };
  }

  // 2. Check for keyboard mashing / non-word gibberish (e.g., "asdfghjk asdfgh")
  const englishWordLike = cleanWords.filter((w) => /^[a-z]{1,25}$/.test(w));
  if (englishWordLike.length / cleanWords.length < 0.6) {
    return {
      score: 10,
      encouragement: "הטקסט שהוזן אינו מכיל מילים תקינות באנגלית.",
      teacherNote: "לא הצלחנו לזהות מילים באנגלית בחיבור שלך. הקפידו להקליד מילים אמיתיות באנגלית ובמידת הצורך היעזרו במילון המובנה ובבנק המילים.",
      isSpamOrGibberish: true,
      strengths: [],
      tips: [
        "אנא כתבו מילים אמיתיות באנגלית.",
        "השתמשו במילון המובנה במידת הצורך למציאת מילים מתאימות.",
      ],
      rubric: {
        contentAndOrganization: { score: 2, max: 35, commentHebrew: "אין תוכן בעל משמעות." },
        vocabulary: { score: 2, max: 25, commentHebrew: "מילים בלתי מזוהות או סימנים." },
        languageAndGrammar: { score: 3, max: 25, commentHebrew: "אין משפטים תקינים." },
        mechanicsAndSpelling: { score: 3, max: 15, commentHebrew: "רצפי תווים ללא משמעות." },
      },
    };
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { essayText, taskTitle, prompt, category, minWords, maxWords, level } = body;

    if (!essayText || typeof essayText !== "string" || essayText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing essay text." },
        { status: 400 }
      );
    }

    const currentLevel = level || "Level 2";
    const defaultMin = currentLevel === "Level 1" ? 10 : currentLevel === "Level 3" ? 80 : 45;
    const defaultMax = currentLevel === "Level 1" ? 25 : currentLevel === "Level 3" ? 120 : 80;

    const targetMin = typeof minWords === "number" ? minWords : defaultMin;
    const targetMax = typeof maxWords === "number" ? maxWords : defaultMax;

    // Fast deterministic spam filter
    const spamCheck = detectObviousSpam(essayText, targetMin, currentLevel);
    if (spamCheck) {
      return NextResponse.json({
        success: true,
        evaluation: spamCheck,
        source: "rule_engine",
      });
    }

    // Get API Keys: Prefer request headers (client storage) or server env variables
    const groqApiKey = request.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY;
    const geminiApiKey = request.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY;
    const openaiApiKey = request.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY;

    // Strict pedagogical system prompt calibrated by student level
    let levelPedagogyGuidance = "";
    if (currentLevel === "Level 1") {
      levelPedagogyGuidance = `
STUDENT AUDIENCE PROFILE: LEVEL 1 (VERY BASIC / EARLY BEGINNER / ELEMENTARY LEVEL 1):
- Target word count is very short (${targetMin} to ${targetMax} words, approximately 1-3 simple sentences).
- BE EXTREMELY GENTLE, ENCOURAGING, AND WARM!
- Celebrate any attempt to write words and form basic sentences (e.g., "I like cats", "My dog is brown").
- Grade generously: assign scores between 80 and 95 for sincere beginner attempts.
- Do NOT deduct for simple vocabulary or brevity if they wrote about the topic.
- HOWEVER, CAPITAL LETTERS AND SPELLING ARE ESSENTIAL FOUNDATION RULES:
  * You MUST check and correct EVERY capitalization error (missing capital letter at line/sentence start, lowercase "i", letter closings like "by" -> "Bye,").
  * Mark them in "corrections" with "category": "capitalization".
- In Hebrew feedback, write warm, enthusiastic praise ("כל הכבוד!", "התחלה נהדרת!"), while clearly explaining the capital letter rule so they acquire the habit immediately.`;
    } else if (currentLevel === "Level 3") {
      levelPedagogyGuidance = `
STUDENT AUDIENCE PROFILE: LEVEL 3 (ADVANCED / ELEMENTARY NATIVE / HIGH SCHOOL BAGRUT PREP):
- Target word count is ${targetMin} to ${targetMax} words.
- Evaluate according to the advanced Israeli Ministry of Education (Mafmar) Writing Rubric (CEFR B1-B2 standard).
- Assess with high standards for expressive vocabulary (Band III), creative details, varied sentence structures, and fluid transitions.
- Offer constructive, insightful advice on style, depth of thought, and paragraph flow.`;
    } else {
      levelPedagogyGuidance = `
STUDENT AUDIENCE PROFILE: LEVEL 2 (ISRAELI MIDDLE SCHOOL / חטיבת ביניים / AGES 13-15):
- Target word count is ${targetMin} to ${targetMax} words.
- Evaluate strictly according to the official Israeli Ministry of Education (Mafmar) Writing Rubric (CEFR A2-B1 standard).
- Balance constructive rigor with supportive encouragement.
- Focus on paragraph coherence, connectors (because, although, for example, first, finally), Band II vocabulary, and correct basic tenses.`;
    }

    const systemPrompt = `You are an expert Israeli English teacher and Ministry of Education (משרד החינוך / מפמ"ר אנגלית) pedagogical evaluator.
You evaluate student writing with pedagogical wisdom, warm encouragement, and exact adherence to the official Israeli English Curriculum Writing Rubric.

${levelPedagogyGuidance}

TASK DETAILS:
- Student Level: "${currentLevel}"
- Task Title: "${taskTitle || "Writing Task"}"
- Prompt given to student: "${prompt || "Write an essay in English."}"
- Category: "${category || "general"}"
- Target word count: ${targetMin} to ${targetMax} words.

STUDENT ESSAY TO EVALUATE:
"""
${essayText}
"""

CORE ISRAELI PEDAGOGICAL EVALUATION PRINCIPLES:
1. PEDAGOGICAL VOICE ("משוב סנדוויץ'"):
   - Speak in the voice of a devoted, supportive Israeli English teacher.
   - Use warm, encouraging, respectful Hebrew ("כל הכבוד על ההשקעה", "רעיון מעניין מאוד").
   - Highlight genuine strengths first, followed by clear, actionable explanations of rules for improvement, ending with motivating guidance.

2. MANDATORY CAPITAL LETTER EVALUATION (חוקי אותיות גדולות וקטנות - Capitalization - חובה בכל הרמות!):
   You MUST rigorously evaluate and report ALL capitalization errors in "corrections" with "category": "capitalization":
   a) Missing Capital Letters:
      - Line & Sentence Openings: The first letter of every line, sentence, paragraph, letter greeting ("Dear Friend,"), or letter closing (e.g., "by" MUST be corrected to "Bye," with a Capital letter!) MUST be capitalized.
      - The Pronoun "I": The word "i" MUST always be written as a capital "I", never lowercase "i".
      - Letter closings: "by" / "bye" must be corrected to "Bye," or "By,".
      - Proper Nouns: Names of people, places, languages, days of the week, months.
   b) Unnecessary / Erroneous Capital Letters:
      - Words inside a sentence that are NOT proper nouns must NOT start with a capital letter (e.g. "at my Home" -> "home", "I love Cats" -> "cats").
   c) Clear Hebrew Rule Explanations:
      - For line/sentence/closing opening: "באנגלית, כל משפט, פתיחה וברכת סיום (כמו Bye) חייבים להתחיל באות גדולה (Capital letter)."
      - For "I": "באנגלית, כינוי הגוף 'I' (אני) נכתב תמיד באות גדולה בכל מקום במשפט."
      - For random capitals: "באנגלית, שמות עצם רגילים באמצע משפט נכתבים באותיות קטנות (Lowercase)."

3. ISRAELI EFL INTERFERENCE DETECTION (שגיאות תרגום ודקדוק אופייניות לדוברי עברית):
   - Actively identify common Hebrew-transfer patterns:
     * Missing auxiliary verb / "to be" (*"He very tall"* -> *"He is very tall"*).
     * Literal translations & false collocations (*"make a party"* -> *"have a party"*, *"do sport"* -> *"exercise / play sports"*, *"I am agree"* -> *"I agree"*, *"open the light"* -> *"turn on the light"*).
     * Preposition interference (*"congratulations for"* -> *"congratulations on"*, *"listen music"* -> *"listen to music"*, *"wait to"* -> *"wait for"*).
     * Word order / double negatives (*"I don't know nothing"* -> *"I don't know anything"*).
     * Tense confusion (e.g. using Present Simple for an event that happened in the past).
   - In "corrections", specify the category: "capitalization", "grammar", "vocabulary", "spelling", "punctuation", or "hebrew_interference".
   - Provide a concise Hebrew explanation that teaches the rule, not just the correction.

4. VOCABULARY BAND ELEVATION (שדרוג אוצר מילים):
   - Identify 2-3 words the student used and suggest enriched, higher-register Band synonyms suitable for their level (e.g. "good" -> "wonderful / effective", "bad" -> "unpleasant / harmful", "big" -> "huge / vast").
   - Provide clear Hebrew explanations for each upgrade in "vocabularyUpgrades".

5. OFFICIAL MOE 4-PILLAR RUBRIC SCORING (Sum to 100):
   - Content and Organization (תוכן ומבנה - max 35): Did the student answer the prompt? Is there logical progression and appropriate transitional connectors (First, Also, However, In addition, In conclusion)?
   - Vocabulary (אוצר מילים - max 25): Lexical range, accuracy, appropriate Band level (Band I/II/III), avoidance of unnecessary repetition.
   - Language and Grammar (דקדוק ומבנה משפטים - max 25): Accurate tenses, Subject-Verb agreement, sentence structures (simple, compound, complex).
   - Mechanics, Spelling & Punctuation (מכניקה ואיות - max 15): Capitalization (sentence start, "I", proper nouns, closing formulas), punctuation (periods, commas, apostrophes), spelling. Deduct points if there are capitalization mistakes!

6. SPAM / GIBBERISH / CHEATING FILTER:
   - If the text is pure spam, repeated words ("because because because"), or random characters, set "isSpamOrGibberish": true, assign total score 10-20, and explain gently in Hebrew.

Return ONLY a valid, raw JSON object matching this exact schema (NO MARKDOWN CODE FENCES, NO TICKS):
{
  "score": number (0-100, exact sum of the 4 rubric categories),
  "isSpamOrGibberish": boolean,
  "encouragement": "One-line inspiring headline in Hebrew (e.g. 'עבודה מצוינת עם שימוש עשיר במילות קישור!')",
  "teacherNote": "A warm, personal 2-3 sentence paragraph in Hebrew from the teacher summarizing the student's work and giving holistic pedagogical feedback.",
  "strengths": ["נקודת חוזק ספציפית 1 בעברית", "נקודת חוזק ספציפית 2 בעברית"],
  "tips": ["טיפ ממוקד ויישומי 1 בעברית לפעם הבאה", "טיפ ממוקד 2 בעברית"],
  "rubric": {
    "contentAndOrganization": { "score": number (0-35), "max": 35, "commentHebrew": "הערכת תוכן ומבנה בעברית" },
    "vocabulary": { "score": number (0-25), "max": 25, "commentHebrew": "הערכת אוצר מילים בעברית", "bandLevelObserved": "Band II" },
    "languageAndGrammar": { "score": number (0-25), "max": 25, "commentHebrew": "הערכת דקדוק ומבנה משפטים בעברית" },
    "mechanicsAndSpelling": { "score": number (0-15), "max": 15, "commentHebrew": "הערכת פיסוק, אותיות גדולות ואיות בעברית" }
  },
  "corrections": [
    {
      "original": "exact problematic phrase from student",
      "suggestion": "corrected English phrasing",
      "explanationHebrew": "הסבר פדגוגי בעברית של כלל הדקדוק או האותיות הגדולות",
      "category": "capitalization"
    }
  ],
  "vocabularyUpgrades": [
    {
      "original": "simple word student used",
      "enriched": "higher-register Band alternative",
      "explanationHebrew": "הסבר קצר בעברית מדוע המילה הזו משדרגת את החיבור"
    }
  ],
  "hebrewInterferenceNotes": [
    "הערה ממוקדת בעברית על דפוס תרגום שכיח מעברית (במידה וזוהה)"
  ]
}`;

    // Cascade Priority Execution Steps
    const cascadePlan: Array<{
      provider: "groq" | "gemini" | "openai";
      model: string;
      execute: () => Promise<string>;
    }> = [];

    // 1. Groq Flagship: openai/gpt-oss-120b (120B powerhouse, ultra-fast & high reasoning)
    if (groqApiKey) {
      cascadePlan.push({
        provider: "groq",
        model: "openai/gpt-oss-120b",
        execute: async () => {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
              model: "openai/gpt-oss-120b",
              messages: [{ role: "user", content: systemPrompt }],
              response_format: { type: "json_object" },
              temperature: 0.1,
            }),
          });
          if (!res.ok) throw new Error(`Groq 120b status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });

      // Groq High-Performance Backup: llama-3.3-70b-versatile
      cascadePlan.push({
        provider: "groq",
        model: "llama-3.3-70b-versatile",
        execute: async () => {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [{ role: "user", content: systemPrompt }],
              response_format: { type: "json_object" },
              temperature: 0.1,
            }),
          });
          if (!res.ok) throw new Error(`Groq 70b status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });
    }

    // 2. Google Gemini: gemini-2.5-flash / gemini-3.5-flash
    if (geminiApiKey) {
      for (const gemModel of ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-1.5-flash"]) {
        cascadePlan.push({
          provider: "gemini",
          model: gemModel,
          execute: async () => {
            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${gemModel}:generateContent?key=${geminiApiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: systemPrompt }] }],
                  generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.1,
                  },
                }),
              }
            );
            if (!res.ok) throw new Error(`Gemini ${gemModel} status ${res.status}: ${await res.text()}`);
            const data = await res.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          },
        });
      }
    }

    // 3. Groq Fast Backup: qwen/qwen3.8-27b
    if (groqApiKey) {
      cascadePlan.push({
        provider: "groq",
        model: "qwen/qwen3.8-27b",
        execute: async () => {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
              model: "qwen/qwen3.8-27b",
              messages: [{ role: "user", content: systemPrompt }],
              response_format: { type: "json_object" },
              temperature: 0.1,
            }),
          });
          if (!res.ok) throw new Error(`Groq qwen3.8-27b status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });
    }

    // 4. OpenAI: gpt-4o-mini (if OpenAI key provided)
    if (openaiApiKey) {
      cascadePlan.push({
        provider: "openai",
        model: "gpt-4o-mini",
        execute: async () => {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: systemPrompt }],
              response_format: { type: "json_object" },
              temperature: 0.1,
            }),
          });
          if (!res.ok) throw new Error(`OpenAI gpt-4o-mini status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });
    }

    // Execute cascade
    for (const step of cascadePlan) {
      try {
        const rawOutput = await step.execute();
        if (rawOutput) {
          const parsed = extractJsonFromText(rawOutput) as WritingEvaluationResult;
          if (parsed && typeof parsed.score === "number") {
            // Rigorously enforce capitalization checks across all levels
            parsed.corrections = ensureCapitalizationChecks(essayText, parsed.corrections || [], currentLevel);

            const hasCapitalIssue = (parsed.corrections || []).some((c) => c.category === "capitalization");
            if (hasCapitalIssue && parsed.rubric?.mechanicsAndSpelling) {
              if (parsed.rubric.mechanicsAndSpelling.score >= parsed.rubric.mechanicsAndSpelling.max) {
                parsed.rubric.mechanicsAndSpelling.score = Math.max(1, parsed.rubric.mechanicsAndSpelling.score - 2);
              }
              if (!parsed.rubric.mechanicsAndSpelling.commentHebrew.includes("אותיות גדולות")) {
                parsed.rubric.mechanicsAndSpelling.commentHebrew += " (שימו לב לשימוש באותיות גדולות בתחילת משפט ובסיום).";
              }
            }

            // Ensure rubric sum matches total score if needed
            const r = parsed.rubric;
            if (r) {
              const calcSum =
                (r.contentAndOrganization?.score || 0) +
                (r.vocabulary?.score || 0) +
                (r.languageAndGrammar?.score || 0) +
                (r.mechanicsAndSpelling?.score || 0);
              if (calcSum > 0 && Math.abs(calcSum - parsed.score) > 3) {
                parsed.score = Math.min(100, Math.max(0, calcSum));
              }
            }

            return NextResponse.json({
              success: true,
              evaluation: parsed,
              source: `${step.provider}:${step.model}`,
            });
          }
        }
      } catch (err: any) {
        console.warn(`Evaluation failed on ${step.provider}:${step.model}:`, err?.message || err);
      }
    }

    // 5. Fallback Heuristic Rubric (if no AI keys or all models timed out)
    const words = essayText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
    const vocabDiversity = uniqueWords.size / Math.max(1, wordCount);

    let contentScore = Math.min(35, Math.round((wordCount / Math.max(1, targetMin)) * 28));
    if (wordCount >= targetMin && wordCount <= targetMax + 20) contentScore = 32;

    let vocabScore = Math.round(vocabDiversity * 25);
    if (vocabScore > 24) vocabScore = 22;

    let grammarScore = 21;
    if (/\bi\b/.test(essayText)) grammarScore -= 4; // lowercase 'i' penalty
    if (!/[.?!]/.test(essayText)) grammarScore -= 5; // missing sentence punctuation

    let mechanicsScore = 13;
    if (/[A-Z]/.test(essayText)) mechanicsScore += 2;

    const totalScore = Math.min(100, Math.max(25, contentScore + vocabScore + grammarScore + mechanicsScore));

    const fallbackResult: WritingEvaluationResult = {
      score: totalScore,
      isSpamOrGibberish: false,
      encouragement: "החיבור נבדק לפי עקרונות מחוון משרד החינוך (בדיקה פדגוגית בסיסית).",
      teacherNote: `כל הכבוד על ההשקעה בכתיבת החיבור! כתבת ${wordCount} מילים מתוך יעד של ${targetMin}–${targetMax} מילים. כדי לקבל משוב מפורט ומעמיק יותר עם הצעות שדרוג לשוניות, מומלץ לחבר מפתח AI (Groq או Gemini) בהגדרות.`,
      strengths: [
        `אורך החיבור: ${wordCount} מילים (יעד המטלה: ${targetMin}–${targetMax} מילים).`,
        vocabDiversity > 0.6
          ? "שימוש באוצר מילים מגוון ללא חזרות מיותרות."
          : "העברת רעיון ברור בשפה מובנת.",
      ],
      tips: [
        "הקפידו לפתוח כל משפט באות גדולה (Capital letter) ולסיים בנקודה.",
        "שלבו מילות קישור כגון: Also, Because, In addition, For example כדי לחבר בין הרעיונות.",
      ],
      rubric: {
        contentAndOrganization: {
          score: contentScore,
          max: 35,
          commentHebrew: `התאמה למטלה ומבנה: ${contentScore}/35`,
        },
        vocabulary: {
          score: vocabScore,
          max: 25,
          commentHebrew: `עושר וגיוון באוצר המילים: ${vocabScore}/25`,
          bandLevelObserved: currentLevel === "Level 1" ? "Band I" : currentLevel === "Level 3" ? "Band III" : "Band II",
        },
        languageAndGrammar: {
          score: grammarScore,
          max: 25,
          commentHebrew: `תחביר ומבנה משפטים: ${grammarScore}/25`,
        },
        mechanicsAndSpelling: {
          score: mechanicsScore,
          max: 15,
          commentHebrew: `פיסוק, אותיות גדולות ואיות: ${mechanicsScore}/15`,
        },
      },
      corrections: ensureCapitalizationChecks(
        essayText,
        [],
        currentLevel
      ),
      vocabularyUpgrades: [
        {
          original: "good",
          enriched: "wonderful / great",
          explanationHebrew: "שימוש במילים מגוונות ועשירות יותר מעלה את רמת הכתיבה שלך במחוון.",
        },
      ],
    };

    return NextResponse.json({
      success: true,
      evaluation: fallbackResult,
      source: "heuristic_fallback",
    });
  } catch (error) {
    console.error("Error in evaluate-writing API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate essay." },
      { status: 500 }
    );
  }
}
