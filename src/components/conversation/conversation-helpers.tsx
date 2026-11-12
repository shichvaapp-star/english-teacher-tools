import React from "react";

export const LOCAL_SUBMISSIONS_KEY = "ett_writing_submissions";

export function InteractiveEnglishText({
  text,
  onWordClick,
  className = "",
  stopEventPropagation = false,
}: {
  text: string;
  onWordClick: (word: string) => void;
  className?: string;
  stopEventPropagation?: boolean;
}) {
  if (!text) return null;
  const tokens = text.split(/(\s+)/);

  return (
    <span className={className}>
      {tokens.map((token, idx) => {
        const isSpace = /^\s+$/.test(token);
        if (isSpace) return <span key={idx}>{token}</span>;

        const hasEnglish = /[a-zA-Z]/.test(token);
        if (!hasEnglish) return <span key={idx}>{token}</span>;

        return (
          <span
            key={idx}
            onClick={(e) => {
              if (typeof window !== "undefined") {
                const sel = window.getSelection();
                if (sel && !sel.isCollapsed && sel.toString().trim().length > 1) {
                  return;
                }
              }
              if (stopEventPropagation) {
                e.stopPropagation();
              }
              onWordClick(token);
            }}
            className="cursor-pointer hover:bg-primary/20 hover:text-primary rounded px-0.5 transition-colors underline decoration-dotted decoration-muted-foreground/30 hover:decoration-primary"
            title={`Click to translate "${token.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "")}"`}
          >
            {token}
          </span>
        );
      })}
    </span>
  );
}
