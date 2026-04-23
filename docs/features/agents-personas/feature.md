# Feature: agents-personas

## Summary
Extracts agent personas from inline skill prompts into dedicated reusable files under `src/agents/`. Each file defines who the agent IS — identity, expertise, mindset, and approach — decoupled from what task it performs. Skills reference these personas by reading the file and inlining its content at spawn time.

## Changes
- `src/agents/planner.md` — senior software architect persona
- `src/agents/implementer.md` — senior software engineer persona
- `src/agents/reviewer.md` — senior code reviewer persona
- `src/agents/fixer.md` — bug fix specialist persona
- `src/commands/feature/SKILL.md` — replaced inline persona openings with Read + inline instructions
- `scripts/setup.sh` — added agents sync block (symlinks to ~/.claude/agents/, no CLAUDE.md imports); added stale symlink cleanup for all three sync targets
- `src/rules/skills-format.md` — documented agents/ convention

## Usage
When spawning a subagent in any skill, read the persona file and inline its content at the start of the spawn prompt:

```
Read src/agents/reviewer.md and inline its full content at the start of this prompt.

[task-specific context follows]
```

## Notes
- Agent files are never imported into CLAUDE.md — loaded on demand only
- Personas define identity only; task-specific instructions stay inline in the skill
- setup.sh syncs src/agents/*.md to ~/.claude/agents/ via symlinks
