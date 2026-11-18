// Grade × level Unseen stories, written in each grade's textbook vocabulary.
// One file per grade and level (g7-l1.ts …); add new files to the list below.
import type { ClassGrade } from "@/lib/levels";
import type { MSUnseenStory } from "@/types/unseen";

export const UNSEEN_STORIES: MSUnseenStory[] = [];

export function getUnseenStories(grade: ClassGrade, level?: MSUnseenStory["level"]): MSUnseenStory[] {
  return UNSEEN_STORIES.filter((s) => s.grade === grade && (!level || s.level === level));
}
