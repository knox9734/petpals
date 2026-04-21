#!/usr/bin/env bash
set -euxo pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y docker.io docker-compose-plugin ufw

systemctl enable docker
systemctl start docker

mkdir -p /opt/reverse-proxy

cat >/opt/reverse-proxy/Caddyfile <<'CADDYFILE'
${backend_fqdn} {
	encode gzip
	respond /_infra-health "ok" 200
	reverse_proxy host.docker.internal:8000
}
CADDYFILE

cat >/opt/reverse-proxy/docker-compose.yml <<'COMPOSE'
services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    extra_hosts:
      - "host.docker.internal:host-gateway"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config

volumes:
  caddy_data:
  caddy_config:
COMPOSE

docker compose -f /opt/reverse-proxy/docker-compose.yml up -d

mkdir -p /opt/django-app
cat >/opt/django-app/README.txt <<'README'
Deploy your Django app here and run it on host port 8000.
Caddy is already running and reverse proxies the API domain to 127.0.0.1:8000 via host.docker.internal.
README
