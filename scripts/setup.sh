#!/bin/bash

AIWORKERS_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# When run via postinstall, $INIT_CWD is the consuming project root
# When run standalone, fall back to cwd
TARGET_DIR="${INIT_CWD:-$PWD}"

CLAUDE_DIR="$TARGET_DIR/.claude"
AW_COMMANDS="$CLAUDE_DIR/commands/aiworkers"
AW_SKILLS="$CLAUDE_DIR/skills/aiworkers"
AW_AGENTS="$CLAUDE_DIR/agents/aiworkers"
AW_RULES="$CLAUDE_DIR/rules/aiworkers"
CLAUDE_MD="$CLAUDE_DIR/CLAUDE.md"

mkdir -p "$AW_COMMANDS"
mkdir -p "$AW_SKILLS"
mkdir -p "$AW_AGENTS"
mkdir -p "$AW_RULES"
touch "$CLAUDE_MD"

echo "Linking AIWorkers to $CLAUDE_DIR..."
echo ""

# Link commands
echo "Commands:"
find "$AW_COMMANDS" -maxdepth 1 -type l | while read -r f; do [ ! -e "$f" ] && rm "$f"; done
for dir in "$AIWORKERS_DIR/src/commands"/*/; do
  name=$(basename "$dir")
  ln -sfn "$dir" "$AW_COMMANDS/$name"
  echo "  ✓ $name"
done

echo ""

# Link skills
echo "Skills:"
find "$AW_SKILLS" -maxdepth 1 -type l | while read -r f; do [ ! -e "$f" ] && rm "$f"; done
for dir in "$AIWORKERS_DIR/src/skills"/*/; do
  name=$(basename "$dir")
  ln -sfn "$dir" "$AW_SKILLS/$name"
  echo "  ✓ $name"
done

echo ""

# Link agents
echo "Agents:"
find "$AW_AGENTS" -maxdepth 1 -type l | while read -r f; do [ ! -e "$f" ] && rm "$f"; done
for file in "$AIWORKERS_DIR/src/agents"/*.md; do
  [ -e "$file" ] || continue
  name=$(basename "$file")
  ln -sfn "$file" "$AW_AGENTS/$name"
  echo "  ✓ $name"
done

echo ""

# Link rules
echo "Rules:"
find "$AW_RULES" -maxdepth 1 -type l | while read -r f; do [ ! -e "$f" ] && rm "$f"; done
for file in "$AIWORKERS_DIR/src/rules"/*.md; do
  [ -e "$file" ] || continue
  name=$(basename "$file")
  ln -sfn "$file" "$AW_RULES/$name"
  echo "  ✓ $name"
done

echo ""

# Add rule imports to .claude/CLAUDE.md (idempotent)
echo "Updating .claude/CLAUDE.md:"
for file in "$AIWORKERS_DIR/src/rules"/*.md; do
  [ -e "$file" ] || continue
  name=$(basename "$file")
  import_line="@rules/aiworkers/$name"
  if ! grep -qF "$import_line" "$CLAUDE_MD"; then
    echo "$import_line" >> "$CLAUDE_MD"
    echo "  ✓ Added import: $import_line"
  else
    echo "  — Already imported: $import_line"
  fi
done

echo ""

# Link settings.json
echo "Settings:"
ln -sfn "$AIWORKERS_DIR/settings.json" "$CLAUDE_DIR/settings.json"
echo "  ✓ settings.json"

echo ""
echo "Done. AIWorkers is fully linked to $CLAUDE_DIR"
