#!/usr/bin/env npx tsx

/**
 * Atom Deprecate Script
 *
 * Marks an atom as deprecated. This is a safety-focused operation that:
 * - Checks for references to the atom before deprecating
 * - Warns about child atoms that will be orphaned
 * - Updates status to 'deprecated'
 *
 * Usage:
 *   pnpm exec tsx scripts/atoms/atom-deprecate.ts --id SYS.001
 *   pnpm exec tsx scripts/atoms/atom-deprecate.ts --id SYS.001 --force
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseArgs } from 'util'
import yaml from 'yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const ATOMS_DIR = path.join(ROOT, 'docs/_atoms')
const DOCS_DIR = path.join(ROOT, 'docs')

// Parse command line arguments
const { values } = parseArgs({
  options: {
    id: { type: 'string' },
    force: { type: 'boolean', short: 'f' },
    help: { type: 'boolean', short: 'h' },
  },
})

function showHelp(): void {
  console.log(`
Atom Deprecate Script

Marks an atom as deprecated with safety checks.

Usage:
  pnpm exec tsx scripts/atoms/atom-deprecate.ts --id <ID> [options]

Options:
  --id <ID>      Atom ID to deprecate (required)
  -f, --force    Skip safety checks and deprecate anyway
  -h, --help     Show this help

Safety Checks:
  - Warns if other atoms reference this atom
  - Warns if this atom has child atoms
  - Warns if documents reference this atom

Examples:
  # Deprecate with safety checks
  pnpm exec tsx scripts/atoms/atom-deprecate.ts --id SYS.001

  # Force deprecate (skip checks)
  pnpm exec tsx scripts/atoms/atom-deprecate.ts --id SYS.001 --force
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

// Check if already deprecated
if (frontmatter.status === 'deprecated') {
  console.log(`Atom "${atomId}" is already deprecated.`)
  process.exit(0)
}

// Safety checks (unless --force)
const warnings: string[] = []

if (!values.force) {
  // Check for child atoms (atoms that start with this ID)
  const files = fs.readdirSync(ATOMS_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  const childAtoms = files.filter((f) => {
    const id = f.replace('.md', '')
    return id.startsWith(`${atomId}-`) && id !== atomId
  })

  if (childAtoms.length > 0) {
    warnings.push(`This atom has ${childAtoms.length} child atom(s):`)
    for (const child of childAtoms.slice(0, 5)) {
      warnings.push(`  - ${child.replace('.md', '')}`)
    }
    if (childAtoms.length > 5) {
      warnings.push(`  ... and ${childAtoms.length - 5} more`)
    }
  }

  // Check for references in other atoms
  const referencingAtoms: string[] = []
  for (const file of files) {
    if (file === `${atomId}.md`) continue
    const filePath = path.join(ATOMS_DIR, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    if (fileContent.includes(`${atomId}.md`) || fileContent.includes(`[${atomId}]`)) {
      referencingAtoms.push(file.replace('.md', ''))
    }
  }

  if (referencingAtoms.length > 0) {
    warnings.push(`This atom is referenced by ${referencingAtoms.length} other atom(s):`)
    for (const ref of referencingAtoms.slice(0, 5)) {
      warnings.push(`  - ${ref}`)
    }
    if (referencingAtoms.length > 5) {
      warnings.push(`  ... and ${referencingAtoms.length - 5} more`)
    }
  }

  // Check for references in docs (simplified check)
  const docsWithRefs: string[] = []
  function searchDocs(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory() && entry.name !== '_atoms' && !entry.name.startsWith('.')) {
        searchDocs(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const docContent = fs.readFileSync(fullPath, 'utf-8')
        if (docContent.includes(`${atomId}.md`) || docContent.includes(`[${atomId}]`)) {
          docsWithRefs.push(path.relative(ROOT, fullPath))
        }
      }
    }
  }
  searchDocs(DOCS_DIR)

  if (docsWithRefs.length > 0) {
    warnings.push(`This atom is referenced in ${docsWithRefs.length} document(s):`)
    for (const doc of docsWithRefs.slice(0, 5)) {
      warnings.push(`  - ${doc}`)
    }
    if (docsWithRefs.length > 5) {
      warnings.push(`  ... and ${docsWithRefs.length - 5} more`)
    }
  }

  // If warnings, abort
  if (warnings.length > 0) {
    console.log(`
Cannot deprecate atom "${atomId}" due to safety checks:

${warnings.join('\n')}

To proceed anyway, use --force flag.
Note: Gate validation (Rule 5) will BLOCK commits with deprecated atom references.
`)
    process.exit(1)
  }
}

// Update status to deprecated
frontmatter.status = 'deprecated'
const today = new Date().toISOString().split('T')[0]
frontmatter.updated = today

// Reconstruct file content
const bodyStart = content.indexOf('---', 4) + 4
const body = content.slice(bodyStart)
const newFrontmatter = yaml.stringify(frontmatter, { lineWidth: 0 }).trim()
const newContent = `---\n${newFrontmatter}\n---${body}`

// Write updated file
fs.writeFileSync(atomPath, newContent)

console.log(`
Atom deprecated successfully!

  ID:      ${atomId}
  Path:    docs/_atoms/${atomId}.md
  Updated: ${today}
  Status:  deprecated

${values.force ? 'Warning: Safety checks were skipped with --force flag.' : ''}

Note: Gate validation (Rule 5) will BLOCK commits that reference deprecated atoms.
Run validation: pnpm exec tsx scripts/validation/validate-atoms.ts
`)
