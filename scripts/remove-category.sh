#!/bin/bash
#
# remove-category.sh - Remove an empty category from the Xentri documentation structure
#
# Usage: ./scripts/remove-category.sh <category> [--force]
#
# SAFETY: This script will REFUSE to remove a category that still has modules.
#         Remove all modules first using remove-module.sh
#
# Examples:
#   ./scripts/remove-category.sh deprecated-category
#   ./scripts/remove-category.sh old-category --force
#
# What this script does:
#   1. Verifies category has no modules (REQUIRED)
#   2. Removes the category from docs/manifest.yaml
#   3. Optionally deletes the docs/{category}/ folder

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
            fi
            shift
            ;;
    esac
done

# Validate arguments
if [ -z "$CATEGORY" ]; then
    echo -e "${RED}Error: Missing required argument${NC}"
    echo ""
    echo "Usage: $0 <category> [--force]"
    echo ""
    echo "Options:"
    echo "  --force, -f    Skip confirmation prompts"
    echo ""
    echo "Examples:"
    echo "  $0 deprecated-category"
    echo "  $0 old-category --force"
    echo ""
    echo -e "${YELLOW}Note: Category must have no modules. Use remove-module.sh first.${NC}"
    exit 1
fi

# Protect core categories
PROTECTED_CATEGORIES="platform"
if [[ " $PROTECTED_CATEGORIES " =~ " $CATEGORY " ]]; then
    echo -e "${RED}Error: Cannot remove protected category '$CATEGORY'${NC}"
    echo "The 'platform' category is required infrastructure and cannot be removed."
    exit 1
fi

# Check if category exists in manifest
if ! grep -q "^  $CATEGORY:" "$MANIFEST_FILE"; then
    echo -e "${RED}Error: Category '$CATEGORY' not found in manifest${NC}"
    echo ""
    echo "Existing categories:"
    grep -E "^  [a-z]+:" "$MANIFEST_FILE" | head -20 | sed 's/://g' | sed 's/^  /  - /'
    exit 1
fi

# SAFETY CHECK: Verify category has no modules
MODULES_LINE=$(grep -A3 "^  $CATEGORY:" "$MANIFEST_FILE" | grep "modules:" | head -1)
if [[ ! "$MODULES_LINE" =~ "modules: []" ]]; then
    # Extract module names
    MODULES=$(echo "$MODULES_LINE" | sed 's/.*modules: \[//' | sed 's/\]//' | tr ',' '\n' | tr -d ' ')

    echo -e "${RED}Error: Category '$CATEGORY' still has modules!${NC}"
    echo ""
    echo "Modules in this category:"
    echo "$MODULES" | sed 's/^/  - /'
    echo ""
    echo -e "${YELLOW}Remove all modules first using:${NC}"
    for mod in $MODULES; do
        echo "  ./scripts/remove-module.sh $CATEGORY $mod"
    done
    exit 1
fi

DOC_PATH="$PROJECT_ROOT/docs/$CATEGORY"

echo -e "${RED}WARNING: You are about to remove category: ${YELLOW}$CATEGORY${NC}"
echo ""

# Show what will be affected
echo -e "${BLUE}This will:${NC}"
echo "  1. Remove '$CATEGORY' from manifest.yaml categories section"
if [ -d "$DOC_PATH" ]; then
    REMAINING_FILES=$(find "$DOC_PATH" -type f 2>/dev/null | wc -l | tr -d ' ')
    echo "  2. Delete docs/$CATEGORY/ folder ($REMAINING_FILES files remaining)"
fi
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
echo -e "${YELLOW}Removing category '$CATEGORY'...${NC}"
echo ""

# Step 1: Remove from categories section
echo -e "${YELLOW}1. Updating manifest.yaml...${NC}"

TEMP_FILE=$(mktemp)

# Remove the entire category block from categories section
awk -v category="$CATEGORY" '
    BEGIN { in_categories = 0; skip_category = 0 }

    /^categories:/ { in_categories = 1 }
    /^modules:/ { in_categories = 0 }

    # When we hit the target category in categories section
    in_categories && /^  '"$CATEGORY"':/ {
        skip_category = 1
        next
    }

    # Stop skipping when we hit next category or section
    skip_category && /^  [a-z]+:/ && !/^    / {
        skip_category = 0
    }
    skip_category && /^[a-z#]/ {
        skip_category = 0
    }

    # Skip lines in the category block
    skip_category { next }

    { print }
' "$MANIFEST_FILE" > "$TEMP_FILE"

# Clean up double blank lines
awk 'NF || !blank++ {print; if (NF) blank=0}' "$TEMP_FILE" > "${TEMP_FILE}.clean"
mv "${TEMP_FILE}.clean" "$MANIFEST_FILE"
rm -f "$TEMP_FILE"

echo -e "   ${GREEN}Updated: docs/manifest.yaml${NC}"

# Step 2: Delete documentation folder
if [ -d "$DOC_PATH" ]; then
    echo -e "${YELLOW}2. Deleting documentation folder...${NC}"

    if [ "$FORCE" != true ]; then
        read -p "   Delete docs/$CATEGORY/? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$DOC_PATH"
            echo -e "   ${GREEN}Deleted: docs/$CATEGORY/${NC}"
        else
            echo -e "   ${YELLOW}Skipped: docs/$CATEGORY/ preserved${NC}"
        fi
    else
        rm -rf "$DOC_PATH"
        echo -e "   ${GREEN}Deleted: docs/$CATEGORY/${NC}"
    fi
else
    echo -e "${YELLOW}2. Documentation folder...${NC}"
    echo -e "   ${YELLOW}Skipped: docs/$CATEGORY/ does not exist${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}Category '$CATEGORY' removed successfully!${NC}"
echo ""
echo -e "${BLUE}What was removed:${NC}"
echo "  - Category definition from manifest.yaml"
[ ! -d "$DOC_PATH" ] && echo "  - docs/$CATEGORY/ folder"
echo ""
echo -e "${YELLOW}Note: BMM agents will no longer show '$CATEGORY' as an option.${NC}"
