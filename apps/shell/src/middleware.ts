import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
]);

export const onRequest = clerkMiddleware((auth, context) => {
  // If the route is not public and user is not signed in, redirect to sign-in
  if (!isPublicRoute(context.request) && !auth().userId) {
    return auth().redirectToSignIn();
  }
});
