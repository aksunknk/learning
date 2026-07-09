#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="/usr/local/cargo/bin:/exec-daemon:${PATH:-/usr/bin:/bin}"
export DISPLAY="${DISPLAY:-:1}"

echo "==> Lemma Desktop VM セットアップ"
echo "    プロジェクト: ${PROJECT_DIR}"

if command -v apt-get >/dev/null 2>&1; then
  echo "==> システムパッケージ確認"
  sudo apt-get update -qq
  sudo apt-get install -y -qq \
    build-essential curl git pkg-config \
    libwebkit2gtk-4.1-dev libgtk-3-dev \
    libayatana-appindicator3-dev librsvg2-dev patchelf \
    tigervnc-standalone-server novnc websockify \
    xdotool 2>/dev/null || true
fi

if ! command -v rustc >/dev/null 2>&1; then
  echo "==> Rust インストール"
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  source "$HOME/.cargo/env" 2>/dev/null || true
fi

rustup default stable 2>/dev/null || true
echo "    Rust: $(rustc --version)"
echo "    Node: $(node --version)"
echo "    npm:  $(npm --version)"

echo "==> npm install"
cd "${PROJECT_DIR}"
npm install

echo "==> フロントエンドビルド検証"
npm run build

echo "==> Rust コンパイル検証"
cd "${PROJECT_DIR}/src-tauri"
cargo check

echo "==> セットアップ完了"
