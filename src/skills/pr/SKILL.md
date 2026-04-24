---
name: pr
description: This skill should be used when the user asks to "create a pull request", "open a PR", "create a PR", or at the end of a feature workflow to ship the branch as a PR on GitHub.
argument-hint: [optional: PR title override]
allowed-tools: [Bash, Read, Glob]
model: haiku
user-invocable: false
---

# Pull Request Creator

Creates a GitHub pull request for the current branch using the `gh` CLI.

## Process

### 1. Verify prerequisites

Run `gh auth status` to confirm the user is authenticated.
- If not authenticated: stop and instruct: *"Run `gh auth login` first, then retry /pr."*

Check if the current branch has been pushed to remote:
```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null
```
- If no upstream is set: run `git push -u origin <branch>` automatically, then continue.

### 2. Gather context

- Current branch: `git branch --show-current`
- Base branch: detect from `git log --oneline` or default to `main`
- Commits on this branch: `git log <base>...HEAD --oneline`
- Feature docs: read `docs/features/<branch-slug>/feature.md` if it exists — use as primary source for PR body

### 3. Load PR template

Look for a PR template in this order:
1. `.github/pull_request_template.md` in the **project root** (the repo consuming AIWorkers)
2. Fall back to the **AIWorkers own** `.github/pull_request_template.md`

### 4. Generate PR title

Derive from branch name following Conventional Commits style:
- `feat/add-refresh-button` → `feat: add refresh button`
- `fix/refresh-button-color` → `fix: refresh button color`
- `dev/home-refresh` → `dev: home refresh`
- `release/v1.1.0` → `release: v1.1.0`

If `$ARGUMENTS` is provided, use it as the title instead.

### 5. Fill the template

Use the gathered context (commits, feature.md content, branch name) to fill every section of the PR template. Do not leave placeholder comments unfilled.

### 6. Create the PR



```bash
gh pr create --title "<title>" --body "$(cat <<'EOF'
<filled template body>
EOF
)"
```

### 7. Output the PR URL


Display: `✓ PR created: <URL>`

---

## Rules

- If the branch has no upstream, push it automatically with `git push -u origin <branch>` before creating the PR
- Do not set reviewers, labels, or assignees — leave that to the user
- If the branch has no commits ahead of base, stop and warn the user
- **Never invent a PR body.** Always read the template file and use it as the body structure — including all emojis, sections, and checkboxes exactly as they appear
