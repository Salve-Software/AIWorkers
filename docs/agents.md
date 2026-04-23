# Agent Personas

Agent personas live in `src/agents/` and are synced to `.claude/agents/` by `setup.sh`. They are loaded on demand by skills — never imported directly into `CLAUDE.md`.

| File | Role |
|---|---|
| `planner.md` | Senior software architect — produces implementation plans |
| `implementer.md` | Senior software engineer — writes and commits code |
| `reviewer.md` | Senior code reviewer — audits diffs for bugs and issues |
| `fixer.md` | Bug fix specialist — resolves review findings |

Each persona defines identity, expertise, mindset, and approach. Task-specific instructions (plan content, diff, branch name, etc.) are always passed inline by the skill that spawns the agent.
