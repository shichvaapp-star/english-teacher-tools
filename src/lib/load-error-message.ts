/** A Hebrew, teacher-friendly explanation of why a Firestore read failed. */
export function describeLoadError(err: unknown): string {
  const code = (err as { code?: string } | null)?.code ?? "";
  switch (code) {
    case "resource-exhausted":
      return "המערכת חרגה ממכסת השימוש היומית. הגישה תחזור אוטומטית בשעה 10:00 בבוקר.";
    case "permission-denied":
      return "אין הרשאה לקרוא את הנתונים. נסו להתנתק ולהתחבר מחדש.";
    case "unavailable":
    case "deadline-exceeded":
      return "אין חיבור לשרת. בדקו את החיבור לאינטרנט ונסו שוב.";
    default:
      return "אירעה שגיאה בטעינת הנתונים. נסו שוב בעוד כמה דקות.";
  }
}
