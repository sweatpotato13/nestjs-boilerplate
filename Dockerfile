# syntax=docker/dockerfile:1

### BASE
ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-alpine AS base
LABEL maintainer="Cute_Wisp <sweatpotato13@gmail.com>"
# Prisma query engine needs OpenSSL on Alpine
RUN apk add --no-cache openssl
WORKDIR /app

### BUILD
FROM base AS builder
# Use the pnpm version pinned by `packageManager` in package.json
RUN npm install --global corepack@0.36.0 && corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma:generate && pnpm build && pnpm prune --prod --ignore-scripts

### RELEASE
FROM base AS production
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/tsconfig.json /app/tsconfig-paths-bootstrap.js ./
# Winston writes to ./logs
RUN mkdir logs && chown node:node logs
USER node
EXPOSE 8000
CMD ["node", "-r", "./tsconfig-paths-bootstrap.js", "dist/main"]
