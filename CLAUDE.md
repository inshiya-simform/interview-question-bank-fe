# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

Frontend for the **Interview Question Bank** POC: a shared bank of interview/screening questions.
Users add questions with answer notes and tags across categories (technology, seniority, question
type, ...), filter by any combination of categories, keyword-search question text and answer notes,
and see client-restricted questions only if they hold a permission for that client.

The backend (Express or Next.js, PostgreSQL, Prisma) lives in a separate repo; this repo is the React
SPA that consumes its REST API.

### Actors and permissions

| Role                     | Can do                                                      |
| ------------------------ | ----------------------------------------------------------- |
| Author                   | Add questions, edit **own** entries, read what they may see |
| Reviewer                 | Edit **any** entry, read what they may see                  |
| User                     | Read-only on questions they may see                         |
| Client-scoped permission | Grants a user visibility into one client's questions        |

### Frontend implications of the spec

- **The UI is never the security boundary.** Hide/disable edit controls by role for UX, but the API
  enforces authorization. Never filter client-restricted data on the client; render exactly what the
  API returns. A zero-result search must look identical regardless of why it is empty (do not add
  copy like "some results are hidden").
- **Filtering and search are server-side.** Send the selected filters (multi-select per category) and
  keyword to the API as query params; never fetch the full list and filter in the browser.
- **No anonymous path.** Every request is authenticated; unauthenticated users are redirected to login.
- **Duplicate detection** happens on submit: surface the API's matches to the author, and allow an
  explicit "this is different" override (the API decides how the override is recorded).
- **Change history** (who/when for every add and edit) is displayed per question.

## Tech Stack

- React 19 + TypeScript (strict), Vite
- React Router (`react-router-dom`)
- TanStack Query v5 (`@tanstack/react-query`) for all server state
- Zod for all runtime validation (API responses, forms, URL/search params)
- ESLint (flat config, `typescript-eslint`, react-hooks, react-refresh) + Prettier
- Husky + lint-staged (pre-commit runs `eslint --fix` and `prettier --write` on staged files)

## Commands

```bash
npm run dev           # Vite dev server
npm run build         # tsc -b && vite build (type-check + production build)
npm run lint          # eslint .
npm run format        # prettier --write .
npm run format:check  # prettier --check .
npm run preview       # preview production build
```

Before finishing any task: `npm run lint && npm run format:check && npm run build` must pass.

## Environment

- Config comes from `VITE_*` env vars, read **once** in `src/config/env.ts` and validated with Zod
  (fail fast on startup). Never read `import.meta.env` anywhere else.
- Document every variable in `.env.example`. Never commit `.env`.

## Folder Structure

```
src/
  api/                      # ALL API integration lives here
    endpoints.ts            # every endpoint path/builder (single file)
    queryKeys.ts            # every TanStack Query key (single file)
    client.ts               # shared fetch/axios wrapper (auth header, error normalisation)
    <feature>/              # e.g. questions/, tags/, auth/, clients/, history/
      hooks/                # useQuestions.ts, useCreateQuestion.ts, ... (TanStack Query hooks)
      service/              # questionService.ts (calls client, parses response with Zod)
      types/                # question.types.ts (Zod schemas + z.infer types)
  components/               # shared, feature-agnostic UI (Button, TextField, Alert, ...) + index.ts barrel
  features/                 # feature modules (questions, filters, search, history, auth)
    <feature>/
      components/           # *.tsx (JSX only)
      hooks/                # useXxx.ts (all logic for the components)
      constants.ts          # feature-local constants
  pages/                    # route-level components (JSX only) + their hooks
  hooks/                    # shared, non-API hooks (useDebounce, useDisclosure, ...)
  constants/                # project-wide constants (see below)
  utils/                    # project-wide pure helper functions
  config/                   # env.ts, queryClient.ts, router
  App.tsx
  main.tsx
```

Use the path alias `@/` (-> `src/`, configured in `tsconfig.app.json` and `vite.config.ts`) for
cross-folder imports; use relative imports only within the same feature/folder. No deep imports across features: import from a feature's
public surface only.

## Mandatory Best Practices

### 1. Constants, not magic values

- Every user-facing message, regex, route path, storage key, debounce delay, page size, role name, and
  any value used in more than one place lives in `src/constants/` (or a feature-local `constants.ts`
  if used only by that feature).
- Organise by concern: `messages.ts`, `regex.ts`, `routes.ts`, `roles.ts`, `pagination.ts`,
  `storageKeys.ts`, `categories.ts`, `validation.ts`. Screen copy (labels, titles) lives alongside
  messages (e.g. `AUTH_COPY`). Re-export via `constants/index.ts`.
- Use `as const` objects instead of enums; derive union types from them.
- No inline string literals for messages, toasts, validation errors, or regex in components, hooks,
  schemas, or services.

```ts
// constants/messages.ts
export const MESSAGES = {
  QUESTION_TEXT_REQUIRED: 'Question text is required',
  DUPLICATE_FOUND: 'A similar question already exists',
} as const;
```

