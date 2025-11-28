# Module Isolation Transition Plan

> **Status:** Draft
> **Created:** 2025-11-27
> **Authors:** Party Mode Session (BMad Master, Winston, Mary, John, Bob, Amelia, Murat, Dr. Quinn)
> **Owner:** platform/orchestration

## Executive Summary

This document outlines the transition from root-directory-scoped BMAD workflows to module-scoped workflows, enabling Xentri to scale to 700+ modules across 8+ categories while maintaining clean ownership, traceability, and cross-module coordination.

## Problem Statement

### Current State
- All stories, PRDs, and artifacts accumulate in shared folders
- No automated way to determine which module owns which story
- Agents operate at `{project-root}` scope, causing context pollution
- Cross-module changes happen without formal acknowledgment or documentation

### Friction Example (Epic 1)
Stories 1-1 through 1-7 lived in a single `docs/sprint-artifacts/` folder:
- 1-1, 1-7 → orchestration (cross-cutting)
- 1-2, 1-3, 1-4, 1-6 → core-api
- 1-5 → shell

Manual sorting was required. No machine-readable ownership.

### Target State
- Module-scoped workspaces within `docs/{category}/{module}/`
- Each module has its own sprint-status.yaml and artifacts
- Agents automatically scope to their assigned module
- Cross-module changes require explicit GitHub-based coordination
- Audit trail of all cross-module decisions

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope isolation | Module-level in `docs/` | Mirrors monorepo code structure |
| Sprint tracking | Federated per-module | Clean ownership, aggregation deferred |
| Module context | Runtime prompt (no persistence) | Lightweight, prevents stale context |
| Cross-module communication | GitHub Issues + Labels | Battle-tested, scales to real teams |
| Enforcement level | CI warnings + acknowledgment (Option B) | Discipline without theater for solo dev |
| CIS agents | Root-scoped with optional module context | Lower scoping pressure for ideation |
| Story ownership | Consumer module owns | Dependencies tracked in frontmatter |
| Orchestration role | True module (not meta-scope) | Owns cross-cutting infrastructure, epics, ADRs |

## Architecture

### Module-to-Code Mapping

```
docs/platform/
├── orchestration/     → Cross-cutting (no single code package)
├── core-api/          → services/core-api
├── shell/             → apps/shell
├── ts-schema/         → packages/ts-schema
└── ui/                → packages/ui
```

### Federated Sprint Status

Each module maintains its own sprint tracking:

```
docs/platform/orchestration/sprint-artifacts/sprint-status.yaml  ← Epic-level
docs/platform/core-api/sprint-artifacts/sprint-status.yaml       ← core-api stories
docs/platform/shell/sprint-artifacts/sprint-status.yaml          ← shell stories
docs/platform/ts-schema/sprint-artifacts/sprint-status.yaml      ← ts-schema stories
docs/platform/ui/sprint-artifacts/sprint-status.yaml             ← ui stories
```

### Cross-Module Communication Pattern

Treat module boundaries like microservice boundaries:

```
CROSS-MODULE REQUEST FLOW
─────────────────────────
1. Agent works story in Module A
2. Identifies dependency on Module B
3. Creates GitHub Issue (cross-module request)
4. Continues non-blocked tasks (parallel track)
5. Module B team reviews request
6. Module B approves/rejects/proposes alternative
7. Agent resumes blocked tasks in Module A
```

For solo developer: The workflow forces formal context-switching, simulating team boundaries.

## Implementation Phases

### Phase 1: Foundation (This Sprint)

#### 1.1 Documentation Structure ✅ COMPLETE
- [x] Create `docs/{category}/{module}/` hierarchy (commit 5d456fd)
- [x] Add module context prompt to 8 BMM agents (commit 7b80edb)
- [x] Create federated sprint-status.yaml files

#### 1.2 Story Template Updates
- [x] Add `module:` field to story frontmatter template
- [x] Add `dependencies:` field for cross-module tracking
- [x] Update `create-story` workflow to prompt for module

**Updated Story Frontmatter:**
```yaml
---
module: platform/core-api
story_id: 2-1-event-backbone-enhancements
status: drafted
dependencies:
  - module: platform/ts-schema
    request: "Add OrgCreatedEvent type"
    issue: "#123"
    status: approved
---
```

#### 1.3 Manifest Enhancement
- [x] Update `docs/manifest.yaml` with module-to-code mappings
- [x] Add `team_label` field for each module (kept existing `package` field)
- [x] Expose `{module_code_path}` variable in workflows

**Target manifest.yaml structure:**
```yaml
modules:
  core-api:
    category: platform
    package_path: "services/core-api"
    team_label: "team:core-api"
  shell:
    category: platform
    package_path: "apps/shell"
    team_label: "team:shell"
  ts-schema:
    category: platform
    package_path: "packages/ts-schema"
    team_label: "team:ts-schema"
  ui:
    category: platform
    package_path: "packages/ui"
    team_label: "team:ui"
  orchestration:
    category: platform
    package_path: null  # Cross-cutting, no single package
    team_label: "team:orchestration"
```

