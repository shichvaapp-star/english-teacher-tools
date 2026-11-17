"use client";

import React from "react";
import type { GrammarExerciseType, GrammarItem } from "@/types/grammar";
import { ChoiceExercise } from "@/components/grammar/exercises/choice-exercise";
import { GapTypeExercise, TransformExercise, WriteOwnExercise } from "@/components/grammar/exercises/text-exercises";
import {
  ClozeTextExercise,
  FindFixExercise,
  MatchHalvesExercise,
  SortExercise,
  UnscrambleExercise,
} from "@/components/grammar/exercises/structure-exercises";
import { ContextLine, InstructionLine, type ExerciseProps } from "@/components/grammar/exercises/shared";

export const EXERCISE_TYPE_LABEL: Record<GrammarExerciseType, { he: string; en: string }> = {
  mcq: { he: "בחירה", en: "Choose" },
  gap_bank: { he: "בנק מילים", en: "Word bank" },
  gap_type: { he: "הקלדת הצורה", en: "Type the form" },
  unscramble: { he: "בניית משפט", en: "Build the sentence" },
  find_fix: { he: "מצאו ותקנו", en: "Find & fix" },
  transform: { he: "שינוי משפט", en: "Transform" },
  sort: { he: "מיון", en: "Sort" },
  match_halves: { he: "התאמת חצאים", en: "Match halves" },
  cloze_text: { he: "טקסט קצר", en: "Short text" },
  write_own: { he: "כתיבה חופשית", en: "Write your own" },
};

const DEFAULT_INSTRUCTION_HE: Record<GrammarExerciseType, string> = {
  mcq: "בחרו את התשובה הנכונה",
  gap_bank: "בחרו מילה מהבנק",
  gap_type: "כתבו את הפועל בצורה הנכונה",
  unscramble: "לחצו על המילים לפי הסדר",
  find_fix: "לחצו על המילה השגויה ותקנו אותה",
  transform: "כתבו את המשפט מחדש",
  sort: "מיינו כל שורה לקבוצה הנכונה",
  match_halves: "התאימו לכל התחלה את הסוף שלה",
  cloze_text: "השלימו את הפעלים בצורה הנכונה",
  write_own: "כתבו משפטים משלכם",
};

export function GrammarExercise(props: ExerciseProps) {
  const { item } = props;
  return (
    <div className="space-y-4">
      <InstructionLine text={item.instructionHe ?? DEFAULT_INSTRUCTION_HE[item.type]} />
      <ContextLine text={item.context} />
      {renderBody(props)}
    </div>
  );
}

function renderBody({ item, ...rest }: ExerciseProps<GrammarItem>) {
  switch (item.type) {
    case "mcq":
    case "gap_bank":
      return <ChoiceExercise item={item} {...rest} />;
    case "gap_type":
      return <GapTypeExercise item={item} {...rest} />;
    case "transform":
      return <TransformExercise item={item} {...rest} />;
    case "write_own":
      return <WriteOwnExercise item={item} {...rest} />;
    case "unscramble":
      return <UnscrambleExercise item={item} {...rest} />;
    case "find_fix":
      return <FindFixExercise item={item} {...rest} />;
    case "sort":
      return <SortExercise item={item} {...rest} />;
    case "match_halves":
      return <MatchHalvesExercise item={item} {...rest} />;
    case "cloze_text":
      return <ClozeTextExercise item={item} {...rest} />;
  }
}