### 2. Shared helpers go in `utils/`

- Pure, reusable functions used project-wide (date formatting, query-string building, class-name
  joining, string normalisation, array helpers) live in `src/utils/`, one concern per file, each with
  unit tests where non-trivial.
- Feature-specific helpers stay in that feature; promote to `utils/` on the second consumer.
- Utils are pure: no React, no side effects, no API calls.

### 3. Component size

- A component file must not exceed **150 lines of code**. If it does, split into smaller
  components and/or move logic into hooks.

### 4. Strict API response validation

- **Every** API response is parsed with a Zod schema before reaching hooks or components. Use
  `schema.parse()` (or `safeParse` + explicit error handling) inside the service layer. Never cast
  with `as` or trust `response.json()` as typed.
- Use `.strict()` on object schemas for responses so unexpected fields fail loudly rather than
  silently passing through (especially important here: an unexpected field could be leaked
  restricted metadata).
- Parse **error** responses too, into a normalised `ApiError` type.
- Validate request payloads (forms, filters, query params) with Zod before sending.
- Types are derived from schemas (`z.infer`), never hand-written alongside them.
- A parse failure is surfaced as a handled error state (and logged), never swallowed.

### 5. One exported component per file

- Each `.tsx` file exports exactly one component, and the filename matches it (`QuestionCard.tsx`
  exports `QuestionCard`). Small private helper components used by only one file are not allowed to
  be exported; if they grow, extract them to their own file.
- Prefer named exports. Default exports only where a tool requires it (e.g. lazy routes).

### 6. `.tsx` files are JSX only; logic lives in custom hooks

- A `.tsx` file contains JSX markup plus trivial prop wiring. State, effects, derived data, event
  handlers with logic, data fetching, form setup, and permission checks are all in a co-located custom
  hook (`QuestionList.tsx` -> `useQuestionList.ts`) that returns exactly what the view needs.
- Components call hooks, destructure, and render. No `useState`/`useEffect`/`useMemo`/`useQuery`
  inline in a `.tsx` file beyond calling the feature hook.
- Hooks are `.ts` files, named `useXxx`.

### 7. API layer layout

All server communication goes through `src/api/<feature>/` with exactly these subfolders:

- `service/` - plain async functions that call the shared client, using `ENDPOINTS`, and parse the
  response with the Zod schema from `types/`. No React here.
- `types/` - Zod schemas and the inferred TypeScript types for requests and responses.
- `hooks/` - TanStack Query hooks (`useQuery`/`useMutation`/`useInfiniteQuery`) wrapping services,
  using keys from `queryKeys.ts`.

Components never call `fetch`/`axios` or services directly; they use the hooks.

### 8. Endpoints in one file

- All endpoint paths live in `src/api/endpoints.ts`, as constants or small builder functions
  (`ENDPOINTS.questions.byId(id)`). No URL strings anywhere else.

### 9. Query keys in one file

- All TanStack Query keys live in `src/api/queryKeys.ts` as a key factory
  (`queryKeys.questions.list(filters)`, `queryKeys.questions.detail(id)`). No inline key arrays.
- Keys include every input that changes the result (filters, keyword, page, **and the current user
  id** so cached data never crosses user boundaries after logout/login).
- Invalidate by key prefix from mutations; on logout call `queryClient.clear()`.

## Additional Best Practices

### TypeScript

- `strict` stays on. No `any`; use `unknown` and narrow (ideally with Zod). No non-null `!` assertions
  and no unchecked `as` casts.
- Prefer `type` for unions/derived types and `interface` for extendable object contracts; be
  consistent within a file.
- Use `import type` for type-only imports.
- Exhaustive `switch` on unions with a `never` check.

### React

- Function components only. Props typed explicitly; destructure in the signature.
- Keep components pure; no side effects in render. Don't store derived data in state.
- Use stable `key`s (ids, never array index for dynamic lists).
- Memoise (`useMemo`/`useCallback`/`memo`) only for a measured reason, never by default.
- Lazy-load route-level pages with `React.lazy` + `Suspense`; wrap routes in an error boundary.
- Never use `dangerouslySetInnerHTML` with API data. Answer notes are untrusted text; render as text
  (or through a vetted sanitiser if rich text is ever added).

### TanStack Query

- One `QueryClient` configured in `src/config/queryClient.ts` (sane `staleTime`, `retry` disabled
  for 401/403/404, no retry on mutations).
- Server state lives only in the query cache. Do not copy it into `useState`/context.
- Filter and search inputs: keep them in URL search params (validated by Zod) so results are
  shareable/bookmarkable; debounce keyword input before it reaches the query key; use
  `placeholderData: keepPreviousData` for smooth pagination.
- Large result sets are paginated (or infinite-scrolled) server-side.
- Mutations expose `isPending`/`error`; surface errors through the standard error UI, not
  `console.log`.

### Forms and validation

- Form schemas are Zod schemas (`types/`), reused for client-side validation and for the request
  payload parse. Messages come from `constants/messages.ts`.
