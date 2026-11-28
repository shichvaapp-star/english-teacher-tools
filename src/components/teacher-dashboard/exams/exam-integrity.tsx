"use client";

// After the exam: who may have copied from whom (essay similarity, with seat
// neighbours highlighted), each student's locks and warnings, and the typing replay.

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "cn";
import { useTeacherSession } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { DASHBOARD_BASE, examHref } from "@/components/teacher-dashboard/shell/nav-items";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KeystrokeReplay } from "./keystroke-replay";
import { loadTeacherExam, subscribeExamSessions, type TeacherExamBundle } from "@/lib/exam/exam-storage";
import { compareAll, ignoredShingles, sharedWordMask, similarityLevel, type SimilarityPair } from "@/lib/exam/similarity";
import { neighbourPairs, pairKey } from "@/lib/exam/seat-plan";
import type { ExamSessionDoc } from "@/types/exam";
import { PlayCircle, Users } from "lucide-react";

const LEVEL_STYLE = {
  high: "border-destructive/50 bg-destructive/10 text-destructive",
  medium: "border-warning/50 bg-warning/10 text-foreground",
  low: "border-border text-muted-foreground",
};
const LEVEL_LABEL = { high: "גבוה", medium: "בינוני", low: "נמוך" };

/** The essay with the words shared with `other` highlighted. */
function HighlightedEssay({ text, other, ignore }: { text: string; other: string; ignore: Set<string> }) {
  const mask = useMemo(() => sharedWordMask(text, other, ignore), [text, other, ignore]);
  const parts: React.ReactNode[] = [];
  let last = 0;
  let w = 0;
  for (const m of text.matchAll(/[A-Za-z][A-Za-z'’]*/g)) {
    const i = m.index ?? 0;
    if (i > last) parts.push(text.slice(last, i));
    parts.push(
      <span key={i} className={mask[w] ? "rounded-sm bg-destructive/20" : undefined}>
        {m[0]}
      </span>
    );
    w++;
    last = i + m[0].length;
  }
  parts.push(text.slice(last));
  return (
    <div dir="ltr" className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border p-3 text-start text-sm leading-relaxed">
      {parts}
    </div>
  );
}

export function ExamIntegrity({ examId }: { examId: string }) {
  const { user } = useTeacherSession();
  const [bundle, setBundle] = useState<TeacherExamBundle | null | undefined>(undefined);
  const [sessions, setSessions] = useState<ExamSessionDoc[] | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [pair, setPair] = useState<SimilarityPair | null>(null);
  const [replayFor, setReplayFor] = useState<ExamSessionDoc | null>(null);

  useEffect(() => {
    loadTeacherExam(examId).then(setBundle).catch(() => setBundle(null));
  }, [examId]);
  useEffect(() => subscribeExamSessions(examId, user.id, setSessions), [examId, user.id]);

  const prompts = useMemo(
    () => (bundle ? bundle.variants.flatMap((v) => [v.title, v.prompt]) : []),
    [bundle]
  );
  const ignore = useMemo(() => ignoredShingles(prompts), [prompts]);
  const pairs = useMemo(
    () => (sessions ? compareAll(sessions.map((s) => ({ studentId: s.studentId, text: s.text })), prompts) : []),
    [sessions, prompts]
  );
  const neighbours = useMemo(() => neighbourPairs(bundle?.exam.seatPlan), [bundle]);
  const byId = useMemo(() => new Map((sessions ?? []).map((s) => [s.studentId, s])), [sessions]);

  if (bundle === undefined || sessions === null) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (bundle === null) return <p className="text-sm text-muted-foreground">המבחן לא נמצא.</p>;

  const { exam } = bundle;
  const visiblePairs = showAll ? pairs : pairs.filter((p) => similarityLevel(p) !== "low");
  const topFor = (studentId: string) => pairs.find((p) => p.a === studentId || p.b === studentId);
  const name = (id: string) => byId.get(id)?.studentName ?? "?";
  const sorted = [...sessions].sort((a, b) => a.studentName.localeCompare(b.studentName, "he"));

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={
          <>
            <Link href={`${DASHBOARD_BASE}/exams`}>מבחנים</Link> / <Link href={examHref(exam.id)}>{exam.title}</Link>
          </>
        }
        title="בדיקת העתקות והקלדה"
        description="השוואה בין כל זוגות החיבורים לפי רצפים משותפים של 4 מילים ולפי הרצף הזהה הארוך ביותר. משפטים מתוך הנושא עצמו וצירופים של מילות קישור בלבד לא נספרים."
      />

      <Card>
        <CardHeader>
          <CardTitle>זוגות חשודים</CardTitle>
          <CardDescription>
            {pairs.length} זוגות נבדקו. זוג של שכנים במפת הישיבה מסומן – זה הסימן החזק ביותר. גם דמיון גבוה הוא רק סימן: כדאי לקרוא את שני החיבורים.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {visiblePairs.length === 0 ? (
            <p className="text-sm text-muted-foreground">לא נמצאו זוגות עם דמיון בולט.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>תלמידים</TableHead>
                  <TableHead>דמיון</TableHead>
                  <TableHead>רצף זהה ארוך</TableHead>
                  <TableHead>רמה</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiblePairs.map((p) => {
                  const level = similarityLevel(p);
                  const isNeighbour = neighbours.has(pairKey(p.a, p.b));
                  return (
                    <TableRow key={`${p.a}-${p.b}`}>
                      <TableCell className="font-medium">
                        {name(p.a)} ↔ {name(p.b)}
                        {isNeighbour && (
                          <Badge variant="outline" className="ms-2 gap-1 border-warning/50 text-3xs">
                            <Users className="h-3 w-3" />
                            שכנים
                          </Badge>
                        )}
                        {byId.get(p.a)?.variantKey !== byId.get(p.b)?.variantKey && (
                          <span className="ms-2 text-3xs text-muted-foreground">(נושאים שונים)</span>
                        )}
                      </TableCell>
                      <TableCell className="tabular-nums">{Math.round(p.score * 100)}%</TableCell>
                      <TableCell className="tabular-nums">{p.longestRun} מילים</TableCell>
                      <TableCell>
                        <span className={cn("rounded-full border px-2 py-0.5 text-xs", LEVEL_STYLE[level])}>{LEVEL_LABEL[level]}</span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => setPair(p)}>
                          השוואה
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          {pairs.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setShowAll((s) => !s)}>
              {showAll ? "הצגת החשודים בלבד" : `הצגת כל ${pairs.length} הזוגות`}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>לפי תלמיד/ה</CardTitle>
          <CardDescription>נעילות (יציאה מהמסך, הדבקה וכו׳), התראות, והדמיון הגבוה ביותר לחיבור אחר. &quot;הקלטה&quot; מראה איך החיבור נכתב.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם</TableHead>
                <TableHead>נושא</TableHead>
                <TableHead>מילים</TableHead>
                <TableHead>מהרשימה</TableHead>
                <TableHead>נעילות</TableHead>
                <TableHead>התראות</TableHead>
                <TableHead>דמיון מרבי</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((s) => {
                const locks = s.events?.filter((e) => e.severity === "lock").length ?? 0;
                const flags = s.events?.filter((e) => e.severity === "flag").length ?? 0;
                const top = topFor(s.studentId);
                const level = top ? similarityLevel(top) : "low";
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.studentName}</TableCell>
                    <TableCell>{s.variantKey}</TableCell>
                    <TableCell className="tabular-nums">{s.wordCount}</TableCell>
                    <TableCell className={cn("tabular-nums", (s.vocabUsedIds?.length ?? 0) >= exam.minVocabUsed && "text-success")}>
                      {s.vocabUsedIds?.length ?? 0}/{exam.minVocabUsed}
                    </TableCell>
                    <TableCell className={cn("tabular-nums", locks > 0 && "font-bold text-destructive")}>{locks}</TableCell>
                    <TableCell className="tabular-nums">{flags}</TableCell>
                    <TableCell>
                      {top ? (
                        <button type="button" onClick={() => setPair(top)} className={cn("rounded-full border px-2 py-0.5 text-xs", LEVEL_STYLE[level])}>
                          {Math.round(top.score * 100)}% · {name(top.a === s.studentId ? top.b : top.a)}
                        </button>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => setReplayFor(s)}>
                        <PlayCircle />
                        הקלטה
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={Boolean(pair)} onOpenChange={(o) => !o && setPair(null)}>
        <DialogContent dir="rtl" className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              {pair && `${name(pair.a)} ↔ ${name(pair.b)} · ${Math.round(pair.score * 100)}% · רצף של ${pair.longestRun} מילים`}
            </DialogTitle>
          </DialogHeader>
          {pair && (
            <div className="grid gap-3 md:grid-cols-2">
              {[pair.a, pair.b].map((id, i) => (
                <div key={id} className="space-y-1">
                  <div className="text-sm font-bold">
                    {name(id)} <span className="font-normal text-muted-foreground">· נושא {byId.get(id)?.variantKey}</span>
                  </div>
                  <HighlightedEssay
                    text={byId.get(id)?.text ?? ""}
                    other={byId.get(i === 0 ? pair.b : pair.a)?.text ?? ""}
                    ignore={ignore}
                  />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(replayFor)} onOpenChange={(o) => !o && setReplayFor(null)}>
        <DialogContent dir="rtl" className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>הקלטת הכתיבה – {replayFor?.studentName}</DialogTitle>
          </DialogHeader>
          {replayFor && <KeystrokeReplay session={replayFor} teacherId={user.id} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
