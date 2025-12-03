# Workflow Status Check - Entity-Based Multi-Mode Service

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/bmm/workflows/workflow-status/workflow.yaml</critical>
<critical>This workflow operates in multiple modes: interactive (default), validate, data, init-check, update</critical>
<critical>Other workflows can call this as a service to avoid duplicating status logic</critical>
<critical>Uses FEDERATED entity system - tracks progress per entity, not project-wide</critical>

<workflow>

<step n="0" goal="Determine execution mode">
  <action>Check for {{mode}} parameter passed by calling workflow</action>
  <action>Default mode = "interactive" if not specified</action>

  <check if="mode == interactive">
    <action>Continue to Step 1 for normal status check flow</action>
  </check>

  <check if="mode == validate">
    <action>Jump to Step 10 for workflow validation service</action>
  </check>

  <check if="mode == data">
    <action>Jump to Step 20 for data extraction service</action>
  </check>

  <check if="mode == init-check">
    <action>Jump to Step 30 for simple init check</action>
  </check>

  <check if="mode == update">
    <action>Jump to Step 40 for status update service</action>
  </check>
</step>

<step n="1" goal="Check for status file">
<action>Search {output_folder}/ for file: bmm-workflow-status.yaml</action>

<check if="no status file found">
  <output>No workflow status found. To get started:

Run: /bmad:bmm:workflows:workflow-init

This will guide you through entity selection and create your workflow path.</output>
<action>Exit workflow</action>
</check>

<check if="status file found">
  <action>Continue to step 2</action>
</check>
</step>

<step n="2" goal="Read and parse status">
<action>Read bmm-workflow-status.yaml</action>
<action>Parse YAML file and extract entity context:</action>

Parse these fields:
- entity_type
- entity_type_display
- entity_path
- entity_code
- fr_prefix
- parent_prd_path
- constitution_path

<action>Parse workflow_status section:</action>

- Extract all workflow entries with their statuses
- Identify completed workflows (status = file path)
- Identify pending workflows (status = required/optional/recommended/conditional)
- Identify skipped workflows (status = skipped)

<action>Determine current state:</action>

- Find first workflow with status != file path and != skipped and != n/a
- This is the NEXT workflow to work on
- Look up agent from entity-workflows.yaml
</step>

<step n="3" goal="Display current status and options">
<action>Load entity-workflows.yaml to get phase information</action>
<action>Identify current phase from next workflow to be done</action>
<action>Build list of completed, pending, and optional workflows</action>
<action>For each workflow, look up its agent from entity-workflows.yaml</action>

<output>
## 📊 Current Status

**Entity:** {{entity_type_display}}
**Path:** {{entity_path}}
**Code:** {{entity_code}}

**Progress:**

