# English Teacher Tools

An English practice site for Israeli middle-school students (grades 7–9) and their teachers.
Students practise reading, vocabulary, writing and conversation, and get instant feedback in Hebrew.
Teachers assign work to classes or groups and review what comes back.

## What's inside

| Section | Route | What students do |
|---|---|---|
| **Unseen** (reading comprehension) | `/unseen` | Read a passage at Level 1–3 (built-in or AI-generated), answer multiple-choice and open questions, get them graded. Click any word to translate it, listen to the text read aloud, or print it. |
| **Vocabulary** | `/vocabulary` | Practise Core Band I/II/III word lists or the teacher's own word banks with matching games, drills and voice dictation. |
| **Writing** | `/writing` | Write to a prompt with step-by-step scaffolding. AI grades it on a rubric (content 35%, vocabulary 25%, grammar 25%, mechanics 15%) and suggests corrections and better word choices. |
| **Conversation** | `/conversation` | Read and listen to real-life dialogues (10 scenarios per level, normal or 0.5× audio) and answer questions about them. |
| **Tutor "David"** | `/tutor` and the floating chat button | A placement test, a per-student level profile, task suggestions and an AI chat tutor. |
| **Student portal** | `/student` | Assigned tasks and saved drafts. |
| **Teacher dashboard** | `/teacher/dashboard` | Assign tasks, review turn-ins, manage word banks (import from Excel/Word), and, for admins, manage teachers and site-edit suggestions. |

### Who signs in, and how
- **Teachers** sign up with email and password (Firebase Auth) and get a teacher code such as `COHEN-26`.
- **Students** pick their teacher, type their name and a 4-digit PIN. There is deliberately no email or password for students, to keep it simple for the classroom.
- **Admins** are teachers with the `isAdmin` box ticked in the dashboard, plus the built-in emails in [`src/config/admins.ts`](src/config/admins.ts).

## Running it locally

Requires Node.js 20+.

```bash
npm install
```

```bash
cp .env.example .env.local
```

Fill in `.env.local` (see below), then:

```bash
npm run dev
```

Open http://localhost:3000.

The dev and build scripts use `--webpack`; keep that flag.

### Environment variables

| Variable | Needed? | What it's for |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` (6 values) | Optional | Firebase project config. If unset, the app uses the built-in config for the `english-teacher-tools` Firebase project. |
| `GROQ_API_KEY` | Recommended | Main AI provider (gpt-oss-120b, Llama 3.3 70B, Qwen) for grading, generating and the tutor. |
| `GEMINI_API_KEY` | Recommended | Second AI provider, used when Groq fails or is missing. |
| `OPENAI_API_KEY` | Optional | Last AI fallback. |

The AI routes try each provider in turn. With no AI keys at all, the built-in passages, dialogues and word lists still work, and writing and Unseen grading fall back to a simple built-in rubric. Generating new passages and grading conversation answers need at least one key.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Check that the admin lists match, then run ESLint |
| `npm run check:admins` | Check that `firestore.rules` and `src/config/admins.ts` list the same admin emails |

## Project layout

```
src/
  app/                 Pages (Next.js App Router) — one folder per section
    api/               Server routes that call the AI providers
                       (generate-*, evaluate-*, scaffold-writing, translate-word, tutor-chat)
    teacher/dashboard/ Teacher dashboard and its views/modals
  components/
    ui/                shadcn/ui building blocks
    auth/ tutor/ unseen/ student/ suggestions/   Feature components
  config/              App-wide settings (admin list)
  data/                Built-in content: passages, dialogues, writing prompts,
                       vocabulary bands, dictionary (split by level-1/2/3)
  lib/                 Firebase setup, login state, storage helpers,
                       the tutor engine, speech/dialogue audio hooks
  types/               Shared TypeScript types
firestore.rules        Firestore security rules (deploy with the Firebase CLI)
```

### Conventions
- Styling is Tailwind CSS with shadcn/ui. Use the colour tokens in `src/app/globals.css`, not hardcoded colours.
- Every page supports the dark/light **Comfort Reading** toggle (`next-themes`).
- Feedback to students is in Hebrew; the interface mixes Hebrew (right-to-left) and English.
- More detail for contributors and AI assistants is in [`AGENTS.md`](AGENTS.md).

## Data (Firestore)

| Collection | Holds |
|---|---|
| `teachers` (+ `vocabBanks` subcollection) | Teacher profiles and their word banks |
| `students` | Student profiles |
| `assignments` / `submissions` | Tasks teachers assign, and students' turned-in work |
| `drafts` | Auto-saved work in progress |
| `unseens` | Saved reading passages |
| `shared_vocab_banks` | Word banks teachers share with each other |
| `site_suggestions` | Edit suggestions sent from any page |
| `users/{uid}` | Per-user saved words and tutor profile |

After changing `firestore.rules`, deploy them:

```bash
firebase deploy --only firestore:rules
```

## Deployment

The site is deployed on Vercel. Every pull request gets a preview deployment, and merging into `main` deploys to production. Set the same environment variables in the Vercel project settings.
