"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ExamResults } from "@/components/teacher-dashboard/exams/exam-results";

export default function ExamResultsPage() {
  const { examId } = useParams<{ examId: string }>();
  return <ExamResults examId={examId} />;
}
