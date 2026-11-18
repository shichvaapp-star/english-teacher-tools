import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: NOUNS: Pronouns (subject / object, referring to previously mentioned), Reflexive pronouns.

export const pronounsTopic: GrammarTopic = {
  id: "pronouns",
  group: "nouns",
  title: "Pronouns (I / me / myself)",
  titleHe: "כינויי גוף – I, me, myself",
  bandRefs: ["NOUNS: Pronouns", "NOUNS: Reflexive pronouns"],
  grades: { 7: "accurate", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "לפני הפועל: I, you, he, she, it, we, they", en: "Before the verb: I, you, he, she, it, we, they", examples: ["**She** likes music.", "**We** are friends."] },
        { he: "אחרי הפועל או מילת יחס: me, you, him, her, it, us, them", en: "After a verb or preposition: me, you, him, her, it, us, them", examples: ["Call **me**.", "I like **her**.", "Come with **us**."] },
        { he: "it – לדבר אחד, they / them – לרבים", en: "it – one thing; they / them – plural", examples: ["The book? I read **it**.", "The cookies? I ate **them**."] },
        { he: "במקום לחזור על השם", en: "Instead of repeating the noun", examples: ["Dan is my friend. **He** is funny."] },
      ],
      form: [
        { kind: "affirmative", pattern: "subject pronoun + verb", example: "They play football." },
        { kind: "affirmative", pattern: "verb / preposition + object pronoun", example: "Give it to him." },
      ],
      timeWords: ["I / me", "he / him", "she / her", "we / us", "they / them"],
    },
    2: {
      points: [
        { he: "myself – בעצמי (הנושא והמושא אותו אדם)", en: "myself – the same person as the subject", examples: ["I hurt **myself**.", "She looked at **herself**."] },
        { he: "צורות ה-self של כל כינוי", en: "Reflexive pronouns", examples: ["myself", "yourself", "himself", "herself", "ourselves", "themselves"], chips: true },
        { he: "by myself = לבד", en: "by myself = alone", examples: ["I did it **by myself**."] },
        { he: "my friend and I (נושא), my friend and me (מושא)", en: "my friend and I (subject) / my friend and me (object)", examples: ["**My friend and I** went.", "She called **my friend and me**."] },
      ],
      form: [
        { kind: "affirmative", pattern: "subject + verb + -self / -selves (same person)", example: "We enjoyed ourselves." },
        { kind: "affirmative", pattern: "by + myself / yourself … = alone", example: "He lives by himself." },
      ],
      timeWords: ["myself", "yourself", "ourselves", "by myself", "each other"],
    },
    3: {
      points: [
        { he: "each other = זה את זה", en: "each other = one another", examples: ["They love **each other**.", "✗ They love themselves. (different meaning)"] },
        { he: "הדגשה: I did it myself", en: "Emphasis: I did it myself", examples: ["The president **himself** came."] },
        { he: "one / ones במקום לחזור על שם עצם", en: "one / ones instead of repeating a noun", examples: ["I don't want this shirt. I want the blue **one**."] },
        { he: "it למזג אוויר, שעה ומרחק", en: "it for weather, time, distance", examples: ["**It**'s raining.", "**It**'s 5 o'clock.", "**It**'s far."] },
      ],
      form: [
        { kind: "affirmative", pattern: "subject + verb + each other", example: "We help each other." },
        { kind: "affirmative", pattern: "the + adjective + one / ones", example: "the red ones" },
      ],
      timeWords: ["each other", "one another", "one", "ones", "it"],
    },
  },
  traps: [
    { id: "pr-subject-object", wrong: "Me and Dan went to the park.", right: "Dan and I went to the park.", whyHe: "לפני הפועל (נושא) → I.", whyEn: "Subject → I." },
    { id: "pr-object", wrong: "Can you help I?", right: "Can you help me?", whyHe: "אחרי הפועל → me.", whyEn: "After a verb → me." },
    { id: "pr-it-missing", wrong: "Is raining.", right: "It's raining.", whyHe: "באנגלית חייבים נושא – It.", whyEn: "English needs a subject: It." },
    { id: "pr-self", wrong: "He hurt him while cooking.", right: "He hurt himself while cooking.", whyHe: "אותו אדם → himself.", whyEn: "Same person → himself." },
    { id: "pr-theirselves", wrong: "They did it theirselves.", right: "They did it themselves.", whyHe: "themselves (לא theirselves).", whyEn: "themselves." },
  ],
};

