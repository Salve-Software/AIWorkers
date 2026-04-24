---
name: ship
description: Use when the user wants to create a branch and commit changes in one step. Orchestrates /branch and /commit while sharing the git diff context to avoid redundant reads.
argument-hint: [optional: branch name or description]
allowed-tools: [Bash, Read, Agent]
---

# Ship — Branch + Commit Orchestrator

Runs `/branch` and `/commit` in sequence, sharing the git diff so it's only read once.

## Process

### 1. Capture context

Run once and store in memory:
```bash
git status
git diff HEAD
```

Save the diff to a temp file:
```bash
git diff HEAD > .claude/.aiworkers-context.tmp
```

### 2. Run /branch

Read and follow `commands/micro/branch/SKILL.md`.

Pass `$ARGUMENTS` as the branch hint if provided.

### 3. Run /commit

Read and follow `commands/micro/commit/SKILL.md`.

Instruct the commit agent to:
- Check if `.claude/.aiworkers-context.tmp` exists
- If yes: read its contents as the diff, then delete it with `rm .claude/.aiworkers-context.tmp`
- If no: run `git diff HEAD` normally

## Rules

- Always delete `.claude/.aiworkers-context.tmp` after /commit, even if commit fails
- Never push the branch — that is the user's responsibility
- If /branch fails, delete the tmp file before stopping
