"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface TutorChatMessageContentProps {
  text: string;
  isTutor: boolean;
}

/**
 * Pre-processes a chat message to guarantee Hebrew and English are never forced onto the same line.
 * It detects trailing Hebrew parenthetical translations, question headers, multiple inline options,
 * and sentence starters, splitting them into dedicated, readable lines.
 */
function preprocessChatMessage(rawText: string): string[] {
  const rawLines = rawText.split("\n");
  const result: string[] = [];

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      result.push("");
      continue;
    }

    // 1. Check if line has multiple options with Hebrew in parens (legacy format)
    const optionSplits = splitMultipleOptionsLine(trimmed);
    for (const optLine of optionSplits) {
      // 2. Check tip line with embedded sentence starters
      const tipSplits = splitTipLine(optLine);
      for (const tipLine of tipSplits) {
        // 3. Check trailing bilingual translations in parentheses
        const biSplits = splitBilingualLine(tipLine);
        result.push(...biSplits);
      }
    }
  }

  return result;
}

/**
 * Splits lines like "Do you like **sports** (ספורט ⚽), **video games** (משחקי מחשב 🎮)..."
 * into a clear introductory line and separated bullet items.
 */
function splitMultipleOptionsLine(line: string): string[] {
  const matches = line.match(/\(([\u0590-\u05FF][^)]*)\)/g);
  if (matches && matches.length >= 2) {
    const introMatch = line.match(
      /^(Do you like|Are you interested in|For example|Such as|Choose between)\s*:?\s*/i
    );
    const intro = introMatch ? introMatch[0].trim() : "";
    const rest = introMatch ? line.slice(introMatch[0].length).trim() : line;

    const items = rest.split(/(?:,\s*or\s*|,\s*|\s+or\s+)/i).filter(Boolean);
    if (items.length >= 2) {
      const bullets = items.map((item) => {
        const clean = item.replace(/[?]+$/, "").trim();
        const m = clean.match(/^(.*?)\s*\(([\u0590-\u05FF][^)]*)\)\s*$/);
        if (m) {
          const eng = m[1].replace(/\*+/g, "").trim();
          const heb = m[2].trim();
          return `• **${eng}** — ${heb}`;
        }
        return `• ${clean}`;
      });
      return intro ? [intro.endsWith(":") ? intro : `${intro}:`, ...bullets] : bullets;
    }
  }
  return [line];
}

/**
 * Splits tip lines like "💡 *איך מתחילים? אפשר להתחיל ב-**"I like..."** (אני אוהב/ת...)*"
 * into a header, an English starter line, and a Hebrew translation line.
 */
