# Saved Questions & Collections: Design

Status: proposal. Written for the frontend team; the backend contract in section 4 needs agreeing with the API repo.

## 1. Goal

Let a user bookmark any **live** (approved) question and file it into one of their own **collections**.
Users can create, rename and delete collections, move a saved question between collections, and unsave
a question, which removes it from its collection.

## 2. Rules (decisions baked into the design)

| Topic                | Decision                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| Ownership            | Collections are private to their owner. No sharing.                                                        |
| Membership           | A saved question lives in **exactly one** collection. "Saved" = "in a collection"; "move" changes it.      |
| Save flow            | Save opens a picker; choosing a collection (or creating one inline) saves in that step.                    |
| Unsave               | Removes the question from its collection. The question itself is untouched.                                |
| Delete collection    | Confirmation dialog showing the question count; its saved questions are **unsaved** (not deleted).         |
| Rename               | Inline in the collections panel. Names are 1-60 chars, unique per user, case-insensitive.                  |
| Which questions      | Only live questions show the Save control. Pending/rejected items (My Questions, review queue) do not.     |
| Restricted questions | The UI never filters. If a saved question stops being visible to the user, the API omits it and its count. |

Open question for the product owner: should deleting a collection instead move its questions to an
"Unsorted" collection? The design above is the simpler default; switching only changes the confirm copy
and the API behaviour.

## 3. UX

### 3.1 Save control on a question

`QuestionItem` gets a bookmark button next to Edit.

```
┌──────────────────────────────────────────────────────────────┐
│ What is a closure in JavaScript?              [🔖 Save] [Edit]│
│ [technology › JavaScript] [seniority › Mid]                   │
└──────────────────────────────────────────────────────────────┘
```

- Unsaved: outline icon + "Save". Saved: filled icon + the collection name ("Saved in Frontend").
  State is also carried by text, not just the fill (accessibility rule: no colour-only status).
- Clicking opens a **popover picker** anchored to the button (dialog-less, closes on Esc/outside click).

```
┌ Save to collection ────────┐        ┌ Saved in "Frontend" ───────┐
│ ( ) Frontend          12   │        │ (•) Frontend          12   │
│ ( ) System design      4   │        │ ( ) System design      4   │
│ ( ) Behavioural        0   │        │ ( ) Behavioural        0   │
│ ─────────────────────────  │        │ ─────────────────────────  │
│ + New collection           │        │ + New collection           │
│                            │        │ ─────────────────────────  │
│                            │        │ Remove from collection     │
└────────────────────────────┘        └────────────────────────────┘
```

- Choosing a row saves (or moves, if already saved) and closes. A toast confirms.
- "+ New collection" swaps the footer for a name field; submitting creates the collection and saves the
  question into it in one go (two requests, create then save; see section 5 on failure handling).
- "Remove from collection" appears only when saved and performs the unsave.
- With zero collections the picker shows only the name field, so first-time save is a single step.

### 3.2 Saved page (`/saved`)

New sidebar item "Saved" (bookmark icon), visible to every authenticated user.

```
┌ Collections ─────────┐  ┌ Frontend ─────────────── [Rename] [Delete] ┐
│ All saved        16  │  │ 12 saved questions                         │
│ ▸ Frontend       12  │  │ ▸ What is a closure…         [Move ▾][✕]   │
│   System design   4  │  │ ▸ Explain the event loop…    [Move ▾][✕]   │
│   Behavioural     0  │  │ …                                          │
│ ─────────────────    │  │                              pagination    │
│ + New collection     │  └────────────────────────────────────────────┘
└──────────────────────┘
```

- Left panel (a list on desktop, a select/dropdown on narrow screens): "All saved" plus each collection
  with its count. The selected one lives in the URL (`?collection=<id>`, Zod-validated, absent = all),
  so it is bookmarkable.
- Right panel reuses `QuestionItem` for the expandable question row; on this page it also shows
  **Move** (opens the same picker) and **Unsave**. Edit stays role-gated as it is today.
