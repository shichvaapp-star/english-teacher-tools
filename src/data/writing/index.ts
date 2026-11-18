// Grade × level writing tasks, written in each grade's textbook vocabulary.
import type { ClassGrade } from "@/lib/levels";
import type { WritingTask } from "@/types/writing";
import { WRITING_G7 } from "@/data/writing/g7";
import { WRITING_G8 } from "@/data/writing/g8";

export const WRITING_TASKS: WritingTask[] = [...WRITING_G7, ...WRITING_G8];

export function getWritingTasks(grade: ClassGrade, level?: WritingTask["level"]): WritingTask[] {
  return WRITING_TASKS.filter((t) => t.grade === grade && (!level || t.level === level));
}