const T = "pronouns";
const S = ["subject (I, he, she …)", "object (me, him, her …)"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "pr", 1, 7);
g7a.mcq("Dan is my friend. ___ plays in the band.", ["He", "Him", "His"], "לפני הפועל, Dan = he.", "Subject → He.");
g7a.mcq("Noa is nice. I like ___.", ["her", "she", "hers"], "אחרי הפועל → her.", "After a verb → her.", { trap: "pr-object" });
g7a.mcq("Can you help ___ with my homework?", ["me", "I", "my"], "אחרי help → me.", "After help → me.", { trap: "pr-object" });
g7a.mcq("The lemons? I put ___ in the bowl.", ["them", "they", "it"], "the lemons = רבים, אחרי הפועל → them.", "Plural object → them.");
g7a.mcq("My sister and ___ went to the river.", ["I", "me", "my"], "לפני הפועל (נושא) → I.", "Subject → I.", { trap: "pr-subject-object" });
g7a.bank("The guide showed ___ the bridge.", ["us", "we", "our"], "אחרי הפועל → us.", "After a verb → us.");
g7a.bank("This is my bike. I love ___.", ["it", "him", "they"], "the bike = דבר אחד → it.", "One thing → it.", { allow: ["bike"] });
g7a.bank("Where are my parents? I can't see ___.", ["them", "they", "their"], "אחרי הפועל, רבים → them.", "Plural object → them.");
g7a.order("She called me after school.", "she (נושא) + called + me (מושא).", "she + called + me.");
g7a.order("We helped them with the meal.", "we (נושא) … them (מושא).", "we … them.");
g7a.sort(S, [["I", "subject (I, he, she …)"], ["me", "object (me, him, her …)"], ["she", "subject (I, he, she …)"], ["him", "object (me, him, her …)"], ["they", "subject (I, he, she …)"], ["us", "object (me, him, her …)"]], "לפני הפועל: I / she / they. אחרי: me / him / us.", "Subject before the verb; object after.");
g7a.match([["I", "me"], ["he", "him"], ["she", "her"], ["they", "them"]], "כל כינוי נושא והמושא שלו.", "Subject pronoun → object pronoun.", { instr: "התאימו כל כינוי לצורת המושא שלו" });

