#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$ROOT_DIR/app"
SLIDES_DIR="$ROOT_DIR/slides"
COMPOSE_FILE="$APP_DIR/docker-compose.yml"
AZURE_COMPOSE_FILE="$APP_DIR/docker-compose.azure.yml"
AZURE_ENV_FILE="$APP_DIR/.env.azure.local"
CONCURRENTLY="$APP_DIR/node_modules/.bin/concurrently"

COMPOSE_ARGS=(-f "$COMPOSE_FILE")
if [[ -f "$AZURE_ENV_FILE" ]]; then
  COMPOSE_ARGS=(
    --env-file "$AZURE_ENV_FILE"
    -f "$COMPOSE_FILE"
    -f "$AZURE_COMPOSE_FILE"
  )
fi

RUNNER_PID=""
OBSERVABILITY_WAS_RUNNING=false
OBSERVABILITY_STARTED=false

cleanup() {
  local exit_code=$?
  trap - EXIT INT TERM
  set +e

  if [[ -n "$RUNNER_PID" ]]; then
    kill -TERM "$RUNNER_PID" 2>/dev/null
    wait "$RUNNER_PID" 2>/dev/null
  fi

  if [[ "$OBSERVABILITY_STARTED" == true ]]; then
    echo
    echo "Stopping Jaeger and the OpenTelemetry Collector..."
    docker compose "${COMPOSE_ARGS[@]}" down
  fi

  exit "$exit_code"
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_available_port() {
  local port=$1
  local owner

  owner="$(lsof -nP -iTCP:"$port" -sTCP:LISTEN 2>/dev/null | sed -n '2p' || true)"
  if [[ -n "$owner" ]]; then
    echo "Port $port is already in use:" >&2
    echo "  $owner" >&2
    echo "Stop the existing process and run this script again." >&2
    exit 1
  fi
}

require_command docker
require_command npm
require_command lsof

if [[ ! -x "$CONCURRENTLY" ]]; then
  echo "Application dependencies are missing. Run: cd app && npm install" >&2
  exit 1
fi

if [[ ! -x "$SLIDES_DIR/node_modules/.bin/vite" ]]; then
  echo "Slide dependencies are missing. Run: cd slides && npm install" >&2
  exit 1
fi

for port in 3000 3001 5173 5174; do
  require_available_port "$port"
done

running_services="$(docker compose "${COMPOSE_ARGS[@]}" ps --status running --services 2>/dev/null || true)"
if grep -qx "jaeger" <<<"$running_services" && grep -qx "collector" <<<"$running_services"; then
  OBSERVABILITY_WAS_RUNNING=true
fi

echo "Starting Jaeger and the OpenTelemetry Collector..."
docker compose "${COMPOSE_ARGS[@]}" up -d
if [[ "$OBSERVABILITY_WAS_RUNNING" == false ]]; then
  OBSERVABILITY_STARTED=true
fi

echo
echo "Project X demo URLs"
echo "  Slides:       http://localhost:5173"
echo "  V1 frontend:  http://localhost:5174"
echo "  V1 API:       http://localhost:3001/api/events"
echo "  V2 app:       http://localhost:3000"
echo "  Jaeger:       http://localhost:16686"
echo
echo "Press Ctrl+C to stop the development servers."
echo

"$CONCURRENTLY" \
  --kill-others-on-fail \
  --names "v2,v1,slides" \
  --prefix-colors "green,yellow,blue" \
  "npm --prefix \"$APP_DIR\" run dev" \
  "VITE_PORT=5174 SIMULATED_DB_LATENCY_MS=13 npm --prefix \"$APP_DIR\" run dev -w v1-vite" \
  "npm --prefix \"$SLIDES_DIR\" run dev -- --port 5173 --strictPort" &
RUNNER_PID=$!

wait "$RUNNER_PID"
