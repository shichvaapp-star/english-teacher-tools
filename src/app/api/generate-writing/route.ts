import { NextResponse } from "next/server";
import { WritingTask, WritingLevel, TaskCategory } from "@/types/writing";

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

function createFallbackTask(topic: string, level: WritingLevel, category: TaskCategory): WritingTask {
  const safeTopic = topic.trim() || "My Favorite Hobby";
  const id = `custom-${Date.now()}`;

  if (level === "Level 1") {
    return {
      id,
      level: "Level 1",
      category,
      emoji: "✨",
      title: `${safeTopic} - Mini Writing`,
      hebrewTitle: `כתיבה קצרה על: ${safeTopic}`,
      prompt: `Write 2 or 3 short sentences about ${safeTopic}. What do you like about it? How does it make you feel?`,
      hebrewInstructions: `כתבו 2-3 משפטים קצרים באנגלית על ${safeTopic}. מה אתם אוהבים בזה ואיך זה גורם לכם להרגיש?`,
      targetWords: "10–25 מילים",
      minWords: 8,
      maxWords: 30,
      starterTips: [
        `פתחו במשפט פשוט: 'I really like ${safeTopic}.'`,
        "כתבו מילה אחת שמתארת את זה (fun / cool / nice)",
        "סיימו בברכה או בתחושה טובה: 'It makes me smile.'",
      ],
      wordBank: [
        { word: "like", hebrew: "אוהב/ת", emoji: "❤️" },
        { word: "fun", hebrew: "כיף", emoji: "🎉" },
        { word: "happy", hebrew: "שמח", emoji: "😊" },
        { word: "play", hebrew: "משחק", emoji: "🎮" },
        { word: "best", hebrew: "הכי טוב", emoji: "⭐" },
      ],
      sentenceStarters: [
        `I really love ${safeTopic}...`,
        `My favorite thing is...`,
        `It is super fun and...`,
        `I want to do it every day...`,
      ],
      guidedSteps: [
        {
          stepNumber: 1,
          titleHebrew: "משפט 1: הצגת הנושא",
          starterPhrase: `I really like `,
          placeholder: `${safeTopic}...`,
          helperHintHebrew: "ספרו מה אתם אוהבים בנושא זה",
        },
        {
          stepNumber: 2,
          titleHebrew: "משפט 2: תיאור",
          starterPhrase: "It is very ",
          placeholder: "fun and exciting...",
          helperHintHebrew: "תארו במילה אחת או שתיים",
        },
        {
          stepNumber: 3,
          titleHebrew: "משפט 3: סיכום קצר",
          starterPhrase: "It always makes me ",
          placeholder: "happy!",
          helperHintHebrew: "סיימו בתחושה חיובית",
        },
      ],
    };
  }

  if (level === "Level 3") {
    return {
      id,
      level: "Level 3",
      category,
      emoji: "💡",
      title: `Perspectives on ${safeTopic}`,
      hebrewTitle: `מחשבות ומבט מעמיק על: ${safeTopic}`,
      prompt: `Write an expressive, well-developed composition examining the importance of ${safeTopic}. Share your unique perspective and illustrate your ideas with vivid details.`,
      hebrewInstructions: `כתבו חיבור עשיר ומפותח על ${safeTopic}. הציגו את נקודת המבט שלכם, הסבירו לעומק והשתמשו באוצר מילים עשיר.`,
      targetWords: "80–120 מילים",
      minWords: 75,
      maxWords: 130,
      starterTips: [
        "Open with an intriguing hook that captivates your reader.",
        "Elaborate on two specific insights with personal or real-world examples.",
        "Conclude with a thoughtful takeaway that summarizes your stance.",
      ],
      wordBank: [
        { word: "fascinating", hebrew: "מרתק" },
        { word: "perspective", hebrew: "נקודת מבט" },
        { word: "significant", hebrew: "משמעותי" },
        { word: "inspire", hebrew: "להעניק השראה" },
        { word: "furthermore", hebrew: "יתרה מכך" },
      ],
      sentenceStarters: [
        `Few topics are as engaging to explore as ${safeTopic}.`,
        "From an early age, I discovered that...",
        "What makes this subject remarkably compelling is...",
        "In reflection, embracing this experience allows us to...",
      ],
    };
  }

  // Level 2 default
  return {
    id,
    level: "Level 2",
    category,
    emoji: "📝",
    title: `Exploring ${safeTopic}`,
    hebrewTitle: `חיבור על: ${safeTopic}`,
    prompt: `Write a clear and coherent paragraph in English about ${safeTopic}. Explain what makes it interesting, share your personal opinion or experiences, and summarize your ideas.`,
    hebrewInstructions: `כתבו פסקת כתיבה מסודרת באנגלית על ${safeTopic}. הסבירו מה מעניין בנושא, הביעו דעה או חוויה אישית וסכמו.`,
    targetWords: "50–75 מילים",
    minWords: 45,
    maxWords: 80,
    starterTips: [
      `פתחו בהצהרה ברורה על הנושא: 'One topic I find very interesting is ${safeTopic}.'`,
      "השתמשו במילות קישור מתאימות: First, In addition, For example.",
      "סכמו במשפט ברור: 'To sum up, ...'",
    ],
    wordBank: [
      { word: "interesting", hebrew: "מעניין" },
      { word: "experience", hebrew: "חוויה/ניסיון" },
      { word: "opinion", hebrew: "דעה" },
      { word: "important", hebrew: "חשוב" },
      { word: "especially", hebrew: "במיוחד" },
    ],
    sentenceStarters: [
      `One topic that I find truly fascinating is ${safeTopic}.`,
      "First of all, it allows people to...",
      "In addition, I have always enjoyed...",
      "For instance, whenever I think about this...",
      "In conclusion, it is an essential part of my life.",
    ],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, level = "Level 2", category = "opinion" } = body;

    const safeTopic = (topic || "").trim();
    if (!safeTopic) {
      return NextResponse.json({ success: false, error: "Missing topic" }, { status: 400 });
    }

    const currentLevel: WritingLevel =
      level === "Level 1" || level === "Level 3" ? level : "Level 2";
    const currentCategory: TaskCategory =
      category === "letter" || category === "description" || category === "creative"
        ? category
        : "opinion";

    const groqApiKey = request.headers.get("x-groq-api-key") || process.env.GROQ_API_KEY;
    const geminiApiKey = request.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY;

    if (!groqApiKey && !geminiApiKey) {
      const fallback = createFallbackTask(safeTopic, currentLevel, currentCategory);
      return NextResponse.json({ success: true, task: fallback, source: "template_fallback" });
    }

    const promptInstructions = `
You are an expert English curriculum designer. Create an interactive writing task for students based on the requested topic and level.

USER REQUEST:
- Topic: "${safeTopic}"
- Target Level: "${currentLevel}"
- Category: "${currentCategory}"

LEVEL GUIDELINES:
- "Level 1" (Very basic / Pre-school / Early beginner): target 10-25 words. Very simple prompt, 4-6 simple words in wordBank with Hebrew translations and emojis, 4 easy sentence starters, and 3 simple guidedSteps.
- "Level 2" (Middle school / ages 13-15): target 50-75 words. Paragraph structure, connectors, 5-6 vocabulary words with Hebrew translations, 4 sentence starters.
- "Level 3" (Elementary native / fluent): target 80-120 words. Rich prompt, sophisticated word bank, mature sentence starters.

Return ONLY a valid JSON object matching this schema (NO MARKDOWN CODEBLOCKS):
{
  "id": "ai-task-${Date.now()}",
  "level": "${currentLevel}",
  "category": "${currentCategory}",
  "emoji": "a suitable emoji",
  "title": "Short English Title",
  "hebrewTitle": "כותרת קולעת בעברית",
  "prompt": "Clear English prompt instructions",
  "hebrewInstructions": "הנחיות ברורות בעברית לתלמיד",
  "targetWords": "${currentLevel === "Level 1" ? "10–25 מילים" : currentLevel === "Level 3" ? "80–120 מילים" : "50–75 מילים"}",
  "minWords": ${currentLevel === "Level 1" ? 8 : currentLevel === "Level 3" ? 75 : 45},
  "maxWords": ${currentLevel === "Level 1" ? 30 : currentLevel === "Level 3" ? 130 : 80},
  "starterTips": ["טיפ 1 בעברית", "טיפ 2 בעברית", "טיפ 3 בעברית"],
  "wordBank": [
    { "word": "englishWord", "hebrew": "תרגום", "emoji": "optional emoji" }
  ],
  "sentenceStarters": [
    "Sentence starter 1...",
    "Sentence starter 2..."
  ]
}
`;

    if (groqApiKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: promptInstructions }],
            response_format: { type: "json_object" },
            temperature: 0.7,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            const parsed = extractJsonFromText(content);
            return NextResponse.json({ success: true, task: parsed, source: "groq" });
          }
        }
      } catch (err) {
        console.warn("Groq generation failed, trying Gemini/fallback:", err);
      }
    }

    if (geminiApiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptInstructions }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = extractJsonFromText(text);
            return NextResponse.json({ success: true, task: parsed, source: "gemini" });
          }
        }
      } catch (err) {
        console.warn("Gemini generation failed:", err);
      }
    }

    const fallback = createFallbackTask(safeTopic, currentLevel, currentCategory);
    return NextResponse.json({ success: true, task: fallback, source: "template_fallback" });
  } catch (error) {
    console.error("Generate writing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate writing task." },
      { status: 500 }
    );
  }
}
