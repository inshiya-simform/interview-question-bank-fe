# Interview Question Bank — Frontend

Frontend for the **Interview Question Bank** POC (Knowledge track · React to Full Stack 101 · 2-week solo POC).

Interview and screening questions currently live in separate documents held by whoever ran the interview. This project is the shared question bank that fixes that: anyone can add a question with answer notes and tags across several categories, filter and search the whole bank, and questions tied to a specific client stay visible only to people permitted for that client.

> The POC's centre of gravity is **authorization that doesn't leak through search**. A filtered query that quietly reveals a client-restricted question exists, even without showing its content, is a failure. This repo is the UI; the exclusion itself is enforced by the backend at the query level.

## Tech stack

| Layer   | Choice                                                      |
| ------- | ----------------------------------------------------------- |
| UI      | React 19 + TypeScript                                       |
| Build   | Vite                                                        |
| Routing | React Router (`react-router-dom`)                           |
| Data    | TanStack Query (`@tanstack/react-query`)                    |
| Quality | ESLint, Prettier, Husky + lint-staged (pre-commit)          |
| Backend | Express or Next.js · PostgreSQL · Prisma (separate service) |

## Getting started

### Prerequisites

- Node.js 20+ and npm
- The backend API running (see the backend repo / `docker compose up`)

### Install and run

```bash
npm install
npm run dev
```

The dev server starts on <http://localhost:5173> by default.

### Environment

Create a `.env` file in the project root (document every variable here as you add it):

```bash
# Base URL of the backend API
VITE_API_URL=http://localhost:3000
```

### Scripts

| Command                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Start the Vite dev server with HMR             |
| `npm run build`        | Type-check (`tsc -b`) and build for production |
| `npm run preview`      | Preview the production build locally           |
| `npm run lint`         | Run ESLint                                     |
| `npm run format`       | Format the codebase with Prettier              |
| `npm run format:check` | Check formatting without writing               |

A Husky pre-commit hook runs lint-staged (ESLint + Prettier on staged files).

## Actors and permissions

| Role                         | Can do                                                                    |
| ---------------------------- | ------------------------------------------------------------------------- |
| **Author**                   | Add questions, edit their own entries, read what they're permitted to see |
| **Reviewer**                 | Edit any entry, read what they're permitted to see                        |
| **User** (everyone else)     | Read-only across questions they're permitted to see                       |
| **Client-scoped permission** | Grants a specific user visibility into a specific client's questions      |

The UI hides actions a user can't perform, but **the API is the source of truth** — rejected edits are enforced server-side, not just hidden.

## Functional scope

1. **Adding a question** — question text, answer notes, and multiple tags within each category (e.g. technology, seniority level, question type).
2. **Filtering** — any combination of categories with multiple values per category (e.g. technology in {React, Node} AND seniority in {Mid, Senior}). Filters are sent to the API as a real combined query, never applied client-side over a full list.
3. **Keyword search** — across both question text and answer notes.
4. **Client-restricted visibility** — a user without permission for a client gets results indistinguishable from a genuine zero-match: no hints, no counts, no leaked metadata. Because the exclusion happens in the backend query, the frontend must not special-case or infer restricted results (e.g. no "N hidden results" messaging, no facet counts derived from unrestricted data).
5. **Edit permissions** — authors edit only their own entries, reviewers edit any, everyone else is read-only. Show clear error states when the API rejects an edit (401/403/404).
6. **Duplicate detection** — on submit, the API may return a close-duplicate match. The UI surfaces the match and lets the author either cancel or confirm the question is genuinely different (false-positive override). The rule and override behaviour are documented in the backend README.
7. **Change history** — every addition and edit is recorded with who and when; the UI exposes this per question.

## Frontend guidelines

- **Authentication required everywhere.** There is no anonymous path; every add, edit, and search is made as an authenticated user. Unauthenticated users are redirected to sign-in.
- **Server-driven lists.** Search and filter state lives in the URL / query key and is passed to the API; results are paginated. Don't load the full bank into memory — it must stay usable at several thousand entries.
- **Validate before submit** — empty question text, unknown tag categories, etc. are caught in the form, but the API remains the authority.
- **Treat 404 and "no permission" the same** for client-restricted questions so existence is never revealed through error differences.

## Project structure

```
src/
  main.tsx      App entry (providers: Router, React Query)
  App.tsx       Root component / routes
  assets/       Static assets
public/         Static files served as-is
```

Structure will grow with features (e.g. `features/questions`, `features/auth`, `api/`, `components/`).

## Walkthrough topics

Be ready to discuss:

1. Many-to-many tagging across several categories — schema and the join (backend).
2. How duplicate detection works and what happens on a false positive.
3. What happens when an author edits someone else's entry through the API.

## Related

- Backend repository: _add link here_
- Requirements: POC — Interview Question Bank (`interview-question-bank.md`)
