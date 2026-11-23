"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { SegmentedControl } from "@/components/teacher-dashboard/shared-ui/segmented-control";
import { useDashboard } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { CLASS_GRADES } from "@/lib/levels";
import { textbookBankCopy, textbookBanks } from "@/lib/textbook-vocab-banks";
import { CustomVocabBanksView } from "../custom-vocab-banks-view";
import { TextbookVocabBanksView } from "../textbook-vocab-banks-view";

type BanksTab = "textbook" | "mine";

const TEXTBOOK_UNIT_COUNT = CLASS_GRADES.reduce((n, g) => n + textbookBanks(g).length, 0);

export default function VocabBanksPage() {
  const c = useDashboard();
  const [tab, setTab] = useState<BanksTab>("textbook");
  const totalWords = c.vocabBanks.reduce((n, b) => n + (b.words?.length || 0), 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title="מאגרי מילים"
        description={
          tab === "textbook"
            ? "אוצר המילים מספרי הלימוד של כל שכבה, מחולק ליחידות. אפשר להקצות יחידה לתלמידים, לייצא, או להעתיק למאגרים שלך ולערוך."
            : `${c.vocabBanks.length} מאגרים · ${totalWords} מילים. ייבוא מ-Word, Excel או CSV, שיתוף עם מורים והקצאה לתלמידים.`
        }
        actions={
          <Button onClick={() => c.openBankModal()} className="gap-1.5">
            <Plus className="size-4" />
            מאגר חדש / ייבוא
          </Button>
        }
      />
      <SegmentedControl<BanksTab>
        aria-label="סוג מאגר"
        value={tab}
        onChange={setTab}
        options={[
          { value: "textbook", label: "מספרי הלימוד", count: TEXTBOOK_UNIT_COUNT },
          { value: "mine", label: "המאגרים שלי", count: c.vocabBanks.length },
        ]}
      />
      {tab === "textbook" ? (
        <TextbookVocabBanksView
          onAssignFromBank={(bank) => c.openAssignModal({ bank })}
          onCopyBank={(bank) => c.user && c.openBankModal(textbookBankCopy(bank, c.user.id))}
        />
      ) : (
        <CustomVocabBanksView
          banks={c.vocabBanks}
          onOpenCreateModal={() => c.openBankModal()}
          onEditBank={(bank) => c.openBankModal(bank)}
          onDeleteBank={c.handleDeleteVocabBank}
          onAssignFromBank={(bank) => c.openAssignModal({ bank })}
          onToggleShare={c.handleToggleShareBank}
        />
      )}
    </div>
  );
}
