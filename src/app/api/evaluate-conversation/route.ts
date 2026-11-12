import { NextResponse } from "next/server";
import {
  ConversationQuestion,
  ConversationEvaluationResult,
  ConversationQuestionEvaluation,
  ConversationRubric,
  DialogueTurn,
} from "@/types/conversation";
import { errorMessage, extractJsonObject, jsonObject, jsonObjects, type JsonObject } from "@/lib/llm-json";

const evaluationCache = new Map<
  string,
  { result: ConversationEvaluationResult; timestamp: number }
>();
const CACHE_TTL_MS = 10 * 60 * 1000;

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
      const idx = waitQueue.indexOf(onSlotAvailable);
      if (idx !== -1) waitQueue.splice(idx, 1);
      resolve(false);
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

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function evaluateCopyHeuristic(
  userAns: string,
  targetSentence?: string
): { points: number; isCorrect: boolean; feedbackHebrew: string } {
  if (!userAns || !userAns.trim()) {
    return {
      points: 0,
      isCorrect: false,
      feedbackHebrew: "לא נכתבה תשובה. יש להעתיק את המשפט המדויק מתוך השיחה.",
    };
  }
  if (!targetSentence) {
    return {
      points: userAns.length > 10 ? 8 : 4,
      isCorrect: userAns.length > 10,
      feedbackHebrew: "המשפט שהועתק נבדק על בסיס השיחה.",
    };
  }
  const cleanUser = normalizeString(userAns);
  const cleanTarget = normalizeString(targetSentence);

  if (cleanUser === cleanTarget) {
    return {
      points: 10,
      isCorrect: true,
      feedbackHebrew: "העתקה מושלמת ומדויקת מתוך השיחה! כל הכבוד!",
    };
  }

  const userTokens = new Set(cleanUser.split(" "));
  const targetTokens = new Set(cleanTarget.split(" "));
  const common = [...userTokens].filter((t) => targetTokens.has(t));
  const overlapRatio = common.length / Math.max(1, targetTokens.size);

  if (cleanTarget.includes(cleanUser) && userTokens.size >= 4) {
    return {
      points: 9,
      isCorrect: true,
      feedbackHebrew:
        "העתקת את החלק המרכזי והנכון מתוך השורה! להבא כדאי להעתיק את המשפט המלא.",
    };
  }

  if (overlapRatio >= 0.65) {
    return {
      points: 9,
      isCorrect: true,
      feedbackHebrew: "העתקת את השורה הנכונה מהשיחה עם שינויים קלים בלבד.",
    };
  }

  if (overlapRatio >= 0.4) {
    return {
      points: 6,
      isCorrect: true,
      feedbackHebrew: `העתקת חלק מהמידע הנכון, אך המשפט המלא בשיחה הוא: "${targetSentence}".`,
    };
  }

  return {
    points: 0,
    isCorrect: false,
    feedbackHebrew: `השורה שהועתקה אינה תואמת. המשפט הנכון מהשיחה הוא: "${targetSentence}".`,
  };
}

