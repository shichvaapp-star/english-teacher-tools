export type TaskCategory = "letter" | "opinion" | "creative";

export interface WritingTask {
  id: string;
  category: TaskCategory;
  title: string;
  hebrewTitle: string;
  prompt: string;
  hebrewInstructions: string;
  targetWords: string;
  minWords: number;
  maxWords: number;
  starterTips: string[];
}

export const MIDDLE_SCHOOL_TASKS: WritingTask[] = [
  // -------------------------------------------------------------
  // LETTERS & EMAILS (מכתבים והודעות אישיות)
  // -------------------------------------------------------------
  {
    id: "task-letter-1",
    category: "letter",
    title: "Letter to a Friend about Summer Vacation",
    hebrewTitle: "מכתב לחבר על חופשת הקיץ",
    prompt:
      "Write a short letter in English to a friend describing your summer vacation. Tell them about what you did, places you visited, and how you felt. Ask them about their summer too.",
    hebrewInstructions:
      "כתבו מכתב לחבר/ה באנגלית. ספרו מה עשיתם, איפה ביקרתם ואיך הרגשתם. שאלו גם על החופשה שלהם.",
    targetWords: "50–75 מילים",
    minWords: 45,
    maxWords: 80,
    starterTips: [
      "פתחו בברכה אישית: 'Dear [Name],' או 'Hi [Name],'",
      "ספרו לפחות שתי חוויות נחמדות מהחופשה (למשל ביקור בים או טיול משפחתי)",
      "סיימו בברכת פרידה: 'Write back soon, [Your Name]'",
    ],
  },
  {
    id: "task-letter-2",
    category: "letter",
    title: "Thank-You Letter to a Relative or Host",
    hebrewTitle: "מכתב תודה לאחר אירוח",
    prompt:
      "Write a warm thank-you letter to a relative or friend after spending a weekend at their house. Thank them for the delicious food, great hospitality, and fun activities you enjoyed together.",
    hebrewInstructions:
      "כתבו מכתב תודה חם לקרוב משפחה או חבר לאחר שהתארחתם אצלם. הודו על האוכל הטעים, האירוח והחוויות המשותפות.",
    targetWords: "50–70 מילים",
    minWords: 45,
    maxWords: 80,
    starterTips: [
      "פתחו בברכה חמה: 'Dear Aunt Sarah,' או 'Dear [Name],'",
      "הודו בהתרגשות: 'Thank you so much for having me over this weekend...'",
      "ציינו מאכל או פעילות מסוימת שמאוד אהבתם",
    ],
  },
  {
    id: "task-letter-3",
    category: "letter",
    title: "Advice to a Friend Starting a New School",
    hebrewTitle: "עצות והרגעה לחבר שעובר לבית ספר חדש",
    prompt:
      "A close friend is nervous about moving to a new school. Write them an encouraging letter with three helpful tips on how to make new friends and feel confident on the first day.",
    hebrewInstructions:
      "חבר קרוב מתרגש וחושש ממעבר לבית ספר חדש. כתבו לו מכתב מעודד עם 2-3 עצות מעשיות איך להכיר חברים ולהרגיש בטוח.",
    targetWords: "55–80 מילים",
    minWords: 50,
    maxWords: 90,
    starterTips: [
      "פתחו בחיבוק ועידוד: 'Don't worry, you are going to do great!'",
      "תנו עצה מעשית: 'First, smile and say hi to people sitting next to you.'",
      "סיימו בחיזוק: 'Remember that I am always here for you.'",
    ],
  },
  {
    id: "task-letter-4",
    category: "letter",
    title: "Inviting a Friend to My Birthday Party",
    hebrewTitle: "הזמנה אישית למסיבת יום הולדת",
    prompt:
      "Write an invitation letter or email to a friend inviting them to your birthday celebration. Include the date, time, location, special activities planned, and what they should bring.",
    hebrewInstructions:
      "כתבו הזמנה לחבר/ה למסיבת יום ההולדת שלכם. ציינו תאריך, שעה, מיקום, מה מתוכנן במסיבה ומה להביא.",
    targetWords: "50–70 מילים",
    minWords: 45,
    maxWords: 80,
    starterTips: [
      "פתחו בהכרזה משמחת: 'I am turning 13 and having a big party!'",
      "פרטו תאריך ומקום: 'The party will take place at my house on Friday at 5 PM.'",
      "בקשו אישור הגעה: 'Please let me know if you can come by Wednesday.'",
    ],
  },
  {
    id: "task-letter-5",
    category: "letter",
    title: "An Apology Letter to a Classmate",
    hebrewTitle: "מכתב התנצלות ופיוס לחבר לכיתה",
    prompt:
      "You had a silly argument with a classmate yesterday. Write a sincere apology letter explaining that you value your friendship and suggesting how you can make things right.",
    hebrewInstructions:
      "היה לכם ויכוח מיותר עם חבר לכיתה. כתבו מכתב התנצלות כנה, הסבירו שהחברות חשובה לכם והציעו דרך להשלים.",
    targetWords: "50–75 מילים",
    minWords: 45,
    maxWords: 80,
    starterTips: [
      "הביעו חרטה כנה: 'I am really sorry about our argument yesterday.'",
      "הסבירו שהחברות חשובה לכם: 'Our friendship means a lot to me.'",
      "הציעו להיפגש: 'Let's talk during the break and grab a snack together.'",
    ],
  },
  {
    id: "task-letter-6",
    category: "letter",
    title: "Letter to My Future Self in 5 Years",
    hebrewTitle: "מכתב לעצמי בעוד 5 שנים",
    prompt:
      "Write a letter to yourself five years in the future (when you will be around 18). Describe what your life is like today, your current hobbies, and ask your future self if your dreams came true.",
    hebrewInstructions:
      "כתבו מכתב לעצמכם בעוד חמש שנים. ספרו על שגרת יומכם כיום, התחביבים שלכם, ושאלו האם החלומות שלכם התגשמו.",
    targetWords: "55–80 מילים",
    minWords: 50,
    maxWords: 90,
    starterTips: [
      "פתחו ב: 'Dear future me,'",
      "ספרו מה אתם הכי אוהבים לעשות כרגע: 'Right now, my favorite hobby is...'",
      "שאלו שאלות מסקרנות: 'Are you still playing basketball? What are your plans?'",
    ],
  },
  {
    id: "task-letter-7",
    category: "letter",
    title: "Recommending My Favorite Book or Movie",
    hebrewTitle: "המלצה על ספר או סרט אהוב לחבר",
    prompt:
      "Write a letter to a friend recommending your favorite book, movie, or series. Explain what it is about without giving away spoilers, and give two reasons why they will love it.",
    hebrewInstructions:
      "כתבו מכתב המלצה לחבר/ה על ספר, סרט או סדרה שאתם אוהבים. תארו בקצרה את העלילה (ללא ספוילרים!) ונמקו למה כדאי להם לצפות או לקרוא.",
    targetWords: "55–80 מילים",
    minWords: 50,
    maxWords: 90,
    starterTips: [
      "התחילו בהמלצה ישירה: 'You must watch/read... because it is amazing!'",
      "תארו את הדמות הראשית: 'The main character is very brave and funny.'",
      "סיימו בשאלה: 'Tell me what you think after you check it out!'",
    ],
  },
  {
    id: "task-letter-8",
    category: "letter",
    title: "Email to a Teacher with a Question or Thanks",
    hebrewTitle: "אימייל מנומס למורה לשאלה או תודה",
    prompt:
      "Write a polite email to your English or science teacher. Thank them for an interesting lesson and ask a clarifying question about an upcoming school project or homework task.",
    hebrewInstructions:
      "כתבו אימייל מנומס ומכבד למורה. הודו על שיעור מעניין ושאלו שאלה מבהירה לגבי פרויקט או שיעורי בית.",
    targetWords: "50–70 מילים",
    minWords: 45,
    maxWords: 80,
    starterTips: [
      "פתחו בפנייה רשמית: 'Dear Ms. Cohen,' או 'Dear Mr. Levi,'",
      "הסבירו את מטרת האימייל: 'I am writing to thank you for today's lesson and ask...'",
      "סיימו בכבוד: 'Best regards, [Your Name]'",
    ],
  },

  // -------------------------------------------------------------
  // OPINION & ARGUMENTATIVE (פסקאות דעה והבעת עמדה)
  // -------------------------------------------------------------
  {
    id: "task-opinion-1",
    category: "opinion",
    title: "Should Phones be Allowed During School Breaks?",
    hebrewTitle: "שימוש בטלפונים בהפסקות בבית הספר",
    prompt:
      "Should middle-school students be allowed to use mobile phones during school breaks? Write a paragraph expressing your opinion. Provide at least two reasons to support your position.",
    hebrewInstructions:
      "האם יש לאפשר לתלמידי חטיבה להשתמש בטלפונים ניידים בזמן ההפסקות? כתבו פסקת דעה ונמקו לפחות בשתי סיבות.",
    targetWords: "50–80 מילים",
    minWords: 45,
    maxWords: 90,
    starterTips: [
      "הביעו עמדה ברורה: 'In my opinion, students should (not) be allowed to use phones...'",
      "השתמשו במילות קישור: 'First of all,... In addition,...'",
      "סיימו במשפט סיכום: 'In conclusion, I believe that...'",
    ],
  },
  {
    id: "task-opinion-2",
    category: "opinion",
    title: "Why Physical Exercise and Sports Matter",
    hebrewTitle: "חשיבות פעילות גופנית וספורט לנערים",
    prompt:
      "Explain why physical exercise is important for teenagers. Write an opinion paragraph discussing health benefits, focus in class, and positive mood improvement.",
    hebrewInstructions:
      "הסבירו מדוע פעילות גופנית וספורט חשובים לבני נוער. כתבו פסקת דעה על היתרונות הבריאותיים, הריכוז בלימודים ומצב הרוח.",
    targetWords: "50–80 מילים",
    minWords: 45,
    maxWords: 90,
    starterTips: [
      "התחילו ברעיון מרכזי: 'I believe that daily exercise is essential for teens.'",
      "נמקו עם דוגמאות: 'Playing sports helps our body stay strong and relieves stress.'",
      "סיימו בקריאה לפעולה: 'Therefore, everyone should find an activity they enjoy.'",
    ],
  },
  {
    id: "task-opinion-3",
    category: "opinion",
    title: "Should Middle Schools Have School Uniforms?",
    hebrewTitle: "תלבושת אחידה בבית הספר: בעד או נגד?",
    prompt:
      "Do you think schools should require students to wear school uniforms? Write an opinion paragraph stating your view, explaining whether uniforms create equality or limit personal expression.",
    hebrewInstructions:
      "האם לדעתכם יש לחייב תלבושת אחידה בבית הספר? כתבו פסקת דעה והסבירו האם תלבושת יוצרת שוויון או מגבילה את הביטוי האישי.",
    targetWords: "50–80 מילים",
    minWords: 45,
    maxWords: 90,
    starterTips: [
      "קבעו עמדה: 'From my perspective, school uniforms are a good/bad idea because...'",
      "הביאו סיבה עיקרית: 'On one hand, uniforms make everyone equal in the morning.'",
      "סכמו בקצרה: 'To sum up, I think uniforms should/should not be mandatory.'",
    ],
  },
  {
    id: "task-opinion-4",
    category: "opinion",
    title: "Are Video Games Helpful or Harmful for Kids?",
    hebrewTitle: "משחקי מחשב ווידאו: מועילים או מזיקים?",
    prompt:
      "Many parents think video games waste time, but many kids say games develop teamwork and strategy. Write an opinion paragraph expressing your view on video games.",
    hebrewInstructions:
      "הורים רבים סבורים שמשחקי וידאו הם בזבוז זמן, אך תלמידים רבים טוענים שהם מפתחים חשיבה מהירה ועבודת צוות. כתבו פסקת דעה מנומקת.",
    targetWords: "50–80 מילים",
    minWords: 45,
    maxWords: 90,
    starterTips: [
      "הציגו עמדה מאוזנת: 'Although some games can be addictive, I think gaming has benefits.'",
      "תנו דוגמה: 'For instance, multiplayer games teach communication and problem solving.'",
      "סכמו על איזון נכון: 'In moderation, gaming is both fun and beneficial.'",
    ],
  },
  {
    id: "task-opinion-5",
    category: "opinion",
    title: "Should Homework be Banned on Weekends?",
    hebrewTitle: "ביטול שיעורי בית בסופי שבוע",
    prompt:
      "Should teachers give homework over the weekend? Write an opinion paragraph arguing whether weekends should be completely free for family and rest, or if practice is needed.",
    hebrewInstructions:
      "האם צריך להפסיק לתת שיעורי בית בסופי שבוע? כתבו פסקת דעה ונמקו האם סוף השבוע נועד למנוחה ומפגש משפחתי או שחובה להמשיך לתרגל.",
    targetWords: "50–80 מילים",
    minWords: 45,
    maxWords: 90,
    starterTips: [
      "פתחו במשפט חזק: 'I strongly believe that students should not get weekend homework.'",
      "הסבירו את הצורך במנוחה: 'After a long week of tests, teenagers need to rest.'",
      "סכמו את הטיעון: 'For these reasons, weekends should belong to families.'",
    ],
  },
  {
    id: "task-opinion-6",
    category: "opinion",
    title: "Why Learning English is Essential Today",
    hebrewTitle: "מדוע חשוב כל כך ללמוד אנגלית כיום?",
    prompt:
      "English is the international language of technology, music, and travel. Write an opinion paragraph explaining why investing in learning English is so rewarding for young people.",
    hebrewInstructions:
      "אנגלית היא השפה הבינלאומית של טכנולוגיה, מוזיקה ונסיעות בעולם. כתבו פסקת דעה המנמקת מדוע כדאי להשקיע בלימוד אנגלית כבר בחטיבה.",
    targetWords: "50–80 מילים",
    minWords: 45,
    maxWords: 90,
    starterTips: [
      "הדגישו את החשיבות: 'English is without a doubt one of the most useful skills today.'",
      "ציינו שימושים מעשיים: 'It allows us to travel anywhere and understand the internet.'",
      "משפט מסכם: 'Therefore, every student should practice English regularly.'",
    ],
  },
  {
    id: "task-opinion-7",
    category: "opinion",
    title: "Why Eating Healthy Food and Drinking Water Counts",
    hebrewTitle: "חשיבות התזונה הבריאה ושתיית מים",
    prompt:
      "Many teens eat junk food and drink sodas daily. Write an opinion paragraph explaining why eating fruit, vegetables, and drinking plenty of water makes students feel happier and perform better in school.",
    hebrewInstructions:
      "בני נוער רבים צורכים חטיפים ומשקאות ממותקים. כתבו פסקת דעה והסבירו מדוע תזונה בריאה ושתיית מים מסייעות לריכוז, אנרגיה והרגשה טובה.",
    targetWords: "50–80 מילים",
    minWords: 45,
    maxWords: 90,
    starterTips: [
      "משפט פתיחה מעניין: 'Good nutrition is like premium fuel for our brain.'",
      "הביאו נימוק מרכזי: 'Drinking water keeps us alert and prevents headaches during class.'",
      "סיום משכנע: 'Small healthy choices every day make a huge difference.'",
    ],
  },
  {
    id: "task-opinion-8",
    category: "opinion",
    title: "Should Every Family Adopt a Pet?",
    hebrewTitle: "האם כדאי לכל משפחה לגדל חיית מחמד?",
    prompt:
      "Do pets make family life better? Write an opinion paragraph about whether adopting a dog, cat, or other pet teaches responsibility and brings joy to children and homes.",
    hebrewInstructions:
      "האם גידול חיית מחמד תורם למשפחה? כתבו פסקת דעה ונמקו האם אימוץ כלב או חתול מחנך לאחריות ומביא שמחה לבית.",
    targetWords: "50–80 מילים",
    minWords: 45,
    maxWords: 90,
    starterTips: [
      "הביעו דעה חמה: 'In my view, having a pet is a wonderful experience for any family.'",
      "הסבירו אחריות: 'Walking a dog and feeding a pet teaches kids to be responsible.'",
      "סיימו בחום: 'In conclusion, pets bring unconditional love into our lives.'",
    ],
  },

  // -------------------------------------------------------------
  // CREATIVE & NARRATIVE STARTERS (כתיבה יצירתית וסיפורים)
  // -------------------------------------------------------------
  {
    id: "task-creative-1",
    category: "creative",
    title: "The Mysterious Key in the School Yard",
    hebrewTitle: "המפתח המוזהב המסתורי בחצר בית הספר",
    prompt:
      "While walking in the school garden, you find a small golden key hidden under an old oak tree. Write a short story about what door it unlocked and what secret you discovered.",
    hebrewInstructions:
      "תוך כדי הליכה בחצר בית הספר מצאתם מפתח זהב ישן טמון באדמה. כתבו סיפור קצר על הדלת שהמפתח פתח ועל הסוד המפתיע שגיליתם.",
    targetWords: "55–85 מילים",
    minWords: 50,
    maxWords: 95,
    starterTips: [
      "פתחו ברגע המציאה: 'One sunny morning, something shiny caught my eye in the dirt.'",
      "תארו את הדלת המסתורית: 'I noticed a tiny wooden door behind the science lab.'",
      "סיימו בסיום מפתיע ומותח!",
    ],
  },
  {
    id: "task-creative-2",
    category: "creative",
    title: "A Day with a Friendly Alien on Earth",
    hebrewTitle: "יום מפתיע עם חייזר חביב שהגיע לכדור הארץ",
    prompt:
      "A friendly alien named 'Zog' lands in your backyard. He wants to know what middle school in Israel is like. Write a story describing your day showing him around.",
    hebrewInstructions:
      "חייזר ידידותי נחת בחצר שלכם ורוצה לדעת איך זה להיות תלמיד בישראל. כתבו סיפור קצר ומשעשע על מה שהראיתם לו וכיצד הוא הגיב.",
    targetWords: "55–85 מילים",
    minWords: 50,
    maxWords: 95,
    starterTips: [
      "פתחו בתיאור הדמות: 'Zog was small, purple, and had three curious glowing eyes.'",
      "ספרו מה עשיתם יחד: 'I offered him a falafel pita and taught him some English words.'",
      "סיימו בפרידה חמה לפני שהוא המריא בחללית.",
    ],
  },
  {
    id: "task-creative-3",
    category: "creative",
    title: "If I Had a Time Machine",
    hebrewTitle: "אילו הייתה לי מכונת זמן: לאן הייתי נוסע/ת?",
    prompt:
      "Imagine you built a working time machine. Where and when would you travel — the ancient past with dinosaurs, ancient Egypt, or 100 years into the future? Describe your adventure.",
    hebrewInstructions:
      "דמיינו שבניתם מכונת זמן אמיתית. לאן הייתם נוסעים — לעבר הרחוק (דינוזאורים, מצרים העתיקה) או 100 שנה לעתיד? תארו את המסע והמראות.",
    targetWords: "55–85 מילים",
    minWords: 50,
    maxWords: 95,
    starterTips: [
      "פתחו בהחלטה: 'If I had a time machine, I would definitely visit the year 2125.'",
      "תארו מראות מיוחדים: 'I saw flying solar cars and robots serving ice cream.'",
      "סיימו ברגש: 'It was the most exciting journey of my life.'",
    ],
  },
  {
    id: "task-creative-4",
    category: "creative",
    title: "My Dream Invention and What It Does",
    hebrewTitle: "ההמצאה החלומית שלי וכיצד היא תשנה את העולם",
    prompt:
      "You are a young scientist inventing a brand new gadget that solves an everyday problem. Describe what your invention looks like, how it works, and how it helps people.",
    hebrewInstructions:
      "אתם ממציאים צעירים שפיתחו מכשיר חדשני הפותר בעיה מוכרת. תארו איך ההמצאה נראית, כיצד היא פועלת ואיך היא הופכת את החיים לקלים יותר.",
    targetWords: "55–85 מילים",
    minWords: 50,
    maxWords: 95,
    starterTips: [
      "תנו שם להמצאה: 'My dream invention is called the Homework-Helper 3000.'",
      "הסבירו מה היא עושה: 'It projects 3D interactive diagrams to explain tough math.'",
      "סיימו בחזון: 'I hope my invention will make learning fun for everyone.'",
    ],
  },
  {
    id: "task-creative-5",
    category: "creative",
    title: "Trapped Inside the School After Dark",
    hebrewTitle: "נעולים בבית הספר לאחר רדת החשכה",
    prompt:
      "You accidentally fell asleep in the school library and woke up after everyone had left and the doors were locked. Write a thrilling short story about your adventure escaping.",
    hebrewInstructions:
      "נרדמתם בטעות בספריית בית הספר והתעוררתם כשכולם כבר הלכו והדלתות נעולות. כתבו סיפור קצר ומותח על מה שקרה וכיצד יצאתם.",
    targetWords: "55–85 מילים",
    minWords: 50,
    maxWords: 95,
    starterTips: [
      "פתחו באווירה: 'When I opened my eyes, the library was completely dark and silent.'",
      "צרו מתח: 'Suddenly, I heard footsteps echoing in the long hallway.'",
      "סיימו בפתרון: 'Luckily, I found the janitor who unlocked the side door.'",
    ],
  },
  {
    id: "task-creative-6",
    category: "creative",
    title: "The Day All Screens and Internet Stopped",
    hebrewTitle: "היום שבו כל המסכים והאינטרנט כבו",
    prompt:
      "Imagine one day the world woke up and all smartphones, tablets, and computers were completely turned off for 24 hours. Write a story about what your family and friends did instead.",
    hebrewInstructions:
      "דמיינו שבוקר אחד כל הטלפונים והאינטרנט הפסיקו לפעול למשך יממה שלמה. כתבו סיפור קצר על מה שעשיתם עם המשפחה והחברים במקום זאת.",
    targetWords: "55–85 מילים",
    minWords: 50,
    maxWords: 95,
    starterTips: [
      "פתחו בהלם הראשוני: 'At first, everyone panicked because no screens turned on.'",
      "תארו את הפעילויות החלופיות: 'We went outside, played board games, and talked for hours.'",
      "סיימו בתובנה: 'We realized how much fun real-life conversations can be.'",
    ],
  },
  {
    id: "task-creative-7",
    category: "creative",
    title: "If Animals Could Speak English",
    hebrewTitle: "אילו בעלי חיים יכלו לדבר באנגלית",
    prompt:
      "You wake up one morning and discover that your family pet (or a neighborhood cat/bird) can speak fluent English to you! Write a funny conversation between you and the animal.",
    hebrewInstructions:
      "בוקר אחד גיליתם שחיית המחמד שלכם (או חתול בשכונה) מסוגלת לדבר איתכם באנגלית שוטפת! כתבו סיפור קצר ומשעשע על השיחה ביניכם.",
    targetWords: "55–85 מילים",
    minWords: 50,
    maxWords: 95,
    starterTips: [
      "פתחו בהפתעה: 'My dog Max looked at me and said: Good morning, where is my breakfast?'",
      "שלבו דיאלוג קצר: 'I rubbed my eyes in disbelief and answered: Did you just talk?'",
      "סיימו בברית סודית ביניכם.",
    ],
  },
  {
    id: "task-creative-8",
    category: "creative",
    title: "The Secret Room Behind the Library Shelf",
    hebrewTitle: "החדר הסודי מאחורי מדף הספרים",
    prompt:
      "While looking for an adventure book in the corner of the school library, you pull a blue book and the shelf swings open into a hidden chamber. Write a story describing what you found inside.",
    hebrewInstructions:
      "חיפשתם ספר הרפתקאות בספרייה, משכתם בספר כחול עתיק ומדף הספרים נפתח אל חדר סודי נסתר. כתבו מה גיליתם בתוך החדר.",
    targetWords: "55–85 מילים",
    minWords: 50,
    maxWords: 95,
    starterTips: [
      "פתחו ברגע הגילוי: 'As I pulled the heavy book, I heard a click and the shelf moved.'",
      "תארו את החדר הנסתר: 'Inside, there were old school photos and a chest of historical letters.'",
      "סיימו בהחלטה לשמור על הסוד.",
    ],
  },
];

