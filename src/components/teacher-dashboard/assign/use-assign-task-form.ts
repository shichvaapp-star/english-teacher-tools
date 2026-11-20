"use client";

import { useEffect, useMemo, useState } from "react";
import type { StudentProfile, StudentGroup } from "@/types/auth";
import type {
  TeacherAssignment,
  AssignmentTargetType,
  ExerciseLevel,
  AssignedVocabWord,
  AssignmentType,
} from "@/types/assignment";
import type { GrammarExerciseType } from "@/types/grammar";
import { GRAMMAR_TOPICS, getGrammarTopic } from "@/data/grammar";
import { ALL_WRITING_TASKS } from "@/data/writing-tasks";
import { GRADE_LABELS as CLASS_GRADE_LABELS, type ClassGrade } from "@/lib/levels";
import { MIDDLE_SCHOOL_UNSEENS, findUnseenStoryById } from "@/data/unseen-middle-school";
import { REAL_LIFE_CONVERSATIONS } from "@/data/conversations";
import { curriculumWords } from "@/lib/vocab-storage";
import type { TeacherVocabBank } from "@/types/vocab-bank";
import { getLocalVocabBanks } from "@/lib/vocab-bank-storage";

// All the state and rules of the "assign task" dialog. Both layouts (the
// classic one-screen form and the step-by-step wizard) render from this one
// hook, so switching layout mid-way keeps every answer.

export interface AssignTaskFormProps {
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
  initialAssignmentTemplate?: TeacherAssignment | null;
}

/** Keeps items of the level (or all levels) and grade; legacy items without a grade always pass. */
export function filterByLevelAndGrade<T extends { level: string; grade?: ClassGrade }>(
  items: T[],
  level: "all" | ExerciseLevel,
  grade: "all" | ClassGrade
): T[] {
  return items.filter(
    (t) => (level === "all" || t.level === level) && (grade === "all" || t.grade === undefined || t.grade === grade)
  );
}

