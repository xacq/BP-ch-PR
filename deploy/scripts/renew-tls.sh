#!/usr/bin/env bash
# Renueva el certificado Let's Encrypt y recarga Nginx.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="${ENV_FILE:-${ROOT}/deploy/env/.env.prod}"
COMPOSE_FILE="${COMPOSE_FILE:-${ROOT}/docker-compose.prod.yml}"

sudo docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" --profile tls run --rm --no-deps certbot renew --webroot -w /var/www/certbot --quiet
sudo docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T nginx nginx -s reload
