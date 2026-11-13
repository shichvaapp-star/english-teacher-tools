import type { SubmissionItem } from "@/types/submission";
import type { StudentProfile } from "@/types/auth";
import type { TeacherAssignment } from "@/types/assignment";
import { parseSubmissionTimestamp } from "@/lib/submission-time";

const normalizeName = (name: string | undefined) => (name || "").trim().toLowerCase();
const normalizeClass = (cls: string | undefined) => (cls || "").replace(/[׳']/g, "'");

export const isPending = (sub: SubmissionItem) => sub.status === "submitted";
export const isReviewed = (sub: SubmissionItem) => sub.status === "reviewed";
export const getSubmissionGrade = (sub: SubmissionItem): number | undefined => sub.grade ?? sub.score;

export function isFreeChoiceAssignment(assignment: TeacherAssignment): boolean {
  return Boolean(assignment.isFreeChoice || assignment.taskId === "free_choice");
}

/** Students that an assignment targets (same rules as the original AssignedTasksView). */
export function getEligibleStudents(assignment: TeacherAssignment, students: StudentProfile[]): StudentProfile[] {
  if (assignment.targetType === "class") {
    return students.filter((s) => {
      const classMatch =
        !assignment.targetClass ||
        assignment.targetClass === "all" ||
        s.fullClass === assignment.targetClass ||
        s.classGrade === assignment.targetClass ||
        (Boolean(s.fullClass) && normalizeClass(s.fullClass) === normalizeClass(assignment.targetClass));
      const groupMatch = !assignment.targetGroup || assignment.targetGroup === s.group;
      return classMatch && groupMatch;
    });
  }
  if (assignment.targetType === "group" && assignment.targetGroup) {
    return students.filter((s) => s.group === assignment.targetGroup);
  }
  if (assignment.targetType === "students" && assignment.targetStudentIds) {
    return students.filter((s) => assignment.targetStudentIds?.includes(s.id));
  }
  return students;
}

/** Whether a submission was turned in for this assignment (by id, or by task match). */
export function submissionMatchesAssignment(sub: SubmissionItem, assignment: TeacherAssignment): boolean {
  if (sub.assignmentId) return sub.assignmentId === assignment.id;
  if (isFreeChoiceAssignment(assignment) || !assignment.taskId) return false;
  return (
    sub.taskId === assignment.taskId ||
    sub.hebrewTitle === assignment.hebrewTitle ||
    sub.taskTitle.toLowerCase() === assignment.title.toLowerCase()
  );
}

export const submissionBelongsToStudent = (sub: SubmissionItem, student: StudentProfile) =>
  sub.studentId === student.id || normalizeName(sub.studentName) === normalizeName(student.name);

export type RosterStatus = "reviewed" | "pending" | "missing";

export interface AssignmentRosterRow {
  student: StudentProfile;
  submission?: SubmissionItem;
  status: RosterStatus;
}

export interface AssignmentProgress {
  eligible: StudentProfile[];
  submissions: SubmissionItem[];
  roster: AssignmentRosterRow[];
  totalEligible: number;
  turnedIn: number;
  reviewed: number;
  pending: number;
  missing: number;
  percent: number;
  dueTs: number;
  isOverdue: boolean;
}

export function getAssignmentProgress(
  assignment: TeacherAssignment,
  students: StudentProfile[],
  submissions: SubmissionItem[],
  now: number
): AssignmentProgress {
  const eligible = getEligibleStudents(assignment, students);
  const eligibleIds = new Set(eligible.map((s) => s.id));
  const eligibleNames = new Set(eligible.map((s) => normalizeName(s.name)));

  const matched = submissions.filter(
    (sub) =>
      submissionMatchesAssignment(sub, assignment) &&
      (eligibleIds.has(sub.studentId) || eligibleNames.has(normalizeName(sub.studentName)))
  );

  // One row per eligible student, using their most recent turn-in (submissions are sorted newest-first)
  const roster: AssignmentRosterRow[] = eligible.map((student) => {
    const submission = matched.find((sub) => submissionBelongsToStudent(sub, student));
    const status: RosterStatus = !submission ? "missing" : isReviewed(submission) ? "reviewed" : "pending";
    return { student, submission, status };
  });

  const reviewed = roster.filter((r) => r.status === "reviewed").length;
  const pending = roster.filter((r) => r.status === "pending").length;
  const turnedIn = reviewed + pending;
  const totalEligible = eligible.length;
  const dueTs = parseSubmissionTimestamp(assignment.dueDate);
  // Treat the due date as end-of-day
  const isOverdue = dueTs > 0 && now > dueTs + 24 * 3600 * 1000 - 1;

  return {
    eligible,
    submissions: matched,
    roster,
    totalEligible,
    turnedIn,
    reviewed,
    pending,
    missing: totalEligible - turnedIn,
    percent: totalEligible > 0 ? Math.min(100, Math.round((turnedIn / totalEligible) * 100)) : 0,
    dueTs,
    isOverdue,
  };
}

/** Returns the assignment a submission belongs to, if any. */
export function findAssignmentForSubmission(
  sub: SubmissionItem,
  assignments: TeacherAssignment[]
): TeacherAssignment | undefined {
  return assignments.find((a) => submissionMatchesAssignment(sub, a));
}

export interface StudentStats {
  total: number;
  average: number | null;
  submissions: SubmissionItem[];
  pending: number;
  lastActivityTs: number;
}

export function getStudentStats(student: StudentProfile, submissions: SubmissionItem[]): StudentStats {
  const studentSubs = submissions.filter((sub) => submissionBelongsToStudent(sub, student));
  const graded = studentSubs.filter((sub) => getSubmissionGrade(sub) !== undefined);
  const average =
    graded.length > 0
      ? Math.round(graded.reduce((acc, curr) => acc + (getSubmissionGrade(curr) ?? 0), 0) / graded.length)
      : null;
  return {
    total: studentSubs.length,
    average,
    submissions: studentSubs,
    pending: studentSubs.filter(isPending).length,
    lastActivityTs: studentSubs.reduce((max, s) => Math.max(max, parseSubmissionTimestamp(s.submittedAt)), 0),
  };
}
