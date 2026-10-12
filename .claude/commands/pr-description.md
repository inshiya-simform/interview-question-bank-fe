---
description: 'Generate a short PR title and description of the functional changes between dev and the current branch'
argument-hint: 'Optional: ticket ID and extra context (e.g. IQB-02 added tag filters)'
---

Generate a PR title + description for merging the current branch into `dev`.

Extra context, high priority when non-empty: $ARGUMENTS

## Context

Run these directly, never asking permission first:

- `git log dev..HEAD --oneline`
- `git diff dev...HEAD --stat`
- `git diff dev...HEAD` (read as needed to understand behaviour; do not copy code into the output)

If `dev` does not exist locally, use `origin/dev`.

## Focus

Describe **what changed functionally** (what users or the app can now do, or no longer do), not
how it was built. No file names, function names, hook names, or library internals in the
Description. Skip pure formatting/lint noise.

## Checks

`npm run lint` and `npm run format:check` run in `.husky/pre-commit` (lint-staged) — mark both
`✅ pre-commit hook`; run them for real only if the tree is dirty or the last commit used
`--no-verify`.

Run `npm run build` (includes type-check) for real. `✅ <detail>` on pass, `❌ <first failing
file/rule>` on fail, `⬜ not run` if skipped. Never `✅` what you did not run.

## Output

Title: `<type>: <short summary>`, type ∈ `feat` `fix` `refactor` `chore` `docs` `test`.

Fill this template verbatim. Tick exactly one `Type of change`. Leave bracketed placeholders
only a human can supply. Omit `Dependencies` when `package.json` is untouched, and
`How to test` for `refactor`/`chore` with no user-visible change; add `# Breaking changes`
before `# Dependencies` only when the diff has one. Never print an empty heading.

```md
# Description

<2–3 sentences: what this PR delivers and why. No bullets, no implementation details.>

# What changed

<3–6 short bullets, each ≤ 12 words, one user-visible/functional change per bullet.>

# Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

# Checks

| Check  | Command                | Status   |
| ------ | ---------------------- | -------- |
| Build  | `npm run build`        | <status> |
| Lint   | `npm run lint`         | <status> |
| Format | `npm run format:check` | <status> |

- [ ] Keyboard-only operation verified on new/changed interactive elements
- [ ] Loading, error, and empty states handled
- [ ] Only palette colours used
- [ ] No console errors or warnings

# Screenshots

[ Add screenshots here ]

# Dependencies

<packages added/removed/upgraded, or omit section>

# How to test

<2–4 numbered steps a reviewer can follow in the UI>
```

Output only:

`Title: <title>`

`Description:`

```md
<description markdown>
```
