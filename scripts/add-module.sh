#!/bin/bash
#
# add-module.sh - Add a new module to a sub-category in Xentri
#
# Usage: ./scripts/add-module.sh <category> <subcategory> <module-name> [--package <path>]
#
# Examples:
#   ./scripts/add-module.sh platform infrastructure events
#   ./scripts/add-module.sh platform backend billing-api --package services/billing
#
# What this script does:
#   1. Updates docs/manifest.yaml to add the module under the sub-category
#   2. Creates the docs/{category}/{subcategory}/{module}/ folder structure
#   3. Creates standard module files (README.md, sprint-artifacts/)
#   4. Creates GitHub team label (if gh CLI available)
#
# Single Source of Truth: docs/manifest.yaml
# Agents read from manifest dynamically - no agent files need updating!

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
MODULE=""
PACKAGE_PATH=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --package)
            PACKAGE_PATH="$2"
            shift 2
            ;;
        *)
            if [ -z "$CATEGORY" ]; then
                CATEGORY="$1"
            elif [ -z "$SUBCATEGORY" ]; then
                SUBCATEGORY="$1"
            elif [ -z "$MODULE" ]; then
                MODULE="$1"
            fi
            shift
            ;;
    esac
done

# Validate arguments
if [ -z "$CATEGORY" ] || [ -z "$SUBCATEGORY" ] || [ -z "$MODULE" ]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    echo ""
    echo "Usage: $0 <category> <subcategory> <module-name> [--package <path>]"
    echo ""
    echo "Categories: platform, strategy, marketing, sales, finance, operations, team, legal"
    echo ""
    echo "Examples:"
    echo "  $0 platform infrastructure events"
    echo "  $0 platform backend billing-api --package services/billing"
    exit 1
fi

# Validate module name (lowercase, alphanumeric, hyphens only)
if [[ ! "$MODULE" =~ ^[a-z][a-z0-9-]*$ ]]; then
    echo -e "${RED}Error: Module name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens${NC}"
    exit 1
fi

# Validate category exists in manifest
if ! grep -q "^  $CATEGORY:" "$MANIFEST_FILE"; then
    echo -e "${RED}Error: Category '$CATEGORY' not found in manifest${NC}"
    echo ""
    echo "Valid categories:"
    grep -E "^  [a-z]+:" "$MANIFEST_FILE" | grep -v "subcategories:" | head -8 | sed 's/://g' | sed 's/^  /  - /'
    exit 1
fi

# Validate subcategory exists under category
if ! grep -q "^      $SUBCATEGORY:" "$MANIFEST_FILE"; then
    echo -e "${RED}Error: Sub-category '$SUBCATEGORY' not found under category '$CATEGORY'${NC}"
    echo ""
    echo "Available sub-categories in $CATEGORY:"
    # Try to list subcategories (simplified check)
    echo "  Check docs/manifest.yaml for available sub-categories"
    echo ""
    echo "To create a new sub-category:"
    echo "  ./scripts/add-subcategory.sh $CATEGORY $SUBCATEGORY \"<purpose>\""
    exit 1
fi

echo -e "${BLUE}Adding module: ${GREEN}$CATEGORY/$SUBCATEGORY/$MODULE${NC}"
echo ""

# Step 1: Create documentation folder structure
DOC_PATH="$PROJECT_ROOT/docs/$CATEGORY/$SUBCATEGORY/$MODULE"
echo -e "${YELLOW}1. Creating documentation structure...${NC}"

mkdir -p "$DOC_PATH/sprint-artifacts"
mkdir -p "$DOC_PATH/interfaces"

# Create README.md
cat > "$DOC_PATH/README.md" << EOF
# $MODULE

> **Category:** $CATEGORY → ${SUBCATEGORY^}
> **Status:** Draft
> **Package:** ${PACKAGE_PATH:-"N/A (documentation only)"}

## Overview

[Brief description of what this module does]

## Quick Links

- [Sprint Status](./sprint-artifacts/sprint-status.yaml) - Current Progress

## Ownership

- **Team Label:** team:$MODULE
- **Documentation:** docs/$CATEGORY/$SUBCATEGORY/$MODULE/

## Getting Started

[Instructions for working with this module]
EOF

