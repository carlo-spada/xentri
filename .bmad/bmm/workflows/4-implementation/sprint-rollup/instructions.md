# Sprint Rollup - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project_root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow aggregates sprint status from ALL modules into a single orchestration-level dashboard</critical>

<workflow>

  <step n="1" goal="Load manifest and identify all modules">
    <action>Load {{manifest_file}} to get the complete list of modules</action>
    <action>Parse the 'modules:' section to extract:
      - Module names (e.g., "orchestration", "core-api", "shell", "ts-schema", "ui")
      - Categories (e.g., "platform")
      - Package paths
      - Dependencies and consumers
    </action>
    <action>Store module list for iteration</action>
  </step>

  <step n="2" goal="Collect sprint status from each module">
    <action>For each module in the manifest:</action>
    <action>
      1. Construct path: {{base_output_folder}}/{{category}}/{{module}}/sprint-artifacts/sprint-status.yaml
      2. Check if file exists
      3. If exists: Read and parse the sprint-status.yaml
         - Extract epic statuses
         - Extract story statuses (backlog, drafted, in-progress, review, done)
         - Calculate progress metrics
      4. If not exists: Mark module as "No sprint status"
    </action>
    <action>Store all collected data in {{module_statuses}} array</action>
  </step>

  <step n="3" goal="Calculate cross-module metrics">
    <action>Aggregate metrics across all modules:
      - Total stories by status (backlog, drafted, in-progress, review, done)
      - Stories per module
      - Progress percentage per module
      - Cross-module dependencies (from story frontmatter)
      - Blocked stories waiting on other modules
    </action>
    <action>Identify cross-module risks:
      - Modules with no progress
      - Modules with many blocked stories
      - Dependencies that are blocking multiple consumers
    </action>
  </step>

  <step n="4" goal="Generate dashboard document">
    <action>Load template from {{installed_path}}/dashboard-template.md</action>
    <action>Populate template sections:
      - Executive Summary (overall progress)
      - Module Status Table (per-module breakdown)
      - Cross-Module Dependencies (blocked items)
      - Risk Indicators (warnings/blockers)
      - Last Updated timestamp
    </action>
    <template-output file="{default_output_file}">dashboard_content</template-output>
  </step>

  <step n="5" goal="Save and report">
    <action>Save dashboard to {{orchestration_folder}}/sprint-dashboard.md</action>
    <output>**Sprint Dashboard Updated**

Dashboard saved to: {{default_output_file}}

**Summary:**
- Modules tracked: {{module_count}}
- Total stories: {{total_stories}}
- Overall progress: {{overall_progress}}%

View the dashboard for detailed cross-module status.
    </output>
  </step>

</workflow>
```
