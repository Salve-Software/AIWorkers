# Git workflow

Always follow this order when working with changes:

1. `/branch` — create the branch first
2. `/commit` — commit changes on the branch
3. `/pr` — open PR from the branch to main

Never commit directly to `main` or `master`. If already on `main`, run `/branch` first before any commits.

## Branch naming conventions

- Release branches: `release/v{version}` — always include the `v` prefix (e.g. `release/v0.2.0`, `release/v1.0.0`).
- Dev branches: `dev/v{version}` (e.g. `dev/v1.0.0`).
- Feature branches: `feat/{description}` (e.g. `feat/atoms-components`).
