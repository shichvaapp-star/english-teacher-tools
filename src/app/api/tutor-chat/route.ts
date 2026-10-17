import { NextResponse } from "next/server";
import { StudentTutorProfile } from "@/types/tutor";

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

// Deterministic offline fallback responses if LLM is unavailable or offline
function generateDeterministicTutorResponse(
  userText: string,
  profile: StudentTutorProfile,
  studentName: string
): { message: string; quickReplies: string[] } {
  const lower = userText.toLowerCase().trim();

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("שלום") || lower.includes("היי")) {
    return {
      message: `Hello ${studentName}! I'm David, your personal English tutor. I'm here to help you ace your Unseens, master Band I-III vocabulary, and write awesome essays. How can I help you today? (איך אוכל לעזור לך היום?)`,
      quickReplies: ["תן לי משימת קריאה (Unseen)", "בוא נתרגל אוצר מילים", "עזור לי בכתיבה"],
    };
  }

  if (
    lower.includes("תבחר אתה") ||
    lower.includes("בחר עבורי") ||
    lower.includes("choose for me") ||
    lower.includes("תבחר בשבילי") ||
    lower.includes("סמוך עליך")
  ) {
    return {
      message: `סמוך עליי! בחרתי עבורך את המשימה המומלצת ביותר לרמתך (${profile.level}). המשימה מוכנה עבורך, שיהיה בהצלחה!`,
      quickReplies: ["בוא נתחיל עכשיו 🚀", "החלף נושא", "בוא נתרגל אוצר מילים"],
    };
  }

  if (lower.includes("unseen") || lower.includes("reading") || lower.includes("אנסין") || lower.includes("קריאה")) {
    return {
      message: `בחרתי עבורך משימת קריאה (Unseen) ברמת ${profile.level}! באיזה נושא תרצה/י לתרגל? בחר/י נושא מתוך האפשרויות למטה, או לחצ/י 'דוד, בחר עבורי':`,
      quickReplies: ["🎲 דוד, בחר עבורי", "בעלי חיים 🐶", "רובוטים וחלל 🚀", "הרפתקאות וטבע 🌲"],
    };
  }

  if (lower.includes("vocab") || lower.includes("words") || lower.includes("מילים") || lower.includes("אוצר")) {
    return {
      message: `Expanding your vocabulary in ${profile.vocabBand} makes everything easier! Try learning 5 new words a day in your personal word bank and practice with Speed Match.`,
      quickReplies: ["בוא נתרגל עכשיו בבנק המילים", "איך כדאי לזכור מילים קשות?", "תן לי משימת קריאה"],
    };
  }

  if (lower.includes("writing") || lower.includes("essay") || lower.includes("כתיבה") || lower.includes("חיבור")) {
    return {
      message: `בחרתי עבורך משימת כתיבה מותאמת לרמת ${profile.level}! באיזה נושא תרצה/י לכתוב? בחר/י נושא מהאפשרויות למטה, או לחצ/י 'דוד, בחר עבורי':`,
      quickReplies: ["🎲 דוד, בחר עבורי", "סמארטפונים בביה\"ס 📱", "חופשת הקיץ 🏖️", "חיית מחמד 🐶"],
    };
  }

  if (lower.includes("mission") || lower.includes("משימה") || lower.includes("task") || lower.includes("תרגול")) {
    return {
      message: `הכנתי עבורך משימה מותאמת אישית לרמת ${profile.level}! באיזה נושא תרצה/י שנתמקד? בחר/י נושא מהאפשרויות למטה, או לחצ/י 'דוד, בחר עבורי':`,
      quickReplies: ["🎲 דוד, בחר עבורי", "קריאה (Unseen)", "כתיבה", "אוצר מילים"],
    };
  }

  if (lower.includes("topic") || lower.includes("נושא")) {
    return {
      message: `באפשרותך תמיד לבחור את הנושא שמעניין אותך לכל משימת קריאה או כתיבה! לחצ/י על אחד מכרטיסי הנושא למטה, או בקש/י ממני לבחור עבורך.`,
      quickReplies: ["🎲 דוד, בחר עבורי", "קריאה (Unseen)", "סדנת כתיבה"],
    };
  }

  return {
    message: `I hear you, ${studentName}! Keep practicing consistently every day. Every unseen you read and every word you add to your word bank strengthens your English skills! What would you like to focus on next?`,
    quickReplies: ["בוא נמשיך במשימה שלי", "דוד, בחר עבורי", "בדוק את הרמה שלי"],
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
      const fallback = generateDeterministicTutorResponse(userMessage, profile, studentName);
      return NextResponse.json({
        success: true,
        message: fallback.message,
        quickReplies: fallback.quickReplies,
        source: "deterministic_engine",
      });
    }

    const currentLevel = profile?.level || "Level 2";
    const currentBand = profile?.vocabBand || "Band II";
    const readingSkill = profile?.skills?.reading || 65;
    const vocabSkill = profile?.skills?.vocabulary || 65;
    const writingSkill = profile?.skills?.writing || 65;

    const systemPrompt = `You are "David", a dedicated, warm, and highly inspiring private English tutor for Israeli students (Middle School & High School / Bagrut level).
Your mission is to coach students, build their confidence, and guide them to practice on the platform's 3 pillars:
1. Unseen Practice (Reading Comprehension - Module A-E)
2. Vocabulary Training (MoE Core Bands I, II, III, Speed Match, Word Bank)
3. Writing Workshop (Paragraphs, Letters, Opinion Essays, Rubric Evaluation)

STUDENT CONTEXT:
- Student Name: ${studentName}
- Current Level: ${currentLevel}
- Vocab Band: ${currentBand}
- Reading Skill: ${readingSkill}/100
- Vocab Skill: ${vocabSkill}/100
- Writing Skill: ${writingSkill}/100

PEDAGOGICAL TEACHING STYLE:
- Tone: Friendly, patient, encouraging, like an exceptional private mentor.
- Language: Speak primarily in clear, natural English calibrated to ${currentLevel}.
- Helpful Hebrew Scaffolding: Add friendly Hebrew explanations or Hebrew words in parentheses (בעברית) for difficult concepts, but keep the core conversation in English to immerse the student!
- Socratic Method: When a student asks about an answer, guide them with hints rather than just giving away the solution.
- Student Topic Choice: When presenting or assigning an Unseen or Writing assignment, ALWAYS ask the student by default to select their favorite topic (such as Animals, Space, Technology, Sports, Travel, Adventure) from the options, or tell you / click 'דוד, בחר עבורי'. Never assume a topic without asking the student first.
- Be concise (2-4 sentences per response) so the student doesn't feel overwhelmed with text.
- Suggest 2-3 short, actionable quick-reply chips in Hebrew or English that the student can tap.

Return ONLY a raw JSON object (NO markdown code fences, NO backticks) with this structure:
{
  "message": "Your warm, personalized pedagogical reply in English with helpful Hebrew notes",
  "quickReplies": ["Quick reply 1", "Quick reply 2", "Quick reply 3"]
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
