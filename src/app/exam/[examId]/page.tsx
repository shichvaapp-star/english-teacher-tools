"use client";

import { useParams } from "next/navigation";
import { ExamRunner } from "@/components/exam/exam-runner";

export default function ExamPage() {
  const params = useParams<{ examId: string }>();
  return <ExamRunner examId={params.examId} />;
}
