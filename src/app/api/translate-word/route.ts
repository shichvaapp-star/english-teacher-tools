import { NextResponse } from "next/server";

interface TranslationResult {
  english: string;
  hebrew: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb";
  example: string;
}

// In-memory server cache for instant lookup
const serverTranslationCache = new Map<string, TranslationResult>();

async function translateWithFreeFallback(word: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=iw&dt=t&q=${encodeURIComponent(word)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const fullTranslation = data[0]
          .map((item: unknown) => (Array.isArray(item) && item[0] ? String(item[0]) : ""))
          .join("")
          .trim();
        if (fullTranslation) {
          return fullTranslation;
        }
      }
    }
  } catch (err) {
    console.warn("Free translation fallback error:", err);
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const { word } = await request.json();

    if (!word || typeof word !== "string" || !word.trim()) {
      return NextResponse.json({ success: false, reason: "missing_word" }, { status: 400 });
    }

    const cleanWord = word.trim().toLowerCase().replace(/[^a-zA-Z'\-]/g, "");
    if (!cleanWord) {
      return NextResponse.json({ success: false, reason: "invalid_word" }, { status: 400 });
    }

    // 1. Check in-memory server cache
    if (serverTranslationCache.has(cleanWord)) {
      return NextResponse.json({
        success: true,
        data: serverTranslationCache.get(cleanWord),
        cached: true,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 2. If Gemini API key is missing or empty, use instant free Google Translate
    if (!apiKey) {
      const fallbackHebrew = await translateWithFreeFallback(cleanWord);
      if (fallbackHebrew) {
        const fallbackResult: TranslationResult = {
          english: cleanWord,
          hebrew: fallbackHebrew,
          partOfSpeech: "noun",
          example: `The word "${cleanWord}" appeared in the reading text.`,
        };
        serverTranslationCache.set(cleanWord, fallbackResult);
        return NextResponse.json({ success: true, data: fallbackResult });
      }

      return NextResponse.json({ success: false, reason: "translation_unavailable" }, { status: 500 });
    }

    // 3. Translate using Gemini Flash
    const systemPrompt = `You are an expert English-Hebrew translator and English middle-school teacher. Translate the given English word into natural Hebrew.
Return ONLY a raw JSON object matching this schema:
{
  "english": "${cleanWord}",
  "hebrew": "Hebrew translation (natural, accurate, comma-separated if multiple common meanings)",
  "partOfSpeech": "noun" | "verb" | "adjective" | "adverb",
  "example": "A short, simple example sentence in English showing the word in context."
}`;

    const requestBody = {
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
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
      const fallbackHebrew = await translateWithFreeFallback(cleanWord);
      if (fallbackHebrew) {
        const fallbackResult: TranslationResult = {
          english: cleanWord,
          hebrew: fallbackHebrew,
          partOfSpeech: "noun",
          example: `The word "${cleanWord}" appeared in the reading text.`,
        };
        serverTranslationCache.set(cleanWord, fallbackResult);
        return NextResponse.json({ success: true, data: fallbackResult, fallback: true });
      }

      return NextResponse.json({ success: false, reason: "api_error" }, { status: 502 });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      const fallbackHebrew = await translateWithFreeFallback(cleanWord);
      if (fallbackHebrew) {
        const fallbackResult: TranslationResult = {
          english: cleanWord,
          hebrew: fallbackHebrew,
          partOfSpeech: "noun",
          example: `The word "${cleanWord}" appeared in the reading text.`,
        };
        serverTranslationCache.set(cleanWord, fallbackResult);
        return NextResponse.json({ success: true, data: fallbackResult, fallback: true });
      }
      return NextResponse.json({ success: false, reason: "empty_response" }, { status: 500 });
    }

    const parsedData = JSON.parse(generatedText.trim()) as TranslationResult;
    serverTranslationCache.set(cleanWord, parsedData);
    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Word translation handler error:", msg);
    return NextResponse.json({ success: false, reason: "exception", message: msg }, { status: 500 });
  }
}
