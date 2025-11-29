#!/bin/bash
#
# add-subcategory.sh - Add a new sub-category to a category in Xentri
#
# Usage: ./scripts/add-subcategory.sh <category> <subcategory> "<purpose>" [--meta]
#
# Examples:
#   ./scripts/add-subcategory.sh strategy copilot "AI strategy conversations"
#   ./scripts/add-subcategory.sh platform monitoring "System observability" --meta
#
# What this script does:
#   1. Adds the sub-category to docs/manifest.yaml under the category
#   2. Creates the docs/{category}/{subcategory}/ folder with README.md
#
# Note: Sub-categories have their own product strategy (PRD, architecture).
#       Modules are implementation units within sub-categories.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MANIFEST_FILE="$PROJECT_ROOT/docs/manifest.yaml"

# Parse arguments
CATEGORY=""
SUBCATEGORY=""
PURPOSE=""
META=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --meta)
            META=true
            shift
            ;;
        *)
            if [ -z "$CATEGORY" ]; then
                CATEGORY="$1"
            elif [ -z "$SUBCATEGORY" ]; then
                SUBCATEGORY="$1"
            elif [ -z "$PURPOSE" ]; then
                PURPOSE="$1"
            fi
            shift
            ;;
    esac
done

# Validate arguments
if [ -z "$CATEGORY" ] || [ -z "$SUBCATEGORY" ] || [ -z "$PURPOSE" ]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    echo ""
    echo "Usage: $0 <category> <subcategory> \"<purpose>\" [--meta]"
    echo ""
    echo "Options:"
    echo "  --meta    Mark sub-category as meta (internal, not user-facing)"
    echo ""
    echo "Examples:"
    echo "  $0 strategy copilot \"AI strategy conversations\""
    echo "  $0 platform monitoring \"System observability\" --meta"
    exit 1
fi

# Validate names (lowercase, alphanumeric, hyphens only)
if [[ ! "$SUBCATEGORY" =~ ^[a-z][a-z0-9-]*$ ]]; then
    echo -e "${RED}Error: Sub-category name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens${NC}"
    exit 1
fi

# Check if category exists in manifest
if ! grep -q "^  $CATEGORY:" "$MANIFEST_FILE"; then
    echo -e "${RED}Error: Category '$CATEGORY' not found in manifest${NC}"
    echo ""
    echo "Valid categories:"
    grep -E "^  [a-z]+:" "$MANIFEST_FILE" | grep -v "subcategories:" | head -8 | sed 's/://g' | sed 's/^  /  - /'
    exit 1
fi

# Check if subcategory already exists
if grep -q "^      $SUBCATEGORY:" "$MANIFEST_FILE"; then
    echo -e "${RED}Error: Sub-category '$SUBCATEGORY' already exists${NC}"
    exit 1
fi

echo -e "${BLUE}Adding sub-category: ${GREEN}$CATEGORY/$SUBCATEGORY${NC}"
echo -e "${BLUE}Purpose: ${NC}$PURPOSE"
[ "$META" = true ] && echo -e "${BLUE}Meta: ${NC}Yes (internal infrastructure)"
echo ""

# Step 1: Create documentation folder
DOC_PATH="$PROJECT_ROOT/docs/$CATEGORY/$SUBCATEGORY"
echo -e "${YELLOW}1. Creating documentation folder...${NC}"

mkdir -p "$DOC_PATH"

# Determine meta status text
if [ "$META" = true ]; then
    META_TEXT="(meta)"
else
    META_TEXT=""
fi

# Create README.md
cat > "$DOC_PATH/README.md" << EOF
# ${SUBCATEGORY^}

> $PURPOSE

**Category:** ${CATEGORY^} $META_TEXT
**Sub-category:** ${SUBCATEGORY}
**Status:** Draft

## Purpose

$PURPOSE

## Modules

| Module | Purpose | Status |
|--------|---------|--------|
| - | No modules yet | - |

Add modules using:

\`\`\`bash
./scripts/add-module.sh $CATEGORY $SUBCATEGORY <module-name>
\`\`\`

## Dependencies

| Depends On | Relationship |
|------------|--------------|
| TBD | TBD |

---

*Sub-category documentation to be expanded as development begins.*
EOF

echo -e "   ${GREEN}Created: docs/$CATEGORY/$SUBCATEGORY/${NC}"

# Step 2: Update manifest.yaml
echo -e "${YELLOW}2. Updating manifest.yaml...${NC}"

TEMP_FILE=$(mktemp)

# Determine meta value
if [ "$META" = true ]; then
    META_VALUE="true"
else
    META_VALUE="false"
fi

# Add subcategory to the category's subcategories section
# This is tricky because we need to handle the YAML structure properly
python3 << PYTHON
import yaml
import sys

manifest_file = "$MANIFEST_FILE"
category = "$CATEGORY"
subcategory = "$SUBCATEGORY"
purpose = "$PURPOSE"
meta = $( [ "$META" = true ] && echo "True" || echo "False" )

with open(manifest_file, 'r') as f:
    content = f.read()

# Parse YAML
data = yaml.safe_load(content)

# Add the subcategory
if 'subcategories' not in data['categories'][category]:
    data['categories'][category]['subcategories'] = {}

data['categories'][category]['subcategories'][subcategory] = {
    'purpose': purpose,
    'meta': meta,
    'type': 'meta' if meta else 'spa',
    'modules': []
}

# Write back
with open(manifest_file, 'w') as f:
    yaml.dump(data, f, default_flow_style=False, sort_keys=False, allow_unicode=True, width=120)

print("Manifest updated successfully")
PYTHON

echo -e "   ${GREEN}Updated: docs/manifest.yaml${NC}"

# Summary
echo ""
echo -e "${GREEN}Sub-category '$CATEGORY/$SUBCATEGORY' added successfully!${NC}"
echo ""
echo -e "${BLUE}What was created:${NC}"
echo "  - docs/$CATEGORY/$SUBCATEGORY/README.md"
echo "  - Sub-category definition in manifest.yaml"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Add modules: ./scripts/add-module.sh $CATEGORY $SUBCATEGORY <module-name>"
echo "  2. Create PRD and architecture docs as needed"
echo ""
