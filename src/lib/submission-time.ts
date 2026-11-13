// Robust timestamp parser supporting ISO, timestamps, or Israeli date format (DD/MM/YYYY, HH:MM:SS)
export function parseSubmissionTimestamp(val?: string | number | null): number {
  if (!val) return 0;
  if (typeof val === "number") return val;
  const parsed = Date.parse(val);
  if (!isNaN(parsed)) return parsed;

  const match = val.match(/(\d{1,2})[./](\d{1,2})[./](\d{4})(?:,\s*(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (match) {
    const [, day, month, year, hours = "0", minutes = "0", seconds = "0"] = match;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds)
    ).getTime();
  }
  return 0;
}

// Format relative/compact time (Hebrew)
export function formatCompactTime(timestampStr: string, now: number = Date.now()): string {
  const ts = parseSubmissionTimestamp(timestampStr);
  if (!ts) return timestampStr || "—";

  const diffMs = now - ts;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "ממש עכשיו";
  if (diffMinutes < 60) return `לפני ${diffMinutes} דק׳`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays === 1) return "אתמול";
  if (diffDays < 7) return `לפני ${diffDays} ימים`;

  return formatShortDate(ts);
}

export function formatShortDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export type DayBucket = "today" | "yesterday" | "week" | "older";

export const DAY_BUCKET_LABELS: Record<DayBucket, string> = {
  today: "היום",
  yesterday: "אתמול",
  week: "השבוע",
  older: "מוקדם יותר",
};

export function getDayBucket(timestampStr: string, now: number = Date.now()): DayBucket {
  const ts = parseSubmissionTimestamp(timestampStr);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const todayMs = startOfToday.getTime();
  if (ts >= todayMs) return "today";
  if (ts >= todayMs - 24 * 3600 * 1000) return "yesterday";
  if (ts >= todayMs - 6 * 24 * 3600 * 1000) return "week";
  return "older";
}
