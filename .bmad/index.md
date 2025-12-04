# BMAD Framework Index

BMAD v6.0.0-alpha.12 installation for the Xentri project. AI-driven development framework with specialized agents, workflows, and creative tools.

## Installed Modules

| Module   | Purpose                                             |
| -------- | --------------------------------------------------- |
| **core** | BMad Master orchestrator and core utilities         |
| **bmb**  | BMad Builder - create agents, workflows, modules    |
| **bmm**  | BMad Method - agile development lifecycle           |
| **cis**  | Creative Intelligence Suite - ideation and strategy |

---

## \_cfg/ - Configuration

System configuration and manifests for the BMAD installation.

- **[manifest.yaml](./_cfg/manifest.yaml)** - Installation metadata and module list
- **[agent-manifest.csv](./_cfg/agent-manifest.csv)** - Registry of all installed agents
- **[workflow-manifest.csv](./_cfg/workflow-manifest.csv)** - Registry of all installed workflows
- **[task-manifest.csv](./_cfg/task-manifest.csv)** - Registry of standalone tasks
- **[tool-manifest.csv](./_cfg/tool-manifest.csv)** - Registry of available tools
- **[files-manifest.csv](./_cfg/files-manifest.csv)** - Complete file inventory

### \_cfg/agents/

Agent customization overrides for persona adjustments.

- **[core-bmad-master.customize.yaml](./_cfg/agents/core-bmad-master.customize.yaml)** - BMad Master customizations
- **[bmb-bmad-builder.customize.yaml](./_cfg/agents/bmb-bmad-builder.customize.yaml)** - BMad Builder customizations
- **[bmm-\*.customize.yaml](./_cfg/agents/)** - BMM agent customizations (analyst, architect, dev, pm, sm, tea, tech-writer, ux-designer)
- **[cis-\*.customize.yaml](./_cfg/agents/)** - CIS agent customizations (brainstorming-coach, creative-problem-solver, design-thinking-coach, innovation-strategist, presentation-master, storyteller)

### \_cfg/ides/

IDE-specific configuration files.

- **[claude-code.yaml](./_cfg/ides/claude-code.yaml)** - Claude Code integration settings
- **[codex.yaml](./_cfg/ides/codex.yaml)** - OpenAI Codex integration settings

---

## core/ - Core Module

Central orchestration and shared utilities.

- **[config.yaml](./core/config.yaml)** - Core module configuration (user, language, output folder)

### core/agents/

- **[bmad-master.md](./core/agents/bmad-master.md)** - Master executor and workflow orchestrator
- **[bmad-web-orchestrator.agent.xml](./core/agents/bmad-web-orchestrator.agent.xml)** - Web-based orchestrator variant

### core/tasks/

Executable atomic work units.

- **[index-docs.xml](./core/tasks/index-docs.xml)** - Generate directory index documentation
- **[advanced-elicitation.xml](./core/tasks/advanced-elicitation.xml)** - Deep questioning techniques for workflows
- **[workflow.xml](./core/tasks/workflow.xml)** - Core workflow execution engine
- **[validate-workflow.xml](./core/tasks/validate-workflow.xml)** - Checklist validation against documents
- **[advanced-elicitation-methods.csv](./core/tasks/advanced-elicitation-methods.csv)** - Elicitation technique library
- **[adv-elicit-methods.csv](./core/tasks/adv-elicit-methods.csv)** - Compact elicitation methods reference

### core/tools/

Standalone utilities.

- **[shard-doc.xml](./core/tools/shard-doc.xml)** - Split large markdown files by sections

### core/workflows/

#### brainstorming/

- **[workflow.yaml](./core/workflows/brainstorming/workflow.yaml)** - Brainstorming session configuration
- **[instructions.md](./core/workflows/brainstorming/instructions.md)** - Facilitation guidelines
- **[template.md](./core/workflows/brainstorming/template.md)** - Session output template
- **[brain-methods.csv](./core/workflows/brainstorming/brain-methods.csv)** - 36+ ideation techniques
- **[README.md](./core/workflows/brainstorming/README.md)** - Workflow documentation

