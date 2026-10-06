#!/usr/bin/env bash
# Runs ON the VPS. Idempotent: Docker, swap, secrets, compose, TLS.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "${ROOT}"

ENV_FILE="${ENV_FILE:-${ROOT}/deploy/env/.env.prod}"
COMPOSE_FILE="${COMPOSE_FILE:-${ROOT}/docker-compose.prod.yml}"
DOMAIN_DEFAULT="beauty-palast-visp.ch"

compose() {
  sudo docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" "$@"
}

log() { echo "[beautypalast] $*"; }

ensure_swap() {
  if swapon --show | grep -q .; then
    log "Swap ya existe."
    return
  fi
  log "Creando swap de 2G (el VPS tiene ~2 GB RAM)..."
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  if ! grep -q '^/swapfile ' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
  fi
}

ensure_docker() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    log "Docker ya está instalado."
    return
  fi
  log "Instalando Docker..."
  if ! curl -fsSL https://get.docker.com | sudo sh; then
    log "get.docker.com falló; instalando desde apt..."
    sudo apt-get update -y
    sudo apt-get install -y docker.io docker-compose-v2
  fi
  sudo usermod -aG docker ubuntu || true
}

ensure_firewall() {
  if ! command -v ufw >/dev/null 2>&1; then
    return
  fi
  sudo ufw allow OpenSSH >/dev/null
  sudo ufw allow 80/tcp >/dev/null
  sudo ufw allow 443/tcp >/dev/null
  sudo ufw --force enable >/dev/null
  log "UFW: 22/80/443 abiertos."
}

ensure_env() {
  mkdir -p "$(dirname "${ENV_FILE}")" docker/uploads docker/mysql_data deploy/nginx/conf.d
  if [[ -f "${ENV_FILE}" ]]; then
    log "Usando env existente: ${ENV_FILE}"
    return
  fi
  log "Generando ${ENV_FILE} con secretos nuevos..."
  local mysql_pw root_pw admin_pw session
  mysql_pw="$(openssl rand -hex 18)"
  root_pw="$(openssl rand -hex 24)"
  admin_pw="$(openssl rand -hex 12)"
  session="$(openssl rand -hex 32)"
  cat > "${ENV_FILE}" <<EOF
DOMAIN=${DOMAIN_DEFAULT}
SITE_URL=https://${DOMAIN_DEFAULT}
CERTBOT_EMAIL=webmaster@${DOMAIN_DEFAULT}

MYSQL_DATABASE=beautypalast
MYSQL_USER=beautypalast
MYSQL_PASSWORD=${mysql_pw}
MYSQL_ROOT_PASSWORD=${root_pw}

ADMIN_PASSWORD=${admin_pw}
SESSION_SECRET=${session}
EOF
  chmod 600 "${ENV_FILE}"
  echo
  echo "========== CREDENCIALES CMS (guárdalas) =========="
  echo "Admin URL:  https://${DOMAIN_DEFAULT}/admin"
  echo "Password:   ${admin_pw}"
  echo "=================================================="
  echo
}

load_env() {
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
  DOMAIN="${DOMAIN:-${DOMAIN_DEFAULT}}"
  SITE_URL="${SITE_URL:-https://${DOMAIN}}"
  CERTBOT_EMAIL="${CERTBOT_EMAIL:-webmaster@${DOMAIN}}"
}

render_nginx() {
  local mode="$1"
  local src
  case "${mode}" in
    https) src="${ROOT}/deploy/nginx/https.conf" ;;
    https-www) src="${ROOT}/deploy/nginx/https-www.conf" ;;
    *) src="${ROOT}/deploy/nginx/http.conf" ;;
  esac
  sed "s/__DOMAIN__/${DOMAIN}/g" "${src}" | sudo tee "${ROOT}/deploy/nginx/conf.d/app.conf" >/dev/null
}

public_ip() {
  curl -4 -fsS --max-time 8 https://ifconfig.me/ip 2>/dev/null \
    || curl -4 -fsS --max-time 8 https://api.ipify.org 2>/dev/null \
    || true
}

dns_ips() {
  local name="$1"
  if command -v dig >/dev/null 2>&1; then
    dig +short "${name}" A | grep -E '^[0-9.]+$' | sort -u
  else
    getent ahostsv4 "${name}" 2>/dev/null | awk '{print $1}' | sort -u
  fi
}

