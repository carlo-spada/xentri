import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { clerkAuthMiddleware, requireOrgContext, getClerkUser } from '../middleware/clerkAuth.js';
import { getPrisma } from '../infra/db.js';
import { problemDetails } from '../middleware/orgContext.js';

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
}
