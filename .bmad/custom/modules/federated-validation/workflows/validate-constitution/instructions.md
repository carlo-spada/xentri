# Validate Constitution PRD - Instructions

## Purpose

Validate the Constitution PRD (`docs/platform/prd.md`) to ensure it properly serves as the Constitution for all entities.

## Steps

### Step 1: Load Context

1. Read the target file: `docs/platform/prd.md`
2. Load the checklist from: `.bmad/custom/modules/federated-validation/checklists/constitution-checklist.md`
3. Check if `docs/manifest.yaml` exists (for cross-reference)

### Step 2: Verify Frontmatter

Check the YAML frontmatter at the top of the file:

```yaml
---
entity_type: constitution  # MUST be "constitution"
doc_type: prd              # MUST be "prd"
title: "..."               # Should include "Constitution" or "System PRD"
---
```

**Pass criteria:**
- `entity_type: constitution` is present
- `doc_type: prd` is present

**Fail criteria:**
- Missing frontmatter
- Wrong entity_type or doc_type

### Step 3: Validate Platform Requirements

Scan the document for Platform Requirements:

1. Search for pattern: `PR-\d{3}`
2. Verify each PR follows the format: `PR-001`, `PR-002`, etc.
3. Check for required categories:
   - Security PRs (PR-001 to PR-009)
   - Multi-tenancy PRs (PR-010 to PR-019)
   - Data governance PRs (PR-020 to PR-029)
   - UX consistency PRs (PR-030 to PR-039)
   - Observability PRs (PR-040 to PR-049)

**Minimum required:** At least 5 Platform Requirements

### Step 4: Validate Integration Contracts

Scan the document for Integration Contracts:

1. Search for pattern: `IC-\d{3}`
2. Verify each IC has:
   - A clear schema or format definition
   - Reference to canonical code (if applicable)

**Minimum required:** At least 3 Integration Contracts

### Step 5: Check for Domain Creep

Verify the Constitution does NOT contain domain-specific requirements:

1. Search for pattern: `FR-[A-Z]+-\d{3}`
2. If found, flag as ERROR - these belong in domain PRDs

### Step 6: Run Checklist

Go through `constitution-checklist.md` item by item:

For each item:
- Mark as ✅ if satisfied
- Mark as ❌ if not satisfied
- Add notes explaining the finding

### Step 7: Generate Report

Create a validation report at `docs/proposals/validation-reports/constitution-report-{date}.md`:

```markdown
# Constitution PRD Validation Report

**Date:** {date}
**Target:** docs/platform/prd.md
**Status:** PASS | FAIL | PARTIAL

## Summary

- Platform Requirements found: X
- Integration Contracts found: X
- Checklist items passed: X/Y

## Findings

### Platform Requirements
| ID | Description | Status |
|----|-------------|--------|
| PR-001 | ... | ✅ |

### Integration Contracts
| ID | Description | Status |
|----|-------------|--------|
| IC-001 | ... | ✅ |

### Checklist Results
[Filled checklist here]

## Recommendations
[List any improvements needed]
```

## Exit Criteria

- All frontmatter requirements met
- Minimum PR and IC counts satisfied
- No FR tags found in Constitution
- Checklist at least 80% passed
