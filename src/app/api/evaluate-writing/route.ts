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

    // Calibrated pedagogical system prompt by student level
    let levelPedagogyGuidance = "";
    if (currentLevel === "Level 1") {
      levelPedagogyGuidance = `
STUDENT AUDIENCE PROFILE: LEVEL 1 (ELEMENTARY SCHOOL / BEGINNER / EARLY FOUNDATION - כיתות ד'-ו'):
- Target word count is very short (${targetMin} to ${targetMax} words, approximately 1-3 simple sentences).
- BE EXTREMELY GENTLE, ENCOURAGING, AND WARM!
- Celebrate any attempt to write words and form basic sentences (e.g., "I like cats", "My dog is brown").
- Grade generously: assign total scores between 85 and 95 for sincere beginner attempts.
- Do NOT deduct points for simple vocabulary or brevity if they wrote about the topic.
- CAPITAL LETTERS & SPELLING:
  * Flag capitalization errors in "corrections" with "category": "capitalization" so students learn the rule.
  * In the mechanics rubric score, deduct at most 1-2 points for beginner capitalization slips; keep total score in the 85-95 range!
- In Hebrew feedback, write warm, enthusiastic praise ("כל הכבוד!", "התחלה נהדרת!").`;
    } else if (currentLevel === "Level 3") {
      levelPedagogyGuidance = `
STUDENT AUDIENCE PROFILE: LEVEL 3 (HIGH SCHOOL BAGRUT PREP / 4-5 POINTS / ADVANCED / CEFR B1-B2):
- Target word count is ${targetMin} to ${targetMax} words.
- Evaluate according to the official Israeli Ministry of Education (Mafmar) Bagrut Rubric.
- Baseline 82-89 for well-structured, coherent essays that address the prompt with good paragraph flow.
- 90-100 for rich Band III vocabulary, varied sentence structures (compound/complex), and thoughtful elaboration.
- Provide constructive, insightful advice on style, register, and transitions.`;
    } else {
      levelPedagogyGuidance = `
STUDENT AUDIENCE PROFILE: LEVEL 2 (ISRAELI MIDDLE SCHOOL / חטיבת ביניים / AGES 12-15 / CEFR A2-B1):
- Target word count is ${targetMin} to ${targetMax} words (typically one paragraph or short personal letter).
- PEDAGOGICAL ASSESSMENT PHILOSOPHY (COMMUNICATIVE COMPETENCE):
  * In the Israeli school system, a score of 55 is the failing cutoff ("ציון נכשל"). A score in the 50s is given ONLY to incomprehensible gibberish, severe language breakdown, or essays that completely ignore the task!
  * If a student writes a coherent text that answers the prompt, falls within or near the target word count (${targetMin}–${targetMax} words), and uses correct basic past/present tenses, their BASELINE GRADE IS 80–89 (Good / Very Good)!
  * Do NOT penalize Level 2 students for using everyday, level-appropriate words (e.g. "vacation", "beach", "pool", "food", "summer", "friend"). These are Core Band I and II words expected and praised at this age!
  * Do NOT expect adult, academic, or complex essay structures. Simple sentences connected logically (e.g., "First, we went...", "We ate a lot of food...") are completely appropriate for middle school.
  * PROPORTIONAL DEDUCTIONS ONLY:
    - 1 to 3 minor slips (e.g., a phonetic spelling slip like "Tailand" for "Thailand", a capitalization slip like "HI", or an extra period) should ONLY deduct 2 to 3 points in Mechanics (giving 11-13/15), NEVER 8-9 points!
    - Minor sentence boundary slips (e.g. "in Tailand. with my family") should ONLY deduct 2-3 points in Grammar (giving 20-22/25).
  * High-scoring students (82-90) are those who communicated their message clearly and followed the task, even with a few typical middle-school learning slips.`;
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

2. MANDATORY CAPITAL LETTER & MECHANICS EVALUATION (חוקי אותיות גדולות ופיסוק):
   Report all capitalization errors in "corrections" with "category": "capitalization" so the student learns the rule:
   a) Missing Capital Letters:
      - Line & Sentence Openings: First letter of every sentence, paragraph, greeting ("Dear Friend,"), or closing ("Bye,").
      - The Pronoun "I": The word "i" MUST always be written as a capital "I".
      - Proper Nouns: Names of people, countries, cities, languages, days of the week, months.
   b) Unnecessary / Erroneous Capital Letters:
      - All-caps or capitalized common nouns mid-sentence (e.g. "HI" -> "Hi", "at my Home" -> "home").
   c) Clear Hebrew Rule Explanations:
      - "באנגלית, כל משפט, פתיחה וברכת סיום (כמו Bye) חייבים להתחיל באות גדולה (Capital letter)."
      - "באנגלית, כינוי הגוף 'I' (אני) נכתב תמיד באות גדולה בכל מקום במשפט."

