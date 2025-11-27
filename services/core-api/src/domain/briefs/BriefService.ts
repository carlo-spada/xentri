import { randomUUID } from 'crypto';
import type { PrismaClient } from '@prisma/client';
import { getPrisma } from '../../infra/db.js';
import {
  type Brief,
  type BriefSections,
  type BriefSectionStatusMap,
  type BriefCompletionStatus,
  type CreateBriefInput,
  type UpdateBriefInput,
  type BriefCreatedPayload,
  BriefSectionsSchema,
  BRIEF_SECTION_NAMES,
  determineSectionStatus,
  calculateCompletionStatus,
  getPopulatedSections,
} from '@xentri/ts-schema';

// ===================
// Types
// ===================

export interface CreateBriefParams {
  orgId: string;
  userId: string;
  input: CreateBriefInput;
}

export interface UpdateBriefParams {
  briefId: string;
  orgId: string;
  userId: string;
  input: UpdateBriefInput;
}

export interface GetBriefParams {
  briefId: string;
  orgId: string;
}

export interface GetCurrentBriefParams {
  orgId: string;
}

// ===================
// BriefService
// ===================

/**
 * BriefService - manages Universal Brief CRUD operations
 *
 * Responsible for:
 * - Creating new Briefs (AC1)
 * - Emitting xentri.brief.created.v1 event (AC2)
 * - Fetching Briefs with RLS enforcement (AC4)
 * - Updating Brief sections with status tracking
 */
