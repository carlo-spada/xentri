#!/bin/bash
# Pre-edit hook that BLOCKS edits to docs/manifest.yaml
# Enforces: Use scripts, not direct edits
#
# Exit codes:
#   0 = allow (not manifest.yaml)
#   2 = BLOCK (is manifest.yaml)

set -uo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[[ -z "$FILE_PATH" ]] && exit 0
[[ ! "$FILE_PATH" =~ /docs/manifest\.yaml$ ]] && exit 0

# This IS manifest.yaml — BLOCK the edit
cat >&2 << 'EOF'
BLOCKED: Do not edit docs/manifest.yaml directly.

Use the management scripts instead:

  Add category:      ./scripts/add-category.sh {name} "Description"
  Add subcategory:   ./scripts/add-subcategory.sh {cat} {sub} "Description"
  Add module:        ./scripts/add-module.sh {cat} {sub} {mod}
  Remove module:     ./scripts/remove-module.sh {cat} {sub} {mod}
  Sync folders:      ./scripts/sync-folders-from-manifest.sh

These scripts maintain consistency between manifest and folder structure.
EOF

exit 2
