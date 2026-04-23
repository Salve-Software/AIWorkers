#!/bin/bash

AIWORKERS_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CLAUDE_DIR="$AIWORKERS_DIR/.claude"
CLAUDE_COMMANDS="$CLAUDE_DIR/commands"
CLAUDE_RULES="$CLAUDE_DIR/rules"
CLAUDE_AGENTS="$CLAUDE_DIR/agents"
CLAUDE_MD="$CLAUDE_DIR/CLAUDE.md"

mkdir -p "$CLAUDE_COMMANDS"
mkdir -p "$CLAUDE_RULES"
mkdir -p "$CLAUDE_AGENTS"
touch "$CLAUDE_MD"

echo "Linking AIWorkers to .claude/..."
echo ""

# Link commands
echo "Commands:"
find "$CLAUDE_COMMANDS" -maxdepth 1 -type l | while read -r f; do [ ! -e "$f" ] && rm "$f"; done
for dir in "$AIWORKERS_DIR/src/commands"/*/; do
  name=$(basename "$dir")
  ln -sfn "$dir" "$CLAUDE_COMMANDS/$name"
  echo "  ✓ $name"
done

echo ""

# Link agents (symlinks only — no CLAUDE.md imports)
echo "Agents:"
find "$CLAUDE_AGENTS" -maxdepth 1 -type l | while read -r f; do [ ! -e "$f" ] && rm "$f"; done
for file in "$AIWORKERS_DIR/src/agents"/*.md; do
  [ -e "$file" ] || continue
  name=$(basename "$file")
  ln -sfn "$file" "$CLAUDE_AGENTS/$name"
  echo "  ✓ $name"
done

echo ""

# Link rules
echo "Rules:"
find "$CLAUDE_RULES" -maxdepth 1 -type l | while read -r f; do [ ! -e "$f" ] && rm "$f"; done
for file in "$AIWORKERS_DIR/src/rules"/*.md; do
  [ -e "$file" ] || continue
  name=$(basename "$file")
  ln -sfn "$file" "$CLAUDE_RULES/$name"
  echo "  ✓ $name"
done

echo ""

# Add rule imports to .claude/CLAUDE.md (idempotent)
echo "Updating .claude/CLAUDE.md:"
for file in "$AIWORKERS_DIR/src/rules"/*.md; do
  [ -e "$file" ] || continue
  name=$(basename "$file")
  import_line="@rules/$name"
  if ! grep -qF "$import_line" "$CLAUDE_MD"; then
    echo "$import_line" >> "$CLAUDE_MD"
    echo "  ✓ Added import: $import_line"
  else
    echo "  — Already imported: $import_line"
  fi
done

echo ""
echo "Done. AIWorkers is fully linked to .claude/"
