#!/bin/bash
#
# remove-module.sh - Remove a module from a sub-category in Xentri
#
# Usage: ./scripts/remove-module.sh <category> <subcategory> <module-name> [--force]
#
# Examples:
#   ./scripts/remove-module.sh platform infrastructure events
#   ./scripts/remove-module.sh platform backend old-service --force
#
# What this script does:
#   1. Removes the module from docs/manifest.yaml
#   2. Optionally deletes the docs/{category}/{subcategory}/{module}/ folder
#   3. Optionally deletes the GitHub team label
#
# Use --force to skip confirmation prompts

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
    echo "Usage: $0 <category> <subcategory> <module-name> [--force]"
    echo ""
    echo "Options:"
    echo "  --force, -f    Skip confirmation prompts"
    echo ""
    echo "Examples:"
    echo "  $0 platform infrastructure events"
    echo "  $0 platform backend old-service --force"
    exit 1
fi

DOC_PATH="$PROJECT_ROOT/docs/$CATEGORY/$SUBCATEGORY/$MODULE"

# Check if module folder exists
if [ ! -d "$DOC_PATH" ]; then
    echo -e "${RED}Error: Module folder '$DOC_PATH' not found${NC}"
    exit 1
fi

echo -e "${RED}WARNING: You are about to remove module: ${YELLOW}$CATEGORY/$SUBCATEGORY/$MODULE${NC}"
echo ""

# Show what will be affected
echo -e "${BLUE}This will:${NC}"
echo "  1. Remove '$MODULE' from manifest.yaml subcategory modules list"
if [ -d "$DOC_PATH" ]; then
    FILE_COUNT=$(find "$DOC_PATH" -type f | wc -l | tr -d ' ')
    echo "  2. Delete docs/$CATEGORY/$SUBCATEGORY/$MODULE/ ($FILE_COUNT files)"
fi
echo "  3. Delete GitHub label 'team:$MODULE' (if exists)"
echo ""

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
echo -e "${YELLOW}Removing module '$CATEGORY/$SUBCATEGORY/$MODULE'...${NC}"
echo ""

# Step 1: Update manifest.yaml
echo -e "${YELLOW}1. Updating manifest.yaml...${NC}"

python3 << PYTHON
import yaml

manifest_file = "$MANIFEST_FILE"
category = "$CATEGORY"
subcategory = "$SUBCATEGORY"
module = "$MODULE"

with open(manifest_file, 'r') as f:
    data = yaml.safe_load(f)

# Remove module from subcategory's modules list
modules = data['categories'][category]['subcategories'][subcategory].get('modules', [])
data['categories'][category]['subcategories'][subcategory]['modules'] = [
    m for m in modules if m.get('name') != module
]

# Write back
with open(manifest_file, 'w') as f:
    yaml.dump(data, f, default_flow_style=False, sort_keys=False, allow_unicode=True, width=120)

print("Manifest updated successfully")
PYTHON

echo -e "   ${GREEN}Updated: docs/manifest.yaml${NC}"

# Step 2: Delete documentation folder
if [ -d "$DOC_PATH" ]; then
    echo -e "${YELLOW}2. Deleting documentation folder...${NC}"

    if [ "$FORCE" != true ]; then
        read -p "   Delete docs/$CATEGORY/$SUBCATEGORY/$MODULE/? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$DOC_PATH"
            echo -e "   ${GREEN}Deleted: docs/$CATEGORY/$SUBCATEGORY/$MODULE/${NC}"
        else
            echo -e "   ${YELLOW}Skipped: folder preserved${NC}"
        fi
    else
        rm -rf "$DOC_PATH"
        echo -e "   ${GREEN}Deleted: docs/$CATEGORY/$SUBCATEGORY/$MODULE/${NC}"
    fi
else
    echo -e "${YELLOW}2. Documentation folder...${NC}"
    echo -e "   ${YELLOW}Skipped: folder does not exist${NC}"
fi

# Step 3: Delete GitHub label
echo -e "${YELLOW}3. Removing GitHub label...${NC}"

if command -v gh &> /dev/null; then
    if gh auth status &> /dev/null; then
        LABEL_NAME="team:$MODULE"

        if gh label list 2>/dev/null | grep -q "$LABEL_NAME"; then
            if [ "$FORCE" != true ]; then
                read -p "   Delete GitHub label '$LABEL_NAME'? (y/N) " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    gh label delete "$LABEL_NAME" --yes 2>/dev/null || true
                    echo -e "   ${GREEN}Deleted label: $LABEL_NAME${NC}"
                else
                    echo -e "   ${YELLOW}Skipped: label preserved${NC}"
                fi
            else
                gh label delete "$LABEL_NAME" --yes 2>/dev/null || true
                echo -e "   ${GREEN}Deleted label: $LABEL_NAME${NC}"
            fi
        else
            echo -e "   ${YELLOW}Skipped: label '$LABEL_NAME' does not exist${NC}"
        fi
    else
        echo -e "   ${YELLOW}Skipped: gh CLI not authenticated${NC}"
    fi
else
    echo -e "   ${YELLOW}Skipped: gh CLI not installed${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}Module '$CATEGORY/$SUBCATEGORY/$MODULE' removed successfully!${NC}"
echo ""
echo -e "${BLUE}What was removed:${NC}"
echo "  - Module from manifest.yaml"
[ ! -d "$DOC_PATH" ] && echo "  - docs/$CATEGORY/$SUBCATEGORY/$MODULE/ folder"
echo ""
echo -e "${YELLOW}Note: BMM agents will no longer show '$MODULE' as an option.${NC}"
