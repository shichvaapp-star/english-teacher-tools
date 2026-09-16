export interface MSUnseenQuestion {
  id: string;
  number: number;
  paragraphIndex: number;
  type: "mcq" | "open" | "copy";
  prompt: string;
  options?: string[];
  correctIndex?: number;
  targetSentence?: string;
  modelAnswer?: string;
  keywords?: string[];
  explanationHebrew: string;
  points: number;
}

export interface MSUnseenStory {
  id: string;
  title: string;
  hebrewTitle: string;
  level: "Easy" | "Medium" | "Hard";
  gradeLabel: string;
  paragraphs: string[];
  vocabularyHints: { word: string; translation: string }[];
  questions: MSUnseenQuestion[];
  totalPoints: number;
}

export const MIDDLE_SCHOOL_UNSEENS: MSUnseenStory[] = [
  {
    id: "ms-story-easy-1",
    title: "The Mystery of the School Garden",
    hebrewTitle: "תעלומת גינת בית הספר",
    level: "Easy",
    gradeLabel: "כיתה ז׳ (רמה קלה)",
    paragraphs: [
      "Every Tuesday afternoon, the students of Class 7B work together in the school vegetable garden. Last month, they planted juicy red tomatoes, green cucumbers, and sweet strawberries. They were proud of their hard work, and each morning they checked the small plants.",
      "However, yesterday morning, Maya and Tom noticed something strange. Several ripe red strawberries were completely missing from the bushes. At first, Tom thought that another student took them. But Maya looked closer at the damp soil and discovered tiny paw footprints near the strawberry patch.",
      "The next afternoon, the students stayed quietly behind the wooden bench with their camera. After ten minutes of waiting, a fluffy brown rabbit hopped out from behind the bushes, happily nibbled on a small strawberry, and quickly disappeared into the bushes. The mystery was solved, and the class decided to build a small wooden fence to protect their berries while leaving a few carrots outside for their rabbit friend.",
    ],
    vocabularyHints: [
      { word: "vegetable", translation: "ירק" },
      { word: "planted", translation: "שתלו" },
      { word: "noticed", translation: "שמו לב" },
      { word: "missing", translation: "חסר, נעלם" },
      { word: "footprints", translation: "עקבות" },
      { word: "disappeared", translation: "נעלם" },
      { word: "protect", translation: "להגן" },
    ],
    totalPoints: 100,
    questions: [
      {
        id: "q-e-1",
        number: 1,
        paragraphIndex: 1,
        type: "mcq",
        prompt: "When do the students of Class 7B work in the school garden?",
        options: [
          "Every Tuesday afternoon.",
          "Every morning before school starts.",
          "Only on Friday weekends.",
          "Once a year during the summer.",
        ],
        correctIndex: 0,
        explanationHebrew: "בפסקה 1 כתוב במפורש: 'Every Tuesday afternoon, the students of Class 7B work together in the school vegetable garden.'",
        points: 25,
      },
      {
        id: "q-e-2",
        number: 2,
        paragraphIndex: 2,
        type: "mcq",
        prompt: "What made Maya realize that a student did not take the strawberries?",
        options: [
          "She saw footprints of a small animal in the damp soil.",
          "A teacher told her who took the strawberries.",
          "She found a bag of strawberries in the classroom.",
          "The strawberries were still on the bushes.",
        ],
        correctIndex: 0,
        explanationHebrew: "בפסקה 2 מיה ראתה עקבות כפות רגליים קטנות באדמה: 'discovered tiny paw footprints near the strawberry patch.'",
        points: 25,
      },
      {
        id: "q-e-3",
        number: 3,
        paragraphIndex: 2,
        type: "copy",
        prompt: "Copy ONE sentence from Paragraph 2 that shows Tom suspected another pupil at first.",
        targetSentence: "At first, Tom thought that another student took them.",
        explanationHebrew: "המשפט שמראה שתום חשד בתלמיד אחר: 'At first, Tom thought that another student took them.'",
        points: 25,
      },
      {
        id: "q-e-4",
        number: 4,
        paragraphIndex: 3,
        type: "open",
        prompt: "What smart solution did the students find to solve the problem?",
        modelAnswer: "They built a small fence to protect the garden and left carrots outside for the rabbit.",
        keywords: ["fence", "protect", "carrots", "rabbit"],
        explanationHebrew: "התלמידים החליטו לבנות גדר קטנה להגן על התותים, ולהשאיר גזרים בחוץ לחבר השפן.",
        points: 25,
      },
    ],
  },
  {
    id: "ms-story-med-1",
    title: "The Robot That Cleaned the Beach",
    hebrewTitle: "הרובוט שמנקה את חוף הים",
    level: "Medium",
    gradeLabel: "כיתה ח׳ (רמה בינונית)",
    paragraphs: [
      "Plastic pollution along Mediterranean beaches has become an alarming environmental challenge. Every summer, tons of plastic bottle caps, snack wrappers, and cigarette butts are discarded on the sand. Marine biologists warn that this trash harms marine wildlife, particularly sea turtles who mistake floating plastic bags for jellyfish.",
      "To address this issue, a group of three eighth-graders from Ashdod built an autonomous cleaning robot called 'Sandy'. Equipped with solar-powered tracks, a high-resolution camera, and a gentle metal rake, Sandy glides across the shoreline identifying and collecting small pieces of trash while sifting the clean sand back onto the beach.",
      "Sandy's intelligent software uses computer vision to distinguish between natural objects like shells and seaweed and harmful artificial plastic. In its first pilot test on Ashdod's public beach, the robot collected over twenty kilograms of plastic in three hours. The young inventors now hope to deploy several units along the entire coast next summer.",
    ],
    vocabularyHints: [
      { word: "pollution", translation: "זיהום" },
      { word: "discarded", translation: "הושלכו, נזרקו" },
      { word: "wildlife", translation: "חיות בר" },
      { word: "autonomous", translation: "אוטונומי, פועל עצמאית" },
      { word: "distinguish", translation: "להבחין, להבדיל" },
      { word: "inventors", translation: "ממציאים" },
    ],
    totalPoints: 100,
    questions: [
      {
        id: "q-m-1",
        number: 1,
        paragraphIndex: 1,
        type: "mcq",
        prompt: "Why are plastic bags especially dangerous to sea turtles?",
        options: [
          "Turtles mistake them for jellyfish and eat them.",
          "The bags prevent turtles from swimming fast.",
          "Plastic bags make the seawater too cold.",
          "Turtles use plastic bags to build nests.",
        ],
        correctIndex: 0,
        explanationHebrew: "בפסקה 1 כתוב שצבי ים חושבים ששקיות ניילון צפות הן מדוזות: 'particularly sea turtles who mistake floating plastic bags for jellyfish.'",
        points: 25,
      },
      {
        id: "q-m-2",
        number: 2,
        paragraphIndex: 2,
        type: "mcq",
        prompt: "How does the robot 'Sandy' power its movements?",
        options: [
          "Using solar-powered tracks.",
          "With traditional gasoline engines.",
          "It must be plugged into an electrical wall outlet.",
          "Students must push it by hand.",
        ],
        correctIndex: 0,
        explanationHebrew: "בפסקה 2 מוסבר שהרובוט מצויד בזחלים שמופעלים מאנרגיה סולארית: 'Equipped with solar-powered tracks'.",
        points: 25,
      },
      {
        id: "q-m-3",
        number: 3,
        paragraphIndex: 3,
        type: "copy",
        prompt: "Copy ONE sentence from Paragraph 3 that demonstrates Sandy was very effective in its first test.",
        targetSentence: "In its first pilot test on Ashdod's public beach, the robot collected over twenty kilograms of plastic in three hours.",
        explanationHebrew: "המשפט מראה שהרובוט אסף מעל 20 קילוגרם פלסטיק בשלוש שעות בלבד בבדיקה הראשונה.",
        points: 25,
      },
      {
        id: "q-m-4",
        number: 4,
        paragraphIndex: 3,
        type: "open",
        prompt: "According to Paragraph 3, how does Sandy know not to pick up natural shells and seaweed?",
        modelAnswer: "Its computer vision software distinguishes between natural objects and artificial plastic.",
        keywords: ["computer", "vision", "distinguish", "software", "artificial"],
        explanationHebrew: "התוכנה של סנדי משתמשת בראייה ממוחשבת כדי להבחין בין פריטים טבעיים לבין פלסטיק מלאכותי.",
        points: 25,
      },
    ],
  },
  {
    id: "ms-story-hard-1",
    title: "The Science of Memory and Good Study Habits",
    hebrewTitle: "מדעי הזיכרון והרגלי למידה אפקטיביים",
    level: "Hard",
    gradeLabel: "כיתה ט׳ (רמה מתקדמת)",
    paragraphs: [
      "Many middle-school students believe that cramming all night before an important exam is the fastest way to get high marks. However, cognitive psychologists demonstrate that this approach is remarkably inefficient. The human brain does not absorb complex information like a digital hard drive; instead, memories require active consolidation during sleep.",
      "When we learn new historical facts or English vocabulary words, temporary neural connections form in a brain region called the hippocampus. During deep sleep phases, the brain replays these neural pathways and transfers the data into the neocortex for long-term storage. Consequently, studying for two hours and sleeping for eight hours yields far better retention than studying for ten hours with zero sleep.",
      "Furthermore, educational researchers recommend the 'spaced repetition' technique. Rather than reviewing all vocabulary words in a single exhausting afternoon, students should review the words across several shorter sessions spaced over multiple days. This deliberate repetition signals to the brain that the knowledge is vital, preventing the rapid forgetting curve from erasing what was learned.",
    ],
    vocabularyHints: [
      { word: "cramming", translation: "למידה דחוסה של הרגע האחרון" },
      { word: "inefficient", translation: "לא יעיל" },
      { word: "consolidation", translation: "גיבוש, ייצוב (בזיכרון)" },
      { word: "retention", translation: "שמירה וזכירה של מידע" },
      { word: "spaced repetition", translation: "חזרתיות מרווחת בזמן" },
    ],
    totalPoints: 100,
    questions: [
      {
        id: "q-h-1",
        number: 1,
        paragraphIndex: 1,
        type: "mcq",
        prompt: "What common misconception about studying is highlighted in Paragraph 1?",
        options: [
          "That cramming all night before an exam is an effective way to study.",
          "That sleeping helps strengthen new memories.",
          "That middle-school students study too many hours every week.",
          "That reading books is better than listening to lectures.",
        ],
        correctIndex: 0,
        explanationHebrew: "בפסקה 1 מודגשת הטעות הנפוצה: תלמידים חושבים שלמידה של כל הלילה היא הדרך המהירה ביותר להצליח, אך פסיכולוגים מוכיחים שהיא בלתי יעילה.",
        points: 25,
      },
      {
        id: "q-h-2",
        number: 2,
        paragraphIndex: 2,
        type: "mcq",
        prompt: "What crucial biological process happens in the brain during deep sleep?",
        options: [
          "Information moves from temporary hippocampus storage to long-term neocortex storage.",
          "The brain completely forgets historical facts to rest.",
          "Brain cells stop all communication until morning.",
          "The brain produces new vocabulary words automatically.",
        ],
        correctIndex: 0,
        explanationHebrew: "בפסקה 2 מוסבר שבזמן שינה עמוקה, המידע עובר מאזור ההיפוקמפוס הזמני לאזור הניאוקורטקס לאחסון ארוך טווח.",
        points: 25,
      },
      {
        id: "q-h-3",
        number: 3,
        paragraphIndex: 3,
        type: "copy",
        prompt: "Copy the sentence from Paragraph 3 that explains what 'spaced repetition' involves.",
        targetSentence: "Rather than reviewing all vocabulary words in a single exhausting afternoon, students should review the words across several shorter sessions spaced over multiple days.",
        explanationHebrew: "זהו המשפט שמגדיר חזרתיות מרווחת: חלוקת הלמידה למספר מפגשים קצרים לאורך כמה ימים.",
        points: 25,
      },
      {
        id: "q-h-4",
        number: 4,
        paragraphIndex: 3,
        type: "open",
        prompt: "Why does spaced repetition prevent students from forgetting what they learned?",
        modelAnswer: "It signals to the brain that the knowledge is vital and important, protecting it from being erased.",
        keywords: ["signals", "vital", "important", "brain", "forgetting"],
        explanationHebrew: "החזרתיות המרווחת מאותתת למוח שהמידע חשוב וחיוני, ובכך מונעת את מחיקתו על ידי עקומת השכחה.",
        points: 25,
      },
    ],
  },
];
