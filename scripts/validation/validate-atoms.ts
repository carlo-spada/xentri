#!/usr/bin/env npx tsx
/**
 * SSOT Atom Validation Script
 *
 * Validates all atoms in docs/_atoms/ against the 5 gate validation rules:
 *   1. Parent Exists — Parent atom (ID prefix) must exist
 *   2. Entity Valid  — Entity path in frontmatter must resolve
 *   3. ID Format     — Atom ID must match schema pattern
 *   4. Refs Resolve  — All internal atom references must resolve
 *   5. No Deprecated — Cannot reference atoms with status: deprecated
 *
 * Usage:
 *   npx tsx scripts/validation/validate-atoms.ts
 *   npx tsx scripts/validation/validate-atoms.ts --staged    # Check only staged files
 *   npx tsx scripts/validation/validate-atoms.ts --verbose   # Show detailed output
 *
 * Exit codes:
 *   0 - All checks passed
 *   1 - Validation errors found
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, basename } from 'path'
import { execSync } from 'child_process'

// =============================================================================
// Configuration
// =============================================================================

const ATOMS_PATH = 'docs/_atoms'
const DOCS_PATH = 'docs'

// Atom ID pattern: SYS.001 or SYS.001-SHL.001 or SYS.001-SHL.001-PUL.001 etc.
const ATOM_ID_PATTERN = /^[A-Z]{2,3}\.\d{3}(-[A-Z]{2,3}\.\d{3})*$/

// Entity code to path mapping — defines which entity code maps to which directory
// This is the AUTHORITATIVE mapping for validation Rule 6
const ENTITY_CODE_TO_PATH: Record<string, string> = {
  // Constitution (root level)
  SYS: 'docs/platform/',

  // Infrastructure Modules
  SHL: 'docs/platform/shell/',
  UI: 'docs/platform/ui/',
  API: 'docs/platform/core-api/',
  TSS: 'docs/platform/ts-schema/',

  // Strategic Containers (7 categories)
  STR: 'docs/strategy/',
  MKT: 'docs/marketing/',
  FIN: 'docs/finance/',
  LEG: 'docs/legal/',
  OPS: 'docs/operations/',
  SAL: 'docs/sales/',
  TEM: 'docs/team/',
}

// Reverse mapping for validation
const PATH_TO_ENTITY_CODE: Record<string, string> = Object.entries(ENTITY_CODE_TO_PATH).reduce(
  (acc, [code, path]) => {
    acc[path] = code
    return acc
  },
  {} as Record<string, string>
)

// Frontmatter YAML pattern
const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---/

// Internal atom reference pattern: [text](./{id}.md) or [text](../_atoms/{id}.md)
const ATOM_REF_PATTERN = /\[([^\]]+)\]\(\.\/([\w.-]+)\.md\)/g
const EXTERNAL_ATOM_REF_PATTERN = /\[([^\]]+)\]\(\.\.\/_atoms\/([\w.-]+)\.md\)/g

// =============================================================================
// Types
// =============================================================================

interface AtomFrontmatter {
  id: string
  type?: 'commission' | 'requirement' | 'interface' | 'decision'
  title?: string
  status?: 'draft' | 'approved' | 'deprecated'
  entity_path?: string
  created?: string
  updated?: string
  author?: string
  tags?: string[]
}

interface Atom {
  filename: string
  filepath: string
  frontmatter: AtomFrontmatter | null
  content: string
  parseError?: string
}

interface ValidationError {
  file: string
  rule: number
  ruleName: string
  message: string
  severity: 'BLOCK' | 'WARN'
  line?: number
}

interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  atomCount: number
  validCount: number
}

// =============================================================================
// Frontmatter Parsing
// =============================================================================

function parseFrontmatter(content: string): AtomFrontmatter | null {
  const match = content.match(FRONTMATTER_PATTERN)
  if (!match) {
    return null
  }

  const yamlContent = match[1]
  const frontmatter: Record<string, unknown> = {}

  // Simple YAML parsing (key: value pairs)
  const lines = yamlContent.split('\n')
  let currentKey = ''
  let inArray = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    // Array item
    if (trimmed.startsWith('- ')) {
      if (currentKey && inArray) {
        if (!Array.isArray(frontmatter[currentKey])) {
          frontmatter[currentKey] = []
        }
        ;(frontmatter[currentKey] as string[]).push(trimmed.slice(2).trim())
      }
      continue
    }

    // Key: value pair
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex > 0) {
      currentKey = trimmed.slice(0, colonIndex).trim()
      const value = trimmed.slice(colonIndex + 1).trim()

      if (value === '[]') {
        frontmatter[currentKey] = []
        inArray = false
      } else if (value === '') {
        inArray = true
        frontmatter[currentKey] = []
      } else {
        // Remove quotes if present
        frontmatter[currentKey] = value.replace(/^["']|["']$/g, '')
        inArray = false
      }
    }
  }

  return frontmatter as unknown as AtomFrontmatter
}

// =============================================================================
// File Operations
// =============================================================================

function getAtomFiles(stagedOnly: boolean): string[] {
  const atomsDir = join(process.cwd(), ATOMS_PATH)

  if (!existsSync(atomsDir)) {
    return []
  }

  if (stagedOnly) {
    try {
      const staged = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
      return staged
        .split('\n')
        .filter((f) => f.startsWith(ATOMS_PATH) && f.endsWith('.md') && !f.includes('_'))
        .map((f) => join(process.cwd(), f))
    } catch {
      console.error('Failed to get staged files. Running on all atom files.')
    }
  }

  // Get all .md files in _atoms directory (excluding _ prefixed files)
  return readdirSync(atomsDir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => join(atomsDir, f))
}

function loadAtom(filepath: string): Atom {
  const filename = basename(filepath)

  try {
    const content = readFileSync(filepath, 'utf-8')
    const frontmatter = parseFrontmatter(content)

    return {
      filename,
      filepath,
      frontmatter,
      content,
    }
  } catch (error) {
    return {
      filename,
      filepath,
      frontmatter: null,
      content: '',
      parseError: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

function loadAllAtoms(): Map<string, Atom> {
  const atomsDir = join(process.cwd(), ATOMS_PATH)
  const atoms = new Map<string, Atom>()

  if (!existsSync(atomsDir)) {
    return atoms
  }

  const files = readdirSync(atomsDir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))

  for (const file of files) {
    const filepath = join(atomsDir, file)
    const atom = loadAtom(filepath)
    if (atom.frontmatter?.id) {
      atoms.set(atom.frontmatter.id, atom)
    }
  }

  return atoms
}

// =============================================================================
// Validation Rules
// =============================================================================

/**
 * Rule 1: Parent Exists
 * For hierarchical IDs like SYS.001-SHL.001, the parent SYS.001 must exist.
 */
