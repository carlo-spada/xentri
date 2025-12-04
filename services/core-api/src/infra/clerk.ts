import { clerkClient, createClerkClient } from '@clerk/fastify'

/**
 * Clerk Backend API client for server-side operations.
 *
 * Used for:
 * - Creating organizations on user signup (webhook handler)
 * - Verifying user org membership for x-org-id header validation
 * - Fetching user/org details for API responses
 *
 * Requires CLERK_SECRET_KEY environment variable.
 */
export function getClerkClient() {
  const secretKey = process.env.CLERK_SECRET_KEY

  if (!secretKey) {
    throw new Error(
      'CLERK_SECRET_KEY environment variable is required. ' +
        'Get it from https://dashboard.clerk.com → Your App → API Keys'
    )
  }

  return createClerkClient({ secretKey })
}

// Re-export clerkClient for Fastify plugin usage
export { clerkClient }
