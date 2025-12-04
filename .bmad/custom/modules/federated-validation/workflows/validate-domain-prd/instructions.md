# Validate Entity PRD - Instructions

## Purpose

Validate an entity PRD to ensure it properly inherits from the Constitution and defines entity-specific requirements.

## Prerequisites

- Constitution PRD exists at `docs/platform/prd.md`
- Target PRD has proper frontmatter

## Steps

### Step 1: Determine Entity Type

From the file path, determine the entity type:

- `docs/platform/{module}/prd.md` → Infrastructure Module
- `docs/{category}/prd.md` → Strategic Container
- `docs/{category}/{subcategory}/prd.md` → Coordination Unit
- `docs/{category}/{subcategory}/{module}/prd.md` → Business Module

### Step 2: Verify Frontmatter

```yaml
---
entity_type: coordination_unit # Must match detected type
doc_type: prd # Must be "prd"
parent: docs/platform/prd.md # Must reference the Constitution
scope: SOUL # Used for FR-{SCOPE}-xxx prefix
---
```

**Pass criteria:**

- Entity type matches detected type
- Parent points to Constitution
- Scope is defined for FR numbering

### Step 3: Verify Constitution Inheritance

The PRD must acknowledge inherited Platform Requirements:

```markdown
## Inherited Platform Requirements

This domain inherits all PRs from the [System Constitution](../../prd.md):

| PR              | How We Comply             |
| --------------- | ------------------------- |
| PR-001 (RLS)    | All tables include org_id |
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

### Step 6: Check Entity-Specific Rules

**Infrastructure Module PRD:**

- Full PRD expected (platform-level concerns)
- FRs should focus on interfaces and contracts
- Must trace to Constitution PRs/ICs

**Strategic Container PRD:**

- May be a brief rather than full PRD
- Should set direction for coordination units
- FRs should be high-level

**Coordination Unit PRD:**

- Full PRD expected
- FRs should be implementation-ready
- Must reference Strategic Container direction

**Business Module PRD:**

- Can be minimal
- FRs should trace to Coordination Unit
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
