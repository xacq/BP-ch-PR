#!/usr/bin/env bash
# Copy CMS database + uploaded files from this machine (hodor) to production.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SSH_HOST="${SSH_HOST:-ubuntu@91.92.141.198}"
SSH_KEY="${SSH_KEY:-${HOME}/.ssh/itingineering}"
APP_DIR="${APP_DIR:-/opt/beautypalast}"
SITE_URL="${SITE_URL:-https://beauty-palast-visp.ch}"

ssh_opts=(-o BatchMode=yes -o IdentitiesOnly=yes -o ConnectTimeout=15)
if [[ -f "${SSH_KEY}" ]]; then
  ssh_opts+=(-i "${SSH_KEY}")
fi
ssh_cmd() { ssh "${ssh_opts[@]}" "${SSH_HOST}" "$@"; }

cd "${ROOT}"

if [[ ! -f .env ]]; then
  echo "[sync] Missing ${ROOT}/.env" >&2
  exit 1
fi
# shellcheck disable=SC1091
set -a
source .env
set +a

echo "[sync] Dumping local MySQL..."
dump="$(mktemp /tmp/beautypalast-XXXXXX.sql)"
trap 'rm -f "${dump}"' EXIT
docker exec beautypalast-db mysqldump \
  -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" \
  --single-transaction --add-drop-table --no-tablespaces \
  "${MYSQL_DATABASE}" > "${dump}"

echo "[sync] Copying dump..."
rsync -az -e "ssh ${ssh_opts[*]}" "${dump}" "${SSH_HOST}:${APP_DIR}/docker/beautypalast-hodor.sql"

echo "[sync] Copying uploads..."
ssh_cmd "mkdir -p '${APP_DIR}/docker/uploads'"
rsync -az --delete -e "ssh ${ssh_opts[*]}" \
  --exclude .gitkeep \
  "${ROOT}/docker/uploads/" "${SSH_HOST}:${APP_DIR}/docker/uploads/"

echo "[sync] Restoring on production..."
ssh_cmd "set -euo pipefail
  cd '${APP_DIR}'
  sudo bash -c '
    set -a
    source deploy/env/.env.prod
    set +a
    docker compose --env-file deploy/env/.env.prod -f docker-compose.prod.yml stop app
    docker compose --env-file deploy/env/.env.prod -f docker-compose.prod.yml exec -T db \\
      mysql -u\"\$MYSQL_USER\" -p\"\$MYSQL_PASSWORD\" \"\$MYSQL_DATABASE\" < docker/beautypalast-hodor.sql
    docker compose --env-file deploy/env/.env.prod -f docker-compose.prod.yml exec -T db \\
      mysql -u\"\$MYSQL_USER\" -p\"\$MYSQL_PASSWORD\" \"\$MYSQL_DATABASE\" \\
      -e \"UPDATE SeoSettings SET siteUrl=\\\"${SITE_URL}\\\" WHERE id=1;\"
    rm -f docker/beautypalast-hodor.sql
    docker compose --env-file deploy/env/.env.prod -f docker-compose.prod.yml start app
  '
"
echo "[sync] Contenido de hodor restaurado en prod. siteUrl=${SITE_URL}"
