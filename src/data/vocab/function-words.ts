// Words every grammar item may use regardless of the grade vocabulary list:
// the grammar itself (auxiliaries, pronouns, determiners…), numbers, days,
// months, time and frequency words, and the names used in items.

export const FUNCTION_WORDS: string[] = [
  // be / do / have / modals
  "be", "am", "is", "are", "was", "were", "been", "being",
  "do", "does", "did", "done", "doing",
  "have", "has", "had", "having",
  "will", "would", "shall", "should", "can", "could", "may", "might", "must", "cannot",
  "used", "going", "gonna",
  // negation / answers
  "not", "no", "yes", "never", "nothing", "nobody", "none", "ok", "okay",
  // pronouns
  "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them",
  "my", "your", "his", "its", "our", "their", "mine", "yours", "hers", "ours", "theirs",
  "myself", "yourself", "himself", "herself", "itself", "ourselves", "yourselves", "themselves",
  "this", "that", "these", "those", "one", "ones",
  "someone", "somebody", "something", "anyone", "anybody", "anything",
  "everyone", "everybody", "everything", "each", "other", "another",
  // determiners / quantity
  "a", "an", "the", "some", "any", "many", "much", "more", "most", "few", "little",
  "lot", "lots", "all", "both", "every", "enough", "very", "too", "less", "least",
  // question words
  "what", "who", "whom", "whose", "which", "when", "where", "why", "how",
  // conjunctions / linking
  "and", "but", "or", "so", "because", "if", "than", "then", "while", "before", "after",
  "until", "since", "also", "first", "next", "finally", "later", "as",
  // prepositions
  "at", "in", "on", "to", "from", "of", "for", "with", "without", "by", "about", "into",
  "onto", "up", "down", "out", "off", "over", "under", "near", "next", "between", "behind",
  "around", "through", "across", "along", "during", "inside", "outside", "like",
  // time / frequency
  "always", "usually", "often", "sometimes", "rarely", "seldom", "hardly", "ever",
  "now", "today", "tonight", "tomorrow", "yesterday", "ago", "already", "yet", "just",
  "still", "soon", "again", "once", "twice", "times", "time", "day", "days", "week",
  "weekend", "month", "year", "morning", "afternoon", "evening", "night",
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  "january", "february", "march", "april", "june", "july", "august",
  "september", "october", "november", "december",
  "o'clock", "last", "here", "there", "every",
  // numbers
  "zero", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "twenty", "thirty", "hundred", "thousand", "second", "third",
  "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "hundreds", "thousands",
  // tiny everyday verbs used to build sentences
  "get", "go", "come", "make", "take", "give", "say", "tell", "see", "know", "think",
  "want", "need", "like", "love", "look", "play", "eat", "drink", "live", "work", "study",
  // classroom / instruction words
  "promise", "sure", "worry", "rule", "rules", "general",
];

/** Names used in items (they are not vocabulary). */
export const ITEM_NAMES: string[] = [
  "maya", "noa", "dan", "tom", "shira", "dana", "yoni", "omer", "tamar", "itay",
  "lior", "adam", "sarah", "david", "michal", "amit", "roni", "yael", "ben",
  "haifa", "tel", "aviv", "jerusalem", "eilat", "be'er", "sheva", "israel", "english",
  "hebrew", "arabic", "russian",
  // more names used in reading and conversation content
  "gal", "roy", "sara", "tv", "hmm", "oh", "wow", "um", "ah", "ms", "mr", "mrs", "dr", "york", "rome", "new", "italian", "british", "american", "french", "spanish", "german", "greek", "tal", "nir", "neta", "daniel", "amir", "itamar", "michal", "dor", "noam", "hadar", "omri", "shir", "grandma", "grandpa", "mount", "rex", "anna", "yuval", "nadav", "eden", "ella", "liam", "alon", "maor",
  "hila", "neta", "avi", "ido", "rina", "jack", "emma", "sam", "lily", "max", "leo",
  "mia", "zoe", "ori", "keren", "lee", "jordan", "cohen", "levi", "london", "paris",
  "america", "europe", "africa", "asia", "australia", "japan", "china", "india",
  "france", "italy", "russia", "morocco", "israeli", "ethiopia", "germany", "mexico", "brazil", "turkey", "jaffa", "nazareth", "acre", "tiberias", "eilat", "spain", "canada", "egypt", "greece", "galilee", "negev", "kinneret",
];
