FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN apk add --no-cache git
RUN corepack enable

FROM base AS builder
WORKDIR /app

# Copy workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
# Copy shared package needed for core-api build
COPY packages/ts-schema packages/ts-schema
# Copy core-api source
COPY services/core-api services/core-api

# Install ALL deps (dev + prod) for building
RUN pnpm install --filter @xentri/core-api... --frozen-lockfile

# Build shared package first
RUN pnpm --filter @xentri/ts-schema build

# Generate Prisma client and build core-api
WORKDIR /app/services/core-api
RUN pnpm db:generate
RUN pnpm build

# Go back to workspace root for pnpm deploy
WORKDIR /app

# Use pnpm deploy to create a self-contained deployment directory
# This MUST be run from workspace root
RUN pnpm --filter @xentri/core-api deploy --prod /app/deployed

# Copy the built dist into the deployed directory
RUN cp -r /app/services/core-api/dist /app/deployed/dist

# Verify deps are present in deployed directory
RUN cd /app/deployed && node -e "require('fastify'); require('@prisma/client'); console.log('✓ Build deps verified')"

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy the complete deployed package (node_modules + package.json + dist)
COPY --from=builder /app/deployed ./

# Debug: show what's in the directory
RUN ls -la && ls -la node_modules | head -20

# Final verification that deps load correctly
RUN node -e "require('fastify'); require('@prisma/client'); console.log('✓ Runner deps verified')"

EXPOSE 3000
CMD ["node", "dist/server.js"]
