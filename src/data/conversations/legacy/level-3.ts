import { ConversationScenario } from "@/types/conversation";

export const LEVEL_3_CONVERSATIONS: ConversationScenario[] = [
  {
    "id": "conv-l3-team-project",
    "title": "University Capstone Research Methodology Debate",
    "hebrewTitle": "דיון מתודולוגי בפרויקט גמר אקדמי",
    "category": "school_social",
    "categoryLabelHebrew": "לימודים ואקדמיה",
    "settingDescription": "Two graduate students passionately debate whether to rely on quantitative survey data or in-depth qualitative interviews for their urban resilience thesis.",
    "level": "Level 3",
    "levelLabel": "רמה 3 - תקשורת מתקדמת ופתרון בעיות",
    "levelDescription": "Nuanced real-world communication, professional problem-solving, and advanced idioms.",
    "speakers": [
      {
        "id": "speaker_a",
        "name": "Noah",
        "role": "Graduate Research Partner",
        "avatarEmoji": "🎓",
        "genderHint": "male",
        "colorTheme": "sky"
      },
      {
        "id": "speaker_b",
        "name": "Liam",
        "role": "Graduate Research Partner",
        "avatarEmoji": "📊",
        "genderHint": "male",
        "colorTheme": "amber"
      }
    ],
    "turns": [
      {
        "index": 0,
        "speakerId": "speaker_a",
        "text": "Hey Liam, I reviewed our capstone draft on urban climate resilience, and I think relying solely on survey questionnaires leaves substantial empirical blind spots."
      },
      {
        "index": 1,
        "speakerId": "speaker_b",
        "text": "I see your concern, Noah, but distributing 500 online questionnaires provides statistically significant sample sizes for our regression analysis within the tight deadline."
      },
      {
        "index": 2,
        "speakerId": "speaker_a",
        "text": "Sample size is crucial, yet superficial Likert-scale answers cannot capture how municipal residents actually navigate recurring power outages during heatwaves."
      },
      {
        "index": 3,
        "speakerId": "speaker_b",
        "text": "That is true, but qualitative methodology requires hours of verbatim transcription and coding, which Professor Sterling warned could derail our submission timetable."
      },
      {
        "index": 4,
        "speakerId": "speaker_a",
        "text": "What if we adopt a mixed-methods convergent design instead of choosing one exclusively?"
      },
      {
        "index": 5,
        "speakerId": "speaker_b",
        "text": "How would that look in practice without doubling our anticipated workload over the next fortnight?"
      },
      {
        "index": 6,
        "speakerId": "speaker_a",
        "text": "We retain your 500-participant quantitative survey as the foundational baseline, but embed purposeful open-ended prompts for a targeted subset."
      },
      {
        "index": 7,
        "speakerId": "speaker_b",
        "text": "A nested sample? So we recruit perhaps twelve to fifteen survey respondents who experienced acute grid failures for twenty-minute semi-structured follow-up interviews?"
      },
      {
        "index": 8,
        "speakerId": "speaker_a",
        "text": "Exactly. That way we gather macro-level demographic patterns while corroborating them with lived, granular narratives."
      },
      {
        "index": 9,
        "speakerId": "speaker_b",
        "text": "It does sound more academically robust. Which specific analytical framework would we use to synthesize the qualitative interview transcripts?"
      },
      {
        "index": 10,
        "speakerId": "speaker_a",
        "text": "Inductive thematic analysis using Braun and Clarke's six-phase approach; it aligns smoothly with our urban planning criteria."
      },
      {
        "index": 11,
        "speakerId": "speaker_b",
        "text": "Okay, but who assumes primary responsibility for securing the necessary expedited ethics clearance before we commence recording?"
      },
      {
        "index": 12,
        "speakerId": "speaker_a",
        "text": "I already drafted the Institutional Review Board protocol and anonymization consent forms over the weekend, so I will submit them by Tuesday morning."
      },
      {
        "index": 13,
        "speakerId": "speaker_b",
        "text": "Excellent initiative. Meanwhile, I will calibrate the survey instrument in Qualtrics and pilot test the multiple-choice questions on five peer researchers."
      },
      {
        "index": 14,
        "speakerId": "speaker_a",
        "text": "Perfect. Make sure the demographic filtering questions distinguish between homeowners and high-density apartment tenants."
      },
      {
        "index": 15,
        "speakerId": "speaker_b",
        "text": "Good catch; socioeconomic disparities between tenure types strongly influence adaptive cooling capacity."
      },
      {
        "index": 16,
        "speakerId": "speaker_a",
        "text": "Furthermore, our literature review needs updating to cite recent peer-reviewed longitudinal studies from 2024."
      },
      {
        "index": 17,
        "speakerId": "speaker_b",
        "text": "I already bookmarked three articles from the Journal of Environmental Psychology that explicitly discuss heat vulnerability metrics."
      },
      {
        "index": 18,
        "speakerId": "speaker_a",
        "text": "Let us convene via video conference on Thursday evening to review the pilot survey feedback and adjust ambiguous wording."
      },
      {
        "index": 19,
        "speakerId": "speaker_b",
        "text": "Agreed. If ethics approval clears by next Monday, we can launch data collection across both university and neighborhood forums simultaneously."
      },
      {
        "index": 20,
        "speakerId": "speaker_a",
        "text": "I feel much more confident presenting this comprehensive methodology to the capstone examination committee next month."
      },
      {
        "index": 21,
        "speakerId": "speaker_b",
        "text": "Likewise; blending empirical rigor with authentic human insight will give our thesis a distinctive competitive edge."
      }
    ],
    "usefulPhrases": [
      {
        "phrase": "empirical blind spots",
        "translation": "נקודות עיוורות במחקר אמפירי"
      },
      {
        "phrase": "convergent mixed-methods design",
        "translation": "מערך מחקר משולב מתכנס (כמותי ואיכותני)"
      },
      {
        "phrase": "nested purposive sampling",
        "translation": "מדגם מקונן ייעודי של מרואיינים"
      },
      {
        "phrase": "inductive thematic analysis",
        "translation": "ניתוח תמטי אינדוקטיבי של טקסטים וראיונות"
      },
      {
        "phrase": "institutional ethics clearance",
        "translation": "אישור ועדת אתיקה מוסדית למחקר"
      }
    ],
    "questions": [
      {
        "id": "conv-l3-team-q1",
        "number": 1,
        "turnRefIndex": 0,
        "linesHint": "Line 1",
        "type": "mcq",
        "prompt": "What is Noah's primary concern regarding the capstone methodology in Line 1?",
        "explanationHebrew": "בשורה 1 נוח מסביר שהסתמכות בלעדית על שאלונים מותירה נקודות עיוורות אמפיריות.",
        "points": 10,
        "options": [
          "That relying exclusively on survey questionnaires overlooks critical empirical nuances.",
          "That the sample size of five hundred people is too small for statistical significance.",
          "That the university ethics committee will reject questionnaires completely.",
          "That the online survey platform costs more than their research budget allows."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-team-q2",
        "number": 2,
        "turnRefIndex": 1,
        "linesHint": "Line 2",
        "type": "open",
        "prompt": "Why did Liam originally favor distributing five hundred online questionnaires?",
        "explanationHebrew": "בשורה 2 ליאם טוען ש-500 שאלונים מספקים גודל מדגם מובהק סטטיסטית לניתוח רגרסיה.",
        "points": 10,
        "modelAnswer": "Because it provides a statistically significant sample size for their regression analysis within the tight deadline.",
        "keywords": [
          "statistically",
          "significant",
          "sample",
          "regression",
          "deadline"
        ]
      },
      {
        "id": "conv-l3-team-q3",
        "number": 3,
        "turnRefIndex": 3,
        "linesHint": "Line 4",
        "type": "mcq",
        "prompt": "What obstacle did Professor Sterling warn the students about regarding qualitative research?",
        "explanationHebrew": "בשורה 4 ליאם מציין שפרופסור סטרלינג הזהיר שתמלול וקידוד איכותניים עלולים לפגוע בלוח הזמנים.",
        "points": 10,
        "options": [
          "It requires verbatim transcription and coding that could disrupt their submission schedule.",
          "It is completely unacceptable to academic journals in urban planning.",
          "It exposes private medical records without legal consent.",
          "It prevents students from presenting at scientific symposiums."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-team-q4",
        "number": 4,
        "turnRefIndex": 4,
        "linesHint": "Line 5",
        "type": "open",
        "prompt": "What methodological compromise does Noah propose in Line 5 to satisfy both goals?",
        "explanationHebrew": "בשורה 5 נוח מציע לאמץ מערך מחקר משולב מתכנס.",
        "points": 10,
        "modelAnswer": "He proposes adopting a mixed-methods convergent design rather than choosing only one method.",
        "keywords": [
          "mixed-methods",
          "convergent",
          "design",
          "both"
        ]
      },
      {
        "id": "conv-l3-team-q5",
        "number": 5,
        "turnRefIndex": 7,
        "linesHint": "Line 8",
        "type": "open",
        "prompt": "How many interviewees does Liam suggest selecting for the in-depth nested follow-up interviews?",
        "explanationHebrew": "בשורה 8 ליאם מציע לראיין 12 עד 15 משיבים שחוו תקלות רשת חמורות.",
        "points": 10,
        "modelAnswer": "Twelve to fifteen survey respondents.",
        "keywords": [
          "twelve",
          "fifteen",
          "12",
          "15"
        ]
      },
      {
        "id": "conv-l3-team-q6",
        "number": 6,
        "turnRefIndex": 8,
        "linesHint": "Line 9",
        "type": "copy",
        "prompt": "Copy the sentence from Line 9 where Noah justifies why the mixed design is beneficial.",
        "explanationHebrew": "בשורה 9 נוח מסביר את היתרון שבאיסוף דפוסים דמוגרפיים יחד עם נרטיבים מפורטים.",
        "points": 10,
        "targetSentence": "That way we gather macro-level demographic patterns while corroborating them with lived, granular narratives."
      },
      {
        "id": "conv-l3-team-q7",
        "number": 7,
        "turnRefIndex": 10,
        "linesHint": "Line 11",
        "type": "mcq",
        "prompt": "Which qualitative methodology will they use to analyze the interview transcripts?",
        "explanationHebrew": "בשורה 11 נוח מציע ניתוח תמטי אינדוקטיבי לפי ששת השלבים של בראון וקלארק.",
        "points": 10,
        "options": [
          "Inductive thematic analysis following Braun and Clarke's framework.",
          "Grounded theory with theoretical saturation modeling.",
          "Critical discourse analysis of governmental policy speeches.",
          "Historical archival analysis of municipal deeds."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-team-q8",
        "number": 8,
        "turnRefIndex": 12,
        "linesHint": "Line 13",
        "type": "open",
        "prompt": "What task has Noah already prepared over the weekend regarding research ethics?",
        "explanationHebrew": "בשורה 13 נוח מציין שהוא כבר ניסח את פרוטוקול ועדת האתיקה וטפסי ההסכמה.",
        "points": 10,
        "modelAnswer": "He drafted the Institutional Review Board protocol and anonymization consent forms.",
        "keywords": [
          "Institutional Review Board",
          "IRB",
          "protocol",
          "consent",
          "ethics",
          "anonymization"
        ]
      },
      {
        "id": "conv-l3-team-q9",
        "number": 9,
        "turnRefIndex": 13,
        "linesHint": "Line 14",
        "type": "mcq",
        "prompt": "Liam plans to test the survey instrument on five fellow peer researchers before distributing it widely.",
        "explanationHebrew": "נכון. בשורה 14 ליאם מציין שיבצע פיילוט על 5 עמיתים למחקר.",
        "points": 10,
        "options": [
          "True",
          "False"
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-team-q10",
        "number": 10,
        "turnRefIndex": 18,
        "linesHint": "Line 19",
        "type": "open",
        "prompt": "When do the students plan to convene to review the pilot survey feedback?",
        "explanationHebrew": "בשורה 19 נוח מציע להיפגש בשיחת וידאו ביום חמישי בערב.",
        "points": 10,
        "modelAnswer": "On Thursday evening via video conference.",
        "keywords": [
          "Thursday",
          "evening",
          "video",
          "conference"
        ]
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "conv-l3-damaged-order",
    "title": "Disputing a High-Value Acoustic Equipment Delivery",
    "hebrewTitle": "בירור נזק במשלוח ציוד אקוסטי יוקרתי",
    "category": "tech_daily",
    "categoryLabelHebrew": "ציוד ועבודה מקצועית",
    "settingDescription": "A studio recording engineer contacts a high-end audio manufacturer after an expensive ribbon microphone arrives physically damaged and acoustically defective.",
    "level": "Level 3",
    "levelLabel": "רמה 3 - תקשורת מתקדמת ופתרון בעיות",
    "levelDescription": "Nuanced real-world communication, professional problem-solving, and advanced idioms.",
    "speakers": [
      {
        "id": "speaker_a",
        "name": "Julian",
        "role": "Studio Sound Engineer",
        "avatarEmoji": "🎙️",
        "genderHint": "male",
        "colorTheme": "sky"
      },
      {
        "id": "speaker_b",
        "name": "Claire",
        "role": "Senior Logistics Specialist",
        "avatarEmoji": "📦",
        "genderHint": "female",
        "colorTheme": "amber"
      }
    ],
    "turns": [
      {
        "index": 0,
        "speakerId": "speaker_a",
        "text": "Hello Claire, I am calling regarding consignment reference AC-9481; our studio unboxed the flagship R-88 ribbon microphone an hour ago, and the unit is noticeably damaged."
      },
      {
        "index": 1,
        "speakerId": "speaker_b",
        "text": "I am terribly sorry to hear that, Julian. Could you describe the extent of the visible damage and whether the outer shock-absorbent flight case was compromised?"
      },
      {
        "index": 2,
        "speakerId": "speaker_a",
        "text": "The hard-shell aluminum case has a pronounced dent near the reinforced hinge, and the microphone's outer protective mesh is severely indented, which misaligns the internal ribbon motor."
      },
      {
        "index": 3,
        "speakerId": "speaker_b",
        "text": "That sounds like high-velocity blunt impact in transit. Did you attempt to connect phantom power or run an impedance test?"
      },
      {
        "index": 4,
        "speakerId": "speaker_a",
        "text": "Of course not; passive ribbon transducers can be instantly ruined by inadvertent 48-volt current. We performed a low-level acoustic sweep, and the figure-8 polar pattern exhibits heavy asymmetrical distortion."
      },
      {
        "index": 5,
        "speakerId": "speaker_b",
        "text": "Under standard protocol, items over two thousand dollars require an on-site courier inspection before an insurance claim payout is authorized."
      },
      {
        "index": 6,
        "speakerId": "speaker_a",
        "text": "With all due respect, Claire, we contracted your company specifically for the tier-one white-glove logistics guarantee, paying an additional four hundred dollars for bonded handling."
      },
      {
        "index": 7,
        "speakerId": "speaker_b",
        "text": "You are completely justified; let me access the manifest log for the designated air-freight carrier right now."
      },
      {
        "index": 8,
        "speakerId": "speaker_a",
        "text": "We have an internationally renowned string quartet scheduled for a master recording session this Saturday morning, so waiting two weeks for a claims adjuster is out of the question."
      },
      {
        "index": 9,
        "speakerId": "speaker_b",
        "text": "I see here in our dispatch photos that the unit passed our calibrated quality assurance test in pristine condition on Monday at 3:00 PM."
      },
      {
        "index": 10,
        "speakerId": "speaker_a",
        "text": "I have already uploaded high-resolution macro photographs of the crushed casing, the serial plate, and the couriers signed bill of lading to your secure portal."
      },
      {
        "index": 11,
        "speakerId": "speaker_b",
        "text": "I have the images on my screen now; the crush deformation on the suspension yoke is undeniable proof of external transit trauma."
      },
      {
        "index": 12,
        "speakerId": "speaker_a",
        "text": "Can your logistics department authorize an immediate warranty replacement shipment without waiting for the courier dispute resolution?"
      },
      {
        "index": 13,
        "speakerId": "speaker_b",
        "text": "Yes, I am utilizing my managerial authority to invoke an immediate expedited replacement protocol under our premium guarantee."
      },
      {
        "index": 14,
        "speakerId": "speaker_a",
        "text": "That is a huge relief. When can the replacement microphone realistically land at our London studio address?"
      },
      {
        "index": 15,
        "speakerId": "speaker_b",
        "text": "I am dispatching our secondary backup unit from the Frankfurt central warehouse via priority same-day international courier tomorrow morning."
      },
      {
        "index": 16,
        "speakerId": "speaker_a",
        "text": "So it will arrive guaranteed before Friday at 4:00 PM?"
      },
      {
        "index": 17,
        "speakerId": "speaker_b",
        "text": "Guaranteed by Friday noon at the latest. A dedicated courier tracking link will be transmitted to your email within two hours."
      },
      {
        "index": 18,
        "speakerId": "speaker_a",
        "text": "What about the return of the damaged microphone and shattered shock mount?"
      },
      {
        "index": 19,
        "speakerId": "speaker_b",
        "text": "Keep them safely packed in the existing container; the same courier delivering the replacement will collect the defective unit with a prepaid electronic return manifest."
      },
      {
        "index": 20,
        "speakerId": "speaker_a",
        "text": "And will there be any additional freight surcharges or customs clearance fees billed to our studio account?"
      },
      {
        "index": 21,
        "speakerId": "speaker_b",
        "text": "None whatsoever; we absorb all transit duties, and I have credited your account with a three-hundred-dollar voucher as compensation for the inconvenience."
      }
    ],
    "usefulPhrases": [
      {
        "phrase": "ribbon transducer",
        "translation": "מתמר סרט (רכיב קליטה עדין במיקרופון)"
      },
      {
        "phrase": "figure-8 polar pattern",
        "translation": "דפוס קליטה דו-כיווני בצורת הספרה 8"
      },
      {
        "phrase": "bonded transit handling",
        "translation": "שינוע מאובטח תחת ערבות ביטוחית מחמירה"
      },
      {
        "phrase": "managerial waiver",
        "translation": "ויתור/פטור באישור דרג ניהולי"
      },
      {
        "phrase": "electronic return manifest",
        "translation": "שטר מטען אלקטרוני מוגדר להחזרת סחורה"
      }
    ],
    "questions": [
      {
        "id": "conv-l3-order-q1",
        "number": 1,
        "turnRefIndex": 0,
        "linesHint": "Line 1",
        "type": "mcq",
        "prompt": "What is the primary reason Julian calls Claire in Line 1?",
        "explanationHebrew": "בשורה 1 ג'וליאן מדווח שמיקרופון הסרט היוקרתי שהגיע פגום באופן ניכר.",
        "points": 10,
        "options": [
          "The studio's flagship ribbon microphone arrived visibly damaged.",
          "The studio wants to upgrade to a newer microphone model.",
          "The wrong package was delivered to the recording studio.",
          "The studio cannot locate the user manual in the box."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-order-q2",
        "number": 2,
        "turnRefIndex": 2,
        "linesHint": "Line 3",
        "type": "open",
        "prompt": "What physical damage does Julian observe on the flight case and the microphone in Line 3?",
        "explanationHebrew": "בשורה 3 ג'וליאן מציין שקע ליד הציר ורשת מגן מעוכה שפוגעת באיזון המנוע הפנימי.",
        "points": 10,
        "modelAnswer": "A dent near the aluminum case's hinge and a severely indented protective mesh misaligning the internal ribbon motor.",
        "keywords": [
          "dent",
          "hinge",
          "mesh",
          "indented",
          "ribbon",
          "motor"
        ]
      },
      {
        "id": "conv-l3-order-q3",
        "number": 3,
        "turnRefIndex": 4,
        "linesHint": "Line 5",
        "type": "open",
        "prompt": "Why did Julian refuse to connect 48-volt phantom power to the damaged microphone?",
        "explanationHebrew": "בשורה 5 ג'וליאן מסביר שמתח פנטום עלול להרוס מיידית מיקרופון סרט פסיבי.",
        "points": 10,
        "modelAnswer": "Because passive ribbon transducers can be instantly ruined by inadvertent 48-volt current.",
        "keywords": [
          "ruined",
          "passive",
          "ribbon",
          "current",
          "transducers",
          "damaged"
        ]
      },
      {
        "id": "conv-l3-order-q4",
        "number": 4,
        "turnRefIndex": 6,
        "linesHint": "Line 7",
        "type": "open",
        "prompt": "How much additional money did the studio pay for white-glove bonded handling?",
        "explanationHebrew": "בשורה 7 ג'וליאן מדגיש שהם שילמו 400 דולר נוספים עבור שינוע פרימיום.",
        "points": 10,
        "modelAnswer": "Four hundred dollars.",
        "keywords": [
          "400",
          "four hundred",
          "dollars"
        ]
      },
      {
        "id": "conv-l3-order-q5",
        "number": 5,
        "turnRefIndex": 8,
        "linesHint": "Line 9",
        "type": "mcq",
        "prompt": "Why is the replacement delivery extremely urgent for Julian's studio?",
        "explanationHebrew": "בשורה 9 ג'וליאן מציין שרביעיית מיתרים בינלאומית מגיעה להקלטה בשבת בבוקר.",
        "points": 10,
        "options": [
          "A world-renowned string quartet is booked for a recording session on Saturday morning.",
          "The studio is closing permanently at the end of the week.",
          "The microphone is required for a live outdoor television broadcast.",
          "The studio owner is traveling overseas on Friday."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-order-q6",
        "number": 6,
        "turnRefIndex": 11,
        "linesHint": "Line 12",
        "type": "copy",
        "prompt": "Copy the sentence from Line 12 where Claire admits the photos prove courier damage.",
        "explanationHebrew": "בשורה 12 קלייר מודה שתצלומי המעמסה מוכיחים חבלה חיצונית בשינוע.",
        "points": 10,
        "targetSentence": "I have the images on my screen now; the crush deformation on the suspension yoke is undeniable proof of external transit trauma."
      },
      {
        "id": "conv-l3-order-q7",
        "number": 7,
        "turnRefIndex": 15,
        "linesHint": "Line 16",
        "type": "open",
        "prompt": "From which warehouse will Claire dispatch the backup replacement microphone?",
        "explanationHebrew": "בשורה 16 קלייר מציינת שהיא שולחת את יחידת הגיבוי מהמחסן המרכזי בפרנקפורט.",
        "points": 10,
        "modelAnswer": "From the Frankfurt central warehouse.",
        "keywords": [
          "Frankfurt",
          "central",
          "warehouse"
        ]
      },
      {
        "id": "conv-l3-order-q8",
        "number": 8,
        "turnRefIndex": 17,
        "linesHint": "Line 18",
        "type": "mcq",
        "prompt": "The replacement microphone is guaranteed to arrive at the studio no later than Friday noon.",
        "explanationHebrew": "נכון. בשורה 18 קלייר מתחייבת שהמשלוח יגיע עד יום שישי בצהריים לכל המאוחר.",
        "points": 10,
        "options": [
          "True",
          "False"
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-order-q9",
        "number": 9,
        "turnRefIndex": 19,
        "linesHint": "Line 20",
        "type": "mcq",
        "prompt": "How will the damaged microphone be returned to the manufacturer?",
        "explanationHebrew": "בשורה 20 קלייר מסבירה שהשליח שימסור את החלופי יאסוף את הפגום עם שטר החזרה ששולם מראש.",
        "points": 10,
        "options": [
          "The courier delivering the replacement will collect the defective unit with a prepaid electronic manifest.",
          "Julian must personally drive the unit to the nearest airport depot.",
          "The studio must dispose of the damaged unit in an electronics recycling facility.",
          "Julian must pay for postal shipping and request reimbursement next month."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-order-q10",
        "number": 10,
        "turnRefIndex": 21,
        "linesHint": "Line 22",
        "type": "open",
        "prompt": "What monetary compensation does Claire add to Julian's account for the inconvenience?",
        "explanationHebrew": "בשורה 22 קלייר מעניקה שובר פיצוי בסך 300 דולר לחשבון האולפן.",
        "points": 10,
        "modelAnswer": "A three-hundred-dollar voucher.",
        "keywords": [
          "three-hundred",
          "300",
          "voucher",
          "dollar",
          "dollars"
        ]
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "conv-l3-job-interview",
    "title": "Senior Sustainability Lead Panel Interview",
    "hebrewTitle": "ראיון עבודה לתפקיד מוביל קיימות ו-ESG בכיר",
    "category": "tech_daily",
    "categoryLabelHebrew": "ראיונות עבודה ותאגידים",
    "settingDescription": "A candidate for the Director of Corporate Sustainability undergoes an intensive panel interview on carbon accounting, supply-chain decarbonization, and stakeholder pushback.",
    "level": "Level 3",
    "levelLabel": "רמה 3 - תקשורת מתקדמת ופתרון בעיות",
    "levelDescription": "Nuanced real-world communication, professional problem-solving, and advanced idioms.",
    "speakers": [
      {
        "id": "speaker_a",
        "name": "Elena",
        "role": "VP of Global Strategy",
        "avatarEmoji": "💼",
        "genderHint": "female",
        "colorTheme": "sky"
      },
      {
        "id": "speaker_b",
        "name": "Marcus",
        "role": "Sustainability Director Candidate",
        "avatarEmoji": "🌱",
        "genderHint": "male",
        "colorTheme": "amber"
      }
    ],
    "turns": [
      {
        "index": 0,
        "speakerId": "speaker_a",
        "text": "Good morning, Marcus. Our executive board reviewed your portfolio, and we want to explore how you navigate tensions between aggressive emissions targets and quarterly profitability."
      },
      {
        "index": 1,
        "speakerId": "speaker_b",
        "text": "Good morning, Elena. In my view, sustainability and financial resilience are not mutually exclusive; rigorous decarbonization frequently uncovers massive operational efficiencies."
      },
      {
        "index": 2,
        "speakerId": "speaker_a",
        "text": "Can you provide a tangible example from your previous tenure at Apex Logistics where that principle delivered measurable results?"
      },
      {
        "index": 3,
        "speakerId": "speaker_b",
        "text": "Certainly. When I joined, our fleet contributed over 60% of our Scope 1 footprint. We instituted AI-driven predictive route optimization paired with aerodynamic retrofits on 400 long-haul trailers."
      },
      {
        "index": 4,
        "speakerId": "speaker_a",
        "text": "What were the definitive financial and environmental yields over that three-year horizon?"
      },
      {
        "index": 5,
        "speakerId": "speaker_b",
        "text": "We reduced overall fuel expenditure by 18.4 million dollars while slashing diesel particulate emissions by 24 percent against our baseline."
      },
      {
        "index": 6,
        "speakerId": "speaker_a",
        "text": "Impressive. However, our greatest regulatory vulnerability right now lies in Scope 3 indirect emissions, specifically upstream supplier dependencies."
      },
      {
        "index": 7,
        "speakerId": "speaker_b",
        "text": "Scope 3 is indeed notoriously opaque. How many tier-one suppliers currently submit audited environmental disclosure through CDP or EcoVadis?"
      },
      {
        "index": 8,
        "speakerId": "speaker_a",
        "text": "Fewer than thirty-five percent, and our manufacturing division heads resist mandating disclosure because they fear supplier price inflation."
      },
      {
        "index": 9,
        "speakerId": "speaker_b",
        "text": "Pushback from operations is understandable when sustainability is framed as a punitive compliance hurdle rather than capacity building."
      },
      {
        "index": 10,
        "speakerId": "speaker_a",
        "text": "How would you persuade our European manufacturing leads to engage rather than stonewall the initiative?"
      },
      {
        "index": 11,
        "speakerId": "speaker_b",
        "text": "I would co-design a tiered vendor incentive framework: suppliers who meet threshold decarbonization benchmarks gain preferential multi-year contracts and favorable payment terms."
      },
      {
        "index": 12,
        "speakerId": "speaker_a",
        "text": "And for smaller suppliers who genuinely lack internal carbon auditing capabilities?"
      },
      {
        "index": 13,
        "speakerId": "speaker_b",
        "text": "We provide standardized open-source carbon accounting toolkits and sponsor quarterly technical enablement workshops, lowering their barrier to entry."
      },
      {
        "index": 14,
        "speakerId": "speaker_a",
        "text": "Under the newly enforced EU Corporate Sustainability Due Diligence Directive, penalties for non-compliance are severe."
      },
      {
        "index": 15,
        "speakerId": "speaker_b",
        "text": "Up to five percent of worldwide turnover. That is why proactive compliance is no longer a corporate social responsibility luxury; it is existential risk management."
      },
      {
        "index": 16,
        "speakerId": "speaker_a",
        "text": "If offered the position, what would your immediate agenda look like in the first ninety days?"
      },
      {
        "index": 17,
        "speakerId": "speaker_b",
        "text": "Days 1 to 30: conduct an exhaustive Scope 1 through 3 emissions audit. Days 31 to 60: establish cross-functional steering councils with finance and legal."
      },
      {
        "index": 18,
        "speakerId": "speaker_a",
        "text": "And the final month of the onboarding window?"
      },
      {
        "index": 19,
        "speakerId": "speaker_b",
        "text": "Deliver an investment-grade decarbonization roadmap to the board with science-based targets validated by the SBTi committee."
      },
      {
        "index": 20,
        "speakerId": "speaker_a",
        "text": "Your strategic clarity and pragmatic commercial focus are exceptional, Marcus. We will notify you of our decision by next Wednesday."
      },
      {
        "index": 21,
        "speakerId": "speaker_b",
        "text": "Thank you for an insightful conversation, Elena. I look forward to the prospect of spearheading this transformation."
      }
    ],
    "usefulPhrases": [
      {
        "phrase": "Scope 1 and Scope 3 emissions",
        "translation": "פליטות פחמן ישירות (היקף 1) ועקיפות בשרשרת האספקה (היקף 3)"
      },
      {
        "phrase": "decarbonization yields",
        "translation": "תשואות וחסכונות כלכליים הנובעים מהפחתת פליטות"
      },
      {
        "phrase": "tiered vendor incentives",
        "translation": "תמריצים מדורגים לספקי שרשרת אספקה"
      },
      {
        "phrase": "corporate due diligence directive",
        "translation": "דירקטיבת חובת זהירות תאגידית וקיימות (CSDDD)"
      },
      {
        "phrase": "investment-grade roadmap",
        "translation": "מפת דרכים אסטרטגית העומדת בסטנדרטים של משקיעים מוסדיים"
      }
    ],
    "questions": [
      {
        "id": "conv-l3-job-q1",
        "number": 1,
        "turnRefIndex": 1,
        "linesHint": "Line 2",
        "type": "mcq",
        "prompt": "What is Marcus's core philosophy regarding sustainability and financial performance?",
        "explanationHebrew": "בשורה 2 מרקוס מציין שקיימות וחוסן פיננסי אינם סותרים אלא מייצרים יעילות תפעולית.",
        "points": 10,
        "options": [
          "Sustainability and financial resilience strengthen one another through operational efficiency.",
          "Emissions targets should always take second place to short-term profits.",
          "Financial metrics cannot be applied to environmental projects.",
          "Governments should fully fund all corporate green transformations."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-job-q2",
        "number": 2,
        "turnRefIndex": 3,
        "linesHint": "Line 4",
        "type": "open",
        "prompt": "What two specific initiatives did Marcus implement at Apex Logistics to reduce Scope 1 emissions?",
        "explanationHebrew": "בשורה 4 מרקוס מפרט אופטימיזציית מסלולים ב-AI ושדרוג אווירודינמי ל-400 נגררים.",
        "points": 10,
        "modelAnswer": "AI-driven predictive route optimization and aerodynamic retrofits on 400 trailers.",
        "keywords": [
          "AI",
          "predictive",
          "route",
          "aerodynamic",
          "retrofits",
          "trailers"
        ]
      },
      {
        "id": "conv-l3-job-q3",
        "number": 3,
        "turnRefIndex": 5,
        "linesHint": "Line 6",
        "type": "open",
        "prompt": "How much money did Apex Logistics save in fuel expenses through Marcus's initiatives?",
        "explanationHebrew": "בשורה 6 מרקוס מציין חיסכון של 18.4 מיליון דולר בהוצאות דלק.",
        "points": 10,
        "modelAnswer": "18.4 million dollars.",
        "keywords": [
          "18.4",
          "million",
          "dollars"
        ]
      },
      {
        "id": "conv-l3-job-q4",
        "number": 4,
        "turnRefIndex": 8,
        "linesHint": "Line 9",
        "type": "open",
        "prompt": "Why do internal manufacturing heads resist mandating environmental disclosure for suppliers?",
        "explanationHebrew": "בשורה 9 אלנה מסבירה שחטיבת הייצור חוששת מהעלאת מחירים מצד הספקים.",
        "points": 10,
        "modelAnswer": "Because they fear supplier price inflation.",
        "keywords": [
          "fear",
          "supplier",
          "price",
          "inflation"
        ]
      },
      {
        "id": "conv-l3-job-q5",
        "number": 5,
        "turnRefIndex": 11,
        "linesHint": "Line 12",
        "type": "mcq",
        "prompt": "How does Marcus propose encouraging suppliers to meet decarbonization benchmarks in Line 12?",
        "explanationHebrew": "בשורה 12 מרקוס מציע חוזים רב-שנתיים מועדפים ותנאי תשלום נוחים לספקים מובילים.",
        "points": 10,
        "options": [
          "By offering preferential multi-year contracts and favorable payment terms.",
          "By imposing immediate monetary penalties on non-compliant vendors.",
          "By canceling contracts with all overseas manufacturing suppliers.",
          "By outsourcing the manufacturing operations entirely to third parties."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-job-q6",
        "number": 6,
        "turnRefIndex": 13,
        "linesHint": "Line 14",
        "type": "open",
        "prompt": "How will smaller suppliers be assisted to overcome the lack of internal carbon auditing tools?",
        "explanationHebrew": "בשורה 14 מרקוס מציע ארגז כלים בקוד פתוח וסדנאות הדרכה טכניות רבעוניות.",
        "points": 10,
        "modelAnswer": "Through standardized open-source toolkits and sponsored quarterly technical workshops.",
        "keywords": [
          "open-source",
          "toolkits",
          "sponsored",
          "quarterly",
          "workshops"
        ]
      },
      {
        "id": "conv-l3-job-q7",
        "number": 7,
        "turnRefIndex": 15,
        "linesHint": "Line 16",
        "type": "copy",
        "prompt": "Copy the sentence from Line 16 where Marcus explains why proactive compliance is vital.",
        "explanationHebrew": "בשורה 16 מרקוס מדגיש שציות יזום הוא ניהול סיכונים קיומי ולא מותרות.",
        "points": 10,
        "targetSentence": "That is why proactive compliance is no longer a corporate social responsibility luxury; it is existential risk management."
      },
      {
        "id": "conv-l3-job-q8",
        "number": 8,
        "turnRefIndex": 15,
        "linesHint": "Line 16",
        "type": "open",
        "prompt": "What is the maximum penalty percentage of worldwide turnover under the EU CSDDD directive?",
        "explanationHebrew": "בשורה 16 מרקוס מציין קנסות של עד 5% ממחזור העסקים העולמי.",
        "points": 10,
        "modelAnswer": "Up to five percent.",
        "keywords": [
          "five",
          "5",
          "percent",
          "5%"
        ]
      },
      {
        "id": "conv-l3-job-q9",
        "number": 9,
        "turnRefIndex": 17,
        "linesHint": "Line 18",
        "type": "mcq",
        "prompt": "Marcus plans to establish cross-functional steering councils during days 31 to 60 of his onboarding.",
        "explanationHebrew": "נכון. בשורה 18 מרקוס מפרט שיקים מועצות היגוי חוצות-ארגון בימים 31 עד 60.",
        "points": 10,
        "options": [
          "True",
          "False"
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-job-q10",
        "number": 10,
        "turnRefIndex": 20,
        "linesHint": "Line 21",
        "type": "open",
        "prompt": "By what day will the executive board notify Marcus regarding their hiring decision?",
        "explanationHebrew": "בשורה 21 אלנה מבטיחה תשובה סופית עד יום רביעי הבא.",
        "points": 10,
        "modelAnswer": "By next Wednesday.",
        "keywords": [
          "Wednesday",
          "next Wednesday"
        ]
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "conv-l3-student-council",
    "title": "Student Council Fiscal Surplus Allocation Debate",
    "hebrewTitle": "דיון תקציבי סוער במועצת הסטודנטים",
    "category": "school_social",
    "categoryLabelHebrew": "מועצת סטודנטים וקמפוס",
    "settingDescription": "The student union treasurer and the activities director debate how to divide an unallocated $18,000 surplus between emergency student welfare grants and a cultural arts festival.",
    "level": "Level 3",
    "levelLabel": "רמה 3 - תקשורת מתקדמת ופתרון בעיות",
    "levelDescription": "Nuanced real-world communication, professional problem-solving, and advanced idioms.",
    "speakers": [
      {
        "id": "speaker_a",
        "name": "Maya",
        "role": "Student Union Treasurer",
        "avatarEmoji": "🏛️",
        "genderHint": "female",
        "colorTheme": "sky"
      },
      {
        "id": "speaker_b",
        "name": "Ethan",
        "role": "Activities & Campus Life Director",
        "avatarEmoji": "🎭",
        "genderHint": "male",
        "colorTheme": "amber"
      }
    ],
    "turns": [
      {
        "index": 0,
        "speakerId": "speaker_a",
        "text": "Ethan, we have exactly forty-eight hours before submitting the final spring fiscal allocations, and our committee remains polarized over the eighteen-thousand-dollar discretionary surplus."
      },
      {
        "index": 1,
        "speakerId": "speaker_b",
        "text": "I know, Maya, but sinking the entirety into the emergency hardship reserve locks capital in a stagnant account when student morale after winter midterms is notoriously low."
      },
      {
        "index": 2,
        "speakerId": "speaker_a",
        "text": "Calling emergency food vouchers and psychiatric crisis subsidies 'stagnant capital' ignores that acute student pantry requests surged by eighty-two percent this semester."
      },
      {
        "index": 3,
        "speakerId": "speaker_b",
        "text": "Nobody disputes the necessity of welfare, Maya. But our annual Spring Arts and Diversity Gala brings over twelve hundred students together, fostering genuine community cohesion."
      },
      {
        "index": 4,
        "speakerId": "speaker_a",
        "text": "Community cohesion is worthless if financially precarious students drop out because they cannot afford essential course textbooks or prescription medications."
      },
      {
        "index": 5,
        "speakerId": "speaker_b",
        "text": "Let us look at this pragmatically rather than as an ideological stalemate. What if we explore a blended funding architecture?"
      },
      {
        "index": 6,
        "speakerId": "speaker_a",
        "text": "I am listening, provided that student basic needs receive non-negotiable priority funding."
      },
      {
        "index": 7,
        "speakerId": "speaker_b",
        "text": "What if we earmark eleven thousand dollars directly to the Student Hardship Fund, specifically tagged for emergency grocery grants and mental health copays?"
      },
      {
        "index": 8,
        "speakerId": "speaker_a",
        "text": "That leaves seven thousand dollars for your campus festival. Your original budget projection requested fourteen thousand for staging, lighting, and sound."
      },
      {
        "index": 9,
        "speakerId": "speaker_b",
        "text": "Correct, but I met with the Alumni Association yesterday, and their executive board informally offered a three-thousand-dollar matching sponsorship for arts programming."
      },
      {
        "index": 10,
        "speakerId": "speaker_a",
        "text": "An alumni grant? Have they issued a formal letter of intent, or is that contingent on external conditions?"
      },
      {
        "index": 11,
        "speakerId": "speaker_b",
        "text": "The sole condition is that student craft vendors and alumni entrepreneurs receive designated showcase stalls in the main quad."
      },
      {
        "index": 12,
        "speakerId": "speaker_a",
        "text": "That still leaves a four-thousand-dollar deficit in your festival projections."
      },
      {
        "index": 13,
        "speakerId": "speaker_b",
        "text": "We can scale down the commercial headliner and spotlight outstanding student bands and faculty poets instead, slashing performer riders by four thousand dollars."
      },
      {
        "index": 14,
        "speakerId": "speaker_a",
        "text": "That actually sounds much more authentic to our university ethos than hiring an overpriced booking agency."
      },
      {
        "index": 15,
        "speakerId": "speaker_b",
        "text": "Furthermore, the gala can incorporate a voluntary donation drive for the student food pantry right at the entrance gate."
      },
      {
        "index": 16,
        "speakerId": "speaker_a",
        "text": "That could yield hundreds of non-perishable food cans and hygienic supplies while raising broader campus awareness."
      },
      {
        "index": 17,
        "speakerId": "speaker_b",
        "text": "So do we have consensus on eleven thousand for student welfare and seven thousand for the festival?"
      },
      {
        "index": 18,
        "speakerId": "speaker_a",
        "text": "Under one condition: the seven-thousand-dollar festival disbursement is held in escrow until the alumni association's written matching pledge is officially signed."
      },
      {
        "index": 19,
        "speakerId": "speaker_b",
        "text": "Fair and prudent fiscal governance. I will obtain their signed pledge letter by tomorrow at 2:00 PM."
      },
      {
        "index": 20,
        "speakerId": "speaker_a",
        "text": "Then I will draft the joint council resolution tonight and present it for a unanimous vote on Wednesday morning."
      },
      {
        "index": 21,
        "speakerId": "speaker_b",
        "text": "Thank you for collaborating, Maya; this resolution proves student welfare and vibrant culture can reinforce each other."
      }
    ],
    "usefulPhrases": [
      {
        "phrase": "discretionary fiscal surplus",
        "translation": "עודף תקציבי לשיקול דעת המועצה"
      },
      {
        "phrase": "acute hardship reserve",
        "translation": "קרן שמורה למקרי מצוקה חריפים"
      },
      {
        "phrase": "blended funding architecture",
        "translation": "מבנה מימון משולב ממספר מקורות"
      },
      {
        "phrase": "matching alumni sponsorship",
        "translation": "חסות מאצ'ינג תואמת מטעם אגודת הבוגרים"
      },
      {
        "phrase": "disbursement held in escrow",
        "translation": "הקצאה כספית המוחזקת בנאמנות עד קיום תנאי"
      }
    ],
    "questions": [
      {
        "id": "conv-l3-debate-q1",
        "number": 1,
        "turnRefIndex": 0,
        "linesHint": "Line 1",
        "type": "open",
        "prompt": "What is the total amount of the unallocated student surplus discussed in Line 1?",
        "explanationHebrew": "בשורה 1 מיה מציינת עודף תקציבי של 18,000 דולר.",
        "points": 10,
        "modelAnswer": "Eighteen thousand dollars.",
        "keywords": [
          "eighteen thousand",
          "18,000",
          "18000",
          "dollars"
        ]
      },
      {
        "id": "conv-l3-debate-q2",
        "number": 2,
        "turnRefIndex": 2,
        "linesHint": "Line 3",
        "type": "mcq",
        "prompt": "By what percentage did emergency student food pantry requests increase this semester?",
        "explanationHebrew": "בשורה 3 מיה מציינת שפניות למאגר המזון זינקו ב-82%.",
        "points": 10,
        "options": [
          "Eighty-two percent.",
          "Fifty percent.",
          "Twenty-five percent.",
          "One hundred percent."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-debate-q3",
        "number": 3,
        "turnRefIndex": 3,
        "linesHint": "Line 4",
        "type": "open",
        "prompt": "How many students attend the annual Spring Arts and Diversity Gala according to Ethan?",
        "explanationHebrew": "בשורה 4 אית'ן מציין שמעל 1,200 סטודנטים מגיעים לאירוע.",
        "points": 10,
        "modelAnswer": "Over twelve hundred students.",
        "keywords": [
          "twelve hundred",
          "1200",
          "1,200",
          "students"
        ]
      },
      {
        "id": "conv-l3-debate-q4",
        "number": 4,
        "turnRefIndex": 7,
        "linesHint": "Line 8",
        "type": "open",
        "prompt": "How much money does Ethan propose allocating specifically to the Student Hardship Fund?",
        "explanationHebrew": "בשורה 8 אית'ן מציע לייעד 11,000 דולר לקרן המצוקה.",
        "points": 10,
        "modelAnswer": "Eleven thousand dollars.",
        "keywords": [
          "eleven thousand",
          "11,000",
          "11000",
          "dollars"
        ]
      },
      {
        "id": "conv-l3-debate-q5",
        "number": 5,
        "turnRefIndex": 9,
        "linesHint": "Line 10",
        "type": "mcq",
        "prompt": "What offer did the Alumni Association extend to support the campus festival?",
        "explanationHebrew": "בשורה 10 אית'ן מציין חסות מאצ'ינג של 3,000 דולר מאגודת הבוגרים.",
        "points": 10,
        "options": [
          "A three-thousand-dollar matching sponsorship.",
          "Full funding for all sound and staging equipment.",
          "Free catering for faculty and student performers.",
          "A permanent endowment for future student councils."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-debate-q6",
        "number": 6,
        "turnRefIndex": 11,
        "linesHint": "Line 12",
        "type": "open",
        "prompt": "What is the single condition attached to the Alumni Association's financial support?",
        "explanationHebrew": "בשורה 12 אית'ן מפרט שהתנאי הוא הקצאת דוכנים ליוצרים ויזמים ברחבה המרכזית.",
        "points": 10,
        "modelAnswer": "Student craft vendors and alumni entrepreneurs must receive showcase stalls in the main quad.",
        "keywords": [
          "stalls",
          "vendors",
          "alumni",
          "entrepreneurs",
          "showcase",
          "quad"
        ]
      },
      {
        "id": "conv-l3-debate-q7",
        "number": 7,
        "turnRefIndex": 13,
        "linesHint": "Line 14",
        "type": "mcq",
        "prompt": "How does Ethan plan to reduce festival expenses by four thousand dollars in Line 14?",
        "explanationHebrew": "בשורה 14 אית'ן מציע להבליט אמנים ומשוררים מהאוניברסיטה במקום אמן יקר מבחוץ.",
        "points": 10,
        "options": [
          "By showcasing student bands and faculty poets instead of a costly commercial headliner.",
          "By canceling the event's sound and lighting setup.",
          "By charging students twenty dollars per entry ticket.",
          "By moving the entire gala into a virtual video stream."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-debate-q8",
        "number": 8,
        "turnRefIndex": 18,
        "linesHint": "Line 19",
        "type": "copy",
        "prompt": "Copy the sentence from Line 19 where Maya defines the prerequisite for releasing the festival funds.",
        "explanationHebrew": "בשורה 19 מיה מתנה את העברת הכספים בהחזקתם בנאמנות עד לחתימה על מכתב ההתחייבות.",
        "points": 10,
        "targetSentence": "Under one condition: the seven-thousand-dollar festival disbursement is held in escrow until the alumni association's written matching pledge is officially signed."
      },
      {
        "id": "conv-l3-debate-q9",
        "number": 9,
        "turnRefIndex": 19,
        "linesHint": "Line 20",
        "type": "mcq",
        "prompt": "Ethan promises to secure the signed pledge document from the alumni board by tomorrow at 2:00 PM.",
        "explanationHebrew": "נכון. בשורה 20 אית'ן מתחייב להביא את המסמך החתום עד מחר בשעה 14:00.",
        "points": 10,
        "options": [
          "True",
          "False"
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-debate-q10",
        "number": 10,
        "turnRefIndex": 20,
        "linesHint": "Line 21",
        "type": "open",
        "prompt": "When does Maya plan to present the joint council resolution for a vote?",
        "explanationHebrew": "בשורה 21 מיה מציינת שההצבעה תיערך ביום רביעי בבוקר.",
        "points": 10,
        "modelAnswer": "On Wednesday morning.",
        "keywords": [
          "Wednesday",
          "morning",
          "Wednesday morning"
        ]
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "conv-l3-shared-apartment",
    "title": "Negotiating Lease Renewal and Subletting Terms",
    "hebrewTitle": "משא ומתן על חידוש חוזה שכירות וסאבלט",
    "category": "school_social",
    "categoryLabelHebrew": "מגורים ושותפים",
    "settingDescription": "Two flatmates navigate complex legalities, liability clauses, and vetting procedures when one is awarded an overseas fellowship during their fixed tenancy.",
    "level": "Level 3",
    "levelLabel": "רמה 3 - תקשורת מתקדמת ופתרון בעיות",
    "levelDescription": "Nuanced real-world communication, professional problem-solving, and advanced idioms.",
    "speakers": [
      {
        "id": "speaker_a",
        "name": "Chloe",
        "role": "Primary Tenant",
        "avatarEmoji": "🔑",
        "genderHint": "female",
        "colorTheme": "sky"
      },
      {
        "id": "speaker_b",
        "name": "Daniel",
        "role": "Co-Tenant",
        "avatarEmoji": "🏠",
        "genderHint": "male",
        "colorTheme": "amber"
      }
    ],
    "turns": [
      {
        "index": 0,
        "speakerId": "speaker_a",
        "text": "Daniel, our landlord Mr. Vance sent the twelve-month lease renewal addendum this morning; he wants our signed response by Friday, but you mentioned an overseas fellowship."
      },
      {
        "index": 1,
        "speakerId": "speaker_b",
        "text": "Yes, Chloe; the Max Planck Institute in Berlin formally confirmed my four-month research residency starting in October. I really want to retain our tenancy here upon my return."
      },
      {
        "index": 2,
        "speakerId": "speaker_a",
        "text": "I am thrilled for your academic breakthrough, Daniel, but our current contract stipulates joint and several liability, meaning I am legally on the hook if your rent is defaulted."
      },
      {
        "index": 3,
        "speakerId": "speaker_b",
        "text": "I completely recognize that exposure. I intend to find a vetted, responsible subtenant to occupy my furnished bedroom from October through January."
      },
      {
        "index": 4,
        "speakerId": "speaker_a",
        "text": "Clause 14 of our lease explicitly forbids subletting without Vance's prior written consent, and you know how litigious he can be regarding unauthorized occupants."
      },
      {
        "index": 5,
        "speakerId": "speaker_b",
        "text": "What if we draft a tripartite sublease agreement that names the subtenant, binds them to the building bylaws, and leaves my security deposit with Vance intact?"
      },
      {
        "index": 6,
        "speakerId": "speaker_a",
        "text": "That protects Vance, but what safeguards my day-to-day living environment? I work from home four days a week as a data analyst, requiring quiet."
      },
      {
        "index": 7,
        "speakerId": "speaker_b",
        "text": "You will have unilateral veto power over every prospective candidate. We will only advertise within the university postgraduate network."
      },
      {
        "index": 8,
        "speakerId": "speaker_a",
        "text": "Postgraduate researchers generally maintain civil hours. What about utilities and high-speed fiber broadband allocation?"
      },
      {
        "index": 9,
        "speakerId": "speaker_b",
        "text": "I propose incorporating a fixed monthly utility surcharge of 120 dollars into the subtenant's fee, covering heat, water, electricity, and gigabit internet."
      },
      {
        "index": 10,
        "speakerId": "speaker_a",
        "text": "And if winter energy tariffs surge beyond that baseline due to electric space heaters?"
      },
      {
        "index": 11,
        "speakerId": "speaker_b",
        "text": "I will sign a personal indemnity pledge: any utility variance exceeding 120 dollars per month will be debited directly from my bank account, not yours."
      },
      {
        "index": 12,
        "speakerId": "speaker_a",
        "text": "That demonstrates genuine good faith, Daniel. What timeline are you envisioning for vetting and landlord notification?"
      },
      {
        "index": 13,
        "speakerId": "speaker_b",
        "text": "I will call Vance tomorrow morning at 10:00 AM to present our formal proposal and request his written approval for a temporary sublease addendum."
      },
      {
        "index": 14,
        "speakerId": "speaker_a",
        "text": "Assuming he consents, when do we begin interviewing applicants?"
      },
      {
        "index": 15,
        "speakerId": "speaker_b",
        "text": "By mid-August, giving us six full weeks to conduct in-person interviews and run credit and tenancy reference checks."
      },
      {
        "index": 16,
        "speakerId": "speaker_a",
        "text": "I also want an explicit clause forbidding overnight guests for more than two consecutive evenings without my prior consent."
      },
      {
        "index": 17,
        "speakerId": "speaker_b",
        "text": "Entirely reasonable; domestic boundaries must be respected. I will write that restriction into the sublease covenants."
      },
      {
        "index": 18,
        "speakerId": "speaker_a",
        "text": "Then we have an accord. Let us sign the renewal lease with Vance once his sublet permission is formalized in writing."
      },
      {
        "index": 19,
        "speakerId": "speaker_b",
        "text": "Thank you for being so accommodating, Chloe; this lets me pursue an extraordinary career opportunity without jeopardizing our wonderful home."
      }
    ],
    "usefulPhrases": [
      {
        "phrase": "joint and several liability",
        "translation": "אחריות משפטית ביחד ולחוד (כל שותף אחראי למלוא החוב)"
      },
      {
        "phrase": "tripartite sublease agreement",
        "translation": "הסכם שכירות משנה תלת-צדדי (שוכר, דייר משנה, משכיר)"
      },
      {
        "phrase": "unilateral veto power",
        "translation": "זכות וטו חד-צדדית ובלעדית"
      },
      {
        "phrase": "personal indemnity pledge",
        "translation": "התחייבות שיפוי ופיצוי אישית"
      },
      {
        "phrase": "domestic quiet enjoyment covenants",
        "translation": "סעיפי שמירה על שקט ואיכות חיים בדירה משותפת"
      }
    ],
    "questions": [
      {
        "id": "conv-l3-room-q1",
        "number": 1,
        "turnRefIndex": 1,
        "linesHint": "Line 2",
        "type": "open",
        "prompt": "Where was Daniel awarded a four-month research fellowship?",
        "explanationHebrew": "בשורה 2 דניאל מציין שהתקבל למכון מקס פלאנק בברלין.",
        "points": 10,
        "modelAnswer": "At the Max Planck Institute in Berlin.",
        "keywords": [
          "Max Planck",
          "Institute",
          "Berlin"
        ]
      },
      {
        "id": "conv-l3-room-q2",
        "number": 2,
        "turnRefIndex": 2,
        "linesHint": "Line 3",
        "type": "mcq",
        "prompt": "What legal concern does Chloe raise regarding the lease renewal in Line 3?",
        "explanationHebrew": "בשורה 3 קלואי מסבירה שהאחריות ההדדית בחוזה מטילה עליה חבות מלאה.",
        "points": 10,
        "options": [
          "The contract stipulates joint and several liability, making her legally responsible if rent is unpaid.",
          "The landlord is doubling the monthly rent unexpectedly.",
          "The building is scheduled for demolition next autumn.",
          "The lease requires four months of rent paid upfront in cash."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-room-q3",
        "number": 3,
        "turnRefIndex": 4,
        "linesHint": "Line 5",
        "type": "open",
        "prompt": "According to Clause 14, what is required before any subletting is legally permitted?",
        "explanationHebrew": "בשורה 5 קלואי מציינת שסעיף 14 דורש הסכמה מראש בכתב מבעל הדירה.",
        "points": 10,
        "modelAnswer": "The landlord's prior written consent.",
        "keywords": [
          "written",
          "consent",
          "prior",
          "landlord",
          "Vance"
        ]
      },
      {
        "id": "conv-l3-room-q4",
        "number": 4,
        "turnRefIndex": 6,
        "linesHint": "Line 7",
        "type": "open",
        "prompt": "Why does Chloe require a calm home environment during weekdays?",
        "explanationHebrew": "בשורה 7 קלואי מסבירה שהיא עובדת מהבית 4 ימים בשבוע כאנליסטית נתונים.",
        "points": 10,
        "modelAnswer": "She works from home four days a week as a data analyst.",
        "keywords": [
          "data analyst",
          "works from home",
          "four days",
          "analyst"
        ]
      },
      {
        "id": "conv-l3-room-q5",
        "number": 5,
        "turnRefIndex": 7,
        "linesHint": "Line 8",
        "type": "mcq",
        "prompt": "Where will Daniel advertise the bedroom opening to ensure responsible applicants?",
        "explanationHebrew": "בשורה 8 דניאל מתחייב לפרסם אך ורק ברשת האקדמית לתארים מתקדמים.",
        "points": 10,
        "options": [
          "Exclusively within the university postgraduate network.",
          "On public social media marketplaces.",
          "In international tourist backpacker hostels.",
          "On short-term vacation rental websites."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-room-q6",
        "number": 6,
        "turnRefIndex": 9,
        "linesHint": "Line 10",
        "type": "open",
        "prompt": "What fixed monthly utility surcharge does Daniel propose including in the subtenant's fee?",
        "explanationHebrew": "בשורה 10 דניאל מציע תשלום חשבונות קבוע של 120 דולר.",
        "points": 10,
        "modelAnswer": "120 dollars per month.",
        "keywords": [
          "120",
          "one hundred twenty",
          "dollars"
        ]
      },
      {
        "id": "conv-l3-room-q7",
        "number": 7,
        "turnRefIndex": 11,
        "linesHint": "Line 12",
        "type": "copy",
        "prompt": "Copy the sentence from Line 12 where Daniel pledges to pay any excess utility charges.",
        "explanationHebrew": "בשורה 12 דניאל מתחייב לשאת בכל חריגה מעל 120 דולר בעצמו.",
        "points": 10,
        "targetSentence": "I will sign a personal indemnity pledge: any utility variance exceeding 120 dollars per month will be debited directly from my bank account, not yours."
      },
      {
        "id": "conv-l3-room-q8",
        "number": 8,
        "turnRefIndex": 13,
        "linesHint": "Line 14",
        "type": "open",
        "prompt": "When does Daniel plan to contact landlord Mr. Vance to present their proposal?",
        "explanationHebrew": "בשורה 14 דניאל מתכנן להתקשר למר ואנס מחר ב-10:00 בבוקר.",
        "points": 10,
        "modelAnswer": "Tomorrow morning at 10:00 AM.",
        "keywords": [
          "tomorrow",
          "morning",
          "10:00 AM",
          "10"
        ]
      },
      {
        "id": "conv-l3-room-q9",
        "number": 9,
        "turnRefIndex": 16,
        "linesHint": "Line 17",
        "type": "mcq",
        "prompt": "What restriction on overnight guests does Chloe insist upon inserting into the agreement?",
        "explanationHebrew": "בשורה 17 קלואי דורשת הגבלת לינה לעד שני לילות רצופים ללא אישורה.",
        "points": 10,
        "options": [
          "No overnight guests for more than two consecutive evenings without prior consent.",
          "Total ban on all outside visitors at any time of day.",
          "Guests must pay a twenty-dollar overnight maintenance fee.",
          "Guests are only allowed on alternate weekends."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-room-q10",
        "number": 10,
        "turnRefIndex": 18,
        "linesHint": "Line 19",
        "type": "mcq",
        "prompt": "Chloe agrees to sign the lease renewal once the landlord's sublet permission is formalized in writing.",
        "explanationHebrew": "נכון. בשורה 19 קלואי מסכימה לחתום על החוזה ברגע שאישור הסאבלט יועלה על הכתב.",
        "points": 10,
        "options": [
          "True",
          "False"
        ],
        "correctIndex": 0
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "conv-l3-lost-luggage-claim",
    "title": "International Transit Baggage Discrepancy Formalities",
    "hebrewTitle": "בירור אובדן כבודה ופיצוי בטיסה בינלאומית",
    "category": "travel",
    "categoryLabelHebrew": "טיולים ושדה תעופה",
    "settingDescription": "A passenger arriving on an international connection files a formal WorldTracer claim for delayed luggage containing critical academic conference materials.",
    "level": "Level 3",
    "levelLabel": "רמה 3 - תקשורת מתקדמת ופתרון בעיות",
    "levelDescription": "Nuanced real-world communication, professional problem-solving, and advanced idioms.",
    "speakers": [
      {
        "id": "speaker_a",
        "name": "Gabriel",
        "role": "Conference Speaker / Passenger",
        "avatarEmoji": "🧳",
        "genderHint": "male",
        "colorTheme": "sky"
      },
      {
        "id": "speaker_b",
        "name": "Officer Henderson",
        "role": "Airport Baggage Services Supervisor",
        "avatarEmoji": "✈️",
        "genderHint": "female",
        "colorTheme": "amber"
      }
    ],
    "turns": [
      {
        "index": 0,
        "speakerId": "speaker_a",
        "text": "Good evening, Officer. My flight LH-902 from Frankfurt just landed at Terminal 2, but carousel 4 has cleared completely and my checked hardshell suitcase never appeared."
      },
      {
        "index": 1,
        "speakerId": "speaker_b",
        "text": "I am sorry for the frustration after international travel, sir. May I examine your passport and the baggage claim sticker affixed to your boarding pass?"
      },
      {
        "index": 2,
        "speakerId": "speaker_a",
        "text": "Here they are. Bag tag number LH-882190. Our inbound connection from Boston was delayed by forty-five minutes on the tarmac due to severe thunderstorms."
      },
      {
        "index": 3,
        "speakerId": "speaker_b",
        "text": "Thank you. Let me query the global WorldTracer baggage reconciliation database to ascertain the exact point of separation."
      },
      {
        "index": 4,
        "speakerId": "speaker_a",
        "text": "I only had a forty-minute transit window in Frankfurt, so I suspected the airside baggage handlers could not transfer the hold cargo in time."
      },
      {
        "index": 5,
        "speakerId": "speaker_b",
        "text": "Your instinct is accurate. The scan record indicates your luggage was unloaded from the transatlantic flight at 18:15 but missed the connection cutoff gate by nine minutes."
      },
      {
        "index": 6,
        "speakerId": "speaker_a",
        "text": "Where is the physical bag located at this moment?"
      },
      {
        "index": 7,
        "speakerId": "speaker_b",
        "text": "It is currently securely stored in the Frankfurt automated luggage sorting facility and has been re-manifested onto flight LH-914, arriving here tomorrow at 8:40 AM."
      },
      {
        "index": 8,
        "speakerId": "speaker_a",
        "text": "Tomorrow morning? I am delivering the keynote address at an international biotech symposium in Edinburgh tomorrow afternoon at 2:00 PM."
      },
      {
        "index": 9,
        "speakerId": "speaker_b",
        "text": "Are you taking the train to Scotland tonight or flying tomorrow?"
      },
      {
        "index": 10,
        "speakerId": "speaker_a",
        "text": "I have a commuter shuttle flight from Gatwick to Edinburgh at 7:00 AM. My formal presentation suit and clinical research trial prototypes are inside that suitcase."
      },
      {
        "index": 11,
        "speakerId": "speaker_b",
        "text": "Understood. We will re-route the luggage routing tag so that upon its arrival here, it is transferred directly onto British Airways flight BA-1442 straight to Edinburgh Airport."
      },
      {
        "index": 12,
        "speakerId": "speaker_a",
        "text": "And how does it reach my accommodation venue from Edinburgh Airport?"
      },
      {
        "index": 13,
        "speakerId": "speaker_b",
        "text": "We dispatch an authorized bonded courier service to deliver the bag straight to the concierge at the Balmoral Hotel no later than 12:30 PM."
      },
      {
        "index": 14,
        "speakerId": "speaker_a",
        "text": "That leaves me a narrow ninety-minute buffer before my lecture. What about emergency clothing and toiletry expenses in the meantime?"
      },
      {
        "index": 15,
        "speakerId": "speaker_b",
        "text": "Under Montreal Convention carrier liability regulations, you are entitled to immediate reimbursement of up to 250 British pounds for necessary apparel and grooming essentials."
      },
      {
        "index": 16,
        "speakerId": "speaker_a",
        "text": "Do I have to file those receipts via an online claims portal, or can I submit them directly?"
      },
      {
        "index": 17,
        "speakerId": "speaker_b",
        "text": "Keep every itemized VAT receipt and submit them together with this Property Irregularity Report number, PIR LHR-LH-44910, on our executive compensation portal."
      },
      {
        "index": 18,
        "speakerId": "speaker_a",
        "text": "Can you provide a physical copy of this Property Irregularity Report for my institutional travel insurance?"
      },
      {
        "index": 19,
        "speakerId": "speaker_b",
        "text": "Here is your official stamped printout, complete with the courier dispatch contact number and my direct supervisor stamp."
      },
      {
        "index": 20,
        "speakerId": "speaker_a",
        "text": "I appreciate your calm efficiency in de-escalating an extraordinarily stressful situation, Officer Henderson."
      },
      {
        "index": 21,
        "speakerId": "speaker_b",
        "text": "It is our duty, sir. I have personally flagged your luggage tag as high-priority VIP transfer. Best of luck with your keynote tomorrow."
      }
    ],
    "usefulPhrases": [
      {
        "phrase": "airside baggage reconciliation",
        "translation": "התאמת ומעקב כבודה באזור האווירי של נמל התעופה"
      },
      {
        "phrase": "WorldTracer tracking network",
        "translation": "רשת המעקב העולמית לאיתור כבודה אבודה"
      },
      {
        "phrase": "Montreal Convention carrier liability",
        "translation": "חבות המוביל האווירי לפי אמנת מונטריאול הבינלאומית"
      },
      {
        "phrase": "Property Irregularity Report (PIR)",
        "translation": "דוח רשמי על אי-סדירות/אובדן כבודה (PIR)"
      },
      {
        "phrase": "bonded courier dispatch",
        "translation": "משלוח באמצעות חברת שליחויות מאובטחת ומורשית"
      }
    ],
    "questions": [
      {
        "id": "conv-l3-luggage-q1",
        "number": 1,
        "turnRefIndex": 0,
        "linesHint": "Line 1",
        "type": "open",
        "prompt": "Which flight did Gabriel arrive on at London Heathrow Terminal 2?",
        "explanationHebrew": "בשורה 1 גבריאל מציין שנחת בטיסה LH-902 מפרנקפורט.",
        "points": 10,
        "modelAnswer": "Flight LH-902 from Frankfurt.",
        "keywords": [
          "LH-902",
          "LH902",
          "Frankfurt"
        ]
      },
      {
        "id": "conv-l3-luggage-q2",
        "number": 2,
        "turnRefIndex": 2,
        "linesHint": "Line 3",
        "type": "open",
        "prompt": "Why was Gabriel's inbound flight from Boston delayed by forty-five minutes?",
        "explanationHebrew": "בשורה 3 גבריאל מציין עיכוב עקב סופות רעמים כבדות.",
        "points": 10,
        "modelAnswer": "Due to severe thunderstorms.",
        "keywords": [
          "thunderstorms",
          "severe thunderstorms",
          "weather"
        ]
      },
      {
        "id": "conv-l3-luggage-q3",
        "number": 3,
        "turnRefIndex": 5,
        "linesHint": "Line 6",
        "type": "mcq",
        "prompt": "Why did Gabriel's suitcase fail to make the flight connection in Frankfurt?",
        "explanationHebrew": "בשורה 6 הקצינה מסבירה שהמזוודה פספסה את שער ההעברה ב-9 דקות.",
        "points": 10,
        "options": [
          "It missed the gate cutoff window by nine minutes during transfer.",
          "It was confiscated by German federal customs officials.",
          "The bag tag barcode fell off during unloading.",
          "The cargo hold of the aircraft was completely overloaded."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-luggage-q4",
        "number": 4,
        "turnRefIndex": 8,
        "linesHint": "Line 9",
        "type": "open",
        "prompt": "What important commitment does Gabriel have tomorrow afternoon at 2:00 PM?",
        "explanationHebrew": "בשורה 9 גבריאל מסביר שהוא נושא את נאום הפתיחה בכנס ביו-טק באדינבורו.",
        "points": 10,
        "modelAnswer": "He is delivering the keynote address at an international biotech symposium in Edinburgh.",
        "keywords": [
          "keynote",
          "biotech",
          "symposium",
          "Edinburgh",
          "address"
        ]
      },
      {
        "id": "conv-l3-luggage-q5",
        "number": 5,
        "turnRefIndex": 11,
        "linesHint": "Line 12",
        "type": "mcq",
        "prompt": "How will the airline transport the delayed luggage to Edinburgh?",
        "explanationHebrew": "בשורה 12 הקצינה מפרטת שהמזוודה תועבר ישירות לטיסת BA-1442 לאדינבורו.",
        "points": 10,
        "options": [
          "By transferring it onto British Airways flight BA-1442 directly to Edinburgh Airport.",
          "By placing it on an overnight high-speed train to Scotland.",
          "By sending a private delivery van across the country.",
          "By holding it in London until Gabriel returns next week."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-luggage-q6",
        "number": 6,
        "turnRefIndex": 13,
        "linesHint": "Line 14",
        "type": "open",
        "prompt": "Where and by what time will the courier deliver the bag in Edinburgh?",
        "explanationHebrew": "בשורה 14 הקצינה מתחייבת למסירה במלון בלמורל עד 12:30 בצהריים.",
        "points": 10,
        "modelAnswer": "To the concierge at the Balmoral Hotel no later than 12:30 PM.",
        "keywords": [
          "Balmoral",
          "Hotel",
          "concierge",
          "12:30",
          "12:30 PM"
        ]
      },
      {
        "id": "conv-l3-luggage-q7",
        "number": 7,
        "turnRefIndex": 15,
        "linesHint": "Line 16",
        "type": "copy",
        "prompt": "Copy the sentence from Line 16 where Officer Henderson explains passenger reimbursement rights.",
        "explanationHebrew": "בשורה 16 הקצינה מפרטת את זכות ההחזר של עד 250 פאונד תחת אמנת מונטריאול.",
        "points": 10,
        "targetSentence": "Under Montreal Convention carrier liability regulations, you are entitled to immediate reimbursement of up to 250 British pounds for necessary apparel and grooming essentials."
      },
      {
        "id": "conv-l3-luggage-q8",
        "number": 8,
        "turnRefIndex": 17,
        "linesHint": "Line 18",
        "type": "open",
        "prompt": "What is the official Property Irregularity Report (PIR) reference number?",
        "explanationHebrew": "בשורה 18 נמסר מספר הדוח הרשמי PIR LHR-LH-44910.",
        "points": 10,
        "modelAnswer": "PIR LHR-LH-44910.",
        "keywords": [
          "LHR-LH-44910",
          "44910",
          "PIR"
        ]
      },
      {
        "id": "conv-l3-luggage-q9",
        "number": 9,
        "turnRefIndex": 19,
        "linesHint": "Line 20",
        "type": "mcq",
        "prompt": "Officer Henderson provides a physical stamped copy of the report for insurance purposes.",
        "explanationHebrew": "נכון. בשורה 20 הקצינה מוסרת עותק מודפס וחתום רשמית.",
        "points": 10,
        "options": [
          "True",
          "False"
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-luggage-q10",
        "number": 10,
        "turnRefIndex": 21,
        "linesHint": "Line 22",
        "type": "mcq",
        "prompt": "What special action did Officer Henderson take to expedite Gabriel's suitcase?",
        "explanationHebrew": "בשורה 22 הקצינה מציינת שסימנה את התג כהעברת VIP בעדיפות עליונה.",
        "points": 10,
        "options": [
          "She personally flagged the luggage tag for high-priority VIP transfer.",
          "She escorted the luggage onto the plane in person.",
          "She purchased a new suitcase for Gabriel at the airport boutique.",
          "She rescheduled his keynote presentation to Monday."
        ],
        "correctIndex": 0
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "conv-l3-restaurant-complaint",
    "title": "High-End Gastronomy Allergen Negligence Incident",
    "hebrewTitle": "בירור תקרית אלרגנים חמורה במסעדת שף יוקרתית",
    "category": "food",
    "categoryLabelHebrew": "מסעדות שף וקולינריה",
    "settingDescription": "A patron confronts an executive chef after an amuse-bouche containing undisclosed walnut oil is served despite explicit prior medical allergy declarations.",
    "level": "Level 3",
    "levelLabel": "רמה 3 - תקשורת מתקדמת ופתרון בעיות",
    "levelDescription": "Nuanced real-world communication, professional problem-solving, and advanced idioms.",
    "speakers": [
      {
        "id": "speaker_a",
        "name": "Samantha",
        "role": "Distressed Patron",
        "avatarEmoji": "🍽️",
        "genderHint": "female",
        "colorTheme": "sky"
      },
      {
        "id": "speaker_b",
        "name": "Chef Henri",
        "role": "Executive Chef & Patron",
        "avatarEmoji": "👨‍🍳",
        "genderHint": "male",
        "colorTheme": "amber"
      }
    ],
    "turns": [
      {
        "index": 0,
        "speakerId": "speaker_a",
        "text": "Chef Henri, I requested you at our table immediately because our server just served an amuse-bouche drizzled with toasted walnut oil, despite three explicit advance warnings of my life-threatening tree-nut allergy."
      },
      {
        "index": 1,
        "speakerId": "speaker_b",
        "text": "Samantha, I am horrified and deeply shaken. Please tell me first: did you ingest any portion of that dish, and do you require an epinephrine auto-injector or emergency paramedics right now?"
      },
      {
        "index": 2,
        "speakerId": "speaker_a",
        "text": "Thankfully, my partner recognized the distinct nutty aroma and intercepted the spoon as it touched my lips. If I had swallowed it, I would have suffered full anaphylactic shock within minutes."
      },
      {
        "index": 3,
        "speakerId": "speaker_b",
        "text": "Thank heavens. I take absolute, unreserved personal responsibility for this catastrophic breakdown in our kitchen protocol."
      },
      {
        "index": 4,
        "speakerId": "speaker_a",
        "text": "When I reserved this anniversary dinner four weeks ago, I entered my anaphylactic tree-nut restriction in the online booking notes, reiterated it by telephone yesterday, and repeated it to the head waiter upon arrival."
      },
      {
        "index": 5,
        "speakerId": "speaker_b",
        "text": "Let me inspect the order ticket on our digital line printer... Good heavens, the red allergen banner is clearly printed at the top of table fourteen's order: 'SEVERE TREE NUT ANAPHYLAXIS'."
      },
      {
        "index": 6,
        "speakerId": "speaker_a",
        "text": "Then how on earth did a plate with walnut reduction leave the pass without being halted?"
      },
      {
        "index": 7,
        "speakerId": "speaker_b",
        "text": "Our sous-chef was plating a VIP party of eight at table sixteen simultaneously and mistakenly passed the standardized amuse-bouche tray to your junior food runner without verifying the allergy override."
      },
      {
        "index": 8,
        "speakerId": "speaker_a",
        "text": "That runner almost caused a medical fatality through sheer carelessness. In a Michelin-starred establishment, that is inexcusable negligence."
      },
      {
        "index": 9,
        "speakerId": "speaker_b",
        "text": "You are entirely right. There is no defense for complacency when human lives are entrusted to our culinary craft."
      },
      {
        "index": 10,
        "speakerId": "speaker_a",
        "text": "What concrete steps are you taking right now, beyond verbal apologies?"
      },
      {
        "index": 11,
        "speakerId": "speaker_b",
        "text": "First, I am immediately shutting down the pass for fifteen minutes to hold a mandatory kitchen-wide allergy briefing with all brigade staff and floor servers."
      },
      {
        "index": 12,
        "speakerId": "speaker_a",
        "text": "And regarding the rest of our culinary experience tonight?"
      },
      {
        "index": 13,
        "speakerId": "speaker_b",
        "text": "If you still feel safe dining with us, I will personally prepare every course for your table with freshly sanitized, dedicated cookware in our pastry isolation bay."
      },
      {
        "index": 14,
        "speakerId": "speaker_a",
        "text": "I appreciate that commitment, Henri, but our appetite and celebration have been severely clouded by anxiety."
      },
      {
        "index": 15,
        "speakerId": "speaker_b",
        "text": "I understand completely; your dinner tonight is entirely complimentary, regardless of whether you choose to stay or leave."
      },
      {
        "index": 16,
        "speakerId": "speaker_a",
        "text": "We will accept a light main course prepared exclusively by you, but we expect systematic operational changes so no future guest experiences this terror."
      },
      {
        "index": 17,
        "speakerId": "speaker_b",
        "text": "Starting tomorrow morning at 8:00 AM, we are mandating a dual-signature verification system: no allergy plate may cross the pass without the signature of both the station head and the expediter."
      },
      {
        "index": 18,
        "speakerId": "speaker_a",
        "text": "That dual-check protocol should have been standard practice from day one."
      },
      {
        "index": 19,
        "speakerId": "speaker_b",
        "text": "I humble myself before you; you have exposed a blind spot that could have proved fatal, and your grace under pressure has saved lives."
      },
      {
        "index": 20,
        "speakerId": "speaker_a",
        "text": "Accountability and immediate decisive remedies are what distinguish true professionals. Thank you for taking this with utmost seriousness."
      },
      {
        "index": 21,
        "speakerId": "speaker_b",
        "text": "I am going to begin preparing your bespoke allergen-free dishes right now. Thank you for your extraordinary patience and understanding."
      }
    ],
    "usefulPhrases": [
      {
        "phrase": "anaphylactic tree-nut restriction",
        "translation": "הגבלת אלרגיה אנפילקטית מסכנת חיים לאגוזים"
      },
      {
        "phrase": "kitchen line pass",
        "translation": "פס הוצאת המנות במטבח השף"
      },
      {
        "phrase": "cross-contact contamination",
        "translation": "זיהום צולב של אלרגנים בין משטחים ומזונות"
      },
      {
        "phrase": "dual-signature verification",
        "translation": "נוהל אימות בחתימה כפולה לפני הגשה"
      },
      {
        "phrase": "isolation preparation bay",
        "translation": "אזור הכנה מבודד וסטרילי מאלרגנים במטבח"
      }
    ],
    "questions": [
      {
        "id": "conv-l3-rest-q1",
        "number": 1,
        "turnRefIndex": 0,
        "linesHint": "Line 1",
        "type": "open",
        "prompt": "What hazardous ingredient was served on the amuse-bouche despite Samantha's medical warning?",
        "explanationHebrew": "בשורה 1 סמנתה מציינת שהוגש שמן אגוזי מלך קלויים.",
        "points": 10,
        "modelAnswer": "Toasted walnut oil.",
        "keywords": [
          "walnut",
          "walnut oil",
          "toasted walnut oil",
          "nuts"
        ]
      },
      {
        "id": "conv-l3-rest-q2",
        "number": 2,
        "turnRefIndex": 2,
        "linesHint": "Line 3",
        "type": "mcq",
        "prompt": "How was the allergic reaction prevented in Line 3?",
        "explanationHebrew": "בשורה 3 סמנתה מסבירה שבן זוגה זיהה את הריח ועצר את הכף בזמן.",
        "points": 10,
        "options": [
          "Samantha's partner recognized the walnut aroma and stopped the spoon before it entered her mouth.",
          "The head waiter ran back and snatched the plate away.",
          "Samantha smelled the dish and immediately injected an EpiPen.",
          "The kitchen alerted the dining room through a loudspeaker."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-rest-q3",
        "number": 3,
        "turnRefIndex": 4,
        "linesHint": "Line 5",
        "type": "open",
        "prompt": "How many times had Samantha communicated her allergy to the restaurant prior to being served?",
        "explanationHebrew": "בשורה 5 סמנתה מפרטת שלוש פעמים שונות שבהן התריעה על האלרגיה.",
        "points": 10,
        "modelAnswer": "Three times (online booking, telephone, and to the head waiter).",
        "keywords": [
          "three",
          "3",
          "times",
          "thrice"
        ]
      },
      {
        "id": "conv-l3-rest-q4",
        "number": 4,
        "turnRefIndex": 5,
        "linesHint": "Line 6",
        "type": "open",
        "prompt": "What exact warning appeared on the digital kitchen order ticket for table fourteen?",
        "explanationHebrew": "בשורה 6 השף מקריא את האזהרה שהודפסה: 'SEVERE TREE NUT ANAPHYLAXIS'.",
        "points": 10,
        "modelAnswer": "SEVERE TREE NUT ANAPHYLAXIS.",
        "keywords": [
          "SEVERE",
          "TREE NUT",
          "ANAPHYLAXIS"
        ]
      },
      {
        "id": "conv-l3-rest-q5",
        "number": 5,
        "turnRefIndex": 7,
        "linesHint": "Line 8",
        "type": "mcq",
        "prompt": "What was the breakdown in communication that caused the dish to reach table fourteen?",
        "explanationHebrew": "בשורה 8 השף מודה שסגן השף העביר מגש סטנדרטי למלצר במקביל לשולחן VIP מבלי לבדוק החרגה.",
        "points": 10,
        "options": [
          "The sous-chef was plating a VIP party and handed the standard tray to a runner without checking the allergy override.",
          "The dishwasher mixed up the clean plates with dirty ones.",
          "The server typed the wrong table number into the computer terminal.",
          "The chef did not read the ticket because the printer was out of ink."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-rest-q6",
        "number": 6,
        "turnRefIndex": 11,
        "linesHint": "Line 12",
        "type": "open",
        "prompt": "What immediate action does Chef Henri take with the kitchen staff in Line 12?",
        "explanationHebrew": "בשורה 12 השף עוצר את הפס לרבע שעה לתדריך אלרגנים מחייב לכל הצוות.",
        "points": 10,
        "modelAnswer": "He halts the pass for fifteen minutes to hold a mandatory allergy briefing with all brigade staff and servers.",
        "keywords": [
          "halts",
          "briefing",
          "fifteen minutes",
          "allergy",
          "pass",
          "mandatory"
        ]
      },
      {
        "id": "conv-l3-rest-q7",
        "number": 7,
        "turnRefIndex": 13,
        "linesHint": "Line 14",
        "type": "mcq",
        "prompt": "Where will Chef Henri prepare Samantha's customized dishes?",
        "explanationHebrew": "בשורה 14 השף מבטיח לבשל באזור המבודד של הקונדיטוריה בכלים סטריליים.",
        "points": 10,
        "options": [
          "In the pastry isolation bay with freshly sanitized, dedicated cookware.",
          "At a nearby sister restaurant down the street.",
          "In the cold storage pantry room.",
          "On an outdoor barbecue grill behind the building."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-rest-q8",
        "number": 8,
        "turnRefIndex": 15,
        "linesHint": "Line 16",
        "type": "copy",
        "prompt": "Copy the sentence from Line 16 where Chef Henri waives the cost of the meal.",
        "explanationHebrew": "בשורה 16 השף מעניק את כל הארוחה על חשבון הבית ללא תנאי.",
        "points": 10,
        "targetSentence": "I understand completely; your dinner tonight is entirely complimentary, regardless of whether you choose to stay or leave."
      },
      {
        "id": "conv-l3-rest-q9",
        "number": 9,
        "turnRefIndex": 17,
        "linesHint": "Line 18",
        "type": "open",
        "prompt": "What new policy will be enforced starting tomorrow at 8:00 AM to prevent recurrence?",
        "explanationHebrew": "בשורה 18 השף מציג נוהל חתימה כפולה של ראש העמדה ומנהל הפס.",
        "points": 10,
        "modelAnswer": "A dual-signature verification system where both the station head and expediter must sign allergy plates.",
        "keywords": [
          "dual-signature",
          "verification",
          "signed",
          "station head",
          "expediter"
        ]
      },
      {
        "id": "conv-l3-rest-q10",
        "number": 10,
        "turnRefIndex": 17,
        "linesHint": "Line 18",
        "type": "mcq",
        "prompt": "Under the new system, an allergy dish can cross the pass with only the food runner's oral approval.",
        "explanationHebrew": "לא נכון. נדרשת חתימה בכתב של ראש העמדה ומנהל הפס גם יחד.",
        "points": 10,
        "options": [
          "True",
          "False"
        ],
        "correctIndex": 1
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "conv-l3-medical-specialist",
    "title": "Orthopedic Specialist Knee Injury Consultation",
    "hebrewTitle": "ייעוץ מומחה אורתופדי לפציעת ברך ספורטיבית",
    "category": "health",
    "categoryLabelHebrew": "רפואה ושיקום ספורטיבי",
    "settingDescription": "A university soccer player consults an orthopedic surgeon regarding an MRI revealing a complex meniscus tear and grade-I ACL sprain.",
    "level": "Level 3",
    "levelLabel": "רמה 3 - תקשורת מתקדמת ופתרון בעיות",
    "levelDescription": "Nuanced real-world communication, professional problem-solving, and advanced idioms.",
    "speakers": [
      {
        "id": "speaker_a",
        "name": "Jordan",
        "role": "Collegiate Athlete",
        "avatarEmoji": "⚽",
        "genderHint": "male",
        "colorTheme": "sky"
      },
      {
        "id": "speaker_b",
        "name": "Dr. Alvarez",
        "role": "Orthopedic Surgeon & Sports Specialist",
        "avatarEmoji": "🩺",
        "genderHint": "female",
        "colorTheme": "amber"
      }
    ],
    "turns": [
      {
        "index": 0,
        "speakerId": "speaker_a",
        "text": "Dr. Alvarez, thank you for fitting me in. I brought the diagnostic MRI imaging disk from St. Jude's after twisting my right knee during Tuesday's varsity match."
      },
      {
        "index": 1,
        "speakerId": "speaker_b",
        "text": "Let us load the high-resolution sagittal and coronal sequences on the viewbox right away, Jordan. Walk me through the exact biomechanical mechanism of the injury."
      },
      {
        "index": 2,
        "speakerId": "speaker_a",
        "text": "I was decelerating at high speed while pivoting inward to intercept a cross-field pass; my cleats caught in the turf, and I felt an audible pop followed by acute joint instability."
      },
      {
        "index": 3,
        "speakerId": "speaker_b",
        "text": "Examining your MRI now: looking at the posterior horn of the medial meniscus, there is a distinct longitudinal tear extending approximately 1.4 centimeters into the red-white vascular transition zone."
      },
      {
        "index": 4,
        "speakerId": "speaker_a",
        "text": "And what about the anterior cruciate ligament? Our athletic trainer feared a catastrophic complete rupture."
      },
      {
        "index": 5,
        "speakerId": "speaker_b",
        "text": "There is fortunate news there: the ACL fibers maintain continuous structural integrity, showing only focal hyperintensity consistent with a mild grade-one interstitial sprain without macroscopic fiber disruption."
      },
      {
        "index": 6,
        "speakerId": "speaker_a",
        "text": "That is a massive relief. But does the longitudinal meniscus tear mandate arthroscopic surgery?"
      },
      {
        "index": 7,
        "speakerId": "speaker_b",
        "text": "Not necessarily. Because the tear is situated in the periphery where microvascular blood supply remains viable, biological healing has a seventy-percent success rate under structured conservative therapy."
      },
      {
        "index": 8,
        "speakerId": "speaker_a",
        "text": "What would that conservative rehabilitation protocol look like over the coming weeks?"
      },
      {
        "index": 9,
        "speakerId": "speaker_b",
        "text": "Stage one spans four weeks: non-weight-bearing immobilization in an articulated knee brace locked at thirty degrees of flexion, coupled with ultrasound-guided platelet-rich plasma (PRP) therapy."
      },
      {
        "index": 10,
        "speakerId": "speaker_a",
        "text": "And when can active neuromuscular physical therapy begin?"
      },
      {
        "index": 11,
        "speakerId": "speaker_b",
        "text": "At week five, provided clinical palpation reveals zero joint line tenderness and no effusion. We initiate progressive closed-kinetic-chain quadriceps strengthening and aquatic hydrotherapy."
      },
      {
        "index": 12,
        "speakerId": "speaker_a",
        "text": "If conservative therapy fails to alleviate the mechanical catching, what surgical intervention would be considered?"
      },
      {
        "index": 13,
        "speakerId": "speaker_b",
        "text": "Outpatient arthroscopic meniscal repair using bioabsorbable all-inside sutures, preserving as much native chondral tissue as possible to avoid premature osteoarthritis."
      },
      {
        "index": 14,
        "speakerId": "speaker_a",
        "text": "What is my realistic timeline for returning to full competitive contact soccer?"
      },
      {
        "index": 15,
        "speakerId": "speaker_b",
        "text": "Under conservative management, twelve to fourteen weeks. If we pivot to surgical repair, the biological timeline extends to five to six months."
      },
      {
        "index": 16,
        "speakerId": "speaker_a",
        "text": "I want to commit wholeheartedly to the non-surgical PRP and rehabilitation route first."
      },
      {
        "index": 17,
        "speakerId": "speaker_b",
        "text": "A very sound decision. I will administer the initial autologous PRP injection this Thursday afternoon under sterile local anesthesia."
      },
      {
        "index": 18,
        "speakerId": "speaker_a",
        "text": "Thank you for the thorough, evidence-based roadmap, Dr. Alvarez; I feel much more empowered navigating this recovery."
      },
      {
        "index": 19,
        "speakerId": "speaker_b",
        "text": "Patience and disciplined biomechanical compliance are your greatest assets now, Jordan. See you on Thursday."
      }
    ],
    "usefulPhrases": [
      {
        "phrase": "vascular transition zone",
        "translation": "אזור המעבר הווסקולרי (אספקת דם בהיקף המניסקוס)"
      },
      {
        "phrase": "interstitial grade-one sprain",
        "translation": "מתיחה קלה פנימית של סיבי הרצועה מדרגה 1"
      },
      {
        "phrase": "platelet-rich plasma (PRP)",
        "translation": "פלזמה עשירה בטסיות דם להאצת ריפוי רקמות"
      },
      {
        "phrase": "closed-kinetic-chain exercises",
        "translation": "תרגילים בשרשרת קינטית סגורה לייצוב מפרקי בטוח"
      },
      {
        "phrase": "bioabsorbable suture repair",
        "translation": "תיקון כירורגי בתפרים נספגים ביולוגית"
      }
    ],
    "questions": [
      {
        "id": "conv-l3-med-q1",
        "number": 1,
        "turnRefIndex": 0,
        "linesHint": "Line 1",
        "type": "open",
        "prompt": "When and during what event did Jordan injure his right knee?",
        "explanationHebrew": "בשורה 1 ג'ורדן מציין שהפציעה אירעה במשחק הנבחרת ביום שלישי.",
        "points": 10,
        "modelAnswer": "During Tuesday's varsity match.",
        "keywords": [
          "Tuesday",
          "varsity",
          "match",
          "game"
        ]
      },
      {
        "id": "conv-l3-med-q2",
        "number": 2,
        "turnRefIndex": 3,
        "linesHint": "Line 4",
        "type": "mcq",
        "prompt": "What exact pathology is observed in the medial meniscus on the MRI?",
        "explanationHebrew": "בשורה 4 הרופאה מתארת קרע אורכי באורך 1.4 ס'מ באזור הווסקולרי.",
        "points": 10,
        "options": [
          "A longitudinal tear extending approximately 1.4 centimeters into the red-white vascular zone.",
          "A complete transverse maceration with loose cartilage fragments.",
          "A hairline stress fracture of the tibial plateau.",
          "Severe bone marrow edema with no soft tissue damage."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-med-q3",
        "number": 3,
        "turnRefIndex": 5,
        "linesHint": "Line 6",
        "type": "open",
        "prompt": "What is the diagnosis regarding Jordan's anterior cruciate ligament (ACL)?",
        "explanationHebrew": "בשורה 6 הרופאה מאשרת מתיחה קלה בלבד בדרגה 1 ללא קרע סיבים.",
        "points": 10,
        "modelAnswer": "A mild grade-one interstitial sprain without macroscopic fiber disruption.",
        "keywords": [
          "grade-one",
          "grade 1",
          "sprain",
          "interstitial",
          "mild"
        ]
      },
      {
        "id": "conv-l3-med-q4",
        "number": 4,
        "turnRefIndex": 7,
        "linesHint": "Line 8",
        "type": "open",
        "prompt": "What is the success rate of structured conservative biological therapy for this type of tear?",
        "explanationHebrew": "בשורה 8 הרופאה מציינת 70 אחוזי הצלחה לטיפול שמרני.",
        "points": 10,
        "modelAnswer": "Seventy percent.",
        "keywords": [
          "seventy",
          "70",
          "70%",
          "percent"
        ]
      },
      {
        "id": "conv-l3-med-q5",
        "number": 5,
        "turnRefIndex": 9,
        "linesHint": "Line 10",
        "type": "mcq",
        "prompt": "What does stage one of the conservative rehabilitation protocol entail?",
        "explanationHebrew": "בשורה 10 הרופאה מפרטת קיבוע במייצב נעול ב-30 מעלות והזרקות PRP.",
        "points": 10,
        "options": [
          "Four weeks in a knee brace locked at thirty degrees flexion and ultrasound-guided PRP injections.",
          "Immediate full-contact running drills on grass surfaces.",
          "Complete surgical excision of the torn meniscus tissue.",
          "Daily weightlifting with heavy squats and deadlifts."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-med-q6",
        "number": 6,
        "turnRefIndex": 11,
        "linesHint": "Line 12",
        "type": "open",
        "prompt": "When can active physical therapy commence provided there is no joint line tenderness or effusion?",
        "explanationHebrew": "בשורה 12 הרופאה מציינת שפיזיותרפיה פעילה תחל בשבוע החמישי.",
        "points": 10,
        "modelAnswer": "At week five.",
        "keywords": [
          "week five",
          "week 5",
          "5"
        ]
      },
      {
        "id": "conv-l3-med-q7",
        "number": 7,
        "turnRefIndex": 13,
        "linesHint": "Line 14",
        "type": "copy",
        "prompt": "Copy the sentence from Line 14 describing the surgical backup procedure if conservative care fails.",
        "explanationHebrew": "בשורה 14 הרופאה מתארת את הניתוח הארתרוסקופי לשימור הסחוס.",
        "points": 10,
        "targetSentence": "Outpatient arthroscopic meniscal repair using bioabsorbable all-inside sutures, preserving as much native chondral tissue as possible to avoid premature osteoarthritis."
      },
      {
        "id": "conv-l3-med-q8",
        "number": 8,
        "turnRefIndex": 15,
        "linesHint": "Line 16",
        "type": "open",
        "prompt": "How long is the expected recovery timeline for return to competition under conservative management?",
        "explanationHebrew": "בשורה 16 מוגדר לוח זמנים של 12 עד 14 שבועות בטיפול שמרני.",
        "points": 10,
        "modelAnswer": "Twelve to fourteen weeks.",
        "keywords": [
          "twelve",
          "fourteen",
          "12",
          "14",
          "weeks"
        ]
      },
      {
        "id": "conv-l3-med-q9",
        "number": 9,
        "turnRefIndex": 17,
        "linesHint": "Line 18",
        "type": "mcq",
        "prompt": "Dr. Alvarez will administer Jordan's first autologous PRP injection this Thursday afternoon.",
        "explanationHebrew": "נכון. בשורה 18 הרופאה קובעת את ההזרקה ליום חמישי אחה'צ.",
        "points": 10,
        "options": [
          "True",
          "False"
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-med-q10",
        "number": 10,
        "turnRefIndex": 17,
        "linesHint": "Line 18",
        "type": "mcq",
        "prompt": "Which treatment route did Jordan choose to commit to first?",
        "explanationHebrew": "בשורה 17 ג'ורדן בוחר להתחייב למסלול השמרני של PRP ושיקום.",
        "points": 10,
        "options": [
          "The non-surgical PRP and progressive physical therapy route.",
          "Immediate total knee replacement surgery.",
          "An immediate arthroscopic meniscus removal.",
          "Ending his sports career immediately."
        ],
        "correctIndex": 0
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "conv-l3-bank-security",
    "title": "Bank Cybersecurity Fraud Alert and Wire Rectification",
    "hebrewTitle": "בירור הונאת אבטחה בנקאית ועצירת העברה בינלאומית",
    "category": "tech_daily",
    "categoryLabelHebrew": "בנקאות ואבטחת סייבר",
    "settingDescription": "A business executive contacts a premier fraud operations specialist after an unauthorized international wire transfer is initiated through an account takeover attack.",
    "level": "Level 3",
    "levelLabel": "רמה 3 - תקשורת מתקדמת ופתרון בעיות",
    "levelDescription": "Nuanced real-world communication, professional problem-solving, and advanced idioms.",
    "speakers": [
      {
        "id": "speaker_a",
        "name": "Dominic",
        "role": "Corporate Account Holder",
        "avatarEmoji": "💳",
        "genderHint": "male",
        "colorTheme": "sky"
      },
      {
        "id": "speaker_b",
        "name": "Agent Vanessa",
        "role": "Senior Fraud Operations Investigator",
        "avatarEmoji": "🛡️",
        "genderHint": "female",
        "colorTheme": "amber"
      }
    ],
    "turns": [
      {
        "index": 0,
        "speakerId": "speaker_a",
        "text": "Agent Vanessa, I just received an urgent SMS alert regarding an unauthorized pending wire transfer of four thousand two hundred dollars routed to an offshore account in Singapore."
      },
      {
        "index": 1,
        "speakerId": "speaker_b",
        "text": "I am placing an immediate emergency hold on your commercial checking portfolio, Dominic. Let us complete two-factor biometric voice verification before discussing transaction specifics."
      },
      {
        "index": 2,
        "speakerId": "speaker_a",
        "text": "Authentication prompt confirmed on my secure token generator. The transaction reference code displayed on my phone is WT-90412."
      },
      {
        "index": 3,
        "speakerId": "speaker_b",
        "text": "Thank you, Dominic; voice identity confirmed. I am viewing the outgoing SWIFT transfer right now. It was initiated fourteen minutes ago from an unrecognized IP address in Southeast Asia."
      },
      {
        "index": 4,
        "speakerId": "speaker_a",
        "text": "That is completely fraudulent. I was attending an in-person client presentation in Chicago all morning and have never transacted with that entity."
      },
      {
        "index": 5,
        "speakerId": "speaker_b",
        "text": "I have just executed a SWIFT MT192 stop-payment recall request. Because the funds have not settled through the intermediary clearing house, the wire has been successfully frozen in transit."
      },
      {
        "index": 6,
        "speakerId": "speaker_a",
        "text": "What a massive relief. But how did the perpetrators bypass my multi-factor authentication credentials in the first place?"
      },
      {
        "index": 7,
        "speakerId": "speaker_b",
        "text": "Our threat intelligence indicates a sophisticated session-cookie hijacking attack, likely triggered by a spear-phishing PDF invoice opened on an executive device within the past seventy-two hours."
      },
      {
        "index": 8,
        "speakerId": "speaker_a",
        "text": "My administrative assistant mentioned receiving a vendor invoice from an existing supplier on Monday that prompted for an Adobe credential refresh."
      },
      {
        "index": 9,
        "speakerId": "speaker_b",
        "text": "That was almost certainly the attack vector. The malware harvested authenticated browser tokens without alerting the local antivirus endpoint."
      },
      {
        "index": 10,
        "speakerId": "speaker_a",
        "text": "What steps are required to purge the compromised credentials and restore our corporate treasury operations?"
      },
      {
        "index": 11,
        "speakerId": "speaker_b",
        "text": "First, I am severing all active API tokens, revoking current OAuth session keys, and forcing a global credential reset across all corporate sub-accounts."
      },
      {
        "index": 12,
        "speakerId": "speaker_a",
        "text": "Will my primary business debit and credit cards continue functioning for payroll and daily operations?"
      },
      {
        "index": 13,
        "speakerId": "speaker_b",
        "text": "The physical cards linked to the primary account are canceled immediately as a precautionary measure to prevent secondary bin-attack cloning."
      },
      {
        "index": 14,
        "speakerId": "speaker_a",
        "text": "How will my staff pay for travel accommodations tomorrow without active cards?"
      },
      {
        "index": 15,
        "speakerId": "speaker_b",
        "text": "I am issuing two virtual single-use digital card tokens into your secure corporate mobile banking wallet right now, each pre-loaded with a five-thousand-dollar spending ceiling."
      },
      {
        "index": 16,
        "speakerId": "speaker_a",
        "text": "And what is our legal liability under Federal Reserve regulations regarding the attempted four-thousand-two-hundred-dollar breach?"
      },
      {
        "index": 17,
        "speakerId": "speaker_b",
        "text": "Under Regulation E and Uniform Commercial Code Article 4A, your prompt notification within twenty-four hours guarantees zero liability for unauthorized transactions."
      },
      {
        "index": 18,
        "speakerId": "speaker_a",
        "text": "Will the four thousand two hundred dollars be reflected back in my balance immediately?"
      },
      {
        "index": 19,
        "speakerId": "speaker_b",
        "text": "A provisional credit has already been posted to your balance, which will become permanently finalized once the SWIFT recall closes in forty-eight hours."
      },
      {
        "index": 20,
        "speakerId": "speaker_a",
        "text": "Agent Vanessa, your swift intervention and decisive containment prevented a massive corporate disaster. I am profoundly grateful."
      },
      {
        "index": 21,
        "speakerId": "speaker_b",
        "text": "It is our privilege to protect your financial security, Dominic. I am emailing our incident forensic report and dedicated support case number to you right now."
      }
    ],
    "usefulPhrases": [
      {
        "phrase": "unauthorized SWIFT wire recall",
        "translation": "ביטול והחזרה דחופה של העברה בינלאומית ב-SWIFT"
      },
      {
        "phrase": "session-cookie hijacking",
        "translation": "חטיפת עוגיות סשן מאומתות בדפדפן (מתקפת סייבר)"
      },
      {
        "phrase": "zero liability under Regulation E",
        "translation": "הגנת אפס אחריות כספית ללקוח לפי תקנה פדרלית"
      },
      {
        "phrase": "virtual single-use digital tokens",
        "translation": "טוקנים דיגיטליים חד-פעמיים לתשלום מאובטח"
      },
      {
        "phrase": "provisional account credit",
        "translation": "זיכוי כספי זמני בחשבון עד לסיום חקירת הונאה"
      }
    ],
    "questions": [
      {
        "id": "conv-l3-bank-q1",
        "number": 1,
        "turnRefIndex": 0,
        "linesHint": "Line 1",
        "type": "open",
        "prompt": "What is the dollar amount and destination of the unauthorized wire transfer?",
        "explanationHebrew": "בשורה 1 דומיניק מציין העברה של 4,200 דולר לסינגפור.",
        "points": 10,
        "modelAnswer": "Four thousand two hundred dollars routed to an offshore account in Singapore.",
        "keywords": [
          "4,200",
          "four thousand two hundred",
          "Singapore",
          "offshore",
          "dollars"
        ]
      },
      {
        "id": "conv-l3-bank-q2",
        "number": 2,
        "turnRefIndex": 2,
        "linesHint": "Line 3",
        "type": "open",
        "prompt": "What is the transaction reference code displayed on Dominic's phone?",
        "explanationHebrew": "בשורה 3 דומיניק מקריא את קוד האסמכתא WT-90412.",
        "points": 10,
        "modelAnswer": "WT-90412.",
        "keywords": [
          "WT-90412",
          "90412"
        ]
      },
      {
        "id": "conv-l3-bank-q3",
        "number": 3,
        "turnRefIndex": 3,
        "linesHint": "Line 4",
        "type": "mcq",
        "prompt": "How long ago was the fraudulent wire initiated before Dominic contacted the bank?",
        "explanationHebrew": "בשורה 4 הסוכנת מציינת שההעברה אותחלה לפני 14 דקות.",
        "points": 10,
        "options": [
          "Fourteen minutes ago.",
          "Three hours ago.",
          "Yesterday evening.",
          "Five days ago."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-bank-q4",
        "number": 4,
        "turnRefIndex": 5,
        "linesHint": "Line 6",
        "type": "open",
        "prompt": "What specific SWIFT procedure did Agent Vanessa execute to freeze the wire in transit?",
        "explanationHebrew": "בשורה 6 הסוכנת מציינת שהפעילה בקשת SWIFT MT192.",
        "points": 10,
        "modelAnswer": "A SWIFT MT192 stop-payment recall request.",
        "keywords": [
          "SWIFT",
          "MT192",
          "stop-payment",
          "recall"
        ]
      },
      {
        "id": "conv-l3-bank-q5",
        "number": 5,
        "turnRefIndex": 7,
        "linesHint": "Line 8",
        "type": "mcq",
        "prompt": "What type of cyberattack compromised Dominic's account according to threat intelligence?",
        "explanationHebrew": "בשורה 8 הסוכנת מסבירה שמדובר בחטיפת עוגיות סשן בעקבות פישינג של קובץ PDF.",
        "points": 10,
        "options": [
          "A session-cookie hijacking attack via a spear-phishing PDF invoice.",
          "A physical theft of his office computer.",
          "An automated brute-force guessing of his 4-digit PIN.",
          "An internal security leak by bank tellers."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-bank-q6",
        "number": 6,
        "turnRefIndex": 11,
        "linesHint": "Line 12",
        "type": "open",
        "prompt": "What immediate steps does Vanessa take regarding active system credentials?",
        "explanationHebrew": "בשורה 12 הסוכנת מנתקת טוקני API, מבטלת מפתחות סשן וכופה איפוס סיסמאות.",
        "points": 10,
        "modelAnswer": "Severing active API tokens, revoking OAuth session keys, and forcing a global credential reset.",
        "keywords": [
          "API",
          "tokens",
          "OAuth",
          "revoking",
          "reset",
          "severing"
        ]
      },
      {
        "id": "conv-l3-bank-q7",
        "number": 7,
        "turnRefIndex": 15,
        "linesHint": "Line 16",
        "type": "open",
        "prompt": "How much spending limit is allocated to each virtual single-use digital card token issued to Dominic?",
        "explanationHebrew": "בשורה 16 הסוכנת מנפיקה כרטיסים דיגיטליים עם תקרה של 5,000 דולר כל אחד.",
        "points": 10,
        "modelAnswer": "Five thousand dollars each.",
        "keywords": [
          "five thousand",
          "5,000",
          "5000",
          "dollars"
        ]
      },
      {
        "id": "conv-l3-bank-q8",
        "number": 8,
        "turnRefIndex": 17,
        "linesHint": "Line 18",
        "type": "copy",
        "prompt": "Copy the sentence from Line 18 where Agent Vanessa guarantees zero financial liability.",
        "explanationHebrew": "בשורה 18 הסוכנת מבטיחה אפס אחריות כספית לפי תקנה E והקוד המסחרי.",
        "points": 10,
        "targetSentence": "Under Regulation E and Uniform Commercial Code Article 4A, your prompt notification within twenty-four hours guarantees zero liability for unauthorized transactions."
      },
      {
        "id": "conv-l3-bank-q9",
        "number": 9,
        "turnRefIndex": 19,
        "linesHint": "Line 20",
        "type": "mcq",
        "prompt": "A provisional credit has already been placed in Dominic's account balance.",
        "explanationHebrew": "נכון. בשורה 20 הסוכנת מאשרת שזיכוי זמני כבר הוזן לחשבון.",
        "points": 10,
        "options": [
          "True",
          "False"
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-bank-q10",
        "number": 10,
        "turnRefIndex": 19,
        "linesHint": "Line 20",
        "type": "open",
        "prompt": "In how many hours will the SWIFT recall be permanently finalized?",
        "explanationHebrew": "בשורה 20 הסוכנת מציינת שהתהליך ייסגר סופית תוך 48 שעות.",
        "points": 10,
        "modelAnswer": "In forty-eight hours.",
        "keywords": [
          "forty-eight",
          "48",
          "hours"
        ]
      }
    ],
    "totalPoints": 100
  },
  {
    "id": "conv-l3-pitching-project",
    "title": "Pitching an EdTech Social Venture to Venture Capitalists",
    "hebrewTitle": "הצגת מיזם טכנולוגי חינוכי בפני קרן הון סיכון",
    "category": "tech_daily",
    "categoryLabelHebrew": "הייטק והון סיכון",
    "settingDescription": "A founder pitches 'BridgeAI', an assistive cognitive learning platform for neurodivergent students, negotiating seed round valuation terms and data privacy compliance.",
    "level": "Level 3",
    "levelLabel": "רמה 3 - תקשורת מתקדמת ופתרון בעיות",
    "levelDescription": "Nuanced real-world communication, professional problem-solving, and advanced idioms.",
    "speakers": [
      {
        "id": "speaker_a",
        "name": "Aria",
        "role": "EdTech Founder & CEO",
        "avatarEmoji": "🚀",
        "genderHint": "female",
        "colorTheme": "sky"
      },
      {
        "id": "speaker_b",
        "name": "Mr. Sterling",
        "role": "Managing Partner at Horizon Ventures",
        "avatarEmoji": "📈",
        "genderHint": "male",
        "colorTheme": "amber"
      }
    ],
    "turns": [
      {
        "index": 0,
        "speakerId": "speaker_a",
        "text": "Mr. Sterling, thank you for inviting BridgeAI to Horizon Ventures. Today, one in six K-12 students experiences dyslexia, ADHD, or sensory processing divergence, yet classroom accommodations remain tragically analog."
      },
      {
        "index": 1,
        "speakerId": "speaker_b",
        "text": "We recognize the immense moral imperative, Aria, but EdTech is littered with noble concepts that collapsed under glacial district procurement sales cycles."
      },
      {
        "index": 2,
        "speakerId": "speaker_a",
        "text": "Precisely why our go-to-market architecture intentionally avoids top-down superintendent bureaucracy through a high-velocity bottom-up teacher adoption model."
      },
      {
        "index": 3,
        "speakerId": "speaker_b",
        "text": "Walk me through the metrics of that funnel. How does a single classroom teacher convert into a paid institutional district license?"
      },
      {
        "index": 4,
        "speakerId": "speaker_a",
        "text": "Individual educators access our core adaptive reader for free. Once three teachers in a single school enroll twenty students each, school principals automatically receive an administrative dashboard trial."
      },
      {
        "index": 5,
        "speakerId": "speaker_b",
        "text": "What has been your verified viral coefficient and organic customer acquisition cost (CAC) across your initial pilot schools?"
      },
      {
        "index": 6,
        "speakerId": "speaker_a",
        "text": "Our blended customer acquisition cost is just forty-two dollars per school, and our organic K-factor is 1.64, driven primarily by special education teacher community networks."
      },
      {
        "index": 7,
        "speakerId": "speaker_b",
        "text": "Those unit economics are undeniably compelling. What about annual recurring revenue (ARR) and contract renewal retention?"
      },
      {
        "index": 8,
        "speakerId": "speaker_a",
        "text": "We currently stand at 680,000 dollars in ARR across forty-six charter school networks, with a net revenue retention rate of 128 percent year-over-year."
      },
      {
        "index": 9,
        "speakerId": "speaker_b",
        "text": "Where we see significant venture risk is in student data governance. How does your AI model guarantee compliance with FERPA and COPPA privacy mandates?"
      },
      {
        "index": 10,
        "speakerId": "speaker_a",
        "text": "We utilize localized on-device inferencing for speech and reading telemetry; zero identifiable student voice recordings or reading timestamps ever leave the local tablet enclave."
      },
      {
        "index": 11,
        "speakerId": "speaker_b",
        "text": "Zero cloud telemetry for biometric inputs? That eliminates substantial federal regulatory exposure. Have you secured third-party SOC-2 Type II certification?"
      },
      {
        "index": 12,
        "speakerId": "speaker_a",
        "text": "Completed and audited last month by Deloitte; our comprehensive compliance binder is accessible in our virtual data room."
      },
      {
        "index": 13,
        "speakerId": "speaker_b",
        "text": "Let us discuss the capital raise. Your deck specifies an ask of 2.5 million dollars on a convertible promissory note."
      },
      {
        "index": 14,
        "speakerId": "speaker_a",
        "text": "Correct: a 2.5 million dollar seed round structured as a post-money SAFE with a twelve-million-dollar valuation cap and a twenty percent discount rate."
      },
      {
        "index": 15,
        "speakerId": "speaker_b",
        "text": "Given prevailing market headwinds and multiple contractions in SaaS multiples, a twelve-million cap is somewhat aggressive for your stage."
      },
      {
        "index": 16,
        "speakerId": "speaker_a",
        "text": "Respectfully, Mr. Sterling, our triple-digit net retention, defensible on-device IP patents, and eighty-four percent gross margins justify that premium valuation."
      },
      {
        "index": 17,
        "speakerId": "speaker_b",
        "text": "If Horizon Ventures leads the round with a 1.5 million dollar commitment, would you consider a ten-million-dollar cap with a board observer seat?"
      },
      {
        "index": 18,
        "speakerId": "speaker_a",
        "text": "We value your strategic network across public school endowments immensely; we would accept an 11 million dollar valuation cap paired with a board seat."
      },
      {
        "index": 19,
        "speakerId": "speaker_b",
        "text": "You drive a hard but principled bargain, Aria. I am prepared to recommend that term sheet to our investment committee on Monday."
      },
      {
        "index": 20,
        "speakerId": "speaker_a",
        "text": "Thank you, Mr. Sterling; partnering with Horizon Ventures will enable us to empower over one hundred thousand neurodivergent children by next autumn."
      },
      {
        "index": 21,
        "speakerId": "speaker_b",
        "text": "That is the kind of transformative impact capital is meant to scale. Let us make it a reality."
      }
    ],
    "usefulPhrases": [
      {
        "phrase": "on-device localized inferencing",
        "translation": "הסקת בינה מלאכותית מקומית על גבי המכשיר ללא שליחת מידע לענן"
      },
      {
        "phrase": "net revenue retention (NRR)",
        "translation": "שיעור שימור הכנסות נטו (מדד צמיחה בקרב לקוחות קיימים)"
      },
      {
        "phrase": "post-money SAFE valuation cap",
        "translation": "תקרת שווי בהסכם השקעה עתידי מסוג SAFE שלאחר-כסף"
      },
      {
        "phrase": "FERPA and COPPA student compliance",
        "translation": "עמידה בחוקי הפרטיות והגנת המידע של תלמידים וקטינים בארה'ב"
      },
      {
        "phrase": "board observer seat",
        "translation": "מושב משקיף בוועד המנהל / דירקטוריון ללא זכות הצבעה"
      }
    ],
    "questions": [
      {
        "id": "conv-l3-pitch-q1",
        "number": 1,
        "turnRefIndex": 0,
        "linesHint": "Line 1",
        "type": "open",
        "prompt": "What proportion of K-12 students experiences dyslexia, ADHD, or sensory divergence according to Aria?",
        "explanationHebrew": "בשורה 1 אריה מציינת שאחד מכל שישה תלמידים מתמודד עם שונות נוירולוגית.",
        "points": 10,
        "modelAnswer": "One in six students.",
        "keywords": [
          "one in six",
          "1 in 6",
          "1/6",
          "one in 6"
        ]
      },
      {
        "id": "conv-l3-pitch-q2",
        "number": 2,
        "turnRefIndex": 2,
        "linesHint": "Line 3",
        "type": "mcq",
        "prompt": "How does BridgeAI bypass traditional slow school district procurement bureaucracy?",
        "explanationHebrew": "בשורה 3 אריה מסבירה שהחדירה מבוססת על אימוץ מלמטה-למעלה על ידי מורים.",
        "points": 10,
        "options": [
          "Through a high-velocity bottom-up teacher adoption model.",
          "By lobbying state governors for mandatory legislation.",
          "By giving away hardware computers for free.",
          "By selling only to international private boarding schools."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-pitch-q3",
        "number": 3,
        "turnRefIndex": 6,
        "linesHint": "Line 7",
        "type": "open",
        "prompt": "What is the blended customer acquisition cost (CAC) per school achieved in the pilot?",
        "explanationHebrew": "בשורה 7 אריה מציינת עלות רכישה של 42 דולר בלבד לבית ספר.",
        "points": 10,
        "modelAnswer": "Forty-two dollars per school.",
        "keywords": [
          "forty-two",
          "42",
          "dollars",
          "$42"
        ]
      },
      {
        "id": "conv-l3-pitch-q4",
        "number": 4,
        "turnRefIndex": 8,
        "linesHint": "Line 9",
        "type": "open",
        "prompt": "What is BridgeAI's current annual recurring revenue (ARR) and net revenue retention rate?",
        "explanationHebrew": "בשורה 9 אריה מפרטת 680 אלף דולר ב-ARR ו-128% שימור הכנסות נטו.",
        "points": 10,
        "modelAnswer": "680,000 dollars in ARR and 128 percent net revenue retention.",
        "keywords": [
          "680,000",
          "680k",
          "128%",
          "128 percent"
        ]
      },
      {
        "id": "conv-l3-pitch-q5",
        "number": 5,
        "turnRefIndex": 10,
        "linesHint": "Line 11",
        "type": "mcq",
        "prompt": "How does BridgeAI protect student privacy and comply with FERPA and COPPA?",
        "explanationHebrew": "בשורה 11 אריה מסבירה שעיבוד ה-AI מבוצע מקומית על המכשיר ושום מידע אינו נשלח לענן.",
        "points": 10,
        "options": [
          "By utilizing localized on-device inferencing so no biometric or voice data leaves the tablet.",
          "By storing all student recordings in an unencrypted public cloud.",
          "By requiring parents to waive their privacy rights legally.",
          "By selling anonymized student data to advertising networks."
        ],
        "correctIndex": 0
      },
      {
        "id": "conv-l3-pitch-q6",
        "number": 6,
        "turnRefIndex": 12,
        "linesHint": "Line 13",
        "type": "open",
        "prompt": "Which audit firm completed BridgeAI's SOC-2 Type II certification last month?",
        "explanationHebrew": "בשורה 13 אריה מציינת שחברת דלויט השלימה את ביקורת ה-SOC-2.",
        "points": 10,
        "modelAnswer": "Deloitte.",
        "keywords": [
          "Deloitte"
        ]
      },
      {
        "id": "conv-l3-pitch-q7",
        "number": 7,
        "turnRefIndex": 14,
        "linesHint": "Line 15",
        "type": "open",
        "prompt": "What total funding amount and seed structure is Aria seeking in Line 15?",
        "explanationHebrew": "בשורה 15 אריה מבקשת גיוס של 2.5 מיליון דולר בשטר SAFE שלאחר-כסף.",
        "points": 10,
        "modelAnswer": "2.5 million dollars structured as a post-money SAFE.",
        "keywords": [
          "2.5",
          "million",
          "SAFE",
          "post-money"
        ]
      },
      {
        "id": "conv-l3-pitch-q8",
        "number": 8,
        "turnRefIndex": 16,
        "linesHint": "Line 17",
        "type": "copy",
        "prompt": "Copy the sentence from Line 17 where Aria justifies the premium valuation cap.",
        "explanationHebrew": "בשורה 17 אריה מגנה על שווי החברה באמצעות שיעור שימור, פטנטים ושולי רווח של 84%.",
        "points": 10,
        "targetSentence": "Respectfully, Mr. Sterling, our triple-digit net retention, defensible on-device IP patents, and eighty-four percent gross margins justify that premium valuation."
      },
      {
        "id": "conv-l3-pitch-q9",
        "number": 9,
        "turnRefIndex": 18,
        "linesHint": "Line 19",
        "type": "open",
        "prompt": "What compromise valuation cap does Aria propose to secure Horizon Ventures' investment?",
        "explanationHebrew": "בשורה 19 אריה מציעה פשרה של 11 מיליון דולר תקרת שווי ומושב בדירקטוריון.",
        "points": 10,
        "modelAnswer": "An eleven-million-dollar valuation cap paired with a board seat.",
        "keywords": [
          "11",
          "eleven",
          "million",
          "valuation",
          "cap"
        ]
      },
      {
        "id": "conv-l3-pitch-q10",
        "number": 10,
        "turnRefIndex": 19,
        "linesHint": "Line 20",
        "type": "mcq",
        "prompt": "Mr. Sterling agrees to recommend the 11-million-dollar term sheet to the investment committee on Monday.",
        "explanationHebrew": "נכון. בשורה 20 מר סטרלינג מסכים להמליץ על מסמך העקרונות ביום שני.",
        "points": 10,
        "options": [
          "True",
          "False"
        ],
        "correctIndex": 0
      }
    ],
    "totalPoints": 100
  }
];