export function useAssignTaskForm({
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
  initialAssignmentTemplate,
}: AssignTaskFormProps) {
  const [taskType, setTaskType] = useState<AssignmentType>("writing");
  const [selectedLevel, setSelectedLevel] = useState<"all" | ExerciseLevel>("all");
  // "all" = each student works in their own class's grade.
  const [selectedGrade, setSelectedGrade] = useState<"all" | ClassGrade>("all");
  const vocabGrade: ClassGrade = selectedGrade === "all" ? 7 : selectedGrade;
  const [coachWithDavid, setCoachWithDavid] = useState<boolean>(false);
  const [selectionMode, setSelectionMode] = useState<"specific" | "adaptive_david" | "free_choice">("specific");
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    ALL_WRITING_TASKS[0]?.id || ""
  );
  const [customTitle, setCustomTitle] = useState("");

  // Grammar Assignment State
  const [grammarTopicIds, setGrammarTopicIds] = useState<string[]>(() =>
    GRAMMAR_TOPICS[0] ? [GRAMMAR_TOPICS[0].id] : []
  );
  const [grammarTypes, setGrammarTypes] = useState<GrammarExerciseType[]>([]);
  const [grammarItemCount, setGrammarItemCount] = useState<number | null>(null);
  const [customHebrewTitle, setCustomHebrewTitle] = useState("");

  // Vocabulary Assignment State
  const [vocabSourceMode, setVocabSourceMode] = useState<"custom" | "ministry">("custom");
  const [selectedBankGradeFilter, setSelectedBankGradeFilter] = useState<string>("all");
  const [selectedBankLevelFilter] = useState<string>("all");

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
    curriculumWords(7, 1).map((w) => ({
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
  const [customVocabPos] = useState<"noun" | "verb" | "adjective" | "adverb" | "phrase">("noun");
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
  const [isShared, setIsShared] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset or pre-select student / custom vocab bank on modal open
  useEffect(() => {
    if (open) {
      setError(null);
      setCoachWithDavid(false);
      setSelectionMode("specific");
      setSelectedLevel("all");
      setSelectedGrade("all");
      setClassTargetScope("all");
      setStudentSearchQuery("");

      if (initialAssignmentTemplate) {
        setTaskType(initialAssignmentTemplate.type);
        if (initialAssignmentTemplate.level) {
          setSelectedLevel(initialAssignmentTemplate.level);
        }
        if (initialAssignmentTemplate.grade) {
          setSelectedGrade(initialAssignmentTemplate.grade);
        }
        setCoachWithDavid(!!initialAssignmentTemplate.coachWithDavid);
        if (initialAssignmentTemplate.instructions) {
          setInstructions(initialAssignmentTemplate.instructions);
        }
        if (initialAssignmentTemplate.focusWords) {
          setFocusWordsInput(initialAssignmentTemplate.focusWords.join(", "));
        }
        if (initialAssignmentTemplate.vocabWords) {
          setSelectedVocabWords(initialAssignmentTemplate.vocabWords);
        }
        if (initialAssignmentTemplate.grammarConfig) {
          setGrammarTopicIds(initialAssignmentTemplate.grammarConfig.topicIds);
          setGrammarTypes(initialAssignmentTemplate.grammarConfig.exerciseTypes ?? []);
          setGrammarItemCount(initialAssignmentTemplate.grammarConfig.itemCount ?? null);
        }
        if (initialAssignmentTemplate.title) {
          setCustomTitle(initialAssignmentTemplate.title);
        }
        if (initialAssignmentTemplate.hebrewTitle) {
          setCustomHebrewTitle(initialAssignmentTemplate.hebrewTitle);
        }
        if (initialAssignmentTemplate.taskId) {
          setSelectedTaskId(initialAssignmentTemplate.taskId);
        }
        // Templates from the shared library stay shared; a grammar topic opened from
        // the grammar bank page passes isShared: false.
        setIsShared(initialAssignmentTemplate.isShared ?? true);
      }

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

  const classList = useMemo(() => {
    if (availableClasses && availableClasses.length > 0) return availableClasses;
    return ["ז׳1", "ז׳2", "ח׳1", "ח׳2", "ט׳1", "ט׳2"];
  }, [availableClasses]);

  // Tasks filtered by level
  const availableWritingTasks = useMemo(
    () => filterByLevelAndGrade(ALL_WRITING_TASKS, selectedLevel, selectedGrade),
    [selectedLevel, selectedGrade]
  );

  const availableUnseens = useMemo(
    () => filterByLevelAndGrade(MIDDLE_SCHOOL_UNSEENS, selectedLevel, selectedGrade),
    [selectedLevel, selectedGrade]
  );

  const availableConversations = useMemo(
    () => filterByLevelAndGrade(REAL_LIFE_CONVERSATIONS, selectedLevel, selectedGrade),
    [selectedLevel, selectedGrade]
  );

  // When changing level, ensure selectedTaskId points to a valid task in that level
  const handleLevelChange = (lvl: "all" | ExerciseLevel, grade: "all" | ClassGrade = selectedGrade) => {
    setSelectedLevel(lvl);
    if (taskType === "grammar" || taskType === "vocab") return;
    const pool =
      taskType === "writing"
        ? filterByLevelAndGrade(ALL_WRITING_TASKS, lvl, grade)
        : taskType === "conversation"
        ? filterByLevelAndGrade(REAL_LIFE_CONVERSATIONS, lvl, grade)
        : filterByLevelAndGrade(MIDDLE_SCHOOL_UNSEENS, lvl, grade);
    if (!pool.some((t) => t.id === selectedTaskId)) {
      setSelectedTaskId(pool[0]?.id || "");
    }
  };

  const handleGradeChange = (grade: "all" | ClassGrade) => {
    setSelectedGrade(grade);
    handleLevelChange(selectedLevel, grade);
  };

  // Switch task list based on type
  const handleTypeChange = (type: AssignmentType) => {
    setTaskType(type);
    if (type === "writing") {
      const pool = filterByLevelAndGrade(ALL_WRITING_TASKS, selectedLevel, selectedGrade);
      setSelectedTaskId(pool[0]?.id || ALL_WRITING_TASKS[0]?.id || "");
    } else if (type === "unseen") {
      const pool = filterByLevelAndGrade(MIDDLE_SCHOOL_UNSEENS, selectedLevel, selectedGrade);
      setSelectedTaskId(pool[0]?.id || MIDDLE_SCHOOL_UNSEENS[0]?.id || "");
    } else if (type === "conversation") {
      const pool = filterByLevelAndGrade(REAL_LIFE_CONVERSATIONS, selectedLevel, selectedGrade);
      setSelectedTaskId(pool[0]?.id || REAL_LIFE_CONVERSATIONS[0]?.id || "");
    } else if (type === "grammar") {
      setCoachWithDavid(false);
      setSelectionMode("specific");
      setSelectedTaskId(grammarTopicIds[0] ?? "");
    } else {
      setSelectedTaskId("vocab_assigned");
      if (selectedVocabWords.length === 0) {
        setSelectedVocabWords(
          curriculumWords(vocabGrade, 1).map((w) => ({
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

    [...curriculumWords(7), ...curriculumWords(8), ...curriculumWords(9)].forEach((w) => {
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

    // "u3" → unit 3 of the chosen grade
    const unitNo = Number(presetKey.replace(/^u/, ""));
    if (unitNo > 0) {
      words = curriculumWords(vocabGrade, unitNo).map((w) => ({
        id: w.id,
        english: w.english,
        hebrew: w.hebrew,
        partOfSpeech: w.partOfSpeech,
        example: w.example,
      }));
      titleEn = `Grade ${vocabGrade} · Unit ${unitNo} Vocabulary`;
      titleHeb = `אוצר מילים ${CLASS_GRADE_LABELS[vocabGrade].he} · יחידה ${unitNo}`;
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

  /** Why the chosen content can't be assigned yet (Hebrew), or null. */
  const contentProblem = (): string | null => {
    if (taskType === "grammar" && grammarTopicIds.every((id) => !getGrammarTopic(id))) {
      return "יש לבחור לפחות נושא דקדוק אחד.";
    }
    if (taskType === "vocab" && selectedVocabWords.length === 0) {
      return "יש לבחור לפחות מילה אחת למשימת אוצר המילים.";
    }
    return null;
  };

  /** Why the chosen students can't receive it yet (Hebrew), or null. */
  const audienceProblem = (): string | null => {
    if (targetType === "class") {
      if (!selectedClass) return "יש לבחור כיתה להקצאת המשימה.";
      if (!selectedGroup) return "יש לבחור הקבצה (א1, א2, ב או כולן).";
      if (classTargetScope === "custom" && selectedStudentIds.length === 0) {
        return "יש לבחור לפחות תלמיד/ה אחד/ת מהכיתה להקצאת המשימה.";
      }
    }
    if (targetType === "students" && selectedStudentIds.length === 0) {
      return "יש לבחור לפחות תלמיד/ה אחד/ת להקצאת המשימה.";
    }
    return null;
  };

  /** The English and Hebrew titles the students will see. */
  const assignmentTitles = (): { title: string; hebrewTitle: string } => {
    const isFreeChoice = selectionMode === "free_choice";
    const isAdaptiveDavid = coachWithDavid && selectionMode === "adaptive_david";

    const levelSuffixHebrew =
      selectedLevel === "Level 1"
        ? " (רמה 1)"
        : selectedLevel === "Level 2"
        ? " (רמה 2)"
        : selectedLevel === "Level 3"
        ? " (רמה 3)"
        : "";

    const levelSuffixEnglish = selectedLevel !== "all" ? ` (${selectedLevel})` : "";

    if (taskType === "grammar") {
      const topics = grammarTopicIds.map((id) => getGrammarTopic(id)).filter((t) => t !== undefined);
      return {
        title:
          customTitle.trim() ||
          (topics.length === 1 ? `Grammar: ${topics[0].title}` : `Grammar Review (${topics.length} topics)`) + levelSuffixEnglish,
        hebrewTitle:
          customHebrewTitle.trim() ||
          (topics.length === 1 ? `דקדוק: ${topics[0].titleHe}` : `חזרה בדקדוק (${topics.length} נושאים)`) + levelSuffixHebrew,
      };
    }
    if (taskType === "vocab") {
      return {
        title: customTitle.trim() || `Vocabulary Assignment (${selectedVocabWords.length} words)`,
        hebrewTitle: customHebrewTitle.trim() || `משימת אוצר מילים (${selectedVocabWords.length} מילים)`,
      };
    }
    if (isAdaptiveDavid) {
      if (taskType === "writing") {
        return { title: `Adaptive Writing Mission${levelSuffixEnglish}`, hebrewTitle: `משימת כתיבה מותאמת אישית 🎓${levelSuffixHebrew}` };
      }
      if (taskType === "conversation") {
        return {
          title: `Adaptive Conversation Practice${levelSuffixEnglish}`,
          hebrewTitle: `משימת שיחה מהחיים מותאמת אישית 🎓${levelSuffixHebrew}`,
        };
      }
      return { title: `Adaptive Unseen Reading${levelSuffixEnglish}`, hebrewTitle: `משימת קריאה (Unseen) מותאמת אישית 🎓${levelSuffixHebrew}` };
    }
    if (isFreeChoice) {
      if (taskType === "writing") {
        return { title: `Free Choice Essay${levelSuffixEnglish}`, hebrewTitle: `חיבור בבחירה חופשית${levelSuffixHebrew}` };
      }
      if (taskType === "conversation") {
        return {
          title: `Free Choice Conversation Practice${levelSuffixEnglish}`,
          hebrewTitle: `שיחה מהחיים בבחירה חופשית${levelSuffixHebrew}`,
        };
      }
      return { title: `Free Choice Reading Comprehension${levelSuffixEnglish}`, hebrewTitle: `אנסין בבחירה חופשית${levelSuffixHebrew}` };
    }
    if (taskType === "writing") {
      const matched = ALL_WRITING_TASKS.find((t) => t.id === selectedTaskId);
      return {
        title: matched ? matched.title : customTitle.trim() || "Writing Assignment",
        hebrewTitle: matched ? matched.hebrewTitle : customTitle.trim() || "מטלת כתיבה",
      };
    }
    if (taskType === "conversation") {
      const matched = REAL_LIFE_CONVERSATIONS.find((s) => s.id === selectedTaskId);
      return {
        title: matched ? matched.title : "Conversation Practice",
        hebrewTitle: matched ? matched.hebrewTitle : "תרגול שיחה מהחיים",
      };
    }
    const matched = findUnseenStoryById(selectedTaskId);
    return { title: matched ? matched.title : "Unseen Test", hebrewTitle: matched ? matched.hebrewTitle : "מבחן אנסין" };
  };

  /** The assignment exactly as it will be saved (call after the checks pass). */
  const buildAssignment = (): TeacherAssignment => {
    const isFreeChoice = selectionMode === "free_choice";
    const isAdaptiveDavid = coachWithDavid && selectionMode === "adaptive_david";
    const { title, hebrewTitle } = assignmentTitles();

    const parsedFocusWords = coachWithDavid
      ? focusWordsInput
          .split(/[,;\n]+/)
          .map((w) => w.trim().replace(/[^a-zA-Z\s-]/g, ""))
          .filter((w) => w.length >= 2)
          .slice(0, 8)
      : [];

    const finalTargetType: AssignmentTargetType =
      targetType === "class" && classTargetScope === "custom" ? "students" : targetType;

    const finalLevel = selectedLevel !== "all" ? selectedLevel : undefined;

    return {
      id: `assign-${Date.now()}`,
      teacherId,
      teacherName,
      type: taskType,
      title,
      hebrewTitle,
      taskId:
        taskType === "grammar"
          ? grammarTopicIds[0]
          : taskType === "vocab"
          ? "vocab_assigned"
          : isAdaptiveDavid
          ? "adaptive_david"
          : isFreeChoice
          ? "free_choice"
          : selectedTaskId,
      vocabWords: taskType === "vocab" ? selectedVocabWords : undefined,
      grammarConfig:
        taskType === "grammar"
          ? {
              topicIds: grammarTopicIds,
              exerciseTypes: grammarTypes.length ? grammarTypes : undefined,
              itemCount: grammarItemCount ?? undefined,
            }
          : undefined,
      level: finalLevel,
      grade: selectedGrade === "all" ? undefined : selectedGrade,
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
      isShared,
      sharedAt: isShared ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      status: "active",
    };
  };

  /** Check, save and close. Returns true when the task was assigned. */
  const submit = (): boolean => {
    setError(null);
    const problem = contentProblem() ?? audienceProblem();
    if (problem) {
      setError(problem);
      return false;
    }

    setIsSubmitting(true);
    try {
      onTaskAssigned(buildAssignment());
      onOpenChange(false);
      // Reset form
      setInstructions("");
      setFocusWordsInput("");
      setDueDate("");
      setSelectedStudentIds([]);
      setCoachWithDavid(false);
      setSelectionMode("specific");
      setSelectedLevel("all");
      setSelectedGrade("all");
      setClassTargetScope("all");
      setSelectedClass("");
      setSelectedGroup(null);
      setCustomTitle("");
      setCustomHebrewTitle("");
      setVocabSearchQuery("");
      setShowAddCustomWord(false);
      return true;
    } catch (err) {
      console.error("Error creating assignment:", err);
      setError("שגיאה ביצירת המשימה. אנא נסו שוב.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // context
    students,
    classList,
    hasTemplate: !!initialAssignmentTemplate || !!preselectedVocabBank,
    // what & which content
    taskType,
    handleTypeChange,
    selectedGrade,
    handleGradeChange,
    vocabGrade,
    selectedLevel,
    setSelectedLevel,
    handleLevelChange,
    coachWithDavid,
    selectionMode,
    setSelectionMode,
    selectedTaskId,
    setSelectedTaskId,
    availableWritingTasks,
    availableUnseens,
    availableConversations,
    customTitle,
    setCustomTitle,
    customHebrewTitle,
    setCustomHebrewTitle,
    // grammar
    grammarTopicIds,
    setGrammarTopicIds,
    grammarTypes,
    setGrammarTypes,
    grammarItemCount,
    setGrammarItemCount,
    // vocabulary
    vocabSourceMode,
    setVocabSourceMode,
    selectedBankGradeFilter,
    setSelectedBankGradeFilter,
    effectiveCustomBanks,
    filteredCustomBanks,
    selectedVocabWords,
    setSelectedVocabWords,
    vocabSearchQuery,
    setVocabSearchQuery,
    filteredVocabWordPool,
    customVocabEng,
    setCustomVocabEng,
    customVocabHeb,
    setCustomVocabHeb,
    customVocabExample,
    setCustomVocabExample,
    showAddCustomWord,
    setShowAddCustomWord,
    applyVocabPreset,
    applyCustomBank,
    handleToggleVocabWord,
    handleRemoveVocabWord,
    handleAddCustomWord,
    // who
    targetType,
    setTargetType,
    classTargetScope,
    setClassTargetScope,
    selectedClass,
    setSelectedClass,
    selectedGroup,
    setSelectedGroup,
    selectedStudentIds,
    setSelectedStudentIds,
    studentFilterClass,
    setStudentFilterClass,
    studentSearchQuery,
    setStudentSearchQuery,
    classStudentsList,
    filteredIndividualStudents,
    matchingStudentsCount,
    handleStudentToggle,
    handleSelectAllFilteredStudents,
    handleDeselectAllFilteredStudents,
    // extras
    instructions,
    setInstructions,
    dueDate,
    setDueDate,
    isShared,
    setIsShared,
    // submit
    isSubmitting,
    error,
    setError,
    contentProblem,
    audienceProblem,
    assignmentTitles,
    buildAssignment,
    submit,
  };
}

export type AssignTaskForm = ReturnType<typeof useAssignTaskForm>;
