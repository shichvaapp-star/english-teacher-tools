import type { GrammarItem, GrammarTopic } from "@/types/grammar";

// Reference topic: every other topic follows this structure and quality bar.
// Band II: VERBS: Present simple / (with adverbs of frequency) / questions / mental process.

export const presentSimpleTopic: GrammarTopic = {
  id: "present-simple",
  group: "tenses",
  title: "Present Simple",
  titleHe: "הווה פשוט",
  bandRefs: [
    "VERBS: Present simple",
    "VERBS: Present simple (with adverbs of frequency)",
    "VERBS: Present simple - questions",
    "VERBS: Present simple mental process",
  ],
  grades: { 7: "evolving", 8: "evolving", 9: "accurate" },
  rule: {
    1: {
      points: [
        {
          he: "מתי? הרגלים, שגרה ועובדות",
          en: "When? Habits, routines and facts",
          examples: ["I **play** football every day.", "The sun **rises** in the east."],
        },
        {
          he: "עם he / she / it מוסיפים s לפועל",
          en: "he / she / it → add -s",
          examples: ["She **plays** football.", "My dad **likes** coffee."],
        },
        {
          he: "שלילה",
          en: "Negative",
          examples: ["I **don't** like milk.", "He **doesn't** like milk."],
        },
        {
          he: "שאלה",
          en: "Question",
          examples: ["**Do** you like pizza?", "**Does** she play tennis?"],
        },
      ],
      form: [
        { kind: "affirmative", pattern: "I / you / we / they + verb", example: "They play football." },
        { kind: "affirmative", pattern: "he / she / it + verb + s", example: "She plays football." },
        { kind: "negative", pattern: "don't / doesn't + verb", example: "He doesn't play football." },
        { kind: "question", pattern: "Do / Does + subject + verb?", example: "Does she play football?" },
      ],
      timeWords: ["every day", "always", "usually", "often", "sometimes", "never", "on Mondays"],
    },
    2: {
      points: [
        {
          he: "מתי? הרגלים, שגרה, עובדות ולוחות זמנים",
          en: "When? Habits, routines, facts and timetables",
          examples: ["Noa **studies** every evening.", "The bus **leaves** at 7:30."],
        },
        {
          he: "הוספת s עם he / she / it",
          en: "he / she / it: how to add -s",
          examples: ["play → play**s**", "watch → watch**es**", "go → go**es**", "study → stud**ies**"],
          chips: true,
        },
        {
          he: "אחרי does / doesn't – הפועל בלי s",
          en: "After does / doesn't – no -s",
          examples: ["**Does** she **play**?", "✗ Does she plays?"],
        },
        {
          he: "מילות תדירות באות לפני הפועל",
          en: "Frequency words go before the verb",
          examples: ["She **often** reads.", "I **never** eat meat."],
        },
      ],
      form: [
        { kind: "affirmative", pattern: "he / she / it + verb-s / -es / -ies", example: "He watches. She studies." },
        { kind: "negative", pattern: "subject + don't / doesn't + verb", example: "We don't eat meat." },
        { kind: "question", pattern: "(Wh-) + do / does + subject + verb?", example: "How often does he swim?" },
        { kind: "short_answer", pattern: "Yes, … do / does. No, … don't / doesn't.", example: "Yes, she does." },
      ],
      timeWords: ["always", "usually", "often", "sometimes", "hardly ever", "never", "twice a week"],
    },
    3: {
      points: [
        {
          he: "מתי? הרגלים, מצבים קבועים, עובדות ולוחות זמנים",
          en: "When? Habits, permanent states, facts, timetables",
          examples: ["Water **boils** at 100°C.", "The film **starts** at 8."],
        },
        {
          he: "פעלי מצב ומחשבה – בלי ing",
          en: "State verbs – no -ing",
          examples: ["I **know** the answer.", "✗ I am knowing the answer."],
        },
        {
          he: "everybody / nobody / each = יחיד",
          en: "everybody / nobody / each = singular",
          examples: ["Everybody **knows** her.", "Nobody **likes** Mondays."],
        },
        {
          he: "שאלה עם מילת שאלה",
          en: "Wh- questions",
          examples: ["What **does** this word **mean**?", "Where **do** you **live**?"],
        },
      ],
      form: [
        { kind: "affirmative", pattern: "subject + verb(-s)", example: "Everybody knows her." },
        { kind: "negative", pattern: "subject + don't / doesn't + verb", example: "It doesn't matter." },
        { kind: "question", pattern: "Wh- + do / does + subject + verb?", example: "What does this word mean?" },
      ],
      timeWords: ["hardly ever", "rarely", "once a month", "every so often", "nowadays"],
    },
  },
  traps: [
    {
      id: "ps-no-s",
      wrong: "She play tennis.",
      right: "She plays tennis.",
      whyHe: "עם he / she / it חייבים להוסיף s לפועל.",
      whyEn: "He / she / it needs verb + s.",
    },
    {
      id: "ps-be-plus-verb",
      wrong: "I am go to school every day.",
      right: "I go to school every day.",
      whyHe: "לא שמים am / is / are לפני פועל רגיל.",
      whyEn: "Don't put am / is / are before a normal verb.",
    },
    {
      id: "ps-no-do",
      wrong: "You like pizza?",
      right: "Do you like pizza?",
      whyHe: "בעברית שאלה היא רק טון. באנגלית צריך Do / Does בהתחלה.",
      whyEn: "English questions need Do / Does at the start.",
    },
    {
      id: "ps-double-s",
      wrong: "Does she plays?",
      right: "Does she play?",
      whyHe: "ה-s כבר נמצאת ב-does, ולכן הפועל בלי s.",
      whyEn: "The -s is already in does, so the verb has no -s.",
    },
    {
      id: "ps-dont-he",
      wrong: "He don't like milk.",
      right: "He doesn't like milk.",
      whyHe: "עם he / she / it משתמשים ב-doesn't.",
      whyEn: "He / she / it → doesn't.",
    },
    {
      id: "ps-state-ing",
      wrong: "I am knowing the answer.",
      right: "I know the answer.",
      whyHe: "פעלי מצב ומחשבה (know, like, want) לא באים ב-ing.",
      whyEn: "State verbs (know, like, want) don't take -ing.",
    },
  ],
};

