import { NextResponse } from "next/server";
import { MSUnseenQuestion } from "@/data/unseen-middle-school";
import { UnseenEvaluationResult, UnseenQuestionEvaluation } from "@/types/unseen";

// Simple in-memory LRU cache for identical submissions (reduces load drastically)
const evaluationCache = new Map<string, { result: UnseenEvaluationResult; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// In-flight concurrency limiter to protect against upstream 429 rate-limiting
const MAX_CONCURRENT_AI_CALLS = 5;
let activeAiCalls = 0;
const waitQueue: Array<() => void> = [];

function acquireSlot(maxWaitMs = 4000): Promise<boolean> {
  if (activeAiCalls < MAX_CONCURRENT_AI_CALLS) {
    activeAiCalls++;
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    let timer: NodeJS.Timeout | null = null;

    const onSlotAvailable = () => {
      if (timer) clearTimeout(timer);
      activeAiCalls++;
      resolve(true);
    };

    timer = setTimeout(() => {
      // Remove from waitQueue if timed out
      const idx = waitQueue.indexOf(onSlotAvailable);
      if (idx !== -1) waitQueue.splice(idx, 1);
      resolve(false); // Signal that we should proceed with heuristic fallback
    }, maxWaitMs);

    waitQueue.push(onSlotAvailable);
  });
}

