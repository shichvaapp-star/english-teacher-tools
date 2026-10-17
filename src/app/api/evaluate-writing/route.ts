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
- Celebrate any attempt to write words and form basic sentences (e.g., "I like cats", "My dog is brown", "He is my best friend").
- Grade generously: assign total scores between 86 and 95 for sincere beginner attempts answering the task.
- Do NOT deduct points for simple vocabulary or brevity if they wrote about the topic.
- CAPITAL LETTERS & SPELLING:
  * Flag capitalization errors in "corrections" with "category": "capitalization" so students learn the rule.
  * In the mechanics rubric score, deduct at most 1-2 points for beginner capitalization slips; keep total score in the 86-95 range!
- In Hebrew feedback, write warm, enthusiastic praise ("כל הכבוד!", "התחלה נהדרת!").`;
    } else if (currentLevel === "Level 3") {
      levelPedagogyGuidance = `
STUDENT AUDIENCE PROFILE: LEVEL 3 (HIGH SCHOOL BAGRUT PREP / 4-5 POINTS / ADVANCED / CEFR B1-B2):
- Target word count is ${targetMin} to ${targetMax} words.
- Evaluate according to the official Israeli Ministry of Education (Mafmar) Bagrut Rubric.
- Baseline 85-91 for well-structured, coherent essays that address the prompt with good paragraph flow.
- EXCELLENT STUDENTS (0-2 minor slips, rich vocabulary, clear transitions): Award 92–98! Do NOT low-ball advanced Israeli students.
- Provide constructive, insightful advice on style, register, and transitions.`;
    } else {
      levelPedagogyGuidance = `
