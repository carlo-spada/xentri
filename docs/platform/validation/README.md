# Validation Reports

> **Purpose:** Track validation workflow outputs for Constitution documents.

---

## Overview

Each Constitution document should have a corresponding validation report documenting:

- Coverage analysis
- Gap identification
- Consistency checks
- Recommendations

## Validation Workflow

Use the BMAD validation workflows to generate these reports:

```bash
/bmad:bmm:workflows:validate-prd
/bmad:bmm:workflows:validate-architecture
/bmad:bmm:workflows:validate-ux
/bmad:bmm:workflows:validate-epics
```

## Reports

| Document     | Report                                                                   | Status  |
| ------------ | ------------------------------------------------------------------------ | ------- |
| PRD          | [prd-validation-report.md](./prd-validation-report.md)                   | Pending |
| Architecture | [architecture-validation-report.md](./architecture-validation-report.md) | Pending |
| UX Design    | [ux-validation-report.md](./ux-validation-report.md)                     | Pending |
| Epics        | [epics-validation-report.md](./epics-validation-report.md)               | Pending |

## Report Format

Each validation report should include:

1. **Metadata** — Document version validated, validator, date
2. **Coverage Matrix** — Requirements traced to implementation
3. **Gap Analysis** — Missing or incomplete items
4. **Consistency Check** — Cross-document alignment
5. **Recommendations** — Prioritized action items
6. **Sign-off** — Approval status