3. ISRAELI EFL INTERFERENCE DETECTION (שגיאות תרגום ודקדוק אופייניות לדוברי עברית):
   - Actively identify common Hebrew-transfer patterns:
     * Missing auxiliary verb / "to be" (*"He very tall"* -> *"He is very tall"*).
     * Literal translations & false collocations (*"make a party"* -> *"have a party"*, *"do sport"* -> *"exercise / play sports"*, *"I am agree"* -> *"I agree"*).
     * Preposition interference (*"congratulations for"* -> *"congratulations on"*, *"listen music"* -> *"listen to music"*).
   - In "corrections", specify the category: "capitalization", "grammar", "vocabulary", "spelling", "punctuation", or "hebrew_interference".
   - Provide a concise Hebrew explanation that teaches the rule, not just the correction.

4. VOCABULARY BAND ELEVATION (שדרוג אוצר מילים):
   - Identify 2-3 words the student used and suggest enriched, higher-register Band synonyms suitable for their level (e.g. "good" -> "wonderful / enjoyable", "food" -> "delicious meals / dishes", "big" -> "huge / vast").
   - Provide clear Hebrew explanations for each upgrade in "vocabularyUpgrades".

5. OFFICIAL MOE 4-PILLAR RUBRIC SCORING & CALIBRATED SCORE BANDS (Sum to 100):
   Evaluate strictly using these pedagogical score bands. DO NOT judge against adult native English; judge against Israeli EFL grade-level expectations!

   A. Content and Organization (תוכן ומבנה - max 35):
      - 31–35 (Very Good / Excellent): Task is fully addressed; all parts of the prompt are answered; ideas are clear, relevant, and organized; text is within or close to target word count (${targetMin}–${targetMax} words).
      - 26–30 (Good / Proficient): Task is mostly addressed; main ideas are clear; minor organizational gaps or slight length shortfall.
      - 20–25 (Adequate): Task is only partially addressed; ideas are limited or repetitive; lacks organizational structure.
      - 10–19 (Limited): Barely addresses the prompt; off-topic; severe length shortfall.
      - 0–9 (Inadequate): Irrelevant or empty text.

   B. Vocabulary (אוצר מילים - max 25):
      - 22–25 (Very Good / Excellent): Vocabulary is fully appropriate and natural for the student's level (Band I/II for Level 1-2; Band II/III for Level 3); clearly conveys the intended meaning. Simple everyday words (beach, pool, food, vacation, summer) are expected and welcome at Level 2!
      - 18–21 (Good / Proficient): Appropriate vocabulary for the level; message is easily understood; few minor inaccuracies or occasional repetition.
      - 14–17 (Adequate): Limited vocabulary with noticeable repetition; some Hebrew-transfer word choices, but meaning is still decipherable.
      - 8–13 (Limited): Severely restricted or inaccurate vocabulary obscuring meaning.
      - 0–7 (Inadequate): Complete lack of meaningful vocabulary.

   C. Language and Grammar (דקדוק ומבנה משפטים - max 25):
      - 22–25 (Very Good / Excellent): Basic sentence structures and tenses are correct for the context (e.g. past tense used for a past vacation: "went", "ate", "was"); minor slips do not impede understanding at all.
      - 18–21 (Good / Proficient): Sentences are mostly grammatical; basic tenses are largely correct; a few minor slips in prepositions, articles, or sentence boundaries (e.g. fragment).
      - 14–17 (Adequate): Frequent grammar errors (e.g. wrong tenses, subject-verb agreement issues), but the reader can still follow the meaning.
      - 8–13 (Limited): Severe grammatical breakdown that makes multiple sentences hard to understand.
      - 0–7 (Inadequate): No recognizable English syntax.

   D. Mechanics, Spelling & Punctuation (מכניקה, אותיות גדולות ואיות - max 15):
      - 13–15 (Very Good / Excellent): Near-flawless mechanics; at most 1 minor slip. Meaning is completely unobstructed.
      - 10–12 (Good / Proficient): 2–4 minor spelling or capitalization slips (e.g., phonetic spelling like "Tailand", a capitalization slip like "HI", or a punctuation slip). The text remains easily readable. Deduct only 2–4 points total!
      - 7–9 (Adequate): Frequent errors in capitalization, punctuation, or spelling across multiple sentences.
      - 4–6 (Limited): Pervasive spelling and punctuation errors making reading difficult.
      - 0–3 (Inadequate): Complete absence of mechanics.

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

            // Pedagogical calibration sanity guardrail:
            // If the essay is NOT spam/gibberish, meets or approaches the target word count,
            // and has few corrections (<= 4 errors), prevent unfair LLM zero-tolerance penalization
            // to ensure alignment with Israeli Ministry of Education (MOE) grade standards.
            const essayWords = essayText.trim().split(/\s+/).filter(Boolean);
            const numWords = essayWords.length;
            const correctionCount = (parsed.corrections || []).length;
            const isWordCountAdequate = numWords >= Math.min(targetMin * 0.75, 25);

            if (!parsed.isSpamOrGibberish && isWordCountAdequate && parsed.rubric) {
              const r = parsed.rubric;

              // Mechanics: 1-3 minor slips in MOE guidelines should deduct at most 2-4 points (yielding 11-13/15)
              if (correctionCount <= 3 && r.mechanicsAndSpelling) {
                r.mechanicsAndSpelling.score = Math.max(r.mechanicsAndSpelling.score, 11);
              } else if (correctionCount <= 5 && r.mechanicsAndSpelling) {
                r.mechanicsAndSpelling.score = Math.max(r.mechanicsAndSpelling.score, 9);
              }

              // Content: If student fulfilled target length and wrote coherent sentences, baseline is at least Good (30+/35)
              if (numWords >= targetMin && r.contentAndOrganization) {
                r.contentAndOrganization.score = Math.max(r.contentAndOrganization.score, correctionCount <= 3 ? 30 : 28);
              } else if (numWords >= targetMin * 0.8 && r.contentAndOrganization) {
                r.contentAndOrganization.score = Math.max(r.contentAndOrganization.score, 26);
              }

              // Vocabulary & Grammar: If few errors exist, ensure baseline reflects Good / Proficient (20+/25)
              if (correctionCount <= 3) {
                if (r.vocabulary) {
                  r.vocabulary.score = Math.max(r.vocabulary.score, 20);
                }
                if (r.languageAndGrammar) {
                  r.languageAndGrammar.score = Math.max(r.languageAndGrammar.score, 20);
                }
              } else if (correctionCount <= 5) {
                if (r.vocabulary) {
                  r.vocabulary.score = Math.max(r.vocabulary.score, 17);
                }
                if (r.languageAndGrammar) {
                  r.languageAndGrammar.score = Math.max(r.languageAndGrammar.score, 17);
                }
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
              parsed.score = Math.min(100, Math.max(0, calcSum));
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

    let contentScore = Math.min(35, Math.round((wordCount / Math.max(1, targetMin)) * 30));
    if (wordCount >= targetMin && wordCount <= targetMax + 20) contentScore = 32;

    let vocabScore = Math.round(vocabDiversity * 25);
    if (vocabScore > 24) vocabScore = 22;
    if (vocabScore < 18 && wordCount >= 15) vocabScore = 19;

    let grammarScore = 21;
    if (/\bi\b/.test(essayText)) grammarScore -= 2; // lowercase 'i' penalty
    if (!/[.?!]/.test(essayText)) grammarScore -= 3; // missing sentence punctuation

    let mechanicsScore = 13;
    if (/[A-Z]/.test(essayText)) mechanicsScore += 1;
    if (mechanicsScore > 15) mechanicsScore = 14;

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
