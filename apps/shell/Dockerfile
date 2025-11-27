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
# Build dependencies and the package
RUN pnpm --filter @xentri/shell... build
# Deploy the package and its prod dependencies to a separate directory
RUN pnpm --filter @xentri/shell deploy --prod --legacy /prod/shell

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Copy the deployed application
COPY --from=builder /prod/shell /app

# Expose port
EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]
