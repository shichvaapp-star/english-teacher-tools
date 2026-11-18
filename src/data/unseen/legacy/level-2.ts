import { MSUnseenStory } from "@/types/unseen";

export const LEVEL_2_UNSEENS: MSUnseenStory[] = [
  {
    "id": "story-level2-1",
    "title": "The Negev Desert Tree",
    "hebrewTitle": "עץ השיטה בנגב",
    "level": "Level 2",
    "levelLabel": "רמה 2 - רמה שוטפת",
    "levelDescription": "For native Hebrew speakers who are in a satisfactory level in English (late elementary equivalent).",
    "paragraphs": [
      "Clara is an explorer who likes to find old things.  Last year, she traveled to the Negev desert in Israel.  The desert was hot and dry, but Clara loved her job.  One sunny morning, she climbed a high hill.",
      "On a big rock, she saw a very old picture of a tree.  She took out her camera and took a photograph of it.  Clara knew that this picture was special.",
      "The picture had a secret message written on it in a strange language. Clara spent three weeks trying to understand the message. She read many old books in the library. Finally, she found out the meaning. The message was a map that showed how to find water under a big tree in the middle of the desert. Clara packed her bag and started her journey.",
      "Clara walked to the tree for two days.  The desert was quiet and she was very tired.  When she arrived, she did not find gold, but she did find a special plant.",
      "Clara took some leaves to show to scientists in the city.  Later, doctors used this plant to make new medicines for sick children.  Clara was very happy with her discovery and wanted to return soon."
    ],
    "vocabularyHints": [
      {
        "word": "explorer",
        "translation": "חוקרת / מגלה"
      },
      {
        "word": "picture",
        "translation": "תמונה / ציור"
      },
      {
        "word": "message",
        "translation": "מסר / הודעה"
      },
      {
        "word": "special",
        "translation": "מיוחד"
      },
      {
        "word": "doctor",
        "translation": "רופא"
      },
      {
        "word": "medicine",
        "translation": "תרופה"
      }
    ],
    "questions": [
      {
        "id": "story-level2-1-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where did Clara find the picture of the tree?",
        "options": [
          "In a school garden",
          "In a green forest",
          "In the Negev desert",
          "In a museum"
        ],
        "correctIndex": 2,
        "explanationHebrew": "נכון מאוד! בפסקה 1 כתוב שקלארה מצאה את התמונה במדבר הנגב (Negev desert).",
        "points": 10
      },
      {
        "id": "story-level2-1-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "open",
        "prompt": "When did Clara travel to the Negev desert?",
        "correctIndex": 0,
        "modelAnswer": "She traveled there last year.",
        "keywords": [
          "last year",
          "year"
        ],
        "explanationHebrew": "נכון מאוד! בפסקה 1 כתוב שהיא נסעה בשנה שעברה (Last year).",
        "points": 10
      },
      {
        "id": "story-level2-1-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "copy",
        "prompt": "Copy the sentence that shows Clara took a photo of the picture on the rock.",
        "correctIndex": 0,
        "targetSentence": "She took out her camera and took a photograph of it.",
        "explanationHebrew": "המשפט הנכון הוא: 'She took out her camera and took a photograph of it.' (היא הוציאה את המצלמה שלה וצילמה את זה).",
        "points": 10
      },
      {
        "id": "story-level2-1-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "How long did it take Clara to understand the secret message?",
        "correctIndex": 0,
        "modelAnswer": "It took her three weeks to understand it.",
        "keywords": [
          "three weeks",
          "3 weeks",
          "weeks"
        ],
        "explanationHebrew": "התשובה המוצעת היא שלקח לה שלושה שבועות להבין את המסר (three weeks).",
        "points": 10
      },
      {
        "id": "story-level2-1-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "Where did Clara read old books to understand the message?",
        "options": [
          "In a small desert school",
          "In the library",
          "At her friend's house",
          "Near the desert water tree"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון! בפסקה 2 מצוין שהיא קראה ספרים ישנים בספרייה (in the library).",
        "points": 10
      },
      {
        "id": "story-level2-1-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that tells us what Clara found instead of gold.",
        "correctIndex": 0,
        "targetSentence": "When she arrived, she did not find gold, but she did find a special plant.",
        "explanationHebrew": "המשפט הנכון הוא: 'When she arrived, she did not find gold, but she did find a special plant.' (כשהיא הגיעה, היא לא מצאה זהב, אלא מצאה צמח מיוחד).",
        "points": 10
      },
      {
        "id": "story-level2-1-q7",
        "number": 7,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "Who used the special plant to make new medicines?",
        "options": [
          "Local desert explorers",
          "University scientists",
          "Doctors",
          "Clara's family members"
        ],
        "correctIndex": 2,
        "explanationHebrew": "נכון מאוד! בפסקה 3 כתוב שרופאים (doctors) השתמשו בצמח כדי להכין תרופות חדשות.",
        "points": 10
      },
      {
        "id": "story-level2-1-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is this story about?",
        "options": [
          "Clara's discovery in the desert",
          "How to plant trees in Israel",
          "The history of gold",
          "Clara's favorite doctors"
        ],
        "correctIndex": 0,
        "explanationHebrew": "כל הכבוד! הסיפור עוסק במסע של קלארה ובגילוי שלה במדבר.",
        "points": 10
      },
      {
        "id": "story-level2-1-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "The picture had a secret message written on it in a strange language.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"The picture had a secret message written on it in a strange language.\"",
        "points": 10
      },
      {
        "id": "story-level2-1-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about the negev desert tree and why it is important.",
        "keywords": [
          "learn",
          "important",
          "story",
          "fact",
          "because"
        ],
        "explanationHebrew": "תשובה פתוחה המציגה לקח, מסר או עובדה שנלמדה מתוך הטקסט.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-2",
    "title": "The Mystery of the Roman Coin",
    "hebrewTitle": "תעלומת המטבע הרומי",
    "level": "Level 2",
    "levelLabel": "רמה 2 - רמה שוטפת",
    "levelDescription": "For native Hebrew speakers who are in a satisfactory level in English (late elementary equivalent).",
    "paragraphs": [
      "Twelve-year-old Noam loved history and archaeology.  During the Passover vacation, his family went on a hiking trip along the ancient paths of Caesarea National Park.  The sun was warm, and a gentle breeze blew from the Mediterranean Sea.",
      "While walking near an ancient stone wall, Noam noticed a strange metallic shine beneath a pile of sand and dry leaves.  He knelt down and carefully brushed away the dust with his fingers.",
      "In the palm of his hand lay an ancient bronze coin covered in green patina. On one side, Noam could clearly see the profile of a Roman emperor wearing a laurel wreath. On the other side was an image of an ancient sailing ship. Excited by the discovery, Noam showed the artifact to the park rangers. The head archaeologist was called immediately to examine the rare find.",
      "The archaeologist explained that the coin was nearly two thousand years old and had probably belonged to a Roman merchant sailing to Rome.  Instead of keeping the coin, Noam decided to donate it to the national antiquities authority.",
      "A month later, the museum sent Noam an official certificate of appreciation and invited his entire class for a free guided tour.  Noam was proud that his curiosity helped preserve a piece of ancient history."
    ],
    "vocabularyHints": [
      {
        "word": "archaeology",
        "translation": "ארכיאולוגיה"
      },
      {
        "word": "bronze",
        "translation": "ברונזה / ארד"
      },
      {
        "word": "emperor",
        "translation": "קיסר"
      },
      {
        "word": "merchant",
        "translation": "סוחר"
      },
      {
        "word": "donate",
        "translation": "לתרום"
      },
      {
        "word": "appreciation",
        "translation": "הערכה / הוקרה"
      }
    ],
    "questions": [
      {
        "id": "story-level2-2-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where was Noam hiking with his family?",
        "options": [
          "In the Judean Hills",
          "In Caesarea National Park",
          "Along the Jordan River",
          "In the Golan Heights"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! בפסקה 1 כתוב שהם טיילו בגן הלאומי קיסריה (Caesarea National Park).",
        "points": 10
      },
      {
        "id": "story-level2-2-q2",
        "number": 2,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "copy",
        "prompt": "Copy the sentence that tells what caught Noam's attention near the stone wall.",
        "correctIndex": 0,
        "targetSentence": "While walking near an ancient stone wall, Noam noticed a strange metallic shine beneath a pile of sand and dry leaves.",
        "explanationHebrew": "המשפט הנכון הוא: 'While walking near an ancient stone wall, Noam noticed a strange metallic shine beneath a pile of sand and dry leaves.' (תוך כדי הליכה ליד חומת אבן עתיקה, נועם הבחין בנצנוץ מתכתי מוזר מתחת לערימת חול ועלים יבשים).",
        "points": 10
      },
      {
        "id": "story-level2-2-q3",
        "number": 3,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence describing what was depicted on one side of the coin.",
        "correctIndex": 0,
        "targetSentence": "On one side, Noam could clearly see the profile of a Roman emperor wearing a laurel wreath.",
        "explanationHebrew": "המשפט הנכון הוא: 'On one side, Noam could clearly see the profile of a Roman emperor wearing a laurel wreath.' (בצד אחד, נועם יכול היה לראות בבירור את הפרופיל של קיסר רומי העוטה זר דפנה).",
        "points": 10
      },
      {
        "id": "story-level2-2-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What image was on the other side of the coin?",
        "correctIndex": 0,
        "modelAnswer": "There was an image of an ancient sailing ship.",
        "keywords": [
          "sailing ship",
          "ship",
          "ancient ship"
        ],
        "explanationHebrew": "התשובה המוצעת היא ציור של ספינת מפרש עתיקה (an ancient sailing ship).",
        "points": 10
      },
      {
        "id": "story-level2-2-q5",
        "number": 5,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "How old was the coin according to the archaeologist?",
        "options": [
          "About five hundred years old",
          "Nearly two thousand years old",
          "About three hundred years old",
          "Ten thousand years old"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון! הארכיאולוג הסביר שהמטבע בן כמעט אלפיים שנה (nearly two thousand years old).",
        "points": 10
      },
      {
        "id": "story-level2-2-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "open",
        "prompt": "What did Noam decide to do with the coin instead of keeping it?",
        "correctIndex": 0,
        "modelAnswer": "He decided to donate it to the national antiquities authority.",
        "keywords": [
          "donate",
          "antiquities",
          "museum",
          "authority"
        ],
        "explanationHebrew": "התשובה היא שהוא החליט לתרום אותו לרשות העתיקות הלאומית (donate it).",
        "points": 10
      },
      {
        "id": "story-level2-2-q7",
        "number": 7,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What did the museum send to Noam a month later?",
        "options": [
          "A sum of money",
          "An official certificate of appreciation",
          "A replica Roman sword",
          "A new metal detector"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! המוזיאון שלח לו תעודת הוקרה רשמית (an official certificate of appreciation).",
        "points": 10
      },
      {
        "id": "story-level2-2-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is the central theme of this story?",
        "options": [
          "A boy's discovery of a historical artifact and his responsible choice",
          "How to sail ancient Roman ships across the sea",
          "The best hiking trails in the north of Israel",
          "How archaeologists clean modern coins"
        ],
        "correctIndex": 0,
        "explanationHebrew": "מצוין! הסיפור מתמקד במציאת המטבע העתיק על ידי נועם ובבחירתו האחראית לתרום אותו.",
        "points": 10
      },
      {
        "id": "story-level2-2-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "In the palm of his hand lay an ancient bronze coin covered in green patina.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"In the palm of his hand lay an ancient bronze coin covered in green patina.\"",
        "points": 10
      },
      {
        "id": "story-level2-2-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about the mystery of the roman coin and why it is important.",
        "keywords": [
          "learn",
          "important",
          "story",
          "fact",
          "because"
        ],
        "explanationHebrew": "תשובה פתוחה המציגה לקח, מסר או עובדה שנלמדה מתוך הטקסט.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-3",
    "title": "The Great Honeybee Rescue",
    "hebrewTitle": "מבצע הצלת דבורי הדבש",
    "level": "Level 2",
    "levelLabel": "רמה 2 - רמה שוטפת",
    "levelDescription": "For native Hebrew speakers who are in a satisfactory level in English (late elementary equivalent).",
    "paragraphs": [
      "In a quiet neighborhood in northern Israel, farmer Eli noticed something troubling in his citrus orchard.  The orange and lemon trees were full of white blossoms, but there was almost complete silence in the grove.",
      "Usually, thousands of worker bees buzzed from flower to flower, collecting sweet nectar and carrying golden pollen.  Without bees, the trees could not produce fruit, and Eli knew his harvest was in serious danger.",
      "Eli decided to contact Dr. Ronit, an entomologist from the agricultural research center. When Dr. Ronit visited the farm, she discovered that neighboring gardens had recently used strong chemical pesticides. These harmful chemicals had weakened the local bee colonies and caused them to abandon their hives. Together, Eli and Dr. Ronit designed a rescue plan to bring healthy bees back to the orchard without using dangerous sprays.",
      "Over the next three weeks, Eli planted rows of wildflowers like lavender and rosemary along the orchard borders.  Dr.  Ronit installed two modern wooden beehives equipped with temperature sensors to monitor the queen bee.",
      "Within a month, the worker bees returned in large numbers.  The citrus trees flourished, producing sweet oranges, and Eli even harvested pure honey that he shared with his supportive neighbors."
    ],
    "vocabularyHints": [
      {
        "word": "orchard",
        "translation": "פרדס / מטע"
      },
      {
        "word": "nectar",
        "translation": "צוף"
      },
      {
        "word": "pesticides",
        "translation": "חומרי הדברה"
      },
      {
        "word": "entomologist",
        "translation": "אנטומולוג (חוקר חרקים)"
      },
      {
        "word": "flourished",
        "translation": "שגשגו / פרחו"
      }
    ],
    "questions": [
      {
        "id": "story-level2-3-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What troubling sign did Eli notice in his citrus orchard?",
        "options": [
          "The trees were dying from lack of water",
          "There was almost complete silence because bees were missing",
          "A fire had damaged the lemon trees",
          "Birds were eating all the fruit"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! בפסקה 1 מוסבר שהיה שקט מוחלט כי הדבורים נעלמו מהפרדס.",
        "points": 10
      },
      {
        "id": "story-level2-3-q2",
        "number": 2,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "copy",
        "prompt": "Copy the sentence describing what the bees usually do among the flowers.",
        "correctIndex": 0,
        "targetSentence": "Usually, thousands of worker bees buzzed from flower to flower, collecting sweet nectar and carrying golden pollen.",
        "explanationHebrew": "המשפט הנכון הוא: 'Usually, thousands of worker bees buzzed from flower to flower, collecting sweet nectar and carrying golden pollen.' (בדרך כלל, אלפי דבורים פועלות זמזמו מפרח לפרח, אספו צוף מתוק ונשאו אבקה זהובה).",
        "points": 10
      },
      {
        "id": "story-level2-3-q3",
        "number": 3,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "Who did Eli contact for professional help?",
        "correctIndex": 0,
        "modelAnswer": "He contacted Dr. Ronit, an entomologist.",
        "keywords": [
          "Dr. Ronit",
          "entomologist",
          "Ronit"
        ],
        "explanationHebrew": "התשובה המוצעת היא ד\"ר רונית, חוקרת חרקים (Dr. Ronit, an entomologist).",
        "points": 10
      },
      {
        "id": "story-level2-3-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that explains what the chemical pesticides did to the bee colonies.",
        "correctIndex": 0,
        "targetSentence": "These harmful chemicals had weakened the local bee colonies and caused them to abandon their hives.",
        "explanationHebrew": "המשפט הנכון הוא: 'These harmful chemicals had weakened the local bee colonies and caused them to abandon their hives.' (הכימיקלים המזיקים האלה החלישו את מושבות הדבורים המקומיות וגרמו להן לנטוש את כוורותיהן).",
        "points": 10
      },
      {
        "id": "story-level2-3-q5",
        "number": 5,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "open",
        "prompt": "What types of wildflowers did Eli plant along the orchard borders?",
        "correctIndex": 0,
        "modelAnswer": "He planted lavender and rosemary.",
        "keywords": [
          "lavender",
          "rosemary"
        ],
        "explanationHebrew": "נכון מאוד! הוא שתל לבנדר ורוזמרין (lavender and rosemary).",
        "points": 10
      },
      {
        "id": "story-level2-3-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What were the new beehives equipped with to monitor the queen bee?",
        "options": [
          "Small video cameras",
          "Temperature sensors",
          "Microscopic radios",
          "Automatic food dispensers"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון! הכוורות צוידו בחיישני טמפרטורה (temperature sensors).",
        "points": 10
      },
      {
        "id": "story-level2-3-q7",
        "number": 7,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What extra product did Eli harvest and share with his neighbors?",
        "options": [
          "Fresh lemonade",
          "Pure honey",
          "Lavender tea",
          "Citrus jam"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! בפסקה 3 כתוב שהוא רדה דבש טהור וחלק אותו עם שכניו (pure honey).",
        "points": 10
      },
      {
        "id": "story-level2-3-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is the primary message of this article?",
        "options": [
          "How protecting bees through eco-friendly practices helps crops thrive",
          "Why chemical pesticides are necessary in modern farming",
          "The difference between lemon trees and orange trees",
          "How to build wooden fences around gardens"
        ],
        "correctIndex": 0,
        "explanationHebrew": "כל הכבוד! הטקסט מציג כיצד שמירה על הדבורים בשיטות ידידותיות לסביבה סייעה להצלת היבול.",
        "points": 10
      },
      {
        "id": "story-level2-3-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "Eli decided to contact Dr.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"Eli decided to contact Dr.\"",
        "points": 10
      },
      {
        "id": "story-level2-3-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about the great honeybee rescue and why it is important.",
        "keywords": [
          "learn",
          "important",
          "story",
          "fact",
          "because"
        ],
        "explanationHebrew": "תשובה פתוחה המציגה לקח, מסר או עובדה שנלמדה מתוך הטקסט.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-4",
    "title": "The Young Mountain Rescue Dog",
    "hebrewTitle": "כלב ההצלה הצעיר בהרים",
    "level": "Level 2",
    "levelLabel": "רמה 2 - רמה שוטפת",
    "levelDescription": "For native Hebrew speakers who are in a satisfactory level in English (late elementary equivalent).",
    "paragraphs": [
      "High in the Swiss Alps, winter brings heavy snowstorms and freezing temperatures.  On Mount Rosa, a specialized rescue team trains rescue dogs to locate skiers who get trapped under avalanches.",
      "Among the new recruits was Bruno, a two-year-old Saint Bernard with thick fur and exceptional hearing.  Bruno's handler, Marc, spent months teaching him how to recognize human scent buried deep beneath layers of packed snow.",
      "One stormy Tuesday afternoon, the alarm sounded at the alpine rescue station. Two snowboarders had ventured off the marked ski trails and had been caught by a sudden snow slide. The helicopter could not fly due to dense fog, so Marc and Bruno set out on skis through the blizzard. When they reached the designated coordinates, Bruno immediately began sniffing the frozen ground, running back and forth against the howling wind.",
      "Suddenly, Bruno stopped near a large snowdrift and began barking loudly while digging furiously with his paws.  Marc quickly used his collapsible metal probe and detected movement two meters underground.",
      "Within minutes, the rescue team cleared the snow and pulled the two cold but uninjured snowboarders to safety.  That evening at the cabin, Bruno received an extra portion of beef stew and was celebrated as a true alpine hero."
    ],
    "vocabularyHints": [
      {
        "word": "avalanches",
        "translation": "מפולות שלגים"
      },
      {
        "word": "handler",
        "translation": "מאלף / מפעיל כלב"
      },
      {
        "word": "scent",
        "translation": "ריח / עקבות ריח"
      },
      {
        "word": "blizzard",
        "translation": "סופת שלגים"
      },
      {
        "word": "probe",
        "translation": "גשושית / מוט חיפוש"
      }
    ],
    "questions": [
      {
        "id": "story-level2-4-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What is the specialized rescue team on Mount Rosa trained to do?",
        "options": [
          "Build ski hotels",
          "Locate skiers trapped under avalanches",
          "Clear roads from heavy rocks",
          "Photograph mountain animals in winter"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! בפסקה 1 מוסבר שהצוות מאמן כלבים לאתר גולשים שנלכדו תחת מפולות שלגים (avalanches).",
        "points": 10
      },
      {
        "id": "story-level2-4-q2",
        "number": 2,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "copy",
        "prompt": "Copy the sentence that introduces Bruno and describes his physical traits.",
        "correctIndex": 0,
        "targetSentence": "Among the new recruits was Bruno, a two-year-old Saint Bernard with thick fur and exceptional hearing.",
        "explanationHebrew": "המשפט הנכון הוא: 'Among the new recruits was Bruno, a two-year-old Saint Bernard with thick fur and exceptional hearing.' (בין המגויסים החדשים היה ברונו, סן ברנרד בן שנתיים בעל פרווה עבה ושמיעה יוצאת דופן).",
        "points": 10
      },
      {
        "id": "story-level2-4-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What did Marc spend months teaching Bruno?",
        "correctIndex": 0,
        "modelAnswer": "He taught him how to recognize human scent buried deep under packed snow.",
        "keywords": [
          "scent",
          "human scent",
          "snow",
          "buried"
        ],
        "explanationHebrew": "נכון! הוא לימד אותו לזהות ריח אנושי הקבור עמוק מתחת לשלג.",
        "points": 10
      },
      {
        "id": "story-level2-4-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "Why was the rescue helicopter unable to fly?",
        "options": [
          "It was out of fuel",
          "Due to dense fog",
          "The engine was broken",
          "The pilot was not available"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון! המסוק לא יכול היה להמריא בשל ערפל כבד (dense fog).",
        "points": 10
      },
      {
        "id": "story-level2-4-q5",
        "number": 5,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that shows Bruno found the location of the trapped snowboarders.",
        "correctIndex": 0,
        "targetSentence": "Suddenly, Bruno stopped near a large snowdrift and began barking loudly while digging furiously with his paws.",
        "explanationHebrew": "המשפט הנכון הוא: 'Suddenly, Bruno stopped near a large snowdrift and began barking loudly while digging furiously with his paws.' (לפתע, ברונו עצר ליד תלולית שלג גדולה והחל לנבוח בקול רם תוך כדי חפירה בזעם בכפותיו).",
        "points": 10
      },
      {
        "id": "story-level2-4-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "open",
        "prompt": "How deep underground were the two snowboarders detected?",
        "correctIndex": 0,
        "modelAnswer": "They were detected two meters underground.",
        "keywords": [
          "two meters",
          "2 meters",
          "two meters underground"
        ],
        "explanationHebrew": "נכון מאוד! הם אותרו בעומק של שני מטרים מתחת לפני השלג (two meters underground).",
        "points": 10
      },
      {
        "id": "story-level2-4-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "How was Bruno rewarded back at the cabin?",
        "options": [
          "He was given a shiny new medal",
          "He received an extra portion of beef stew",
          "He was allowed to sleep on Marc's bed",
          "He received a warm wool sweater"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! ברונו קיבל מנה נוספת של תבשיל בקר (an extra portion of beef stew).",
        "points": 10
      },
      {
        "id": "story-level2-4-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is this story mostly about?",
        "options": [
          "A brave rescue dog who successfully saves trapped snowboarders in a blizzard",
          "How to safely ride snowboards on steep mountain slopes",
          "The history of Saint Bernard dogs in ancient Europe",
          "The reasons why winter weather is becoming colder in the Alps"
        ],
        "correctIndex": 0,
        "explanationHebrew": "כל הכבוד! הסיפור מתאר את גבורתו של כלב החילוץ ברונו שהציל שני גולשים בסופת שלגים.",
        "points": 10
      },
      {
        "id": "story-level2-4-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "One stormy Tuesday afternoon, the alarm sounded at the alpine rescue station.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"One stormy Tuesday afternoon, the alarm sounded at the alpine rescue station.\"",
        "points": 10
      },
      {
        "id": "story-level2-4-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about the young mountain rescue dog and why it is important.",
        "keywords": [
          "learn",
          "important",
          "story",
          "fact",
          "because"
        ],
        "explanationHebrew": "תשובה פתוחה המציגה לקח, מסר או עובדה שנלמדה מתוך הטקסט.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-5",
    "title": "The Solar Car Challenge",
    "hebrewTitle": "אתגר מכונית השמש",
    "level": "Level 2",
    "levelLabel": "רמה 2 - רמה שוטפת",
    "levelDescription": "For native Hebrew speakers who are in a satisfactory level in English (late elementary equivalent).",
    "paragraphs": [
      "At Green Valley High School, a group of five ambitious students decided to enter the National Solar Car Competition.  Their mission was to design and build a fully functional vehicle powered entirely by sunlight.",
      "Led by captain Tamar, the students spent four months in the school workshop after classes.  They welded a lightweight aluminum frame and installed forty high-efficiency solar cells across the curved roof of the car.",
      "On the day of the race in the desert, temperatures exceeded thirty-five degrees Celsius. Twelve teams from different schools gathered at the starting line, each displaying innovative engineering designs. Tamar's car, named 'Sunfire', started in fourth position. The challenge was not just about speed, but also energy conservation. Tamar's teammate, Roy, sat inside the narrow cockpit, carefully managing the battery power while monitoring solar input on a digital dashboard.",
      "As the race approached the final twenty kilometers, several competing vehicles suffered from overheating batteries and were forced to pull over.  However, Sunfire's smart cooling system kept its electric motor running smoothly.",
      "In the final stretch, Sunfire overtook the leading car and crossed the finish line in first place.  The students won a prestigious trophy and a scholarship to study renewable energy engineering at the university."
    ],
    "vocabularyHints": [
      {
        "word": "ambitious",
        "translation": "שאפתנים"
      },
      {
        "word": "conservation",
        "translation": "שימור (אנרגיה)"
      },
      {
        "word": "cockpit",
        "translation": "תא נהג / תא טייס"
      },
      {
        "word": "overheating",
        "translation": "התחממות יתר"
      },
      {
        "word": "renewable energy",
        "translation": "אנרגיה מתחדשת"
      }
    ],
    "questions": [
      {
        "id": "story-level2-5-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that states the students' goal in building the vehicle.",
        "correctIndex": 0,
        "targetSentence": "Their mission was to design and build a fully functional vehicle powered entirely by sunlight.",
        "explanationHebrew": "המשפט הנכון הוא: 'Their mission was to design and build a fully functional vehicle powered entirely by sunlight.' (משימתם הייתה לתכנן ולבנות רכב מתפקד לחלוטין המונע כולו באור שמש).",
        "points": 10
      },
      {
        "id": "story-level2-5-q2",
        "number": 2,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "How many solar cells did the students install on the car's roof?",
        "correctIndex": 0,
        "modelAnswer": "They installed forty solar cells.",
        "keywords": [
          "forty",
          "40",
          "forty solar cells"
        ],
        "explanationHebrew": "נכון מאוד! הם התקינו ארבעים תאים סולאריים על גג המכונית (forty high-efficiency solar cells).",
        "points": 10
      },
      {
        "id": "story-level2-5-q3",
        "number": 3,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that tells the name and starting position of Tamar's car.",
        "correctIndex": 0,
        "targetSentence": "Tamar's car, named 'Sunfire', started in fourth position.",
        "explanationHebrew": "המשפט הנכון הוא: 'Tamar's car, named 'Sunfire', started in fourth position.' (המכונית של תמר, שנקראה 'סנפייר', פתחה במקום הרביעי).",
        "points": 10
      },
      {
        "id": "story-level2-5-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What was Roy monitoring inside the cockpit?",
        "correctIndex": 0,
        "modelAnswer": "He was monitoring the battery power and solar input on a digital dashboard.",
        "keywords": [
          "battery",
          "solar input",
          "dashboard"
        ],
        "explanationHebrew": "התשובה היא שהוא עקב אחר עוצמת הסוללה וקליטת האנרגיה הסולארית בלוח המחוונים הדיגיטלי.",
        "points": 10
      },
      {
        "id": "story-level2-5-q5",
        "number": 5,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "Why were several competing vehicles forced to pull over near the end?",
        "options": [
          "They ran out of wheels",
          "They suffered from overheating batteries",
          "The drivers were too tired",
          "A sandstorm blocked the road"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! בפסקה 3 כתוב שהסוללות של מספר רכבים מתחרים התחממו יתר על המידה (overheating batteries).",
        "points": 10
      },
      {
        "id": "story-level2-5-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What kept Sunfire's motor running smoothly despite the desert heat?",
        "options": [
          "Extra ice bags",
          "A smart cooling system",
          "A larger gas tank",
          "Driving very slowly"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון! מערכת קירור חכמה שמרה על המנוע החשמלי (smart cooling system).",
        "points": 10
      },
      {
        "id": "story-level2-5-q7",
        "number": 7,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What scholarship did the students win along with the trophy?",
        "correctIndex": 0,
        "modelAnswer": "A scholarship to study renewable energy engineering at the university.",
        "keywords": [
          "renewable energy",
          "engineering",
          "scholarship"
        ],
        "explanationHebrew": "נכון! הם זכו במלגה ללימודי הנדסת אנרגיה מתחדשת באוניברסיטה.",
        "points": 10
      },
      {
        "id": "story-level2-5-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is the main topic of this passage?",
        "options": [
          "A team of high school students who successfully built and won a solar car race",
          "The history of gasoline cars in the twentieth century",
          "Why students should avoid driving in the desert",
          "How to purchase solar panels for home roofs"
        ],
        "correctIndex": 0,
        "explanationHebrew": "כל הכבוד! המאמר מתאר קבוצת תלמידים שתכננה, בנתה וזכתה במרוץ מכוניות סולאריות.",
        "points": 10
      },
      {
        "id": "story-level2-5-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "On the day of the race in the desert, temperatures exceeded thirty-five degrees Celsius.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"On the day of the race in the desert, temperatures exceeded thirty-five degrees Celsius.\"",
        "points": 10
      },
      {
        "id": "story-level2-5-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about the solar car challenge and why it is important.",
        "keywords": [
          "learn",
          "important",
          "story",
          "fact",
          "because"
        ],
        "explanationHebrew": "תשובה פתוחה המציגה לקח, מסר או עובדה שנלמדה מתוך הטקסט.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-6",
    "title": "The Hidden Caves of Rosh Hanikra",
    "hebrewTitle": "המערות הנסתרות של ראש הנקרה",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "Perched on the northernmost tip of Israel's Mediterranean coastline lies Rosh Hanikra, a breathtaking geological wonder. The site is famous for its gleaming white chalk cliffs that plunge dramatically into turquoise sea waters. Over thousands of years, powerful winter waves carved a network of subterranean sea grottos into the soft stone.",
      "Visitors access the grottos by boarding the world's steepest cable car. During the short two-minute descent down the sheer cliff face, passengers can look out over the vast Mediterranean horizon. Once inside the caves, wooden walkways allow travelers to explore the labyrinth of illuminated cavern chambers.",
      "The acoustics inside the grottos are extraordinary. When heavy waves rush into the narrow stone openings, the trapped air compresses and explodes outward with a thunderous roar. Spray from the crashing water cools visitors even in the warmest summer heat.",
      "Historically, Rosh Hanikra was also a vital transportation route. During World War II, British army engineers blasted a railway tunnel through the chalk mountain to connect Cairo, Tel Aviv, and Beirut. Today, remnants of the historic railway bridge and tracks can still be seen near the cave entrance.",
      "Marine biologists frequently study the waters surrounding Rosh Hanikra because the submerged caves provide shelter for rare sea turtles, vibrant anemones, and diverse fish species. Rosh Hanikra remains a shining example of how nature and history intersect in the Middle East."
    ],
    "vocabularyHints": [
      {
        "word": "plunge",
        "translation": "צוללים / צונחים מטה"
      },
      {
        "word": "grottos",
        "translation": "נקרות / מערות ימיות"
      },
      {
        "word": "steepest",
        "translation": "התלול ביותר"
      },
      {
        "word": "acoustics",
        "translation": "אקוסטיקה (התנהגות הצליל)"
      },
      {
        "word": "remnants",
        "translation": "שרידים"
      },
      {
        "word": "submerged",
        "translation": "שקוע במים"
      }
    ],
    "questions": [
      {
        "id": "story-level2-6-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "How were the sea grottos of Rosh Hanikra formed?",
        "options": [
          "By volcanic eruptions",
          "By powerful winter waves carving into soft chalk stone",
          "By human miners searching for silver",
          "By falling meteorites"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 מוסבר שגלי חורף עזים חצבו את הנקרות בסלע הקרטון הרך (powerful winter waves carved a network of subterranean sea grottos).",
        "points": 10
      },
      {
        "id": "story-level2-6-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes what Rosh Hanikra is famous for.",
        "correctIndex": 0,
        "targetSentence": "The site is famous for its gleaming white chalk cliffs that plunge dramatically into turquoise sea waters.",
        "explanationHebrew": "המשפט המדויק הוא: The site is famous for its gleaming white chalk cliffs that plunge dramatically into turquoise sea waters.",
        "points": 10
      },
      {
        "id": "story-level2-6-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "How long does the cable car descent down the cliff take?",
        "correctIndex": 0,
        "modelAnswer": "The descent takes two minutes.",
        "keywords": [
          "two minutes",
          "short",
          "two-minute"
        ],
        "explanationHebrew": "בפסקה 2 מצוין שמדובר בירידה קצרה של שתי דקות (two-minute descent).",
        "points": 10
      },
      {
        "id": "story-level2-6-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What is unique about the cable car at Rosh Hanikra?",
        "options": [
          "It is the world's longest",
          "It is the world's steepest cable car",
          "It travels underground",
          "It has glass floors only"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שזהו הרכבל התלול ביותר בעולם (world's steepest cable car).",
        "points": 10
      },
      {
        "id": "story-level2-6-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that describes the sound when waves rush into the grottos.",
        "correctIndex": 0,
        "targetSentence": "When heavy waves rush into the narrow stone openings, the trapped air compresses and explodes outward with a thunderous roar.",
        "explanationHebrew": "המשפט המדויק הוא: When heavy waves rush into the narrow stone openings, the trapped air compresses and explodes outward with a thunderous roar.",
        "points": 10
      },
      {
        "id": "story-level2-6-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What helps cool visitors during warm summer visits?",
        "correctIndex": 0,
        "modelAnswer": "Spray from the crashing water cools visitors.",
        "keywords": [
          "spray",
          "crashing water",
          "water"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שרסיסי המים המתנפצים מצננים את המבקרים (Spray from the crashing water).",
        "points": 10
      },
      {
        "id": "story-level2-6-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "Why did British army engineers blast a tunnel through the mountain during World War II?",
        "options": [
          "To store weapons underground",
          "To connect Cairo, Tel Aviv, and Beirut by railway",
          "To build a submarine base",
          "To mine for limestone"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוסבר שהמנהרה נחצבה כדי לחבר את קהיר, תל אביב וביירות במסילת רכבת.",
        "points": 10
      },
      {
        "id": "story-level2-6-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that mentions what can still be seen near the cave entrance.",
        "correctIndex": 0,
        "targetSentence": "Today, remnants of the historic railway bridge and tracks can still be seen near the cave entrance.",
        "explanationHebrew": "המשפט המדויק הוא: Today, remnants of the historic railway bridge and tracks can still be seen near the cave entrance.",
        "points": 10
      },
      {
        "id": "story-level2-6-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "Why do marine biologists study the waters surrounding Rosh Hanikra?",
        "options": [
          "To search for oil reserves",
          "Because the caves provide shelter for rare sea turtles and diverse fish",
          "To test new diving suits",
          "To count seagulls"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 מצוין שהמערות התת-מימיות מספקות מחסה לצבי ים נדירים ומינים מגוונים.",
        "points": 10
      },
      {
        "id": "story-level2-6-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What does Rosh Hanikra represent according to the final paragraph?",
        "correctIndex": 0,
        "modelAnswer": "It is a shining example of how nature and history intersect in the Middle East.",
        "keywords": [
          "nature",
          "history",
          "intersect",
          "Middle East"
        ],
        "explanationHebrew": "בפסקה האחרונה נכתב שזהו דוגמה זוהרת למפגש בין טבע להיסטוריה במזרח התיכון.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-7",
    "title": "The Secret Life of Sea Turtles",
    "hebrewTitle": "חייהם הסודיים של צבי הים",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "Sea turtles are among the most ancient creatures on our planet, having swam across the oceans for more than one hundred million years. With streamlined shells and powerful paddle-like flippers, these reptiles can navigate thousands of kilometers across open seas with astonishing precision.",
      "One of the most extraordinary aspects of sea turtle biology is natal homing. Female turtles always return to the exact same beach where they hatched decades earlier to lay their own eggs. Scientists believe they utilize Earth's invisible magnetic field as a built-in compass to guide their long migrations.",
      "Under cover of darkness, a mother turtle crawls slowly onto the sand, digs a deep nest chamber using her hind flippers, and deposits about one hundred round white eggs. She carefully covers the nest with sand to camouflage it from predators before returning to the sea.",
      "Approximately two months later, tiny hatchlings emerge simultaneously from beneath the sand. They instinctively scramble toward the moonlit ocean horizon. However, artificial lights from coastal hotels and roads frequently confuse the hatchlings, leading them away from the sea into danger.",
      "Fortunately, marine conservation teams along Israel's Mediterranean coast actively protect turtle nests. Volunteers relocate vulnerable clutches to secure fenced hatcheries and guide baby turtles safely to the water, ensuring future generations will continue their epic ocean journey."
    ],
    "vocabularyHints": [
      {
        "word": "streamlined",
        "translation": "אווירודינמי / הידרודינמי (בעל מבנה זורם)"
      },
      {
        "word": "natal homing",
        "translation": "חזרה למקום הלידה"
      },
      {
        "word": "camouflage",
        "translation": "להסוות"
      },
      {
        "word": "scramble",
        "translation": "רצים / מתקדמים בזריזות"
      },
      {
        "word": "hatcheries",
        "translation": "חוות דגירה מוגנות"
      },
      {
        "word": "vulnerable",
        "translation": "פגיע / חסר הגנה"
      }
    ],
    "questions": [
      {
        "id": "story-level2-7-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "For how long have sea turtles inhabited our oceans?",
        "options": [
          "One thousand years",
          "One million years",
          "More than one hundred million years",
          "Ten thousand years"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 1 כתוב שצבי ים שוחים באוקיינוסים מעל מאה מיליון שנה (more than one hundred million years).",
        "points": 10
      },
      {
        "id": "story-level2-7-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes sea turtles flippers and shells.",
        "correctIndex": 0,
        "targetSentence": "With streamlined shells and powerful paddle-like flippers, these reptiles can navigate thousands of kilometers across open seas with astonishing precision.",
        "explanationHebrew": "המשפט המדויק הוא: With streamlined shells and powerful paddle-like flippers, these reptiles can navigate thousands of kilometers across open seas with astonishing precision.",
        "points": 10
      },
      {
        "id": "story-level2-7-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What is 'natal homing' in sea turtles?",
        "correctIndex": 0,
        "modelAnswer": "Female turtles always return to the exact same beach where they hatched to lay their eggs.",
        "keywords": [
          "return",
          "beach",
          "hatched",
          "lay eggs"
        ],
        "explanationHebrew": "בפסקה 2 מוסבר שנקבות הצבים חוזרות תמיד לאותו חוף שבו בקעו כדי להטיל את ביציהן.",
        "points": 10
      },
      {
        "id": "story-level2-7-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What natural guide do scientists believe turtles use as a compass?",
        "options": [
          "Ocean temperature",
          "Earth's invisible magnetic field",
          "Star constellations",
          "Wind direction"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהם נעזרים בשדה המגנטי של כדור הארץ (Earth's invisible magnetic field).",
        "points": 10
      },
      {
        "id": "story-level2-7-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that tells how many eggs a mother turtle deposits in a nest.",
        "correctIndex": 0,
        "targetSentence": "Under cover of darkness, a mother turtle crawls slowly onto the sand, digs a deep nest chamber using her hind flippers, and deposits about one hundred round white eggs.",
        "explanationHebrew": "המשפט המדויק הוא: Under cover of darkness, a mother turtle crawls slowly onto the sand, digs a deep nest chamber using her hind flippers, and deposits about one hundred round white eggs.",
        "points": 10
      },
      {
        "id": "story-level2-7-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "Why does the mother turtle cover the nest with sand?",
        "correctIndex": 0,
        "modelAnswer": "To camouflage it from predators before returning to the sea.",
        "keywords": [
          "camouflage",
          "predators"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שהיא מכסה את הקן בחול כדי להסוות אותו מטורפים (camouflage it from predators).",
        "points": 10
      },
      {
        "id": "story-level2-7-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What causes baby hatchlings to become confused when heading to the sea?",
        "options": [
          "Loud beach music",
          "Artificial lights from coastal hotels and roads",
          "Crabs on the sand",
          "Cold ocean breezes"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוסבר שתאורה מלאכותית של מלונות וכבישים מבלבלת את האבקועים (artificial lights from coastal hotels and roads).",
        "points": 10
      },
      {
        "id": "story-level2-7-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes what hatchlings instinctively do when they emerge.",
        "correctIndex": 0,
        "targetSentence": "They instinctively scramble toward the moonlit ocean horizon.",
        "explanationHebrew": "המשפט המדויק הוא: They instinctively scramble toward the moonlit ocean horizon.",
        "points": 10
      },
      {
        "id": "story-level2-7-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "Where do volunteers relocate vulnerable turtle nests?",
        "correctIndex": 0,
        "modelAnswer": "They relocate vulnerable clutches to secure fenced hatcheries.",
        "keywords": [
          "secure",
          "fenced",
          "hatcheries"
        ],
        "explanationHebrew": "בפסקה 5 כתוב שמתנדבים מעבירים את ההטלות לחוות דגירה מגודרות ובטוחות (fenced hatcheries).",
        "points": 10
      },
      {
        "id": "story-level2-7-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What is the main purpose of Israeli conservation teams along the coast?",
        "options": [
          "To sell turtle souvenirs",
          "To ensure future generations of turtles continue their ocean journey",
          "To clean hotel swimming pools",
          "To teach turtles tricks"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסוף מסופר שמטרתם להבטיח שדורות עתידיים של צבי ים ימשיכו במסעם באוקיינוס.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-8",
    "title": "The Bird Migration Over the Hula Valley",
    "hebrewTitle": "נדידת הציפורים מעל עמק החולה",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "Every autumn and spring, Israel transforms into one of the most remarkable aerial crossroads on Earth. Situated at the junction of three continents—Europe, Asia, and Africa—more than five hundred million migratory birds fly across its skies twice a year. At the heart of this global flyway lies the scenic Hula Valley.",
      "The Hula Valley serves as an essential resting oasis for exhausted travelers. Birds traveling from northern breeding grounds in Siberia and Scandinavia stop in the valley's wetlands to refuel on nutritious seeds, fish, and insects before embarking on the perilous crossing of the vast Sahara Desert.",
      "Among the most iconic visitors are common cranes. Up to one hundred thousand cranes arrive each autumn. Their trumpeting calls echo across the valley as massive flocks fly in disciplined V-formations against the backdrop of snow-capped Mount Hermon.",
      "Decades ago, early settlers drained the Hula swamps to create agricultural land. However, this caused severe ecological problems, including soil degradation and the loss of rare wildlife. In the 1990s, scientists and farmers partnered to reflood part of the area, creating the Agamon Hula reserve.",
      "Today, Agamon Hula is a global model of eco-tourism and sustainable agriculture. Farmers provide feeding stations so cranes do not damage nearby crops, while researchers attach lightweight satellite tags to study migratory flyways and protect international avian corridors."
    ],
    "vocabularyHints": [
      {
        "word": "crossroads",
        "translation": "צומת דרכים"
      },
      {
        "word": "migratory",
        "translation": "נודד"
      },
      {
        "word": "flyway",
        "translation": "נתיב נדידה אווירי"
      },
      {
        "word": "perilous",
        "translation": "מסוכן"
      },
      {
        "word": "degradation",
        "translation": "הידרדרות / שחיקה"
      },
      {
        "word": "avian",
        "translation": "של ציפורים"
      }
    ],
    "questions": [
      {
        "id": "story-level2-8-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "How many migratory birds fly across Israel skies each year?",
        "options": [
          "Fifty thousand",
          "Five million",
          "More than five hundred million",
          "One billion"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 1 כתוב שמעל חמש מאות מיליון ציפורים נודדות חוצות את שמי ישראל (more than five hundred million).",
        "points": 10
      },
      {
        "id": "story-level2-8-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that names the three continents intersecting near Israel.",
        "correctIndex": 0,
        "targetSentence": "Situated at the junction of three continents—Europe, Asia, and Africa—more than five hundred million migratory birds fly across its skies twice a year.",
        "explanationHebrew": "המשפט המדויק הוא: Situated at the junction of three continents—Europe, Asia, and Africa—more than five hundred million migratory birds fly across its skies twice a year.",
        "points": 10
      },
      {
        "id": "story-level2-8-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What difficult geographical obstacle must birds cross after leaving the Hula Valley?",
        "correctIndex": 0,
        "modelAnswer": "They must cross the vast Sahara Desert.",
        "keywords": [
          "Sahara",
          "Desert",
          "crossing"
        ],
        "explanationHebrew": "בפסקה 2 מצוין מעבר מדבר סהרה העצום (vast Sahara Desert).",
        "points": 10
      },
      {
        "id": "story-level2-8-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What food do birds eat in the wetlands to refuel?",
        "options": [
          "Breadcrumbs from tourists",
          "Nutritious seeds, fish, and insects",
          "Leaves from oak trees",
          "Wild berries only"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהן ניזונות מזרעים מזינים, דגים וחרקים (nutritious seeds, fish, and insects).",
        "points": 10
      },
      {
        "id": "story-level2-8-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that tells how many cranes arrive each autumn.",
        "correctIndex": 0,
        "targetSentence": "Up to one hundred thousand cranes arrive each autumn.",
        "explanationHebrew": "המשפט המדויק הוא: Up to one hundred thousand cranes arrive each autumn.",
        "points": 10
      },
      {
        "id": "story-level2-8-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What mountain provides the scenic backdrop for the flying cranes?",
        "correctIndex": 0,
        "modelAnswer": "Snow-capped Mount Hermon.",
        "keywords": [
          "Mount Hermon",
          "Hermon"
        ],
        "explanationHebrew": "בפסקה 3 מצוין הר החרמון המושלג (snow-capped Mount Hermon).",
        "points": 10
      },
      {
        "id": "story-level2-8-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What problem was caused when settlers drained the Hula swamps decades ago?",
        "options": [
          "Floods in the south",
          "Soil degradation and the loss of rare wildlife",
          "The weather became too cold",
          "Fires in the forest"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב שהייבוש גרם להידרדרות הקרקע ולאובדן חיות בר נדירות (soil degradation and the loss of rare wildlife).",
        "points": 10
      },
      {
        "id": "story-level2-8-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that tells when scientists and farmers reflooded part of the area.",
        "correctIndex": 0,
        "targetSentence": "In the 1990s, scientists and farmers partnered to reflood part of the area, creating the Agamon Hula reserve.",
        "explanationHebrew": "המשפט המדויק הוא: In the 1990s, scientists and farmers partnered to reflood part of the area, creating the Agamon Hula reserve.",
        "points": 10
      },
      {
        "id": "story-level2-8-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "Why do farmers provide feeding stations for the cranes?",
        "correctIndex": 0,
        "modelAnswer": "So cranes do not damage nearby agricultural crops.",
        "keywords": [
          "crops",
          "damage",
          "feeding stations"
        ],
        "explanationHebrew": "בפסקה 5 מוסבר שתחנות ההאכלה מונעות מהעגורים לפגוע בשדות החקלאיים הסמוכים.",
        "points": 10
      },
      {
        "id": "story-level2-8-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What technology do researchers attach to birds to study their flight paths?",
        "options": [
          "Miniature cameras",
          "Lightweight satellite tags",
          "Radio receivers",
          "Colored ribbons"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 מצוין שהחוקרים מצמידים משדרי לוויין קלי-משקל (lightweight satellite tags).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-9",
    "title": "Young Inventors and the Clean Beach App",
    "hebrewTitle": "הממציאים הצעירים והאפליקציה לחופים נקיים",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "Plastic pollution along coastlines is an urgent global challenge that endangers marine life and damages coastal beauty. Last year, three eighth-grade students from Haifa—Noam, Daniel, and Tamar—decided to stop complaining about beach litter and build a high-tech solution.",
      "Combining their passions for coding and ecology, the trio designed a mobile application called 'ShoreClean.' The app allows beachgoers to snap photos of discarded plastics or broken bottles on the sand and tag their exact GPS location with a single tap.",
      "An intelligent algorithm inside the app classifies the waste type and updates an interactive coastal map in real time. Local municipal cleanup crews and volunteer environmental groups receive notifications when a specific stretch of shore requires immediate intervention.",
      "To encourage widespread youth participation, the students added a gamification feature. Users earn green points for every cleanup report, unlocking badges and discount vouchers for local ice cream shops and surf schools.",
      "In just six months, ShoreClean helped remove over twelve tons of plastic waste from Israeli beaches. The inventors won first place in a national youth science competition and were invited to present their invention at a United Nations youth environmental summit."
    ],
    "vocabularyHints": [
      {
        "word": "endangers",
        "translation": "מסכן"
      },
      {
        "word": "trio",
        "translation": "שלישייה"
      },
      {
        "word": "classifies",
        "translation": "מסווג"
      },
      {
        "word": "gamification",
        "translation": "משחוק (הפיכה למשחק)"
      },
      {
        "word": "vouchers",
        "translation": "שוברים"
      },
      {
        "word": "summit",
        "translation": "פסגה / ועידה"
      }
    ],
    "questions": [
      {
        "id": "story-level2-9-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where are the three young inventors from?",
        "options": [
          "Tel Aviv",
          "Haifa",
          "Jerusalem",
          "Eilat"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהם תלמידי כיתה ח' מחיפה (three eighth-grade students from Haifa).",
        "points": 10
      },
      {
        "id": "story-level2-9-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that names the global challenge the students wanted to address.",
        "correctIndex": 0,
        "targetSentence": "Plastic pollution along coastlines is an urgent global challenge that endangers marine life and damages coastal beauty.",
        "explanationHebrew": "המשפט המדויק הוא: Plastic pollution along coastlines is an urgent global challenge that endangers marine life and damages coastal beauty.",
        "points": 10
      },
      {
        "id": "story-level2-9-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What is the name of the mobile application designed by the students?",
        "correctIndex": 0,
        "modelAnswer": "The app is called 'ShoreClean'.",
        "keywords": [
          "ShoreClean"
        ],
        "explanationHebrew": "בפסקה 2 מצוין שם האפליקציה: ShoreClean.",
        "points": 10
      },
      {
        "id": "story-level2-9-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What does the app allow beachgoers to do?",
        "options": [
          "Order food to the beach",
          "Snap photos of discarded plastics and tag their GPS location",
          "Check wave heights only",
          "Rent umbrellas"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מוסבר שמשתמשים יכולים לצלם פסולת פלסטיק ולתייג את מיקום ה-GPS המדויק.",
        "points": 10
      },
      {
        "id": "story-level2-9-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that explains what the app algorithm does.",
        "correctIndex": 0,
        "targetSentence": "An intelligent algorithm inside the app classifies the waste type and updates an interactive coastal map in real time.",
        "explanationHebrew": "המשפט המדויק הוא: An intelligent algorithm inside the app classifies the waste type and updates an interactive coastal map in real time.",
        "points": 10
      },
      {
        "id": "story-level2-9-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "Who receives notifications when an area of the shore needs cleaning?",
        "correctIndex": 0,
        "modelAnswer": "Local municipal cleanup crews and volunteer environmental groups.",
        "keywords": [
          "municipal",
          "cleanup crews",
          "volunteer",
          "environmental groups"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שצוותי ניקיון עירוניים וקבוצות מתנדבים מקבלים התראות.",
        "points": 10
      },
      {
        "id": "story-level2-9-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What feature did the students add to motivate young users?",
        "options": [
          "Cash prizes",
          "A gamification feature with green points and discount vouchers",
          "Free smartphones",
          "School grade boosts"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב שהם הוסיפו מנגנון משחוק עם נקודות ירוקות ושוברים (gamification feature).",
        "points": 10
      },
      {
        "id": "story-level2-9-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that tells what users earn for each cleanup report.",
        "correctIndex": 0,
        "targetSentence": "Users earn green points for every cleanup report, unlocking badges and discount vouchers for local ice cream shops and surf schools.",
        "explanationHebrew": "המשפט המדויק הוא: Users earn green points for every cleanup report, unlocking badges and discount vouchers for local ice cream shops and surf schools.",
        "points": 10
      },
      {
        "id": "story-level2-9-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "How much plastic waste was removed from beaches in six months?",
        "correctIndex": 0,
        "modelAnswer": "Over twelve tons of plastic waste.",
        "keywords": [
          "twelve tons",
          "12 tons",
          "plastic waste"
        ],
        "explanationHebrew": "בפסקה 5 כתוב שהוסרו מעל שנים עשר טון פסולת פלסטיק (over twelve tons).",
        "points": 10
      },
      {
        "id": "story-level2-9-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "Where were the young inventors invited to present their invention?",
        "options": [
          "At a Silicon Valley tech expo",
          "At a United Nations youth environmental summit",
          "At a national television studio",
          "At a municipal museum"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 מצוין שהם הוזמנו להציג את האפליקציה בוועידת נוער סביבתית של האו\"ם (United Nations youth environmental summit).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-10",
    "title": "The Secrets of Ancient Papyrus",
    "hebrewTitle": "סודות הפפירוס העתיק",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "Thousands of years before the invention of modern paper, civilization relied on an extraordinary plant that flourished along the marshy banks of the Nile River in Egypt: Cyperus papyrus. The ancient Egyptians transformed these tall triangular reeds into the world's first portable writing surface.",
      "The process of creating papyrus was remarkably sophisticated. Scribes sliced the plant's fibrous inner pith into thin strips and soaked them in river water. They arranged the strips in two perpendicular layers, pressed them under heavy stones to squeeze out moisture, and polished the dried sheets with smooth seashells.",
      "Papyrus revolutionized how humans communicated. For the first time, laws, medical diagnoses, religious hymns, and tax receipts could be recorded on lightweight scrolls and rolled up for convenient storage and transport across vast empires.",
      "Remarkably, the arid climate of Egypt and the Judean Desert helped preserve thousands of ancient papyrus documents for millennia. In the caves near Qumran and the Dead Sea, archaeologists discovered priceless biblical scrolls preserved in clay jars since antiquity.",
      "Today, conservators in modern museums use multispectral digital scanning to read ancient papyrus scrolls that were charred by fire or blackened by age. These fragile fibers allow modern historians to hear the authentic voices of people who lived four thousand years ago."
    ],
    "vocabularyHints": [
      {
        "word": "reeds",
        "translation": "קני סוף"
      },
      {
        "word": "fibrous",
        "translation": "סיבי"
      },
      {
        "word": "perpendicular",
        "translation": "מאונך (שכבות שתי וערב)"
      },
      {
        "word": "scrolls",
        "translation": "מגילות"
      },
      {
        "word": "arid",
        "translation": "צחיח ויבש"
      },
      {
        "word": "multispectral",
        "translation": "רב-ספקטרלי (סריקה באורכי גל שונים)"
      }
    ],
    "questions": [
      {
        "id": "story-level2-10-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where did the papyrus plant originally flourish?",
        "options": [
          "Along the Amazon rainforest",
          "Along the marshy banks of the Nile River in Egypt",
          "In the mountains of Greece",
          "Near the Tiber River in Rome"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהצמח שגשג לאורך גדות נהר הנילוס במצרים (marshy banks of the Nile River).",
        "points": 10
      },
      {
        "id": "story-level2-10-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes what ancient Egyptians transformed the plant into.",
        "correctIndex": 0,
        "targetSentence": "The ancient Egyptians transformed these tall triangular reeds into the world's first portable writing surface.",
        "explanationHebrew": "המשפט המדויק הוא: The ancient Egyptians transformed these tall triangular reeds into the world's first portable writing surface.",
        "points": 10
      },
      {
        "id": "story-level2-10-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What did scribes arrange the papyrus strips in?",
        "correctIndex": 0,
        "modelAnswer": "They arranged the strips in two perpendicular layers.",
        "keywords": [
          "perpendicular",
          "layers",
          "two"
        ],
        "explanationHebrew": "בפסקה 2 מוסבר שהם סידרו את הרצועות בשתי שכבות מאונכות (two perpendicular layers).",
        "points": 10
      },
      {
        "id": "story-level2-10-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What tool did craftsmen use to polish the dried papyrus sheets?",
        "options": [
          "Metal files",
          "Smooth seashells",
          "Sandpaper",
          "Wooden blocks"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהם ליטשו את הדפים בעזרת צדפים חלקים (smooth seashells).",
        "points": 10
      },
      {
        "id": "story-level2-10-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that lists items recorded on papyrus scrolls.",
        "correctIndex": 0,
        "targetSentence": "For the first time, laws, medical diagnoses, religious hymns, and tax receipts could be recorded on lightweight scrolls and rolled up for convenient storage and transport across vast empires.",
        "explanationHebrew": "המשפט המדויק הוא: For the first time, laws, medical diagnoses, religious hymns, and tax receipts could be recorded on lightweight scrolls and rolled up for convenient storage and transport across vast empires.",
        "points": 10
      },
      {
        "id": "story-level2-10-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "How did papyrus revolutionize human communication?",
        "correctIndex": 0,
        "modelAnswer": "Information could be recorded on lightweight scrolls for convenient storage and transport.",
        "keywords": [
          "lightweight",
          "scrolls",
          "storage",
          "transport"
        ],
        "explanationHebrew": "בפסקה 3 מוסבר שניתן היה לרשום מידע על גבי מגילות קלות משקל לאחסון ושינוע נוח.",
        "points": 10
      },
      {
        "id": "story-level2-10-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What natural climate condition helped preserve ancient scrolls for millennia?",
        "options": [
          "High humidity",
          "The arid climate of Egypt and the Judean Desert",
          "Cold snowy winters",
          "Frequent tropical rains"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוסבר שהאקלים הצחיח והיבש של מצרים ומדבר יהודה סייע בשימור המגילות (arid climate).",
        "points": 10
      },
      {
        "id": "story-level2-10-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that mentions where biblical scrolls were discovered in clay jars.",
        "correctIndex": 0,
        "targetSentence": "In the caves near Qumran and the Dead Sea, archaeologists discovered priceless biblical scrolls preserved in clay jars since antiquity.",
        "explanationHebrew": "המשפט המדויק הוא: In the caves near Qumran and the Dead Sea, archaeologists discovered priceless biblical scrolls preserved in clay jars since antiquity.",
        "points": 10
      },
      {
        "id": "story-level2-10-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What technology do modern museum conservators use to read blackened scrolls?",
        "correctIndex": 0,
        "modelAnswer": "They use multispectral digital scanning.",
        "keywords": [
          "multispectral",
          "digital scanning",
          "scanning"
        ],
        "explanationHebrew": "בפסקה 5 מצוינת טכנולוגיית סריקה דיגיטלית רב-ספקטרלית (multispectral digital scanning).",
        "points": 10
      },
      {
        "id": "story-level2-10-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "According to paragraph 5, what do these preserved papyrus fibers allow historians to do?",
        "options": [
          "To sell museum tickets",
          "To hear the authentic voices of people who lived four thousand years ago",
          "To create new types of plastic",
          "To prove ancient myths are true"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסוף מסופר שהסיבים מאפשרים לשמוע את קולם האותנטי של אנשים שחיו לפני ארבעת אלפים שנה.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-11",
    "title": "How Chocolate Conquered the World",
    "hebrewTitle": "כיצד השוקולד כבש את העולם",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "Today, chocolate is celebrated worldwide as a delightful sweet treat. However, for most of its four-thousand-year history, chocolate was consumed not as a solid sweet bar, but as a spicy, bitter, and sacred beverage. The story of chocolate began in the dense tropical rainforests of Central and South America.",
      "Ancient Mesoamerican civilizations, particularly the Maya and Aztecs, harvested pods from the cacao tree. They fermented the seeds, roasted them over clay fires, and ground them into a rich paste. They mixed this paste with water, fiery chili peppers, and wild vanilla, pouring the mixture between vessels until a thick froth formed on top.",
      "To the Aztecs, cacao was considered a divine gift from Quetzalcoatl, the god of wisdom. Cacao beans were so valuable that they functioned as actual currency: for instance, one rabbit could be purchased for ten beans, while an avocado cost three beans. Only royalty, priests, and honored warriors were permitted to drink the sacred brew.",
      "In the sixteenth century, Spanish conquistadors encountered cacao and transported it back to Europe. European royal courts found the native drink far too bitter. Chefs began adding cane sugar, warm milk, and cinnamon, transforming the brew into an exclusive luxury for European aristocrats.",
      "The nineteenth century brought industrial breakthroughs that democratized chocolate. In 1828, Dutch chemist Coenraad van Houten invented the cocoa press, which extracted cocoa butter. Soon after, Swiss chocolatiers developed smooth milk chocolate bars, turning a sacred ancient ritual into a universally loved indulgence."
    ],
    "vocabularyHints": [
      {
        "word": "beverage",
        "translation": "משקה"
      },
      {
        "word": "pods",
        "translation": "תרמילים (של עץ הקקאו)"
      },
      {
        "word": "currency",
        "translation": "מטבע עובר לסוחר"
      },
      {
        "word": "aristocrats",
        "translation": "אריסטוקרטים (אצילי החברה)"
      },
      {
        "word": "democratized",
        "translation": "הפך לנגיש לכלל הציבור"
      },
      {
        "word": "indulgence",
        "translation": "פינוק מענג"
      }
    ],
    "questions": [
      {
        "id": "story-level2-11-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "How was chocolate originally consumed for most of its history?",
        "options": [
          "As a frozen dessert",
          "As a solid sweet bar with milk",
          "As a spicy, bitter, and sacred beverage",
          "As a baked breakfast pastry"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 1 כתוב שהשוקולד נצרך במקור כמשקה חריף, מר ומקודש (spicy, bitter, and sacred beverage).",
        "points": 10
      },
      {
        "id": "story-level2-11-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that tells where the story of chocolate began.",
        "correctIndex": 0,
        "targetSentence": "The story of chocolate began in the dense tropical rainforests of Central and South America.",
        "explanationHebrew": "המשפט המדויק הוא: The story of chocolate began in the dense tropical rainforests of Central and South America.",
        "points": 10
      },
      {
        "id": "story-level2-11-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What spicy ingredient did the Maya and Aztecs mix with cacao paste?",
        "correctIndex": 0,
        "modelAnswer": "They mixed it with fiery chili peppers and wild vanilla.",
        "keywords": [
          "chili peppers",
          "peppers",
          "vanilla"
        ],
        "explanationHebrew": "בפסקה 2 מצוין שהם הוסיפו פלפלי צ'ילי חריפים ווניל בר (fiery chili peppers).",
        "points": 10
      },
      {
        "id": "story-level2-11-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What did the ancient Mesoamericans pour between vessels to create?",
        "options": [
          "Cold ice crystals",
          "A thick froth on top",
          "A solid candy block",
          "Sweet syrup"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהם מזגו את המשקה בין כלים עד שנוצר קצף עבה למעלה (thick froth formed on top).",
        "points": 10
      },
      {
        "id": "story-level2-11-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that proves cacao beans were used as currency.",
        "correctIndex": 0,
        "targetSentence": "Cacao beans were so valuable that they functioned as actual currency: for instance, one rabbit could be purchased for ten beans, while an avocado cost three beans.",
        "explanationHebrew": "המשפט המדויק הוא: Cacao beans were so valuable that they functioned as actual currency: for instance, one rabbit could be purchased for ten beans, while an avocado cost three beans.",
        "points": 10
      },
      {
        "id": "story-level2-11-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "Who was permitted to drink the sacred cacao brew in Aztec society?",
        "correctIndex": 0,
        "modelAnswer": "Only royalty, priests, and honored warriors.",
        "keywords": [
          "royalty",
          "priests",
          "warriors"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שרק מלכים, כוהנים ולוחמים מכובדים הורשו לשתות (royalty, priests, and honored warriors).",
        "points": 10
      },
      {
        "id": "story-level2-11-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What did European chefs add to make chocolate sweeter for royal courts?",
        "options": [
          "Honey and lemon",
          "Cane sugar, warm milk, and cinnamon",
          "Salt and olive oil",
          "Ginger and black tea"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב ששפים אירופאים הוסיפו סוכר קנים, חלב חם וקינמון (cane sugar, warm milk, and cinnamon).",
        "points": 10
      },
      {
        "id": "story-level2-11-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that tells how European royal courts reacted to the native drink.",
        "correctIndex": 0,
        "targetSentence": "European royal courts found the native drink far too bitter.",
        "explanationHebrew": "המשפט המדויק הוא: European royal courts found the native drink far too bitter.",
        "points": 10
      },
      {
        "id": "story-level2-11-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What did Dutch chemist Coenraad van Houten invent in 1828?",
        "correctIndex": 0,
        "modelAnswer": "He invented the cocoa press, which extracted cocoa butter.",
        "keywords": [
          "cocoa press",
          "press",
          "cocoa butter"
        ],
        "explanationHebrew": "בפסקה 5 מצוין שהוא המציא את מכבש הקקאו (cocoa press).",
        "points": 10
      },
      {
        "id": "story-level2-11-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "Which country chocolatiers developed smooth milk chocolate bars?",
        "options": [
          "French",
          "Swiss",
          "German",
          "Italian"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 כתוב ששוקולטיירים שווייצרים פיתחו את חטיפי שוקולד החלב (Swiss chocolatiers).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-12",
    "title": "Guide Dogs: Faithful Partners for the Blind",
    "hebrewTitle": "כלבי נחייה: שותפים נאמנים לעיוורים",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "Navigating bustling city streets can be a daunting challenge for individuals with visual impairments. Traffic intersections, unexpected construction obstacles, and crowded sidewalks present constant hazards. For thousands of visually impaired people around the world, guide dogs provide independence, safety, and unwavering companionship.",
      "The rigorous journey of a guide dog begins during puppyhood. Breeds such as Golden Retrievers, Labradors, and German Shepherds are selected for their calm temperament, intelligence, and willingness to learn. For their first year, puppies live with volunteer foster families who socialize them in diverse environments, from shopping malls to public buses.",
      "At one year of age, the dogs enter formal professional training centers. Over several months, expert trainers teach them advanced spatial navigation skills. Dogs learn to walk in a straight line, pause at street curbs, judge overhead clearances, and guide their human partners around sudden obstacles.",
      "A unique and crucial skill taught to guide dogs is 'intelligent disobedience.' If a blind handler gives a command to move forward, but the dog detects an oncoming car, an open maintenance hole, or an approaching train, the dog will firmly refuse to obey, protecting its human from catastrophe.",
      "Once a dog graduates, it is carefully paired with a visually impaired partner based on walking pace and lifestyle. Together, handler and canine form a seamless bond built on mutual trust. A guide dog is far more than a working service animal—it is a life-changing partner that opens the world."
    ],
    "vocabularyHints": [
      {
        "word": "daunting",
        "translation": "מרתיע / מאתגר"
      },
      {
        "word": "impairments",
        "translation": "לקויות"
      },
      {
        "word": "temperament",
        "translation": "מזג / אופי"
      },
      {
        "word": "socialize",
        "translation": "לחשוף לחברה ולסביבות"
      },
      {
        "word": "curbs",
        "translation": "שפת המדרכה"
      },
      {
        "word": "disobedience",
        "translation": "אי-ציות"
      }
    ],
    "questions": [
      {
        "id": "story-level2-12-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What three vital gifts do guide dogs provide to visually impaired individuals?",
        "options": [
          "Money, food, and medicine",
          "Independence, safety, and unwavering companionship",
          "Transportation tickets and guides",
          "Entertainment and tricks"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהם מעניקים עצמאות, בטיחות וחברות נאמנה (independence, safety, and unwavering companionship).",
        "points": 10
      },
      {
        "id": "story-level2-12-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that lists hazards found on city streets.",
        "correctIndex": 0,
        "targetSentence": "Traffic intersections, unexpected construction obstacles, and crowded sidewalks present constant hazards.",
        "explanationHebrew": "המשפט המדויק הוא: Traffic intersections, unexpected construction obstacles, and crowded sidewalks present constant hazards.",
        "points": 10
      },
      {
        "id": "story-level2-12-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "Which dog breeds are commonly selected for guide dog training?",
        "correctIndex": 0,
        "modelAnswer": "Golden Retrievers, Labradors, and German Shepherds.",
        "keywords": [
          "Golden Retrievers",
          "Labradors",
          "German Shepherds"
        ],
        "explanationHebrew": "בפסקה 2 מפורטים הגזעים: גולדן רטריבר, לברדור ורועה גרמני.",
        "points": 10
      },
      {
        "id": "story-level2-12-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "Where do puppies live during their first year of life?",
        "options": [
          "In animal shelters",
          "With volunteer foster families",
          "At the airport",
          "In outdoor kennels only"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהגורים גדלים אצל משפחות אומנה מתנדבות (volunteer foster families).",
        "points": 10
      },
      {
        "id": "story-level2-12-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that lists skills taught to dogs at formal training centers.",
        "correctIndex": 0,
        "targetSentence": "Dogs learn to walk in a straight line, pause at street curbs, judge overhead clearances, and guide their human partners around sudden obstacles.",
        "explanationHebrew": "המשפט המדויק הוא: Dogs learn to walk in a straight line, pause at street curbs, judge overhead clearances, and guide their human partners around sudden obstacles.",
        "points": 10
      },
      {
        "id": "story-level2-12-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "At what age do dogs enter formal training centers?",
        "correctIndex": 0,
        "modelAnswer": "At one year of age.",
        "keywords": [
          "one year",
          "1 year"
        ],
        "explanationHebrew": "בפסקה 3 מצוין שהכלבים נכנסים למרכזי האילוף בגיל שנה (At one year of age).",
        "points": 10
      },
      {
        "id": "story-level2-12-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What is 'intelligent disobedience' in guide dogs?",
        "options": [
          "Refusing to eat dog food",
          "Refusing to obey a command if danger like an oncoming car is detected",
          "Barking loudly when bored",
          "Chasing other animals"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוסבר שאי-ציות אינטליגנטי פירושו סירוב לפקודת הליכה אם הכלב מזהה סכנה כמו רכב מתקרב או בור פתוח.",
        "points": 10
      },
      {
        "id": "story-level2-12-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that explains how intelligent disobedience protects the human handler.",
        "correctIndex": 0,
        "targetSentence": "If a blind handler gives a command to move forward, but the dog detects an oncoming car, an open maintenance hole, or an approaching train, the dog will firmly refuse to obey, protecting its human from catastrophe.",
        "explanationHebrew": "המשפט המדויק הוא: If a blind handler gives a command to move forward, but the dog detects an oncoming car, an open maintenance hole, or an approaching train, the dog will firmly refuse to obey, protecting its human from catastrophe.",
        "points": 10
      },
      {
        "id": "story-level2-12-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What criteria are used to pair a graduate guide dog with a blind partner?",
        "correctIndex": 0,
        "modelAnswer": "They are paired based on walking pace and lifestyle.",
        "keywords": [
          "walking pace",
          "pace",
          "lifestyle"
        ],
        "explanationHebrew": "בפסקה 5 מצוין שההתאמה נעשית על פי קצב ההליכה ואורח החיים (walking pace and lifestyle).",
        "points": 10
      },
      {
        "id": "story-level2-12-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What is the bond between handler and canine built on?",
        "options": [
          "Strict commands and fear",
          "Mutual trust",
          "Treats only",
          "Constant leash pulling"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 נכתב שהקשר ביניהם בנוי על אמון הדדי (mutual trust).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-13",
    "title": "The Power of Wind Turbines",
    "hebrewTitle": "עוצמתן של טורבינות הרוח",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "As humanity confronts global climate change, replacing polluting fossil fuels with clean, renewable energy has become a top priority. Among the most successful green technologies today are modern wind turbines. These graceful white giants convert the natural kinetic energy of moving air into clean electricity without emitting greenhouse gases.",
      "Although humans have used windmills to grind grain and pump water for centuries, contemporary wind turbines are marvels of advanced engineering. Towering up to one hundred and fifty meters above the ground, their sleek carbon-fiber blades are shaped like airplane wings. As wind flows over the blades, aerodynamic lift forces them to spin.",
      "Inside the turbine's central housing, known as the nacelle, the spinning rotor turns an internal shaft connected to a gearbox. The gearbox accelerates the rotation speed from twenty revolutions per minute to over one thousand five hundred revolutions per minute, driving an electric generator that produces high-voltage power.",
      "Wind farms are strategically situated in locations with strong and consistent air currents. In Israel, the windy plateaus of the Golan Heights and Mount Gilboa host large wind parks that supply electricity to tens of thousands of homes. Engineers also construct massive offshore wind farms anchored in shallow ocean waters, where ocean winds are even stronger and steadier.",
      "Critics historically noted that spinning blades posed a hazard to migratory birds. In response, modern wind farms employ radar systems and artificial intelligence cameras that detect approaching bird flocks from kilometers away, automatically pausing the turbines until the birds pass safely. Wind energy proves that cutting-edge technology can harmonize with the natural world."
    ],
    "vocabularyHints": [
      {
        "word": "kinetic",
        "translation": "קינטי (של תנועה)"
      },
      {
        "word": "emitting",
        "translation": "פולט (גזים)"
      },
      {
        "word": "contemporary",
        "translation": "עכשווי / מודרני"
      },
      {
        "word": "nacelle",
        "translation": "בית המנוע / תא העילוי של הטורבינה"
      },
      {
        "word": "gearbox",
        "translation": "תיבת הילוכים"
      },
      {
        "word": "plateaus",
        "translation": "רמות (שטח מישורי מוגבה)"
      }
    ],
    "questions": [
      {
        "id": "story-level2-13-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What type of energy do modern wind turbines convert into electricity?",
        "options": [
          "Solar thermal energy",
          "The natural kinetic energy of moving air",
          "Chemical battery power",
          "Geothermal steam"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהן ממירות אנרגיה קינטית טבעית של אוויר נע (kinetic energy of moving air).",
        "points": 10
      },
      {
        "id": "story-level2-13-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that explains why replacing fossil fuels is important.",
        "correctIndex": 0,
        "targetSentence": "As humanity confronts global climate change, replacing polluting fossil fuels with clean, renewable energy has become a top priority.",
        "explanationHebrew": "המשפט המדויק הוא: As humanity confronts global climate change, replacing polluting fossil fuels with clean, renewable energy has become a top priority.",
        "points": 10
      },
      {
        "id": "story-level2-13-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "How high can contemporary wind turbines tower above the ground?",
        "correctIndex": 0,
        "modelAnswer": "They can tower up to one hundred and fifty meters above the ground.",
        "keywords": [
          "one hundred and fifty",
          "150 meters",
          "meters"
        ],
        "explanationHebrew": "בפסקה 2 כתוב שהן יכולות להגיע לגובה של עד 150 מטרים מעל הקרקע.",
        "points": 10
      },
      {
        "id": "story-level2-13-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What aerodynamic shape are the turbine blades modeled after?",
        "options": [
          "Helicopter propellers",
          "Airplane wings",
          "Kite tails",
          "Fish fins"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהלהבים מעוצבים כמו כנפי מטוס (shaped like airplane wings).",
        "points": 10
      },
      {
        "id": "story-level2-13-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that names the turbine central housing.",
        "correctIndex": 0,
        "targetSentence": "Inside the turbine's central housing, known as the nacelle, the spinning rotor turns an internal shaft connected to a gearbox.",
        "explanationHebrew": "המשפט המדויק הוא: Inside the turbine's central housing, known as the nacelle, the spinning rotor turns an internal shaft connected to a gearbox.",
        "points": 10
      },
      {
        "id": "story-level2-13-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What does the gearbox do to the rotation speed?",
        "correctIndex": 0,
        "modelAnswer": "It accelerates the rotation speed from 20 rpm to over 1,500 rpm.",
        "keywords": [
          "accelerates",
          "1500",
          "gearbox",
          "speed"
        ],
        "explanationHebrew": "בפסקה 3 מוסבר שתיבת ההילוכים מאיצה את מהירות הסיבוב מ-20 ליותר מ-1,500 סיבובים לדקה.",
        "points": 10
      },
      {
        "id": "story-level2-13-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "Where are two major wind parks located in Israel?",
        "options": [
          "In the Negev desert and Eilat",
          "On the Golan Heights and Mount Gilboa",
          "Along Tel Aviv beaches",
          "In the Judean hills"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מצוינות רמת הגולן והר הגלבוע (Golan Heights and Mount Gilboa).",
        "points": 10
      },
      {
        "id": "story-level2-13-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes why offshore wind farms are built.",
        "correctIndex": 0,
        "targetSentence": "Engineers also construct massive offshore wind farms anchored in shallow ocean waters, where ocean winds are even stronger and steadier.",
        "explanationHebrew": "המשפט המדויק הוא: Engineers also construct massive offshore wind farms anchored in shallow ocean waters, where ocean winds are even stronger and steadier.",
        "points": 10
      },
      {
        "id": "story-level2-13-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "How do modern wind farms protect approaching bird flocks?",
        "correctIndex": 0,
        "modelAnswer": "They employ radar systems and AI cameras that detect birds and automatically pause the turbines.",
        "keywords": [
          "radar",
          "AI",
          "cameras",
          "pause",
          "turbines"
        ],
        "explanationHebrew": "בפסקה 5 מוסבר שמערכות מכ\"ם ומצלמות AI מזהות עופות ועוצרות אוטומטית את הטורבינות עד למעבר בטוח.",
        "points": 10
      },
      {
        "id": "story-level2-13-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What does wind energy prove according to the author?",
        "options": [
          "That electricity should be free",
          "That cutting-edge technology can harmonize with the natural world",
          "That machines will replace all nature",
          "That fossil fuels are superior"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שאנרגיית רוח מוכיחה שטכנולוגיה מתקדמת יכולה להשתלב בהרמוניה עם עולם הטבע.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-14",
    "title": "The Dead Sea and Its Floating Wonders",
    "hebrewTitle": "ים המלח ופלאי הציפה",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "Nestled in the Jordan Rift Valley between Israel and Jordan lies the Dead Sea, one of the most astonishing bodies of water on our planet. Resting at more than four hundred and thirty meters below sea level, its shoreline constitutes the lowest dry land elevation on Earth. Its unique environment attracts scientists, historians, and travelers from across the globe.",
      "The most famous characteristic of the Dead Sea is its extraordinary salinity. While ordinary ocean water contains approximately three point five percent dissolved salts, the Dead Sea contains a staggering thirty-four percent salt concentration. This extreme density creates unique buoyancy, allowing human swimmers to effortlessly float on the water's surface as if relaxing on a comfortable air mattress.",
      "Because of the severe mineral saturation, no fish, frogs, or aquatic plants can survive in its waters, which is how the sea earned its famous name. However, specialized microscopic organisms called halophilic archaea thrive in the salty environment. Their presence produces striking pink and crimson hues in salt pans along the coast.",
      "For thousands of years, the Dead Sea's rich black mud and mineral waters have been celebrated for their therapeutic properties. Ancient historical figures, including the biblical King Herod and Queen Cleopatra of Egypt, visited the region to bathe in its healing springs and harvest bitumen and cosmetics.",
      "Today, environmentalists are deeply concerned because the Dead Sea is rapidly shrinking. Diversion of the Jordan River and industrial mineral extraction have caused water levels to drop by over one meter every year. International conservation efforts are urgently seeking solutions to replenish and protect this irreplaceable geological treasure."
    ],
    "vocabularyHints": [
      {
        "word": "elevation",
        "translation": "גובה פני הקרקע"
      },
      {
        "word": "salinity",
        "translation": "מליחות"
      },
      {
        "word": "buoyancy",
        "translation": "כושר ציפה"
      },
      {
        "word": "saturation",
        "translation": "רוויה"
      },
      {
        "word": "therapeutic",
        "translation": "רפואי / טיפולי"
      },
      {
        "word": "replenish",
        "translation": "למלא מחדש"
      }
    ],
    "questions": [
      {
        "id": "story-level2-14-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What geographical title does the Dead Sea shoreline hold?",
        "options": [
          "The highest mountain plateau",
          "The lowest dry land elevation on Earth",
          "The deepest freshwater lake",
          "The widest natural bay"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שחופי ים המלח הם המקום היבשתי הנמוך ביותר בעולם (lowest dry land elevation on Earth).",
        "points": 10
      },
      {
        "id": "story-level2-14-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that states how far below sea level the Dead Sea rests.",
        "correctIndex": 0,
        "targetSentence": "Resting at more than four hundred and thirty meters below sea level, its shoreline constitutes the lowest dry land elevation on Earth.",
        "explanationHebrew": "המשפט המדויק הוא: Resting at more than four hundred and thirty meters below sea level, its shoreline constitutes the lowest dry land elevation on Earth.",
        "points": 10
      },
      {
        "id": "story-level2-14-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What is the salt concentration of the Dead Sea compared to ordinary ocean water?",
        "correctIndex": 0,
        "modelAnswer": "It has thirty-four percent salt concentration compared to 3.5 percent in ordinary ocean water.",
        "keywords": [
          "thirty-four",
          "34%",
          "3.5%"
        ],
        "explanationHebrew": "בפסקה 2 כתוב שיש בו 34 אחוזי מליחות לעומת 3.5 אחוזים במי ים רגילים.",
        "points": 10
      },
      {
        "id": "story-level2-14-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What does the extreme water density allow swimmers to do?",
        "options": [
          "Dive deep without oxygen tanks",
          "Effortlessly float on the water's surface",
          "Swim faster than motorboats",
          "Walk on water without getting wet"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מוסבר שהצפיפות הגבוהה מאפשרת לשחיינים לצוף ללא כל מאמץ (effortlessly float).",
        "points": 10
      },
      {
        "id": "story-level2-14-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that explains why the sea earned its name.",
        "correctIndex": 0,
        "targetSentence": "Because of the severe mineral saturation, no fish, frogs, or aquatic plants can survive in its waters, which is how the sea earned its famous name.",
        "explanationHebrew": "המשפט המדויק הוא: Because of the severe mineral saturation, no fish, frogs, or aquatic plants can survive in its waters, which is how the sea earned its famous name.",
        "points": 10
      },
      {
        "id": "story-level2-14-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What microscopic organisms thrive in the salty waters of the Dead Sea?",
        "correctIndex": 0,
        "modelAnswer": "Specialized microscopic organisms called halophilic archaea.",
        "keywords": [
          "halophilic",
          "archaea",
          "organisms"
        ],
        "explanationHebrew": "בפסקה 3 מצוינים יצורים מיקרוסקופיים בשם halophilic archaea.",
        "points": 10
      },
      {
        "id": "story-level2-14-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "Which ancient historical figures visited the Dead Sea for its therapeutic properties?",
        "options": [
          "Julius Caesar and Alexander the Great",
          "King Herod and Queen Cleopatra",
          "Napoleon Bonaparte",
          "King Solomon and Queen Victoria"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוזכרים המלך הורדוס ומלכת מצרים קלאופטרה (King Herod and Queen Cleopatra).",
        "points": 10
      },
      {
        "id": "story-level2-14-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that tells what ancient figures visited the region to do.",
        "correctIndex": 0,
        "targetSentence": "Ancient historical figures, including the biblical King Herod and Queen Cleopatra of Egypt, visited the region to bathe in its healing springs and harvest bitumen and cosmetics.",
        "explanationHebrew": "המשפט המדויק הוא: Ancient historical figures, including the biblical King Herod and Queen Cleopatra of Egypt, visited the region to bathe in its healing springs and harvest bitumen and cosmetics.",
        "points": 10
      },
      {
        "id": "story-level2-14-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "By how much are Dead Sea water levels dropping every year?",
        "correctIndex": 0,
        "modelAnswer": "Water levels drop by over one meter every year.",
        "keywords": [
          "one meter",
          "1 meter",
          "drop"
        ],
        "explanationHebrew": "בפסקה 5 כתוב שמפלס המים יורד ביותר ממטר אחד מדי שנה (over one meter every year).",
        "points": 10
      },
      {
        "id": "story-level2-14-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What are two main human causes of the Dead Sea shrinking?",
        "options": [
          "Tourism and swimming",
          "Diversion of the Jordan River and industrial mineral extraction",
          "Acid rain and global warming only",
          "Earthquakes and volcanic eruptions"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 מוסבר שהגורמים הם הטיית מי נהר הירדן והפקת מינרלים תעשייתית.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-15",
    "title": "The Codebreakers of Bletchley Park",
    "hebrewTitle": "מפענחי הצפנים של בלצ'לי פארק",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "During World War II, a top-secret intellectual battle took place inside an unassuming Victorian estate in Buckinghamshire, England: Bletchley Park. Here, a brilliant team of mathematicians, linguists, chess champions, and crossword enthusiasts gathered to crack military codes generated by the German Enigma machine.",
      "The Enigma cipher machine was regarded by military strategists as virtually unbreakable. Every single time a letter key was pressed, internal electrical rotors rotated, changing the electrical circuit and producing billions of possible letter combinations. Furthermore, the German army changed the machine's code settings every single midnight.",
      "To counter this dizzying mathematical complexity, British mathematician Alan Turing designed an electromechanical deciphering device named the 'Bombe.' The Bombe machine could simulate dozens of Enigma rotors simultaneously, testing hundreds of thousands of potential code combinations in a matter of minutes.",
      "Equally critical to the mission was the dedication of thousands of women from the Women's Royal Naval Service (Wrens). Operating in frigid, noisy wooden huts around the clock, these women meticulously operated the Bombe machinery, intercepted radio transmissions, and sorted decrypted enemy dispatches.",
      "Historians estimate that the intelligence gathered at Bletchley Park, code-named 'Ultra,' shortened World War II by two to four years and saved millions of civilian and soldier lives. Alan Turing's groundbreaking work also laid the theoretical and practical foundation for modern computer science."
    ],
    "vocabularyHints": [
      {
        "word": "unassuming",
        "translation": "צנוע / לא מושך תשומת לב"
      },
      {
        "word": "cipher",
        "translation": "צופן / הצפנה"
      },
      {
        "word": "rotors",
        "translation": "גלגלי שיניים מסתובבים"
      },
      {
        "word": "simultaneously",
        "translation": "בו-זמנית"
      },
      {
        "word": "decrypted",
        "translation": "מפוענח"
      },
      {
        "word": "groundbreaking",
        "translation": "פורץ דרך"
      }
    ],
    "questions": [
      {
        "id": "story-level2-15-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where did the secret codebreaking operation take place?",
        "options": [
          "In London Tower",
          "At Bletchley Park in Buckinghamshire, England",
          "At Cambridge University",
          "Inside a military submarine"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהמבצע התקיים באחוזת בלצ'לי פארק בבקינגהאמשייר, אנגליה (Bletchley Park in Buckinghamshire, England).",
        "points": 10
      },
      {
        "id": "story-level2-15-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that lists the types of experts gathered at Bletchley Park.",
        "correctIndex": 0,
        "targetSentence": "Here, a brilliant team of mathematicians, linguists, chess champions, and crossword enthusiasts gathered to crack military codes generated by the German Enigma machine.",
        "explanationHebrew": "המשפט המדויק הוא: Here, a brilliant team of mathematicians, linguists, chess champions, and crossword enthusiasts gathered to crack military codes generated by the German Enigma machine.",
        "points": 10
      },
      {
        "id": "story-level2-15-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "When did the German army change the Enigma machine code settings?",
        "correctIndex": 0,
        "modelAnswer": "They changed the settings every single midnight.",
        "keywords": [
          "every midnight",
          "midnight",
          "every single"
        ],
        "explanationHebrew": "בפסקה 2 מצוין שההגדרות שונו בכל חצות בדיוק (every single midnight).",
        "points": 10
      },
      {
        "id": "story-level2-15-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "Why was the Enigma machine considered virtually unbreakable?",
        "options": [
          "It was kept in an iron vault",
          "Internal rotors rotated with every keypress, creating billions of combinations",
          "It could destroy itself if touched",
          "It only used Greek letters"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מוסבר שגלגלי השיניים הסתובבו בכל הקשה ויצרו מיליארדי שילובים אפשריים.",
        "points": 10
      },
      {
        "id": "story-level2-15-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that names Alan Turing electromechanical deciphering device.",
        "correctIndex": 0,
        "targetSentence": "To counter this dizzying mathematical complexity, British mathematician Alan Turing designed an electromechanical deciphering device named the 'Bombe.'",
        "explanationHebrew": "המשפט המדויק הוא: To counter this dizzying mathematical complexity, British mathematician Alan Turing designed an electromechanical deciphering device named the 'Bombe.'",
        "points": 10
      },
      {
        "id": "story-level2-15-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What could the Bombe machine do in a matter of minutes?",
        "correctIndex": 0,
        "modelAnswer": "It could test hundreds of thousands of potential code combinations.",
        "keywords": [
          "hundreds of thousands",
          "combinations",
          "potential"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שהמכונה יכלה לבדוק מאות אלפי שילובי צופן תוך דקות ספורות.",
        "points": 10
      },
      {
        "id": "story-level2-15-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "Who operated the Bombe machinery around the clock in the wooden huts?",
        "options": [
          "American air force pilots",
          "Thousands of women from the Women's Royal Naval Service (Wrens)",
          "University professors only",
          "High school teenagers"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוסבר שאלפי נשים משירות חיל הים המלכותי לנשים (Wrens) הפעילו את המכונות.",
        "points": 10
      },
      {
        "id": "story-level2-15-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes the environment inside the wooden huts.",
        "correctIndex": 0,
        "targetSentence": "Operating in frigid, noisy wooden huts around the clock, these women meticulously operated the Bombe machinery, intercepted radio transmissions, and sorted decrypted enemy dispatches.",
        "explanationHebrew": "המשפט המדויק הוא: Operating in frigid, noisy wooden huts around the clock, these women meticulously operated the Bombe machinery, intercepted radio transmissions, and sorted decrypted enemy dispatches.",
        "points": 10
      },
      {
        "id": "story-level2-15-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "By how many years did Bletchley Park intelligence shorten World War II?",
        "correctIndex": 0,
        "modelAnswer": "It shortened the war by two to four years.",
        "keywords": [
          "two to four",
          "2 to 4",
          "years"
        ],
        "explanationHebrew": "בפסקה 5 מצוין שהמודיעין קיצר את המלחמה בשנתיים עד ארבע שנים (two to four years).",
        "points": 10
      },
      {
        "id": "story-level2-15-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What modern academic field was founded by Alan Turing groundbreaking work?",
        "options": [
          "Civil engineering",
          "Modern computer science",
          "Aviation medicine",
          "Chemical synthesis"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסוף מסופר שעבודתו של אלן טיורינג הניחה את היסוד למדעי המחשב המודרניים (modern computer science).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-16",
    "title": "The Giant Redwoods: Earth's Ancient Towers",
    "hebrewTitle": "עצי הרדווד הענקיים: מגדלי כדור הארץ",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "Along the foggy coast of northern California grow the tallest living organisms on our planet: the coast redwoods (Sequoia sempervirens). Reaching heights of over one hundred and fifteen meters—taller than the Statue of Liberty or Big Ben—these majestic evergreen trees have thrived in the Pacific Northwest for millions of years.",
      "The survival of redwoods is intimately tied to summer coastal fog. Because standard tree root pressure cannot pump water more than one hundred meters straight up against gravity, redwoods rely on a remarkable aerial adaptation. Their high canopy needles absorb tiny moisture droplets directly from thick ocean fog, providing up to forty percent of their annual water intake.",
      "Surprisingly, the root systems of redwoods are remarkably shallow, penetrating only two to three meters into the forest floor. Instead of anchoring deep underground, redwood roots spread outwards horizontally up to thirty meters, intertwining tightly with the roots of neighboring trees. This subterranean network locks an entire grove together, preventing individual giants from toppling during violent winter gales.",
      "Redwood bark also possesses extraordinary defense mechanisms. Up to thirty centimeters thick, the fibrous bark contains high concentrations of chemical compounds called tannins. Tannins make the wood practically immune to insect infestation, wood-decaying fungus, and even wildfire flames.",
      "During the nineteenth-century Gold Rush, unchecked commercial logging wiped out more than ninety percent of old-growth redwood forests. Today, protected national and state parks safeguard the remaining ancient groves, allowing modern visitors to walk in reverent silence beneath living monuments that germinated during the height of the Roman Empire."
    ],
    "vocabularyHints": [
      {
        "word": "organisms",
        "translation": "אורגניזמים (יצורים חיים)"
      },
      {
        "word": "aerial",
        "translation": "אווירי"
      },
      {
        "word": "intertwining",
        "translation": "משתלבים / שזורים זה בזה"
      },
      {
        "word": "tannins",
        "translation": "טאנינים (חומרי הגנה צמחיים)"
      },
      {
        "word": "infestation",
        "translation": "פלישת מזיקים / מתקפת חרקים"
      },
      {
        "word": "germinated",
        "translation": "נבטו"
      }
    ],
    "questions": [
      {
        "id": "story-level2-16-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where do the coast redwoods naturally grow?",
        "options": [
          "In the Rocky Mountains",
          "Along the foggy coast of northern California",
          "In the Florida Everglades",
          "In the Amazon basin"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהם גדלים לאורך חופי צפון קליפורניה המעורפלים (foggy coast of northern California).",
        "points": 10
      },
      {
        "id": "story-level2-16-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that compares the height of redwoods to famous landmarks.",
        "correctIndex": 0,
        "targetSentence": "Reaching heights of over one hundred and fifteen meters—taller than the Statue of Liberty or Big Ben—these majestic evergreen trees have thrived in the Pacific Northwest for millions of years.",
        "explanationHebrew": "המשפט המדויק הוא: Reaching heights of over one hundred and fifteen meters—taller than the Statue of Liberty or Big Ben—these majestic evergreen trees have thrived in the Pacific Northwest for millions of years.",
        "points": 10
      },
      {
        "id": "story-level2-16-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "How much of a redwood annual water intake comes from coastal fog?",
        "correctIndex": 0,
        "modelAnswer": "Up to forty percent of their annual water intake.",
        "keywords": [
          "forty percent",
          "40%",
          "water intake"
        ],
        "explanationHebrew": "בפסקה 2 כתוב שעד 40 אחוזים מצריכת המים השנתית מגיעים מערפל החוף (forty percent).",
        "points": 10
      },
      {
        "id": "story-level2-16-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "Why do redwoods need to absorb water from fog in the high canopy?",
        "options": [
          "The ground has no rain",
          "Root pressure cannot pump water more than 100 meters up against gravity",
          "Insects eat their roots",
          "Their leaves are poisonous to rain"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מוסבר שלחץ השורשים אינו יכול לשאוב מים מעל 100 מטרים כנגד כוח הכבידה.",
        "points": 10
      },
      {
        "id": "story-level2-16-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that tells how deep redwood roots penetrate into the forest floor.",
        "correctIndex": 0,
        "targetSentence": "Surprisingly, the root systems of redwoods are remarkably shallow, penetrating only two to three meters into the forest floor.",
        "explanationHebrew": "המשפט המדויק הוא: Surprisingly, the root systems of redwoods are remarkably shallow, penetrating only two to three meters into the forest floor.",
        "points": 10
      },
      {
        "id": "story-level2-16-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "How do redwood roots protect trees from toppling during winter gales?",
        "correctIndex": 0,
        "modelAnswer": "Roots spread horizontally and intertwine tightly with the roots of neighboring trees.",
        "keywords": [
          "intertwine",
          "neighboring",
          "spread",
          "roots"
        ],
        "explanationHebrew": "בפסקה 3 מוסבר שהשורשים מתפשטים לרוחב ומשתלבים בשורשי העצים השכנים לרשת תת-קרקעית יציבה.",
        "points": 10
      },
      {
        "id": "story-level2-16-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What chemical compounds make redwood bark immune to insects, fungus, and flames?",
        "options": [
          "Chlorophyll",
          "Tannins",
          "Resin crystals",
          "Sulfur"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מצוינות תרכובות כימיות בשם טאנינים (tannins).",
        "points": 10
      },
      {
        "id": "story-level2-16-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that states how thick redwood bark can be.",
        "correctIndex": 0,
        "targetSentence": "Up to thirty centimeters thick, the fibrous bark contains high concentrations of chemical compounds called tannins.",
        "explanationHebrew": "המשפט המדויק הוא: Up to thirty centimeters thick, the fibrous bark contains high concentrations of chemical compounds called tannins.",
        "points": 10
      },
      {
        "id": "story-level2-16-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What historical event in the 19th century caused massive logging of old-growth redwoods?",
        "correctIndex": 0,
        "modelAnswer": "The nineteenth-century Gold Rush.",
        "keywords": [
          "Gold Rush",
          "nineteenth-century",
          "19th"
        ],
        "explanationHebrew": "בפסקה 5 מצוינת בהלת הזהב של המאה ה-19 (Gold Rush).",
        "points": 10
      },
      {
        "id": "story-level2-16-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "When did the oldest surviving redwoods germinate?",
        "options": [
          "During World War I",
          "During the height of the Roman Empire",
          "In the Middle Ages",
          "Five hundred years ago"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום מסופר שהעצים העתיקים נבטו עוד בימי שיא האימפריה הרומית (during the height of the Roman Empire).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-17",
    "title": "The Flying Doctors of the Australian Outback",
    "hebrewTitle": "הרופאים המעופפים במדבר האוסטרלי",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "The Australian Outback is one of the most sparsely populated and remote regions on the globe. Spanning millions of square kilometers of red desert, cattle stations, and indigenous settlements, families can live hundreds of kilometers away from the nearest hospital. In medical emergencies, survival depends on an extraordinary aviation service: the Royal Flying Doctor Service (RFDS).",
      "Founded in 1928 by Reverend John Flynn, the RFDS pioneered the integration of radio communications and aviation medicine. Flynn envisioned a 'mantle of safety' spread across the wilderness so that no pioneer or rural family would feel abandoned when illness struck.",
      "Today, the RFDS operates a modern fleet of more than seventy specially equipped aircraft that function as airborne intensive care units. Flown by experienced bush pilots who can land on unpaved red dirt strips, dry lake beds, or even blocked desert highways, each plane carries emergency flight doctors and specialized critical-care nurses.",
      "In addition to emergency evacuations, the service provides vital routine healthcare. Flying doctors conduct telehealth clinics over satellite networks, land in remote towns to perform vaccinations and dental exams, and distribute standardized medicine chests containing numbered medications that can be prescribed by phone.",
      "Covering an operational territory larger than Western Europe, the Royal Flying Doctor Service conducts over one hundred emergency aeromedical flights every day. It stands as a world-renowned testament to human ingenuity and compassionate public service."
    ],
    "vocabularyHints": [
      {
        "word": "sparsely",
        "translation": "בדלילות"
      },
      {
        "word": "indigenous",
        "translation": "ילידי (שבטי המקום)"
      },
      {
        "word": "visioned",
        "translation": "חזה / ראה בחזונו"
      },
      {
        "word": "airborne",
        "translation": "מוטס / באוויר"
      },
      {
        "word": "evacuations",
        "translation": "פינויים רפואיים"
      },
      {
        "word": "ingenuity",
        "translation": "כושר המצאה ותושייה"
      }
    ],
    "questions": [
      {
        "id": "story-level2-17-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Why is the Australian Outback a difficult place to access medical care?",
        "options": [
          "Hospitals are too expensive",
          "It spans millions of square kilometers with families hundreds of kilometers from hospitals",
          "Doctors refuse to work there",
          "There are no roads"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 מוסבר שהאזור מרוחק מאוד ומשפחות מתגוררות מאות קילומטרים מבית החולים הקרוב.",
        "points": 10
      },
      {
        "id": "story-level2-17-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that names the aviation medical service.",
        "correctIndex": 0,
        "targetSentence": "In medical emergencies, survival depends on an extraordinary aviation service: the Royal Flying Doctor Service (RFDS).",
        "explanationHebrew": "המשפט המדויק הוא: In medical emergencies, survival depends on an extraordinary aviation service: the Royal Flying Doctor Service (RFDS).",
        "points": 10
      },
      {
        "id": "story-level2-17-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "Who founded the Royal Flying Doctor Service in 1928?",
        "correctIndex": 0,
        "modelAnswer": "Reverend John Flynn founded the service.",
        "keywords": [
          "Reverend",
          "John Flynn",
          "Flynn"
        ],
        "explanationHebrew": "בפסקה 2 מצוין הכומר ג'ון פלין (Reverend John Flynn).",
        "points": 10
      },
      {
        "id": "story-level2-17-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What phrase did John Flynn use to describe his vision for the service?",
        "options": [
          "A bridge across oceans",
          "A mantle of safety",
          "A highway in the sky",
          "Wings of gold"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהוא ראה בחזונו 'גלימת ביטחון' (a 'mantle of safety').",
        "points": 10
      },
      {
        "id": "story-level2-17-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that tells how many aircraft the RFDS operates today.",
        "correctIndex": 0,
        "targetSentence": "Today, the RFDS operates a modern fleet of more than seventy specially equipped aircraft that function as airborne intensive care units.",
        "explanationHebrew": "המשפט המדויק הוא: Today, the RFDS operates a modern fleet of more than seventy specially equipped aircraft that function as airborne intensive care units.",
        "points": 10
      },
      {
        "id": "story-level2-17-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "Where can experienced bush pilots land in emergencies?",
        "correctIndex": 0,
        "modelAnswer": "They can land on unpaved red dirt strips, dry lake beds, or blocked desert highways.",
        "keywords": [
          "dirt strips",
          "lake beds",
          "highways",
          "unpaved"
        ],
        "explanationHebrew": "בפסקה 3 מוסבר שהם יכולים לנחות על מסלולי עפר אדומים, ימות יבשות ואף כבישים חסומים.",
        "points": 10
      },
      {
        "id": "story-level2-17-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What routine healthcare services do flying doctors provide in remote towns?",
        "options": [
          "Performing major surgeries only",
          "Telehealth clinics, vaccinations, dental exams, and medicine chests",
          "Selling medical insurance",
          "Training pilots"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מפורטים חיסונים, בדיקות שיניים, ייעוץ טלרפואי וחלוקת ארגזי תרופות ממוספרים.",
        "points": 10
      },
      {
        "id": "story-level2-17-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes the standardized medicine chests.",
        "correctIndex": 0,
        "targetSentence": "Flying doctors conduct telehealth clinics over satellite networks, land in remote towns to perform vaccinations and dental exams, and distribute standardized medicine chests containing numbered medications that can be prescribed by phone.",
        "explanationHebrew": "המשפט המדויק הוא: Flying doctors conduct telehealth clinics over satellite networks, land in remote towns to perform vaccinations and dental exams, and distribute standardized medicine chests containing numbered medications that can be prescribed by phone.",
        "points": 10
      },
      {
        "id": "story-level2-17-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "How many emergency flights does the RFDS conduct every day?",
        "correctIndex": 0,
        "modelAnswer": "Over one hundred emergency aeromedical flights every day.",
        "keywords": [
          "one hundred",
          "100",
          "flights",
          "every day"
        ],
        "explanationHebrew": "בפסקה 5 כתוב שהם מבצעים מעל מאה טיסות חירום רפואיות מדי יום (over one hundred).",
        "points": 10
      },
      {
        "id": "story-level2-17-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "How large is the operational territory covered by the RFDS?",
        "options": [
          "Smaller than a city",
          "Larger than Western Europe",
          "The size of an island",
          "Half of a desert"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 מצוין ששטח הפעילות גדול יותר ממערב אירופה (larger than Western Europe).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-18",
    "title": "The Evolution of the Bicycle",
    "hebrewTitle": "תולדות האופניים המודרניים",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "Today, more than one billion bicycles travel city streets, rural roads, and mountain trails worldwide. As an eco-friendly, healthy, and affordable mode of personal transportation, the bicycle seems timeless. However, its development was a long and fascinating journey of trial, error, and mechanical innovation.",
      "The earliest ancestor of the bicycle was invented in Germany in 1817 by Baron Karl von Drais. Dubbed the 'Laufmaschine' (running machine) or 'dandy horse,' it was constructed entirely of wood and lacked pedals, gears, or chains. Riders propelled themselves forward by vigorously kicking their feet against the ground while balancing across a wooden frame.",
      "Decades later, in the 1870s, inventors introduced the 'Penny-Farthing' bicycle. Named after two British coins of vastly different sizes, it featured an enormous front wheel over one meter tall and a tiny rear wheel. Although it allowed riders to travel faster, the design was notoriously dangerous; hitting a small pebble often catapulted the rider headfirst over the handlebars.",
      "The decisive turning point occurred in 1885 with John Kemp Starley's 'Rover Safety Bicycle.' Starley revolutionized cycling by introducing equal-sized wheels, a diamond-shaped steel frame, and a rear-wheel chain drive connected to pedals. Shortly after, Scottish inventor John Boyd Dunlop added air-filled pneumatic rubber tires, providing a smooth and comfortable ride.",
      "The safety bicycle had profound societal consequences, especially for women's rights in the late nineteenth century. Cycling provided women with unprecedented mobility and independence, inspiring more practical clothing reforms and catalyzing the women's suffrage movement. The humble bicycle helped pedal society toward progress."
    ],
    "vocabularyHints": [
      {
        "word": "timeless",
        "translation": "על-זמני"
      },
      {
        "word": "propelled",
        "translation": "הניעו / דחפו"
      },
      {
        "word": "catapulted",
        "translation": "העיף / הטיח קדימה"
      },
      {
        "word": "pneumatic",
        "translation": "פנאומטי (ממולא באוויר דחוס)"
      },
      {
        "word": "unprecedented",
        "translation": "חסר תקדים"
      },
      {
        "word": "suffrage",
        "translation": "זכות בחירה"
      }
    ],
    "questions": [
      {
        "id": "story-level2-18-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Approximately how many bicycles are in use worldwide today?",
        "options": [
          "One million",
          "One hundred million",
          "More than one billion",
          "Ten billion"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 1 כתוב שיש יותר ממיליארד אופניים בשימוש ברחבי העולם (more than one billion).",
        "points": 10
      },
      {
        "id": "story-level2-18-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that lists three positive traits of the bicycle as personal transportation.",
        "correctIndex": 0,
        "targetSentence": "As an eco-friendly, healthy, and affordable mode of personal transportation, the bicycle seems timeless.",
        "explanationHebrew": "המשפט המדויק הוא: As an eco-friendly, healthy, and affordable mode of personal transportation, the bicycle seems timeless.",
        "points": 10
      },
      {
        "id": "story-level2-18-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "How did riders propel the 1817 'Laufmaschine' forward?",
        "correctIndex": 0,
        "modelAnswer": "By vigorously kicking their feet against the ground.",
        "keywords": [
          "kicking",
          "feet",
          "ground",
          "propel"
        ],
        "explanationHebrew": "בפסקה 2 מוסבר שרוכבים דחפו עצמם קדימה באמצעות בעיטות ברגליהם בקרקע.",
        "points": 10
      },
      {
        "id": "story-level2-18-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What essential parts did the earliest bicycle lack?",
        "options": [
          "A seat and handlebars",
          "Pedals, gears, or chains",
          "Wheels",
          "Wood"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהיו חסרים לו דוושות, הילוכים או שרשרת (pedals, gears, or chains).",
        "points": 10
      },
      {
        "id": "story-level2-18-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that explains why the Penny-Farthing bicycle was dangerous.",
        "correctIndex": 0,
        "targetSentence": "Although it allowed riders to travel faster, the design was notoriously dangerous; hitting a small pebble often catapulted the rider headfirst over the handlebars.",
        "explanationHebrew": "המשפט המדויק הוא: Although it allowed riders to travel faster, the design was notoriously dangerous; hitting a small pebble often catapulted the rider headfirst over the handlebars.",
        "points": 10
      },
      {
        "id": "story-level2-18-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What were the sizes of the two wheels on a Penny-Farthing?",
        "correctIndex": 0,
        "modelAnswer": "An enormous front wheel over one meter tall and a tiny rear wheel.",
        "keywords": [
          "enormous front wheel",
          "tiny rear wheel",
          "meter"
        ],
        "explanationHebrew": "בפסקה 3 מתואר גלגל קדמי ענק מעל מטר וגלגל אחורי זעיר.",
        "points": 10
      },
      {
        "id": "story-level2-18-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What features did John Kemp Starley's 'Rover Safety Bicycle' introduce in 1885?",
        "options": [
          "Three wooden wheels",
          "Equal-sized wheels, diamond steel frame, and rear chain drive",
          "A steam motor",
          "Solid iron tires"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב שהאופניים כללו גלגלים שווים, שלדת פלדה בצורת יהלום והנעת שרשרת אחורית.",
        "points": 10
      },
      {
        "id": "story-level2-18-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that tells what John Boyd Dunlop added to the bicycle.",
        "correctIndex": 0,
        "targetSentence": "Shortly after, Scottish inventor John Boyd Dunlop added air-filled pneumatic rubber tires, providing a smooth and comfortable ride.",
        "explanationHebrew": "המשפט המדויק הוא: Shortly after, Scottish inventor John Boyd Dunlop added air-filled pneumatic rubber tires, providing a smooth and comfortable ride.",
        "points": 10
      },
      {
        "id": "story-level2-18-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What social movement did the bicycle help catalyze in the late nineteenth century?",
        "correctIndex": 0,
        "modelAnswer": "The women's rights and women's suffrage movement.",
        "keywords": [
          "women's rights",
          "suffrage",
          "women"
        ],
        "explanationHebrew": "בפסקה 5 מצוין קידום זכויות הנשים ותנועת זכות הבחירה לנשים (women's suffrage movement).",
        "points": 10
      },
      {
        "id": "story-level2-18-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "How did cycling provide independence for women in the 1890s?",
        "options": [
          "It paid them money",
          "It provided unprecedented personal mobility and inspired clothing reforms",
          "It allowed them to fly",
          "It replaced school education"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 מוסבר שהרכיבה העניקה ניידות חסרת תקדים ועודדה רפורמות בלבוש נוח יותר.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-19",
    "title": "Cities Underground: The Subways of the World",
    "hebrewTitle": "ערים מתחת לאדמה: רכבות תחתיות בעולם",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "In the world's most populous metropolises—from Tokyo and London to New York and Paris—millions of people travel every day without ever seeing the sky. Beneath congested avenues and skyscraper foundations lies a labyrinth of high-speed underground transit: the subterranean subway system. Subways form the hidden circulatory system of modern urban civilization.",
      "The world's first underground railway, London's Metropolitan Railway, opened in January 1863. In its earliest days, wooden carriages were hauled by steam-powered locomotives. Because thick coal smoke filled the subterranean tunnels, passengers frequently emerged onto street level covered in black soot. The invention of electric traction in the 1890s revolutionized subways, making tunnels clean, safe, and quiet.",
      "Constructing an underground transit network is an immense engineering triumph. In modern cities, gigantic computerized tunnel boring machines (TBMs) nicknamed 'earth moles' drill deep beneath skyscrapers, water pipes, and riverbeds. These multi-million-dollar machines grind through solid bedrock while simultaneously installing curved concrete segments to reinforce the circular tunnel walls.",
      "Beyond mere transport, subway stations frequently serve as architectural showcases and public art galleries. The Moscow Metro is renowned for its subterranean palaces adorned with crystal chandeliers and marble arches, while Stockholm's 'tunnelbana' features raw exposed bedrock covered in vibrant rainbow murals.",
      "Subways are also among the most eco-friendly transportation solutions available. By moving up to fifty thousand passengers per hour along a single track, electric underground trains remove hundreds of thousands of polluting cars from city roads, drastically reducing urban carbon footprints and traffic gridlock."
    ],
    "vocabularyHints": [
      {
        "word": "circulatory",
        "translation": "מחזורי (כמו מחזור הדם)"
      },
      {
        "word": "soot",
        "translation": "פיח שחור"
      },
      {
        "word": "traction",
        "translation": "הנעה (חשמלית)"
      },
      {
        "word": "boring machines",
        "translation": "מכונות כריית מנהרות"
      },
      {
        "word": "adorned",
        "translation": "מקושט / מעוטר"
      },
      {
        "word": "gridlock",
        "translation": "פקק תנועה כולל / שיתוק תנועה"
      }
    ],
    "questions": [
      {
        "id": "story-level2-19-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What metaphor does the author use for subway systems in modern cities?",
        "options": [
          "A flying carpet",
          "The hidden circulatory system of modern urban civilization",
          "A gold mine",
          "A concrete prison"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שמערכות הרכבת התחתית הן מערכת הדם הנסתרת של הציוויליזציה העירונית (hidden circulatory system).",
        "points": 10
      },
      {
        "id": "story-level2-19-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that lists four famous metropolises with underground systems.",
        "correctIndex": 0,
        "targetSentence": "In the world's most populous metropolises—from Tokyo and London to New York and Paris—millions of people travel every day without ever seeing the sky.",
        "explanationHebrew": "המשפט המדויק הוא: In the world's most populous metropolises—from Tokyo and London to New York and Paris—millions of people travel every day without ever seeing the sky.",
        "points": 10
      },
      {
        "id": "story-level2-19-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "When did the world's first underground railway open in London?",
        "correctIndex": 0,
        "modelAnswer": "It opened in January 1863.",
        "keywords": [
          "January 1863",
          "1863"
        ],
        "explanationHebrew": "בפסקה 2 מצוין ינואר 1863 (January 1863).",
        "points": 10
      },
      {
        "id": "story-level2-19-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "Why were passengers covered in black soot in early London subways?",
        "options": [
          "Passengers carried coal bags",
          "Wooden carriages were hauled by steam locomotives burning coal",
          "The tunnels were on fire",
          "The paint was black"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מוסבר שקטרים מונעי קיטור ופחם מילאו את המנהרות בעשן פיח כבד (steam-powered locomotives).",
        "points": 10
      },
      {
        "id": "story-level2-19-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that nicknames modern tunnel boring machines.",
        "correctIndex": 0,
        "targetSentence": "In modern cities, gigantic computerized tunnel boring machines (TBMs) nicknamed 'earth moles' drill deep beneath skyscrapers, water pipes, and riverbeds.",
        "explanationHebrew": "המשפט המדויק הוא: In modern cities, gigantic computerized tunnel boring machines (TBMs) nicknamed 'earth moles' drill deep beneath skyscrapers, water pipes, and riverbeds.",
        "points": 10
      },
      {
        "id": "story-level2-19-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What do tunnel boring machines install to reinforce circular tunnel walls?",
        "correctIndex": 0,
        "modelAnswer": "They install curved concrete segments.",
        "keywords": [
          "curved",
          "concrete",
          "segments",
          "reinforce"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שהן מתקינות מקטעי בטון מעוקלים לחיזוק הקירות (curved concrete segments).",
        "points": 10
      },
      {
        "id": "story-level2-19-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What famous architectural feature adorns the Moscow Metro stations?",
        "options": [
          "Plastic statues",
          "Crystal chandeliers and marble arches",
          "Glass ceilings open to the sky",
          "Wooden bridges"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב שתחנות המטרו במוסקבה מעוטרות בנברשות קריסטל וקשתות שיש (crystal chandeliers and marble arches).",
        "points": 10
      },
      {
        "id": "story-level2-19-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes Stockholm's subway stations.",
        "correctIndex": 0,
        "targetSentence": "The Moscow Metro is renowned for its subterranean palaces adorned with crystal chandeliers and marble arches, while Stockholm's 'tunnelbana' features raw exposed bedrock covered in vibrant rainbow murals.",
        "explanationHebrew": "המשפט המדויק הוא: The Moscow Metro is renowned for its subterranean palaces adorned with crystal chandeliers and marble arches, while Stockholm's 'tunnelbana' features raw exposed bedrock covered in vibrant rainbow murals.",
        "points": 10
      },
      {
        "id": "story-level2-19-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "How many passengers per hour can an electric subway train move along a single track?",
        "correctIndex": 0,
        "modelAnswer": "Up to fifty thousand passengers per hour.",
        "keywords": [
          "fifty thousand",
          "50,000",
          "passengers"
        ],
        "explanationHebrew": "בפסקה 5 כתוב עד חמישים אלף נוסעים בשעה על מסילה אחת (fifty thousand passengers per hour).",
        "points": 10
      },
      {
        "id": "story-level2-19-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What environmental benefits do subways provide to urban centers?",
        "options": [
          "They generate fresh oxygen underground",
          "They remove polluting cars and reduce carbon footprints and traffic gridlock",
          "They stop earthquakes",
          "They cool down summer temperatures"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שהרכבות התחתיות מסירות מכוניות מזהמות, ומפחיתות פליטות פחמן ופקקי תנועה.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level2-20",
    "title": "Cooking for Astronauts: The Science of Space Food",
    "hebrewTitle": "בישול לאסטרונאוטים: מדע המזון בחלל",
    "level": "Level 2",
    "levelLabel": "רמה 2 - קוראים מתקדמים",
    "levelDescription": "Intermediate level English, expanding vocabulary and comprehension skills.",
    "paragraphs": [
      "Eating a balanced meal in microgravity is vastly more complicated than cooking in a terrestrial kitchen. Aboard the International Space Station (ISS), floating four hundred kilometers above Earth, there is no refrigerator, no stove, and no kitchen sink. Everything that astronauts consume must be scientifically designed to prevent disaster in weightlessness.",
      "The greatest danger during mealtime in orbit is breadcrumbs. In microgravity, loose crumbs do not settle on plates; instead, they float freely through the cabin air. These tiny particles can lodge into delicate computer circuit boards, trigger electrical fires, or be inhaled into an astronaut's lungs. Consequently, NASA replaced traditional bread with soft wheat tortillas in the 1980s.",
      "Space food scientists utilize advanced preservation techniques like freeze-drying. Fresh cooked foods—such as beef stroganoff, macaroni, or scrambled eggs—are rapidly frozen and placed inside a vacuum chamber where all water is extracted as vapor. This preserves ninety-eight percent of nutritional value and allows food packets to remain edible for up to three years at room temperature.",
      "Interestingly, weightlessness alters an astronaut's sense of taste. Without gravity pulling bodily fluids downward, fluids shift upward toward the head, causing nasal congestion similar to having a head cold. As a result, food tastes surprisingly bland in orbit. Astronauts frequently request fiery hot sauces, spicy wasabi, and horseradish to awaken their dull taste buds.",
      "Looking ahead toward multi-year missions to Mars, researchers are experimenting with space hydroponic gardens. Astronauts on the ISS have already harvested and savored fresh space-grown red romaine lettuce and spicy peppers, proving that humans can farm fresh vegetables beyond Earth's atmosphere."
    ],
    "vocabularyHints": [
      {
        "word": "microgravity",
        "translation": "מיקרו-גרביטציה (תנאי חוסר כבידה)"
      },
      {
        "word": "terrestrial",
        "translation": "ארצי / על פני כדור הארץ"
      },
      {
        "word": "freeze-drying",
        "translation": "ייבוש בהקפאה"
      },
      {
        "word": "congestion",
        "translation": "גודש / חסימת אף"
      },
      {
        "word": "hydroponic",
        "translation": "הידרופוני (גידול במים ללא אדמה)"
      },
      {
        "word": "bland",
        "translation": "תפל / חסר טעם"
      }
    ],
    "questions": [
      {
        "id": "story-level2-20-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where does the International Space Station orbit above Earth?",
        "options": [
          "Fifty kilometers",
          "Four hundred kilometers above Earth",
          "One thousand kilometers",
          "Ten thousand kilometers"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שתחנת החלל חגה 400 ק\"מ מעל כדור הארץ (four hundred kilometers above Earth).",
        "points": 10
      },
      {
        "id": "story-level2-20-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that lists everyday kitchen appliances missing in space.",
        "correctIndex": 0,
        "targetSentence": "Aboard the International Space Station (ISS), floating four hundred kilometers above Earth, there is no refrigerator, no stove, and no kitchen sink.",
        "explanationHebrew": "המשפט המדויק הוא: Aboard the International Space Station (ISS), floating four hundred kilometers above Earth, there is no refrigerator, no stove, and no kitchen sink.",
        "points": 10
      },
      {
        "id": "story-level2-20-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What is the greatest danger during mealtime in orbit?",
        "correctIndex": 0,
        "modelAnswer": "The greatest danger during mealtime in orbit is breadcrumbs.",
        "keywords": [
          "breadcrumbs",
          "crumbs",
          "danger"
        ],
        "explanationHebrew": "בפסקה 2 מוסבר שהסכנה הגדולה ביותר היא פירורי לחם (breadcrumbs).",
        "points": 10
      },
      {
        "id": "story-level2-20-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What did NASA replace traditional bread with in the 1980s?",
        "options": [
          "Rice cakes",
          "Soft wheat tortillas",
          "Crackers",
          "Pita bread"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שנאס\"א החליפה לחם בטורטיות חיטה רכות (soft wheat tortillas).",
        "points": 10
      },
      {
        "id": "story-level2-20-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that describes what freeze-drying does to water in cooked food.",
        "correctIndex": 0,
        "targetSentence": "Fresh cooked foods—such as beef stroganoff, macaroni, or scrambled eggs—are rapidly frozen and placed inside a vacuum chamber where all water is extracted as vapor.",
        "explanationHebrew": "המשפט המדויק הוא: Fresh cooked foods—such as beef stroganoff, macaroni, or scrambled eggs—are rapidly frozen and placed inside a vacuum chamber where all water is extracted as vapor.",
        "points": 10
      },
      {
        "id": "story-level2-20-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "For how long can freeze-dried food packets remain edible at room temperature?",
        "correctIndex": 0,
        "modelAnswer": "For up to three years at room temperature.",
        "keywords": [
          "three years",
          "3 years"
        ],
        "explanationHebrew": "בפסקה 3 מצוין שהמזון נשמר ראוי לאכילה עד שלוש שנים בטמפרטורת החדר (up to three years).",
        "points": 10
      },
      {
        "id": "story-level2-20-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "Why does food taste bland to astronauts in space?",
        "options": [
          "Chefs forget to add salt",
          "Bodily fluids shift upward to the head, causing nasal congestion",
          "Astronauts lose their teeth",
          "The space air is too dry"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוסבר שנוזלי הגוף עולים לראש וגורמים לגודש באף בדומה להצטננות (fluids shift upward toward the head).",
        "points": 10
      },
      {
        "id": "story-level2-20-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that lists spicy condiments requested by astronauts.",
        "correctIndex": 0,
        "targetSentence": "Astronauts frequently request fiery hot sauces, spicy wasabi, and horseradish to awaken their dull taste buds.",
        "explanationHebrew": "המשפט המדויק הוא: Astronauts frequently request fiery hot sauces, spicy wasabi, and horseradish to awaken their dull taste buds.",
        "points": 10
      },
      {
        "id": "story-level2-20-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What fresh vegetables have astronauts on the ISS already harvested and eaten?",
        "correctIndex": 0,
        "modelAnswer": "Fresh space-grown red romaine lettuce and spicy peppers.",
        "keywords": [
          "lettuce",
          "peppers",
          "red romaine"
        ],
        "explanationHebrew": "בפסקה 5 מצוינים חסה אדומה ופלפלים חריפים שגודלו בחלל (red romaine lettuce and spicy peppers).",
        "points": 10
      },
      {
        "id": "story-level2-20-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What does the success of space gardens prove for future human missions?",
        "options": [
          "That humans can farm fresh vegetables beyond Earth's atmosphere",
          "That soil is better than water",
          "That Mars has natural farms",
          "That astronauts do not need water"
        ],
        "correctIndex": 0,
        "explanationHebrew": "בסיום נכתב שזה מוכיח שבני אדם מסוגלים לגדל ירקות טריים מעבר לאטמוספרת כדור הארץ.",
        "points": 10
      }
    ],
    "totalPoints": 100
  }
];
