"use client";

import React, { Suspense } from "react";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassTrackerGrid } from "@/components/teacher-dashboard/tracker/class-tracker-grid";

export default function TrackerPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="מעקב כיתתי" description="מי הגיש מה – כל התלמידים וכל המשימות של הכיתה בטבלה אחת. לחיצה על תא פותחת את ההגשה." />
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <ClassTrackerGrid />
      </Suspense>
    </div>
  );
}
