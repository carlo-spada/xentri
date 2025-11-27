import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Fastify from 'fastify';
import { clerkPlugin } from '@clerk/fastify';
import { clerkAuthMiddleware, requireOrgContext, optionalClerkAuth } from './clerkAuth.js';

// Mock Clerk's getAuth function
vi.mock('@clerk/fastify', async () => {
  const actual = await vi.importActual('@clerk/fastify');
  return {
    ...actual,
    getAuth: vi.fn(),
    clerkPlugin: vi.fn().mockImplementation(async () => {}),
    clerkClient: {
      users: {
        getUser: vi.fn(),
        getOrganizationMembershipList: vi.fn(),
      },
      organizations: {
        getOrganization: vi.fn(),
      },
    },
  };
});

import { getAuth } from '@clerk/fastify';

describe('Clerk Auth Middleware', () => {
  let app: ReturnType<typeof Fastify>;

  beforeEach(async () => {
    app = Fastify();

    // Register test routes
    app.get('/protected', { preHandler: [clerkAuthMiddleware] }, async () => {
      return { success: true };
    });

    app.get('/with-org', { preHandler: [clerkAuthMiddleware, requireOrgContext] }, async () => {
      return { success: true };
    });

    app.get('/optional', { preHandler: [optionalClerkAuth] }, async (request) => {
      return { userId: request.clerkUserId || null };
    });

    await app.ready();
  });

  afterEach(async () => {
    await app.close();
    vi.clearAllMocks();
  });

  describe('clerkAuthMiddleware', () => {
    it('should return 401 when no session', async () => {
      vi.mocked(getAuth).mockReturnValue({
        userId: null,
        sessionId: null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        getToken: vi.fn(),
        has: vi.fn(),
        debug: vi.fn(),
      } as any);

      const response = await app.inject({
        method: 'GET',
        url: '/protected',
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.type).toBe('https://xentri.app/errors/unauthorized');
      expect(body.title).toBe('Unauthorized');
    });

    it('should allow request with valid session', async () => {
      vi.mocked(getAuth).mockReturnValue({
        userId: 'user_123',
        sessionId: 'sess_123',
        orgId: 'org_123',
        orgRole: 'org:admin',
        orgSlug: 'test-org',
        getToken: vi.fn(),
        has: vi.fn(),
        debug: vi.fn(),
      } as any);

      const response = await app.inject({
        method: 'GET',
        url: '/protected',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({ success: true });
    });
  });

  describe('requireOrgContext', () => {
    it('should return 403 when no org context', async () => {
      vi.mocked(getAuth).mockReturnValue({
        userId: 'user_123',
        sessionId: 'sess_123',
        orgId: null,
        orgRole: null,
        orgSlug: null,
        getToken: vi.fn(),
        has: vi.fn(),
        debug: vi.fn(),
      } as any);

      const response = await app.inject({
        method: 'GET',
        url: '/with-org',
      });

      expect(response.statusCode).toBe(403);
      const body = JSON.parse(response.body);
      expect(body.type).toBe('https://xentri.app/errors/forbidden');
      expect(body.detail).toContain('No active organization');
    });

    it('should allow request with org context', async () => {
      vi.mocked(getAuth).mockReturnValue({
        userId: 'user_123',
        sessionId: 'sess_123',
        orgId: 'org_123',
        orgRole: 'org:admin',
        orgSlug: 'test-org',
        getToken: vi.fn(),
        has: vi.fn(),
        debug: vi.fn(),
      } as any);

      const response = await app.inject({
        method: 'GET',
        url: '/with-org',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({ success: true });
    });
  });

  describe('optionalClerkAuth', () => {
    it('should allow unauthenticated requests', async () => {
      vi.mocked(getAuth).mockReturnValue({
        userId: null,
        sessionId: null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        getToken: vi.fn(),
        has: vi.fn(),
        debug: vi.fn(),
      } as any);

      const response = await app.inject({
        method: 'GET',
        url: '/optional',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({ userId: null });
    });

    it('should populate user context when authenticated', async () => {
      vi.mocked(getAuth).mockReturnValue({
        userId: 'user_123',
        sessionId: 'sess_123',
        orgId: 'org_123',
        orgRole: 'org:member',
        orgSlug: 'test-org',
        getToken: vi.fn(),
        has: vi.fn(),
        debug: vi.fn(),
      } as any);

      const response = await app.inject({
        method: 'GET',
        url: '/optional',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({ userId: 'user_123' });
    });
  });
});
