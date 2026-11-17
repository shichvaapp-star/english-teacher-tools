// Checks for translations that must be shown to students in Hebrew only.
// AI models sometimes slip words in other scripts (Devanagari, Arabic, Cyrillic, CJK...)
// into a Hebrew translation. Latin letters are allowed (names, English terms in brackets).

const FOREIGN_LETTER = /(?![\p{Script=Hebrew}\p{Script=Latin}])\p{L}/u;
const HEBREW_LETTER = /\p{Script=Hebrew}/u;

/** True when the text contains Hebrew and no letters from other scripts (Latin is allowed). */
export function isHebrewOnly(text: string): boolean {
  return HEBREW_LETTER.test(text) && !FOREIGN_LETTER.test(text);
}

/** Removes words containing letters from other scripts and tidies the spacing. */
export function stripForeignScripts(text: string): string {
  return text
    .split(/(\s+)/)
    .filter((part) => !FOREIGN_LETTER.test(part))
    .join("")
    .replace(/\s+([,.;:!?)])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}
