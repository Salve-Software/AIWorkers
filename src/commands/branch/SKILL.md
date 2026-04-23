---
name: branch
description: This skill should be used when the user asks to "create a branch", "new branch", "start a branch", or wants to start work on a new feature, fix, dev, or release branch.
argument-hint: [optional: brief description of the branch]
allowed-tools: [Bash]
model: haiku
---

# Branch Creator

## Process

1. If $ARGUMENTS is empty, ask the user:
   "What will this branch be about? Describe the feature, fix, or context — and indicate the type (feat, fix, dev, or release)."
   Wait for the user's response before proceeding.

2. Based on the input, determine the branch type and generate a kebab-case name.

3. Run `git checkout -b <branch-name>` to create and switch to the branch.

4. Confirm to the user: `✓ Branch created: feat/add-refresh-button`

## Branch types

| Prefix | When to use |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `dev/` | Project/umbrella branch (feat and fix branches merge into this) |
| `release/` | Release branch — always followed by vX.X.X |

## Examples

- `feat/add-refresh-button`
- `fix/refresh-button-color`
- `dev/home-refresh`
- `release/v1.1.0`

## Naming rules

- Lowercase, kebab-case only
- Short and descriptive (2–4 words max)
- No special characters besides `/` and `-`
- `release/` must always be followed by a version in the format `vX.X.X`

## Rules

- Never push the branch — that is the user's responsibility
- Always create the branch from the current branch (do not switch base)
- If the type is ambiguous, ask the user to clarify before creating
