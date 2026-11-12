import React from "react";
import { VocabItem, normalizeVocabWord } from "@/lib/vocab-storage";

export const LOCAL_SUBMISSIONS_KEY = "ett_writing_submissions";

export function splitOuterPunctuation(raw: string): {
  leadingPunct: string;
  coreText: string;
  trailingPunct: string;
} {
  const match = raw.match(/^([^a-zA-Z0-9]*)([\s\S]*?[a-zA-Z0-9]|[a-zA-Z0-9])([^a-zA-Z0-9]*)$/);
  if (!match) {
    return { leadingPunct: "", coreText: raw, trailingPunct: "" };
  }
  return {
    leadingPunct: match[1] || "",
    coreText: match[2] || raw,
    trailingPunct: match[3] || "",
  };
}

export function formatCompactHebrewGloss(hebrew: string): string {
  const clean = hebrew.trim();
  if (clean.length <= 20) return clean;
  const parts = clean
    .split(/[,;/]/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length > 1) {
    const firstTwo = `${parts[0]}, ${parts[1]}`;
    return firstTwo.length <= 20 ? firstTwo : parts[0];
  }
  return clean;
}

/**
 * Resolves a single English word token against the student's saved vocabulary map,
 * supporting both exact normalized matches and common morphological inflections
 * so every occurrence of a saved vocabulary word in the passage is recognized.
 */
