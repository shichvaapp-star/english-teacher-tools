import { StudentGroup } from "./auth";

export type AssignmentTargetType = "all" | "class" | "group" | "students";

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  type: "writing" | "unseen";
  title: string;
  hebrewTitle: string;
  taskId?: string; // ID of specific writing task or unseen passage
  isFreeChoice?: boolean;
  targetType: AssignmentTargetType;
  targetClass?: string; // e.g. "ח'2"
  targetGroup?: StudentGroup; // e.g. "א1" | "א2" | "ב"
  targetStudentIds?: string[];
  instructions?: string; // Custom teacher instructions/notes in Hebrew
  dueDate?: string; // ISO date or formatted date
  createdAt: string;
  status: "active" | "archived";
}

