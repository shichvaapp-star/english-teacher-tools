import { NextResponse } from "next/server";

export interface SentenceChunk {
  hebrew: string;
  english: string;
  explanation: string;
}

export interface ScaffoldingResult {
  fullSentence: string;
  alternativeSentence?: string;
  chunks: SentenceChunk[];
  goldenRule: string;
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
        { success: false, error: "אנא הקלידו משפט בעברית לפירוק ובנייה באנגלית." },
        { status: 400 }
      );
    }

    const currentLevel = level || "Level 2";
    const groqApiKey = request.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY;
    const geminiApiKey = request.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY;
    const openaiApiKey = request.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY;

    let levelPrompt = "";
    if (currentLevel === "Level 1") {
      levelPrompt = `Target audience: Israeli Elementary / Early Beginner (Level 1). Keep vocabulary simple (Core Band I), short S-V-O sentences, emphasize capitalization ("I", first letter).`;
    } else if (currentLevel === "Level 3") {
      levelPrompt = `Target audience: Israeli High School 5-points Bagrut (Level 3). Use rich Band II/III vocabulary and connectors.`;
    } else {
      levelPrompt = `Target audience: Israeli Middle School (Level 2). Use natural Band I/II vocabulary, clear connectors (because, so, but), correct S-V-O word order.`;
    }

    const promptText = `You are an expert Israeli English teacher helping an Israeli student construct an English sentence step-by-step from their thought in Hebrew.

STUDENT HEBREW THOUGHT: "${hebrewText.trim()}"
WRITING TOPIC: "${taskTitle || "General"}"
LEVEL: ${currentLevel}
${levelPrompt}

PEDAGOGICAL TASK:
1. Break the Hebrew thought into 2 to 4 consecutive chronological parts of the sentence.
2. For each part, provide:
   - "hebrew": the Hebrew sub-phrase (e.g. "אני הרבה יותר אוהב")
   - "english": the English equivalent (e.g. "I like ... much more")
   - "explanation": a helpful, friendly, natural Hebrew tip explaining why this English phrasing or grammar is used.
3. Assemble the complete, natural, grammatically correct English sentence in "fullSentence" with proper capitalization and punctuation.
4. Provide an optional alternative way to say it in "alternativeSentence".
5. Provide a memorable takeaway tip for Israeli students in "goldenRule".

CRITICAL READABILITY RULES (NO MIXED FORMULAS):
- Write "explanation" and "goldenRule" in clear, simple, conversational Hebrew for students.
- DO NOT use complex grammar formulas or symbol-heavy code (NEVER write things like "that-clause: that + subject (you) + verb (help)").
- When mentioning an English word, keep it short and in simple quotes (e.g. משתמשים במילה "love").
- Keep explanations concise (1-2 short sentences) so they read naturally from right to left without punctuation confusion.

RETURN STRICT RAW JSON ONLY in this format:
{
  "fullSentence": "I like ice cream much more because I love sweet things.",
  "alternativeSentence": "I prefer ice cream because I have a sweet tooth.",
  "chunks": [
    {
      "hebrew": "אני הרבה יותר אוהב",
      "english": "I like ... much more",
      "explanation": "באנגלית: like ... much more או prefer מביעים העדפה חזקה"
    },
    {
      "hebrew": "גלידה",
      "english": "ice cream",
      "explanation": "שם עצם (ללא the כשמדברים על גלידה באופן כללי)"
    },
    {
      "hebrew": "כי",
      "english": "because",
      "explanation": "מילת קישור מעולה שמחברת בין שני חלקי המשפט"
    },
    {
      "hebrew": "אני אוהב מתוק",
      "english": "I love sweet things",
      "explanation": "מתוק כמשהו כללי מתרגמים ל-sweet things או sweets"
    }
  ],
  "goldenRule": "זכרו שבאנגלית כל חלק של המשפט חייב להכיל נושא ופועל (Subject + Verb)!"
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

      // Groq backup: qwen/qwen3.8-27b
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

      // Groq fast backup: openai/gpt-oss-20b
      cascadePlan.push({
        provider: "groq",
        model: "openai/gpt-oss-20b",
        execute: async () => {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
              model: "openai/gpt-oss-20b",
              messages: [{ role: "user", content: promptText }],
              response_format: { type: "json_object" },
              temperature: 0.2,
            }),
          });
          if (!res.ok) throw new Error(`Groq 20b status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });
    }

    // 2. Google Gemini fallback
    if (geminiApiKey) {
      for (const gemModel of ["gemini-2.0-flash", "gemini-1.5-flash"]) {
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

    // 3. OpenAI fallback
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
          if (parsed && parsed.fullSentence && Array.isArray(parsed.chunks) && parsed.chunks.length > 0) {
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
      return NextResponse.json(
        {
          success: false,
          error: "לא הצלחנו להתחבר כרגע לעוזר ה-AI. אנא נסו שוב בעוד מספר שניות.",
        },
        { status: 503 }
      );
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
