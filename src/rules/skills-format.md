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
