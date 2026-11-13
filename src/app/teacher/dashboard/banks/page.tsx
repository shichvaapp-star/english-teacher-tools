"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { useDashboard } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { CustomVocabBanksView } from "../custom-vocab-banks-view";

export default function VocabBanksPage() {
  const c = useDashboard();
  const totalWords = c.vocabBanks.reduce((n, b) => n + (b.words?.length || 0), 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title="מאגרי מילים"
        description={`${c.vocabBanks.length} מאגרים · ${totalWords} מילים. ייבוא מ-Word, Excel או CSV, שיתוף עם מורים והקצאה לתלמידים.`}
        actions={
          <Button onClick={() => c.openBankModal()} className="gap-1.5">
            <Plus className="size-4" />
            מאגר חדש / ייבוא
          </Button>
        }
      />
      <CustomVocabBanksView
        banks={c.vocabBanks}
        onOpenCreateModal={() => c.openBankModal()}
        onEditBank={(bank) => c.openBankModal(bank)}
        onDeleteBank={c.handleDeleteVocabBank}
        onAssignFromBank={(bank) => c.openAssignModal({ bank })}
        onToggleShare={c.handleToggleShareBank}
      />
    </div>
  );
}