STUDENT AUDIENCE PROFILE: LEVEL 2 (ISRAELI MIDDLE SCHOOL / חטיבת ביניים / AGES 12-15 / CEFR A2-B1):
- Target word count is ${targetMin} to ${targetMax} words (typically one paragraph or short personal letter).
- PEDAGOGICAL ASSESSMENT PHILOSOPHY (COMMUNICATIVE COMPETENCE & NO LOW-BALLING):
  * In the Israeli school system, a score of 55 is the failing cutoff ("ציון נכשל"). A score in the 50s-60s is given ONLY to incomprehensible gibberish, severe language breakdown, or essays that completely ignore the task!
  * EXCELLENT STUDENTS (92–98): If a student writes a clear, coherent text that answers the prompt, is within or near target length, and has 0–2 minor slips, they MUST score 92–98! Never low-ball a good middle schooler to the 70s or 80s for not writing like an adult native speaker.
  * SOLID / GOOD EFFORT (84–90): Meets word count, clearly answers the prompt, uses basic tenses correctly, with 2–4 minor slips (e.g. simple sentence structures, minor capital letter slip).
  * Do NOT penalize Level 2 students for using everyday, level-appropriate words (e.g. "vacation", "beach", "pool", "food", "summer", "friend"). These are Core Band I and II words expected and praised at this age!
  * Do NOT expect adult, academic, or complex essay structures. Simple sentences connected logically (e.g., "First, we went...", "We ate a lot of food...") are completely appropriate for middle school.
  * PROPORTIONAL DEDUCTIONS ONLY:
    - 0 to 1 minor slip: Deduct at most 0–1 point in Mechanics (giving 14-15/15), total score 94–98!
    - 2 to 3 minor slips: Deduct at most 2 to 3 points in Mechanics (giving 12-13/15), total score 85–91.
    - Minor sentence boundary slips (e.g. "in Tailand. with my family") should ONLY deduct 2-3 points in Grammar (giving 21-23/25).`;
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
      - 33–35 (Very Good / Excellent - מעולה): Task is fully addressed; all parts of the prompt are answered; ideas are clear, relevant, and well organized; text is within or close to target word count (${targetMin}–${targetMax} words).
      - 28–32 (Good / Proficient - טוב מאוד): Task is mostly addressed; main ideas are clear; minor organizational gaps or slight length shortfall.
      - 20–27 (Adequate - בינוני): Task is only partially addressed; ideas are limited or repetitive; lacks organizational structure.
      - 10–19 (Limited - טעון שיפור): Barely addresses the prompt; off-topic; severe length shortfall.
      - 0–9 (Inadequate - לא מספק): Irrelevant or empty text.

   B. Vocabulary (אוצר מילים - max 25):
      - 23–25 (Very Good / Excellent - מעולה): Vocabulary is fully appropriate and natural for the student's level (Band I/II for Level 1-2; Band II/III for Level 3); clearly conveys the intended meaning. Everyday words (beach, pool, food, vacation, summer) are expected and welcome at Level 2!
      - 19–22 (Good / Proficient - טוב מאוד): Appropriate vocabulary for the level; message is easily understood; few minor inaccuracies or occasional repetition.
      - 14–18 (Adequate - בינוני): Limited vocabulary with noticeable repetition; some Hebrew-transfer word choices, but meaning is still decipherable.
      - 8–13 (Limited - טעון שיפור): Severely restricted or inaccurate vocabulary obscuring meaning.
      - 0–7 (Inadequate - לא מספק): Complete lack of meaningful vocabulary.

   C. Language and Grammar (דקדוק ומבנה משפטים - max 25):
      - 23–25 (Very Good / Excellent - מעולה): Basic sentence structures and tenses are correct for the context (e.g. past tense used for a past vacation: "went", "ate", "was"); 0-1 minor slips that do not impede understanding at all.
      - 19–22 (Good / Proficient - טוב מאוד): Sentences are mostly grammatical; basic tenses are largely correct; 2-4 minor slips in prepositions, articles, or sentence boundaries (e.g. fragment).
      - 14–18 (Adequate - בינוני): Frequent grammar errors (e.g. wrong tenses, subject-verb agreement issues), but the reader can still follow the meaning.
      - 8–13 (Limited - טעון שיפור): Severe grammatical breakdown that makes multiple sentences hard to understand.
      - 0–7 (Inadequate - לא מספק): No recognizable English syntax.

   D. Mechanics, Spelling & Punctuation (מכניקה, אותיות גדולות ואיות - max 15):
      - 14–15 (Very Good / Excellent - מעולה): Near-flawless mechanics; at most 0–1 minor slip. Meaning is completely unobstructed.
      - 11–13 (Good / Proficient - טוב מאוד): 2–4 minor spelling or capitalization slips (e.g., phonetic spelling like "Tailand", a capitalization slip like "HI", or a punctuation slip). The text remains easily readable. Deduct only 2–4 points total!
      - 7–10 (Adequate - בינוני): Frequent errors in capitalization, punctuation, or spelling across multiple sentences.
      - 4–6 (Limited - טעון שיפור): Pervasive spelling and punctuation errors making reading difficult.
      - 0–3 (Inadequate - לא מספק): Complete absence of mechanics.

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
            // Ensure no unfair low-balling of Israeli students in accordance with Ministry of Education standards.
            const essayWords = essayText.trim().split(/\s+/).filter(Boolean);
            const numWords = essayWords.length;
            const correctionCount = (parsed.corrections || []).length;
            const isWordCountAdequate =
              currentLevel === "Level 1"
                ? numWords >= Math.min(targetMin * 0.7, 7)
                : numWords >= Math.min(targetMin * 0.75, 25);

            const cleanWords = essayWords.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")).filter((w) => w.length > 0);
            const richWordsCount = cleanWords.filter((w) => w.length >= 7).length;

            if (!parsed.isSpamOrGibberish && isWordCountAdequate && parsed.rubric) {
              const r = parsed.rubric;

              if (currentLevel === "Level 1") {
                if (r.contentAndOrganization) r.contentAndOrganization.score = Math.max(r.contentAndOrganization.score, 32);
                if (r.vocabulary) r.vocabulary.score = Math.max(r.vocabulary.score, 23);
                if (r.languageAndGrammar) r.languageAndGrammar.score = Math.max(r.languageAndGrammar.score, 23);
                if (r.mechanicsAndSpelling) r.mechanicsAndSpelling.score = Math.max(r.mechanicsAndSpelling.score, 14);
              } else {
                const isHighAchiever =
                  (currentLevel === "Level 3" ? richWordsCount >= 8 : richWordsCount >= 6 && numWords >= targetMin * 1.3) &&
                  correctionCount <= 1;

                if (isHighAchiever) {
                  // Profile A: High Achiever (94-98)
                  if (r.contentAndOrganization) {
                    r.contentAndOrganization.score = Math.max(r.contentAndOrganization.score, 34);
                  }
                  if (r.vocabulary) r.vocabulary.score = Math.max(r.vocabulary.score, 24);
                  if (r.languageAndGrammar) r.languageAndGrammar.score = Math.max(r.languageAndGrammar.score, 24);
                  if (r.mechanicsAndSpelling) {
                    r.mechanicsAndSpelling.score = Math.max(r.mechanicsAndSpelling.score, correctionCount === 0 ? 15 : 14);
                  }
                } else if (correctionCount <= 3 && numWords >= targetMin * 0.8) {
                  // Profile B: Solid Student / Good Effort (84-90)
                  if (r.contentAndOrganization) {
                    r.contentAndOrganization.score = Math.max(r.contentAndOrganization.score, 30);
                  }
                  if (r.vocabulary) r.vocabulary.score = Math.max(r.vocabulary.score, 21);
                  if (r.languageAndGrammar) r.languageAndGrammar.score = Math.max(r.languageAndGrammar.score, 21);
                  if (r.mechanicsAndSpelling) {
                    r.mechanicsAndSpelling.score = Math.max(r.mechanicsAndSpelling.score, 13);
                  }
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
    const cleanWords = words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")).filter((w) => w.length > 0);
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
    const vocabDiversity = uniqueWords.size / Math.max(1, wordCount);
    const corrections = ensureCapitalizationChecks(essayText, [], currentLevel);
    const correctionCount = corrections.length;
    const richWordsCount = cleanWords.filter((w) => w.length >= 7).length;

    let contentScore: number;
    let vocabScore: number;
    let grammarScore: number;
    let mechanicsScore: number;

    if (currentLevel === "Level 1") {
      // Elementary beginner learner (Profile C: 86-94)
      contentScore = wordCount >= targetMin ? 32 : Math.max(24, Math.round((wordCount / targetMin) * 30));
      vocabScore = 23;
      grammarScore = 23;
      mechanicsScore = 14;
    } else {
      const isHighAchiever =
        (currentLevel === "Level 3" ? richWordsCount >= 8 : richWordsCount >= 6 && wordCount >= targetMin * 1.3) &&
        correctionCount <= 1;

      if (isHighAchiever) {
        // Profile A: Rich development, Band II/III vocabulary, near flawless (95-98)
        contentScore = wordCount >= targetMin ? 35 : 34;
        vocabScore = 24;
        grammarScore = 24;
        mechanicsScore = correctionCount === 0 ? 15 : 14;
      } else {
        // Profile B: Solid student meeting prompt, everyday words (Band I), basic structures (84-90)
        contentScore = wordCount >= targetMin ? 31 : 28;
        vocabScore = 21;
        grammarScore = 21;
        mechanicsScore = correctionCount <= 1 ? 13 : 11;
      }
    }

    const totalScore = Math.min(100, Math.max(20, contentScore + vocabScore + grammarScore + mechanicsScore));

    const fallbackResult: WritingEvaluationResult = {
      score: totalScore,
      isSpamOrGibberish: false,
      encouragement:
        totalScore >= 92
          ? "עבודה מצוינת! כתיבה רהוטה ומאורגנת היטב לפי מחוון משרד החינוך 🌟"
          : totalScore >= 84
          ? "עבודה טובה מאוד! רעיון ברור ומענה יפה למטלה 👍"
          : "החיבור נבדק לפי עקרונות מחוון משרד החינוך (בדיקה פדגוגית בסיסית).",
      teacherNote:
        totalScore >= 92
          ? `כל הכבוד! כתבת ${wordCount} מילים בצורה בהירה ומשכנעת, תוך עמידה מושלמת ביעד המטלה (${targetMin}–${targetMax} מילים). המשך כך!`
          : `כל הכבוד על ההשקעה בכתיבת החיבור! כתבת ${wordCount} מילים מתוך יעד של ${targetMin}–${targetMax} מילים. החיבור מעביר את המסר בצורה טובה וברורה.`,
      strengths: [
        `אורך החיבור: ${wordCount} מילים (יעד המטלה: ${targetMin}–${targetMax} מילים).`,
        vocabDiversity > 0.55
          ? "שימוש באוצר מילים מגוון ומתאים לרמת הכיתה ללא חזרות מיותרות."
          : "העברת רעיון ברור בשפה מובנת ורציפה.",
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
      corrections,
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
