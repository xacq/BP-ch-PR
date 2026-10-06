#!/usr/bin/env bash
# Deploy Beauty Palast to the production VPS from this machine.
# Usage: ./deploy/scripts/deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SSH_HOST="${SSH_HOST:-ubuntu@91.92.141.198}"
SSH_KEY="${SSH_KEY:-${HOME}/.ssh/itingineering}"
APP_DIR="${APP_DIR:-/opt/beautypalast}"

ssh_opts=(-o BatchMode=yes -o IdentitiesOnly=yes -o ConnectTimeout=15)
if [[ -f "${SSH_KEY}" ]]; then
  ssh_opts+=(-i "${SSH_KEY}")
fi

ssh_cmd() { ssh "${ssh_opts[@]}" "${SSH_HOST}" "$@"; }

echo "[deploy] host=${SSH_HOST} dir=${APP_DIR}"

if ! ssh_cmd 'echo ok' >/dev/null; then
  echo "[deploy] No hay SSH. Carga la clave: ssh-add ${SSH_KEY}" >&2
  exit 1
fi

echo "[deploy] Preparando ${APP_DIR}..."
ssh_cmd "sudo mkdir -p '${APP_DIR}' && sudo chown ubuntu:ubuntu '${APP_DIR}'"

echo "[deploy] Sincronizando código..."
rsync -az --delete \
  -e "ssh ${ssh_opts[*]}" \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude docker/mysql_data \
  --exclude docker/mysql_data.macos.bak \
  --exclude docker/mysql-backup \
  --exclude 'docker/uploads/*' \
  --exclude .env \
  --exclude deploy/env/.env.prod \
  --exclude .agents \
  --exclude .cursor \
  --exclude .claude \
  "${ROOT}/" "${SSH_HOST}:${APP_DIR}/"

echo "[deploy] Instalando y levantando servicios en el VPS..."
ssh_cmd "sudo bash '${APP_DIR}/deploy/scripts/remote-setup.sh'"

echo "[deploy] Hecho."
