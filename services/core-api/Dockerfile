FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
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

# Install deps scoped to core-api and its workspace deps
RUN pnpm install --filter @xentri/core-api... --frozen-lockfile

# Build shared package first
RUN pnpm --filter @xentri/ts-schema build

WORKDIR /app/services/core-api
# Generate Prisma client
RUN pnpm db:generate
# Build core-api
RUN pnpm build

# Use pnpm deploy to create a self-contained deployment directory
# This resolves all symlinks and copies actual deps (not symlinks)
RUN pnpm deploy --filter @xentri/core-api --prod /app/deploy

# Verify deps are present in deploy directory
RUN node -e "process.chdir('/app/deploy'); require('fastify'); require('@prisma/client'); console.log('✓ Runtime deps verified')"

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy the self-contained deployment (includes node_modules with resolved deps)
COPY --from=builder /app/deploy ./

# Copy built dist from builder
COPY --from=builder /app/services/core-api/dist ./dist

# Final verification
RUN node -e "require('fastify'); require('@prisma/client'); console.log('✓ Runner deps verified')"

EXPOSE 3000
CMD ["node", "dist/server.js"]
