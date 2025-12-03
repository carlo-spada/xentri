# Workflow Init - Entity-Based Project Setup

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: workflow-init/workflow.yaml</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>
<critical>This workflow uses the FEDERATED entity system - no more project types or levels!</critical>

<shared-tasks>
  <task name="select-entity" path="{project-root}/.bmad/bmm/tasks/select-entity.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
</shared-tasks>

<workflow>

<step n="1" goal="Welcome and check for existing status">
<output>Welcome to BMad Method, {user_name}!</output>

<action>Check if {output_folder}/bmm-workflow-status.yaml already exists</action>

<check if="status file exists">
  <action>Read existing status file</action>
  <output>
Found existing workflow tracking:
- Entity: {{entity_type_display}}
- Path: {{entity_path}}
- Progress: {{completion_summary}}

To check progress: /bmad:bmm:workflows:workflow-status
  </output>
  <ask>Would you like to:
1. **View status** - Check progress on this entity
2. **New entity** - Initialize workflow for a different entity
3. **Reset** - Archive and start fresh for this entity

Choice [1/2/3]:</ask>

  <check if="choice == 1">
    <output>Run: /bmad:bmm:workflows:workflow-status</output>
    <action>Exit workflow</action>
  </check>

  <check if="choice == 2">
    <action>Continue to step 2</action>
  </check>

  <check if="choice == 3">
    <action>Archive existing status file to {output_folder}/archive/</action>
    <output>Archived existing status. Ready for fresh start!</output>
    <action>Continue to step 2</action>
  </check>
</check>

<check if="status file not found">
  <output>No existing workflow tracking found. Let's set one up!</output>
  <action>Continue to step 2</action>
</check>
</step>

<step n="2" goal="Select target entity">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ENTITY SELECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The BMad Method tracks progress per ENTITY.

What is an Entity?
- Constitution: System-wide rules (docs/platform/*.md)
- Infrastructure Module: Platform components (shell, ui, core-api, etc.)
- Strategic Container: Business categories (strategy, marketing, etc.)
- Coordination Unit: Subcategories within categories
- Business Module: Feature modules within subcategories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-task name="select-entity">
  <param name="prompt_user">true</param>
</invoke-task>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Entity Selected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type:           {entity_type_display}
Path:           {entity_path}
FR Prefix:      {fr_prefix}
Parent PRD:     {parent_prd_path}
Constitution:   {constitution_path}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<template-output>entity_type</template-output>
<template-output>entity_type_display</template-output>
<template-output>entity_path</template-output>
<template-output>entity_code</template-output>
<template-output>fr_prefix</template-output>
<template-output>parent_prd_path</template-output>
<template-output>constitution_path</template-output>
</step>

<step n="3" goal="Scan for existing work">
<action>Scan {entity_path} for existing BMM artifacts:
- PRD (prd.md)
- Architecture (architecture.md or architecture/)
- UX Design (ux-design.md or ux-design/)
- Epics (epics.md or epics/)
- Stories folder
- Any other documentation
</action>

<check if="artifacts found">
  <output>
Found existing work at {entity_path}:
{{artifact_summary}}
  </output>
  <ask>Would you like to:
a) **Continue** - Build on existing artifacts
b) **Archive** - Move to archive and start fresh

Choice [a/b]:</ask>

  <check if="choice == b">
    <action>Archive existing artifacts to {entity_path}/archive/</action>
    <output>Archived existing work. Fresh start!</output>
  </check>
</check>

<check if="no artifacts found">
  <output>No existing BMM artifacts found at {entity_path}. Fresh start!</output>
</check>

<template-output>existing_artifacts</template-output>
</step>

<step n="4" goal="Optional discovery workflows">
<action>Load entity-workflows.yaml to get workflow sequence for {entity_type}</action>
<action>Check if discovery phase is available for this entity type</action>

<check if="discovery phase available">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 DISCOVERY OPTIONS (Optional)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before diving into planning, you can optionally explore:
  </output>

  <check if="entity_type == constitution OR entity_type == strategic_container">
    <ask>Select any discovery workflows to include:

1. 🧠 **Brainstorm** - Creative exploration and ideation
2. 🔍 **Research** - Domain/competitive/technical analysis

Enter numbers (e.g., "1,2" or "all" or "none"):</ask>
  </check>

  <check if="entity_type != constitution AND entity_type != strategic_container">
    <ask>Include discovery research?

1. 🔍 **Research** - Domain/technical analysis

Enter "1" or "none":</ask>
  </check>

  <action>Parse selections and set:
- brainstorm_requested
- research_requested
  </action>
</check>

<template-output>brainstorm_requested</template-output>
<template-output>research_requested</template-output>
</step>

<step n="5" goal="Generate workflow sequence">
<action>Load {installed_path}/../entity-workflows.yaml</action>
<action>Get workflow sequence for {entity_type}</action>
<action>Build workflow_items list with appropriate statuses:
- Mark discovery workflows based on user selection
- Mark standard workflows as required/optional/conditional per entity type
- Mark completed workflows if artifacts found in step 3
</action>

<template-output>workflow_items</template-output>
</step>

<step n="6" goal="Preview and create status file">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 WORKFLOW PATH FOR {entity_type_display}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity: {entity_path}
Code: {entity_code}

{{workflow_path_preview}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>Create workflow tracking file? (y/n)</ask>

<check if="y">
  <action>Generate YAML from template with all variables</action>
  <action>Save to {output_folder}/bmm-workflow-status.yaml</action>

  <action>Identify first non-completed workflow as next_workflow</action>
  <action>Look up agent for next_workflow</action>

  <output>
✅ **Created:** {output_folder}/bmm-workflow-status.yaml

**Next Workflow:** {{next_workflow_name}}
**Agent:** {{next_agent}}
**Command:** /bmad:bmm:workflows:{{next_workflow_id}}

{{#if parent_prd_path}}
💡 **Tip:** Load parent PRD ({parent_prd_path}) for context before starting.
{{/if}}

To check progress: /bmad:bmm:workflows:workflow-status

Happy building! 🚀
  </output>
</check>

<check if="n">
  <output>No problem! Run /bmad:bmm:workflows:workflow-init again when ready.</output>
</check>
</step>

</workflow>