function evaluateOpenOrReplyHeuristic(
  userAns: string,
  q: ConversationQuestion
): { points: number; isCorrect: boolean; feedbackHebrew: string } {
  const trimmed = (userAns || "").trim();
  if (!trimmed) {
    return {
      points: 0,
      isCorrect: false,
      feedbackHebrew:
        q.type === "reply_open"
          ? "לא נכתבה תגובה. נסו לכתוב משפט מנומס וטבעי באנגלית שהייתם אומרים בסיטואציה זו."
          : "לא נכתבה תשובה לשאלה זו.",
    };
  }

  if (/[\u0590-\u05FF]/.test(trimmed) && !/[a-zA-Z]{3,}/.test(trimmed)) {
    return {
      points: 2,
      isCorrect: false,
      feedbackHebrew: "כתבת את התשובה בעברית—חשוב לענות באנגלית! נסו לנסח משפט קצר באנגלית.",
    };
  }

  const cleanUser = normalizeString(trimmed);
  const words = cleanUser.split(" ").filter(Boolean);
  const expectedKws = (q.keywords || []).map((k) => normalizeString(k)).filter(Boolean);
  const matched = expectedKws.filter((kw) => cleanUser.includes(kw));

  const politeMarkers = ["please", "excuse", "sorry", "thank", "thanks", "could", "would", "can", "hi", "hello"];
  const hasPolite = politeMarkers.some((pm) => cleanUser.includes(pm));

  if (q.type === "reply_open") {
    if (matched.length >= 2 || (matched.length >= 1 && hasPolite && words.length >= 5)) {
      return {
        points: 10,
        isCorrect: true,
        feedbackHebrew:
          "תגובה מצוינת, מנומסת וטבעית מאוד! בדיוק כך נהוג להגיב באנגלית בחיים האמיתיים.",
      };
    }
    if (matched.length >= 1 || (words.length >= 5 && hasPolite)) {
      return {
        points: 8,
        isCorrect: true,
        feedbackHebrew: `תגובה טובה ומתאימה לסיטואציה! דוגמה לניסוח טבעי נוסף: "${q.modelAnswer}".`,
      };
    }
    if (words.length >= 3) {
      return {
        points: 6,
        isCorrect: true,
        feedbackHebrew: `הכיוון מובן! בשיחה אמיתית כדאי להוסיף מילת נימוס (כמו please / could you) ולהתייחס לפרטי המקרה. לדוגמה: "${q.modelAnswer}".`,
      };
    }
  } else {
    if (matched.length >= 2 || (expectedKws.length === 1 && matched.length === 1)) {
      return {
        points: 10,
        isCorrect: true,
        feedbackHebrew: "תשובה מצוינת! זיהית במדויק את הפרטים מתוך השיחה.",
      };
    }
    if (matched.length === 1 || words.length >= 5) {
      return {
        points: 7,
        isCorrect: true,
        feedbackHebrew: `תשובה טובה בכיוון הנכון! תשובה מלאה לדוגמה: "${q.modelAnswer}".`,
      };
    }
  }

  return {
    points: 3,
    isCorrect: false,
    feedbackHebrew: q.explanationHebrew || `תשובה מומלצת: "${q.modelAnswer}".`,
  };
}

