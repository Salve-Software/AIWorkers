---
name: feature
description: This skill should be used when the user asks to "build a feature", "implement a feature", "develop a feature", or wants to autonomously develop, review, and ship a complete feature following the PDCA cycle.
argument-hint: <feature description>
allowed-tools: [Bash, Read, Glob, Grep, Agent]
model: sonnet
---

# Feature — PDCA Multi-Agent Workflow

The orchestrator coordinates four specialized agents. Each agent starts with zero context from the conversation — only what the orchestrator explicitly passes to it.

---

## Phase 0 — Pre-flight

1. Run `git status` — if there are uncommitted changes, warn the user and ask whether to proceed or abort. Wait for response.
2. Record the current branch name (base for the new branch).
3. If `$ARGUMENTS` is empty, ask: *"Describe the feature you want to build."* Wait for response.

---

## Phase 1 — PLAN (Agent 1 — model: opus)

Notify the user: `🧠 Agent 1 (Planner — Opus) is analyzing the codebase and building the plan...`

Spawn a fresh agent using the Agent tool with **model parameter set to "opus"**:

```
Read .claude/agents/aiworkers/planner.md and inline its full content at the start of this prompt.

Start your response with: "🧠 Running as: <your actual model name>"

Your job is to produce a detailed implementation plan for the feature described below.

## Feature request
<user description>

## Current branch
<branch name>

Produce a structured plan:

## Feature: <name>

### Goal
What this feature does and why.

### Affected areas
- path/to/file — what will change and why

### Implementation steps
1. Step one (specific, actionable)
2. Step two
...

### Risks & edge cases
- Risk or edge case to handle

Be thorough. The implementer will follow this plan exactly.
```

Display the plan to the user. Iterate with the user until they explicitly approve it.

**Checkpoint:** wait for explicit user approval before proceeding to DO.

---

## Phase 2 — DO (Agent 2 — model: sonnet)

Notify the user: `⚙️ Agent 2 (Implementer — Sonnet) is creating the branch and implementing the feature...`

Spawn a fresh agent using the Agent tool with **model parameter set to "sonnet"**:

```
Read .claude/agents/aiworkers/implementer.md and inline its full content at the start of this prompt.

Start your response with: "⚙️ Running as: <your actual model name>"

Your job is to implement a feature exactly as described in the plan below.

## Approved plan
<plan from Phase 1>

## Base branch
<branch name recorded in Phase 0>

## Instructions

1. Follow the /branch command logic to create the branch (feat/, fix/, dev/) based on the feature type.
2. Implement each step from the plan sequentially.
3. After each logical implementation chunk, follow the /commit command logic to commit (Conventional Commits, imperative, max 72 chars).
4. Co-author line on every commit: Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
5. After all implementation is done, check if any test file was created or modified. If no test was touched, note it in your final report.

## /branch logic
- feat/ — new feature
- fix/ — bug fix
- dev/ — project/umbrella branch
- release/ — release, always with vX.X.X
- Lowercase, kebab-case, 2–4 words

## /commit logic
- Run git add <specific files> (never git add . or git add -A)
- Commit with HEREDOC format including co-author
- Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, cleanup, remove

Do not push. Do not open a PR.

When done, return:
- Branch name created
- List of all commits made (type + message)
- Whether tests were written or updated
```

**Checkpoint:** inform the user that implementation is complete. Show the branch and commit list. Wait for approval to proceed to CHECK.

---

## Phase 3 — CHECK

### 3a — Run tests

Detect the test runner in the project:
- `package.json` → `scripts.test` → run with npm/yarn/pnpm based on lockfile
- `pytest.ini` or `pyproject.toml` with `[tool.pytest]` → run `pytest`
- `Makefile` with `test` target → run `make test`
- Nothing found → skip: *"No test runner detected — skipping automated tests."*

If tests **fail**: spawn a fix agent (see 3a-fix below) before proceeding to 3b.

