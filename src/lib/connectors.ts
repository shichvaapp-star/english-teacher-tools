// Detects connectors (linking words) in a student's text, so the writing
// evaluator can check them deterministically and not rely only on the AI.
// Server-safe (no React, no Firebase).

export type ConnectorFunction = "order" | "adding" | "contrast" | "cause" | "example";

export interface ConnectorUse {
  /** The connector as students learn it, e.g. "In addition". */
  label: string;
  function: ConnectorFunction;
  count: number;
}

export interface ConnectorAnalysis {
  /** Distinct connectors found (not counting "and"), most used first. */
  used: ConnectorUse[];
  /** Total connector uses (not counting "and"). */
  total: number;
  /** How many of the five functions (order, adding, contrast, cause, example) appear. */
  functionsCovered: number;
  /** Uses of plain "and", tracked apart because it says little about linking ideas. */
  andCount: number;
}

// Start of the text, of a line, or of a sentence: words like "First" or "Next"
// only count as connectors there ("my first day" is not one).
const START = String.raw`(?:^|[.!?]\s+|\n\s*)`;

const CONNECTORS: ReadonlyArray<{ label: string; function: ConnectorFunction; pattern: RegExp }> = [
  // Order & sequence
  { label: "First of all", function: "order", pattern: /\bfirst of all\b/gi },
  { label: "First", function: "order", pattern: new RegExp(`${START}first(?!\\s+of all)\\b`, "gi") },
  { label: "Firstly", function: "order", pattern: /\bfirstly\b/gi },
  { label: "Secondly", function: "order", pattern: /\bsecondly\b/gi },
  { label: "Thirdly", function: "order", pattern: /\bthirdly\b/gi },
  { label: "Then", function: "order", pattern: /\bthen\b/gi },
  { label: "Next", function: "order", pattern: new RegExp(`${START}next\\b`, "gi") },
  { label: "After that", function: "order", pattern: /\bafter that\b/gi },
  { label: "Afterwards", function: "order", pattern: /\bafterwards?\b/gi },
  { label: "Later", function: "order", pattern: new RegExp(`${START}later\\b`, "gi") },
  { label: "Finally", function: "order", pattern: /\bfinally\b/gi },
  { label: "In the end", function: "order", pattern: /\bin the end\b/gi },
  { label: "At last", function: "order", pattern: /\bat last\b/gi },
  { label: "Last but not least", function: "order", pattern: /\blast but not least\b/gi },
  { label: "In conclusion", function: "order", pattern: /\bin conclusion\b/gi },
  { label: "To sum up", function: "order", pattern: /\bto sum up\b/gi },
  { label: "To conclude", function: "order", pattern: /\bto conclude\b/gi },
  // Adding information
  { label: "Also", function: "adding", pattern: /\balso\b/gi },
  { label: "In addition", function: "adding", pattern: /\bin addition\b/gi },
  { label: "Furthermore", function: "adding", pattern: /\bfurthermore\b/gi },
  { label: "Moreover", function: "adding", pattern: /\bmoreover\b/gi },
  { label: "Besides", function: "adding", pattern: /\bbesides\b/gi },
  { label: "As well as", function: "adding", pattern: /\bas well as\b/gi },
  // Contrast
  { label: "But", function: "contrast", pattern: /\bbut\b/gi },
  { label: "However", function: "contrast", pattern: /\bhowever\b/gi },
  { label: "On the other hand", function: "contrast", pattern: /\bon the other hand\b/gi },
  { label: "Although", function: "contrast", pattern: /\balthough\b/gi },
  { label: "Even though", function: "contrast", pattern: /\beven though\b/gi },
  { label: "Despite / In spite of", function: "contrast", pattern: /\b(?:despite|in spite of)\b/gi },
  { label: "Instead", function: "contrast", pattern: /\binstead\b/gi },
  // Cause & effect
  { label: "Because", function: "cause", pattern: /\bbecause\b/gi },
  // "so" only as a connector: after a comma, at a sentence start, or "so that" (not "so happy").
  { label: "So", function: "cause", pattern: new RegExp(`(?:,\\s*so\\b|${START}so\\b|\\bso that\\b)`, "gi") },
  { label: "Therefore", function: "cause", pattern: /\btherefore\b/gi },
  { label: "As a result", function: "cause", pattern: /\bas a result\b/gi },
  { label: "That's why", function: "cause", pattern: /\bthat(?:'s| is) why\b/gi },
  { label: "Due to", function: "cause", pattern: /\bdue to\b/gi },
  // Examples
  { label: "For example", function: "example", pattern: /\bfor example\b/gi },
  { label: "For instance", function: "example", pattern: /\bfor instance\b/gi },
  { label: "Such as", function: "example", pattern: /\bsuch as\b/gi },
];

export function analyzeConnectors(text: string): ConnectorAnalysis {
  const normalized = text.replace(/[’‘]/g, "'");
  const used: ConnectorUse[] = [];
  for (const c of CONNECTORS) {
    const count = normalized.match(c.pattern)?.length ?? 0;
    if (count > 0) used.push({ label: c.label, function: c.function, count });
  }
  used.sort((a, b) => b.count - a.count);
  return {
    used,
    total: used.reduce((sum, u) => sum + u.count, 0),
    functionsCovered: new Set(used.map((u) => u.function)).size,
    andCount: normalized.match(/\band\b/gi)?.length ?? 0,
  };
}

/** "Because (2), Also, However" — for prompts and feedback. */
export function formatConnectorList(analysis: ConnectorAnalysis): string {
  return analysis.used.map((u) => (u.count > 1 ? `${u.label} (${u.count})` : u.label)).join(", ");
}

/** True when a feedback string already talks about connectors / linking words. */
export function mentionsConnectors(text: string): boolean {
  return /connector|linking word|transition|מילות? קישור|מילות חיבור/i.test(text);
}
