"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ExamLive } from "@/components/teacher-dashboard/exams/exam-live";

export default function ExamLivePage() {
  const { examId } = useParams<{ examId: string }>();
  return <ExamLive examId={examId} />;
}