function validateParentExists(atom: Atom, allAtoms: Map<string, Atom>): ValidationError | null {
  if (!atom.frontmatter?.id) return null

  const id = atom.frontmatter.id
  const parts = id.split('-')

  // Root atoms (no hyphen) have no parent requirement
  if (parts.length <= 1) {
    return null
  }

  // Get parent ID (all parts except the last)
  const parentId = parts.slice(0, -1).join('-')

  // Check if parent exists
  if (!allAtoms.has(parentId)) {
    return {
      file: atom.filename,
      rule: 1,
      ruleName: 'Parent Exists',
      message: `Parent atom "${parentId}" does not exist. Child atoms require their parent to exist first.`,
      severity: 'BLOCK',
    }
  }

  return null
}

/**
 * Rule 2: Entity Valid
 * The entity_path in frontmatter must resolve to an existing directory.
 */
function validateEntityValid(atom: Atom): ValidationError | null {
  if (!atom.frontmatter?.entity_path) {
    return {
      file: atom.filename,
      rule: 2,
      ruleName: 'Entity Valid',
      message: 'Missing required field: entity_path',
      severity: 'BLOCK',
    }
  }

  const entityPath = join(process.cwd(), atom.frontmatter.entity_path)

  if (!existsSync(entityPath)) {
    return {
      file: atom.filename,
      rule: 2,
      ruleName: 'Entity Valid',
      message: `Entity path "${atom.frontmatter.entity_path}" does not exist.`,
      severity: 'BLOCK',
    }
  }

  // Verify it's a directory
  if (!statSync(entityPath).isDirectory()) {
    return {
      file: atom.filename,
      rule: 2,
      ruleName: 'Entity Valid',
      message: `Entity path "${atom.frontmatter.entity_path}" is not a directory.`,
      severity: 'BLOCK',
    }
  }

  return null
}

