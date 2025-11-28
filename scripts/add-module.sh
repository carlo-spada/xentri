#!/bin/bash
#
# add-module.sh - Add a new module to the Xentri documentation structure
#
# Usage: ./scripts/add-module.sh <category> <module-name> [--package <path>]
#
# Examples:
#   ./scripts/add-module.sh strategy copilot
#   ./scripts/add-module.sh platform events-service --package services/events
#
# What this script does:
#   1. Updates docs/manifest.yaml to add the module
#   2. Creates the docs/{category}/{module}/ folder structure
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
    echo "Usage: $0 <category> <module-name> [--package <path>]"
    echo ""
    echo "Categories: platform, strategy, brand, sales, finance, operations, team, legal"
    echo ""
    echo "Examples:"
    echo "  $0 strategy copilot"
    echo "  $0 platform events-service --package services/events"
    exit 1
fi

# Validate category exists in manifest
if ! grep -q "^  $CATEGORY:" "$MANIFEST_FILE"; then
    echo -e "${RED}Error: Category '$CATEGORY' not found in manifest${NC}"
    echo ""
    echo "Valid categories:"
    grep -E "^  [a-z]+:" "$MANIFEST_FILE" | head -8 | sed 's/://g' | sed 's/^  /  - /'
    exit 1
fi

# Check if module already exists
if grep -q "^  $MODULE:" "$MANIFEST_FILE"; then
    echo -e "${RED}Error: Module '$MODULE' already exists in manifest${NC}"
    exit 1
fi

echo -e "${BLUE}Adding module: ${GREEN}$CATEGORY/$MODULE${NC}"
echo ""

# Step 1: Create documentation folder structure
DOC_PATH="$PROJECT_ROOT/docs/$CATEGORY/$MODULE"
echo -e "${YELLOW}1. Creating documentation structure...${NC}"

mkdir -p "$DOC_PATH/sprint-artifacts"
mkdir -p "$DOC_PATH/interfaces"
mkdir -p "$DOC_PATH/research"

# Create README.md
cat > "$DOC_PATH/README.md" << EOF
# $MODULE

> **Category:** $CATEGORY
> **Status:** Draft
> **Package:** ${PACKAGE_PATH:-"N/A (documentation only)"}

## Overview

[Brief description of what this module does]

## Quick Links

- [PRD](./prd.md) - Product Requirements
- [Architecture](./architecture.md) - Technical Design
- [Sprint Status](./sprint-artifacts/sprint-status.yaml) - Current Progress

## Ownership

- **Team Label:** team:$MODULE
- **Documentation:** docs/$CATEGORY/$MODULE/

## Getting Started

[Instructions for working with this module]
EOF

# Create sprint-status.yaml
cat > "$DOC_PATH/sprint-artifacts/sprint-status.yaml" << EOF
# Sprint Status for $CATEGORY/$MODULE
# This file tracks story progress for this module

module: $CATEGORY/$MODULE
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

echo -e "   ${GREEN}Created: docs/$CATEGORY/$MODULE/${NC}"

# Step 2: Update manifest.yaml - add to categories.{category}.modules array
echo -e "${YELLOW}2. Updating manifest.yaml...${NC}"

# Use a temp file for safe editing
TEMP_FILE=$(mktemp)

# Add module to the category's modules array
awk -v category="$CATEGORY" -v module="$MODULE" '
    /^  '"$CATEGORY"':/ { in_category = 1 }
    in_category && /modules:/ {
        # Check if modules array is empty []
        if (/modules: \[\]/) {
            sub(/modules: \[\]/, "modules: [" module "]")
            in_category = 0
        } else if (/modules: \[/) {
            # Add to existing array
            sub(/\]/, ", " module "]")
            in_category = 0
        }
    }
    { print }
' "$MANIFEST_FILE" > "$TEMP_FILE"

mv "$TEMP_FILE" "$MANIFEST_FILE"

# Add module definition to modules section
PACKAGE_LINE=""
if [ -n "$PACKAGE_PATH" ]; then
    PACKAGE_LINE="    package: \"$PACKAGE_PATH\""
else
    PACKAGE_LINE="    package: null  # Documentation only, no code package"
fi

# Find the last module definition and add after it
awk -v category="$CATEGORY" -v module="$MODULE" -v package_line="$PACKAGE_LINE" '
    /^  [a-z-]+:$/ && !in_modules { last_module_line = NR }
    /^# =/ && in_modules {
        # Print new module before section divider
        print ""
        print "  " module ":"
        print "    category: " category
        print "    purpose: \"[TODO: Add module purpose]\""
        print package_line
        print "    team_label: \"team:" module "\""
        print "    dependencies: []"
        print "    status: draft"
        in_modules = 0
    }
    /^modules:/ { in_modules = 1 }
    { print }
    END {
        if (in_modules) {
            # If we reached end while still in modules section
            print ""
            print "  " module ":"
            print "    category: " category
            print "    purpose: \"[TODO: Add module purpose]\""
            print package_line
            print "    team_label: \"team:" module "\""
            print "    dependencies: []"
            print "    status: draft"
        }
    }
' "$MANIFEST_FILE" > "$TEMP_FILE"

mv "$TEMP_FILE" "$MANIFEST_FILE"

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
            gh label create "$LABEL_NAME" --description "Module: $CATEGORY/$MODULE" --color "0366d6" 2>/dev/null || true
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
echo -e "${GREEN}Module '$CATEGORY/$MODULE' added successfully!${NC}"
echo ""
echo -e "${BLUE}What was created:${NC}"
echo "  - docs/$CATEGORY/$MODULE/README.md"
echo "  - docs/$CATEGORY/$MODULE/sprint-artifacts/sprint-status.yaml"
echo "  - docs/$CATEGORY/$MODULE/interfaces/README.md"
echo "  - docs/$CATEGORY/$MODULE/research/ (empty folder)"
echo "  - Updated docs/manifest.yaml"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Edit docs/$CATEGORY/$MODULE/README.md to add description"
echo "  2. Update the module's 'purpose' in docs/manifest.yaml"
echo "  3. Create PRD: Run /bmad:bmm:agents:pm and select *create-prd"
echo "  4. BMM agents will now show '$MODULE' when you select '$CATEGORY'"
echo ""
echo -e "${YELLOW}Tip: No agent files need updating - they read from manifest.yaml dynamically!${NC}"
