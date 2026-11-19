import { isHebrewOnly } from "@/lib/hebrew-text";
import { lookupBuiltInTranslation } from "@/data/built-in-dictionary";

export interface HebrewTranslation {
  hebrew: string;
  partOfSpeech?: string;
  example?: string;
}

interface TranslateApiResponse {
  success?: boolean;
  data?: HebrewTranslation;
}

interface MyMemoryResponse {
  responseData?: { translatedText?: unknown };
}

function readCache(key: string): HebrewTranslation | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<HebrewTranslation> | null;
    if (parsed?.hebrew && isHebrewOnly(parsed.hebrew)) {
      return { hebrew: parsed.hebrew, partOfSpeech: parsed.partOfSpeech, example: parsed.example };
    }
  } catch {
    /* bad cache entry */
  }
  return null;
}

function translateHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const groq = localStorage.getItem("ett_groq_api_key");
    const gemini = localStorage.getItem("ett_gemini_api_key");
    if (groq) headers["x-groq-api-key"] = groq;
    if (gemini) headers["x-gemini-api-key"] = gemini;
  } catch {
    /* no personal keys */
  }
  return headers;
}

/** Strips punctuation around a single word and lowercases it (same rule as Unseen/Conversation). */
export function cleanSingleWord(raw: string): string {
  return raw.trim().toLowerCase().replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "");
}

/**
 * English → Hebrew using the same cascade as Unseen and Conversation:
 * built-in dictionary (single words) → localStorage cache → /api/translate-word → MyMemory.
 * Returns null when nothing worked.
 */
export async function translateToHebrew(text: string): Promise<HebrewTranslation | null> {
  const isPhrase = /\s/.test(text.trim());
  const clean = isPhrase ? text.trim().replace(/\s+/g, " ") : cleanSingleWord(text);
  if (!clean) return null;

  if (!isPhrase) {
    const builtIn = lookupBuiltInTranslation(clean);
    if (builtIn) return { hebrew: builtIn };
  }

  const cacheKey = isPhrase ? `trans_sel_cache_${clean.toLowerCase()}` : `trans_cache_${clean}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch("/api/translate-word", {
      method: "POST",
      headers: translateHeaders(),
      body: JSON.stringify({ word: clean }),
    });
    if (res.ok) {
      const data = (await res.json()) as TranslateApiResponse;
      if (data.success && data.data?.hebrew) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data.data));
        } catch {
          /* storage full */
        }
        return data.data;
      }
    }
  } catch {
    /* fall through */
  }

  try {
    const fbUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|he`;
    const fbRes = await fetch(fbUrl);
    if (fbRes.ok) {
      const fbData = (await fbRes.json()) as MyMemoryResponse;
      const tr = fbData.responseData?.translatedText;
      if (typeof tr === "string" && tr && !tr.includes("MYMEMORY WARNING")) {
        return { hebrew: tr.trim() };
      }
    }
  } catch {
    /* fall through */
  }

  return null;
}
