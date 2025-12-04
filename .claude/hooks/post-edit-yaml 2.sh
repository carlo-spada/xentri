#!/bin/bash
# Post-edit hook for *.requirement.yaml and *.interface.yaml files
# Runs dependency validation after requirement/interface edits
#
# Exit codes:
#   0 = success (output added to context)
#   2 = blocking error (stops operation)

set -uo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[[ -z "$FILE_PATH" ]] && exit 0
[[ ! "$FILE_PATH" =~ \.(requirement|interface)\.yaml$ ]] && exit 0

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

echo "--- Validating dependencies: $(basename "$FILE_PATH") ---"

# Run dependency validation
if ! OUTPUT=$(pnpm exec tsx scripts/validation/validate-dependencies.ts 2>&1); then
  echo "[FAIL] Dependency validation:"
  echo "$OUTPUT"
  echo ""
  echo "Fix dependency errors before proceeding."
  exit 0  # Change to exit 2 to block
fi

echo "[OK] Dependency validation passed"
exit 0