const g7b = itemSet(T, "pr", 2, 7);
g7b.type("I cut ___ when I fell.", "I", "myself", "אותו אדם → myself.", "Same person → myself.", { trap: "pr-self", allow: ["fell"] });
g7b.type("She made the meal by ___.", "she", "herself", "by herself = לבד.", "by herself = alone.");
g7b.type("We enjoyed ___ at the theater.", "we", "ourselves", "המבנה: enjoy + -selves: ourselves.", "enjoy ourselves.");
g7b.type("___ is cold today.", "it", "It", "מזג אוויר → It.", "Weather → It.", { trap: "pr-it-missing" });
g7b.mcq("My friend and ___ joined the club.", ["I", "me", "myself"], "נושא → I.", "Subject → I.", { trap: "pr-subject-object" });
g7b.fix("Can you give the list to *I?", ["me"], "אחרי to → me.", "After to → me.", { trap: "pr-object" });
g7b.fix("*Him is my best friend.", ["He"], "לפני הפועל → He.", "Subject → He.");
g7b.fix("The kids painted the room *theirselves.", ["themselves"], "themselves (לא theirselves).", "themselves.", { trap: "pr-theirselves", allow: ["theirselves", "theirselves"] });
g7b.transform("Dan helped Maya.", "Use pronouns for both names.", "השתמשו בכינויים במקום שני השמות", ["He helped her."], "Dan, ולכן He, Maya → her.", "He helped her.");
g7b.transform("My brother and I like the team.", "Replace 'the team' with a pronoun.", "החליפו את the team בכינוי", ["My brother and I like it.", "My brother and I like them."], "the team, ולכן it.", "the team → it.");
g7b.order("I did my homework by myself.", "by myself = לבד.", "by myself = alone.");
g7b.cloze("My best friend", "Omer is my best friend. {1} lives near {2}. Every day we walk to school together. Sometimes his mom drives {3}. On weekends {4} play football. I always enjoy {5}!", [["he", "He"], ["I", "me"], ["we", "us"], ["we", "we"], ["I", "myself"]], "He (נושא), me / us (מושא), we (נושא), myself (אותו אדם).", "He / me / us / we / myself.");

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "pr", 1, 8);
g8a.mcq("The chef is famous. ___ cooks traditional food.", ["She", "Her", "Hers"], "לפני הפועל → She.", "Subject → She.", { allow: ["chef", "famous"] });
g8a.mcq("I met the actor and took a photo with ___.", ["him", "he", "his"], "אחרי with → him.", "After with → him.", { trap: "pr-object" });
g8a.mcq("Can you drive ___ to the airport?", ["us", "we", "our"], "אחרי drive → us.", "After drive → us.", { trap: "pr-object" });
g8a.mcq("The tickets? I bought ___ online.", ["them", "they", "it"], "the tickets = רבים → them.", "Plural object → them.");
g8a.mcq("My cousin and ___ traveled abroad.", ["I", "me", "my"], "לפני הפועל (נושא) → I.", "Subject → I.", { trap: "pr-subject-object", allow: ["cousin"] });
g8a.bank("The director chose ___ for the role.", ["me", "I", "my"], "אחרי chose → me.", "After chose → me.");
g8a.bank("This is my camera. I love ___.", ["it", "him", "they"], "the camera = דבר → it.", "One thing → it.");
g8a.bank("The actors were great. Everyone loved ___.", ["them", "they", "their"], "אחרי loved, רבים → them.", "Plural object → them.");
g8a.order("He sent us a message from the airport.", "he (נושא) … us (מושא).", "he … us.");
g8a.order("They invited me to the concert.", "they (נושא) … me (מושא).", "they … me.", { allow: ["invited"] });
g8a.sort(S, [["we", "subject (I, he, she …)"], ["them", "object (me, him, her …)"], ["he", "subject (I, he, she …)"], ["her", "object (me, him, her …)"], ["I", "subject (I, he, she …)"], ["me", "object (me, him, her …)"]], "לפני הפועל: we / he / I. אחרי: them / her / me.", "Subject before the verb; object after.");
g8a.match([["we", "us"], ["it", "it"], ["you", "you"], ["he", "him"]], "כל כינוי נושא והמושא שלו.", "Subject pronoun → object pronoun.", { instr: "התאימו כל כינוי לצורת המושא שלו" });