/**
 * Rule 3: ID Format
 * Atom ID must match the pattern: {ENTITY}.{SEQ}(-{CHILD}.{SEQ})*
 */
function validateIdFormat(atom: Atom): ValidationError | null {
  if (!atom.frontmatter?.id) {
    return {
      file: atom.filename,
      rule: 3,
      ruleName: 'ID Format',
      message: 'Missing required field: id',
      severity: 'BLOCK',
    }
  }

  const id = atom.frontmatter.id

  if (!ATOM_ID_PATTERN.test(id)) {
    return {
      file: atom.filename,
      rule: 3,
      ruleName: 'ID Format',
      message: `Invalid atom ID format: "${id}". Expected pattern: {ENTITY}.{SEQ} (e.g., SYS.001, SYS.001-SHL.001)`,
      severity: 'BLOCK',
    }
  }

  // Verify filename matches ID
  const expectedFilename = `${id}.md`
  if (atom.filename !== expectedFilename) {
    return {
      file: atom.filename,
      rule: 3,
      ruleName: 'ID Format',
      message: `Filename "${atom.filename}" does not match atom ID. Expected: "${expectedFilename}"`,
      severity: 'BLOCK',
    }
  }

  return null
}

/**
 * Rule 4: Refs Resolve
 * All internal atom references [text](./{id}.md) must resolve to existing atoms.
 */
function validateRefsResolve(atom: Atom, allAtoms: Map<string, Atom>): ValidationError[] {
  const errors: ValidationError[] = []
  const content = atom.content

  // Find all internal references
  const refs: { id: string; line: number }[] = []

  // References within _atoms/: [text](./{id}.md)
  let match: RegExpExecArray | null
  ATOM_REF_PATTERN.lastIndex = 0
  while ((match = ATOM_REF_PATTERN.exec(content)) !== null) {
    const refId = match[2]
    const line = content.slice(0, match.index).split('\n').length
    refs.push({ id: refId, line })
  }

  // Check each reference
  for (const ref of refs) {
    // Skip template placeholders
    if (ref.id.includes('{') || ref.id === 'PARENT_ID' || ref.id === 'SIBLING_ID') {
      continue
    }

    if (!allAtoms.has(ref.id)) {
      errors.push({
        file: atom.filename,
        rule: 4,
        ruleName: 'Refs Resolve',
        message: `Reference to "${ref.id}" does not resolve to an existing atom.`,
        severity: 'BLOCK',
        line: ref.line,
      })
    }
  }

  return errors
}

/**
 * Rule 5: No Deprecated
 * Cannot reference atoms with status: deprecated
 */
function validateNoDeprecated(atom: Atom, allAtoms: Map<string, Atom>): ValidationError[] {
  const errors: ValidationError[] = []
  const content = atom.content

  // Find all internal references
  let match: RegExpExecArray | null
  ATOM_REF_PATTERN.lastIndex = 0
  while ((match = ATOM_REF_PATTERN.exec(content)) !== null) {
    const refId = match[2]
    const line = content.slice(0, match.index).split('\n').length

    // Skip template placeholders
    if (refId.includes('{') || refId === 'PARENT_ID' || refId === 'SIBLING_ID') {
      continue
    }

    const referencedAtom = allAtoms.get(refId)
    if (referencedAtom?.frontmatter?.status === 'deprecated') {
      errors.push({
        file: atom.filename,
        rule: 5,
        ruleName: 'No Deprecated',
        message: `Reference to deprecated atom "${refId}". Deprecated atoms should not be referenced.`,
        severity: 'BLOCK',
        line,
      })
    }
  }

  return errors
}

/**
 * Rule 6: Entity Code Matches Path
 * The entity code in the atom ID must match the entity_path.
 * For hierarchical IDs, the LAST entity code determines the owning entity.
 *
 * Examples:
 *   SYS.001        → entity_path must be docs/platform/
 *   SYS.001-SHL.001 → entity_path must be docs/platform/shell/
 *   SYS.001-API.001 → entity_path must be docs/platform/core-api/
 */