export class BriefService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || getPrisma();
  }

  /**
   * Creates a new Brief for an organization.
   *
   * @param params - Organization, user, and Brief input
   * @returns Created Brief
   * @throws Error if event write fails (surfaced to user per AC6)
   */
  async createBrief(params: CreateBriefParams): Promise<Brief> {
    const { orgId, userId, input } = params;
    const briefId = randomUUID();
    const now = new Date();

    // Parse and validate sections
    const sections = BriefSectionsSchema.parse(input.sections || {});

    // Calculate section statuses
    const sectionStatus: BriefSectionStatusMap = {};
    for (const name of BRIEF_SECTION_NAMES) {
      sectionStatus[name] = determineSectionStatus(name, sections);
    }

    // Calculate overall completion status
    const completionStatus = calculateCompletionStatus(sectionStatus);

    // Get populated sections for event payload
    const sectionsPopulated = getPopulatedSections(sections);

    const result = await this.prisma.$transaction(async (tx) => {
      // Set org context for RLS
      await tx.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, true)`;

      // Create the Brief
      await tx.$executeRaw`
        INSERT INTO briefs (
          id,
          org_id,
          user_id,
          schema_version,
          sections,
          section_status,
          completion_status,
          created_at,
          updated_at
        ) VALUES (
          ${briefId},
          ${orgId},
          ${userId},
          ${input.schemaVersion || '1.0'},
          ${JSON.stringify(sections)}::jsonb,
          ${JSON.stringify(sectionStatus)}::jsonb,
          ${completionStatus},
          ${now},
          ${now}
        )
      `;

      // Emit brief.created event (AC2)
      const payload: BriefCreatedPayload = {
        brief_id: briefId,
        schema_version: input.schemaVersion || '1.0',
        completion_status: completionStatus,
        sections_populated: sectionsPopulated,
      };

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
          gen_random_uuid()::text,
          'xentri.brief.created.v1',
          ${now},
          NOW(),
          ${orgId},
          ${userId},
          'user',
          ${userId},
          'brief.created@1.0',
          ${JSON.stringify(payload)}::jsonb,
          NULL,
          ${`brief-created:${briefId}`},
          NULL,
          NULL,
          'brief-service',
          '1.0'
        )
        ON CONFLICT (dedupe_key) DO NOTHING
      `;

      return {
        id: briefId,
        orgId,
        userId,
        schemaVersion: input.schemaVersion || '1.0',
        sections,
        sectionStatus,
        completionStatus,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
    });

    return result;
  }

  /**
   * Gets a Brief by ID (RLS enforced).
   */
  async getBrief(params: GetBriefParams): Promise<Brief | null> {
    const { briefId, orgId } = params;

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, true)`;

      const rows = await tx.$queryRaw<
        Array<{
          id: string;
          org_id: string;
          user_id: string;
          schema_version: string;
          sections: BriefSections;
          section_status: BriefSectionStatusMap;
          completion_status: string;
          created_at: Date;
          updated_at: Date;
        }>
      >`
        SELECT
          id,
          org_id,
          user_id,
          schema_version,
          sections,
          section_status,
          completion_status,
          created_at,
          updated_at
        FROM briefs
        WHERE id = ${briefId}
        LIMIT 1
      `;

      return rows[0] || null;
    });

    if (!result) return null;

    return this.mapRowToBrief(result);
  }

  /**
   * Gets the current org's Brief (most recent).
   * Returns null if no Brief exists.
   */
  async getCurrentBrief(params: GetCurrentBriefParams): Promise<Brief | null> {
    const { orgId } = params;

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, true)`;

      const rows = await tx.$queryRaw<
        Array<{
          id: string;
          org_id: string;
          user_id: string;
          schema_version: string;
          sections: BriefSections;
          section_status: BriefSectionStatusMap;
          completion_status: string;
          created_at: Date;
          updated_at: Date;
        }>
      >`
        SELECT
          id,
          org_id,
          user_id,
          schema_version,
          sections,
          section_status,
          completion_status,
          created_at,
          updated_at
        FROM briefs
        ORDER BY created_at DESC
        LIMIT 1
      `;

      return rows[0] || null;
    });

    if (!result) return null;

    return this.mapRowToBrief(result);
  }

  /**
   * Updates a Brief's sections.
   * Recalculates section status and emits brief.updated event.
   */
  async updateBrief(params: UpdateBriefParams): Promise<Brief> {
    const { briefId, orgId, userId, input } = params;
    const now = new Date();

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, true)`;

      // Get current brief
      const currentRows = await tx.$queryRaw<
        Array<{
          id: string;
          org_id: string;
          user_id: string;
          schema_version: string;
          sections: BriefSections;
          section_status: BriefSectionStatusMap;
          completion_status: string;
          created_at: Date;
          updated_at: Date;
        }>
      >`
        SELECT * FROM briefs WHERE id = ${briefId} LIMIT 1
      `;

      const current = currentRows[0];
      if (!current) {
        throw new Error(`Brief not found: ${briefId}`);
      }

      // Merge sections
      const updatedSections = input.sections
        ? { ...current.sections, ...input.sections }
        : current.sections;

      // Recalculate section statuses
      const updatedSectionStatus: BriefSectionStatusMap = {};
      for (const name of BRIEF_SECTION_NAMES) {
        updatedSectionStatus[name] =
          input.sectionStatus?.[name] ||
          determineSectionStatus(name, updatedSections);
      }

      // Calculate completion status
      const updatedCompletionStatus =
        input.completionStatus || calculateCompletionStatus(updatedSectionStatus);

      // Determine which sections changed
      const sectionsChanged: string[] = [];
      if (input.sections) {
        for (const name of BRIEF_SECTION_NAMES) {
          if (
            JSON.stringify(current.sections[name]) !==
            JSON.stringify(updatedSections[name])
          ) {
            sectionsChanged.push(name);
          }
        }
      }

      // Update the Brief
      await tx.$executeRaw`
        UPDATE briefs
        SET
          sections = ${JSON.stringify(updatedSections)}::jsonb,
          section_status = ${JSON.stringify(updatedSectionStatus)}::jsonb,
          completion_status = ${updatedCompletionStatus},
          updated_at = ${now}
        WHERE id = ${briefId}
      `;

      // Emit brief.updated event
      if (sectionsChanged.length > 0) {
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
            gen_random_uuid()::text,
            'xentri.brief.updated.v1',
            ${now},
            NOW(),
            ${orgId},
            ${userId},
            'user',
            ${userId},
            'brief.updated@1.0',
            ${JSON.stringify({
              brief_id: briefId,
              sections_changed: sectionsChanged,
            })}::jsonb,
            NULL,
            ${`brief-updated:${briefId}:${now.getTime()}`},
            NULL,
            NULL,
            'brief-service',
            '1.0'
          )
        `;
      }

      return {
        id: briefId,
        orgId: current.org_id,
        userId: current.user_id,
        schemaVersion: current.schema_version,
        sections: updatedSections,
        sectionStatus: updatedSectionStatus,
        completionStatus: updatedCompletionStatus as BriefCompletionStatus,
        createdAt: current.created_at.toISOString(),
        updatedAt: now.toISOString(),
      };
    });

    return result;
  }

  private mapRowToBrief(row: {
    id: string;
    org_id: string;
    user_id: string;
    schema_version: string;
    sections: BriefSections;
    section_status: BriefSectionStatusMap;
    completion_status: string;
    created_at: Date;
    updated_at: Date;
  }): Brief {
    return {
      id: row.id,
      orgId: row.org_id,
      userId: row.user_id,
      schemaVersion: row.schema_version,
      sections: row.sections,
      sectionStatus: row.section_status,
      completionStatus: row.completion_status as BriefCompletionStatus,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }
}

// Export singleton instance
export const briefService = new BriefService();
