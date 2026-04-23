# Skills and Commands — Required format

## User-invokable commands (`/name`)

Use the `commands/<name>/SKILL.md` format:

```
commands/
└── <name>/
    ├── SKILL.md       ← required
    ├── references/    ← optional
    ├── examples/      ← optional
    └── scripts/       ← optional
```

## Context-triggered skills

Use the `skills/<name>/SKILL.md` format:

```
skills/
└── <name>/
    ├── SKILL.md       ← required
    ├── references/    ← optional
    ├── examples/      ← optional
    └── scripts/       ← optional
```

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
