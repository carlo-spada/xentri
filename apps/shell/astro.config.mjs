import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    clerk({
      // Clerk configuration
      // Keys are loaded from environment variables:
      // PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY
      afterSignInUrl: '/',
      afterSignUpUrl: '/',
      signInUrl: '/sign-in',
      signUpUrl: '/sign-up',
    }),
  ],
  server: {
    port: 4321,
  },
  vite: {
    ssr: {
      noExternal: ['@xentri/ui'],
    },
  },
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  // View Transitions for smooth client-side navigation
  // See: https://docs.astro.build/en/guides/view-transitions/
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
