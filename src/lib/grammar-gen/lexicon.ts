// Word tables for the grammar question generators.
// Every word here must pass the vocabulary rule for grade 7 levels 1–2
// (Band I + the grade 7 list + function words + names) – `npm run check:grammar`
// samples the generators and fails on any word outside it.

export type Pron = "I" | "you" | "he" | "she" | "we" | "they";

export interface Subject {
  text: string;
  pron: Pron;
}

export const PRONOUN_SUBJECTS: Subject[] = [
  { text: "I", pron: "I" },
  { text: "you", pron: "you" },
  { text: "he", pron: "he" },
  { text: "she", pron: "she" },
  { text: "we", pron: "we" },
  { text: "they", pron: "they" },
];

export const NOUN_SUBJECTS: Subject[] = [
  { text: "Dan", pron: "he" },
  { text: "Tom", pron: "he" },
  { text: "Omer", pron: "he" },
  { text: "Yoni", pron: "he" },
  { text: "Ben", pron: "he" },
  { text: "Noa", pron: "she" },
  { text: "Maya", pron: "she" },
  { text: "Shira", pron: "she" },
  { text: "Yael", pron: "she" },
  { text: "Dana", pron: "she" },
  { text: "my brother", pron: "he" },
  { text: "my sister", pron: "she" },
  { text: "my cousin", pron: "he" },
  { text: "my friends", pron: "they" },
  { text: "my parents", pron: "they" },
  { text: "the kids", pron: "they" },
  { text: "Dan and Noa", pron: "they" },
  { text: "Maya and I", pron: "we" },
];

export const OBJECT_PRONOUN: Record<Pron, string> = {
  I: "me",
  you: "you",
  he: "him",
  she: "her",
  we: "us",
  they: "them",
};

export const POSSESSIVE_ADJ: Record<Pron, string> = {
  I: "my",
  you: "your",
  he: "his",
  she: "her",
  we: "our",
  they: "their",
};

export const POSSESSIVE_PRON: Record<Pron, string> = {
  I: "mine",
  you: "yours",
  he: "his",
  she: "hers",
  we: "ours",
  they: "theirs",
};

export interface Verb {
  base: string;
  past?: string; // irregular past
  pp?: string; // irregular past participle
  /** Object / place phrases that make sense after the verb. */
  rest: string[];
  /** State verbs (like, know…) – no progressive forms. */
  stative?: boolean;
}

export const VERBS: Verb[] = [
  { base: "play", rest: ["football", "basketball", "tennis", "the guitar", "computer games", "chess"] },
  { base: "watch", rest: ["TV", "a movie", "the news", "a football game"] },
  { base: "eat", past: "ate", pp: "eaten", rest: ["lunch", "breakfast", "pizza", "a sandwich", "dinner"] },
  { base: "drink", past: "drank", pp: "drunk", rest: ["tea", "water", "orange juice", "milk"] },
  { base: "go", past: "went", pp: "gone", rest: ["to school", "to the park", "to the beach", "home", "to the library"] },
  { base: "visit", rest: ["my grandparents", "the museum", "our friends", "the zoo"] },
  { base: "clean", rest: ["the kitchen", "my room", "the car", "the house"] },
  { base: "cook", rest: ["dinner", "pasta", "rice", "soup"] },
  { base: "read", past: "read", pp: "read", rest: ["a book", "the newspaper", "a story", "comics"] },
  { base: "write", past: "wrote", pp: "written", rest: ["a letter", "an email", "a story", "a song"] },
  { base: "listen", rest: ["to music", "to the radio", "to the teacher"] },
  { base: "study", rest: ["English", "math", "for the test", "history"] },
  { base: "help", rest: ["my mom", "my dad", "the teacher", "our neighbors"] },
  { base: "buy", past: "bought", pp: "bought", rest: ["bread", "a new phone", "some milk", "new shoes"] },
  { base: "make", past: "made", pp: "made", rest: ["a cake", "breakfast", "sandwiches", "a salad"] },
  { base: "ride", past: "rode", pp: "ridden", rest: ["a bike", "a horse"] },
  { base: "swim", past: "swam", pp: "swum", rest: ["in the pool", "in the sea"] },
  { base: "run", past: "ran", pp: "run", rest: ["in the park", "to school"] },
  { base: "walk", rest: ["to school", "in the park", "the dog"] },
  { base: "take", past: "took", pp: "taken", rest: ["the bus", "photos", "a taxi"] },
  { base: "call", rest: ["my friend", "my grandma", "the doctor"] },
  { base: "wash", rest: ["the dishes", "the car", "the windows"] },
  { base: "open", rest: ["the window", "the door", "the box"] },
  { base: "draw", past: "drew", pp: "drawn", rest: ["a picture", "a map", "a cat"] },
  { base: "sing", past: "sang", pp: "sung", rest: ["a song", "in the car"] },
  { base: "dance", rest: ["at parties", "with my sister"] },
  { base: "work", rest: ["in the garden", "at home", "in a café"] },
  { base: "learn", rest: ["new words", "English", "to cook"] },
  { base: "finish", rest: ["my homework", "work early", "the project"] },
  { base: "paint", rest: ["the fence", "a picture", "my room"] },
  { base: "fix", rest: ["the bike", "the computer", "the door"] },
  { base: "send", past: "sent", pp: "sent", rest: ["an email", "a message", "a letter"] },
  { base: "meet", past: "met", pp: "met", rest: ["my friends", "our cousins", "the new teacher"] },
  { base: "like", rest: ["pizza", "music", "dogs", "ice cream"], stative: true },
  { base: "know", past: "knew", pp: "known", rest: ["the answer", "the way", "her name"], stative: true },
  { base: "want", rest: ["a new bike", "ice cream", "a dog"], stative: true },
  { base: "love", rest: ["chocolate", "music", "the sea"], stative: true },
  { base: "need", rest: ["help", "a new bag", "more time"], stative: true },
];

