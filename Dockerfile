# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Build-time defaults (can be overridden with --build-arg).
# These are baked into the bundle as a fallback; the values that actually matter
# at runtime are injected by docker-entrypoint.sh into env-config.js instead.
ARG VITE_API_BASE_URL=http://localhost:5713
ARG VITE_APP_ORIGIN=http://localhost:8081
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_APP_ORIGIN=${VITE_APP_ORIGIN}

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine AS runtime

# Non-root friendly nginx (nginx:alpine already runs worker procs as 'nginx' user;
# we just make sure our own files are owned correctly).
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.d/40-shrimpista-env.sh
RUN chmod +x /docker-entrypoint.d/40-shrimpista-env.sh

ENV API_BASE_URL=""
ENV APP_ORIGIN=""

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/ >/dev/null 2>&1 || exit 1

# nginx's official image already sources every executable script in
# /docker-entrypoint.d/ before starting, so our env-config generator runs automatically.
CMD ["nginx", "-g", "daemon off;"]
