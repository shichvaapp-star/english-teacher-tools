// The site's textbook vocabulary (src/data/vocab), shaped as read-only word
// banks – one per textbook unit – for the teacher dashboard's word banks page.
import { gradeUnits } from "@/data/vocab/cards";
import { CLASS_GRADES, GRADE_HE, type ClassGrade } from "@/lib/levels";
import { BOOK_NAME } from "@/lib/worksheet/labels";
import { curriculumWords } from "@/lib/vocab-storage";
import type { TeacherVocabBank } from "@/types/vocab-bank";

const TEXTBOOK_ID_PREFIX = "textbook-";

export function isTextbookBank(bank: Pick<TeacherVocabBank, "id">): boolean {
  return bank.id.startsWith(TEXTBOOK_ID_PREFIX);
}

function unitBank(grade: ClassGrade, unit: number): TeacherVocabBank {
  return {
    id: `${TEXTBOOK_ID_PREFIX}g${grade}-u${unit}`,
    teacherId: "system",
    name: `${BOOK_NAME[grade]} · Unit ${unit}`,
    description: `ספר הלימוד של כיתה ${GRADE_HE[grade]}׳ · יחידה ${unit}`,
    grade: GRADE_HE[grade],
    levelType: "standard",
    standardLevel: "all",
    words: curriculumWords(grade, unit).map((w) => ({
      id: w.id,
      english: w.english,
      hebrew: w.hebrew,
      partOfSpeech: w.partOfSpeech,
      example: w.example,
    })),
    createdAt: "2026-11-18",
    updatedAt: "2026-11-18",
  };
}

const BANKS: Record<ClassGrade, TeacherVocabBank[]> = Object.fromEntries(
  CLASS_GRADES.map((g) => [g, gradeUnits(g).map((u) => unitBank(g, u))])
) as Record<ClassGrade, TeacherVocabBank[]>;

/** One bank per textbook unit of the grade, in unit order. */
export function textbookBanks(grade: ClassGrade): TeacherVocabBank[] {
  return BANKS[grade];
}

/** A copy the teacher can edit and save as their own bank (new id on save). */
export function textbookBankCopy(bank: TeacherVocabBank, teacherId: string): TeacherVocabBank {
  return {
    ...bank,
    id: "",
    teacherId,
    name: `${bank.name} (עותק)`,
    words: bank.words.map((w) => ({ ...w })),
    createdAt: "",
    updatedAt: "",
  };
}
