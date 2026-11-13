import type { TeacherAssignment } from "@/types/assignment";
import type { StudentProfile } from "@/types/auth";
import { formatShortDate } from "@/lib/submission-time";

export function describeAssignmentTarget(assignment: TeacherAssignment, students: StudentProfile[]): string {
  switch (assignment.targetType) {
    case "class":
      return `כיתה ${assignment.targetClass ?? ""}${assignment.targetGroup ? ` · הקבצה ${assignment.targetGroup}` : ""}`;
    case "group":
      return `הקבצה ${assignment.targetGroup ?? ""}`;
    case "students": {
      const ids = assignment.targetStudentIds ?? [];
      const names = ids
        .map((id) => students.find((s) => s.id === id)?.name)
        .filter(Boolean)
        .slice(0, 2);
      const rest = ids.length - names.length;
      return names.length ? `${names.join(", ")}${rest > 0 ? ` +${rest}` : ""}` : `${ids.length} תלמידים`;
    }
    default:
      return "כל התלמידים";
  }
}

export function formatDueDate(dueTs: number, now: number): string {
  if (!dueTs) return "";
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const days = Math.round((dueTs - startToday.getTime()) / (24 * 3600 * 1000));
  if (days === 0) return "להיום";
  if (days === 1) return "למחר";
  if (days > 1 && days < 7) return `בעוד ${days} ימים`;
  if (days < 0 && days > -7) return `באיחור של ${-days} ימים`;
  return formatShortDate(dueTs);
}
