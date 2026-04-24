# Slash Commands

All commands are available globally after running `setup.sh`. Invoke them with `/command-name` inside any Claude Code session.

| Command | Description | Model |
|---|---|---|
| `/feature` | Autonomous PDCA workflow — plan, implement, review, fix, and open PR | Opus + Sonnet |
| `/land` | Creates a branch and commits, optionally opens a PR | Haiku |

> **Skills** (auto-invoked by Claude, not typed by the user): `branch`, `commit`, `pr`

---

## Branch naming convention

| Prefix | When to use | Example |
|---|---|---|
| `feat/` | New feature | `feat/add-refresh-button` |
| `fix/` | Bug fix | `fix/refresh-button-color` |
| `dev/` | Project/umbrella branch | `dev/home-refresh` |
| `release/` | Release — always with version | `release/v1.1.0` |

---

## `/land` — Branch + Commit orchestrator

```
/land "optional branch description"
```

Captures the git diff once and runs `branch` → `commit` in sequence, sharing context to avoid redundant reads. If you also ask for a PR, runs `pr` after.

---

## `/feature` — PDCA workflow

```
/feature "add refresh button to home screen"

🧠 Agent 1 — Planner (Opus)
   Analyzes the codebase and produces a detailed implementation plan.
   You review and approve before anything is written.

⚙️ Agent 2 — Implementer (Sonnet)
   Creates the branch, implements the feature step by step, commits along the way.

🔍 Agent 3 — Reviewer (Sonnet)
   Fresh agent with zero context reviews the diff against the plan.
   Reports bugs, security issues, edge cases, and breaking changes.

🛠️ Agent 4 — Fixer (Sonnet)
   Resolves every issue found in the review and commits the fixes.

   → Opens a PR on GitHub
   → Displays a final summary
```

You approve at three checkpoints: after the plan, after implementation, and after the review.
