#!/bin/bash
#
# remove-subcategory.sh - Remove a sub-category from a category in Xentri
#
# Usage: ./scripts/remove-subcategory.sh <category> <subcategory> [--force]
#
# Examples:
#   ./scripts/remove-subcategory.sh strategy old-subcategory
#   ./scripts/remove-subcategory.sh platform deprecated --force
#
# What this script does:
#   1. Removes the sub-category from docs/manifest.yaml
#   2. Optionally deletes the docs/{category}/{subcategory}/ folder
#
# Use --force to skip confirmation prompts
#
# WARNING: This will also remove all modules under the sub-category!

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
FORCE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --force|-f)
            FORCE=true
            shift
            ;;
        *)
            if [ -z "$CATEGORY" ]; then
                CATEGORY="$1"
            elif [ -z "$SUBCATEGORY" ]; then
                SUBCATEGORY="$1"
            fi
            shift
            ;;
    esac
done

# Validate arguments
if [ -z "$CATEGORY" ] || [ -z "$SUBCATEGORY" ]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    echo ""
    echo "Usage: $0 <category> <subcategory> [--force]"
    echo ""
    echo "Options:"
    echo "  --force, -f    Skip confirmation prompts"
    echo ""
    echo "Examples:"
    echo "  $0 strategy old-subcategory"
    echo "  $0 platform deprecated --force"
    echo ""
    echo -e "${YELLOW}WARNING: This will also remove all modules under the sub-category!${NC}"
    exit 1
fi

DOC_PATH="$PROJECT_ROOT/docs/$CATEGORY/$SUBCATEGORY"

# Check if subcategory folder exists
if [ ! -d "$DOC_PATH" ]; then
    echo -e "${RED}Error: Sub-category folder '$DOC_PATH' not found${NC}"
    exit 1
fi

# Count modules
MODULE_COUNT=$(find "$DOC_PATH" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
FILE_COUNT=$(find "$DOC_PATH" -type f | wc -l | tr -d ' ')

echo -e "${RED}WARNING: You are about to remove sub-category: ${YELLOW}$CATEGORY/$SUBCATEGORY${NC}"
echo ""

# Show what will be affected
echo -e "${BLUE}This will:${NC}"
echo "  1. Remove '$SUBCATEGORY' from manifest.yaml"
echo "  2. Delete docs/$CATEGORY/$SUBCATEGORY/ ($FILE_COUNT files, $MODULE_COUNT modules)"
echo ""

if [ "$MODULE_COUNT" -gt 0 ]; then
    echo -e "${RED}⚠️  This sub-category contains $MODULE_COUNT module(s) that will be deleted!${NC}"
    echo ""
fi

# Confirmation
if [ "$FORCE" != true ]; then
    read -p "Are you sure you want to proceed? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Aborted.${NC}"
        exit 0
    fi
fi

echo ""
echo -e "${YELLOW}Removing sub-category '$CATEGORY/$SUBCATEGORY'...${NC}"
echo ""

# Step 1: Update manifest.yaml
echo -e "${YELLOW}1. Updating manifest.yaml...${NC}"

python3 << PYTHON
import yaml

manifest_file = "$MANIFEST_FILE"
category = "$CATEGORY"
subcategory = "$SUBCATEGORY"

with open(manifest_file, 'r') as f:
    data = yaml.safe_load(f)

# Remove subcategory
if subcategory in data['categories'][category].get('subcategories', {}):
    del data['categories'][category]['subcategories'][subcategory]

# Write back
with open(manifest_file, 'w') as f:
    yaml.dump(data, f, default_flow_style=False, sort_keys=False, allow_unicode=True, width=120)

print("Manifest updated successfully")
PYTHON

echo -e "   ${GREEN}Updated: docs/manifest.yaml${NC}"

# Step 2: Delete documentation folder
echo -e "${YELLOW}2. Deleting documentation folder...${NC}"

if [ "$FORCE" != true ]; then
    read -p "   Delete docs/$CATEGORY/$SUBCATEGORY/? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$DOC_PATH"
        echo -e "   ${GREEN}Deleted: docs/$CATEGORY/$SUBCATEGORY/${NC}"
    else
        echo -e "   ${YELLOW}Skipped: folder preserved${NC}"
    fi
else
    rm -rf "$DOC_PATH"
    echo -e "   ${GREEN}Deleted: docs/$CATEGORY/$SUBCATEGORY/${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}Sub-category '$CATEGORY/$SUBCATEGORY' removed successfully!${NC}"
echo ""
echo -e "${BLUE}What was removed:${NC}"
echo "  - Sub-category from manifest.yaml"
[ ! -d "$DOC_PATH" ] && echo "  - docs/$CATEGORY/$SUBCATEGORY/ folder"
echo ""
echo -e "${YELLOW}Note: BMM agents will no longer show '$SUBCATEGORY' as an option.${NC}"
