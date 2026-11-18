"use client";

import React, { useCallback, useState, useSyncExternalStore } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth-context";
import {
  DRAFTS_CHANGED_EVENT,
  deleteDraft,
  getDraftById,
  suspendDraftSaves,
} from "@/lib/drafts-storage";

function subscribe(onChange: () => void) {
  window.addEventListener(DRAFTS_CHANGED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(DRAFTS_CHANGED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * "Discard" button shown next to "Save & exit" whenever a saved draft exists for
 * the current exercise. After confirmation it deletes the draft (locally and in
 * Firestore) and leaves the exercise, like "Save & exit" does.
 */
export function DiscardDraftButton({ draftId }: { draftId: string }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const getSnapshot = useCallback(() => getDraftById(draftId) !== null, [draftId]);
  const hasDraft = useSyncExternalStore(subscribe, getSnapshot, () => false);

  if (!hasDraft && !busy) return null;

  const handleDiscard = async () => {
    setBusy(true);
    suspendDraftSaves();
    await deleteDraft(draftId, user?.id);
    window.location.replace(user?.role === "student" ? "/student" : "/");
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={busy}
        className="h-8 text-xs font-bold gap-1 cursor-pointer border-border/80 text-destructive hover:text-destructive"
        title="מחק את הטיוטה השמורה וצא"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">מחק טיוטה</span>
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader className="sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-right">
            <AlertDialogTitle>למחוק את הטיוטה?</AlertDialogTitle>
            <AlertDialogDescription>
              כל התשובות וההתקדמות שנשמרו בתרגיל הזה יימחקו, ולא יהיה אפשר לשחזר אותן.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>ביטול</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDiscard} disabled={busy}>
              מחק וצא
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
