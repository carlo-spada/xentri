FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache git
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
# Build the specific package
# Generate Prisma Client (explicit to ensure .prisma/client exists in image)
RUN pnpm --filter @xentri/core-api db:generate

# Build dependencies (ts-schema) and the package
RUN pnpm --filter @xentri/core-api... build
# Deploy the package and its prod dependencies to a separate directory
RUN pnpm --filter @xentri/core-api deploy --prod --legacy /prod/core-api

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy the deployed application
COPY --from=builder /prod/core-api /app

# Expose port (default 3000)
EXPOSE 3000

CMD ["node", "dist/server.js"]
