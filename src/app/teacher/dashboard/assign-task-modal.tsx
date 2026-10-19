"use client";

import React, { useState, useMemo } from "react";
import { StudentProfile, StudentGroup } from "@/types/auth";
import { TeacherAssignment, AssignmentTargetType, ExerciseLevel } from "@/types/assignment";
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
  Search,
  Filter,
  User,
  CheckSquare,
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
  const [selectedLevel, setSelectedLevel] = useState<"all" | ExerciseLevel>("all");
  const [coachWithDavid, setCoachWithDavid] = useState<boolean>(false);
  const [selectionMode, setSelectionMode] = useState<"specific" | "adaptive_david" | "free_choice">("specific");
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    ALL_WRITING_TASKS[0]?.id || ""
  );
  const [customTitle, setCustomTitle] = useState("");
  const [targetType, setTargetType] = useState<AssignmentTargetType>("class");
  const [classTargetScope, setClassTargetScope] = useState<"all" | "custom">("all");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<StudentGroup | "all" | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentFilterClass, setStudentFilterClass] = useState<string>("all");
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>("");
  const [instructions, setInstructions] = useState("");
  const [focusWordsInput, setFocusWordsInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset or pre-select student on modal open (keep David off by default!)
  React.useEffect(() => {
    if (open) {
      setError(null);
      setCoachWithDavid(false);
      setSelectionMode("specific");
      setSelectedLevel("all");
      setClassTargetScope("all");
      setStudentSearchQuery("");
      if (preselectedStudentId) {
        setTargetType("students");
        setSelectedStudentIds([preselectedStudentId]);
        const found = students.find((s) => s.id === preselectedStudentId);
        if (found?.fullClass) {
          setStudentFilterClass(found.fullClass);
        } else {
          setStudentFilterClass("all");
        }
      } else {
        setStudentFilterClass("all");
        setSelectedClass("");
        setSelectedGroup(null);
        setSelectedStudentIds([]);
      }
    }
  }, [open, preselectedStudentId, students]);

  const handleToggleDavid = (enabled: boolean) => {
    setCoachWithDavid(enabled);
    if (!enabled && selectionMode === "adaptive_david") {
      setSelectionMode("specific");
    }
  };

  const classList = useMemo(() => {
    if (availableClasses && availableClasses.length > 0) return availableClasses;
    return ["ז׳1", "ז׳2", "ח׳1", "ח׳2", "ט׳1", "ט׳2"];
  }, [availableClasses]);

  // Tasks filtered by level
  const availableWritingTasks = useMemo(() => {
    if (selectedLevel === "all") return ALL_WRITING_TASKS;
    return ALL_WRITING_TASKS.filter((t) => t.level === selectedLevel);
  }, [selectedLevel]);

  const availableUnseens = useMemo(() => {
    if (selectedLevel === "all") return MIDDLE_SCHOOL_UNSEENS;
    return MIDDLE_SCHOOL_UNSEENS.filter((s) => s.level === selectedLevel);
  }, [selectedLevel]);

  // When changing level, ensure selectedTaskId points to a valid task in that level
  const handleLevelChange = (lvl: "all" | ExerciseLevel) => {
    setSelectedLevel(lvl);
    if (taskType === "writing") {
      const pool = lvl === "all" ? ALL_WRITING_TASKS : ALL_WRITING_TASKS.filter((t) => t.level === lvl);
      if (!pool.some((t) => t.id === selectedTaskId)) {
        setSelectedTaskId(pool[0]?.id || "");
      }
    } else {
      const pool = lvl === "all" ? MIDDLE_SCHOOL_UNSEENS : MIDDLE_SCHOOL_UNSEENS.filter((s) => s.level === lvl);
      if (!pool.some((s) => s.id === selectedTaskId)) {
        setSelectedTaskId(pool[0]?.id || "");
      }
    }
  };

  // Switch task list based on type
  const handleTypeChange = (type: "writing" | "unseen") => {
    setTaskType(type);
    if (type === "writing") {
      const pool = selectedLevel === "all" ? ALL_WRITING_TASKS : ALL_WRITING_TASKS.filter((t) => t.level === selectedLevel);
      setSelectedTaskId(pool[0]?.id || ALL_WRITING_TASKS[0]?.id || "");
    } else {
      const pool = selectedLevel === "all" ? MIDDLE_SCHOOL_UNSEENS : MIDDLE_SCHOOL_UNSEENS.filter((s) => s.level === selectedLevel);
      setSelectedTaskId(pool[0]?.id || MIDDLE_SCHOOL_UNSEENS[0]?.id || "");
    }
  };

  // Students belonging to currently selected class & group
  const classStudentsList = useMemo(() => {
    if (!selectedClass) return [];
    return students.filter((s) => {
      const classMatch =
        s.fullClass === selectedClass ||
        s.classGrade === selectedClass ||
        (s.fullClass && selectedClass &&
          s.fullClass.replace(/[׳']/g, "'") === selectedClass.replace(/[׳']/g, "'"));

      const groupMatch = !selectedGroup || selectedGroup === "all" || s.group === selectedGroup;
      return classMatch && groupMatch;
    });
  }, [students, selectedClass, selectedGroup]);

  // Students filtered for individual selection tab
  const filteredIndividualStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesClass =
        studentFilterClass === "all" ||
        s.fullClass === studentFilterClass ||
        s.classGrade === studentFilterClass ||
        (s.fullClass && studentFilterClass &&
          s.fullClass.replace(/[׳']/g, "'") === studentFilterClass.replace(/[׳']/g, "'"));

      const q = studentSearchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.fullClass && s.fullClass.toLowerCase().includes(q)) ||
        (s.group && s.group.toLowerCase().includes(q));

      return matchesClass && matchesSearch;
    });
  }, [students, studentFilterClass, studentSearchQuery]);

  const matchingStudentsCount = useMemo(() => {
    if (targetType === "all") return students.length;
    if (targetType === "students") return selectedStudentIds.length;
    if (targetType === "class") {
      if (classTargetScope === "custom") return selectedStudentIds.length;
      if (!selectedClass || !selectedGroup) return 0;
      return classStudentsList.length;
    }
    return 0;
  }, [targetType, students.length, selectedStudentIds.length, classTargetScope, selectedClass, selectedGroup, classStudentsList.length]);

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllFilteredStudents = (list: StudentProfile[]) => {
    const ids = list.map((s) => s.id);
    setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const handleDeselectAllFilteredStudents = (list: StudentProfile[]) => {
    const idSet = new Set(list.map((s) => s.id));
    setSelectedStudentIds((prev) => prev.filter((id) => !idSet.has(id)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isFreeChoice = selectionMode === "free_choice";
    const isAdaptiveDavid = coachWithDavid && selectionMode === "adaptive_david";

    let title = "";
    let hebrewTitle = "";

    const levelSuffixHebrew =
      selectedLevel === "Level 1"
        ? " (רמה 1)"
        : selectedLevel === "Level 2"
        ? " (רמה 2)"
        : selectedLevel === "Level 3"
        ? " (רמה 3)"
        : "";

    const levelSuffixEnglish = selectedLevel !== "all" ? ` (${selectedLevel})` : "";

    if (isAdaptiveDavid) {
      if (taskType === "writing") {
        title = `Adaptive Writing Mission with David${levelSuffixEnglish}`;
        hebrewTitle = `משימת כתיבה מותאמת אישית עם דוד 🎓${levelSuffixHebrew}`;
      } else {
        title = `Adaptive Unseen Reading with David${levelSuffixEnglish}`;
        hebrewTitle = `משימת קריאה (Unseen) מותאמת אישית עם דוד 🎓${levelSuffixHebrew}`;
      }
    } else if (isFreeChoice) {
      if (taskType === "writing") {
        title = `Free Choice Essay${levelSuffixEnglish}`;
        hebrewTitle = `חיבור בבחירה חופשית${levelSuffixHebrew}`;
      } else {
        title = `Free Choice Reading Comprehension${levelSuffixEnglish}`;
        hebrewTitle = `אנסין בבחירה חופשית${levelSuffixHebrew}`;
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
      if (classTargetScope === "custom" && selectedStudentIds.length === 0) {
        setError("יש לבחור לפחות תלמיד/ה אחד/ת מהכיתה להקצאת המשימה.");
        return;
      }
    }

    if (targetType === "students" && selectedStudentIds.length === 0) {
      setError("יש לבחור לפחות תלמיד/ה אחד/ת להקצאת המשימה.");
      return;
    }

    const parsedFocusWords = coachWithDavid
      ? focusWordsInput
          .split(/[,;\n]+/)
          .map((w) => w.trim().replace(/[^a-zA-Z\s-]/g, ""))
          .filter((w) => w.length >= 2)
          .slice(0, 8)
      : [];

    setIsSubmitting(true);

    const finalTargetType: AssignmentTargetType =
      targetType === "class" && classTargetScope === "custom" ? "students" : targetType;

    const finalLevel = selectedLevel !== "all" ? selectedLevel : undefined;

    const newAssignment: TeacherAssignment = {
      id: `assign-${Date.now()}`,
      teacherId,
      teacherName,
      type: taskType,
      title,
      hebrewTitle,
      taskId: isAdaptiveDavid ? "adaptive_david" : isFreeChoice ? "free_choice" : selectedTaskId,
      level: finalLevel,
      isFreeChoice: isFreeChoice || isAdaptiveDavid,
      isAdaptiveDavid,
      focusWords: parsedFocusWords.length > 0 ? parsedFocusWords : undefined,
      coachWithDavid,
      targetType: finalTargetType,
      targetClass: targetType === "class" ? selectedClass : undefined,
      targetGroup: targetType === "class" && selectedGroup !== "all" ? (selectedGroup as StudentGroup) : undefined,
      targetStudentIds: finalTargetType === "students" ? selectedStudentIds : undefined,
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
      setCoachWithDavid(false);
      setSelectionMode("specific");
      setSelectedLevel("all");
      setClassTargetScope("all");
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
              <Send className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-black text-foreground">
                הקצאת משימה לתלמידים
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                הקצו מטלת כתיבה או מבחן הבנת הנקרא לכיתה, להקבצה או לתלמידים בודדים.
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

          {/* 2. Optional Toggle: Use David AI Tutor (OFF by default) */}
          <div
            className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
              coachWithDavid
                ? "border-indigo-500/60 bg-indigo-500/10"
                : "border-border/80 bg-muted/20"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  coachWithDavid
                    ? "bg-indigo-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground">
                    שילוב ליווי של דוד (המורה הפרטי הווירטואלי)
                  </span>
                  <Badge
                    variant={coachWithDavid ? "default" : "secondary"}
                    className={`text-[10px] py-0 px-1.5 ${
                      coachWithDavid ? "bg-indigo-600 text-white" : "text-muted-foreground"
                    }`}
                  >
                    {coachWithDavid ? "פעיל" : "כבוי (ברירת מחדל)"}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  כשמופעל, דוד יציג לתלמיד את המשימה, יערוך הכנה מוקדמת ומבדק אוצר מילים בסיום.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={coachWithDavid}
              onClick={() => handleToggleDavid(!coachWithDavid)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                coachWithDavid ? "bg-indigo-600" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  coachWithDavid ? "-translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 3. Exercise Level Selector */}
          <div className="space-y-1.5 p-3 rounded-xl border border-border/80 bg-muted/20">
            <div className="flex items-center justify-between">
              <label className="font-bold text-foreground block">רמת התרגיל (Level):</label>
              {selectedLevel !== "all" && (
                <Badge variant="secondary" className="text-[10px] font-bold">
                  {selectedLevel === "Level 1"
                    ? "רמה 1 • מתחילים"
                    : selectedLevel === "Level 2"
                    ? "רמה 2 • מתקדמים"
                    : "רמה 3 • מיומנים"}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              {[
                { id: "all", label: "כל הרמות", sub: "הכל", icon: "🌐" },
                { id: "Level 1", label: "רמה 1", sub: "מתחילים", icon: "🟢" },
                { id: "Level 2", label: "רמה 2", sub: "מתקדמים", icon: "🔵" },
                { id: "Level 3", label: "רמה 3", sub: "מיומנים", icon: "🟣" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => handleLevelChange(lvl.id as "all" | ExerciseLevel)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    selectedLevel === lvl.id
                      ? "border-primary bg-primary/10 text-primary font-black shadow-2xs ring-1 ring-primary"
                      : "border-border text-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  <span className="text-xs font-bold">{lvl.icon} {lvl.label}</span>
                  <span className="text-[9px] text-muted-foreground">{lvl.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Topic Selection Mode */}
          <div className="space-y-2">
            <label className="font-bold text-foreground block">בחירת נושא המשימה:</label>

            <div className={`grid grid-cols-1 ${coachWithDavid ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-2`}>
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
                  <span>משימה ספציפית מהמאגר</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {taskType === "writing" ? "בחירת נושא קבוע מהמאגר" : "בחירת קטע אנסין מוגדר"}
                </p>
              </button>

              {coachWithDavid && (
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
                    {selectedLevel !== "all"
                      ? `דוד יתמקד ברמה ${selectedLevel}`
                      : "דוד מתאים לכל תלמיד לפי רמתו (Level 1-3)"}
                  </p>
                </button>
              )}

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
                  <span>בחירה חופשית של התלמיד</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {selectedLevel !== "all"
                    ? `התלמיד בוחר נושא ברמה ${selectedLevel}`
                    : "התלמיד בוחר נושא בעצמו או יוצר ב-AI"}
                </p>
              </button>
            </div>

            {/* Dropdown if specific topic, or info callout if adaptive / free choice */}
            {selectionMode === "specific" ? (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <label className="block">
                    {taskType === "writing" ? "בחירת נושא החיבור מתוך המאגר:" : "בחירת קטע קריאה (Unseen):"}
                  </label>
                  <span>
                    ({taskType === "writing" ? availableWritingTasks.length : availableUnseens.length} זמינים)
                  </span>
                </div>
                {taskType === "writing" ? (
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  >
                    {availableWritingTasks.map((t) => (
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
                    {selectedLevel === "all" ? (
                      <>
                        <optgroup label="רמה 1 - קוראים מתחילים (20 קטעים)">
                          {availableUnseens.filter((s) => s.level === "Level 1").map((s, idx) => (
                            <option key={s.id} value={s.id}>
                              #{idx + 1} {s.hebrewTitle} — {s.title}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="רמה 2 - קוראים מתקדמים (20 קטעים)">
                          {availableUnseens.filter((s) => s.level === "Level 2").map((s, idx) => (
                            <option key={s.id} value={s.id}>
                              #{idx + 1} {s.hebrewTitle} — {s.title}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="רמה 3 - קוראים מיומנים (20 קטעים)">
                          {availableUnseens.filter((s) => s.level === "Level 3").map((s, idx) => (
                            <option key={s.id} value={s.id}>
                              #{idx + 1} {s.hebrewTitle} — {s.title}
                            </option>
                          ))}
                        </optgroup>
                      </>
                    ) : (
                      availableUnseens.map((s, idx) => (
                        <option key={s.id} value={s.id}>
                          #{idx + 1} {s.hebrewTitle} — {s.title}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </div>
            ) : selectionMode === "adaptive_david" && coachWithDavid ? (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-2.5 text-xs text-indigo-950 dark:text-indigo-200">
                <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">
                    דוד יתאים לכל תלמיד/ה {taskType === "writing" ? "משימת כתיבה" : "קטע קריאה (Unseen)"}
                    {selectedLevel !== "all" ? ` ברמה ${selectedLevel}!` : " בדיוק לפי רמתו/ה!"}
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    מתאים במיוחד לכיתות הטרוגניות: התלמיד יקבל מדוד משימה
                    {selectedLevel !== "all" ? ` ברמה ${selectedLevel}` : " ברמתו האישית"},
                    יבחר נושא שמעניין אותו, יעבור מבדק אוצר מילים בסיום, והציון יופיע אוטומטית בלוח המורה.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-2.5 text-xs text-purple-900 dark:text-purple-200">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">
                    {taskType === "writing"
                      ? `התלמידים יבחרו בעצמם על מה לכתוב${selectedLevel !== "all" ? ` (רמה ${selectedLevel})` : ""}`
                      : `התלמידים יבחרו בעצמם איזה קטע אנסין לקרוא${selectedLevel !== "all" ? ` (רמה ${selectedLevel})` : ""}`}
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {taskType === "writing"
                      ? `התלמידים יוכלו לבחור כל נושא מתוך המאגר${selectedLevel !== "all" ? ` ברמה ${selectedLevel}` : ""}, לכתוב נושא חופשי או להיעזר ב-AI. המערכת תשייך את ההגשה למשימה זו.`
                      : `התלמידים יוכלו לבחור קטע קריאה${selectedLevel !== "all" ? ` ברמה ${selectedLevel}` : ""} או לחולל קטע חדש ב-AI. המערכת תשייך את ההגשה למשימה זו.`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 5. Target Audience: Class vs All vs Individual Students */}
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
                onClick={() => setTargetType("students")}
                className={`h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  targetType === "students"
                    ? "bg-background text-primary shadow-xs border border-border/60 font-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="h-3.5 w-3.5 shrink-0" />
                <span>תלמידים בודדים</span>
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

                {/* Sub-toggle: All students in class vs Specific students in class */}
                {selectedClass && selectedGroup && (
                  <div className="pt-1 border-t border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-foreground">היקף ההקצאה בכיתה:</span>
                      <div className="flex items-center gap-1 bg-background p-0.5 rounded-lg border border-border/80">
                        <button
                          type="button"
                          onClick={() => {
                            setClassTargetScope("all");
                            setSelectedStudentIds([]);
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                            classTargetScope === "all"
                              ? "bg-primary text-primary-foreground shadow-2xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          כל תלמידי הכיתה
                        </button>
                        <button
                          type="button"
                          onClick={() => setClassTargetScope("custom")}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                            classTargetScope === "custom"
                              ? "bg-primary text-primary-foreground shadow-2xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          תלמידים ספציפיים בלבד
                        </button>
                      </div>
                    </div>

                    {classTargetScope === "custom" && (
                      <div className="space-y-1.5 p-2 rounded-xl bg-background border border-border/70">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">
                            סמנו את התלמידים מתוך כיתה {selectedClass}:
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSelectAllFilteredStudents(classStudentsList)}
                              className="text-[10px] text-primary hover:underline font-bold"
                            >
                              בחר הכל ({classStudentsList.length})
                            </button>
                            <span className="text-muted-foreground">•</span>
                            <button
                              type="button"
                              onClick={() => handleDeselectAllFilteredStudents(classStudentsList)}
                              className="text-[10px] text-muted-foreground hover:underline"
                            >
                              נקה
                            </button>
                          </div>
                        </div>

                        <div className="max-h-36 overflow-y-auto space-y-1">
                          {classStudentsList.length === 0 ? (
                            <p className="text-[11px] text-muted-foreground py-2 text-center">
                              לא נמצאו תלמידים רשומים בכיתה זו.
                            </p>
                          ) : (
                            classStudentsList.map((st) => {
                              const isChecked = selectedStudentIds.includes(st.id);
                              return (
                                <label
                                  key={st.id}
                                  className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
                                    isChecked
                                      ? "bg-primary/10 text-foreground font-bold"
                                      : "hover:bg-muted text-muted-foreground"
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
                                  {st.group && (
                                    <Badge variant="outline" className="text-[9px] py-0 px-1">
                                      {st.group}
                                    </Badge>
                                  )}
                                </label>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

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
                          {classTargetScope === "custom" && ` (${selectedStudentIds.length} תלמידים ספציפיים)`}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-bold">
                        {matchingStudentsCount} תלמידים
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

            {/* Target: Dedicated Individual Students Mode */}
            {targetType === "students" && (
              <div className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
                {/* Search and Class Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute right-2.5 top-2.5 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="חיפוש תלמיד/ה לפי שם..."
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      className="h-8 text-xs pr-8 bg-background"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <select
                      value={studentFilterClass}
                      onChange={(e) => setStudentFilterClass(e.target.value)}
                      className="w-full h-8 rounded-lg border bg-background px-2 text-xs cursor-pointer shadow-2xs"
                    >
                      <option value="all">כל הכיתות ({students.length})</option>
                      {classList.map((cls) => (
                        <option key={cls} value={cls}>
                          כיתה {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Students Chips */}
                {selectedStudentIds.length > 0 && (
                  <div className="space-y-1 p-2 rounded-lg bg-background border border-border/60">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-foreground">
                        תלמידים שנבחרו ({selectedStudentIds.length}):
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedStudentIds([])}
                        className="text-destructive hover:underline cursor-pointer"
                      >
                        נקה הכל
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pt-0.5">
                      {selectedStudentIds.map((id) => {
                        const st = students.find((s) => s.id === id);
                        return (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="text-[10px] pl-1 pr-1.5 py-0.5 gap-1 bg-primary/10 text-primary border border-primary/20"
                          >
                            <span dir="ltr">{st?.name || id}</span>
                            {st?.fullClass && <span className="opacity-70 text-[9px]">({st.fullClass})</span>}
                            <button
                              type="button"
                              onClick={() => handleStudentToggle(id)}
                              className="hover:text-destructive cursor-pointer rounded-full p-0.5"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Selection list actions */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                  <span>
                    מוצגים {filteredIndividualStudents.length} תלמידים:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectAllFilteredStudents(filteredIndividualStudents)}
                      className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
                    >
                      בחר את כל המוצגים
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleDeselectAllFilteredStudents(filteredIndividualStudents)}
                      className="text-[10px] text-muted-foreground hover:underline cursor-pointer"
                    >
                      בטל בחירה
                    </button>
                  </div>
                </div>

                {/* Scrollable list */}
                <div className="max-h-44 overflow-y-auto border border-border/80 rounded-xl p-2 space-y-1 bg-background">
                  {filteredIndividualStudents.length === 0 ? (
                    <p className="text-center text-xs text-muted-foreground py-4">
                      לא נמצאו תלמידים תואמים לחיפוש / לסינון.
                    </p>
                  ) : (
                    filteredIndividualStudents.map((st) => {
                      const isChecked = selectedStudentIds.includes(st.id);
                      return (
                        <label
                          key={st.id}
                          className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-primary/10 text-foreground font-bold border border-primary/30"
                              : "hover:bg-muted/60 text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleStudentToggle(st.id)}
                              className="rounded accent-primary"
                            />
                            <span dir="ltr" className="truncate font-sans text-xs">
                              {st.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] text-muted-foreground">{st.fullClass}</span>
                            {st.group && (
                              <Badge variant="outline" className="text-[9px] py-0 px-1">
                                {st.group}
                              </Badge>
                            )}
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. Teacher Focus Words for David's Vocabulary Quiz (only when David is enabled) */}
          {coachWithDavid && (
            <div className="space-y-1 p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 animate-in fade-in duration-150">
              <label className="font-bold text-foreground flex items-center gap-1.5">
                <BookA className="h-3.5 w-3.5 text-indigo-500" />
                <span>מילות מפתח באנגלית לתרגול ומבדק עם דוד (אופציונלי):</span>
              </label>
              <Input
                placeholder="e.g., environment, pollute, recycle, solution, protect"
                value={focusWordsInput}
                onChange={(e) => setFocusWordsInput(e.target.value)}
                className="h-8 text-xs font-sans text-left bg-background"
                dir="ltr"
              />
              <span className="text-[10px] text-muted-foreground block">
                דוד ילמד את התלמידים את המילים האלו לפני המשימה ויבחן אותם עליהן בסיום (מילים שלא ידעו יישמרו אוטומטית במילון האישי שלהם).
              </span>
            </div>
          )}

          {/* 5. Teacher Custom Instructions */}
          <div className="space-y-1">
            <label className="font-bold text-foreground block">
              {coachWithDavid
                ? "הנחיות ודגשים מהמורה לתלמידים ולדוד (אופציונלי):"
                : "הנחיות ודגשים מהמורה לתלמידים (אופציונלי):"}
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
