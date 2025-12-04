#!/bin/bash
# Post-edit hook for docs/**/*.md files
# Runs validate:docs and validate:links after markdown edits
#
# Exit codes:
#   0 = success (output added to context)
#   2 = blocking error (stops operation)

set -uo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[[ -z "$FILE_PATH" ]] && exit 0
[[ ! "$FILE_PATH" =~ /docs/.*\.md$ ]] && exit 0

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

echo "--- Validating: $(basename "$FILE_PATH") ---"

ERRORS=()

# Structure validation
if ! OUTPUT=$(pnpm --silent run validate:docs 2>&1); then
  ERRORS+=("[FAIL] Structure validation:\n$OUTPUT")
fi

# Link validation
if ! OUTPUT=$(pnpm --silent run validate:links 2>&1); then
  ERRORS+=("[FAIL] Link validation:\n$OUTPUT")
fi

if [[ ${#ERRORS[@]} -gt 0 ]]; then
  printf '%b\n' "${ERRORS[@]}"
  echo ""
  echo "Fix validation errors before proceeding."
  exit 0  # Change to exit 2 to block
fi

echo "[OK] Documentation validation passed"
exit 0
