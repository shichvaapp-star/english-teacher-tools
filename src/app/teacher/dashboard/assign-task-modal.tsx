"use client";

import React, { useState, useMemo } from "react";
import { StudentProfile, StudentGroup } from "@/types/auth";
import { TeacherAssignment, AssignmentTargetType } from "@/types/assignment";
import { ALL_WRITING_TASKS } from "@/data/writing-tasks";
import { MIDDLE_SCHOOL_UNSEENS } from "@/data/unseen-middle-school";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  PenTool,
  BookOpen,
  Users,
  Layers,
  Calendar,
  Check,
  X,
  AlertCircle,
  Sparkles,
  GraduationCap,
  BookA,
} from "lucide-react";

interface AssignTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
  teacherName: string;
  students: StudentProfile[];
  availableClasses: string[];
  onTaskAssigned: (assignment: TeacherAssignment) => void;
  preselectedStudentId?: string | null;
}

export function AssignTaskModal({
  open,
  onOpenChange,
  teacherId,
  teacherName,
  students,
  availableClasses,
  onTaskAssigned,
  preselectedStudentId,
}: AssignTaskModalProps) {
  const [taskType, setTaskType] = useState<"writing" | "unseen">("writing");
  const [selectionMode, setSelectionMode] = useState<"specific" | "adaptive_david" | "free_choice">("specific");
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    ALL_WRITING_TASKS[0]?.id || ""
  );
  const [customTitle, setCustomTitle] = useState("");
  const [targetType, setTargetType] = useState<AssignmentTargetType>("class");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<StudentGroup | "all" | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [focusWordsInput, setFocusWordsInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset or pre-select student on modal open
  React.useEffect(() => {
    if (open) {
      setError(null);
      if (preselectedStudentId) {
        setTargetType("students");
        setSelectedStudentIds([preselectedStudentId]);
        setSelectionMode("adaptive_david");
      } else {
        setSelectedClass("");
        setSelectedGroup(null);
      }
    }
  }, [open, preselectedStudentId]);

  const classList = useMemo(() => {
    if (availableClasses && availableClasses.length > 0) return availableClasses;
    return ["ז׳1", "ז׳2", "ח׳1", "ח׳2", "ט׳1", "ט׳2"];
  }, [availableClasses]);

  const matchingStudentsCount = useMemo(() => {
    if (targetType === "all") return students.length;
    if (targetType === "students") return selectedStudentIds.length;
    if (!selectedClass || !selectedGroup) return 0;
    return students.filter((s) => {
      const classMatch =
        s.fullClass === selectedClass ||
        s.classGrade === selectedClass ||
        (s.fullClass && selectedClass &&
          s.fullClass.replace(/[׳']/g, "'") === selectedClass.replace(/[׳']/g, "'"));

      const groupMatch = selectedGroup === "all" || s.group === selectedGroup;
      return classMatch && groupMatch;
    }).length;
  }, [targetType, students, selectedClass, selectedGroup, selectedStudentIds]);

  // Switch task list based on type
  const handleTypeChange = (type: "writing" | "unseen") => {
    setTaskType(type);
    if (type === "writing") {
      setSelectedTaskId(ALL_WRITING_TASKS[0]?.id || "");
    } else {
      setSelectedTaskId(MIDDLE_SCHOOL_UNSEENS[0]?.id || "");
    }
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isFreeChoice = selectionMode === "free_choice";
    const isAdaptiveDavid = selectionMode === "adaptive_david";

    let title = "";
    let hebrewTitle = "";

    if (isAdaptiveDavid) {
      if (taskType === "writing") {
        title = "Adaptive Writing Mission with David";
        hebrewTitle = "משימת כתיבה מותאמת אישית עם דוד 🎓";
      } else {
        title = "Adaptive Unseen Reading with David";
        hebrewTitle = "משימת קריאה (Unseen) מותאמת אישית עם דוד 🎓";
      }
    } else if (isFreeChoice) {
      if (taskType === "writing") {
        title = "Free Choice Essay";
        hebrewTitle = "חיבור בבחירה חופשית (נושא חופשי)";
      } else {
        title = "Free Choice Reading Comprehension";
        hebrewTitle = "אנסין בבחירה חופשית (קטע חופשי)";
      }
    } else if (taskType === "writing") {
      const matched = ALL_WRITING_TASKS.find((t) => t.id === selectedTaskId);
      title = matched ? matched.title : customTitle.trim() || "Writing Assignment";
      hebrewTitle = matched ? matched.hebrewTitle : customTitle.trim() || "מטלת כתיבה";
    } else {
      const matched = MIDDLE_SCHOOL_UNSEENS.find((s) => s.id === selectedTaskId);
      title = matched ? matched.title : "Unseen Test";
      hebrewTitle = matched ? matched.hebrewTitle : "מבחן אנסין";
    }

    if (targetType === "class") {
      if (!selectedClass) {
        setError("יש לבחור כיתה להקצאת המשימה.");
        return;
      }
      if (!selectedGroup) {
        setError("יש לבחור הקבצה (א1, א2, ב או כולן).");
        return;
      }
    }

    if (targetType === "students" && selectedStudentIds.length === 0) {
      setError("יש לבחור לפחות תלמיד/ה אחד/ת להקצאת המשימה.");
      return;
    }

    const parsedFocusWords = focusWordsInput
      .split(/[,;\n]+/)
      .map((w) => w.trim().replace(/[^a-zA-Z\s-]/g, ""))
      .filter((w) => w.length >= 2)
      .slice(0, 8);

    setIsSubmitting(true);

    const newAssignment: TeacherAssignment = {
      id: `assign-${Date.now()}`,
      teacherId,
      teacherName,
      type: taskType,
      title,
      hebrewTitle,
      taskId: isAdaptiveDavid ? "adaptive_david" : isFreeChoice ? "free_choice" : selectedTaskId,
      isFreeChoice: isFreeChoice || isAdaptiveDavid,
      isAdaptiveDavid,
      focusWords: parsedFocusWords.length > 0 ? parsedFocusWords : undefined,
      coachWithDavid: true,
      targetType,
      targetClass: targetType === "class" ? selectedClass : undefined,
      targetGroup: targetType === "class" && selectedGroup !== "all" ? (selectedGroup as StudentGroup) : undefined,
      targetStudentIds: targetType === "students" ? selectedStudentIds : undefined,
      instructions: instructions.trim(),
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    try {
      onTaskAssigned(newAssignment);
      onOpenChange(false);
      // Reset form
      setInstructions("");
      setFocusWordsInput("");
      setDueDate("");
      setSelectedStudentIds([]);
      setSelectionMode("specific");
      setSelectedClass("");
      setSelectedGroup(null);
    } catch (err) {
      console.error("Error creating assignment:", err);
      setError("שגיאה ביצירת המשימה. אנא נסו שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-black text-foreground">
                הקצאת משימה לתלמידים (בליווי דוד המורה הפרטי 🎓)
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                דוד יציג לתלמידים את המשימה, יערוך להם הכנה מוקדמת ומבדק אוצר מילים בסיום, ויעדכן את הציונים בלוח המורה.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs pt-2">
          {error && (
            <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Task Type Switcher */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground block">סוג המשימה:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange("writing")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  taskType === "writing"
                    ? "border-primary bg-primary/10 text-primary shadow-2xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <PenTool className="h-4 w-4 text-purple-500" />
                <span>✍️ מטלת כתיבה (Essay)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange("unseen")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  taskType === "unseen"
                    ? "border-primary bg-primary/10 text-primary shadow-2xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <BookOpen className="h-4 w-4 text-sky-500" />
                <span>📖 מבחן הבנת הנקרא (Unseen)</span>
              </button>
            </div>
          </div>

          {/* 2. Topic Selection Mode (Library vs Adaptive David vs Free Choice) */}
          <div className="space-y-2">
            <label className="font-bold text-foreground block">בחירת נושא / אופן התאמת המשימה:</label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectionMode("specific")}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  selectionMode === "specific"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                    : "border-border text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Layers className="h-3.5 w-3.5 shrink-0" />
                  <span>משימה ספציפית</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {taskType === "writing" ? "בחירת נושא קבוע מהמאגר" : "בחירת קטע אנסין מוגדר"}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectionMode("adaptive_david")}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  selectionMode === "adaptive_david"
                    ? "border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-bold shadow-2xs ring-1 ring-indigo-500/40"
                    : "border-border text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span>מותאם רמה ע״י דוד</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  דוד מתאים לכל תלמיד לפי רמתו האישית (Level 1-3)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectionMode("free_choice")}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  selectionMode === "free_choice"
                    ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold shadow-2xs"
                    : "border-border text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                  <span>בחירה חופשית</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  התלמיד בוחר נושא בעצמו או יוצר ב-AI
                </p>
              </button>
            </div>

            {/* Dropdown if specific topic, or info callout if adaptive / free choice */}
            {selectionMode === "specific" ? (
              <div className="space-y-1 pt-1">
                <label className="text-[11px] text-muted-foreground block">
                  {taskType === "writing" ? "בחירת נושא החיבור מתוך המאגר:" : "בחירת קטע קריאה (Unseen):"}
                </label>
                {taskType === "writing" ? (
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  >
                    {ALL_WRITING_TASKS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.hebrewTitle} — {t.title} ({t.level})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  >
                    <optgroup label="רמה 1 - קוראים מתחילים (20 קטעים)">
                      {MIDDLE_SCHOOL_UNSEENS.filter((s) => s.level === "Level 1").map((s, idx) => (
                        <option key={s.id} value={s.id}>
                          #{idx + 1} {s.hebrewTitle} — {s.title}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="רמה 2 - קוראים מתקדמים (20 קטעים)">
                      {MIDDLE_SCHOOL_UNSEENS.filter((s) => s.level === "Level 2").map((s, idx) => (
                        <option key={s.id} value={s.id}>
                          #{idx + 1} {s.hebrewTitle} — {s.title}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="רמה 3 - קוראים מיומנים (20 קטעים)">
                      {MIDDLE_SCHOOL_UNSEENS.filter((s) => s.level === "Level 3").map((s, idx) => (
                        <option key={s.id} value={s.id}>
                          #{idx + 1} {s.hebrewTitle} — {s.title}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                )}
              </div>
            ) : selectionMode === "adaptive_david" ? (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-2.5 text-xs text-indigo-950 dark:text-indigo-200">
                <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">
                    דוד יתאים לכל תלמיד/ה {taskType === "writing" ? "משימת כתיבה" : "קטע קריאה (Unseen)"} בדיוק לפי רמתו/ה!
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    מתאים במיוחד לכיתות הטרוגניות: כל תלמיד יקבל מדוד משימה ברמה האישית שלו (Level 1, Level 2 או Level 3), יבחר נושא שמעניין אותו, יעבור מבדק אוצר מילים בסיום, והציון יופיע אוטומטית בלוח המורה.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-2.5 text-xs text-purple-900 dark:text-purple-200">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">
                    {taskType === "writing"
                      ? "התלמידים יבחרו בעצמם על מה לכתוב"
                      : "התלמידים יבחרו בעצמם איזה קטע אנסין לקרוא"}
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {taskType === "writing"
                      ? "התלמידים יוכלו לבחור כל נושא מתוך המאגר, לכתוב נושא חופשי או להיעזר במחולל ה-AI. המערכת תשייך את ההגשה אוטומטית למשימה זו."
                      : "התלמידים יוכלו לבחור כל קטע קריאה ברמתם או לחולל קטע חדש ב-AI. המערכת תשייך את ההגשה אוטומטית למשימה זו."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 3. Target Audience: Compact Single Row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-foreground block">קהל יעד להקצאת המשימה:</label>
              {matchingStudentsCount > 0 && (
                <span className="text-[11px] text-muted-foreground font-medium">
                  {matchingStudentsCount} תלמידים יקבלו את המשימה
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/60">
              <button
                type="button"
                onClick={() => setTargetType("class")}
                className={`h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  targetType === "class"
                    ? "bg-background text-primary shadow-xs border border-border/60 font-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="h-3.5 w-3.5 shrink-0" />
                <span>כיתה והקבצה</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType("all")}
                className={`h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  targetType === "all"
                    ? "bg-background text-primary shadow-xs border border-border/60 font-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>כל התלמידים</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType("students")}
                className={`h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  targetType === "students"
                    ? "bg-background text-primary shadow-xs border border-border/60 font-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>תלמידים בודדים</span>
              </button>
            </div>

            {/* Target Options Details: Class AND Grouping */}
            {targetType === "class" && (
              <div className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* 1. Select Class */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">
                      1. בחירת כיתה:
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className={`w-full h-8 rounded-lg border bg-background px-2.5 text-xs cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                        !selectedClass ? "text-muted-foreground" : "text-foreground font-bold"
                      }`}
                    >
                      <option value="" disabled>-- בחרו כיתה --</option>
                      {classList.map((cls) => (
                        <option key={cls} value={cls}>
                          כיתה {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Select Grouping */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">
                      2. בחירת הקבצה באנגלית:
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {(["א1", "א2", "ב"] as StudentGroup[]).map((grp) => (
                        <button
                          key={grp}
                          type="button"
                          onClick={() => setSelectedGroup(grp)}
                          className={`h-8 rounded-lg border text-center font-black text-xs cursor-pointer transition-all ${
                            selectedGroup === grp
                              ? "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300 shadow-2xs ring-1 ring-purple-500"
                              : "border-border hover:bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          {grp}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSelectedGroup("all")}
                        className={`h-8 rounded-lg border text-center font-bold text-[10px] cursor-pointer transition-all ${
                          selectedGroup === "all"
                            ? "border-primary bg-primary/10 text-primary shadow-2xs ring-1 ring-primary"
                            : "border-border hover:bg-muted/40 text-muted-foreground"
                        }`}
                        title="כל ההקבצות בכיתה זו"
                      >
                        כולן
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Match Summary Banner */}
                <div className="p-2 rounded-lg bg-background border border-border/80 flex items-center justify-between text-xs">
                  {selectedClass && selectedGroup ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-foreground font-semibold">
                          יוקצה ל: <strong className="text-primary font-black">כיתה {selectedClass}</strong>
                          {selectedGroup !== "all" ? (
                            <> • <strong className="text-purple-600 dark:text-purple-400 font-black">הקבצה {selectedGroup}</strong></>
                          ) : (
                            " • כל ההקבצות"
                          )}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-bold">
                        {matchingStudentsCount} תלמידים רשומים
                      </Badge>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>נא לבחור כיתה והקבצה</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {targetType === "students" && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>סמנו את התלמידים שברצונכם להקצות להם:</span>
                  <span>{selectedStudentIds.length} נבחרו</span>
                </div>
                <div className="max-h-36 overflow-y-auto border border-border/80 rounded-xl p-2 space-y-1 bg-muted/20">
                  {students.map((st) => {
                    const isChecked = selectedStudentIds.includes(st.id);
                    return (
                      <label
                        key={st.id}
                        className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
                          isChecked ? "bg-primary/10 text-foreground font-bold" : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleStudentToggle(st.id)}
                            className="rounded accent-primary"
                          />
                          <span dir="ltr">{st.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px]">{st.fullClass}</span>
                          {st.group && (
                            <Badge variant="outline" className="text-[9px] py-0 px-1">
                              {st.group}
                            </Badge>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. Teacher Focus Words for David's Vocabulary Quiz */}
          <div className="space-y-1">
            <label className="font-bold text-foreground flex items-center gap-1.5">
              <BookA className="h-3.5 w-3.5 text-indigo-500" />
              <span>מילות מפתח באנגלית לתרגול ומבדק עם דוד (אופציונלי):</span>
            </label>
            <Input
              placeholder="e.g., environment, pollute, recycle, solution, protect"
              value={focusWordsInput}
              onChange={(e) => setFocusWordsInput(e.target.value)}
              className="h-8 text-xs font-sans text-left"
              dir="ltr"
            />
            <span className="text-[10px] text-muted-foreground block">
              דוד ילמד את התלמידים את המילים האלו לפני המשימה ויבחן אותם עליהן בסיום (מילים שלא ידעו יישמרו אוטומטית במילון האישי שלהם).
            </span>
          </div>

          {/* 5. Teacher Custom Instructions */}
          <div className="space-y-1">
            <label className="font-bold text-foreground block">
              הנחיות ודגשים מהמורה לתלמידים ולדוד (אופציונלי):
            </label>
            <Textarea
              placeholder="למשל: נא לכתוב לפחות 60 מילים, להקפיד על שימוש באותיות גדולות (Capital Letters) ובמילות קישור שלמדנו השבוע."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="text-xs min-h-[70px] resize-none"
            />
          </div>

          {/* 6. Due Date */}
          <div className="space-y-1">
            <label className="font-bold text-foreground block">יעד להגשה (Due Date - אופציונלי):</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-8 text-xs cursor-pointer"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              ביטול
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs font-bold gap-1.5 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "מקצה משימה..." : "הקצה משימה עכשיו"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
