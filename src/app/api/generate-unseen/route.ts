import { NextResponse } from "next/server";
import { MIDDLE_SCHOOL_UNSEENS, MSUnseenStory, MSUnseenQuestion, randomizeQuestionsOptions } from "@/data/unseen-middle-school";

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

// Helper to guarantee at least 4 open/copy questions per text
function ensureMinimumOpenQuestions(
  questions: MSUnseenQuestion[],
  paragraphs: string[]
): MSUnseenQuestion[] {
  let openOrCopyCount = questions.filter((q) => q.type === "open" || q.type === "copy").length;
  if (openOrCopyCount >= 4) return questions;

  // Question indices suitable for open/copy (e.g. Q2, Q4, Q6, Q8, Q9)
  const candidateIndices = [1, 3, 5, 7, 8];

  return questions.map((q, idx) => {
    if (openOrCopyCount >= 4 || q.type !== "mcq" || !candidateIndices.includes(idx)) {
      return q;
    }

    const pIdx =
      q.paragraphIndex >= 0 && q.paragraphIndex < paragraphs.length
        ? q.paragraphIndex
        : Math.min(Math.floor(idx / 2), paragraphs.length - 1);

    const pText = paragraphs[pIdx] || paragraphs[0] || "";
    const rawSentences = pText.match(/[^.!?]+[.!?]+/g) || [pText];
    const sentences = rawSentences.map((s) => s.trim()).filter((s) => s.length > 15);

    // Alternate between copy and open
    const shouldBeCopy = openOrCopyCount % 2 === 0;

    if (shouldBeCopy && sentences.length > 0) {
      const targetSentence = sentences[Math.min(1, sentences.length - 1)] || sentences[0];
      openOrCopyCount++;
      const { options: _o, correctIndex: _ci, ...rest } = q;
      return {
        ...rest,
        type: "copy" as const,
        prompt: `Copy the sentence from paragraph ${pIdx + 1} that describes the main detail in this part.`,
        targetSentence,
        explanationHebrew: `המשפט הנכון מהפסקה הוא: "${targetSentence}".`,
      };
    } else {
      const correctOption =
        q.options && typeof q.correctIndex === "number" && q.options[q.correctIndex]
          ? q.options[q.correctIndex]
          : sentences[0] || "Key information from the passage.";

      const keywords = correctOption
        .split(/\s+/)
        .map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""))
        .filter((w) => w.length > 3)
        .slice(0, 4);

      openOrCopyCount++;
      const { options: _o, correctIndex: _ci, ...rest } = q;
      return {
        ...rest,
        type: "open" as const,
        prompt: q.prompt.replace(/\?$/, "") + " (answer in your own words in English)?",
        modelAnswer: correctOption,
        keywords: keywords.length > 0 ? keywords : ["important", "text"],
        explanationHebrew: q.explanationHebrew || `התשובה מבוססת על המידע בפסקה: ${correctOption}.`,
      };
    }
  });
}

