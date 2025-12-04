# Story Context Validation Checklist

> This checklist is used by the validate-story-context workflow to assess document quality.

## XML Structure

- [ ] Document is well-formed XML
- [ ] All tags properly opened and closed
- [ ] No malformed or orphaned elements
- [ ] Proper XML declaration present

## Required Elements

### Root Element

- [ ] `<story-context>` root element present
- [ ] Story ID attribute populated
- [ ] Version/timestamp present

### Story Metadata

- [ ] `<story-metadata>` section exists
- [ ] Story ID matches filename
- [ ] Epic ID referenced correctly
- [ ] Story title present
- [ ] Current status indicated
- [ ] Acceptance criteria included

### Documentation Context

- [ ] `<documentation-context>` section exists
- [ ] Relevant PRD sections included (if PRD exists)
- [ ] Architecture guidance present (if architecture exists)
- [ ] Epic tech context linked
- [ ] UX design references (if UI story)

### Implementation Context

- [ ] `<implementation-context>` section exists (if code exists)
- [ ] Relevant code references included
- [ ] Pattern examples provided
- [ ] File locations documented
- [ ] Dependencies identified

## Content Accuracy

### Source Verification

- [ ] All referenced documents exist
- [ ] Extracted content matches source documents
- [ ] No stale or outdated information
- [ ] Version references are current

### Relevance

- [ ] Content is relevant to this specific story
- [ ] No extraneous information included
- [ ] Focus is on what developer needs
- [ ] Appropriate level of detail

### Code References (If Present)

- [ ] Referenced files exist in codebase
- [ ] File paths are accurate
- [ ] Code snippets are current
- [ ] Line numbers accurate (if specified)

## Implementation Guidance

### Technical Clarity

- [ ] Implementation approach is clear
- [ ] Key decisions are documented
- [ ] Patterns to follow are identified
- [ ] Anti-patterns to avoid are noted

### Dependencies

- [ ] External dependencies identified
- [ ] Internal dependencies documented
- [ ] Integration points clear
- [ ] Testing approach described

## Quality Assessment

### Critical Issues (blocks development):

- [ ] None identified

### Warnings (should address):

- [ ] None identified

### Ready for Development:

- [ ] Yes, story context is validated
- [ ] No, requires amendments (see issues above)
