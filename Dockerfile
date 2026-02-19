# ========== Stage 1: Build Angular ==========
FROM node:20-alpine AS angular-builder
WORKDIR /build

COPY package.json package-lock.json* ./
RUN npm ci

COPY angular.json tsconfig.json tsconfig.app.json ./
COPY src ./src
RUN npm run build:prod

# ========== Stage 2: Server + static frontend ==========
FROM node:20-alpine
WORKDIR /app

COPY server/package.json server/package-lock.json* ./
RUN npm ci --omit=dev

COPY server/server.js ./
COPY --from=angular-builder /build/dist/portofolio ./public

# CapRover setează PORT; implicit 3472 pentru local
ENV PORT=3472
EXPOSE 3472

CMD ["node", "server.js"]