- Header actions (**Rename**, **Delete**) apply to the selected collection and are hidden for
  "All saved". Rename turns the title into a text field (Enter saves, Esc cancels). Delete opens a
  `Modal` confirm.
- Optional keyword search within saved questions reuses the existing server-side search param; not
  required for v1.

### 3.3 States

| State            | Behaviour                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Loading          | Shared `Loader`.                                                                          |
| Error            | `Alert`; API errors are already toasted centrally.                                        |
| No collections   | Empty panel: "Create a collection to organise saved questions" + create button.           |
| Empty collection | "No questions here yet. Use Save on any question to add it."                              |
| Duplicate name   | Field error from the 409 via the existing `field-errors` handling.                        |
| Pending          | Picker rows and submit buttons disabled while a mutation is in flight (no double submit). |

### 3.4 Accessibility

- Picker is a `role="dialog"` popover containing a radio group; arrow keys move, Enter/Space selects,
  focus returns to the trigger on close.
- The Save button has `aria-haspopup="dialog"`, `aria-expanded`, and a label that names the question
  (as `EDIT_QUESTION(text)` does today).
- Counts and result totals sit in an `aria-live` region so moves/unsaves are announced.
- The delete confirm uses the existing `Modal` (native `<dialog>`).

## 4. API contract (backend repo to confirm)

All routes are authenticated and scoped to the caller; the API enforces ownership and question visibility.

| Method | Path                     | Body / query                                    | Response                                                   |
| ------ | ------------------------ | ----------------------------------------------- | ---------------------------------------------------------- |
| GET    | `/collections`           |                                                 | `{ items: Collection[] }`                                  |
| POST   | `/collections`           | `{ name }`                                      | `Collection` (409 on duplicate name)                       |
| PATCH  | `/collections/:id`       | `{ name }`                                      | `Collection`                                               |
| DELETE | `/collections/:id`       |                                                 | 204, unsaves its questions                                 |
| GET    | `/collections/questions` | `collectionId?`, `page`, `pageSize`, `keyword?` | paginated `Question[]` (same shape as `/questions`)        |
| PUT    | `/questions/:id/save`    | `{ collectionId }`                              | `{ questionId, collectionId }` (upsert = save **or** move) |
| DELETE | `/questions/:id/save`    |                                                 | 204 (unsave)                                               |

```ts
Collection = { id: string; name: string; questionCount: number; createdAt: string; updatedAt: string }
```

`Question` (list and item responses) gains one field so the Save button needs no extra request per row:

```ts
savedCollection: { id: string; name: string } | null   // null/absent = not saved
```

`PUT` being an upsert keeps "save" and "move" as the same mutation. `questionCount` must be computed
server-side from questions the caller may currently see, so a count never leaks hidden content.

## 5. Frontend implementation plan

Follows the layout in `CLAUDE.md`. New files only unless noted.

### API layer (`src/api/`)

- `endpoints.ts`: add `COLLECTIONS: { BASE, BY_ID(id), QUESTIONS }` and `QUESTIONS.SAVE(id)`.
- `type/collections/`: `shared.ts` (`collectionSchema`), `collections-list.ts`, `create-collection.ts`,
  `update-collection.ts`, `saved-questions-list.ts` (params schema + reuse `questionSchema`),
  `save-question.ts`. Add `savedCollection` to `questionSchema` (`.nullish()`).
- `service/collections.service.ts`: plain async functions, `schema.parse()` on every response.
- `query-keys.ts`: `COLLECTIONS_LIST: ['collections']` (prefix) and
  `COLLECTIONS(userId)`, `SAVED_QUESTIONS(userId, params)` (both under `['collections', ...]`).
  Saved questions sit under the collections prefix so one invalidation refreshes counts and lists.
- `hooks/useCollections.ts`: `useCollections`, `useSavedQuestions` (with `keepPreviousData`),
  `useCreateCollection`, `useRenameCollection`, `useDeleteCollection`, `useSaveQuestion`,
  `useUnsaveQuestion`. Re-export from `hooks/index.ts` and `api/index.ts`.
