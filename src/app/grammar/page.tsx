"use client";

import React from "react";
import { useGrammarPractice } from "@/components/grammar/use-grammar-practice";
import { GrammarHeader } from "@/components/grammar/grammar-header";
import { GrammarTopicsScreen } from "@/components/grammar/grammar-topics-screen";
import { GrammarPracticeScreen } from "@/components/grammar/grammar-practice-screen";
import { GrammarResultsScreen } from "@/components/grammar/grammar-results-screen";
import { GrammarRuleSheet } from "@/components/grammar/grammar-rule-sheet";
import { GrammarAiSettingsModal } from "@/components/grammar/grammar-ai-settings-modal";

export default function GrammarPage() {
  const c = useGrammarPractice();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-clip">
      <GrammarHeader c={c} />

      <main className="flex-1 container mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <GrammarTopicsScreen c={c} />
        <GrammarPracticeScreen c={c} />
        <GrammarResultsScreen c={c} />
      </main>

      <GrammarAiSettingsModal c={c} />

      {c.topic && (
        <GrammarRuleSheet
          topic={c.topic}
          level={c.level}
          lang={c.ruleLang}
          onLangChange={c.setLangOverride}
          open={c.ruleOpen}
          onOpenChange={c.setRuleOpen}
        />
      )}
    </div>
  );
}
