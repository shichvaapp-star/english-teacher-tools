import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import type { ClassGrade, LevelNumber } from "@/lib/levels";
import { toBeItems, toBeTopic } from "@/data/grammar/topics/to-be";
import { thereIsAreItems, thereIsAreTopic } from "@/data/grammar/topics/there-is-are";
import { presentSimpleItems, presentSimpleTopic } from "@/data/grammar/topics/present-simple";
import { presentProgressiveItems, presentProgressiveTopic } from "@/data/grammar/topics/present-progressive";
import { simpleVsProgressiveItems, simpleVsProgressiveTopic } from "@/data/grammar/topics/simple-vs-progressive";
import { pastSimpleItems, pastSimpleTopic } from "@/data/grammar/topics/past-simple";
import { pastProgressiveItems, pastProgressiveTopic } from "@/data/grammar/topics/past-progressive";
import { pastSimpleVsProgressiveItems, pastSimpleVsProgressiveTopic } from "@/data/grammar/topics/past-simple-vs-progressive";
import { futureWillItems, futureWillTopic } from "@/data/grammar/topics/future-will";
import { goingToItems, goingToTopic } from "@/data/grammar/topics/going-to";
import { willVsGoingToItems, willVsGoingToTopic } from "@/data/grammar/topics/will-vs-going-to";
import { presentPerfectItems, presentPerfectTopic } from "@/data/grammar/topics/present-perfect";
import { perfectVsPastItems, perfectVsPastTopic } from "@/data/grammar/topics/perfect-vs-past";
import { presentSimpleGrade7Items } from "@/data/grammar/topics/present-simple-g7";
import { presentSimpleGrade8Items } from "@/data/grammar/topics/present-simple-g8";
import { presentSimpleGrade9Items } from "@/data/grammar/topics/present-simple-g9";

export { GRAMMAR_GROUPS } from "@/data/grammar/groups";

export const GRAMMAR_TOPICS: GrammarTopic[] = [toBeTopic, thereIsAreTopic, presentSimpleTopic, presentProgressiveTopic, simpleVsProgressiveTopic, pastSimpleTopic, pastProgressiveTopic, pastSimpleVsProgressiveTopic, futureWillTopic, goingToTopic, willVsGoingToTopic, presentPerfectTopic, perfectVsPastTopic];

export const GRAMMAR_ITEMS: GrammarItem[] = [
  ...toBeItems,
  ...thereIsAreItems,
  ...presentSimpleItems,
  ...presentSimpleGrade7Items,
  ...presentSimpleGrade8Items,
  ...presentSimpleGrade9Items,
  ...presentProgressiveItems,
  ...simpleVsProgressiveItems,
  ...pastSimpleItems,
  ...pastProgressiveItems,
  ...pastSimpleVsProgressiveItems,
  ...futureWillItems,
  ...goingToItems,
  ...willVsGoingToItems,
  ...presentPerfectItems,
  ...perfectVsPastItems,
];

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