#### 1.4 GitHub Automation
- [x] Create `.github/ISSUE_TEMPLATE/cross-module-request.yml`
- [x] Create `.github/workflows/cross-module-check.yml`
- [x] Create `.github/workflows/ts-schema-contract.yml`
- [x] Create `.github/PULL_REQUEST_TEMPLATE.md` with cross-module checklist

#### 1.5 Labels & Project Setup ✅ COMPLETE
- [x] Create labels: `team:core-api`, `team:shell`, `team:ts-schema`, `team:ui`, `team:orchestration`
- [x] Create label: `cross-module`
- [ ] Optional: GitHub Project board with module columns (requires manual creation - CLI lacks `project` scope)

---

### Phase 2: Automation (Next Sprint)

#### 2.1 Workflow Updates
- [ ] Update `input_file_patterns` in workflows to use module context
- [ ] Inherit `{current_category}` and `{current_module}` from agent session
- [ ] Auto-prepend `{output_folder}/{current_category}/{current_module}/` to patterns

#### 2.2 CIS Agent Module Support
- [ ] Add optional module context to CIS agents (brainstorming, innovation, etc.)
- [ ] Keep root-scoped by default, module-scoped when explicitly requested

---

### Phase 3: Documentation & Polish (Future)

#### 3.1 Interface Documentation
- [ ] Auto-generate interface docs from approved cross-module requests
- [ ] Create `docs/platform/{module}/interfaces/` structure
- [ ] Track which modules consume which modules

#### 3.2 Aggregation (If Needed)
- [ ] Roll-up sprint status to orchestration for cross-module visibility
- [ ] Dashboard view of all module progress

#### 3.3 SLA Automation
- [ ] Notify human if cross-module request sits > 12 hours
- [ ] Block and require decision if > 24 hours

---

## GitHub Action Implementations

### Cross-Module Detection Workflow

```yaml
# .github/workflows/cross-module-check.yml
name: Cross-Module Warning

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  check-cross-module:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Detect modules touched
        id: modules
        run: |
          # Get changed files
          CHANGED=$(git diff --name-only origin/main...HEAD)

          # Map paths to module names (handles both code and docs)
          MODULES=$(echo "$CHANGED" | \
            sed -E 's|^docs/platform/([^/]+)/.*|\1|; s|^(services|apps|packages)/([^/]+)/.*|\2|' | \
            grep -v '^\.' | sort -u | tr '\n' ',' | sed 's/,$//')

          MODULE_COUNT=$(echo "$MODULES" | tr ',' '\n' | grep -c . || echo "0")

          echo "modules=$MODULES" >> $GITHUB_OUTPUT
          echo "count=$MODULE_COUNT" >> $GITHUB_OUTPUT

      - name: Check for existing warning
        if: steps.modules.outputs.count > 1
        id: existing
        uses: actions/github-script@v7
        with:
          script: |
            const comments = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number
            });

            const existingWarning = comments.data.find(c =>
              c.body.includes('Cross-Module Change Detected') &&
              c.user.type === 'Bot'
            );

            core.setOutput('exists', !!existingWarning);

      - name: Add cross-module warning
        if: steps.modules.outputs.count > 1 && steps.existing.outputs.exists != 'true'
        uses: actions/github-script@v7
        with:
          script: |
            const modules = '${{ steps.modules.outputs.modules }}'.split(',').filter(Boolean);

            await github.rest.issues.addLabels({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              labels: ['cross-module']
            });

            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `## ⚠️ Cross-Module Change Detected

This PR touches multiple modules: **${modules.join(', ')}**

### Before merging, please acknowledge:
- [ ] I have considered the impact on each module
- [ ] Cross-module dependencies are documented (GitHub Issue linked if needed)
- [ ] Contract tests pass (if applicable)
- [ ] I have mentally "context-switched" to review from each module's perspective

### Why this matters
Module isolation ensures clean ownership and prevents coupling issues at scale.
This acknowledgment creates an audit trail for future team members.

---
*To acknowledge: Edit this comment and check the boxes above.*`
            });
```

### Contract Testing Workflow (ts-schema)

> **NOTE:** Verify package names match actual `package.json` names before deploying.
> Current packages may be named differently (e.g., `@xentri/core` vs `@xentri/core-api`).
> The consumer list will grow as modules are added—update matrix accordingly.

```yaml
# .github/workflows/ts-schema-contract.yml
name: Contract Validation

on:
  pull_request:
    paths:
      - 'packages/ts-schema/**'

jobs:
  validate-consumer:
    name: Validate ${{ matrix.consumer }}
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        # NOTE: Update this list when adding new modules that consume ts-schema
        consumer: [core-api, shell, ui]

    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build ts-schema
        run: pnpm --filter @xentri/ts-schema build

      - name: Typecheck ${{ matrix.consumer }}
        run: pnpm --filter @xentri/${{ matrix.consumer }} typecheck

      - name: Test ${{ matrix.consumer }}
        run: pnpm --filter @xentri/${{ matrix.consumer }} test
```

