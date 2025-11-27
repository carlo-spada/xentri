export type UserRole = 'owner' | 'admin' | 'member' | 'viewer' | string;

/**
 * Legacy user claims type (for backwards compatibility)
 * @deprecated Use ClerkJWTClaims for Clerk-based authentication
 */
export type UserClaims = {
  sub: string;
  email?: string;
  org_id: string;
  role: UserRole;
  iss: string;
  aud?: string;
  exp: number;
  iat?: number;
};

export type ServiceTokenClaims = {
  sub: string;
  iss: string;
  aud: string | string[];
  org_id: string;
  scope: string[];
  trace_id?: string;
  exp: number;
  iat?: number;
};

// ===================
// Clerk JWT Claims (Story 1.3)
// ===================

/**
 * Clerk organization role.
 * - 'org:admin' - Full org management access
 * - 'org:member' - Standard member access
 */
export type ClerkOrgRole = 'org:admin' | 'org:member';

/**
 * Clerk JWT claims structure.
 *
 * These claims are included in the JWT when a user has an active organization.
 * Configure via Clerk Dashboard → JWT Templates.
 *
 * @see https://clerk.com/docs/backend-requests/making/jwt-templates
 */
export interface ClerkJWTClaims {
  /** Clerk user ID (e.g., 'user_2abc123...') */
  sub: string;

  /** User's primary email address */
  email: string;

  /** Active organization ID (present when org selected) */
  org_id?: string;

  /** Role in active organization */
  org_role?: ClerkOrgRole;

  /** Fine-grained permissions in active organization */
  org_permissions?: string[];

  /** Organization slug (if configured in JWT template) */
  org_slug?: string;

  /** Token issuer (Clerk instance URL) */
  iss: string;

  /** Token audience */
  aud?: string;

  /** Token issued at (Unix timestamp) */
  iat: number;

  /** Token expiration (Unix timestamp) */
  exp: number;

  /** Not before (Unix timestamp) */
  nbf?: number;
}

/**
 * Maps Clerk org role to internal UserRole.
 *
 * Clerk uses 'org:admin' and 'org:member' by default.
 * This maps to our internal role system.
 */
export function clerkRoleToUserRole(clerkRole: ClerkOrgRole | undefined): UserRole {
  if (!clerkRole) return 'member';

  switch (clerkRole) {
    case 'org:admin':
      return 'admin';
    case 'org:member':
      return 'member';
    default:
      return 'member';
  }
}

/**
 * Type guard for checking if claims have an active organization.
 */
export function hasActiveOrg(
  claims: ClerkJWTClaims
): claims is ClerkJWTClaims & { org_id: string; org_role: ClerkOrgRole } {
  return typeof claims.org_id === 'string' && claims.org_id.length > 0;
}
