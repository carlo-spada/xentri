#!/usr/bin/env npx tsx

/**
 * Atom Create Script
 *
 * Creates a new SSOT atom in docs/_atoms/ with proper ID and frontmatter.
 *
 * Usage:
 *   pnpm exec tsx scripts/atoms/atom-create.ts --entity SYS --type requirement --title "My Atom"
 *   pnpm exec tsx scripts/atoms/atom-create.ts --parent SYS.001 --entity SHL --type interface --title "Shell API"
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseArgs } from 'util'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const ATOMS_DIR = path.join(ROOT, 'docs/_atoms')
const TEMPLATE_PATH = path.join(ATOMS_DIR, '_template.md')

// Valid entity codes
const ENTITY_CODES: Record<string, string> = {
  SYS: 'docs/platform/',
  SHL: 'docs/platform/shell/',
  UI: 'docs/platform/ui/',
  API: 'docs/platform/core-api/',
  TSS: 'docs/platform/ts-schema/',
  STR: 'docs/strategy/',
  MKT: 'docs/marketing/',
  FIN: 'docs/finance/',
  LEG: 'docs/legal/',
  OPS: 'docs/operations/',
  SAL: 'docs/sales/',
  TEM: 'docs/team/',
}

const VALID_TYPES = ['requirement', 'interface', 'decision', 'constraint']

// Parse command line arguments
const { values } = parseArgs({
  options: {
    entity: { type: 'string', short: 'e' },
    type: { type: 'string', short: 't' },
    title: { type: 'string' },
    parent: { type: 'string', short: 'p' },
    help: { type: 'boolean', short: 'h' },
  },
})

function showHelp(): void {
  console.log(`
Atom Create Script

Usage:
  pnpm exec tsx scripts/atoms/atom-create.ts [options]

Options:
  -e, --entity <CODE>   Entity code (SYS, SHL, UI, API, TSS, STR, MKT, FIN, LEG, OPS, SAL, TEM)
  -t, --type <TYPE>     Atom type (requirement, interface, decision, constraint)
  --title <TITLE>       Human-readable title
  -p, --parent <ID>     Parent atom ID (required for non-SYS entities)
  -h, --help            Show this help

Examples:
  # Create Constitution atom
  pnpm exec tsx scripts/atoms/atom-create.ts -e SYS -t requirement --title "Multi-tenant Architecture"

  # Create Shell module atom (requires parent)
  pnpm exec tsx scripts/atoms/atom-create.ts -e SHL -t interface --title "Auth API" -p SYS.001
`)
  process.exit(0)
}

if (values.help) {
  showHelp()
}

// Validate required arguments
if (!values.entity || !values.type || !values.title) {
  console.error('Error: --entity, --type, and --title are required')
  console.error('Run with --help for usage information')
  process.exit(1)
}

const entity = values.entity.toUpperCase()
const atomType = values.type.toLowerCase()
const title = values.title
const parentId = values.parent

// Validate entity code
if (!ENTITY_CODES[entity]) {
  console.error(`Error: Invalid entity code "${entity}"`)
  console.error(`Valid codes: ${Object.keys(ENTITY_CODES).join(', ')}`)
  process.exit(1)
}

// Validate type
if (!VALID_TYPES.includes(atomType)) {
  console.error(`Error: Invalid type "${atomType}"`)
  console.error(`Valid types: ${VALID_TYPES.join(', ')}`)
  process.exit(1)
}

// Non-SYS entities require a parent
if (entity !== 'SYS' && !parentId) {
  console.error(`Error: Non-Constitution atoms require --parent`)
  console.error(`Example: --parent SYS.001`)
  process.exit(1)
}

// Validate parent exists if specified
if (parentId) {
  const parentPath = path.join(ATOMS_DIR, `${parentId}.md`)
  if (!fs.existsSync(parentPath)) {
    console.error(`Error: Parent atom "${parentId}" does not exist`)
    console.error(`Expected file: ${parentPath}`)
    process.exit(1)
  }
}

// Find next sequence number for this entity under the parent
function getNextSequence(): string {
  const files = fs.readdirSync(ATOMS_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'))

  const prefix = parentId ? `${parentId}-${entity}` : entity
  const pattern = new RegExp(`^${prefix.replace(/\./g, '\\.')}\\.([0-9]{3})\\.md$`)

  let maxSeq = 0
  for (const file of files) {
    const match = file.match(pattern)
    if (match) {
      const seq = parseInt(match[1], 10)
      if (seq > maxSeq) maxSeq = seq
    }
  }

  return String(maxSeq + 1).padStart(3, '0')
}

const seq = getNextSequence()
const atomId = parentId ? `${parentId}-${entity}.${seq}` : `${entity}.${seq}`
const atomPath = path.join(ATOMS_DIR, `${atomId}.md`)

// Check if ID already exists (shouldn't happen with sequence logic, but safety check)
if (fs.existsSync(atomPath)) {
  console.error(`Error: Atom "${atomId}" already exists`)
  process.exit(1)
}

// Get today's date in ISO format
const today = new Date().toISOString().split('T')[0]

// Read template
let template: string
if (fs.existsSync(TEMPLATE_PATH)) {
  template = fs.readFileSync(TEMPLATE_PATH, 'utf-8')
} else {
  // Fallback minimal template
  template = `---
id: {ENTITY}.{SEQ}
type: {TYPE}
title: "{TITLE}"
status: draft
entity_path: {ENTITY_PATH}
created: {DATE}
updated: {DATE}
author: {AUTHOR}
tags: []
---

# {TITLE}

> **Atom ID:** \`{ID}\`
> **Type:** {TYPE}
> **Status:** Draft

---

## Summary

{Brief description}

---

## Content

{Main content}

---

## Changelog

| Date | Author | Change |
| ---- | ------ | ------ |
| {DATE} | {AUTHOR} | Initial creation |
`
}

// Fill in template
const entityPath = ENTITY_CODES[entity]
const content = template
  .replace(/\{ENTITY\}\.\{SEQ\}/g, atomId)
  .replace(/\{ID\}/g, atomId)
  .replace(/\{TYPE\}/g, atomType)
  .replace(/\{TITLE\}/g, title)
  .replace(/\{ENTITY_PATH\}/g, entityPath)
  .replace(/\{DATE\}/g, today)
  .replace(/\{AUTHOR\}/g, 'atom-create script')
  .replace(/\{PARENT_ID\}/g, parentId || 'N/A')

// Write atom file
fs.writeFileSync(atomPath, content)

console.log(`
Atom created successfully!

  ID:     ${atomId}
  Type:   ${atomType}
  Title:  ${title}
  Path:   docs/_atoms/${atomId}.md
  Parent: ${parentId || 'N/A (root atom)'}
  Status: draft

Next steps:
  1. Edit the atom file to add content
  2. Run validation: pnpm exec tsx scripts/validation/validate-atoms.ts
`)
