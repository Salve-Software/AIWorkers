# AIWorkers

Central package for AI configurations in the monorepo. Instead of each project having its own `CLAUDE.md` written from scratch, AIWorkers centralizes everything that is generic. Each project inherits with a single line and only writes what is specific to itself.

---

## How it works

Any project in the monorepo creates a `CLAUDE.md` with one line:

```markdown
@../../packages/AIWorkers/CLAUDE.md
```

Claude Code automatically injects all AIWorkers context — rules, conventions, and documentation. Below the import, the project writes only what is specific to it.

---

## What lives here vs in the project

|  | AIWorkers | Project |
|---|---|---|
| TypeScript conventions | ✅ | |
| React Native patterns | ✅ | |
| Commit standards | ✅ | |
| Reusable slash commands | ✅ | |
| Permissions (`settings.json`) | ✅ | |
| Domain context | | ✅ |
| Specific stack | | ✅ |
| Business rules | | ✅ |
| Project-specific commands | | ✅ |

---

## Slash commands

All commands are available globally after running the setup script (see below). Invoke them with `/command-name` inside any Claude Code session.

| Command | Description | Model |
|---|---|---|
| `/branch` | Creates a branch from the current one following the naming convention | Haiku |
| `/commit` | Analyzes changes and creates semantic commits following Conventional Commits | Haiku |
| `/feature` | Autonomous PDCA feature workflow — plan, implement, review, fix, document, and open PR | Opus + Sonnet |
| `/feature-docs` | Generates human and AI context documentation for a feature | Haiku |
| `/pr` | Creates a pull request on GitHub using `gh` CLI | Haiku |

### Branch naming convention

| Prefix | When to use | Example |
|---|---|---|
| `feat/` | New feature | `feat/add-refresh-button` |
| `fix/` | Bug fix | `fix/refresh-button-color` |
| `dev/` | Project/umbrella branch | `dev/home-refresh` |
| `release/` | Release — always with version | `release/v1.1.0` |

### `/feature` — PDCA workflow

The `/feature` command orchestrates multiple specialized agents to develop a complete feature autonomously:

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

   → Generates feature docs (feature.md + context.md)
   → Opens a PR on GitHub
   → Displays a final summary
```

You approve at three checkpoints: after the plan, after implementation, and after the review.

---

## Structure

```
AIWorkers/
├── src/                           # Everything distributed by setup.sh
│   ├── commands/                  # Reusable slash commands
│   │   ├── branch/SKILL.md
│   │   ├── commit/SKILL.md
│   │   ├── feature/SKILL.md
│   │   ├── feature-docs/SKILL.md
│   │   └── pr/SKILL.md
│   └── rules/                     # Composable rules — one responsibility per file
│       └── skills-format.md
├── docs/                          # Decisions and approved patterns
├── scripts/
│   └── setup.sh                   # One-time setup script — syncs src/ to ~/.claude/
├── .github/
│   └── pull_request_template.md
├── CLAUDE.md                      # Imports src/rules/ — active when maintaining AIWorkers
└── settings.json                  # Source of truth for permissions
```

---

## Setup

Run once per machine. The script links everything from AIWorkers into `~/.claude/` — commands become available as slash commands globally, and rules are automatically imported into the global `~/.claude/CLAUDE.md`.

**If AIWorkers is inside a monorepo:**

```bash
cd packages/AIWorkers
./scripts/setup.sh
```

**If cloned standalone:**

```bash
./scripts/setup.sh
```

After running, all `/commands` are immediately available in any Claude Code session on this machine. No restart needed.

To verify:
```bash
ls ~/.claude/commands/
# branch  commit  feature  feature-docs  pr

ls ~/.claude/rules/
# skills-format.md

cat ~/.claude/CLAUDE.md
# @rules/skills-format.md
```

---

## Adding a new project

1. Run `./scripts/setup.sh` once on the machine (if not done yet) — links commands and rules globally.
2. Create `CLAUDE.md` in the project root:
   ```markdown
   @../../packages/AIWorkers/CLAUDE.md

   <!-- project-specific context below -->
   ```
3. Done — slash commands are globally available, rules are active in every Claude Code session.

---

## Evolving the framework

1. Update or add files in `src/`
2. For rule changes: all projects that import AIWorkers inherit automatically
3. For new commands or rules: run `./scripts/setup.sh` again — symlinks are updated instantly
4. Document decisions in `docs/`

---

## Requirements

- Claude Code with an active Pro or Team plan
- `gh` CLI installed and authenticated (required for `/pr` and `/feature`)
- Node.js project with a `test` script, `pytest`, or `make test` (optional — for `/feature` test running)
