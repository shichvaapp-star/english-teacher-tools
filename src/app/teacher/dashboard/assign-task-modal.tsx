"use client";

import React, { useState, useMemo } from "react";
import { StudentProfile, StudentGroup } from "@/types/auth";
import { TeacherAssignment, AssignmentTargetType, ExerciseLevel, AssignedVocabWord, AssignmentType } from "@/types/assignment";
import { ALL_WRITING_TASKS } from "@/data/writing-tasks";
import { MIDDLE_SCHOOL_UNSEENS } from "@/data/unseen-middle-school";
import { MINISTRY_VOCAB_WORDS } from "@/data/vocabulary-bands";
import {
  MIDDLE_SCHOOL_EASY,
  MIDDLE_SCHOOL_MEDIUM,
  MIDDLE_SCHOOL_HARD,
} from "@/lib/vocab-storage";
import { TeacherVocabBank, GRADE_LABELS, STANDARD_LEVEL_LABELS } from "@/types/vocab-bank";
import { getLocalVocabBanks } from "@/lib/vocab-bank-storage";
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
  Plus,
  Trash2,
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
  customBanks?: TeacherVocabBank[];
  preselectedVocabBank?: TeacherVocabBank | null;
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
  customBanks,
  preselectedVocabBank,
}: AssignTaskModalProps) {
  const [taskType, setTaskType] = useState<AssignmentType>("writing");
  const [selectedLevel, setSelectedLevel] = useState<"all" | ExerciseLevel>("all");
  const [coachWithDavid, setCoachWithDavid] = useState<boolean>(false);
  const [selectionMode, setSelectionMode] = useState<"specific" | "adaptive_david" | "free_choice">("specific");
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    ALL_WRITING_TASKS[0]?.id || ""
  );
  const [customTitle, setCustomTitle] = useState("");
  const [customHebrewTitle, setCustomHebrewTitle] = useState("");

  // Vocabulary Assignment State
  const [vocabSourceMode, setVocabSourceMode] = useState<"custom" | "ministry">("custom");
  const [selectedBankGradeFilter, setSelectedBankGradeFilter] = useState<string>("all");
  const [selectedBankLevelFilter, setSelectedBankLevelFilter] = useState<string>("all");

  const effectiveCustomBanks = useMemo(() => {
    if (customBanks && customBanks.length > 0) return customBanks;
    return getLocalVocabBanks(teacherId);
  }, [customBanks, teacherId]);

  const filteredCustomBanks = useMemo(() => {
    return effectiveCustomBanks.filter((b) => {
      if (selectedBankGradeFilter !== "all" && b.grade !== selectedBankGradeFilter && b.grade !== "all") {
        return false;
      }
      if (selectedBankLevelFilter !== "all") {
        if (b.levelType === "custom" && b.customLevelName !== selectedBankLevelFilter) return false;
        if (b.levelType === "standard" && b.standardLevel !== selectedBankLevelFilter) return false;
      }
      return true;
    });
  }, [effectiveCustomBanks, selectedBankGradeFilter, selectedBankLevelFilter]);

  const [selectedVocabWords, setSelectedVocabWords] = useState<AssignedVocabWord[]>(() =>
    MIDDLE_SCHOOL_MEDIUM.map((w) => ({
      id: w.id,
      english: w.english,
      hebrew: w.hebrew,
      partOfSpeech: w.partOfSpeech,
      example: w.example,
    }))
  );
  const [vocabSearchQuery, setVocabSearchQuery] = useState("");
  const [customVocabEng, setCustomVocabEng] = useState("");
  const [customVocabHeb, setCustomVocabHeb] = useState("");
  const [customVocabPos, setCustomVocabPos] = useState<"noun" | "verb" | "adjective" | "adverb" | "phrase">("noun");
  const [customVocabExample, setCustomVocabExample] = useState("");
  const [showAddCustomWord, setShowAddCustomWord] = useState(false);

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

  // Reset or pre-select student / custom vocab bank on modal open
  React.useEffect(() => {
    if (open) {
      setError(null);
      setCoachWithDavid(false);
      setSelectionMode("specific");
      setSelectedLevel("all");
      setClassTargetScope("all");
      setStudentSearchQuery("");

      if (preselectedVocabBank) {
        setTaskType("vocab");
        setSelectedVocabWords(
          preselectedVocabBank.words.map((w) => ({
            id: w.id,
            english: w.english,
            hebrew: w.hebrew,
            partOfSpeech: w.partOfSpeech,
            example: w.example,
          }))
        );
        setCustomTitle(`${preselectedVocabBank.name} Practice`);
        setCustomHebrewTitle(`אוצר מילים: ${preselectedVocabBank.name}`);
        setVocabSourceMode("custom");
      }

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
  }, [open, preselectedStudentId, preselectedVocabBank, students]);

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
  const handleTypeChange = (type: AssignmentType) => {
    setTaskType(type);
    if (type === "writing") {
      const pool = selectedLevel === "all" ? ALL_WRITING_TASKS : ALL_WRITING_TASKS.filter((t) => t.level === selectedLevel);
      setSelectedTaskId(pool[0]?.id || ALL_WRITING_TASKS[0]?.id || "");
    } else if (type === "unseen") {
      const pool = selectedLevel === "all" ? MIDDLE_SCHOOL_UNSEENS : MIDDLE_SCHOOL_UNSEENS.filter((s) => s.level === selectedLevel);
      setSelectedTaskId(pool[0]?.id || MIDDLE_SCHOOL_UNSEENS[0]?.id || "");
    } else {
      setSelectedTaskId("vocab_assigned");
      if (selectedVocabWords.length === 0) {
        setSelectedVocabWords(
          MIDDLE_SCHOOL_MEDIUM.map((w) => ({
            id: w.id,
            english: w.english,
            hebrew: w.hebrew,
            partOfSpeech: w.partOfSpeech,
            example: w.example,
          }))
        );
      }
    }
  };

  // Comprehensive pool of all vocabulary words for searching
  const allVocabWordPool = useMemo(() => {
    const list: AssignedVocabWord[] = [];
    const seen = new Set<string>();

    MINISTRY_VOCAB_WORDS.forEach((w) => {
      const key = w.word.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        list.push({
          id: w.id,
          english: w.word,
          hebrew: w.hebrew,
          partOfSpeech: w.partOfSpeech,
          example: w.exampleSentence,
        });
      }
    });

    [...MIDDLE_SCHOOL_EASY, ...MIDDLE_SCHOOL_MEDIUM, ...MIDDLE_SCHOOL_HARD].forEach((w) => {
      const key = w.english.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        list.push({
          id: w.id,
          english: w.english,
          hebrew: w.hebrew,
          partOfSpeech: w.partOfSpeech,
          example: w.example,
        });
      }
    });

    return list;
  }, []);

  const filteredVocabWordPool = useMemo(() => {
    const q = vocabSearchQuery.trim().toLowerCase();
    if (!q) return allVocabWordPool.slice(0, 16);
    return allVocabWordPool.filter(
      (w) =>
        w.english.toLowerCase().includes(q) ||
        w.hebrew.includes(q) ||
        (w.example && w.example.toLowerCase().includes(q))
    ).slice(0, 20);
  }, [allVocabWordPool, vocabSearchQuery]);

  const applyVocabPreset = (presetKey: string) => {
    let words: AssignedVocabWord[] = [];
    let titleEn = "";
    let titleHeb = "";

    if (presetKey === "band1") {
      words = MINISTRY_VOCAB_WORDS.filter((w) => w.band === "Band I").map((w) => ({
        id: w.id,
        english: w.word,
        hebrew: w.hebrew,
        partOfSpeech: w.partOfSpeech,
        example: w.exampleSentence,
      }));
      titleEn = "Band I Vocabulary Drill";
      titleHeb = "אוצר מילים יסודי - Band I";
    } else if (presetKey === "band2") {
      words = MINISTRY_VOCAB_WORDS.filter((w) => w.band === "Band II").map((w) => ({
        id: w.id,
        english: w.word,
        hebrew: w.hebrew,
        partOfSpeech: w.partOfSpeech,
        example: w.exampleSentence,
      }));
      titleEn = "Band II Core Vocabulary";
      titleHeb = "אוצר מילים חטיבת ביניים - Band II";
    } else if (presetKey === "band3") {
      words = MINISTRY_VOCAB_WORDS.filter((w) => w.band === "Band III").map((w) => ({
        id: w.id,
        english: w.word,
        hebrew: w.hebrew,
        partOfSpeech: w.partOfSpeech,
        example: w.exampleSentence,
      }));
      titleEn = "Band III Advanced Vocabulary";
      titleHeb = "אוצר מילים מתקדם - Band III";
    } else if (presetKey === "grade7") {
      words = MIDDLE_SCHOOL_EASY.map((w) => ({
        id: w.id,
        english: w.english,
        hebrew: w.hebrew,
        partOfSpeech: w.partOfSpeech,
        example: w.example,
      }));
      titleEn = "Grade 7 Essential Vocabulary";
      titleHeb = "אוצר מילים כיתה ז׳ - בסיסי";
    } else if (presetKey === "grade8") {
      words = MIDDLE_SCHOOL_MEDIUM.map((w) => ({
        id: w.id,
        english: w.english,
        hebrew: w.hebrew,
        partOfSpeech: w.partOfSpeech,
        example: w.example,
      }));
      titleEn = "Grade 8 Core Vocabulary";
      titleHeb = "אוצר מילים כיתה ח׳ - ליבה";
    } else if (presetKey === "grade9") {
      words = MIDDLE_SCHOOL_HARD.map((w) => ({
        id: w.id,
        english: w.english,
        hebrew: w.hebrew,
        partOfSpeech: w.partOfSpeech,
        example: w.example,
      }));
      titleEn = "Grade 9 Academic Vocabulary";
      titleHeb = "אוצר מילים כיתה ט׳ - אקדמי";
    }

    if (words.length > 0) {
      setSelectedVocabWords(words);
      setCustomTitle(titleEn);
      setCustomHebrewTitle(titleHeb);
    }
  };

  const applyCustomBank = (bank: TeacherVocabBank) => {
    setSelectedVocabWords(
      bank.words.map((w) => ({
        id: w.id,
        english: w.english,
        hebrew: w.hebrew,
        partOfSpeech: w.partOfSpeech,
        example: w.example,
      }))
    );
    setCustomTitle(`${bank.name} Vocabulary Drill`);
    setCustomHebrewTitle(`אוצר מילים: ${bank.name}`);
  };

  const handleToggleVocabWord = (word: AssignedVocabWord) => {
    setSelectedVocabWords((prev) => {
      const exists = prev.some((w) => w.english.toLowerCase() === word.english.toLowerCase());
      if (exists) {
        return prev.filter((w) => w.english.toLowerCase() !== word.english.toLowerCase());
      } else {
        return [...prev, word];
      }
    });
  };

  const handleRemoveVocabWord = (english: string) => {
    setSelectedVocabWords((prev) =>
      prev.filter((w) => w.english.toLowerCase() !== english.toLowerCase())
    );
  };

  const handleAddCustomWord = () => {
    const cleanEng = customVocabEng.trim().toLowerCase();
    const cleanHeb = customVocabHeb.trim();
    if (!cleanEng || !cleanHeb) return;

    const newWord: AssignedVocabWord = {
      id: `custom-word-${Date.now()}`,
      english: cleanEng,
      hebrew: cleanHeb,
      partOfSpeech: customVocabPos,
      example: customVocabExample.trim() || undefined,
    };

    setSelectedVocabWords((prev) => {
      if (prev.some((w) => w.english.toLowerCase() === cleanEng)) return prev;
      return [...prev, newWord];
    });

    setCustomVocabEng("");
    setCustomVocabHeb("");
    setCustomVocabExample("");
    setShowAddCustomWord(false);
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

    if (taskType === "vocab") {
      if (selectedVocabWords.length === 0) {
        setError("יש לבחור לפחות מילה אחת למשימת אוצר המילים.");
        return;
      }
      title = customTitle.trim() || `Vocabulary Assignment (${selectedVocabWords.length} words)`;
      hebrewTitle = customHebrewTitle.trim() || `משימת אוצר מילים (${selectedVocabWords.length} מילים)`;
    } else if (isAdaptiveDavid) {
      if (taskType === "writing") {
        title = `Adaptive Writing Mission${levelSuffixEnglish}`;
        hebrewTitle = `משימת כתיבה מותאמת אישית 🎓${levelSuffixHebrew}`;
      } else {
        title = `Adaptive Unseen Reading${levelSuffixEnglish}`;
        hebrewTitle = `משימת קריאה (Unseen) מותאמת אישית 🎓${levelSuffixHebrew}`;
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
      taskId:
        taskType === "vocab"
          ? "vocab_assigned"
          : isAdaptiveDavid
          ? "adaptive_david"
          : isFreeChoice
          ? "free_choice"
          : selectedTaskId,
      vocabWords: taskType === "vocab" ? selectedVocabWords : undefined,
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
      setCustomTitle("");
      setCustomHebrewTitle("");
      setVocabSearchQuery("");
      setShowAddCustomWord(false);
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
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange("writing")}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                  taskType === "writing"
                    ? "border-primary bg-primary/10 text-primary shadow-2xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <PenTool className="h-4 w-4 text-purple-500 shrink-0" />
                <span>✍️ כתיבה</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange("unseen")}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                  taskType === "unseen"
                    ? "border-primary bg-primary/10 text-primary shadow-2xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <BookOpen className="h-4 w-4 text-sky-500 shrink-0" />
                <span>📖 הבנת הנקרא</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange("vocab")}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                  taskType === "vocab"
                    ? "border-emerald-600 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-black shadow-2xs ring-1 ring-emerald-500/40"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <BookA className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>🔤 אוצר מילים</span>
              </button>
            </div>
          </div>

          {taskType === "vocab" ? (
            /* Vocabulary Word Builder Section */
            <div className="space-y-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <BookA className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>אוצר מילים מוקצה למשימה:</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-2xs font-bold border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 ${
                    selectedVocabWords.length >= 4 ? "ring-1 ring-emerald-500/30" : ""
                  }`}
                >
                  {selectedVocabWords.length} מילים נבחרו
                </Badge>
              </div>

              {/* Bank Source Switch: Custom Banks vs Ministry Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setVocabSourceMode("custom")}
                      className={`px-2.5 py-1 rounded-lg text-2xs font-bold cursor-pointer transition-colors ${
                        vocabSourceMode === "custom"
                          ? "bg-primary text-primary-foreground shadow-2xs"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      מאגרי המילים שלי ({effectiveCustomBanks.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setVocabSourceMode("ministry")}
                      className={`px-2.5 py-1 rounded-lg text-2xs font-bold cursor-pointer transition-colors ${
                        vocabSourceMode === "ministry"
                          ? "bg-primary text-primary-foreground shadow-2xs"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      ערכות משרד החינוך (Bands I-III)
                    </button>
                  </div>
                </div>

                {vocabSourceMode === "custom" ? (
                  <div className="space-y-2 bg-card/60 p-2.5 rounded-xl border border-border/60">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-3xs">
                      <span className="font-bold text-muted-foreground">
                        בחר מאגר מילים מותאם אישית:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <select
                          value={selectedBankGradeFilter}
                          onChange={(e) => setSelectedBankGradeFilter(e.target.value)}
                          className="h-6 px-1.5 rounded border border-border bg-background text-3xs cursor-pointer font-medium"
                        >
                          <option value="all">כל השכבות</option>
                          <option value="ז">כיתה ז׳</option>
                          <option value="ח">כיתה ח׳</option>
                          <option value="ט">כיתה ט׳</option>
                          <option value="י">כיתה י׳</option>
                          <option value="יא">כיתה י״א</option>
                          <option value="יב">כיתה י״ב</option>
                        </select>
                      </div>
                    </div>

                    {filteredCustomBanks.length === 0 ? (
                      <div className="p-3 text-center text-3xs text-muted-foreground border border-dashed border-border rounded-lg">
                        {effectiveCustomBanks.length === 0 ? (
                          <span>עדיין לא יצרת מאגרי מילים. תוכל ליצור מאגר בלשונית &quot;מאגרי מילים שלי&quot; בלוח הבקרה.</span>
                        ) : (
                          <span>אין מאגרים התואמים לשכבה שנבחרה.</span>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                        {filteredCustomBanks.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => applyCustomBank(b)}
                            className="p-2 rounded-lg border border-border bg-background hover:border-primary/50 text-right cursor-pointer transition-all flex items-center justify-between gap-1.5 group"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-2xs block truncate text-foreground group-hover:text-primary">
                                {b.name}
                              </span>
                              <span className="text-3xs text-muted-foreground block truncate">
                                {GRADE_LABELS[b.grade] || b.grade} •{" "}
                                {b.levelType === "custom"
                                  ? b.customLevelName
                                  : STANDARD_LEVEL_LABELS[b.standardLevel || ""] || b.standardLevel}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-3xs shrink-0 font-bold">
                              {b.words.length} מילים
                            </Badge>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Ministry Presets */
                  <div className="space-y-1.5">
                    <span className="text-2xs font-bold text-muted-foreground block">
                      ערכות מילים מוכנות מראש (1-Click Presets):
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      <button
                        type="button"
                        onClick={() => applyVocabPreset("grade7")}
                        className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-center cursor-pointer text-2xs font-medium transition-colors"
                      >
                        כיתה ז׳ (10)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyVocabPreset("grade8")}
                        className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-center cursor-pointer text-2xs font-medium transition-colors"
                      >
                        כיתה ח׳ (8)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyVocabPreset("grade9")}
                        className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-center cursor-pointer text-2xs font-medium transition-colors"
                      >
                        כיתה ט׳ (7)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyVocabPreset("band1")}
                        className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-center cursor-pointer text-2xs font-medium transition-colors"
                      >
                        Band I (5)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyVocabPreset("band2")}
                        className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-center cursor-pointer text-2xs font-medium transition-colors"
                      >
                        Band II (6)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyVocabPreset("band3")}
                        className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-center cursor-pointer text-2xs font-medium transition-colors"
                      >
                        Band III (6)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Words Chips Tray */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-bold text-muted-foreground">
                    מילים שנבחרו לתרגול ({selectedVocabWords.length}):
                  </span>
                  {selectedVocabWords.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedVocabWords([])}
                      className="text-3xs text-destructive hover:underline cursor-pointer"
                    >
                      נקה הכל
                    </button>
                  )}
                </div>

                {selectedVocabWords.length === 0 ? (
                  <div className="p-3 text-center rounded-lg border border-dashed border-border text-muted-foreground text-2xs">
                    טרם נבחרו מילים. בחרו ערכה מוכנה או חפשו מילים להוספה מטה.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg bg-background/80 border border-border/80">
                    {selectedVocabWords.map((w) => (
                      <Badge
                        key={w.id || w.english}
                        variant="secondary"
                        className="gap-1.5 text-2xs py-1 px-2 font-medium bg-secondary/80 hover:bg-secondary flex items-center"
                      >
                        <span className="font-bold text-foreground" dir="ltr">{w.english}</span>
                        <span className="text-muted-foreground">({w.hebrew})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVocabWord(w.english)}
                          className="hover:text-destructive cursor-pointer shrink-0 transition-colors"
                          aria-label={`הסר את ${w.english}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Search to add from dictionary */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Search className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={vocabSearchQuery}
                    onChange={(e) => setVocabSearchQuery(e.target.value)}
                    placeholder="חיפוש מילה באנגלית או בעברית להוספה למשימה..."
                    className="pr-8 text-xs h-8 bg-background"
                  />
                  {vocabSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setVocabSearchQuery("")}
                      className="absolute left-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {vocabSearchQuery.trim() && (
                  <div className="p-1.5 rounded-lg bg-background border border-border max-h-36 overflow-y-auto space-y-1">
                    {filteredVocabWordPool.length === 0 ? (
                      <div className="p-2 text-center text-3xs text-muted-foreground">
                        לא נמצאה מילה מתאימה במאגר. ניתן להוסיפה ידנית מטה.
                      </div>
                    ) : (
                      filteredVocabWordPool.map((w) => {
                        const isSelected = selectedVocabWords.some(
                          (sw) => sw.english.toLowerCase() === w.english.toLowerCase()
                        );
                        return (
                          <div
                            key={w.id || w.english}
                            className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/50 text-2xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground" dir="ltr">{w.english}</span>
                              <span className="text-muted-foreground">— {w.hebrew}</span>
                              {w.partOfSpeech && (
                                <span className="text-3xs text-muted-foreground/80 italic">({w.partOfSpeech})</span>
                              )}
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant={isSelected ? "outline" : "default"}
                              onClick={() => handleToggleVocabWord(w)}
                              className={`h-6 px-2 text-3xs gap-1 cursor-pointer ${
                                isSelected
                                  ? "border-destructive/50 text-destructive hover:bg-destructive/10"
                                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <X className="h-2.5 w-2.5" />
                                  <span>הסר</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="h-2.5 w-2.5" />
                                  <span>הוסף</span>
                                </>
                              )}
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Add Custom Word Accordion */}
              <div className="pt-1">
                {!showAddCustomWord ? (
                  <button
                    type="button"
                    onClick={() => setShowAddCustomWord(true)}
                    className="flex items-center gap-1.5 text-2xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>הוסף מילה מותאמת אישית לרשימה</span>
                  </button>
                ) : (
                  <div className="p-2.5 rounded-lg border border-border bg-background space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-2xs text-foreground">הוספת מילה אישית:</span>
                      <button
                        type="button"
                        onClick={() => setShowAddCustomWord(false)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={customVocabEng}
                        onChange={(e) => setCustomVocabEng(e.target.value)}
                        placeholder="Word in English (e.g. challenge)"
                        className="text-xs h-7"
                        dir="ltr"
                      />
                      <Input
                        value={customVocabHeb}
                        onChange={(e) => setCustomVocabHeb(e.target.value)}
                        placeholder="תרגום בעברית (למשל: אתגר)"
                        className="text-xs h-7"
                        dir="rtl"
                      />
                    </div>
                    <Input
                      value={customVocabExample}
                      onChange={(e) => setCustomVocabExample(e.target.value)}
                      placeholder="משפט דוגמה אופציונלי (English sentence)"
                      className="text-xs h-7"
                      dir="ltr"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddCustomWord(false)}
                        className="h-6 text-2xs"
                      >
                        ביטול
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddCustomWord}
                        disabled={!customVocabEng.trim() || !customVocabHeb.trim()}
                        className="h-6 text-2xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        הוסף לרשימה
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Assignment Title (Editable) */}
              <div className="space-y-1 pt-1">
                <label className="text-2xs font-bold text-muted-foreground block">
                  שם המשימה לתלמידים:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    value={customHebrewTitle}
                    onChange={(e) => setCustomHebrewTitle(e.target.value)}
                    placeholder="שם בעברית (למשל: אוצר מילים ליחידה 2)"
                    className="text-xs h-8 bg-background"
                    dir="rtl"
                  />
                  <Input
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Title in English (e.g. Unit 2 Vocabulary)"
                    className="text-xs h-8 bg-background"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Exercise Level & Topic Selection Mode for Writing & Unseen */
            <>
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
            </>
          )}

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
          {/* 5. Teacher Custom Instructions */}
          <div className="space-y-1">
            <label className="font-bold text-foreground block">
              הנחיות ודגשים מהמורה לתלמידים (אופציונלי):
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
