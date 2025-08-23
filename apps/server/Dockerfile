FROM node:22.14-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.6.3 --activate
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Pruner stage - extract subset of monorepo
FROM base AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune @acme/server --docker

# Dependencies stage - install all deps
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/full/packages/db/prisma ./packages/db/prisma

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Builder stage - build the project
FROM deps AS builder
WORKDIR /app

COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

# Build the project
RUN pnpm turbo build --filter=@acme/server

# Remove dev dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm prune --prod

# Runner stage - minimal production image
FROM node:22.14-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

ENV NODE_ENV=production

# Copy the pruned monorepo with production dependencies
COPY --from=builder --chown=nodejs:nodejs /app .

# Switch to non-root user
USER nodejs

# Expose the port the app runs on
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start the server
CMD ["node", "apps/server/dist/index.cjs"]
