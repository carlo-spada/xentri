# System Architecture Validation Workflow

<critical>Validates Constitution Architecture at docs/platform/architecture.md</critical>

<workflow>

<step n="1" goal="Load Documents">
<action>Load architecture from {architecture_path}</action>
<action>Load PRD from {prd_path} for alignment check</action>

<check if="architecture not found">
  <output>❌ Constitution Architecture not found. Use create-system-architecture first.</output>
  <action>Exit workflow</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 CONSTITUTION ARCHITECTURE VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validating: docs/platform/architecture.md
Against PRD: docs/platform/prd.md
Date: {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="2" goal="Structural Validation">
<action>Load and apply checklist: {checklist}</action>

<action>Check:

1. Required sections present (Vision, Principles, Tech Stack, etc.)
2. No unfilled template variables
3. Proper formatting
4. ADRs documented for major decisions
   </action>
   </step>

<step n="3" goal="PRD Alignment">
<action>Verify architecture addresses PRD requirements:

1. For each PR-xxx, check architectural support
2. For each IC-xxx, verify architecture defines implementation
3. NFRs have corresponding architectural patterns
   </action>

<action>Generate PRD alignment matrix</action>
</step>

<step n="4" goal="Completeness Check">
<action>Verify all critical architecture areas covered:
- High-level architecture decided
- Event architecture defined (per IC contracts)
- Data architecture with multi-tenancy (per PR requirements)
- Security architecture
- Technology stack documented
- Cross-cutting concerns addressed
</action>
</step>

<step n="5" goal="Generate Report">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VALIDATION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
| Status | Count |
|--------|-------|
| ✅ PASS | {pass_count} |
| ❌ FAIL | {fail_count} |
| ⚠️ WARN | {warn_count} |

**Overall: {overall_status}**
**PRD Alignment: {prd_alignment_percent}%**

{detailed_results}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>Save report? (y/n)</ask>
</step>

</workflow>