export function lookupSavedVocabForWord(
  rawWord: string,
  savedVocabMap?: ReadonlyMap<string, VocabItem>
): VocabItem | undefined {
  if (!savedVocabMap || savedVocabMap.size === 0) return undefined;
  const norm = normalizeVocabWord(rawWord);
  if (!norm) return undefined;

  const exact = savedVocabMap.get(norm);
  if (exact) return exact;

  const base = norm.replace(/(?:'s|’s)$/i, "");
  if (base !== norm) {
    const possessiveMatch = savedVocabMap.get(base);
    if (possessiveMatch) return possessiveMatch;
  }

  if (base.length < 4) return undefined;

  const candidates: string[] = [];
  if (base.endsWith("ies") && base.length >= 5) {
    candidates.push(`${base.slice(0, -3)}y`);
  }
  if (base.endsWith("es") && base.length >= 5) {
    candidates.push(base.slice(0, -2), base.slice(0, -1));
  }
  if (base.endsWith("s") && !base.endsWith("ss") && base.length >= 4) {
    candidates.push(base.slice(0, -1));
  }
  if (base.endsWith("ied") && base.length >= 5) {
    candidates.push(`${base.slice(0, -3)}y`);
  }
  if (base.endsWith("ed") && base.length >= 5) {
    candidates.push(base.slice(0, -2), base.slice(0, -1));
  }
  if (base.endsWith("ing") && base.length >= 6) {
    candidates.push(base.slice(0, -3), `${base.slice(0, -3)}e`);
  }

  // Also check if the student saved an inflected form in the text and another occurrence is the base/sibling form
  candidates.push(`${base}s`, `${base}es`, `${base}d`, `${base}ed`, `${base}ing`);

  for (const cand of candidates) {
    if (cand.length >= 4) {
      const matched = savedVocabMap.get(cand);
      if (matched) return matched;
    }
  }

  return undefined;
}

export interface PassageTextSegment {
  type: "space" | "text";
  raw: string;
  leadingPunct: string;
  coreText: string;
  trailingPunct: string;
  savedItem?: VocabItem;
}

export function segmentTextWithSavedVocab(
  text: string,
  savedVocabMap?: ReadonlyMap<string, VocabItem>
): PassageTextSegment[] {
  const rawTokens = text.split(/(\s+)/);
  if (!savedVocabMap || savedVocabMap.size === 0) {
    return rawTokens.map((token) => {
      if (/^\s+$/.test(token)) {
        return { type: "space", raw: token, leadingPunct: "", coreText: token, trailingPunct: "" };
      }
      const { leadingPunct, coreText, trailingPunct } = splitOuterPunctuation(token);
      return { type: "text", raw: token, leadingPunct, coreText, trailingPunct };
    });
  }

  const segments: PassageTextSegment[] = [];
  let i = 0;

  while (i < rawTokens.length) {
    const token = rawTokens[i];
    if (/^\s+$/.test(token) || !/[a-zA-Z]/.test(token)) {
      segments.push({
        type: /^\s+$/.test(token) ? "space" : "text",
        raw: token,
        leadingPunct: "",
        coreText: token,
        trailingPunct: "",
      });
      i += 1;
      continue;
    }

    // Check multi-word phrases (up to 5 words) saved in vocabulary
    let matchedMultiWord = false;
    for (let wordCount = 5; wordCount >= 2; wordCount -= 1) {
      const endTokenIdx = i + (wordCount - 1) * 2;
      if (endTokenIdx >= rawTokens.length) continue;

      let validPhraseSpan = true;
      for (let t = i; t <= endTokenIdx; t += 1) {
        if ((t - i) % 2 === 1) {
          if (!/^[ \t]+$/.test(rawTokens[t])) {
            validPhraseSpan = false;
            break;
          }
        } else {
          if (!/[a-zA-Z]/.test(rawTokens[t])) {
            validPhraseSpan = false;
            break;
          }
          if (t < endTokenIdx && /[.,;:!?)"'\]]$/.test(rawTokens[t])) {
            validPhraseSpan = false;
            break;
          }
        }
      }

      if (!validPhraseSpan) continue;

      const combinedRaw = rawTokens.slice(i, endTokenIdx + 1).join("");
      const { leadingPunct, coreText, trailingPunct } = splitOuterPunctuation(combinedRaw);
      const phraseNorm = normalizeVocabWord(coreText);
      const phraseMatch = phraseNorm ? savedVocabMap.get(phraseNorm) : undefined;
      if (phraseMatch) {
        segments.push({
          type: "text",
          raw: combinedRaw,
          leadingPunct,
          coreText,
          trailingPunct,
          savedItem: phraseMatch,
        });
        i = endTokenIdx + 1;
        matchedMultiWord = true;
        break;
      }
    }

    if (matchedMultiWord) continue;

    const { leadingPunct, coreText, trailingPunct } = splitOuterPunctuation(token);
    const savedItem = lookupSavedVocabForWord(coreText, savedVocabMap);
    segments.push({
      type: "text",
      raw: token,
      leadingPunct,
      coreText,
      trailingPunct,
      savedItem,
    });
    i += 1;
  }

  return segments;
}

/**
 * Renders English text where every word is an interactive clickable token that
 * triggers the instant translation toast and adds the word to the student's word bank.
 * Words that the student has added to their vocabulary are remembered and highlighted
 * with a compact Hebrew translation above them.
 */
export function InteractiveEnglishText({
  text,
  onWordClick,
  savedVocabMap,
  className = "",
  stopEventPropagation = false,
}: {
  text: string;
  onWordClick: (word: string) => void;
  savedVocabMap?: ReadonlyMap<string, VocabItem>;
  className?: string;
  stopEventPropagation?: boolean;
}) {
  if (!text) return null;
  const segments = segmentTextWithSavedVocab(text, savedVocabMap);

  return (
    <span className={className}>
      {segments.map((seg, idx) => {
        if (seg.type === "space" || !/[a-zA-Z]/.test(seg.raw)) {
          return <span key={idx}>{seg.raw}</span>;
        }

        if (seg.savedItem) {
          const compactHeb = formatCompactHebrewGloss(seg.savedItem.hebrew);
          return (
            <span
              key={idx}
              onClick={(e) => {
                if (typeof window !== "undefined") {
                  const sel = window.getSelection();
                  if (sel && !sel.isCollapsed && sel.toString().trim().length > 1) {
                    return;
                  }
                }
                if (stopEventPropagation) {
                  e.stopPropagation();
                }
                onWordClick(seg.coreText || seg.raw);
              }}
              className="cursor-pointer hover:bg-primary/20 rounded px-0.5 transition-colors"
              title={`${seg.coreText} — ${seg.savedItem.hebrew} (נשמר באוצר המילים)`}
            >
              {seg.leadingPunct}
              <span
                data-vocab-hebrew={compactHeb}
                className="inline-flex flex-col items-center align-bottom leading-none mx-0.5 before:content-[attr(data-vocab-hebrew)] before:font-hebrew before:text-[10px] before:leading-tight before:font-bold before:text-primary before:mb-0.5 before:whitespace-nowrap before:select-none"
              >
                <span className="leading-normal font-medium text-primary underline decoration-primary/60 decoration-dotted underline-offset-2">
                  {seg.coreText}
                </span>
              </span>
              {seg.trailingPunct}
            </span>
          );
        }

        return (
          <span
            key={idx}
            onClick={(e) => {
              if (typeof window !== "undefined") {
                const sel = window.getSelection();
                if (sel && !sel.isCollapsed && sel.toString().trim().length > 1) {
                  return;
                }
              }
              if (stopEventPropagation) {
                e.stopPropagation();
              }
              onWordClick(seg.raw);
            }}
            className="cursor-pointer hover:bg-primary/20 hover:text-primary rounded px-0.5 transition-colors underline decoration-dotted decoration-muted-foreground/30 hover:decoration-primary"
            title={`Click to translate "${seg.coreText}"`}
          >
            {seg.raw}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Renders passage text for the printed worksheet/exam.
 * Includes a small Hebrew translation directly above every occurrence of words
 * that the user translated and added to their vocabulary (and ONLY for vocabulary words).
 */
export function PrintedPassageText({
  text,
  savedVocabMap,
}: {
  text: string;
  savedVocabMap: ReadonlyMap<string, VocabItem>;
}) {
  if (!text) return null;
  const segments = segmentTextWithSavedVocab(text, savedVocabMap);

  return (
    <>
      {segments.map((seg, idx) => {
        if (!seg.savedItem) {
          return <span key={idx}>{seg.raw}</span>;
        }
        const compactHeb = formatCompactHebrewGloss(seg.savedItem.hebrew);
        return (
          <span key={idx} className="inline">
            {seg.leadingPunct}
            <ruby className="ruby-vocab-print">
              <span className="font-semibold text-slate-900 underline decoration-dotted decoration-slate-400 underline-offset-2">
                {seg.coreText}
              </span>
              <rp>(</rp>
              <rt
                dir="rtl"
                lang="he"
                className="font-hebrew text-[9px] leading-none font-bold text-slate-700 select-none"
              >
                {compactHeb}
              </rt>
              <rp>)</rp>
            </ruby>
            {seg.trailingPunct}
          </span>
        );
      })}
    </>
  );
}
