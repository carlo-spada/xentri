---
description: Validate a Constitution PRD against the Federated Requirements Model
---

# Validate Constitution PRD

1. **Load Context**
   - Read the target file (usually `docs/prd.md`)
   - Read the checklist: `{project-root}/.bmad/custom/modules/federated-validation/checklists/constitution-checklist.md`

2. **Verify Frontmatter**
   - Check if `doc_type` is set to `constitution`
   - Check if `level` is set to `system`

3. **Validate Requirements**
   - Scan for `PR-xxx` tags (Platform Requirements)
   - Scan for `IC-xxx` tags (Integration Contracts)
   - Ensure no `FR-xxx` tags are present (those belong in domain PRDs)

4. **Generate Report**
   - Create a validation report listing:
     - Missing mandatory sections
     - Improperly formatted tags
     - Checklist items passed/failed
   - Save report to `docs/validation/constitution-report-{date}.md`
