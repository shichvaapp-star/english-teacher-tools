// Grade × level Unseen stories, written in each grade's textbook vocabulary.
// One file per grade and level (g7-l1.ts …); add new files to the list below.
import type { ClassGrade } from "@/lib/levels";
import type { MSUnseenStory } from "@/types/unseen";
import { UNSEEN_G7_L1 } from "@/data/unseen/g7-l1";
import { UNSEEN_G7_L2 } from "@/data/unseen/g7-l2";
import { UNSEEN_G7_L3 } from "@/data/unseen/g7-l3";
import { UNSEEN_G8_L1 } from "@/data/unseen/g8-l1";
import { UNSEEN_G8_L2 } from "@/data/unseen/g8-l2";
import { UNSEEN_G8_L3 } from "@/data/unseen/g8-l3";

export const UNSEEN_STORIES: MSUnseenStory[] = [...UNSEEN_G7_L1, ...UNSEEN_G7_L2, ...UNSEEN_G7_L3, ...UNSEEN_G8_L1, ...UNSEEN_G8_L2, ...UNSEEN_G8_L3];

export function getUnseenStories(grade: ClassGrade, level?: MSUnseenStory["level"]): MSUnseenStory[] {
  return UNSEEN_STORIES.filter((s) => s.grade === grade && (!level || s.level === level));
}
