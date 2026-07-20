#!/bin/sh
# Runs automatically as part of the official nginx image's /docker-entrypoint.d/ chain.
# Regenerates env-config.js from container environment variables so the same built
# image can be deployed against different backends without a rebuild.
set -eu

TARGET_FILE="/usr/share/nginx/html/env-config.js"

cat > "$TARGET_FILE" <<EOF
window.__APP_CONFIG__ = {
  API_BASE_URL: "${API_BASE_URL:-}",
  APP_ORIGIN: "${APP_ORIGIN:-}"
};
EOF

echo "shrimpista: wrote runtime config to $TARGET_FILE (API_BASE_URL=${API_BASE_URL:-<unset, using build-time default>})"
