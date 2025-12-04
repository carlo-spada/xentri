#!/usr/bin/env npx tsx

/**
 * Atom Amend Script
 *
 * Modifies an existing atom's frontmatter fields.
 *
 * Usage:
 *   pnpm exec tsx scripts/atoms/atom-amend.ts --id SYS.001 --status approved
 *   pnpm exec tsx scripts/atoms/atom-amend.ts --id SYS.001 --title "New Title"
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseArgs } from 'util'
import yaml from 'yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const ATOMS_DIR = path.join(ROOT, 'docs/_atoms')

const VALID_TYPES = ['requirement', 'interface', 'decision', 'constraint']
const VALID_STATUSES = ['draft', 'approved', 'deprecated']

// Parse command line arguments
const { values } = parseArgs({
  options: {
    id: { type: 'string' },
    type: { type: 'string', short: 't' },
    title: { type: 'string' },
    status: { type: 'string', short: 's' },
    'add-tag': { type: 'string' },
    'remove-tag': { type: 'string' },
    help: { type: 'boolean', short: 'h' },
  },
})

function showHelp(): void {
  console.log(`
Atom Amend Script

Usage:
  pnpm exec tsx scripts/atoms/atom-amend.ts --id <ID> [options]

Options:
  --id <ID>             Atom ID to modify (required)
  -t, --type <TYPE>     Change atom type
  --title <TITLE>       Change title
  -s, --status <STATUS> Change status (draft, approved, deprecated)
  --add-tag <TAG>       Add a tag
  --remove-tag <TAG>    Remove a tag
  -h, --help            Show this help

Examples:
  # Approve an atom
  pnpm exec tsx scripts/atoms/atom-amend.ts --id SYS.001 -s approved

  # Change title
  pnpm exec tsx scripts/atoms/atom-amend.ts --id SYS.001 --title "Updated Title"

  # Add a tag
  pnpm exec tsx scripts/atoms/atom-amend.ts --id SYS.001 --add-tag security
`)
  process.exit(0)
}

if (values.help) {
  showHelp()
}

if (!values.id) {
  console.error('Error: --id is required')
  console.error('Run with --help for usage information')
  process.exit(1)
}

// Check if any modification specified
if (!values.type && !values.title && !values.status && !values['add-tag'] && !values['remove-tag']) {
  console.error('Error: At least one modification option required')
  console.error('Run with --help for usage information')
  process.exit(1)
}

// Validate type if specified
if (values.type && !VALID_TYPES.includes(values.type.toLowerCase())) {
  console.error(`Error: Invalid type "${values.type}"`)
  console.error(`Valid types: ${VALID_TYPES.join(', ')}`)
  process.exit(1)
}

// Validate status if specified
if (values.status && !VALID_STATUSES.includes(values.status.toLowerCase())) {
  console.error(`Error: Invalid status "${values.status}"`)
  console.error(`Valid statuses: ${VALID_STATUSES.join(', ')}`)
  process.exit(1)
}

const atomId = values.id
const atomPath = path.join(ATOMS_DIR, `${atomId}.md`)

// Check atom exists
if (!fs.existsSync(atomPath)) {
  console.error(`Error: Atom "${atomId}" does not exist`)
  console.error(`Expected file: ${atomPath}`)
  process.exit(1)
}

// Read current content
const content = fs.readFileSync(atomPath, 'utf-8')
const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)

if (!frontmatterMatch) {
  console.error(`Error: Atom "${atomId}" has no valid frontmatter`)
  process.exit(1)
}

// Parse frontmatter
let frontmatter: Record<string, unknown>
try {
  frontmatter = yaml.parse(frontmatterMatch[1]) as Record<string, unknown>
} catch (e) {
  console.error(`Error: Could not parse frontmatter: ${e}`)
  process.exit(1)
}

// Track changes
const changes: string[] = []

// Apply modifications
if (values.type) {
  const oldType = frontmatter.type
  frontmatter.type = values.type.toLowerCase()
  changes.push(`type: ${oldType} → ${frontmatter.type}`)
}

if (values.title) {
  const oldTitle = frontmatter.title
  frontmatter.title = values.title
  changes.push(`title: "${oldTitle}" → "${frontmatter.title}"`)
}

if (values.status) {
  const oldStatus = frontmatter.status
  frontmatter.status = values.status.toLowerCase()
  changes.push(`status: ${oldStatus} → ${frontmatter.status}`)
}

if (values['add-tag']) {
  const tags = (frontmatter.tags as string[]) || []
  if (!tags.includes(values['add-tag'])) {
    tags.push(values['add-tag'])
    frontmatter.tags = tags
    changes.push(`tags: added "${values['add-tag']}"`)
  }
}

if (values['remove-tag']) {
  const tags = (frontmatter.tags as string[]) || []
  const index = tags.indexOf(values['remove-tag'])
  if (index > -1) {
    tags.splice(index, 1)
    frontmatter.tags = tags
    changes.push(`tags: removed "${values['remove-tag']}"`)
  }
}

// Update the 'updated' field
const today = new Date().toISOString().split('T')[0]
frontmatter.updated = today

// Reconstruct file content
const bodyStart = content.indexOf('---', 4) + 4 // Skip first '---' and find second
const body = content.slice(bodyStart)
const newFrontmatter = yaml.stringify(frontmatter, { lineWidth: 0 }).trim()
const newContent = `---\n${newFrontmatter}\n---${body}`

// Write updated file
fs.writeFileSync(atomPath, newContent)

console.log(`
Atom amended successfully!

  ID:      ${atomId}
  Path:    docs/_atoms/${atomId}.md
  Updated: ${today}

Changes:
${changes.map((c) => `  - ${c}`).join('\n')}

Run validation: pnpm exec tsx scripts/validation/validate-atoms.ts
`)
