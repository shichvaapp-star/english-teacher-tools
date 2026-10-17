import { MSUnseenStory } from "@/types/unseen";

export const LEVEL_3_UNSEENS: MSUnseenStory[] = [
  {
    "id": "story-level3-1",
    "title": "The Voice of the Whales",
    "hebrewTitle": "שירת הלווייתנים במעמקים",
    "level": "Level 3",
    "levelLabel": "רמה 3 - מתקדמים ודוברי אנגלית",
    "levelDescription": "Challenging texts for fluent English speakers with rich vocabulary and deeper comprehension.",
    "paragraphs": [
      "Whales are some of the largest creatures on Earth, but they are also famous for their incredible songs.  In the deep ocean, blue whales and humpback whales sing complex melodies that can travel for hundreds of kilometers.  These ocean sounds are not random noises; they are structured melodies with repeating patterns.",
      "Scientists believe that whales sing to communicate, find partners, and navigate through the dark waters.  These musical compositions can last for hours, and entire pods of whales sometimes sing the exact same song together.",
      "Interestingly, each group of humpback whales has its own unique song. Over time, these songs change as the whales modify different parts of their melodies. If a humpback whale from a different region joins the group, the others might learn its song and combine it with their own. This shows that whales have a form of cultural learning, similar to how humans share music and languages. Researchers have recorded these vocal changes over decades, mapping how new songs spread across entire oceans from one population to another.",
      "Today, ocean noise from large ships makes it difficult for whales to hear each other.  This noise pollution disrupts their communication and forces them to change their singing patterns.  In some areas, the noise is so loud that whales must sing louder or wait until the ships pass before they can communicate.",
      "Environmental groups are now working to create quieter sea zones to protect these intelligent animals.  They want governments to establish ship speed limits and build quieter boat engines to restore peace to the underwater world."
    ],
    "vocabularyHints": [
      {
        "word": "creatures",
        "translation": "יצורים"
      },
      {
        "word": "navigate",
        "translation": "לנווט"
      },
      {
        "word": "unique",
        "translation": "ייחודי"
      },
      {
        "word": "cultural",
        "translation": "תרבותי"
      },
      {
        "word": "pollution",
        "translation": "זיהום"
      },
      {
        "word": "disrupts",
        "translation": "משבש"
      }
    ],
    "questions": [
      {
        "id": "story-level3-1-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "According to paragraph 1, why do whales sing?",
        "options": [
          "To scare away sharks",
          "To stay warm",
          "To communicate and find partners",
          "To play with dolphins"
        ],
        "correctIndex": 2,
        "explanationHebrew": "נכון מאוד! בפסקה 1 מוסבר שהלווייתנים שרים כדי לתקשר, למצוא בני זוג ולנווט (communicate, find partners, and navigate).",
        "points": 10
      },
      {
        "id": "story-level3-1-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "open",
        "prompt": "According to paragraph 1, how far can the whale songs travel?",
        "correctIndex": 0,
        "modelAnswer": "They can travel for hundreds of kilometers.",
        "keywords": [
          "travel",
          "hundreds",
          "kilometers",
          "hundreds of kilometers"
        ],
        "explanationHebrew": "נכון מאוד! בפסקה 1 נאמר שהשירה שלהם יכולה לנוע לאורך מאות קילומטרים (hundreds of kilometers).",
        "points": 10
      },
      {
        "id": "story-level3-1-q3",
        "number": 3,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that states that these songs are not random noises.",
        "correctIndex": 0,
        "targetSentence": "These ocean sounds are not random noises; they are structured melodies with repeating patterns.",
        "explanationHebrew": "המשפט הנכון הוא: 'These ocean sounds are not random noises; they are structured melodies with repeating patterns.' (קולות האוקיינוס האלה אינם רעשים אקראיים; הם מנגינות מובנות בעלות דפוסים חוזרים).",
        "points": 10
      },
      {
        "id": "story-level3-1-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that lists what happens when a humpback whale from another region joins the group.",
        "correctIndex": 0,
        "targetSentence": "If a humpback whale from a different region joins the group, the others might learn its song and combine it with their own.",
        "explanationHebrew": "המשפט הנכון הוא: 'If a humpback whale from a different region joins the group, the others might learn its song and combine it with their own.' (אם לווייתן מאזור אחר מצטרף לקבוצה, האחרים עשויים ללמוד את שירתו ולשלב אותה בשלהם).",
        "points": 10
      },
      {
        "id": "story-level3-1-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "What does the whales' ability to learn songs from other regions demonstrate?",
        "options": [
          "That they have poor memory",
          "That they have a form of cultural learning",
          "That they prefer swimming alone",
          "That they communicate using echo sounds"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון! היכולת ללמוד שירים חדשים מלווייתנים מאזורים אחרים מראה על למידה תרבותית (cultural learning).",
        "points": 10
      },
      {
        "id": "story-level3-1-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "open",
        "prompt": "According to paragraph 3, how does noise from large ships affect the whales?",
        "correctIndex": 0,
        "modelAnswer": "It disrupts their communication and forces them to change their singing patterns.",
        "keywords": [
          "disrupts",
          "communication",
          "hear each other",
          "singing patterns"
        ],
        "explanationHebrew": "התשובה המוצעת היא שהרעש מפריע לתקשורת שלהם ומאלץ אותם לשנות את דפוסי השירה (disrupts their communication).",
        "points": 10
      },
      {
        "id": "story-level3-1-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What solution do environmental groups suggest to protect the whales from ship noise?",
        "options": [
          "Moving the whales to specialized research aquariums",
          "Building quieter engines and establishing ship speed limits",
          "Cleaning the plastic pollution from the ocean surface",
          "Teaching the whales to sing louder in noisy zones"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! בפסקה 3 כתוב שהם רוצים שהממשלות יקבעו מגבלות מהירות לאוניות ויבנו מנועים שקטים יותר.",
        "points": 10
      },
      {
        "id": "story-level3-1-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is the main purpose of this article?",
        "options": [
          "To compare humpback whales and blue whales",
          "To explain the challenges of modern shipping",
          "To discuss whale communication and the threat of ocean noise",
          "To describe the history of ocean exploration"
        ],
        "correctIndex": 2,
        "explanationHebrew": "כל הכבוד! המאמר עוסק בתקשורת של לווייתנים ובאופן שבו רעש אנושי מאיים עליה.",
        "points": 10
      },
      {
        "id": "story-level3-1-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "Interestingly, each group of humpback whales has its own unique song.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"Interestingly, each group of humpback whales has its own unique song.\"",
        "points": 10
      },
      {
        "id": "story-level3-1-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about the voice of the whales and why it is important.",
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
    "id": "story-level3-2",
    "title": "The Secrets of the Deep Coral Reefs",
    "hebrewTitle": "סודות שוניות האלמוגים העמוקות",
    "level": "Level 3",
    "levelLabel": "רמה 3 - מתקדמים ודוברי אנגלית",
    "levelDescription": "Challenging texts for fluent English speakers with rich vocabulary and deeper comprehension.",
    "paragraphs": [
      "Coral reefs are often called the underwater rainforests of our planet because they support more than twenty-five percent of all marine species, despite occupying less than one percent of the ocean floor.  These fragile marine ecosystems are formed by tiny organisms called coral polyps, which extract calcium carbonate from seawater to construct intricate limestone skeletons over thousands of years.",
      "From microscopic sea anemones to majestic sea turtles, countless marine creatures rely on these colorful structures for food, shelter, and breeding grounds.",
      "In recent decades, rising seawater temperatures caused by global climate change have triggered widespread coral bleaching events worldwide. When water temperatures remain excessively high for extended periods, corals expel the microscopic algae living within their tissues, which provide them with essential nutrients and vibrant pigmentation. Without these vital algae, corals turn completely white, become vulnerable to lethal diseases, and eventually starve to death. Biologists warn that the destruction of coral reefs could devastate coastal fishing industries and eliminate natural storm barriers that protect shores from catastrophic erosion.",
      "To combat this global environmental catastrophe, marine scientists are deploying cutting-edge biological technologies.  In specialized marine laboratories, researchers are successfully breeding 'super corals'—strains genetically adapted to withstand higher thermal thresholds and increased ocean acidification.",
      "Simultaneously, autonomous underwater drones are planting these resilient coral fragments onto damaged natural reefs in the Caribbean and Australia.  Although these scientific breakthroughs offer genuine hope, experts stress that long-term preservation ultimately depends on aggressive worldwide reductions in carbon emissions."
    ],
    "vocabularyHints": [
      {
        "word": "ecosystems",
        "translation": "מערכות אקולוגיות"
      },
      {
        "word": "intricate",
        "translation": "מורכב / סבוך"
      },
      {
        "word": "bleaching",
        "translation": "הלבנה (של אלמוגים)"
      },
      {
        "word": "pigmentation",
        "translation": "פיגמנטציה / צבעוניות"
      },
      {
        "word": "resilient",
        "translation": "עמיד / בעל כושר התאוששות"
      }
    ],
    "questions": [
      {
        "id": "story-level3-2-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that explains why coral reefs are called the underwater rainforests of our planet.",
        "correctIndex": 0,
        "targetSentence": "Coral reefs are often called the underwater rainforests of our planet because they support more than twenty-five percent of all marine species, despite occupying less than one percent of the ocean floor.",
        "explanationHebrew": "המשפט הנכון הוא: 'Coral reefs are often called the underwater rainforests of our planet because they support more than twenty-five percent of all marine species, despite occupying less than one percent of the ocean floor.' (שוניות אלמוגים מכונות לעתים קרובות יערות הגשם התת-ימיים כי הן תומכות ביותר מ-25% מכלל המינים הימיים).",
        "points": 10
      },
      {
        "id": "story-level3-2-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "open",
        "prompt": "What mineral do coral polyps extract from seawater to build their skeletons?",
        "correctIndex": 0,
        "modelAnswer": "They extract calcium carbonate.",
        "keywords": [
          "calcium carbonate",
          "carbonate",
          "calcium"
        ],
        "explanationHebrew": "נכון מאוד! הפוליפים מפיקים סידן פחמתי (calcium carbonate) ממי הים.",
        "points": 10
      },
      {
        "id": "story-level3-2-q3",
        "number": 3,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "According to paragraph 2, what causes corals to expel their microscopic algae?",
        "options": [
          "Attacks by predatory sharks",
          "Rising seawater temperatures caused by climate change",
          "Excessive salt in deep waters",
          "A lack of ocean waves"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! בפסקה 2 מוסבר שטמפרטורות מים גבוהות הנגרמות עקב שינויי אקלים מובילות לתופעה זו.",
        "points": 10
      },
      {
        "id": "story-level3-2-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence describing what happens to corals when they lose their algae.",
        "correctIndex": 0,
        "targetSentence": "Without these vital algae, corals turn completely white, become vulnerable to lethal diseases, and eventually starve to death.",
        "explanationHebrew": "המשפט הנכון הוא: 'Without these vital algae, corals turn completely white, become vulnerable to lethal diseases, and eventually starve to death.' (ללא האצות החיוניות האלה, האלמוגים מלבינים לחלוטין, הופכים פגיעים למחלות קטלניות ובסופו של דבר גוועים ברעב).",
        "points": 10
      },
      {
        "id": "story-level3-2-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "Name one severe consequence of reef destruction mentioned at the end of paragraph 2.",
        "correctIndex": 0,
        "modelAnswer": "It could devastate coastal fishing industries or eliminate natural storm barriers.",
        "keywords": [
          "fishing industries",
          "fishing",
          "storm barriers",
          "erosion",
          "shores"
        ],
        "explanationHebrew": "התשובה המוצעת היא פגיעה קשה בענף הדיג החופי או אובדן מחסומי סערה טבעיים המגנים על החופים.",
        "points": 10
      },
      {
        "id": "story-level3-2-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What are 'super corals' developed in laboratories?",
        "options": [
          "Corals that produce electric light",
          "Strains adapted to withstand higher temperatures and acidification",
          "Artificial plastic corals designed for aquariums",
          "Corals that can live outside of water"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון! 'סופר אלמוגים' הם זנים המותאמים לעמוד בטמפרטורות גבוהות יותר ובחומציות אוקיינוס מוגברת.",
        "points": 10
      },
      {
        "id": "story-level3-2-q7",
        "number": 7,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What do experts emphasize is ultimately required for the long-term survival of coral reefs?",
        "correctIndex": 0,
        "modelAnswer": "Aggressive worldwide reductions in carbon emissions.",
        "keywords": [
          "carbon emissions",
          "reductions",
          "carbon",
          "emissions"
        ],
        "explanationHebrew": "נכון מאוד! בפסקה 3 מודגש שהשימור לטווח ארוך תלוי בהפחתה עולמית אגרסיבית של פליטות פחמן.",
        "points": 10
      },
      {
        "id": "story-level3-2-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is the primary theme of this passage?",
        "options": [
          "The critical ecological importance of coral reefs, their existential threats, and restoration efforts",
          "The history of recreational scuba diving in the Caribbean",
          "How microscopic sea turtles hunt for food in deep trenches",
          "A comparison of freshwater lakes and tropical oceans"
        ],
        "correctIndex": 0,
        "explanationHebrew": "כל הכבוד! הטקסט מפרט על חשיבות השוניות, האיומים החמורים עליהן והטכנולוגיות המפותחות לשיקומן.",
        "points": 10
      },
      {
        "id": "story-level3-2-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "In recent decades, rising seawater temperatures caused by global climate change have triggered widespread coral bleaching events worldwide.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"In recent decades, rising seawater temperatures caused by global climate change have triggered widespread coral bleaching events worldwide.\"",
        "points": 10
      },
      {
        "id": "story-level3-2-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about the secrets of the deep coral reefs and why it is important.",
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
    "id": "story-level3-3",
    "title": "The Rediscovery of the Rosetta Stone",
    "hebrewTitle": "גילוי אבן הרוזטה מחדש",
    "level": "Level 3",
    "levelLabel": "רמה 3 - מתקדמים ודוברי אנגלית",
    "levelDescription": "Challenging texts for fluent English speakers with rich vocabulary and deeper comprehension.",
    "paragraphs": [
      "For more than a thousand years, the mysterious hieroglyphic inscriptions covering the monumental tombs and temples of ancient Egypt remained completely unreadable to historians.  The ancient writing system had vanished around the fourth century CE, taking centuries of pharaonic history, religious literature, and scientific knowledge with it into silence.",
      "Scholars across Europe attempted to decipher the elaborate animal and geometric symbols, but without a bilingual reference key, their translations were little more than speculative guesswork and romantic mythology.",
      "Everything changed in July 1799 during Napoleon Bonaparte's military expedition to Egypt. While rebuilding an old Ottoman fortification near the port town of Rashid—known to Europeans as Rosetta—French soldiers unearthed a massive slab of black granodiorite covered with dense carved text. The artifact, later known as the Rosetta Stone, featured an official decree issued in 196 BCE by King Ptolemy V. Crucially, the decree was inscribed in three distinct scripts: ancient Egyptian hieroglyphs for sacred texts, Demotic script for everyday administrative affairs, and ancient Greek, which scholars could easily read and comprehend.",
      "The presence of identical content in three different scripts provided the linguistic bridge scholars desperately needed.  In 1822, brilliant French linguist Jean-François Champollion made the crucial breakthrough by realizing that hieroglyphic signs were not purely symbolic pictures, but rather phonetic symbols representing spoken sounds and syllables.",
      "By comparing the Greek name 'Ptolemy' with the royal cartouche on the stone, Champollion cracked the ancient code.  His monumental achievement unlocked thousands of years of recorded Egyptian civilization, revolutionizing the modern field of Egyptology forever."
    ],
    "vocabularyHints": [
      {
        "word": "inscriptions",
        "translation": "כתובות חקוקות"
      },
      {
        "word": "decipher",
        "translation": "לפענח"
      },
      {
        "word": "decree",
        "translation": "צו / פקודה מלכותית"
      },
      {
        "word": "phonetic",
        "translation": "פונטי (של צלילי דיבור)"
      },
      {
        "word": "cartouche",
        "translation": "כרטוש (טבעת עם שם מלך)"
      }
    ],
    "questions": [
      {
        "id": "story-level3-3-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that states when the ancient Egyptian writing system disappeared.",
        "correctIndex": 0,
        "targetSentence": "The ancient writing system had vanished around the fourth century CE, taking centuries of pharaonic history, religious literature, and scientific knowledge with it into silence.",
        "explanationHebrew": "המשפט הנכון הוא: 'The ancient writing system had vanished around the fourth century CE, taking centuries of pharaonic history, religious literature, and scientific knowledge with it into silence.' (שיטת הכתב העתיקה נעלמה בסביבות המאה הרביעית לספירה).",
        "points": 10
      },
      {
        "id": "story-level3-3-q2",
        "number": 2,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "Why were early European attempts to translate hieroglyphs unsuccessful?",
        "correctIndex": 0,
        "modelAnswer": "Because they lacked a bilingual reference key and relied on speculative guesswork.",
        "keywords": [
          "reference key",
          "bilingual",
          "guesswork",
          "key"
        ],
        "explanationHebrew": "התשובה היא שלא היה בידם מפתח השוואתי דו-לשוני והם הסתמכו על ניחושים ספקולטיביים.",
        "points": 10
      },
      {
        "id": "story-level3-3-q3",
        "number": 3,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "When and where was the Rosetta Stone unearthed?",
        "options": [
          "In 1922 in King Tutankhamun's tomb",
          "In July 1799 near the port town of Rashid (Rosetta)",
          "In 1805 in the city of Alexandria",
          "In 1822 in the Louvre Museum in Paris"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! בפסקה 2 כתוב שהאבן נחשפה ביולי 1799 ליד העיירה ראשיד/רוזטה.",
        "points": 10
      },
      {
        "id": "story-level3-3-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "Which of the three scripts on the Rosetta Stone could scholars already read fluently?",
        "correctIndex": 0,
        "modelAnswer": "Ancient Greek.",
        "keywords": [
          "Greek",
          "ancient Greek"
        ],
        "explanationHebrew": "נכון מאוד! החוקרים ידעו לקרוא ולהבין יוונית עתיקה (ancient Greek).",
        "points": 10
      },
      {
        "id": "story-level3-3-q5",
        "number": 5,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What fundamental insight did Jean-François Champollion have in 1822?",
        "options": [
          "That hieroglyphs were only used as mathematical numbers",
          "That hieroglyphs functioned as phonetic symbols representing sounds and syllables",
          "That the text was a magical recipe for embalming mummies",
          "That ancient Egyptians copied Greek letters"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון! שמפוליון הבין שכתב החרטומים אינו ציורים סמליים בלבד, אלא סימנים פונטיים המייצגים צלילים והברות.",
        "points": 10
      },
      {
        "id": "story-level3-3-q6",
        "number": 6,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "copy",
        "prompt": "Copy the sentence describing how Champollion cracked the ancient code using a Greek royal name.",
        "correctIndex": 0,
        "targetSentence": "By comparing the Greek name 'Ptolemy' with the royal cartouche on the stone, Champollion cracked the ancient code.",
        "explanationHebrew": "המשפט הנכון הוא: 'By comparing the Greek name 'Ptolemy' with the royal cartouche on the stone, Champollion cracked the ancient code.' (באמצעות השוואת השם היווני 'תלמי' עם הכרטוש המלכותי שעל האבן, פיצח שמפוליון את הצופן העתיק).",
        "points": 10
      },
      {
        "id": "story-level3-3-q7",
        "number": 7,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What major academic field was revolutionized by the decipherment of the stone?",
        "correctIndex": 0,
        "modelAnswer": "The modern field of Egyptology.",
        "keywords": [
          "Egyptology",
          "modern Egyptology"
        ],
        "explanationHebrew": "נכון מאוד! ההישג חולל מהפכה בתחום האגיפטולוגיה המודרנית (Egyptology).",
        "points": 10
      },
      {
        "id": "story-level3-3-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is the overarching subject of this historical article?",
        "options": [
          "How the discovery and linguistic analysis of the Rosetta Stone unlocked ancient Egyptian history",
          "The military campaigns and victories of Napoleon Bonaparte in the Middle East",
          "The religious ceremonies of King Ptolemy V in ancient Alexandria",
          "How modern stone carvers replicate ancient museum artifacts"
        ],
        "correctIndex": 0,
        "explanationHebrew": "כל הכבוד! המאמר עוסק בגילוי אבן רוזטה ופיצוחה הלשוני שפתח צוהר להיסטוריה של מצרים העתיקה.",
        "points": 10
      },
      {
        "id": "story-level3-3-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "Everything changed in July 1799 during Napoleon Bonaparte's military expedition to Egypt.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"Everything changed in July 1799 during Napoleon Bonaparte's military expedition to Egypt.\"",
        "points": 10
      },
      {
        "id": "story-level3-3-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about the rediscovery of the rosetta stone and why it is important.",
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
    "id": "story-level3-4",
    "title": "The Revolution of Bionic Prosthetics",
    "hebrewTitle": "מהפכת האיברים הביוניים",
    "level": "Level 3",
    "levelLabel": "רמה 3 - מתקדמים ודוברי אנגלית",
    "levelDescription": "Challenging texts for fluent English speakers with rich vocabulary and deeper comprehension.",
    "paragraphs": [
      "Throughout human history, artificial limbs were essentially passive mechanical tools, ranging from ancient wooden pegs to heavy metal hooks that offered minimal functional mobility.  While these rudimentary devices helped individuals maintain balance or perform basic physical tasks, they lacked any connection to the human nervous system and could not convey sensory feedback.",
      "Consequently, amputees frequently felt disconnected from their artificial limbs, struggling with awkward coordination and severe physical exhaustion during routine daily activities.",
      "In recent years, remarkable convergences between neural engineering, microelectronics, and artificial intelligence have dramatically transformed the landscape of prosthetic medicine. Modern bionic limbs utilize sophisticated myoelectric sensors implanted directly into residual muscle fibers to detect minute electrical impulses sent by the user's brain. Powerful microprocessors then decode these neural signals in real time, translating human thoughts into fluid, natural finger movements within milliseconds. Users can now grasp delicate objects like raw eggs or type smoothly on computer keyboards with astonishing dexterity.",
      "The most revolutionary breakthrough in modern bionic research is targeted sensory reinnervation, which restores the fundamental sensation of physical touch.  By embedding microscopic pressure sensors into synthetic fingertips and routing feedback signals back to remaining sensory nerves, scientists allow amputees to perceive surface textures, temperature variations, and pressure levels with their eyes closed.",
      "As neuro-prosthetic technology continues to advance rapidly, the distinction between biological human anatomy and artificial robotic augmentation is becoming increasingly indistinguishable, promising unprecedented quality of life for millions worldwide."
    ],
    "vocabularyHints": [
      {
        "word": "prosthetic",
        "translation": "תותב / איבר מלאכותי"
      },
      {
        "word": "rudimentary",
        "translation": "בסיסי ביותר / פרימיטיבי"
      },
      {
        "word": "dexterity",
        "translation": "מיומנות ידנית / זריזות כפיים"
      },
      {
        "word": "reinnervation",
        "translation": "חידוש עצבי"
      },
      {
        "word": "augmentation",
        "translation": "שדרוג / תגבור"
      }
    ],
    "questions": [
      {
        "id": "story-level3-4-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence describing how artificial limbs were historically constructed.",
        "correctIndex": 0,
        "targetSentence": "Throughout human history, artificial limbs were essentially passive mechanical tools, ranging from ancient wooden pegs to heavy metal hooks that offered minimal functional mobility.",
        "explanationHebrew": "המשפט הנכון הוא: 'Throughout human history, artificial limbs were essentially passive mechanical tools, ranging from ancient wooden pegs to heavy metal hooks that offered minimal functional mobility.' (לאורך ההיסטוריה, איברים מלאכותיים היו כלים מכניים פסיביים מיתדות עץ ועד ווי מתכת).",
        "points": 10
      },
      {
        "id": "story-level3-4-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "open",
        "prompt": "What critical connection did early prosthetic devices completely lack?",
        "correctIndex": 0,
        "modelAnswer": "They lacked any connection to the human nervous system.",
        "keywords": [
          "nervous system",
          "connection",
          "sensory feedback"
        ],
        "explanationHebrew": "נכון מאוד! הם חסרו כל חיבור למערכת העצבים האנושית (human nervous system).",
        "points": 10
      },
      {
        "id": "story-level3-4-q3",
        "number": 3,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "What do modern myoelectric sensors detect?",
        "options": [
          "External sound vibrations",
          "Minute electrical impulses sent by the user's brain to muscles",
          "Changes in room temperature",
          "Sunlight reflection on the prosthetic surface"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון! החיישנים מזהים אותות חשמליים זעירים הנשלחים ממוח המשתמש לשרירים הנותרים.",
        "points": 10
      },
      {
        "id": "story-level3-4-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "Name one delicate action users can now perform with modern bionic hands.",
        "correctIndex": 0,
        "modelAnswer": "Grasp delicate objects like raw eggs or type on keyboards.",
        "keywords": [
          "raw eggs",
          "eggs",
          "type",
          "keyboard",
          "keyboards"
        ],
        "explanationHebrew": "התשובה המוצעת היא אחיזת חפצים עדינים כמו ביצים לא מבושלות או הקלדה חלקה על מקלדת.",
        "points": 10
      },
      {
        "id": "story-level3-4-q5",
        "number": 5,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that identifies the most revolutionary breakthrough in modern bionic research.",
        "correctIndex": 0,
        "targetSentence": "The most revolutionary breakthrough in modern bionic research is targeted sensory reinnervation, which restores the fundamental sensation of physical touch.",
        "explanationHebrew": "המשפט הנכון הוא: 'The most revolutionary breakthrough in modern bionic research is targeted sensory reinnervation, which restores the fundamental sensation of physical touch.' (פריצת הדרך המהפכנית ביותר במחקר ביוני מודרני היא חידוש תחושתי ממוקד, המשחזר את תחושת המגע הפיזי הבסיסית).",
        "points": 10
      },
      {
        "id": "story-level3-4-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What can amputees perceive even with their eyes closed thanks to sensory feedback?",
        "options": [
          "Colors of nearby walls",
          "Surface textures, temperature variations, and pressure levels",
          "Radio signals emitted by cellphones",
          "The chemical composition of metal objects"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! הם יכולים לחוש במרקמי משטח, שינויי טמפרטורה ועוצמות לחץ בעיניים עצומות.",
        "points": 10
      },
      {
        "id": "story-level3-4-q7",
        "number": 7,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "According to the final sentence, what two domains are becoming increasingly indistinguishable?",
        "correctIndex": 0,
        "modelAnswer": "Biological human anatomy and artificial robotic augmentation.",
        "keywords": [
          "anatomy",
          "biological",
          "robotic",
          "augmentation"
        ],
        "explanationHebrew": "נכון! הגבול בין אנטומיה אנושית ביולוגית לבין שדרוג רובוטי מלאכותי הופך למטושטש וכמעט בלתי ניתן להבדלה.",
        "points": 10
      },
      {
        "id": "story-level3-4-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is the central focus of this scientific text?",
        "options": [
          "The evolution of bionic prosthetics from passive tools to brain-controlled, sensory-restoring limbs",
          "The historical use of wooden crutches in ancient civil wars",
          "How microprocessors are manufactured in industrial chip factories",
          "The reasons why athletes choose not to use robotic assistance"
        ],
        "correctIndex": 0,
        "explanationHebrew": "כל הכבוד! המאמר מציג את המהפכה המדעית באיברים הביוניים – מכלים פסיביים לאיברים מתקדמים הנשלטים על ידי המוח ובעלי חוש מגע.",
        "points": 10
      },
      {
        "id": "story-level3-4-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "In recent years, remarkable convergences between neural engineering, microelectronics, and artificial intelligence have dramatically transformed the landscape of prosthetic medicine.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"In recent years, remarkable convergences between neural engineering, microelectronics, and artificial intelligence have dramatically transformed the landscape of prosthetic medicine.\"",
        "points": 10
      },
      {
        "id": "story-level3-4-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about the revolution of bionic prosthetics and why it is important.",
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
    "id": "story-level3-5",
    "title": "Autonomous Exploration of Mars",
    "hebrewTitle": "חקר מאדים בעזרת רובוטים אוטונומיים",
    "level": "Level 3",
    "levelLabel": "רמה 3 - מתקדמים ודוברי אנגלית",
    "levelDescription": "Challenging texts for fluent English speakers with rich vocabulary and deeper comprehension.",
    "paragraphs": [
      "Exploring the harsh, frozen surface of Mars represents one of humanity's most ambitious scientific endeavors.  Located tens of millions of kilometers away from Earth, the Red Planet possesses an atmosphere composed primarily of carbon dioxide with less than one percent of Earth's atmospheric pressure.",
      "The extreme distance creates a communication delay of up to twenty minutes each way for radio transmissions.  Because instantaneous remote control from NASA mission headquarters is physically impossible, Martian robotic explorers must rely heavily on advanced artificial intelligence and autonomous navigation systems to survive.",
      "NASA's Perseverance rover exemplifies this new generation of autonomous planetary explorers. Equipped with nineteen high-resolution cameras, an intricate robotic arm, and sophisticated laser spectrometers, the rover traverses treacherous rocky terrain without direct human guidance. Perseverance's onboard supercomputers continuously analyze surrounding topography, identify hazardous obstacles, and calculate optimal driving paths independently. Furthermore, the rover carried Ingenuity, a tiny robotic helicopter that achieved the historic milestone of powered, controlled flight in the extremely thin atmosphere of another planet.",
      "The primary scientific objective of the Mars mission is astrobiology: searching for definitive biosignatures that might prove microscopic microbial life once existed in ancient Martian lakes.  Perseverance has been systematically drilling rock cores in Jezero Crater, an ancient river delta that held liquid water billions of years ago.",
      "These hermetically sealed geological samples are placed inside titanium tubes and deposited on the planet's surface.  Future international missions are currently being engineered to retrieve these precious Martian samples and return them safely to Earth for exhaustive laboratory analysis."
    ],
    "vocabularyHints": [
      {
        "word": "atmospheric pressure",
        "translation": "לחץ אטמוספרי"
      },
      {
        "word": "spectrometers",
        "translation": "ספקטרומטרים (מכשירי ניתוח אור)"
      },
      {
        "word": "astrobiology",
        "translation": "אסטרוביולוגיה (חקר חיים בחלל)"
      },
      {
        "word": "biosignatures",
        "translation": "סמנים ביולוגיים (עקבות חיים)"
      },
      {
        "word": "hermetically",
        "translation": "באופן הרמטי (אטום לחלוטין)"
      }
    ],
    "questions": [
      {
        "id": "story-level3-5-q1",
        "number": 1,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "How long can the one-way communication delay between Earth and Mars be?",
        "correctIndex": 0,
        "modelAnswer": "It can be up to twenty minutes each way.",
        "keywords": [
          "twenty minutes",
          "20 minutes",
          "minutes"
        ],
        "explanationHebrew": "נכון מאוד! עיכוב התקשורת החד-כיווני יכול להגיע לעד עשרים דקות (twenty minutes).",
        "points": 10
      },
      {
        "id": "story-level3-5-q2",
        "number": 2,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "copy",
        "prompt": "Copy the sentence that explains why Martian robotic explorers must rely on artificial intelligence.",
        "correctIndex": 0,
        "targetSentence": "Because instantaneous remote control from NASA mission headquarters is physically impossible, Martian robotic explorers must rely heavily on advanced artificial intelligence and autonomous navigation systems to survive.",
        "explanationHebrew": "המשפט הנכון הוא: 'Because instantaneous remote control from NASA mission headquarters is physically impossible, Martian robotic explorers must rely heavily on advanced artificial intelligence and autonomous navigation systems to survive.' (מכיוון ששליטה מיידית מרחוק ממפקדת נאס\"א אינה אפשרית פיזית, רובוטי החקר חייבים להסתמך רבות על בינה מלאכותית ומערכות ניווט אוטונומיות).",
        "points": 10
      },
      {
        "id": "story-level3-5-q3",
        "number": 3,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "How many high-resolution cameras is the Perseverance rover equipped with?",
        "options": [
          "Five cameras",
          "Twelve cameras",
          "Nineteen cameras",
          "Fifty cameras"
        ],
        "correctIndex": 2,
        "explanationHebrew": "נכון מאוד! בפסקה 2 מצוין שהרובר מצויד ב-19 מצלמות ברזולוציה גבוהה (nineteen high-resolution cameras).",
        "points": 10
      },
      {
        "id": "story-level3-5-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What historic aviation milestone did the Ingenuity helicopter achieve?",
        "correctIndex": 0,
        "modelAnswer": "Powered, controlled flight in the extremely thin atmosphere of another planet.",
        "keywords": [
          "flight",
          "controlled flight",
          "powered flight",
          "atmosphere"
        ],
        "explanationHebrew": "התשובה היא טיסה ממונעת ומבוקרת באטמוספירה הדלילה של כוכב לכת אחר.",
        "points": 10
      },
      {
        "id": "story-level3-5-q5",
        "number": 5,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What is the primary scientific objective of the Perseverance mission?",
        "options": [
          "Building permanent human colonies on Mars",
          "Mining gold and diamond deposits in craters",
          "Astrobiology: searching for biosignatures of ancient microbial life",
          "Testing space weapons in extreme vacuum conditions"
        ],
        "correctIndex": 2,
        "explanationHebrew": "נכון! המטרה הראשית היא אסטרוביולוגיה – חיפוש סמנים ביולוגיים לקיום חיים חיידקיים בעבר.",
        "points": 10
      },
      {
        "id": "story-level3-5-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes where Perseverance has been drilling rock cores.",
        "correctIndex": 0,
        "targetSentence": "Perseverance has been systematically drilling rock cores in Jezero Crater, an ancient river delta that held liquid water billions of years ago.",
        "explanationHebrew": "המשפט הנכון הוא: 'Perseverance has been systematically drilling rock cores in Jezero Crater, an ancient river delta that held liquid water billions of years ago.' (פרסווירנס קודח באופן שיטתי ליבות סלע במכתש ג'זרו, דלתת נהר עתיקה שהכילה מים נוזליים לפני מיליארדי שנים).",
        "points": 10
      },
      {
        "id": "story-level3-5-q7",
        "number": 7,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What are future international missions being engineered to do with the rock samples?",
        "correctIndex": 0,
        "modelAnswer": "To retrieve the samples and return them safely to Earth for laboratory analysis.",
        "keywords": [
          "retrieve",
          "return",
          "Earth",
          "laboratory"
        ],
        "explanationHebrew": "נכון מאוד! המשימות העתידיות מתוכננות לאסוף את דגימות הסלע ולהחזירן לכדור הארץ לניתוח מעבדתי מקיף.",
        "points": 10
      },
      {
        "id": "story-level3-5-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is the main subject of this scientific passage?",
        "options": [
          "The cutting-edge autonomous technology and astrobiological goals of the Mars Perseverance mission",
          "The commercial tourism plans to land civilians on Mars by 2030",
          "How radio signals travel through empty interstellar space",
          "A comparison of gravity on the Moon versus gravity on Mars"
        ],
        "correctIndex": 0,
        "explanationHebrew": "מצוין! המאמר מפרט על הטכנולוגיה האוטונומית החדשנית ועל מטרות החקר האסטרוביולוגיות של הרובר פרסווירנס במאדים.",
        "points": 10
      },
      {
        "id": "story-level3-5-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "NASA's Perseverance rover exemplifies this new generation of autonomous planetary explorers.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"NASA's Perseverance rover exemplifies this new generation of autonomous planetary explorers.\"",
        "points": 10
      },
      {
        "id": "story-level3-5-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about autonomous exploration of mars and why it is important.",
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
    "id": "story-level3-6",
    "title": "Hydrothermal Vents and Alien Deep-Sea Life",
    "hebrewTitle": "נביעות הידרותרמיות וחיים במעמקי הים",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "Until the late 1970s, marine biologists universally believed that all complex life on Earth fundamentally depended on solar energy through photosynthesis. That long-standing scientific dogma was permanently shattered in 1977, when oceanographers aboard the research submersible Alvin descended two and a half kilometers beneath the Pacific Ocean near the Galapagos Rift. In perpetual darkness and crushing water pressure, they encountered towering mineral chimneys spewing scalding black fluid, surrounded by dense, thriving biological communities.",
      "These volcanic structures, known as hydrothermal vents or 'black smokers,' occur along tectonic plate boundaries where seawater seeps deep into the oceanic crust. Superheated by molten magma to temperatures exceeding four hundred degrees Celsius, the acidic fluid dissolves rich minerals, including iron, copper, and sulfur. When this boiling mixture erupts back into freezing ocean water, the minerals precipitate instantaneously, forming immense chimney towers that resemble underwater industrial factories.",
      "Remarkably, life flourishes around these vents without a single photon of sunlight. The foundation of this unique food web is chemosynthesis, a biological process carried out by specialized extremophile bacteria. Instead of harnessing sunlight, these bacteria oxidize toxic hydrogen sulfide compounds emitting from the vents, converting chemical energy into nutritious organic carbohydrates.",
      "Among the most extraordinary creatures thriving in these toxic oases are giant tube worms (Riftia pachyptila), which can grow up to two and a half meters in length. These bizarre organisms possess neither mouth, gut, nor digestive tract. Instead, their blood-red feathery plumes absorb hydrogen sulfide and oxygen from the water, feeding billions of symbiotic bacteria residing inside a specialized internal organ called the trophosome.",
      "The discovery of hydrothermal vent ecosystems has revolutionized astrobiology, transforming our search for extraterrestrial life. Planetary scientists now hypothesize that similar geothermal vents may exist beneath the icy crusts of Jupiter's moon Europa and Saturn's moon Enceladus, where subterranean oceans could harbor alien microbial biospheres independent of direct starlight."
    ],
    "vocabularyHints": [
      {
        "word": "dogma",
        "translation": "דוגמה (אמונה מקובלת שאינה מוטלת בספק)"
      },
      {
        "word": "perpetual",
        "translation": "נצחי / תמידי"
      },
      {
        "word": "chemosynthesis",
        "translation": "כמוסינתזה (הפקת אנרגיה מחומרים כימיים)"
      },
      {
        "word": "extremophile",
        "translation": "אקסטרמופיל (יצור החי בתנאים קיצוניים)"
      },
      {
        "word": "symbiotic",
        "translation": "סימביוטי (של שיתוף פעולה הדדי)"
      },
      {
        "word": "astrobiology",
        "translation": "אסטרוביולוגיה (חקר חיים ביקום)"
      }
    ],
    "questions": [
      {
        "id": "story-level3-6-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What long-standing scientific belief was shattered by the 1977 Alvin expedition?",
        "options": [
          "That the ocean had no bottom",
          "That all complex life fundamentally depended on solar energy and photosynthesis",
          "That underwater volcanoes did not exist",
          "That water pressure increases with depth"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 מוסבר שהאמונה שכל החיים המורכבים תלויים באור השמש ובפוטוסינתזה התנפצה (fundamentally depended on solar energy through photosynthesis).",
        "points": 10
      },
      {
        "id": "story-level3-6-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes what scientists encountered at the bottom of the Pacific Ocean.",
        "correctIndex": 0,
        "targetSentence": "In perpetual darkness and crushing water pressure, they encountered towering mineral chimneys spewing scalding black fluid, surrounded by dense, thriving biological communities.",
        "explanationHebrew": "המשפט המדויק הוא: In perpetual darkness and crushing water pressure, they encountered towering mineral chimneys spewing scalding black fluid, surrounded by dense, thriving biological communities.",
        "points": 10
      },
      {
        "id": "story-level3-6-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "To what temperature is the fluid superheated by molten magma?",
        "correctIndex": 0,
        "modelAnswer": "To temperatures exceeding four hundred degrees Celsius.",
        "keywords": [
          "four hundred",
          "400",
          "Celsius",
          "degrees"
        ],
        "explanationHebrew": "בפסקה 2 כתוב שהנוזל מתחמם לטמפרטורה העולה על 400 מעלות צלזיוס (exceeding four hundred degrees Celsius).",
        "points": 10
      },
      {
        "id": "story-level3-6-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "Why do mineral chimney towers form when vent fluid erupts into the ocean?",
        "options": [
          "Magma instantly freezes into solid rock",
          "Dissolved minerals precipitate instantaneously upon contacting freezing ocean water",
          "Tube worms build them using mud",
          "Underwater winds pile up sulfur"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מוסבר שהמינרלים המומסים שוקעים באופן מיידי במפגש עם מי האוקיינוס הקפואים (minerals precipitate instantaneously).",
        "points": 10
      },
      {
        "id": "story-level3-6-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that defines the chemical process at the base of the vent food web.",
        "correctIndex": 0,
        "targetSentence": "Instead of harnessing sunlight, these bacteria oxidize toxic hydrogen sulfide compounds emitting from the vents, converting chemical energy into nutritious organic carbohydrates.",
        "explanationHebrew": "המשפט המדויק הוא: Instead of harnessing sunlight, these bacteria oxidize toxic hydrogen sulfide compounds emitting from the vents, converting chemical energy into nutritious organic carbohydrates.",
        "points": 10
      },
      {
        "id": "story-level3-6-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What is the biological process called that extremophile bacteria carry out without sunlight?",
        "correctIndex": 0,
        "modelAnswer": "The process is called chemosynthesis.",
        "keywords": [
          "chemosynthesis"
        ],
        "explanationHebrew": "בפסקה 3 מצוין התהליך הביולוגי: כמוסינתזה (chemosynthesis).",
        "points": 10
      },
      {
        "id": "story-level3-6-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What organs do giant tube worms lack?",
        "options": [
          "Blood vessels and skin",
          "Mouth, gut, and digestive tract",
          "Reproductive cells",
          "Nerves and muscle tissue"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב שליצורים אלו אין פה, מעיים או מערכת עיכול (neither mouth, gut, nor digestive tract).",
        "points": 10
      },
      {
        "id": "story-level3-6-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that names the internal organ where symbiotic bacteria reside.",
        "correctIndex": 0,
        "targetSentence": "Instead, their blood-red feathery plumes absorb hydrogen sulfide and oxygen from the water, feeding billions of symbiotic bacteria residing inside a specialized internal organ called the trophosome.",
        "explanationHebrew": "המשפט המדויק הוא: Instead, their blood-red feathery plumes absorb hydrogen sulfide and oxygen from the water, feeding billions of symbiotic bacteria residing inside a specialized internal organ called the trophosome.",
        "points": 10
      },
      {
        "id": "story-level3-6-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "Which two celestial moons are hypothesized to possibly harbor geothermal vents?",
        "correctIndex": 0,
        "modelAnswer": "Jupiter's moon Europa and Saturn's moon Enceladus.",
        "keywords": [
          "Europa",
          "Enceladus",
          "Jupiter",
          "Saturn"
        ],
        "explanationHebrew": "בפסקה 5 מצוינים הירח אירופה של צדק והירח אנקלדוס של שבתאי (Europa and Enceladus).",
        "points": 10
      },
      {
        "id": "story-level3-6-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "How did the discovery of hydrothermal vents transform the search for alien life?",
        "options": [
          "It proved alien spaceships crashed in the ocean",
          "It demonstrated life can thrive independently of starlight in subterranean oceans",
          "It proved that planets must have oxygen atmospheres",
          "It showed that alien life cannot exist in cold environments"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שהגילוי הוכיח שחיים מסוגלים לשגשג באוקיינוסים תת-קרקעיים ללא תלות באור שמש או כוכבים.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-7",
    "title": "The Neuroscience of Memory and Sleep",
    "hebrewTitle": "מדעי המוח: זיכרון, שינה וקונסולידציה",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "For centuries, sleep was erroneously regarded as a passive physiological state during which the human brain essentially shut down to recuperate. Over the past three decades, however, breakthroughs in functional neuroimaging have revolutionized our understanding of slumber. Far from resting passively, the sleeping brain engages in a meticulously orchestrated symphony of synaptic consolidation, cognitive reorganization, and biochemical detoxification.",
      "The neurobiological architecture of memory consolidation hinges on a dynamic dialogue between two key cerebral structures: the hippocampus and the neocortex. Throughout the day, the seahorse-shaped hippocampus acts as an active temporary buffer, encoding new episodic memories and sensory impressions with rapid synaptic flexibility. However, its storage capacity is inherently finite, necessitating an offline transfer mechanism.",
      "During slow-wave sleep (deep non-REM sleep), slow electrical oscillations sweep synchronously across the cerebral cortex. Concurrently, high-frequency bursts called 'sharp-wave ripples' emanate from the hippocampus. Neuroscientists have discovered that these ripples represent high-speed neural replays of daytime experiences. By replaying these neuronal sequences thousands of times, the brain gradually transfers short-term memories from the temporary hippocampus into the vast, resilient network of the neocortex.",
      "In parallel, rapid eye movement (REM) sleep performs emotional triage. During REM dreaming, the brain is bathed in acetylcholine while stress neurochemicals—specifically noradrenaline—are completely deactivated. This unique chemical environment allows the brain to process distressing traumatic memories, stripping away the painful emotional charge while integrating the factual core of the experience into long-term autobiographical memory.",
      "Furthermore, neurobiologists at the University of Rochester recently discovered the 'glymphatic system,' a microscopic waste clearance network that operates ten times more vigorously during sleep. Cerebrospinal fluid rushes through brain tissue, flushing out toxic metabolic byproducts like beta-amyloid, a protein strongly implicated in Alzheimer's disease. These discoveries underscore that sleep is not a luxury, but an indispensable biological foundation for cognitive longevity."
    ],
    "vocabularyHints": [
      {
        "word": "erroneously",
        "translation": "בטעות / באופן שגוי"
      },
      {
        "word": "consolidation",
        "translation": "קונסולידציה (גיבוש וקיבוע בזיכרון)"
      },
      {
        "word": "hippocampus",
        "translation": "היפוקמפוס (אזור במוח האחראי על זיכרון)"
      },
      {
        "word": "neocortex",
        "translation": "ניאוקורטקס (קליפת המוח החדשה)"
      },
      {
        "word": "oscillations",
        "translation": "תנודות / גלים חשמליים"
      },
      {
        "word": "glymphatic",
        "translation": "גלימפטי (מערכת ניקוי הפסולת של המוח)"
      }
    ],
    "questions": [
      {
        "id": "story-level3-7-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What misconception about sleep was held for centuries?",
        "options": [
          "That humans sleep too many hours",
          "That sleep was a passive state where the brain simply shut down",
          "That dreams foretold the future",
          "That animals do not require sleep"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 מוסבר שבמשך מאות שנים נחשבה השינה בטעות למצב פסיבי שבו המוח נכבה כדי להתאושש.",
        "points": 10
      },
      {
        "id": "story-level3-7-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that lists the three active processes the sleeping brain engages in.",
        "correctIndex": 0,
        "targetSentence": "Far from resting passively, the sleeping brain engages in a meticulously orchestrated symphony of synaptic consolidation, cognitive reorganization, and biochemical detoxification.",
        "explanationHebrew": "המשפט המדויק הוא: Far from resting passively, the sleeping brain engages in a meticulously orchestrated symphony of synaptic consolidation, cognitive reorganization, and biochemical detoxification.",
        "points": 10
      },
      {
        "id": "story-level3-7-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What role does the hippocampus play during waking hours?",
        "correctIndex": 0,
        "modelAnswer": "It acts as an active temporary buffer encoding new episodic memories and sensory impressions.",
        "keywords": [
          "temporary buffer",
          "buffer",
          "encoding",
          "memories"
        ],
        "explanationHebrew": "בפסקה 2 מוסבר שההיפוקמפוס משמש כמחסן זמני פעיל שמקודד זיכרונות ורשמים חושיים.",
        "points": 10
      },
      {
        "id": "story-level3-7-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "Why must memories be transferred out of the hippocampus?",
        "options": [
          "It shuts down permanently at night",
          "Its storage capacity is inherently finite",
          "It gets too hot",
          "It can only remember numbers"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מוסבר שקיבולת האחסון שלו מוגבלת מטבעה (storage capacity is inherently finite).",
        "points": 10
      },
      {
        "id": "story-level3-7-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that describes what sharp-wave ripples represent.",
        "correctIndex": 0,
        "targetSentence": "Neuroscientists have discovered that these ripples represent high-speed neural replays of daytime experiences.",
        "explanationHebrew": "המשפט המדויק הוא: Neuroscientists have discovered that these ripples represent high-speed neural replays of daytime experiences.",
        "points": 10
      },
      {
        "id": "story-level3-7-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "To which resilient brain structure are short-term memories transferred during slow-wave sleep?",
        "correctIndex": 0,
        "modelAnswer": "To the neocortex.",
        "keywords": [
          "neocortex",
          "cortex"
        ],
        "explanationHebrew": "בפסקה 3 מצוין הניאוקורטקס (neocortex).",
        "points": 10
      },
      {
        "id": "story-level3-10-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What stress neurochemical is deactivated during REM dreaming?",
        "options": [
          "Serotonin",
          "Noradrenaline",
          "Dopamine",
          "Adrenaline only"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מצוין שהנוירוכימיקל נוראדרנלין מושבת לחלוטין (noradrenaline).",
        "points": 10
      },
      {
        "id": "story-level3-7-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes how REM sleep strips away emotional distress from memories.",
        "correctIndex": 0,
        "targetSentence": "This unique chemical environment allows the brain to process distressing traumatic memories, stripping away the painful emotional charge while integrating the factual core of the experience into long-term autobiographical memory.",
        "explanationHebrew": "המשפט המדויק הוא: This unique chemical environment allows the brain to process distressing traumatic memories, stripping away the painful emotional charge while integrating the factual core of the experience into long-term autobiographical memory.",
        "points": 10
      },
      {
        "id": "story-level3-7-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What toxic metabolic protein is flushed out by the glymphatic system?",
        "correctIndex": 0,
        "modelAnswer": "Beta-amyloid.",
        "keywords": [
          "beta-amyloid",
          "protein",
          "amyloid"
        ],
        "explanationHebrew": "בפסקה 5 מצוין החלבון הרעיל בטא-עמילואיד (beta-amyloid).",
        "points": 10
      },
      {
        "id": "story-level3-7-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What do these scientific discoveries conclude about sleep?",
        "options": [
          "Sleep is an unnecessary habit for young adults",
          "Sleep is an indispensable biological foundation for cognitive longevity",
          "Sleep can be completely replaced by medication",
          "Five hours of sleep is always sufficient"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שהשינה היא יסוד ביולוגי חיוני שאינו מותרות לבריאות ותפקוד קוגניטיבי ארוך טווח.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-8",
    "title": "Artificial Intelligence in Wildlife Conservation",
    "hebrewTitle": "בינה מלאכותית בשירות הגנת חיות הבר",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "The Anthropocene epoch has triggered an unprecedented global biodiversity crisis, with species extinction rates estimated to be one thousand times higher than historical baselines. Traditional ecological monitoring—relying on manual field tracking, physical footprint casting, and human patrols—is fundamentally outmatched by the vast scale of vulnerable ecosystems. In response, conservation biologists are forging powerful alliances with machine learning engineers to revolutionize anti-poaching and biodiversity protection.",
      "One of the most potent applications is algorithmic bioacoustics. In dense tropical rainforests across Gabon, Indonesia, and Costa Rica, solar-powered acoustic sensors mounted high in tree crowns continuously record ambient jungle soundscapes. Deep convolutional neural networks analyze thousands of audio streams simultaneously. Within milliseconds, the software can differentiate benign animal calls from anthropogenic threats such as chainsaw revs, truck engines, or distant rifle gunshots, immediately dispatching GPS coordinates to park rangers on motorcycle patrols.",
      "Simultaneously, computer vision algorithms are transforming remote camera trapping. Historically, wildlife biologists spent hundreds of tedious hours manually sifting through millions of camera trap photos, most of which contained only wind-blown leaves or common rodents. State-of-the-art computer vision models now filter images with ninety-nine percent accuracy, identifying individual animals by their unique biometric markings, such as zebra stripe patterns, whale fluke contours, or leopard spots.",
      "In African savannas, predictive analytics algorithms help park rangers anticipate poacher movements before crimes occur. Machine learning models ingest diverse data layers, including historical poaching hotspots, seasonal rainfall patterns, moon phases, and topographical choke points. By generating dynamic probability risk maps, rangers can deploy preemptive patrols to safeguard endangered black rhinos and African elephants during high-risk full-moon nights.",
      "While artificial intelligence is not a silver bullet against habitat destruction and illegal wildlife trade, it serves as an indispensable force multiplier. By converting vast sensory data into actionable intelligence, technology empowers dedicated conservationists to defend Earth's most vulnerable inhabitants on an unprecedented global scale."
    ],
    "vocabularyHints": [
      {
        "word": "Anthropocene",
        "translation": "האנתרופוקן (עידן ההשפעה האנושית על כדור הארץ)"
      },
      {
        "word": "anthropogenic",
        "translation": "אנתרופוגני (שמקורו בפעילות אנושית)"
      },
      {
        "word": "bioacoustics",
        "translation": "ביואקוסטיקה (חקר קולות בעלי חיים)"
      },
      {
        "word": "convolutional",
        "translation": "קונבולוציוני (סוג של רשת עצבית ממוחשבת)"
      },
      {
        "word": "biometric",
        "translation": "ביומטרי (זיהוי על פי מאפיינים פיזיים)"
      },
      {
        "word": "preemptive",
        "translation": "מקדים / מונע מראש"
      }
    ],
    "questions": [
      {
        "id": "story-level3-8-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Why are traditional ecological monitoring techniques no longer sufficient?",
        "options": [
          "Park rangers have stopped working",
          "They are fundamentally outmatched by the vast scale of vulnerable ecosystems",
          "Animals have moved to cities",
          "Manual equipment is illegal"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 מוסבר שהשיטות הידניות המסורתיות אינן יכולות להתמודד עם היקף הממדים העצום של המערכות האקולוגיות.",
        "points": 10
      },
      {
        "id": "story-level3-8-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes species extinction rates during the Anthropocene.",
        "correctIndex": 0,
        "targetSentence": "The Anthropocene epoch has triggered an unprecedented global biodiversity crisis, with species extinction rates estimated to be one thousand times higher than historical baselines.",
        "explanationHebrew": "המשפט המדויק הוא: The Anthropocene epoch has triggered an unprecedented global biodiversity crisis, with species extinction rates estimated to be one thousand times higher than historical baselines.",
        "points": 10
      },
      {
        "id": "story-level3-8-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What anthropogenic sounds can deep neural networks differentiate within milliseconds?",
        "correctIndex": 0,
        "modelAnswer": "Chainsaw revs, truck engines, or distant rifle gunshots.",
        "keywords": [
          "chainsaw",
          "truck engines",
          "rifle",
          "gunshots"
        ],
        "explanationHebrew": "בפסקה 2 מפורטים רעשי מסורי שרשרת, מנועי משאיות ויריות רובה מרוחקות.",
        "points": 10
      },
      {
        "id": "story-level3-8-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "Where are the acoustic sensors mounted in tropical rainforests?",
        "options": [
          "Buried underground",
          "Mounted high in tree crowns",
          "Floating in rivers",
          "Carried by birds"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהחיישנים מותקנים גבוה בצמרות העצים (mounted high in tree crowns).",
        "points": 10
      },
      {
        "id": "story-level3-8-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that lists examples of unique biometric markings used by vision models.",
        "correctIndex": 0,
        "targetSentence": "State-of-the-art computer vision models now filter images with ninety-nine percent accuracy, identifying individual animals by their unique biometric markings, such as zebra stripe patterns, whale fluke contours, or leopard spots.",
        "explanationHebrew": "המשפט המדויק הוא: State-of-the-art computer vision models now filter images with ninety-nine percent accuracy, identifying individual animals by their unique biometric markings, such as zebra stripe patterns, whale fluke contours, or leopard spots.",
        "points": 10
      },
      {
        "id": "story-level3-8-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What tedious task did biologists historically have to spend hundreds of hours doing?",
        "correctIndex": 0,
        "modelAnswer": "Manually sifting through millions of camera trap photos.",
        "keywords": [
          "sifting",
          "camera trap",
          "photos",
          "manually"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שהם נאלצו לעבור ידנית על מיליוני צילומים ממצלמות שטח (manually sifting through millions of camera trap photos).",
        "points": 10
      },
      {
        "id": "story-level3-8-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What data layers do predictive models ingest to generate poacher risk maps?",
        "options": [
          "Stock market indices and air temperatures",
          "Historical poaching hotspots, rainfall, moon phases, and topographical choke points",
          "Tourist reviews and hotel bookings",
          "Satellite TV signals"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מפורטים מוקדי ציד היסטוריים, דפוסי גשם, מופעי ירח ונקודות מעבר טופוגרפיות.",
        "points": 10
      },
      {
        "id": "story-level3-8-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that mentions which animals are safeguarded during full-moon nights.",
        "correctIndex": 0,
        "targetSentence": "By generating dynamic probability risk maps, rangers can deploy preemptive patrols to safeguard endangered black rhinos and African elephants during high-risk full-moon nights.",
        "explanationHebrew": "המשפט המדויק הוא: By generating dynamic probability risk maps, rangers can deploy preemptive patrols to safeguard endangered black rhinos and African elephants during high-risk full-moon nights.",
        "points": 10
      },
      {
        "id": "story-level3-8-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What metaphor does the author use to describe the role of AI in conservation?",
        "correctIndex": 0,
        "modelAnswer": "An indispensable force multiplier.",
        "keywords": [
          "force multiplier",
          "multiplier"
        ],
        "explanationHebrew": "בפסקה 5 המחבר מתאר את ה-AI כ'מכפיל כוח חיוני' (indispensable force multiplier).",
        "points": 10
      },
      {
        "id": "story-level3-8-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What is the ultimate benefit of converting sensory data into actionable intelligence?",
        "options": [
          "It replaces all human park rangers",
          "It empowers conservationists to defend Earth's most vulnerable inhabitants on a global scale",
          "It eliminates the need for national parks",
          "It generates commercial advertising profit"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שהדבר מעצים את שומרי הטבע להגן על המינים הפגיעים ביותר בקנה מידה עולמי.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-9",
    "title": "The Architecture of the International Space Station",
    "hebrewTitle": "הנדסת תחנת החלל הבינלאומית",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "Circulating approximately four hundred kilometers above our heads at an astonishing velocity of twenty-eight thousand kilometers per hour, the International Space Station (ISS) represents the pinnacle of human collaborative engineering. Weighing nearly four hundred and fifty metric tons and stretching longer than a professional football field, this modular orbital laboratory orbits Earth once every ninety minutes, witnessing sixteen sunrises and sunsets every single day.",
      "Assembled piecemeal between 1998 and 2011 across more than forty specialized space missions, the station consists of interconnected pressurized modules where international crews live and conduct cutting-edge scientific research. The structural backbone of the complex is the Integrated Truss Structure, a giant aluminum girder spanning one hundred and nine meters that supports radiators, robotic arms, and eight colossal solar array wings.",
      "Surviving in low Earth orbit requires overcoming extreme environmental hostilities. Exterior surfaces endure brutal thermal swings, plunging to minus one hundred and fifty degrees Celsius in orbital darkness and scorching to positive one hundred and twenty degrees in direct sunlight. Heavy multilayer insulation blankets and ammonia-filled cooling loops maintain a stable internal room temperature of twenty-four degrees.",
      "Equally critical are the Environmental Control and Life Support Systems (ECLSS). Because transporting water and oxygen from Earth costs tens of thousands of dollars per kilogram, the ISS operates as an ultra-efficient closed-loop ecosystem. Advanced filtration assemblies recycle ninety-eight percent of all onboard moisture—including sweat, breath condensation, and urine—into pure, mineral-supplemented drinking water that is cleaner than municipal tap water on Earth.",
      "Beyond technical ingenuity, the ISS serves as an enduring geopolitical triumph. Jointly built and operated by the United States, Russia, Europe, Japan, and Canada, it has remained continuously inhabited by international astronauts since November 2000. It proves that nations can transcend ideological divisions to pioneer a shared future among the stars."
    ],
    "vocabularyHints": [
      {
        "word": "pinnacle",
        "translation": "פסגה / שיא"
      },
      {
        "word": "truss",
        "translation": "מסבך הנדסי (שלד קורות תומך)"
      },
      {
        "word": "hostilities",
        "translation": "תנאים עוינים"
      },
      {
        "word": "closed-loop",
        "translation": "במעגל סגור (מערכת ממחזרת)"
      },
      {
        "word": "geopolitical",
        "translation": "גיאופוליטי"
      },
      {
        "word": "transcend",
        "translation": "להתעלות מעל"
      }
    ],
    "questions": [
      {
        "id": "story-level3-9-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "At what velocity does the International Space Station orbit Earth?",
        "options": [
          "One thousand km/h",
          "Ten thousand km/h",
          "Twenty-eight thousand kilometers per hour",
          "Fifty thousand km/h"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 1 כתוב שהתחנה חגה במהירות של 28,000 קמ\"ש (twenty-eight thousand kilometers per hour).",
        "points": 10
      },
      {
        "id": "story-level3-9-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that tells how many sunrises and sunsets astronauts witness daily.",
        "correctIndex": 0,
        "targetSentence": "Weighing nearly four hundred and fifty metric tons and stretching longer than a professional football field, this modular orbital laboratory orbits Earth once every ninety minutes, witnessing sixteen sunrises and sunsets every single day.",
        "explanationHebrew": "המשפט המדויק הוא: Weighing nearly four hundred and fifty metric tons and stretching longer than a professional football field, this modular orbital laboratory orbits Earth once every ninety minutes, witnessing sixteen sunrises and sunsets every single day.",
        "points": 10
      },
      {
        "id": "story-level3-9-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What is the structural backbone of the space station complex called?",
        "correctIndex": 0,
        "modelAnswer": "The Integrated Truss Structure.",
        "keywords": [
          "Integrated Truss Structure",
          "Truss"
        ],
        "explanationHebrew": "בפסקה 2 מצוין עמוד השדרה המבני: Integrated Truss Structure.",
        "points": 10
      },
      {
        "id": "story-level3-9-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "How many colossal solar array wings are supported by the truss girder?",
        "options": [
          "Two",
          "Four",
          "Eight",
          "Sixteen"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 2 כתוב שהמסבך תומך בשמונה כנפי לוחות סולאריים ענקיים (eight colossal solar array wings).",
        "points": 10
      },
      {
        "id": "story-level3-9-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that states the temperature swing experienced by the station exterior.",
        "correctIndex": 0,
        "targetSentence": "Exterior surfaces endure brutal thermal swings, plunging to minus one hundred and fifty degrees Celsius in orbital darkness and scorching to positive one hundred and twenty degrees in direct sunlight.",
        "explanationHebrew": "המשפט המדויק הוא: Exterior surfaces endure brutal thermal swings, plunging to minus one hundred and fifty degrees Celsius in orbital darkness and scorching to positive one hundred and twenty degrees in direct sunlight.",
        "points": 10
      },
      {
        "id": "story-level3-9-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What stable internal temperature is maintained inside the station?",
        "correctIndex": 0,
        "modelAnswer": "A stable internal room temperature of twenty-four degrees Celsius.",
        "keywords": [
          "twenty-four",
          "24",
          "degrees"
        ],
        "explanationHebrew": "בפסקה 3 מצוינת טמפרטורת חדר יציבה של 24 מעלות צלזיוס (twenty-four degrees).",
        "points": 10
      },
      {
        "id": "story-level3-9-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What percentage of onboard moisture is recycled by the ECLSS life support system?",
        "options": [
          "Fifty percent",
          "Seventy-five percent",
          "Ninety-eight percent",
          "One hundred percent"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 4 כתוב שמערכת התמיכה בחיים ממחזרת 98 אחוזים מכלל הלחות על התחנה (ninety-eight percent).",
        "points": 10
      },
      {
        "id": "story-level3-9-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes what sources of moisture are recycled into drinking water.",
        "correctIndex": 0,
        "targetSentence": "Advanced filtration assemblies recycle ninety-eight percent of all onboard moisture—including sweat, breath condensation, and urine—into pure, mineral-supplemented drinking water that is cleaner than municipal tap water on Earth.",
        "explanationHebrew": "המשפט המדויק הוא: Advanced filtration assemblies recycle ninety-eight percent of all onboard moisture—including sweat, breath condensation, and urine—into pure, mineral-supplemented drinking water that is cleaner than municipal tap water on Earth.",
        "points": 10
      },
      {
        "id": "story-level3-9-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "Since what year has the ISS been continuously inhabited by humans?",
        "correctIndex": 0,
        "modelAnswer": "Since November 2000.",
        "keywords": [
          "November 2000",
          "2000"
        ],
        "explanationHebrew": "בפסקה 5 מצוין שהתחנה מאוישת ברציפות מאז נובמבר 2000 (since November 2000).",
        "points": 10
      },
      {
        "id": "story-level3-9-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "Which international partners jointly operate the International Space Station?",
        "options": [
          "United States, Russia, Europe, Japan, and Canada",
          "China and India only",
          "Australia and Brazil",
          "United Nations Security Council"
        ],
        "correctIndex": 0,
        "explanationHebrew": "בפסקה 5 מפורטות השותפות: ארה\"ב, רוסיה, אירופה, יפן וקנדה.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-10",
    "title": "Master Navigators of the Ancient Pacific",
    "hebrewTitle": "יורדי הים הקדומים של האוקיינוס השקט",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "Long before European sailors dared to venture beyond sight of coastal shores, ancient Polynesian navigators were accomplishing the greatest maritime migration in human history. Crossing the vast Polynesian Triangle—an oceanic territory spanning Hawaii in the north, New Zealand in the southwest, and Easter Island in the southeast—these voyagers colonized thousands of remote islands across twenty-five million square kilometers of open water without metal tools, compasses, or navigational charts.",
      "The vessels that made these transoceanic journeys possible were double-hulled voyaging canoes, known as waka or wa'a. Bound together with resilient braided coconut fiber cords and propelled by triangular pandanus leaf sails, these catamarans offered remarkable stability and cargo capacity. They carried crops like sweet potato and taro, pigs, chickens, dogs, and families ready to establish self-sustaining island settlements.",
      "Navigating across trackless open seas required a sophisticated indigenous science known as 'wayfinding.' Master navigators, called 'kahuna' or 'palu,' possessed mental star compasses containing the rising and setting azimuths of over two hundred individual stars. By observing the positions of celestial bodies relative to the canoe's hulls at twilight and throughout the night, navigators maintained a precise directional heading.",
      "When clouds obscured the night sky, navigators read the subtle language of the ocean. By feeling the rhythm of deep ocean swells beneath the canoe's hulls, navigators could detect ocean currents generated thousands of kilometers away. Furthermore, distinct reflections of refracted ocean waves revealed the presence of hidden islands just beyond the visible horizon.",
      "In the 1970s, the historic voyage of the traditional Polynesian canoe Hōkūle'a proved to modern sceptics that ancient oceanic crossings were deliberate feats of extraordinary navigation rather than accidental drifting. Today, traditional wayfinding is celebrated worldwide as a pinnacle of indigenous scientific mastery."
    ],
    "vocabularyHints": [
      {
        "word": "maritime",
        "translation": "ימי / של הים"
      },
      {
        "word": "voyagers",
        "translation": "מפליגים / נוסעים ימיים"
      },
      {
        "word": "catamarans",
        "translation": "קטמרן (סירה דו-גופית)"
      },
      {
        "word": "azimuths",
        "translation": "אזימוטים (זוויות כיוון ביחס לאופק)"
      },
      {
        "word": "refracted",
        "translation": "נשבר (גלים או אור המשנים כיוון)"
      },
      {
        "word": "sceptics",
        "translation": "ספקנים"
      }
    ],
    "questions": [
      {
        "id": "story-level3-10-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What three island vertices define the vast Polynesian Triangle?",
        "options": [
          "Japan, Philippines, and Indonesia",
          "Hawaii in the north, New Zealand in southwest, and Easter Island in southeast",
          "Madagascar, Sri Lanka, and Australia",
          "Fiji, Samoa, and Tahiti only"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 מוגדר המשולש הפולינזי: הוואי בצפון, ניו זילנד בדרום-מערב ואי הפסחא בדרום-מזרח.",
        "points": 10
      },
      {
        "id": "story-level3-10-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes what instruments Polynesian navigators lacked during their voyages.",
        "correctIndex": 0,
        "targetSentence": "Crossing the vast Polynesian Triangle—an oceanic territory spanning Hawaii in the north, New Zealand in the southwest, and Easter Island in the southeast—these voyagers colonized thousands of remote islands across twenty-five million square kilometers of open water without metal tools, compasses, or navigational charts.",
        "explanationHebrew": "המשפט המדויק הוא: Crossing the vast Polynesian Triangle—an oceanic territory spanning Hawaii in the north, New Zealand in the southwest, and Easter Island in the southeast—these voyagers colonized thousands of remote islands across twenty-five million square kilometers of open water without metal tools, compasses, or navigational charts.",
        "points": 10
      },
      {
        "id": "story-level3-10-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What type of traditional boats enabled these transoceanic journeys?",
        "correctIndex": 0,
        "modelAnswer": "Double-hulled voyaging canoes (catamarans), known as waka or wa'a.",
        "keywords": [
          "double-hulled",
          "canoes",
          "waka",
          "catamarans"
        ],
        "explanationHebrew": "בפסקה 2 מתוארות סירות קאנו דו-גופיות (double-hulled voyaging canoes).",
        "points": 10
      },
      {
        "id": "story-level3-10-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What agricultural crops did voyagers transport on their canoes?",
        "options": [
          "Wheat and barley",
          "Sweet potato and taro",
          "Corn and tomatoes",
          "Rice and soybeans"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהם הובילו בטטה וטארו (sweet potato and taro).",
        "points": 10
      },
      {
        "id": "story-level3-10-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that names the indigenous science of navigation across open seas.",
        "correctIndex": 0,
        "targetSentence": "Navigating across trackless open seas required a sophisticated indigenous science known as 'wayfinding.'",
        "explanationHebrew": "המשפט המדויק הוא: Navigating across trackless open seas required a sophisticated indigenous science known as 'wayfinding.'",
        "points": 10
      },
      {
        "id": "story-level3-10-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "How many individual stars were included in the mental compasses of master navigators?",
        "correctIndex": 0,
        "modelAnswer": "Over two hundred individual stars.",
        "keywords": [
          "two hundred",
          "200",
          "stars"
        ],
        "explanationHebrew": "בפסקה 3 מצוין שהמצפן המנטלי הכיל מעל מאתיים כוכבים נפרדים (over two hundred individual stars).",
        "points": 10
      },
      {
        "id": "story-level3-7-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "How could navigators detect direction when clouds obscured the stars?",
        "options": [
          "By smelling the wind direction only",
          "By feeling the rhythm of deep ocean swells beneath the canoe's hulls",
          "By throwing sticks into the water",
          "By waiting for daylight"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוסבר שהם חשו בקצב גלי העומק מתחת לגוף הסירה (feeling the rhythm of deep ocean swells).",
        "points": 10
      },
      {
        "id": "story-level3-10-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that explains how refracted ocean waves revealed hidden islands.",
        "correctIndex": 0,
        "targetSentence": "Furthermore, distinct reflections of refracted ocean waves revealed the presence of hidden islands just beyond the visible horizon.",
        "explanationHebrew": "המשפט המדויק הוא: Furthermore, distinct reflections of refracted ocean waves revealed the presence of hidden islands just beyond the visible horizon.",
        "points": 10
      },
      {
        "id": "story-level3-10-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What was the name of the traditional Polynesian canoe that sailed in the 1970s?",
        "correctIndex": 0,
        "modelAnswer": "The canoe was named Hōkūle'a.",
        "keywords": [
          "Hōkūle'a",
          "Hokulea"
        ],
        "explanationHebrew": "בפסקה 5 מצוינת סירת הקאנו המסורתית Hōkūle'a.",
        "points": 10
      },
      {
        "id": "story-level3-10-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What did the voyage of Hōkūle'a prove to modern sceptics?",
        "options": [
          "That ancient canoes could sink easily",
          "That ancient oceanic crossings were deliberate feats of extraordinary navigation",
          "That navigation requires modern GPS",
          "That islanders could not sail long distances"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שההפלגה הוכיחה שהמסעות הקדומים היו הישגים מכוונים של ניווט יוצא דופן ולא סחיפה מקרית.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-11",
    "title": "The Chemistry and Magic of Bioluminescence",
    "hebrewTitle": "הכימיה והפלא של ביולומינסנציה",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "In the pitch-black twilight zone of the open ocean, where sunlight vanishes beneath a depth of two hundred meters, darkness is punctuated by eerie flashes, glowing ripples, and pulsing lanterns. This ethereal illumination is not reflected light, but living light created through a biological marvel known as bioluminescence. Over seventy-five percent of deep-sea marine species possess the capability to produce their own light.",
      "At its biochemical core, bioluminescence is an extraordinarily efficient chemical reaction. Unlike artificial incandescent light bulbs, which waste up to ninety percent of their energy as heat, living light is 'cold light' with nearly one hundred percent energy efficiency. The reaction requires two primary components: a light-emitting substrate pigment called luciferin, and an enzyme catalyst called luciferase. In the presence of oxygen and cellular energy (ATP), luciferase oxidizes luciferin, exciting electrons into an unstable state that releases photons as they settle.",
      "Creatures employ bioluminescence for an astonishing variety of survival strategies. The female anglerfish dangles a luminous fleshy bulb, packed with symbiotic glowing bacteria, directly in front of her razor-sharp teeth to lure unsuspecting prey into an ambush. Conversely, deep-sea shrimp squirt luminous clouds of glowing mucus into the faces of approaching predators, blinding and distracting them while the shrimp darts away backwards.",
      "Another masterclass in evolutionary adaptation is counterillumination camouflage. Predators lurking in the abyss typically look upwards to spot the dark silhouettes of prey against downwelling surface light. Hatchetfish and lanternfish possess rows of photophores along their bellies that match the exact color, wavelength, and intensity of downwelling ambient sunlight, effectively making the fish completely invisible from below.",
      "Beyond marine ecology, bioluminescence has transformed biotechnology and medical research. Geneticists have incorporated the luciferase gene from fireflies and jellyfish into human cancer cells, allowing researchers to track tumor growth and evaluate the efficacy of experimental drugs non-invasively in real time. Living light continues to illuminate the frontiers of human medicine."
    ],
    "vocabularyHints": [
      {
        "word": "ethereal",
        "translation": "שמימי / מופשט וקסום"
      },
      {
        "word": "substrate",
        "translation": "סובסטראט (מצע כימי המגיב עם אנזים)"
      },
      {
        "word": "catalyst",
        "translation": "זרז (קָטָלִיזָטוֹר)"
      },
      {
        "word": "photophores",
        "translation": "פוטופורים (איברים פולטי אור)"
      },
      {
        "word": "counterillumination",
        "translation": "הארת-נגד (הסוואה באמצעות התאמת תאורה)"
      },
      {
        "word": "efficacy",
        "translation": "יעילות רפואית"
      }
    ],
    "questions": [
      {
        "id": "story-level3-11-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What percentage of deep-sea marine species are capable of producing bioluminescence?",
        "options": [
          "Ten percent",
          "Twenty-five percent",
          "Fifty percent",
          "Over seventy-five percent"
        ],
        "correctIndex": 3,
        "explanationHebrew": "בפסקה 1 כתוב שיותר מ-75 אחוזים ממיני היצורים במעמקי הים מייצרים אור חי (over seventy-five percent).",
        "points": 10
      },
      {
        "id": "story-level3-11-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that tells at what ocean depth sunlight vanishes.",
        "correctIndex": 0,
        "targetSentence": "In the pitch-black twilight zone of the open ocean, where sunlight vanishes beneath a depth of two hundred meters, darkness is punctuated by eerie flashes, glowing ripples, and pulsing lanterns.",
        "explanationHebrew": "המשפט המדויק הוא: In the pitch-black twilight zone of the open ocean, where sunlight vanishes beneath a depth of two hundred meters, darkness is punctuated by eerie flashes, glowing ripples, and pulsing lanterns.",
        "points": 10
      },
      {
        "id": "story-level3-11-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What are the two primary biochemical components required for bioluminescent reactions?",
        "correctIndex": 0,
        "modelAnswer": "Luciferin (a light-emitting pigment) and luciferase (an enzyme catalyst).",
        "keywords": [
          "luciferin",
          "luciferase",
          "pigment",
          "enzyme"
        ],
        "explanationHebrew": "בפסקה 2 מפורטים שני המרכיבים: הפיגמנט לוציפרין והאנזים הזרז לוציפראז (luciferin and luciferase).",
        "points": 10
      },
      {
        "id": "story-level3-11-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "Why is bioluminescence referred to as 'cold light'?",
        "options": [
          "It only works in freezing water",
          "It has nearly one hundred percent energy efficiency with virtually no wasted heat",
          "It is made of ice crystals",
          "It freezes predators"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מוסבר שהאור נקרא 'אור קר' כי הוא פועל ביעילות של כמעט 100% ללא בזבוז אנרגיה כחום.",
        "points": 10
      },
      {
        "id": "story-level3-11-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that describes how the female anglerfish lures prey.",
        "correctIndex": 0,
        "targetSentence": "The female anglerfish dangles a luminous fleshy bulb, packed with symbiotic glowing bacteria, directly in front of her razor-sharp teeth to lure unsuspecting prey into an ambush.",
        "explanationHebrew": "המשפט המדויק הוא: The female anglerfish dangles a luminous fleshy bulb, packed with symbiotic glowing bacteria, directly in front of her razor-sharp teeth to lure unsuspecting prey into an ambush.",
        "points": 10
      },
      {
        "id": "story-level3-11-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What defensive substance do deep-sea shrimp squirt at approaching predators?",
        "correctIndex": 0,
        "modelAnswer": "They squirt luminous clouds of glowing mucus.",
        "keywords": [
          "mucus",
          "glowing",
          "luminous",
          "clouds"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שחסילוני מעמקים מתיזים ענני ריר זוהר (luminous clouds of glowing mucus).",
        "points": 10
      },
      {
        "id": "story-level3-11-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "How does counterillumination camouflage protect hatchetfish from predators below?",
        "options": [
          "By blinding predators with lasers",
          "Belly photophores match the color, wavelength, and intensity of downwelling sunlight",
          "By turning the fish completely black",
          "By vibrating to create water bubbles"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוסבר שהאיברים הזוהרים בגחונם מתאימים בדיוק את צבע ועוצמת האור היורד מלמעלה ומעלימים את צלליתם.",
        "points": 10
      },
      {
        "id": "story-level3-11-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that explains what predators lurking in the abyss typically look for.",
        "correctIndex": 0,
        "targetSentence": "Predators lurking in the abyss typically look upwards to spot the dark silhouettes of prey against downwelling surface light.",
        "explanationHebrew": "המשפט המדויק הוא: Predators lurking in the abyss typically look upwards to spot the dark silhouettes of prey against downwelling surface light.",
        "points": 10
      },
      {
        "id": "story-level3-11-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "How do medical researchers use the luciferase gene in human cancer research?",
        "correctIndex": 0,
        "modelAnswer": "To track tumor growth and evaluate drug efficacy non-invasively in real time.",
        "keywords": [
          "tumor growth",
          "drug efficacy",
          "track",
          "non-invasively"
        ],
        "explanationHebrew": "בפסקה 5 מוסבר שהגן משמש למעקב אחר גידולים סרטניים ולהערכת יעילות תרופות בזמן אמת.",
        "points": 10
      },
      {
        "id": "story-level3-11-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "From which organisms have geneticists borrowed the luciferase gene?",
        "options": [
          "Anglerfish and sharks",
          "Fireflies and jellyfish",
          "Deep-sea squids only",
          "Bioluminescent mushrooms"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 מצוינות גחליליות ומדוזות (fireflies and jellyfish).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-12",
    "title": "Smart Cities and Urban Ecological Design",
    "hebrewTitle": "ערים חכמות ותכנון אקולוגי עירוני",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "By the mid-twenty-first century, approximately seventy percent of the human population will reside in metropolitan areas. Historically, the rapid expansion of modern cities has been synonymous with environmental degradation: vast swathes of asphalt exacerbating urban heat islands, soaring carbon emissions, and excessive resource consumption. To prevent ecological collapse, urban planners and software architects are pioneering 'smart ecological cities' that synthesize digital intelligence with regenerative nature.",
      "At the core of the smart city paradigm is the Internet of Things (IoT). Thousands of distributed environmental sensors monitor ambient air quality, stormwater runoffs, and energy consumption across urban neighborhoods in real time. Sophisticated predictive algorithms analyze this telemetry to dynamically optimize traffic signaling, reducing traffic idling times and vehicular emissions by up to twenty-five percent.",
      "Equally transformative is the integration of biophilic architecture. Cities are mandating green vegetative roofs and vertical urban forests, such as the famous Bosco Verticale in Milan. These living plant envelopes absorb ambient airborne pollutants, muffle city noise pollution, and insulate building envelopes, reducing cooling energy requirements during sweltering heatwaves.",
      "Water resilience represents another vital frontier. In Singapore, comprehensive 'Active, Beautiful, Clean Waters' initiatives transform concrete drainage canals into meandering naturalized river systems surrounded by wetland marshes. These naturalized waterways act as organic bioswales that filter heavy metals from urban runoff before replenishing natural freshwater reservoirs.",
      "Ultimately, a truly smart city is defined not merely by technological gadgets, but by its capacity to improve human well-being while regenerating biosphere vitality. By treating cities not as concrete extraction machines, but as self-sustaining, circular metabolic ecosystems, humanity can build urban futures in harmony with our living planet."
    ],
    "vocabularyHints": [
      {
        "word": "exacerbating",
        "translation": "מחריף / מעצים לרעה"
      },
      {
        "word": "regenerative",
        "translation": "מתחדש / משקם"
      },
      {
        "word": "telemetry",
        "translation": "טלמטריה (מדידה ושידור נתונים מרחוק)"
      },
      {
        "word": "biophilic",
        "translation": "ביופילי (עיצוב המשלב אהבת טבע)"
      },
      {
        "word": "bioswales",
        "translation": "ביוסווייל (תעלות ניקוז צמחיות לסינון מים)"
      },
      {
        "word": "metabolic",
        "translation": "מטבולי (של חילוף חומרים)"
      }
    ],
    "questions": [
      {
        "id": "story-level3-12-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What percentage of the human population is projected to reside in metropolitan areas by mid-century?",
        "options": [
          "Thirty percent",
          "Fifty percent",
          "Approximately seventy percent",
          "Ninety-five percent"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 1 כתוב שכ-70 אחוזים מאוכלוסיית העולם צפויים להתגורר בערים (approximately seventy percent).",
        "points": 10
      },
      {
        "id": "story-level3-12-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that lists environmental problems historically associated with city growth.",
        "correctIndex": 0,
        "targetSentence": "Historically, the rapid expansion of modern cities has been synonymous with environmental degradation: vast swathes of asphalt exacerbating urban heat islands, soaring carbon emissions, and excessive resource consumption.",
        "explanationHebrew": "המשפט המדויק הוא: Historically, the rapid expansion of modern cities has been synonymous with environmental degradation: vast swathes of asphalt exacerbating urban heat islands, soaring carbon emissions, and excessive resource consumption.",
        "points": 10
      },
      {
        "id": "story-level3-12-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What technological concept is at the core of the smart city paradigm?",
        "correctIndex": 0,
        "modelAnswer": "The Internet of Things (IoT).",
        "keywords": [
          "Internet of Things",
          "IoT"
        ],
        "explanationHebrew": "בפסקה 2 מצוין האינטרנט של הדברים (Internet of Things / IoT).",
        "points": 10
      },
      {
        "id": "story-level3-12-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "By how much can predictive traffic algorithms reduce vehicular emissions?",
        "options": [
          "Five percent",
          "Ten percent",
          "Up to twenty-five percent",
          "Fifty percent"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 2 כתוב שהפחתת פליטות הרכבים יכולה להגיע עד 25 אחוזים (up to twenty-five percent).",
        "points": 10
      },
      {
        "id": "story-level3-12-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that mentions the famous vertical forest in Milan.",
        "correctIndex": 0,
        "targetSentence": "Cities are mandating green vegetative roofs and vertical urban forests, such as the famous Bosco Verticale in Milan.",
        "explanationHebrew": "המשפט המדויק הוא: Cities are mandating green vegetative roofs and vertical urban forests, such as the famous Bosco Verticale in Milan.",
        "points": 10
      },
      {
        "id": "story-level3-12-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What three environmental benefits do living plant envelopes provide to buildings?",
        "correctIndex": 0,
        "modelAnswer": "They absorb airborne pollutants, muffle noise pollution, and insulate building envelopes.",
        "keywords": [
          "pollutants",
          "noise",
          "insulate",
          "absorb"
        ],
        "explanationHebrew": "בפסקה 3 מוסבר שהצמחים סופגים מזהמים, עוממים רעש ומבודדים את המבנים תרמית.",
        "points": 10
      },
      {
        "id": "story-level3-12-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "In which country has the 'Active, Beautiful, Clean Waters' initiative transformed concrete canals?",
        "options": [
          "Japan",
          "Singapore",
          "Netherlands",
          "United States"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מצוינת סינגפור (In Singapore).",
        "points": 10
      },
      {
        "id": "story-level3-12-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that explains what naturalized waterways act as.",
        "correctIndex": 0,
        "targetSentence": "These naturalized waterways act as organic bioswales that filter heavy metals from urban runoff before replenishing natural freshwater reservoirs.",
        "explanationHebrew": "המשפט המדויק הוא: These naturalized waterways act as organic bioswales that filter heavy metals from urban runoff before replenishing natural freshwater reservoirs.",
        "points": 10
      },
      {
        "id": "story-level3-12-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "How does the author define a truly smart city in the conclusion?",
        "correctIndex": 0,
        "modelAnswer": "By its capacity to improve human well-being while regenerating biosphere vitality.",
        "keywords": [
          "well-being",
          "regenerating",
          "biosphere",
          "vitality"
        ],
        "explanationHebrew": "בפסקה האחרונה נכתב שעיר חכמה נמדדת ביכולתה לשפר את רווחת האדם תוך חידוש חיוניות הביוספרה.",
        "points": 10
      },
      {
        "id": "story-level3-12-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "Rather than concrete extraction machines, how should cities be treated?",
        "options": [
          "As tourist resorts",
          "As self-sustaining, circular metabolic ecosystems",
          "As industrial factories",
          "As digital simulations"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום מודגש שיש להתייחס לערים כמערכות אקולוגיות מעגליות המקיימות את עצמן.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-13",
    "title": "Voyager 1: Humankind's Emissary in Interstellar Space",
    "hebrewTitle": "וויאג'ר 1: שגריר האנושות בחלל הבין-כוכבי",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "In September 1977, NASA launched a modest eight-hundred-kilogram robotic spacecraft from Cape Canaveral on what was conceived as a four-year tour of Jupiter and Saturn. Nearly half a century later, Voyager 1 has achieved immortality as humankind's most distant emissary, becoming the first manufactured object in history to cross the heliopause and enter the uncharted expanse of interstellar space.",
      "The primary architectural genius of the Voyager mission was taking advantage of a rare celestial alignment of the outer planets that occurs only once every one hundred and seventy-six years. Utilizing 'gravity assists,' the spacecraft used the gravitational pulling power of Jupiter and Saturn to slingshot itself outward across the solar system at phenomenal velocities without consuming prohibitive amounts of rocket fuel.",
      "Because solar panels are useless in the dim, freezing twilight beyond the asteroid belt, Voyager is powered by radioisotope thermoelectric generators (RTGs). These compact nuclear batteries convert the decaying radioactive heat of plutonium-238 pellets into electricity. Despite operating on a tiny fraction of its original electrical budget, Voyager continues transmitting scientific data from more than twenty-four billion kilometers away.",
      "Affixed to the exterior of the spacecraft is a twelve-inch gold-plated copper phonograph record: the Golden Record. Curated by astronomer Carl Sagan, it contains one hundred and fifteen analog images of Earth, musical selections from Bach and Beethoven to Chuck Berry, animal sounds, greetings spoken in fifty-five human languages, and printed messages from world leaders. It is an interstellar message in a bottle designed to endure for over a billion years.",
      "In 2012, Voyager's plasma wave instruments detected a sudden spike in cosmic ray density, confirming it had finally departed the solar bubble. Traveling at seventeen kilometers per second, Voyager 1 will drift silently through the Milky Way for eons, an eternal testament to the restless curiosity of our human species."
    ],
    "vocabularyHints": [
      {
        "word": "emissary",
        "translation": "שגריר / שליח"
      },
      {
        "word": "heliopause",
        "translation": "הליופאוזה (הגבול שבו רוח השמש נבלמת על ידי החלל הבין-כוכבי)"
      },
      {
        "word": "slingshot",
        "translation": "מקלעת כבידתית (האצת חללית באמצעות כבידת כוכב לכת)"
      },
      {
        "word": "radioisotope",
        "translation": "רדיואיזוטופ (יסוד רדיואקטיבי המשמש מקור אנרגיה)"
      },
      {
        "word": "curated",
        "translation": "אוצר / נבחר בקפידה"
      },
      {
        "word": "eons",
        "translation": "עידני עידנים (תקופות זמן אדירות)"
      }
    ],
    "questions": [
      {
        "id": "story-level3-13-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "When was Voyager 1 launched by NASA?",
        "options": [
          "July 1969",
          "September 1977",
          "January 1986",
          "December 1999"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהחללית שוגרה בספטמבר 1977 (In September 1977).",
        "points": 10
      },
      {
        "id": "story-level3-13-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes Voyager 1 entering interstellar space.",
        "correctIndex": 0,
        "targetSentence": "Nearly half a century later, Voyager 1 has achieved immortality as humankind's most distant emissary, becoming the first manufactured object in history to cross the heliopause and enter the uncharted expanse of interstellar space.",
        "explanationHebrew": "המשפט המדויק הוא: Nearly half a century later, Voyager 1 has achieved immortality as humankind's most distant emissary, becoming the first manufactured object in history to cross the heliopause and enter the uncharted expanse of interstellar space.",
        "points": 10
      },
      {
        "id": "story-level3-13-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "How often does the rare celestial alignment of outer planets occur?",
        "correctIndex": 0,
        "modelAnswer": "Once every one hundred and seventy-six years.",
        "keywords": [
          "one hundred and seventy-six",
          "176 years",
          "years"
        ],
        "explanationHebrew": "בפסקה 2 מצוין שהיישור הפלנטרי הנדיר קורה אחת ל-176 שנים (once every one hundred and seventy-six years).",
        "points": 10
      },
      {
        "id": "story-level3-13-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What orbital mechanic technique did Voyager use to accelerate across the solar system?",
        "options": [
          "Nuclear fusion rockets",
          "Gravity assists (slingshots) using Jupiter and Saturn",
          "Solar wind sails",
          "Ion thruster engines"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מוסבר שהיא השתמשה במקלעת כבידתית סביב צדק ושבתאי (gravity assists).",
        "points": 10
      },
      {
        "id": "story-level3-13-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that explains what nuclear isotope powers Voyager batteries.",
        "correctIndex": 0,
        "targetSentence": "These compact nuclear batteries convert the decaying radioactive heat of plutonium-238 pellets into electricity.",
        "explanationHebrew": "המשפט המדויק הוא: These compact nuclear batteries convert the decaying radioactive heat of plutonium-238 pellets into electricity.",
        "points": 10
      },
      {
        "id": "story-level3-13-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "From what staggering distance is Voyager 1 currently transmitting scientific data?",
        "correctIndex": 0,
        "modelAnswer": "From more than twenty-four billion kilometers away.",
        "keywords": [
          "twenty-four billion",
          "24 billion",
          "kilometers"
        ],
        "explanationHebrew": "בפסקה 3 מצוין מרחק של מעל 24 מיליארד קילומטרים (twenty-four billion kilometers).",
        "points": 10
      },
      {
        "id": "story-level3-13-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "Who curated the contents of the famous Golden Record aboard Voyager?",
        "options": [
          "Albert Einstein",
          "Astronomer Carl Sagan",
          "Stephen Hawking",
          "Neil Armstrong"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב שהתקליט המוזהב נאצר על ידי האסטרונום קארל סייגן (astronomer Carl Sagan).",
        "points": 10
      },
      {
        "id": "story-level3-13-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes the contents of the Golden Record.",
        "correctIndex": 0,
        "targetSentence": "Curated by astronomer Carl Sagan, it contains one hundred and fifteen analog images of Earth, musical selections from Bach and Beethoven to Chuck Berry, animal sounds, greetings spoken in fifty-five human languages, and printed messages from world leaders.",
        "explanationHebrew": "המשפט המדויק הוא: Curated by astronomer Carl Sagan, it contains one hundred and fifteen analog images of Earth, musical selections from Bach and Beethoven to Chuck Berry, animal sounds, greetings spoken in fifty-five human languages, and printed messages from world leaders.",
        "points": 10
      },
      {
        "id": "story-level3-13-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "In what year did Voyager instruments confirm it had officially entered interstellar space?",
        "correctIndex": 0,
        "modelAnswer": "In 2012.",
        "keywords": [
          "2012"
        ],
        "explanationHebrew": "בפסקה 5 מצוינת שנת 2012 (In 2012).",
        "points": 10
      },
      {
        "id": "story-level3-13-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What does Voyager 1 stand as, according to the concluding thought?",
        "options": [
          "A piece of space junk",
          "An eternal testament to the restless curiosity of our human species",
          "A military weapon",
          "A communication antenna for satellites"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שוויאג'ר 1 היא עדות נצחית לסקרנות חסרת המנוח של המין האנושי.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-14",
    "title": "Nanomedicine: Healing at the Molecular Scale",
    "hebrewTitle": "ננו-רפואה: ריפוי בקנה מידה מולקולרי",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "For centuries, medical therapies operated on a macroscopic level: surgical scalpels excised diseased tissues, while pharmaceutical pills dispersed chemical agents indiscriminately throughout the entire human bloodstream. While often effective, traditional interventions inevitably cause collateral damage to healthy organs. Today, the burgeoning discipline of nanomedicine is executing a profound paradigm shift by engineering microscopic tools operating at the nanoscale—one billionth of a meter.",
      "To appreciate nanoscale dimensions, consider that a single strand of human DNA is approximately two nanometers wide, while a standard red blood cell spans seven thousand nanometers. Nanoparticles engineered by biomedical chemists are specifically designed to navigate biological barriers, mimicking the size and surface chemistry of natural cellular machinery.",
      "The most promising revolution occurs in targeted oncology therapeutics. Conventional chemotherapy floods the patient's body with systemic poisons, causing debilitating side effects like severe nausea, hair loss, and immune depletion. In contrast, nanocarriers—such as synthetic liposomes and gold nanoshells—are coated with target-seeking antibodies that bind exclusively to surface receptor proteins unique to malignant cancer cells.",
      "Once bound to a tumor, these 'smart nanoparticles' release their toxic cargo precisely inside malignant cells, sparing neighboring healthy tissues entirely. Other experimental nanoshells absorb near-infrared laser light directed through the skin, heating up rapidly to vaporize cancer cells from within while leaving surrounding tissue completely unharmed.",
      "Looking toward the future, nanorobotics researchers are designing autonomous biocompatible devices capable of navigating the bloodstream to dissolve arterial plaque, repair cellular mutations, and combat antibiotic-resistant superbugs. Nanomedicine promises a future where medicine ceases to be an invasive blunt instrument, transforming into an exquisite cellular craft."
    ],
    "vocabularyHints": [
      {
        "word": "macroscopic",
        "translation": "מקרוסקופי (בקנה מידה גדול הנראה לעין)"
      },
      {
        "word": "collateral damage",
        "translation": "נזק נלווה"
      },
      {
        "word": "nanoscale",
        "translation": "קנה מידה ננומטרי (ננו-מטר = מיליארדית המטר)"
      },
      {
        "word": "oncology",
        "translation": "אונקולוגיה (חקר וטיפול בסרטן)"
      },
      {
        "word": "liposomes",
        "translation": "ליפוזומים (בועיות שומניות המשמשות כנשאי תרופות)"
      },
      {
        "word": "biocompatible",
        "translation": "תואם ביולוגית (אינו נדחה על ידי הגוף)"
      }
    ],
    "questions": [
      {
        "id": "story-level3-14-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What is the size of a nanometer relative to a meter?",
        "options": [
          "One thousandth of a meter",
          "One millionth of a meter",
          "One billionth of a meter",
          "One trillionth of a meter"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 1 כתוב שננומטר הוא מיליארדית המטר (one billionth of a meter).",
        "points": 10
      },
      {
        "id": "story-level3-14-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes the limitation of traditional pharmaceutical therapies.",
        "correctIndex": 0,
        "targetSentence": "While often effective, traditional interventions inevitably cause collateral damage to healthy organs.",
        "explanationHebrew": "המשפט המדויק הוא: While often effective, traditional interventions inevitably cause collateral damage to healthy organs.",
        "points": 10
      },
      {
        "id": "story-level3-14-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What is the width of a single strand of human DNA in nanometers?",
        "correctIndex": 0,
        "modelAnswer": "It is approximately two nanometers wide.",
        "keywords": [
          "two nanometers",
          "2 nm",
          "nanometers"
        ],
        "explanationHebrew": "בפסקה 2 כתוב שגדיל DNA יחיד הוא ברוחב של כשני ננומטרים (two nanometers wide).",
        "points": 10
      },
      {
        "id": "story-level3-14-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "How wide is a standard red blood cell in nanometers?",
        "options": [
          "Two nanometers",
          "One hundred nanometers",
          "Seven thousand nanometers",
          "One million nanometers"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 2 מצוין שתא דם אדום הוא ברוחב של 7,000 ננומטרים (seven thousand nanometers).",
        "points": 10
      },
      {
        "id": "story-level3-14-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that lists the debilitating side effects of conventional chemotherapy.",
        "correctIndex": 0,
        "targetSentence": "Conventional chemotherapy floods the patient's body with systemic poisons, causing debilitating side effects like severe nausea, hair loss, and immune depletion.",
        "explanationHebrew": "המשפט המדויק הוא: Conventional chemotherapy floods the patient's body with systemic poisons, causing debilitating side effects like severe nausea, hair loss, and immune depletion.",
        "points": 10
      },
      {
        "id": "story-level3-14-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What are nanocarriers coated with to target cancer cells exclusively?",
        "correctIndex": 0,
        "modelAnswer": "They are coated with target-seeking antibodies that bind to cancer cell receptors.",
        "keywords": [
          "antibodies",
          "target-seeking",
          "receptors"
        ],
        "explanationHebrew": "בפסקה 3 מוסבר שהם מצופים בנוגדנים המזהים ונקשרים בלעדית לקולטנים של תאים סרטניים.",
        "points": 10
      },
      {
        "id": "story-level3-14-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "How do experimental gold nanoshells destroy tumors when activated by infrared laser light?",
        "options": [
          "They freeze the tumor instantly",
          "They heat up rapidly to vaporize cancer cells from within",
          "They dissolve in the blood",
          "They emit sound waves"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוסבר שהננו-קונכיות סופגות אור אינפרא-אדום, מתחממות במהירות ומאדות את תאי הגידול מבפנים.",
        "points": 10
      },
      {
        "id": "story-level3-14-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that explains what smart nanoparticles do once bound to a tumor.",
        "correctIndex": 0,
        "targetSentence": "Once bound to a tumor, these 'smart nanoparticles' release their toxic cargo precisely inside malignant cells, sparing neighboring healthy tissues entirely.",
        "explanationHebrew": "המשפט המדויק הוא: Once bound to a tumor, these 'smart nanoparticles' release their toxic cargo precisely inside malignant cells, sparing neighboring healthy tissues entirely.",
        "points": 10
      },
      {
        "id": "story-level3-14-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What future tasks are autonomous nanorobotic devices being designed to perform?",
        "correctIndex": 0,
        "modelAnswer": "To dissolve arterial plaque, repair cellular mutations, and combat antibiotic-resistant superbugs.",
        "keywords": [
          "dissolve plaque",
          "repair mutations",
          "superbugs",
          "arterial"
        ],
        "explanationHebrew": "בפסקה 5 מפורטים פירוק משקעים בעורקים, תיקון מוטציות גנטיות ומלחמה בחיידקים עמידים.",
        "points": 10
      },
      {
        "id": "story-level3-14-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What transformation does nanomedicine promise for the future of healthcare?",
        "options": [
          "Medicine will become entirely robotic without human doctors",
          "Medicine will cease being an invasive blunt instrument and become an exquisite cellular craft",
          "All human diseases will vanish by 2030",
          "Pills will become larger"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שהרפואה תחדל מלהיות כלי פולשני ומגושם ותהפוך למלאכת מחשבת תאית מעודנת.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-15",
    "title": "The Svalbard Global Seed Vault",
    "hebrewTitle": "כספת הזרעים העולמית בסוואלברד",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "Deep inside an icy mountain on the remote Norwegian archipelago of Svalbard, just thirteen hundred kilometers from the North Pole, lies humankind's ultimate agricultural insurance policy: the Svalbard Global Seed Vault. Often colloquially termed the 'Doomsday Vault,' this underground citadel was established in 2008 to safeguard global crop diversity against catastrophic threats, including nuclear war, climate change, pandemics, and civil instability.",
      "The geological location of Svalbard was selected with rigorous scientific calculation. The facility is tunneled one hundred and thirty meters into solid sandstone permafrost beneath Mount Platåberget. Even if all electrical cooling equipment fails, the surrounding Arctic permafrost naturally maintains a sub-zero temperature, ensuring seed samples remain frozen for centuries.",
      "Inside the vault's reinforced chambers, seeds are stored in three-ply foil packets, sealed inside plastic crates resting on towering metal shelving. The facility is refrigerated to an optimal preservation temperature of minus eighteen degrees Celsius. Under these conditions of low temperature and restricted oxygen, metabolic activity in the seeds slows to near standstill, preserving viability for generations.",
      "The vault operates as a secure safety deposit box system. Nations and global gene banks deposit duplicates of their indigenous crop seeds while retaining sovereign ownership. If a local gene bank's collection is destroyed by disaster—as occurred during the devastating Syrian Civil War in Aleppo—the institution can withdraw its backup samples from Svalbard to re-establish vital seed lines.",
      "Currently safeguarding over one million distinct crop seed varieties representing virtually every nation on Earth, the Svalbard Global Seed Vault embodies international solidarity. It represents a shared promise from present civilization that future generations will always inherit the botanical wealth needed to feed humanity."
    ],
    "vocabularyHints": [
      {
        "word": "archipelago",
        "translation": "ארכיפלג (קבוצת איים)"
      },
      {
        "word": "citadel",
        "translation": "מצודה"
      },
      {
        "word": "permafrost",
        "translation": "קרקע קפואת-עד (פרמפרוסט)"
      },
      {
        "word": "viability",
        "translation": "כושר חיות / שרידות"
      },
      {
        "word": "sovereign",
        "translation": "ריבוני"
      },
      {
        "word": "solidarity",
        "translation": "סולידריות / ערבות הדדית"
      }
    ],
    "questions": [
      {
        "id": "story-level3-15-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where is the Svalbard Global Seed Vault located?",
        "options": [
          "In Greenland",
          "On a Norwegian archipelago 1,300 km from the North Pole",
          "In the Swiss Alps",
          "In Antarctica"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהכספת ממוקמת בארכיפלג סוואלברד הנורווגי, 1,300 ק\"מ מהקוטב הצפוני.",
        "points": 10
      },
      {
        "id": "story-level3-15-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that lists catastrophic threats the vault was established to safeguard against.",
        "correctIndex": 0,
        "targetSentence": "Often colloquially termed the 'Doomsday Vault,' this underground citadel was established in 2008 to safeguard global crop diversity against catastrophic threats, including nuclear war, climate change, pandemics, and civil instability.",
        "explanationHebrew": "המשפט המדויק הוא: Often colloquially termed the 'Doomsday Vault,' this underground citadel was established in 2008 to safeguard global crop diversity against catastrophic threats, including nuclear war, climate change, pandemics, and civil instability.",
        "points": 10
      },
      {
        "id": "story-level3-15-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "How deep into Mount Platåberget is the seed facility tunneled?",
        "correctIndex": 0,
        "modelAnswer": "One hundred and thirty meters into solid sandstone permafrost.",
        "keywords": [
          "one hundred and thirty",
          "130 meters",
          "permafrost"
        ],
        "explanationHebrew": "בפסקה 2 כתוב שהמתקן חצוב 130 מטרים לתוך ההר (one hundred and thirty meters).",
        "points": 10
      },
      {
        "id": "story-level3-15-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What keeps the seeds frozen if all electrical cooling equipment fails?",
        "options": [
          "Liquid nitrogen tanks",
          "The naturally sub-zero Arctic permafrost",
          "Giant ice cubes",
          "Cold ocean water"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מוסבר שקרקע הקרח הטבעית של הקוטב (permafrost) שומרת על טמפרטורה מתחת לאפס באופן טבעי.",
        "points": 10
      },
      {
        "id": "story-level3-15-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that states the optimal refrigerated preservation temperature of the vault.",
        "correctIndex": 0,
        "targetSentence": "The facility is refrigerated to an optimal preservation temperature of minus eighteen degrees Celsius.",
        "explanationHebrew": "המשפט המדויק הוא: The facility is refrigerated to an optimal preservation temperature of minus eighteen degrees Celsius.",
        "points": 10
      },
      {
        "id": "story-level3-15-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What happens to seed metabolic activity under low temperature and restricted oxygen?",
        "correctIndex": 0,
        "modelAnswer": "Metabolic activity slows to near standstill, preserving seed viability.",
        "keywords": [
          "slows",
          "standstill",
          "metabolic activity",
          "viability"
        ],
        "explanationHebrew": "בפסקה 3 מוסבר שחילוף החומרים של הזרעים מאט עד כמעט עצירה מוחלטת (slows to near standstill).",
        "points": 10
      },
      {
        "id": "story-level3-15-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What historical example of a seed withdrawal occurred after collection destruction?",
        "options": [
          "During the Tokyo tsunami",
          "During the Syrian Civil War in Aleppo",
          "During the Chernobyl disaster",
          "During floods in New Orleans"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוזכרת מלחמת האזרחים בסוריה בחלב (during the devastating Syrian Civil War in Aleppo).",
        "points": 10
      },
      {
        "id": "story-level3-15-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that explains the vault safety deposit box system.",
        "correctIndex": 0,
        "targetSentence": "The vault operates as a secure safety deposit box system.",
        "explanationHebrew": "המשפט המדויק הוא: The vault operates as a secure safety deposit box system.",
        "points": 10
      },
      {
        "id": "story-level3-15-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "Approximately how many distinct crop seed varieties are currently safeguarded in the vault?",
        "correctIndex": 0,
        "modelAnswer": "Over one million distinct crop seed varieties.",
        "keywords": [
          "one million",
          "1 million",
          "varieties"
        ],
        "explanationHebrew": "בפסקה 5 מצוין מעל מיליון זנים נפרדים של זרעים (over one million distinct crop seed varieties).",
        "points": 10
      },
      {
        "id": "story-level3-15-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What shared promise does the Svalbard Seed Vault embody for humanity?",
        "options": [
          "That seeds will be sold for high prices",
          "That future generations will inherit the botanical wealth needed to feed humanity",
          "That humans will not need agriculture",
          "That all food will be synthetic"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שזהו הבטחה משותפת שדורות העתיד יירשו את העושר הבוטני הדרוש להזנת האנושות.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-16",
    "title": "The Psychology of Decision-Making and Cognitive Biases",
    "hebrewTitle": "פסיכולוגיה של קבלת החלטות והטיות קוגניטיביות",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "For generations, classical economic theory rested on the elegant postulate of 'Homo economicus'—the assumption that human beings are rational agents who systematically calculate costs, benefits, and statistical probabilities before arriving at optimal decisions. However, pioneering research in behavioral economics, led by Israeli-American psychologists Daniel Kahneman and Amos Tversky, dismantled this foundational myth, demonstrating that human choices are systematically shaped by predictable cognitive biases and mental shortcuts.",
      "In his groundbreaking work, Kahneman proposed a dual-process model of human cognition: System 1 and System 2. System 1 operates automatically, effortlessly, and rapidly, relying on associative instincts, emotional gut reactions, and pattern recognition. In contrast, System 2 is deliberate, analytical, and computationally demanding, requiring focused mental effort. Because the brain seeks to conserve finite metabolic energy, System 1 handles the overwhelming majority of daily decisions, frequently introducing systematic errors into human judgment.",
      "Among the most pervasive of these heuristics is confirmation bias. Humans exhibit a powerful psychological tendency to seek out, overvalue, and remember information that corroborates pre-existing hypotheses while discounting or ignoring contradictory evidence. In an era dominated by hyper-personalized social media algorithms that reinforce individual viewpoints, confirmation bias fuels echo chambers and ideological polarization.",
      "Another profound distortion is loss aversion, described by prospect theory. Neurological and behavioral experiments reveal that the psychological pain of losing one hundred dollars is approximately twice as intense as the joy of gaining an equivalent sum. This deep-seated asymmetry causes individuals to irrationally cling to failing investments, avoid calculated risks, and resist necessary social reforms out of fear of potential loss.",
      "Recognizing cognitive biases does not eliminate them, but it provides vital metacognitive humility. By establishing structured institutional guardrails, encouraging diverse multidisciplinary dissent, and pausing to activate deliberate System 2 scrutiny, individuals and societies can navigate complex twenty-first-century challenges with greater intellectual clarity."
    ],
    "vocabularyHints": [
      {
        "word": "postulate",
        "translation": "הנחת יסוד"
      },
      {
        "word": "heuristics",
        "translation": "יוריסטיקות (קיצורי דרך מחשבתיים)"
      },
      {
        "word": "corroborates",
        "translation": "מאמת / מחזק השערה"
      },
      {
        "word": "asymmetry",
        "translation": "אסימטריה (אי-שוויון בצדדים)"
      },
      {
        "word": "prospect theory",
        "translation": "תורת הערך (של כהנמן וטברסקי)"
      },
      {
        "word": "metacognitive",
        "translation": "מטא-קוגניטיבי (חשיבה על החשיבה)"
      }
    ],
    "questions": [
      {
        "id": "story-level3-16-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What classical economic assumption did Kahneman and Tversky dismantle?",
        "options": [
          "That money is the root of all evil",
          "That humans are rational agents systematically calculating optimal decisions",
          "That trade between nations causes inflation",
          "That gold is better than paper currency"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 מוסבר שהם הפריכו את ההנחה הקלאסית שבני אדם הם יצורים רציונליים לחלוטין (Homo economicus).",
        "points": 10
      },
      {
        "id": "story-level3-16-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that names the two Israeli-American researchers who led behavioral economics.",
        "correctIndex": 0,
        "targetSentence": "However, pioneering research in behavioral economics, led by Israeli-American psychologists Daniel Kahneman and Amos Tversky, dismantled this foundational myth, demonstrating that human choices are systematically shaped by predictable cognitive biases and mental shortcuts.",
        "explanationHebrew": "המשפט המדויק הוא: However, pioneering research in behavioral economics, led by Israeli-American psychologists Daniel Kahneman and Amos Tversky, dismantled this foundational myth, demonstrating that human choices are systematically shaped by predictable cognitive biases and mental shortcuts.",
        "points": 10
      },
      {
        "id": "story-level3-16-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "How does System 1 operate according to Kahneman's dual-process model?",
        "correctIndex": 0,
        "modelAnswer": "It operates automatically, effortlessly, and rapidly, relying on associative instincts.",
        "keywords": [
          "automatically",
          "effortlessly",
          "rapidly",
          "instincts"
        ],
        "explanationHebrew": "בפסקה 2 מוסבר שמערכת 1 פועלת אוטומטית, במהירות וללא מאמץ על בסיס אינסטינקטים אסוציאטיביים.",
        "points": 10
      },
      {
        "id": "story-level3-16-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "Why does System 1 handle the overwhelming majority of daily decisions?",
        "options": [
          "Because System 2 is broken",
          "Because the brain seeks to conserve finite metabolic energy",
          "Because humans never think carefully",
          "Because sleep disables System 2"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מוסבר שהמוח מבקש לחסוך באנרגיה מטבולית מוגבלת (conserve finite metabolic energy).",
        "points": 10
      },
      {
        "id": "story-level3-16-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that defines confirmation bias.",
        "correctIndex": 0,
        "targetSentence": "Humans exhibit a powerful psychological tendency to seek out, overvalue, and remember information that corroborates pre-existing hypotheses while discounting or ignoring contradictory evidence.",
        "explanationHebrew": "המשפט המדויק הוא: Humans exhibit a powerful psychological tendency to seek out, overvalue, and remember information that corroborates pre-existing hypotheses while discounting or ignoring contradictory evidence.",
        "points": 10
      },
      {
        "id": "story-level3-16-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What does confirmation bias fuel in the era of personalized algorithms?",
        "correctIndex": 0,
        "modelAnswer": "It fuels echo chambers and ideological polarization.",
        "keywords": [
          "echo chambers",
          "polarization",
          "ideological"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שהטיית האישוש מזינה תיבות תהודה וקיטוב אידאולוגי (echo chambers and ideological polarization).",
        "points": 10
      },
      {
        "id": "story-level3-16-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "According to prospect theory, how intense is the pain of losing money compared to gaining an equal sum?",
        "options": [
          "Half as intense",
          "Equal in intensity",
          "Approximately twice as intense",
          "Ten times less intense"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 4 מוסבר שכאב ההפסד עז פי שניים לערך משמחת הרווח של סכום שווה (approximately twice as intense).",
        "points": 10
      },
      {
        "id": "story-level3-16-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes what loss aversion causes individuals to do.",
        "correctIndex": 0,
        "targetSentence": "This deep-seated asymmetry causes individuals to irrationally cling to failing investments, avoid calculated risks, and resist necessary social reforms out of fear of potential loss.",
        "explanationHebrew": "המשפט המדויק הוא: This deep-seated asymmetry causes individuals to irrationally cling to failing investments, avoid calculated risks, and resist necessary social reforms out of fear of potential loss.",
        "points": 10
      },
      {
        "id": "story-level3-16-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What does recognizing cognitive biases provide according to paragraph 5?",
        "correctIndex": 0,
        "modelAnswer": "It provides vital metacognitive humility.",
        "keywords": [
          "metacognitive humility",
          "humility"
        ],
        "explanationHebrew": "בפסקה 5 מצוינת צניעות מטא-קוגניטיבית חיונית (vital metacognitive humility).",
        "points": 10
      },
      {
        "id": "story-level3-16-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "How can societies make better decisions despite cognitive biases?",
        "options": [
          "By banning computers",
          "By establishing structured institutional guardrails and activating deliberate System 2 scrutiny",
          "By relying strictly on emotional instincts",
          "By letting algorithms make all choices"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שיש להקים סייגים מוסדיים מובנים ולהפעיל ביקורת מודעת של מערכת 2.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-17",
    "title": "The Indestructible Tardigrade",
    "hebrewTitle": "דובון המים: השורד האולטימטיבי",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "Measuring less than one millimeter in length and resembling microscopic eight-legged bears or plump vacuum bags, tardigrades (popularly known as 'water bears') are unassuming inhabitants of mossy damp soil worldwide. Despite their diminutive size and comical lumbering gait, these microscopic invertebrates hold the indisputable title of Earth's most resilient organisms.",
      "Tardigrades have survived all five major planetary mass extinctions, including the asteroid impact that wiped out the dinosaurs sixty-six million years ago. While most complex organisms perish when ambient temperatures deviate by a few degrees, tardigrades can endure temperatures plunging to minus two hundred and seventy-two degrees Celsius—just one degree above absolute zero—as well as boiling heat exceeding one hundred and fifty degrees.",
      "The biological secret behind this extraordinary invulnerability is an extreme physiological state known as cryptobiosis. When confronted with total dehydration, a tardigrade expels ninety-nine percent of the water from its body, retracts its eight clawed legs, and curls into a desiccated, shriveled bead called a 'tun.' In this state, its metabolic activity grinds to a complete standstill—zero detectable biological metabolism.",
      "During cryptobiosis, specialized intrinsically disordered proteins unique to tardigrades transform into a biological glass-like matrix that encases cellular membranes, preventing proteins and genetic sequences from denaturing. Furthermore, tardigrades possess a unique radiation-suppressing protein called Dsup, which shields their DNA from cosmic radiation doses more than one thousand times lethal to humans.",
      "In 2007, European space scientists launched desiccated tardigrades into low Earth orbit aboard the FOTON-M3 mission, exposing them directly to the cold vacuum and solar ultraviolet radiation of open space. Remarkably, upon rehydration back on Earth, the creatures woke up, walked around, and reproduced normally. Understanding tardigrade resilience holds tantalizing potential for stabilizing vaccines without refrigeration and engineering drought-resistant crops."
    ],
    "vocabularyHints": [
      {
        "word": "diminutive",
        "translation": "זעיר ממדים"
      },
      {
        "word": "cryptobiosis",
        "translation": "קריפטוביוזה (מצב חיות מושהית / 'אל-מוות')"
      },
      {
        "word": "desiccated",
        "translation": "מיובש לחלוטין"
      },
      {
        "word": "denaturing",
        "translation": "דנטורציה (הרס מבנה החלבון)"
      },
      {
        "word": "rehydration",
        "translation": "החזרת נוזלים (הרטבה מחדש)"
      },
      {
        "word": "tantalizing",
        "translation": "מפתה ומעורר עניין רב"
      }
    ],
    "questions": [
      {
        "id": "story-level3-17-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What is the common popular nickname for tardigrades?",
        "options": [
          "Sea monkeys",
          "Water bears",
          "Dust mites",
          "Glass shrimp"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהם מכונים באופן פופולרי דובוני מים (water bears).",
        "points": 10
      },
      {
        "id": "story-level3-17-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes the appearance and size of tardigrades.",
        "correctIndex": 0,
        "targetSentence": "Measuring less than one millimeter in length and resembling microscopic eight-legged bears or plump vacuum bags, tardigrades (popularly known as 'water bears') are unassuming inhabitants of mossy damp soil worldwide.",
        "explanationHebrew": "המשפט המדויק הוא: Measuring less than one millimeter in length and resembling microscopic eight-legged bears or plump vacuum bags, tardigrades (popularly known as 'water bears') are unassuming inhabitants of mossy damp soil worldwide.",
        "points": 10
      },
      {
        "id": "story-level3-17-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "How cold can tardigrades endure without dying?",
        "correctIndex": 0,
        "modelAnswer": "Temperatures plunging to minus two hundred and seventy-two degrees Celsius.",
        "keywords": [
          "minus two hundred and seventy-two",
          "-272",
          "Celsius",
          "degrees"
        ],
        "explanationHebrew": "בפסקה 2 מצוין קור קיצוני של מינוס 272 מעלות צלזיוס (minus two hundred and seventy-two degrees Celsius).",
        "points": 10
      },
      {
        "id": "story-level3-17-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "How many major planetary mass extinctions have tardigrades survived?",
        "options": [
          "One",
          "Three",
          "All five major planetary mass extinctions",
          "None"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 2 כתוב שהם שרדו את כל חמשת אירועי ההכחדה ההמוניים הגדולים בכדור הארץ.",
        "points": 10
      },
      {
        "id": "story-level3-17-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that names the physiological state of suspended animation.",
        "correctIndex": 0,
        "targetSentence": "The biological secret behind this extraordinary invulnerability is an extreme physiological state known as cryptobiosis.",
        "explanationHebrew": "המשפט המדויק הוא: The biological secret behind this extraordinary invulnerability is an extreme physiological state known as cryptobiosis.",
        "points": 10
      },
      {
        "id": "story-level3-17-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What is the desiccated, shriveled bead called when a tardigrade enters cryptobiosis?",
        "correctIndex": 0,
        "modelAnswer": "It is called a 'tun'.",
        "keywords": [
          "tun"
        ],
        "explanationHebrew": "בפסקה 3 מצוין שהגוף המיובש נקרא tun.",
        "points": 10
      },
      {
        "id": "story-level3-17-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What is the name of the unique protein that shields tardigrade DNA from lethal radiation?",
        "options": [
          "Collagen",
          "Hemoglobin",
          "Dsup (damage suppressor)",
          "Keratin"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 4 מוזכר החלבון Dsup המגן על ה-DNA מפני קרינה קוסמית.",
        "points": 10
      },
      {
        "id": "story-level3-17-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes how the biological glass matrix protects cellular membranes.",
        "correctIndex": 0,
        "targetSentence": "During cryptobiosis, specialized intrinsically disordered proteins unique to tardigrades transform into a biological glass-like matrix that encases cellular membranes, preventing proteins and genetic sequences from denaturing.",
        "explanationHebrew": "המשפט המדויק הוא: During cryptobiosis, specialized intrinsically disordered proteins unique to tardigrades transform into a biological glass-like matrix that encases cellular membranes, preventing proteins and genetic sequences from denaturing.",
        "points": 10
      },
      {
        "id": "story-level3-17-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What happened when space-exposed tardigrades were rehydrated back on Earth in 2007?",
        "correctIndex": 0,
        "modelAnswer": "They woke up, walked around, and reproduced normally.",
        "keywords": [
          "woke up",
          "walked",
          "reproduced",
          "normally"
        ],
        "explanationHebrew": "בפסקה 5 כתוב שהם התעוררו, התהלכו והתרבו כרגיל (woke up, walked around, and reproduced normally).",
        "points": 10
      },
      {
        "id": "story-level3-17-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What potential medical and agricultural applications does tardigrade science offer?",
        "options": [
          "Growing larger bears",
          "Stabilizing vaccines without refrigeration and engineering drought-resistant crops",
          "Making plastic softer",
          "Mining asteroids"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שהמדע מאפשר ייצוב חיסונים ללא קירור והנדסת גידולים חקלאיים עמידים לבצורת.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-18",
    "title": "The Evolution of Human Script: From Clay to Digital Code",
    "hebrewTitle": "תולדות הכתב: מלוחות חרס לקוד דיגיטלי",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "The invention of writing stands as humanity's most transformative intellectual breakthrough, liberating human memory from biological constraints. Before script, all accumulated human wisdom, genealogy, law, and poetry depended entirely on oral transmission, vulnerable to distortion and oblivion. The emergence of script allowed human thoughts to transcend the physical boundaries of space and time.",
      "The earliest known systematic writing system arose around 3200 BCE in southern Mesopotamia among the Sumerians. Known as cuneiform, it evolved not for philosophical contemplation, but for pragmatic economic bookkeeping. Accountants pressed wedge-shaped reed styluses into moist clay tablets to record barley rations, livestock inventories, and temple taxes. When baked in the sun, these clay records became permanent historical archives.",
      "A monumental intellectual revolution occurred in the Sinai Peninsula and Canaan around 1800 BCE: the invention of the phonetic alphabet (Proto-Sinaitic). Earlier Egyptian hieroglyphics and Sumerian cuneiform required mastering hundreds of complex pictographic symbols, restricting literacy to an elite caste of professional scribes. By assigning one phonetic sound to each symbol, the alphabet condensed language into approximately thirty versatile characters, democratizing literacy across society.",
      "In the fifteenth century, Johannes Gutenberg introduced movable type printing in Germany, accelerating the diffusion of knowledge and laying the foundation for the Scientific Revolution. Written text moved from hand-copied manuscripts to mass-produced paper books, unleashing democratic revolutions and universal public education.",
      "Today, written communication has entered the digital realm of binary code and Unicode. Text is encoded in microscopic electrical charges and fiber-optic light pulses traversing global networks in milliseconds. While the medium has evolved from damp Sumerian clay to glowing smartphone screens, writing remains our species' most sublime tool for preserving the human soul."
    ],
    "vocabularyHints": [
      {
        "word": "oblivion",
        "translation": "תהום הנשייה / שכחה מוחלטת"
      },
      {
        "word": "cuneiform",
        "translation": "כתב יתדות"
      },
      {
        "word": "phonetic",
        "translation": "פונטי (של צלילי הדיבור)"
      },
      {
        "word": "pictographic",
        "translation": "פיקטוגרפי (כתב המבוסס על ציורים)"
      },
      {
        "word": "diffusion",
        "translation": "הפצה / פעפוע"
      },
      {
        "word": "sublime",
        "translation": "נשגב ומרומם"
      }
    ],
    "questions": [
      {
        "id": "story-level3-18-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What made knowledge vulnerable before the invention of writing?",
        "options": [
          "Lack of paper",
          "Dependence on oral transmission, vulnerable to distortion and oblivion",
          "Wars destroyed all songs",
          "People had poor eyesight"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 מוסבר שכל הידע היה תלוי במסירה בעל-פה שהייתה פגיעה לשיבוש ולשכחה.",
        "points": 10
      },
      {
        "id": "story-level3-18-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes what the emergence of script allowed human thoughts to do.",
        "correctIndex": 0,
        "targetSentence": "The emergence of script allowed human thoughts to transcend the physical boundaries of space and time.",
        "explanationHebrew": "המשפט המדויק הוא: The emergence of script allowed human thoughts to transcend the physical boundaries of space and time.",
        "points": 10
      },
      {
        "id": "story-level3-18-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What was the original pragmatic purpose of Sumerian cuneiform?",
        "correctIndex": 0,
        "modelAnswer": "It evolved for pragmatic economic bookkeeping, recording barley rations, livestock, and taxes.",
        "keywords": [
          "economic bookkeeping",
          "bookkeeping",
          "barley",
          "taxes"
        ],
        "explanationHebrew": "בפסקה 2 מוסבר שהכתב נועד במקור להנהלת חשבונות כלכלית מעשית (economic bookkeeping).",
        "points": 10
      },
      {
        "id": "story-level3-18-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What medium did Sumerian accountants press wedge-shaped styluses into?",
        "options": [
          "Papyrus sheets",
          "Moist clay tablets",
          "Animal parchment",
          "Carved marble"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהם לחצו את החרט לתוך לוחות טיט לחים (moist clay tablets).",
        "points": 10
      },
      {
        "id": "story-level3-18-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that explains why earlier hieroglyphics restricted literacy to an elite caste.",
        "correctIndex": 0,
        "targetSentence": "Earlier Egyptian hieroglyphics and Sumerian cuneiform required mastering hundreds of complex pictographic symbols, restricting literacy to an elite caste of professional scribes.",
        "explanationHebrew": "המשפט המדויק הוא: Earlier Egyptian hieroglyphics and Sumerian cuneiform required mastering hundreds of complex pictographic symbols, restricting literacy to an elite caste of professional scribes.",
        "points": 10
      },
      {
        "id": "story-level3-18-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "How did the invention of the phonetic alphabet democratize literacy?",
        "correctIndex": 0,
        "modelAnswer": "By assigning one sound to each symbol, condensing language into approximately thirty versatile characters.",
        "keywords": [
          "one sound",
          "thirty characters",
          "democratizing",
          "phonetic"
        ],
        "explanationHebrew": "בפסקה 3 מוסבר שהאלפבית הצמיד צליל אחד לכל סימן וצמצם את השפה לכ-30 תווים פשוטים.",
        "points": 10
      },
      {
        "id": "story-level3-18-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What technological invention did Johannes Gutenberg introduce in the fifteenth century?",
        "options": [
          "The typewriter",
          "Movable type printing",
          "Ballpoint pens",
          "Digital scanners"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוזכר דפוס אותיות הבלט הנעות (movable type printing).",
        "points": 10
      },
      {
        "id": "story-level3-18-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that connects Gutenberg printing to historical transformations.",
        "correctIndex": 0,
        "targetSentence": "In the fifteenth century, Johannes Gutenberg introduced movable type printing in Germany, accelerating the diffusion of knowledge and laying the foundation for the Scientific Revolution.",
        "explanationHebrew": "המשפט המדויק הוא: In the fifteenth century, Johannes Gutenberg introduced movable type printing in Germany, accelerating the diffusion of knowledge and laying the foundation for the Scientific Revolution.",
        "points": 10
      },
      {
        "id": "story-level3-18-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "How is digital text encoded and transmitted in the modern era?",
        "correctIndex": 0,
        "modelAnswer": "In binary code and microscopic electrical charges and fiber-optic light pulses.",
        "keywords": [
          "binary code",
          "electrical charges",
          "fiber-optic",
          "light pulses"
        ],
        "explanationHebrew": "בפסקה 5 מוסבר שהטקסט מקודד בקוד בינארי, מטענים חשמליים ופולסים של סיבים אופטיים.",
        "points": 10
      },
      {
        "id": "story-level3-18-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What does the author conclude writing remains for our species?",
        "options": [
          "An outdated communication method",
          "Our species' most sublime tool for preserving the human soul",
          "A tool strictly for commerce",
          "A temporary phase of civilization"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שהכתב נותר הכלי הנשגב ביותר של מיננו לשימור נשמת האדם.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-19",
    "title": "Vertical Agriculture: Transforming Food Production",
    "hebrewTitle": "חקלאות אנכית: מהפכת ייצור המזון",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "By 2050, the global human population is projected to eclipse nine point seven billion, requiring a sixty percent increase in global food production. Concurrently, traditional horizontal agriculture already claims nearly forty percent of Earth's arable land, accounts for seventy percent of global freshwater withdrawals, and generates massive greenhouse gas emissions. Confronted with climate instability and dwindling topsoil, visionary agronomists are looking upwards, replacing sprawling farmland with high-tech vertical farms.",
      "Vertical farming operates inside sealed, climate-controlled indoor environments where crops are cultivated on stacked modular shelving towers reaching tens of meters high. Instead of natural sunlight, plants receive tailored light recipes from energy-efficient light-emitting diodes (LEDs). By fine-tuning red and blue wavelengths, growers can optimize photosynthetic efficiency, accelerating growth cycles to produce harvest yields up to thirty times higher per square meter than conventional outdoor fields.",
      "Equally revolutionary is the elimination of soil. Most vertical farms utilize aeroponic or closed-loop hydroponic systems. In aeroponics, plant roots hang suspended in air while automated misting nozzles spray them with nutrient-rich mineral mists every few minutes. Water that drains off is captured, purified, and recirculated, slashing water consumption by ninety-five percent compared to traditional field irrigation.",
      "Furthermore, the fully enclosed environment eliminates the need for chemical pesticides, herbicides, and insecticides. Crops grow free of synthetic toxins, shielded from droughts, hailstorms, and seasonal blights. Situated directly inside dense metropolitan areas, vertical facilities eliminate thousands of kilometers of food transport ('food miles'), delivering crisp, freshly picked greens to local supermarkets within hours of harvest.",
      "While high capital costs and substantial electricity demands remain challenges, integrating vertical farms with renewable wind and solar power is making urban agricultural ecosystems economically viable. Vertical agriculture proves that humanity can sustainably nourish burgeoning megacities while returning millions of acres of farmland back to wild natural forests."
    ],
    "vocabularyHints": [
      {
        "word": "arable",
        "translation": "ראוי לעיבוד חקלאי"
      },
      {
        "word": "agronomists",
        "translation": "אגרונומים (מדעני חקלאות)"
      },
      {
        "word": "aeroponic",
        "translation": "אירופוני (גידול שורשים באוויר מרוסס בערפל מזין)"
      },
      {
        "word": "blights",
        "translation": "מחלות ומגפות צמחים"
      },
      {
        "word": "food miles",
        "translation": "קילומטרז' מזון (מרחק שינוע המזון מהשדה לצרכן)"
      },
      {
        "word": "burgeoning",
        "translation": "צומח במהירות"
      }
    ],
    "questions": [
      {
        "id": "story-level3-19-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What percentage of global freshwater withdrawals is consumed by traditional horizontal agriculture?",
        "options": [
          "Twenty percent",
          "Forty percent",
          "Seventy percent",
          "Ninety-five percent"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 1 כתוב שהחקלאות המסורתית אחראית ל-70 אחוזים משאיבות המים המתוקים בעולם (seventy percent).",
        "points": 10
      },
      {
        "id": "story-level3-19-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that projects human population and food requirements by 2050.",
        "correctIndex": 0,
        "targetSentence": "By 2050, the global human population is projected to eclipse nine point seven billion, requiring a sixty percent increase in global food production.",
        "explanationHebrew": "המשפט המדויק הוא: By 2050, the global human population is projected to eclipse nine point seven billion, requiring a sixty percent increase in global food production.",
        "points": 10
      },
      {
        "id": "story-level3-19-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "How much higher can crop yields be per square meter in vertical farms compared to outdoor fields?",
        "correctIndex": 0,
        "modelAnswer": "Harvest yields can be up to thirty times higher per square meter.",
        "keywords": [
          "thirty times",
          "30 times",
          "yields"
        ],
        "explanationHebrew": "בפסקה 2 כתוב שהתנובה יכולה להיות עד פי שלושים למטר מרובע (up to thirty times higher).",
        "points": 10
      },
      {
        "id": "story-level3-19-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "Which specific light wavelengths are fine-tuned to maximize photosynthetic efficiency?",
        "options": [
          "Green and yellow",
          "Red and blue",
          "Ultraviolet only",
          "Infrared only"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מצוינים אורכי הגל האדומים והכחולים (red and blue wavelengths).",
        "points": 10
      },
      {
        "id": "story-level3-19-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that describes how plant roots are nourished in aeroponics.",
        "correctIndex": 0,
        "targetSentence": "In aeroponics, plant roots hang suspended in air while automated misting nozzles spray them with nutrient-rich mineral mists every few minutes.",
        "explanationHebrew": "המשפט המדויק הוא: In aeroponics, plant roots hang suspended in air while automated misting nozzles spray them with nutrient-rich mineral mists every few minutes.",
        "points": 10
      },
      {
        "id": "story-level3-19-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "By what percentage does recirculating water slash water consumption?",
        "correctIndex": 0,
        "modelAnswer": "It slashes water consumption by ninety-five percent.",
        "keywords": [
          "ninety-five percent",
          "95%",
          "water consumption"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שצריכת המים מצטמצמת ב-95 אחוזים (ninety-five percent).",
        "points": 10
      },
      {
        "id": "story-level3-19-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "Why are chemical pesticides and herbicides unnecessary in vertical farms?",
        "options": [
          "Plants are genetically modified to be poisonous",
          "The fully enclosed environment keeps out pests and blights",
          "Bugs cannot climb vertical shelves",
          "Water washes away all insects"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוסבר שהסביבה הסגורה לחלוטין מונעת חדירת מזיקים ומחלות ומייתרת שימוש בחומרי הדברה.",
        "points": 10
      },
      {
        "id": "story-level3-19-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that explains how urban location reduces 'food miles'.",
        "correctIndex": 0,
        "targetSentence": "Situated directly inside dense metropolitan areas, vertical facilities eliminate thousands of kilometers of food transport ('food miles'), delivering crisp, freshly picked greens to local supermarkets within hours of harvest.",
        "explanationHebrew": "המשפט המדויק הוא: Situated directly inside dense metropolitan areas, vertical facilities eliminate thousands of kilometers of food transport ('food miles'), delivering crisp, freshly picked greens to local supermarkets within hours of harvest.",
        "points": 10
      },
      {
        "id": "story-level3-19-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What two clean energy sources help make vertical farms economically viable?",
        "correctIndex": 0,
        "modelAnswer": "Renewable wind and solar power.",
        "keywords": [
          "wind",
          "solar",
          "renewable"
        ],
        "explanationHebrew": "בפסקה 5 מצוינות אנרגיות רוח ושמש מתחדשות (wind and solar power).",
        "points": 10
      },
      {
        "id": "story-level3-19-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What environmental opportunity arises from vertical agriculture according to the conclusion?",
        "options": [
          "Building taller skyscrapers",
          "Returning millions of acres of farmland back to wild natural forests",
          "Stopping all rainfall",
          "Replacing fresh vegetables with pills"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שניתן להחזיר מיליוני דונמים של שטחים חקלאיים לטובת יערות טבעיים פראיים.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level3-20",
    "title": "The James Webb Space Telescope: Unveiling Cosmic Dawn",
    "hebrewTitle": "טלסקופ החלל ג'יימס ווב: פענוח שחר היקום",
    "level": "Level 3",
    "levelLabel": "רמה 3 - קוראים מיומנים",
    "levelDescription": "Advanced level English, complex sentences and rich vocabulary.",
    "paragraphs": [
      "On Christmas Day 2021, an Ariane 5 rocket roared into the skies above French Guiana carrying the most complex and audacious scientific instrument ever built: the James Webb Space Telescope (JWST). A collaborative masterpiece developed by NASA, the European Space Agency, and the Canadian Space Agency, Webb was designed to succeed the legendary Hubble Space Telescope and peer deeper into the origins of our cosmos than ever before.",
      "Unlike Hubble, which orbits a few hundred kilometers above Earth and captures primarily visible light, Webb operates one and a half million kilometers away at the second Sun-Earth Lagrange point (L2). In this gravitationally stable orbit, Webb travels with Earth around the Sun. To protect its delicate infrared detectors from the blistering heat of the Sun, Earth, and Moon, Webb unfurled a five-layer tennis-court-sized sunshield made of reflective Kapton, cooling its science instruments to minus two hundred and thirty-three degrees Celsius.",
      "Webb's primary mirror is an engineering marvel spanning six and a half meters across. Because no rocket fairing could hold a mirror that wide, the mirror was built as eighteen hexagonal segments crafted from ultra-lightweight beryllium and coated with a microscopically thin layer of pure vaporized gold. The gold coating maximizes the reflection of infrared light wavelengths, allowing the telescope to detect faint thermal signals that have traveled across the universe for over thirteen billion years.",
      "Infrared astronomy is essential because cosmic expansion stretches starlight into longer, redder wavelengths—a phenomenon called cosmological redshift. Furthermore, infrared light penetrates dense cosmic dust clouds that obscure optical telescopes. Webb can pierce through opaque interstellar stellar nurseries, observing newborn stars and planetary disks as they coalesce into solar systems.",
      "In its opening years of operations, Webb has stunned astrophysicists by discovering massive, fully formed galaxies that existed just three hundred million years after the Big Bang, challenging existing theories of cosmic evolution. By analyzing the atmospheres of distant exoplanets for signatures of water, methane, and carbon dioxide, the James Webb Space Telescope brings humanity to the threshold of discovering whether we are alone in the universe."
    ],
    "vocabularyHints": [
      {
        "word": "audacious",
        "translation": "נועז ביותר"
      },
      {
        "word": "infrared",
        "translation": "אינפרא-אדום (תת-אדום)"
      },
      {
        "word": "beryllium",
        "translation": "בריליום (מתכת קלה וחזקה במיוחד)"
      },
      {
        "word": "redshift",
        "translation": "הסחה לאדום (התארכות אורך גל האור עקב התפשטות היקום)"
      },
      {
        "word": "coalesce",
        "translation": "מתמזגים / מתגבשים"
      },
      {
        "word": "exoplanets",
        "translation": "אקסו-פלנטות (כוכבי לכת מחוץ למערכת השמש)"
      }
    ],
    "questions": [
      {
        "id": "story-level3-20-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "When was the James Webb Space Telescope launched into space?",
        "options": [
          "July 1990",
          "Christmas Day 2021",
          "January 2015",
          "August 2023"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהטלסקופ שוגר ביום חג המולד 2021 (On Christmas Day 2021).",
        "points": 10
      },
      {
        "id": "story-level3-20-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that lists the space agencies collaborating on Webb.",
        "correctIndex": 0,
        "targetSentence": "A collaborative masterpiece developed by NASA, the European Space Agency, and the Canadian Space Agency, Webb was designed to succeed the legendary Hubble Space Telescope and peer deeper into the origins of our cosmos than ever before.",
        "explanationHebrew": "המשפט המדויק הוא: A collaborative masterpiece developed by NASA, the European Space Agency, and the Canadian Space Agency, Webb was designed to succeed the legendary Hubble Space Telescope and peer deeper into the origins of our cosmos than ever before.",
        "points": 10
      },
      {
        "id": "story-level3-20-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "Where does Webb operate in space relative to Earth?",
        "correctIndex": 0,
        "modelAnswer": "One and a half million kilometers away at the second Sun-Earth Lagrange point (L2).",
        "keywords": [
          "Lagrange point",
          "L2",
          "one and a half million",
          "1.5 million"
        ],
        "explanationHebrew": "בפסקה 2 מוסבר שווב פועל במרחק מיליון וחצי ק\"מ מחוץ לכדור הארץ בנקודת לגרנז' השנייה (L2).",
        "points": 10
      },
      {
        "id": "story-level3-20-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What protects Webb detectors from the blistering heat of the Sun, Earth, and Moon?",
        "options": [
          "A lead refrigerator",
          "A five-layer tennis-court-sized sunshield made of Kapton",
          "Water tanks",
          "Solar panels"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מוסבר שמגן שמש עשוי חמש שכבות קפטון בגודל מגרש טניס מגן על הגלאים (five-layer tennis-court-sized sunshield).",
        "points": 10
      },
      {
        "id": "story-level3-20-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that describes the material and coating of the mirror segments.",
        "correctIndex": 0,
        "targetSentence": "Because no rocket fairing could hold a mirror that wide, the mirror was built as eighteen hexagonal segments crafted from ultra-lightweight beryllium and coated with a microscopically thin layer of pure vaporized gold.",
        "explanationHebrew": "המשפט המדויק הוא: Because no rocket fairing could hold a mirror that wide, the mirror was built as eighteen hexagonal segments crafted from ultra-lightweight beryllium and coated with a microscopically thin layer of pure vaporized gold.",
        "points": 10
      },
      {
        "id": "story-level3-20-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "Why was pure vaporized gold chosen to coat the mirror segments?",
        "correctIndex": 0,
        "modelAnswer": "Gold maximizes the reflection of infrared light wavelengths.",
        "keywords": [
          "reflection",
          "infrared",
          "gold",
          "wavelengths"
        ],
        "explanationHebrew": "בפסקה 3 מוסבר שהזהב ממקסם את החזרת אורכי הגל האינפרא-אדומים.",
        "points": 10
      },
      {
        "id": "story-level3-20-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What is the phenomenon called where cosmic expansion stretches starlight into longer, redder wavelengths?",
        "options": [
          "Cosmological redshift",
          "Stellar doppler inversion",
          "Quantum entanglement",
          "Black hole lensing"
        ],
        "correctIndex": 0,
        "explanationHebrew": "בפסקה 4 התופעה נקראת הסחה קוסמולוגית לאדום (cosmological redshift).",
        "points": 10
      },
      {
        "id": "story-level3-20-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes what infrared light can penetrate.",
        "correctIndex": 0,
        "targetSentence": "Furthermore, infrared light penetrates dense cosmic dust clouds that obscure optical telescopes.",
        "explanationHebrew": "המשפט המדויק הוא: Furthermore, infrared light penetrates dense cosmic dust clouds that obscure optical telescopes.",
        "points": 10
      },
      {
        "id": "story-level3-20-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "How soon after the Big Bang did the massive galaxies discovered by Webb exist?",
        "correctIndex": 0,
        "modelAnswer": "Just three hundred million years after the Big Bang.",
        "keywords": [
          "three hundred million",
          "300 million",
          "Big Bang"
        ],
        "explanationHebrew": "בפסקה 5 כתוב שהגלקסיות שנצפו התקיימו 300 מיליון שנה בלבד לאחר המפץ הגדול.",
        "points": 10
      },
      {
        "id": "story-level3-20-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What atmospheric signatures on distant exoplanets does Webb analyze to search for potential life?",
        "options": [
          "Nitrogen and helium only",
          "Water, methane, and carbon dioxide",
          "Sulfur and iron dust",
          "Chlorine and argon"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסיום נכתב שווב בודק חתימות של מים, מתאן ופחמן דו-חמצני (water, methane, and carbon dioxide).",
        "points": 10
      }
    ],
    "totalPoints": 100
  }
];
