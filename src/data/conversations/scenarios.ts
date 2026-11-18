// Grade × level conversation scenarios, written in each grade's textbook vocabulary.
import type { ClassGrade } from "@/lib/levels";
import type { ConversationScenario } from "@/types/conversation";
import { CONVERSATIONS_G7_L1 } from "@/data/conversations/g7-l1";
import { CONVERSATIONS_G7_L2 } from "@/data/conversations/g7-l2";
import { CONVERSATIONS_G7_L3 } from "@/data/conversations/g7-l3";
import { CONVERSATIONS_G8_L1 } from "@/data/conversations/g8-l1";
import { CONVERSATIONS_G8_L2 } from "@/data/conversations/g8-l2";
import { CONVERSATIONS_G8_L3 } from "@/data/conversations/g8-l3";
import { CONVERSATIONS_G9_L1 } from "@/data/conversations/g9-l1";
import { CONVERSATIONS_G9_L2 } from "@/data/conversations/g9-l2";

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [...CONVERSATIONS_G7_L1, ...CONVERSATIONS_G7_L2, ...CONVERSATIONS_G7_L3, ...CONVERSATIONS_G8_L1, ...CONVERSATIONS_G8_L2, ...CONVERSATIONS_G8_L3, ...CONVERSATIONS_G9_L1, ...CONVERSATIONS_G9_L2];

export function getConversationScenarios(
  grade: ClassGrade,
  level?: ConversationScenario["level"]
): ConversationScenario[] {
  return CONVERSATION_SCENARIOS.filter((s) => s.grade === grade && (!level || s.level === level));
}
