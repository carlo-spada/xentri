FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache git
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
# Install all deps (lockfile at repo root)
RUN pnpm install --frozen-lockfile
# Generate Prisma client explicitly
RUN pnpm --filter @xentri/core-api db:generate
# Build packages (ts-schema, etc.) and core-api
RUN pnpm --filter @xentri/core-api... build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy built service files and node_modules (includes .prisma client)
COPY --from=builder /app/services/core-api /app
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 3000
CMD ["node", "dist/server.js"]
