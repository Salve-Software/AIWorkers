# AI Context: agents-personas

## What was built
Agent persona files were extracted from inline skill prompts in `src/commands/feature/SKILL.md` into dedicated `src/agents/<role>.md` files. Each file defines the agent's identity, expertise, mindset, and approach — not task logic. Skills now instruct the orchestrator to Read the persona file and inline its content at spawn time, making personas reusable across any future skill without duplication.

## Files changed
- `src/agents/planner.md` — new; senior architect persona, read before Phase 1 spawn
- `src/agents/implementer.md` — new; implementer persona, read before Phase 2 spawn
- `src/agents/reviewer.md` — new; reviewer persona, read before Phase 3b spawn
- `src/agents/fixer.md` — new; fixer persona, read before Phase 3a-fix and Phase 4 spawns
- `src/commands/feature/SKILL.md` — inline persona openings replaced with "Read src/agents/<role>.md and inline its full content"; Phase 4 heading deduplication (was two Phase 4s, now Phase 4 + Phase 5); co-author corrected to Sonnet 4.6 for Sonnet-spawned agents; test retry loop capped at 2 attempts with abort path; added guard to verify required commands exist before Phase 2
- `scripts/setup.sh` — added agents sync block; added stale symlink cleanup (`find -xtype l -delete`) before each sync loop
- `src/rules/skills-format.md` — added agents/ convention section

## Key decisions
- Personas are NOT imported in CLAUDE.md — they enter context only when a skill explicitly reads them, avoiding unnecessary context bloat in sessions that don't use them
- The orchestrator reads the file with the Read tool and inlines content into the prompt string before calling Agent — this is reliable vs. hoping @agents/name.md expands inside an Agent tool prompt
- setup.sh symlinks agents to ~/.claude/agents/ for discoverability but does not inject imports

## Gotchas
- When adding a new skill that spawns agents, always Read the persona file explicitly and inline it — do not reference it with @agents/name.md in the spawn prompt string (expansion not guaranteed)
- Persona files must describe identity only — never put task instructions (e.g. "run /commit") inside agent files
- The fixer persona is used in two places: Phase 3a-fix (test failures) and Phase 4 (review issues) — same persona, different task context passed inline
