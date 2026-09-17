export interface MSUnseenQuestion {
  id: string;
  number: number;
  paragraphIndex: number;
  linesHint?: string;
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
  level: "Level 1" | "Level 2" | "Level 3";
  levelLabel: string;
  levelDescription: string;
  paragraphs: string[];
  vocabularyHints: { word: string; translation: string }[];
  questions: MSUnseenQuestion[];
  totalPoints: number;
}

/**
 * Shuffles multiple-choice question options and balances correct answer positions across A (0), B (1), C (2), and D (3)
 * so questions don't have predictable answer keys or repetitive correct options.
 */
export function randomizeQuestionsOptions<T extends { type?: string; options?: string[]; correctIndex?: number }>(
  questions: T[]
): T[] {
  const mcqIndices: number[] = [];
  questions.forEach((q, idx) => {
    if (q.type === "mcq" && Array.isArray(q.options) && q.options.length >= 2) {
      mcqIndices.push(idx);
    }
  });

  if (mcqIndices.length === 0) return questions;

  // Create balanced target slots across 0..3 (A, B, C, D)
  const slots: number[] = [];
  for (let i = 0; i < mcqIndices.length; i++) {
    slots.push(i % 4);
  }
  // Shuffle the target slots using Fisher-Yates
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  let slotCounter = 0;
  return questions.map((q) => {
    if (q.type !== "mcq" || !Array.isArray(q.options) || q.options.length < 2) {
      return q;
    }

    const originalCorrectIndex =
      typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < q.options.length
        ? q.correctIndex
        : 0;

    const correctOptionText = q.options[originalCorrectIndex];
    // Filter distractors while preserving exact contents
    const distractors = q.options.filter((_, idx) => idx !== originalCorrectIndex);

    // Shuffle distractors
    for (let i = distractors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
    }

    // Assign target slot
    const targetSlot = Math.min(slots[slotCounter++], q.options.length - 1);
    const newOptions: string[] = [];
    let distractorIdx = 0;
    for (let pos = 0; pos < q.options.length; pos++) {
      if (pos === targetSlot) {
        newOptions.push(correctOptionText);
      } else {
        newOptions.push(distractors[distractorIdx++] || "");
      }
    }

    return {
      ...q,
      options: newOptions,
      correctIndex: targetSlot,
    };
  });
}

