#!/usr/bin/env npx tsx

/**
 * Atom Search Script
 *
 * Searches docs/_atoms/ for atoms matching specified criteria.
 * Uses file system operations for efficient searching without reading all content.
 *
 * Usage:
 *   pnpm exec tsx scripts/atoms/atom-search.ts --entity SHL
 *   pnpm exec tsx scripts/atoms/atom-search.ts --type requirement --status approved
 *   pnpm exec tsx scripts/atoms/atom-search.ts --id SYS.001
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
    entity: { type: 'string', short: 'e' },
    type: { type: 'string', short: 't' },
    status: { type: 'string', short: 's' },
    title: { type: 'string' },
    json: { type: 'boolean' },
    help: { type: 'boolean', short: 'h' },
  },
})

function showHelp(): void {
  console.log(`
Atom Search Script

Usage:
  pnpm exec tsx scripts/atoms/atom-search.ts [options]

Options:
  --id <PATTERN>        ID pattern (substring match, e.g., "SHL" matches all Shell atoms)
  -e, --entity <CODE>   Filter by entity code in ID
  -t, --type <TYPE>     Filter by atom type (requirement, interface, decision, constraint)
  -s, --status <STATUS> Filter by status (draft, approved, deprecated)
  --title <KEYWORD>     Filter by title keyword (case-insensitive)
  --json                Output as JSON instead of table
  -h, --help            Show this help

Examples:
  # Find all Shell atoms
  pnpm exec tsx scripts/atoms/atom-search.ts -e SHL

  # Find all approved requirements
  pnpm exec tsx scripts/atoms/atom-search.ts -t requirement -s approved

  # Find atoms with "auth" in title
  pnpm exec tsx scripts/atoms/atom-search.ts --title auth
`)
  process.exit(0)
}

if (values.help) {
  showHelp()
}

// Require at least one search criterion
if (!values.id && !values.entity && !values.type && !values.status && !values.title) {
  console.error('Error: At least one search criterion required')
  console.error('Run with --help for usage information')
  process.exit(1)
}

interface AtomInfo {
  id: string
  type: string
  title: string
  status: string
  entity_path: string
  file: string
}

function extractFrontmatter(content: string): Record<string, unknown> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  try {
    return yaml.parse(match[1]) as Record<string, unknown>
  } catch {
    return null
  }
}

// Check if atoms directory exists
if (!fs.existsSync(ATOMS_DIR)) {
  console.error('Error: docs/_atoms/ directory does not exist')
  process.exit(1)
}

// Get all atom files
const files = fs.readdirSync(ATOMS_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'))

const results: AtomInfo[] = []

for (const file of files) {
  const filePath = path.join(ATOMS_DIR, file)
  const content = fs.readFileSync(filePath, 'utf-8')
  const frontmatter = extractFrontmatter(content)

  if (!frontmatter) continue

  const atom: AtomInfo = {
    id: (frontmatter.id as string) || file.replace('.md', ''),
    type: (frontmatter.type as string) || 'unknown',
    title: (frontmatter.title as string) || 'Untitled',
    status: (frontmatter.status as string) || 'draft',
    entity_path: (frontmatter.entity_path as string) || '',
    file,
  }

  // Apply filters
  if (values.id && !atom.id.includes(values.id.toUpperCase())) continue
  if (values.entity && !atom.id.includes(values.entity.toUpperCase())) continue
  if (values.type && atom.type !== values.type.toLowerCase()) continue
  if (values.status && atom.status !== values.status.toLowerCase()) continue
  if (values.title && !atom.title.toLowerCase().includes(values.title.toLowerCase())) continue

  results.push(atom)
}

// Sort by ID
results.sort((a, b) => a.id.localeCompare(b.id))

if (values.json) {
  console.log(JSON.stringify(results, null, 2))
} else {
  if (results.length === 0) {
    console.log('\nNo atoms found matching criteria.')
    console.log('Try relaxing your search filters.')
  } else {
    console.log(`\nFound ${results.length} atom(s):\n`)

    // Calculate column widths
    const idWidth = Math.max(4, ...results.map((r) => r.id.length))
    const typeWidth = Math.max(4, ...results.map((r) => r.type.length))
    const titleWidth = Math.min(40, Math.max(5, ...results.map((r) => r.title.length)))
    const statusWidth = Math.max(6, ...results.map((r) => r.status.length))

    // Header
    console.log(
      `${'ID'.padEnd(idWidth)} | ${'Type'.padEnd(typeWidth)} | ${'Title'.padEnd(titleWidth)} | ${'Status'.padEnd(statusWidth)}`
    )
    console.log(`${'-'.repeat(idWidth)} | ${'-'.repeat(typeWidth)} | ${'-'.repeat(titleWidth)} | ${'-'.repeat(statusWidth)}`)

    // Rows
    for (const atom of results) {
      const truncatedTitle = atom.title.length > titleWidth ? atom.title.slice(0, titleWidth - 3) + '...' : atom.title
      console.log(
        `${atom.id.padEnd(idWidth)} | ${atom.type.padEnd(typeWidth)} | ${truncatedTitle.padEnd(titleWidth)} | ${atom.status.padEnd(statusWidth)}`
      )
    }

    console.log(`\nTo view an atom: cat docs/_atoms/{ID}.md`)
  }
}
