"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Copy, FileText, Mail, Pencil, PencilLine, Plus, Printer, Share2, Trash2, Undo2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { EmptyState } from "@/components/teacher-dashboard/shared-ui/empty-state";
import { useConfirm } from "@/components/teacher-dashboard/shared-ui/confirm-dialog";
import { useTeacherSession } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { PrintBooklet } from "@/components/print/print-sheet-parts";
import { GRADE_LABELS, LEVEL_NAME_HE } from "@/lib/levels";
import { deleteWorksheet, loadWorksheets, saveWorksheet } from "@/lib/worksheet-storage";
import { PART_LABEL } from "@/lib/worksheet/labels";
import { sectionSize } from "@/lib/worksheet/build";
import type { Worksheet, WorksheetContent } from "@/lib/worksheet/types";
import { copySharedToMine, loadSharedWorksheets, shareWorksheet, unshareWorksheet, type SharedWorksheet } from "@/lib/worksheet-sharing";
import { SharedLibrary } from "@/components/worksheet/shared-library";
import { WorksheetAllVersions } from "@/components/worksheet/worksheet-document";
import { SendToPrintDialog } from "@/components/worksheet/send-to-print-dialog";
import { RenameWorksheetDialog } from "@/components/worksheet/rename-worksheet-dialog";
import { BodyPortal } from "@/components/worksheet/print-portal";
import { WORKSHEETS_HREF } from "@/components/worksheet/wizard/worksheet-wizard";
import { readDraft, stepsFor } from "@/components/worksheet/wizard/use-worksheet-wizard";
import { PART_ICON } from "@/components/worksheet/wizard/steps";

const dateHe = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("he-IL", { day: "numeric", month: "numeric", year: "numeric" });
  } catch {
    return "";
  }
};

