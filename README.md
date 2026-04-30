# AIWorkers

[![npm](https://img.shields.io/npm/v/@salve-software/aiworkers)](https://www.npmjs.com/package/@salve-software/aiworkers)

Central npm package for Claude Code configurations. Instead of each project writing its own `CLAUDE.md` from scratch, AIWorkers centralizes everything that is reusable — commit standards, slash commands, agent personas, and rules. Each project installs the package and runs one command.

---

## Installation

Install globally once per machine:

```bash
npm install -g @salve-software/aiworkers
```

Then run inside each project that should use AIWorkers:

```bash
aiworkers setup
```

Or without installing globally:

```bash
npx @salve-software/aiworkers setup
```

The setup command links commands, skills, agents, and rules from the package into the project's `.claude/` folder, and adds the necessary imports to `.claude/CLAUDE.md`.

---

## CLI

```
  AIWorkers v0.2.1
  Claude Code configurations for every project

  Usage:  aiworkers <command>

  Commands:

    setup      Link AIWorkers into the current project's .claude/ folder
    --version  Print the installed version
    --help     Show this help message
```

---

## What it sets up

Inside your project's `.claude/`:

```
.claude/
├── commands/aiworkers/     # User-invokable slash commands
├── skills/aiworkers/       # Context-triggered skills (auto-invoked by Claude)
├── agents/aiworkers/       # Agent personas loaded on demand by skills
├── rules/aiworkers/        # Composable rules imported into CLAUDE.md
└── CLAUDE.md               # Auto-updated with @rules/aiworkers/* imports
```

---

## What lives here vs in the project

|  | AIWorkers | Project |
|---|---|---|
| Commit standards | ✅ | |
| Reusable slash commands | ✅ | |
| Agent personas | ✅ | |
| Domain context | | ✅ |
| Specific stack | | ✅ |
| Business rules | | ✅ |
| Project-specific commands | | ✅ |

---

## Available commands

| Command | Description |
|---|---|
| `/feature` | PDCA multi-agent workflow to plan, implement, review, and ship a feature |
| `/aiworkers:land` | Create branch + commit + PR in one step |
| `/rn-component` | Scaffold a React Native component using the Layered Hook Architecture |

Skills (auto-triggered by Claude based on context):

| Skill | Trigger |
|---|---|
| `branch` | When Claude needs to create a git branch |
| `commit` | When the user wants to commit changes |
| `pr` | When the user wants to open a pull request |

---

## Requirements

- Node.js 18+
- Claude Code with an active Pro or Team plan
- `gh` CLI installed and authenticated (required for `/pr` and `/feature`)

---

## Structure

```
AIWorkers/
├── src/
│   ├── commands/          # User-invokable slash commands
│   ├── skills/            # Context-triggered skills
│   ├── agents/            # Agent personas
│   └── rules/             # Composable rules
├── bin/
│   └── aiworkers.js       # CLI entry point
├── scripts/
│   └── setup.sh           # Legacy bash setup (Unix only)
├── docs/                  # Decisions, patterns, and reference docs
├── CLAUDE.md
└── package.json
```
