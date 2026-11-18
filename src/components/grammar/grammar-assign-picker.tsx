"use client";

import React from "react";
import { BookOpenCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { GRAMMAR_GROUPS, GRAMMAR_ITEMS, GRAMMAR_TOPICS } from "@/data/grammar";
import { EXERCISE_TYPE_LABEL, ExerciseTypeTip } from "@/components/grammar/exercises";
import type { ExerciseLevel } from "@/types/assignment";
import type { GrammarExerciseType } from "@/types/grammar";

const LEVEL_OPTIONS: { value: "all" | ExerciseLevel; label: string }[] = [
  { value: "all", label: "לפי רמת התלמיד" },
  { value: "Level 1", label: "רמה 1" },
  { value: "Level 2", label: "רמה 2" },
  { value: "Level 3", label: "רמה 3" },
];

const ALL_TYPES = Object.keys(EXERCISE_TYPE_LABEL) as GrammarExerciseType[];

/** Grammar section of the "assign task" modal. */
export function GrammarAssignPicker({
  topicIds,
  onTopicIdsChange,
  types,
  onTypesChange,
  itemCount,
  onItemCountChange,
  level,
  onLevelChange,
}: {
  topicIds: string[];
  onTopicIdsChange: (ids: string[]) => void;
  types: GrammarExerciseType[];
  onTypesChange: (t: GrammarExerciseType[]) => void;
  itemCount: number | null;
  onItemCountChange: (n: number | null) => void;
  level: "all" | ExerciseLevel;
  onLevelChange: (l: "all" | ExerciseLevel) => void;
}) {
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const usedTypes = ALL_TYPES.filter((t) => GRAMMAR_ITEMS.some((i) => i.type === t && topicIds.includes(i.topicId)));

  return (
    <div className="space-y-4 rounded-xl border border-type-grammar/30 bg-type-grammar/5 p-3.5">
      <div className="flex items-center gap-1.5 font-bold text-foreground">
        <BookOpenCheck className="h-4 w-4 text-type-grammar" />
        <span>נושאי דקדוק (אפשר לבחור כמה לחזרה משולבת):</span>
      </div>

      {GRAMMAR_GROUPS.map((g) => {
        const topics = GRAMMAR_TOPICS.filter((t) => t.group === g.id);
        if (!topics.length) return null;
        return (
          <div key={g.id} className="space-y-1.5">
            <p className="text-2xs font-bold text-muted-foreground">{g.titleHe}</p>
            <div className="flex flex-wrap gap-1.5">
              {topics.map((t) => {
                const on = topicIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onTopicIdsChange(toggle(topicIds, t.id))}
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                      on ? "border-type-grammar bg-type-grammar/15 text-foreground" : "border-border text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <span dir="ltr">{t.title}</span> · {t.titleHe}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="space-y-1.5">
        <p className="font-bold text-foreground">רמה:</p>
        <div className="flex flex-wrap gap-1.5">
          {LEVEL_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => onLevelChange(o.value)}
              className={cn(
                "rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                level === o.value ? "border-type-grammar bg-type-grammar/15" : "border-border text-muted-foreground hover:bg-muted/50"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {usedTypes.length > 1 && (
        <div className="space-y-1.5">
          <p className="font-bold text-foreground">
            סוגי תרגילים <span className="font-normal text-muted-foreground">(בלי בחירה – שילוב מלא)</span>:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {usedTypes.map((t) => (
              <ExerciseTypeTip key={t} type={t}>
              <button
                type="button"
                onClick={() => onTypesChange(toggle(types, t))}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer",
                  types.includes(t) ? "border-type-grammar bg-type-grammar/15" : "border-border text-muted-foreground hover:bg-muted/50"
                )}
              >
                {EXERCISE_TYPE_LABEL[t].he}
              </button>
              </ExerciseTypeTip>
            ))}
          </div>
        </div>
      )}

      <label className="flex items-center gap-2">
        <span className="font-bold text-foreground">מספר תרגילים:</span>
        <input
          type="number"
          min={3}
          max={60}
          value={itemCount ?? ""}
          placeholder="הכל"
          onChange={(e) => {
            const n = Number(e.target.value);
            onItemCountChange(e.target.value === "" || !Number.isFinite(n) || n <= 0 ? null : Math.min(60, Math.round(n)));
          }}
          className="w-20 rounded-md border border-input bg-background px-2 py-1 text-xs"
        />
      </label>
    </div>
  );
}
