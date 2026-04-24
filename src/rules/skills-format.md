# Skills and Commands — Required format

## User-invokable commands (`/name`)

Commands are invoked **only** when the user explicitly types `/name`. Claude must never auto-trigger a command based on context — that is exclusively for skills. Use `commands/<name>/SKILL.md`:

```
commands/
└── <name>/
    ├── SKILL.md       ← required
    ├── references/    ← optional
    ├── examples/      ← optional
    └── scripts/       ← optional
```

Examples: `/feature`, `/ship`

## Routing rule

**Before invoking any skill or command, apply this decision tree — no exceptions:**

1. Did the user's message contain the exact slash command text (e.g. `/aiworkers:land`, `/feature`)? 
   - **YES** → use the matching `commands/<name>/SKILL.md`
   - **NO** → go to step 2

2. Find the relevant context-triggered skill in `skills/` and read its `SKILL.md` directly.

**Never use `commands/` when the user did not type the slash command.** Pattern-matching intent (e.g. "commit my changes" → `/aiworkers:land`) is forbidden. Always route through `skills/` for natural language requests.


## Context-triggered skills

Skills are invoked automatically by Claude when relevant — never by the user. Always include `user-invocable: false` in frontmatter. Use `skills/<name>/SKILL.md`:

```
skills/
└── <name>/
    ├── SKILL.md       ← required (must have user-invocable: false)
    ├── references/    ← optional
    ├── examples/      ← optional
    └── scripts/       ← optional
```

Examples: `branch`, `commit`, `pr`

Never use the legacy flat formats `commands/<name>.md` or `skills/<name>.md`.

## Agent persona files (`agents/`)

Agent personas live in `src/agents/<role>.md` and are synced to `~/.claude/agents/` by `setup.sh`.

```
agents/
├── planner.md      ← senior software architect
├── implementer.md  ← senior software engineer
├── reviewer.md     ← senior code reviewer
└── fixer.md        ← bug fix specialist
```

### Rules

- Agent files use no frontmatter — plain Markdown only.
- Agent files are written in English only.
- Agent files are **never** imported into `CLAUDE.md`. They are loaded on demand by skills.
- When a skill spawns an agent, it instructs the agent to Read the persona file and inline its content at the start of the spawn prompt, followed by task-specific context.
- Personas define identity, expertise, mindset, and approach. Task-specific instructions (plan content, diff, branch name, etc.) always live inline in the skill, not in the agent file.

### File format

```markdown
# <Role>

## Identity
One paragraph.

## Expertise
- bullet list

## Mindset
- bullet list

## Approach
- bullet list
```
