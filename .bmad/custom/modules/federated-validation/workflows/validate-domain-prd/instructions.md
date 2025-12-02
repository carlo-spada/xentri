# Validate Domain PRD - Instructions

## Purpose

Validate a Category, Subcategory, or Module PRD to ensure it properly inherits from the Constitution and defines domain-specific requirements.

## Prerequisites

- Constitution PRD exists at `docs/prd.md`
- Target PRD has proper frontmatter

## Steps

### Step 1: Determine Scope

From the file path, extract:
- **Category:** First folder under `docs/` (e.g., `strategy`)
- **Subcategory:** Second folder (e.g., `soul`)
- **Module:** Third folder if present (e.g., `mission-control`)

Determine the **level**:
- `docs/{category}/prd.md` → Level 1 (Category)
- `docs/{category}/{subcategory}/prd.md` → Level 2 (Subcategory)
- `docs/{category}/{subcategory}/{module}/prd.md` → Level 3 (Module)

### Step 2: Verify Frontmatter

```yaml
---
level: subcategory           # Must match the file's position in hierarchy
doc_type: domain_prd         # Must be "domain_prd"
parent: docs/prd.md          # Must reference the Constitution
scope: SOUL                  # Used for FR-{SCOPE}-xxx prefix
---
```

**Pass criteria:**
- Level matches file path depth
- Parent points to Constitution
- Scope is defined for FR numbering

### Step 3: Verify Constitution Inheritance

The PRD must acknowledge inherited Platform Requirements:

```markdown
## Inherited Platform Requirements

This domain inherits all PRs from the [System Constitution](../../prd.md):

| PR | How We Comply |
|----|---------------|
| PR-001 (RLS) | All tables include org_id |
| PR-002 (Events) | All mutations emit events |
...
```

**Note:** Per implementation plan, only non-obvious compliance needs documentation.

### Step 4: Verify IC Implementation

The PRD must declare which Integration Contracts it implements:

```markdown
## Integration Contracts

This domain implements:
- IC-001: Event Envelope (producer)
- IC-003: Module Registration
- IC-004: Brief Access (consumer)
```

### Step 5: Validate Functional Requirements

1. Check FR numbering: `FR-{SCOPE}-001`, `FR-{SCOPE}-002`, etc.
2. Verify scope matches frontmatter
3. Ensure FRs are:
   - Domain-scoped (not system-wide)
   - Testable
   - Prioritized (MVP/Growth/Vision)

### Step 6: Check Level-Specific Rules

**Category PRD (Level 1):**
- May be a brief rather than full PRD
- Should set direction for subcategories
- FRs should be high-level

**Subcategory PRD (Level 2):**
- Full PRD expected
- FRs should be implementation-ready
- Must reference Category direction

**Module PRD (Level 3):**
- Can be minimal
- FRs should trace to Subcategory
- Focus on specific implementation

### Step 7: Run Checklist

Go through `domain-prd-checklist.md` and mark each item.

### Step 8: Generate Report

Create a validation report at:
`docs/proposals/validation-reports/domain-report-{scope}-{date}.md`

## Exit Criteria

- Frontmatter is complete and correct
- Constitution inheritance acknowledged
- At least one FR defined
- FR numbering follows convention
- Checklist at least 80% passed
