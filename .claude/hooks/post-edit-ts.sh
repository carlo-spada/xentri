#!/bin/bash
# Post-edit hook for *.ts and *.tsx files
# Runs typecheck after TypeScript edits
#
# Exit codes:
#   0 = success (output added to context)
#   2 = blocking error (stops operation)

set -uo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[[ -z "$FILE_PATH" ]] && exit 0
[[ ! "$FILE_PATH" =~ \.(ts|tsx)$ ]] && exit 0

# Skip test files and config files
[[ "$FILE_PATH" =~ \.(test|spec)\.(ts|tsx)$ ]] && exit 0
[[ "$FILE_PATH" =~ (vitest|jest|tsconfig)\..*$ ]] && exit 0

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

echo "--- Type checking: $(basename "$FILE_PATH") ---"

# Run typecheck (full workspace)
if ! OUTPUT=$(pnpm --silent run typecheck 2>&1); then
  echo "[FAIL] TypeScript errors:"
  echo "$OUTPUT"
  echo ""
  echo "Fix type errors before proceeding."
  exit 0  # Change to exit 2 to block
fi

echo "[OK] Type check passed"
exit 0
