#!/usr/bin/env node

/**
 * Link Validation Script
 *
 * Validates internal links in markdown files.
 * Designed to be fast and run in CI.
 *
 * Usage:
 *   node scripts/validation/validate-links.js
 *   pnpm run validate:links
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const DOCS_DIR = path.join(ROOT, 'docs');

let errors = [];
let checked = 0;

/**
 * Find all markdown files recursively
 */
function findMarkdownFiles(dir) {
  const results = [];

  function walk(currentDir) {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        walk(fullPath);
      } else if (entry.name.endsWith('.md')) {
        results.push(fullPath);
      }
    }
  }

  walk(dir);
  return results;
}

/**
 * Extract and validate links from markdown content
 */
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(ROOT, filePath);
  const dir = path.dirname(filePath);

  // Match markdown links: [text](url)
  const linkPattern = /\[([^\]]*)\]\(([^)]+)\)/g;

  let match;
  let fileErrors = [];

  while ((match = linkPattern.exec(content)) !== null) {
    const [, linkText, linkTarget] = match;
    checked++;

    // Skip external links
    if (linkTarget.startsWith('http://') || linkTarget.startsWith('https://')) {
      continue;
    }

    // Skip anchors and special protocols
    if (linkTarget.startsWith('#') || linkTarget.startsWith('mailto:')) {
      continue;
    }

    // Handle anchor links (file.md#section)
    const [targetFile] = linkTarget.split('#');

    if (!targetFile) continue; // Pure anchor link

    // Resolve the path
    const resolvedPath = path.resolve(dir, targetFile);

    if (!fs.existsSync(resolvedPath)) {
      fileErrors.push({
        link: linkTarget,
        text: linkText,
        line: getLineNumber(content, match.index)
      });
    }
  }

  if (fileErrors.length > 0) {
    errors.push({ file: relativePath, errors: fileErrors });
  }

  return fileErrors.length === 0;
}

/**
 * Get line number from character index
 */
function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

/**
 * Main
 */
function main() {
  console.log('🔗 Link Validation Report');
  console.log('='.repeat(50));
  console.log('');

  const files = findMarkdownFiles(DOCS_DIR);
  console.log(`Scanning ${files.length} markdown files...\n`);

  let passed = 0;
  let failed = 0;

  for (const file of files) {
    if (validateFile(file)) {
      passed++;
    } else {
      failed++;
    }
  }

  // Report
  console.log('='.repeat(50));
  console.log('');

  if (errors.length === 0) {
    console.log(`✅ All ${checked} links validated successfully!`);
    console.log(`   ${passed} files checked`);
    process.exit(0);
  }

  console.log(`❌ Found ${errors.reduce((sum, e) => sum + e.errors.length, 0)} broken link(s) in ${failed} file(s):\n`);

  for (const { file, errors: fileErrors } of errors) {
    console.log(`  ${file}:`);
    for (const err of fileErrors) {
      console.log(`    Line ${err.line}: [${err.text}](${err.link})`);
    }
    console.log('');
  }

  process.exit(1);
}

main();