function WorksheetCard({
  w,
  onPrint,
  onSend,
  onRename,
  onDelete,
  shared,
  onShare,
  onUnshare,
}: {
  w: Worksheet;
  onPrint: () => void;
  onSend: () => void;
  onRename: () => void;
  onDelete: () => void;
  shared: boolean;
  onShare: () => void;
  onUnshare: () => void;
}) {
  const questions = w.sections.reduce((n, s) => n + sectionSize(s), 0);
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <h3 className="text-lg font-bold text-foreground" dir="auto">
            {w.title}
          </h3>
          {shared && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">
              <Users className="size-3.5" />
              משותף עם המורים
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {GRADE_LABELS[w.settings.grade].he} · {LEVEL_NAME_HE[w.settings.level]} · {questions} שאלות · נשמר {dateHe(w.updatedAt)}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {w.sections.map((s, i) => (
            <span key={i} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
              {PART_ICON[s.kind]} {PART_LABEL[s.kind].he}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-2">
        <Button className="h-10 gap-1.5" onClick={onPrint}>
          <Printer className="size-4" />
          הדפסה
        </Button>
        <Button className="h-10 gap-1.5" variant="secondary" onClick={onSend}>
          <Mail className="size-4" />
          שליחה להדפסה
        </Button>
        <Link
          href={`${WORKSHEETS_HREF}/new?edit=${encodeURIComponent(w.id)}`}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted"
        >
          <Pencil className="size-4" />
          עריכה
        </Link>
        <Link
          href={`${WORKSHEETS_HREF}/new?from=${encodeURIComponent(w.id)}`}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted"
        >
          <Copy className="size-4" />
          שכפול ושינוי
        </Link>
        {shared ? (
          <Button className="col-span-2 h-10 gap-1.5" variant="outline" onClick={onUnshare}>
            <Undo2 className="size-4" />
            הפסקת השיתוף עם המורים
          </Button>
        ) : (
          <Button className="col-span-2 h-10 gap-1.5" variant="outline" onClick={onShare}>
            <Share2 className="size-4" />
            שיתוף עם כל המורים
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onRename}
          className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <PencilLine className="size-3.5" />
          שינוי שם
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
          מחיקת הדף
        </button>
      </div>
    </div>
  );
}

export default function WorksheetsPage() {
  const { user } = useTeacherSession();
  const confirm = useConfirm();
  const [list, setList] = useState<Worksheet[] | null>(null);
  const [printing, setPrinting] = useState<WorksheetContent | null>(null);
  const [sending, setSending] = useState<WorksheetContent | null>(null);
  const [renaming, setRenaming] = useState<Worksheet | null>(null);
  const [tab, setTab] = useState<"mine" | "shared">("mine");
  /** The school library: undefined while loading, null if it couldn't be reached. */
  const [shared, setShared] = useState<SharedWorksheet[] | null | undefined>(undefined);
  const mySharedById = new Map((shared ?? []).filter((s) => s.ownerId === user.id).map((s) => [s.id, s]));
  // Dashboard pages only render in the browser (after the sign-in gate), so localStorage is available.
  const [hasDraft] = useState(() => {
    const draft = readDraft(user.id);
    // Worth offering only if the teacher got past the first questions.
    return !!draft && stepsFor(draft.settings).indexOf(draft.step) >= 2 && !draft.id;
  });

  const refresh = useCallback(async () => setList(await loadWorksheets(user.id)), [user.id]);

  const refreshShared = useCallback(async () => setShared(await loadSharedWorksheets()), []);

  useEffect(() => {
    loadWorksheets(user.id).then(setList);
    loadSharedWorksheets().then(setShared);
  }, [user.id]);

  // Print once the chosen sheet is in the print portal.
  useEffect(() => {
    if (!printing) return;
    const t = setTimeout(() => window.print(), 150);
    const done = () => setPrinting(null);
    window.addEventListener("afterprint", done, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", done);
    };
  }, [printing]);

  const remove = async (w: Worksheet) => {
    const isShared = mySharedById.has(w.id);
    const ok = await confirm({
      title: `למחוק את "${w.title}"?`,
      description: isShared ? "אי אפשר לשחזר דף שנמחק. הדף יוסר גם מספריית המורים." : "אי אפשר לשחזר דף שנמחק.",
      confirmLabel: "מחיקה",
      destructive: true,
    });
    if (!ok) return;
    await deleteWorksheet(user.id, w.id);
    if (isShared) {
      await unshareWorksheet(w.id);
      void refreshShared();
    }
    toast.success("הדף נמחק");
    void refresh();
  };

  const share = async (w: Worksheet) => {
    const ok = await confirm({
      title: `לשתף את "${w.title}" עם כל המורים?`,
      description:
        "כל המורים בבית הספר יראו את הדף בלשונית \"ספריית המורים\" (כולל דף התשובות), ויוכלו להדפיס אותו או להעתיק אותו לדפים שלהם. אפשר להפסיק את השיתוף בכל זמן.",
      confirmLabel: "שיתוף",
    });
    if (!ok) return;
    if (await shareWorksheet(w, user.name)) {
      toast.success("הדף שותף עם כל המורים");
      void refreshShared();
    } else {
      toast.error("לא הצלחנו לשתף את הדף. בדקו את החיבור לאינטרנט ונסו שוב.");
    }
  };

  const unshare = async (id: string) => {
    if (await unshareWorksheet(id)) {
      toast.success("הדף הוסר מספריית המורים");
      void refreshShared();
    } else {
      toast.error("לא הצלחנו להסיר את הדף מהספרייה. נסו שוב.");
    }
  };

  const copyToMine = async (s: SharedWorksheet) => {
    const { cloud } = await copySharedToMine(s, user.id);
    void refresh();
    const action = { label: "להצגה", onClick: () => setTab("mine") };
    if (cloud) toast.success(`"${s.title}" נוסף לדפים שלכם`, { action });
    else toast.warning("הדף נוסף לדפים שלכם במחשב הזה בלבד (אין חיבור לשרת כרגע)", { action });
  };

  // The list name and the heading printed on the sheet are the same title.
  const rename = async (w: Worksheet, title: string) => {
    const renamed: Worksheet = {
      ...w,
      title,
      settings: { ...w.settings, layout: { ...w.settings.layout, title } },
      updatedAt: new Date().toISOString(),
    };
    const { cloud } = await saveWorksheet(renamed);
    const sharedCopy = mySharedById.get(w.id);
    if (sharedCopy) {
      await shareWorksheet(renamed, sharedCopy.ownerName, sharedCopy.sharedAt);
      void refreshShared();
    }
    if (cloud) toast.success("השם עודכן");
    else toast.warning("השם עודכן במחשב הזה בלבד – לא הצלחנו לשמור בענן");
    void refresh();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6 print:hidden">
        <PageHeader
          title="דפי עבודה"
          description="יוצרים דף עבודה להדפסה בכמה שאלות פשוטות: שכבה, רמה, נושאים וכמה שאלות. אפשר להדפיס או לשלוח ישר לצילום."
        />

        <div className="flex flex-wrap gap-3">
          <Link
            href={`${WORKSHEETS_HREF}/new?fresh=1`}
            className="inline-flex h-14 items-center gap-2 rounded-2xl bg-primary px-6 text-lg font-bold text-primary-foreground hover:bg-primary/85"
          >
            <Plus className="size-6" />
            דף עבודה חדש
          </Link>
          {hasDraft && (
            <Link
              href={`${WORKSHEETS_HREF}/new`}
              className="inline-flex h-14 items-center gap-2 rounded-2xl border-2 border-primary/50 px-5 text-base font-semibold text-foreground hover:bg-muted"
            >
              <Pencil className="size-5" />
              להמשיך את הדף שהתחלתם
            </Link>
          )}
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "mine" | "shared")} className="gap-4">
          <TabsList className="h-11">
            <TabsTrigger value="mine" className="h-9 px-4 text-base">
              <FileText className="size-4" />
              דפי העבודה שלי
            </TabsTrigger>
            <TabsTrigger value="shared" className="h-9 px-4 text-base">
              <Users className="size-4" />
              ספריית המורים
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mine">
            {list === null ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))}
              </div>
            ) : list.length === 0 ? (
              <EmptyState icon={FileText} title="עדיין אין דפי עבודה" description='לחצו על "דף עבודה חדש" כדי ליצור את הדף הראשון שלכם.' />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((w) => (
                  <WorksheetCard
                    key={w.id}
                    w={w}
                    onPrint={() => setPrinting(w)}
                    onSend={() => setSending(w)}
                    onRename={() => setRenaming(w)}
                    onDelete={() => remove(w)}
                    shared={mySharedById.has(w.id)}
                    onShare={() => share(w)}
                    onUnshare={() => unshare(w.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shared">
            <p className="mb-4 text-sm text-muted-foreground">
              דפים שמורים בבית הספר שיתפו. אפשר להדפיס אותם, או להעתיק לדפים שלכם כדי לשנות אותם.
            </p>
            <SharedLibrary
              list={shared}
              teacherId={user.id}
              onPrint={setPrinting}
              onSend={setSending}
              onCopy={copyToMine}
              onUnshare={(s) => unshare(s.id)}
              onRetry={() => {
                setShared(undefined);
                void refreshShared();
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {renaming && (
        <RenameWorksheetDialog
          key={renaming.id}
          currentTitle={renaming.title}
          onRename={(title) => rename(renaming, title)}
          onClose={() => setRenaming(null)}
        />
      )}

      {sending && <SendToPrintDialog open onOpenChange={(o) => !o && setSending(null)} content={sending} />}

      {printing && (
        <BodyPortal>
          <PrintBooklet>
            <WorksheetAllVersions content={printing} withKey={printing.settings.layout.answerKey} />
          </PrintBooklet>
        </BodyPortal>
      )}
    </div>
  );
}
