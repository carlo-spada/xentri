/**
 * Xentri Smoke Test
 *
 * Validates:
 * 1. Database RLS isolation (cross-org queries return 0 rows)
 * 2. Shell loads at localhost:4321
 *
 * Run: pnpm run test:smoke
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function log(message: string) {
  console.log(`[smoke] ${message}`);
}

function pass(name: string, message: string) {
  results.push({ name, passed: true, message });
  log(`✅ ${name}: ${message}`);
}

function fail(name: string, message: string) {
  results.push({ name, passed: false, message });
  log(`❌ ${name}: ${message}`);
}

async function setupTestOrgs() {
  log('Setting up test organizations...');

  // Create org_a
  const orgA = await prisma.$executeRaw`
    INSERT INTO organizations (id, name, slug)
    VALUES (
      'a0000000-0000-0000-0000-000000000001'::uuid,
      'Test Org A',
      'test-org-a'
    )
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
  `;

  // Create org_b
  const orgB = await prisma.$executeRaw`
    INSERT INTO organizations (id, name, slug)
    VALUES (
      'b0000000-0000-0000-0000-000000000002'::uuid,
      'Test Org B',
      'test-org-b'
    )
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
  `;

  // Create test users
  await prisma.$executeRaw`
    INSERT INTO users (id, email)
    VALUES (
      'u0000000-0000-0000-0000-000000000001'::uuid,
      'user-a@test.xentri.io'
    )
    ON CONFLICT (email) DO NOTHING
  `;

  await prisma.$executeRaw`
    INSERT INTO users (id, email)
    VALUES (
      'u0000000-0000-0000-0000-000000000002'::uuid,
      'user-b@test.xentri.io'
    )
    ON CONFLICT (email) DO NOTHING
  `;

  // Create memberships
  await prisma.$executeRaw`
    INSERT INTO members (org_id, user_id, role)
    VALUES (
      'a0000000-0000-0000-0000-000000000001'::uuid,
      'u0000000-0000-0000-0000-000000000001'::uuid,
      'owner'
    )
    ON CONFLICT (org_id, user_id) DO NOTHING
  `;

  await prisma.$executeRaw`
    INSERT INTO members (org_id, user_id, role)
    VALUES (
      'b0000000-0000-0000-0000-000000000002'::uuid,
      'u0000000-0000-0000-0000-000000000002'::uuid,
      'owner'
    )
    ON CONFLICT (org_id, user_id) DO NOTHING
  `;

  // Insert test events for each org (using event_type per Story 1.2)
  await prisma.$executeRaw`
    INSERT INTO system_events (org_id, event_type, actor_type, actor_id, payload_schema, payload, source)
    VALUES (
      'a0000000-0000-0000-0000-000000000001'::uuid,
      'xentri.test.created.v1',
      'system',
      'smoke-test',
      'test.created@1.0',
      '{"test": "org_a_data"}'::jsonb,
      'smoke-test'
    )
  `;

  await prisma.$executeRaw`
    INSERT INTO system_events (org_id, event_type, actor_type, actor_id, payload_schema, payload, source)
    VALUES (
      'b0000000-0000-0000-0000-000000000002'::uuid,
      'xentri.test.created.v1',
      'system',
      'smoke-test',
      'test.created@1.0',
      '{"test": "org_b_data"}'::jsonb,
      'smoke-test'
    )
  `;

  log('Test organizations created.');
}

async function testRlsIsolation() {
  log('Testing RLS isolation...');

  // Set context to org_a
  await prisma.$executeRaw`SELECT set_config('app.current_org_id', 'a0000000-0000-0000-0000-000000000001', true)`;

  // Query events - should only see org_a's events
  const orgAEvents = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count FROM system_events
  `;

  const orgACount = Number(orgAEvents[0].count);

  if (orgACount === 1) {
    pass('RLS: Org A context', `User A sees ${orgACount} event(s) (expected: 1)`);
  } else {
    fail('RLS: Org A context', `User A sees ${orgACount} event(s) (expected: 1)`);
  }

  // Query members - should only see org_a's members
  const orgAMembers = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count FROM members
  `;

  const orgAMemberCount = Number(orgAMembers[0].count);

  if (orgAMemberCount === 1) {
    pass('RLS: Members isolation', `Org A sees ${orgAMemberCount} member(s) (expected: 1)`);
  } else {
    fail('RLS: Members isolation', `Org A sees ${orgAMemberCount} member(s) (expected: 1)`);
  }

  // Critical test: Can org_a see org_b's events?
  // Set context to org_a but try to query org_b's data directly
  const crossOrgQuery = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count FROM system_events
    WHERE org_id = 'b0000000-0000-0000-0000-000000000002'::uuid
  `;

  const crossOrgCount = Number(crossOrgQuery[0].count);

  if (crossOrgCount === 0) {
    pass('RLS: Cross-org isolation', `Org A cannot see Org B events (${crossOrgCount} rows)`);
  } else {
    fail('RLS: Cross-org isolation', `SECURITY VIOLATION: Org A can see ${crossOrgCount} Org B events!`);
  }

  // Test with no context set (fail-closed)
  await prisma.$executeRaw`SELECT set_config('app.current_org_id', '', true)`;

  const noContextQuery = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count FROM system_events
  `;

  const noContextCount = Number(noContextQuery[0].count);

  if (noContextCount === 0) {
    pass('RLS: Fail-closed', `No context returns ${noContextCount} rows (expected: 0)`);
  } else {
    fail('RLS: Fail-closed', `SECURITY VIOLATION: No context returns ${noContextCount} rows!`);
  }
}

async function testEventImmutability() {
  log('Testing event immutability (AC3)...');

  // Set context to org_a for testing
  await prisma.$executeRaw`SELECT set_config('app.current_org_id', 'a0000000-0000-0000-0000-000000000001', true)`;

  // Test UPDATE is blocked (trigger should raise exception)
  try {
    await prisma.$executeRaw`
      UPDATE system_events
      SET payload = '{"modified": true}'::jsonb
      WHERE actor_id = 'smoke-test'
    `;
    fail('Immutability: UPDATE blocked', 'UPDATE should have raised an exception');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('immutable') || errorMessage.includes('UPDATE operations are not allowed')) {
      pass('Immutability: UPDATE blocked', 'UPDATE correctly raises exception');
    } else {
      fail('Immutability: UPDATE blocked', `Unexpected error: ${errorMessage}`);
    }
  }

  // Test DELETE does nothing (rule converts to no-op)
  const beforeDelete = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count FROM system_events WHERE actor_id = 'smoke-test'
  `;

  await prisma.$executeRaw`
    DELETE FROM system_events WHERE actor_id = 'smoke-test'
  `;

  const afterDelete = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count FROM system_events WHERE actor_id = 'smoke-test'
  `;

  const beforeCount = Number(beforeDelete[0].count);
  const afterCount = Number(afterDelete[0].count);

  if (beforeCount === afterCount && afterCount > 0) {
    pass('Immutability: DELETE blocked', `DELETE silently ignored (${beforeCount} rows unchanged)`);
  } else if (afterCount === 0) {
    fail('Immutability: DELETE blocked', 'DELETE should be blocked but rows were deleted');
  } else {
    fail('Immutability: DELETE blocked', `Unexpected: before=${beforeCount}, after=${afterCount}`);
  }
}

async function testShellLoads() {
  log('Testing shell loads...');

  const shellUrl = process.env.SHELL_URL || 'http://localhost:4321';

  try {
    const response = await fetch(shellUrl);

    if (response.ok) {
      pass('Shell: HTTP Response', `Shell returned HTTP ${response.status}`);

      const html = await response.text();
      if (html.includes('Xentri')) {
        pass('Shell: Content', 'Shell HTML contains "Xentri"');
      } else {
        fail('Shell: Content', 'Shell HTML does not contain "Xentri"');
      }
    } else {
      fail('Shell: HTTP Response', `Shell returned HTTP ${response.status}`);
    }
  } catch (error) {
    // In CI without shell running, this is expected
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (process.env.CI) {
      log(`⚠️ Shell: Skipped in CI (${errorMessage})`);
    } else {
      fail('Shell: Connection', `Failed to connect to shell: ${errorMessage}`);
    }
  }
}

async function cleanup() {
  log('Cleaning up test data...');

  // Note: system_events has immutability constraints (DELETE rule does nothing)
  // Use TRUNCATE which bypasses rules, or drop/recreate for full cleanup
  // For smoke tests, we leave events in place (they're isolated by RLS anyway)

  // Delete test memberships (not immutable)
  await prisma.$executeRaw`
    DELETE FROM members
    WHERE org_id IN (
      'a0000000-0000-0000-0000-000000000001'::uuid,
      'b0000000-0000-0000-0000-000000000002'::uuid
    )
  `;

  // Delete test users
  await prisma.$executeRaw`
    DELETE FROM users
    WHERE email LIKE '%@test.xentri.io'
  `;

  // Delete test organizations (cascades won't delete events due to immutability)
  await prisma.$executeRaw`
    DELETE FROM organizations
    WHERE slug IN ('test-org-a', 'test-org-b')
  `;

  // For test environments, truncate system_events to clean up
  // This bypasses the immutability rule (only works for superuser/table owner)
  try {
    await prisma.$executeRaw`TRUNCATE system_events RESTART IDENTITY CASCADE`;
    log('Events truncated for test cleanup.');
  } catch {
    log('Note: Could not truncate system_events (expected in production).');
  }

  log('Cleanup complete.');
}

async function main() {
  console.log('\n========================================');
  console.log('       XENTRI SMOKE TEST');
  console.log('========================================\n');

  try {
    // Connect to database
    await prisma.$connect();
    pass('Database', 'Connected to PostgreSQL');

    // Setup test data
    await setupTestOrgs();

    // Run tests
    await testRlsIsolation();
    await testEventImmutability();
    await testShellLoads();

    // Cleanup
    await cleanup();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    fail('Smoke Test', `Fatal error: ${errorMessage}`);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }

  // Summary
  console.log('\n========================================');
  console.log('       TEST SUMMARY');
  console.log('========================================\n');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}\n`);

  if (failed > 0) {
    console.log('Failed tests:');
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  - ${r.name}: ${r.message}`);
      });
    console.log('');
    process.exit(1);
  }

  console.log('All smoke tests passed! 🎉\n');
  process.exit(0);
}

main();
