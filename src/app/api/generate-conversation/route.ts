import { NextResponse } from "next/server";
import {
  ConversationScenario,
  ConversationQuestion,
  ConversationCategory,
  DialogueSpeaker,
  DialogueTurn,
} from "@/types/conversation";
import {
  REAL_LIFE_CONVERSATIONS,
  randomizeConversationQuestionsOptions,
} from "@/data/conversations";
import {
  errorMessage,
  extractJsonFromText,
  isJsonObject,
  jsonObjects,
  jsonObject,
  type JsonValue,
} from "@/lib/llm-json";

function validateAndFormatScenario(
  rawObj: JsonValue,
  selectedLevel: "Level 1" | "Level 2" | "Level 3",
  fallbackCategory: ConversationCategory = "school_social"
): ConversationScenario | null {
  if (!isJsonObject(rawObj)) return null;

  const hebrewRegex = /[\u0590-\u05FF]/g;
  const englishRegex = /[a-zA-Z]/g;

  const rawTurns = jsonObjects(rawObj.turns);
  if (rawTurns.length < 6) return null;

  const speakers: DialogueSpeaker[] =
    Array.isArray(rawObj.speakers) && rawObj.speakers.length >= 2
      ? rawObj.speakers.slice(0, 2).map((raw, idx): DialogueSpeaker => {
          const s = jsonObject(raw);
          const genderHint = s.genderHint === "female" || s.genderHint === "male" ? s.genderHint : idx === 0 ? "male" : "female";
          return {
            id: idx === 0 ? "speaker_a" : "speaker_b",
            name: String(s.name || (idx === 0 ? "Alex" : "Maya")).trim(),
            role: String(s.role || (idx === 0 ? "Speaker A" : "Speaker B")).trim(),
            avatarEmoji: String(s.avatarEmoji || (idx === 0 ? "🗣️" : "💬")).trim(),
            genderHint,
            colorTheme: idx === 0 ? "sky" : "amber",
          };
        })
      : [
          {
            id: "speaker_a",
            name: "Alex",
            role: "Speaker A",
            avatarEmoji: "🗣️",
            genderHint: "male",
            colorTheme: "sky",
          },
          {
            id: "speaker_b",
            name: "Maya",
            role: "Speaker B",
            avatarEmoji: "💬",
            genderHint: "female",
            colorTheme: "amber",
          },
        ];

  const turns: DialogueTurn[] = [];
  for (let i = 0; i < rawTurns.length; i++) {
    const t = rawTurns[i];
    const text = String(t?.text || "").trim();
    if (!text) continue;
    if ((text.match(hebrewRegex) || []).length > 0 || (text.match(englishRegex) || []).length < 8) {
      return null;
    }
    turns.push({
      index: turns.length,
      speakerId:
        t?.speakerId === "speaker_b" || (t?.speakerId !== "speaker_a" && turns.length % 2 === 1)
          ? "speaker_b"
          : "speaker_a",
      text,
      stageDirection: t?.stageDirection ? String(t.stageDirection).trim() : undefined,
    });
  }

  if (turns.length < 6) return null;

  let title = String(rawObj.title || "").trim();
  let hebrewTitle = String(rawObj.hebrewTitle || "").trim();

  const titleHebrewCount = (title.match(hebrewRegex) || []).length;
  const titleEnglishCount = (title.match(englishRegex) || []).length;
  const hebrewTitleHebrewCount = (hebrewTitle.match(hebrewRegex) || []).length;
  const hebrewTitleEnglishCount = (hebrewTitle.match(englishRegex) || []).length;

  if (titleHebrewCount > titleEnglishCount && hebrewTitleEnglishCount > hebrewTitleHebrewCount) {
    const temp = title;
    title = hebrewTitle;
    hebrewTitle = temp;
  }

  if ((title.match(hebrewRegex) || []).length > 0 || (title.match(englishRegex) || []).length < 2) {
    return null;
  }

  const rawQuestions = jsonObjects(rawObj.questions);
  if (rawQuestions.length < 5) return null;

  for (const q of rawQuestions) {
    const prompt = String(q?.prompt || "").trim();
    if ((prompt.match(hebrewRegex) || []).length > 2) return null;
    if (Array.isArray(q?.options)) {
      for (const opt of q.options) {
        if ((String(opt || "").match(hebrewRegex) || []).length > 2) return null;
      }
    }
  }

  const formattedQuestions: ConversationQuestion[] = rawQuestions.slice(0, 10).map((q, idx) => {
    const qNum = idx + 1;
    const tIdx =
      typeof q.turnRefIndex === "number" && q.turnRefIndex >= -1 && q.turnRefIndex < turns.length
        ? q.turnRefIndex
        : Math.min(idx, turns.length - 1);

    const linesHint = String(
      q.linesHint || (tIdx === -1 ? "Whole Conversation" : `Line ${tIdx + 1}`)
    ).trim();
    const explanationHebrew = String(q.explanationHebrew || "התשובה מבוססת על פרטי השיחה.").trim();
    const prompt = String(q.prompt || `Question ${qNum}`).trim();
    const situationContext = q.situationContext ? String(q.situationContext).trim() : undefined;

    let qType: ConversationQuestion["type"] = "mcq";
    if (q.type === "copy" || typeof q.targetSentence === "string") {
      qType = "copy";
    } else if (q.type === "reply_open") {
      qType = "reply_open";
    } else if (q.type === "reply_mcq") {
      qType = "reply_mcq";
    } else if (q.type === "open" || (typeof q.modelAnswer === "string" && !Array.isArray(q.options))) {
      qType = "open";
    }

    if (qType === "copy") {
      const targetSentence = String(
        q.targetSentence || turns[Math.max(0, tIdx)]?.text || turns[0].text
      ).trim();
      return {
        id: `ai-conv-q${qNum}-${Date.now()}-${idx}`,
        number: qNum,
        turnRefIndex: tIdx,
        linesHint,
        type: "copy",
        prompt,
        targetSentence,
        explanationHebrew,
        points: 10,
      };
    }

    if (qType === "open" || qType === "reply_open") {
      const modelAnswer = String(
        q.modelAnswer || "Could you please help me with this?"
      ).trim();
      const rawKeywords = Array.isArray(q.keywords) ? q.keywords : [];
      const keywords = rawKeywords
        .map((k) => String(k || "").trim().toLowerCase())
        .filter((k: string) => k.length > 2);

      return {
        id: `ai-conv-q${qNum}-${Date.now()}-${idx}`,
        number: qNum,
        turnRefIndex: tIdx,
        linesHint: qType === "reply_open" ? "Your Real-Life Turn" : linesHint,
        type: qType,
        prompt,
        situationContext:
          situationContext ||
          (qType === "reply_open"
            ? "Imagine you are in this situation right now and need to respond politely."
            : undefined),
        modelAnswer,
        keywords: keywords.length > 0 ? keywords : ["please", "thank", "help"],
        explanationHebrew,
        points: 10,
      };
    }

    // MCQ or reply_mcq
    const rawOptions =
      Array.isArray(q.options) && q.options.length >= 2
        ? q.options
        : ["Yes, of course!", "No, thank you.", "Not mentioned", "None of the above"];
    const options = rawOptions.slice(0, 4).map((opt) => String(opt || "").trim());
    while (options.length < 4) {
      options.push(`Option ${options.length + 1}`);
    }
    const correctIndex =
      typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < options.length
        ? q.correctIndex
        : 0;

    return {
      id: `ai-conv-q${qNum}-${Date.now()}-${idx}`,
      number: qNum,
      turnRefIndex: tIdx,
      linesHint: qType === "reply_mcq" ? "Real-Life Situation" : linesHint,
      type: qType,
      prompt,
      situationContext,
      options,
      correctIndex,
      explanationHebrew,
      points: 10,
    };
  });

  // Pad to 10 questions if fewer were returned
  while (formattedQuestions.length < 10) {
    const qNum = formattedQuestions.length + 1;
    const tIdx = Math.min(qNum - 1, turns.length - 1);
    if (qNum === 10) {
      formattedQuestions.push({
        id: `ai-conv-q10-${Date.now()}`,
        number: 10,
        turnRefIndex: -1,
        linesHint: "Your Real-Life Turn",
        type: "reply_open",
        situationContext: "Imagine you are part of this conversation and want to thank the other person politely.",
        prompt: "Write 1–2 polite sentences in English responding naturally to this situation.",
        modelAnswer: "Thank you so much for your help today! I really appreciate it.",
        keywords: ["thank", "help", "please", "appreciate"],
        explanationHebrew: "תשובה טבעית ומנומסת המתאימה לסיטואציה.",
        points: 10,
      });
    } else {
      formattedQuestions.push({
        id: `ai-conv-q${qNum}-${Date.now()}`,
        number: qNum,
        turnRefIndex: tIdx,
        linesHint: `Line ${tIdx + 1}`,
        type: "copy",
        prompt: `Copy the exact sentence from Line ${tIdx + 1}.`,
        targetSentence: turns[tIdx].text,
        explanationHebrew: `המשפט המדויק משורה ${tIdx + 1}.`,
        points: 10,
      });
    }
  }

  const balancedQuestions = randomizeConversationQuestionsOptions(formattedQuestions);

  const validCategories: ConversationCategory[] = [
    "travel",
    "food",
    "shopping",
    "school_social",
    "health",
    "tech_daily",
  ];
  const rawCategory = validCategories.find((c) => c === rawObj.category);
  const category: ConversationCategory = rawCategory ?? fallbackCategory;

  const categoryLabels: Record<ConversationCategory, string> = {
    travel: "טיולים והתמצאות",
    food: "מסעדות ובתי קפה",
    shopping: "קניות וחנויות",
    school_social: "חברים ובית ספר",
    health: "בריאות ומרפאה",
    tech_daily: "טכנולוגיה ויומיום",
  };

  const usefulPhrases = Array.isArray(rawObj.usefulPhrases)
    ? jsonObjects(rawObj.usefulPhrases)
        .filter((p) => (p.phrase || p.word) && p.translation)
        .map((p) => ({
          phrase: String(p.phrase || p.word).trim(),
          translation: String(p.translation).trim(),
          usageNoteHebrew: p.usageNoteHebrew ? String(p.usageNoteHebrew).trim() : undefined,
        }))
    : [];

  return {
    id: `ai-conv-${Date.now()}`,
    title: title || "Real-Life English Conversation",
    hebrewTitle: hebrewTitle || "שיחה מעשית באנגלית מהחיים",
    category,
    categoryLabelHebrew: categoryLabels[category],
    settingDescription: String(
      rawObj.settingDescription ||
        "Two people having a practical real-world conversation in English."
    ).trim(),
    level: selectedLevel,
    levelLabel:
      selectedLevel === "Level 1"
        ? "רמה 1 - שיחות בסיסיות מהחיים"
        : selectedLevel === "Level 2"
        ? "רמה 2 - שיחות מעשיות שוטפות"
        : "רמה 3 - תקשורת מתקדמת ופתרון בעיות",
    levelDescription:
      selectedLevel === "Level 1"
        ? "Everyday English dialogue with clear, practical vocabulary."
        : selectedLevel === "Level 2"
        ? "Natural real-world English conversation for intermediate learners."
        : "Nuanced real-world communication, idioms, and problem-solving.",
    speakers,
    turns,
    usefulPhrases,
    questions: balancedQuestions,
    totalPoints: 100,
    isAiGenerated: true,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      level = "Level 2",
      topic = "",
      category = "all",
      allowFallback = false,
    } = body;

    const selectedLevel = (["Level 1", "Level 2", "Level 3"].includes(level)
      ? level
      : "Level 2") as "Level 1" | "Level 2" | "Level 3";

    const fallbackCat = (
      category && category !== "all" ? category : "school_social"
    ) as ConversationCategory;

    const resolvedTopic =
      topic && topic.trim()
        ? topic.trim()
        : "a practical everyday real-life situation between two speakers";

    const groqApiKey = request.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY;
    const geminiApiKey = request.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY;
    const openaiApiKey = request.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY;

    if (!groqApiKey && !geminiApiKey && !openaiApiKey) {
      if (allowFallback) {
        const candidates = REAL_LIFE_CONVERSATIONS.filter((c) => c.level === selectedLevel);
        const chosen =
          candidates[Math.floor(Math.random() * candidates.length)] ||
          REAL_LIFE_CONVERSATIONS[0];
        return NextResponse.json({
          success: true,
          scenario: {
            ...chosen,
            questions: randomizeConversationQuestionsOptions(chosen.questions),
          },
          isFallback: true,
        });
      }
      return NextResponse.json(
        {
          success: false,
          reason: "missing_api_keys",
          message:
            "יש להגדיר מפתח AI (Groq או Gemini) בהגדרות או בקובץ .env.local כדי ליצור שיחה חדשה.",
        },
        { status: 400 }
      );
    }

    const levelPrompt =
      selectedLevel === "Level 1"
        ? "Level 1 (Beginner / CEFR A1-A2): Short, clear, everyday spoken sentences, high-frequency words, polite basic requests."
        : selectedLevel === "Level 2"
        ? "Level 2 (Intermediate / CEFR A2-B1): Natural spoken English, practical problem-solving, helpful everyday expressions."
        : "Level 3 (Advanced / CEFR B1-B2): Rich, authentic spoken English, polite diplomacy, natural idioms, and nuanced real-world problem solving.";

    const systemPrompt = `You are an expert English conversation curriculum designer for Israeli students.
Generate a realistic, engaging, real-world spoken English conversation ("turns") between 2 speakers, along with 5 useful everyday phrases and EXACTLY 10 pedagogical questions.

CRITICAL LANGUAGE RULES:
1. All dialogue turns ("turns[].text"), "title", "settingDescription", "speakers", and all question "prompt", "situationContext", "options", "targetSentence", and "modelAnswer" MUST BE 100% IN ENGLISH!
2. Even if the requested topic is in Hebrew ("${resolvedTopic}"), translate the concept into a realistic English scenario.
3. Only "hebrewTitle", "usefulPhrases[].translation", and "questions[].explanationHebrew" should be in natural Hebrew.

Scenario Parameters:
- Target Level: ${selectedLevel} (${levelPrompt})
- Scenario Topic: "${resolvedTopic}"

Dialogue Requirements:
- 2 distinct speakers ("speaker_a" and "speaker_b") with realistic names, roles, avatar emojis, and genderHint ("male" or "female").
- Dialogue length depending on level:
  * For Level 1: Exactly 10 dialogue turns (alternating between speaker_a and speaker_b, indexed 0 to 9, corresponding to Line 1 to Line 10).
  * For Level 2: 16 to 18 dialogue turns (longer, realistic conversation with natural pacing).
  * For Level 3: 20 to 22 dialogue turns (comprehensive, authentic in-depth dialogue with nuanced turns).
- 5 useful phrases from the dialogue with accurate Hebrew translations.

Questions Requirements (EXACTLY 10 questions, numbered 1 to 10):
- Ensure "turnRefIndex" accurately references the relevant turn index (0-based) and "linesHint" matches "Line X" (where X = turnRefIndex + 1). For "copy" questions, "targetSentence" MUST appear verbatim inside that specific turn's text.
- 3 to 4 Comprehension Multiple Choice questions ("type": "mcq") testing details, tone, or meaning of phrases in context.
- 2 Sentence Copying questions ("type": "copy") asking the student to copy the exact sentence from a specific Line (e.g. "Copy the sentence from Line 4 that shows...").
- 2 Open Comprehension questions ("type": "open") answered in the student's own words in English, with "modelAnswer" and 2-4 "keywords".
- 2 "What Would You Say?" Multiple Choice questions ("type": "reply_mcq") with a realistic "situationContext" and 4 spoken options where 1 is the most polite, natural real-life response.
- 1 "What Would You Say?" Open Spoken Response ("type": "reply_open", Question 10) with a realistic "situationContext" asking the student to write 1-2 natural sentences they would say in that moment, with "modelAnswer" and "keywords".

Return ONLY a valid raw JSON object matching this exact structure:
{
  "title": "Ordering Pizza for a Class Party",
  "hebrewTitle": "הזמנת פיצה למסיבת כיתה",
  "category": "food",
  "settingDescription": "Noam calls a local pizzeria in Boston to order pizzas for his class.",
  "speakers": [
    { "id": "speaker_a", "name": "Tony", "role": "Pizzeria Staff", "avatarEmoji": "🍕", "genderHint": "male" },
    { "id": "speaker_b", "name": "Noam", "role": "Customer", "avatarEmoji": "📞", "genderHint": "male" }
  ],
  "turns": [
    { "index": 0, "speakerId": "speaker_a", "text": "Hello, Tony's Pizzeria! Will this be for delivery or pickup today?" },
    { "index": 1, "speakerId": "speaker_b", "text": "Hi! I would like to place an order for delivery, please." }
  ],
  "usefulPhrases": [
    { "phrase": "place an order", "translation": "לבצע הזמנה" }
  ],
  "questions": [
    {
      "number": 1,
      "turnRefIndex": 1,
      "linesHint": "Line 2",
      "type": "mcq",
      "prompt": "What kind of order does Noam want to place?",
      "options": ["A delivery order.", "A pickup order.", "A table reservation.", "A refund request."],
      "correctIndex": 0,
      "explanationHebrew": "בשורה 2 נועם מבקש לבצע הזמנה למשלוח (delivery)."
    }
  ]
}`;

    const cascadePlan: Array<{
      provider: string;
      model: string;
      execute: () => Promise<string>;
    }> = [];

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
              temperature: 0.65,
            }),
          });
          if (!res.ok) throw new Error(`Groq 120b status ${res.status}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });
    }

    if (geminiApiKey) {
      cascadePlan.push({
        provider: "gemini",
        model: "gemini-3.5-flash",
        execute: async () => {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiApiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.65,
                },
              }),
            }
          );
          if (!res.ok) throw new Error(`Gemini 3.5-flash status ${res.status}`);
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        },
      });
    }

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
              temperature: 0.65,
            }),
          });
          if (!res.ok) throw new Error(`Groq qwen status ${res.status}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });
    }

    if (geminiApiKey) {
      cascadePlan.push({
        provider: "gemini",
        model: "gemini-3.5-flash-lite",
        execute: async () => {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${geminiApiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.65,
                },
              }),
            }
          );
          if (!res.ok) throw new Error(`Gemini lite status ${res.status}`);
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        },
      });
    }

    if (openaiApiKey) {
      cascadePlan.push({
        provider: "openai",
        model: "gpt-4o",
        execute: async () => {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o",
              messages: [{ role: "user", content: systemPrompt }],
              response_format: { type: "json_object" },
            }),
          });
          if (!res.ok) throw new Error(`OpenAI status ${res.status}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });
    }

    let lastError: unknown = null;
    for (const step of cascadePlan) {
      try {
        const rawOutput = await step.execute();
        if (!rawOutput) continue;
        const parsedObj = extractJsonFromText(rawOutput);
        const scenario = validateAndFormatScenario(parsedObj, selectedLevel, fallbackCat);
        if (scenario) {
          scenario.generationPrompt = resolvedTopic;
          scenario.isAiGenerated = true;
          return NextResponse.json({
            success: true,
            scenario,
            isAiGenerated: true,
            modelUsed: step.model,
            providerUsed: step.provider,
          });
        }
      } catch (err) {
        lastError = err;
      }
    }

    return NextResponse.json(
      {
        success: false,
        reason: "all_models_busy",
        message: "כל מודלי ה-AI היו עמוסים זמנית. אנא נסו שוב בעוד מספר שניות.",
        detail: lastError ? errorMessage(lastError) : undefined,
      },
      { status: 503 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        reason: "internal_error",
        message: "אירעה שגיאה ביצירת השיחה. אנא נסו שוב.",
        detail: errorMessage(error),
      },
      { status: 500 }
    );
  }
}