export const MIDDLE_SCHOOL_UNSEENS: MSUnseenStory[] = [
  {
    "id": "story-level1-1",
    "title": "Max the Small Dog",
    "hebrewTitle": "מקס הכלב הקטן",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "Tom has a small dog.  The dog is white.  His name is Max.  Max has long ears and a short tail.  Tom likes Max very much.  Max is three years old.  Every day, Tom walks with Max.",
      "They walk near the big house.  Max sees a yellow cat.  He does not run after the cat.  Max is a good dog.  He stands next to Tom.  Tom gives Max a small cookie.  Max is happy.",
      "Max sleeps in a warm bed near the door. The bed is soft and brown. Every morning, Max runs to Tom's room. Max wakes Tom up because he wants to eat his food. Tom gets up from his bed. He walks to the kitchen. Tom puts dog food in a red bowl. Max eats his food fast. He drinks cold water from a blue bowl. Then, Max waits by the door.",
      "In the afternoon, Tom and Max play in the big garden.  Max runs after a red ball.  Max is very happy when he plays with Tom.  There are many green trees in the garden.  Tom throws the ball.",
      "Max runs and catches it.  He brings the ball back to Tom.  Tom says, 'Good dog, Max!'  They play for one hour.  Then, they go into the house to rest."
    ],
    "vocabularyHints": [
      {
        "word": "small",
        "translation": "קטן"
      },
      {
        "word": "tail",
        "translation": "זנב"
      },
      {
        "word": "near",
        "translation": "ליד"
      },
      {
        "word": "room",
        "translation": "חדר"
      },
      {
        "word": "wake up",
        "translation": "להתעורר"
      },
      {
        "word": "run after",
        "translation": "לרוץ אחרי"
      }
    ],
    "questions": [
      {
        "id": "story-level1-1-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What color is Max the dog?",
        "options": [
          "Red",
          "White",
          "Black",
          "Brown"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! בפסקה 1 כתוב שהכלב הוא לבן (white).",
        "points": 10
      },
      {
        "id": "story-level1-1-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "open",
        "prompt": "How old is Max?",
        "correctIndex": 0,
        "modelAnswer": "He is three years old.",
        "keywords": [
          "three",
          "years",
          "old"
        ],
        "explanationHebrew": "נכון מאוד! בפסקה 1 כתוב שמקס בן 3 (three years old).",
        "points": 10
      },
      {
        "id": "story-level1-1-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What does Max see near the big house?",
        "options": [
          "A green frog",
          "A yellow cat",
          "A red bird",
          "A white rabbit"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון! בפסקה 1 רשום שמקס רואה חתול צהוב (yellow cat).",
        "points": 10
      },
      {
        "id": "story-level1-1-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "Where does Tom put the dog food?",
        "options": [
          "In a blue bowl",
          "In a yellow bag",
          "In a red bowl",
          "On the brown floor"
        ],
        "correctIndex": 2,
        "explanationHebrew": "נכון מאוד! בפסקה 2 כתוב שטום שם את האוכל בקערה אדומה (red bowl).",
        "points": 10
      },
      {
        "id": "story-level1-1-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that tells us where Max sleeps.",
        "correctIndex": 0,
        "targetSentence": "Max sleeps in a warm bed near the door.",
        "explanationHebrew": "המשפט הנכון הוא: 'Max sleeps in a warm bed near the door.' (מקס ישן במיטה חמימה ליד הדלת).",
        "points": 10
      },
      {
        "id": "story-level1-1-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "open",
        "prompt": "What does Max run after in the garden?",
        "correctIndex": 0,
        "modelAnswer": "He runs after a red ball.",
        "keywords": [
          "ball",
          "red ball",
          "runs after"
        ],
        "explanationHebrew": "התשובה המוצעת היא שהוא רץ אחרי כדור אדום (runs after a red ball).",
        "points": 10
      },
      {
        "id": "story-level1-1-q7",
        "number": 7,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "copy",
        "prompt": "Copy the sentence that tells us how long Tom and Max play in the garden.",
        "correctIndex": 0,
        "targetSentence": "They play for one hour.",
        "explanationHebrew": "המשפט הנכון הוא: 'They play for one hour.' (הם משחקים במשך שעה אחת).",
        "points": 10
      },
      {
        "id": "story-level1-1-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is the main idea of this story?",
        "options": [
          "Tom and his dog Max",
          "How to build a garden",
          "Why dogs sleep a lot",
          "Tom's favorite colors"
        ],
        "correctIndex": 0,
        "explanationHebrew": "כל הכבוד! הסיפור עוסק כולו בטום ובכלב שלו, מקס.",
        "points": 10
      },
      {
        "id": "story-level1-1-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "Max sleeps in a warm bed near the door.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"Max sleeps in a warm bed near the door.\"",
        "points": 10
      },
      {
        "id": "story-level1-1-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about max the small dog and why it is important.",
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
    "id": "story-level1-2",
    "title": "Maya's Space Robot",
    "hebrewTitle": "רובוט החלל של מיה",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "Maya is eight years old.  She loves stars and planets.  Her father is an engineer.  For her birthday, he builds a small blue robot named Sparky.",
      "Sparky has two bright yellow eyes and small wheels.  Maya puts Sparky on her table.  Sparky says, 'Hello Maya, let's explore space!'  Maya is very excited.",
      "Every afternoon, Maya and Sparky learn about space together. Sparky shows colorful pictures of Mars and the Moon on the wall. Maya writes new English words in her green notebook. Sparky plays soft space music while Maya draws a big rocket. When Maya's mother enters the room, Sparky turns his lights green and says good evening.",
      "At night, Maya looks at the sky through her bedroom window.  Sparky stands on the window sill next to her.  They count five bright stars together.",
      "Maya dreams of traveling to Mars in a shiny white spaceship.  She smiles and goes to bed.  Sparky goes to sleep on his charging dock."
    ],
    "vocabularyHints": [
      {
        "word": "planets",
        "translation": "כוכבי לכת"
      },
      {
        "word": "engineer",
        "translation": "מהנדס"
      },
      {
        "word": "wheels",
        "translation": "גלגלים"
      },
      {
        "word": "rocket",
        "translation": "טיל / רקטה"
      },
      {
        "word": "charging dock",
        "translation": "עמדת טעינה"
      }
    ],
    "questions": [
      {
        "id": "story-level1-2-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What does Maya love?",
        "options": [
          "Cars and trains",
          "Stars and planets",
          "Cats and dogs",
          "Swimming in the sea"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! בפסקה 1 כתוב שמיה אוהבת כוכבים וכוכבי לכת (stars and planets).",
        "points": 10
      },
      {
        "id": "story-level1-2-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that tells what Maya's father builds for her birthday.",
        "correctIndex": 0,
        "targetSentence": "For her birthday, he builds a small blue robot named Sparky.",
        "explanationHebrew": "המשפט הנכון הוא: 'For her birthday, he builds a small blue robot named Sparky.' (ליום הולדתה, הוא בונה רובוט כחול קטן בשם ספארקי).",
        "points": 10
      },
      {
        "id": "story-level1-2-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What color are Sparky's eyes?",
        "correctIndex": 0,
        "modelAnswer": "His eyes are yellow.",
        "keywords": [
          "yellow",
          "bright yellow"
        ],
        "explanationHebrew": "התשובה המוצעת היא שעיניו צהובות (yellow eyes).",
        "points": 10
      },
      {
        "id": "story-level1-2-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "What does Sparky show on the wall?",
        "options": [
          "Pictures of animals",
          "Pictures of Mars and the Moon",
          "Movies about sports",
          "A map of the city"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון! בפסקה 2 מצוין שספארקי מקרין תמונות של מאדים והירח על הקיר (Mars and the Moon).",
        "points": 10
      },
      {
        "id": "story-level1-2-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that tells what Maya writes in her notebook.",
        "correctIndex": 0,
        "targetSentence": "Maya writes new English words in her green notebook.",
        "explanationHebrew": "המשפט הנכון הוא: 'Maya writes new English words in her green notebook.' (מיה כותבת מילים חדשות באנגלית במחברת הירוקה שלה).",
        "points": 10
      },
      {
        "id": "story-level1-2-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "open",
        "prompt": "How many bright stars do Maya and Sparky count together?",
        "correctIndex": 0,
        "modelAnswer": "They count five bright stars.",
        "keywords": [
          "five",
          "5",
          "five stars"
        ],
        "explanationHebrew": "נכון מאוד! בפסקה 3 כתוב שהם סופרים חמישה כוכבים זוהרים יחד (five bright stars).",
        "points": 10
      },
      {
        "id": "story-level1-2-q7",
        "number": 7,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "Where does Sparky go to sleep at night?",
        "options": [
          "Under Maya's bed",
          "On the kitchen table",
          "On his charging dock",
          "In the garden"
        ],
        "correctIndex": 2,
        "explanationHebrew": "נכון מאוד! בפסקה 3 כתוב שספארקי הולך לישון על תחנת הטעינה שלו (on his charging dock).",
        "points": 10
      },
      {
        "id": "story-level1-2-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is this story mostly about?",
        "options": [
          "A girl and her space robot Sparky",
          "How to build a real rocket",
          "Traveling to school by bus",
          "The history of airplanes"
        ],
        "correctIndex": 0,
        "explanationHebrew": "מצוין! הסיפור כולו מתאר את החברות והלמידה של מיה והרובוט שלה ספארקי.",
        "points": 10
      },
      {
        "id": "story-level1-2-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "Every afternoon, Maya and Sparky learn about space together.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"Every afternoon, Maya and Sparky learn about space together.\"",
        "points": 10
      },
      {
        "id": "story-level1-2-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about maya's space robot and why it is important.",
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
    "id": "story-level1-3",
    "title": "The Secret Treehouse",
    "hebrewTitle": "בית העץ הסודי",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "Dan and his sister Roni live near a green forest.  In the middle of the forest, there is a very tall oak tree.  Last summer, their grandfather helped them build a wooden treehouse high in the tree.",
      "The treehouse has a red roof and three small windows.  To climb up, the children use a strong rope ladder.",
      "Inside the treehouse, Dan and Roni keep their favorite things. There is a soft rug, two wooden chairs, and a box of adventure books. Every Saturday morning, they climb up to eat fresh apples and read stories. Sometimes, a curious brown squirrel visits the treehouse. Roni gives the squirrel nuts, and it does not run away.",
      "One afternoon, it begins to rain softly.  The children sit inside the warm treehouse and listen to the raindrops on the roof.  They drink warm chocolate milk from a yellow bottle.",
      "Dan looks through his toy telescope and watches the forest birds.  The treehouse is their favorite place in the world."
    ],
    "vocabularyHints": [
      {
        "word": "forest",
        "translation": "יער"
      },
      {
        "word": "ladder",
        "translation": "סולם"
      },
      {
        "word": "squirrel",
        "translation": "סנאי"
      },
      {
        "word": "curious",
        "translation": "סקרן"
      },
      {
        "word": "telescope",
        "translation": "טלסקופ"
      }
    ],
    "questions": [
      {
        "id": "story-level1-3-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Who helped Dan and Roni build the treehouse?",
        "options": [
          "Their teacher",
          "Their grandfather",
          "Their neighbor",
          "Their brother"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! בפסקה 1 כתוב שסבא שלהם עזר להם לבנות את בית העץ (their grandfather).",
        "points": 10
      },
      {
        "id": "story-level1-3-q2",
        "number": 2,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What color is the treehouse roof?",
        "correctIndex": 0,
        "modelAnswer": "It has a red roof.",
        "keywords": [
          "red",
          "red roof"
        ],
        "explanationHebrew": "התשובה המוצעת היא שהגג אדום (red roof).",
        "points": 10
      },
      {
        "id": "story-level1-3-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "copy",
        "prompt": "Copy the sentence that tells how the children climb up to the treehouse.",
        "correctIndex": 0,
        "targetSentence": "To climb up, the children use a strong rope ladder.",
        "explanationHebrew": "המשפט הנכון הוא: 'To climb up, the children use a strong rope ladder.' (כדי לטפס למעלה, הילדים משתמשים בסולם חבלים חזק).",
        "points": 10
      },
      {
        "id": "story-level1-3-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "What animal visits the treehouse?",
        "options": [
          "A green frog",
          "A brown squirrel",
          "A black cat",
          "A white rabbit"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון! בפסקה 2 מסופר שסנאי חום וסקרן מבקר בבית העץ (a curious brown squirrel).",
        "points": 10
      },
      {
        "id": "story-level1-3-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What does Roni give to the squirrel?",
        "correctIndex": 0,
        "modelAnswer": "She gives it nuts.",
        "keywords": [
          "nuts",
          "gives the squirrel nuts"
        ],
        "explanationHebrew": "נכון מאוד! רוני נותנת לסנאי אגוזים (nuts).",
        "points": 10
      },
      {
        "id": "story-level1-3-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that shows what the children drink in the treehouse.",
        "correctIndex": 0,
        "targetSentence": "They drink warm chocolate milk from a yellow bottle.",
        "explanationHebrew": "המשפט הנכון הוא: 'They drink warm chocolate milk from a yellow bottle.' (הם שותים שוקו חם מבקבוק צהוב).",
        "points": 10
      },
      {
        "id": "story-level1-3-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What does Dan use to watch the forest birds?",
        "options": [
          "A camera",
          "A toy telescope",
          "A mobile phone",
          "A mirror"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! בפסקה 3 כתוב שדן מביט דרך טלסקופ צעצוע (toy telescope).",
        "points": 10
      },
      {
        "id": "story-level1-3-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is this passage mostly about?",
        "options": [
          "A special wooden treehouse where children play",
          "How to cut down trees in the forest",
          "Different types of birds in winter",
          "Making chocolate milk at home"
        ],
        "correctIndex": 0,
        "explanationHebrew": "כל הכבוד! הסיפור מתאר את בית העץ המיוחד של דן ורוני וחוויותיהם בו.",
        "points": 10
      },
      {
        "id": "story-level1-3-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "Inside the treehouse, Dan and Roni keep their favorite things.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"Inside the treehouse, Dan and Roni keep their favorite things.\"",
        "points": 10
      },
      {
        "id": "story-level1-3-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about the secret treehouse and why it is important.",
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
    "id": "story-level1-4",
    "title": "Leo the Little Baker",
    "hebrewTitle": "ליאו האופה הצעיר",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "Leo is nine years old and he loves to cook.  Every Friday, he wakes up early to help his grandmother in the kitchen.  His grandmother is a baker who makes sweet bread and fruit cakes.",
      "Leo wears a white apron and a big chef hat.  Today, they are making special chocolate cookies for the family dinner.",
      "In the kitchen, Leo mixes sugar, eggs, and brown flour in a big bowl. Then, his grandmother adds delicious chocolate chips and sweet vanilla. Leo uses his hands to roll the dough into small round balls. He places twelve balls on a baking tray. His grandmother puts the tray into the hot oven. Soon, a wonderful sweet smell fills the whole house.",
      "After twenty minutes, the cookies are ready and golden brown.  Leo waits patiently for them to cool down.  In the evening, his parents and brothers sit around the table.",
      "Leo proudly serves the warm cookies with cold milk.  Everyone smiles and says that Leo is the best baker in the city."
    ],
    "vocabularyHints": [
      {
        "word": "apron",
        "translation": "סינר"
      },
      {
        "word": "flour",
        "translation": "קמח"
      },
      {
        "word": "dough",
        "translation": "בצק"
      },
      {
        "word": "oven",
        "translation": "תנור"
      },
      {
        "word": "patiently",
        "translation": "בסבלנות"
      }
    ],
    "questions": [
      {
        "id": "story-level1-4-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "When does Leo wake up early to bake?",
        "options": [
          "Every Monday",
          "Every Wednesday",
          "Every Friday",
          "Every Sunday"
        ],
        "correctIndex": 2,
        "explanationHebrew": "נכון מאוד! בפסקה 1 כתוב שליאו קם מוקדם בכל יום שישי (Every Friday).",
        "points": 10
      },
      {
        "id": "story-level1-4-q2",
        "number": 2,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "copy",
        "prompt": "Copy the sentence that describes what Leo wears in the kitchen.",
        "correctIndex": 0,
        "targetSentence": "Leo wears a white apron and a big chef hat.",
        "explanationHebrew": "המשפט הנכון הוא: 'Leo wears a white apron and a big chef hat.' (ליאו לובש סינר לבן וכובע שף גדול).",
        "points": 10
      },
      {
        "id": "story-level1-4-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What are Leo and his grandmother baking today?",
        "correctIndex": 0,
        "modelAnswer": "They are making special chocolate cookies.",
        "keywords": [
          "chocolate cookies",
          "cookies",
          "chocolate"
        ],
        "explanationHebrew": "התשובה המוצעת היא עוגיות שוקולד מיוחדות (chocolate cookies).",
        "points": 10
      },
      {
        "id": "story-level1-4-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that tells how many balls of dough Leo places on the tray.",
        "correctIndex": 0,
        "targetSentence": "He places twelve balls on a baking tray.",
        "explanationHebrew": "המשפט הנכון הוא: 'He places twelve balls on a baking tray.' (הוא מניח שנים-עשר כדורים על תבנית אפייה).",
        "points": 10
      },
      {
        "id": "story-level1-4-q5",
        "number": 5,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Who puts the tray into the hot oven?",
        "options": [
          "Leo's brother",
          "Leo's father",
          "His grandmother",
          "Leo alone"
        ],
        "correctIndex": 2,
        "explanationHebrew": "נכון! סבתא שלו מכניסה את התבנית לתנור החם (His grandmother puts the tray into the hot oven).",
        "points": 10
      },
      {
        "id": "story-level1-4-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "open",
        "prompt": "How long does it take for the cookies to bake?",
        "correctIndex": 0,
        "modelAnswer": "It takes twenty minutes.",
        "keywords": [
          "twenty minutes",
          "20 minutes",
          "twenty"
        ],
        "explanationHebrew": "נכון מאוד! העוגיות מוכנות אחרי 20 דקות (twenty minutes).",
        "points": 10
      },
      {
        "id": "story-level1-4-q7",
        "number": 7,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What does Leo serve with the warm cookies?",
        "options": [
          "Hot tea",
          "Cold milk",
          "Orange juice",
          "Apple water"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון מאוד! בפסקה 3 כתוב שהוא מגיש את העוגיות עם חלב קר (cold milk).",
        "points": 10
      },
      {
        "id": "story-level1-4-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is this story mostly about?",
        "options": [
          "A boy baking cookies with his grandmother",
          "How to buy food at the supermarket",
          "A brother who does not like chocolate",
          "Building a kitchen in the city"
        ],
        "correctIndex": 0,
        "explanationHebrew": "כל הכבוד! הסיפור מתאר ילד שאופה עוגיות שוקולד יחד עם סבתו.",
        "points": 10
      },
      {
        "id": "story-level1-4-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "In the kitchen, Leo mixes sugar, eggs, and brown flour in a big bowl.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"In the kitchen, Leo mixes sugar, eggs, and brown flour in a big bowl.\"",
        "points": 10
      },
      {
        "id": "story-level1-4-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about leo the little baker and why it is important.",
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
    "id": "story-level1-5",
    "title": "A Day at Dolphin Reef",
    "hebrewTitle": "יום בריף הדולפינים",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "Gal and his family are on vacation in Eilat, a sunny city in the south of Israel.  Today, they are visiting Dolphin Reef by the Red Sea.  The sea water is clear and blue.",
      "Gal stands on the wooden floating bridge and looks into the water.  Suddenly, three friendly dolphins swim near the bridge and leap high into the air.",
      "A kind guide named Dana gives Gal a life jacket. She explains that the dolphins live freely in the sea and can swim anywhere they want. Gal sits quietly on the edge of the dock and dips his feet into the cool water. A dolphin named Nana swims close and touches Gal's hand with her nose. Gal laughs with joy.",
      "In the afternoon, the visitors watch the dolphins play with a big green floating ball.  Dana feeds the dolphins fresh fish from a bucket.",
      "Gal takes photos with his camera to show his classmates at school.  At the end of the day, Gal buys a small dolphin souvenir in the gift shop and waves goodbye to Nana."
    ],
    "vocabularyHints": [
      {
        "word": "vacation",
        "translation": "חופשה"
      },
      {
        "word": "floating bridge",
        "translation": "גשר צף"
      },
      {
        "word": "life jacket",
        "translation": "אפוד הצלה"
      },
      {
        "word": "dock",
        "translation": "רציף / מזח"
      },
      {
        "word": "souvenir",
        "translation": "מזכרת"
      }
    ],
    "questions": [
      {
        "id": "story-level1-5-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where are Gal and his family on vacation?",
        "options": [
          "In Haifa",
          "In Jerusalem",
          "In Eilat",
          "In Tel Aviv"
        ],
        "correctIndex": 2,
        "explanationHebrew": "נכון מאוד! בפסקה 1 כתוב שהם בחופשה באילת (in Eilat).",
        "points": 10
      },
      {
        "id": "story-level1-5-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes the sea water.",
        "correctIndex": 0,
        "targetSentence": "The sea water is clear and blue.",
        "explanationHebrew": "המשפט הנכון הוא: 'The sea water is clear and blue.' (מי הים צלולים וכחולים).",
        "points": 10
      },
      {
        "id": "story-level1-5-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "How many dolphins swim near the bridge at first?",
        "correctIndex": 0,
        "modelAnswer": "Three dolphins swim near the bridge.",
        "keywords": [
          "three",
          "3",
          "three dolphins"
        ],
        "explanationHebrew": "נכון! בהתחלה שוחים ליד הגשר שלושה דולפינים (three friendly dolphins).",
        "points": 10
      },
      {
        "id": "story-level1-5-q4",
        "number": 4,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "What does the guide Dana give to Gal?",
        "options": [
          "A swimming mask",
          "A life jacket",
          "A fishing rod",
          "A sun hat"
        ],
        "correctIndex": 1,
        "explanationHebrew": "נכון! המדריכה דנה נותנת לגל חליפת הצלה (a life jacket).",
        "points": 10
      },
      {
        "id": "story-level1-5-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that tells what the dolphin Nana does.",
        "correctIndex": 0,
        "targetSentence": "A dolphin named Nana swims close and touches Gal's hand with her nose.",
        "explanationHebrew": "המשפט הנכון הוא: 'A dolphin named Nana swims close and touches Gal's hand with her nose.' (דולפינה בשם ננה שוחה קרוב ונוגעת בידו של גל עם אפה).",
        "points": 10
      },
      {
        "id": "story-level1-5-q6",
        "number": 6,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "open",
        "prompt": "What does Dana feed the dolphins?",
        "correctIndex": 0,
        "modelAnswer": "She feeds them fresh fish.",
        "keywords": [
          "fish",
          "fresh fish"
        ],
        "explanationHebrew": "התשובה המוצעת היא שהיא מאכילה אותם בדגים טריים (fresh fish).",
        "points": 10
      },
      {
        "id": "story-level1-5-q7",
        "number": 7,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What does Gal buy before leaving?",
        "options": [
          "A fresh fish",
          "A green ball",
          "A small dolphin souvenir",
          "A camera"
        ],
        "correctIndex": 2,
        "explanationHebrew": "נכון מאוד! בפסקה 3 כתוב שהוא קונה מזכרת דולפין קטנה (a small dolphin souvenir).",
        "points": 10
      },
      {
        "id": "story-level1-5-q8",
        "number": 8,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "mcq",
        "prompt": "What is the main topic of this text?",
        "options": [
          "Gal's fun visit to Dolphin Reef in Eilat",
          "How to catch fish in the Red Sea",
          "Why children need to wear hats in the sun",
          "The best hotels in southern Israel"
        ],
        "correctIndex": 0,
        "explanationHebrew": "כל הכבוד! הטקסט מתאר את הביקור המרגש של גל בריף הדולפינים באילת.",
        "points": 10
      },
      {
        "id": "story-level1-5-q9",
        "number": 9,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the first sentence of the second paragraph that introduces the new event.",
        "targetSentence": "A kind guide named Dana gives Gal a life jacket.",
        "explanationHebrew": "המשפט הנכון להעתקה הוא: \"A kind guide named Dana gives Gal a life jacket.\"",
        "points": 10
      },
      {
        "id": "story-level1-5-q10",
        "number": 10,
        "paragraphIndex": -1,
        "linesHint": "The entire text",
        "type": "open",
        "prompt": "Based on the text, what is one important lesson or fact the reader learns from this passage?",
        "modelAnswer": "The reader learns about a day at dolphin reef and why it is important.",
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
  }
];
