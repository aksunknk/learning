#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="/usr/local/cargo/bin:/exec-daemon:${PATH:-/usr/bin:/bin}"
export DISPLAY="${DISPLAY:-:1}"

echo "==> 既存プロセス停止"
lsof -ti :1420 2>/dev/null | xargs -r kill -9 2>/dev/null || true
pkill -f "target/debug/lemma-desktop" 2>/dev/null || true
sleep 1

echo "==> 仮想デスクトップ確認"
"${PROJECT_DIR}/scripts/setup-vnc.sh"

echo "==> Tauri 開発サーバー起動"
cd "${PROJECT_DIR}"
exec npm run tauri dev