- Invalidation: save, move, unsave and delete invalidate both `['collections']` and `['questions']`
  (the latter refreshes each row's `savedCollection`). Create and rename invalidate `['collections']`
  only. Logout already clears the cache.
- Optimistic updates are not used in v1; the picker closes on success, which is fast enough and avoids
  rollback logic.
- Create-and-save from the picker: the hook calls create, then save. If save fails the collection
  still exists (it shows up in the list) and the error toast explains the failure; no rollback needed.

### Feature module (`src/features/saved/`)

```
saved/
  components/
    SaveQuestionButton.tsx      # trigger + saved/unsaved label
    CollectionPicker.tsx        # popover with radio list, footer actions
    NewCollectionForm.tsx       # name field, shared by picker and panel
    CollectionList.tsx          # left panel
    CollectionHeader.tsx        # title, Rename, Delete
    DeleteCollectionModal.tsx
    SavedQuestionList.tsx       # right panel, reuses QuestionItem
  hooks/                        # one hook per component (useCollectionPicker, ...)
  constants.ts                  # SAVED_COPY, name limits, search-param keys
  schema.ts                     # collectionNameSchema (Zod), URL params schema
  index.ts                      # public surface: SaveQuestionButton, SavedQuestionList, ...
```

- `QuestionItem` renders `<SaveQuestionButton question={question} />` (import from the feature's public
  surface). Because `QuestionItem` lives in `features/questions` and `saved` imports it back for the
  Saved page, avoid a cycle by passing the saved-page actions in through a slot prop on `QuestionItem`
  (`actions?: ReactNode`) instead of importing `saved` inside `questions`; `QuestionList` and
  `SavedQuestionList` each supply their own actions.
- `pages/SavedPage.tsx` + `useSavedPage.ts`; add `LazySavedPage` to `lazyPages.ts`, `ROUTES.SAVED = '/saved'`,
  a `<Route>` in `App.tsx`, and a sidebar entry (new `bookmark` icon in `iconPaths.ts`).
- Shared components: add a small `Popover` to `src/components/` (positioning, outside-click, Esc, focus
  return) since the picker is the first popover and others will follow. Reuse `Modal`, `TextField`,
  `Button`, `Alert`, `Loader`, `Pagination`.
- Constants: all copy in `SAVED_COPY`; toasts and validation messages in `MESSAGES`
  (`COLLECTION_NAME_REQUIRED`, `COLLECTION_NAME_TOO_LONG`, `COLLECTION_NAME_TAKEN`, `QUESTION_SAVED`,
  `QUESTION_UNSAVED`, `COLLECTION_DELETED`, ...); `COLLECTION_NAME_MAX = 60` in `validation.ts`.
- Styling: semantic tokens only, one CSS file per component, no new colours. Saved state uses
  `--color-accent-soft`/`--color-accent-ink` plus the filled icon and text label.

### Permissions

No new permission: every authenticated user may save. Restricted questions are not specially handled in
the client; the API decides what a collection contains (section 2).

## 6. Testing

- Zod schemas: collection name rules, URL params, response parsing (including `savedCollection`).
- Service tests with a mocked client for each call.
- Hook tests (`renderHook` + fresh `QueryClient`): save/move/unsave invalidate the right keys; create-and-save
  sequencing and failure; delete clears the selection param when the selected collection is removed.
- MSW-backed component test: picker saves, moves and unsaves; zero-result views are identical whether the
  collection is empty or its questions became hidden.

## 7. Delivery order

1. Agree the API contract with the backend (section 4).
2. API layer + types + hooks (can be built against MSW before the backend lands).
3. `Popover` shared component, `SaveQuestionButton`, `CollectionPicker` (save/move/unsave from the list).
4. Saved page: collection list, create, rename, delete, saved question list.
5. Tests, then `npm run lint && npm run format:check && npm run build`.
