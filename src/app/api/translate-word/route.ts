import { NextResponse } from "next/server";
import { lookupBuiltInTranslation } from "@/data/built-in-dictionary";

interface TranslationResult {
  english: string;
  hebrew: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb";
  example: string;
}

// In-memory server cache for instant lookup
const serverTranslationCache = new Map<string, TranslationResult>();

async function translateWithMyMemory(word: string): Promise<string | null> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|he`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (res.ok) {
      const data = await res.json();
      const tr = data?.responseData?.translatedText;
      if (tr && typeof tr === "string" && !tr.includes("MYMEMORY WARNING")) {
        return tr.trim();
      }
    }
  } catch (err) {
    console.warn("MyMemory translation error:", err);
  }
  return null;
}

async function translateWithFreeFallback(word: string): Promise<string | null> {
  // First try MyMemory
  const myMem = await translateWithMyMemory(word);
  if (myMem) return myMem;

  // Secondary try: Lingva API public mirrors
  try {
    const lingvaUrl = `https://lingva.ml/api/v1/en/he/${encodeURIComponent(word)}`;
    const res = await fetch(lingvaUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.translation && typeof data.translation === "string") {
        return data.translation.trim();
      }
    }
  } catch {
    // ignore
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const { word } = await request.json();

    if (!word || typeof word !== "string" || !word.trim()) {
      return NextResponse.json({ success: false, reason: "missing_word" }, { status: 400 });
    }

    const cleanWord = word.trim().toLowerCase().replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "");
    if (!cleanWord) {
      return NextResponse.json({ success: false, reason: "invalid_word" }, { status: 400 });
    }

    // 1. Check built-in offline dictionary (0 latency!)
    const builtIn = lookupBuiltInTranslation(cleanWord);
    if (builtIn) {
      const result: TranslationResult = {
        english: cleanWord,
        hebrew: builtIn,
        partOfSpeech: "noun",
        example: `The word "${cleanWord}" was translated from the text.`,
      };
      return NextResponse.json({ success: true, data: result, source: "dictionary" });
    }

    // 2. Check in-memory server cache
    if (serverTranslationCache.has(cleanWord)) {
      return NextResponse.json({
        success: true,
        data: serverTranslationCache.get(cleanWord),
        cached: true,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 3. If Gemini API key is missing or empty, use MyMemory & fallback
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
        return NextResponse.json({ success: true, data: fallbackResult, source: "mymemory" });
      }

      return NextResponse.json({ success: false, reason: "translation_unavailable" }, { status: 500 });
    }

    // 4. Translate using Gemini Flash
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
      return NextResponse.json({ success: false, reason: "empty_response" }, { status: 502 });
    }

    try {
      const parsed: TranslationResult = JSON.parse(generatedText);
      serverTranslationCache.set(cleanWord, parsed);
      return NextResponse.json({ success: true, data: parsed });
    } catch {
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
      return NextResponse.json({ success: false, reason: "parse_error" }, { status: 500 });
    }
  } catch (error) {
    console.error("Translate route error:", error);
    return NextResponse.json({ success: false, reason: "server_error" }, { status: 500 });
  }
}