dns_aaaa() {
  local name="$1"
  if command -v dig >/dev/null 2>&1; then
    dig +short "${name}" AAAA | grep -E ':' | sort -u
  fi
}

dns_points_here() {
  local name="$1"
  local mine="$2"
  [[ -n "${mine}" ]] || return 1
  dns_ips "${name}" | grep -qx "${mine}"
}

issue_or_renew_tls() {
  local mine="$1"
  local names=()
  local candidate
  for candidate in "${DOMAIN}" "www.${DOMAIN}"; do
    if ! dns_points_here "${candidate}" "${mine}"; then
      log "${candidate}: A record no apunta a ${mine:-este servidor}."
      continue
    fi
    local v6
    v6="$(dns_aaaa "${candidate}" | tr '\n' ' ' | xargs || true)"
    if [[ -n "${v6}" ]]; then
      log "${candidate}: tiene AAAA (${v6}) y este VPS no tiene IPv6."
      log "Let's Encrypt prefiere IPv6 y fallaría. En Hostpoint borra el AAAA de ${candidate}."
      continue
    fi
    names+=("${candidate}")
  done

  if [[ "${#names[@]}" -eq 0 ]]; then
    log "Ningún nombre DNS apunta a ${mine:-este servidor}."
    log "En Hostpoint crea un A record: ${DOMAIN} → ${mine:-91.92.141.198}"
    log "Let's Encrypt se omite hasta que el DNS esté bien."
    return 1
  fi

  local cert_args=()
  local n
  for n in "${names[@]}"; do
    cert_args+=(-d "${n}")
    log "Se pedirá certificado para ${n}"
  done

  log "Pidiendo certificado Let's Encrypt..."
  if ! compose --profile tls run --rm --no-deps certbot certonly \
    --webroot -w /var/www/certbot \
    --email "${CERTBOT_EMAIL}" \
    --agree-tos --no-eff-email --non-interactive --keep \
    --cert-name "${DOMAIN}" \
    "${cert_args[@]}"; then
    log "Certbot falló. Se deja Nginx en HTTP."
    render_nginx http
    compose exec -T nginx nginx -s reload || true
    return 1
  fi

  if [[ "${#names[@]}" -eq 1 && "${names[0]}" == "www.${DOMAIN}" ]]; then
    render_nginx https-www
  else
    render_nginx https
  fi
  if ! compose exec -T nginx nginx -t; then
    log "Nginx no pudo cargar el certificado. Se revierte a HTTP."
    render_nginx http
    compose exec -T nginx nginx -s reload || true
    return 1
  fi
  compose exec -T nginx nginx -s reload
  log "HTTPS activo para: ${names[*]}"
}

ensure_renew_cron() {
  local cron_line="15 3 * * * ${ROOT}/deploy/scripts/renew-tls.sh >> /var/log/beautypalast-tls.log 2>&1"
  if sudo crontab -u ubuntu -l 2>/dev/null | grep -q 'renew-tls.sh'; then
    log "Cron de renovación TLS ya existe."
    return
  fi
  (
    sudo crontab -u ubuntu -l 2>/dev/null || true
    echo "${cron_line}"
  ) | sudo crontab -u ubuntu -
  log "Cron diario de renovación Let's Encrypt instalado."
}

ensure_swap
ensure_docker
ensure_firewall
ensure_env
load_env

if [[ "${TLS_ONLY:-}" == "1" ]]; then
  log "TLS_ONLY=1 — sin rebuild, solo certificado."
else
  render_nginx http
  log "Levantando MySQL + Next.js + Nginx..."
  compose up -d --build db app nginx

  log "Esperando a que la app responda en HTTP..."
  ready=0
  for _ in $(seq 1 90); do
    if curl -fsS --max-time 3 "http://127.0.0.1/" >/dev/null 2>&1; then
      ready=1
      break
    fi
    sleep 3
  done
  if [[ "${ready}" -ne 1 ]]; then
    log "La app no respondió a tiempo. Logs:"
    compose logs --tail 80 app || true
    exit 1
  fi
  log "HTTP OK en este servidor."
fi

mine="$(public_ip)"
log "IP pública detectada: ${mine:-?}"
if issue_or_renew_tls "${mine}"; then
  ensure_renew_cron
fi

log "Deploy listo."
log "Sitio (IP):  http://${mine:-91.92.141.198}/"
log "Sitio (DNS): ${SITE_URL}/  (cuando el A record apunte aquí)"
log "CMS:         ${SITE_URL}/admin"