/** Verbs that can take the progressive (-ing) forms. */
export const ACTION_VERBS = VERBS.filter((v) => !v.stative);

// ── Spelling rules ─────────────────────────────────────────────

const DOUBLE = new Set(["run", "swim", "stop", "get", "shop", "put", "cut", "plan", "begin", "chat", "jog", "sit", "drop", "win"]);

export function third(v: string): string {
  if (v === "have") return "has";
  if (v === "go" || v === "do") return `${v}es`;
  if (/(s|x|z|ch|sh|o)$/.test(v)) return `${v}es`;
  if (/[^aeiou]y$/.test(v)) return `${v.slice(0, -1)}ies`;
  return `${v}s`;
}

export function ing(v: string): string {
  if (v.endsWith("ie")) return `${v.slice(0, -2)}ying`;
  if (DOUBLE.has(v)) return `${v}${v.at(-1)}ing`;
  if (/[^aeiouy]e$/.test(v) && v !== "be") return `${v.slice(0, -1)}ing`;
  return `${v}ing`;
}

export function regularPast(v: string): string {
  if (DOUBLE.has(v)) return `${v}${v.at(-1)}ed`;
  if (v.endsWith("e")) return `${v}d`;
  if (/[^aeiou]y$/.test(v)) return `${v.slice(0, -1)}ied`;
  return `${v}ed`;
}

export const pastOf = (v: Verb) => v.past ?? regularPast(v.base);
export const ppOf = (v: Verb) => v.pp ?? v.past ?? regularPast(v.base);
export const isIrregular = (v: Verb) => v.past !== undefined;

/** The wrong "-ed" form learners make for irregular verbs (goed, buyed). */
export const wrongRegularPast = (v: Verb) => regularPast(v.base);

// ── Time phrases ───────────────────────────────────────────────

export const TIME = {
  presentSimple: ["every day", "every morning", "on Sundays", "after school", "every weekend", "twice a week"],
  presentProgressive: ["now", "right now", "at the moment"],
  past: ["yesterday", "last night", "last week", "last summer", "two days ago", "an hour ago"],
  pastProgressive: ["at eight o'clock last night", "at this time yesterday", "at five o'clock yesterday"],
  future: ["tomorrow", "next week", "next summer", "this weekend", "tonight"],
  usedTo: ["years ago", "in the past"],
};

// ── Nouns (plurals, articles, quantity, there is / are) ────────

export interface Noun {
  sg: string;
  pl: string;
  /** a / an – only when it isn't decided by the first letter (an hour, a uniform). */
  article?: "a" | "an";
}

