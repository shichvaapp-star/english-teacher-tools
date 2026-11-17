import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import type { ClassGrade, LevelNumber } from "@/lib/levels";
import { presentSimpleItems, presentSimpleTopic } from "@/data/grammar/topics/present-simple";

export { GRAMMAR_GROUPS } from "@/data/grammar/groups";

export const GRAMMAR_TOPICS: GrammarTopic[] = [presentSimpleTopic];

export const GRAMMAR_ITEMS: GrammarItem[] = [...presentSimpleItems];

export function getGrammarTopic(id: string): GrammarTopic | undefined {
  return GRAMMAR_TOPICS.find((t) => t.id === id);
}

/**
 * Items for a topic + level. With a grade, returns that grade's items plus
 * shared (grade-less) items; without one, every item for the level.
 */
export function getGrammarItems(
  topicId: string,
  level: LevelNumber,
  grade: ClassGrade | null = null
): GrammarItem[] {
  return GRAMMAR_ITEMS.filter(
    (i) =>
      i.topicId === topicId &&
      i.level === level &&
      (grade === null || i.grade === undefined || i.grade === grade)
  );
}
