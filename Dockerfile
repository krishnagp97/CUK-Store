# -------------------------
# 1. Base image
# -------------------------
FROM node:22-alpine AS base

WORKDIR /app


# -------------------------
# 2. Install dependencies
# -------------------------
FROM base AS deps

COPY package.json package-lock.json ./

RUN npm ci


# -------------------------
# 3. Build application
# -------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js application
RUN --mount=type=secret,id=env \
    sh -c 'set -a && . /run/secrets/env && set +a && npm run build'


# -------------------------
# 4. Production image
# -------------------------
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy standalone Next.js output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]