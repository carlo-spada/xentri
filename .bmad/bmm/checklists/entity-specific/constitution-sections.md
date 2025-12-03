## Platform Requirements (PR-xxx)

### Completeness

- [ ] Multi-tenancy requirements defined (org_id, RLS, data isolation)
- [ ] Event system requirements defined (event spine, envelope format)
- [ ] Authentication/Authorization baseline defined
- [ ] Data handling requirements defined
- [ ] Error handling standards defined
- [ ] Logging/Observability requirements defined
- [ ] Security baseline defined

### Quality

- [ ] Each PR has unique sequential ID (PR-001, PR-002, ...)
- [ ] Each PR has clear, testable requirement statement
- [ ] Each PR has rationale explaining WHY
- [ ] Each PR has enforcement mechanism specified
- [ ] No gaps in PR numbering
- [ ] No duplicate requirements
- [ ] No contradictions between PRs
- [ ] Language uses MUST/SHALL for mandatory items

## Integration Contracts (IC-xxx)

### Completeness

- [ ] Event envelope schema defined (IC for SystemEvent)
- [ ] Event naming convention defined
- [ ] Module registration format defined
- [ ] API versioning strategy defined
- [ ] Error response format defined
- [ ] Permission check protocol defined

### Quality

- [ ] Each IC has unique sequential ID (IC-001, IC-002, ...)
- [ ] Each IC has clear interface definition
- [ ] Each IC specifies required fields/methods
- [ ] Each IC has version if applicable
- [ ] No gaps in IC numbering
- [ ] No contradictions between ICs
- [ ] Contracts are implementable

## System-Wide NFRs

- [ ] Only truly system-wide NFRs included (not module-specific)
- [ ] Performance baselines measurable
- [ ] Availability targets specified
- [ ] Security standards clear
- [ ] Scalability expectations reasonable
- [ ] Compliance requirements listed if applicable

## Governance

- [ ] Change process documented
- [ ] Who can propose changes specified
- [ ] Approval requirements clear
- [ ] Impact assessment requirements stated
- [ ] Protected documents listed
- [ ] Commit message format specified
