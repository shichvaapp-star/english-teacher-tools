"use client";

import React from "react";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { EmptyState } from "@/components/teacher-dashboard/shared-ui/empty-state";
import { useDashboard } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { ShieldCheck } from "lucide-react";
import { AdminSuggestionsView } from "../../admin-suggestions-view";

export default function AdminSuggestionsPage() {
  const c = useDashboard();
  if (!c.user?.isAdmin) {
    return <EmptyState icon={ShieldCheck} title="אזור למנהלי מערכת בלבד" />;
  }
  return (
    <div className="space-y-6">
      <PageHeader title="הצעות ומשוב" description="הצעות לתיקון תוכן ומשוב שנשלחו מהאתר." />
      <AdminSuggestionsView
        suggestions={c.suggestions}
        onRefresh={c.fetchSuggestions}
        isLoading={c.isLoadingSuggestions}
        onUpdateSuggestion={c.handleUpdateSuggestion}
        onDeleteSuggestion={c.handleDeleteSuggestion}
      />
    </div>
  );
}
