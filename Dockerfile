# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.3.0
FROM node:20.19.0-slim AS base

LABEL fly_launch_runtime="NodeJS"

# NodeJS app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install node modules
COPY --link package.json package-lock.json ./
RUN npm install --production=false --legacy-peer-deps

# Copy application code
COPY --link . .

ARG PUBLIC_BASE_URL
ENV PUBLIC_BASE_URL=$PUBLIC_BASE_URL

ARG PUBLIC_REST_API_URL
ENV PUBLIC_REST_API_URL=$PUBLIC_REST_API_URL

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev --legacy-peer-deps

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
CMD [ "npm", "run", "start" ]