#### party-mode/

- **[workflow.yaml](./core/workflows/party-mode/workflow.yaml)** - Multi-agent group discussion config
- **[instructions.md](./core/workflows/party-mode/instructions.md)** - Agent coordination rules

### core/resources/excalidraw/

Excalidraw diagram generation utilities.

- **[README.md](./core/resources/excalidraw/README.md)** - Excalidraw integration overview
- **[excalidraw-helpers.md](./core/resources/excalidraw/excalidraw-helpers.md)** - Helper functions for diagram creation
- **[library-loader.md](./core/resources/excalidraw/library-loader.md)** - Load custom shape libraries
- **[validate-json-instructions.md](./core/resources/excalidraw/validate-json-instructions.md)** - JSON validation for diagrams

---

## bmb/ - BMad Builder Module

Tools for creating and extending BMAD components.

- **[README.md](./bmb/README.md)** - Module overview and quick start
- **[config.yaml](./bmb/config.yaml)** - Builder module configuration

### bmb/agents/

- **[bmad-builder.md](./bmb/agents/bmad-builder.md)** - Master builder for creating BMAD components

### bmb/docs/

Architecture and design documentation.

- **[index.md](./bmb/docs/index.md)** - Documentation hub
- **[understanding-agent-types.md](./bmb/docs/understanding-agent-types.md)** - Simple, module, expert agent patterns
- **[simple-agent-architecture.md](./bmb/docs/simple-agent-architecture.md)** - Lightweight agent design
- **[module-agent-architecture.md](./bmb/docs/module-agent-architecture.md)** - Module-integrated agents
- **[expert-agent-architecture.md](./bmb/docs/expert-agent-architecture.md)** - Advanced agents with sidecars
- **[agent-compilation.md](./bmb/docs/agent-compilation.md)** - YAML to MD compilation process
- **[agent-menu-patterns.md](./bmb/docs/agent-menu-patterns.md)** - Menu design patterns

### bmb/workflows/

#### create-agent/

- **[workflow.yaml](./bmb/workflows/create-agent/workflow.yaml)** - Agent creation workflow config
- **[instructions.md](./bmb/workflows/create-agent/instructions.md)** - Step-by-step agent building
- **[brainstorm-context.md](./bmb/workflows/create-agent/brainstorm-context.md)** - Persona ideation support
- **[agent-validation-checklist.md](./bmb/workflows/create-agent/agent-validation-checklist.md)** - Quality validation
- **[communication-presets.csv](./bmb/workflows/create-agent/communication-presets.csv)** - Persona style templates

#### create-workflow/

- **[workflow.yaml](./bmb/workflows/create-workflow/workflow.yaml)** - Workflow creation config
- **[instructions.md](./bmb/workflows/create-workflow/instructions.md)** - Building custom workflows
- **[brainstorm-context.md](./bmb/workflows/create-workflow/brainstorm-context.md)** - Workflow ideation
- **[README.md](./bmb/workflows/create-workflow/README.md)** - Comprehensive guide

#### create-module/

- **[workflow.yaml](./bmb/workflows/create-module/workflow.yaml)** - Module creation config
- **[instructions.md](./bmb/workflows/create-module/instructions.md)** - Full module building guide
- **[module-structure.md](./bmb/workflows/create-module/module-structure.md)** - Required structure spec
- **[checklist.md](./bmb/workflows/create-module/checklist.md)** - Completion validation
- **[brainstorm-context.md](./bmb/workflows/create-module/brainstorm-context.md)** - Module ideation
- **[README.md](./bmb/workflows/create-module/README.md)** - Module overview

#### module-brief/

- **[workflow.yaml](./bmb/workflows/module-brief/workflow.yaml)** - Strategic module planning

