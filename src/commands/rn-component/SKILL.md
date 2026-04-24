---
name: rn-component
description: Scaffolds a React Native component using the Layered Hook Architecture (View / ViewModel / Styles / Animated / Services / Library). Use ONLY when the user explicitly types /rn-component.
argument-hint: --name <ComponentName> [--path <output-dir>]
allowed-tools: Bash, Read, Write
model: haiku
---

## Pre-flight — Parse arguments

Extract `--name` and `--path` values from `$ARGUMENTS`.

- If `--name` is missing: stop and print `⚠️ Missing --name. Usage: /rn-component --name MyButton --path src/components`
- If `--name` is not valid PascalCase (`^[A-Z][A-Za-z0-9]*$`): stop and print `⚠️ Invalid component name. Must be PascalCase (e.g. MyButton).`
- If `--path` is missing: ask the user `Where should the component be created? Provide the output directory path:` and wait for their answer before continuing.
- If `--path` contains spaces: stop and print `⚠️ Path must not contain spaces. Please provide a single-token path.`

## Derive variables

- `ComponentName` = value of `--name` (PascalCase)
- `componentName` = `ComponentName` with first letter lowercased (camelCase)
- `outputDir` = `<path>/<ComponentName>` — resolve `--path` to an absolute path if relative (use `pwd` to resolve)

## Collision check

Run via Bash:
```bash
[ -d "<outputDir>" ] && [ "$(ls -A "<outputDir>")" ] && echo "NONEMPTY" || echo "OK"
```

If the result is `NONEMPTY`: stop and print `⚠️ <outputDir> already exists. Aborting to avoid overwrite.`

## Architecture summary

Read `references/architecture.md` (path relative to this SKILL.md file), then print a 3-line summary to the user:
- Layer overview (View / ViewModel / Styles / Animation / Services / Library)
- Type convention (I prefix for interfaces, barrel index.ts in every export folder)
- Barrel cycle rule (deep relative imports only, never ../..)

## Create directory tree

Run via Bash:
```bash
mkdir -p \
  <outputDir>/types \
  <outputDir>/hooks/use<ComponentName>ViewModel/types \
  <outputDir>/hooks/useReanimatedStyles/types \
  <outputDir>/services \
  <outputDir>/library
```

## Generate files

For each template below:
1. Read the template file (path relative to this SKILL.md).
2. Replace every occurrence of `{{ComponentName}}` with the value of `ComponentName`.
3. Replace every occurrence of `{{componentName}}` with the value of `componentName`.
4. Write the result to the target path.

| Template (relative to this file) | Target |
|-----------------------------------|--------|
| `references/templates/index.tsx.tmpl` | `<outputDir>/index.tsx` |
| `references/templates/styles.ts.tmpl` | `<outputDir>/styles.ts` |
| `references/templates/types/IComponentNameProps.ts.tmpl` | `<outputDir>/types/I<ComponentName>Props.ts` |
| `references/templates/types/index.ts.tmpl` | `<outputDir>/types/index.ts` |
| `references/templates/hooks/index.ts.tmpl` | `<outputDir>/hooks/index.ts` |
| `references/templates/hooks/useComponentNameViewModel/index.ts.tmpl` | `<outputDir>/hooks/use<ComponentName>ViewModel/index.ts` |
| `references/templates/hooks/useComponentNameViewModel/types/IUseComponentNameViewModelReturn.ts.tmpl` | `<outputDir>/hooks/use<ComponentName>ViewModel/types/IUse<ComponentName>ViewModelReturn.ts` |
| `references/templates/hooks/useComponentNameViewModel/types/index.ts.tmpl` | `<outputDir>/hooks/use<ComponentName>ViewModel/types/index.ts` |
| `references/templates/hooks/useReanimatedStyles/index.ts.tmpl` | `<outputDir>/hooks/useReanimatedStyles/index.ts` |
| `references/templates/hooks/useReanimatedStyles/types/IUseReanimatedStylesProps.ts.tmpl` | `<outputDir>/hooks/useReanimatedStyles/types/IUseReanimatedStylesProps.ts` |
| `references/templates/hooks/useReanimatedStyles/types/index.ts.tmpl` | `<outputDir>/hooks/useReanimatedStyles/types/index.ts` |
| `references/templates/services/index.ts.tmpl` | `<outputDir>/services/index.ts` |
| `references/templates/library/index.ts.tmpl` | `<outputDir>/library/index.ts` |

## Confirmation

Run via Bash:
```bash
find <outputDir> -type f | sort
```

Print:
- `✓ Component scaffolded at <outputDir>`
- `Note: ensure react-native-reanimated is installed in your project.`

## Rules

- Never run `git add`, never commit, never create a branch. Scaffolding only.
- Never overwrite existing files — the collision check blocks the whole run.
- Do not install dependencies.
- Do not reformat the user's existing code.
- Do not push. Do not open a PR.
