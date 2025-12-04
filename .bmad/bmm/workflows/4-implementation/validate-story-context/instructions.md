# Story Context Validation Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>

## Purpose

Story Context documents (XML format) provide all necessary context for an AI agent to implement a specific story. They aggregate relevant information from documentation, architecture, and existing code.

This validation workflow ensures the story context:

1. Contains all required sections
2. Accurately reflects source documentation
3. Provides sufficient context for implementation
4. Has no stale or incorrect references

<workflow>

<step n="0" goal="Entity detection and story selection">
<action>Invoke {select_entity_task} to get user's entity selection</action>
<action>Resolve {output_folder_resolved} from entity selection</action>

<check if="{output_folder_resolved} not resolved">
  <output>
⚠️ **Entity Selection Required**

Please specify which entity contains the story context to validate.
</output>
<action>Exit workflow</action>
</check>

<action>List available story context files in {sprint_artifacts}</action>
<output>
**Available Story Contexts:**
{{story_context_list}}
</output>

<ask>Which story context would you like to validate? (Enter story ID)</ask>
<action>Store {story_id} from user input</action>
<action>Resolve {story_context_path}</action>

<check if="file not found">
  <output>
⚠️ **Story Context Not Found**

Expected location: {story_context_path}

The story context document must exist before validation.

**Options:**

1. Run the `story-context` workflow to create it
2. Verify the story ID is correct

  </output>
  <action>Exit workflow</action>
</check>

<action>Load the complete story context document (XML)</action>
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Story Context Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity: {current_level_name}
Story: {story_id}
Document: {story_context_path}
Validator: {user_name}
Date: {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="XML Structure Validation">
<action>Load {checklist}</action>
<action>Validate XML structure</action>

<validation-checks>
  <check name="xml-validity">
    - Document is well-formed XML
    - All tags properly closed
    - No malformed elements
  </check>

  <check name="required-elements">
    - story-context root element present
    - story-metadata section exists
    - documentation-context section exists
    - implementation-context section exists (if code exists)
  </check>

  <check name="metadata-completeness">
    - Story ID populated
    - Epic ID referenced
    - Status indicated
  </check>
</validation-checks>

<action>Record structural findings</action>
<template-output>structural_findings</template-output>
</step>

<step n="2" goal="Documentation Context Validation">
<action>Verify documentation sections are accurate</action>

<validation-checks>
  <check name="source-accuracy">
    - Referenced documents exist
    - Extracted content matches source
    - No stale information
  </check>

  <check name="completeness">
    - Relevant PRD sections included
    - Architecture guidance present
    - Epic tech context linked
    - Acceptance criteria included
  </check>

  <check name="relevance">
    - Content is relevant to this story
    - No extraneous information
    - Focus is on what developer needs
  </check>
</validation-checks>

<action>Record documentation findings</action>
<template-output>documentation_findings</template-output>
</step>

<step n="3" goal="Implementation Context Validation">
<action>Verify implementation context is useful</action>

<validation-checks>
  <check name="code-references">
    - Referenced files exist (if any)
    - File paths are accurate
    - Code snippets are current
  </check>

  <check name="pattern-guidance">
    - Relevant patterns identified
    - Examples provided where helpful
    - Conventions documented
  </check>

  <check name="dependencies">
    - Dependencies identified
    - Integration points documented
    - Testing approach clear
  </check>
</validation-checks>

<action>Record implementation findings</action>
<template-output>implementation_findings</template-output>
</step>

<step n="4" goal="Generate Validation Report">
<action>Compile all findings</action>

<action>Calculate validation score:

- PASS: XML valid, all required sections present, content accurate
- CONDITIONAL PASS: Minor issues that don't block development
- FAIL: XML invalid, missing sections, or stale content
  </action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Validation Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Overall Status:** {{validation_status}}

### Critical Issues (Must Fix)

{{critical_issues or "None identified"}}

### Warnings (Should Fix)

{{warnings or "None identified"}}

### Recommendations

{{recommendations or "None"}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="5" goal="Save Report and Provide Next Steps">
<action>Save validation report to {default_output_file}</action>

<check if="validation_status == 'PASS'">
  <output>
✅ **Story Context Validated Successfully**

Story {story_id} context is ready for development.

**Next Steps:**

- Begin implementation using `dev-story` workflow
- Reference this context during development

**Report saved:** {default_output_file}
</output>
</check>

<check if="validation_status == 'CONDITIONAL PASS'">
  <output>
⚠️ **Story Context Conditionally Validated**

Minor issues identified but not blocking.

**Recommended Actions:**
{{recommended_actions}}

**Options:**

1. Fix issues using `amend-story-context` workflow
2. Proceed with development with awareness of issues

**Report saved:** {default_output_file}
</output>
</check>

<check if="validation_status == 'FAIL'">
  <output>
❌ **Story Context Validation Failed**

Critical issues must be resolved before development.

**Required Actions:**
{{required_actions}}

**Next Step:**
Run `amend-story-context` or regenerate using `story-context` workflow.

**Report saved:** {default_output_file}
</output>
</check>
</step>

</workflow>
