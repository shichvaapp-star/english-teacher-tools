import { NextResponse } from "next/server";
import { MIDDLE_SCHOOL_UNSEENS, MSUnseenStory } from "@/data/unseen-middle-school";

export async function POST(request: Request) {
  try {
    const { level = "Level 2", topic = "" } = await request.json();

    const selectedLevel = (["Level 1", "Level 2", "Level 3"].includes(level) ? level : "Level 2") as
      | "Level 1"
      | "Level 2"
      | "Level 3";

    const resolvedTopic = topic && topic.trim() ? topic.trim() : "an exciting and educational real-world adventure";

    const apiKey = process.env.GEMINI_API_KEY;

    // Helper: Find fallback story from preloaded library
    const getFallbackStory = (lvl: "Level 1" | "Level 2" | "Level 3"): MSUnseenStory => {
      const candidates = MIDDLE_SCHOOL_UNSEENS.filter((s) => s.level === lvl);
      const chosen = candidates[Math.floor(Math.random() * candidates.length)] || MIDDLE_SCHOOL_UNSEENS[0];
      return chosen;
    };

    // If no API key configured, return high-quality preloaded story immediately
    if (!apiKey) {
      const fallback = getFallbackStory(selectedLevel);
      return NextResponse.json({
        success: true,
        story: fallback,
        isFallback: true,
        message: "Loaded from the offline library. To enable live AI generation, configure GEMINI_API_KEY.",
      });
    }

    let levelPrompt = "";
    if (selectedLevel === "Level 1") {
      levelPrompt =
        "Level 1 (Beginner Readers): Write in simple, short sentences using present tense and high-frequency everyday vocabulary. Direct, easy-to-follow narrative. Avoid complicated clauses or rare idioms.";
    } else if (selectedLevel === "Level 2") {
      levelPrompt =
        "Level 2 (Intermediate Middle School): Equivalent to late elementary reading for native English speakers. Use natural past/future tenses, descriptive vocabulary, and engaging details. Clear sentence structures.";
    } else {
      levelPrompt =
        "Level 3 (Fluent / Advanced English): Challenging, sophisticated text for fluent speakers. Rich vocabulary, compound and complex sentences, subtle themes, and analytical questions.";
    }

    const systemPrompt = `You are an expert English teacher. Generate a complete reading comprehension unseen activity with EXACTLY 10 questions.
Difficulty: ${selectedLevel} - ${levelPrompt}
Topic/Interest: ${resolvedTopic}

Return ONLY a raw JSON object matching this schema:
{
  "id": "ai-story-${Date.now()}",
  "title": "English Title",
  "hebrewTitle": "Hebrew translation of title",
  "level": "${selectedLevel}",
  "levelLabel": "${selectedLevel === "Level 1" ? "רמה 1 - קוראים מתחילים" : selectedLevel === "Level 2" ? "רמה 2 - רמה שוטפת" : "רמה 3 - מתקדמים ודוברי אנגלית"}",
  "levelDescription": "${selectedLevel === "Level 1" ? "Starting level English, for students who are beginner readers." : selectedLevel === "Level 2" ? "For native Hebrew speakers who are in a satisfactory level in English." : "Challenging texts for fluent English speakers with rich vocabulary."}",
  "paragraphs": [
    "Paragraph 1 (approx. 50-70 words: setting/introduction)",
    "Paragraph 2 (approx. 50-70 words: key event or discovery)",
    "Paragraph 3 (approx. 50-70 words: challenge, mystery or development)",
    "Paragraph 4 (approx. 50-70 words: turning point or action)",
    "Paragraph 5 (approx. 50-70 words: conclusion, outcome or future reflection)"
  ],
  "vocabularyHints": [
    { "word": "word1", "translation": "Hebrew translation" },
    { "word": "word2", "translation": "Hebrew translation" },
    { "word": "word3", "translation": "Hebrew translation" },
    { "word": "word4", "translation": "Hebrew translation" },
    { "word": "word5", "translation": "Hebrew translation" }
  ],
  "questions": [
    // EXACTLY 10 questions numbered 1 to 10:
    // Q1-Q2 for Paragraph 1 (paragraphIndex: 0, linesHint: "Paragraph 1")
    // Q3-Q4 for Paragraph 2 (paragraphIndex: 1, linesHint: "Paragraph 2")
    // Q5-Q6 for Paragraph 3 (paragraphIndex: 2, linesHint: "Paragraph 3")
    // Q7-Q8 for Paragraph 4 (paragraphIndex: 3, linesHint: "Paragraph 4")
    // Q9 for Paragraph 5 (paragraphIndex: 4, linesHint: "Paragraph 5")
    // Q10 global main idea or inference question (paragraphIndex: -1, linesHint: "The entire text")
    {
      "id": "q1",
      "number": 1,
      "paragraphIndex": 0,
      "linesHint": "Paragraph 1",
      "type": "mcq",
      "prompt": "Question prompt in English?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanationHebrew": "הסבר בעברית",
      "points": 10
    }
  ],
  "totalPoints": 100
}

CRITICAL RULES:
1. The text MUST have 4 to 5 distinct paragraphs (NEVER fewer than 4 paragraphs).
2. Return EXACTLY 10 questions in the questions array, numbered 1 to 10.
3. Questions must distribute across paragraphs (Q1-Q2: Para 1, Q3-Q4: Para 2, Q5-Q6: Para 3, Q7-Q8: Para 4, Q9: Para 5 or 4, Q10: General/Entire text).
4. Every question must have points: 10, totalPoints must be 100.
5. Every question must have an explanationHebrew in natural, encouraging Hebrew.
6. For copy questions, targetSentence must exist verbatim in the text.
7. Return ONLY valid JSON, no markdown backticks.`;

    const requestBody = {
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    };

    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let response: Response | null = null;

    for (const model of modelsToTry) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );

        if (res.ok) {
          response = res;
          break;
        }
      } catch {
        // try next model
      }
    }

    if (!response || !response.ok) {
      const fallback = getFallbackStory(selectedLevel);
      return NextResponse.json({
        success: true,
        story: fallback,
        isFallback: true,
        message: "AI service was busy. Loaded a curated story from your library!",
      });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      const fallback = getFallbackStory(selectedLevel);
      return NextResponse.json({
        success: true,
        story: fallback,
        isFallback: true,
      });
    }

    try {
      const parsedStory: MSUnseenStory = JSON.parse(generatedText);
      // Validate 10 questions
      if (parsedStory.questions && parsedStory.questions.length >= 8) {
        parsedStory.questions = parsedStory.questions.slice(0, 10).map((q, idx) => ({
          ...q,
          number: idx + 1,
          points: 10,
        }));
        parsedStory.totalPoints = 100;
        return NextResponse.json({ success: true, story: parsedStory, isAiGenerated: true });
      } else {
        const fallback = getFallbackStory(selectedLevel);
        return NextResponse.json({ success: true, story: fallback, isFallback: true });
      }
    } catch {
      const fallback = getFallbackStory(selectedLevel);
      return NextResponse.json({ success: true, story: fallback, isFallback: true });
    }
  } catch (error) {
    console.error("Generate unseen error:", error);
    const fallback = MIDDLE_SCHOOL_UNSEENS[0];
    return NextResponse.json({ success: true, story: fallback, isFallback: true });
  }
}
