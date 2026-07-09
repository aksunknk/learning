#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="/usr/local/cargo/bin:/exec-daemon:${PATH:-/usr/bin:/bin}"

PASS=0
FAIL=0

check() {
  local name="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    echo "[OK] ${name}"
    PASS=$((PASS + 1))
  else
    echo "[NG] ${name}"
    FAIL=$((FAIL + 1))
  fi
}

echo "==> Lemma Desktop 動作検証"
echo ""

check "Node.js" node --version
check "Rust" rustc --version
check "npm 依存関係" test -d "${PROJECT_DIR}/node_modules"
check "Vite (port 1420)" curl -sf -o /dev/null http://localhost:1420/
check "VNC (port 5901)" pgrep -f Xtigervnc
check "noVNC (port 26058)" pgrep -f "websockify.*26058"
check "lemma-desktop プロセス" pgrep -f "target/debug/lemma-desktop"

if pgrep -f "target/debug/lemma-desktop" >/dev/null; then
  if DISPLAY="${DISPLAY:-:1}" xwininfo -root -tree -display "${DISPLAY}" 2>/dev/null | grep -q "Lemma Desktop"; then
    echo "[OK] Lemma Desktop ウィンドウ"
    PASS=$((PASS + 1))
  else
    echo "[NG] Lemma Desktop ウィンドウ"
    FAIL=$((FAIL + 1))
  fi
fi

echo ""
echo "結果: ${PASS} OK / ${FAIL} NG"

if [[ "${FAIL}" -gt 0 ]]; then
  echo ""
  echo "未起動の場合: ${PROJECT_DIR}/scripts/start-dev.sh"
  echo "ブラウザ確認: http://localhost:1420"
  exit 1
fi
