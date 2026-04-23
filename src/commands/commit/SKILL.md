---
name: commit
description: This skill should be used when the user asks to "commit", "create commits", "commit changes", or wants to commit staged/unstaged changes following the Conventional Commits standard.
argument-hint: [scope opcional]
allowed-tools: [Agent]
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

## Pre-flight check

1. Run `git branch --show-current` to get the current branch.
2. If on `main` or `master`: stop and reply "⚠️ On main/master — aborting. Create a branch first with /branch."
3. Otherwise proceed.

## Process

1. Run `git status` and `git diff HEAD` to understand what changed
2. Inspect specific files with `git diff HEAD -- <file>` as needed
3. Group related files by semantic context
4. For each group, determine the commit type and create the commit
5. Print each commit name as it is created

## Commit types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructuring without feature/fix |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system, dependencies |
| `ci` | CI/CD configuration |
| `chore` | Maintenance, tooling |
| `raw` | Raw data, config files |
| `cleanup` | Dead code removal, cleanup |
| `remove` | Removing features or files |

## Commit format

```
<type>(<scope>): <short description>

[optional body if subject is not enough]

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

- Subject: max 72 characters, imperative mood ("add", not "added")
- Scope: optional but helpful (e.g. `auth`, `ui`, `config`)
- Body: only when the subject alone is insufficient

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

## Rules

- Never mix unrelated changes in one commit
- Prefer smaller, focused commits
- If a file contains changes of different natures, split them and mention in the body
- Use `git diff HEAD -- <file>` to inspect specific changes before deciding grouping
- Never use `git add .` or `git add -A` — always stage specific files by name
- Never run `git push` — this command only commits, pushing is the user's responsibility
```