export const MS_CONNECTORS = [
  {
    category: "סדר וארגון",
    items: [
      { text: "First of all, ", heb: "קודם כל" },
      { text: "Secondly, ", heb: "שנית" },
      { text: "Next, ", heb: "לאחר מכן" },
      { text: "Finally, ", heb: "לבסוף" },
      { text: "In conclusion, ", heb: "לסיכום" },
    ],
  },
  {
    category: "הוספת מידע",
    items: [
      { text: "In addition, ", heb: "בנוסף" },
      { text: "Furthermore, ", heb: "יתרה מכך" },
      { text: "Also, ", heb: "גם" },
      { text: "Moreover, ", heb: "יתר על כן" },
    ],
  },
  {
    category: "הצגת ניגוד",
    items: [
      { text: "However, ", heb: "אולם, עם זאת" },
      { text: "On the other hand, ", heb: "מצד שני" },
      { text: "Although ", heb: "למרות ש-" },
      { text: "Even though ", heb: "אף על פי ש-" },
    ],
  },
  {
    category: "סיבה, תוצאה ודוגמה",
    items: [
      { text: "Because ", heb: "בגלל ש-" },
      { text: "For example, ", heb: "לדוגמה" },
      { text: "As a result, ", heb: "כתוצאה מכך" },
      { text: "Therefore, ", heb: "לפיכך" },
    ],
  },
];