{{#each phases}}
### {{phase_name}}
{{#each workflows_in_phase}}
- {{workflow_name}} ({{agent}}): {{status_display}}
{{/each}}
{{/each}}

## 🎯 Next Steps

**Next Workflow:** {{next_workflow_name}}
**Agent:** {{next_agent}}
**Command:** /bmad:bmm:workflows:{{next_workflow_id}}

{{#if optional_workflows_available}}
**Optional Workflows Available:**
{{#each optional_workflows}}
- {{workflow_name}} ({{agent}}) - {{status}}
{{/each}}
{{/if}}

{{#if parent_prd_path}}
💡 **Context:** Parent PRD at {{parent_prd_path}}
{{/if}}
</output>
</step>

<step n="4" goal="Offer actions">
<ask>What would you like to do?

1. **Start next workflow** - {{next_workflow_name}} ({{next_agent}})
{{#if optional_workflows_available}}
2. **Run optional workflow** - Choose from available options
{{/if}}
3. **View full status YAML** - See complete status file
4. **Update workflow status** - Mark a workflow as completed or skipped
5. **Exit** - Return to agent

Your choice:</ask>

<action>Handle user selection based on available options</action>

<check if="choice == 1">
  <output>Ready to run {{next_workflow_name}}!

**Command:** /bmad:bmm:workflows:{{next_workflow_id}}

**Agent:** Load {{next_agent}} agent first

{{#if next_agent !== current_agent}}
Tip: Start a new chat and load the {{next_agent}} agent before running this workflow.
{{/if}}
</output>
</check>

<check if="choice == 2 AND optional_workflows_available">
  <ask>Which optional workflow?
{{#each optional_workflows numbered}}
{{number}}. {{workflow_name}} ({{agent}})
{{/each}}

Your choice:</ask>
<action>Display selected workflow command and agent</action>
</check>

<check if="choice == 3">
  <action>Display complete bmm-workflow-status.yaml file contents</action>
</check>

<check if="choice == 4">
  <ask>What would you like to update?

1. Mark a workflow as **completed** (provide file path)
2. Mark a workflow as **skipped**

Your choice:</ask>

  <check if="update_choice == 1">
    <ask>Which workflow? (Enter workflow ID like 'prd' or 'architecture')</ask>
    <ask>File path created? (e.g., {{entity_path}}prd.md)</ask>
    <critical>ONLY write the file path as the status value - no other text, notes, or metadata</critical>
    <action>Update workflow_status in YAML file: {{workflow_id}}: {{file_path}}</action>
    <action>Save updated YAML file preserving ALL structure and comments</action>
    <output>✅ Updated {{workflow_id}} to completed: {{file_path}}</output>
  </check>

  <check if="update_choice == 2">
    <ask>Which workflow to skip? (Enter workflow ID)</ask>
    <action>Update workflow_status in YAML file: {{workflow_id}}: skipped</action>
    <action>Save updated YAML file</action>
    <output>✅ Marked {{workflow_id}} as skipped</output>
  </check>
</check>
</step>

<!-- ============================================= -->
<!-- SERVICE MODES - Called by other workflows -->
<!-- ============================================= -->

<step n="10" goal="Validate mode - Check if calling workflow should proceed">
<action>Read {output_folder}/bmm-workflow-status.yaml if exists</action>

<check if="status file not found">
  <template-output>status_exists = false</template-output>
  <template-output>should_proceed = true</template-output>
  <template-output>warning = "No status file found. Running without progress tracking."</template-output>
  <template-output>suggestion = "Consider running workflow-init first for progress tracking"</template-output>
  <action>Return to calling workflow</action>
</check>

<check if="status file found">
  <action>Parse YAML file to extract entity context and workflow_status</action>
  <action>Load entity-workflows.yaml for workflow sequence</action>
  <action>Find first non-completed workflow in workflow_status (next workflow)</action>
  <action>Check if {{calling_workflow}} matches next workflow or is in the workflow list</action>

<template-output>status_exists = true</template-output>
<template-output>entity_type = {{entity_type}}</template-output>
<template-output>entity_path = {{entity_path}}</template-output>
<template-output>entity_code = {{entity_code}}</template-output>
<template-output>next_workflow = {{next_workflow_id}}</template-output>

  <check if="calling_workflow == next_workflow">
    <template-output>should_proceed = true</template-output>
    <template-output>warning = ""</template-output>
    <template-output>suggestion = "Proceeding with planned next step"</template-output>
  </check>

  <check if="calling_workflow in workflow_status list">
    <action>Check the status of calling_workflow in YAML</action>

    <check if="status is file path">
      <template-output>should_proceed = true</template-output>
      <template-output>warning = "⚠️ Workflow already completed: {{calling_workflow}}"</template-output>
      <template-output>suggestion = "This workflow was already completed. Re-running will overwrite: {{status}}"</template-output>
    </check>

    <check if="status is optional/recommended">
      <template-output>should_proceed = true</template-output>
      <template-output>warning = "Running optional workflow {{calling_workflow}}"</template-output>
      <template-output>suggestion = "This is optional. Expected next: {{next_workflow}}"</template-output>
    </check>

    <check if="status is required but not next">
      <template-output>should_proceed = true</template-output>
      <template-output>warning = "⚠️ Out of sequence: Expected {{next_workflow}}, running {{calling_workflow}}"</template-output>
      <template-output>suggestion = "Consider running {{next_workflow}} instead, or continue if intentional"</template-output>
    </check>

  </check>

  <check if="calling_workflow NOT in workflow_status list">
    <template-output>should_proceed = true</template-output>
    <template-output>warning = "⚠️ Unknown workflow: {{calling_workflow}} not in entity workflow path"</template-output>
    <template-output>suggestion = "This workflow is not part of the defined path for this entity type"</template-output>
  </check>

<template-output>status_file_path = {{path to bmm-workflow-status.yaml}}</template-output>
</check>

<action>Return control to calling workflow with all template outputs</action>
</step>

<step n="20" goal="Data mode - Extract specific information">
<action>Read {output_folder}/bmm-workflow-status.yaml if exists</action>

<check if="status file not found">
  <template-output>status_exists = false</template-output>
  <template-output>error = "No status file to extract data from"</template-output>
  <action>Return to calling workflow</action>
</check>

<check if="status file found">
  <action>Parse YAML file completely</action>
  <template-output>status_exists = true</template-output>

  <check if="data_request == entity_config">
    <template-output>entity_type = {{entity_type}}</template-output>
    <template-output>entity_type_display = {{entity_type_display}}</template-output>
    <template-output>entity_path = {{entity_path}}</template-output>
    <template-output>entity_code = {{entity_code}}</template-output>
    <template-output>fr_prefix = {{fr_prefix}}</template-output>
    <template-output>parent_prd_path = {{parent_prd_path}}</template-output>
    <template-output>constitution_path = {{constitution_path}}</template-output>
  </check>

  <check if="data_request == workflow_status">
    <action>Parse workflow_status section and return all workflow: status pairs</action>
    <template-output>workflow_status = {{workflow_status_object}}</template-output>
    <action>Calculate completion stats:</action>
    <template-output>total_workflows = {{count all workflows}}</template-output>
    <template-output>completed_workflows = {{count file path statuses}}</template-output>
    <template-output>pending_workflows = {{count required/optional/etc}}</template-output>
    <template-output>skipped_workflows = {{count skipped}}</template-output>
  </check>

  <check if="data_request == all">
    <action>Return all parsed fields as template outputs</action>
    <template-output>entity_type = {{entity_type}}</template-output>
    <template-output>entity_type_display = {{entity_type_display}}</template-output>
    <template-output>entity_path = {{entity_path}}</template-output>
    <template-output>entity_code = {{entity_code}}</template-output>
    <template-output>fr_prefix = {{fr_prefix}}</template-output>
    <template-output>parent_prd_path = {{parent_prd_path}}</template-output>
    <template-output>constitution_path = {{constitution_path}}</template-output>
    <template-output>workflow_status = {{workflow_status_object}}</template-output>
    <template-output>generated = {{generated}}</template-output>
  </check>

<template-output>status_file_path = {{path to bmm-workflow-status.yaml}}</template-output>
</check>

<action>Return control to calling workflow with requested data</action>
</step>

<step n="30" goal="Init-check mode - Simple existence check">
<action>Check if {output_folder}/bmm-workflow-status.yaml exists</action>

<check if="exists">
  <template-output>status_exists = true</template-output>
  <template-output>suggestion = "Status file found. Ready to proceed."</template-output>
</check>

<check if="not exists">
  <template-output>status_exists = false</template-output>
  <template-output>suggestion = "No status file. Run workflow-init to create one (optional for progress tracking)"</template-output>
</check>

<action>Return immediately to calling workflow</action>
</step>

<step n="40" goal="Update mode - Centralized status file updates">
<action>Read {output_folder}/bmm-workflow-status.yaml</action>

<check if="status file not found">
  <template-output>success = false</template-output>
  <template-output>error = "No status file found. Cannot update."</template-output>
  <action>Return to calling workflow</action>
</check>

<check if="status file found">
  <action>Parse YAML file completely</action>
  <action>Load entity-workflows.yaml for workflow sequence</action>
  <action>Check {{action}} parameter to determine update type</action>

  <!-- ============================================= -->
  <!-- ACTION: complete_workflow -->
  <!-- ============================================= -->
  <check if="action == complete_workflow">
    <action>Get {{workflow_id}} parameter (required)</action>
    <action>Get {{output_file}} parameter (required - path to created file)</action>

    <critical>ONLY write the file path as the status value - no other text, notes, or metadata</critical>
    <action>Update workflow status in YAML:</action>
    - In workflow_status section, update: {{workflow_id}}: {{output_file}}

    <action>Find {{workflow_id}} in entity-workflows.yaml</action>
    <action>Determine next workflow from sequence</action>
    <action>Find first workflow in workflow_status with status != file path and != skipped</action>

    <action>Save updated YAML file preserving ALL structure and comments</action>

    <template-output>success = true</template-output>
    <template-output>next_workflow = {{determined next workflow}}</template-output>
    <template-output>next_agent = {{determined next agent from entity-workflows.yaml}}</template-output>
    <template-output>completed_workflow = {{workflow_id}}</template-output>
    <template-output>output_file = {{output_file}}</template-output>

  </check>

  <!-- ============================================= -->
  <!-- ACTION: skip_workflow -->
  <!-- ============================================= -->
  <check if="action == skip_workflow">
    <action>Get {{workflow_id}} parameter (required)</action>

    <action>Update workflow status in YAML:</action>
    - In workflow_status section, update: {{workflow_id}}: skipped

    <action>Save updated YAML file</action>

    <template-output>success = true</template-output>
    <template-output>skipped_workflow = {{workflow_id}}</template-output>

  </check>

  <!-- ============================================= -->
  <!-- Unknown action -->
  <!-- ============================================= -->
  <check if="action not recognized">
    <template-output>success = false</template-output>
    <template-output>error = "Unknown action: {{action}}. Valid actions: complete_workflow, skip_workflow"</template-output>
  </check>

</check>

<action>Return control to calling workflow with template outputs</action>
</step>

</workflow>
