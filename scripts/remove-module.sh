#!/bin/bash
#
# remove-module.sh - Remove a module from the Xentri documentation structure
#
# Usage: ./scripts/remove-module.sh <category> <module-name> [--force]
#
# Examples:
#   ./scripts/remove-module.sh strategy copilot
#   ./scripts/remove-module.sh platform old-service --force
#
# What this script does:
#   1. Removes the module from docs/manifest.yaml
#   2. Optionally deletes the docs/{category}/{module}/ folder
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
            elif [ -z "$MODULE" ]; then
                MODULE="$1"
            fi
            shift
            ;;
    esac
done

# Validate arguments
if [ -z "$CATEGORY" ] || [ -z "$MODULE" ]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    echo ""
    echo "Usage: $0 <category> <module-name> [--force]"
    echo ""
    echo "Options:"
    echo "  --force, -f    Skip confirmation prompts"
    echo ""
    echo "Examples:"
    echo "  $0 strategy copilot"
    echo "  $0 platform old-service --force"
    exit 1
fi

# Check if module exists in manifest
if ! grep -q "^  $MODULE:" "$MANIFEST_FILE"; then
    echo -e "${RED}Error: Module '$MODULE' not found in manifest${NC}"
    exit 1
fi

# Verify module belongs to specified category
MODULE_CATEGORY=$(grep -A1 "^  $MODULE:" "$MANIFEST_FILE" | grep "category:" | awk '{print $2}')
if [ "$MODULE_CATEGORY" != "$CATEGORY" ]; then
    echo -e "${RED}Error: Module '$MODULE' belongs to category '$MODULE_CATEGORY', not '$CATEGORY'${NC}"
    exit 1
fi

DOC_PATH="$PROJECT_ROOT/docs/$CATEGORY/$MODULE"

echo -e "${RED}WARNING: You are about to remove module: ${YELLOW}$CATEGORY/$MODULE${NC}"
echo ""

# Show what will be affected
echo -e "${BLUE}This will:${NC}"
echo "  1. Remove '$MODULE' from manifest.yaml categories.$CATEGORY.modules array"
echo "  2. Remove '$MODULE' definition from manifest.yaml modules section"
if [ -d "$DOC_PATH" ]; then
    FILE_COUNT=$(find "$DOC_PATH" -type f | wc -l | tr -d ' ')
    echo "  3. Delete docs/$CATEGORY/$MODULE/ ($FILE_COUNT files)"
fi
echo "  4. Delete GitHub label 'team:$MODULE' (if exists)"
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
echo -e "${YELLOW}Removing module '$CATEGORY/$MODULE'...${NC}"
echo ""

# Step 1: Remove from categories.{category}.modules array
echo -e "${YELLOW}1. Updating manifest.yaml (categories section)...${NC}"

TEMP_FILE=$(mktemp)

# Remove module from the category's modules array
awk -v category="$CATEGORY" -v module="$MODULE" '
    /^  '"$CATEGORY"':/ { in_category = 1 }
    in_category && /modules:/ {
        # Handle different array formats
        if (/modules: \['"$MODULE"'\]/) {
            # Only module in array
            sub(/modules: \['"$MODULE"'\]/, "modules: []")
        } else if (/modules: \['"$MODULE"', /) {
            # First in array
            sub(/'"$MODULE"', /, "")
        } else if (/, '"$MODULE"'\]/) {
            # Last in array
            sub(/, '"$MODULE"'\]/, "]")
        } else if (/, '"$MODULE"',/) {
            # Middle of array
            sub(/, '"$MODULE"'/, "")
        }
        in_category = 0
    }
    { print }
' "$MANIFEST_FILE" > "$TEMP_FILE"

mv "$TEMP_FILE" "$MANIFEST_FILE"

# Step 2: Remove module definition from modules section
echo -e "${YELLOW}2. Updating manifest.yaml (modules section)...${NC}"

TEMP_FILE=$(mktemp)

# Remove the entire module block (from "  module:" to next "  other-module:" or section)
awk -v module="$MODULE" '
    /^  '"$MODULE"':$/ {
        skip = 1
        next
    }
    skip && /^  [a-z]/ { skip = 0 }
    skip && /^# =/ { skip = 0 }
    skip && /^$/ { next }  # Skip empty lines within block
    !skip { print }
' "$MANIFEST_FILE" > "$TEMP_FILE"

# Clean up any double blank lines
awk 'NF || !blank++ {print; if (NF) blank=0}' "$TEMP_FILE" > "${TEMP_FILE}.clean"
mv "${TEMP_FILE}.clean" "$MANIFEST_FILE"
rm -f "$TEMP_FILE"

echo -e "   ${GREEN}Updated: docs/manifest.yaml${NC}"

# Step 3: Delete documentation folder
if [ -d "$DOC_PATH" ]; then
    echo -e "${YELLOW}3. Deleting documentation folder...${NC}"

    if [ "$FORCE" != true ]; then
        read -p "   Delete docs/$CATEGORY/$MODULE/? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$DOC_PATH"
            echo -e "   ${GREEN}Deleted: docs/$CATEGORY/$MODULE/${NC}"
        else
            echo -e "   ${YELLOW}Skipped: docs/$CATEGORY/$MODULE/ preserved${NC}"
        fi
    else
        rm -rf "$DOC_PATH"
        echo -e "   ${GREEN}Deleted: docs/$CATEGORY/$MODULE/${NC}"
    fi
else
    echo -e "${YELLOW}3. Documentation folder...${NC}"
    echo -e "   ${YELLOW}Skipped: docs/$CATEGORY/$MODULE/ does not exist${NC}"
fi

# Step 4: Delete GitHub label
echo -e "${YELLOW}4. Removing GitHub label...${NC}"

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
echo -e "${GREEN}Module '$CATEGORY/$MODULE' removed successfully!${NC}"
echo ""
echo -e "${BLUE}What was removed:${NC}"
echo "  - Module from manifest.yaml categories.$CATEGORY.modules"
echo "  - Module definition from manifest.yaml modules section"
[ ! -d "$DOC_PATH" ] && echo "  - docs/$CATEGORY/$MODULE/ folder"
echo ""
echo -e "${YELLOW}Note: BMM agents will no longer show '$MODULE' as an option.${NC}"