#### edit-agent/, edit-workflow/, edit-module/

Modification workflows for existing components.

#### audit-workflow/

- **[workflow.yaml](./bmb/workflows/audit-workflow/workflow.yaml)** - Quality audit configuration
- **[instructions.md](./bmb/workflows/audit-workflow/instructions.md)** - Audit procedures
- **[checklist.md](./bmb/workflows/audit-workflow/checklist.md)** - Validation criteria
- **[template.md](./bmb/workflows/audit-workflow/template.md)** - Audit report template

#### convert-legacy/

- **[workflow.yaml](./bmb/workflows/convert-legacy/workflow.yaml)** - Legacy conversion config
- **[instructions.md](./bmb/workflows/convert-legacy/instructions.md)** - Migration procedures
- **[checklist.md](./bmb/workflows/convert-legacy/checklist.md)** - Conversion validation
- **[README.md](./bmb/workflows/convert-legacy/README.md)** - Legacy format guide

### bmb/reference/

Example implementations for learning.

- **[readme.md](./bmb/reference/readme.md)** - Reference overview
- **[agents/simple-examples/](./bmb/reference/agents/simple-examples/)** - Basic agent examples
- **[agents/module-examples/](./bmb/reference/agents/module-examples/)** - Module agent examples
- **[agents/expert-examples/](./bmb/reference/agents/expert-examples/)** - Advanced agent examples

---

## bmm/ - BMad Method Module

Agile development lifecycle with 12 specialized agents.

- **[README.md](./bmm/README.md)** - Module overview and agent roster
- **[config.yaml](./bmm/config.yaml)** - Method module configuration

### bmm/agents/

Development team agents (see agents/README.md for full details).

- **analyst.md** - Requirements analyst
- **architect.md** - Technical architect
- **dev.md** - Developer agent
- **pm.md** - Product manager
- **sm.md** - Scrum master
- **tea.md** - Test engineer
- **tech-writer.md** - Documentation specialist
- **ux-designer.md** - UX/UI designer

### bmm/docs/

Comprehensive user documentation.

### bmm/workflows/

34 workflows organized by development phase:

- **2-plan-workflows/** - PRD, tech-spec, UX design
- **3-solutioning/** - Architecture, epics, implementation readiness
- **4-implement/** - Story creation, development, code review
- **diagrams/** - Excalidraw visualizations
- **testarch/** - Testing infrastructure

### bmm/teams/

Pre-configured agent groupings for specific tasks.

---

## cis/ - Creative Intelligence Suite

AI-powered creative facilitation with 5 specialized personas.

- **[README.md](./cis/README.md)** - Suite overview and capabilities
- **[config.yaml](./cis/config.yaml)** - CIS configuration

### cis/agents/

Creative facilitator personas.

- **brainstorming-coach.md** - Carson: energetic ideation facilitator
- **design-thinking-coach.md** - Maya: human-centered design guide
- **creative-problem-solver.md** - Dr. Quinn: systematic problem solving
- **innovation-strategist.md** - Victor: strategic disruption oracle
- **storyteller.md** - Sophia: narrative crafting master
- **presentation-master.md** - Presentation design expert

### cis/workflows/

- **brainstorming/** - 36+ ideation techniques
- **design-thinking/** - 5-phase human-centered process
- **problem-solving/** - Root cause analysis and solutions
- **innovation-strategy/** - Market disruption planning
- **storytelling/** - Narrative framework application

### cis/teams/

Creative team configurations.

---

## docs/ - IDE Instructions

Platform-specific usage guides.

- **[claude-code-instructions.md](./docs/claude-code-instructions.md)** - Claude Code slash command usage
- **[codex-instructions.md](./docs/codex-instructions.md)** - OpenAI Codex prompt activation
- **[gemini-instructions.md](./docs/gemini-instructions.md)** - Gemini CLI trigger patterns

---

_Generated by BMad Master Index Docs task_
