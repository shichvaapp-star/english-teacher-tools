import { NextResponse } from "next/server";
import { StudentTutorProfile, TutorLevel } from "@/types/tutor";
import {
  lookupBilingualQuery,
  getUnseenTopicsForLevel,
  getWritingTopicsForLevel,
} from "@/lib/tutor-engine";

// Clean and extract JSON from markdown wrappers or raw text
function extractJsonFromText(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

// Deterministic offline/zero-cost pedagogical response engine with full Level 1 Hebrew scaffolding parity
function generateDeterministicTutorResponse(
  userText: string,
  profile: StudentTutorProfile,
  studentName: string,
  messages: Array<{ sender: string; text: string }> = []
): { message: string; quickReplies: string[] } {
  const lower = userText.toLowerCase().trim();
  const level: TutorLevel = profile?.level || "Level 1";
  const band = profile?.vocabBand || "Band I";
  const unseenTopics = getUnseenTopicsForLevel(level);
  const writingTopics = getWritingTopicsForLevel(level);

  // 1. Check specific word/phrase/sentence translation requests FIRST ("מה זה אומר...", "איך אומרים...", "מה אומר...")
  const translationLookup = lookupBilingualQuery(userText);
  if (translationLookup.isTranslationQuestion && translationLookup.formattedAnswerHebrew) {
    return {
      message: `בשמחה, ${studentName}! 😊\n\n${translationLookup.formattedAnswerHebrew}\n\nתרצה/י לתרגל עוד מילים או להמשיך במשימה שלנו?`,
      quickReplies: [
        "תודה דוד! בוא נמשיך 🚀",
        "בוא נתרגל אוצר מילים 📚",
        "תן לי משימת קריאה קלה 📖",
      ],
    };
  }

  // 2. Writing struggles & "How do I start a sentence?" coaching
  const isWritingStruggle =
    lower.includes("איך מתחילים משפט") ||
    lower.includes("איך כותבים משפט") ||
    lower.includes("איך להתחיל משפט") ||
    lower.includes("קשה לי לכתוב") ||
    lower.includes("קשה לכתוב") ||
    lower.includes("לא יודע לכתוב") ||
    lower.includes("לא יודעת לכתוב") ||
    lower.includes("עזרה בכתיבה") ||
    lower.includes("how to start a sentence");

  if (isWritingStruggle) {
    const easyWritingTopic = writingTopics[0];
    return {
      message: `אני לגמרי מבין אותך, ${studentName}! כתיבה באנגלית היא קלה הרבה יותר כשיש לך **"תבניות קסם"** קבועות להתחיל איתן 😊✍️\n\n🔑 **נוסחת הזהב למשפט באנגלית:**\n**מי (Subject)** + **פעולה (Verb)** + **המשך קצר**\n\nהנה **4 התחלות משפט קלות** שתמיד עובדות (אפשר פשוט להעתיק ולהשלים מילה אחת!):\n1. **I like... because it is fun.** (אני אוהב/ת... כי זה כיף.)\n2. **I think that... is great.** (אני חושב/ת ש... הוא מעולה.)\n3. **My favorite... is...** (ה... האהוב עליי הוא...)\n4. **First, I want to say that...** (קודם כל, אני רוצה להגיד ש...)\n\nרוצה שננסה יחד משימת כתיבה קצרה וקלילה בנושא **"${easyWritingTopic?.nameHebrew || "מכתב לחבר/ה"}"** עם בנק מילים מוכן?`,
      quickReplies: [
        `בוא ננסה כתיבה: ${easyWritingTopic?.nameHebrew || "מכתב לחבר/ה"} ✍️`,
        "🎲 דוד, בחר עבורי נושא קל",
        "איך אומרים... באנגלית?",
      ],
    };
  }

  // 3. Unseen / Writing anxiety, discouragement & fear of making mistakes ("אני מפחד לטעות באנסין", "אני גרוע באנגלית", "אין לי סיכוי")
  const isAnxietyOrFear =
    lower.includes("מפחד") ||
    lower.includes("מפחדת") ||
    lower.includes("פוחד") ||
    lower.includes("פוחדת") ||
    lower.includes("לחוץ") ||
    lower.includes("מלחיץ") ||
    lower.includes("קשה לי באנסין") ||
    lower.includes("קשה לי בקריאה") ||
    lower.includes("גרוע באנגלית") ||
    lower.includes("גרועה באנגלית") ||
    lower.includes("אין לי סיכוי") ||
    lower.includes("לא רוצה ללמוד") ||
    lower.includes("טעות") ||
    lower.includes("לטעות");

  if (isAnxietyOrFear) {
    const isAboutWriting =
      lower.includes("כתיבה") ||
      lower.includes("לכתוב") ||
      lower.includes("חיבור") ||
      lower.includes("משפט");

    if (isAboutWriting) {
      const easyWriting = writingTopics[0];
      return {
        message: `הכי טבעי להרגיש ככה, ${studentName}! 💙 חשוב לי שתדע/י: אצלי **אין ציונים מלחיצים ומותר לטעות כמה שרוצים** – ככה בדיוק לומדים לכתוב באנגלית! 😊✍️\n\n✨ **איך כותבים בלי לחץ ב-3 צעדים פשוטים?**\n1. משתמשים בהתחלה מוכנה כמו **I like...** (אני אוהב/ת...) או **I think that...** (אני חושב/ת ש...).\n2. נעזרים בבנק המילים בעברית ובאנגלית שמופיע ליד המשימה.\n3. מתחילים ממשפט אחד או שניים בנושא קליל כמו **"${easyWriting?.nameHebrew || "מכתב לחבר/ה"}"** ${easyWriting?.emoji || "💌"}!`,
        quickReplies: [
          `בוא ננסה כתיבה קלה: ${easyWriting?.nameHebrew || "מכתב לחבר/ה"} ✍️`,
          "🎲 דוד, בחר עבורי משהו קל",
          "בוא נתרגל קודם אוצר מילים 📚",
        ],
      };
    }

    const easyStory = unseenTopics[0];
    return {
      message: `הכי טבעי בעולם להרגיש ככה, ${studentName}! 💙 חשוב לי שתדע/י: אצלי **אין ציונים מלחיצים ומותר לטעות כמה שרוצים** – ככה בדיוק לומדים ומשתפרים! 😊💪\n\n✨ **3 סודות שהופכים כל אנסין לקל וברור:**\n1. **קוראים קודם את הכותרת בעברית ובאנגלית** כדי להבין על מה הסיפור.\n2. **לוחצים על כל מילה בטקסט** שלא מכירים – ומקבלים מיד תרגום בעברית!\n3. **מתחילים בקטן:** בחרתי לנו את הסיפור הכי קצר, קל וחמוד ברמת ${level} – **"${easyStory?.titleHebrew || "מקס הכלב הקטן"}"** (${easyStory?.titleEnglish || "Max the Small Dog"}) 🐶.\n\nנעשה הכנה קצרה של 5 מילים קלות מהסיפור לפני שמתחילים, או שנצא לדרך יחד?`,
      quickReplies: [
        "💡 הכנה מהירה עם דוד",
        `בוא נתחיל בסיפור "${easyStory?.nameHebrew || "בעלי חיים"}" 🐶`,
        "בוא נתרגל קודם אוצר מילים 📚",
      ],
    };
  }

  // 4. Topic Indecision & "Pick something easy for me" ("לא יודע איזה נושא לבחור", "תבחר לי משהו קל", "דוד, בחר עבורי")
  const isTopicIndecisionOrAutoPick =
    lower.includes("לא יודע איזה נושא") ||
    lower.includes("לא יודעת איזה נושא") ||
    lower.includes("תבחר לי") ||
    lower.includes("תבחר אתה") ||
    lower.includes("בחר עבורי") ||
    lower.includes("תבחר בשבילי") ||
    lower.includes("משהו קל") ||
    lower.includes("הכי קל") ||
    lower.includes("תמליץ לי") ||
    lower.includes("סמוך עליך") ||
    lower.includes("choose for me");

  if (isTopicIndecisionOrAutoPick && !lower.includes("תן לי משימת")) {
    if (lower.includes("כתיבה") || lower.includes("חיבור") || lower.includes("writing")) {
      const easyWriting = writingTopics[0];
      return {
        message: `סמוך עליי, ${studentName}! הורדתי ממך את ההתלבטות 😊🎲\nבחרתי עבורך את משימת הכתיבה הכי קלה וכיפית ברמת **${level}**:\n👉 **${easyWriting?.emoji || "💌"} ${easyWriting?.nameHebrew || "מכתב לחבר/ה"} — "${easyWriting?.titleHebrew || "פתק קצר לחבר"}"** (*${easyWriting?.titleEnglish || "Note to a Friend"}*)\n\n🔑 **איך מתחילים בקלות?**\n• **Hi my friend,** = היי חבר/ה שלי,\n• **I want to tell you about...** = אני רוצה לספר לך על...\n\nהמשימה כבר מסומנת ומוכנה עבורך! אפשר להתחיל עכשיו:`,
        quickReplies: [
          "התחל עכשיו 🚀",
          "איך מתחילים משפט?",
          "החלף נושא",
        ],
      };
    }

    const easyStory = unseenTopics[0];
    return {
      message: `סמוך עליי, ${studentName}! הורדתי ממך את ההתלבטות 😊🎲\nבחרתי עבורך את הנושא הכי קל, קצר וכיפי לפתיחה ברמת **${level}**:\n👉 **${easyStory?.emoji || "🐶"} ${easyStory?.nameHebrew || "בעלי חיים"} — "${easyStory?.titleHebrew || "מקס הכלב הקטן"}"** (*${easyStory?.titleEnglish || "Max the Small Dog"}*)\n\n🔑 **3 מילים קלות שיופיעו בסיפור:**\n• **small** = קטן\n• **dog** = כלב\n• **room** = חדר\n\nהמשימה כבר מסומנת ומוכנה עבורך! אפשר להתחיל עכשיו או להחליף לנושא אחר בקליק:`,
      quickReplies: [
        "התחל עכשיו 🚀",
        "💡 הכנה מהירה עם דוד",
        "החלף נושא",
      ],
    };
  }

  // 5. General Confusion Rescue ("לא הבנתי מה כתבת", "לא מבין", "תסביר בעברית")
  const isGeneralConfusion =
    lower === "?" ||
    lower === "??" ||
    lower.includes("לא מבין") ||
    lower.includes("לא מבינה") ||
    lower.includes("לא הבנתי") ||
    lower.includes("מה שאלת") ||
    lower.includes("מה כתבת") ||
    lower.includes("מה אמרת") ||
    lower.includes("תסביר") ||
    lower.includes("בעברית") ||
    lower.includes("קשה לי") ||
    lower.includes("i don't understand") ||
    lower.includes("i dont understand") ||
    lower.includes("dont understand") ||
    lower.includes("what do you mean") ||
    lower.includes("in hebrew");

  if (isGeneralConfusion) {
    const lastTutorMsg = [...messages].reverse().find((m) => m.sender === "tutor")?.text;
    const contextHint = lastTutorMsg
      ? `בהודעה הקודמת שאלתי אותך באנגלית במה תרצה/י שנתאמן עכשיו כדי שנתקדם בקצב שלך.\n`
      : "";

    return {
      message: `אין שום בעיה, ${studentName}! אני מסביר הכול בעברית פשוטה וברורה 😊💙\n${contextHint}אנחנו מתרגלים יחד ברמת **${level} (${band})** – בלי לחץ ובקצב שלך!\n\nאפשר לעשות איתי עכשיו אחד מ-3 דברים קלים:\n1. 📖 **לקרוא סיפור קצר וקל** (עם תרגום לכל מילה בלחיצה!)\n2. 📚 **לתרגל 5 מילים חדשות** במשחק התאמה מהיר\n3. ✍️ **לכתוב 2 משפטים קצרים** עם תבניות מוכנות\n\n💡 *טיפ: בכל רגע אפשר לשאול אותי **"מה זה [מילה]?"** או **"איך אומרים [משהו] באנגלית?"** ואענה מיד בעברית!* במה נתחיל?`,
      quickReplies: [
        "🎲 דוד, בחר עבורי משהו קל",
        "סיפור קצר וקל (Unseen) 📖",
        "משחק אוצר מילים (Band I) 📚",
        "כתיבה עם תבניות מוכנות ✍️",
      ],
    };
  }

  // 6. Greeting ("שלום", "היי", "hello", "hi")
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("שלום") || lower.includes("היי")) {
    return {
      message: `Hi ${studentName}! 👋 איזה כיף לראות אותך!\nI am ready to practice with you! (אני מוכן לתרגל איתך ברמת **${level}**!)\nבמה בא לך להתחיל היום – סיפור קצר, משחק מילים מהיר, או כתיבה מודרכת?`,
      quickReplies: [
        "🎲 דוד, בחר עבורי משהו קל",
        "סיפור קצר (Unseen) 📖",
        "אוצר מילים (Band I) 📚",
        "כתיבה קלה ✍️",
      ],
    };
  }

  // 7. Unseen / Reading request ("תן לי משימת קריאה קלה", "אנסין", "קריאה")
  if (lower.includes("unseen") || lower.includes("reading") || lower.includes("אנסין") || lower.includes("קריאה")) {
    const topChips = unseenTopics.slice(0, 3).map((t) => `${t.emoji} ${t.nameHebrew}`);
    const easyFirst = unseenTopics[0];
    return {
      message: `מעולה, ${studentName}! 📖 הכנתי עבורך סיפורים קצרים ומהנים שמותאמים בדיוק לרמת **${level}** (בכל סיפור אפשר ללחוץ על כל מילה ולקבל תרגום לעברית!).\n\n💡 **ההמלצה הקלה שלי לפתיחה:** הסיפור **"${easyFirst?.titleHebrew || "מקס הכלב הקטן"}"** בנושא ${easyFirst?.nameHebrew || "בעלי חיים"} ${easyFirst?.emoji || "🐶"}.\n\nבאיזה נושא תרצה/י לקרוא? בחר/י למטה או לחצ/י **'דוד, בחר עבורי'**:`,
      quickReplies: ["🎲 דוד, בחר עבורי", ...topChips],
    };
  }

  // 8. Vocabulary request
  if (lower.includes("vocab") || lower.includes("words") || lower.includes("מילים") || lower.includes("אוצר")) {
    return {
      message: `בחירה מעולה, ${studentName}! 📚 חיזוק אוצר מילים בסיסי (**${band}**) הופך גם את הקריאה וגם את הכתיבה להרבה יותר קלות!\n\nהנה 3 מילים שימושיות שכדאי להכיר כבר עכשיו:\n• **always** = תמיד\n• **together** = ביחד\n• **important** = חשוב\n\nבוא נתרגל 5 מילים חדשות בבנק המילים ובמשחק **Speed Match**!`,
      quickReplies: [
        "בוא נתרגל עכשיו בבנק המילים 📚",
        "איך אומרים כלב חמוד באנגלית?",
        "תן לי משימת קריאה קלה 📖",
      ],
    };
  }

  // 9. Writing request ("תן לי משימת כתיבה", "כתיבה", "חיבור")
  if (lower.includes("writing") || lower.includes("essay") || lower.includes("כתיבה") || lower.includes("חיבור")) {
    const topWritingChips = writingTopics.slice(0, 3).map((t) => `${t.emoji} ${t.nameHebrew}`);
    const easyWritingFirst = writingTopics[0];
    return {
      message: `בשמחה, ${studentName}! ✍️ הכנתי עבורך משימות כתיבה קצרות ומודרכות לרמת **${level}**, עם משפטי פתיחה מוכנים ובנק מילים בעברית ובאנגלית!\n\n💡 **ההמלצה הקלה שלי לפתיחה:** **${easyWritingFirst?.emoji || "✍️"} ${easyWritingFirst?.nameHebrew || "מכתב לחבר/ה"}** (${easyWritingFirst?.titleEnglish || "Note to a Friend"}).\n\nבאיזה נושא תרצה/י לכתוב? בחר/י למטה או לחצ/י **'דוד, בחר עבורי'**:`,
      quickReplies: ["🎲 דוד, בחר עבורי", ...topWritingChips],
    };
  }

  // 10. General Mission or Topic request
  if (
    lower.includes("mission") ||
    lower.includes("משימה") ||
    lower.includes("task") ||
    lower.includes("תרגול") ||
    lower.includes("topic") ||
    lower.includes("נושא")
  ) {
    const topUnseenChips = unseenTopics.slice(0, 2).map((t) => `${t.emoji} ${t.nameHebrew}`);
    return {
      message: `אני איתך, ${studentName}! 🎯 הכנתי עבורך תרגול מותאם לרמת **${level}**.\nאפשר לבחור נושא שמעניין אותך לקריאה או לכתיבה, או פשוט ללחוץ על **'דוד, בחר עבורי'** ואני אבחר לך את המשימה הכי קלה ומומלצת!`,
      quickReplies: ["🎲 דוד, בחר עבורי", ...topUnseenChips, "משימת כתיבה קלה ✍️"],
    };
  }

  // 11. Warm, Bilingual Level-1 Calibrated Default Response (Never a wall of English!)
  return {
    message: `Great job chatting with me, ${studentName}! 🌟 (כל הכבוד על התרגול איתי!)\nאני כאן איתך לכל שאלה ברמת **${level}** – אם יש מילה או משפט שלא ברורים לך, פשוט שאל/י אותי **"מה זה..."** או **"איך אומרים..."** בעברית, או שנמשיך למשימה הקלה הבאה שלנו!`,
    quickReplies: [
      "🎲 דוד, בחר עבורי משהו קל",
      "תן לי משימת קריאה קלה 📖",
      "קשה לי לכתוב באנגלית, איך מתחילים משפט?",
    ],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentName = "Student",
      messages = [],
      profile,
      userMessage = "",
    } = body;

    const groqApiKey = request.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY;
    const geminiApiKey = request.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY;
    const openaiApiKey = request.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY;

    // If no API keys provided, immediately respond with high-quality deterministic response ($0 cost)
    if (!groqApiKey && !geminiApiKey && !openaiApiKey) {
      const fallback = generateDeterministicTutorResponse(userMessage, profile, studentName, messages);
      return NextResponse.json({
        success: true,
        message: fallback.message,
        quickReplies: fallback.quickReplies,
        source: "deterministic_engine",
      });
    }

    const currentLevel = profile?.level || "Level 1";
    const currentBand = profile?.vocabBand || "Band I";
    const readingSkill = profile?.skills?.reading || 60;
    const vocabSkill = profile?.skills?.vocabulary || 60;
    const writingSkill = profile?.skills?.writing || 60;
    const unseenTopics = getUnseenTopicsForLevel(currentLevel);
    const writingTopics = getWritingTopicsForLevel(currentLevel);

    const systemPrompt = `You are "David" (דוד), a warm, patient, and inspiring private English tutor for Israeli students, specially calibrated for struggling Middle School learners (Level 1 / Band I) as well as Level 2–3 students.
Your mission is to build the student's confidence and guide them across the platform's 3 pillars:
1. Unseen Practice (Reading Comprehension — level-matched stories with click-to-translate)
2. Vocabulary Training (MoE Core Bands I, II, III, Speed Match, Personal Word Bank)
3. Writing Workshop (Guided sentences/paragraphs with templates and rubric evaluation)

STUDENT CONTEXT:
- Student Name: ${studentName}
- Current Level: ${currentLevel} (${currentBand})
- Skills: Reading ${readingSkill}/100 | Vocabulary ${vocabSkill}/100 | Writing ${writingSkill}/100
- Available Unseen Topics for ${currentLevel}: ${unseenTopics.map((t) => `${t.emoji} ${t.nameHebrew} (${t.titleEnglish})`).join(", ")}
- Available Writing Topics for ${currentLevel}: ${writingTopics.map((t) => `${t.emoji} ${t.nameHebrew} (${t.titleEnglish})`).join(", ")}

CRITICAL PEDAGOGICAL RULES (ESPECIALLY FOR LEVEL 1 / STRUGGLING HEBREW-NATIVE LEARNERS):
1. **Comprehension Rescue & Confusion Detection**:
   - If the student writes in Hebrew asking "מה זה...", "מה אומר...", "מה זה אומר...", "איך אומרים...", "לא הבנתי", or mixes Hebrew & English (Heblish), NEVER ignore their question or give a generic menu!
   - Translate the exact word or sentence they asked about into simple Hebrew, break it down word-by-word, and give 1 short example sentence.
2. **Cognitive Load & Level 1 Calibration**:
   - Never write more than 1–2 short, simple Band I English sentences at a time without immediate warm Hebrew scaffolding in parentheses or below.
3. **Active English Production Scaffolding**:
   - When a student answers in Hebrew or struggles with writing ("קשה לי לכתוב", "איך מתחילים משפט?"), validate their specific idea in Hebrew and give them a tailored, fill-in-the-blank English sentence starter (e.g., "I like... because...", "I think that...", "I would invent a...") matched to their exact idea.
   - When a student expresses fear or anxiety (e.g. "אני מפחד לטעות באנסין"), reassure them warmly in Hebrew that mistakes are how we learn, and share 2–3 simple tips.
4. **Topic Selection & Indecision**:
   - If the student asks for an Unseen or Writing task, present the ${currentLevel} topics above or let them click "🎲 דוד, בחר עבורי".
   - If the student says "לא יודע איזה נושא לבחור" or "תבחר לי משהו קל", proactively pick the easiest topic (${unseenTopics[0]?.nameHebrew || "בעלי חיים"}) and pre-teach 2–3 easy words!

Return ONLY a raw JSON object (NO markdown code fences, NO backticks) with this structure:
{
  "message": "Your warm, bilingual pedagogical reply tailored to the student's exact message",
  "quickReplies": ["Actionable reply 1", "Actionable reply 2", "Actionable reply 3"]
}`;

    // Format chat history for LLM
    const formattedHistory = messages.slice(-6).map((m: any) => ({
      role: m.sender === "student" ? "user" : "assistant",
      content: m.text,
    }));

    // Cascade: Groq free tier -> Gemini free tier -> Deterministic
    const cascadeSteps: Array<() => Promise<{ message: string; quickReplies: string[] }>> = [];

    // 1. Groq
    if (groqApiKey) {
      cascadeSteps.push(async () => {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              ...formattedHistory,
              { role: "user", content: userMessage },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
            max_tokens: 350,
          }),
        });
        if (!res.ok) throw new Error(`Groq ${res.status}`);
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || "";
        return extractJsonFromText(content);
      });
    }

    // 2. Google Gemini
    if (geminiApiKey) {
      cascadeSteps.push(async () => {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${systemPrompt}\n\nCONVERSATION HISTORY:\n${JSON.stringify(formattedHistory)}\n\nLATEST STUDENT MESSAGE:\n${userMessage}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.3,
              },
            }),
          }
        );
        if (!res.ok) throw new Error(`Gemini ${res.status}`);
        const data = await res.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        return extractJsonFromText(content);
      });
    }

    for (const step of cascadeSteps) {
      try {
        const result = await step();
        if (result && result.message) {
          return NextResponse.json({
            success: true,
            message: result.message,
            quickReplies: Array.isArray(result.quickReplies) ? result.quickReplies : ["מעולה!", "בוא נמשיך"],
            source: "ai",
          });
        }
      } catch (err) {
        console.warn("AI Tutor call step attempt failed, continuing cascade...", err);
      }
    }

    // Graceful fallback
    const fallback = generateDeterministicTutorResponse(userMessage, profile, studentName);
    return NextResponse.json({
      success: true,
      message: fallback.message,
      quickReplies: fallback.quickReplies,
      source: "fallback",
    });
  } catch (error: any) {
    console.error("Tutor API error:", error);
    return NextResponse.json({
      success: true,
      message: "Hello! I am David, your English tutor. Let's practice reading, vocabulary, or writing today! (בוא נתרגל היום יחד!)",
      quickReplies: ["בוא נתרגל קריאה", "בוא נתרגל אוצר מילים", "בוא נתרגל כתיבה"],
      source: "emergency_fallback",
    });
  }
}
