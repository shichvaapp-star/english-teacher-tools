// Which students an exam is for – same targeting rules as assignments.

import { sameClass } from "@/lib/class-names";
import type { ExamDoc } from "@/types/exam";
import type { StudentGroup } from "@/types/auth";

interface StudentLike {
  id: string;
  fullClass?: string;
  classGrade?: string;
  group?: StudentGroup;
}

export function isStudentTargeted(
  exam: Pick<ExamDoc, "targetType" | "targetClass" | "targetGroup" | "targetStudentIds">,
  student: StudentLike
): boolean {
  switch (exam.targetType) {
    case "all":
      return true;
    case "class": {
      const classMatch =
        !exam.targetClass ||
        exam.targetClass === "all" ||
        sameClass(exam.targetClass, student.fullClass) ||
        exam.targetClass === student.classGrade;
      const groupMatch = !exam.targetGroup || exam.targetGroup === student.group;
      return Boolean(classMatch && groupMatch);
    }
    case "group":
      return !!student.group && exam.targetGroup === student.group;
    case "students":
      return !!exam.targetStudentIds?.includes(student.id);
    default:
      return false;
  }
}
