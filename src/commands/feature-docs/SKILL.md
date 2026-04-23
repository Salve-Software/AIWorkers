---
name: feature-docs
description: This skill should be used when the user asks to "document a feature", "generate feature documentation", "create feature docs", or at the end of a feature workflow to create human and AI context documentation.
argument-hint: <feature-name>
allowed-tools: [Bash, Read, Write, Glob]
model: haiku
---

# Feature Docs Generator

Creates two documentation files at `docs/features/<feature-name>/`:
- `feature.md` — human-readable feature documentation
- `context.md` — compressed AI context doc for future sessions

## Process

1. Determine `<feature-name>`:
   - Use `$ARGUMENTS` if provided
   - Otherwise derive from current branch name (strip prefix: `feat/add-refresh-button` → `add-refresh-button`)

2. Gather context:
   - `git log <base-branch>...HEAD --oneline` — list of commits
   - `git diff <base-branch>...HEAD` — all changes made
   - Read `docs/features/<feature-name>/feature.md` if it already exists (to update instead of overwrite)

3. Create the output directory if it doesn't exist: `docs/features/<feature-name>/`

4. Write both files.

---

## `feature.md` — Human-readable doc

```markdown
# Feature: <feature-name>

## Summary
What this feature does, explained in plain language for a developer reading it for the first time.

## Changes
- `path/to/file.ts` — what changed and why
- `path/to/other.ts` — what changed and why

## Usage
How to use the feature (API, component, command, etc.) — skip if not applicable.

## Notes
Decisions made, tradeoffs accepted, known limitations, or anything a maintainer should know.
```

---

## `context.md` — AI context doc

Dense and compressed — designed for a future AI agent to load instead of reading the full diff:

```markdown
# AI Context: <feature-name>

## What was built
One dense paragraph describing exactly what was implemented and why.

## Files changed
- `path/to/file.ts` — what changed and the reasoning behind it
- `path/to/other.ts` — what changed and the reasoning behind it

## Key decisions
- Decision: rationale for why it was done this way

## Gotchas
Critical things a future AI must know to avoid breaking this feature when modifying related code.
```

---

## Rules

- Never overwrite existing content without reading it first — update, don't replace
- `context.md` must be dense and precise — avoid vague summaries
- Both files must always be created together