const g8b = itemSet(T, "pr", 2, 8);
g8b.type("He cut ___ while he was cooking.", "he", "himself", "אותו אדם → himself.", "Same person → himself.", { trap: "pr-self" });
g8b.type("She decorated the cake by ___.", "she", "herself", "by herself = לבד.", "by herself = alone.");
g8b.type("Did you two enjoy ___ at the concert?", "you", "yourselves", "you (רבים) → yourselves.", "you (plural) → yourselves.");
g8b.type("___ is a long way to the airport.", "it", "It", "מרחק → It.", "Distance → It.", { trap: "pr-it-missing" });
g8b.mcq("My sister and ___ cooked dinner.", ["I", "me", "myself"], "נושא → I.", "Subject → I.", { trap: "pr-subject-object" });
g8b.fix("Can you send the photos to *we?", ["us"], "אחרי to → us.", "After to → us.", { trap: "pr-object" });
g8b.fix("*Them are my favorite actors.", ["They"], "לפני הפועל → They.", "Subject → They.", { allow: ["favorite"] });
g8b.fix("The kids made the decorations *theirselves.", ["themselves"], "themselves (לא theirselves).", "themselves.", { trap: "pr-theirselves", allow: ["theirselves", "decorations"] });
g8b.transform("Maya called her uncle.", "Use pronouns for both people.", "השתמשו בכינויים במקום שני האנשים", ["She called him."], "Maya, ולכן She, her uncle → him.", "She called him.");
g8b.transform("We love the concert.", "Replace 'the concert' with a pronoun.", "החליפו את the concert בכינוי", ["We love it."], "the concert, ולכן it.", "the concert → it.");
g8b.order("She learned to cook by herself.", "by herself = לבד.", "by herself = alone.");
g8b.cloze("A surprise party", "My friends planned a party for {1}. {2} decorated the room, and my sister baked a cake {3}. When I came in, everyone shouted \"Surprise!\" I thanked {4} and we enjoyed {5} all night.", [["I", "me"], ["they", "They"], ["she", "herself"], ["they", "them"], ["we", "ourselves"]], "me / them (מושא), They (נושא), herself / ourselves (אותו אדם).", "me / They / herself / them / ourselves.", { allow: ["planned", "baked", "shouted", "thanked"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "pr", 1, 9);
g9a.mcq("The architect is from Haifa. ___ designed the tower.", ["She", "Her", "Hers"], "לפני הפועל → She.", "Subject → She.");
g9a.mcq("I interviewed the firefighter and thanked ___.", ["him", "he", "his"], "אחרי thanked → him.", "After thanked → him.", { trap: "pr-object", allow: ["thanked"] });
g9a.mcq("Can you lend ___ your ladder?", ["us", "we", "our"], "אחרי lend → us.", "After lend → us.", { trap: "pr-object" });
g9a.mcq("The selfies? I posted ___ online.", ["them", "they", "it"], "the selfies = רבים → them.", "Plural object → them.");
g9a.mcq("My colleague and ___ went to the gallery.", ["I", "me", "my"], "לפני הפועל (נושא) → I.", "Subject → I.", { trap: "pr-subject-object" });
g9a.bank("The neighbors invited ___ to the wedding.", ["us", "we", "our"], "אחרי invited → us.", "After invited → us.", { allow: ["invited"] });
g9a.bank("This is my new novel. I love ___.", ["it", "him", "they"], "the novel = דבר → it.", "One thing → it.");
g9a.bank("The dolphins were amazing. We watched ___ for an hour.", ["them", "they", "their"], "אחרי watched, רבים → them.", "Plural object → them.");
g9a.order("She translated the article for me.", "she (נושא) … me (מושא).", "she … me.");
g9a.order("They repaired the oven for us.", "they (נושא) … us (מושא).", "they … us.");
g9a.sort(S, [["they", "subject (I, he, she …)"], ["him", "object (me, him, her …)"], ["she", "subject (I, he, she …)"], ["us", "object (me, him, her …)"], ["we", "subject (I, he, she …)"], ["them", "object (me, him, her …)"]], "לפני הפועל: they / she / we. אחרי: him / us / them.", "Subject before the verb; object after.");
g9a.match([["I", "myself"], ["she", "herself"], ["we", "ourselves"], ["they", "themselves"]], "כל כינוי וה-self שלו.", "Each pronoun and its reflexive.", { instr: "התאימו כל כינוי לצורה עם self" });

const g9b = itemSet(T, "pr", 2, 9);
g9b.type("The firefighter burned ___ on the hot ladder.", "he", "himself", "אותו אדם → himself.", "Same person → himself.", { trap: "pr-self", allow: ["burned"] });
g9b.type("My grandmother sews all her clothes by ___.", "she", "herself", "by herself = לבד.", "by herself = alone.");
g9b.type("We repaired the oven ___.", "we", "ourselves", "בעצמנו → ourselves.", "By us → ourselves.");
g9b.type("___ is ten o'clock. The gallery is open.", "it", "It", "שעה → It.", "Time → It.", { trap: "pr-it-missing" });
g9b.mcq("My neighbor and ___ complained about the noise.", ["I", "me", "myself"], "נושא → I.", "Subject → I.", { trap: "pr-subject-object" });
g9b.fix("Can you send the article to *they?", ["them"], "אחרי to → them.", "After to → them.", { trap: "pr-object" });
g9b.fix("*Us are going to the marathon.", ["We"], "לפני הפועל → We.", "Subject → We.");
g9b.fix("The neighbors painted the building *theirselves.", ["themselves"], "themselves (לא theirselves).", "themselves.", { trap: "pr-theirselves", allow: ["theirselves", "building"] });
g9b.transform("The architect showed the reporters the tower.", "Use pronouns for the people.", "השתמשו בכינויים במקום האנשים", ["She showed them the tower.", "He showed them the tower."], "The architect, ולכן She / He, the reporters → them.", "She showed them the tower.", { allow: ["reporters"] });
g9b.transform("I borrowed the novel.", "Replace 'the novel' with a pronoun.", "החליפו את the novel בכינוי", ["I borrowed it."], "the novel, ולכן it.", "the novel → it.");
g9b.order("She translated the whole novel by herself.", "by herself = לבד.", "by herself = alone.", { allow: ["whole"] });
g9b.cloze("Moving out", "My brother is moving to a new apartment. {1} found it {2}. My parents helped {3} carry the furniture. My sister and {4} painted the walls. We were proud of {5}!", [["he", "He"], ["he", "himself"], ["he", "him"], ["I", "I"], ["we", "ourselves"]], "He / I (נושא), him (מושא), himself / ourselves (אותו אדם).", "He / himself / him / I / ourselves.", { allow: ["walls", "proud"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "pr", 3);
l3.mcq("Dan and Maya love ___. They're getting married.", ["each other", "themselves", "them"], "זה את זה → each other.", "One another → each other.", { allow: ["married"] });
l3.mcq("I don't want the red shirt. I want the blue ___.", ["one", "ones", "it"], "במקום shirt אחד → one.", "Instead of one shirt → one.", { allow: ["shirt", "red"] });
l3.type("These shoes are old. I need new ___.", "one", "ones", "במקום shoes (רבים) → ones.", "Instead of plural shoes → ones.", { allow: ["shoes"] });
l3.type("The president ___ came to the opening.", "he", "himself", "הדגשה → himself.", "Emphasis → himself.", { allow: ["president", "opening"] });
l3.fix("*Is raining, so take an umbrella.", ["It's"], "באנגלית חייבים נושא → It's raining.", "English needs a subject → It's.", { trap: "pr-it-missing", allow: ["umbrella", "raining"] });
l3.fix("The two teams congratulated *themselves after the game.", ["each other"], "קבוצה אחת את השנייה → each other.", "One another → each other.", { allow: ["congratulated"] });
l3.fix("Between you and *I, I don't like it.", ["me"], "אחרי between → me.", "After between → me.", { trap: "pr-object" });
l3.transform("Me and my friend went shopping.", "Correct the sentence.", "תקנו את המשפט", ["My friend and I went shopping."], "נושא → my friend and I.", "Subject → My friend and I.", { trap: "pr-subject-object" });
l3.transform("I did my hair. Nobody helped me.", "Say it in one sentence with 'by myself'.", "אמרו את זה במשפט אחד עם by myself", ["I did my hair by myself."], "by myself = לבד.", "by myself = alone.", { allow: ["hair"] });
l3.sort(["✓ Correct", "✗ Wrong"], [["They love each other.", "✓ Correct"], ["Me and Dan went home.", "✗ Wrong"], ["It's very hot today.", "✓ Correct"], ["Is very hot today.", "✗ Wrong"], ["She made it herself.", "✓ Correct"], ["They did it theirselves.", "✗ Wrong"]], "התיקונים: Dan and I · It's very hot · themselves.", "Fixes: Dan and I · It's very hot · themselves.");
l3.cloze("Two friends", "Tal and Ido have known {1} since kindergarten. {2} is amazing how close they are. When Ido broke his leg, Tal visited {3} every day. Ido says Tal is the best friend, and he wants a friend like that for {4} too!", [["each other / themselves", "each other"], ["it", "It"], ["he / him", "him"], ["he / him", "himself"]], "שימו לב: each other / It / him / himself.", "each other / It / him / himself.", { allow: ["kindergarten", "close", "leg", "tal", "ido"] });
l3.write("Write about you and a friend: what you do together, something you did by yourselves, and how you help each other.", "כתבו עליכם ועל חבר: מה אתם עושים יחד, משהו שעשיתם בעצמכם, ואיך אתם עוזרים זה לזה.", "My friend and I play basketball every Friday. Last week we cooked dinner by ourselves. We always help each other with homework, and she calls me every evening.", "שימו לב: I / me, ourselves, each other.", "I / me / ourselves / each other.");

export const pronounsItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
