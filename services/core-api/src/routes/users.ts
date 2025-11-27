import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { clerkAuthMiddleware, requireOrgContext, getClerkUser } from '../middleware/clerkAuth.js';
import { getPrisma } from '../infra/db.js';
import { problemDetails } from '../middleware/orgContext.js';
import {
  UpdateUserPreferencesRequestSchema,
  type UserPreferences,
} from '@xentri/ts-schema';

// ===================
// Types
// ===================

interface UserMeResponse {
  user: {
    id: string;
    email: string;
    email_verified: boolean;
    created_at: string;
  };
  organization?: {
    id: string;
    name: string;
    slug: string;
    role: string;
  };
  preferences?: {
    theme: string;
    email_notifications?: Record<string, boolean>;
  };
}

// ===================
// Route Registration
// ===================

export default async function usersRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * GET /api/v1/users/me
   *
   * Returns the current authenticated user and their active organization.
   * Requires valid Clerk session.
   *
   * Response:
   * - 200: User and org details
   * - 401: Not authenticated
   */
  fastify.get(
    '/api/v1/users/me',
    {
      preHandler: [clerkAuthMiddleware],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const prisma = getPrisma();

      // Get user from local database
      const user = await prisma.user.findUnique({
        where: { id: request.clerkUserId },
      });

      if (!user) {
        // User exists in Clerk but not synced to local DB yet
        // This can happen if webhook hasn't processed yet
        // Fetch from Clerk and return basic info
        try {
          const clerkUser = await getClerkUser(request.clerkUserId!);
          const primaryEmail = clerkUser.emailAddresses.find(
            (e) => e.id === clerkUser.primaryEmailAddressId
          );

          const response: UserMeResponse = {
            user: {
              id: clerkUser.id,
              email: primaryEmail?.emailAddress || '',
              email_verified: primaryEmail?.verification?.status === 'verified',
              created_at: new Date(clerkUser.createdAt).toISOString(),
            },
          };

          // Add org context if available
          if (request.clerkOrgId) {
            const org = await prisma.organization.findUnique({
              where: { id: request.clerkOrgId },
            });

            if (org) {
              response.organization = {
                id: org.id,
                name: org.name,
                slug: org.slug,
                role: request.clerkOrgRole || 'org:member',
              };
            }
          }

          return reply.status(200).send(response);
        } catch (err) {
          fastify.log.error({ err }, 'Failed to fetch user from Clerk');
          return reply
            .status(500)
            .header('content-type', 'application/problem+json')
            .send(
              problemDetails(
                500,
                'Internal Server Error',
                'Failed to retrieve user information',
                request.id
              )
            );
        }
      }

      // Build response from local database
      const response: UserMeResponse = {
        user: {
          id: user.id,
          email: user.email,
          email_verified: user.emailVerified,
          created_at: user.createdAt.toISOString(),
        },
      };

      // Add org context if available
      if (request.clerkOrgId) {
        const org = await prisma.organization.findUnique({
          where: { id: request.clerkOrgId },
        });

        if (org) {
          response.organization = {
            id: org.id,
            name: org.name,
            slug: org.slug,
            role: request.clerkOrgRole || 'org:member',
          };
        }
      }

      // Add user preferences if available
      const preferences = await prisma.userPreferences.findUnique({
        where: { userId: user.id },
      });

      if (preferences) {
        response.preferences = {
          theme: preferences.theme,
          email_notifications: preferences.emailNotifications as Record<string, boolean>,
        };
      } else {
        // Return defaults if no preferences exist
        response.preferences = {
          theme: 'dark',
          email_notifications: { lead_created: true, system: true },
        };
      }

      return reply.status(200).send(response);
    }
  );

  /**
   * GET /api/v1/users/me/organizations
   *
   * Returns all organizations the current user is a member of.
   * Requires valid Clerk session.
   */
  fastify.get(
    '/api/v1/users/me/organizations',
    {
      preHandler: [clerkAuthMiddleware],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const prisma = getPrisma();

      const memberships = await prisma.member.findMany({
        where: { userId: request.clerkUserId },
        include: {
          organization: true,
        },
      });

      const organizations = memberships.map((m) => ({
        id: m.organization.id,
        name: m.organization.name,
        slug: m.organization.slug,
        role: m.role,
        joined_at: m.createdAt.toISOString(),
      }));

      return reply.status(200).send({ organizations });
    }
  );

  /**
   * PATCH /api/v1/users/me/preferences
   *
   * Updates the current user's preferences (theme, notifications).
   * Creates preferences record if it doesn't exist (upsert).
   * Requires valid Clerk session.
   *
   * Request body:
   * - theme?: 'light' | 'dark' | 'system'
   * - email_notifications?: { lead_created?: boolean, system?: boolean }
   *
   * Response:
   * - 200: Updated preferences
   * - 400: Invalid request body
   * - 401: Not authenticated
   */
  fastify.patch(
    '/api/v1/users/me/preferences',
    {
      preHandler: [clerkAuthMiddleware],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const prisma = getPrisma();
      const userId = request.clerkUserId;

      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'Valid authentication required',
        });
      }

      // Validate request body
      const parseResult = UpdateUserPreferencesRequestSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Invalid request body',
          details: parseResult.error.errors,
        });
      }

      const { theme, email_notifications } = parseResult.data;

      // Build update data
      const updateData: {
        theme?: string;
        emailNotifications?: object;
      } = {};

      if (theme !== undefined) {
        updateData.theme = theme;
      }

      if (email_notifications !== undefined) {
        updateData.emailNotifications = email_notifications;
      }

      // Upsert preferences
      const preferences = await prisma.userPreferences.upsert({
        where: { userId },
        create: {
          userId,
          theme: theme || 'dark',
          emailNotifications: email_notifications || { lead_created: true, system: true },
        },
        update: updateData,
      });

      return reply.status(200).send({
        preferences: {
          theme: preferences.theme,
          email_notifications: preferences.emailNotifications as Record<string, boolean>,
        },
      });
    }
  );

  /**
   * GET /api/v1/users/me/preferences
   *
   * Returns the current user's preferences.
   * Requires valid Clerk session.
   *
   * Response:
   * - 200: User preferences (or defaults if none exist)
   * - 401: Not authenticated
   */
  fastify.get(
    '/api/v1/users/me/preferences',
    {
      preHandler: [clerkAuthMiddleware],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const prisma = getPrisma();
      const userId = request.clerkUserId;

      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'Valid authentication required',
        });
      }

      const preferences = await prisma.userPreferences.findUnique({
        where: { userId },
      });

      if (preferences) {
        return reply.status(200).send({
          preferences: {
            theme: preferences.theme,
            email_notifications: preferences.emailNotifications as Record<string, boolean>,
          },
        });
      }

      // Return defaults if no preferences exist
      return reply.status(200).send({
        preferences: {
          theme: 'dark',
          email_notifications: { lead_created: true, system: true },
        },
      });
    }
  );
}