export const COUNT_NOUNS: Noun[] = [
  { sg: "book", pl: "books" },
  { sg: "apple", pl: "apples" },
  { sg: "box", pl: "boxes" },
  { sg: "bus", pl: "buses" },
  { sg: "watch", pl: "watches" },
  { sg: "dish", pl: "dishes" },
  { sg: "baby", pl: "babies" },
  { sg: "city", pl: "cities" },
  { sg: "story", pl: "stories" },
  { sg: "boy", pl: "boys" },
  { sg: "day", pl: "days" },
  { sg: "toy", pl: "toys" },
  { sg: "child", pl: "children" },
  { sg: "man", pl: "men" },
  { sg: "woman", pl: "women" },
  { sg: "foot", pl: "feet" },
  { sg: "tooth", pl: "teeth" },
  { sg: "mouse", pl: "mice" },
  { sg: "person", pl: "people" },
  { sg: "knife", pl: "knives" },
  { sg: "leaf", pl: "leaves" },
  { sg: "tomato", pl: "tomatoes" },
  { sg: "potato", pl: "potatoes" },
  { sg: "photo", pl: "photos" },
  { sg: "egg", pl: "eggs" },
  { sg: "orange", pl: "oranges" },
  { sg: "umbrella", pl: "umbrellas" },
  { sg: "elephant", pl: "elephants" },
  { sg: "idea", pl: "ideas" },
  { sg: "hour", pl: "hours", article: "an" },
  { sg: "uniform", pl: "uniforms", article: "a" },
  { sg: "chair", pl: "chairs" },
  { sg: "bag", pl: "bags" },
  { sg: "bird", pl: "birds" },
  { sg: "dog", pl: "dogs" },
  { sg: "house", pl: "houses" },
  { sg: "pen", pl: "pens" },
  { sg: "window", pl: "windows" },
  { sg: "tree", pl: "trees" },
  { sg: "glass", pl: "glasses" },
  { sg: "family", pl: "families" },
  { sg: "sandwich", pl: "sandwiches" },
];

export const UNCOUNT_NOUNS = ["water", "milk", "bread", "money", "time", "rice", "juice", "homework", "music", "cheese", "sugar", "information"];

export const articleOf = (n: Noun): "a" | "an" => n.article ?? (/^[aeiou]/i.test(n.sg) ? "an" : "a");

export const PLACES = ["in the kitchen", "in the garden", "on the table", "in my bag", "in the classroom", "in the box", "near the door", "in the park"];

// ── Adjectives (comparatives / superlatives / order) ───────────

export interface Adjective {
  base: string;
  comp: string;
  sup: string;
  /** Things the adjective fits (for sentences). */
  about: string[];
}

const short = (base: string, comp: string, sup: string, about: string[]): Adjective => ({ base, comp, sup, about });
const long = (base: string, about: string[]): Adjective => ({ base, comp: `more ${base}`, sup: `most ${base}`, about });

export const ADJECTIVES: Adjective[] = [
  short("big", "bigger", "biggest", ["house", "city", "dog"]),
  short("small", "smaller", "smallest", ["room", "car", "bag"]),
  short("tall", "taller", "tallest", ["tree", "boy", "building"]),
  short("old", "older", "oldest", ["car", "house", "book"]),
  short("young", "younger", "youngest", ["brother", "sister", "player"]),
  short("fast", "faster", "fastest", ["car", "runner", "bike"]),
  short("hot", "hotter", "hottest", ["day", "summer", "soup"]),
  short("cold", "colder", "coldest", ["day", "winter", "room"]),
  short("long", "longer", "longest", ["river", "story", "road"]),
  short("short", "shorter", "shortest", ["story", "movie", "road"]),
  short("cheap", "cheaper", "cheapest", ["phone", "shirt", "bag"]),
  short("happy", "happier", "happiest", ["child", "dog", "family"]),
  short("easy", "easier", "easiest", ["test", "game", "question"]),
  short("funny", "funnier", "funniest", ["movie", "story", "joke"]),
  short("busy", "busier", "busiest", ["street", "day", "city"]),
  short("nice", "nicer", "nicest", ["room", "teacher", "park"]),
  short("large", "larger", "largest", ["room", "city", "house"]),
  short("good", "better", "best", ["movie", "player", "book"]),
  short("bad", "worse", "worst", ["day", "movie", "idea"]),
  long("beautiful", ["city", "park", "picture"]),
  long("expensive", ["phone", "car", "watch"]),
  long("interesting", ["book", "story", "movie"]),
  long("difficult", ["test", "question", "game"]),
  long("popular", ["song", "game", "singer"]),
  long("important", ["test", "day", "game"]),
];

/** Wrong comparative / superlative forms learners write. */
export function wrongComparatives(a: Adjective): string[] {
  const out = new Set<string>();
  if (a.comp.startsWith("more ")) {
    out.add(`${a.base}er`);
    out.add(`more ${a.base}er`);
  } else {
    out.add(`more ${a.base}`);
    out.add(`more ${a.comp}`);
    if (a.base === "good") out.add("gooder");
    if (a.base === "bad") out.add("badder");
  }
  return [...out].filter((x) => x !== a.comp);
}

export function wrongSuperlatives(a: Adjective): string[] {
  const out = new Set<string>();
  if (a.sup.startsWith("most ")) {
    out.add(`${a.base}est`);
    out.add(`more ${a.base}`);
  } else {
    out.add(`most ${a.base}`);
    out.add(a.comp);
    if (a.base === "good") out.add("goodest");
  }
  return [...out].filter((x) => x !== a.sup);
}
