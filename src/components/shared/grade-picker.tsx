"use client";

import { cn } from "@/lib/utils";
import { CLASS_GRADES, GRADE_LABELS, type ClassGrade } from "@/lib/levels";

type Accent = "unseen" | "writing" | "vocab" | "conversation" | "grammar";

// Literal class names so Tailwind keeps them.
const ACTIVE: Record<Accent, string> = {
  unseen: "border-type-unseen bg-type-unseen/10",
  writing: "border-type-writing bg-type-writing/10",
  vocab: "border-type-vocab bg-type-vocab/10",
  conversation: "border-type-conversation bg-type-conversation/10",
  grammar: "border-type-grammar bg-type-grammar/10",
};

interface GradePickerProps {
  grade: ClassGrade;
  onChange: (g: ClassGrade) => void;
  accent: Accent;
  /** The student's own class, marked with a small dot. */
  classGrade?: ClassGrade | null;
  /** Assignment-fixed grade: shown but not changeable. */
  disabled?: boolean;
  className?: string;
}

/** 7 / 8 / 9 chips that choose whose textbook vocabulary the content uses. */
export function GradePicker({ grade, onChange, accent, classGrade, disabled, className }: GradePickerProps) {
  return (
    <section className={cn("space-y-2", className)} dir="rtl">
      <p className="text-sm text-muted-foreground">שכבה (לפי אוצר המילים של ספר הלימוד)</p>
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Grade">
        {CLASS_GRADES.map((g) => (
          <button
            key={g}
            type="button"
            role="radio"
            aria-checked={grade === g}
            disabled={disabled && grade !== g}
            onClick={() => onChange(g)}
            className={cn(
              "relative rounded-xl border px-3 py-2 text-center transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40",
              grade === g ? ACTIVE[accent] : "border-border hover:bg-muted/50"
            )}
          >
            <span className="block text-sm font-bold">{GRADE_LABELS[g].he}</span>
            <span className="block text-2xs text-muted-foreground" dir="ltr">
              {GRADE_LABELS[g].en}
            </span>
            {classGrade === g && (
              <span
                className="absolute top-1.5 left-1.5 size-1.5 rounded-full bg-foreground/50"
                aria-label="הכיתה שלי"
                title="הכיתה שלי"
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
