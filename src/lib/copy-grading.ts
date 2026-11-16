// Grading for "copy the sentence from the text" questions.
// Students who type the sentence by hand (instead of copy-pasting) make small
// spelling mistakes, so words are matched fuzzily and in order rather than
// character-for-character.

export interface CopyGrade {
  points: number;
  isCorrect: boolean;
  feedbackHebrew: string;
}

function normalizeForCopy(str: string): string {
  return str
    .toLowerCase()
    .replace(/[‘’ʼ`']/g, "") // apostrophes (straight + curly): "I’m" -> "im"
    .replace(/[^a-z0-9\s]/g, " ") // other punctuation (incl. dashes) separates words
    .replace(/\s+/g, " ")
    .trim();
}

// Drops a leading "Line 4:" and/or "Speaker name:" the student may have copied along.
function stripLinePrefix(str: string): string {
  return str
    .trim()
    .replace(/^line\s*\d+\s*[:.\-–—]\s*/i, "")
    .replace(/^[A-Za-z][A-Za-z .'’-]{0,30}:\s+/, "");
}

// Edit distance where swapping two neighbouring letters ("afriad") counts as one typo.
function typoDistance(a: string, b: string): number {
  if (a === b) return 0;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

function allowedTypos(word: string): number {
  if (word.length <= 2) return 0;
  if (word.length <= 6) return 1;
  return 2;
}

function wordsMatch(typed: string, target: string): boolean {
  return typoDistance(typed, target) <= allowedTypos(target);
}

// Longest in-order fuzzy match between the typed words and the target words.
function alignWords(
  typed: string[],
  target: string[]
): { matched: number; misspelled: number } {
  const rows = typed.length + 1;
  const cols = target.length + 1;
  const best: Array<Array<{ matched: number; misspelled: number }>> = Array.from(
    { length: rows },
    () => Array.from({ length: cols }, () => ({ matched: 0, misspelled: 0 }))
  );
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const skipTyped = best[i - 1][j];
      const skipTarget = best[i][j - 1];
      let pick = skipTyped.matched >= skipTarget.matched ? skipTyped : skipTarget;
      if (wordsMatch(typed[i - 1], target[j - 1])) {
        const diag = best[i - 1][j - 1];
        const exact = typed[i - 1] === target[j - 1];
        const cand = {
          matched: diag.matched + 1,
          misspelled: diag.misspelled + (exact ? 0 : 1),
        };
        if (
          cand.matched > pick.matched ||
          (cand.matched === pick.matched && cand.misspelled < pick.misspelled)
        ) {
          pick = cand;
        }
      }
      best[i][j] = pick;
    }
  }
  return best[rows - 1][cols - 1];
}

export function gradeCopyAnswer(userAns: string, targetSentence?: string): CopyGrade {
  if (!userAns || !userAns.trim()) {
    return {
      points: 0,
      isCorrect: false,
      feedbackHebrew: "לא נכתבה תשובה. יש להעתיק את המשפט המדויק מתוך הטקסט.",
    };
  }
  if (!targetSentence) {
    return {
      points: userAns.length > 10 ? 8 : 4,
      isCorrect: userAns.length > 10,
      feedbackHebrew: "המשפט שהועתק נבדק על בסיס הטקסט.",
    };
  }

  const typed = normalizeForCopy(stripLinePrefix(userAns)).split(" ").filter(Boolean);
  const target = normalizeForCopy(targetSentence).split(" ").filter(Boolean);
  if (target.length === 0) {
    return { points: 10, isCorrect: true, feedbackHebrew: "המשפט הועתק." };
  }

  const { matched, misspelled } = alignWords(typed, target);
  const ratio = matched / target.length;
  const spellingNote =
    misspelled > 0
      ? ` שימו לב לאיות: ${misspelled === 1 ? "מילה אחת נכתבה" : `${misspelled} מילים נכתבו`} עם טעות קטנה. המשפט המקורי: "${targetSentence}".`
      : "";

  if (ratio >= 0.9) {
    return {
      points: 10,
      isCorrect: true,
      feedbackHebrew:
        misspelled > 0
          ? `העתקת את המשפט הנכון!${spellingNote}`
          : "העתקה מושלמת ומדויקת מתוך הטקסט! כל הכבוד!",
    };
  }
  // The student copied only the key part of the sentence, but what they copied is right.
  if (typed.length >= 4 && matched / typed.length >= 0.9) {
    return {
      points: 9,
      isCorrect: true,
      feedbackHebrew: `העתקת את החלק המרכזי והנכון מתוך המשפט! להבא כדאי להעתיק את המשפט המלא מתחילתו ועד סופו: "${targetSentence}".${misspelled > 0 ? " שימו לב גם לאיות." : ""}`,
    };
  }

  if (ratio >= 0.65) {
    return {
      points: ratio >= 0.8 ? 9 : 8,
      isCorrect: true,
      feedbackHebrew: `מצאת את המשפט הנכון, אבל חסרות בו כמה מילים. המשפט המלא: "${targetSentence}".`,
    };
  }
  if (ratio >= 0.4) {
    return {
      points: ratio >= 0.5 ? 6 : 5,
      isCorrect: true,
      feedbackHebrew: `העתקת חלק מהמשפט הנכון. המשפט המלא: "${targetSentence}".`,
    };
  }
  return {
    points: 0,
    isCorrect: false,
    feedbackHebrew: `המשפט שהועתק אינו תואם. המשפט הנכון הוא: "${targetSentence}".`,
  };
}