function validateEntityCodeMatchesPath(atom: Atom): ValidationError | null {
  if (!atom.frontmatter?.id || !atom.frontmatter?.entity_path) {
    return null // Other rules will catch missing fields
  }

  const id = atom.frontmatter.id
  const entityPath = atom.frontmatter.entity_path

  // Extract the LAST entity code from the ID (the owning entity)
  // SYS.001 → SYS
  // SYS.001-SHL.001 → SHL
  // SYS.001-SHL.001-PUL.001 → PUL
  const parts = id.split('-')
  const lastPart = parts[parts.length - 1]
  const entityCode = lastPart.split('.')[0]

  // Get expected path for this entity code
  const expectedPath = ENTITY_CODE_TO_PATH[entityCode]

  if (!expectedPath) {
    return {
      file: atom.filename,
      rule: 6,
      ruleName: 'Entity Code Valid',
      message: `Unknown entity code "${entityCode}" in atom ID. Valid codes: ${Object.keys(ENTITY_CODE_TO_PATH).join(', ')}`,
      severity: 'BLOCK',
    }
  }

  if (entityPath !== expectedPath) {
    return {
      file: atom.filename,
      rule: 6,
      ruleName: 'Entity Code Matches Path',
      message: `Entity path mismatch. ID "${id}" has entity code "${entityCode}" which requires entity_path: "${expectedPath}", but found: "${entityPath}"`,
      severity: 'BLOCK',
    }
  }

  return null
}

// =============================================================================
// Required Fields Validation
// =============================================================================

function validateRequiredFields(atom: Atom): ValidationError[] {
  const errors: ValidationError[] = []
  const required = ['id', 'type', 'title', 'status', 'entity_path', 'created', 'updated', 'author']

  if (!atom.frontmatter) {
    errors.push({
      file: atom.filename,
      rule: 0,
      ruleName: 'Frontmatter',
      message: 'Missing or invalid frontmatter. Atoms must have YAML frontmatter.',
      severity: 'BLOCK',
    })
    return errors
  }

  for (const field of required) {
    if (!(field in atom.frontmatter) || !atom.frontmatter[field as keyof AtomFrontmatter]) {
      errors.push({
        file: atom.filename,
        rule: 0,
        ruleName: 'Required Fields',
        message: `Missing required field: ${field}`,
        severity: 'BLOCK',
      })
    }
  }

  // Validate type enum
  const validTypes = ['commission', 'requirement', 'interface', 'decision']
  if (atom.frontmatter.type && !validTypes.includes(atom.frontmatter.type)) {
    errors.push({
      file: atom.filename,
      rule: 0,
      ruleName: 'Type Enum',
      message: `Invalid type: "${atom.frontmatter.type}". Must be one of: ${validTypes.join(', ')}`,
      severity: 'BLOCK',
    })
  }

  // Validate status enum
  const validStatuses = ['draft', 'approved', 'deprecated']
  if (atom.frontmatter.status && !validStatuses.includes(atom.frontmatter.status)) {
    errors.push({
      file: atom.filename,
      rule: 0,
      ruleName: 'Status Enum',
      message: `Invalid status: "${atom.frontmatter.status}". Must be one of: ${validStatuses.join(', ')}`,
      severity: 'BLOCK',
    })
  }

  return errors
}

// =============================================================================
// Main Validation
// =============================================================================

function validateAtom(atom: Atom, allAtoms: Map<string, Atom>): ValidationError[] {
  const errors: ValidationError[] = []

  // Check for parse errors
  if (atom.parseError) {
    errors.push({
      file: atom.filename,
      rule: 0,
      ruleName: 'Parse Error',
      message: atom.parseError,
      severity: 'BLOCK',
    })
    return errors
  }

  // Validate required fields first
  errors.push(...validateRequiredFields(atom))

  // If frontmatter is invalid, skip other rules
  if (!atom.frontmatter) {
    return errors
  }

  // Rule 1: Parent Exists
  const parentError = validateParentExists(atom, allAtoms)
  if (parentError) errors.push(parentError)

  // Rule 2: Entity Valid
  const entityError = validateEntityValid(atom)
  if (entityError) errors.push(entityError)

  // Rule 3: ID Format
  const idError = validateIdFormat(atom)
  if (idError) errors.push(idError)

  // Rule 4: Refs Resolve
  errors.push(...validateRefsResolve(atom, allAtoms))

  // Rule 5: No Deprecated
  errors.push(...validateNoDeprecated(atom, allAtoms))

  // Rule 6: Entity Code Matches Path
  const entityCodeError = validateEntityCodeMatchesPath(atom)
  if (entityCodeError) errors.push(entityCodeError)

  return errors
}

