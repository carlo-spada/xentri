#!/usr/bin/env python3
"""
Checklist Generator for BMAD Federated Workflows

Generates all 20 checklists (5 entity types × 4 doc types) from composable primitives.
Run from project root: python scripts/generate-checklists.py
"""
import os

# Configuration
BASE_DIR = ".bmad/bmm/checklists"
PRIMITIVES_DIR = os.path.join(BASE_DIR, "primitives")
ENTITY_DIR = os.path.join(BASE_DIR, "entity-specific")
DOC_DIR = os.path.join(BASE_DIR, "doc-specific")
OUTPUT_DIR = BASE_DIR

# Entity types and their characteristics
ENTITY_TYPES = {
    "constitution": {
        "has_inheritance": False,  # Constitution has no parent
        "entity_fragment": "constitution-sections.md",
    },
    "infrastructure": {
        "has_inheritance": True,
        "entity_fragment": "infrastructure-sections.md",
    },
    "strategic": {
        "has_inheritance": True,
        "entity_fragment": "strategic-sections.md",
    },
    "coordination": {
        "has_inheritance": True,
        "entity_fragment": "coordination-sections.md",
    },
    "business": {
        "has_inheritance": True,
        "entity_fragment": "business-sections.md",
    },
}

# Document types
DOC_TYPES = ["prd", "architecture", "epics", "ux"]


def get_components(entity_type: str, doc_type: str) -> list:
    """Build the list of components for a specific checklist."""
    entity_config = ENTITY_TYPES[entity_type]
    components = []

    # 1. Always start with frontmatter
    components.append(os.path.join(PRIMITIVES_DIR, "frontmatter-base.md"))

    # 2. Add inheritance checks for non-Constitution entities
    if entity_config["has_inheritance"]:
        components.append(os.path.join(PRIMITIVES_DIR, "inheritance-checks.md"))

    # 3. Add doc-specific sections
    doc_fragment = f"{doc_type}-sections.md"
    components.append(os.path.join(DOC_DIR, doc_fragment))

    # 4. Add entity-specific sections
    components.append(os.path.join(ENTITY_DIR, entity_config["entity_fragment"]))

    # 5. Always end with quality standards and document structure
    components.append(os.path.join(PRIMITIVES_DIR, "quality-standards.md"))
    components.append(os.path.join(PRIMITIVES_DIR, "document-structure.md"))

    return components


def generate_checklist(entity_type: str, doc_type: str) -> None:
    """Generate a single checklist file."""
    filename = f"{entity_type}-{doc_type}-checklist.md"
    output_path = os.path.join(OUTPUT_DIR, filename)
    components = get_components(entity_type, doc_type)

    content = []

    # Header
    title = filename.replace("-", " ").replace(".md", "").title()
    content.append(f"# {title}\n")
    content.append("> **Auto-generated** from primitives. Do not edit directly.\n")
    content.append(f"> Run `python scripts/generate-checklists.py` to regenerate.\n")
    content.append("---\n")

    # Assemble components
    missing_components = []
    for component_path in components:
        if os.path.exists(component_path):
            with open(component_path, 'r') as f:
                content.append(f.read().strip())
                content.append("\n\n---\n")
        else:
            missing_components.append(component_path)
            content.append(f"<!-- MISSING: {component_path} -->\n\n---\n")

    # Footer
    footer = """## Validation Result

**Date:** _______________
**Validator:** _______________

**Overall Status:** ☐ PASS ☐ FAIL ☐ NEEDS REVISION

**Notes:**
"""
    content.append(footer)

    # Write file
    with open(output_path, 'w') as f:
        f.write("\n".join(content))

    status = "✅" if not missing_components else "⚠️"
    print(f"{status} Generated {filename}")

    if missing_components:
        for mc in missing_components:
            print(f"   ⚠️  Missing: {mc}")


def generate_all_checklists() -> None:
    """Generate all 20 checklists."""
    print(f"Generating checklists in {OUTPUT_DIR}...")
    print(f"Entity types: {list(ENTITY_TYPES.keys())}")
    print(f"Doc types: {DOC_TYPES}")
    print(f"Total checklists: {len(ENTITY_TYPES) * len(DOC_TYPES)}")
    print("-" * 50)

    generated = 0
    for entity_type in ENTITY_TYPES:
        for doc_type in DOC_TYPES:
            generate_checklist(entity_type, doc_type)
            generated += 1

    print("-" * 50)
    print(f"Generated {generated} checklists.")


if __name__ == "__main__":
    generate_all_checklists()
