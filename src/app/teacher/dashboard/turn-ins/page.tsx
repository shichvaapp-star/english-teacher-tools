"use client";

import React, { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { SegmentedControl } from "@/components/teacher-dashboard/shared-ui/segmented-control";
import { Skeleton } from "@/components/ui/skeleton";
import { TurnInsInbox } from "@/components/teacher-dashboard/inbox/turn-ins-inbox";
import { AssignmentsByProgress } from "@/components/teacher-dashboard/assignments/assignments-by-progress";
import { useDashboard } from "@/components/teacher-dashboard/teacher-dashboard-context";

type View = "inbox" | "assignments";

function TurnInsContent() {
  const c = useDashboard();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view: View = searchParams.get("view") === "assignments" ? "assignments" : "inbox";

  return (
    <div className="space-y-5">
      <PageHeader
        title="הגשות"
        description={
          c.pendingSubmissionsCount > 0
            ? `${c.pendingSubmissionsCount} הגשות ממתינות לבדיקה`
            : "כל ההגשות נבדקו"
        }
        actions={
          <SegmentedControl<View>
            aria-label="תצוגה"
            value={view}
            onChange={(v) => router.replace(v === "inbox" ? pathname : `${pathname}?view=assignments`, { scroll: false })}
            options={[
              { value: "inbox", label: "תיבת בדיקה" },
              { value: "assignments", label: "לפי משימה" },
            ]}
          />
        }
      />
      {view === "inbox" ? <TurnInsInbox /> : <AssignmentsByProgress />}
    </div>
  );
}

export default function TurnInsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
      <TurnInsContent />
    </Suspense>
  );
}
