<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Overview: English Teacher Tools
A dedicated toolkit designed for English teachers and students focused on three core pedagogical pillars:
1. **Unseen (Reading Comprehension)**: Passage generation/import, level categorization (CEFR / Israeli Bagrut modules), question sets (multiple-choice & open-ended), and answer keys.
2. **Vocabulary Training**: Band-based vocabulary lists (Core Band I, II, III), contextual drills, definition matching, and exportable worksheets.
3. **Writing Workshop**: Essay/task prompts, rubric-guided evaluation, structure/grammar/vocabulary feedback.

# Global Tech Stack & Architectural Conventions
- **Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend:** Firebase (Auth, Firestore, Cloud Functions)
- **Payments:** Lemon Squeezy (if applicable)

# Core Implementation Rules
1. **Routing & Structure:**
   - Always use Next.js **App Router** (`src/app/` directory). Do NOT use Pages Router.
   - Ensure clear separation between Client Components (`"use client"`) and Server Components.
2. **TypeScript:**
   - Strict typing across all files. No `any` types.
3. **Styling & UI:**
   - Use **Tailwind CSS** exclusively for styling.
   - Use **shadcn/ui** for UI components.
   - **Design Tokens & Theme Consistency:** Reference CSS variables / Tailwind tokens defined in `src/app/globals.css`. Never use hardcoded hex colors or arbitrary spacing values directly in markup.
4. **Comfort Reading Mode / Theme Toggle:**
   - Every page/tool must support a dark/bright mode toggle (Comfort Reading Mode) allowing users to switch between space-dark and soft high-contrast light mode.
   - Persist theme selection in `localStorage` (via `next-themes`).

# Language & Interaction Preferences
- The user may write prompts or requests in Hebrew.
- **Always respond in English** unless the user explicitly requests Hebrew.
