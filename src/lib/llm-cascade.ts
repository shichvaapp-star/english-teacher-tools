// Server-only: runs a JSON prompt through the same provider cascade the other
// sections use (Groq → Gemini → OpenAI), returning the first reply that parses
// and passes `accept`. Keys come from request headers (personal keys saved in
// the browser) or the server's environment.

import { errorMessage, extractJsonObject, type JsonObject } from "@/lib/llm-json";

export interface CascadeKeys {
  groq?: string;
  gemini?: string;
  openai?: string;
}

export function keysFromRequest(request: Request): CascadeKeys {
  return {
    groq: request.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY || undefined,
    gemini: request.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY || undefined,
    openai: request.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY || undefined,
  };
}

export function hasAnyKey(keys: CascadeKeys): boolean {
  return Boolean(keys.groq || keys.gemini || keys.openai);
}

interface Step {
  label: string;
  run: () => Promise<string>;
}

async function chatCompletion(url: string, key: string, model: string, prompt: string, temperature: number) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature,
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`${model} ${res.status}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? "";
}

async function gemini(key: string, model: string, prompt: string, temperature: number) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature },
      }),
      signal: AbortSignal.timeout(20000),
    }
  );
  if (!res.ok) throw new Error(`${model} ${res.status}`);
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function runJsonCascade(
  keys: CascadeKeys,
  prompt: string,
  accept: (obj: JsonObject) => boolean,
  temperature = 0.1
): Promise<{ result: JsonObject; provider: string } | null> {
  const steps: Step[] = [];
  const groqUrl = "https://api.groq.com/openai/v1/chat/completions";
  if (keys.groq) {
    const k = keys.groq;
    for (const model of ["openai/gpt-oss-120b", "llama-3.3-70b-versatile"]) {
      steps.push({ label: `groq:${model}`, run: () => chatCompletion(groqUrl, k, model, prompt, temperature) });
    }
  }
  if (keys.gemini) {
    const k = keys.gemini;
    for (const model of ["gemini-2.5-flash", "gemini-3.5-flash"]) {
      steps.push({ label: `gemini:${model}`, run: () => gemini(k, model, prompt, temperature) });
    }
  }
  if (keys.openai) {
    const k = keys.openai;
    steps.push({
      label: "openai:gpt-4o-mini",
      run: () => chatCompletion("https://api.openai.com/v1/chat/completions", k, "gpt-4o-mini", prompt, temperature),
    });
  }

  for (const step of steps) {
    try {
      const raw = await step.run();
      if (!raw) continue;
      const obj = extractJsonObject(raw);
      if (obj && accept(obj)) return { result: obj, provider: step.label };
    } catch (err) {
      console.warn(`llm-cascade ${step.label} failed: ${errorMessage(err)}`);
    }
  }
  return null;
}
