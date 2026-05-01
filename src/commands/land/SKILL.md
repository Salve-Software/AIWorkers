---
name: land
description: Use when the user asks to create a branch and commit, or create a branch + commit + PR together. Orchestrates /branch and /commit while sharing the git diff context to avoid redundant reads. After committing, if the user also asked for a PR, invoke /pr.
user-invocable: true
argument-hint: [optional: branch name or description]
allowed-tools: [Bash, Read, Agent]
---

# Land — Branch + Commit Orchestrator

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
- If yes: read its contents as the diff instead of running `git diff HEAD`
- If no: run `git diff HEAD` normally

### 4. Delete temp file — MANDATORY

**This step is non-optional. Run it unconditionally, even if /commit failed or was skipped.**

```bash
rm -f .claude/.aiworkers-context.tmp
```

Do not proceed to step 5 without confirming this command ran.

### 5. Run /pr (if requested)

If the user's original request included creating a PR, read and follow `.claude/skills/aiworkers/pr/SKILL.md`.

## Rules

- The orchestrator is solely responsible for saving and deleting `.claude/.aiworkers-context.tmp` — skills only read it, never delete it
- **Always** delete `.claude/.aiworkers-context.tmp` after /commit, even if commit fails — use `rm -f` so it never errors
- If /branch fails, delete the tmp file before stopping
- Never push the branch unless /pr is being run (which handles pushing itself)
