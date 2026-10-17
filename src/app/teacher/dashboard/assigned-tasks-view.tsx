"use client";

import React from "react";
import { TeacherAssignment } from "@/types/assignment";
import { SubmissionItem } from "@/types/submission";
import { StudentProfile } from "@/types/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Send,
  PenTool,
  BookOpen,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  Trash2,
  Plus,
  Sparkles,
  GraduationCap,
} from "lucide-react";

interface AssignedTasksViewProps {
  assignments: TeacherAssignment[];
  submissions: SubmissionItem[];
  students: StudentProfile[];
  onArchiveAssignment: (id: string) => Promise<void>;
  onOpenAssignModal: () => void;
  onToggleDavid?: (id: string, enabled: boolean) => void;
}

export function AssignedTasksView({
  assignments,
  submissions,
  students,
  onArchiveAssignment,
  onOpenAssignModal,
  onToggleDavid,
}: AssignedTasksViewProps) {
  // Helper to compute turn-in count for an assignment
  const getAssignmentStats = (assignment: TeacherAssignment) => {
    // Eligible students count
    let eligibleStudents = students;
    if (assignment.targetType === "class") {
      eligibleStudents = students.filter((s) => {
        const classMatch =
          !assignment.targetClass ||
          assignment.targetClass === "all" ||
          s.fullClass === assignment.targetClass ||
          s.classGrade === assignment.targetClass ||
          (s.fullClass && assignment.targetClass &&
            s.fullClass.replace(/[׳']/g, "'") === assignment.targetClass.replace(/[׳']/g, "'"));

        const groupMatch =
          !assignment.targetGroup ||
          assignment.targetGroup === s.group;

        return classMatch && groupMatch;
      });
    } else if (assignment.targetType === "group" && assignment.targetGroup) {
      eligibleStudents = students.filter((s) => s.group === assignment.targetGroup);
    } else if (assignment.targetType === "students" && assignment.targetStudentIds) {
      eligibleStudents = students.filter((s) => assignment.targetStudentIds?.includes(s.id));
    }

    const eligibleIds = new Set(eligibleStudents.map((s) => s.id));
    const eligibleNames = new Set(eligibleStudents.map((s) => s.name.trim().toLowerCase()));

    // Turn ins that match this task/assignment
    const isFreeChoice = assignment.isFreeChoice || assignment.taskId === "free_choice";
    const turnedInCount = submissions.filter((sub) => {
      const matchAssignment = sub.assignmentId === assignment.id;
      const matchTask =
        !isFreeChoice &&
        assignment.taskId &&
        (sub.taskId === assignment.taskId ||
          sub.hebrewTitle === assignment.hebrewTitle ||
          sub.taskTitle.toLowerCase() === assignment.title.toLowerCase());

      const studentMatches =
        eligibleIds.has(sub.studentId) ||
        eligibleNames.has(sub.studentName.trim().toLowerCase());

      return (matchAssignment || matchTask) && studentMatches;
    }).length;

    const totalEligible = Math.max(eligibleStudents.length, 1);
    const progressPercent = Math.min(100, Math.round((turnedInCount / totalEligible) * 100));

    return {
      turnedInCount,
      totalEligible: eligibleStudents.length,
      progressPercent,
    };
  };

  if (assignments.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 rounded-2xl border border-dashed border-border/80 bg-muted/20" dir="rtl">
        <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-14 h-14 mx-auto flex items-center justify-center">
          <Send className="h-7 w-7" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="font-bold text-base text-foreground">
            טרם הוקצו משימות פעילות
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            תוכל/י להקצות חיבור כתיבה או מבחן הבנת הנקרא לכיתה, להקבצה (א1, א2, ב) או לתלמידים בודדים. התלמידים יקבלו התראה ישירה בכניסתם לאתר.
          </p>
        </div>
        <Button
          onClick={onOpenAssignModal}
          className="gap-2 text-xs font-bold cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          <span>הקצה משימה ראשונה</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-semibold">
          סה״כ {assignments.length} משימות שהוקצו לתלמידים:
        </span>
        <Button
          size="sm"
          onClick={onOpenAssignModal}
          className="h-8 text-xs font-bold gap-1.5 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>הקצה משימה נוספת</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {assignments.map((assignment) => {
          const stats = getAssignmentStats(assignment);
          const isDavidEnabled = Boolean(assignment.coachWithDavid || assignment.isAdaptiveDavid);
          return (
            <div
              key={assignment.id}
              className="p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                {/* Header: Type and Target */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="secondary" className="text-[10px] gap-1 font-medium">
                      {assignment.type === "writing" ? (
                        <>
                          <PenTool className="h-2.5 w-2.5 text-purple-500" />
                          <span>כתיבה</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-2.5 w-2.5 text-sky-500" />
                          <span>אנסין</span>
                        </>
                      )}
                    </Badge>

                    {assignment.targetType === "class" && assignment.targetClass && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold border-purple-500/40 text-purple-700 dark:text-purple-300 bg-purple-500/10"
                      >
                        כיתה {assignment.targetClass}
                        {assignment.targetGroup ? ` • הקבצה ${assignment.targetGroup}` : " • כל ההקבצות"}
                      </Badge>
                    )}

                    {assignment.targetType === "group" && assignment.targetGroup && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold border-purple-500/40 text-purple-700 dark:text-purple-300 bg-purple-500/10"
                      >
                        הקבצה {assignment.targetGroup}
                      </Badge>
                    )}

                    {assignment.targetType === "all" && (
                      <Badge variant="outline" className="text-[10px] font-bold">
                        כל הכיתות
                      </Badge>
                    )}

                    {assignment.targetType === "students" && (
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {assignment.targetStudentIds?.length || 0} תלמידים
                      </Badge>
                    )}

                    {(assignment.isFreeChoice || assignment.taskId === "free_choice") && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10 gap-1"
                      >
                        <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                        <span>בחירה חופשית</span>
                      </Badge>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onArchiveAssignment(assignment.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer rounded-md"
                    title="מחק / ארכב משימה"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Title */}
                <div>
                  <h4 className="font-black text-sm text-foreground">
                    {assignment.hebrewTitle}
                  </h4>
                  <p className="text-[11px] text-muted-foreground truncate" dir="ltr">
                    {assignment.title}
                  </p>
                </div>

                {/* Teacher Instructions */}
                {assignment.instructions && (
                  <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/30 p-2 rounded-lg border border-border/50">
                    💬 "{assignment.instructions}"
                  </p>
                )}

                {/* Due Date */}
                {assignment.dueDate && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
                    <Calendar className="h-3 w-3" />
                    <span>יעד להגשה: {assignment.dueDate}</span>
                  </div>
                )}

                {/* David Tutor Toggle Row */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-medium">
                    <GraduationCap className={`h-3.5 w-3.5 ${isDavidEnabled ? "text-indigo-500" : "text-muted-foreground"}`} />
                    <span>ליווי עם דוד (מורה פרטי):</span>
                  </span>
                  {onToggleDavid ? (
                    <button
                      type="button"
                      onClick={() => onToggleDavid(assignment.id, !isDavidEnabled)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                        isDavidEnabled
                          ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300"
                          : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                      }`}
                      title="לחץ להפעלה או כיבוי של ליווי דוד למשימה זו"
                    >
                      {isDavidEnabled ? "פעיל ✓" : "כבוי"}
                    </button>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      {isDavidEnabled ? "פעיל" : "כבוי"}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Progress Bar & Ratio */}
              <div className="pt-2 border-t border-border/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">התקדמות הגשות:</span>
                  <strong className="text-foreground">
                    {stats.turnedInCount} / {stats.totalEligible} הגישו ({stats.progressPercent}%)
                  </strong>
                </div>

                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      stats.progressPercent >= 100
                        ? "bg-emerald-500"
                        : stats.progressPercent > 50
                        ? "bg-primary"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${stats.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
