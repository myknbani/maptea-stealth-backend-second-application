# Stage 1: Install all dependencies
FROM node:24.13-alpine AS deps

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .

# Stage 2: Build the app
FROM node:24.13-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# Stage 3: Prune dev dependencies
FROM node:24.13-alpine AS prune

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

COPY package.json pnpm-lock.yaml ./

# Husky should not run as we have no more dev dependencies
RUN pnpm install --prod --frozen-lockfile --ignore-scripts 

# Stage 4: Production image with only prod deps and built code
FROM node:24.13-alpine AS prod

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

COPY --from=prune /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json .

EXPOSE 3001

CMD ["pnpm", "start:prod"]
