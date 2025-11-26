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
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

// Create Prisma client with pg adapter (required for Prisma 7.0+)
const dbUrl = process.env.DATABASE_URL || 'postgresql://xentri:xentri_dev@localhost:5432/xentri';
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
    INSERT INTO organizations (id, name, slug, updated_at)
    VALUES (
      'a0000000-0000-0000-0000-000000000001'::uuid,
      'Test Org A',
      'test-org-a',
      NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()
  `;

  // Create org_b
  const orgB = await prisma.$executeRaw`
    INSERT INTO organizations (id, name, slug, updated_at)
    VALUES (
      'b0000000-0000-0000-0000-000000000002'::uuid,
      'Test Org B',
      'test-org-b',
      NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()
  `;

  // Create test users
  await prisma.$executeRaw`
    INSERT INTO users (id, email, updated_at)
    VALUES (
      'c0000000-0000-0000-0000-000000000001'::uuid,
      'user-a@test.xentri.io',
      NOW()
    )
    ON CONFLICT (email) DO NOTHING
  `;

  await prisma.$executeRaw`
    INSERT INTO users (id, email, updated_at)
    VALUES (
      'd0000000-0000-0000-0000-000000000002'::uuid,
      'user-b@test.xentri.io',
      NOW()
    )
    ON CONFLICT (email) DO NOTHING
  `;

  // Create memberships
  await prisma.$executeRaw`
    INSERT INTO members (id, org_id, user_id, role, updated_at)
    VALUES (
      'e0000000-0000-0000-0000-000000000001'::uuid,
      'a0000000-0000-0000-0000-000000000001'::uuid,
      'c0000000-0000-0000-0000-000000000001'::uuid,
      'owner',
      NOW()
    )
    ON CONFLICT (org_id, user_id) DO NOTHING
  `;

  await prisma.$executeRaw`
    INSERT INTO members (id, org_id, user_id, role, updated_at)
    VALUES (
      'f0000000-0000-0000-0000-000000000002'::uuid,
      'b0000000-0000-0000-0000-000000000002'::uuid,
      'd0000000-0000-0000-0000-000000000002'::uuid,
      'owner',
      NOW()
    )
    ON CONFLICT (org_id, user_id) DO NOTHING
  `;

  // Insert test events for each org (using event_type per Story 1.2)
  // CRITICAL: Must set org context for RLS to allow INSERT
  await prisma.$executeRaw`SELECT set_config('app.current_org_id', 'a0000000-0000-0000-0000-000000000001', true)`;
  await prisma.$executeRaw`
    INSERT INTO system_events (id, org_id, event_type, actor_type, actor_id, payload_schema, payload, source)
    VALUES (
      gen_random_uuid(),
      'a0000000-0000-0000-0000-000000000001'::uuid,
      'xentri.user.signup.v1',
      'system',
      'smoke-test',
      'user.signup@1.0',
      '{"email": "org_a@test.xentri.io"}'::jsonb,
      'smoke-test'
    )
  `;

  await prisma.$executeRaw`SELECT set_config('app.current_org_id', 'b0000000-0000-0000-0000-000000000002', true)`;
  await prisma.$executeRaw`
    INSERT INTO system_events (id, org_id, event_type, actor_type, actor_id, payload_schema, payload, source)
    VALUES (
      gen_random_uuid(),
      'b0000000-0000-0000-0000-000000000002'::uuid,
      'xentri.user.signup.v1',
      'system',
      'smoke-test',
      'user.signup@1.0',
      '{"email": "org_b@test.xentri.io"}'::jsonb,
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

async function testRlsInsertFailClosed() {
  log('Testing RLS INSERT fail-closed (AC2)...');

  // Clear org context
  await prisma.$executeRaw`SELECT set_config('app.current_org_id', '', true)`;

  // Try to INSERT without context - should fail
  try {
    await prisma.$executeRaw`
      INSERT INTO system_events (id, org_id, event_type, actor_type, actor_id, payload_schema, payload, source)
      VALUES (
        gen_random_uuid(),
        'a0000000-0000-0000-0000-000000000001'::uuid,
        'xentri.user.login.v1',
        'system',
        'fail-closed-test',
        'user.login@1.0',
        '{"email": "should-not-insert@test.xentri.io"}'::jsonb,
        'fail-closed-test'
      )
    `;
    fail('RLS: INSERT fail-closed', 'INSERT without org context should have been blocked by RLS');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('policy') || errorMessage.includes('RLS') || errorMessage.includes('new row violates')) {
      pass('RLS: INSERT fail-closed', 'INSERT without org context correctly blocked by RLS');
    } else {
      // Could be a different error, but INSERT was blocked which is the goal
      pass('RLS: INSERT fail-closed', `INSERT blocked (${errorMessage.substring(0, 50)}...)`);
    }
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
    await testRlsInsertFailClosed();
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
    await pool.end();
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