# Create sprint-status.yaml
cat > "$DOC_PATH/sprint-artifacts/sprint-status.yaml" << EOF
# Sprint Status for $CATEGORY/$SUBCATEGORY/$MODULE
# This file tracks story progress for this module

module: $CATEGORY/$SUBCATEGORY/$MODULE
last_updated: $(date +%Y-%m-%d)

current_sprint:
  name: "Initial Setup"
  goal: "Bootstrap module documentation and structure"

stories: []
# Example:
# - id: story-1
#   title: "Example Story"
#   status: drafted  # drafted | approved | in_progress | review | done
#   assignee: null
EOF

# Create interfaces README
cat > "$DOC_PATH/interfaces/README.md" << EOF
# $MODULE Interfaces

This folder documents the public interfaces that $MODULE exposes to other modules.

## Consumers

[List modules that depend on this module's interfaces]

## Provided Interfaces

[Document exported types, APIs, events, etc.]
EOF

echo -e "   ${GREEN}Created: docs/$CATEGORY/$SUBCATEGORY/$MODULE/${NC}"

# Step 2: Update manifest.yaml
echo -e "${YELLOW}2. Updating manifest.yaml...${NC}"

# Use Python for reliable YAML manipulation
python3 << PYTHON
import yaml

manifest_file = "$MANIFEST_FILE"
category = "$CATEGORY"
subcategory = "$SUBCATEGORY"
module = "$MODULE"
package = "$PACKAGE_PATH" if "$PACKAGE_PATH" else None

with open(manifest_file, 'r') as f:
    data = yaml.safe_load(f)

# Create module entry
module_entry = {
    'name': module,
    'purpose': '[TODO: Add module purpose]',
    'status': 'draft'
}
if package:
    module_entry['package'] = package
    module_entry['team_label'] = f'team:{module}'
    module_entry['dependencies'] = []

# Add to subcategory's modules list
if 'modules' not in data['categories'][category]['subcategories'][subcategory]:
    data['categories'][category]['subcategories'][subcategory]['modules'] = []

data['categories'][category]['subcategories'][subcategory]['modules'].append(module_entry)

# Write back
with open(manifest_file, 'w') as f:
    yaml.dump(data, f, default_flow_style=False, sort_keys=False, allow_unicode=True, width=120)

print("Manifest updated successfully")
PYTHON

echo -e "   ${GREEN}Updated: docs/manifest.yaml${NC}"

# Step 3: Create GitHub label (if gh CLI available)
echo -e "${YELLOW}3. Creating GitHub label...${NC}"

if command -v gh &> /dev/null; then
    if gh auth status &> /dev/null; then
        LABEL_NAME="team:$MODULE"

        # Check if label already exists
        if gh label list | grep -q "$LABEL_NAME"; then
            echo -e "   ${YELLOW}Label '$LABEL_NAME' already exists${NC}"
        else
            gh label create "$LABEL_NAME" --description "Module: $CATEGORY/$SUBCATEGORY/$MODULE" --color "0366d6" 2>/dev/null || true
            echo -e "   ${GREEN}Created label: $LABEL_NAME${NC}"
        fi
    else
        echo -e "   ${YELLOW}Skipped: gh CLI not authenticated${NC}"
    fi
else
    echo -e "   ${YELLOW}Skipped: gh CLI not installed${NC}"
fi

# Step 4: Summary
echo ""
echo -e "${GREEN}Module '$CATEGORY/$SUBCATEGORY/$MODULE' added successfully!${NC}"
echo ""
echo -e "${BLUE}What was created:${NC}"
echo "  - docs/$CATEGORY/$SUBCATEGORY/$MODULE/README.md"
echo "  - docs/$CATEGORY/$SUBCATEGORY/$MODULE/sprint-artifacts/sprint-status.yaml"
echo "  - docs/$CATEGORY/$SUBCATEGORY/$MODULE/interfaces/README.md"
echo "  - Updated docs/manifest.yaml"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Edit docs/$CATEGORY/$SUBCATEGORY/$MODULE/README.md to add description"
echo "  2. Update the module's 'purpose' in docs/manifest.yaml"
echo "  3. BMM agents will now show '$MODULE' when you select '$CATEGORY/$SUBCATEGORY'"
echo ""
echo -e "${YELLOW}Tip: No agent files need updating - they read from manifest.yaml dynamically!${NC}"
