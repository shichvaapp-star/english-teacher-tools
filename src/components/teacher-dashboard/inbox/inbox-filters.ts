import type { SubmissionItem } from "@/types/submission";
import type { TeacherAssignment } from "@/types/assignment";
import { submissionMatchesAssignment } from "../dashboard-selectors";

export type InboxStatus = "pending" | "reviewed" | "all";

export interface InboxFilters {
  status: InboxStatus;
  type: string; // "all" | SubmissionType
  cls: string; // "all" | class
  group: string; // "all" | group
  assignment: string; // "all" | "free" | assignment id
  q: string;
}

export const DEFAULT_FILTERS: InboxFilters = { status: "pending", type: "all", cls: "all", group: "all", assignment: "all", q: "" };

export function readFilters(params: URLSearchParams): InboxFilters {
  const status = params.get("status");
  return {
    status: status === "reviewed" || status === "all" ? status : "pending",
    type: params.get("type") || "all",
    cls: params.get("class") || "all",
    group: params.get("group") || "all",
    assignment: params.get("assignment") || "all",
    q: params.get("q") || "",
  };
}

export function applyFilters(
  submissions: SubmissionItem[],
  f: InboxFilters,
  assignments: TeacherAssignment[],
  opts: { ignoreStatus?: boolean } = {}
): SubmissionItem[] {
  const q = f.q.trim().toLowerCase();
  const assignment = f.assignment !== "all" && f.assignment !== "free" ? assignments.find((a) => a.id === f.assignment) : undefined;
  return submissions.filter((item) => {
    if (q) {
      const hit =
        item.studentName.toLowerCase().includes(q) ||
        item.hebrewTitle.toLowerCase().includes(q) ||
        item.taskTitle.toLowerCase().includes(q) ||
        item.receiptCode?.toLowerCase().includes(q);
      if (!hit) return false;
    }
    if (!opts.ignoreStatus) {
      if (f.status === "pending" && item.status !== "submitted") return false;
      if (f.status === "reviewed" && item.status !== "reviewed") return false;
    }
    if (f.type !== "all" && item.type !== f.type) return false;
    if (f.cls !== "all" && item.studentClass !== f.cls) return false;
    if (f.group !== "all" && item.studentGroup !== f.group) return false;
    if (f.assignment === "free" && assignments.some((a) => submissionMatchesAssignment(item, a))) return false;
    if (assignment && !submissionMatchesAssignment(item, assignment)) return false;
    return true;
  });
}
