# AIWorkers

Central package for AI configurations. Instead of each project having its own `CLAUDE.md` written from scratch, AIWorkers centralizes everything that is generic. Each project inherits with a single line and only writes what is specific to itself.

---

## How it works

Any project creates a `CLAUDE.md` with one line:

```markdown
@../../packages/AIWorkers/CLAUDE.md
```

Claude Code automatically injects all AIWorkers context — rules, commands, and agent personas. Below the import, the project writes only what is specific to it.

---

## What lives here vs in the project

|  | AIWorkers | Project |
|---|---|---|
| Commit standards | ✅ | |
| Reusable slash commands | ✅ | |
| Agent personas | ✅ | |
| Permissions (`settings.json`) | ✅ | |
| Domain context | | ✅ |
| Specific stack | | ✅ |
| Business rules | | ✅ |
| Project-specific commands | | ✅ |

---

## Structure

```
AIWorkers/
├── src/
│   ├── commands/          # Reusable slash commands → docs/commands.md
│   ├── agents/            # Agent personas → docs/agents.md
│   └── rules/             # Composable rules (one responsibility per file)
├── docs/                  # Decisions, patterns, and reference docs
├── scripts/
│   └── setup.sh           # Links src/ into .claude/
├── CLAUDE.md
└── settings.json          # Source of truth for permissions
```

---

## Setup

Run once per machine:

```bash
./scripts/setup.sh
```

The script symlinks commands, agents, and rules from `src/` into `.claude/`, and keeps `settings.json` in sync. No restart needed after running.

---

## Reference

- [Slash commands](docs/commands.md)
- [Agent personas](docs/agents.md)

---

## Requirements

- Claude Code with an active Pro or Team plan
- `gh` CLI installed and authenticated (required for `/pr` and `/feature`)
