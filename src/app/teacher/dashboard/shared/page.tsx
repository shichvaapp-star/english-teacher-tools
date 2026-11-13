"use client";

import React from "react";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { useDashboard } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { SharedResourcesView } from "../shared-resources-view";

export default function SharedLibraryPage() {
  const c = useDashboard();
  return (
    <div className="space-y-6">
      <PageHeader title="מאגר משותף" description="משימות ומאגרי מילים שמורים אחרים שיתפו. אפשר להקצות אותם ישירות או לשכפל למאגר שלך." />
      <SharedResourcesView
        onAssignFromBank={(bank) => c.openAssignModal({ bank })}
        onUseSharedAssignment={(template) => c.openAssignModal({ template })}
        onBankCloned={c.fetchVocabBanks}
      />
    </div>
  );
}