### Cross-Module Request Issue Template

```yaml
# .github/ISSUE_TEMPLATE/cross-module-request.yml
name: Cross-Module Request
description: Request changes to another module's code or contracts
labels: ["cross-module", "needs-triage"]
body:
  - type: markdown
    attributes:
      value: |
        ## Cross-Module Request
        Use this template when your work in one module requires changes to another module.

  # NOTE: Update these options when adding new modules.
  # See docs/manifest.yaml for the authoritative module list.
  - type: dropdown
    id: source_module
    attributes:
      label: Requesting Module
      description: Which module is making this request?
      options:
        # Platform (infrastructure)
        - platform/orchestration
        - platform/core-api
        - platform/shell
        - platform/ts-schema
        - platform/ui
        # Category co-pilots (one per category, expand as needed)
        - strategy/copilot
        - brand/copilot
        - sales/copilot
        - finance/copilot
        - operations/copilot
        - team/copilot
        - legal/copilot
    validations:
      required: true

  # NOTE: Update these options when adding new modules.
  # See docs/manifest.yaml for the authoritative module list.
  - type: dropdown
    id: target_module
    attributes:
      label: Target Module
      description: Which module needs to make changes?
      options:
        # Platform (infrastructure)
        - platform/orchestration
        - platform/core-api
        - platform/shell
        - platform/ts-schema
        - platform/ui
        # Category co-pilots (one per category, expand as needed)
        - strategy/copilot
        - brand/copilot
        - sales/copilot
        - finance/copilot
        - operations/copilot
        - team/copilot
        - legal/copilot
    validations:
      required: true

  - type: input
    id: related_story
    attributes:
      label: Related Story/Issue
      description: Link to the story or issue driving this request
      placeholder: "#123 or story-2-1-event-backbone"
    validations:
      required: true

  - type: textarea
    id: request
    attributes:
      label: What do you need?
      description: Describe the specific change needed in the target module
      placeholder: |
        Example: Add `OrgCreatedEvent` type to `packages/ts-schema/src/events.ts`

        ```typescript
        export interface OrgCreatedEvent {
          type: 'org.created';
          orgId: string;
          timestamp: Date;
        }
        ```
    validations:
      required: true

  - type: textarea
    id: justification
    attributes:
      label: Why is this needed?
      description: Explain why this change is necessary and how it fits the architecture
      placeholder: |
        The core-api needs to emit typed events when organizations are created.
        This enables downstream consumers (shell, future modules) to react to org creation.
    validations:
      required: true

  - type: textarea
    id: impact
    attributes:
      label: Impact Assessment
      description: What other modules might be affected by this change?
      placeholder: |
        - shell: Will need to handle new event type (future story)
        - ui: No impact
        - core-api: Consumer of this change
```

---

## Next Session Prompt

After this plan is approved, use the following prompt to begin implementation:

```
@bmad-builder I need you to implement the Module Isolation
infrastructure changes documented in:
docs/platform/orchestration/module-isolation-plan.md

Start with Phase 1 items. This includes:
- Story template updates (module field, dependencies field)
- Manifest enhancement (module-to-code mappings)
- GitHub Actions for cross-module detection
- Cross-module request issue template

Read the plan first, then execute systematically.
Check off items as you complete them.
```

---

## Appendix: Design Rationale

### Why GitHub-Native Over Custom Solution?

| Custom `requests/` folder | GitHub-Native |
|---------------------------|---------------|
| Reinvents issue tracking | Uses battle-tested tools |
| No notifications | Email, Slack, mobile push |
| Manual status tracking | Automatic workflows |
| No audit trail | Full Git history |
| Solo dev learns custom system | Solo dev learns industry standard |
| Doesn't work with real teams | Ready for real teams day 1 |

### Why Option B (Warnings) Over Hard Blocks?

For a solo developer, hard blocks (CODEOWNERS requiring different users) would be theater. The real discipline comes from:

1. **Visibility** — You SEE that you're crossing boundaries
2. **Documentation** — The acknowledgment is recorded
3. **Pause point** — Forced mental context-switch
4. **Audit trail** — Future teams can trace decisions

When real teams exist, upgrade to Option C (hard blocks via CODEOWNERS).

### Domain-Driven Design Parallel

This approach applies DDD concepts to AI-assisted development:

- **Modules = Bounded Contexts** — Clear ownership boundaries
- **Cross-module requests = Context Mapping** — Formal integration points
- **Contract tests = Published Language** — Shared type validation
- **GitHub workflow = Anti-Corruption Layer** — Prevents coupling leakage

---

## Document History

| Date | Author | Change |
|------|--------|--------|
| 2025-11-27 | Party Mode Session | Initial draft from discovery session |
| 2025-11-27 | BMad Builder | Implemented Phase 1 items (1.2, 1.3, 1.4): story templates, manifest, GitHub automation |
