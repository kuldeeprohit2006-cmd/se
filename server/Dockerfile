# ==========================================
# MediGuard Backend Production Dockerfile
# ==========================================
FROM node:20-alpine AS base

# Install dumb-init for proper signal forwarding & PID 1 handling
RUN apk add --no-cache dumb-init

WORKDIR /usr/src/app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Run as non-root user for container security
USER node

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/ || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
