// Grade × level conversation scenarios, written in each grade's textbook vocabulary.
import type { ClassGrade } from "@/lib/levels";
import type { ConversationScenario } from "@/types/conversation";

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [];

export function getConversationScenarios(
  grade: ClassGrade,
  level?: ConversationScenario["level"]
): ConversationScenario[] {
  return CONVERSATION_SCENARIOS.filter((s) => s.grade === grade && (!level || s.level === level));
}
