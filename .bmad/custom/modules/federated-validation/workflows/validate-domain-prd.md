---
description: Validate a Domain PRD against the Federated Requirements Model
---

# Validate Domain PRD

1. **Load Context**
   - Read the target file
   - Read the checklist: `{project-root}/.bmad/custom/modules/federated-validation/checklists/domain-prd-checklist.md`

2. **Verify Frontmatter**
   - Check if `doc_type` is set to `domain_prd`
   - Check if `level` is `category`, `subcategory`, or `module`
   - Check if `parent` points to the Constitution

3. **Validate Requirements**
   - Scan for `FR-{SCOPE}-xxx` tags
   - Ensure `PR-xxx` compliance is mentioned
   - Ensure `IC-xxx` implementation is declared

4. **Generate Report**
   - Create a validation report listing:
     - Missing mandatory sections
     - Improperly formatted tags
     - Checklist items passed/failed
   - Save report to `docs/validation/domain-report-{scope}-{date}.md`
