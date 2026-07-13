#!/bin/sh
set -u

THETA_PID=""

shutdown() {
  if [ -n "$THETA_PID" ]; then
    kill "$THETA_PID" 2>/dev/null || true
  fi
}

trap shutdown INT TERM EXIT

if [ "${OPTIONS_DATA_PROVIDER:-}" = "thetadata" ] && [ -n "${THETADATA_API_KEY:-}" ]; then
  echo "Starting Theta Terminal v3 on 127.0.0.1:25503..."
  cd /opt/thetadata || exit 1
  java -jar ThetaTerminalv3.jar > /tmp/thetadata-terminal.log 2>&1 &
  THETA_PID=$!
  cd /app || exit 1

  THETA_READY=0
  ATTEMPT=0
  while [ "$ATTEMPT" -lt 30 ]; do
    if curl -fsS --max-time 3 \
      "http://127.0.0.1:25503/v3/option/list/expirations?symbol=AAPL&format=json" \
      >/dev/null 2>&1; then
      THETA_READY=1
      break
    fi
    if ! kill -0 "$THETA_PID" 2>/dev/null; then
      echo "Theta Terminal exited during startup. See /tmp/thetadata-terminal.log." >&2
      break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    sleep 2
  done

  if [ "$THETA_READY" -eq 1 ]; then
    echo "Theta Terminal is ready."
  else
    echo "Theta Terminal is unavailable; Gistify will continue with degraded/fallback data." >&2
  fi
fi

node dist/index.js &
NODE_PID=$!
wait "$NODE_PID"
NODE_STATUS=$?
shutdown
exit "$NODE_STATUS"
