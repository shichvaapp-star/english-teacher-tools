"use client";

import React, { useState } from "react";
import { Loader2, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const MAX_TITLE_LENGTH = 80;

/** Asks for a new name for a saved worksheet. The name is also the heading printed on the sheet. */
export function RenameWorksheetDialog({
  currentTitle,
  onRename,
  onClose,
}: {
  currentTitle: string;
  onRename: (title: string) => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(currentTitle);
  const [busy, setBusy] = useState(false);
  const trimmed = title.trim();
  const canSave = !!trimmed && trimmed !== currentTitle && !busy;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    setBusy(true);
    try {
      await onRename(trimmed);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent
        dir="rtl"
        // The close button sits top-right by default, on top of the title icon in RTL.
        className="sm:max-w-md [&>[data-slot=dialog-close]]:right-auto [&>[data-slot=dialog-close]]:left-2"
        showCloseButton={!busy}
      >
        <DialogHeader className="text-start">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <PencilLine className="size-5" />
            שינוי שם הדף
          </DialogTitle>
          <DialogDescription>השם מופיע ברשימת הדפים שלכם וגם בראש הדף המודפס.</DialogDescription>
        </DialogHeader>

        <form onSubmit={save} className="space-y-4">
          <Input
            autoFocus
            dir="auto"
            value={title}
            maxLength={MAX_TITLE_LENGTH}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            placeholder="English Worksheet"
            className="h-11 text-base"
            aria-label="שם הדף"
          />
          <div className="grid grid-cols-2 gap-2">
            <Button type="submit" className="h-11 gap-2 text-base" disabled={!canSave}>
              {busy && <Loader2 className="size-4 animate-spin" />}
              שמירה
            </Button>
            <Button type="button" variant="outline" className="h-11 text-base" onClick={onClose} disabled={busy}>
              ביטול
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