function runValidation(filesToCheck: string[], allAtoms: Map<string, Atom>): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    atomCount: filesToCheck.length,
    validCount: 0,
  }

  for (const filepath of filesToCheck) {
    const atom = loadAtom(filepath)
    const errors = validateAtom(atom, allAtoms)

    const blockErrors = errors.filter((e) => e.severity === 'BLOCK')
    const warnErrors = errors.filter((e) => e.severity === 'WARN')

    result.errors.push(...blockErrors)
    result.warnings.push(...warnErrors)

    if (blockErrors.length === 0) {
      result.validCount++
    }
  }

  result.valid = result.errors.length === 0

  return result
}

// =============================================================================
// Output Formatting
// =============================================================================

function formatError(error: ValidationError): string {
  const icon = error.severity === 'BLOCK' ? '❌' : '⚠️'
  const location = error.line ? `:${error.line}` : ''
  return `${icon} [Rule ${error.rule}: ${error.ruleName}] ${error.file}${location}\n   ${error.message}`
}

function printResults(result: ValidationResult, verbose: boolean): void {
  console.log('\n' + '═'.repeat(70))
  console.log('  SSOT ATOM VALIDATION RESULTS')
  console.log('═'.repeat(70) + '\n')

  if (result.atomCount === 0) {
    console.log('  No atoms found in docs/_atoms/')
    console.log('  (Files starting with "_" are infrastructure files and are skipped)')
    console.log('\n' + '═'.repeat(70) + '\n')
    return
  }

  console.log(`  Atoms checked: ${result.atomCount}`)
  console.log(`  Valid:         ${result.validCount}`)
  console.log(`  Errors:        ${result.errors.length}`)
  console.log(`  Warnings:      ${result.warnings.length}`)

  if (result.errors.length > 0) {
    console.log('\n' + '─'.repeat(70))
    console.log('  BLOCKING ERRORS')
    console.log('─'.repeat(70) + '\n')

    for (const error of result.errors) {
      console.log(formatError(error))
      console.log('')
    }
  }

  if (result.warnings.length > 0 && verbose) {
    console.log('\n' + '─'.repeat(70))
    console.log('  WARNINGS')
    console.log('─'.repeat(70) + '\n')

    for (const warning of result.warnings) {
      console.log(formatError(warning))
      console.log('')
    }
  }

  console.log('═'.repeat(70))

  if (result.valid) {
    console.log('\n  ✅ VALIDATION PASSED\n')
  } else {
    console.log('\n  ❌ VALIDATION FAILED')
    console.log('\n  Gate Validation Rules (all BLOCK severity):')
    console.log('    1. Parent Exists  — Parent atom (ID prefix) must exist')
    console.log('    2. Entity Valid   — Entity path in frontmatter must resolve')
    console.log('    3. ID Format      — Atom ID must match schema pattern')
    console.log('    4. Refs Resolve   — All internal atom refs must resolve')
    console.log('    5. No Deprecated  — Cannot reference deprecated atoms')
    console.log('    6. Entity Code    — Entity code in ID must match entity_path')
    console.log('\n  See: docs/_atoms/GOVERNANCE.md for atom placement rules')
    console.log('')
  }
}

// =============================================================================
// Main
// =============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const stagedOnly = args.includes('--staged')
  const verbose = args.includes('--verbose')

  console.log('\n🔍 SSOT Atom Validation')
  console.log(`   Path: ${ATOMS_PATH}/`)
  console.log(`   Mode: ${stagedOnly ? 'Staged files only' : 'All atom files'}`)

  // Check if atoms directory exists
  const atomsDir = join(process.cwd(), ATOMS_PATH)
  if (!existsSync(atomsDir)) {
    console.log(`\n❌ Atoms directory not found: ${ATOMS_PATH}/`)
    console.log('   Run Phase 0.01 to create the atom directory structure.')
    process.exit(1)
  }

  // Load all atoms for cross-reference validation
  const allAtoms = loadAllAtoms()
  console.log(`   Found: ${allAtoms.size} atoms in registry`)

  // Get files to check
  const filesToCheck = getAtomFiles(stagedOnly)

  // Run validation
  const result = runValidation(filesToCheck, allAtoms)

  // Print results
  printResults(result, verbose)

  // Exit with appropriate code
  process.exit(result.valid ? 0 : 1)
}

main().catch((error) => {
  console.error('\n❌ Validation script failed:', error)
  process.exit(1)
})
