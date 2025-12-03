/**
 * Sibling Dependency Law Validator
 *
 * Validates that all requirement files follow ADR-020:
 * - Single-parent inheritance (encoded in ID)
 * - Sibling-only dependencies
 * - Proper exception handling
 *
 * Usage:
 *   npx tsx scripts/validation/validate-dependencies.ts
 *   npx tsx scripts/validation/validate-dependencies.ts --path docs/strategy
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

// ============================================================================
// Types
// ============================================================================

interface InterfaceDependency {
  id: string;
  reason?: string;
  exception?: boolean;
  approved_by?: string;
  justification?: string;
}

interface InheritedInterface {
  id: string;
  inherited_from: string;
}

interface RequirementFile {
  id: string;
  type?: string;
  title?: string;
  parent?: string;
  ancestry?: string[];
  requires_interfaces?: InterfaceDependency[];
  inherited_interfaces?: InheritedInterface[];
  provides_interfaces?: string[];
}

interface InterfaceFile {
  id: string;
  provider: string;
  visibility?: string;
}

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// ID Parsing
// ============================================================================

/**
 * Parse a hierarchical requirement ID into its ancestry chain.
 *
 * Example: "SYS-002-STR-001-PUL-001" → ["SYS", "SYS-002", "SYS-002-STR-001", "SYS-002-STR-001-PUL-001"]
 */
function parseRequirementId(id: string): string[] {
  const parts = id.split('-');
  const ancestry: string[] = [];

  let current = '';
  for (let i = 0; i < parts.length; i++) {
    if (current) current += '-';
    current += parts[i];

    // Check if this is a complete segment (ends with a number or is the root)
    if (/^\d+$/.test(parts[i]) || (i === 0 && !/^\d+$/.test(parts[i]))) {
      ancestry.push(current);
    }
  }

  return ancestry;
}

/**
 * Get the immediate parent from a requirement ID.
 */
function getParentId(id: string): string | null {
  const ancestry = parseRequirementId(id);
  if (ancestry.length <= 1) return null;
  return ancestry[ancestry.length - 2];
}

/**
 * Check if two IDs share the same parent (are siblings).
 */
function areSiblings(id1: string, id2: string): boolean {
  const parent1 = getParentId(id1);
  const parent2 = getParentId(id2);

  // Root-level items are siblings of each other
  if (parent1 === null && parent2 === null) {
    // Both are root level - check if they share the same root prefix
    const root1 = id1.split('-')[0];
    const root2 = id2.split('-')[0];
    return root1 === root2;
  }

  return parent1 === parent2;
}

// ============================================================================
// File Loading
// ============================================================================

/**
 * Find all requirement YAML files in a directory.
 */
function findRequirementFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recurse into subdirectories, but skip node_modules and hidden dirs
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...findRequirementFiles(fullPath));
      }
    } else if (entry.isFile()) {
      // Match requirement files: *.requirement.yaml, requirements/*.yaml
      if (
        entry.name.endsWith('.requirement.yaml') ||
        entry.name.endsWith('.requirement.yml') ||
        (dir.includes('requirements') && (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')))
      ) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Find all interface YAML files in a directory.
 */
function findInterfaceFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...findInterfaceFiles(fullPath));
      }
    } else if (entry.isFile()) {
      if (
        entry.name.endsWith('.interface.yaml') ||
        entry.name.endsWith('.interface.yml') ||
        (dir.includes('interfaces') && (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')))
      ) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Load a YAML file and parse it.
 */
function loadYamlFile<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return yaml.parse(content) as T;
  } catch (error) {
    console.error(`Failed to parse ${filePath}:`, error);
    return null;
  }
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Build a map of interface ID to provider ID.
 */
function buildInterfaceMap(interfaceFiles: string[]): Map<string, string> {
  const map = new Map<string, string>();

  for (const file of interfaceFiles) {
    const iface = loadYamlFile<InterfaceFile>(file);
    if (iface?.id && iface?.provider) {
      map.set(iface.id, iface.provider);
    }
  }

  return map;
}

/**
 * Build a map of requirement ID to its declared sibling dependencies.
 */
function buildDependencyMap(requirementFiles: string[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();

  for (const file of requirementFiles) {
    const req = loadYamlFile<RequirementFile>(file);
    if (req?.id && req?.requires_interfaces) {
      const deps = new Set<string>();
      for (const dep of req.requires_interfaces) {
        if (!dep.exception) {
          deps.add(dep.id);
        }
      }
      map.set(req.id, deps);
    }
  }

  return map;
}

/**
 * Get all interface access for a requirement (direct + inherited from ancestors).
 */
function getAccessibleInterfaces(
  requirementId: string,
  dependencyMap: Map<string, Set<string>>
): Set<string> {
  const accessible = new Set<string>();
  const ancestry = parseRequirementId(requirementId);

  for (const ancestorId of ancestry) {
    const deps = dependencyMap.get(ancestorId);
    if (deps) {
      for (const dep of deps) {
        accessible.add(dep);
      }
    }
  }

  return accessible;
}

/**
 * Validate a single requirement file.
 */
function validateRequirement(
  filePath: string,
  interfaceMap: Map<string, string>,
  dependencyMap: Map<string, Set<string>>
): ValidationResult {
  const result: ValidationResult = {
    file: filePath,
    valid: true,
    errors: [],
    warnings: [],
  };

  const req = loadYamlFile<RequirementFile>(filePath);

  if (!req) {
    result.valid = false;
    result.errors.push('Failed to parse YAML file');
    return result;
  }

  if (!req.id) {
    result.valid = false;
    result.errors.push('Missing required field: id');
    return result;
  }

  const myParent = getParentId(req.id);

  // Validate requires_interfaces
  if (req.requires_interfaces) {
    for (const dep of req.requires_interfaces) {
      // Check if this is an exception
      if (dep.exception) {
        if (!dep.approved_by) {
          result.warnings.push(
            `Exception dependency ${dep.id} should have 'approved_by' field referencing an ADR`
          );
        }
        if (!dep.justification) {
          result.warnings.push(
            `Exception dependency ${dep.id} should have 'justification' field`
          );
        }
        continue; // Skip sibling validation for exceptions
      }

      // Get the provider of this interface
      const providerId = interfaceMap.get(dep.id);

      if (!providerId) {
        result.warnings.push(
          `Interface ${dep.id} not found in interface registry (may not be defined yet)`
        );
        continue;
      }

      // Check if provider is a sibling
      const providerParent = getParentId(providerId);

      if (myParent !== providerParent) {
        result.valid = false;
        result.errors.push(
          `SIBLING LAW VIOLATION: ${req.id} cannot depend on ${dep.id}. ` +
          `Provider ${providerId} has parent ${providerParent || 'ROOT'}, ` +
          `but ${req.id} has parent ${myParent || 'ROOT'}. ` +
          `Either declare this dependency at a common ancestor, or add an exception with 'approved_by' ADR.`
        );
      }
    }
  }

  // Validate that inherited_interfaces match what ancestors actually declared
  if (req.inherited_interfaces) {
    const accessibleFromAncestors = getAccessibleInterfaces(req.id, dependencyMap);

    for (const inherited of req.inherited_interfaces) {
      if (!accessibleFromAncestors.has(inherited.id)) {
        result.warnings.push(
          `Inherited interface ${inherited.id} (from ${inherited.inherited_from}) ` +
          `not found in ancestor dependency declarations. Verify the ancestor has this dependency.`
        );
      }
    }
  }

  return result;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  let searchPath = process.cwd();

  // Parse --path argument
  const pathIndex = args.indexOf('--path');
  if (pathIndex !== -1 && args[pathIndex + 1]) {
    searchPath = path.resolve(args[pathIndex + 1]);
  }

  console.log(`\n🔍 Validating dependencies in: ${searchPath}\n`);

  // Find all files
  const requirementFiles = findRequirementFiles(searchPath);
  const interfaceFiles = findInterfaceFiles(searchPath);

  console.log(`Found ${requirementFiles.length} requirement files`);
  console.log(`Found ${interfaceFiles.length} interface files\n`);

  if (requirementFiles.length === 0) {
    console.log('No requirement files found. Nothing to validate.');
    console.log('\nExpected file patterns:');
    console.log('  - *.requirement.yaml');
    console.log('  - requirements/*.yaml');
    process.exit(0);
  }

  // Build maps
  const interfaceMap = buildInterfaceMap(interfaceFiles);
  const dependencyMap = buildDependencyMap(requirementFiles);

  // Validate each file
  const results: ValidationResult[] = [];
  let hasErrors = false;

  for (const file of requirementFiles) {
    const result = validateRequirement(file, interfaceMap, dependencyMap);
    results.push(result);

    if (!result.valid) {
      hasErrors = true;
    }
  }

  // Print results
  console.log('─'.repeat(80));
  console.log('VALIDATION RESULTS');
  console.log('─'.repeat(80));

  for (const result of results) {
    const relativePath = path.relative(process.cwd(), result.file);
    const status = result.valid ? '✅' : '❌';

    console.log(`\n${status} ${relativePath}`);

    for (const error of result.errors) {
      console.log(`   ❌ ERROR: ${error}`);
    }

    for (const warning of result.warnings) {
      console.log(`   ⚠️  WARNING: ${warning}`);
    }
  }

  console.log('\n' + '─'.repeat(80));

  const validCount = results.filter(r => r.valid).length;
  const warningCount = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const errorCount = results.reduce((sum, r) => sum + r.errors.length, 0);

  console.log(`\nSUMMARY: ${validCount}/${results.length} files valid`);
  if (warningCount > 0) {
    console.log(`         ${warningCount} warnings`);
  }
  if (errorCount > 0) {
    console.log(`         ${errorCount} errors`);
  }

  if (hasErrors) {
    console.log('\n❌ Validation FAILED\n');
    process.exit(1);
  } else {
    console.log('\n✅ Validation PASSED\n');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Validation script failed:', error);
  process.exit(1);
});