- Validate before submit; also handle server-side validation errors returned by the API.
- Disable the submit button while pending to avoid double submission.

### Auth and authorization

- Auth state is exposed through one `useAuth` hook; the token is never read from storage ad hoc.
- Role/permission checks go through a single helper (`utils/permissions.ts`), e.g.
  `canEditQuestion(user, question)`. UI gating is cosmetic; the API is authoritative.
- Handle 401 (redirect to login, clear cache) and 403 (forbidden state) centrally in the API client
  or query client, not per component.
- Don't log or store sensitive data (tokens, client-restricted question content) in
  `console`, `localStorage` beyond what auth strictly needs, or error-reporting payloads.

### Error, loading, and empty states

- Every data-driven view handles loading, error, and empty states using shared components.
- Normalise all errors to one `ApiError` shape in the API client; map to user-friendly messages from
  constants.

### Accessibility

- Semantic HTML, labelled form controls, visible focus, keyboard-operable filters and modals,
  sufficient contrast. Use `aria-live` for search result count changes.

### Styling and colour palette

- Keep styles consistent with the existing approach (global CSS in `src/index.css` plus co-located
  styles, e.g. `Button.tsx` + `Button.css`); no inline style objects for static styling.
- **The entire project uses this five-colour palette and nothing else.** It is defined once in
  `src/index.css` as `--palette-1..5`, and exposed through semantic tokens:

  | Palette token | Hex       | Semantic token                    | Used for                                 |
  | ------------- | --------- | --------------------------------- | ---------------------------------------- |
  | `--palette-1` | `#0D1B2A` | `--color-bg-deep`                 | Cards, panels, primary-button text       |
  | `--palette-2` | `#1B263B` | `--color-bg`, `--color-bg-raised` | Page background, input backgrounds       |
  | `--palette-3` | `#415A77` | `--color-border`                  | Borders, dividers                        |
  | `--palette-4` | `#778DA9` | `--color-muted`                   | Secondary text, hints, hover, focus ring |
  | `--palette-5` | `#E0E1DD` | `--color-text`                    | Primary text, primary-button background  |

- Components and feature CSS reference the **semantic tokens** (`var(--color-text)`), never raw hex
  values and never the palette tokens directly. To retheme, change the token mapping in `index.css`.
- Contrast: `--color-muted` is only guaranteed readable on `--color-bg-deep`; avoid it for small
  text on lighter palette backgrounds.
- **No colours outside the palette, including status colours.** Errors, warnings and success are
  conveyed with palette colours plus non-colour cues (heavier border, bold text, a `!` prefix, icons),
  never with red/green/amber.
- Spacing (`--space-*`), radii (`--radius-*`), and fonts are also tokens in `index.css`; reuse them.

### Shared components (`src/components/`)

- Anything reusable by more than one feature (Button, TextField, PasswordField, Alert, Modal,
  Spinner, ...) lives in `src/components/`, is exported through `src/components/index.ts`, and is
  imported as `import { Button } from '@/components'`.
- Shared components are feature-agnostic: no API calls, no feature imports, copy passed in via props.
  Feature-specific UI (e.g. `AuthLayout`) stays in its `features/<feature>/components/`.
- Reuse an existing shared component before writing a new one; add a variant or prop if it nearly fits.

### Naming and style

- Components `PascalCase.tsx`; hooks `useCamelCase.ts`; utils/services `camelCase.ts`; constants
  `UPPER_SNAKE_CASE` for values, files in `camelCase.ts`; types `PascalCase`; Zod schemas
  `camelCaseSchema` (e.g. `questionSchema`).
- Prettier config is authoritative (single quotes, semicolons, trailing commas, 100 cols). Don't
  hand-format; run `npm run format`.
- No dead code, commented-out code, or stray `console.log`. Comments explain _why_, not _what_.
- Prefer early returns; keep functions small and single-purpose.

### Testing

- Test the logic, not the markup: unit-test `utils/`, Zod schemas, services (mock the client), and
  custom hooks (React Testing Library `renderHook` + a fresh `QueryClient` per test).
- Add tests for permission helpers and for the identical-empty-state behaviour on zero results.
- Mock the network at the boundary (e.g. MSW), not internal modules.

### Git and workflow

- Work on `dev`; `main` is the PR target. Small, focused commits with imperative messages.
- Husky pre-commit runs lint-staged; never bypass with `--no-verify`.
- Don't add a dependency without a clear need; prefer what's already in the stack.

## Quick Checklist for New Code

- [ ] Messages/regex/shared values are in constants
- [ ] Reusable helpers are in `utils/`
- [ ] Component <= 150 LOC, one exported component per file
- [ ] `.tsx` has JSX only; logic is in a custom hook
- [ ] API code is under `api/<feature>/{hooks,service,types}`
- [ ] Endpoint added to `api/endpoints.ts`; key added to `api/queryKeys.ts`
- [ ] Response is parsed with a strict Zod schema; types derived via `z.infer`
- [ ] Loading, error, and empty states handled
- [ ] `npm run lint && npm run format:check && npm run build` pass
