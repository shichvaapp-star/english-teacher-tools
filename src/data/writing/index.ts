// Grade × level writing tasks, written in each grade's textbook vocabulary.
import type { ClassGrade } from "@/lib/levels";
import type { WritingTask } from "@/types/writing";
import { WRITING_G7 } from "@/data/writing/g7";

export const WRITING_TASKS: WritingTask[] = [...WRITING_G7];

export function getWritingTasks(grade: ClassGrade, level?: WritingTask["level"]): WritingTask[] {
  return WRITING_TASKS.filter((t) => t.grade === grade && (!level || t.level === level));
}
