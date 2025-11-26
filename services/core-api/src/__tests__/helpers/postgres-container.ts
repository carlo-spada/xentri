/**
 * PostgreSQL Test Container Helper
 *
 * Provides isolated Postgres instances for integration tests.
 * Each test suite gets a fresh database with migrations applied.
 *
 * Usage:
 *   import { setupPostgres, teardownPostgres, getTestPrismaClient } from './helpers/postgres-container';
 *
 *   beforeAll(async () => {
 *     await setupPostgres();
 *   });
 *
 *   afterAll(async () => {
 *     await teardownPostgres();
 *   });
 *
 *   it('should query database', async () => {
 *     const prisma = getTestPrismaClient();
 *     // ... test code
 *   });
 */

import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { execSync } from 'child_process';

const { Pool } = pg;

let container: StartedPostgreSqlContainer | null = null;
let prisma: PrismaClient | null = null;
let pool: pg.Pool | null = null;

/**
 * Starts a PostgreSQL container and runs migrations.
 * Call this in beforeAll().
 */
export async function setupPostgres(): Promise<string> {
  container = await new PostgreSqlContainer('postgres:16.11')
    .withDatabase('xentri_test')
    .withUsername('test')
    .withPassword('test')
    .withCommand([
      'postgres',
      '-c', 'row_security=on',
      '-c', 'log_statement=none',
    ])
    .start();

  const connectionString = container.getConnectionUri();

  // Run migrations
  execSync('npx prisma migrate deploy', {
    env: {
      ...process.env,
      DATABASE_URL: connectionString,
    },
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  // Create Prisma client with pg adapter (Prisma 7.0+)
  pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({ adapter });

  await prisma.$connect();

  return connectionString;
}

/**
 * Tears down the PostgreSQL container.
 * Call this in afterAll().
 */
export async function teardownPostgres(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }

  if (pool) {
    await pool.end();
    pool = null;
  }

  if (container) {
    await container.stop();
    container = null;
  }
}

/**
 * Returns the test Prisma client.
 * Only valid after setupPostgres() has been called.
 */
export function getTestPrismaClient(): PrismaClient {
  if (!prisma) {
    throw new Error('Postgres container not initialized. Call setupPostgres() first.');
  }
  return prisma;
}

/**
 * Sets the org context for RLS queries.
 */
export async function setOrgContext(orgId: string): Promise<void> {
  const client = getTestPrismaClient();
  await client.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, true)`;
}

/**
 * Clears the org context.
 */
export async function clearOrgContext(): Promise<void> {
  const client = getTestPrismaClient();
  await client.$executeRaw`SELECT set_config('app.current_org_id', '', true)`;
}
