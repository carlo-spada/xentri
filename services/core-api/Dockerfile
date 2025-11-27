FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache git
RUN corepack enable

FROM base AS builder
WORKDIR /app

# Copy workspace manifests (only those that exist)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
# Copy shared package needed for core-api build
COPY packages/ts-schema packages/ts-schema
# Copy core-api source
COPY services/core-api services/core-api

# Install deps scoped to core-api and its workspace deps (full, no prod prune)
RUN pnpm install --filter @xentri/core-api... --frozen-lockfile
# Build shared package
RUN pnpm --filter @xentri/ts-schema build

WORKDIR /app/services/core-api
# Generate Prisma client
RUN pnpm db:generate
# Build core-api
RUN pnpm build
RUN node -e "require('fastify'); require('@prisma/client'); console.log('deps ok')"
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy built artifacts and deps
COPY --from=builder /app/services/core-api/dist ./dist
COPY --from=builder /app/services/core-api/node_modules ./node_modules
COPY --from=builder /app/services/core-api/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/server.js"]