function validateAndFormatStory(
  rawObj: any,
  selectedLevel: "Level 1" | "Level 2" | "Level 3"
): MSUnseenStory | null {
  if (!rawObj || typeof rawObj !== "object") return null;

  const paragraphs: string[] = Array.isArray(rawObj.paragraphs)
    ? rawObj.paragraphs.filter((p: any) => typeof p === "string" && p.trim().length > 0)
    : [];

  if (paragraphs.length < 3) return null;

  const rawQuestions: any[] = Array.isArray(rawObj.questions) ? rawObj.questions : [];
  if (rawQuestions.length < 5) return null;

  // Format exactly 10 questions supporting mcq, open, and copy
  const formattedQuestions: MSUnseenQuestion[] = rawQuestions.slice(0, 10).map((q, idx) => {
    const qNum = idx + 1;
    const pIdx =
      typeof q.paragraphIndex === "number" && q.paragraphIndex >= -1 && q.paragraphIndex < paragraphs.length
        ? q.paragraphIndex
        : idx < 2
        ? 0
        : idx < 4
        ? 1
        : idx < 6
        ? 2
        : idx < 8
        ? 3
        : idx === 8
        ? Math.min(4, paragraphs.length - 1)
        : -1;

    const linesHint = pIdx === -1 ? "The entire text" : `Paragraph ${pIdx + 1}`;
    const explanationHebrew = String(q.explanationHebrew || "התשובה נשענת על פרטי הפסקה.").trim();
    const prompt = String(q.prompt || `Question ${qNum}`).trim();

    // Detect question type
    let qType: "mcq" | "open" | "copy" = "mcq";
    if (q.type === "copy" || typeof q.targetSentence === "string") {
      qType = "copy";
    } else if (q.type === "open" || typeof q.modelAnswer === "string" || Array.isArray(q.keywords)) {
      qType = "open";
    }

    if (qType === "copy") {
      let targetSentence = String(q.targetSentence || "").trim();
      if (!targetSentence && pIdx >= 0 && paragraphs[pIdx]) {
        const sentences = paragraphs[pIdx].match(/[^.!?]+[.!?]+/g) || [paragraphs[pIdx]];
        targetSentence = (sentences[0] || paragraphs[pIdx]).trim();
      }
      return {
        id: `ai-q${qNum}-${Date.now()}-${idx}`,
        number: qNum,
        paragraphIndex: pIdx,
        linesHint,
        type: "copy" as const,
        prompt,
        targetSentence,
        explanationHebrew,
        points: 10,
      };
    }

    if (qType === "open") {
      const modelAnswer = String(q.modelAnswer || "A complete answer based on the paragraph.").trim();
      const rawKeywords = Array.isArray(q.keywords) ? q.keywords : [];
      const keywords = rawKeywords
        .map((k: any) => String(k || "").trim().toLowerCase())
        .filter((k: string) => k.length > 2);

      return {
        id: `ai-q${qNum}-${Date.now()}-${idx}`,
        number: qNum,
        paragraphIndex: pIdx,
        linesHint,
        type: "open" as const,
        prompt,
        modelAnswer,
        keywords: keywords.length > 0 ? keywords : ["important", "information"],
        explanationHebrew,
        points: 10,
      };
    }

    // MCQ
    const rawOptions = Array.isArray(q.options) && q.options.length >= 2 ? q.options : ["True", "False", "Not mentioned", "None"];
    const options = rawOptions.slice(0, 4).map((opt: any) => String(opt || "").trim());
    while (options.length < 4) {
      options.push(`Alternative ${options.length + 1}`);
    }

    const correctIndex =
      typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < options.length ? q.correctIndex : 0;

    return {
      id: `ai-q${qNum}-${Date.now()}-${idx}`,
      number: qNum,
      paragraphIndex: pIdx,
      linesHint,
      type: "mcq" as const,
      prompt,
      options,
      correctIndex,
      explanationHebrew,
      points: 10,
    };
  });

  // Ensure exactly 10 questions if we had fewer than 10
  while (formattedQuestions.length < 10) {
    const qNum = formattedQuestions.length + 1;
    const pIdx = Math.min(Math.floor((qNum - 1) / 2), paragraphs.length - 1);
    const pText = paragraphs[pIdx] || paragraphs[0] || "";
    const rawSentences = pText.match(/[^.!?]+[.!?]+/g) || [pText];
    const sentences = rawSentences.map((s) => s.trim()).filter((s) => s.length > 15);

    const currentOpenCount = formattedQuestions.filter((q) => q.type === "open" || q.type === "copy").length;

    if (currentOpenCount < 4) {
      if (currentOpenCount % 2 === 0 && sentences.length > 0) {
        const targetSentence = sentences[0];
        formattedQuestions.push({
          id: `ai-q${qNum}-${Date.now()}-${qNum}`,
          number: qNum,
          paragraphIndex: pIdx,
          linesHint: `Paragraph ${pIdx + 1}`,
          type: "copy",
          prompt: `Copy the sentence from paragraph ${pIdx + 1} that gives important details.`,
          targetSentence,
          explanationHebrew: `המשפט הנכון הוא: "${targetSentence}".`,
          points: 10,
        });
      } else {
        formattedQuestions.push({
          id: `ai-q${qNum}-${Date.now()}-${qNum}`,
          number: qNum,
          paragraphIndex: pIdx,
          linesHint: `Paragraph ${pIdx + 1}`,
          type: "open",
          prompt: `What is an important detail learned in paragraph ${pIdx + 1}?`,
          modelAnswer: sentences[0] || "Key information from the paragraph.",
          keywords: (sentences[0] || "").split(/\s+/).map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")).filter((w) => w.length > 3).slice(0, 3),
          explanationHebrew: "התשובה מבוססת על המידע בפסקה.",
          points: 10,
        });
      }
    } else {
      formattedQuestions.push({
        id: `ai-q${qNum}-${Date.now()}-${qNum}`,
        number: qNum,
        paragraphIndex: -1,
        linesHint: "The entire text",
        type: "mcq",
        prompt: "What is the main message of the passage?",
        options: [
          "It teaches an inspiring lesson about learning and perseverance.",
          "It explains why history should be forgotten.",
          "It describes why everyday science is not important.",
          "It proves that modern technology has no benefits.",
        ],
        correctIndex: 0,
        explanationHebrew: "הקטע כולו מעביר מסר מעורר השראה ומלמד.",
        points: 10,
      });
    }
  }

  // Guarantee that at least 4 questions are open or copy
  const questionsWithMinimumOpen = ensureMinimumOpenQuestions(formattedQuestions, paragraphs);

  // Shuffle and balance multiple choice option locations across A, B, C, D
  const balancedQuestions = randomizeQuestionsOptions(questionsWithMinimumOpen);

  const defaultTitles: Record<string, { en: string; he: string }> = {
    "Level 1": { en: "A Great New Adventure", he: "הרפתקה חדשה ומעניינת" },
    "Level 2": { en: "The Curious Journey", he: "המסע המרתק" },
    "Level 3": { en: "A Deeper Understanding", he: "מבט מעמיק אל העולם" },
  };

  const vocabularyHints = Array.isArray(rawObj.vocabularyHints)
    ? rawObj.vocabularyHints
        .filter((h: any) => h && h.word && h.translation)
        .map((h: any) => ({ word: String(h.word).trim(), translation: String(h.translation).trim() }))
    : [];

  return {
    id: `ai-story-${Date.now()}`,
    title: String(rawObj.title || defaultTitles[selectedLevel].en).trim(),
    hebrewTitle: String(rawObj.hebrewTitle || defaultTitles[selectedLevel].he).trim(),
    level: selectedLevel,
    levelLabel:
      selectedLevel === "Level 1"
        ? "רמה 1 - קוראים מתחילים"
        : selectedLevel === "Level 2"
        ? "רמה 2 - רמה שוטפת"
        : "רמה 3 - מתקדמים ודוברי אנגלית",
    levelDescription:
      selectedLevel === "Level 1"
        ? "Starting level English, for students who are beginner readers."
        : selectedLevel === "Level 2"
        ? "For native Hebrew speakers who are in a satisfactory level in English."
        : "Challenging texts for fluent English speakers with rich vocabulary.",
    paragraphs,
    vocabularyHints,
    questions: balancedQuestions,
    totalPoints: 100,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { level = "Level 2", topic = "", allowFallback = false } = body;

    const selectedLevel = (["Level 1", "Level 2", "Level 3"].includes(level) ? level : "Level 2") as
      | "Level 1"
      | "Level 2"
      | "Level 3";

    const resolvedTopic = topic && topic.trim() ? topic.trim() : "an exciting and educational real-world adventure";

    // API Keys: Prefer headers (from client storage) or server environment variables
    const groqApiKey = request.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY;
    const geminiApiKey = request.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY;
    const openaiApiKey = request.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY;

    if (!groqApiKey && !geminiApiKey && !openaiApiKey) {
      if (allowFallback) {
        const candidates = MIDDLE_SCHOOL_UNSEENS.filter((s) => s.level === selectedLevel);
        const chosen = candidates[Math.floor(Math.random() * candidates.length)] || MIDDLE_SCHOOL_UNSEENS[0];
        const storyWithRandomizedMcqs: MSUnseenStory = {
          ...chosen,
          questions: randomizeQuestionsOptions(chosen.questions),
        };
        return NextResponse.json({
          success: true,
          story: storyWithRandomizedMcqs,
          isFallback: true,
          reason: "missing_api_keys",
          message: "No AI API key found. Loaded a matching story from the library.",
        });
      }

      return NextResponse.json(
        {
          success: false,
          reason: "missing_api_keys",
          message: "יש להגדיר מפתח AI (Groq או Gemini) בהגדרות או בקובץ .env.local כדי ליצור קטעים מקוריים.",
        },
        { status: 400 }
      );
    }

    let levelPrompt = "";
    if (selectedLevel === "Level 1") {
      levelPrompt =
        "Level 1 (Beginner Readers, CEFR A1/A2): Write in short, clear sentences using present tense and high-frequency everyday vocabulary. Direct narrative. Avoid complicated subordinate clauses or idioms.";
    } else if (selectedLevel === "Level 2") {
      levelPrompt =
        "Level 2 (Intermediate Middle School, CEFR A2/B1): Natural past/present/future tenses, descriptive vocabulary, engaging details, and compound sentences. Suitable for 7th-9th grade Israeli curriculum.";
    } else {
      levelPrompt =
        "Level 3 (Fluent / Advanced English, CEFR B2): Sophisticated syntax, rich expressive vocabulary, subtle themes, and analytical inference questions suitable for fluent and native-level students.";
    }

    const systemPrompt = `You are a master English curriculum designer and test writer for middle school and high school (Israeli Bagrut standard).
Generate a complete, high-quality reading comprehension (Unseen) activity with EXACTLY 10 questions.

Pedagogical Parameters:
- Target Level: ${selectedLevel} (${levelPrompt})
- Theme / Subject: ${resolvedTopic}

Output Requirements:
- Paragraphs: EXACTLY 4 or 5 paragraphs (50 to 75 words each).
- Questions: EXACTLY 10 questions (numbered 1 to 10).
  - Q1-Q2 test Paragraph 1
  - Q3-Q4 test Paragraph 2
  - Q5-Q6 test Paragraph 3
  - Q7-Q8 test Paragraph 4
  - Q9 tests Paragraph 5 (or 4 if 4 paragraphs total)
  - Q10 tests the entire passage (global theme / main message)

MANDATORY QUESTION TYPE MIX (CRITICAL REQUIREMENT - AT LEAST 4 OPEN/COPY QUESTIONS):
Every passage MUST contain a pedagogically balanced mix of question types, with AT LEAST 4 open-ended questions:
1. Multiple Choice ('type': 'mcq') - 5 to 6 questions total:
   - Must have 4 options with realistic plausible distractors.
   - 'correctIndex': integer (0 to 3), evenly distributed across A, B, C, D (do NOT make A the answer for all!).
2. Sentence Copying ('type': 'copy') - AT LEAST 2 questions (e.g. Q2, Q6):
   - Student must copy an exact sentence directly from the designated paragraph.
   - 'prompt': e.g. "Copy the sentence from paragraph 1 that proves..."
   - 'targetSentence': The exact, verbatim sentence directly from the paragraph.
3. Open-Ended Comprehension ('type': 'open') - AT LEAST 2 questions (e.g. Q4, Q8):
   - Student writes a free-form answer in English based on the text.
   - 'prompt': e.g. "Why did the character decide to...?", "Explain two reasons according to paragraph 2."
   - 'modelAnswer': A clear, complete sample model answer in English.
   - 'keywords': An array of 2 to 4 essential keywords expected in the student's answer for automated checking.
TOTAL: Exactly or at least 4 questions out of the 10 MUST be 'copy' or 'open' questions!

- Hebrew Explanations: Every question must have an encouraging, natural Hebrew explanation ('explanationHebrew') explaining why the answer is right.
- Vocabulary Hints: 4-6 key words with their accurate Hebrew translations.

Return ONLY a valid, raw JSON object matching this schema (NO MARKDOWN FENCES, NO COMMENTARY):
{
  "title": "Compelling English Title",
  "hebrewTitle": "תרגום טבעי של הכותרת לעברית",
  "paragraphs": [
    "Paragraph 1 text...",
    "Paragraph 2 text...",
    "Paragraph 3 text...",
    "Paragraph 4 text...",
    "Paragraph 5 text..."
  ],
  "vocabularyHints": [
    { "word": "exampleWord", "translation": "תרגום לעברית" }
  ],
  "questions": [
    {
      "number": 1,
      "paragraphIndex": 0,
      "linesHint": "Paragraph 1",
      "type": "mcq",
      "prompt": "What does the text say about...?",
      "options": ["Plausible distractor 1", "Correct option", "Plausible distractor 2", "Plausible distractor 3"],
      "correctIndex": 1,
      "explanationHebrew": "הסבר ברור בעברית מדוע תשובה זו נכונה לפי הפסקה הראשונה."
    },
    {
      "number": 2,
      "paragraphIndex": 0,
      "linesHint": "Paragraph 1",
      "type": "copy",
      "prompt": "Copy the sentence from paragraph 1 that shows...",
      "targetSentence": "Exact verbatim sentence from paragraph 1.",
      "explanationHebrew": "המשפט הנכון מפסקה 1 שמראה זאת הוא..."
    },
    {
      "number": 3,
      "paragraphIndex": 1,
      "linesHint": "Paragraph 2",
      "type": "mcq",
      "prompt": "According to paragraph 2, why...?",
      "options": ["Correct option", "Plausible distractor 1", "Plausible distractor 2", "Plausible distractor 3"],
      "correctIndex": 0,
      "explanationHebrew": "הסבר בעברית לפי פסקה 2."
    },
    {
      "number": 4,
      "paragraphIndex": 1,
      "linesHint": "Paragraph 2",
      "type": "open",
      "prompt": "Explain why this discovery was important.",
      "modelAnswer": "Because it helped scientists understand ancient history.",
      "keywords": ["helped", "scientists", "understand", "history"],
      "explanationHebrew": "התשובה מבוססת על כך שהתגלית עזרה למדענים להבין את ההיסטוריה העתיקה."
    }
  ]
}`;

    // Cascade Priority Steps
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
              temperature: 0.6,
            }),
          });
          if (!res.ok) throw new Error(`Groq 120b status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });
    }

    // 2. Google Gemini: gemini-3.5-flash
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
                  temperature: 0.6,
                },
              }),
            }
          );
          if (!res.ok) throw new Error(`Gemini 3.5-flash status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        },
      });
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
              temperature: 0.6,
            }),
          });
          if (!res.ok) throw new Error(`Groq qwen status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });
    }

    // 4. Gemini Fast Fallback: gemini-3.5-flash-lite
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
                  temperature: 0.6,
                },
              }),
            }
          );
          if (!res.ok) throw new Error(`Gemini 3.5-flash-lite status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        },
      });
    }

    // 5. OpenAI (if key provided): gpt-4o
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
          if (!res.ok) throw new Error(`OpenAI status ${res.status}: ${await res.text()}`);
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      });
    }

    // Run the cascade
    let lastError: any = null;

    for (const step of cascadePlan) {
      try {
        const rawOutput = await step.execute();
        if (!rawOutput) continue;

        const parsedObj = extractJsonFromText(rawOutput);
        const story = validateAndFormatStory(parsedObj, selectedLevel);
        if (story) {
          return NextResponse.json({
            success: true,
            story,
            isAiGenerated: true,
            modelUsed: step.model,
            providerUsed: step.provider,
          });
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[AI Cascade] Step ${step.provider} (${step.model}) failed, trying next... Reason:`, err.message);
      }
    }

    // If all AI models failed
    if (allowFallback) {
      const candidates = MIDDLE_SCHOOL_UNSEENS.filter((s) => s.level === selectedLevel);
      const chosen = candidates[Math.floor(Math.random() * candidates.length)] || MIDDLE_SCHOOL_UNSEENS[0];
      const storyWithRandomizedMcqs: MSUnseenStory = {
        ...chosen,
        questions: randomizeQuestionsOptions(chosen.questions),
      };
      return NextResponse.json({
        success: true,
        story: storyWithRandomizedMcqs,
        isFallback: true,
        message: "שירותי ה-AI עמוסים כרגע. נטען סיפור מתאים מהספרייה המוכנה.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        reason: "all_models_busy",
        message: "כל מודלי ה-AI היו עמוסים זמנית. אנא נסה שוב בעוד מספר שניות.",
        detail: lastError?.message,
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("Generate unseen global error:", error);
    return NextResponse.json(
      {
        success: false,
        reason: "internal_error",
        message: "אירעה שגיאה בעיבוד הבקשה. אנא נסה שוב.",
        detail: error?.message,
      },
      { status: 500 }
    );
  }
}
