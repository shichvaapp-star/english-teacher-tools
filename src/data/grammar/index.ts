import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import type { LevelNumber } from "@/lib/levels";
import { presentSimpleItems, presentSimpleTopic } from "@/data/grammar/topics/present-simple";

export { GRAMMAR_GROUPS } from "@/data/grammar/groups";

export const GRAMMAR_TOPICS: GrammarTopic[] = [presentSimpleTopic];

export const GRAMMAR_ITEMS: GrammarItem[] = [...presentSimpleItems];

export function getGrammarTopic(id: string): GrammarTopic | undefined {
  return GRAMMAR_TOPICS.find((t) => t.id === id);
}

export function getGrammarItems(topicId: string, level: LevelNumber): GrammarItem[] {
  return GRAMMAR_ITEMS.filter((i) => i.topicId === topicId && i.level === level);
}
