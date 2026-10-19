import { StudentGroup } from "./auth";

export type AssignmentTargetType = "all" | "class" | "group" | "students";
export type ExerciseLevel = "Level 1" | "Level 2" | "Level 3";

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  type: "writing" | "unseen";
  title: string;
  hebrewTitle: string;
  taskId?: string; // ID of specific writing task or unseen passage
  level?: ExerciseLevel; // Selected exercise level: Level 1, Level 2, or Level 3
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
}

