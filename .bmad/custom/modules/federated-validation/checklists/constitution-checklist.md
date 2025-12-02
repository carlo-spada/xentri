# Constitution PRD Validation Checklist

> For validating System-level PRDs (Level 0) at `docs/prd.md`

## 1. Document Structure

### Frontmatter
- [ ] `level: system` present in frontmatter
- [ ] `doc_type: constitution` present in frontmatter
- [ ] Title includes "Constitution" or "System PRD"

### Required Sections
- [ ] Executive Summary present
- [ ] Platform Requirements section exists
- [ ] Integration Contracts section exists
- [ ] Security Requirements section exists
- [ ] Non-Functional Requirements section exists

## 2. Platform Requirements (PR-xxx)

### Completeness
- [ ] **Security PRs defined** - At least: auth (PR-003), permissions (PR-005), audit (PR-006)
- [ ] **Multi-tenancy PRs defined** - At least: RLS/org_id isolation (PR-001)
- [ ] **Event system PRs defined** - At least: event emission (PR-002)
- [ ] **UX PRs defined** - At least: error handling (PR-007), brief adaptation (PR-008)

### Quality
- [ ] Each PR has unique ID: `PR-001`, `PR-002`, etc.
- [ ] Each PR is testable (can write a test to verify compliance)
- [ ] Each PR is enforceable (can be validated in code review or CI)
- [ ] PRs use directive language ("MUST", "SHALL", not "SHOULD consider")

### Scope
- [ ] No domain-specific features (those belong in category/subcategory PRDs)
- [ ] All PRs apply to ALL modules equally

## 3. Integration Contracts (IC-xxx)

### Completeness
- [ ] **Event envelope defined** (IC-001) - with TypeScript interface or JSON schema
- [ ] **Event naming convention defined** (IC-002) - with examples
- [ ] **Module registration defined** (IC-003) - manifest format
- [ ] **Brief access defined** (IC-004) - API endpoints
- [ ] **Cross-module communication defined** - at least one protocol

### Quality
- [ ] Each IC has unique ID: `IC-001`, `IC-002`, etc.
- [ ] Each IC has schema or format specification
- [ ] Each IC references canonical code location (e.g., `packages/ts-schema`)
- [ ] Each IC has versioning strategy noted

## 4. Non-Functional Requirements

- [ ] Performance targets defined (latency, throughput)
- [ ] Scalability limits defined
- [ ] Reliability targets defined (uptime SLA)
- [ ] Observability requirements defined (logging, tracing)

## 5. Governance

- [ ] Clear ownership defined (who maintains the Constitution)
- [ ] Change process defined (how to add/modify PRs and ICs)
- [ ] Protected document status acknowledged

## 6. Cross-References

- [ ] References `docs/manifest.yaml` for module registry
- [ ] Links to `docs/architecture.md` for technical details
- [ ] Links to `docs/product-brief.md` for vision

---

## Validation Summary

| Category | Items | Passed | Percentage |
|----------|-------|--------|------------|
| Structure | 5 | ? | ?% |
| PRs | 8 | ? | ?% |
| ICs | 8 | ? | ?% |
| NFRs | 4 | ? | ?% |
| Governance | 3 | ? | ?% |
| **Total** | **28** | **?** | **?%** |

**Minimum to pass:** 80% (22/28 items)
