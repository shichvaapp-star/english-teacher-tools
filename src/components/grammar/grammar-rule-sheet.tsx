"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { HeText } from "@/components/grammar/he-text";
import type { FormRow, GrammarTopic, RulePoint } from "@/types/grammar";
import type { LevelNumber } from "@/lib/levels";

export type RuleLang = "he" | "en";

const FORM_SIGN: Record<FormRow["kind"], string> = {
  affirmative: "+",
  negative: "−",
  question: "?",
  short_answer: "↩",
};

const LABELS: Record<RuleLang, { form: string; words: string; watch: string }> = {
  he: { form: "התבנית", words: "מילים שמרמזות על הזמן", watch: "שימו לב" },
  en: { form: "Form", words: "Signal words", watch: "Watch out" },
};

/** English example: **x** is highlighted, a leading "✗ " marks a wrong sentence. */
function Example({ text }: { text: string }) {
  const wrong = text.startsWith("✗ ");
  const body = wrong ? text.slice(2) : text;
  const parts = body.split(/\*\*(.+?)\*\*/);
  return (
    <span className={cn(wrong && "text-destructive/80 line-through decoration-destructive/60")}>
      {wrong && <span className="no-underline mr-1.5 inline-block">✗</span>}
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-bold text-type-grammar">
            {p}
          </strong>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </span>
  );
}

function SectionLabel({ lang, children }: { lang: RuleLang; children: string }) {
  return (
    <p
      className={cn("text-xs font-bold uppercase tracking-wide text-muted-foreground", lang === "he" && "font-hebrew normal-case tracking-normal")}
      dir={lang === "he" ? "rtl" : "ltr"}
    >
      {children}
    </p>
  );
}

function PointBox({ point, index, lang }: { point: RulePoint; index: number; lang: RuleLang }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div
        className={cn("flex items-start gap-2.5 px-4 pt-3 pb-2.5", lang === "he" && "font-hebrew")}
        dir={lang === "he" ? "rtl" : "ltr"}
      >
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-type-grammar/15 text-xs font-bold text-type-grammar">
          {index + 1}
        </span>
        <p className="text-base font-semibold leading-snug">
          {lang === "he" ? <HeText text={point.he} /> : point.en}
        </p>
      </div>
      <div className="border-t border-border/60 bg-muted/30 px-4 py-2.5" dir="ltr">
        {point.chips ? (
          <div className="flex flex-wrap gap-1.5">
            {point.examples.map((ex) => (
              <span key={ex} className="rounded-md border border-border bg-background px-2 py-0.5 text-sm">
                <Example text={ex} />
              </span>
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {point.examples.map((ex) => (
              <li key={ex} className="text-base">
                <Example text={ex} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** Rule boxes, form table, signal words and common mistakes for one level. */
export function RuleCardBody({ topic, level, lang }: { topic: GrammarTopic; level: LevelNumber; lang: RuleLang }) {
  const card = topic.rule[level];
  // Fewer mistakes for lower levels keeps the panel short.
  const traps = topic.traps.slice(0, level === 1 ? 3 : level === 2 ? 4 : topic.traps.length);
  const L = LABELS[lang];
  return (
    <div className="space-y-6">
      {/* Rule boxes */}
      <div className="space-y-3">
        {card.points.map((p, i) => (
          <PointBox key={p.en} point={p} index={i} lang={lang} />
        ))}
      </div>

      {/* Form */}
      <div className="space-y-2">
        <SectionLabel lang={lang}>{L.form}</SectionLabel>
        <div className="rounded-xl border border-border overflow-hidden" dir="ltr">
          {card.form.map((row) => (
            <div key={row.pattern} className="flex gap-3 border-b border-border/60 last:border-b-0 px-3 py-2">
              <span className="w-4 shrink-0 font-bold text-type-grammar">{FORM_SIGN[row.kind]}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{row.pattern}</p>
                <p className="text-sm text-muted-foreground">{row.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signal words */}
      {card.timeWords && card.timeWords.length > 0 && (
        <div className="space-y-2">
          <SectionLabel lang={lang}>{L.words}</SectionLabel>
          <div className="flex flex-wrap gap-1.5" dir="ltr">
            {card.timeWords.map((w) => (
              <span key={w} className="rounded-full bg-muted px-2.5 py-0.5 text-sm">{w}</span>
            ))}
          </div>
        </div>
      )}

      {/* Common mistakes */}
      {traps.length > 0 && (
        <div className="space-y-2">
          <SectionLabel lang={lang}>{`⚠️ ${L.watch}`}</SectionLabel>
          {traps.map((t) => (
            <div key={t.id} className="rounded-xl border border-border overflow-hidden">
              <div className="space-y-0.5 px-4 py-2.5 text-base" dir="ltr">
                <p className="text-destructive/80 line-through decoration-destructive/60">✗ {t.wrong}</p>
                <p className="font-semibold text-success">✓ {t.right}</p>
              </div>
              <p
                className={cn("border-t border-border/60 bg-muted/30 px-4 py-2 text-sm text-muted-foreground", lang === "he" && "font-hebrew")}
                dir={lang === "he" ? "rtl" : "ltr"}
              >
                {lang === "he" ? <HeText text={t.whyHe} /> : t.whyEn}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function GrammarRuleSheet({
  topic,
  level,
  lang,
  onLangChange,
  open,
  onOpenChange,
}: {
  topic: GrammarTopic;
  level: LevelNumber;
  lang: RuleLang;
  onLangChange: (l: RuleLang) => void;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="data-[side=right]:w-full data-[side=right]:sm:max-w-md overflow-y-auto p-5">
        <div className="space-y-6">
          <div className="space-y-3 pr-8">
            <SheetTitle className="text-lg font-bold">
              {topic.title} <span className="text-muted-foreground font-normal font-hebrew">· {topic.titleHe}</span>
            </SheetTitle>
            <div className="inline-flex rounded-lg border border-border p-0.5 text-xs font-semibold">
              {(["he", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onLangChange(l)}
                  className={cn(
                    "rounded-md px-3 py-1 cursor-pointer transition-colors",
                    lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {l === "he" ? "עברית" : "English"}
                </button>
              ))}
            </div>
          </div>

          <RuleCardBody topic={topic} level={level} lang={lang} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
