#!/bin/bash
#
# sync-folders-from-manifest.sh - Create folder structure from manifest.yaml
#
# This script reads the manifest and creates any missing subcategory folders.
# It does NOT update the manifest (assumes manifest is source of truth).
#
# Usage: ./scripts/sync-folders-from-manifest.sh
#

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MANIFEST_FILE="$PROJECT_ROOT/docs/manifest.yaml"

echo -e "${BLUE}Syncing folder structure from manifest.yaml...${NC}"
echo ""

# Use Python to parse manifest and create folders
python3 << 'PYTHON'
import yaml
import os
from pathlib import Path

project_root = os.environ.get('PROJECT_ROOT', '/Users/carlo/Desktop/Projects/xentri')
manifest_file = f"{project_root}/docs/manifest.yaml"

with open(manifest_file, 'r') as f:
    data = yaml.safe_load(f)

created_count = 0
existed_count = 0

categories = data.get('categories', {})
for cat_name, cat_data in categories.items():
    subcategories = cat_data.get('subcategories', {})
    
    if not subcategories:
        continue
    
    for sub_name, sub_data in subcategories.items():
        sub_path = Path(project_root) / 'docs' / cat_name / sub_name
        
        # Create subcategory folder and README
        if not sub_path.exists():
            sub_path.mkdir(parents=True, exist_ok=True)
            created_count += 1
            print(f"  ✓ Created: docs/{cat_name}/{sub_name}/")
            
            # Create README.md
            purpose = sub_data.get('purpose', 'TBD')
            readme_content = f"""# {sub_name.replace('-', ' ').title()}

> {purpose}

**Category:** {cat_name.title()}
**Sub-category:** {sub_name}
**Status:** Planned

## Purpose

{purpose}

## Modules

See [manifest.yaml](../../../manifest.yaml) for module list.

---

*Sub-category documentation to be expanded as development begins.*
"""
            readme_path = sub_path / 'README.md'
            with open(readme_path, 'w') as f:
                f.write(readme_content)
        else:
            existed_count += 1

print(f"\nCreated {created_count} new folders, {existed_count} already existed.")
PYTHON

echo ""
echo -e "${GREEN}Folder sync complete!${NC}"
