"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ExamIntegrity } from "@/components/teacher-dashboard/exams/exam-integrity";

export default function ExamIntegrityPage() {
  const { examId } = useParams<{ examId: string }>();
  return <ExamIntegrity examId={examId} />;
}
