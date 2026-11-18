import { StudentGroup } from "./auth";
import type { GrammarExerciseType } from "./grammar";

export type AssignmentTargetType = "all" | "class" | "group" | "students";
export type ExerciseLevel = "Level 1" | "Level 2" | "Level 3";
export type AssignmentType = "writing" | "unseen" | "vocab" | "conversation" | "grammar";

export interface GrammarAssignmentConfig {
  /** One topic, or several for a mixed review. */
  topicIds: string[];
  /** Empty / missing = the usual mix for the level. */
  exerciseTypes?: GrammarExerciseType[];
  /** Number of items (default: all items of the level). */
  itemCount?: number;
  /** Let students continue with AI "more practice" after the set. */
  allowAiPractice?: boolean;
}

export interface AssignedVocabWord {
  id: string;
  english: string;
  hebrew: string;
  partOfSpeech?: "noun" | "verb" | "adjective" | "adverb" | "preposition" | "phrase";
  example?: string;
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  type: AssignmentType;
  title: string;
  hebrewTitle: string;
  taskId?: string; // ID of specific writing task or unseen passage or preset vocab id
  vocabWords?: AssignedVocabWord[]; // Words pre-assigned by the teacher
  grammarConfig?: GrammarAssignmentConfig; // Grammar assignments only
  level?: ExerciseLevel; // Selected exercise level: Level 1, Level 2, or Level 3
  grade?: 7 | 8 | 9; // Content grade (textbook vocabulary); missing = each student's own choice
  isFreeChoice?: boolean;
  isAdaptiveDavid?: boolean; // David selects a task matching each student's personal level (Level 1/2/3)
  focusWords?: string[]; // Optional teacher-selected English words for David to pre-teach and quiz
  coachWithDavid?: boolean; // Whether David presents and coaches the assignment
  targetType: AssignmentTargetType;
  targetClass?: string; // e.g. "ח'2"
  targetGroup?: StudentGroup; // e.g. "א1" | "א2" | "ב"
  targetStudentIds?: string[];
  instructions?: string; // Custom teacher instructions/notes in Hebrew
  dueDate?: string; // ISO date or formatted date
  createdAt: string;
  status: "active" | "archived";
  isShared?: boolean; // When true, published to shared school/community library
  sharedAt?: string;
  authorSchoolName?: string;
}

