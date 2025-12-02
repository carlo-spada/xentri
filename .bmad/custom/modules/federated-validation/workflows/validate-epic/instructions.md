# Validate Epic Breakdown - Instructions

## Purpose

Validate an Epic breakdown to ensure complete traceability between requirements and stories.

## The Key Rule

**Every requirement must trace to at least one story. Every story must trace to at least one requirement.**

## Steps

### Step 1: Identify Scope

Determine if this is:
- **System Epics** (`docs/epics.md`) - traces to PR-xxx and IC-xxx
- **Domain Epics** (`docs/{category}/{subcategory}/epics.md`) - traces to FR-{SCOPE}-xxx

### Step 2: Find the Traceability Matrix

Look for a section titled "Traceability Matrix" with format:

```markdown
## Traceability Matrix

| Requirement | Epic | Stories | Status |
|-------------|------|---------|--------|
| PR-001 | 1 | 1.2 | Complete |
| PR-002 | 1 | 1.2, 1.6 | Complete |
| IC-001 | 1 | 1.2 | Complete |
| FR-SHELL-001 | 2 | 2.1, 2.3 | Planned |
```

**If missing:** Flag as FAIL - traceability matrix is required.

### Step 3: Validate Coverage

**For System Epics:**
1. Extract all PR-xxx from `docs/prd.md`
2. Extract all IC-xxx from `docs/prd.md`
3. Check each appears in the traceability matrix

**For Domain Epics:**
1. Extract all FR-{SCOPE}-xxx from the domain's prd.md
2. Check each appears in the traceability matrix

### Step 4: Validate Stories

For each story referenced in the matrix:
1. Verify the story exists in sprint-artifacts or within the epics file
2. Verify the story follows format: "As a... I want... So that..."
3. Verify acceptance criteria are numbered and testable

### Step 5: Check for Orphans

**Orphaned Requirements:**
- Requirements not in the matrix (no stories)
- Flag as WARNING if status is "Planned"
- Flag as ERROR if status is "Complete" but no stories

**Orphaned Stories:**
- Stories not in the matrix (no requirements)
- Flag as ERROR - every story must justify its existence

### Step 6: Run Checklist

Go through `epic-checklist.md` and mark each item.

### Step 7: Generate Report

```markdown
# Epic Validation Report

**Date:** {date}
**Target:** docs/epics.md
**Status:** PASS | FAIL | PARTIAL

## Coverage Summary

| Type | Total | Covered | Coverage |
|------|-------|---------|----------|
| PRs | 8 | 8 | 100% |
| ICs | 6 | 5 | 83% |
| FRs | 0 | 0 | N/A |

## Orphaned Requirements
[List any requirements without stories]

## Orphaned Stories
[List any stories without requirements]

## Recommendations
[Suggested fixes]
```

## Exit Criteria

- Traceability matrix exists
- 100% of requirements covered (for Complete epics)
- 80%+ of requirements covered (for In Progress epics)
- No orphaned stories
- Checklist at least 80% passed