const T = "present-simple";

export const presentSimpleItems: GrammarItem[] = [
  // ───────────── Level 3 ─────────────
  {
    id: "ps-3-01", topicId: T, level: 3, type: "mcq",
    sentence: "I ___ what you mean.",
    options: ["am understanding", "understand", "understands"], answer: "understand",
    explanationHe: "understand הוא פועל מחשבה – לא משתמשים בו ב-ing.",
    explanationEn: "understand is a state verb – no -ing.",
    trapId: "ps-state-ing",
  },
  {
    id: "ps-3-02", topicId: T, level: 3, type: "mcq",
    context: "[Eating dinner]",
    sentence: "This soup ___ delicious!",
    options: ["is tasting", "taste", "tastes"], answer: "tastes",
    explanationHe: "taste במובן 'יש לו טעם' הוא פועל מצב → tastes.",
    explanationEn: "taste (= has a flavour) is a state verb → tastes.",
    trapId: "ps-state-ing",
  },
  {
    id: "ps-3-03", topicId: T, level: 3, type: "gap_type",
    context: "[A science fact]",
    sentence: "Water ___ at 0°C.",
    baseForm: "freeze", answers: ["freezes"],
    explanationHe: "עובדה מדעית → Present Simple. Water = it → freezes.",
    explanationEn: "Scientific fact → Present Simple. Water = it → freezes.",
  },
  {
    id: "ps-3-04", topicId: T, level: 3, type: "gap_type",
    sentence: "My uncle ___ planes for a living.",
    baseForm: "fly", answers: ["flies"],
    explanationHe: "עיצור + y → ies: flies.",
    explanationEn: "Consonant + y → -ies: flies.",
  },
  {
    id: "ps-3-05", topicId: T, level: 3, type: "gap_type",
    sentence: "___ you a lot of homework?",
    baseForm: "your teacher / give", answers: ["Does your teacher give"],
    explanationHe: "Does + your teacher + give (בלי s).",
    explanationEn: "Does + your teacher + give (no -s).",
    trapId: "ps-double-s",
  },
  {
    id: "ps-3-06", topicId: T, level: 3, type: "gap_type",
    sentence: "Light ___ faster than sound.",
    baseForm: "travel", answers: ["travels"],
    explanationHe: "עובדה → Present Simple. Light = it → travels.",
    explanationEn: "Fact → Present Simple. Light = it → travels.",
  },
  {
    id: "ps-3-07", topicId: T, level: 3, type: "find_fix",
    instructionHe: "לחצו על המילה השגויה ותקנו אותה",
    tokens: ["Everybody", "in", "my", "class", "have", "a", "phone."],
    wrongIndex: 4, answers: ["has"],
    explanationHe: "Everybody נחשב יחיד → has.",
    explanationEn: "Everybody is singular → has.",
  },
  {
    id: "ps-3-08", topicId: T, level: 3, type: "find_fix",
    instructionHe: "לחצו על המילה השגויה ותקנו אותה",
    tokens: ["My", "parents", "never", "goes", "to", "the", "beach."],
    wrongIndex: 3, answers: ["go"],
    explanationHe: "My parents = they → go (בלי es).",
    explanationEn: "My parents = they → go.",
  },
  {
    id: "ps-3-09", topicId: T, level: 3, type: "find_fix",
    instructionHe: "לחצו על המילה השגויה ותקנו אותה",
    tokens: ["What", "does", "this", "word", "means?"],
    wrongIndex: 4, answers: ["mean", "mean?"],
    explanationHe: "אחרי does הפועל בלי s: What does it mean?",
    explanationEn: "After does, no -s: What does it mean?",
    trapId: "ps-double-s",
  },
  {
    id: "ps-3-10", topicId: T, level: 3, type: "transform",
    source: "My brother watches the news every evening.",
    taskEn: "Ask a question with 'How often'.", taskHe: "שאלו שאלה עם How often",
    answers: [
      "How often does your brother watch the news?",
      "How often does my brother watch the news?",
      "How often does he watch the news?",
    ],
    explanationHe: "How often + does + he + watch (בלי es).",
    explanationEn: "How often + does + he + watch (no -es).",
  },
  {
    id: "ps-3-11", topicId: T, level: 3, type: "transform",
    source: "Shira studies Arabic.",
    taskEn: "Make it negative.", taskHe: "הפכו לשלילה",
    answers: ["Shira doesn't study Arabic.", "Shira does not study Arabic."],
    explanationHe: "doesn't + study – ה-ies חוזר להיות y.",
    explanationEn: "doesn't + study (ies goes back to y).",
  },
  {
    id: "ps-3-12", topicId: T, level: 3, type: "transform",
    source: "Everybody knows the answer.",
    taskEn: "Make it a question.", taskHe: "הפכו לשאלה",
    answers: ["Does everybody know the answer?"],
    explanationHe: "Everybody = יחיד → Does everybody know?",
    explanationEn: "Everybody = singular → Does everybody know?",
  },
  {
    id: "ps-3-13", topicId: T, level: 3, type: "unscramble",
    instructionHe: "סדרו את המילים למשפט",
    words: ["My", "grandmother", "hardly", "ever", "uses", "her", "phone"], ending: ".",
    explanationHe: "מילת תדירות (hardly ever) באה לפני הפועל.",
    explanationEn: "Frequency words (hardly ever) go before the main verb.",
  },
  {
    id: "ps-3-14", topicId: T, level: 3, type: "sort",
    instructionHe: "נכון או שגוי?",
    buckets: ["✓ Correct", "✗ Wrong"],
    entries: [
      { text: "She doesn't like tea.", bucket: "✓ Correct" },
      { text: "Does he plays tennis?", bucket: "✗ Wrong" },
      { text: "I am knowing him well.", bucket: "✗ Wrong" },
      { text: "The museum opens at 9.", bucket: "✓ Correct" },
      { text: "My friends lives near me.", bucket: "✗ Wrong" },
      { text: "Babies sleep a lot.", bucket: "✓ Correct" },
    ],
    explanationHe: "התיקונים: Does he play · I know him · My friends live.",
    explanationEn: "Does he play · I know him · My friends live.",
  },
  {
    id: "ps-3-15", topicId: T, level: 3, type: "cloze_text",
    instructionHe: "השלימו את הפעלים בצורה הנכונה",
    title: "A nurse's day",
    text: "Dana {1} at a hospital in Be'er Sheva. Her shift usually {2} at 7:00. She {3} on her patients and {4} them their medicine. She {5} much sleep, but she {6} her job.",
    blanks: [
      { baseForm: "work", answers: ["works"] },
      { baseForm: "start", answers: ["starts"] },
      { baseForm: "check", answers: ["checks"] },
      { baseForm: "give", answers: ["gives"] },
      { baseForm: "not / get", answers: ["doesn't get", "does not get"] },
      { baseForm: "love", answers: ["loves"] },
    ],
    explanationHe: "Dana / her shift / she = יחיד → s. שלילה: doesn't get.",
    explanationEn: "Dana / her shift / she → -s. Negative: doesn't get.",
  },
  {
    id: "ps-3-16", topicId: T, level: 3, type: "write_own",
    taskEn: "Write two sentences about a family member's routine: one affirmative and one negative.",
    taskHe: "כתבו שני משפטים על השגרה של בן או בת משפחה: אחד חיובי ואחד שלילי.",
    modelAnswers: ["My dad gets up at six every day. He doesn't drink coffee."],
    explanationHe: "he / she → פועל + s. שלילה: doesn't + פועל.",
    explanationEn: "he / she → verb + s. Negative: doesn't + verb.",
  },
  {
    id: "ps-3-17", topicId: T, level: 3, type: "write_own",
    taskEn: "Write two questions you would ask a new friend about their hobbies.",
    taskHe: "כתבו שתי שאלות שהייתם שואלים חבר חדש על התחביבים שלו.",
    modelAnswers: ["What do you do after school? Do you play any sports?"],
    explanationHe: "שאלה: (מילת שאלה) + do + you + פועל.",
    explanationEn: "Question: (Wh-) + do + you + verb.",
  },
];