function splitTipLine(line: string): string[] {
  if (
    line.includes("💡") &&
    (line.includes("איך מתחילים") || line.includes("Tip") || line.includes("טיפ"))
  ) {
    const starterMatch = line.match(
      /(.*?)(?:אפשר להתחיל ב-?|Start with|למשל:?)\s*(\*{0,2}["'].*?["']\*{0,2})\s*\(([\u0590-\u05FF][^)]*)\)/i
    );
    if (starterMatch) {
      const prefix = starterMatch[1].replace(/^[*\s]+|[*\s]+$/g, "").trim();
      const pattern = starterMatch[2].replace(/\*+/g, "").trim();
      const translation = starterMatch[3].trim();
      return [prefix, `👉 **${pattern}**`, `(${translation})`];
    }
  }
  return [line];
}

/**
 * Splits lines where an English statement is followed by a Hebrew translation in parentheses,
 * e.g. "Let's chat for a minute! (בוא/י נשוחח דקה!)" -> 2 lines.
 */
function splitBilingualLine(line: string): string[] {
  // If line starts with a Question header: e.g. "**Question 1:** What do you like doing...?"
  const questionMatch = line.match(/^(\*{0,2}Question\s+\d+[:.]*\*{0,2})\s*(.+)$/i);
  if (questionMatch) {
    const qHeader = questionMatch[1];
    const remainder = questionMatch[2];
    return [qHeader, ...splitBilingualLine(remainder)];
  }

  // Trailing Hebrew translation in parentheses after English text
  const trailingHebrewParen = /^(.*?[a-zA-Z].*?)\s*\(([\u0590-\u05FF][^)]*)\)\s*([!?.:]*)$/;
  const match = line.match(trailingHebrewParen);
  if (match) {
    const englishPart = (match[1] + (match[3] || "")).trim();
    const hebrewPart = `(${match[2].trim()})`;
    if (
      englishPart.length > 3 &&
      !englishPart.startsWith("•") &&
      !englishPart.startsWith("-")
    ) {
      return [englishPart, hebrewPart];
    }
  }

  return [line];
}

interface MarkdownToken {
  type: "bold" | "italic" | "code" | "text";
  content: string;
}

function parseMarkdownSpans(text: string): MarkdownToken[] {
  const tokenRegex = /(\*\*.*?\*\*|\*[^*\n]+?\*|`[^`]+?`)/g;
  const tokens: MarkdownToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith("**") && raw.endsWith("**")) {
      tokens.push({ type: "bold", content: raw.slice(2, -2) });
    } else if (raw.startsWith("*") && raw.endsWith("*")) {
      tokens.push({ type: "italic", content: raw.slice(1, -1) });
    } else if (raw.startsWith("`") && raw.endsWith("`")) {
      tokens.push({ type: "code", content: raw.slice(1, -1) });
    }
    lastIndex = match.index + raw.length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: "text", content: text.slice(lastIndex) });
  }

  return tokens;
}

/**
 * Renders inline text while wrapping foreign-language runs in `<bdi>` (Bi-directional Isolation)
 * so that English quotes, brackets, and punctuation never flip or scramble in Hebrew contexts.
 */
function renderInlineWithBdi(text: string, baseDir: "rtl" | "ltr", isBold = false): React.ReactNode {
  // If base direction is RTL (Hebrew), isolate any English/Latin runs
  if (baseDir === "rtl") {
    const segments = text.split(/([a-zA-Z0-9\s.,!?'"🎮⚽🎵🐶\-–—:;]+)/);
    return segments.map((seg, i) => {
      if (!seg) return null;
      if (/[a-zA-Z]/.test(seg)) {
        return (
          <bdi
            key={i}
            dir="ltr"
            className={`inline-block mx-0.5 ${
              isBold ? "font-bold text-foreground" : "font-semibold text-primary"
            }`}
          >
            {seg}
          </bdi>
        );
      }
      return <React.Fragment key={i}>{seg}</React.Fragment>;
    });
  }

  // If base direction is LTR (English), isolate any Hebrew runs
  const segments = text.split(/([\u0590-\u05FF\s.,!?'"\-–—:;]+)/);
  return segments.map((seg, i) => {
    if (!seg) return null;
    if (/[\u0590-\u05FF]/.test(seg)) {
      return (
        <bdi
          key={i}
          dir="rtl"
          className="text-muted-foreground font-sans mx-0.5 inline-block"
        >
          {seg}
        </bdi>
      );
    }
    return <React.Fragment key={i}>{seg}</React.Fragment>;
  });
}

function renderFormattedLineContent(line: string, baseDir: "rtl" | "ltr"): React.ReactNode {
  const tokens = parseMarkdownSpans(line);
  return tokens.map((token, idx) => {
    switch (token.type) {
      case "bold":
        return (
          <strong key={idx} className="font-bold text-foreground">
            {renderInlineWithBdi(token.content, baseDir, true)}
          </strong>
        );
      case "italic":
        return (
          <em key={idx} className="italic text-foreground/90">
            {renderInlineWithBdi(token.content, baseDir)}
          </em>
        );
      case "code":
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded-md bg-muted/80 font-mono text-xs text-primary"
          >
            {token.content}
          </code>
        );
      case "text":
      default:
        return (
          <React.Fragment key={idx}>
            {renderInlineWithBdi(token.content, baseDir)}
          </React.Fragment>
        );
    }
  });
}

type LineType =
  | "empty"
  | "question-header"
  | "translation-note"
  | "sentence-starter"
  | "bullet"
  | "english-text"
  | "hebrew-text";

function classifyLine(line: string): { type: LineType; dir: "rtl" | "ltr" } {
  const trimmed = line.trim();
  if (!trimmed) return { type: "empty", dir: "rtl" };

  // 1. Question header: e.g. "**Question 1:**"
  if (/^\*{0,2}Question\s+\d+/i.test(trimmed)) {
    return { type: "question-header", dir: "ltr" };
  }

  // 2. Sentence starter: e.g. "👉 **"I like..."**"
  if (trimmed.startsWith("👉")) {
    return { type: "sentence-starter", dir: "ltr" };
  }

  // 3. Translation note: starts with '(' and contains Hebrew
  if (trimmed.startsWith("(") && /[\u0590-\u05FF]/.test(trimmed)) {
    return { type: "translation-note", dir: "rtl" };
  }

  // 4. Bullet item: starts with '•', '-', or '1.'
  if (/^[•\-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
    const hebrewLetters = (trimmed.match(/[\u0590-\u05FF]/g) || []).length;
    const latinLetters = (trimmed.match(/[a-zA-Z]/g) || []).length;
    return {
      type: "bullet",
      dir: latinLetters >= hebrewLetters ? "ltr" : "rtl",
    };
  }

  // 5. Normal text: check first strong directional character
  const match = trimmed.match(/[\u0590-\u05FF]|[a-zA-Z]/);
  const isHebrew = match ? /[\u0590-\u05FF]/.test(match[0]) : true;
  return {
    type: isHebrew ? "hebrew-text" : "english-text",
    dir: isHebrew ? "rtl" : "ltr",
  };
}

export function TutorChatMessageContent({ text, isTutor }: TutorChatMessageContentProps) {
  // If this is a student message, determine overall language and render naturally
  if (!isTutor) {
    const hebrewLetters = (text.match(/[\u0590-\u05FF]/g) || []).length;
    const latinLetters = (text.match(/[a-zA-Z]/g) || []).length;
    const isEnglish = latinLetters > hebrewLetters;

    return (
      <p
        className={`whitespace-pre-line font-sans text-base sm:text-lg leading-relaxed ${
          isEnglish ? "text-left font-sans" : "text-right font-sans"
        }`}
        dir={isEnglish ? "ltr" : "rtl"}
      >
        {text}
      </p>
    );
  }

  // David's message: Pre-process to eliminate all single-line mixed Hebrew/English collisions
  const lines = preprocessChatMessage(text);

  return (
    <div className="space-y-1.5 font-sans">
      {lines.map((line, idx) => {
        const { type, dir } = classifyLine(line);

        if (type === "empty") {
          return <div key={idx} className="h-1.5" />;
        }

        // Question Badge
        if (type === "question-header") {
          const cleanTitle = line.replace(/\*+/g, "").trim();
          return (
            <div key={idx} className="my-1.5" dir="ltr">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold text-xs sm:text-sm uppercase tracking-wide border border-indigo-500/20 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{cleanTitle}</span>
              </span>
            </div>
          );
        }

        // Translation Note / Scaffolding subtitle
        if (type === "translation-note") {
          return (
            <div
              key={idx}
              className="text-right text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed my-0.5 pr-2.5 border-r-2 border-indigo-400/40"
              dir="rtl"
            >
              {renderFormattedLineContent(line, "rtl")}
            </div>
          );
        }

        // Sentence Starter Box
        if (type === "sentence-starter") {
          const cleanPattern = line.replace(/^👉\s*/, "").trim();
          return (
            <div key={idx} className="my-1.5 flex items-center gap-2" dir="ltr">
              <span className="text-primary font-bold text-sm sm:text-base">👉</span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 border border-primary/25 font-bold text-primary font-mono text-sm sm:text-base shadow-2xs">
                {renderFormattedLineContent(cleanPattern, "ltr")}
              </div>
            </div>
          );
        }

        // Bullet Item
        if (type === "bullet") {
          const cleanLine = line.replace(/^[•\-*]\s+/, "").replace(/^\d+\.\s+/, "");
          return (
            <div
              key={idx}
              className={`flex items-start gap-2 my-0.5 text-sm sm:text-base leading-relaxed ${
                dir === "ltr" ? "text-left" : "text-right"
              }`}
              dir={dir}
            >
              <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
              <div className="flex-1">
                {renderFormattedLineContent(cleanLine, dir)}
              </div>
            </div>
          );
        }

        // Standalone English line
        if (type === "english-text") {
          return (
            <div
              key={idx}
              className="text-left font-sans text-foreground/95 text-base sm:text-lg leading-relaxed tracking-wide my-0.5"
              dir="ltr"
            >
              {renderFormattedLineContent(line, "ltr")}
            </div>
          );
        }

        // Standalone Hebrew line
        return (
          <div
            key={idx}
            className="text-right font-sans text-foreground/95 text-base sm:text-lg leading-relaxed my-0.5"
            dir="rtl"
          >
            {renderFormattedLineContent(line, "rtl")}
          </div>
        );
      })}
    </div>
  );
}
