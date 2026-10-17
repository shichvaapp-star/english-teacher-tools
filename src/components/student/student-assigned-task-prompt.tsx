"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { TeacherAssignment } from "@/types/assignment";
import { SubmissionItem } from "@/types/submission";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  PenTool,
  BookOpen,
  Calendar,
  ArrowLeft,
  X,
  Sparkles,
} from "lucide-react";

const LOCAL_ASSIGNMENTS_KEY = "ett_teacher_assignments";
const LOCAL_SUBMISSIONS_KEY = "ett_writing_submissions";

export function StudentAssignedTaskPrompt() {
  const { user } = useAuth();
  const [pendingAssignments, setPendingAssignments] = useState<TeacherAssignment[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const studentUser = user;
    if (!studentUser || studentUser.role !== "student") {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function checkStudentAssignments(stUser: NonNullable<typeof user>) {
      setIsLoading(true);
      let allAssignments: TeacherAssignment[] = [];
      let studentSubmissions: SubmissionItem[] = [];

      // 1. Read local storage
      try {
        const localRaw = localStorage.getItem(LOCAL_ASSIGNMENTS_KEY);
        if (localRaw) {
          allAssignments = JSON.parse(localRaw);
        }
      } catch {
        allAssignments = [];
      }

      try {
        const localSubs = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
        if (localSubs) {
          studentSubmissions = JSON.parse(localSubs);
        }
      } catch {
        studentSubmissions = [];
      }

      // 2. Read from Firestore
      if (db) {
        try {
          const assignSnap = await getDocs(collection(db, "assignments"));
          const fbAssignments: TeacherAssignment[] = [];
          assignSnap.forEach((docSnap) => {
            fbAssignments.push({
              ...(docSnap.data() as TeacherAssignment),
              id: docSnap.id,
            });
          });

          if (fbAssignments.length > 0) {
            const map = new Map<string, TeacherAssignment>();
            allAssignments.forEach((a) => map.set(a.id, a));
            fbAssignments.forEach((a) => map.set(a.id, a));
            allAssignments = Array.from(map.values());
          }
        } catch (err) {
          console.warn("Firestore assignments fetch notice:", err);
        }

        try {
          const subsSnap = await getDocs(
            query(collection(db, "submissions"), where("studentId", "==", stUser.id))
          );
          subsSnap.forEach((docSnap) => {
            const data = docSnap.data() as SubmissionItem;
            studentSubmissions.push({ ...data, id: docSnap.id });
          });
        } catch {
          // Ignore
        }
      }

      // 3. Filter assignments targeted to this student
      const eligible = allAssignments.filter((assign) => {
        if (assign.status === "archived") return false;

        // Check teacher match
        const teacherMatch =
          !assign.teacherId ||
          assign.teacherId === stUser.teacherId ||
          (stUser.teacherName && assign.teacherName.toLowerCase() === stUser.teacherName.toLowerCase());

        if (!teacherMatch) return false;

        // Check target match
        let isTargeted = false;
        if (assign.targetType === "all") {
          isTargeted = true;
        } else if (assign.targetType === "class") {
          const classMatch =
            !assign.targetClass ||
            assign.targetClass === "all" ||
            assign.targetClass === stUser.fullClass ||
            assign.targetClass === stUser.classGrade ||
            (stUser.fullClass && assign.targetClass &&
              stUser.fullClass.replace(/[׳']/g, "'") === assign.targetClass.replace(/[׳']/g, "'"));

          const groupMatch =
            !assign.targetGroup ||
            assign.targetGroup === stUser.group;

          isTargeted = Boolean(classMatch && groupMatch);
        } else if (assign.targetType === "group") {
          isTargeted = !!stUser.group && assign.targetGroup === stUser.group;
        } else if (assign.targetType === "students") {
          isTargeted = !!assign.targetStudentIds?.includes(stUser.id);
        }

        if (!isTargeted) return false;

        // Check if student has ALREADY submitted this assignment
        const isFreeChoice = assign.isFreeChoice || assign.taskId === "free_choice";
        const alreadySubmitted = studentSubmissions.some((sub) => {
          if (sub.studentId !== stUser.id && sub.studentName.toLowerCase() !== stUser.name.toLowerCase()) {
            return false;
          }
          if (sub.assignmentId && sub.assignmentId === assign.id) return true;
          if (!isFreeChoice && assign.taskId && sub.taskId === assign.taskId) return true;
          return false;
        });

        return !alreadySubmitted;
      });

      if (isMounted) {
        setPendingAssignments(eligible);
        setIsLoading(false);
      }
    }

    checkStudentAssignments(studentUser);

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!user || user.role !== "student" || isLoading || pendingAssignments.length === 0 || isDismissed) {
    return null;
  }

  // Focus on first pending assignment
  const assignment = pendingAssignments[0];
  const isFreeChoice = assignment.isFreeChoice || assignment.taskId === "free_choice";
  const targetUrl =
    assignment.type === "writing"
      ? (isFreeChoice
          ? `/writing?assignmentId=${assignment.id}`
          : `/writing?task=${assignment.taskId || ""}&assignmentId=${assignment.id}`)
      : (isFreeChoice
          ? `/unseen?assignmentId=${assignment.id}`
          : `/unseen?passageId=${assignment.taskId || ""}&assignmentId=${assignment.id}`);

  return (
    <div
      className="p-4 sm:p-5 rounded-2xl border-2 border-purple-500/30 bg-purple-500/10 text-foreground shadow-md animate-in slide-in-from-top duration-300"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left / Content */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-700 dark:text-purple-300 shrink-0 mt-0.5 animate-bounce">
            <Bell className="h-5 w-5" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                🔔 משימה חדשה להגשה מהמורה {assignment.teacherName || "לאנגלית"}!
              </span>

              <Badge variant="secondary" className="text-3xs gap-1 font-semibold">
                {assignment.type === "writing" ? (
                  <>
                    <PenTool className="h-2.5 w-2.5 text-purple-500" />
                    <span>חיבור כתיבה</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="h-2.5 w-2.5 text-sky-500" />
                    <span>אנסין הבנת הנקרא</span>
                  </>
                )}
              </Badge>

              {assignment.targetClass && (
                <Badge variant="outline" className="text-3xs font-bold border-purple-500/40 text-purple-700 dark:text-purple-300">
                  כיתה {assignment.targetClass}
                  {assignment.targetGroup ? ` • הקבצה ${assignment.targetGroup}` : ""}
                </Badge>
              )}
              {!assignment.targetClass && assignment.targetGroup && (
                <Badge variant="outline" className="text-3xs font-bold border-purple-500/40 text-purple-700 dark:text-purple-300">
                  הקבצה {assignment.targetGroup}
                </Badge>
              )}

              {isFreeChoice && (
                <Badge variant="outline" className="text-3xs font-bold border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10 gap-1">
                  <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                  <span>בחירה חופשית</span>
                </Badge>
              )}
            </div>

            <h3 className="font-black text-sm sm:text-base text-foreground">
              {assignment.hebrewTitle} <span className="font-normal text-xs text-muted-foreground" dir="ltr">({assignment.title})</span>
            </h3>

            {assignment.instructions && (
              <p className="text-xs text-foreground/90 font-medium bg-background/60 p-2 rounded-lg border border-border/50 max-w-xl">
                💬 הנחיית המורה: "{assignment.instructions}"
              </p>
            )}

            {assignment.dueDate && (
              <div className="flex items-center gap-1.5 text-2xs text-amber-700 dark:text-amber-300 font-bold pt-0.5">
                <Calendar className="h-3 w-3" />
                <span>יעד להגשה: {assignment.dueDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right / CTA Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 cursor-pointer transition-colors"
          >
            הזכר לי אחר כך
          </button>

          <Link href={targetUrl}>
            <Button
              size="sm"
              className="text-xs font-bold gap-1.5 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white shadow-xs px-4"
            >
              <span>התחל לבצע את המשימה כעת</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
