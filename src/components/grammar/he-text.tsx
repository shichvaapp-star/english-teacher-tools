import React from "react";

// Hebrew sentences here often contain English chunks ("אחרי Does הפועל בלי s: Does he like?").
// Left to the browser's bidi algorithm, punctuation and short English words get
// reordered and the sentence becomes unreadable. Each English run is wrapped in
// an isolated LTR <bdi>, so it stays intact and sits in the right place in the RTL line.
//
// A run starts with a Latin letter/digit, may contain spaces and inline symbols
// (/ + = → - ' : ,), ends with a letter/digit/closing bracket, and keeps any
// final . ? ! that belongs to it.
const LATIN_RUN =
  /[A-Za-z0-9][A-Za-z0-9\s'’/+=→\-–,:()°]*[A-Za-z0-9)'’°][.?!]*|[A-Za-z0-9][.?!]*/g;

const HEBREW = /[֐-׿]/;

export function splitBidi(text: string): { latin: boolean; text: string }[] {
  const parts: { latin: boolean; text: string }[] = [];
  let last = 0;
  for (const m of text.matchAll(LATIN_RUN)) {
    const start = m.index ?? 0;
    if (start > last) parts.push({ latin: false, text: text.slice(last, start) });
    parts.push({ latin: true, text: m[0] });
    last = start + m[0].length;
  }
  if (last < text.length) parts.push({ latin: false, text: text.slice(last) });

  // English runs separated only by spaces / punctuation (no Hebrew) form one
  // phrase – merge them, or the RTL line would show them in reverse order.
  const merged: { latin: boolean; text: string }[] = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const prev = merged[merged.length - 1];
    const nextPart = parts[i + 1];
    if (!p.latin && prev?.latin && nextPart?.latin && !HEBREW.test(p.text)) {
      prev.text += p.text + nextPart.text;
      i++;
    } else if (p.latin && prev?.latin) {
      prev.text += p.text;
    } else {
      merged.push({ ...p });
    }
  }
  return merged;
}

/** Renders a Hebrew string with embedded English kept readable. */
export function HeText({ text }: { text: string }) {
  return (
    <>
      {splitBidi(text).map((p, i) =>
        p.latin ? (
          <bdi key={i} dir="ltr">
            {p.text}
          </bdi>
        ) : (
          <React.Fragment key={i}>{p.text}</React.Fragment>
        )
      )}
    </>
  );
}