function releaseSlot(): void {
  activeAiCalls = Math.max(0, activeAiCalls - 1);
  if (waitQueue.length > 0) {
    const next = waitQueue.shift();
    if (next) next();
  }
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

// Helper: Normalize strings for fuzzy comparison
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Intelligent Heuristic Evaluator for Sentence Copying Questions
function evaluateCopyHeuristic(
  userAns: string,
  targetSentence?: string
): { points: number; isCorrect: boolean; feedbackHebrew: string } {
  if (!userAns || !userAns.trim()) {
    return {
      points: 0,
      isCorrect: false,
      feedbackHebrew: "לא נכתבה תשובה. יש להעתיק את המשפט המדויק מתוך הפסקה.",
    };
  }

  if (!targetSentence) {
    return {
      points: userAns.length > 10 ? 8 : 4,
      isCorrect: userAns.length > 10,
      feedbackHebrew: "המשפט שהועתק נבדק על בסיס הטקסט.",
    };
  }

  const cleanUser = normalizeString(userAns);
  const cleanTarget = normalizeString(targetSentence);

  if (cleanUser === cleanTarget) {
    return {
      points: 10,
      isCorrect: true,
      feedbackHebrew: "העתקה מושלמת ומדויקת מתוך הפסקה! כל הכבוד!",
    };
  }

  // Token Jaccard overlap
  const userTokens = new Set(cleanUser.split(" "));
  const targetTokens = new Set(cleanTarget.split(" "));
  const common = [...userTokens].filter((t) => targetTokens.has(t));
  const overlapRatio = common.length / Math.max(1, targetTokens.size);

  if (cleanTarget.includes(cleanUser) && userTokens.size >= 4) {
    return {
      points: 9,
      isCorrect: true,
      feedbackHebrew: "העתקת את החלק המרכזי והנכון מתוך המשפט! להבא כדאי להעתיק את המשפט המלא מתחילתו ועד סופו.",
    };
  }

  if (overlapRatio >= 0.65) {
    return {
      points: 9,
      isCorrect: true,
      feedbackHebrew: "המשפט הנכון זוהה והועתק בהצלחה!",
    };
  }

  if (overlapRatio >= 0.45) {
    return {
      points: 8,
      isCorrect: true,
      feedbackHebrew: "זיהוי יפה של האזור הנכון בטקסט ורוב המשפט הנדרש.",
    };
  }

  if (overlapRatio >= 0.3) {
    return {
      points: 5,
      isCorrect: false,
      feedbackHebrew: "הועתק חלק קטן מהרעיון, אך המשפט המלא והמדויק שונה.",
    };
  }

  return {
    points: 0,
    isCorrect: false,
    feedbackHebrew: `המשפט שהועתק אינו המשפט הנדרש מהפסקה. המשפט הנכון הוא: "${targetSentence}".`,
  };
}

// Intelligent Heuristic Evaluator for Open-Ended Questions
function evaluateOpenHeuristic(
  userAns: string,
  modelAnswer?: string,
  keywords?: string[]
): { points: number; isCorrect: boolean; feedbackHebrew: string } {
  if (!userAns || !userAns.trim() || userAns.trim().length < 2) {
    return {
      points: 0,
      isCorrect: false,
      feedbackHebrew: "לא נכתבה תשובה באנגלית לשאלה זו.",
    };
  }

  const cleanUser = normalizeString(userAns);
  const cleanModel = modelAnswer ? normalizeString(modelAnswer) : "";

  // Check for gibberish / single letters / spam
  const words = cleanUser.split(" ").filter(Boolean);
  if (words.length <= 1 && userAns.length < 4) {
    return {
      points: 2,
      isCorrect: false,
      feedbackHebrew: "התשובה קצרה מדי. יש לכתוב תשובה ברורה באנגלית.",
    };
  }

  // Check keyword matches
  const expectedKeywords = (keywords || [])
    .map((k) => k.toLowerCase().trim())
    .filter((k) => k.length > 2);

  let matchedKeywords = 0;
  for (const kw of expectedKeywords) {
    if (cleanUser.includes(kw)) {
      matchedKeywords++;
    }
  }

  const keywordRatio =
    expectedKeywords.length > 0 ? matchedKeywords / expectedKeywords.length : 0;

  // Exact or near-exact match to model answer
  if (cleanModel && (cleanUser === cleanModel || cleanModel.includes(cleanUser) || cleanUser.includes(cleanModel))) {
    return {
      points: 10,
      isCorrect: true,
      feedbackHebrew: "תשובה מצוינת ומלאה! התייחסות מדויקת לכל פרטי הפסקה.",
    };
  }

  // High keyword match (ratio >= 0.5 or 2+ matched keywords)
  if (keywordRatio >= 0.5 || (matchedKeywords >= 2 && words.length >= 2)) {
    return {
      points: 10,
      isCorrect: true,
      feedbackHebrew: "תשובה נכונה מאוד! כללת את כל פרטי המפתח הנדרשים מהטקסט.",
    };
  }

  // Concise correct answer (e.g., "To see dolphins" where primary keyword matches)
  if (matchedKeywords >= 1) {
    if (words.length <= 8) {
      return {
        points: 10,
        isCorrect: true,
        feedbackHebrew: "תשובה נכונה וממוקדת! זיהית את פרט המידע המרכזי הנדרש מתוך הפסקה.",
      };
    }
    return {
      points: 9,
      isCorrect: true,
      feedbackHebrew: "תשובה טובה! הבנת את הרעיון המרכזי בפסקה.",
    };
  }

  // Factually wrong answer or text with 0 matched keywords
  if (words.length >= 3) {
    return {
      points: 2,
      isCorrect: false,
      feedbackHebrew: "ניסחת משפט באנגלית, אך המידע אינו עונה על השאלה לפי הטקסט (המידע שגוי או חסר).",
    };
  }

  return {
    points: 0,
    isCorrect: false,
    feedbackHebrew: "התשובה אינה מכילה את המידע הנכון מתוך הטקסט.",
  };
}

// Generate complete Heuristic Unseen Evaluation
function generateHeuristicEvaluation(
  questions: MSUnseenQuestion[],
  userAnswers: Record<string, string | number>,
  storyLevel: string = "Level 2"
): UnseenEvaluationResult {
  const breakdown: UnseenQuestionEvaluation[] = questions.map((q) => {
    const ans = userAnswers[q.id];

    if (q.type === "mcq") {
      const isCorrect = ans === q.correctIndex;
      return {
        id: q.id,
        number: q.number,
        type: "mcq",
        prompt: q.prompt,
        userAnswer: ans,
        correctAnswer: q.correctIndex,
        isCorrect,
        points: isCorrect ? 10 : 0,
        maxPoints: 10,
        explanationHebrew: q.explanationHebrew || "התשובה מבוססת על המידע בפסקה.",
        options: q.options || [],
        feedbackHebrew: isCorrect
          ? "תשובה נכונה! איתור מדויק של המידע בטקסט."
          : `תשובה לא נכונה. ${q.explanationHebrew || ""}`,
      };
    }

    if (q.type === "copy") {
      const evalRes = evaluateCopyHeuristic(String(ans || ""), q.targetSentence);
      return {
        id: q.id,
        number: q.number,
        type: "copy",
        prompt: q.prompt,
        userAnswer: ans,
        correctAnswer: q.targetSentence,
        targetSentence: q.targetSentence,
        isCorrect: evalRes.isCorrect,
        points: evalRes.points,
        maxPoints: 10,
        feedbackHebrew: evalRes.feedbackHebrew,
        explanationHebrew: q.explanationHebrew,
      };
    }

    // Open ended
    const evalRes = evaluateOpenHeuristic(
      String(ans || ""),
      q.modelAnswer,
      q.keywords
    );
    return {
      id: q.id,
      number: q.number,
      type: "open",
      prompt: q.prompt,
      userAnswer: ans,
      correctAnswer: q.modelAnswer,
      modelAnswer: q.modelAnswer,
      isCorrect: evalRes.isCorrect,
      points: evalRes.points,
      maxPoints: 10,
      feedbackHebrew: evalRes.feedbackHebrew,
      explanationHebrew: q.explanationHebrew,
    };
  });

  const totalPointsEarned = breakdown.reduce((sum, item) => sum + item.points, 0);
  const maxPossible = breakdown.reduce((sum, item) => sum + (item.maxPoints || 10), 0) || 100;
  const totalScore = Math.min(100, Math.max(0, Math.round((totalPointsEarned / maxPossible) * 100)));

  // Partition rubric scores according to 4 MoE reading comprehension pillars
  // 1. Explicit Details (max 35)
  // 2. Inference & Context (max 25)
  // 3. Global Understanding (max 25)
  // 4. Language & Accuracy (max 15)
  const ratio = totalScore / 100;
  const explicitScore = Math.min(35, Math.round(ratio * 35));
  const inferenceScore = Math.min(25, Math.round(ratio * 25));
  const globalScore = Math.min(25, Math.round(ratio * 25));
  const accuracyScore = Math.min(15, Math.max(0, totalScore - (explicitScore + inferenceScore + globalScore)));

  let encouragement = "עבודה יפה בתרגול קטע הקריאה!";
  if (totalScore >= 90) {
    encouragement = "הישג מצוין! הבנה מעמיקה ושליטה מרשימה בטקסט!";
  } else if (totalScore >= 75) {
    encouragement = "עבודה טובה מאוד! זיהוי יפה של פרטי המפתח והמשפטים!";
  } else if (totalScore >= 60) {
    encouragement = "התקדמות יפה! נדרשת עוד תשומת לב לרמזים ולשאלות הפתוחות.";
  } else {
    encouragement = "התחלה טובה. כדאי לקרוא את הפסקאות שוב לאט ולסמן מילות מפתח.";
  }

  const teacherNote = `שלום! סיימת את מבחן האנסין ברמת ${storyLevel} עם ציון של ${totalScore}/100. ${
    totalScore >= 80
      ? "הפגנת יכולת סריקה מצוינת וזיהוי מדויק של התשובות בפסקאות. המשיכו כך לקראת המבחנים הבאים!"
      : "תרגול קריאה קבוע באנגלית יסייע לחזק את ביטחונך באיתור מידע ובניסוח תשובות מלאות. שימו לב להסברים המפורטים בכל שאלה."
  }`;

  const strengths: string[] = [];
  if (breakdown.filter((q) => q.type === "mcq" && q.isCorrect).length >= 4) {
    strengths.push("איתור מוצלח של פרטים מפורשים בשאלות רב-ברירה.");
  } else {
    strengths.push("התמודדות עם קריאת טקסט שלם באנגלית וקריאת שאלות ברצף.");
  }
  if (breakdown.some((q) => (q.type === "copy" || q.type === "open") && q.points >= 7)) {
    strengths.push("הבנה טובה של שאלות פתוחות והעתקת משפטים מתוך ההקשר.");
  } else {
    strengths.push("התמדה ומענה על כל חלקי המבחן.");
  }

  const tips: string[] = [
    "בשאלות פתוחות, מומלץ לוודא שכללת את כל הסיבות שהוזכרו בפסקה ולא רק מילה אחת.",
    "בהעתקת משפטים (Copy questions), הקפידו להעתיק מהאות הגדולה הראשונה ועד הנקודה שבסוף.",
  ];

  return {
    score: totalScore,
    maxScore: 100,
    percentage: totalScore,
    encouragement,
    teacherNote,
    strengths,
    tips,
    rubric: {
      explicitDetails: {
        score: explicitScore,
        max: 35,
        commentHebrew: `איתור מידע מפורש: ${explicitScore}/35 נקודות.`,
      },
      inferenceAndContext: {
        score: inferenceScore,
        max: 25,
        commentHebrew: `הסקת מסקנות ורמזי הקשר: ${inferenceScore}/25 נקודות.`,
      },
      globalUnderstanding: {
        score: globalScore,
        max: 25,
        commentHebrew: `הבנה כוללת ורעיון מרכזי: ${globalScore}/25 נקודות.`,
      },
      languageAndAccuracy: {
        score: accuracyScore,
        max: 15,
        commentHebrew: `דיוק בניסוח ובהעתקת משפטים: ${accuracyScore}/15 נקודות.`,
      },
    },
    breakdown,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      storyId,
      storyTitle = "Reading Comprehension Passage",
      storyLevel = "Level 2",
      paragraphs = [],
      questions = [],
      userAnswers = {},
      studentName,
    } = body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing unseen questions." },
        { status: 400 }
      );
    }

    // 1. Check in-memory Cache for identical submissions
    const cacheKey = `${storyId || storyTitle}_${JSON.stringify(userAnswers)}`;
    const cached = evaluationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        success: true,
        evaluation: cached.result,
        source: "cache",
      });
    }

    // 2. Deterministic Pre-Grading of Multiple Choice Questions (Zero AI tokens, 100% precision)
    const mcqEvaluations: Record<string, { isCorrect: boolean; points: number }> = {};
    let mcqCorrectCount = 0;
    let mcqTotalCount = 0;

    for (const q of questions) {
      if (q.type === "mcq") {
        mcqTotalCount++;
        const ans = userAnswers[q.id];
        const isCorrect = ans === q.correctIndex;
        if (isCorrect) mcqCorrectCount++;
        mcqEvaluations[q.id] = { isCorrect, points: isCorrect ? 10 : 0 };
      }
    }

    // Separate open/copy questions for AI evaluation
    const openOrCopyQuestions = questions.filter(
      (q: MSUnseenQuestion) => q.type === "copy" || q.type === "open"
    );

    // If there are no open/copy questions (all MCQs), we don't even need heavy LLM inference!
    if (openOrCopyQuestions.length === 0) {
      const quickHeuristic = generateHeuristicEvaluation(questions, userAnswers, storyLevel);
      evaluationCache.set(cacheKey, { result: quickHeuristic, timestamp: Date.now() });
      return NextResponse.json({
        success: true,
        evaluation: quickHeuristic,
        source: "deterministic_mcq",
      });
    }

    // 3. API Keys: Support client headers and server env variables
    const groqApiKey = request.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY;
    const geminiApiKey = request.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY;
    const openaiApiKey = request.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY;

    if (!groqApiKey && !geminiApiKey && !openaiApiKey) {
      // Immediate intelligent heuristic fallback
      const fallbackResult = generateHeuristicEvaluation(questions, userAnswers, storyLevel);
      evaluationCache.set(cacheKey, { result: fallbackResult, timestamp: Date.now() });
      return NextResponse.json({
        success: true,
        evaluation: fallbackResult,
        source: "heuristic_fallback",
      });
    }

    // 4. Rate-limiting & Concurrency Guard: Acquire slot
    const slotAcquired = await acquireSlot(3500);
    if (!slotAcquired) {
      // Peak load queue timeout: fall back gracefully without blocking the student!
      const fallbackResult = generateHeuristicEvaluation(questions, userAnswers, storyLevel);
      return NextResponse.json({
        success: true,
        evaluation: fallbackResult,
        source: "heuristic_load_shedding",
      });
    }

    try {
      // 5. Build Compact, High-Efficiency AI Prompt (Sending only open/copy answers + summary)
      const openQuestionsSummary = openOrCopyQuestions.map((q: MSUnseenQuestion) => {
        const studentAns = String(userAnswers[q.id] || "No answer provided");
        return {
          id: q.id,
          number: q.number,
          type: q.type,
          prompt: q.prompt,
          targetOrModelAnswer: q.targetSentence || q.modelAnswer || "",
          keywordsExpected: q.keywords || [],
          studentAnswer: studentAns,
        };
      });

      const systemPrompt = `You are an expert Israeli English teacher and Ministry of Education (מפמ"ר אנגלית) pedagogical test evaluator.
Evaluate the student's reading comprehension (Unseen) answers with pedagogical wisdom, warm encouragement, and fair partial credit.

STUDENT & TEST PROFILE:
- Student Name: ${studentName || "Student"}
- Level: "${storyLevel}"
- Story Title: "${storyTitle}"
- Multiple Choice Results: The student answered ${mcqCorrectCount} out of ${mcqTotalCount} Multiple Choice questions correctly.

READING PASSAGE SUMMARY:
"""
${(paragraphs || []).slice(0, 3).join("\n\n")}
"""

OPEN-ENDED & SENTENCE-COPYING QUESTIONS TO EVALUATE:
${JSON.stringify(openQuestionsSummary, null, 2)}

PEDAGOGICAL GRADING GUIDELINES (OFFICIAL ISRAELI MOE READING COMPREHENSION STANDARDS):
1. READING COMPREHENSION OVER LANGUAGE FORM:
   - In Israeli Bagrut and school English exams, reading comprehension (Unseen) evaluates whether the student understood the text and retrieved the correct factual information.
   - Grammatical errors, phonetic spelling slips, missing capital letters, or minor punctuation slips that DO NOT alter the factual meaning MUST NOT BE PENALIZED!
   - Award FULL CREDIT (9–10 points) if the student understood the question and gave the correct factual answer from the passage, even if their sentence is simple or has a typo (e.g. "Because he want to see dolphin" -> 10/10 points!).

2. ACCEPT CONCISE & ALTERNATIVE PHRASINGS:
   - Students are NOT required to match the model answer verbatim or write long academic sentences.
   - Concise answers (e.g. "To see dolphins", "in the morning", "they ate pizza") and natural conversational phrasings that correctly answer the question receive 10 points!

3. FAIR SCORING FOR 'copy' QUESTIONS:
   - If the student identified and copied the correct sentence or the key clause containing the answer from the passage, award 9–10 points.
   - Do NOT deduct points down to 7 or 8 for minor quotation mark or capitalization slips.
   - Award 0–4 points ONLY if the sentence copied is completely irrelevant or factually incorrect.

4. GENEROUS PARTIAL CREDIT FOR 'open' QUESTIONS:
   - 9–10 points: Correct answer answering the prompt, regardless of minor grammar/spelling slips.
   - 7–8 points: Correct main idea, slightly incomplete or missing one secondary detail.
   - 5–6 points: Partial understanding of the relevant passage with some correct information.
   - 0–4 points: Blank, gibberish, or factually wrong information from the text.
   - In 'feedbackHebrew', write an encouraging, constructive 1-2 sentence explanation in Hebrew.

5. HOLISTIC MOE RUBRIC DISTRIBUTION (Sum to 100):
   - A student who answers questions correctly should achieve an overall score in the 92–98 range!
   - Solid performance with minor slips should achieve 84–90.
   - Scores in the 50s-60s are reserved ONLY for students who missed most questions or left them blank.
   - Break down reading skills into the 4 official Ministry of Education pillars:
     * explicitDetails: max 35 (איתור מידע מפורש)
     * inferenceAndContext: max 25 (הסקת מסקנות ורמזי הקשר)
     * globalUnderstanding: max 25 (הבנה כוללת ורעיון מרכזי)
     * languageAndAccuracy: max 15 (דיוק בהעתקת משפטים וניסוח)

Return ONLY a raw, valid JSON object matching this schema (NO MARKDOWN CODE FENCES):
{
  "openEvaluations": [
    {
      "id": "questionId",
      "points": number (0 to 10),
      "isCorrect": boolean,
      "feedbackHebrew": "הסבר פדגוגי בעברית על התשובה"
    }
  ],
  "encouragement": "עבודה מצוינת בתרגול קטע הקריאה!",
  "teacherNote": "פסקה אישית וחמה מהמורה בעברית",
  "strengths": ["נקודת חוזק 1 בעברית", "נקודת חוזק 2 בעברית"],
  "tips": ["טיפ ממוקד 1 בעברית", "טיפ ממוקד 2 בעברית"],
  "rubric": {
    "explicitDetails": { "score": number (0-35), "max": 35, "commentHebrew": "הערכה בעברית" },
    "inferenceAndContext": { "score": number (0-25), "max": 25, "commentHebrew": "הערכה בעברית" },
    "globalUnderstanding": { "score": number (0-25), "max": 25, "commentHebrew": "הערכה בעברית" },
    "languageAndAccuracy": { "score": number (0-15), "max": 15, "commentHebrew": "הערכה בעברית" }
  }
}`;

      // 6. Cascade Execution Steps
      const cascadePlan: Array<{
        provider: "groq" | "gemini" | "openai";
        model: string;
        execute: () => Promise<string>;
      }> = [];

      // A. Groq 120b
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
            if (!res.ok) throw new Error(`Groq 120b ${res.status}: ${await res.text()}`);
            const data = await res.json();
            return data.choices?.[0]?.message?.content || "";
          },
        });

        // Groq 70b versatile backup
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
            if (!res.ok) throw new Error(`Groq 70b ${res.status}: ${await res.text()}`);
            const data = await res.json();
            return data.choices?.[0]?.message?.content || "";
          },
        });
      }

      // B. Google Gemini
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
              if (!res.ok) throw new Error(`Gemini ${gemModel} ${res.status}: ${await res.text()}`);
              const data = await res.json();
              return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            },
          });
        }
      }

      // C. OpenAI
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
            if (!res.ok) throw new Error(`OpenAI status ${res.status}: ${await res.text()}`);
            const data = await res.json();
            return data.choices?.[0]?.message?.content || "";
          },
        });
      }

      // Run Cascade
      for (const step of cascadePlan) {
        try {
          const rawOutput = await step.execute();
          if (rawOutput) {
            const parsed = extractJsonFromText(rawOutput);
            if (parsed && Array.isArray(parsed.openEvaluations)) {
              // Assemble full 10-question breakdown
              const openEvalMap = new Map<string, { points: number; isCorrect: boolean; feedbackHebrew: string }>();
              for (const item of parsed.openEvaluations) {
                if (item && item.id) {
                  openEvalMap.set(item.id, {
                    points: typeof item.points === "number" ? Math.min(10, Math.max(0, item.points)) : 0,
                    isCorrect: Boolean(item.isCorrect),
                    feedbackHebrew: item.feedbackHebrew || "",
                  });
                }
              }

              const fullBreakdown: UnseenQuestionEvaluation[] = questions.map((q: MSUnseenQuestion) => {
                const ans = userAnswers[q.id];

                if (q.type === "mcq") {
                  const mcq = mcqEvaluations[q.id] || { isCorrect: false, points: 0 };
                  return {
                    id: q.id,
                    number: q.number,
                    type: "mcq",
                    prompt: q.prompt,
                    userAnswer: ans,
                    correctAnswer: q.correctIndex,
                    isCorrect: mcq.isCorrect,
                    points: mcq.points,
                    maxPoints: 10,
                    explanationHebrew: q.explanationHebrew,
                    options: q.options || [],
                    feedbackHebrew: mcq.isCorrect
                      ? "תשובה נכונה! איתור מדויק של המידע בפסקה."
                      : `תשובה לא נכונה. ${q.explanationHebrew || ""}`,
                  };
                }

                const aiOpen = openEvalMap.get(q.id);
                let points = aiOpen ? aiOpen.points : 5;
                let isCorrect = aiOpen ? aiOpen.isCorrect : points >= 6;

                // MOE Pedagogical Guardrails:
                // 1. For sentence-copying questions: If student copied the target sentence (normalized) or key portion,
                // ensure points are not unfairly deducted for minor mechanics or formatting slips.
                if (q.type === "copy" && q.targetSentence && ans) {
                  const cleanUser = normalizeString(String(ans));
                  const cleanTarget = normalizeString(q.targetSentence);
                  if (cleanUser && (cleanUser === cleanTarget || (cleanTarget.includes(cleanUser) && cleanUser.split(" ").length >= 4))) {
                    points = Math.max(points, 9);
                    isCorrect = true;
                  }
                }

                // 2. For open-ended questions: If student provided expected keywords or matches model answer idea,
                // do not allow LLM to penalize for simple sentence structure or minor grammar slips.
                if (q.type === "open" && ans) {
                  const cleanUser = normalizeString(String(ans));
                  const cleanModel = q.modelAnswer ? normalizeString(q.modelAnswer) : "";
                  if (cleanModel && (cleanUser === cleanModel || cleanModel.includes(cleanUser) || cleanUser.includes(cleanModel))) {
                    points = Math.max(points, 9);
                    isCorrect = true;
                  } else if (q.keywords && q.keywords.length > 0) {
                    const matched = q.keywords.filter((kw) => cleanUser.includes(kw.toLowerCase().trim()));
                    if (matched.length >= 2 || (q.keywords.length === 1 && matched.length === 1)) {
                      points = Math.max(points, 8);
                      isCorrect = true;
                    }
                  }
                }

                return {
                  id: q.id,
                  number: q.number,
                  type: q.type,
                  prompt: q.prompt,
                  userAnswer: ans,
                  correctAnswer: q.targetSentence || q.modelAnswer,
                  targetSentence: q.targetSentence,
                  modelAnswer: q.modelAnswer,
                  isCorrect,
                  points,
                  maxPoints: 10,
                  feedbackHebrew: aiOpen?.feedbackHebrew || q.explanationHebrew || "",
                  explanationHebrew: q.explanationHebrew,
                };
              });

              const totalPointsEarned = fullBreakdown.reduce((sum, item) => sum + item.points, 0);
              const maxPossible = fullBreakdown.reduce((sum, item) => sum + (item.maxPoints || 10), 0) || 100;
              const totalScore = Math.min(100, Math.max(0, Math.round((totalPointsEarned / maxPossible) * 100)));

              // Normalize rubric scores
              const r = parsed.rubric || {};
              const explicitScore = Math.min(35, Math.max(0, r.explicitDetails?.score ?? Math.round((totalScore / 100) * 35)));
              const inferenceScore = Math.min(25, Math.max(0, r.inferenceAndContext?.score ?? Math.round((totalScore / 100) * 25)));
              const globalScore = Math.min(25, Math.max(0, r.globalUnderstanding?.score ?? Math.round((totalScore / 100) * 25)));
              const accuracyScore = Math.min(15, Math.max(0, totalScore - (explicitScore + inferenceScore + globalScore)));

              const finalResult: UnseenEvaluationResult = {
                score: totalScore,
                maxScore: 100,
                percentage: totalScore,
                encouragement: parsed.encouragement || "עבודה יפה במבחן האנסין!",
                teacherNote: parsed.teacherNote || `כל הכבוד על סיום מבחן האנסין! ציונך המשוקלל הוא ${totalScore}/100.`,
                strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0
                  ? parsed.strengths
                  : ["איתור פרטים והתמדה לאורך כל קטע הקריאה."],
                tips: Array.isArray(parsed.tips) && parsed.tips.length > 0
                  ? parsed.tips
                  : ["הקפידו על אותיות גדולות בתחילת משפט ובשאלות פתוחות נסחו משפטים מלאים."],
                rubric: {
                  explicitDetails: {
                    score: explicitScore,
                    max: 35,
                    commentHebrew: r.explicitDetails?.commentHebrew || `איתור מידע מפורש: ${explicitScore}/35`,
                  },
                  inferenceAndContext: {
                    score: inferenceScore,
                    max: 25,
                    commentHebrew: r.inferenceAndContext?.commentHebrew || `הסקת מסקנות ורמזי הקשר: ${inferenceScore}/25`,
                  },
                  globalUnderstanding: {
                    score: globalScore,
                    max: 25,
                    commentHebrew: r.globalUnderstanding?.commentHebrew || `הבנה כוללת ורעיון מרכזי: ${globalScore}/25`,
                  },
                  languageAndAccuracy: {
                    score: accuracyScore,
                    max: 15,
                    commentHebrew: r.languageAndAccuracy?.commentHebrew || `דיוק בניסוח ובהעתקת משפטים: ${accuracyScore}/15`,
                  },
                },
                breakdown: fullBreakdown,
              };

              evaluationCache.set(cacheKey, { result: finalResult, timestamp: Date.now() });

              return NextResponse.json({
                success: true,
                evaluation: finalResult,
                source: `${step.provider}:${step.model}`,
              });
            }
          }
        } catch (err: any) {
          console.warn(`[Evaluate Unseen] Step ${step.provider}:${step.model} failed:`, err?.message || err);
        }
      }
    } finally {
      releaseSlot();
    }

    // 7. Heuristic Fallback if all AI models failed or timed out
    const fallbackResult = generateHeuristicEvaluation(questions, userAnswers, storyLevel);
    evaluationCache.set(cacheKey, { result: fallbackResult, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      evaluation: fallbackResult,
      source: "heuristic_fallback",
    });
  } catch (error: any) {
    console.error("Error in evaluate-unseen API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate unseen answers." },
      { status: 500 }
    );
  }
}
