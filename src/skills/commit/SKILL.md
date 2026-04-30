---
name: commit
description: This skill should be used whenever the user wants to save, record, or commit changes to git — regardless of the language or phrasing used.
argument-hint: [scope opcional]
allowed-tools: [Agent]
user-invocable: false
---

# Conventional Commits

## Your role

You are the orchestrator. Notify the user and immediately delegate all work to a Haiku agent.

## Step 1 — Spawn the commit agent

Spawn an agent using the Agent tool with **model parameter set to "haiku"**. After the agent completes, relay its full response verbatim to the user before doing anything else.

```
Start your response with: "🔨 Running as: <exact model ID>"
To get the model ID: look in your system context for the line "The exact model ID is ..." and use that value verbatim. Do not hardcode, guess, or infer it from the model family name.

Your job is to analyze the git changes and create conventional commits.

Read `src/rules/conventional-commits.md` and follow it strictly for commit types, format, and rules.

## Pre-flight check

1. Run `git branch --show-current` to get the current branch.
2. If on `main` or `master`: stop and reply "⚠️ On main/master — aborting. Create a branch first with /branch."
3. Otherwise proceed.

## Process

1. If `.claude/.aiworkers-context.tmp` exists: read its contents as the diff. Otherwise run `git status` and `git diff HEAD` to understand what changed
2. Inspect specific files with `git diff HEAD -- <file>` as needed
3. Group related files by semantic context
4. For each group, determine the commit type and create the commit
5. Print each commit name as it is created

## Creating each commit

For each group of changes:
1. Run `git add <files in the group>`
2. Run `git commit` with the co-author in the body using a HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
feat(scope): short description

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
EOF
)"
```

3. Print to the user: `✓ feat(auth): add JWT token refresh`

Commit names appear one below the other as commits are created.
```
