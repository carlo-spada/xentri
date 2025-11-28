#!/bin/bash
#
# add-category.sh - Add a new category to the Xentri documentation structure
#
# Usage: ./scripts/add-category.sh <category-name> "<purpose description>"
#
# Examples:
#   ./scripts/add-category.sh analytics "Business Intelligence - dashboards, reports, metrics"
#   ./scripts/add-category.sh integrations "Third-party Integrations - Zapier, webhooks, APIs"
#
# What this script does:
#   1. Adds the category to docs/manifest.yaml
#   2. Creates the docs/{category}/ folder with README.md
#
# Note: Categories are high-level business domains. Think carefully before adding.
#       The 8 default categories cover most SMB needs.

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
CATEGORY="$1"
PURPOSE="$2"

# Validate arguments
if [ -z "$CATEGORY" ] || [ -z "$PURPOSE" ]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    echo ""
    echo "Usage: $0 <category-name> \"<purpose description>\""
    echo ""
    echo "Examples:"
    echo "  $0 analytics \"Business Intelligence - dashboards, reports, metrics\""
    echo "  $0 integrations \"Third-party Integrations - Zapier, webhooks, APIs\""
    echo ""
    echo -e "${YELLOW}Note: Categories are high-level business domains.${NC}"
    echo "The 8 default categories (platform, strategy, brand, sales, finance, operations, team, legal)"
    echo "cover most SMB needs. Add new categories sparingly."
    exit 1
fi

# Validate category name (lowercase, alphanumeric, hyphens only)
if [[ ! "$CATEGORY" =~ ^[a-z][a-z0-9-]*$ ]]; then
    echo -e "${RED}Error: Category name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens${NC}"
    exit 1
fi

# Check if category already exists
if grep -q "^  $CATEGORY:" "$MANIFEST_FILE"; then
    echo -e "${RED}Error: Category '$CATEGORY' already exists in manifest${NC}"
    exit 1
fi

echo -e "${BLUE}Adding category: ${GREEN}$CATEGORY${NC}"
echo -e "${BLUE}Purpose: ${NC}$PURPOSE"
echo ""

# Step 1: Create documentation folder
DOC_PATH="$PROJECT_ROOT/docs/$CATEGORY"
echo -e "${YELLOW}1. Creating documentation folder...${NC}"

mkdir -p "$DOC_PATH"

# Create README.md
cat > "$DOC_PATH/README.md" << EOF
# $CATEGORY

> **Purpose:** $PURPOSE
> **Status:** New

## Overview

This category contains modules related to: $PURPOSE

## Modules

No modules yet. Add modules using:

\`\`\`bash
./scripts/add-module.sh $CATEGORY <module-name>
\`\`\`

## Getting Started

[Instructions for working with this category]
EOF

echo -e "   ${GREEN}Created: docs/$CATEGORY/${NC}"

# Step 2: Update manifest.yaml - add to categories section
echo -e "${YELLOW}2. Updating manifest.yaml...${NC}"

TEMP_FILE=$(mktemp)

# Find the last category and add after it (before modules section or next major section)
awk -v category="$CATEGORY" -v purpose="$PURPOSE" '
    /^  legal:/ {
        # Print legal category
        print
        # Read and print remaining lines of legal block
        while ((getline line) > 0) {
            if (line ~ /^  [a-z]+:/ || line ~ /^# =/ || line ~ /^modules:/) {
                # Add new category before this line
                print ""
                print "  " category ":"
                print "    purpose: \"" purpose "\""
                print "    modules: []  # Add modules with: ./scripts/add-module.sh " category " <name>"
                print ""
                print line
                break
            }
            print line
        }
        next
    }
    { print }
' "$MANIFEST_FILE" > "$TEMP_FILE"

mv "$TEMP_FILE" "$MANIFEST_FILE"

echo -e "   ${GREEN}Updated: docs/manifest.yaml${NC}"

# Summary
echo ""
echo -e "${GREEN}Category '$CATEGORY' added successfully!${NC}"
echo ""
echo -e "${BLUE}What was created:${NC}"
echo "  - docs/$CATEGORY/README.md"
echo "  - Category definition in manifest.yaml"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Add modules: ./scripts/add-module.sh $CATEGORY <module-name>"
echo "  2. BMM agents will now show '$CATEGORY' in category selection"
echo ""
echo -e "${YELLOW}Tip: Categories are high-level. Most features should be modules within existing categories.${NC}"
