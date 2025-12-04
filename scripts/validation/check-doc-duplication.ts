#!/usr/bin/env npx tsx
/**
 * Documentation Duplication Checker
 *
 * Validates that Constitution documents follow ownership contracts.
 * Run in CI to prevent duplication regression.
 *
 * Usage:
 *   npx tsx scripts/validation/check-doc-duplication.ts
 *   npx tsx scripts/validation/check-doc-duplication.ts --staged  # Check only staged files
 *   npx tsx scripts/validation/check-doc-duplication.ts --fix     # Show fix suggestions
 *
 * Exit codes:
 *   0 - All checks passed
 *   1 - Validation errors found
 */

import { readFileSync, existsSync } from 'fs'
import { join, basename } from 'path'
import { execSync } from 'child_process'

// =============================================================================
// Configuration
// =============================================================================

const DOCS_PATH = 'docs/platform'
const CONSTITUTION_FILES = [
  'prd.md',
  'architecture.md',
  'ux-design.md',
  'epics.md',
  'product-soul.md',
]

interface ValidationRule {
  name: string
  pattern: RegExp
  forbiddenIn: string[]
  allowedIn: string[]
  message: string
  severity: 'error' | 'warning'
  suggestion?: string
}

const VALIDATION_RULES: ValidationRule[] = [
  {
    name: 'No TypeScript interfaces in PRD',
    pattern: /interface\s+\w+\s*\{/g,
    forbiddenIn: ['prd.md'],
    allowedIn: ['architecture.md'],
    message: 'TypeScript interfaces belong in architecture.md only',
    severity: 'error',
    suggestion:
      'Move interface to architecture.md and add reference: "See [ADR-xxx](./architecture.md#...)"',
  },
  {
    name: 'No requirement definitions in Epics',
    pattern: /^###\s+(PR|IC)-\d{3}[:\s]/gm,
    forbiddenIn: ['epics.md'],
    allowedIn: ['prd.md'],
    message: 'Requirement definitions (PR-xxx, IC-xxx headers) belong in prd.md',
    severity: 'error',
    suggestion: 'Reference by ID only: "Traces to: PR-xxx" with link to prd.md',
  },
  {
    name: 'No hex colors outside UX Design',
    pattern: /#[0-9a-fA-F]{6}\b/g,
    forbiddenIn: ['prd.md', 'architecture.md', 'epics.md'],
    allowedIn: ['ux-design.md'],
    message: 'Hex color values belong in ux-design.md only',
    severity: 'warning',
    suggestion: 'Reference color tokens from ux-design.md instead of hardcoding hex values',
  },
  {
    name: 'No pixel values in PRD',
    pattern: /\b\d+px\b/g,
    forbiddenIn: ['prd.md'],
    allowedIn: ['ux-design.md', 'architecture.md'],
    message: 'Pixel specifications belong in ux-design.md',
    severity: 'warning',
    suggestion: 'Describe intent (e.g., "comfortable spacing") not implementation (e.g., "16px")',
  },
  {
    name: 'No ADR content duplication',
    pattern: /## ADR-\d{3}[:\s]/gm,
    forbiddenIn: ['prd.md', 'epics.md', 'ux-design.md'],
    allowedIn: ['architecture.md'],
    message: 'ADR definitions belong in architecture.md only',
    severity: 'error',
    suggestion: 'Reference: "See [ADR-xxx](./architecture.md#adr-xxx-...)"',
  },
  {
    name: 'No CSS in non-UX docs',
    pattern: /--[a-z]+-[a-z]+:\s*[^;]+;/g,
    forbiddenIn: ['prd.md', 'epics.md'],
    allowedIn: ['ux-design.md', 'architecture.md'],
    message: 'CSS custom properties belong in ux-design.md',
    severity: 'warning',
  },
]

// =============================================================================
// Types
// =============================================================================

interface Violation {
  file: string
  rule: string
  line: number
  column: number
  match: string
  message: string
  severity: 'error' | 'warning'
  suggestion?: string
}

// =============================================================================
// Main Logic
// =============================================================================

function getFilesToCheck(stagedOnly: boolean): string[] {
  if (stagedOnly) {
    try {
      const staged = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
      return staged
        .split('\n')
        .filter((f) => f.startsWith(DOCS_PATH) && f.endsWith('.md'))
        .map((f) => basename(f))
        .filter((f) => CONSTITUTION_FILES.includes(f))
    } catch {
      console.error('Failed to get staged files. Running on all Constitution files.')
      return CONSTITUTION_FILES
    }
  }
  return CONSTITUTION_FILES
}

function findViolations(filename: string, content: string): Violation[] {
  const violations: Violation[] = []
  const lines = content.split('\n')

  for (const rule of VALIDATION_RULES) {
    if (!rule.forbiddenIn.includes(filename)) {
      continue
    }

    // Reset regex lastIndex for global patterns
    rule.pattern.lastIndex = 0

    let match: RegExpExecArray | null
    while ((match = rule.pattern.exec(content)) !== null) {
      // Find line number
      const beforeMatch = content.slice(0, match.index)
      const lineNumber = beforeMatch.split('\n').length
      const lineStart = beforeMatch.lastIndexOf('\n') + 1
      const column = match.index - lineStart + 1

      // Check if match is inside a code block (skip if so for some rules)
      const lineContent = lines[lineNumber - 1] || ''
      const isInCodeBlock = isInsideCodeBlock(content, match.index)

      // Skip hex colors and pixel values inside code blocks (they're examples)
      if (isInCodeBlock && (rule.name.includes('hex colors') || rule.name.includes('pixel'))) {
        continue
      }

      violations.push({
        file: filename,
        rule: rule.name,
        line: lineNumber,
        column,
        match: match[0].slice(0, 50) + (match[0].length > 50 ? '...' : ''),
        message: rule.message,
        severity: rule.severity,
        suggestion: rule.suggestion,
      })
    }
  }

  return violations
}

function isInsideCodeBlock(content: string, position: number): boolean {
  const before = content.slice(0, position)
  const codeBlockStarts = (before.match(/```/g) || []).length
  // If odd number of ``` before position, we're inside a code block
  return codeBlockStarts % 2 === 1
}

function formatViolation(v: Violation, showSuggestion: boolean): string {
  const icon = v.severity === 'error' ? '❌' : '⚠️'
  let output = `${icon} ${v.file}:${v.line}:${v.column} - ${v.message}`
  output += `\n   Match: "${v.match}"`
  output += `\n   Rule: ${v.rule}`
  if (showSuggestion && v.suggestion) {
    output += `\n   Fix: ${v.suggestion}`
  }
  return output
}

function main(): void {
  const args = process.argv.slice(2)
  const stagedOnly = args.includes('--staged')
  const showFix = args.includes('--fix')

  console.log('🔍 Documentation Duplication Checker\n')
  console.log(`   Based on: docs/platform/document-contracts.yaml`)
  console.log(`   Mode: ${stagedOnly ? 'Staged files only' : 'All Constitution files'}\n`)

  const files = getFilesToCheck(stagedOnly)

  if (files.length === 0) {
    console.log('✅ No Constitution files to check.\n')
    process.exit(0)
  }

  console.log(`   Checking: ${files.join(', ')}\n`)

  let allViolations: Violation[] = []

  for (const filename of files) {
    const filepath = join(process.cwd(), DOCS_PATH, filename)

    if (!existsSync(filepath)) {
      console.log(`   ⏭️  Skipping ${filename} (not found)`)
      continue
    }

    const content = readFileSync(filepath, 'utf-8')
    const violations = findViolations(filename, content)
    allViolations = allViolations.concat(violations)
  }

  // Report results
  const errors = allViolations.filter((v) => v.severity === 'error')
  const warnings = allViolations.filter((v) => v.severity === 'warning')

  if (allViolations.length === 0) {
    console.log('✅ All checks passed! No ownership violations found.\n')
    process.exit(0)
  }

  console.log('─'.repeat(60) + '\n')

  if (errors.length > 0) {
    console.log(`❌ ERRORS (${errors.length}):\n`)
    for (const v of errors) {
      console.log(formatViolation(v, showFix))
      console.log('')
    }
  }

  if (warnings.length > 0) {
    console.log(`⚠️  WARNINGS (${warnings.length}):\n`)
    for (const v of warnings) {
      console.log(formatViolation(v, showFix))
      console.log('')
    }
  }

  console.log('─'.repeat(60))
  console.log(`\nSummary: ${errors.length} error(s), ${warnings.length} warning(s)`)

  if (errors.length > 0) {
    console.log('\n💡 Run with --fix to see remediation suggestions.\n')
    console.log('📖 See docs/platform/document-contracts.yaml for ownership rules.\n')
    process.exit(1)
  }

  console.log('\n⚠️  Warnings found but not blocking. Consider fixing them.\n')
  process.exit(0)
}

main()
