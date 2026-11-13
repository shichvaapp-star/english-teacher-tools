"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, FileText, Search, User } from "lucide-react";
import { cn } from "cn";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDashboard } from "../teacher-dashboard-context";
import { DASHBOARD_BASE, assignmentHref, turnInHref } from "./nav-items";

interface SearchResult {
  id: string;
  kind: "student" | "assignment" | "submission";
  title: string;
  subtitle: string;
  href: string;
}

const KIND_ICON = { student: User, assignment: ClipboardList, submission: FileText } as const;
const KIND_LABEL = { student: "תלמידים", assignment: "משימות", submission: "הגשות" } as const;

/** ⌘K / Ctrl+K search across students, assignments and turn-ins. */
export function GlobalSearch() {
  const { students, assignments, submissions } = useDashboard();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const studentResults: SearchResult[] = students
      .filter((s) => s.name.toLowerCase().includes(q) || (s.fullClass || "").toLowerCase().includes(q))
      .slice(0, 5)
      .map((s) => ({
        id: `s-${s.id}`,
        kind: "student",
        title: s.name,
        subtitle: [s.fullClass, s.group && `הקבצה ${s.group}`].filter(Boolean).join(" · "),
        href: `${DASHBOARD_BASE}/students?student=${encodeURIComponent(s.id)}`,
      }));
    const assignmentResults: SearchResult[] = assignments
      .filter((a) => a.hebrewTitle.toLowerCase().includes(q) || a.title.toLowerCase().includes(q))
      .slice(0, 5)
      .map((a) => ({ id: `a-${a.id}`, kind: "assignment", title: a.hebrewTitle, subtitle: a.title, href: assignmentHref(a.id) }));
    const submissionResults: SearchResult[] = submissions
      .filter(
        (sub) =>
          sub.receiptCode?.toLowerCase().includes(q) ||
          sub.hebrewTitle.toLowerCase().includes(q) ||
          sub.taskTitle.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((sub) => ({
        id: `sub-${sub.id}`,
        kind: "submission",
        title: `${sub.studentName} · ${sub.hebrewTitle}`,
        subtitle: sub.receiptCode ? `קוד ${sub.receiptCode}` : sub.taskTitle,
        href: turnInHref(sub.id),
      }));
    return [...studentResults, ...assignmentResults, ...submissionResults];
  }, [query, students, assignments, submissions]);

  const go = (r: SearchResult) => {
    setOpen(false);
    setQuery("");
    router.push(r.href);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="hidden h-9 w-56 justify-start gap-2 text-muted-foreground md:inline-flex lg:w-72"
      >
        <Search className="size-4" />
        <span className="flex-1 text-right text-sm font-normal">חיפוש תלמיד, משימה או קוד…</span>
        <kbd className="rounded border border-border bg-muted px-1.5 font-mono text-3xs" dir="ltr">
          ⌘K
        </kbd>
      </Button>
      <Button variant="ghost" size="icon-lg" className="md:hidden" onClick={() => setOpen(true)} aria-label="חיפוש">
        <Search />
      </Button>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setQuery("");
        }}
      >
        <DialogContent className="top-[20%] translate-y-0 gap-0 p-0 sm:max-w-lg" showCloseButton={false} dir="rtl">
          <DialogTitle className="sr-only">חיפוש</DialogTitle>
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveIndex((i) => Math.min(i + 1, results.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIndex((i) => Math.max(i - 1, 0));
                } else if (e.key === "Enter" && results[activeIndex]) {
                  e.preventDefault();
                  go(results[activeIndex]);
                }
              }}
              placeholder="חיפוש תלמיד, משימה או קוד אישור…"
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-1.5">
            {query.trim() === "" ? (
              <p className="px-3 py-6 text-center text-xs text-muted-foreground">התחילו להקליד כדי לחפש</p>
            ) : results.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-muted-foreground">לא נמצאו תוצאות</p>
            ) : (
              results.map((r, idx) => {
                const Icon = KIND_ICON[r.kind];
                const showHeading = idx === 0 || results[idx - 1].kind !== r.kind;
                return (
                  <React.Fragment key={r.id}>
                    {showHeading && (
                      <div className="px-2.5 pt-2 pb-1 text-3xs font-semibold text-muted-foreground">{KIND_LABEL[r.kind]}</div>
                    )}
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => go(r)}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-right",
                        idx === activeIndex ? "bg-accent text-accent-foreground" : "text-foreground"
                      )}
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{r.title}</span>
                        {r.subtitle && <span className="block truncate text-2xs text-muted-foreground">{r.subtitle}</span>}
                      </span>
                    </button>
                  </React.Fragment>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
