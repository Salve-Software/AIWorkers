---
name: ship
description: Use when the user asks to create a branch and commit, or create a branch + commit + PR together. Orchestrates /branch and /commit while sharing the git diff context to avoid redundant reads. After committing, if the user also asked for a PR, invoke /pr.
argument-hint: [optional: branch name or description]
allowed-tools: [Bash, Read, Agent]
---

# Ship — Branch + Commit Orchestrator

Runs `/branch` and `/commit` in sequence, sharing the git diff so it's only read once. If the user also requested a PR, runs `/pr` after.

## Process

### 1. Capture context

```bash
git status
git diff HEAD
```

Save the diff to a temp file:
```bash
git diff HEAD > .claude/.aiworkers-context.tmp
```

### 2. Run /branch

Read and follow `.claude/skills/aiworkers/branch/SKILL.md`.

Pass `$ARGUMENTS` as the branch hint if provided.

### 3. Run /commit

Read and follow `.claude/skills/aiworkers/commit/SKILL.md`.

Instruct the commit agent to:
- Check if `.claude/.aiworkers-context.tmp` exists
- If yes: read its contents as the diff, then delete it with `rm .claude/.aiworkers-context.tmp`
- If no: run `git diff HEAD` normally

### 4. Run /pr (if requested)

If the user's original request included creating a PR, read and follow `.claude/skills/aiworkers/pr/SKILL.md`.

## Rules

- Always delete `.claude/.aiworkers-context.tmp` after /commit, even if commit fails
- If /branch fails, delete the tmp file before stopping
- Never push the branch unless /pr is being run (which handles pushing itself)