### 3a-fix — Test Fix Agent (if needed) — model: sonnet

Notify the user: `🔧 Tests failed. Spawning fix agent (Sonnet) to resolve failures...`

Spawn a fresh agent using the Agent tool with **model parameter set to "sonnet"**:

```
Read .claude/agents/aiworkers/fixer.md and inline its full content at the start of this prompt.

Start your response with: "🔧 Running as: <your actual model name>"

The following tests are failing after a feature was implemented. Fix them without changing the feature behavior.

## Failing tests output
<test output>

## Branch
<branch name>

## Recent commits (context)
<git log output>

Fix the failures, then follow /commit logic to commit each fix (fix: ...).
Co-author: Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
Do not push.

Return: list of fixes made and commits created.
```

Re-run tests after fixes. If tests still fail, retry once more (maximum 2 retry attempts total). If tests still fail after 2 rounds, abort: report the remaining failures to the orchestrator and do not proceed further.

### 3b — Review Agent (Agent 3 — model: sonnet)

Collect:
- Approved plan from Phase 1
- Full diff: `git diff <base-branch>...HEAD`
- Commits: `git log <base-branch>...HEAD --oneline`

Notify the user: `🔍 Agent 3 (Reviewer — Sonnet) is reviewing the implementation...`

Spawn a fresh agent using **model: sonnet** with:

```
Read .claude/agents/aiworkers/reviewer.md and inline its full content at the start of this prompt.

Start your response with: "🔍 Running as: <your actual model name>"

You have zero context about this feature — evaluate only what is provided.

## Feature plan
<plan from Phase 1>

## Git diff (all changes)
<git diff output>

## Commits
<git log output>

Review the implementation against the plan. Report on:
1. Bugs or logic errors
2. Edge cases not handled
3. Security issues (XSS, injection, data exposure, auth bypass)
4. Breaking changes to existing interfaces or APIs
5. Obvious performance problems

Be specific: file path, approximate line, what is wrong, what should be done instead.
Return a numbered list. If there are no issues, say explicitly: "No issues found."
```

Display the review output to the user.

**Checkpoint:** wait for user approval before proceeding to ACT.

---

## Phase 4 — ACT (Agent 4 — model: sonnet, if issues exist)

If the review returned issues:

Notify the user: `🛠️ Agent 4 (Fixer — Sonnet) is resolving review issues...`

Spawn a fresh agent using **model: sonnet** with:

```
Read .claude/agents/aiworkers/fixer.md and inline its full content at the start of this prompt.

Start your response with: "🛠️ Running as: <your actual model name>"

Fix the issues listed below found during code review of a recently implemented feature.

## Feature plan (for context)
<plan from Phase 1>

## Review issues
<numbered list from Agent 3>

## Branch
<branch name>

Fix each issue. For each fix, follow /commit logic to commit (fix: ...).
Co-author: Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
Do not push.

Return: list of fixes and commits created.
```

Re-run tests after fixes to confirm nothing broke.

---

## Phase 5 — Finalize

After ACT (or directly if no issues):

1. Follow `/pr` command logic to create the pull request.
2. Display final summary:

```
## Feature complete: <branch-name>

### Agents used
- Agent 1 (Planner): produced implementation plan
- Agent 2 (Implementer): created branch, implemented, committed
- Agent 3 (Reviewer): reviewed code, found X issues
- Agent 4 (Fixer): resolved review issues (if applicable)

### All commits
<full commit list>

### Pull Request
<PR URL>

### Summary
<plain language description of what was built>
```

---

## Rules

- Never push — that is the user's responsibility
- Each agent receives only what it needs — no leaking full conversation context
- User approves at: end of PLAN, end of DO, end of CHECK
- All commits follow Conventional Commits and include the co-author line
- The skills `branch`, `commit`, and `pr` are expected to exist in `.claude/skills/aiworkers/`. Before starting Phase 2, verify that each required skill directory is present. If any is missing, warn the user and abort rather than silently failing.
