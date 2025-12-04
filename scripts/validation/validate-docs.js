#!/usr/bin/env node

/**
 * Document Validation Script
 *
 * Validates:
 * - Constitution document frontmatter against JSON schema
 * - Sprint status files against JSON schema
 * - Cross-references between documents
 *
 * Usage:
 *   node scripts/validation/validate-docs.js [--fix]
 *   pnpm run validate:docs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'yaml'
import Ajv from 'ajv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const DOCS_DIR = path.join(ROOT, 'docs')
const PLATFORM_DIR = path.join(DOCS_DIR, 'platform')

// Load schemas
const constitutionSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'constitution-frontmatter.schema.json'), 'utf-8')
)
const sprintStatusSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'sprint-status.schema.json'), 'utf-8')
)

const ajv = new Ajv({ allErrors: true, verbose: true })
const validateConstitution = ajv.compile(constitutionSchema)
const validateSprintStatus = ajv.compile(sprintStatusSchema)

// Constitution documents to validate
const CONSTITUTION_DOCS = [
  'prd.md',
  'architecture.md',
  'ux-design.md',
  'epics.md',
  'product-soul.md',
]

let errors = []
let warnings = []

/**
 * Extract YAML frontmatter from markdown file
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  try {
    return yaml.parse(match[1])
  } catch (e) {
    return { _parseError: e.message }
  }
}

/**
 * Validate Constitution document frontmatter
 */
function validateConstitutionDocs() {
  console.log('\n📋 Validating Constitution Documents...\n')

  for (const docName of CONSTITUTION_DOCS) {
    let filePath = path.join(PLATFORM_DIR, docName)
    if (docName === 'product-soul.md') {
      filePath = path.join(DOCS_DIR, docName)
    }

    if (!fs.existsSync(filePath)) {
      errors.push(`Missing Constitution document: ${docName}`)
      continue
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const frontmatter = extractFrontmatter(content)

    if (!frontmatter) {
      errors.push(`${docName}: Missing frontmatter`)
      continue
    }

    if (frontmatter._parseError) {
      errors.push(`${docName}: Invalid YAML - ${frontmatter._parseError}`)
      continue
    }

    const valid = validateConstitution(frontmatter)

    if (valid) {
      console.log(`  ✅ ${docName}`)
    } else {
      console.log(`  ❌ ${docName}`)
      for (const err of validateConstitution.errors) {
        const msg = `${docName}: ${err.instancePath || 'root'} ${err.message}`
        errors.push(msg)
        console.log(`     - ${err.instancePath || 'root'}: ${err.message}`)
      }
    }
  }
}

/**
 * Validate sprint status files
 */
function validateSprintStatusFiles() {
  console.log('\n📊 Validating Sprint Status Files...\n')

  const sprintFiles = findFiles(PLATFORM_DIR, 'sprint-status.yaml')

  if (sprintFiles.length === 0) {
    warnings.push('No sprint-status.yaml files found')
    console.log('  ⚠️  No sprint-status.yaml files found')
    return
  }

  for (const filePath of sprintFiles) {
    const relativePath = path.relative(ROOT, filePath)

    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const data = yaml.parse(content)
      const valid = validateSprintStatus(data)

      if (valid) {
        console.log(`  ✅ ${relativePath}`)

        // Check staleness (> 7 days old)
        if (data.generated) {
          const generated = new Date(data.generated)
          const daysSince = (Date.now() - generated.getTime()) / (1000 * 60 * 60 * 24)
          if (daysSince > 7) {
            warnings.push(`${relativePath}: File is ${Math.floor(daysSince)} days old`)
            console.log(`     ⚠️  ${Math.floor(daysSince)} days old`)
          }
        }
      } else {
        console.log(`  ❌ ${relativePath}`)
        for (const err of validateSprintStatus.errors) {
          errors.push(`${relativePath}: ${err.instancePath || 'root'} ${err.message}`)
        }
      }
    } catch (e) {
      errors.push(`${relativePath}: Failed to parse - ${e.message}`)
      console.log(`  ❌ ${relativePath}: ${e.message}`)
    }
  }
}

/**
 * Validate cross-references between documents
 */
function validateCrossReferences() {
  console.log('\n🔗 Validating Cross-References...\n')

  const mdFiles = findFiles(PLATFORM_DIR, '*.md')
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g

  for (const filePath of mdFiles) {
    const relativePath = path.relative(ROOT, filePath)
    const content = fs.readFileSync(filePath, 'utf-8')
    const dir = path.dirname(filePath)

    let match
    let fileHasErrors = false

    while ((match = linkPattern.exec(content)) !== null) {
      const [, linkText, linkTarget] = match

      // Skip external links, anchors, and special protocols
      if (
        linkTarget.startsWith('http') ||
        linkTarget.startsWith('#') ||
        linkTarget.startsWith('mailto:')
      ) {
        continue
      }

      // Resolve relative path
      const targetPath = path.resolve(dir, linkTarget.split('#')[0])

      if (!fs.existsSync(targetPath)) {
        if (!fileHasErrors) {
          console.log(`  ❌ ${relativePath}`)
          fileHasErrors = true
        }
        errors.push(`${relativePath}: Broken link to "${linkTarget}"`)
        console.log(`     - Broken: ${linkTarget}`)
      }
    }

    if (!fileHasErrors && mdFiles.indexOf(filePath) < 5) {
      // Only show first 5 passing files to reduce noise
      console.log(`  ✅ ${relativePath}`)
    }
  }
}

/**
 * Find files matching pattern recursively
 */
function findFiles(dir, pattern) {
  const results = []
  const regex = new RegExp(pattern.replace('*', '.*'))

  function walk(currentDir) {
    if (!fs.existsSync(currentDir)) return

    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (regex.test(entry.name)) {
        results.push(fullPath)
      }
    }
  }

  walk(dir)
  return results
}

/**
 * Main
 */
function main() {
  console.log('🔍 Document Validation Report')
  console.log('='.repeat(50))

  validateConstitutionDocs()
  validateSprintStatusFiles()
  validateCrossReferences()

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📈 Summary\n')

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All validations passed!\n')
    process.exit(0)
  }

  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} warning(s):`)
    warnings.forEach((w) => console.log(`   - ${w}`))
    console.log('')
  }

  if (errors.length > 0) {
    console.log(`❌ ${errors.length} error(s):`)
    errors.forEach((e) => console.log(`   - ${e}`))
    console.log('')
    process.exit(1)
  }

  process.exit(0)
}

main()
