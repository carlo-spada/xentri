#!/bin/bash
# Post-edit hook for docs/**/*.md files
# Checks for content duplication across documentation
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

echo "--- Checking duplication: $(basename "$FILE_PATH") ---"

# Run duplication check
if ! OUTPUT=$(pnpm exec tsx scripts/validation/check-doc-duplication.ts 2>&1); then
  echo "[WARN] Duplication detected:"
  echo "$OUTPUT"
  echo ""
  echo "Consider consolidating duplicated content."
  exit 0  # Warn only, don't block
fi

echo "[OK] No significant duplication found"
exit 0
