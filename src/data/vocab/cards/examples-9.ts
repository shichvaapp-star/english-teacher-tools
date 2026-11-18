// Grade 9 word-card examples (Mindset Plus), one per entry of GRADE_9_VOCAB, in the same order.
// Each sentence uses only Band I + grade 7–9 textbook words + function words (npm run check:content).
// Entry: "sentence" or ["sentence", partOfSpeech (when the list has none), extra allowed words?].
import type { ExampleSpec } from "@/data/vocab/cards/index";

export const GRADE_9_EXAMPLES: ExampleSpec[] = [
  // 0 u1 ancient
  ["We visited an ancient city in Greece.", null, ["Greece"]],
  // 1 u1 article
  ["I read an interesting article about sharks.", null, ["sharks"]],
  // 2 u1 as if
  ["He looked as if he had seen a ghost.", "phrase", ["ghost"]],
  // 3 u1 attach
  "Please attach the photo to your message.",
  // 4 u1 attempt
  "She attempted to climb the wall, but she fell.",
  // 5 u1 base on
  ["The movie is based on a true story.", "phrase"],
  // 6 u1 borrow
  "Can I borrow your pen?",
  // 7 u1 bring (someone) luck
  ["This old coin always brings me luck.", "phrase"],
  // 8 u1 care
  "I don't care what other people think.",
  // 9 u1 colleague
  "My father had lunch with a colleague from work.",
  // 10 u1 consider (to be)
  "He is considered to be the best player in the team.",
  // 11 u1 contrast
  "There is a big contrast between the two sisters.",
  // 12 u1 contrast
  "Contrast the two pictures and write the differences.",
  // 13 u1 cut
  ["I cut my finger with a knife.", "adverb"],
  // 14 u1 defend
  "The soldiers defended the city.",
  // 15 u1 deny
  "He denied that he took the money.",
  // 16 u1 dive
  "She dived into the pool.",
  // 17 u1 duty
  "It is your duty to help your family.",
  // 18 u1 elementary
  "My little brother is in elementary school.",
  // 19 u1 elevator
  "Let's take the elevator to the fifth floor.",
  // 20 u1 every single
  ["I read every single book in the series.", "phrase"],
  // 21 u1 excitement
  "There was a lot of excitement before the game.",
  // 22 u1 favor
  "Can you do me a favor?",
  // 23 u1 find (it) (funny)
  ["I find it funny when my dog runs after its own tail.", "phrase", ["tail"]],
  // 24 u1 fire
  "The firefighters put out the fire.",
  // 25 u1 fire
  "The company fired three workers.",
  // 26 u1 for instance
  ["Some animals, for instance bears, sleep all winter.", "phrase"],
  // 27 u1 forgive
  "Please forgive me; I didn't mean it.",
  // 28 u1 gather
  "We gathered in the hall for the meeting.",
  // 29 u1 give (someone) a call
  ["Give me a call when you get home.", "phrase"],
  // 30 u1 happiness
  "Money can't buy happiness.",
  // 31 u1 hardly
  "I can hardly hear you; the music is too loud.",
  // 32 u1 hit
  "The song was a big hit.",
  // 33 u1 importance
  "Don't forget the importance of sleep.",
  // 34 u1 jar
  ["There is a jar of honey on the table.", null, ["honey"]],
  // 35 u1 joke
  "He told us a funny joke.",
  // 36 u1 laugh at
  ["Don't laugh at me!", "phrase"],
  // 37 u1 mean
  "Don't be mean to your little brother.",
  // 38 u1 midday
  "We stopped for lunch at midday.",
  // 39 u1 mind
  "I can't get that song out of my mind.",
  // 40 u1 mind
  "Do you mind if I open the window?",
  // 41 u1 nowadays
  ["Nowadays, almost everyone has a smartphone.", null, ["smartphone"]],
  // 42 u1 play a trick on
  ["My brother played a trick on me.", "phrase"],
  // 43 u1 pop
  "I like listening to pop music.",
  // 44 u1 record
  "She set a new world record.",
  // 45 u1 record
  "We recorded our voices for the project.",
  // 46 u1 result in
  ["Heavy rain resulted in floods.", "phrase", ["floods"]],
  // 47 u1 roll
  "I ate a roll with cheese for breakfast.",
  // 48 u1 roll
  "The ball rolled down the hill.",
  // 49 u1 see
  "I see what you mean.",
  // 50 u1 selfie
  ["We took a selfie in front of the castle.", null, ["castle"]],
  // 51 u1 sense of humor
  ["My teacher has a great sense of humor.", "phrase"],
  // 52 u1 smell
  "I love the smell of fresh bread.",
  // 53 u1 smell
  "The flowers smell lovely.",
  // 54 u1 smoke
  "We saw smoke coming from the building.",
  // 55 u1 smoke
  "My grandfather stopped smoking ten years ago.",
  // 56 u1 so that
  ["I'm saving money so that I can buy a new phone.", "phrase"],
  // 57 u1 stranger
  "Don't talk to strangers.",
  // 58 u1 study
  "A new study shows that teenagers need more sleep.",
  // 59 u1 study
  "I need to study for the history test.",
  // 60 u1 the public
  ["The museum is open to the public on Saturdays.", "phrase"],
  // 61 u1 the same thing
  ["We both said the same thing at the same time.", "phrase"],
  // 62 u1 tweet
  "The singer wrote a tweet about her new song.",
  // 63 u1 tweet
  "The president tweeted about the meeting.",
  // 64 u1 adjective
  "\"Beautiful\" is an adjective.",
  // 65 u1 adverb
  "\"Quickly\" is an adverb.",
  // 66 u1 arrange
  "We arranged to meet at the café.",
  // 67 u1 at all
  ["I don't like coffee at all.", "phrase"],
  // 68 u1 attitude
  "She has a great attitude towards school.",
  // 69 u1 be expecting (someone)
  ["We are expecting my grandparents for dinner.", "phrase"],
  // 70 u1 board
  "The passengers boarded the plane.",
  // 71 u1 certain
  "I'm certain that I left my keys here.",
  // 72 u1 complex
  "This is a complex problem with no easy answer.",
  // 73 u1 crucial
  "Water is crucial for life.",
  // 74 u1 culture
  ["I love learning about Japanese culture.", null, ["Japanese"]],
  // 75 u1 dictation
  "The teacher gave us a dictation in English.",
  // 76 u1 eventually
  "After many tries, he eventually passed his driving test.",
  // 77 u1 excuse
  "What is your excuse for being late?",
  // 78 u1 experience
  "She has a lot of experience with children.",
  // 79 u1 gas
  "The car ran out of gas.",
  // 80 u1 in other words
  ["He was not honest; in other words, he lied.", "phrase"],
  // 81 u1 just
  "I just finished my homework.",
  // 82 u1 knock
  "Somebody is knocking on the door.",
  // 83 u1 later
  "See you later!",
  // 84 u1 lay the table
  ["Please lay the table for dinner.", "phrase"],
  // 85 u1 noticeboard
  "The test results are on the noticeboard.",
  // 86 u1 noun
  "\"Table\" is a noun.",
  // 87 u1 paragraph
  "Write a short paragraph about your family.",
  // 88 u1 pass through
  ["We passed through three villages on the way.", "phrase"],
  // 89 u1 period
  "The class period lasts forty-five minutes.",
  // 90 u1 phrase
  "Learn this useful phrase by heart.",
  // 91 u1 plural
  "The plural of \"child\" is \"children\".",
  // 92 u1 plural
  "\"Mice\" is a plural noun.",
  // 93 u1 question mark
  "Put a question mark at the end of a question.",
  // 94 u1 rather
  "It's rather cold today.",
  // 95 u1 relatively
  "The test was relatively easy.",
  // 96 u1 route
  "What is the fastest route to the airport?",
  // 97 u1 singular
  "\"Foot\" is singular, and \"feet\" is plural.",
  // 98 u1 tense
  "The past tense of \"go\" is \"went\".",
  // 99 u1 the press
  "The press waited outside the hotel.",
  // 100 u1 to be honest
  ["To be honest, I didn't like the movie.", "phrase"],
  // 101 u1 tone
  "I didn't like the tone of his voice.",
  // 102 u1 understanding
  "Understanding other cultures is important.",
  // 103 u1 advantage
  "Living near school is a great advantage.",
  // 104 u1 disadvantage
  "One disadvantage of the city is the noise.",
  // 105 u1 express
  "It's hard to express my feelings in English.",
  // 106 u1 in detail
  ["Please describe the picture in detail.", "phrase"],
  // 107 u1 in fact
  ["He looks young, but in fact he is fifty.", "phrase"],
  // 108 u1 notes
  "I took notes during the lesson.",
  // 109 u1 opinion
  "In my opinion, the book is better than the movie.",
  // 110 u1 speaker
  "The speaker talked about climate change.",
  // 111 u1 speech
  ["The principal gave a speech at the ceremony.", null, ["ceremony"]],
  // 112 u1 support
  "My parents always support me.",
  // 113 u1 topic
  "The topic of my project is pollution.",
  // 114 u2 against
  ["Are you for or against the new rule?", "preposition"],
  // 115 u2 agent
  "The travel agent booked our flight.",
  // 116 u2 apart from
  ["Apart from the rain, it was a great day.", "phrase"],
  // 117 u2 assess
  "The teacher will assess our projects next week.",
  // 118 u2 attend
  "All students must attend the meeting.",
  // 119 u2 battle
  "The battle lasted three days.",
  // 120 u2 broadcast
  "We watched a live broadcast of the game.",
  // 121 u2 broadcast
  "The concert will be broadcast on the radio.",
  // 122 u2 candle
  "She lit a candle on the cake.",
  // 123 u2 chain
  "He wears a gold chain around his neck.",
  // 124 u2 chapter
  "Read the first chapter for homework.",
  // 125 u2 character
  "Who is your favorite character in the book?",
  // 126 u2 code
  "Type the code to open the door.",
  // 127 u2 confirm
  "Please confirm your booking by phone.",
  // 128 u2 desire
  "He has a strong desire to win.",
  // 129 u2 device
  "A phone is a useful device.",
  // 130 u2 director
  "The director of the school greeted the parents.",
  // 131 u2 disappoint
  "I didn't want to disappoint my parents.",
  // 132 u2 driving license
  "You need a driving license to drive a car.",
  // 133 u2 duty-free
  ["We bought chocolate in the duty-free shop.", "adverb"],
  // 134 u2 ensure
  "Please ensure that all the windows are closed.",
  // 135 u2 equally
  "We shared the money equally.",
  // 136 u2 experience
  ["Visiting Paris was an amazing experience.", null, ["Paris"]],
  // 137 u2 face-to-face
  ["I prefer to talk face-to-face, not by phone.", "adverb"],
  // 138 u2 firefighter
  "The firefighter saved the cat from the tree.",
  // 139 u2 good-looking
  "Her brother is very good-looking.",
  // 140 u2 government
  "The government is building new schools.",
  // 141 u2 haircut
  "I like your new haircut!",
  // 142 u2 handsome
  "The prince was very handsome.",
  // 143 u2 headline
  "The headline in the paper was about the election.",
  // 144 u2 housework
  "We all help with the housework.",
  // 145 u2 identity
  "The police checked his identity.",
  // 146 u2 intend
  "I intend to finish my project tonight.",
  // 147 u2 interview
  "She had a job interview yesterday.",
  // 148 u2 interview
  "The reporter interviewed the famous singer.",
  // 149 u2 introduction
  "Read the introduction before you start.",
  // 150 u2 lab
  "We do experiments in the science lab.",
  // 151 u2 no way
  ["\"Can I borrow your car?\" \"No way!\"", "phrase"],
  // 152 u2 novel
  "I'm reading a novel by a famous writer.",
  // 153 u2 nuclear
  ["Nuclear power is a topic for debate.", null, ["debate"]],
  // 154 u2 on fire
  ["The house was on fire.", "phrase"],
  // 155 u2 oppose
  "Many people oppose the new law.",
  // 156 u2 pass
  "Please pass me the salt.",
  // 157 u2 political
  "They talked about political problems.",
  // 158 u2 power
  "The king had a lot of power.",
  // 159 u2 secretary
  "The secretary answered the phone.",
  // 160 u2 self-service
  "This is a self-service restaurant.",
  // 161 u2 single parent
  "My aunt is a single parent with two kids.",
  // 162 u2 spot
  "This is a nice spot for a picnic.",
  // 163 u2 spy
  "In the movie, the spy steals important papers.",
  // 164 u2 spy
  "They spied on their neighbors.",
  // 165 u2 stay
  "We stayed at a hotel near the beach.",
  // 166 u2 stone
  "He threw a stone into the lake.",
  // 167 u2 the best
  ["You are the best!", "phrase"],
  // 168 u2 the West
  ["Many people in the West eat with a knife and fork.", "phrase"],
  // 169 u2 translate
  "Can you translate this letter into Hebrew?",
  // 170 u2 up-to-date
  "This list of prices is not up-to-date.",
  // 171 u2 well-made
  "These shoes are well-made and will last for years.",
  // 172 u2 whether ... or ...
  ["Whether you like it or not, you have to go.", "phrase"],
  // 173 u2 aircraft
  "The aircraft landed safely.",
  // 174 u2 break down
  ["Our car broke down on the highway.", "phrase"],
  // 175 u2 call
  "I'll call you tonight.",
  // 176 u2 catch (someone's) attention
  ["The bright colors caught my attention.", "phrase"],
  // 177 u2 check-in
  "Check-in opens two hours before the flight.",
  // 178 u2 chief
  "She is the chief doctor at the hospital.",
  // 179 u2 citizen
  "He is a citizen of Israel.",
  // 180 u2 commit
  "He committed a crime and went to prison.",
  // 181 u2 creature
  ["The octopus is a strange creature.", null, ["octopus"]],
  // 182 u2 deal with
  ["I don't know how to deal with this problem.", "phrase"],
  // 183 u2 euro
  "This shirt costs twenty euros.",
  // 184 u2 examine
  "The doctor examined my throat.",
  // 185 u2 for years
  ["They have lived in this house for years.", "phrase"],
  // 186 u2 fuel
  "We need fuel for the car.",
  // 187 u2 garage
  "Dad keeps the car in the garage.",
  // 188 u2 guard
  "A guard stood at the gate.",
  // 189 u2 guess
  "Guess what happened at school today!",
  // 190 u2 hundreds
  "Hundreds of people came to the concert.",
  // 191 u2 luck
  "Good luck on your test!",
  // 192 u2 never mind
  ["\"I forgot your book.\" \"Never mind.\"", "phrase"],
  // 193 u2 officer
  "A police officer helped us find the way.",
  // 194 u2 on business
  ["My father went to London on business.", "phrase", ["London"]],
  // 195 u2 parliament
  ["The British parliament is in London.", null, ["British", "London"]],
  // 196 u2 passport
  "Don't forget your passport!",
  // 197 u2 politics
  "My uncle is interested in politics.",
  // 198 u2 real
  ["Is this a real diamond?", null, ["diamond"]],
  // 199 u2 receipt
  "Keep the receipt in case you want to return it.",
  // 200 u2 relations
  "The two countries have good relations.",
  // 201 u2 rough
  "The sea was rough, so we stayed on the beach.",
  // 202 u2 sew
  "My grandmother taught me to sew.",
  // 203 u2 staff
  "The hotel staff were very friendly.",
  // 204 u2 stress
  "Exams cause a lot of stress.",
  // 205 u2 task
  "Your first task is to clean the kitchen.",
  // 206 u2 the law
  "Driving without a license is against the law.",
  // 207 u2 though
  ["I like her, though she can be rude sometimes.", "conjunction"],
  // 208 u2 treatment
  "The treatment at the hospital was excellent.",
  // 209 u2 wrap
  ["Let's wrap the present in nice paper.", "adverb"],
  // 210 u2 context
  "You can guess the meaning of a word from the context.",
  // 211 u2 copy
  "Copy the sentence from the board.",
  // 212 u2 delete
  "I deleted the photo by mistake.",
  // 213 u2 have (something) in common
  ["My best friend and I have a lot in common.", "phrase"],
  // 214 u2 order
  "Put the words in the right order.",
  // 215 u2 select
  "Select the right answer.",
  // 216 u2 step
  "The first step is to read the question.",
  // 217 u2 underline
  "Underline the verbs in the sentence.",
  // 218 u3 application (app)
  "I downloaded a new application to my phone.",
  // 219 u3 as far as I know
  ["As far as I know, the test is on Monday.", "phrase"],
  // 220 u3 average
  "The average of my grades is ninety.",
  // 221 u3 be in touch with
  ["I'm still in touch with my old friends.", "phrase"],
  // 222 u3 billion
  "There are about eight billion people in the world.",
  // 223 u3 binge-watch
  "We binge-watched the whole series this weekend.",
  // 224 u3 bomb
  "The army found an old bomb in the field.",
  // 225 u3 broad
  "The river is very broad here.",
  // 226 u3 cast
  ["The cast of the play bowed at the end.", null, ["bowed"]],
  // 227 u3 client
  ["The lawyer met with her client.", null, ["lawyer"]],
  // 228 u3 complete
  "Complete the sentences with the right words.",
  // 229 u3 construct
  "They are constructing a new bridge.",
  // 230 u3 convert
  "We converted the garage into a small office.",
  // 231 u3 curriculum
  "English is part of the school curriculum.",
  // 232 u3 damage
  "The storm caused a lot of damage.",
  // 233 u3 damage
  "Too much sun can damage your eyes.",
  // 234 u3 democracy
  ["In a democracy, people vote for the government.", null, ["vote"]],
  // 235 u3 destroy
  ["The fire destroyed the forest.", "adverb"],
  // 236 u3 divide
  "Divide the cake into eight pieces.",
  // 237 u3 do (one's) best
  ["Just do your best.", "phrase"],
  // 238 u3 economy
  ["Tourism is important for the economy.", null, ["tourism"]],
  // 239 u3 effectively
  "She uses her time effectively.",
  // 240 u3 employment
  "Employment in the city went up this year.",
  // 241 u3 endless
  "I'm tired of his endless questions.",
  // 242 u3 fiction
  "I like reading science fiction.",
  // 243 u3 file
  "Save the file before you close the computer.",
  // 244 u3 frequently
  "I frequently visit my grandparents.",
  // 245 u3 get rid of
  ["We need to get rid of these old clothes.", "phrase"],
  // 246 u3 growth
  "The growth of the city was very fast.",
  // 247 u3 handle
  "She handled the problem well.",
  // 248 u3 hire
  "They hired a new teacher.",
  // 249 u3 in general
  ["In general, I like my new school.", "phrase"],
  // 250 u3 information technology (IT)
  ["My cousin works in information technology.", null, ["cousin"]],
  // 251 u3 inside
  "The inside of the house was very clean.",
  // 252 u3 internal
  "The company had an internal meeting.",
  // 253 u3 just
  "He was just about to leave when I called.",
  // 254 u3 let us
  ["Let us begin the lesson.", "phrase"],
  // 255 u3 make
  ["What makes you happy?", "adverb"],
  // 256 u3 nothing
  ["There is nothing in the fridge.", "pronoun", ["fridge"]],
  // 257 u3 on offer
  ["There are great prices on offer this week.", "phrase"],
  // 258 u3 persuade
  "I persuaded my parents to buy a dog.",
  // 259 u3 possibility
  "Is there any possibility of rain today?",
  // 260 u3 program
  ["My favorite TV program starts at eight.", null, ["TV"]],
  // 261 u3 raise
  "Raise your hand if you know the answer.",
  // 262 u3 read out
  ["The teacher read out the names of the winners.", "phrase"],
  // 263 u3 sale
  ["There is a big sale at the mall.", null, ["mall"]],
  // 264 u3 save
  "Click here to save your work.",
  // 265 u3 savings
  ["He spent all his savings on a new bike.", null, ["bike"]],
  // 266 u3 single
  "Not a single person came.",
  // 267 u3 target
  "We hit the target with the ball.",
  // 268 u3 various
  "There are various ways to learn English.",
  // 269 u3 vehicle
  "No vehicles are allowed in the park.",
  // 270 u3 wallet
  "I lost my wallet on the bus.",
  // 271 u3 whoever
  ["Whoever finishes first wins a prize.", "pronoun"],
  // 272 u3 you know
  ["You know, I really like this song.", "phrase"],
  // 273 u3 accurate
  "Your answer is accurate.",
  // 274 u3 again and again
  ["I told him again and again not to touch it.", "phrase"],
  // 275 u3 carry
  "Can you carry this bag for me?",
  // 276 u3 code
  "Each item in the shop has a special code.",
  // 277 u3 compare
  "Compare the two pictures.",
  // 278 u3 cut down
  ["I'm trying to cut down on sugar.", "phrase"],
  // 279 u3 daily life
  ["Technology is a big part of our daily life.", "phrase"],
  // 280 u3 desktop
  "Save the file on the desktop.",
  // 281 u3 dolphin
  "A dolphin is a very clever animal.",
  // 282 u3 dot
  "Connect the dots to make a picture.",
  // 283 u3 drag and drop
  ["Drag and drop the picture into the box.", "phrase"],
  // 284 u3 drone
  "The drone took photos of the beach.",
  // 285 u3 drug
  ["This drug helps people with pain.", null, ["pain"]],
  // 286 u3 entirely
  "I entirely agree with you.",
  // 287 u3 environmentally friendly
  ["Use environmentally friendly bags.", "phrase"],
  // 288 u3 facility
  "The school has great sports facilities.",
  // 289 u3 fine
  "\"How are you?\" \"I'm fine, thanks.\"",
  // 290 u3 legal
  "It's not legal to drive at fourteen.",
  // 291 u3 lioness
  "The lioness protects her babies.",
  // 292 u3 military
  "The military base is near the border.",
  // 293 u3 miss
  "I miss my grandmother.",
  // 294 u3 motor
  "The boat has a small motor.",
  // 295 u3 mouse
  "Click on the picture with the mouse.",
  // 296 u3 parcel
  "I sent a parcel to my aunt.",
  // 297 u3 pipe
  "Water came out of a broken pipe.",
  // 298 u3 position
  "What is your position on the team?",
  // 299 u3 rate
  ["The rate of unemployment is high.", null, ["unemployment"]],
  // 300 u3 sand
  "The children played in the sand.",
  // 301 u3 software
  "You need special software for this game.",
  // 302 u3 tag
  "She tagged me in a photo.",
  // 303 u3 technical
  "My brother is good with technical things.",
  // 304 u3 the air
  ["There was excitement in the air.", "phrase"],
  // 305 u3 these days
  ["These days, everyone has a phone.", "phrase"],
  // 306 u3 try something out
  ["Try this new game out; it's fun!", "phrase"],
  // 307 u3 type
  "Type your name in the box.",
  // 308 u3 update
  "Update the app to get the new features.",
  // 309 u3 viral
  "The song went viral in one day.",
  // 310 u3 volume
  "Turn down the volume, please.",
  // 311 u3 window
  "Close the window on your screen.",
  // 312 u3 with the help of
  ["I finished the project with the help of my friends.", "phrase"],
  // 313 u3 wood
  "The table is made of wood.",
  // 314 u3 zone
  "This is a no-parking zone.",
  // 315 u3 certainty
  "There is no certainty that we will win.",
  // 316 u3 definite
  "We don't have a definite answer yet.",
  // 317 u3 plain
  ["I like plain yogurt with no sugar.", null, ["yogurt"]],
  // 318 u3 properly
  "Do your homework properly.",
  // 319 u3 reality
  "He lives in a dream world, not in reality.",
  // 320 u3 somewhat
  "I was somewhat surprised by the news.",
  // 321 u3 there's no doubt
  ["There's no doubt that she is the best singer.", "phrase"],
  // 322 u3 would prefer
  ["I would prefer to stay at home tonight.", "phrase"],
  // 323 u4 achieve
  "She achieved her dream of becoming a doctor.",
  // 324 u4 afterwards
  "We had dinner and afterwards we went for a walk.",
  // 325 u4 ahead
  "Look straight ahead.",
  // 326 u4 aid
  ["The country sent aid to the victims of the earthquake.", null, ["earthquake"]],
  // 327 u4 angel
  "She sings like an angel.",
  // 328 u4 at (its) best
  ["The city is at its best in spring.", "phrase"],
  // 329 u4 avatar
  "Choose an avatar for your game.",
  // 330 u4 award
  "They awarded her a prize for her book.",
  // 331 u4 canal
  "We took a boat ride on the canal.",
  // 332 u4 category
  "Put the words into the right category.",
  // 333 u4 centimeter
  "The insect is only one centimeter long.",
  // 334 u4 charity
  "We gave money to a charity that helps children.",
  // 335 u4 confuse
  "The many signs confused the drivers.",
  // 336 u4 data
  ["The scientists collected data for a year.", null, ["scientists"]],
  // 337 u4 dialogue
  "Read the dialogue and answer the questions.",
  // 338 u4 diploma
  "I got my high school diploma.",
  // 339 u4 drama
  "She studies drama at university.",
  // 340 u4 equipment
  "We need new sports equipment.",
  // 341 u4 expectation
  "The movie was below my expectations.",
  // 342 u4 expression
  "\"Break a leg\" is an English expression that means \"good luck\".",
  // 343 u4 extent
  ["To some extent, you are right.", "adverb"],
  // 344 u4 finish
  "The race had an exciting finish.",
  // 345 u4 form
  "The students formed a circle.",
  // 346 u4 height
  "What is your height?",
  // 347 u4 hold (one's) breath
  ["Hold your breath and dive under the water.", "phrase"],
  // 348 u4 honest
  "Thank you for being honest with me.",
  // 349 u4 humor
  "I love the humor in this book.",
  // 350 u4 ignore
  "She ignored me all day.",
  // 351 u4 lead
  "The road leads to the village.",
  // 352 u4 league
  "Our team won the league.",
  // 353 u4 level
  "The water level in the lake is very low.",
  // 354 u4 live
  ["We watched the game live on TV.", null, ["TV"]],
  // 355 u4 marathon
  "My uncle ran a marathon last year.",
  // 356 u4 match
  "Did you watch the football match?",
  // 357 u4 maximum
  "The maximum number of students in a class is forty.",
  // 358 u4 meter
  "The room is four meters wide.",
  // 359 u4 opera
  ["We went to the opera in Italy.", null, ["Italy"]],
  // 360 u4 patient
  "The doctor has many patients today.",
  // 361 u4 point
  "What's the point of this game?",
  // 362 u4 post
  "She posted a photo of her dog online.",
  // 363 u4 represent
  ["The dove represents peace.", null, ["dove"]],
  // 364 u4 second
  "He came second in the race.",
  // 365 u4 shoot
  ["The hunter shot a bird.", null, ["hunter"]],
  // 366 u4 show
  "Can you show me the way to the station?",
  // 367 u4 stadium
  ["The stadium was full of fans.", "noun"],
  // 368 u4 station
  ["We waited for the train at the station.", "noun"],
  // 369 u4 strongly
  "I strongly believe that we can win.",
  // 370 u4 sympathy
  "We feel deep sympathy for the families.",
  // 371 u4 the first
  ["He was the first to arrive.", "phrase"],
  // 372 u4 tram
  "We took the tram to the city center.",
  // 373 u4 virus
  "A virus can make you sick.",
  // 374 u4 would rather
  ["I would rather walk than take the bus.", "phrase"],
  // 375 u4 accept
  "Please accept my apology.",
  // 376 u4 ache
  ["I have an ache in my back.", null, ["headache"]],
  // 377 u4 adopt
  ["They adopted a little girl from China.", null, ["China"]],
  // 378 u4 and so on
  ["We bought apples, bananas, oranges and so on.", "phrase"],
  // 379 u4 apply
  "I applied for a summer job.",
  // 380 u4 be into
  ["My brother is really into computer games.", "phrase"],
  // 381 u4 be worth
  ["This old painting is worth a lot of money.", "phrase"],
  // 382 u4 bin
  "Throw the paper in the bin.",
  // 383 u4 bone
  "The dog is eating a bone.",
  // 384 u4 candidate
  "There are three candidates for class president.",
  // 385 u4 chips
  "I'd like fish and chips, please.",
  // 386 u4 commitment
  "Being on a team requires commitment.",
  // 387 u4 committee
  "The school committee will discuss the trip.",
  // 388 u4 crisps
  "We ate crisps at the party.",
  // 389 u4 end up
  ["We got lost and ended up in a village.", "phrase"],
  // 390 u4 have no doubt
  ["I have no doubt that you will pass the test.", "phrase"],
  // 391 u4 in spite of
  ["In spite of the rain, we went to the beach.", "phrase"],
  // 392 u4 injure
  "He injured his leg playing football.",
  // 393 u4 labour
  "Building a house takes a lot of labour.",
  // 394 u4 lift
  "Let's take the lift to the top floor.",
  // 395 u4 not really
  ["\"Are you tired?\" \"Not really.\"", "phrase"],
  // 396 u4 out of
  ["He ran out of the room.", "phrase"],
  // 397 u4 petrol
  "We need to buy petrol for the car.",
  // 398 u4 previous
  "The previous owner of the house was a teacher.",
  // 399 u4 since
  ["I have lived here since 2010.", "conjunction"],
  // 400 u4 sparkling water
  ["Can I have a bottle of sparkling water?", "phrase"],
  // 401 u4 such
  ["It was such a lovely day!", "pronoun"],
  // 402 u4 sunshine
  "We sat in the sunshine all afternoon.",
  // 403 u4 surely
  "Surely you don't believe that story!",
  // 404 u4 switch
  "Switch off the light when you leave the room.",
  // 405 u4 technique
  "She has a special technique for drawing faces.",
  // 406 u4 temperature
  "The temperature dropped below zero last night.",
  // 407 u4 tyre
  "The car has a flat tyre.",
  // 408 u4 victory
  "The team was very happy after their victory.",
  // 409 u4 wish (someone) luck
  ["Wish me luck! I have a test today.", "phrase"],
  // 410 u4 by the way
  ["By the way, have you seen my keys?", "phrase"],
  // 411 u4 consideration
  "After careful consideration, we chose the blue car.",
  // 412 u4 despite
  ["Despite the cold, he went swimming.", "preposition"],
  // 413 u4 due to
  ["The game was cancelled due to the rain.", "phrase"],
  // 414 u4 factor
  "Price is an important factor when you buy a phone.",
  // 415 u4 however
  ["I wanted to go; however, I was too tired.", "conjunction"],
  // 416 u4 in addition
  ["In addition to English, she speaks French.", "phrase", ["French"]],
  // 417 u4 rather than
  ["I'd like tea rather than coffee.", "phrase"],
  // 418 u4 therefore
  ["He was sick; therefore, he stayed at home.", "adverb"],
  // 419 u4 What about ...?
  ["What about going to the beach tomorrow?", "phrase"],
  // 420 u5 approve
  "My parents don't approve of my new haircut.",
  // 421 u5 aspect
  "We discussed every aspect of the problem.",
  // 422 u5 at long last
  ["At long last, the summer vacation is here!", "phrase"],
  // 423 u5 basin
  "Wash your hands in the basin.",
  // 424 u5 be up to (someone)
  ["It's up to you where we eat tonight.", "phrase"],
  // 425 u5 before
  ["I have seen this movie before.", "adverb"],
  // 426 u5 benefit
  "Everyone will benefit from the new park.",
  // 427 u5 block
  "We live in the same block as our grandparents.",
  // 428 u5 clap
  "The audience clapped at the end of the show.",
  // 429 u5 community
  "The whole community came to the party in the park.",
  // 430 u5 complain
  "My father complained about the bad service.",
  // 431 u5 constant
  "There is a constant noise from the street.",
  // 432 u5 contents
  "The contents of the box fell on the floor.",
  // 433 u5 contribute
  "Everyone contributed money for the present.",
  // 434 u5 convenient
  "Is three o'clock convenient for you?",
  // 435 u5 course
  "Of course I'll help you.",
  // 436 u5 custom
  "It is a custom to give presents on birthdays.",
  // 437 u5 domestic
  ["We took a domestic flight to Eilat.", null, ["Eilat"]],
  // 438 u5 domestic
  "The domestic cleans the house twice a week.",
  // 439 u5 dust
  "The old books were covered in dust.",
  // 440 u5 economic
  "The country has serious economic problems.",
  // 441 u5 estimate
  "We estimate that the trip will take three hours.",
  // 442 u5 etc.
  ["Bring pens, pencils, paper, etc.", "phrase"],
  // 443 u5 following
  "The following day, we went home.",
  // 444 u5 for sure
  ["I'll be there for sure.", "phrase"],
  // 445 u5 furniture
  "We bought new furniture for the living room.",
  // 446 u5 greet
  "The teacher greeted the students at the door.",
  // 447 u5 in advance
  ["Buy your tickets in advance.", "phrase"],
  // 448 u5 in case
  ["Take an umbrella in case it rains.", "phrase"],
  // 449 u5 in particular
  ["I like all sports, football in particular.", "phrase"],
  // 450 u5 Judaism
  "Judaism is one of the oldest religions in the world.",
  // 451 u5 keep in touch
  ["Let's keep in touch after the summer.", "phrase"],
  // 452 u5 ladder
  "He climbed the ladder to fix the roof.",
  // 453 u5 loads of
  ["We had loads of fun at the party.", "phrase"],
  // 454 u5 manage
  "How do you manage to do so many things?",
  // 455 u5 neighborhood
  "There is a nice park in our neighborhood.",
  // 456 u5 no longer
  ["She no longer lives here.", "phrase"],
  // 457 u5 odd
  ["It's odd that he didn't call.", "adjective"],
  // 458 u5 one of these days
  ["One of these days I'll visit you.", "phrase"],
  // 459 u5 oven
  "Put the cake in the oven.",
  // 460 u5 owner
  "The owner of the dog came to get it.",
  // 461 u5 pension
  "My grandfather lives on his pension.",
  // 462 u5 preparation
  "The preparation for the party took all day.",
  // 463 u5 relation
  "What is the relation between the two?",
  // 464 u5 religious
  ["Many religious people pray every day.", null, ["pray"]],
  // 465 u5 repair
  ["Can you repair my bike?", null, ["bike"]],
  // 466 u5 sink
  ["Put the dirty dishes in the sink.", null, ["dirty"]],
  // 467 u5 suppose
  "I suppose you're right.",
  // 468 u5 things
  "Pack your things; we're leaving.",
  // 469 u5 thread
  ["She used a needle and thread to fix her shirt.", null, ["needle"]],
  // 470 u5 tissue
  "Do you have a tissue? I need to blow my nose.",
  // 471 u5 try (one's) best
  ["Try your best and don't give up.", "phrase"],
  // 472 u5 wedding
  ["We danced all night at my cousin's wedding.", null, ["cousin"]],
  // 473 u5 wipe
  "Wipe the table after you eat.",
  // 474 u5 blow your nose
  ["Here's a tissue; blow your nose.", "phrase"],
  // 475 u5 button
  "Press the red button to start.",
  // 476 u5 cancel (something)
  "We had to cancel the trip because of the weather.",
  // 477 u5 correct (a test)
  "The teacher corrected our tests over the weekend.",
  // 478 u5 demonstrate
  "The teacher demonstrated the experiment.",
  // 479 u5 exhibition
  "We saw an art exhibition at the museum.",
  // 480 u5 experiment
  "We did an experiment with water and salt.",
  // 481 u5 experiment
  ["Scientists experimented with new medicines.", null, ["scientists"]],
  // 482 u5 full-time
  "My mother has a full-time job.",
  // 483 u5 gallery
  ["We visited an art gallery in Paris.", null, ["Paris"]],
  // 484 u5 habit
  ["Biting your nails is a bad habit.", null, ["biting", "nails"]],
  // 485 u5 hang up (something)
  ["Hang up your coat, please.", "phrase"],
  // 486 u5 in many ways
  ["In many ways, my sister is like my mother.", "phrase"],
  // 487 u5 lay (something) down
  ["Lay down your pens and listen.", "phrase"],
  // 488 u5 leisure
  "What do you do in your leisure time?",
  // 489 u5 magic
  "The children loved the magic show.",
  // 490 u5 make a face
  ["He made a face when he tasted the soup.", "phrase"],
  // 491 u5 partner
  "My dance partner is very good.",
  // 492 u5 photography
  "She is interested in photography.",
  // 493 u5 postpone (something)
  "We postponed the meeting until next week.",
  // 494 u5 press
  "Press this key to start the game.",
  // 495 u5 put up (something)
  ["Put up a picture on the wall.", "phrase"],
  // 496 u5 send (something) back
  ["The shirt was too small, so I sent it back.", "phrase"],
  // 497 u5 session
  "We have a training session every Monday.",
  // 498 u5 shadow
  "The tree gave us a cool shadow.",
  // 499 u5 so long as
  ["You can go out so long as you're home by ten.", "phrase"],
  // 500 u5 sunrise
  "We got up early to watch the sunrise.",
  // 501 u5 sunset
  "The sunset over the sea was beautiful.",
  // 502 u5 talk
  "The doctor gave a talk about healthy food.",
  // 503 u5 truly
  "I am truly sorry.",
  // 504 u5 turn (a page)
  ["Turn the page and read the next story.", "phrase"],
  // 505 u5 turn down
  ["He turned down the job offer.", "phrase"],
  // 506 u5 vision
  "She has a clear vision for the future.",
  // 507 u5 youth
  "My grandfather spent his youth in a village.",
  // 508 u5 aim
  "My aim is to finish the race.",
  // 509 u5 common sense
  ["Use your common sense!", "phrase"],
  // 510 u5 concentrate
  "I can't concentrate with all this noise.",
  // 511 u5 conclude
  "We concluded that the plan was too expensive.",
  // 512 u5 confident
  "I'm confident that we'll win the game.",
  // 513 u5 requirement
  "What are the requirements for this course?",
  // 514 u5 stress
  "The teacher stressed the importance of reading.",
  // 515 u5 voluntary
  "Joining the club is voluntary.",
  // 516 u6 branch
  "The bird is sitting on a branch.",
  // 517 u6 brief
  "He gave a brief answer.",
  // 518 u6 budget
  "We have a small budget for the party.",
  // 519 u6 captain
  "The captain of the boat spoke to the passengers.",
  // 520 u6 cent
  "This candy costs ninety cents.",
  // 521 u6 change (one's) mind
  ["I changed my mind; I'll have tea.", "phrase"],
  // 522 u6 circumstance
  "Under these circumstances, we can't go on the trip.",
  // 523 u6 consciousness
  ["He fell and lost consciousness for a minute.", "noun"],
  // 524 u6 consist of
  ["The test consists of three parts.", "phrase"],
  // 525 u6 count
  "Count to ten before you get angry.",
  // 526 u6 crew
  "The crew of the plane was very friendly.",
  // 527 u6 currency
  ["What is the currency of Japan?", null, ["Japan"]],
  // 528 u6 defense
  "The army is responsible for the defense of the country.",
  // 529 u6 edge
  ["Don't stand too close to the edge of the cliff.", null, ["cliff"]],
  // 530 u6 fall
  "He broke his arm in a fall.",
  // 531 u6 forever
  "I will love you forever.",
  // 532 u6 hope to
  ["I hope to see you soon.", "phrase"],
  // 533 u6 I guess
  ["I guess you're right.", "phrase"],
  // 534 u6 income
  "Their income is not very high.",
  // 535 u6 independence
  "The country fought for its independence.",
  // 536 u6 inner
  ["Meditation can bring inner peace.", null, ["meditation"]],
  // 537 u6 interest
  "I have a big interest in history.",
  // 538 u6 jungle
  ["Monkeys live in the jungle.", null, ["monkeys"]],
  // 539 u6 later on
  ["We will talk about it later on.", "phrase"],
  // 540 u6 lend
  ["Can you lend me five shekels?", null, ["shekels"]],
  // 541 u6 mainly
  "The students are mainly from this town.",
  // 542 u6 master
  ["He is a master of chess.", null, ["chess"]],
  // 543 u6 name
  ["They named the baby Noa.", null, ["Noa"]],
  // 544 u6 on foot
  ["We went to school on foot.", "phrase"],
  // 545 u6 outdoors
  "The children love playing outdoors.",
  // 546 u6 owe
  "I owe you ten dollars.",
  // 547 u6 pass
  "The time passed quickly.",
  // 548 u6 place
  "This is a nice place for a picnic.",
  // 549 u6 poem
  "We learned a poem by heart.",
  // 550 u6 port
  ["The boat left the port early in the morning.", null, ["dawn"]],
  // 551 u6 property
  "This land is private property.",
  // 552 u6 publication
  "The publication of the book was a big event.",
  // 553 u6 purpose
  "What is the purpose of your visit?",
  // 554 u6 recover
  "It took him a month to recover from the illness.",
  // 555 u6 reward
  "There is a reward for finding the lost dog.",
  // 556 u6 royal
  ["The royal family lives in a palace.", null, ["palace"]],
  // 557 u6 sail
  "We sailed to a small island.",
  // 558 u6 so far
  ["So far, everything is going well.", "phrase"],
  // 559 u6 store
  ["Store the milk in the fridge.", null, ["fridge"]],
  // 560 u6 suffer
  ["Many people suffer from back pain.", null, ["pain"]],
  // 561 u6 sum
  "He paid a large sum of money for the car.",
  // 562 u6 to begin with
  ["To begin with, I didn't like the new school.", "phrase"],
  // 563 u6 treasure
  ["The pirates buried the treasure on the island.", null, ["pirates", "buried"]],
  // 564 u6 valuable
  "Thank you for your valuable advice.",
  // 565 u6 without delay
  ["Please call the doctor without delay.", "phrase"],
  // 566 u6 wonder
  "I wonder why she didn't come.",
  // 567 u6 (a few hours) away
  ["The beach is a few hours away from here.", "phrase"],
  // 568 u6 apart
  "The two houses are far apart.",
  // 569 u6 approach
  "A man approached me and asked for directions.",
  // 570 u6 bandage
  "The nurse put a bandage on my arm.",
  // 571 u6 bandage
  ["The doctor bandaged my knee.", null, ["knee"]],
  // 572 u6 beneath
  "We stood on the bridge and looked at the river beneath.",
  // 573 u6 Bible
  "The Bible is a very old book.",
  // 574 u6 calendar
  "I wrote the date on the calendar.",
  // 575 u6 degree
  "It's thirty degrees today.",
  // 576 u6 delay
  "There was a long delay at the airport.",
  // 577 u6 delay
  "The flight was delayed by two hours.",
  // 578 u6 dependent
  "Young children are dependent on their parents.",
  // 579 u6 distant
  "We heard the sound of distant thunder.",
  // 580 u6 district
  "They live in a quiet district.",
  // 581 u6 entertainment
  "The city offers a lot of entertainment for families.",
  // 582 u6 entrance
  "Wait for me at the entrance to the museum.",
  // 583 u6 external
  "The external walls of the house are white.",
  // 584 u6 fall
  ["We visited New York in the fall.", null, ["York"]],
  // 585 u6 fall
  "Be careful not to fall.",
  // 586 u6 freedom
  "Freedom is very important to people.",
  // 587 u6 head back
  ["It's getting late; let's head back home.", "phrase"],
  // 588 u6 insult
  "His comment was an insult.",
  // 589 u6 insult
  "Don't insult my friends!",
  // 590 u6 iron
  "The gate is made of iron.",
  // 591 u6 label
  "Read the label on the bottle.",
  // 592 u6 label
  "We labeled the boxes with our names.",
  // 593 u6 not even
  ["I'm not even tired.", "phrase"],
  // 594 u6 nowhere
  "There was nowhere to sit.",
  // 595 u6 pile
  "There is a pile of books on my desk.",
  // 596 u6 pile
  "He piled the dishes in the sink.",
  // 597 u6 religion
  "We learned about religion in history class.",
  // 598 u6 ride
  ["We went for a ride on our bikes.", null, ["bikes"]],
  // 599 u6 ride
  "I ride my horse every weekend.",
  // 600 u6 root
  "The roots of the tree are very deep.",
  // 601 u6 seed
  "We planted seeds in the garden.",
  // 602 u6 silence
  "There was silence in the room.",
  // 603 u6 society
  ["We live in a modern society.", "noun"],
  // 604 u6 standard
  "Their work is of a high standard.",
  // 605 u6 tax
  "Everyone has to pay tax.",
  // 606 u6 tax
  ["The government taxes cigarettes.", null, ["cigarettes"]],
  // 607 u6 tip
  "Here's a tip: read the questions first.",
  // 608 u6 tip
  "We tipped the waiter.",
  // 609 u6 totally
  "I totally agree with you.",
  // 610 u6 trade
  "Trade between the two countries grew.",
  // 611 u6 trade
  "The boys traded football cards.",
  // 612 u6 upper
  "The bedrooms are on the upper floor.",
  // 613 u6 amaze
  "Her beautiful voice amazed the audience.",
  // 614 u6 appreciate
  "I appreciate your help.",
  // 615 u6 can't help
  ["I can't help laughing when I see that movie.", "phrase"],
  // 616 u6 clearly
  ["Please speak clearly.", "adverb"],
  // 617 u6 figure
  "The figure shows the number of students in each class.",
  // 618 u6 goal
  "He got the winning goal.",
  // 619 u6 if only
  ["If only I had more time!", "phrase"],
  // 620 u6 if so
  ["Are you coming? If so, hurry up.", "phrase"],
  // 621 u6 obviously
  "Obviously, he didn't do his homework.",
  // 622 u6 variety
  "There is a wide variety of food at the market.",
  // 623 u7 absent
  "Three students were absent today.",
  // 624 u7 accommodation
  "The hotel offers cheap accommodation.",
  // 625 u7 anniversary
  "Today is my parents' wedding anniversary.",
  // 626 u7 architect
  "The architect designed a modern building.",
  // 627 u7 balance
  "I lost my balance and fell.",
  // 628 u7 be dying to
  ["I'm dying to see the new movie.", "phrase"],
  // 629 u7 be short of
  ["We are short of time; let's hurry.", "phrase"],
  // 630 u7 board
  "The teacher wrote on the board.",
  // 631 u7 bookcase
  "There is a big bookcase in my room.",
  // 632 u7 break a record
  ["She broke the world record.", "phrase"],
  // 633 u7 column
  "Read the article in the second column.",
  // 634 u7 common
  ["\"Cohen\" is a common name in Israel.", null, ["Cohen"]],
  // 635 u7 conference
  ["The teachers went to a conference in Jerusalem.", null, ["Jerusalem"]],
  // 636 u7 content
  ["I like the content of this website.", null, ["website"]],
  // 637 u7 documentary
  ["We watched a documentary about whales.", null, ["whales"]],
  // 638 u7 eastern
  "The eastern part of the country is dry.",
  // 639 u7 either ... or
  ["You can have either cake or ice cream.", "phrase"],
  // 640 u7 flavor
  "What is your favorite flavor of ice cream?",
  // 641 u7 flow
  "The river flows into the sea.",
  // 642 u7 frame
  "I put the photo in a frame.",
  // 643 u7 get used to
  ["I can't get used to waking up so early.", "phrase"],
  // 644 u7 give birth
  ["Our cat gave birth to four kittens.", "phrase", ["kittens"]],
  // 645 u7 golden
  "She has beautiful golden hair.",
  // 646 u7 grounds
  "The school grounds are very big.",
  // 647 u7 hot
  "It's very hot today.",
  // 648 u7 introduction
  "Read the introduction to the book.",
  // 649 u7 join
  "Can I join you for lunch?",
  // 650 u7 lean (something) against
  ["He leaned his bike against the wall.", "phrase", ["bike"]],
  // 651 u7 line
  "There was a long line at the bank.",
  // 652 u7 mile
  "We walked two miles to the beach.",
  // 653 u7 mix
  ["The cake is a mix of chocolate and vanilla.", null, ["vanilla"]],
  // 654 u7 occasion
  "A birthday is a happy occasion.",
  // 655 u7 pattern
  "I like the pattern on your shirt.",
  // 656 u7 plan
  "What's your plan for the weekend?",
  // 657 u7 prince
  ["The prince lived in a big castle.", null, ["castle"]],
  // 658 u7 reception
  "The reception was in a beautiful garden.",
  // 659 u7 seek
  "They are seeking a new manager.",
  // 660 u7 shine
  "The sun is shining.",
  // 661 u7 shortly afterward
  ["We had dinner, and shortly afterward my uncle arrived.", "phrase"],
  // 662 u7 slim
  "She is tall and slim.",
  // 663 u7 spicy
  "I don't like spicy food.",
  // 664 u7 statue
  "There is a statue of a horse in the park.",
  // 665 u7 surround
  "The house is surrounded by trees.",
  // 666 u7 swallow
  ["It is hard for me to swallow pills.", null, ["pills"]],
  // 667 u7 the other week
  ["I saw your brother the other week.", "phrase"],
  // 668 u7 the sights
  ["We saw all the sights in Rome.", "phrase", ["Rome"]],
  // 669 u7 tower
  "We climbed to the top of the tower.",
  // 670 u7 ugly
  "What an ugly hat!",
  // 671 u7 use
  "This old phone is of no use to me.",
  // 672 u7 vegetarian
  "I eat vegetarian food.",
  // 673 u7 vegetarian
  "My sister is a vegetarian; she doesn't eat meat.",
  // 674 u7 abstract
  "I don't understand abstract art.",
  // 675 u7 academic
  "She has excellent academic grades.",
  // 676 u7 authority
  "The city authority built a new road.",
  // 677 u7 basis
  "We meet on a daily basis.",
  // 678 u7 be known as
  ["New York is known as the Big Apple.", "phrase", ["York"]],
  // 679 u7 belong to
  ["This bag belongs to me.", "phrase"],
  // 680 u7 birth
  "What is your date of birth?",
  // 681 u7 burn
  "Be careful not to burn your hand.",
  // 682 u7 conflict
  "The two countries are in conflict.",
  // 683 u7 culture
  "In our culture, families eat together on Friday nights.",
  // 684 u7 display
  "There was a display of old cars at the museum.",
  // 685 u7 display
  "The shop displays its new clothes in the window.",
  // 686 u7 fault
  "It's not my fault!",
  // 687 u7 length
  "What is the length of the river?",
  // 688 u7 lose
  "Don't lose your keys!",
  // 689 u7 loss
  "The loss of his dog made him very sad.",
  // 690 u7 make (someone do something)
  ["My mother made me clean my room.", "phrase"],
  // 691 u7 method
  "We need a better method of learning words.",
  // 692 u7 next
  "What should I do next?",
  // 693 u7 occur
  "When did the accident occur?",
  // 694 u7 once again
  ["Once again, he forgot his homework.", "phrase"],
  // 695 u7 relative
  "We visited our relatives in the north.",
  // 696 u7 studio
  "The band recorded the song in a studio.",
  // 697 u7 talent
  "She has a talent for music.",
  // 698 u7 thirst
  "After the long walk, we suffered from thirst.",
  // 699 u7 useless
  "This old phone is useless.",
  // 700 u7 violence
  ["There is too much violence on TV.", "noun", ["TV"]],
  // 701 u7 whether
  ["I don't know whether he is coming.", "conjunction"],
  // 702 u7 work
  "My mother goes to work at eight.",
  // 703 u7 have no idea
  ["I have no idea where my phone is.", "phrase"],
  // 704 u7 I'm sorry I can't
  ["I'm sorry I can't come to your party.", "phrase"],
  // 705 u7 thanks
  "Many thanks for your help.",
  // 706 u7 the matter
  ["What's the matter? You look sad.", "phrase"],
  // 707 u7 things like that
  ["I like reading, drawing and things like that.", "phrase"],
  // 708 u7 would love
  ["I would love to visit Japan.", "phrase", ["Japan"]],
];
