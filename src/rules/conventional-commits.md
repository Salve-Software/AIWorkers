# Conventional Commits

## Commit types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructuring without feature/fix |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system, dependencies |
| `ci` | CI/CD configuration |
| `chore` | Maintenance, tooling |
| `raw` | Raw data, config files |
| `cleanup` | Dead code removal, cleanup |
| `remove` | Removing features or files |

## Commit format

```
<type>(<scope>): <short description>

[optional body if subject is not enough]

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

- Subject: max 50 characters, imperative mood ("add", not "added")
- Scope: optional, keep it short (1 word max: `auth`, `ui`, `config`)
- Description: 2–4 words only — no full sentences
- Body: only when the subject alone is insufficient

## Rules

- Never mix unrelated changes in one commit
- Prefer smaller, focused commits
- If a file contains changes of different natures, split them and mention in the body
- Use `git diff HEAD -- <file>` to inspect specific changes before deciding grouping
- Never use `git add .` or `git add -A` — always stage specific files by name
- Never run `git push` — committing only, pushing is the user's responsibility
