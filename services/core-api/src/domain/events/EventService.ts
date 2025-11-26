import { randomUUID } from 'crypto';
import type { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import {
  CreateEventSchema,
  type CreateEventInput,
  type SystemEvent,
  type EventType,
  type EventAckResponse,
  type EventListMeta,
} from '@xentri/ts-schema';
import { getPrisma, setOrgContext } from '../../infra/db.js';

// ===================
// Types
// ===================

export interface ListEventsOptions {
  type?: EventType;
  since?: Date;
  limit?: number;
  cursor?: string;
}

export interface ListEventsResult {
  data: SystemEvent[];
  meta: EventListMeta;
}

// ===================
// EventService
// ===================

export class EventService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || getPrisma();
  }

  /**
   * Creates a new system event.
   *
   * AC6: POST /api/v1/events accepts SystemEvent payloads, validates via Zod schema,
   * and returns {event_id, acknowledged: true}
   *
   * @param input - Event creation input (validated via Zod)
   * @param orgId - Organization ID for RLS context
   * @returns Event acknowledgment with event_id
   */
  async createEvent(
    input: CreateEventInput,
    orgId: string
  ): Promise<EventAckResponse> {
    // Validate input with Zod
    const validated = CreateEventSchema.parse(input);

    // Generate ID and dedupe_key if not provided
    const eventId = randomUUID();
    const dedupeKey =
      validated.dedupe_key ||
      `${validated.type}:${validated.org_id}:${Date.now()}`;
    const occurredAt = validated.occurred_at
      ? new Date(validated.occurred_at)
      : new Date();

    // Execute in transaction with RLS context
    await this.prisma.$transaction(async (tx) => {
      // Set org context for RLS
      await tx.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, true)`;

      // Insert event (using raw SQL to match column names exactly)
      await tx.$executeRaw`
        INSERT INTO system_events (
          id,
          event_type,
          occurred_at,
          created_at,
          org_id,
          user_id,
          actor_type,
          actor_id,
          payload_schema,
          payload,
          meta,
          dedupe_key,
          correlation_id,
          trace_id,
          source,
          envelope_version
        ) VALUES (
          ${eventId}::uuid,
          ${validated.type},
          ${occurredAt},
          NOW(),
          ${validated.org_id}::uuid,
          ${validated.user_id || null}::uuid,
          ${validated.actor.type},
          ${validated.actor.id},
          ${validated.payload_schema},
          ${JSON.stringify(validated.payload)}::jsonb,
          ${validated.meta ? JSON.stringify(validated.meta) : null}::jsonb,
          ${dedupeKey},
          ${validated.correlation_id || null},
          ${validated.trace_id || null},
          ${validated.source},
          ${validated.envelope_version}
        )
      `;
    });

    return {
      event_id: eventId,
      acknowledged: true,
    };
  }

  /**
   * Lists events for an organization with filtering and pagination.
   *
   * AC7: GET /api/v1/events returns org-scoped events with query params:
   * ?type=, ?since=, ?limit=; supports cursor-based pagination
   *
   * @param orgId - Organization ID for RLS context
   * @param options - Filtering and pagination options
   * @returns Paginated list of events
   */
  async listEvents(
    orgId: string,
    options: ListEventsOptions = {}
  ): Promise<ListEventsResult> {
    const { type, since, limit = 20, cursor } = options;

    // Decode cursor (base64 encoded timestamp:id)
    let cursorTimestamp: Date | null = null;
    let cursorId: string | null = null;
    if (cursor) {
      try {
        const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
        const [ts, id] = decoded.split(':');
        cursorTimestamp = new Date(ts);
        cursorId = id;
      } catch {
        // Invalid cursor, ignore
      }
    }

    // Fetch one extra to determine has_more
    const fetchLimit = Math.min(limit, 100) + 1;

    // Build dynamic SQL fragments using Prisma.sql
    const whereConditions: Prisma.Sql[] = [Prisma.sql`1=1`];

    if (type) {
      whereConditions.push(Prisma.sql`AND event_type = ${type}`);
    }

    if (since) {
      whereConditions.push(Prisma.sql`AND occurred_at >= ${since}`);
    }

    if (cursorTimestamp && cursorId) {
      whereConditions.push(
        Prisma.sql`AND (occurred_at, id) < (${cursorTimestamp}, ${cursorId}::uuid)`
      );
    }

    const whereClause = Prisma.join(whereConditions, ' ');

    // Build and execute query
    const events = await this.prisma.$transaction(async (tx) => {
      // Set org context for RLS
      await tx.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, true)`;

      // Execute parameterized query with proper SQL fragments
      const rows = await tx.$queryRaw<Array<{
        id: string;
        event_type: string;
        occurred_at: Date;
        created_at: Date;
        org_id: string;
        user_id: string | null;
        actor_type: string;
        actor_id: string;
        payload_schema: string;
        payload: Record<string, unknown>;
        meta: Record<string, unknown> | null;
        dedupe_key: string | null;
        correlation_id: string | null;
        trace_id: string | null;
        source: string;
        envelope_version: string;
      }>>`
        SELECT
          id::text,
          event_type,
          occurred_at,
          created_at,
          org_id::text,
          user_id::text,
          actor_type,
          actor_id,
          payload_schema,
          payload,
          meta,
          dedupe_key,
          correlation_id,
          trace_id,
          source,
          envelope_version
        FROM system_events
        WHERE ${whereClause}
        ORDER BY occurred_at DESC, id DESC
        LIMIT ${fetchLimit}
      `;

      return rows;
    });

    // Determine if there are more results
    const hasMore = events.length > limit;
    const data = hasMore ? events.slice(0, limit) : events;

    // Generate next cursor from last item
    let nextCursor: string | undefined;
    if (hasMore && data.length > 0) {
      const lastEvent = data[data.length - 1];
      const cursorData = `${lastEvent.occurred_at.toISOString()}:${lastEvent.id}`;
      nextCursor = Buffer.from(cursorData).toString('base64');
    }

    // Transform to SystemEvent format
    const transformedData: SystemEvent[] = data.map((row) => ({
      id: row.id,
      type: row.event_type as EventType,
      occurred_at: row.occurred_at.toISOString(),
      created_at: row.created_at.toISOString(),
      org_id: row.org_id,
      user_id: row.user_id,
      actor: {
        type: row.actor_type as 'user' | 'system' | 'job',
        id: row.actor_id,
      },
      payload_schema: row.payload_schema,
      payload: row.payload,
      meta: row.meta
        ? {
            source: (row.meta as Record<string, unknown>).source as string,
            ...(row.meta as Record<string, unknown>),
          }
        : undefined,
      dedupe_key: row.dedupe_key || undefined,
      correlation_id: row.correlation_id || undefined,
      trace_id: row.trace_id || undefined,
      source: row.source,
      envelope_version: '1.0' as const,
    }));

    return {
      data: transformedData,
      meta: {
        cursor: nextCursor,
        has_more: hasMore,
      },
    };
  }
}

// Export singleton instance
export const eventService = new EventService();