function buildHeuristicEvaluation(
  questions: ConversationQuestion[],
  userAnswers: Record<string, string | number>,
  studentName: string
): ConversationEvaluationResult {
  let totalScore = 0;

  const breakdown: ConversationQuestionEvaluation[] = questions.map((q) => {
    const rawAns = userAnswers[q.id];
    if (q.type === "mcq" || q.type === "reply_mcq") {
      const isCorrect = typeof rawAns === "number" && rawAns === q.correctIndex;
      const points = isCorrect ? 10 : 0;
      totalScore += points;
      return {
        id: q.id,
        number: q.number,
        type: q.type,
        prompt: q.prompt,
        situationContext: q.situationContext,
        userAnswer: rawAns,
        correctAnswer: q.correctIndex,
        isCorrect,
        points,
        maxPoints: 10,
        feedbackHebrew: isCorrect
          ? q.type === "reply_mcq"
            ? "בחירה מצוינת! זו התגובה המנומסת והטבעית ביותר בסיטואציה זו."
            : "תשובה נכונה! הבנה מדויקת של השיחה."
          : q.explanationHebrew,
        explanationHebrew: q.explanationHebrew,
        options: q.options,
      };
    }

    if (q.type === "copy") {
      const res = evaluateCopyHeuristic(String(rawAns || ""), q.targetSentence);
      totalScore += res.points;
      return {
        id: q.id,
        number: q.number,
        type: "copy",
        prompt: q.prompt,
        userAnswer: rawAns,
        correctAnswer: q.targetSentence,
        isCorrect: res.isCorrect,
        points: res.points,
        maxPoints: 10,
        feedbackHebrew: res.feedbackHebrew,
        explanationHebrew: q.explanationHebrew,
        targetSentence: q.targetSentence,
      };
    }

    const res = evaluateOpenOrReplyHeuristic(String(rawAns || ""), q);
    totalScore += res.points;
    return {
      id: q.id,
      number: q.number,
      type: q.type,
      prompt: q.prompt,
      situationContext: q.situationContext,
      userAnswer: rawAns,
      correctAnswer: q.modelAnswer,
      isCorrect: res.isCorrect,
      points: res.points,
      maxPoints: 10,
      feedbackHebrew: res.feedbackHebrew,
      explanationHebrew: q.explanationHebrew,
      modelAnswer: q.modelAnswer,
    };
  });

  const ratio = totalScore / 100;
  const rubric: ConversationRubric = {
    explicitDetails: {
      score: Math.round(30 * ratio),
      max: 30,
      commentHebrew: "איתור והבנת פרטי השיחה והמידע המרכזי בין הדוברים.",
    },
    inferenceAndPragmatics: {
      score: Math.round(25 * ratio),
      max: 25,
      commentHebrew: "הבנת כוונת הדובר, נימת הדיבור וביטויים יומיומיים בהקשרם.",
    },
    realLifeResponse: {
      score: Math.round(30 * ratio),
      max: 30,
      commentHebrew: "בחירה וניסוח של תגובות מנומסות וטבעיות למצבים מהחיים האמיתיים.",
    },
    languageAndAccuracy: {
      score: Math.max(0, totalScore - Math.round(30 * ratio) - Math.round(25 * ratio) - Math.round(30 * ratio)),
      max: 15,
      commentHebrew: "דיוק בניסוח התשובות באנגלית ובהעתקת שורות מתוך הדיאלוג.",
    },
  };

  return {
    score: totalScore,
    maxScore: 100,
    percentage: totalScore,
    encouragement:
      totalScore >= 85
        ? `כל הכבוד ${studentName}! הפגנת הבנה מצוינת של שיחה באנגלית מהחיים האמיתיים!`
        : totalScore >= 65
        ? `עבודה טובה מאוד ${studentName}! הבנת את רוב חלקי השיחה והתגובות החברתיות.`
        : `יפה מאוד על ההשקעה ${studentName}! כדאי לעבור על ההסברים והביטויים השימושיים כדי להתחזק בשיחות יומיומיות.`,
    teacherNote: "הערכה מפורטת של הבנת השיחה ומיומנויות תקשורת מעשית באנגלית.",
    strengths: [
      "הבנת ההקשר הכללי של התרחיש ומטרת השיחה בין הדוברים.",
      "התמודדות יפה עם שאלות 'מה היית אומר/ת?' במצבי אמת.",
    ],
    tips: [
      "שימו לב לביטויי נימוס באנגלית מדוברת כגון Could I please... ו-Excuse me.",
      "בשאלות העתקה, הקפידו להעתיק את המשפט המדויק מתוך השורה המבוקשת בדיאלוג.",
    ],
    rubric,
    breakdown,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      scenarioId = "",
      scenarioTitle = "",
      turns = [],
      questions = [],
      userAnswers = {},
      studentName = "תלמיד/ה",
    }: {
      scenarioId: string;
      scenarioTitle: string;
      turns: DialogueTurn[];
      questions: ConversationQuestion[];
      userAnswers: Record<string, string | number>;
      studentName: string;
    } = body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { success: false, message: "No questions provided for evaluation." },
        { status: 400 }
      );
    }

    const cacheKey = JSON.stringify({ scenarioId, userAnswers });
    const cached = evaluationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        success: true,
        evaluation: cached.result,
        cached: true,
      });
    }

    const baseHeuristic = buildHeuristicEvaluation(questions, userAnswers, studentName);

    const groqApiKey = request.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY;
    const geminiApiKey = request.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY;
    const openaiApiKey = request.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY;

    // Check if there are open/copy/reply_open answers that benefit from AI evaluation
    const openQuestions = questions.filter(
      (q) => q.type === "open" || q.type === "copy" || q.type === "reply_open"
    );

    if ((!groqApiKey && !geminiApiKey && !openaiApiKey) || openQuestions.length === 0) {
      return NextResponse.json({
        success: true,
        evaluation: baseHeuristic,
        isHeuristic: true,
      });
    }

    const gotSlot = await acquireSlot(3500);
    if (!gotSlot) {
      return NextResponse.json({
        success: true,
        evaluation: baseHeuristic,
        isHeuristic: true,
      });
    }

    try {
      const dialogueText = Array.isArray(turns)
        ? turns.map((t, idx) => `Line ${idx + 1}: ${t.text}`).join("\n")
        : "";

      const questionsPayload = questions.map((q) => ({
        number: q.number,
        type: q.type,
        prompt: q.prompt,
        situationContext: q.situationContext,
        expected:
          q.type === "mcq" || q.type === "reply_mcq"
            ? q.options?.[q.correctIndex ?? 0]
            : q.type === "copy"
            ? q.targetSentence
            : q.modelAnswer,
        studentAnswer:
          q.type === "mcq" || q.type === "reply_mcq"
            ? typeof userAnswers[q.id] === "number"
              ? q.options?.[userAnswers[q.id] as number]
              : "No answer"
            : String(userAnswers[q.id] || ""),
        mcqLockedPoints:
          q.type === "mcq" || q.type === "reply_mcq"
            ? userAnswers[q.id] === q.correctIndex
              ? 10
              : 0
            : undefined,
      }));

      const prompt = `You are a warm, encouraging English teacher evaluating an Israeli student's ("${studentName}") Real-Life Conversation Practice on "${scenarioTitle}".

Dialogue Transcript:
${dialogueText}

Questions and Student Answers:
${JSON.stringify(questionsPayload, null, 2)}

Grading Guidelines:
1. For "mcq" and "reply_mcq", keep the exact locked score ("mcqLockedPoints": 10 if correct, 0 if wrong) and write a brief, clear Hebrew explanation ("feedbackHebrew").
2. For "copy", award 10 points if the student copied the correct sentence from the dialogue (forgive minor punctuation/capitalization differences), 7-9 for partial copy, 0 if wrong/empty.
3. For "open", award 0-10 points based on comprehension accuracy according to the dialogue. Forgive minor spelling mistakes if the English meaning is clear.
4. For "reply_open" ("What Would You Say?"), award 0-10 points based on:
   - Is it a natural, polite, and relevant real-life spoken response in English for the given "situationContext"?
   - Give specific, encouraging Hebrew feedback ("feedbackHebrew") praising their conversational choice or showing how to make it even more natural.

Return ONLY a valid JSON object matching this schema:
{
  "encouragement": "Warm personalized encouragement in Hebrew",
  "teacherNote": "1-2 sentence summary of their conversational comprehension and real-life response skills in Hebrew",
  "strengths": ["Strength 1 in Hebrew", "Strength 2 in Hebrew"],
  "tips": ["Actionable tip 1 in Hebrew", "Actionable tip 2 in Hebrew"],
  "rubricComments": {
    "explicitDetails": "Hebrew comment on dialogue comprehension",
    "inferenceAndPragmatics": "Hebrew comment on tone & idioms",
    "realLifeResponse": "Hebrew comment on 'What Would You Say?' pragmatic replies",
    "languageAndAccuracy": "Hebrew comment on English phrasing & accuracy"
  },
  "questionEvaluations": [
    {
      "number": 1,
      "points": 10,
      "isCorrect": true,
      "feedbackHebrew": "משוב מפורט ומעודד בעברית על תשובת התלמיד"
    }
  ]
}`;

      const cascade: Array<() => Promise<string>> = [];
      if (groqApiKey) {
        cascade.push(async () => {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
              model: "openai/gpt-oss-120b",
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" },
              temperature: 0.3,
            }),
          });
          if (!res.ok) throw new Error("Groq 120b failed");
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        });
      }
      if (geminiApiKey) {
        cascade.push(async () => {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiApiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.3,
                },
              }),
            }
          );
          if (!res.ok) throw new Error("Gemini flash failed");
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        });
      }
      if (openaiApiKey) {
        cascade.push(async () => {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o",
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" },
            }),
          });
          if (!res.ok) throw new Error("OpenAI failed");
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        });
      }

      let aiParsed: JsonObject | null = null;
      for (const run of cascade) {
        try {
          const text = await run();
          if (text) {
            aiParsed = extractJsonObject(text);
            if (aiParsed && Array.isArray(aiParsed.questionEvaluations)) break;
          }
        } catch {}
      }

      if (!aiParsed || !Array.isArray(aiParsed.questionEvaluations)) {
        return NextResponse.json({
          success: true,
          evaluation: baseHeuristic,
          isHeuristic: true,
        });
      }

      const aiQuestionEvaluations = jsonObjects(aiParsed.questionEvaluations);
      const aiRubricComments = jsonObject(aiParsed.rubricComments);

      let finalScore = 0;
      const mergedBreakdown: ConversationQuestionEvaluation[] = baseHeuristic.breakdown.map((item) => {
        const aiItem = aiQuestionEvaluations.find((x) => Number(x.number) === item.number);
        if (!aiItem) {
          finalScore += item.points;
          return item;
        }
        const isMcq = item.type === "mcq" || item.type === "reply_mcq";
        const points = isMcq
          ? item.points
          : Math.max(0, Math.min(10, Math.round(Number(aiItem.points ?? item.points))));
        const isCorrect = isMcq ? item.isCorrect : points >= 6;
        finalScore += points;
        return {
          ...item,
          points,
          isCorrect,
          feedbackHebrew: String(aiItem.feedbackHebrew || item.feedbackHebrew),
        };
      });

      const ratio = finalScore / 100;
      const s1 = Math.round(30 * ratio);
      const s2 = Math.round(25 * ratio);
      const s3 = Math.round(30 * ratio);
      const s4 = Math.max(0, finalScore - s1 - s2 - s3);

      const finalResult: ConversationEvaluationResult = {
        score: finalScore,
        maxScore: 100,
        percentage: finalScore,
        encouragement: String(aiParsed.encouragement || baseHeuristic.encouragement),
        teacherNote: String(aiParsed.teacherNote || baseHeuristic.teacherNote),
        strengths:
          Array.isArray(aiParsed.strengths) && aiParsed.strengths.length > 0
            ? aiParsed.strengths.map(String)
            : baseHeuristic.strengths,
        tips:
          Array.isArray(aiParsed.tips) && aiParsed.tips.length > 0
            ? aiParsed.tips.map(String)
            : baseHeuristic.tips,
        rubric: {
          explicitDetails: {
            score: s1,
            max: 30,
            commentHebrew: String(
              aiRubricComments.explicitDetails || baseHeuristic.rubric.explicitDetails.commentHebrew
            ),
          },
          inferenceAndPragmatics: {
            score: s2,
            max: 25,
            commentHebrew: String(
              aiRubricComments.inferenceAndPragmatics ||
                baseHeuristic.rubric.inferenceAndPragmatics.commentHebrew
            ),
          },
          realLifeResponse: {
            score: s3,
            max: 30,
            commentHebrew: String(
              aiRubricComments.realLifeResponse || baseHeuristic.rubric.realLifeResponse.commentHebrew
            ),
          },
          languageAndAccuracy: {
            score: s4,
            max: 15,
            commentHebrew: String(
              aiRubricComments.languageAndAccuracy || baseHeuristic.rubric.languageAndAccuracy.commentHebrew
            ),
          },
        },
        breakdown: mergedBreakdown,
      };

      evaluationCache.set(cacheKey, { result: finalResult, timestamp: Date.now() });
      return NextResponse.json({
        success: true,
        evaluation: finalResult,
      });
    } finally {
      releaseSlot();
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "שגיאה בבדיקת התשובות.",
        detail: errorMessage(error),
      },
      { status: 500 }
    );
  }
}
