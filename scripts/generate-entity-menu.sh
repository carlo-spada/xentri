#!/bin/bash
#
# generate-entity-menu.sh - Generate lightweight entity-menu.yaml from manifest
#
# Usage: ./scripts/generate-entity-menu.sh
#
# This script generates .bmad/bmm/data/entity-menu.yaml from docs/manifest.yaml
# to reduce context consumption in BMM workflows (~787 lines → ~90 lines).
#
# Run this after modifying docs/manifest.yaml to keep entity-menu.yaml in sync.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

node "$SCRIPT_DIR/generate-entity-menu.js"
