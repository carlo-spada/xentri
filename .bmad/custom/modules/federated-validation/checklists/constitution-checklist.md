# Constitution PRD Validation Checklist

## 1. Platform Requirements Completeness

- [ ] **Security requirements defined (PR-0xx)**: Are there explicit rules for auth, permissions, and data safety?
- [ ] **Multi-tenancy requirements defined (PR-0xx)**: Is `org_id` isolation mandated?
- [ ] **Data governance requirements defined (PR-0xx)**: Are there rules for data handling?
- [ ] **UX consistency requirements defined (PR-0xx)**: Are there shell/UI mandates?
- [ ] **Observability requirements defined (PR-0xx)**: Are logging/tracing rules clear?
- [ ] **Testable & Enforceable**: Can each PR be verified by code or test?
- [ ] **No Domain Creep**: Are domain-specific features excluded? (They belong in sub-categories)

## 2. Integration Contracts Completeness

- [ ] **Event system contracts (IC-0xx)**: Is the event envelope defined?
- [ ] **API contracts (IC-0xx)**: Are registration/communication protocols defined?
- [ ] **Authentication contracts (IC-0xx)**: Are session/token formats defined?
- [ ] **Schema Specification**: Does each IC have a clear schema or reference to `packages/ts-schema`?
- [ ] **Versioning**: Is there a strategy for evolving contracts?

## 3. Non-Functional Requirements

- [ ] **Performance**: Latency/throughput targets?
- [ ] **Scalability**: Limits and growth targets?
- [ ] **Reliability**: Uptime/failover expectations?

## 4. Governance

- [ ] **Ownership**: Is it clear who owns the platform?
- [ ] **Change Process**: How do we add new PRs/ICs?
