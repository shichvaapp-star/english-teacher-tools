"use client";

import { CLASS_GRADES, CLASS_NUMBERS, classParts, makeClass } from "@/lib/class-names";

const selectClass =
  "h-9 w-full cursor-pointer rounded-md border border-input bg-background px-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

/**
 * Grade + class-number dropdowns instead of a free-text field, so a class is
 * always saved in one spelling ("ח׳2") and can't create a duplicate entry.
 */
export function ClassPicker({
  value,
  onChange,
  label = "כיתה",
}: {
  value: string;
  onChange: (cls: string) => void;
  label?: string;
}) {
  const parts = classParts(value) ?? { grade: CLASS_GRADES[0], num: 1 };
  return (
    <div className="grid grid-cols-2 gap-2" dir="rtl">
      <select
        aria-label={`${label} – שכבה`}
        value={parts.grade}
        onChange={(e) => onChange(makeClass(e.target.value, parts.num))}
        className={selectClass}
      >
        {CLASS_GRADES.map((g) => (
          <option key={g} value={g}>
            שכבה {g}׳
          </option>
        ))}
      </select>
      <select
        aria-label={`${label} – מספר`}
        value={parts.num}
        onChange={(e) => onChange(makeClass(parts.grade, Number(e.target.value)))}
        className={selectClass}
      >
        {CLASS_NUMBERS.map((n) => (
          <option key={n} value={n}>
            {makeClass(parts.grade, n)}
          </option>
        ))}
      </select>
    </div>
  );
}
