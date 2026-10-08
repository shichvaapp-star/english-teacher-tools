import { NextResponse } from "next/server";

export interface SentenceChunk {
  hebrew: string;
  english: string;
  tip?: string;
  role?: "subject" | "verb" | "object" | "connector" | "time_place" | "other";
}

export interface ScaffoldingResult {
  fullSentence: string;
  chunks: SentenceChunk[];
  hebrewSummaryTip: string;
  alternativeSentence?: string;
}

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hebrewText, level, taskTitle, currentEssay } = body;

    if (!hebrewText || typeof hebrewText !== "string" || !hebrewText.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing Hebrew text to scaffold." },
        { status: 400 }
      );
    }

    const currentLevel = level || "Level 2";
    const groqApiKey = request.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY;
    const geminiApiKey = request.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY;
    const openaiApiKey = request.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY;

    // Calibrate instructions according to Ministry of Education CEFR bands
    let levelDirectives = "";
    if (currentLevel === "Level 1") {
      levelDirectives = `
- TARGET AUDIENCE: Level 1 (Elementary / Israeli 6th-7th grade, basic beginner).
- Keep English vocabulary simple (Core Band I: e.g. like, want, go, have, because, friend, school).
- Build short, clear S-V-O sentences (3-7 words max).
- Emphasize fundamental English rules: always capitalize "I", every sentence starts with a capital letter and ends with a period.`;
    } else if (currentLevel === "Level 3") {
      levelDirectives = `
- TARGET AUDIENCE: Level 3 (Israeli High School 5-points Bagrut prep, CEFR B1-B2).
- Use rich Band II/III vocabulary, sophisticated transition words (Furthermore, Consequently, In addition), and varied sentence structures (complex/compound).`;
    } else {
      levelDirectives = `
- TARGET AUDIENCE: Level 2 (Israeli Middle School 8th-9th grade, CEFR A2-B1).
- Use accessible Band I and Band II vocabulary.
- Reinforce correct connectors (because, so, but, also, in my opinion) and correct word order (Subject + Verb + Object).`;
    }

    const promptText = `You are an expert Israeli English teacher helping a student construct an English sentence step-by-step from their thought in Hebrew.

STUDENT'S HEBREW THOUGHT: "${hebrewText.trim()}"
WRITING ASSIGNMENT TOPIC: "${taskTitle || "General Topic"}"
STUDENT LEVEL: ${currentLevel}
${currentEssay ? `CONTEXT ALREADY WRITTEN: "${currentEssay.slice(-200)}"` : ""}

${levelDirectives}

PEDAGOGICAL TASK:
1. Break the Hebrew thought into 2 to 4 logical grammatical building blocks (Subject, Verb/Auxiliary, Object/Complement, Connector/Details).
2. Translate each block into natural English appropriate for ${currentLevel}.
3. Provide a brief, friendly, encouraging Hebrew tip for each block highlighting key Israeli learner challenges (e.g., "באנגלית תמיד שמים נושא לפני הפועל", "שים לב ש-I תמיד באות גדולה", "פועל עזר לפני פועל ראשי").
4. Formulate the complete, grammatically perfect English sentence with correct capitalization and punctuation.
5. Provide a one-sentence Hebrew pedagogical summary rule (hebrewSummaryTip).
6. Optionally provide one alternative natural formulation (alternativeSentence).

RETURN STRICT RAW JSON ONLY in this format:
{
  "fullSentence": "In my opinion, students should read books every day.",
  "chunks": [
    {
      "hebrew": "לדעתי,",
      "english": "In my opinion,",
      "tip": "ביטוי מעולה לפתיחת משפט דעה",
      "role": "connector"
    },
    {
      "hebrew": "תלמידים צריכים",
      "english": "students should",
      "tip": "באנגלית: הנושא לפני פועל העזר should",
      "role": "subject"
    },
    {
      "hebrew": "לקרוא ספרים",
      "english": "read books",
      "tip": "אחרי should הפועל מגיע בצורת מקור נקייה (Base form)",
      "role": "verb"
    },
    {
      "hebrew": "כל יום.",
      "english": "every day.",
      "tip": "תיאור זמן בסיום המשפט + נקודה",
      "role": "time_place"
    }
  ],
  "hebrewSummaryTip": "זכרו שבאנגלית המבנה הוא תמיד: נושא + פועל + תיאור (SVO).",
  "alternativeSentence": "I believe that children ought to read every day."
}`;

    const cascadePlan: Array<{
      provider: string;
      model: string;
      execute: () => Promise<string>;
    }> = [];

    // 1. Groq Flagship: openai/gpt-oss-120b
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
              messages: [{ role: "user", content: promptText }],
              response_format: { type: "json_object" },
              temperature: 0.2,
            }),
          });
          if (!res.ok) throw new Error(`Groq 120b status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });

      // Groq llama-3.3-70b-versatile
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
              messages: [{ role: "user", content: promptText }],
              response_format: { type: "json_object" },
              temperature: 0.2,
            }),
          });
          if (!res.ok) throw new Error(`Groq 70b status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });
    }

    // 2. Google Gemini: gemini-2.5-flash / gemini-2.0-flash / gemini-1.5-flash
    if (geminiApiKey) {
      for (const gemModel of ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]) {
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
                  contents: [{ parts: [{ text: promptText }] }],
                  generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.2,
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

    // 3. Groq qwen fast backup
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
              messages: [{ role: "user", content: promptText }],
              response_format: { type: "json_object" },
              temperature: 0.2,
            }),
          });
          if (!res.ok) throw new Error(`Groq qwen status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });
    }

    // 4. OpenAI backup
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
              messages: [{ role: "user", content: promptText }],
              response_format: { type: "json_object" },
              temperature: 0.2,
            }),
          });
          if (!res.ok) throw new Error(`OpenAI status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });
    }

    let result: ScaffoldingResult | null = null;
    let successfulProvider = "";

    for (const step of cascadePlan) {
      try {
        const rawOutput = await step.execute();
        if (rawOutput) {
          const parsed = extractJsonFromText(rawOutput) as ScaffoldingResult;
          if (parsed && parsed.fullSentence && Array.isArray(parsed.chunks)) {
            result = parsed;
            successfulProvider = `${step.provider}:${step.model}`;
            break;
          }
        }
      } catch (err: any) {
        console.warn(`Scaffolding cascade failed on ${step.provider}:${step.model}:`, err.message);
      }
    }

    if (!result) {
      // Deterministic fallback if all AI providers are exhausted
      return NextResponse.json({
        success: true,
        scaffolding: {
          fullSentence: `I want to say that ${hebrewText.trim()}.`,
          chunks: [
            {
              hebrew: "אני רוצה לומר ש...",
              english: "I want to say that",
              tip: "פתיח פשוט וברור",
              role: "connector",
            },
            {
              hebrew: hebrewText.trim(),
              english: `[${hebrewText.trim()}]`,
              tip: "נסו לתרגם את המילים העיקריות בעזרת המילון המובנה",
              role: "object",
            },
          ],
          hebrewSummaryTip: "כדי לנסח משפט באנגלית, התחילו בנושא (Subject), הוסיפו פועל (Verb), והשלימו את הרעיון.",
        },
        source: "fallback",
      });
    }

    return NextResponse.json({
      success: true,
      scaffolding: result,
      source: successfulProvider,
    });
  } catch (error: any) {
    console.error("Scaffold writing API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to scaffold sentence." },
      { status: 500 }
    );
  }
}
