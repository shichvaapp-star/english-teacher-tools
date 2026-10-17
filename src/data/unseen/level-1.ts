import { MSUnseenStory } from "@/types/unseen";

export const LEVEL_1_UNSEENS: MSUnseenStory[] = [
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
    "id": "story-level1-6",
    "title": "The Lost Kitten in the Park",
    "hebrewTitle": "החתלתול האבוד בפארק",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "On a sunny Friday afternoon, Lily was walking in the green city park. The sun was warm and birds were singing in the tall trees. Suddenly, Lily heard a very soft crying sound near a large bush.",
      "Lily stopped and looked carefully under the green leaves. She saw a small grey kitten. The kitten had big green eyes and was shaking because it was cold and frightened. Lily knelt down on the grass so she would not scare it.",
      "The kitten slowly walked toward Lily. Lily gently stroked its soft head. She noticed a little red collar around its neck with a silver tag. On the tag was a phone number and the name Oliver.",
      "Lily immediately called the phone number on her mother phone. A worried woman answered right away. She said Oliver had run out of their garden that morning. The woman was overjoyed to hear that Oliver was safe.",
      "Ten minutes later, Oliver owner arrived at the park. She hugged the little kitten and thanked Lily with tears of joy. She gave Lily a delicious chocolate muffin to show her gratitude. Lily felt very proud and happy."
    ],
    "vocabularyHints": [
      {
        "word": "suddenly",
        "translation": "פתאום"
      },
      {
        "word": "frightened",
        "translation": "מפוחד"
      },
      {
        "word": "collar",
        "translation": "קולר"
      },
      {
        "word": "worried",
        "translation": "מודאגת"
      },
      {
        "word": "overjoyed",
        "translation": "מאושרת מאוד"
      },
      {
        "word": "gratitude",
        "translation": "הכרת תודה"
      }
    ],
    "questions": [
      {
        "id": "story-level1-6-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where was Lily walking on Friday afternoon?",
        "options": [
          "At the sandy beach",
          "In the green city park",
          "In a busy shopping mall",
          "Near her school"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שלילי הלכה בפארק העירוני הירוק (green city park).",
        "points": 10
      },
      {
        "id": "story-level1-6-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that tells us what Lily heard near a large bush.",
        "correctIndex": 0,
        "targetSentence": "Suddenly, Lily heard a very soft crying sound near a large bush.",
        "explanationHebrew": "המשפט המדויק הוא: Suddenly, Lily heard a very soft crying sound near a large bush.",
        "points": 10
      },
      {
        "id": "story-level1-6-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What did Lily find under the bush?",
        "options": [
          "A red ball",
          "A small grey kitten",
          "A lost wallet",
          "A bird nest"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מסופר שלילי ראתה חתלתול אפור קטן (small grey kitten).",
        "points": 10
      },
      {
        "id": "story-level1-6-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "Why was the kitten shaking?",
        "correctIndex": 0,
        "modelAnswer": "Because it was cold and frightened.",
        "keywords": [
          "cold",
          "frightened",
          "scared"
        ],
        "explanationHebrew": "בפסקה 2 מוסבר שהחתלתול רעד כי היה לו קר והוא היה מפוחד (cold and frightened).",
        "points": 10
      },
      {
        "id": "story-level1-6-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "What information was written on the silver tag?",
        "options": [
          "The kitten age and weight",
          "A phone number and the name Oliver",
          "A hospital address",
          "Lily home address"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 3 כתוב שעל התגית היה מספר טלפון והשם אוליבר (a phone number and the name Oliver).",
        "points": 10
      },
      {
        "id": "story-level1-6-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that describes what was around the kitten neck.",
        "correctIndex": 0,
        "targetSentence": "She noticed a little red collar around its neck with a silver tag.",
        "explanationHebrew": "המשפט המדויק הוא: She noticed a little red collar around its neck with a silver tag.",
        "points": 10
      },
      {
        "id": "story-level1-6-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "open",
        "prompt": "When did Oliver run away from home?",
        "correctIndex": 0,
        "modelAnswer": "He had run out of their garden that morning.",
        "keywords": [
          "garden",
          "morning",
          "run out"
        ],
        "explanationHebrew": "בפסקה 4 האישה מסבירה שאוליבר ברח מהגינה באותו בוקר (that morning).",
        "points": 10
      },
      {
        "id": "story-level1-6-q8",
        "number": 8,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "How long did it take for the owner to arrive at the park?",
        "options": [
          "Ten minutes",
          "One hour",
          "Two hours",
          "The next day"
        ],
        "correctIndex": 0,
        "explanationHebrew": "בפסקה 5 מצוין שהבעלים הגיעה תוך עשר דקות (Ten minutes later).",
        "points": 10
      },
      {
        "id": "story-level1-6-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "copy",
        "prompt": "Copy the sentence that tells what the owner gave Lily.",
        "correctIndex": 0,
        "targetSentence": "She gave Lily a delicious chocolate muffin to show her gratitude.",
        "explanationHebrew": "המשפט המדויק הוא: She gave Lily a delicious chocolate muffin to show her gratitude.",
        "points": 10
      },
      {
        "id": "story-level1-6-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "How did Lily feel at the end of the story?",
        "correctIndex": 0,
        "modelAnswer": "Lily felt very proud and happy.",
        "keywords": [
          "proud",
          "happy"
        ],
        "explanationHebrew": "בפסקה האחרונה כתוב שלילי הרגישה גאה ומאושרת מאוד (very proud and happy).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-7",
    "title": "Sam's Red Bicycle",
    "hebrewTitle": "האופניים האדומים של סם",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "Sam received a wonderful present for his eighth birthday. His parents bought him a shiny red bicycle with a silver bell. Sam was very excited because he had always wanted to learn how to ride.",
      "The next morning, Sam and his father went to the neighborhood park. Sam put on his blue safety helmet and tied the black strap under his chin. Safety was very important to his parents.",
      "At first, balancing on two wheels was difficult. Sam wobbled and almost fell twice, but his father held the back of the seat. His father smiled and told him to keep pedaling forward.",
      "After thirty minutes of practice, his father quietly let go of the bicycle. Sam was riding all by himself! The cool wind brushed against his face as he rode smoothly down the wide paved path.",
      "Sam rang his silver bell three times to announce his success. His father clapped his hands with joy. Sam could not wait to ride his bicycle to school on Sunday morning."
    ],
    "vocabularyHints": [
      {
        "word": "present",
        "translation": "מתנה"
      },
      {
        "word": "helmet",
        "translation": "קסדה"
      },
      {
        "word": "strap",
        "translation": "רצועה"
      },
      {
        "word": "wobbled",
        "translation": "התנדנד"
      },
      {
        "word": "pedaling",
        "translation": "מדווש"
      },
      {
        "word": "announce",
        "translation": "להכריז"
      }
    ],
    "questions": [
      {
        "id": "story-level1-7-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What did Sam receive for his eighth birthday?",
        "options": [
          "A red toy truck",
          "A shiny red bicycle",
          "A pair of roller skates",
          "A blue football"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהוריו קנו לו אופניים אדומים מבריקים (shiny red bicycle).",
        "points": 10
      },
      {
        "id": "story-level1-7-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes the present Sam parents bought him.",
        "correctIndex": 0,
        "targetSentence": "His parents bought him a shiny red bicycle with a silver bell.",
        "explanationHebrew": "המשפט המדויק הוא: His parents bought him a shiny red bicycle with a silver bell.",
        "points": 10
      },
      {
        "id": "story-level1-7-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "Where did Sam and his father go the next morning?",
        "correctIndex": 0,
        "modelAnswer": "They went to the neighborhood park.",
        "keywords": [
          "neighborhood",
          "park"
        ],
        "explanationHebrew": "בפסקה 2 כתוב שהם הלכו לפארק השכונתי (neighborhood park).",
        "points": 10
      },
      {
        "id": "story-level1-7-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "copy",
        "prompt": "Copy the sentence that explains what Sam put on his head.",
        "correctIndex": 0,
        "targetSentence": "Sam put on his blue safety helmet and tied the black strap under his chin.",
        "explanationHebrew": "המשפט המדויק הוא: Sam put on his blue safety helmet and tied the black strap under his chin.",
        "points": 10
      },
      {
        "id": "story-level1-7-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "What did Sam father do to help him balance at first?",
        "options": [
          "He pushed him downhill",
          "He held the back of the seat",
          "He held both handlebars",
          "He rode alongside on another bike"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 3 כתוב שאביו החזיק את החלק האחורי של המושב (held the back of the seat).",
        "points": 10
      },
      {
        "id": "story-level1-7-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What did Sam father tell him to do when he wobbled?",
        "correctIndex": 0,
        "modelAnswer": "His father told him to keep pedaling forward.",
        "keywords": [
          "pedaling",
          "forward",
          "keep"
        ],
        "explanationHebrew": "בפסקה 3 האב אמר לו להמשיך לדווש קדימה (keep pedaling forward).",
        "points": 10
      },
      {
        "id": "story-level1-7-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "How long did it take for Sam to ride by himself?",
        "options": [
          "Ten minutes",
          "Thirty minutes",
          "Two days",
          "One week"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב שאחרי 30 דקות של אימון אביו שחרר את האופניים (After thirty minutes of practice).",
        "points": 10
      },
      {
        "id": "story-level1-7-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that shows Sam was riding alone.",
        "correctIndex": 0,
        "targetSentence": "Sam was riding all by himself!",
        "explanationHebrew": "המשפט המדויק הוא: Sam was riding all by himself!",
        "points": 10
      },
      {
        "id": "story-level1-7-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "How many times did Sam ring his silver bell?",
        "options": [
          "One time",
          "Two times",
          "Three times",
          "Five times"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 5 כתוב שסם צלצל בפעמון שלוש פעמים (three times).",
        "points": 10
      },
      {
        "id": "story-level1-7-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What did Sam look forward to doing on Sunday morning?",
        "correctIndex": 0,
        "modelAnswer": "He could not wait to ride his bicycle to school.",
        "keywords": [
          "ride",
          "bicycle",
          "school"
        ],
        "explanationHebrew": "בפסקה 5 נכתב שסם לא יכול היה לחכות לרכוב על אופניו לבית הספר (ride his bicycle to school).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-8",
    "title": "The Magic Garden of Grandma Ruth",
    "hebrewTitle": "הגן הקסום של סבתא רות",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "Grandma Ruth lives in a cozy white cottage with a large garden in the backyard. Every summer, her grandson Dan visits her for two weeks. Dan loves the garden because it is filled with colorful flowers and delicious vegetables.",
      "Every morning at seven o'clock, Grandma Ruth and Dan put on wide straw hats. Grandma Ruth hands Dan a small green watering can. They walk between long rows of juicy red tomatoes, crunchy cucumbers, and fragrant purple basil.",
      "Grandma Ruth teaches Dan how each plant grows from a tiny brown seed. She explains that plants need three essential things to grow strong: rich brown soil, warm sunlight, and fresh water. Dan listens carefully and inspects every leaf.",
      "One Thursday morning, Dan spotted five large red strawberries hiding under green leaves. He picked them gently and washed them under cool tap water. They were the sweetest strawberries Dan had ever tasted.",
      "At noon, Grandma Ruth and Dan made a colorful garden salad for lunch. Dan felt proud because he helped grow the vegetables. He decided to start his own small plant pot on his balcony at home."
    ],
    "vocabularyHints": [
      {
        "word": "cozy",
        "translation": "נעים וחמים"
      },
      {
        "word": "backyard",
        "translation": "חצר אחורית"
      },
      {
        "word": "crunchy",
        "translation": "פריך"
      },
      {
        "word": "essential",
        "translation": "חיוני"
      },
      {
        "word": "spotted",
        "translation": "הבחין ב-"
      },
      {
        "word": "balcony",
        "translation": "מרפסת"
      }
    ],
    "questions": [
      {
        "id": "story-level1-8-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "How long does Dan visit Grandma Ruth every summer?",
        "options": [
          "For three days",
          "For two weeks",
          "For one month",
          "For the whole summer"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שדן מבקר אותה לשבועיים (for two weeks).",
        "points": 10
      },
      {
        "id": "story-level1-8-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that tells where Grandma Ruth lives.",
        "correctIndex": 0,
        "targetSentence": "Grandma Ruth lives in a cozy white cottage with a large garden in the backyard.",
        "explanationHebrew": "המשפט המדויק הוא: Grandma Ruth lives in a cozy white cottage with a large garden in the backyard.",
        "points": 10
      },
      {
        "id": "story-level1-8-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What time do Grandma Ruth and Dan start gardening in the morning?",
        "options": [
          "At six o'clock",
          "At seven o'clock",
          "At eight o'clock",
          "At noon"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהם יוצאים לגינה בשעה שבע בבוקר (at seven o'clock).",
        "points": 10
      },
      {
        "id": "story-level1-8-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What tool does Grandma Ruth hand to Dan?",
        "correctIndex": 0,
        "modelAnswer": "She hands Dan a small green watering can.",
        "keywords": [
          "watering can",
          "green",
          "small"
        ],
        "explanationHebrew": "בפסקה 2 נכתב שהיא מגישה לו משפך ירוק קטן (small green watering can).",
        "points": 10
      },
      {
        "id": "story-level1-8-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "According to paragraph 3, what three things do plants need to grow?",
        "options": [
          "Sugar, milk, and shade",
          "Rich soil, warm sunlight, and fresh water",
          "Sand, wind, and rain",
          "Cold ice, fertilizer, and stones"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 3 מוסבר שצמחים צריכים אדמה עשירה, אור שמש חם ומים מתוקים (rich brown soil, warm sunlight, and fresh water).",
        "points": 10
      },
      {
        "id": "story-level1-8-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that lists the three things plants need to grow strong.",
        "correctIndex": 0,
        "targetSentence": "She explains that plants need three essential things to grow strong: rich brown soil, warm sunlight, and fresh water.",
        "explanationHebrew": "המשפט המדויק הוא: She explains that plants need three essential things to grow strong: rich brown soil, warm sunlight, and fresh water.",
        "points": 10
      },
      {
        "id": "story-level1-8-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "open",
        "prompt": "What did Dan find hiding under the green leaves on Thursday morning?",
        "correctIndex": 0,
        "modelAnswer": "He spotted five large red strawberries.",
        "keywords": [
          "five",
          "strawberries",
          "red"
        ],
        "explanationHebrew": "בפסקה 4 כתוב שהוא גילה חמישה תותים אדומים גדולים (five large red strawberries).",
        "points": 10
      },
      {
        "id": "story-level1-8-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "How did the strawberries taste to Dan?",
        "options": [
          "Sour and hard",
          "The sweetest strawberries he had ever tasted",
          "Salty and strange",
          "Bitter and dry"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב שהם היו התותים הכי מתוקים שטעם אי פעם (the sweetest strawberries Dan had ever tasted).",
        "points": 10
      },
      {
        "id": "story-level1-8-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "copy",
        "prompt": "Copy the sentence that tells what Grandma Ruth and Dan made for lunch.",
        "correctIndex": 0,
        "targetSentence": "At noon, Grandma Ruth and Dan made a colorful garden salad for lunch.",
        "explanationHebrew": "המשפט המדויק הוא: At noon, Grandma Ruth and Dan made a colorful garden salad for lunch.",
        "points": 10
      },
      {
        "id": "story-level1-8-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What did Dan decide to do at his home balcony?",
        "correctIndex": 0,
        "modelAnswer": "He decided to start his own small plant pot.",
        "keywords": [
          "start",
          "plant pot",
          "balcony"
        ],
        "explanationHebrew": "בפסקה האחרונה נכתב שהוא החליט להקים עציץ משלו במרפסת (start his own small plant pot).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-9",
    "title": "Dan and the Big Football Game",
    "hebrewTitle": "דן ומשחק הכדורגל הגדול",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "Dan plays midfield for the Blue Stars, his school football team. On Tuesday afternoon, the team had their most important game of the season against the Red Eagles. The school field was packed with cheering students and proud parents.",
      "The referee blew the whistle, and the game began. Both teams ran fast and kicked the black-and-white ball with great energy. At halftime, the score was tied 1-1, and both teams were tired but determined to win.",
      "During the second half, the Red Eagles defended their goal bravely. There were only two minutes remaining on the clock. Dan received a pass near the center line. He looked up and saw his teammate Roy running toward the penalty box.",
      "Dan could have tried to shoot from far away, but he chose to pass the ball accurately to Roy. Roy received the ball smoothly and kicked it with his right foot into the top corner of the net. The crowd cheered loudly as the scoreboard changed to 2-1.",
      "The referee blew the final whistle, and the Blue Stars celebrated their victory. Dan's coach hugged him and praised his teamwork. Dan learned that sharing the ball is the best way to win together."
    ],
    "vocabularyHints": [
      {
        "word": "midfield",
        "translation": "קשר (בכדורגל)"
      },
      {
        "word": "referee",
        "translation": "שופט משחק"
      },
      {
        "word": "whistle",
        "translation": "משרוקית"
      },
      {
        "word": "halftime",
        "translation": "מחצית"
      },
      {
        "word": "penalty box",
        "translation": "רחבת ה-16"
      },
      {
        "word": "teamwork",
        "translation": "עבודת צוות"
      }
    ],
    "questions": [
      {
        "id": "story-level1-9-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What position does Dan play on his school football team?",
        "options": [
          "Goalkeeper",
          "Midfield",
          "Defender",
          "Coach"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שדן משחק כקשר (plays midfield).",
        "points": 10
      },
      {
        "id": "story-level1-9-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that names the opposing team Dan played against.",
        "correctIndex": 0,
        "targetSentence": "On Tuesday afternoon, the team had their most important game of the season against the Red Eagles.",
        "explanationHebrew": "המשפט המדויק הוא: On Tuesday afternoon, the team had their most important game of the season against the Red Eagles.",
        "points": 10
      },
      {
        "id": "story-level1-9-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What was the score at halftime?",
        "correctIndex": 0,
        "modelAnswer": "The score was tied 1-1.",
        "keywords": [
          "tied",
          "1-1",
          "score"
        ],
        "explanationHebrew": "בפסקה 2 נכתב שהתוצאה במחצית הייתה תיקו 1-1 (tied 1-1).",
        "points": 10
      },
      {
        "id": "story-level1-9-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "How did the teams feel at halftime?",
        "options": [
          "Angry and sad",
          "Tired but determined to win",
          "Bored and sleepy",
          "Ready to stop playing"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהם היו עייפים אך נחושים לנצח (tired but determined to win).",
        "points": 10
      },
      {
        "id": "story-level1-9-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that tells how much time was left on the clock.",
        "correctIndex": 0,
        "targetSentence": "There were only two minutes remaining on the clock.",
        "explanationHebrew": "המשפט המדויק הוא: There were only two minutes remaining on the clock.",
        "points": 10
      },
      {
        "id": "story-level1-9-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "Who did Dan see running toward the penalty box?",
        "correctIndex": 0,
        "modelAnswer": "He saw his teammate Roy running toward the penalty box.",
        "keywords": [
          "teammate",
          "Roy",
          "penalty box"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שדן ראה את חברו לקבוצה רוי רץ לרחבה (his teammate Roy).",
        "points": 10
      },
      {
        "id": "story-level1-9-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What did Dan choose to do instead of shooting from far away?",
        "options": [
          "He stopped running",
          "He kicked the ball out of bounds",
          "He passed the ball accurately to Roy",
          "He sat on the grass"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 4 מוסבר שהוא בחר למסור את הכדור במדויק לרוי (pass the ball accurately to Roy).",
        "points": 10
      },
      {
        "id": "story-level1-9-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes how Roy scored the winning goal.",
        "correctIndex": 0,
        "targetSentence": "Roy received the ball smoothly and kicked it with his right foot into the top corner of the net.",
        "explanationHebrew": "המשפט המדויק הוא: Roy received the ball smoothly and kicked it with his right foot into the top corner of the net.",
        "points": 10
      },
      {
        "id": "story-level1-9-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What did the coach praise Dan for?",
        "options": [
          "His new football boots",
          "His teamwork",
          "His running speed",
          "His clean jersey"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 כתוב שהמאמן שיבח אותו על עבודת הצוות שלו (praised his teamwork).",
        "points": 10
      },
      {
        "id": "story-level1-9-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What important lesson did Dan learn from the game?",
        "correctIndex": 0,
        "modelAnswer": "He learned that sharing the ball is the best way to win together.",
        "keywords": [
          "sharing",
          "ball",
          "win",
          "together"
        ],
        "explanationHebrew": "בסיום מסופר שדן למד שמסירת הכדור ושיתוף פעולה הם הדרך הטובה ביותר לנצח יחד.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-10",
    "title": "The Clever Monkey of the Jungle",
    "hebrewTitle": "הקוף החכם בג'ונגל",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "In a lush green tropical jungle, a young brown monkey named Pip lived with his family. Pip was smaller than his brothers, but he had sharp eyes and a very curious mind. He loved observing how things worked around him.",
      "High in the canopy grew clusters of sweet yellow bananas. The problem was that the highest branches were thin and fragile. When the older monkeys tried to climb them, the branches bent dangerously, and they had to turn back empty-handed.",
      "Pip sat on a sturdy branch and thought for a moment. He noticed a long fallen bamboo stick resting against a mossy rock. Pip picked up the stick with both hands and tested its strength.",
      "Carefully holding the bamboo pole, Pip reached toward the high banana bunch. He tapped the thick stem three times. The ripe yellow bananas snapped loose and dropped gently onto the soft grass below.",
      "The other monkeys chattered excitedly and gathered around the feast. Instead of keeping all the bananas for himself, Pip shared them with the baby monkeys and elders. Everyone cheered for the clever little thinker of the jungle."
    ],
    "vocabularyHints": [
      {
        "word": "canopy",
        "translation": "חופת העצים / צמרת היער"
      },
      {
        "word": "fragile",
        "translation": "שביר ועדין"
      },
      {
        "word": "sturdy",
        "translation": "חזק ויציב"
      },
      {
        "word": "bamboo",
        "translation": "במבוק"
      },
      {
        "word": "chattered",
        "translation": "פטפטו / צווחו (קופים)"
      },
      {
        "word": "elders",
        "translation": "המבוגרים / זקני השבט"
      }
    ],
    "questions": [
      {
        "id": "story-level1-10-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What made Pip different from his brothers?",
        "options": [
          "He was much bigger and stronger",
          "He had sharp eyes and a curious mind",
          "He had black fur and white ears",
          "He could fly like a bird"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהיו לו עיניים חדות ומוח סקרן מאוד (sharp eyes and a very curious mind).",
        "points": 10
      },
      {
        "id": "story-level1-10-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes what Pip loved doing.",
        "correctIndex": 0,
        "targetSentence": "He loved observing how things worked around him.",
        "explanationHebrew": "המשפט המדויק הוא: He loved observing how things worked around him.",
        "points": 10
      },
      {
        "id": "story-level1-10-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "Why could older monkeys not reach the highest bananas?",
        "correctIndex": 0,
        "modelAnswer": "Because the highest branches were thin and fragile and bent dangerously.",
        "keywords": [
          "thin",
          "fragile",
          "branches",
          "bent"
        ],
        "explanationHebrew": "בפסקה 2 מוסבר שהענפים הגבוהים היו דקים ושבירים והתכופפו בצורה מסוכנת.",
        "points": 10
      },
      {
        "id": "story-level1-10-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "copy",
        "prompt": "Copy the sentence that tells what fruit grew in the canopy.",
        "correctIndex": 0,
        "targetSentence": "High in the canopy grew clusters of sweet yellow bananas.",
        "explanationHebrew": "המשפט המדויק הוא: High in the canopy grew clusters of sweet yellow bananas.",
        "points": 10
      },
      {
        "id": "story-level1-10-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "What tool did Pip find resting against a mossy rock?",
        "options": [
          "A metal shovel",
          "A long fallen bamboo stick",
          "A rope made of vines",
          "A sharp stone knife"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 3 כתוב שהוא הבחין במקל במבוק ארוך (a long fallen bamboo stick).",
        "points": 10
      },
      {
        "id": "story-level1-10-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What kind of branch was Pip sitting on when he was thinking?",
        "correctIndex": 0,
        "modelAnswer": "He sat on a sturdy branch.",
        "keywords": [
          "sturdy",
          "branch"
        ],
        "explanationHebrew": "בפסקה 3 מצוין שפיפ ישב על ענף חזק ויציב (sturdy branch).",
        "points": 10
      },
      {
        "id": "story-level1-10-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "How many times did Pip tap the banana stem?",
        "options": [
          "One time",
          "Two times",
          "Three times",
          "Ten times"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 4 כתוב שהוא נקש שלוש פעמים על הגבעול (tapped the thick stem three times).",
        "points": 10
      },
      {
        "id": "story-level1-10-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that tells where the ripe bananas dropped.",
        "correctIndex": 0,
        "targetSentence": "The ripe yellow bananas snapped loose and dropped gently onto the soft grass below.",
        "explanationHebrew": "המשפט המדויק הוא: The ripe yellow bananas snapped loose and dropped gently onto the soft grass below.",
        "points": 10
      },
      {
        "id": "story-level1-10-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "Who did Pip share the bananas with?",
        "correctIndex": 0,
        "modelAnswer": "He shared them with the baby monkeys and elders.",
        "keywords": [
          "baby",
          "monkeys",
          "elders",
          "shared"
        ],
        "explanationHebrew": "בפסקה 5 מסופר שהוא חלק את הבננות עם גורי הקופים וזקני השבט (baby monkeys and elders).",
        "points": 10
      },
      {
        "id": "story-level1-10-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What title did the other monkeys give Pip at the end?",
        "options": [
          "The fastest climber",
          "The clever little thinker of the jungle",
          "The banana king",
          "The lazy monkey"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 כולם הריעו לחושב הקטן והחכם של הג'ונגל (clever little thinker of the jungle).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-11",
    "title": "A Rainy Day at Home",
    "hebrewTitle": "יום גשום בבית",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "On Saturday morning, thick grey clouds covered the sky, and heavy raindrops tapped loudly on Maya's bedroom window. Maya and her younger brother Leo were sad because their soccer match at the playground was canceled.",
      "Their mother smiled and walked into the living room carrying three soft fleece blankets and four large pillows. She suggested they build an indoor fortress between two sturdy armchairs. Maya and Leo cheered with excitement.",
      "Working together, they draped the blue blankets over the chairs to create walls. Inside their cozy secret tent, they arranged pillows and turned on a warm battery-powered flashlight. The tent felt like a magical cabin in the woods.",
      "Leo brought his favorite board game about pirates, and Maya took out a colorful storybook. They played games and laughed for two hours while thunder rumbled quietly in the distance.",
      "At noon, their mother brought them mugs of warm hot cocoa topped with fluffy marshmallows. Maya realized that even when plans change due to rain, a day spent indoors with family can be full of fun and happiness."
    ],
    "vocabularyHints": [
      {
        "word": "heavy",
        "translation": "כבד"
      },
      {
        "word": "canceled",
        "translation": "בוטל"
      },
      {
        "word": "fortress",
        "translation": "מבצר"
      },
      {
        "word": "draped",
        "translation": "פרסו / תלו"
      },
      {
        "word": "thunder",
        "translation": "רעם"
      },
      {
        "word": "marshmallows",
        "translation": "מרשמלו"
      }
    ],
    "questions": [
      {
        "id": "story-level1-11-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Why were Maya and Leo sad on Saturday morning?",
        "options": [
          "Their TV was broken",
          "Their soccer match at the playground was canceled",
          "They had lots of homework",
          "They lost their favorite toy"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהם היו עצובים כי משחק הכדורגל שלהם בוטל (soccer match was canceled).",
        "points": 10
      },
      {
        "id": "story-level1-11-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes what raindrops did on the bedroom window.",
        "correctIndex": 0,
        "targetSentence": "On Saturday morning, thick grey clouds covered the sky, and heavy raindrops tapped loudly on Maya's bedroom window.",
        "explanationHebrew": "המשפט המדויק הוא: On Saturday morning, thick grey clouds covered the sky, and heavy raindrops tapped loudly on Maya's bedroom window.",
        "points": 10
      },
      {
        "id": "story-level1-11-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What items did their mother bring into the living room?",
        "correctIndex": 0,
        "modelAnswer": "She brought three soft fleece blankets and four large pillows.",
        "keywords": [
          "blankets",
          "pillows",
          "three",
          "four"
        ],
        "explanationHebrew": "בפסקה 2 נכתב שהאם הביאה שלוש שמיכות רכות וארבע כריות גדולות.",
        "points": 10
      },
      {
        "id": "story-level1-11-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "copy",
        "prompt": "Copy the sentence that tells what the mother suggested they build.",
        "correctIndex": 0,
        "targetSentence": "She suggested they build an indoor fortress between two sturdy armchairs.",
        "explanationHebrew": "המשפט המדויק הוא: She suggested they build an indoor fortress between two sturdy armchairs.",
        "points": 10
      },
      {
        "id": "story-level1-11-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "What light source did they use inside the tent?",
        "options": [
          "Candles",
          "A warm battery-powered flashlight",
          "The ceiling chandelier",
          "A smartphone screen"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 3 כתוב שהם הדליקו פנס סוללות (battery-powered flashlight).",
        "points": 10
      },
      {
        "id": "story-level1-11-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What did the indoor tent feel like to them?",
        "correctIndex": 0,
        "modelAnswer": "The tent felt like a magical cabin in the woods.",
        "keywords": [
          "magical",
          "cabin",
          "woods"
        ],
        "explanationHebrew": "בפסקה 3 מתואר שהאוהל הרגיש כמו בקתה קסומה ביער (magical cabin in the woods).",
        "points": 10
      },
      {
        "id": "story-level1-11-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What board game did Leo bring to play?",
        "options": [
          "A game about pirates",
          "A game about space travel",
          "A chess set",
          "A puzzle"
        ],
        "correctIndex": 0,
        "explanationHebrew": "בפסקה 4 כתוב שלאו הביא משחק לוח על פיראטים (board game about pirates).",
        "points": 10
      },
      {
        "id": "story-level1-11-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that tells how long they played and laughed.",
        "correctIndex": 0,
        "targetSentence": "They played games and laughed for two hours while thunder rumbled quietly in the distance.",
        "explanationHebrew": "המשפט המדויק הוא: They played games and laughed for two hours while thunder rumbled quietly in the distance.",
        "points": 10
      },
      {
        "id": "story-level1-11-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What warm treat did their mother bring at noon?",
        "options": [
          "Pancakes with syrup",
          "Mugs of warm hot cocoa topped with marshmallows",
          "Hot chicken soup",
          "Warm apple pie"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 נכתב שהאם הביאה שוקו חם עם מרשמלו (mugs of warm hot cocoa topped with fluffy marshmallows).",
        "points": 10
      },
      {
        "id": "story-level1-11-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What did Maya realize at the end of the rainy day?",
        "correctIndex": 0,
        "modelAnswer": "She realized that a day spent indoors with family can be full of fun and happiness.",
        "keywords": [
          "indoors",
          "family",
          "fun",
          "happiness"
        ],
        "explanationHebrew": "בפסקה האחרונה מיה הבינה שיום ביתי עם המשפחה יכול להיות מלא שמחה וכיף.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-12",
    "title": "The Friendly Firefighter",
    "hebrewTitle": "לוחם האש הידידותי",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "David works as a dedicated firefighter at Station Number 4 in a lively coastal town. Every morning at six o'clock, David puts on his bright yellow uniform and sturdy black boots. His primary goal is keeping the neighborhood safe.",
      "The first duty of the day is inspecting the emergency equipment. David and his team carefully polish the big red fire truck, check the long water hoses, and test the flashing emergency sirens. Everything must be in perfect condition.",
      "On Wednesday morning, David visited an elementary school to talk about fire safety. The third-grade students sat in a circle and listened attentively. David explained what to do if someone sees smoke: stay calm, exit the building quickly, and dial 102.",
      "After the safety talk, David had a special surprise for the children. He brought out his shiny yellow firefighter helmet and allowed each student to try it on. The children took turns smiling for photos.",
      "Before leaving, the students presented David with a hand-drawn poster thanking the firefighters for their bravery. David hung the poster proudly on the station wall, knowing his job makes a real difference in the community."
    ],
    "vocabularyHints": [
      {
        "word": "dedicated",
        "translation": "מסור"
      },
      {
        "word": "hoses",
        "translation": "צינורות כיבוי"
      },
      {
        "word": "inspecting",
        "translation": "בודק / בוחן"
      },
      {
        "word": "attentively",
        "translation": "בתשומת לב"
      },
      {
        "word": "bravery",
        "translation": "אומץ לב"
      },
      {
        "word": "community",
        "translation": "קהילה"
      }
    ],
    "questions": [
      {
        "id": "story-level1-12-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where does David work as a firefighter?",
        "options": [
          "At Station Number 4 in a coastal town",
          "At an airport fire station",
          "At a forest tower",
          "At a hospital"
        ],
        "correctIndex": 0,
        "explanationHebrew": "בפסקה 1 כתוב שהוא עובד בתחנה מספר 4 בעיירת חוף (Station Number 4 in a lively coastal town).",
        "points": 10
      },
      {
        "id": "story-level1-12-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that states David primary goal.",
        "correctIndex": 0,
        "targetSentence": "His primary goal is keeping the neighborhood safe.",
        "explanationHebrew": "המשפט המדויק הוא: His primary goal is keeping the neighborhood safe.",
        "points": 10
      },
      {
        "id": "story-level1-12-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What is the first duty of the day at the fire station?",
        "correctIndex": 0,
        "modelAnswer": "The first duty is inspecting the emergency equipment.",
        "keywords": [
          "inspecting",
          "emergency",
          "equipment"
        ],
        "explanationHebrew": "בפסקה 2 מוסבר שהמשימה הראשונה היא בדיקת ציוד החירום (inspecting the emergency equipment).",
        "points": 10
      },
      {
        "id": "story-level1-12-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What color is the fire truck?",
        "options": [
          "Blue",
          "Yellow",
          "Red",
          "White"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 2 כתוב שהם מנקים את כבאית האש האדומה הגדולה (big red fire truck).",
        "points": 10
      },
      {
        "id": "story-level1-12-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that explains what to do if someone sees smoke.",
        "correctIndex": 0,
        "targetSentence": "David explained what to do if someone sees smoke: stay calm, exit the building quickly, and dial 102.",
        "explanationHebrew": "המשפט המדויק הוא: David explained what to do if someone sees smoke: stay calm, exit the building quickly, and dial 102.",
        "points": 10
      },
      {
        "id": "story-level1-12-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What emergency number did David tell the students to dial?",
        "correctIndex": 0,
        "modelAnswer": "He told them to dial 102.",
        "keywords": [
          "102",
          "dial"
        ],
        "explanationHebrew": "בפסקה 3 מצוין המספר 102.",
        "points": 10
      },
      {
        "id": "story-level1-12-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What surprise did David have for the students after the talk?",
        "options": [
          "A box of donuts",
          "He let each student try on his yellow helmet",
          "A ride inside the fire truck",
          "A water balloon game"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב שהוא איפשר לכל תלמיד לחבוש את קסדת הכבאי שלו (allowed each student to try it on).",
        "points": 10
      },
      {
        "id": "story-level1-12-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that describes what the children did while wearing the helmet.",
        "correctIndex": 0,
        "targetSentence": "The children took turns smiling for photos.",
        "explanationHebrew": "המשפט המדויק הוא: The children took turns smiling for photos.",
        "points": 10
      },
      {
        "id": "story-level1-12-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What did the students present to David before he left?",
        "correctIndex": 0,
        "modelAnswer": "They presented him with a hand-drawn poster thanking the firefighters.",
        "keywords": [
          "poster",
          "hand-drawn",
          "thanking"
        ],
        "explanationHebrew": "בפסקה 5 כתוב שהתלמידים העניקו לו כרזה מצוירת ביד (hand-drawn poster).",
        "points": 10
      },
      {
        "id": "story-level1-12-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "Where did David hang the poster?",
        "options": [
          "In his car",
          "On the station wall",
          "In the school cafeteria",
          "At his home bedroom"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 מסופר שהוא תלה את הכרזה על קיר התחנה (station wall).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-13",
    "title": "Noa's First Camping Trip",
    "hebrewTitle": "טיול המחנאות הראשון של נועה",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "Last weekend, nine-year-old Noa packed her green sleeping bag for her very first family camping trip in the Galilee mountains. She had never spent a night outdoors before and wondered what sleeping under the open sky would feel like.",
      "When they arrived at the forest campsite, Noa helped her father set up a large blue tent. They hammered four metal pegs firmly into the grass and spread out soft blankets inside. Nearby, a clear mountain stream bubbled softly over round river stones.",
      "As dusk fell, Noa's mother gathered dry pine cones and twigs to build a small campfire. They roasted sweet corn on wooden skewers and baked potatoes wrapped in silver foil. The warm fire illuminated their smiling faces.",
      "Later in the evening, Noa lay on a picnic blanket and gazed up at the night sky. Away from the bright city lights, thousands of brilliant stars sparkled like diamonds. Her father pointed out the Big Dipper constellation.",
      "Noa fell asleep inside the tent listening to the gentle chirping of crickets. The next morning, she declared that camping was the best outdoor adventure she had ever experienced."
    ],
    "vocabularyHints": [
      {
        "word": "campsite",
        "translation": "אתר מחנאות"
      },
      {
        "word": "pegs",
        "translation": "יתדות"
      },
      {
        "word": "stream",
        "translation": "נחל / פלג מים"
      },
      {
        "word": "illuminated",
        "translation": "האירה"
      },
      {
        "word": "constellation",
        "translation": "קבוצת כוכבים"
      },
      {
        "word": "crickets",
        "translation": "צרצרים"
      }
    ],
    "questions": [
      {
        "id": "story-level1-13-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where did Noa and her family go camping?",
        "options": [
          "In the Negev desert",
          "In the Galilee mountains",
          "Near the Dead Sea",
          "In a city park"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהם נסעו להרי הגליל (Galilee mountains).",
        "points": 10
      },
      {
        "id": "story-level1-13-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that shows this was Noa very first camping trip.",
        "correctIndex": 0,
        "targetSentence": "Last weekend, nine-year-old Noa packed her green sleeping bag for her very first family camping trip in the Galilee mountains.",
        "explanationHebrew": "המשפט המדויק הוא: Last weekend, nine-year-old Noa packed her green sleeping bag for her very first family camping trip in the Galilee mountains.",
        "points": 10
      },
      {
        "id": "story-level1-13-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What was bubbling softly near their campsite?",
        "correctIndex": 0,
        "modelAnswer": "A clear mountain stream bubbled softly over round river stones.",
        "keywords": [
          "stream",
          "mountain",
          "water"
        ],
        "explanationHebrew": "בפסקה 2 מסופר שפלג מים הררי זרם ופיכפך לידם (clear mountain stream).",
        "points": 10
      },
      {
        "id": "story-level1-13-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What color was the tent they set up?",
        "options": [
          "Green",
          "Blue",
          "Red",
          "Yellow"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהם הקימו אוהל כחול גדול (large blue tent).",
        "points": 10
      },
      {
        "id": "story-level1-13-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What food did they cook over the campfire?",
        "correctIndex": 0,
        "modelAnswer": "They roasted sweet corn and baked potatoes.",
        "keywords": [
          "sweet corn",
          "corn",
          "potatoes"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שהם קלו תירס מתוק ותפוחי אדמה אפויים (sweet corn and baked potatoes).",
        "points": 10
      },
      {
        "id": "story-level1-13-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that tells what the mother gathered to build the campfire.",
        "correctIndex": 0,
        "targetSentence": "As dusk fell, Noa's mother gathered dry pine cones and twigs to build a small campfire.",
        "explanationHebrew": "המשפט המדויק הוא: As dusk fell, Noa's mother gathered dry pine cones and twigs to build a small campfire.",
        "points": 10
      },
      {
        "id": "story-level1-13-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "Which constellation did Noa father point out in the sky?",
        "options": [
          "Orion Belt",
          "The Big Dipper",
          "The North Star",
          "Cassiopeia"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב שאביה הצביע על קבוצת כוכבי העגלה הגדולה (Big Dipper constellation).",
        "points": 10
      },
      {
        "id": "story-level1-13-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that compares the stars to diamonds.",
        "correctIndex": 0,
        "targetSentence": "Away from the bright city lights, thousands of brilliant stars sparkled like diamonds.",
        "explanationHebrew": "המשפט המדויק הוא: Away from the bright city lights, thousands of brilliant stars sparkled like diamonds.",
        "points": 10
      },
      {
        "id": "story-level1-13-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What sound helped Noa fall asleep inside the tent?",
        "options": [
          "The engine of cars",
          "The gentle chirping of crickets",
          "Loud music from radios",
          "Barking dogs"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 כתוב שהיא נרדמה לצלילי צרצור הצרצרים העדין (gentle chirping of crickets).",
        "points": 10
      },
      {
        "id": "story-level1-13-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What did Noa declare the next morning?",
        "correctIndex": 0,
        "modelAnswer": "She declared that camping was the best outdoor adventure she had ever experienced.",
        "keywords": [
          "camping",
          "best",
          "outdoor",
          "adventure"
        ],
        "explanationHebrew": "בסוף מסופר שנועה הכריזה שזה היה הטיול הטוב ביותר שחוותה אי פעם.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-14",
    "title": "The Musical Parrot",
    "hebrewTitle": "התוכי המוזיקלי",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "Ella has a cheerful pet parrot named Kiwi. Kiwi is a green parakeet with bright yellow feathers on his head and intelligent black eyes. Kiwi lives in a spacious white cage near the sunny living room window.",
      "Unlike most birds that only chirp simple songs, Kiwi has a remarkable talent for music. Whenever Ella practices her wooden flute after school, Kiwi tilts his head and listens attentively. Within days, Kiwi began whistling the melodies back to her.",
      "Kiwi's favorite song is a cheerful folk tune that Ella learned in music class. Whenever Ella plays the opening notes, Kiwi bobs his head up and down in perfect rhythm and whistles the chorus without missing a single beat.",
      "One sunny afternoon, Ella left the balcony door open while practicing. An elderly neighbor named Mr. Cohen stopped in the hallway and knocked on Ella door. He asked with a smile which famous guest flutist was visiting their home.",
      "When Ella showed him that the whistler was actually Kiwi the little parrot, Mr. Cohen laughed with delight. From that day on, Kiwi performed a mini-concert from the balcony window every Tuesday afternoon."
    ],
    "vocabularyHints": [
      {
        "word": "parakeet",
        "translation": "תוכון"
      },
      {
        "word": "spacious",
        "translation": "מרווח"
      },
      {
        "word": "remarkable",
        "translation": "יוצא דופן"
      },
      {
        "word": "melodies",
        "translation": "מנגינות"
      },
      {
        "word": "rhythm",
        "translation": "מקצב"
      },
      {
        "word": "delight",
        "translation": "שמחה והתפעלות"
      }
    ],
    "questions": [
      {
        "id": "story-level1-14-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What colors are Kiwi the parrot?",
        "options": [
          "Blue and white",
          "Green with yellow feathers on his head",
          "All red with black wings",
          "Grey and pink"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהוא תוכי ירוק עם נוצות צהובות על ראשו (green parakeet with bright yellow feathers on his head).",
        "points": 10
      },
      {
        "id": "story-level1-14-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that tells where Kiwi cage is located.",
        "correctIndex": 0,
        "targetSentence": "Kiwi lives in a spacious white cage near the sunny living room window.",
        "explanationHebrew": "המשפט המדויק הוא: Kiwi lives in a spacious white cage near the sunny living room window.",
        "points": 10
      },
      {
        "id": "story-level1-14-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What instrument does Ella practice after school?",
        "correctIndex": 0,
        "modelAnswer": "She practices her wooden flute.",
        "keywords": [
          "wooden",
          "flute"
        ],
        "explanationHebrew": "בפסקה 2 כתוב שהיא מנגנת בחליל עץ (wooden flute).",
        "points": 10
      },
      {
        "id": "story-level1-14-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "copy",
        "prompt": "Copy the sentence that describes what Kiwi did within days of listening.",
        "correctIndex": 0,
        "targetSentence": "Within days, Kiwi began whistling the melodies back to her.",
        "explanationHebrew": "המשפט המדויק הוא: Within days, Kiwi began whistling the melodies back to her.",
        "points": 10
      },
      {
        "id": "story-level1-14-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "mcq",
        "prompt": "What does Kiwi do when Ella plays his favorite song?",
        "options": [
          "He flies under the sofa",
          "He bobs his head up and down in rhythm and whistles",
          "He covers his ears",
          "He falls asleep"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 3 כתוב שהוא מניע את ראשו לקצב ושורק את הפזמון (bobs his head up and down in perfect rhythm).",
        "points": 10
      },
      {
        "id": "story-level1-14-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "Where did Ella learn Kiwi favorite song?",
        "correctIndex": 0,
        "modelAnswer": "She learned it in music class.",
        "keywords": [
          "music",
          "class"
        ],
        "explanationHebrew": "בפסקה 3 מצוין שהיא למדה את השיר בשיעור מוזיקה (music class).",
        "points": 10
      },
      {
        "id": "story-level1-14-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "Who knocked on Ella door one afternoon?",
        "options": [
          "Her school principal",
          "An elderly neighbor named Mr. Cohen",
          "A mail carrier",
          "Her music teacher"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מופיע השכן המבוגר מר כהן (Mr. Cohen).",
        "points": 10
      },
      {
        "id": "story-level1-14-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "open",
        "prompt": "What did Mr. Cohen ask with a smile?",
        "correctIndex": 0,
        "modelAnswer": "He asked which famous guest flutist was visiting their home.",
        "keywords": [
          "flutist",
          "famous",
          "visiting"
        ],
        "explanationHebrew": "בפסקה 4 הוא שאל איזה חלילן מפורסם מתארח בביתם.",
        "points": 10
      },
      {
        "id": "story-level1-14-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "copy",
        "prompt": "Copy the sentence that shows how Mr. Cohen reacted when he saw the parrot.",
        "correctIndex": 0,
        "targetSentence": "When Ella showed him that the whistler was actually Kiwi the little parrot, Mr. Cohen laughed with delight.",
        "explanationHebrew": "המשפט המדויק הוא: When Ella showed him that the whistler was actually Kiwi the little parrot, Mr. Cohen laughed with delight.",
        "points": 10
      },
      {
        "id": "story-level1-14-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "When did Kiwi perform a mini-concert from the balcony?",
        "options": [
          "Every Sunday morning",
          "Every Tuesday afternoon",
          "Only on holidays",
          "Once a year"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה האחרונה כתוב שקיווי הופיע בימי שלישי אחר הצהריים (every Tuesday afternoon).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-15",
    "title": "Ben Visits the Zoo",
    "hebrewTitle": "בן מבקר בגן החיות",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "On a warm Sunday morning, eight-year-old Ben and his grandfather visited the biblical zoo. Ben held a colorful map with pictures of different animals. He was eager to see the African savannah exhibit first.",
      "At the savannah exhibit, Ben stopped and stared in awe. Two magnificent giraffes were stretching their long necks to pluck acacia leaves from the highest branches. Beside them, three striped zebras were grazing quietly on golden grass.",
      "Next, they walked along the shady wooden bridge toward the penguin pool. A friendly zookeeper in khaki shorts was tossing small silver fish into the water. The penguins dove gracefully like little black-and-white torpedoes.",
      "The zookeeper noticed Ben's enthusiasm and answered his questions about penguin feathers. She explained that special natural oils keep their feathers waterproof so the birds stay completely dry and warm inside freezing water.",
      "Before leaving, Ben bought a small wooden giraffe souvenir at the gift shop. He told his grandfather that learning about wildlife had made this the best Sunday of the entire year."
    ],
    "vocabularyHints": [
      {
        "word": "savannah",
        "translation": "סוואנה (ערבה אפריקאית)"
      },
      {
        "word": "stretching",
        "translation": "מותחות"
      },
      {
        "word": "grazing",
        "translation": "רועות עשב"
      },
      {
        "word": "waterproof",
        "translation": "עמיד במים"
      },
      {
        "word": "torpedoes",
        "translation": "טורפדו (שוחים במהירות)"
      },
      {
        "word": "souvenir",
        "translation": "מזכרת"
      }
    ],
    "questions": [
      {
        "id": "story-level1-15-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Who visited the zoo with Ben on Sunday morning?",
        "options": [
          "His school teacher",
          "His grandfather",
          "His older brother",
          "His football coach"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שבן ביקר עם סבו (his grandfather).",
        "points": 10
      },
      {
        "id": "story-level1-15-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that tells what exhibit Ben wanted to see first.",
        "correctIndex": 0,
        "targetSentence": "He was eager to see the African savannah exhibit first.",
        "explanationHebrew": "המשפט המדויק הוא: He was eager to see the African savannah exhibit first.",
        "points": 10
      },
      {
        "id": "story-level1-15-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What were the two giraffes doing at the exhibit?",
        "correctIndex": 0,
        "modelAnswer": "They were stretching their long necks to pluck acacia leaves.",
        "keywords": [
          "stretching",
          "necks",
          "leaves",
          "acacia"
        ],
        "explanationHebrew": "בפסקה 2 מסופר שהג'ירפות מתחו את צווארן כדי לקטוף עלי שיטה (pluck acacia leaves).",
        "points": 10
      },
      {
        "id": "story-level1-15-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "How many zebras were grazing beside the giraffes?",
        "options": [
          "Two",
          "Three",
          "Five",
          "Ten"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהיו שם שלוש זברות מפוספסות (three striped zebras).",
        "points": 10
      },
      {
        "id": "story-level1-15-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that describes what the zookeeper was tossing into the water.",
        "correctIndex": 0,
        "targetSentence": "A friendly zookeeper in khaki shorts was tossing small silver fish into the water.",
        "explanationHebrew": "המשפט המדויק הוא: A friendly zookeeper in khaki shorts was tossing small silver fish into the water.",
        "points": 10
      },
      {
        "id": "story-level1-15-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What did the diving penguins look like in the water?",
        "correctIndex": 0,
        "modelAnswer": "They dove gracefully like little black-and-white torpedoes.",
        "keywords": [
          "torpedoes",
          "black-and-white",
          "dove"
        ],
        "explanationHebrew": "בפסקה 3 מתואר שהם צללו כמו טילי טורפדו שחורים-לבנים קטנים.",
        "points": 10
      },
      {
        "id": "story-level1-15-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "Why do penguins stay dry inside freezing water according to the zookeeper?",
        "options": [
          "They wear tiny jackets",
          "Special natural oils keep their feathers waterproof",
          "They never swim deep",
          "They have thick fur"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מוסבר ששמנים טבעיים שומרים על נוצותיהם אטומות למים (special natural oils keep their feathers waterproof).",
        "points": 10
      },
      {
        "id": "story-level1-15-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that explains how the oils protect the penguins.",
        "correctIndex": 0,
        "targetSentence": "She explained that special natural oils keep their feathers waterproof so the birds stay completely dry and warm inside freezing water.",
        "explanationHebrew": "המשפט המדויק הוא: She explained that special natural oils keep their feathers waterproof so the birds stay completely dry and warm inside freezing water.",
        "points": 10
      },
      {
        "id": "story-level1-15-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What souvenir did Ben buy at the gift shop?",
        "correctIndex": 0,
        "modelAnswer": "He bought a small wooden giraffe souvenir.",
        "keywords": [
          "wooden",
          "giraffe",
          "souvenir"
        ],
        "explanationHebrew": "בפסקה 5 כתוב שהוא קנה ג'ירפה מעץ למזכרת (small wooden giraffe souvenir).",
        "points": 10
      },
      {
        "id": "story-level1-15-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "How did Ben feel about his visit to the zoo?",
        "options": [
          "It was boring and hot",
          "It was the best Sunday of the entire year",
          "He wished he had stayed home",
          "He was scared of the animals"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 בן אמר שזה היה יום ראשון הטוב ביותר של השנה כולה (the best Sunday of the entire year).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-16",
    "title": "The Sandcastle Contest",
    "hebrewTitle": "תחרות ארמונות החול",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "Every July, the city of Netanya hosts an exciting sandcastle competition on its sandy Mediterranean shore. Families and children gather with shovels, plastic buckets, and wooden molds to create fantastic sculptures.",
      "Ten-year-old Liam and his twelve-year-old sister Mia entered the junior competition. They agreed to construct an ancient royal fortress complete with four towers, a deep moat, and a working drawbridge.",
      "The secret to durable sand building is using damp sand. Liam carried buckets of seawater from the waves, while Mia mixed the sand until it felt like soft clay. They packed the mixture firmly into round plastic buckets to form tall towers.",
      "Along the fortress walls, Mia arranged shiny white seashells and smooth sea-glass. Liam carved windows using a wooden popsicle stick. Many people stopped to admire their careful craftsmanship and take photographs.",
      "At three o'clock, the judges blew a brass horn and awarded Liam and Mia the first-place blue ribbon. The brother and sister smiled proudly, realizing that cooperation and creativity had made their dream castle a reality."
    ],
    "vocabularyHints": [
      {
        "word": "sculptures",
        "translation": "פסלים"
      },
      {
        "word": "fortress",
        "translation": "מבצר"
      },
      {
        "word": "moat",
        "translation": "חפיר (תעלת מים סביב מבצר)"
      },
      {
        "word": "drawbridge",
        "translation": "גשר מתרומם"
      },
      {
        "word": "damp",
        "translation": "לח"
      },
      {
        "word": "craftsmanship",
        "translation": "מיומנות יצירה"
      }
    ],
    "questions": [
      {
        "id": "story-level1-16-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where does the sandcastle competition take place every July?",
        "options": [
          "In Eilat on the Red Sea",
          "On the Mediterranean shore of Netanya",
          "At Lake Kinneret",
          "In Tel Aviv port"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהתחרות מתקיימת בחוף נתניה (on its sandy Mediterranean shore).",
        "points": 10
      },
      {
        "id": "story-level1-16-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that tells what tools people bring to create sculptures.",
        "correctIndex": 0,
        "targetSentence": "Families and children gather with shovels, plastic buckets, and wooden molds to create fantastic sculptures.",
        "explanationHebrew": "המשפט המדויק הוא: Families and children gather with shovels, plastic buckets, and wooden molds to create fantastic sculptures.",
        "points": 10
      },
      {
        "id": "story-level1-16-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What kind of building did Liam and Mia agree to construct?",
        "correctIndex": 0,
        "modelAnswer": "They agreed to construct an ancient royal fortress.",
        "keywords": [
          "ancient",
          "royal",
          "fortress"
        ],
        "explanationHebrew": "בפסקה 2 נכתב שהם הסכימו לבנות מבצר מלכותי עתיק (ancient royal fortress).",
        "points": 10
      },
      {
        "id": "story-level1-16-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "How many towers did their fortress have?",
        "options": [
          "One",
          "Two",
          "Four",
          "Eight"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 2 כתוב ארבעה מגדלים (four towers).",
        "points": 10
      },
      {
        "id": "story-level1-16-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that states the secret to durable sand building.",
        "correctIndex": 0,
        "targetSentence": "The secret to durable sand building is using damp sand.",
        "explanationHebrew": "המשפט המדויק הוא: The secret to durable sand building is using damp sand.",
        "points": 10
      },
      {
        "id": "story-level1-16-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What did Liam carry from the waves?",
        "correctIndex": 0,
        "modelAnswer": "Liam carried buckets of seawater.",
        "keywords": [
          "buckets",
          "seawater",
          "water"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שליאם נשא דליי מי ים מהגלים (buckets of seawater).",
        "points": 10
      },
      {
        "id": "story-level1-16-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What tool did Liam use to carve windows in the walls?",
        "options": [
          "A plastic fork",
          "A wooden popsicle stick",
          "A metal spoon",
          "His finger"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב שהוא גילף חלונות במקל ארטיק מעץ (wooden popsicle stick).",
        "points": 10
      },
      {
        "id": "story-level1-16-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that tells what Mia arranged along the fortress walls.",
        "correctIndex": 0,
        "targetSentence": "Along the fortress walls, Mia arranged shiny white seashells and smooth sea-glass.",
        "explanationHebrew": "המשפט המדויק הוא: Along the fortress walls, Mia arranged shiny white seashells and smooth sea-glass.",
        "points": 10
      },
      {
        "id": "story-level1-16-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What award did the judges give to Liam and Mia?",
        "options": [
          "A gold coin",
          "The first-place blue ribbon",
          "A silver medal",
          "A box of chocolates"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 מצוין שהם קיבלו סרט כחול של המקום הראשון (first-place blue ribbon).",
        "points": 10
      },
      {
        "id": "story-level1-16-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What two things helped make their dream castle a reality?",
        "correctIndex": 0,
        "modelAnswer": "Cooperation and creativity.",
        "keywords": [
          "cooperation",
          "creativity"
        ],
        "explanationHebrew": "בפסקה 5 מודגש ששיתוף פעולה ויצירתיות הפכו את הארמון למציאות.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-17",
    "title": "The Little Green Dinosaur",
    "hebrewTitle": "הדינוזאור הירוק הקטן",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "Seven-year-old Lucas had a small rubber toy named Rex. Rex was a bright green dinosaur with soft purple spikes on his back and friendly black eyes. Lucas had received Rex from his aunt and carried him wherever he went.",
      "One afternoon, Lucas was building a tall wooden block castle on his bedroom rug. Rex stood at the top tower as the brave protector of the kingdom. When Lucas's mother called him for dinner, Lucas hurried to the kitchen and forgot Rex on the floor.",
      "Later that evening, Lucas returned to his bedroom to sleep. He looked everywhere for Rex—under his desk, inside his schoolbag, and between his bed sheets. The green dinosaur was nowhere to be found, and Lucas felt very sad.",
      "Suddenly, Lucas's golden retriever dog, Toby, walked proudly into the bedroom. In his gentle mouth, Toby carried the little green dinosaur without leaving a single scratch on the soft rubber. Toby dropped Rex right into Lucas's hands.",
      "Lucas hugged Toby tightly and thanked him for finding his favorite toy. That night, Lucas placed Rex safely on his bedside table, glad that his loyal pet had saved the day."
    ],
    "vocabularyHints": [
      {
        "word": "rubber",
        "translation": "גומי"
      },
      {
        "word": "spikes",
        "translation": "קוצים / קשקשים"
      },
      {
        "word": "protector",
        "translation": "מגן / שומר"
      },
      {
        "word": "sheets",
        "translation": "סדינים"
      },
      {
        "word": "retriever",
        "translation": "רטריבר (גזע כלבים)"
      },
      {
        "word": "scratch",
        "translation": "שריטה"
      }
    ],
    "questions": [
      {
        "id": "story-level1-17-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Who gave Rex the toy dinosaur to Lucas?",
        "options": [
          "His grandmother",
          "His school teacher",
          "His aunt",
          "His older sister"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 1 כתוב שלוקאס קיבל את הצעצוע מדודתו (from his aunt).",
        "points": 10
      },
      {
        "id": "story-level1-17-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes Rex colors and features.",
        "correctIndex": 0,
        "targetSentence": "Rex was a bright green dinosaur with soft purple spikes on his back and friendly black eyes.",
        "explanationHebrew": "המשפט המדויק הוא: Rex was a bright green dinosaur with soft purple spikes on his back and friendly black eyes.",
        "points": 10
      },
      {
        "id": "story-level1-17-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What was Lucas building on his bedroom rug?",
        "correctIndex": 0,
        "modelAnswer": "He was building a tall wooden block castle.",
        "keywords": [
          "wooden",
          "block",
          "castle"
        ],
        "explanationHebrew": "בפסקה 2 כתוב שהוא בנה ארמון מקוביות עץ (tall wooden block castle).",
        "points": 10
      },
      {
        "id": "story-level1-17-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "Why did Lucas leave his bedroom in a hurry?",
        "options": [
          "He heard a strange noise",
          "His mother called him for dinner",
          "He wanted to watch cartoons",
          "His friend rang the doorbell"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 מסופר שאמו קראה לו לארוחת ערב (mother called him for dinner).",
        "points": 10
      },
      {
        "id": "story-level1-17-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that lists the places Lucas searched for Rex.",
        "correctIndex": 0,
        "targetSentence": "He looked everywhere for Rex—under his desk, inside his schoolbag, and between his bed sheets.",
        "explanationHebrew": "המשפט המדויק הוא: He looked everywhere for Rex—under his desk, inside his schoolbag, and between his bed sheets.",
        "points": 10
      },
      {
        "id": "story-level1-17-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "How did Lucas feel when he could not find Rex?",
        "correctIndex": 0,
        "modelAnswer": "Lucas felt very sad.",
        "keywords": [
          "sad",
          "very"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שלוקאס הרגיש עצוב מאוד (felt very sad).",
        "points": 10
      },
      {
        "id": "story-level1-17-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What kind of pet is Toby?",
        "options": [
          "A black cat",
          "A golden retriever dog",
          "A white rabbit",
          "A pet hamster"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב שטובי הוא כלב גולדן רטריבר (golden retriever dog).",
        "points": 10
      },
      {
        "id": "story-level1-17-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that shows Toby carried the toy gently.",
        "correctIndex": 0,
        "targetSentence": "In his gentle mouth, Toby carried the little green dinosaur without leaving a single scratch on the soft rubber.",
        "explanationHebrew": "המשפט המדויק הוא: In his gentle mouth, Toby carried the little green dinosaur without leaving a single scratch on the soft rubber.",
        "points": 10
      },
      {
        "id": "story-level1-17-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "Where did Lucas place Rex before going to sleep?",
        "correctIndex": 0,
        "modelAnswer": "He placed Rex safely on his bedside table.",
        "keywords": [
          "bedside table",
          "table"
        ],
        "explanationHebrew": "בפסקה האחרונה כתוב שהוא הניח אותו על שידת המיטה (bedside table).",
        "points": 10
      },
      {
        "id": "story-level1-17-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "Why did Lucas thank Toby?",
        "options": [
          "For eating his dinner",
          "For finding his favorite toy",
          "For doing a trick",
          "For guarding the front door"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 5 לוקאס הודה לו שמצא את הצעצוע האהוב עליו (for finding his favorite toy).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-18",
    "title": "Emma's First Day at School",
    "hebrewTitle": "היום הראשון של אמה בבית הספר",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "On the first day of September, seven-year-old Emma woke up early. Her new yellow backpack sat on the bedroom chair packed with fresh notebooks, shiny colored pencils, and a blue water bottle. Today was her first day at Green Valley Elementary School.",
      "Emma felt small butterflies fluttering in her stomach as she walked into the bustling schoolyard with her father. Everything looked so big—the tall red-brick buildings, the sprawling playground, and the hundreds of children running around.",
      "At the entrance of room 104, her teacher, Ms. Sharon, greeted Emma with a warm and gentle smile. She pinned a round name tag on Emma shirt and showed her to a bright desk next to a sunny window.",
      "Beside Emma sat a cheerful girl named Sara. When the class was asked to draw their favorite summer memory, Sara noticed Emma was looking for a green crayon. Sara offered her own box and said, 'Let us share!'",
      "During recess, Emma and Sara played tag on the swings and shared sweet apple slices. When the final bell rang at two o'clock, Emma ran happily to her father and told him she could not wait to return tomorrow."
    ],
    "vocabularyHints": [
      {
        "word": "bustling",
        "translation": "שוקק חיים / סואן"
      },
      {
        "word": "butterflies in stomach",
        "translation": "פרפרים בבטן (התרגשות)"
      },
      {
        "word": "sprawling",
        "translation": "רחב ידיים"
      },
      {
        "word": "greeted",
        "translation": "בירכה לשלום"
      },
      {
        "word": "recess",
        "translation": "הפסקה"
      },
      {
        "word": "recess",
        "translation": "הפסקה"
      }
    ],
    "questions": [
      {
        "id": "story-level1-18-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "What color was Emma new backpack?",
        "options": [
          "Red",
          "Yellow",
          "Blue",
          "Green"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהתיק היה צהוב (yellow backpack).",
        "points": 10
      },
      {
        "id": "story-level1-18-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that names Emma new elementary school.",
        "correctIndex": 0,
        "targetSentence": "Today was her first day at Green Valley Elementary School.",
        "explanationHebrew": "המשפט המדויק הוא: Today was her first day at Green Valley Elementary School.",
        "points": 10
      },
      {
        "id": "story-level1-18-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "How did Emma feel as she walked into the schoolyard?",
        "correctIndex": 0,
        "modelAnswer": "She felt small butterflies fluttering in her stomach.",
        "keywords": [
          "butterflies",
          "stomach",
          "nervous"
        ],
        "explanationHebrew": "בפסקה 2 מתואר שהיו לה פרפרים בבטן (butterflies fluttering in her stomach).",
        "points": 10
      },
      {
        "id": "story-level1-18-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "Who walked with Emma into the schoolyard?",
        "options": [
          "Her grandmother",
          "Her father",
          "Her older sister",
          "Her neighbor"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהיא נכנסה עם אביה (with her father).",
        "points": 10
      },
      {
        "id": "story-level1-18-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that tells how Ms. Sharon greeted Emma.",
        "correctIndex": 0,
        "targetSentence": "At the entrance of room 104, her teacher, Ms. Sharon, greeted Emma with a warm and gentle smile.",
        "explanationHebrew": "המשפט המדויק הוא: At the entrance of room 104, her teacher, Ms. Sharon, greeted Emma with a warm and gentle smile.",
        "points": 10
      },
      {
        "id": "story-level1-18-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What did Ms. Sharon pin on Emma shirt?",
        "correctIndex": 0,
        "modelAnswer": "She pinned a round name tag on Emma shirt.",
        "keywords": [
          "round",
          "name tag",
          "tag"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שהיא הצמידה תג שם עגול לחולצתה (round name tag).",
        "points": 10
      },
      {
        "id": "story-level1-18-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What color crayon was Emma looking for?",
        "options": [
          "A red crayon",
          "A green crayon",
          "A purple crayon",
          "A black crayon"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 מסופר שאמה חיפשה צבע פנדה ירוק (green crayon).",
        "points": 10
      },
      {
        "id": "story-level1-18-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy what Sara said when offering her box of crayons.",
        "correctIndex": 0,
        "targetSentence": "Sara offered her own box and said, 'Let us share!'",
        "explanationHebrew": "המשפט המדויק הוא: Sara offered her own box and said, 'Let us share!'",
        "points": 10
      },
      {
        "id": "story-level1-18-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What fruit did Emma and Sara share during recess?",
        "correctIndex": 0,
        "modelAnswer": "They shared sweet apple slices.",
        "keywords": [
          "apple",
          "slices",
          "sweet"
        ],
        "explanationHebrew": "בפסקה 5 כתוב שהן חלקו פלחי תפוח מתוקים (sweet apple slices).",
        "points": 10
      },
      {
        "id": "story-level1-18-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What did Emma tell her father when school ended?",
        "options": [
          "She wanted to change schools",
          "She could not wait to return tomorrow",
          "She forgot her backpack",
          "She was too tired"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסוף מסופר שהיא אמרה לאביה שהיא לא יכולה לחכות לחזור מחר לבית הספר.",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-19",
    "title": "The Squirrel and the Hidden Acorns",
    "hebrewTitle": "הסנאי והבלוטים המוחבאים",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "In a tranquil forest park, an energetic red squirrel named Rusty lived in the hollow of a tall oak tree. Autumn had arrived, and the forest canopy was glowing with magnificent red and gold leaves.",
      "Rusty knew that cold winter frost would arrive soon. Every morning, he scurried along the ground collecting plump brown acorns that had fallen from the oak trees. His bushy tail helped him balance as he bounded between heavy branches.",
      "Instead of keeping all his food in one place, Rusty was very clever. He dug dozens of small holes in the soft mossy earth and buried two or three acorns in each hiding spot, covering them with dry leaves.",
      "When December arrived, snow blanketed the forest floor. Rusty easily found most of his secret pantries using his keen sense of smell. However, he forgot where several of his buried treasures were located.",
      "In the spring, warm rain soaked into the earth. The forgotten acorns sprouted green shoots and began growing into tiny oak saplings. Without knowing it, Rusty had helped plant a whole new generation of forest trees."
    ],
    "vocabularyHints": [
      {
        "word": "tranquil",
        "translation": "שקט ורגוע"
      },
      {
        "word": "hollow",
        "translation": "חלל בעץ"
      },
      {
        "word": "scurried",
        "translation": "התרוצץ בזריזות"
      },
      {
        "word": "pantries",
        "translation": "מזווים (מחסני מזון)"
      },
      {
        "word": "sprouted",
        "translation": "נבטו"
      },
      {
        "word": "saplings",
        "translation": "שתילים צעירים"
      }
    ],
    "questions": [
      {
        "id": "story-level1-19-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "Where did Rusty the squirrel live?",
        "options": [
          "In an underground burrow",
          "In the hollow of a tall oak tree",
          "In a wooden birdhouse",
          "Inside a city attic"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 1 כתוב שהוא חי בחלל עץ אלון גבוה (in the hollow of a tall oak tree).",
        "points": 10
      },
      {
        "id": "story-level1-19-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that describes the colors of the forest leaves in autumn.",
        "correctIndex": 0,
        "targetSentence": "Autumn had arrived, and the forest canopy was glowing with magnificent red and gold leaves.",
        "explanationHebrew": "המשפט המדויק הוא: Autumn had arrived, and the forest canopy was glowing with magnificent red and gold leaves.",
        "points": 10
      },
      {
        "id": "story-level1-19-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "What helped Rusty balance as he bounded between branches?",
        "correctIndex": 0,
        "modelAnswer": "His bushy tail helped him balance.",
        "keywords": [
          "bushy tail",
          "tail",
          "balance"
        ],
        "explanationHebrew": "בפסקה 2 מוסבר שזנבו העבות עזר לו לשמור על שיווי משקל (His bushy tail helped him balance).",
        "points": 10
      },
      {
        "id": "story-level1-19-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "What kind of food did Rusty collect every morning?",
        "options": [
          "Sweet berries",
          "Plump brown acorns",
          "Green pine needles",
          "Small insects"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהוא אסף בלוטים שמנמנים וחומים (plump brown acorns).",
        "points": 10
      },
      {
        "id": "story-level1-19-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that tells how many acorns Rusty buried in each hole.",
        "correctIndex": 0,
        "targetSentence": "He dug dozens of small holes in the soft mossy earth and buried two or three acorns in each hiding spot, covering them with dry leaves.",
        "explanationHebrew": "המשפט המדויק הוא: He dug dozens of small holes in the soft mossy earth and buried two or three acorns in each hiding spot, covering them with dry leaves.",
        "points": 10
      },
      {
        "id": "story-level1-19-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "What did Rusty use to cover his buried acorns?",
        "correctIndex": 0,
        "modelAnswer": "He covered them with dry leaves.",
        "keywords": [
          "dry leaves",
          "leaves"
        ],
        "explanationHebrew": "בפסקה 3 כתוב שהוא כיסה אותם בעלים יבשים (dry leaves).",
        "points": 10
      },
      {
        "id": "story-level1-19-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What sense did Rusty use to find his secret food pantries in winter?",
        "options": [
          "His keen sense of smell",
          "His sharp hearing",
          "A map he drew",
          "His sense of taste"
        ],
        "correctIndex": 0,
        "explanationHebrew": "בפסקה 4 נכתב שהוא נעזר בחוש הריח החד שלו (keen sense of smell).",
        "points": 10
      },
      {
        "id": "story-level1-19-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that tells what happened to some of his buried treasures.",
        "correctIndex": 0,
        "targetSentence": "However, he forgot where several of his buried treasures were located.",
        "explanationHebrew": "המשפט המדויק הוא: However, he forgot where several of his buried treasures were located.",
        "points": 10
      },
      {
        "id": "story-level1-19-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "What happened to the forgotten acorns in the spring?",
        "correctIndex": 0,
        "modelAnswer": "They sprouted green shoots and began growing into tiny oak saplings.",
        "keywords": [
          "sprouted",
          "shoots",
          "saplings",
          "oak"
        ],
        "explanationHebrew": "בפסקה 5 מסופר שהם הצמיחו נצרים ירוקים והחלו לגדול לשתילים צעירים.",
        "points": 10
      },
      {
        "id": "story-level1-19-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "What did Rusty unknowingly help do for the forest?",
        "options": [
          "He cleared fallen branches",
          "He helped plant a new generation of forest trees",
          "He scared away dangerous wolves",
          "He built bridges over streams"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסוף מסופר שבלי לדעת הוא עזר לנטוע דור חדש של עצי יער (helped plant a whole new generation of forest trees).",
        "points": 10
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "story-level1-20",
    "title": "A Surprise Birthday Party",
    "hebrewTitle": "מסיבת יום הולדת בהפתעה",
    "level": "Level 1",
    "levelLabel": "רמה 1 - קוראים מתחילים",
    "levelDescription": "Starting level English, for students who are beginner readers.",
    "paragraphs": [
      "Tuesday was Ron's tenth birthday. When Ron woke up in the morning, nobody said 'Happy Birthday' to him. His father was reading the newspaper, and his mother was washing breakfast dishes. Ron felt a little disappointed thinking they had forgotten.",
      "Ron spent the afternoon at soccer practice with his friends. When practice ended at five o'clock, his father picked him up in the car. The ride home was very quiet, and the house looked completely dark from the outside.",
      "Ron unlocked the front door and stepped into the shadowy living room. Suddenly, the ceiling lights clicked on with a bright flash! Twenty of his closest classmates and family members leaped up from behind furniture shouting, 'Surprise!'",
      "The living room was decorated with shiny silver balloons and colorful paper streamers. His grandmother carried out a two-layer chocolate cake topped with ten glowing candles and sweet vanilla frosting.",
      "Ron blew out all ten candles in a single breath while making a secret wish. He smiled broadly at his parents and friends, overjoyed to know that their silence was all part of the best surprise celebration of his life."
    ],
    "vocabularyHints": [
      {
        "word": "disappointed",
        "translation": "מאוכזב"
      },
      {
        "word": "shadowy",
        "translation": "מוצל / חשוך מעט"
      },
      {
        "word": "streamers",
        "translation": "סרטי קישוט צבעוניים"
      },
      {
        "word": "frosting",
        "translation": "ציפוי סוכר / קרם"
      },
      {
        "word": "secret wish",
        "translation": "משאלה סודית"
      },
      {
        "word": "overjoyed",
        "translation": "מאושר מאוד"
      }
    ],
    "questions": [
      {
        "id": "story-level1-20-q1",
        "number": 1,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "mcq",
        "prompt": "How old was Ron turning on Tuesday?",
        "options": [
          "Eight",
          "Nine",
          "Ten",
          "Twelve"
        ],
        "correctIndex": 2,
        "explanationHebrew": "בפסקה 1 כתוב שזה היה יום הולדתו העשירי (tenth birthday).",
        "points": 10
      },
      {
        "id": "story-level1-20-q2",
        "number": 2,
        "paragraphIndex": 0,
        "linesHint": "Paragraph 1",
        "type": "copy",
        "prompt": "Copy the sentence that tells why Ron felt disappointed in the morning.",
        "correctIndex": 0,
        "targetSentence": "Ron felt a little disappointed thinking they had forgotten.",
        "explanationHebrew": "המשפט המדויק הוא: Ron felt a little disappointed thinking they had forgotten.",
        "points": 10
      },
      {
        "id": "story-level1-20-q3",
        "number": 3,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "open",
        "prompt": "Where did Ron spend his afternoon?",
        "correctIndex": 0,
        "modelAnswer": "He spent the afternoon at soccer practice with his friends.",
        "keywords": [
          "soccer practice",
          "practice",
          "friends"
        ],
        "explanationHebrew": "בפסקה 2 כתוב שהוא בילה באימון כדורגל עם חבריו (soccer practice).",
        "points": 10
      },
      {
        "id": "story-level1-20-q4",
        "number": 4,
        "paragraphIndex": 1,
        "linesHint": "Paragraph 2",
        "type": "mcq",
        "prompt": "How did the house look from the outside when Ron arrived home?",
        "options": [
          "Full of loud music",
          "Completely dark",
          "Covered in balloons",
          "Crowded with cars"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 2 כתוב שהבית נראה חשוך לחלוטין מבחוץ (completely dark from the outside).",
        "points": 10
      },
      {
        "id": "story-level1-20-q5",
        "number": 5,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "copy",
        "prompt": "Copy the sentence that describes what happened when the ceiling lights turned on.",
        "correctIndex": 0,
        "targetSentence": "Twenty of his closest classmates and family members leaped up from behind furniture shouting, 'Surprise!'",
        "explanationHebrew": "המשפט המדויק הוא: Twenty of his closest classmates and family members leaped up from behind furniture shouting, 'Surprise!'",
        "points": 10
      },
      {
        "id": "story-level1-20-q6",
        "number": 6,
        "paragraphIndex": 2,
        "linesHint": "Paragraph 3",
        "type": "open",
        "prompt": "How many people leaped up shouting surprise?",
        "correctIndex": 0,
        "modelAnswer": "Twenty of his closest classmates and family members.",
        "keywords": [
          "twenty",
          "classmates",
          "family"
        ],
        "explanationHebrew": "בפסקה 3 כתוב עשרים מחבריו לכיתה ובני משפחתו (Twenty).",
        "points": 10
      },
      {
        "id": "story-level1-20-q7",
        "number": 7,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "mcq",
        "prompt": "What kind of cake did Ron grandmother carry out?",
        "options": [
          "A strawberry cheesecake",
          "A two-layer chocolate cake with ten candles",
          "An apple pie",
          "A lemon tart"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בפסקה 4 כתוב עוגת שוקולד דו-שכבתית עם עשרה נרות (two-layer chocolate cake topped with ten glowing candles).",
        "points": 10
      },
      {
        "id": "story-level1-20-q8",
        "number": 8,
        "paragraphIndex": 3,
        "linesHint": "Paragraph 4",
        "type": "copy",
        "prompt": "Copy the sentence that tells how the living room was decorated.",
        "correctIndex": 0,
        "targetSentence": "The living room was decorated with shiny silver balloons and colorful paper streamers.",
        "explanationHebrew": "המשפט המדויק הוא: The living room was decorated with shiny silver balloons and colorful paper streamers.",
        "points": 10
      },
      {
        "id": "story-level1-20-q9",
        "number": 9,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "open",
        "prompt": "How many breaths did it take Ron to blow out all ten candles?",
        "correctIndex": 0,
        "modelAnswer": "He blew out all ten candles in a single breath.",
        "keywords": [
          "single breath",
          "one breath",
          "single"
        ],
        "explanationHebrew": "בפסקה 5 כתוב שהוא כיבה את כל עשרת הנרות בנשיפה אחת (single breath).",
        "points": 10
      },
      {
        "id": "story-level1-20-q10",
        "number": 10,
        "paragraphIndex": 4,
        "linesHint": "Paragraph 5",
        "type": "mcq",
        "prompt": "Why had Ron family been silent in the morning?",
        "options": [
          "They really forgot his birthday",
          "It was part of the plan for the surprise party",
          "They were upset with him",
          "They were sick"
        ],
        "correctIndex": 1,
        "explanationHebrew": "בסוף מוסבר שהשקט היה חלק מתכנון מסיבת ההפתעה (part of the best surprise celebration).",
        "points": 10
      }
    ],
    "totalPoints": 100
  }
];
