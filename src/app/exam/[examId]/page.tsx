"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ExamRunner } from "@/components/exam/exam-runner";

function ExamPageInner() {
  const params = useParams<{ examId: string }>();
  const search = useSearchParams();
  return <ExamRunner examId={params.examId} preview={search.get("preview") === "1"} />;
}

export default function ExamPage() {
  return (
    <Suspense fallback={null}>
      <ExamPageInner />
    </Suspense>
  );
}
