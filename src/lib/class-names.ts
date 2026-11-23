/**
 * Class names ("ז׳1", "ח׳2" …) come from several places: student profiles,
 * assignments, and free-text fields on older submissions. They were saved with
 * different apostrophes (' vs ׳), spacing and order ("2ח"), so the same class
 * could appear several times. Everything goes through `canonicalClass` so a
 * class has exactly one spelling: Hebrew grade letter + geresh + number.
 */

export const CLASS_GRADES = ["ז", "ח", "ט"] as const;
export type ClassGradeLetter = (typeof CLASS_GRADES)[number];
export const CLASS_NUMBERS = [1, 2, 3, 4, 5, 6] as const;

const GERESH = "׳";
const NUMERIC_GRADE: Record<string, ClassGradeLetter> = { "7": "ז", "8": "ח", "9": "ט" };

export function makeClass(grade: string, num: number): string {
  return `${grade}${GERESH}${num}`;
}

export const DEFAULT_CLASSES: string[] = CLASS_GRADES.flatMap((g) => [1, 2, 3].map((n) => makeClass(g, n)));

/** "ח'2", "2ח", "ח 2", "ח׳ 2", "8/2" → "ח׳2". Returns null if it can't tell. */
export function canonicalClass(raw: string | null | undefined): string | null {
  if (!raw) return null;
  // Drop every apostrophe-like mark, quotes, slashes, dashes and whitespace.
  const s = raw.replace(/[\s'׳’`״"/\\\-.,]/g, "");
  if (!s) return null;

  let m = s.match(/^([זחט])(\d{1,2})$/) ?? s.match(/^(\d{1,2})([זחט])$/);
  if (m) {
    const [grade, num] = /\d/.test(m[1]) ? [m[2], m[1]] : [m[1], m[2]];
    const n = Number(num);
    return n > 0 ? makeClass(grade, n) : null;
  }

  // Numeric grade + class number, e.g. "82" written as "8 2" or "8/2".
  m = s.match(/^([789])(\d)$/);
  if (m) {
    const n = Number(m[2]);
    return n > 0 ? makeClass(NUMERIC_GRADE[m[1]], n) : null;
  }
  return null;
}

/** Canonical form when parseable, otherwise the trimmed original. */
export function cleanClass(raw: string): string {
  return canonicalClass(raw) ?? raw.trim();
}

export function optionalClass(raw: string | null | undefined): string | undefined {
  return raw ? cleanClass(raw) : undefined;
}

export function sameClass(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const ca = canonicalClass(a);
  return ca !== null && ca === canonicalClass(b);
}

/** Splits a canonical class into its parts (for pickers). */
export function classParts(raw: string | null | undefined): { grade: ClassGradeLetter; num: number } | null {
  const c = canonicalClass(raw);
  if (!c) return null;
  return { grade: c[0] as ClassGradeLetter, num: Number(c.slice(2)) };
}

export function compareClasses(a: string, b: string): number {
  const pa = classParts(a);
  const pb = classParts(b);
  if (pa && pb) {
    const g = CLASS_GRADES.indexOf(pa.grade) - CLASS_GRADES.indexOf(pb.grade);
    return g !== 0 ? g : pa.num - pb.num;
  }
  if (pa) return -1;
  if (pb) return 1;
  return a.localeCompare(b, "he");
}
