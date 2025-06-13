# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Install dependencies only, leveraging cache and bind mounts for speed and determinism
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts

# Copy the rest of the application source code
COPY --link src/api/api.csproj ./

# Build the Next.js app (TypeScript compilation, static export)
RUN --mount=type=cache,target=/root/.npm \
    npm run build

# Remove dev dependencies for production
RUN npm prune --production

# --- Production image ---
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy only the necessary files from the build stage
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/next.config.js ./
COPY --from=base /app/app ./app
COPY --from=base /app/components ./components
COPY --from=base /app/hooks ./hooks
COPY --from=base /app/lib ./lib
COPY --from=base /app/types ./types
COPY --from=base /app/globals.css ./globals.css

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER appuser

EXPOSE 3000
CMD ["npx", "next", "start"]
