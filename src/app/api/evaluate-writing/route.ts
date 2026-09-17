import { NextResponse } from "next/server";

export interface RubricCategoryScore {
  score: number; // 0 to max
  max: number;
  commentHebrew: string;
}

export interface WritingEvaluationResult {
  score: number; // 0 to 100
  encouragement: string;
  isSpamOrGibberish: boolean;
  strengths: string[];
  tips: string[];
  rubric: {
    contentAndOrganization: RubricCategoryScore; // 30%
    vocabulary: RubricCategoryScore; // 25%
    languageAndGrammar: RubricCategoryScore; // 25%
    mechanicsAndSpelling: RubricCategoryScore; // 20%
  };
  corrections?: Array<{
    original: string;
    suggestion: string;
    explanationHebrew: string;
  }>;
}

// Quick deterministic anti-spam & gibberish detector
function detectObviousSpam(text: string, minWords: number): WritingEvaluationResult | null {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const cleanWords = lowerWords.filter((w) => w.length > 0);

  if (cleanWords.length < 5) {
    return {
      score: 10,
      encouragement: "החיבור קצרצר ביותר (פחות מ-5 מילים). יש לכתוב פסקה שלמה באנגלית.",
      isSpamOrGibberish: true,
      strengths: [],
      tips: [
        "אנא כתבו לפחות פסקה אחת בת מספר משפטים באנגלית מלאה.",
        `יעד המילים למשימה זו הוא לפחות ${minWords} מילים.`,
      ],
      rubric: {
        contentAndOrganization: { score: 2, max: 30, commentHebrew: "החיבור קצר מדי ולא מפתח רעיון." },
        vocabulary: { score: 3, max: 25, commentHebrew: "אוצר מילים לא מספק." },
        languageAndGrammar: { score: 3, max: 25, commentHebrew: "אין משפטים שלמים לבדיקה." },
        mechanicsAndSpelling: { score: 2, max: 20, commentHebrew: "קצר מדי להערכה." },
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

  // If a single word makes up > 35% of all words, or unique ratio is under 30% for a text with > 15 words
  if (cleanWords.length >= 15 && (maxFreqRatio > 0.35 || uniqueRatio < 0.3)) {
    const mostRepeatedWord = Object.entries(frequencies).find(([, count]) => count === maxFreq)?.[0] || "מילה";
    return {
      score: 15,
      encouragement: "זוהתה חזרתיות קיצונית על אותן מילים ללא משפטים בעלי משמעות.",
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
          max: 30,
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
          max: 20,
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
      isSpamOrGibberish: true,
      strengths: [],
      tips: [
        "אנא כתבו מילים אמיתיות באנגלית.",
        "השתמשו במילון המובנה במידת הצורך למציאת מילים מתאימות.",
      ],
      rubric: {
        contentAndOrganization: { score: 2, max: 30, commentHebrew: "אין תוכן בעל משמעות." },
        vocabulary: { score: 2, max: 25, commentHebrew: "מילים בלתי מזוהות או סימנים." },
        languageAndGrammar: { score: 3, max: 25, commentHebrew: "אין משפטים תקינים." },
        mechanicsAndSpelling: { score: 3, max: 20, commentHebrew: "רצפי תווים ללא משמעות." },
      },
    };
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { essayText, taskTitle, prompt, category, minWords, maxWords } = body;

    if (!essayText || typeof essayText !== "string" || essayText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing essay text." },
        { status: 400 }
      );
    }

    const targetMin = typeof minWords === "number" ? minWords : 40;
    const targetMax = typeof maxWords === "number" ? maxWords : 80;

    // Fast deterministic spam filter
    const spamCheck = detectObviousSpam(essayText, targetMin);
    if (spamCheck) {
      return NextResponse.json({
        success: true,
        evaluation: spamCheck,
        source: "rule_engine",
      });
    }

    // Get API Keys
    const groqApiKey = request.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY;
    const geminiApiKey = request.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY;

    // Strict pedagogical system prompt
    const systemPrompt = `You are a strict yet encouraging, expert English teacher evaluating middle school student writing according to the official Israeli Ministry of Education (Mafmar) Writing Rubric.

TASK DETAILS:
- Task: "${taskTitle || "Writing Task"}"
- Prompt given to student: "${prompt || "Write a paragraph in English."}"
- Category: "${category || "general"}"
- Expected word count: ${targetMin} to ${targetMax} words.

STUDENT ESSAY TO EVALUATE:
"""
${essayText}
"""

CRITICAL INSTRUCTIONS:
1. SPAM / GIBBERISH / TRICK DETECTION:
   - If the student simply repeated words (like "because because because", "First of all First of all"), or copied filler text without coherent sentences, or wrote meaningless gibberish, YOU MUST assign a score between 0 and 20, set "isSpamOrGibberish": true, and clearly explain in Hebrew why this is invalid.
2. MINISTRY OF EDUCATION RUBRIC (Total 100 points):
   - Content & Organization (max 30): Did they answer the prompt? Is there logical flow, opening, development, and conclusion?
   - Vocabulary (max 25): Appropriate middle school words, variety of words, correct usage, absence of excessive repetition.
   - Language & Grammar (max 25): Correct verb tenses, subject-verb agreement, sentence structure (not just isolated phrases).
   - Mechanics & Spelling (max 20): Capitalization (including capital 'I'), punctuation (. , ? !), and spelling.
3. CONSTRUCTIVE HEBREW FEEDBACK:
   - "strengths": 2-3 specific real positive points in Hebrew (if spam, leave empty).
   - "tips": 2-3 specific constructive tips in Hebrew for how to improve.
   - "corrections": 1 to 4 specific sentence or grammar corrections showing the original text, corrected text, and brief Hebrew explanation.

Return ONLY a valid, raw JSON object matching this schema (NO MARKDOWN CODE BLOCKS, NO TICKS):
{
  "score": number (0-100, exact sum of the 4 rubric categories),
  "isSpamOrGibberish": boolean,
  "encouragement": "A warm, natural 1-sentence headline in Hebrew reflecting their actual level.",
  "strengths": ["נקודת חוזק 1 בעברית", "נקודת חוזק 2 בעברית"],
  "tips": ["טיפ ממוקד 1 בעברית", "טיפ ממוקד 2 בעברית"],
  "rubric": {
    "contentAndOrganization": { "score": number (0-30), "max": 30, "commentHebrew": "הסבר בעברית" },
    "vocabulary": { "score": number (0-25), "max": 25, "commentHebrew": "הסבר בעברית" },
    "languageAndGrammar": { "score": number (0-25), "max": 25, "commentHebrew": "הסבר בעברית" },
    "mechanicsAndSpelling": { "score": number (0-20), "max": 20, "commentHebrew": "הסבר בעברית" }
  },
  "corrections": [
    {
      "original": "exact problematic sentence or phrase from student essay",
      "suggestion": "corrected English sentence",
      "explanationHebrew": "הסבר קצר בעברית מדוע התיקון נדרש"
    }
  ]
}`;

    // 1. Try Groq (Llama 3.3 70B / 120B)
    if (groqApiKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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

        if (groqRes.ok) {
          const data = await groqRes.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            const cleanContent = content.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
            const parsed = JSON.parse(cleanContent) as WritingEvaluationResult;
            return NextResponse.json({ success: true, evaluation: parsed, source: "groq" });
          }
        }
      } catch (err) {
        console.warn("Groq evaluation failed, trying Gemini:", err);
      }
    }

    // 2. Try Gemini 2.5/3.5 Flash
    if (geminiApiKey) {
      const geminiModels = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-1.5-flash"];
      for (const model of geminiModels) {
        try {
          const gemRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
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

          if (gemRes.ok) {
            const data = await gemRes.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              const cleanText = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
              const parsed = JSON.parse(cleanText) as WritingEvaluationResult;
              return NextResponse.json({ success: true, evaluation: parsed, source: "gemini" });
            }
          }
        } catch {
          // try next model
        }
      }
    }

    // 3. Fallback Heuristic Rubric (if no AI keys or offline)
    const words = essayText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const lower = essayText.toLowerCase();

    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
    const vocabDiversity = uniqueWords.size / Math.max(1, wordCount);

    let contentScore = Math.min(30, Math.round((wordCount / Math.max(1, targetMin)) * 24));
    if (wordCount >= targetMin && wordCount <= targetMax + 20) contentScore = 28;

    let vocabScore = Math.round(vocabDiversity * 25);
    if (vocabScore > 24) vocabScore = 23;

    let grammarScore = 20;
    if (/\bi\b/.test(essayText)) grammarScore -= 4; // lowercase 'i' penalty
    if (!/[.?!]/.test(essayText)) grammarScore -= 6; // missing sentence punctuation

    let mechanicsScore = 17;
    if (/[A-Z]/.test(essayText)) mechanicsScore += 2;

    const totalScore = Math.min(100, Math.max(25, contentScore + vocabScore + grammarScore + mechanicsScore));

    const fallbackResult: WritingEvaluationResult = {
      score: totalScore,
      isSpamOrGibberish: false,
      encouragement: "החיבור נבדק לפי מחוון משרד החינוך (בדיקה פדגוגית בסיסית).",
      strengths: [
        `אורך החיבור: ${wordCount} מילים (יעד: ${targetMin}–${targetMax} מילים).`,
        vocabDiversity > 0.6
          ? "מגוון מילים יפה ללא חזרתיות מיותרת."
          : "השתמשת במילים ברורות להעברת המסר.",
      ],
      tips: [
        "מומלץ לחבר מפתח AI (Groq/Gemini) לקבלת ניתוח תחבירי עמוק והצעות ניסוח מדויקות.",
        "הקפידו על פתיחת כל משפט באות גדולה (Capital letter) וסיום בנקודה.",
      ],
      rubric: {
        contentAndOrganization: {
          score: contentScore,
          max: 30,
          commentHebrew: `התאמה למטלה ומבנה: ${contentScore}/30`,
        },
        vocabulary: {
          score: vocabScore,
          max: 25,
          commentHebrew: `עושר וגיוון במילים: ${vocabScore}/25`,
        },
        languageAndGrammar: {
          score: grammarScore,
          max: 25,
          commentHebrew: `תחביר ומבנה משפטים: ${grammarScore}/25`,
        },
        mechanicsAndSpelling: {
          score: mechanicsScore,
          max: 20,
          commentHebrew: `פיסוק, אותיות גדולות ואיות: ${mechanicsScore}/20`,
        },
      },
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
