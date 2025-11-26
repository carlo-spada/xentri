import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

/**
 * Singleton Prisma client instance.
 * Use getPrisma() to get the client instance.
 */
let prisma: PrismaClient | null = null;
let pool: pg.Pool | null = null;

/**
 * Creates a PrismaClient with the pg adapter.
 * Required for Prisma 7.0+.
 */
export function createPrismaClient(connectionString?: string): PrismaClient {
  const dbUrl =
    connectionString ||
    process.env.DATABASE_URL ||
    'postgresql://xentri:xentri_dev@localhost:5432/xentri';

  const pgPool = new Pool({ connectionString: dbUrl });
  pool = pgPool;

  const adapter = new PrismaPg(pgPool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

export function getPrisma(): PrismaClient {
  if (!prisma) {
    prisma = createPrismaClient();
  }
  return prisma;
}

/**
 * Sets the org context for RLS.
 * Must be called at the start of every org-scoped transaction.
 * The `true` flag makes it transaction-scoped (fails closed on new connection).
 */
export async function setOrgContext(orgId: string): Promise<void> {
  const client = getPrisma();
  await client.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, true)`;
}

/**
 * Clears the org context.
 */
export async function clearOrgContext(): Promise<void> {
  const client = getPrisma();
  await client.$executeRaw`SELECT set_config('app.current_org_id', '', true)`;
}

/**
 * Disconnects the Prisma client.
 * Call this on server shutdown.
 */
export async function disconnectDb(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
  if (pool) {
    await pool.end();
    pool = null;
  }
}
