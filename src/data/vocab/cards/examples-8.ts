// Grade 8 word-card examples (New Directions Plus), one per entry of GRADE_8_VOCAB, in the same order.
// Each sentence uses only Band I + grade 7–8 textbook words + function words (npm run check:content).
// Entry: "sentence" or ["sentence", partOfSpeech (when the list has none), extra allowed words?].
import type { ExampleSpec } from "@/data/vocab/cards/index";

export const GRADE_8_EXAMPLES: ExampleSpec[] = [
  // 0 u1 adventure
  "Our trip to the island was a real adventure.",
  // 1 u1 approximately
  "The trip takes approximately two hours.",
  // 2 u1 avoid
  "Try to avoid sugar before bedtime.",
  // 3 u1 base
  "The base of the glass is made of wood.",
  // 4 u1 by the way
  ["By the way, did you finish the project?", "phrase"],
  // 5 u1 café
  "Let's meet at the café near the park.",
  // 6 u1 capital
  ["Jerusalem is the capital of Israel.", null, ["Jerusalem"]],
  // 7 u1 chance
  "There is a good chance of rain today.",
  // 8 u1 click
  "Click on the picture to see it bigger.",
  // 9 u1 combine
  "Combine the eggs and the flour in a bowl.",
  // 10 u1 combination
  "Chocolate and banana is my favorite combination.",
  // 11 u1 communicate
  "We communicate with our friends abroad online.",
  // 12 u1 communication
  "Good communication is important in a team.",
  // 13 u1 competition
  "She won first prize in the cooking competition.",
  // 14 u1 cooking
  "My father does most of the cooking at home.",
  // 15 u1 cream
  "I like cake with cream.",
  // 16 u1 culture
  ["In Japan I learned a lot about a new culture.", null, ["Japan"]],
  // 17 u1 decorate
  "We decorated the classroom for the holiday.",
  // 18 u1 decoration
  "The decorations on the table were beautiful.",
  // 19 u1 dish
  "Rice with chicken is my favorite dish.",
  // 20 u1 download
  "You can download the song from the internet.",
  // 21 u1 drum
  "My brother plays the drums in a band.",
  // 22 u1 flour
  "You need flour, sugar and eggs to make a cake.",
  // 23 u1 in order to
  ["I study hard in order to get good grades.", "phrase"],
  // 24 u1 ingredient
  "Read the list of ingredients before you start cooking.",
  // 25 u1 island
  ["We spent our vacation on a Greek island.", null, ["Greek"]],
  // 26 u1 label
  "Read the label before you buy the food.",
  // 27 u1 locate
  ["This app helps you locate the hotel.", null, ["app"]],
  // 28 u1 location
  "The location of the new school is very good.",
  // 29 u1 loud
  "The music is too loud; please turn it down.",
  // 30 u1 make sure
  ["Make sure you close the door when you leave.", "phrase"],
  // 31 u1 pour
  "Pour the milk into the glass.",
  // 32 u1 range
  "The shop has a wide range of shoes.",
  // 33 u1 remember to
  ["Remember to bring a towel tomorrow.", "phrase", ["towel"]],
  // 34 u1 rich
  "He is a rich man with three cars.",
  // 35 u1 river
  "We walked along the river.",
  // 36 u1 sense
  "You have a good sense of fun.",
  // 37 u1 shopping
  "I go shopping with my mother on Fridays.",
  // 38 u1 sound
  "Your idea sounds great!",
  // 39 u1 step
  "Follow the instructions step by step.",
  // 40 u1 traditional
  "We ate a traditional meal on the holiday.",
  // 41 u1 traffic
  "There is a lot of traffic in the morning.",
  // 42 u1 used to
  "I used to live in a small village.",
  // 43 u1 western
  "Many western countries have cold winters.",
  // 44 u1 admire
  "I admire my grandmother because she is so brave.",
  // 45 u1 advertise
  "The shop advertises its sales on the radio.",
  // 46 u1 budget
  ["Our budget for the trip is two thousand shekels.", null, ["shekels"]],
  // 47 u1 business
  "My uncle has a small business in the city.",
  // 48 u1 calendar
  "I wrote the date of the test on my calendar.",
  // 49 u1 cent
  "This candy costs fifty cents.",
  // 50 u1 century
  "This house is more than a century old.",
  // 51 u1 change
  "We changed our plans because of the rain.",
  // 52 u1 charge
  "The hotel charges extra for breakfast.",
  // 53 u1 coin
  "I found a coin on the floor.",
  // 54 u1 concert
  "We went to a concert in the park last night.",
  // 55 u1 corner
  "The bus stop is on the corner of the street.",
  // 56 u1 credit card
  "Can I pay by credit card?",
  // 57 u1 currency
  ["The currency of the USA is the dollar.", null, ["USA"]],
  // 58 u1 entire
  "We spent the entire day at the beach.",
  // 59 u1 establish
  "The school was established in 1950.",
  // 60 u1 expense
  "Food is our biggest expense.",
  // 61 u1 factory
  "My father works in a car factory.",
  // 62 u1 flag
  "The flag of Israel is blue and white.",
  // 63 u1 found
  "My grandfather founded this company sixty years ago.",
  // 64 u1 go back
  "I want to go back to the hotel; I'm tired.",
  // 65 u1 industry
  ["The film industry in India is very big.", null, ["India"]],
  // 66 u1 latest
  "Have you seen his latest movie?",
  // 67 u1 link
  "There is a strong link between sleep and good grades.",
  // 68 u1 look around
  ["We looked around the old market.", "phrase"],
  // 69 u1 major
  "This is a major road in the city.",
  // 70 u1 mark
  "The teacher marked our tests.",
  // 71 u1 northern
  "It snows in the northern part of the country.",
  // 72 u1 obvious
  "It was obvious that she was angry.",
  // 73 u1 possibly
  "Can you possibly help me with this box?",
  // 74 u1 rainy
  "It was a rainy day, so we stayed at home.",
  // 75 u1 wave
  "The children waved at the passing train.",
  // 76 u1 wonder if
  "I wonder if he will come to the party.",
  // 77 u1 wool
  "This warm hat is made of wool.",
  // 78 u1 a quarter to
  ["The movie starts at a quarter to eight.", "phrase"],
  // 79 u1 discount
  "Students get a discount at the museum.",
  // 80 u1 enjoy oneself / yourself
  ["Did you enjoy yourself at the party?", "phrase"],
  // 81 u1 extra
  "You have to pay extra for a bigger room.",
  // 82 u1 here you are
  ["\"Can I have the salt?\" \"Here you are.\"", "phrase"],
  // 83 u1 how long
  ["How long does it take to get to school?", "phrase"],
  // 84 u1 how much
  ["How much does this shirt cost?", "phrase"],
  // 85 u1 I see
  ["\"The bus is late again.\" \"I see.\"", "phrase"],
  // 86 u1 last
  "The movie lasted three hours.",
  // 87 u1 percent
  "Ninety percent of the students passed the test.",
  // 88 u1 row
  "We sat in the first row at the theater.",
  // 89 u2 accent
  ["She speaks English with a French accent.", null, ["French"]],
  // 90 u2 accompany
  "My mother accompanied me to the doctor.",
  // 91 u2 accurate
  "The weather report was not accurate.",
  // 92 u2 achievement
  "Finishing the race was a great achievement for me.",
  // 93 u2 actor
  "He is my favorite actor.",
  // 94 u2 actually
  "I thought the film was bad, but actually it was good.",
  // 95 u2 afraid
  "My little sister is afraid of dogs.",
  // 96 u2 airport
  "We arrived at the airport two hours before the flight.",
  // 97 u2 alter
  "We altered our plans because of the weather.",
  // 98 u2 appreciate
  "I really appreciate your help.",
  // 99 u2 basic
  "You only need basic English for this job.",
  // 100 u2 behave
  "The children behaved very well on the trip.",
  // 101 u2 camera
  "I took many photos with my new camera.",
  // 102 u2 chat
  "I like to chat with my friends after school.",
  // 103 u2 childhood
  "I had a happy childhood in a small village.",
  // 104 u2 contact
  "You can contact me by phone or by mail.",
  // 105 u2 detail
  "Tell me every detail of your trip!",
  // 106 u2 each other
  ["The two friends hugged each other.", "pronoun"],
  // 107 u2 emotional
  "It was an emotional moment for the whole family.",
  // 108 u2 exactly
  "That is exactly what I wanted!",
  // 109 u2 expert
  "He is an expert on computers.",
  // 110 u2 get along with
  ["I get along with all my classmates.", "phrase"],
  // 111 u2 gloves
  "Wear your gloves; it's cold outside.",
  // 112 u2 hairdryer
  "Can I use your hairdryer?",
  // 113 u2 handbag
  "She put her phone in her handbag.",
  // 114 u2 horrible
  "The food at that restaurant was horrible.",
  // 115 u2 huge
  "An elephant is a huge animal.",
  // 116 u2 minor
  "It's only a minor problem; don't worry.",
  // 117 u2 movie theater
  "We watched the new film at the movie theater.",
  // 118 u2 operate
  "Do you know how to operate this camera?",
  // 119 u2 pleased
  "I was very pleased with my grade.",
  // 120 u2 police station
  "They took the man to the police station.",
  // 121 u2 railway station
  "Meet me at the railway station at five.",
  // 122 u2 record
  "We recorded a song for the school show.",
  // 123 u2 research
  "This research shows that sleep is important.",
  // 124 u2 seaside
  "We spent a week at the seaside.",
  // 125 u2 significant
  "There is a significant difference between the two books.",
  // 126 u2 southern
  "The southern part of Israel is very hot.",
  // 127 u2 spaceship
  ["In the movie, the spaceship landed on Mars.", null, ["Mars"]],
  // 128 u2 surprise
  "The news surprised everyone.",
  // 129 u2 swimming pool
  "There is a swimming pool in our hotel.",
  // 130 u2 technology
  "New technology helps us in our daily life.",
  // 131 u2 traffic jam
  "We sat in a traffic jam for an hour.",
  // 132 u2 afford
  "We can't afford a new car this year.",
  // 133 u2 apologize
  "I apologize for being late.",
  // 134 u2 be responsible for
  ["Who is responsible for feeding the dog?", "phrase"],
  // 135 u2 blame
  "Don't blame me; I didn't do it.",
  // 136 u2 condition
  "The old car is still in good condition.",
  // 137 u2 contract
  "The football player signed a new contract.",
  // 138 u2 convince
  "I couldn't convince my father to buy me a dog.",
  // 139 u2 director
  "The director of the movie won a prize.",
  // 140 u2 doubt
  "There is no doubt that she is the best player.",
  // 141 u2 encourage
  "My parents always encourage me to read.",
  // 142 u2 enemy
  "In the story, the king fights his enemy.",
  // 143 u2 even
  ["Even my grandfather uses a smartphone.", null, ["smartphone"]],
  // 144 u2 extremely
  "It was extremely hot yesterday.",
  // 145 u2 fight
  "There was a fight between two boys after school.",
  // 146 u2 hug
  "She hugged her mother at the airport.",
  // 147 u2 hunger
  ["Many people around the world still suffer from hunger.", null, ["suffer"]],
  // 148 u2 invent
  "Who invented the telephone?",
  // 149 u2 lie
  "Don't tell lies; always tell the truth.",
  // 150 u2 make up
  ["He made up a story about a dragon.", "phrase", ["dragon"]],
  // 151 u2 minister
  "The minister visited our school.",
  // 152 u2 opening
  "We went to the opening of the new museum.",
  // 153 u2 otherwise
  ["Take your coat; otherwise you will be cold.", "conjunction"],
  // 154 u2 play
  "Our class is putting on a play.",
  // 155 u2 president
  "The president spoke on the news.",
  // 156 u2 role
  "She has the main role in the movie.",
  // 157 u2 stage
  "The actors came onto the stage.",
  // 158 u2 star
  "He is a big movie star.",
  // 159 u2 tax
  "Everyone has to pay tax.",
  // 160 u2 tell (a story)
  "Grandfather told us a story about his childhood.",
  // 161 u2 terrible
  "We had terrible weather on our vacation.",
  // 162 u2 title
  "What is the title of the book?",
  // 163 u2 truth
  "Please tell me the truth.",
  // 164 u2 twice
  "I've seen this movie twice.",
  // 165 u2 upset
  "She was upset because she lost her phone.",
  // 166 u2 a shame
  ["It's a shame you can't come with us.", "phrase"],
  // 167 u2 be crazy about
  ["My brother is crazy about football.", "phrase"],
  // 168 u2 book
  "We booked a room at the hotel.",
  // 169 u2 can't wait
  ["I can't wait for the summer vacation!", "phrase"],
  // 170 u2 in time
  ["We got to the station just in time.", "phrase"],
  // 171 u2 Oh no!
  ["Oh no! I forgot my keys!", "phrase"],
  // 172 u2 online
  "I bought the tickets online.",
  // 173 u2 pick up
  ["Can you pick me up from school at four?", "phrase"],
  // 174 u2 sound(s) good / interesting / strange
  ["A trip to the beach sounds good.", "phrase"],
  // 175 u3 active
  "My grandmother is very active; she walks every day.",
  // 176 u3 apology (for)
  "He made an apology for his behavior.",
  // 177 u3 as well
  ["I want a sandwich, and a drink as well.", "phrase"],
  // 178 u3 be familiar with
  ["Are you familiar with this song?", "phrase"],
  // 179 u3 bear
  "I can't bear the noise any longer.",
  // 180 u3 beat
  "Our team beat them three to one.",
  // 181 u3 belong to
  ["This bag belongs to my sister.", "phrase"],
  // 182 u3 blame (for)
  "He took the blame for the broken window.",
  // 183 u3 bully
  "The bully took my lunch money.",
  // 184 u3 bully
  "It is wrong to bully other students.",
  // 185 u3 case
  "In that case, I'll stay at home.",
  // 186 u3 claim
  ["He claims that he saw a ghost.", null, ["ghost"]],
  // 187 u3 confidence
  "She speaks in front of the class with confidence.",
  // 188 u3 cry (for)
  ["The baby cried for his mother.", "phrase"],
  // 189 u3 deal with
  ["I don't know how to deal with this problem.", "phrase"],
  // 190 u3 demand (for)
  ["There is a big demand for teachers.", "phrase"],
  // 191 u3 differ (from)
  ["My opinion differs from yours.", "phrase"],
  // 192 u3 e.g.
  ["I like fruit, e.g. apples and bananas.", "phrase"],
  // 193 u3 figure
  "He is an important figure in the history of Israel.",
  // 194 u3 find out
  "I want to find out more about the planets.",
  // 195 u3 give in
  "He asked many times, so his mother finally gave in.",
  // 196 u3 in addition
  ["The hotel has a pool. In addition, it has a gym.", "phrase", ["gym"]],
  // 197 u3 kick
  "He gave the ball a strong kick.",
  // 198 u3 lack (of)
  "I'm tired because of lack of sleep.",
  // 199 u3 leave out
  "Don't leave out any details.",
  // 200 u3 look
  "You look tired today.",
  // 201 u3 maintenance (of)
  "The maintenance of the park costs a lot of money.",
  // 202 u3 majority (of)
  ["The majority of the students voted for Dana.", null, ["voted"]],
  // 203 u3 more and more
  ["More and more people work from home.", "phrase"],
  // 204 u3 overseas
  "There are many overseas students at the university.",
  // 205 u3 principal
  "The principal reason for the trip is to learn.",
  // 206 u3 push
  "Give the door a push.",
  // 207 u3 refuse
  "He refused to help me.",
  // 208 u3 regular
  "Regular exercise is good for you.",
  // 209 u3 side
  "Which side are you on?",
  // 210 u3 social
  "Humans are social animals.",
  // 211 u3 source (of)
  "The sun is a source of energy.",
  // 212 u3 strike
  "The clock struck twelve.",
  // 213 u3 tend (to)
  "I tend to get up late on weekends.",
  // 214 u3 through
  ["We walked through the forest.", "preposition"],
  // 215 u3 treat
  "Please treat the animals well.",
  // 216 u3 unable
  ["I was unable to come to school because I was sick.", "adverb"],
  // 217 u3 unfriendly
  "The new neighbor seems unfriendly.",
  // 218 u3 victim
  "The police helped the victims of the accident.",
  // 219 u3 a number of
  ["A number of students were late today.", "phrase"],
  // 220 u3 affect
  "The weather can affect how you feel.",
  // 221 u3 aim
  "We aim to finish the project by Friday.",
  // 222 u3 anticipate
  "We anticipate a lot of visitors this summer.",
  // 223 u3 as soon as
  ["Call me as soon as you get home.", "phrase"],
  // 224 u3 at present
  ["At present, my uncle lives in London.", "phrase", ["London"]],
  // 225 u3 attitude
  "She has a positive attitude to life.",
  // 226 u3 be off
  ["I'm off to school now; see you later!", "phrase"],
  // 227 u3 behavior
  "The teacher was happy with the students' behavior.",
  // 228 u3 can
  ["Please put the cans in the recycling bin.", null, ["recycling", "bin"]],
  // 229 u3 case
  "In that case, we'll take the bus.",
  // 230 u3 comment
  "The teacher wrote a comment on my work.",
  // 231 u3 connect
  "Connect the camera to the computer.",
  // 232 u3 create
  "The children created a beautiful picture together.",
  // 233 u3 desk
  "My books are on my desk.",
  // 234 u3 develop
  "Doctors are developing a new medicine.",
  // 235 u3 devote
  "She devotes all her free time to music.",
  // 236 u3 direction
  "Which direction is the beach?",
  // 237 u3 fair
  "It's not fair; he always gets the bigger piece!",
  // 238 u3 feature
  "The best feature of this phone is the camera.",
  // 239 u3 fight
  "The two dogs fought over a ball.",
  // 240 u3 goal
  "My goal is to learn to play the guitar.",
  // 241 u3 immediate
  "We need an immediate answer.",
  // 242 u3 in actual fact
  ["He looks rich, but in actual fact he has no money.", "phrase"],
  // 243 u3 moment
  "Wait a moment, I'm coming!",
  // 244 u3 part of
  ["Music is an important part of my life.", "phrase"],
  // 245 u3 potential
  "This young player has great potential.",
  // 246 u3 so
  "I was so tired that I fell asleep.",
  // 247 u3 somehow
  "Somehow, I always lose my keys.",
  // 248 u3 text
  "Read the text and answer the questions.",
  // 249 u3 watch
  "My watch shows ten o'clock.",
  // 250 u3 worried
  "My mother was worried because I came home late.",
  // 251 u3 all the time
  ["My little brother asks questions all the time.", "phrase"],
  // 252 u3 be wrong
  ["You are wrong; the answer is seven.", "phrase"],
  // 253 u3 couldn't help it
  ["I laughed at the story; I couldn't help it.", "phrase"],
  // 254 u3 (it's a) deal
  ["\"I'll do the dishes if you cook.\" \"It's a deal!\"", "phrase"],
  // 255 u3 if you like
  ["We can go to the beach tomorrow, if you like.", "phrase"],
  // 256 u3 mean to
  ["I didn't mean to break your glass.", "phrase"],
  // 257 u3 that depends
  ["\"Are you coming?\" \"That depends on the weather.\"", "phrase"],
  // 258 u4 adapt
  "Animals adapt to the cold in winter.",
  // 259 u4 adequate
  "There isn't adequate light in this room for reading.",
  // 260 u4 agree
  "I agree with you.",
  // 261 u4 aim
  "The aim of the game is to get the ball into the goal.",
  // 262 u4 allow
  "My parents don't allow me to stay out late.",
  // 263 u4 argue
  "My brother and I always argue about the computer.",
  // 264 u4 around
  "We walked around the city all day.",
  // 265 u4 attack
  "The dog attacked the cat.",
  // 266 u4 beside
  ["Come and sit beside me.", "preposition"],
  // 267 u4 bring back
  ["Please bring back my book tomorrow.", "phrase"],
  // 268 u4 cause
  ["Heavy rain caused floods in the north.", null, ["floods"]],
  // 269 u4 come back
  ["Come back soon!", "phrase"],
  // 270 u4 confident
  "I am confident that we will win.",
  // 271 u4 demand
  "The workers demanded more money.",
  // 272 u4 despite
  ["We went to the beach despite the rain.", "preposition"],
  // 273 u4 disease
  "Doctors are fighting the disease.",
  // 274 u4 escape
  ["The bird escaped from its cage.", null, ["cage"]],
  // 275 u4 expensive
  "This restaurant is too expensive for us.",
  // 276 u4 force
  "The rain forced us to stay inside.",
  // 277 u4 go ahead
  ["\"Can I ask a question?\" \"Go ahead.\"", "phrase"],
  // 278 u4 go away
  ["Go away! I'm busy.", "phrase"],
  // 279 u4 head
  "He hit his head on the door.",
  // 280 u4 help oneself
  ["Please help yourself to some cake.", "phrase"],
  // 281 u4 hold up
  ["Hold up your hand if you know the answer.", "phrase"],
  // 282 u4 introduce
  ["Let me introduce my friend, Noa.", null, ["Noa"]],
  // 283 u4 lake
  "We swam in the lake.",
  // 284 u4 look after
  ["My grandmother looks after my little sister.", "phrase"],
  // 285 u4 make (something) into
  ["We made the old room into an office.", "phrase"],
  // 286 u4 nearby
  "Is there a shop nearby?",
  // 287 u4 noisy
  "The classroom was very noisy.",
  // 288 u4 occur
  "The accident occurred at night.",
  // 289 u4 option
  "You have two options: stay or go.",
  // 290 u4 permanent
  "This is not a permanent job; it's only for the summer.",
  // 291 u4 plan to
  "We plan to visit our grandparents next week.",
  // 292 u4 property
  "This house is the property of my uncle.",
  // 293 u4 region
  "It often rains in this region.",
  // 294 u4 relax
  "I like to relax in the garden after school.",
  // 295 u4 release
  "The band will release a new song next week.",
  // 296 u4 rise
  "There was a rise in prices this year.",
  // 297 u4 satisfied
  "Are you satisfied with your new phone?",
  // 298 u4 space
  "There isn't enough space in my bag.",
  // 299 u4 surprisingly
  "Surprisingly, the test was easy.",
  // 300 u4 take away
  ["The waiter took away our plates.", "phrase"],
  // 301 u4 temporary
  "This is only a temporary home for the dog.",
  // 302 u4 to do with
  ["The movie has something to do with space.", "phrase"],
  // 303 u4 trend
  "Short movies are the latest trend online.",
  // 304 u4 abroad
  "My sister is studying abroad.",
  // 305 u4 add
  "Add some salt to the soup.",
  // 306 u4 aid
  ["The Red Cross gives aid to people in need.", null, ["Cross"]],
  // 307 u4 blind
  "The blind man walked with his dog.",
  // 308 u4 border
  ["We crossed the border into Jordan.", null, ["Jordan"]],
  // 309 u4 brave
  ["The brave firefighter saved the child.", null, ["firefighter"]],
  // 310 u4 channel
  "Change the channel; this show is not interesting.",
  // 311 u4 comfort
  "My dog is a great comfort to me.",
  // 312 u4 community
  "Our community built a new park.",
  // 313 u4 concern
  "My main concern is the cost of the trip.",
  // 314 u4 concerned
  "We are concerned about the environment.",
  // 315 u4 cover
  "Snow covered the mountains.",
  // 316 u4 destroy
  "The storm destroyed many houses.",
  // 317 u4 few
  "Very few people came to the meeting.",
  // 318 u4 fit
  "He runs every day to keep fit.",
  // 319 u4 flat
  ["I need to pump up my flat tire.", null, ["pump", "tire"]],
  // 320 u4 gun
  "The soldier carried a gun.",
  // 321 u4 gunfire
  "We heard gunfire in the distance.",
  // 322 u4 institution
  "A university is an institution for higher learning.",
  // 323 u4 jet
  "A jet flew over our house.",
  // 324 u4 joy
  "She jumped for joy when she heard the news.",
  // 325 u4 killing
  ["The killing of animals for their fur is wrong.", null, ["fur"]],
  // 326 u4 kind
  "It was very kind of you to help me.",
  // 327 u4 offer
  "They offered me a job.",
  // 328 u4 philosophy
  "My uncle studied philosophy at university.",
  // 329 u4 point of view
  ["From my point of view, the movie was great.", "phrase"],
  // 330 u4 provide
  "The school provides lunch for all the students.",
  // 331 u4 shoot
  "Don't shoot! I give up!",
  // 332 u4 silly
  "Don't be silly!",
  // 333 u4 society
  "We live in a modern society.",
  // 334 u4 take care of
  ["Please take care of my cat while I'm away.", "phrase"],
  // 335 u4 as soon as possible
  ["Please answer my message as soon as possible.", "phrase"],
  // 336 u4 desert
  ["Camels can live in the desert.", null, ["camels"]],
  // 337 u4 exercise
  "I exercise three times a week.",
  // 338 u4 feather
  "The bird lost a feather.",
  // 339 u4 fly
  "There is a fly in my soup!",
  // 340 u4 insect
  ["An ant is a small insect.", null, ["ant"]],
  // 341 u4 obviously
  "Obviously, I can't swim in a winter coat!",
  // 342 u4 Of course!
  ["\"Can you help me?\" \"Of course!\"", "phrase"],
  // 343 u4 Of course not!
  ["\"Are you angry with me?\" \"Of course not!\"", "phrase"],
  // 344 u4 on time
  ["The train left on time.", "phrase"],
  // 345 u4 once in a while
  ["We go to the cinema once in a while.", "phrase"],
  // 346 u4 path
  "We followed the path through the forest.",
  // 347 u4 wheel
  "My bicycle has a broken wheel.",
  // 348 u5 argument
  "They had an argument about money.",
  // 349 u5 assure
  "I assure you that everything is fine.",
  // 350 u5 beauty
  "We admired the beauty of the mountains.",
  // 351 u5 beyond
  ["The village is just beyond the hill.", "preposition"],
  // 352 u5 boyfriend
  "Her boyfriend is in the army.",
  // 353 u5 carry on
  ["Carry on with your work, please.", "phrase"],
  // 354 u5 death
  "The death of his dog made him very sad.",
  // 355 u5 differently
  "Everyone thinks differently.",
  // 356 u5 disagree
  "I disagree with you about this movie.",
  // 357 u5 duty
  "It's our duty to help people in need.",
  // 358 u5 education
  "Education is very important for the future.",
  // 359 u5 everyday
  "Cooking is an everyday activity in our house.",
  // 360 u5 excite
  "The news excited the children.",
  // 361 u5 factor
  "Money was an important factor in our choice.",
  // 362 u5 faith
  "Never lose faith in yourself.",
  // 363 u5 form
  "Ice is a form of water.",
  // 364 u5 format
  "What is the format of the test?",
  // 365 u5 friendship
  "Our friendship started in first grade.",
  // 366 u5 general
  "I have a general idea of the plan.",
  // 367 u5 girlfriend
  ["His girlfriend lives in Haifa.", null, ["Haifa"]],
  // 368 u5 including
  ["Ten people came, including my uncle.", "preposition"],
  // 369 u5 independent
  "My older sister is very independent.",
  // 370 u5 largely
  "The trip was largely a success.",
  // 371 u5 magazine
  "I read a magazine on the bus.",
  // 372 u5 make a difference
  ["Small actions can make a difference.", "phrase"],
  // 373 u5 message
  "I sent you a message this morning.",
  // 374 u5 mind
  "I can't get the song out of my mind.",
  // 375 u5 on one's own
  ["My little brother can't stay at home on his own.", "phrase"],
  // 376 u5 one another
  ["The players helped one another.", "pronoun"],
  // 377 u5 ought
  ["You ought to see a doctor.", "verb"],
  // 378 u5 perfectly
  "The dress fits perfectly.",
  // 379 u5 power
  "The power went out during the storm.",
  // 380 u5 rather than
  ["I'll walk rather than wait for the bus.", "phrase"],
  // 381 u5 relationship
  "She has a good relationship with her parents.",
  // 382 u5 teenager
  "When I was a teenager, I loved loud music.",
  // 383 u5 that
  ["This is the book that I told you about.", "pronoun"],
  // 384 u5 theory
  ["Darwin's theory is about how animals change.", null, ["Darwin"]],
  // 385 u5 tune
  ["She whistled a happy tune.", null, ["whistled"]],
  // 386 u5 value
  "I value your opinion.",
  // 387 u5 variety
  "We have a variety of games for children.",
  // 388 u5 various
  "There are various ways to solve this problem.",
  // 389 u5 whenever
  "Come and visit us whenever you like.",
  // 390 u5 access (to)
  "All students have access to the computers.",
  // 391 u5 adjust
  "Adjust the seat before you start driving.",
  // 392 u5 announce
  "They announced the winners on the radio.",
  // 393 u5 below
  "It is so cold that the water below is ice.",
  // 394 u5 cap
  "He wore a red cap.",
  // 395 u5 channel
  "What's on channel two tonight?",
  // 396 u5 code
  "You need a code to open the door.",
  // 397 u5 direct
  "Can you direct me to the station?",
  // 398 u5 election
  "Who won the election?",
  // 399 u5 employ
  "The factory employs two hundred people.",
  // 400 u5 energy
  ["Solar energy comes from the sun.", null, ["solar"]],
  // 401 u5 get married
  ["My cousin is getting married next month.", "phrase", ["cousin"]],
  // 402 u5 get on with
  ["How do you get on with your new neighbors?", "phrase"],
  // 403 u5 household
  ["Every household should recycle.", null, ["recycle"]],
  // 404 u5 instruction
  "Follow the instructions carefully.",
  // 405 u5 jacket
  "Take a jacket; it may get cold.",
  // 406 u5 look at
  ["Look at this beautiful picture!", "phrase"],
  // 407 u5 measure
  ["A meter is a measure of length.", null, ["meter", "length"]],
  // 408 u5 nationality
  "What is your nationality?",
  // 409 u5 obey
  "Dogs must learn to obey.",
  // 410 u5 party
  ["My father voted for a new party.", null, ["voted"]],
  // 411 u5 perform
  "The students performed a dance at the show.",
  // 412 u5 permit
  ["Smoking is not permitted here.", null, ["smoking"]],
  // 413 u5 physics
  "My brother wants to study physics.",
  // 414 u5 policy
  "Our school has a policy of no phones in class.",
  // 415 u5 poor
  "The poor family needed help.",
  // 416 u5 practical
  "She gave me some practical advice.",
  // 417 u5 principal
  "The principal spoke to all the students.",
  // 418 u5 put the clock back
  ["Tonight we put the clock back one hour.", "phrase"],
  // 419 u5 such a / an
  ["It was such a nice day!", "phrase"],
  // 420 u5 teaching
  "My mother loves teaching.",
  // 421 u5 tear
  "A tear ran down her face.",
  // 422 u5 tidy
  "Keep your room tidy.",
  // 423 u5 uniform
  "The players wore a blue uniform.",
  // 424 u5 vote
  "Who did you vote for?",
  // 425 u5 comma
  "Put a comma after the word \"however\".",
  // 426 u5 exact
  "What is the exact time?",
  // 427 u5 learn by heart
  ["We had to learn the song by heart.", "phrase"],
  // 428 u5 order
  "The waiter took our order.",
  // 429 u5 pronounce
  "How do you pronounce this word?",
  // 430 u5 quiz
  "We have a quiz in English tomorrow.",
  // 431 u5 spelling
  "Check your spelling before you hand in your work.",
  // 432 u5 Why don't you ...?
  ["Why don't you come with us?", "phrase"],
  // 433 u5 written
  ["There is a written test and an oral test.", null, ["oral"]],
  // 434 u6 acknowledge
  "He acknowledged that he made a mistake.",
  // 435 u6 amaze
  "Her strength amazed everyone.",
  // 436 u6 at once
  ["Come here at once!", "phrase"],
  // 437 u6 blood
  ["There was blood on his knee.", null, ["knee"]],
  // 438 u6 body
  "Exercise is good for your body.",
  // 439 u6 by chance
  ["I met an old friend by chance.", "phrase"],
  // 440 u6 cancer
  ["Smoking can cause cancer.", null, ["smoking"]],
  // 441 u6 carpet
  "There is a red carpet in the living room.",
  // 442 u6 carry out
  ["The scientists carried out an experiment.", "phrase", ["scientists", "experiment"]],
  // 443 u6 crime
  "The police are trying to stop crime.",
  // 444 u6 criminal
  "The criminal went to prison.",
  // 445 u6 dirt
  "There is dirt on your shoes.",
  // 446 u6 evidence
  ["The police found evidence at the scene.", null, ["scene"]],
  // 447 u6 gather
  "We gathered around the fire.",
  // 448 u6 gold
  "Her ring is made of gold.",
  // 449 u6 guilty
  "The judge said he was guilty.",
  // 450 u6 human being
  "Every human being needs love.",
  // 451 u6 illness
  "He missed school because of an illness.",
  // 452 u6 indicate
  "The sign indicates the way to the beach.",
  // 453 u6 individual
  "Every individual student will get a book.",
  // 454 u6 jail
  "The man who stole the car spent five years in jail.",
  // 455 u6 link
  "The bridge links the two parts of the city.",
  // 456 u6 look forward to
  ["I'm looking forward to the summer vacation.", "phrase"],
  // 457 u6 look like
  ["You look like your father.", "phrase"],
  // 458 u6 look out
  ["Look out! There's a car coming!", "phrase"],
  // 459 u6 look up
  ["Look up the word in the dictionary.", "phrase", ["dictionary"]],
  // 460 u6 look up to
  ["I look up to my older brother.", "phrase"],
  // 461 u6 medicine
  "Take this medicine three times a day.",
  // 462 u6 mostly
  "The students are mostly from the north.",
  // 463 u6 murder
  ["The police are looking for the man who committed the murder.", null, ["committed"]],
  // 464 u6 ownership
  "The ownership of the house passed to his son.",
  // 465 u6 pleasant
  "We had a pleasant evening with our friends.",
  // 466 u6 predict
  "It's hard to predict the weather.",
  // 467 u6 prison
  "He was sent to prison for ten years.",
  // 468 u6 process
  "Learning a language is a slow process.",
  // 469 u6 puzzle
  "I finished the puzzle in an hour.",
  // 470 u6 represent
  "Our class will represent the school in the competition.",
  // 471 u6 solve
  "Can you solve this problem?",
  // 472 u6 supply
  "The farm supplies milk to the whole village.",
  // 473 u6 theirs
  ["Our car is old, but theirs is new.", "pronoun"],
  // 474 u6 arrest
  "The police arrested the man who stole my phone.",
  // 475 u6 court
  "The case went to court.",
  // 476 u6 ever since
  ["We have been friends ever since first grade.", "phrase"],
  // 477 u6 experience
  "It was a great experience to work with animals.",
  // 478 u6 framework
  "We need a framework for our project.",
  // 479 u6 grant
  ["The school granted us permission to go on the trip.", null, ["permission"]],
  // 480 u6 hand in
  ["Please hand in your homework on Monday.", "phrase"],
  // 481 u6 hate
  "There is no place for hate in our school.",
  // 482 u6 have a meeting
  ["The teachers are having a meeting now.", "phrase"],
  // 483 u6 have a plan
  ["Don't worry; I have a plan.", "phrase"],
  // 484 u6 have a question
  ["I have a question about the homework.", "phrase"],
  // 485 u6 have an appointment
  ["I have an appointment with the dentist.", "phrase", ["dentist"]],
  // 486 u6 have an idea
  ["I have an idea! Let's go to the beach.", "phrase"],
  // 487 u6 Holocaust
  "We learned about the Holocaust in history class.",
  // 488 u6 it doesn't matter
  ["\"I forgot your book.\" \"It doesn't matter.\"", "phrase"],
  // 489 u6 museum
  "We visited the science museum.",
  // 490 u6 negative
  "The test results were negative.",
  // 491 u6 positive
  "We got positive comments about our project.",
  // 492 u6 proposal
  ["The class voted for my proposal.", null, ["voted"]],
  // 493 u6 race
  "People of every race have the same rights.",
  // 494 u6 racial
  "We are against racial hate.",
  // 495 u6 relating to
  ["We read stories relating to the war.", "phrase"],
  // 496 u6 religious
  "My grandparents are very religious.",
  // 497 u6 require
  ["The job requires a lot of patience.", null, ["patience"]],
  // 498 u6 right away
  ["Call the doctor right away.", "phrase"],
  // 499 u6 rights
  "Children have rights too.",
  // 500 u6 set
  ["I set my alarm clock for six.", null, ["alarm"]],
  // 501 u6 trial
  "The trial will start next week.",
  // 502 u6 drugs
  "Drugs are very dangerous for your body.",
  // 503 u6 full name
  ["Please write your full name at the top.", "phrase"],
  // 504 u6 get through
  ["I don't know how I got through the exam.", "phrase"],
  // 505 u6 have a talk
  ["Mom wants to have a talk with me.", "phrase"],
  // 506 u6 highway
  ["We drove on the highway to Tel Aviv.", null, ["Aviv"]],
  // 507 u6 hunting
  "Hunting animals is not allowed here.",
  // 508 u6 phone
  "I'll phone you this evening.",
  // 509 u6 purse
  "She lost her purse on the bus.",
  // 510 u6 report
  "We reported the accident to the police.",
  // 511 u6 ring
  "He gave her a beautiful ring.",
  // 512 u6 subway
  "We took the subway to the museum.",
  // 513 u7 a few
  ["I'll be ready in a few minutes.", "phrase"],
  // 514 u7 be made of
  ["This table is made of wood.", "phrase"],
  // 515 u7 certainty
  "There is no certainty that it will rain.",
  // 516 u7 cite
  "The writer cited many examples in her book.",
  // 517 u7 college
  "My sister goes to college.",
  // 518 u7 company
  "My uncle works for a big company.",
  // 519 u7 control
  ["You must learn to control your anger.", null, ["anger"]],
  // 520 u7 cook
  "My father is a great cook.",
  // 521 u7 cooker
  ["Put the pot on the cooker.", null, ["pot"]],
  // 522 u7 degree
  "It's thirty degrees outside today.",
  // 523 u7 earn
  "I earn money by walking my neighbor's dog.",
  // 524 u7 fair
  "The judge was fair to everyone.",
  // 525 u7 fully
  "The hotel is fully booked.",
  // 526 u7 generation
  "My grandparents' generation didn't have computers.",
  // 527 u7 give up
  ["Don't give up! You can do it.", "phrase"],
  // 528 u7 go up
  ["Prices went up again this year.", "phrase"],
  // 529 u7 goods
  ["The shop sells many goods from China.", null, ["China"]],
  // 530 u7 hand out
  ["The teacher handed out the tests.", "phrase"],
  // 531 u7 happy to
  ["I'm happy to help you.", "phrase"],
  // 532 u7 housing
  "Housing is very expensive in big cities.",
  // 533 u7 hurry
  "Hurry, or we'll miss the bus!",
  // 534 u7 income
  "Their income is not high.",
  // 535 u7 item
  "I bought three items at the shop.",
  // 536 u7 label
  "We labeled the boxes with our names.",
  // 537 u7 law
  "You must obey the law.",
  // 538 u7 low
  "The prices are very low this week.",
  // 539 u7 minimum
  "What is the minimum age for this job?",
  // 540 u7 pepper
  "Add salt and pepper to the soup.",
  // 541 u7 primary
  "My little sister goes to primary school.",
  // 542 u7 profit
  "The shop made a big profit this year.",
  // 543 u7 pure
  ["This shirt is made of pure cotton.", null, ["cotton"]],
  // 544 u7 rate
  "The rate of crime in the city went down.",
  // 545 u7 reach
  "The heat can reach forty degrees in summer.",
  // 546 u7 resource
  "Water is an important resource.",
  // 547 u7 series
  ["I love this TV series.", null, ["TV"]],
  // 548 u7 site
  "They are building a new hotel on this site.",
  // 549 u7 speech
  "The president gave a speech.",
  // 550 u7 supermarket
  "We buy our food at the supermarket.",
  // 551 u7 taste
  "This soup has a strange taste.",
  // 552 u7 trade
  "Trade between the two countries is growing.",
  // 553 u7 bus station
  "I'll meet you at the bus station.",
  // 554 u7 career
  "She wants a career in medicine.",
  // 555 u7 class
  "The doctors classed his illness as serious.",
  // 556 u7 collect
  "I collect stamps.",
  // 557 u7 curtain
  "Close the curtains, please; the sun is too bright.",
  // 558 u7 department store
  "We bought new shoes at the department store.",
  // 559 u7 design
  "I love the design of your new dress.",
  // 560 u7 fashion
  "She is very interested in fashion.",
  // 561 u7 for sale
  ["Their house is for sale.", "phrase"],
  // 562 u7 furniture
  "We need new furniture for the living room.",
  // 563 u7 garbage
  "Please take out the garbage.",
  // 564 u7 grow up
  ["I want to be a pilot when I grow up.", "phrase"],
  // 565 u7 gym
  "My brother goes to the gym every day.",
  // 566 u7 heavily
  "It rained heavily all night.",
  // 567 u7 in general
  ["In general, I like my school.", "phrase"],
  // 568 u7 indeed
  "It was indeed a great day.",
  // 569 u7 jewelry
  "She loves wearing jewelry.",
  // 570 u7 medical center
  "He was taken to the medical center.",
  // 571 u7 port
  "The boat arrived at the port.",
  // 572 u7 refer to
  ["Please refer to page ten.", "phrase"],
  // 573 u7 section
  "The book has a section about animals.",
  // 574 u7 standard
  "The food here is of a high standard.",
  // 575 u7 stuff
  "Put your stuff in your bag.",
  // 576 u7 style
  "I like your style!",
  // 577 u7 succeed
  "If you work hard, you will succeed.",
  // 578 u7 such as
  ["I like fruit such as apples and oranges.", "phrase"],
  // 579 u7 term
  "\"Shy\" is a term for people who are quiet with new people.",
  // 580 u7 throw out
  ["Don't throw out those old books; give them to your friends.", "phrase"],
  // 581 u7 free
  "Are you free on Saturday?",
  // 582 u7 in a minute
  ["I'll be with you in a minute.", "phrase"],
  // 583 u7 material
  "What material is this coat made of?",
  // 584 u7 medium
  "I'd like a medium pizza, please.",
  // 585 u7 mirror
  "She looked at herself in the mirror.",
  // 586 u7 take back
  ["I want to take back these shoes; they are too small.", "phrase"],
  // 587 u7 take your time
  ["Take your time; there's no hurry.", "phrase"],
  // 588 u7 try on
  ["Can I try on this jacket?", "phrase"],
  // 589 u8 accident
  "Nobody was injured in the accident.",
  // 590 u8 alive
  "The fish is still alive!",
  // 591 u8 awake
  "I was awake all night.",
  // 592 u8 calm
  "Stay calm and listen to the teacher.",
  // 593 u8 capable
  "She is capable of doing great things.",
  // 594 u8 character
  "The main character in the book is a young girl.",
  // 595 u8 clear
  "Is everything clear?",
  // 596 u8 course
  ["I'm taking a course in photography.", null, ["photography"]],
  // 597 u8 crisis
  ["The country is in an economic crisis.", null, ["economic"]],
  // 598 u8 cruel
  "It's cruel to hit animals.",
  // 599 u8 delay
  "There is a delay of thirty minutes.",
  // 600 u8 disappear
  "The sun disappeared behind the clouds.",
  // 601 u8 downtown
  "We went shopping downtown.",
  // 602 u8 emergency
  "In an emergency, call this number.",
  // 603 u8 equipment
  "We need special equipment to climb the mountain.",
  // 604 u8 first aid
  "Every teacher should know first aid.",
  // 605 u8 flexible
  "My working hours are flexible.",
  // 606 u8 focus on
  ["Please focus on your work.", "phrase"],
  // 607 u8 hang around
  ["Teenagers like to hang around the mall.", "phrase", ["mall"]],
  // 608 u8 helicopter
  "A helicopter landed on the roof of the hospital.",
  // 609 u8 hurry someone up
  ["Can you hurry your brother up? We're late.", "phrase"],
  // 610 u8 ill
  "I was ill last week.",
  // 611 u8 impact
  "The internet has a huge impact on our lives.",
  // 612 u8 injury
  ["He has a knee injury.", null, ["knee"]],
  // 613 u8 insult
  "What he said was an insult.",
  // 614 u8 isolated
  "The village is isolated in the mountains.",
  // 615 u8 land
  "The plane will land at six.",
  // 616 u8 let someone know
  ["Let me know when you get home.", "phrase"],
  // 617 u8 particular
  "Is there a particular book you want?",
  // 618 u8 polite
  "Be polite and say \"thank you\".",
  // 619 u8 rude
  "It's rude to talk with food in your mouth.",
  // 620 u8 security
  ["The airport has tight security.", null, ["tight"]],
  // 621 u8 simply
  "It's simply too hot to go out.",
  // 622 u8 skill
  "Reading is an important skill.",
  // 623 u8 spirit
  "The team has a great spirit.",
  // 624 u8 state
  "Their house is in a terrible state.",
  // 625 u8 strength
  "You need a lot of strength to carry that box.",
  // 626 u8 stupid
  "That was a stupid mistake.",
  // 627 u8 system
  "Our school has a new computer system.",
  // 628 u8 weak
  "I felt weak after the illness.",
  // 629 u8 alternative
  "Is there an alternative to driving?",
  // 630 u8 army
  "My brother is in the army.",
  // 631 u8 Attention!
  ["Attention, please! The train is leaving.", "adverb"],
  // 632 u8 blow
  "The wind blew the leaves off the trees.",
  // 633 u8 broken
  "My phone screen is broken.",
  // 634 u8 check
  "The waiter brought us the check.",
  // 635 u8 district
  "We live in a quiet district.",
  // 636 u8 eastern
  "The eastern part of the city is very old.",
  // 637 u8 fail
  "If you don't study, you might fail.",
  // 638 u8 get together
  ["Let's get together this weekend.", "phrase"],
  // 639 u8 government
  "The government built new roads.",
  // 640 u8 lightning
  "Lightning hit the old tree.",
  // 641 u8 missing
  "The police are looking for the missing girl.",
  // 642 u8 muscle
  "Exercise makes your muscles strong.",
  // 643 u8 network
  "The country has a good network of roads.",
  // 644 u8 participate
  "All students must participate in sports.",
  // 645 u8 roll
  "The ball rolled under the car.",
  // 646 u8 search
  "After a long search, we found the keys.",
  // 647 u8 season
  "Winter is my favorite season.",
  // 648 u8 set off
  ["We set off early in the morning.", "phrase"],
  // 649 u8 soldier
  "The soldier stood next to the gate.",
  // 650 u8 stomach
  "I ate too much and now my stomach is not well.",
  // 651 u8 strategy
  "We need a new strategy to win the game.",
  // 652 u8 support
  "My parents support me in everything I do.",
  // 653 u8 throat
  ["I have a sore throat.", null, ["sore"]],
  // 654 u8 thunder
  "The thunder woke me up.",
  // 655 u8 tie
  "Tie your shoes, or you will fall.",
  // 656 u8 volunteer
  "She works as a volunteer at the hospital.",
  // 657 u8 ambulance
  "The ambulance took him to the hospital.",
  // 658 u8 as far as I know
  ["As far as I know, the shop is closed today.", "phrase"],
  // 659 u8 get to
  ["How do I get to the station from here?", "phrase"],
  // 660 u8 injured
  "The injured man was taken to the hospital.",
  // 661 u8 on the way to
  ["I met her on the way to school.", "phrase"],
  // 662 u8 take down
  ["The teacher took down the pictures from the wall.", "phrase"],
];
