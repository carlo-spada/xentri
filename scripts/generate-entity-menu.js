#!/usr/bin/env node
/**
 * generate-entity-menu.js
 *
 * Generates a lightweight entity-menu.yaml from the full docs/manifest.yaml
 * This reduces context consumption in BMM workflows from ~787 lines to ~90 lines.
 *
 * Usage: node scripts/generate-entity-menu.js
 *
 * Output: .bmad/bmm/data/entity-menu.yaml
 */

const fs = require('fs');
const path = require('path');

// Paths
const PROJECT_ROOT = path.dirname(__dirname);
const MANIFEST_PATH = path.join(PROJECT_ROOT, 'docs', 'manifest.yaml');
const OUTPUT_PATH = path.join(PROJECT_ROOT, '.bmad', 'bmm', 'data', 'entity-menu.yaml');

// Module name formatting (handles acronyms)
const ACRONYMS = ['ui', 'api', 'ts', 'id', 'db', 'sql', 'html', 'css', 'js'];
function formatModuleName(key) {
  return key.split('-').map(word => {
    if (ACRONYMS.includes(word.toLowerCase())) {
      return word.toUpperCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

// Simple YAML parser for our specific structure
// (Avoids adding js-yaml dependency for this single script)
function parseManifestSection(content, sectionName) {
  const lines = content.split('\n');
  const results = [];
  let inSection = false;
  let currentItem = null;
  let baseIndent = 0;

  for (const line of lines) {
    // Detect section start
    if (line.match(new RegExp(`^${sectionName}:`))) {
      inSection = true;
      continue;
    }

    // Detect section end (new top-level key)
    if (inSection && line.match(/^[a-z_]+:/) && !line.startsWith(' ')) {
      break;
    }

    if (!inSection) continue;

    // Parse items within section
    const nameMatch = line.match(/^\s+- name:\s*(.+)/);
    const keyMatch = line.match(/^\s+([a-z_-]+):/);
    const valueMatch = line.match(/^\s+(\w+):\s*"?([^"]+)"?/);

    if (nameMatch) {
      if (currentItem) results.push(currentItem);
      currentItem = { name: nameMatch[1].trim() };
    } else if (currentItem && valueMatch) {
      const [, key, value] = valueMatch;
      if (['purpose', 'location', 'status', 'codename', 'entity_type'].includes(key)) {
        currentItem[key] = value.trim().replace(/^["']|["']$/g, '');
      }
    }
  }

  if (currentItem) results.push(currentItem);
  return results;
}

function parseCategories(content) {
  const lines = content.split('\n');
  const categories = [];
  let inCategories = false;
  let currentCategory = null;
  let inSubcategories = false;
  let currentSubcategory = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start of categories section
    if (line === 'categories:') {
      inCategories = true;
      continue;
    }

    if (!inCategories) continue;

    // New top-level section ends categories
    if (line.match(/^[a-z_]+:/) && !line.startsWith(' ')) {
      break;
    }

    // Category key (e.g., "  strategy:")
    const categoryMatch = line.match(/^  ([a-z_]+):$/);
    if (categoryMatch) {
      if (currentCategory) categories.push(currentCategory);
      currentCategory = { key: categoryMatch[1], subcategories: [] };
      inSubcategories = false;
      currentSubcategory = null;
      continue;
    }

    // Category properties - ONLY at 4-space indent (direct children of category)
    if (currentCategory && line.match(/^    [a-z]/)) {
      const purposeMatch = line.match(/^    purpose:\s*"([^"]+)"/);
      const codenameMatch = line.match(/^    codename:\s*"([^"]+)"/);
      const locationMatch = line.match(/^    location:\s*"([^"]+)"/);

      if (purposeMatch && !currentCategory.purpose) currentCategory.purpose = purposeMatch[1];
      if (codenameMatch) currentCategory.codename = codenameMatch[1];
      if (locationMatch) currentCategory.location = locationMatch[1];

      // Start of subcategories section
      if (line === '    subcategories:') {
        inSubcategories = true;
      }
    }

    // Subcategory key (e.g., "      soul:")
    if (inSubcategories && currentCategory) {
      const subcatMatch = line.match(/^      ([a-z_-]+):$/);
      if (subcatMatch) {
        if (currentSubcategory) {
          currentCategory.subcategories.push(currentSubcategory);
        }
        currentSubcategory = { key: subcatMatch[1], category: currentCategory.key };
        continue;
      }

      // Subcategory properties - at 8-space indent
      if (currentSubcategory && line.match(/^        [a-z]/)) {
        const purposeMatch = line.match(/^        purpose:\s*"([^"]+)"/);
        const locationMatch = line.match(/^        location:\s*"([^"]+)"/);
        const statusMatch = line.match(/^        status:\s*(\w+)/);

        if (purposeMatch) currentSubcategory.purpose = purposeMatch[1];
        if (locationMatch) currentSubcategory.location = locationMatch[1];
        if (statusMatch) currentSubcategory.status = statusMatch[1];
      }
    }
  }

  // Push final items
  if (currentSubcategory && currentCategory) {
    currentCategory.subcategories.push(currentSubcategory);
  }
  if (currentCategory) categories.push(currentCategory);

  return categories;
}

