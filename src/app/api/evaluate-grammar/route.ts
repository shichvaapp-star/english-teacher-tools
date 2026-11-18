import { NextResponse } from "next/server";
import { GRAMMAR_ITEMS, getGrammarTopic } from "@/data/grammar";
import { describeForGrader, isGrammarResponse, type GrammarAiItemResult, type GrammarAiResponse } from "@/lib/grammar-ai";
import { hasAnyKey, keysFromRequest, runJsonCascade } from "@/lib/llm-cascade";
import { jsonNumber, jsonObjects, jsonString } from "@/lib/llm-json";
import type { GrammarItem } from "@/types/grammar";

// AI grading agent for the Grammar section. Only typed answers that the
// deterministic grader could not accept are sent here. The answer key always
// comes from the server's item bank – never from the client.

const MAX_ENTRIES = 30;
const cache = new Map<string, { at: number; results: GrammarAiItemResult[] }>();
const CACHE_TTL_MS = 30 * 60 * 1000;

const LEVEL_POLICY: Record<1 | 2 | 3, string> = {
  1: "LEVEL 1 (weak learners): be encouraging. If the grammar point being practised is right and only the spelling is slightly off, give 1. Feedback in very simple Hebrew.",
  2: "LEVEL 2 (average): the grammar point must be right. A small spelling slip in an otherwise correct form gets 0.5.",
  3: "LEVEL 3 (strong, near-native): be strict. Correct form, spelling and word order are expected for full credit.",
};

function json(body: GrammarAiResponse, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, results: [], reason: "bad_json" }, 400);
  }
  const b = body as { topicId?: unknown; level?: unknown; entries?: unknown };
  const topic = typeof b.topicId === "string" ? getGrammarTopic(b.topicId) : undefined;
  const level = b.level === 1 || b.level === 2 || b.level === 3 ? b.level : null;
  if (!topic || !level || !Array.isArray(b.entries) || b.entries.length === 0 || b.entries.length > MAX_ENTRIES) {
    return json({ success: false, results: [], reason: "bad_request" }, 400);
  }

  const tasks: { item: GrammarItem; task: string; key: string; student: string }[] = [];
  for (const e of b.entries as unknown[]) {
    const entry = e as { itemId?: unknown; response?: unknown };
    if (typeof entry.itemId !== "string" || !isGrammarResponse(entry.response)) continue;
    const item = GRAMMAR_ITEMS.find((i) => i.id === entry.itemId && i.topicId === topic.id);
    if (!item) continue;
    const d = describeForGrader(item, entry.response);
    if (d && d.student.trim()) tasks.push({ item, ...d });
  }
  if (!tasks.length) return json({ success: false, results: [], reason: "nothing_to_grade" }, 400);

  const cacheKey = JSON.stringify([topic.id, level, tasks.map((t) => [t.item.id, t.student])]);
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return json({ success: true, results: hit.results });

  const keys = keysFromRequest(request);
  if (!hasAnyKey(keys)) return json({ success: false, results: [], reason: "no_ai_keys" }, 503);

  const card = topic.rule[level];
  const ruleText = card.points.map((p) => `- ${p.en}: ${p.examples.join(" / ")}`).join("\n");
  const trapText = topic.traps.map((t) => `- wrong "${t.wrong}" → right "${t.right}" (${t.whyEn})`).join("\n");
  const taskText = tasks
    .map(
      (t, i) =>
        `#${i + 1} id=${t.item.id} type=${t.item.type}\nTASK: ${t.task}\nANSWER KEY: ${t.key}\nSTUDENT: ${t.student}`
    )
    .join("\n\n");

  const prompt = `You are an experienced English teacher in an Israeli junior high school (grades 7-9). Students are native Hebrew speakers.
You are grading short grammar exercises on the topic "${topic.title}".

Rule the students practised:
${ruleText}

Typical mistakes of Hebrew speakers on this topic:
${trapText}

${LEVEL_POLICY[level]}

Grading rules:
- The answer key lists expected answers, but ACCEPT any other answer that is grammatically correct AND does what the task asks (e.g. a valid rephrasing, a correct contraction, a different correct pronoun).
- The grammar point of the topic matters most. A wrong form of the target structure (e.g. "play" instead of "plays" with he/she/it) is wrong: score 0.
- Scores: 1 = correct, 0.5 = right idea with a small slip, 0 = wrong. For "cloze_text", score = fraction of blanks correct. For "write_own", check that the sentences really use "${topic.title}" correctly and complete the task.
- feedbackHe: ONE short sentence (max 15 words) in simple Hebrew, written ONLY in Hebrew letters except for the English words being discussed. Say what is right or what exactly to fix. Address the student in plural/neutral form ("כתבו", "שימו לב").
- feedbackEn: the same in simple English (max 15 words).

Exercises:
${taskText}

Return ONLY JSON: {"results":[{"id":"<id>","score":0|0.5|1 (or fraction for cloze_text),"feedbackHe":"...","feedbackEn":"..."}]} with one result per exercise.`;

  const ids = new Set(tasks.map((t) => t.item.id));
  const out = await runJsonCascade(keys, prompt, (obj) =>
    jsonObjects(obj.results).some((r) => typeof r.id === "string" && ids.has(r.id))
  );
  if (!out) return json({ success: false, results: [], reason: "ai_unavailable" }, 502);

  const results: GrammarAiItemResult[] = [];
  for (const r of jsonObjects(out.result.results)) {
    const id = jsonString(r.id);
    if (!id || !ids.has(id)) continue;
    const raw = jsonNumber(r.score) ?? 0;
    const score = Math.min(1, Math.max(0, raw));
    const he = jsonString(r.feedbackHe) ?? "";
    // Hebrew feedback may quote English words; reject only replies with no Hebrew at all.
    const feedbackHe = /[֐-׿]/.test(he) && he.length <= 200 ? he : "";
    const feedbackEn = (jsonString(r.feedbackEn) ?? "").slice(0, 200);
    results.push({ itemId: id, score, feedbackHe, feedbackEn });
  }
  if (!results.length) return json({ success: false, results: [], reason: "ai_unusable" }, 502);

  cache.set(cacheKey, { at: Date.now(), results });
  if (cache.size > 500) cache.delete(cache.keys().next().value as string);
  return json({ success: true, results });
}
