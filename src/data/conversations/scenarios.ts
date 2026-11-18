// Grade × level conversation scenarios, written in each grade's textbook vocabulary.
import type { ClassGrade } from "@/lib/levels";
import type { ConversationScenario } from "@/types/conversation";
import { CONVERSATIONS_G7_L1 } from "@/data/conversations/g7-l1";
import { CONVERSATIONS_G7_L2 } from "@/data/conversations/g7-l2";

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [...CONVERSATIONS_G7_L1, ...CONVERSATIONS_G7_L2];

export function getConversationScenarios(
  grade: ClassGrade,
  level?: ConversationScenario["level"]
): ConversationScenario[] {
  return CONVERSATION_SCENARIOS.filter((s) => s.grade === grade && (!level || s.level === level));
}