function parsePlatformModules(content) {
  const lines = content.split('\n');
  const modules = [];
  let inPlatform = false;
  let inModules = false;
  let currentModule = null;

  for (const line of lines) {
    if (line === 'platform:') {
      inPlatform = true;
      continue;
    }

    if (inPlatform && line === '  modules:') {
      inModules = true;
      continue;
    }

    // End of platform section
    if (inPlatform && line.match(/^[a-z_]+:/) && !line.startsWith(' ')) {
      break;
    }

    if (!inModules) continue;

    // New module
    const nameMatch = line.match(/^\s+- name:\s*(.+)/);
    if (nameMatch) {
      if (currentModule) modules.push(currentModule);
      currentModule = { key: nameMatch[1].trim() };
      continue;
    }

    // Module properties
    if (currentModule) {
      const purposeMatch = line.match(/^\s+purpose:\s*"([^"]+)"/);
      const locationMatch = line.match(/^\s+location:\s*"([^"]+)"/);
      const statusMatch = line.match(/^\s+status:\s*(\w+)/);
      const packageMatch = line.match(/^\s+package:\s*"([^"]+)"/);

      if (purposeMatch) currentModule.purpose = purposeMatch[1];
      if (locationMatch) currentModule.location = locationMatch[1];
      if (statusMatch) currentModule.status = statusMatch[1];
      if (packageMatch) currentModule.package = packageMatch[1];
    }
  }

  if (currentModule) modules.push(currentModule);
  return modules;
}

function generateEntityMenu() {
  // Read manifest
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Error: Manifest not found at ${MANIFEST_PATH}`);
    process.exit(1);
  }

  const content = fs.readFileSync(MANIFEST_PATH, 'utf8');
  const today = new Date().toISOString().split('T')[0];

  // Parse sections
  const platformModules = parsePlatformModules(content);
  const categories = parseCategories(content);

  // Filter active infrastructure modules
  const activeModules = platformModules.filter(m => m.status === 'active');

  // Generate output
  let output = `# Entity Selection Menu
# Lightweight file for workflow entity selection UI (~90 lines vs ~787 in manifest.yaml)
# AUTO-GENERATED - Do not edit manually!
# Regenerate with: node scripts/generate-entity-menu.js

version: "1.0"
generated_from: "docs/manifest.yaml"
last_updated: "${today}"

# Constitution (System-Wide)
constitution:
  name: "Constitution"
  description: "System-wide rules (PR-xxx, IC-xxx)"
  path: "docs/platform/"
  documents: [prd.md, architecture.md, ux-design.md, epics.md, product-brief.md]

# Infrastructure Modules (Platform)
infrastructure:
`;

  for (const mod of activeModules) {
    const desc = mod.package ? `${mod.purpose} (${mod.package})` : mod.purpose;
    output += `  - key: ${mod.key}
    name: "${formatModuleName(mod.key)}"
    description: "${desc}"
    path: "${mod.location}"
    status: ${mod.status}

`;
  }

  output += `# Strategic Containers (Categories) & Coordination Units (Subcategories)
categories:
`;

  for (const cat of categories) {
    if (cat.key && cat.codename && cat.purpose) {
      // Extract short description (first sentence or phrase)
      const shortDesc = cat.purpose.split('.')[0].split(' - ')[0];
      output += `  - key: ${cat.key}
    name: "${cat.key.charAt(0).toUpperCase() + cat.key.slice(1)}"
    codename: "${cat.codename}"
    description: "${shortDesc}"
    path: "${cat.location || `docs/${cat.key}/`}"
`;

      // Add subcategories if present
      if (cat.subcategories && cat.subcategories.length > 0) {
        output += `    subcategories:\n`;
        for (const subcat of cat.subcategories) {
          if (subcat.key && subcat.purpose) {
            const subcatDesc = subcat.purpose.split('.')[0].split(' - ')[0];
            output += `      - key: ${subcat.key}
        name: "${formatModuleName(subcat.key)}"
        description: "${subcatDesc}"
        path: "${subcat.location || `docs/${cat.key}/${subcat.key}/`}"
`;
          }
        }
      }
      output += `\n`;
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output
  fs.writeFileSync(OUTPUT_PATH, output.trimEnd() + '\n');

  // Stats
  const manifestLines = content.split('\n').length;
  const outputLines = output.split('\n').length;
  const savings = Math.round((1 - outputLines / manifestLines) * 100);

  console.log(`\x1b[32m✓\x1b[0m Generated ${OUTPUT_PATH}`);
  console.log(`  Manifest: ${manifestLines} lines`);
  console.log(`  Output:   ${outputLines} lines`);
  console.log(`  Savings:  ${savings}% reduction`);
}

// Run
generateEntityMenu();
